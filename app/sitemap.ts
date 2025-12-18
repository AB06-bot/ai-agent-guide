export const dynamic = "force-static"
export const revalidate = 0

import type { MetadataRoute } from "next"
import { articles } from "@/lib/articles"
import { dealExplainers } from "@/lib/deals"
import { researchExplainers } from "@/lib/research"
import { siteUrl, categoryMeta } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Homepage
  const homePage: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = Object.keys(categoryMeta).map(
    (category) => ({
      url: `${siteUrl}/${category}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  )

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/article/${article.id}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Deals hub page
  const dealsHubPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/deals`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Deal detail pages
  const dealPages: MetadataRoute.Sitemap = dealExplainers
    .filter((deal) => deal.internalSlug)
    .map((deal) => ({
      url: `${siteUrl}/deals/${deal.internalSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  // Research hub page
  const researchHubPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/research`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Research detail pages
  const researchPages: MetadataRoute.Sitemap = researchExplainers
    .filter((research) => research.internalSlug)
    .map((research) => ({
      url: `${siteUrl}/research/${research.internalSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  return [
    ...homePage,
    ...categoryPages,
    ...articlePages,
    ...dealsHubPage,
    ...dealPages,
    ...researchHubPage,
    ...researchPages,
  ]
}

