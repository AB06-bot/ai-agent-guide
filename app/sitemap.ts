import type { MetadataRoute } from "next"
import { articles } from "@/lib/articles"
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

  return [...homePage, ...categoryPages, ...articlePages]
}

