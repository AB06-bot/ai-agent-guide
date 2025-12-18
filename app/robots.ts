export const dynamic = "force-static"
export const revalidate = 0

import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/seo"


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/content/drafts/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

