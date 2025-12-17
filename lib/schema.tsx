/**
 * JSON-LD Schema helpers for rich search results
 */

import { siteUrl, siteName } from "@/lib/seo"
import type { Article } from "@/lib/articles"
import type { DealExplainer } from "@/lib/deals"

/**
 * Resolve a path or URL to an absolute URL
 */
export function absoluteUrl(pathOrUrl: string, baseUrl: string = siteUrl): string {
  if (!pathOrUrl) return baseUrl
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }
  // Ensure path starts with /
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${baseUrl}${path}`
}

/**
 * Clean an object by removing undefined/null values
 */
function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>
}

/**
 * Build NewsArticle JSON-LD schema
 */
export function buildArticleJsonLd(article: Article, baseUrl: string = siteUrl) {
  const canonicalUrl = `${baseUrl}/article/${article.id}`
  const imageUrl = article.image ? absoluteUrl(article.image, baseUrl) : undefined

  // Extract source name - article.source is an object { label, url }
  const sourceName = article.source?.label 
    ? article.source.label.replace(/^Read more at\s*/i, "") 
    : siteName
  const sourceUrl = article.source?.url || baseUrl

  const schema = cleanObject({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.summary || article.announcement,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt, // Use same if no updatedAt
    image: imageUrl ? [imageUrl] : undefined,
    author: {
      "@type": "Organization",
      name: sourceName,
      url: sourceUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  })

  return schema
}

/**
 * Build Product JSON-LD schema for deal/credit pages
 */
export function buildDealProductJsonLd(deal: DealExplainer, baseUrl: string = siteUrl) {
  const canonicalUrl = `${baseUrl}/deals/${deal.internalSlug}`
  
  // Extract brand/partner name from title (first word or specific partner)
  const brandName = deal.title.includes("AWS") 
    ? "Amazon Web Services"
    : deal.title.includes("Azure") || deal.title.includes("Microsoft")
      ? "Microsoft"
      : deal.title.split(" ")[0]

  const schema = cleanObject({
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.summary,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(deal.primaryCtaUrl, baseUrl),
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: deal.valueEstimate,
    },
    // Category for cloud credits/startup programs
    category: "Cloud Computing Credits",
  })

  return schema
}

/**
 * FAQ item structure
 */
export interface FaqItem {
  q: string
  a: string
}

/**
 * Build FAQPage JSON-LD schema
 */
export function buildFaqJsonLd(faqItems: FaqItem[], baseUrl: string = siteUrl) {
  if (!faqItems || faqItems.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  }

  return schema
}

/**
 * Breadcrumb item structure
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Build BreadcrumbList JSON-LD schema
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string = siteUrl) {
  if (!items || items.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.url, baseUrl),
    })),
  }

  return schema
}

/**
 * Build article breadcrumbs
 */
export function buildArticleBreadcrumbs(article: Article, baseUrl: string = siteUrl): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: article.category, url: `/category/${article.category.toLowerCase()}` },
    { name: article.headline, url: `/article/${article.id}` },
  ]
}

/**
 * Build deal breadcrumbs
 */
export function buildDealBreadcrumbs(deal: DealExplainer, baseUrl: string = siteUrl): BreadcrumbItem[] {
  return [
    { name: "Home", url: "/" },
    { name: "Deals", url: "/deals" },
    { name: deal.title, url: `/deals/${deal.internalSlug}` },
  ]
}

/**
 * Component helper - renders JSON-LD script tag
 */
export function JsonLdScript({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

