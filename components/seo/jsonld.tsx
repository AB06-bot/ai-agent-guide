import { siteName, siteUrl, siteDescription } from "@/lib/seo"

/**
 * Organization JSON-LD schema
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    logo: `${siteUrl}/og-image.png`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * WebSite JSON-LD schema with optional search action
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    // SearchAction stub - can be implemented when search is added
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: `${siteUrl}/search?q={search_term_string}`,
    //   "query-input": "required name=search_term_string",
    // },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Article JSON-LD schema for article pages
 */
export interface ArticleJsonLdProps {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  url: string
  authorName?: string
}

export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
  authorName = siteName,
}: ArticleJsonLdProps) {
  // Resolve relative image URLs to absolute
  const absoluteImage = image.startsWith("http") ? image : `${siteUrl}${image}`

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: absoluteImage,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Combined schema component for homepage
 */
export function HomePageJsonLd() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
    </>
  )
}

