import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import slugify from "slugify";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

// ------------------ Config ------------------
const FEEDS = [
    {
      name: "OpenAI",
      url: "https://openai.com/news/rss.xml",
      defaultCategory: "Agents",
      weight: 4
    },
    {
      name: "Google DeepMind",
      url: "https://deepmind.google/blog/rss.xml",
      defaultCategory: "Agents",
      weight: 4
    },
    {
      name: "Anthropic (Google News)",
      url: "https://news.google.com/rss/search?q=site:anthropic.com+anthropic&hl=en-US&gl=US&ceid=US:en",
      defaultCategory: "Safety",
      weight: 2
    },
    {
      name: "Microsoft Research",
      url: "https://www.microsoft.com/en-us/research/feed/",
      defaultCategory: "Infrastructure",
      weight: 3
    },
    {
      name: "NIST AI",
      url: "https://www.nist.gov/news-events/news/rss.xml",
      defaultCategory: "Policy",
      weight: 3
    },
    {
      name: "OECD AI Policy",
      url: "https://oecd.ai/en/rss.xml",
      defaultCategory: "Policy",
      weight: 2
    },
    {
      name: "MIT Technology Review (AI)",
      url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
      defaultCategory: "Industries",
      weight: 1
    }
  ];
  
  
// ------------------ Timeouts ------------------
const FEED_TIMEOUT_MS = 10_000;      // 10s for feed fetch
const OG_TIMEOUT_MS = 8_000;         // 8s for OG image fetch
const READABLE_TIMEOUT_MS = 12_000;  // 12s for readable extraction

// ------------------ Env Flags ------------------
const SKIP_OG = process.env.SKIP_OG === "1";
const SKIP_READABLE = process.env.SKIP_READABLE === "1";
const ONLY_FEED = process.env.ONLY_FEED?.toLowerCase() || null;

if (SKIP_OG) console.log("ℹ SKIP_OG=1 → skipping OG image fetches");
if (SKIP_READABLE) console.log("ℹ SKIP_READABLE=1 → skipping readable text extraction");
if (ONLY_FEED) console.log(`ℹ ONLY_FEED="${process.env.ONLY_FEED}" → filtering feeds`);

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");
const CACHE_DIR = path.join(process.cwd(), "cache");
const SEEN_PATH = path.join(CACHE_DIR, "seen.json");

// limit per run so you don't spam drafts
const MAX_NEW_ITEMS_PER_RUN = 12;

function isHighSignal(item, text = "") {
    const title = (item.title || "").toLowerCase();
    const body = text.toLowerCase();
  
    // kill fluff instantly
    const bad = /(opinion|thoughts|roundup|weekly|newsletter|rumor|leak)/;
    if (bad.test(title)) return false;
  
    // must reference real systems or impact
    const required = /(agent|model|policy|regulation|deployment|infrastructure|evaluation|benchmark|safety|alignment)/;
    if (!required.test(title) && !required.test(body)) return false;
  
    // ensure enough substance
    if (body.length < 800) return false;
  
    return true;
  }
  
// In-memory cache for OG images (avoid refetching same URL in one run)
const ogImageCache = new Map();

async function fetchOgImage(url) {
  // Check cache first
  if (ogImageCache.has(url)) {
    return ogImageCache.get(url);
  }

  // Create AbortController with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OG_TIMEOUT_MS);

  try {
    console.log(`  Fetching OG image: ${url}`);
    const res = await fetch(url, { 
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)"
      },
      signal: controller.signal
    });

    if (!res.ok) {
      clearTimeout(timeoutId);
      ogImageCache.set(url, null);
      return null;
    }
    
    console.log(`  Reading OG response body...`);
    const html = await res.text();
    clearTimeout(timeoutId);

    // Match og:image meta tag (handle both property-first and content-first ordering)
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (!m) {
      ogImageCache.set(url, null);
      return null;
    }

    // Resolve relative URLs
    let imageUrl;
    try {
      imageUrl = new URL(m[1], url).toString();
    } catch {
      imageUrl = m[1];
    }

    ogImageCache.set(url, imageUrl);
    console.log(`  OG image found: ${imageUrl.slice(0, 80)}...`);
    return imageUrl;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === "AbortError") {
      console.warn(`  ⚠ OG image timeout (${OG_TIMEOUT_MS}ms): ${url}`);
    } else {
      console.warn(`  ⚠ OG image error: ${e.message}`);
    }
    ogImageCache.set(url, null);
    return null;
  }
}
  
// ------------------ Helpers ------------------
function ensureDir(p) {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }
  
function loadSeen() {
  try {
    return JSON.parse(fs.readFileSync(SEEN_PATH, "utf-8"));
  } catch {
    return { seen: {} };
  }
}

function saveSeen(db) {
  ensureDir(CACHE_DIR);
  fs.writeFileSync(SEEN_PATH, JSON.stringify(db, null, 2));
}

function safeSlug(input) {
  return slugify(input, { lower: true, strict: true, trim: true }).slice(0, 90);
}

/**
 * Safely extract guid as a string from various RSS feed formats.
 * Some feeds return guid as an object like { _: "id", isPermaLink: "false" }.
 */
function extractGuid(item, fallbackLink) {
  let raw = item.guid;
  
  // If guid is a string, use it directly
  if (typeof raw === "string") {
    return raw.trim();
  }
  
  // If guid is an object, try common property names
  if (raw && typeof raw === "object") {
    const candidate = raw._ || raw["#text"] || raw.value;
    if (typeof candidate === "string") {
      return candidate.trim();
    }
  }
  
  // Fallback chain: item.id → item.link → fallbackLink → ""
  const fallback = item.id || item.link || fallbackLink || "";
  return typeof fallback === "string" ? fallback.trim() : "";
}

function toDateStamp(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return new Date().toISOString().slice(0, 10);
  return dt.toISOString().slice(0, 10);
}

function categorize({ title = "", sourceName = "" }) {
  const t = `${title} ${sourceName}`.toLowerCase();

  // policy/regulatory
  if (/(eu|act|regulation|regulatory|policy|law|executive order|white house|nista|compliance)/.test(t)) return "Policy";

  // safety/alignment
  if (/(safety|alignment|eval|evaluations|red team|misuse|security|guardrail|constitutional|control)/.test(t)) return "Safety";

  // infrastructure
  if (/(nvidia|amd|gpu|cuda|datacenter|data center|inference|training|chips|semiconductor|cloud|aws|azure|gcp|power|energy)/.test(t)) return "Infrastructure";

  // agents/capabilities
  if (/(agent|agents|tool use|tools|function calling|operator|workflow|orchestration|multi-agent|autonomy)/.test(t)) return "Agents";

  // industries (default "impact")
  return "Industries";
}

async function fetchHtml(url) {
  // Create AbortController with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), READABLE_TIMEOUT_MS);

  try {
    console.log(`  Fetching HTML for readable: ${url}`);
    const res = await fetch(url, { 
      redirect: "follow",
      signal: controller.signal
    });

    if (!res.ok) {
      clearTimeout(timeoutId);
      throw new Error(`Fetch failed ${res.status} for ${url}`);
    }
    
    console.log(`  Reading HTML response body...`);
    const html = await res.text();
    clearTimeout(timeoutId);
    return html;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === "AbortError") {
      throw new Error(`Readable timeout (${READABLE_TIMEOUT_MS}ms)`);
    }
    throw e;
  }
}

async function extractReadableText(url) {
  try {
    const html = await fetchHtml(url);
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const text = (article?.textContent || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const title = article?.title?.trim() || "";
    console.log(`  Readable extracted: ${text.length} chars`);
    return { title, text };
  } catch (e) {
    console.warn(`  ⚠ Readable extraction failed: ${e.message}`);
    return { title: "", text: "" };
  }
}

function buildDraftMarkdown({
  category,
  headline,
  sourceName,
  sourceUrl,
  published,
  extractedText,
}) {
  const publishedISO = new Date(published).toISOString();

  return `---
title: "${headline.replace(/"/g, '\\"')}"
category: "${category}"
source: "${sourceName.replace(/"/g, '\\"')}"
source_url: "${sourceUrl}"
published_at: "${publishedISO}"
status: "draft"
---

# ${headline}

<!-- HERO_IMAGE: add an editorial image URL or local path here -->

## WHAT HAPPENED
${extractedText ? summarizeFallback(extractedText) : "_Draft placeholder: add a short summary._"}

## WHY IT MATTERS
- _Draft placeholder_
- _Draft placeholder_
- _Draft placeholder_

## WHAT THIS ENABLES
- _Draft placeholder_
- _Draft placeholder_

## SOURCE
${sourceUrl}
`;
}

// Very basic fallback "summary" so you at least get something usable.
// You'll tighten in Cursor.
function summarizeFallback(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "_Draft placeholder: add a short summary._";

  // take ~2–3 sentences worth
  const sentences = cleaned.split(/(?<=[.!?])\s+/).slice(0, 3);
  return sentences.join(" ");
}

// ------------------ Main ------------------
// Custom parser with feed-level timeout
async function fetchAndParseFeed(feed) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);

  try {
    console.log(`Fetching feed: ${feed.name}`);
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)"
      }
    });

    if (!res.ok) {
      clearTimeout(timeoutId);
      throw new Error(`HTTP ${res.status}`);
    }

    console.log(`Reading feed response: ${feed.name}`);
    const xmlText = await res.text();
    clearTimeout(timeoutId);
    console.log(`Feed fetched: ${feed.name} bytes=${xmlText.length}`);

    console.log(`Parsing feed: ${feed.name}`);
    const parser = new Parser();
    const parsed = await parser.parseString(xmlText);
    return parsed;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === "AbortError") {
      throw new Error(`Feed timeout (${FEED_TIMEOUT_MS}ms)`);
    }
    throw e;
  }
}

async function main() {
  ensureDir(DRAFTS_DIR);
  ensureDir(CACHE_DIR);

  const db = loadSeen();
  let created = 0;

  // Filter feeds if ONLY_FEED is set
  let feedsToProcess = FEEDS;
  if (ONLY_FEED) {
    feedsToProcess = FEEDS.filter(f => f.name.toLowerCase().includes(ONLY_FEED));
    if (feedsToProcess.length === 0) {
      console.warn(`⚠ No feeds match ONLY_FEED="${process.env.ONLY_FEED}"`);
      console.log(`Available feeds: ${FEEDS.map(f => f.name).join(", ")}`);
      return;
    }
    console.log(`Processing ${feedsToProcess.length} feed(s): ${feedsToProcess.map(f => f.name).join(", ")}`);
  }

  for (const feed of feedsToProcess) {
    if (created >= MAX_NEW_ITEMS_PER_RUN) break;

    let parsed;
    try {
      parsed = await fetchAndParseFeed(feed);
    } catch (e) {
      // Non-fatal: log warning and continue to next feed
      console.warn(`⚠ Skipping feed "${feed.name}" - ${e.message || "parse error"}`);
      continue;
    }

    for (const item of parsed.items || []) {
      if (created >= MAX_NEW_ITEMS_PER_RUN) break;

      try {
        const link = item.link?.trim();
        const guid = extractGuid(item, link);
        if (!link || !guid) continue;

        if (db.seen[guid]) continue;

        const published = item.isoDate || item.pubDate || new Date().toISOString();
        const dateStamp = toDateStamp(published);

        const headline = (item.title || "Untitled").trim();
        const category = categorize({ title: headline, sourceName: feed.name }) || feed.defaultCategory;

        console.log(`Processing item: ${headline.slice(0, 60)}...`);

        // Extract readable text (best effort) - or skip if SKIP_READABLE
        let text = "";
        if (SKIP_READABLE) {
          console.log(`  Skipping readable extraction (SKIP_READABLE=1)`);
        } else {
          const result = await extractReadableText(link);
          text = result.text;
        }

        if (!isHighSignal(item, text)) {
          console.log(`  Skipped: not high-signal`);
          continue;
        }

        // Fetch Open Graph image (with caching, resilient to failures) - or skip if SKIP_OG
        let ogImage = "";
        if (SKIP_OG) {
          console.log(`  Skipping OG image fetch (SKIP_OG=1)`);
        } else {
          ogImage = await fetchOgImage(link) || "";
        }

        const filename = `${dateStamp}-${safeSlug(headline)}.md`;
        const outPath = path.join(DRAFTS_DIR, filename);

        // Build draft markdown
        const md = buildDraftMarkdown({
          category,
          headline,
          sourceName: feed.name,
          sourceUrl: link,
          published,
          extractedText: text,
        });

        // Detect if this is an aggregated source (Google News)
        const isAggregated = feed.name.toLowerCase().includes("google news");
        
        // Build frontmatter with aggregation metadata if applicable
        const aggregationFields = isAggregated 
          ? `aggregated: true
aggregationSource: "Google News"
` 
          : "";

        const frontmatter = `---
image: "${ogImage || ""}"
imageType: ${ogImage ? "source" : "fallback"}
status: draft
category: ${category}
source: ${feed.name}
sourceUrl: ${link}
publishedAt: ${published}
${aggregationFields}---

`;

        fs.writeFileSync(outPath, frontmatter + md, "utf-8");

        db.seen[guid] = { savedAt: new Date().toISOString(), file: `content/drafts/${filename}` };

        created++;
        console.log(`Done item: ${headline.slice(0, 60)}... → ${filename}`);
      } catch (itemError) {
        const itemTitle = item.title || item.link || "unknown";
        console.error(`  ⚠ Error processing item "${String(itemTitle).slice(0, 50)}": ${itemError.message}`);
        // Continue to next item
      }
    }
  }

  saveSeen(db);
  console.log(`Done. New drafts: ${created}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
