/**
 * SEO Constants and utilities for AI-Agent Guide
 */

export const siteName = "AI-Agent Guide"
export const siteTagline = "Decide • Act • Learn • Repeat"
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
export const defaultOgImage = "/og-image.png"

export const siteDescription = 
  "A curated, editorial feed tracking how AI agents are built, governed, and applied."

/** Category metadata for SEO */
export const categoryMeta: Record<string, { title: string; description: string }> = {
  agents: {
    title: "Agents",
    description: "Tracking developments in autonomous AI systems that take action, from browser-controlling agents to self-improving code systems.",
  },
  policy: {
    title: "Policy",
    description: "How governments and institutions are shaping AI agent governance through regulations, frameworks, and compliance requirements.",
  },
  safety: {
    title: "Safety",
    description: "Research and practices for building reliable, aligned AI agents including multi-agent coordination and safety evaluation.",
  },
  industries: {
    title: "Industries",
    description: "How AI agents are being deployed across sectors including healthcare, education, finance, and manufacturing.",
  },
  infrastructure: {
    title: "Infrastructure",
    description: "The platforms, tools, and cloud services enabling AI agent deployment at enterprise scale.",
  },
}

/**
 * Truncate text to a maximum length, preserving word boundaries
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + "..." : truncated + "..."
}

