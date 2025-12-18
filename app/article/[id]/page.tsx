import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { ArticleTemplate } from "@/components/article-template"
import { getArticleById, getRelatedArticles, articles } from "@/lib/articles"
import { siteUrl, defaultOgImage, truncateText } from "@/lib/seo"
import { 
  buildArticleJsonLd, 
  buildBreadcrumbJsonLd, 
  buildArticleBreadcrumbs,
  JsonLdScript 
} from "@/lib/schema"
import { use } from "react"

export function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id,
  }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params
  const article = getArticleById(id)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  const description = truncateText(article.summary || article.announcement, 160)
  const ogImage = article.image || defaultOgImage
  const canonicalUrl = `${siteUrl}/article/${id}`

  return {
    title: article.headline,
    description,
    openGraph: {
      type: "article",
      title: article.headline,
      description,
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      section: article.category,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const article = getArticleById(id)

  if (!article) {
    notFound()
  }

  const relatedArticles = getRelatedArticles(id, 4)
  
  // Build JSON-LD schemas
  const articleSchema = buildArticleJsonLd(article, siteUrl)
  const breadcrumbSchema = buildBreadcrumbJsonLd(buildArticleBreadcrumbs(article, siteUrl), siteUrl)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ArticleTemplate article={article} relatedArticles={relatedArticles} />
      
      {/* JSON-LD Structured Data */}
      <JsonLdScript data={articleSchema} />
      <JsonLdScript data={breadcrumbSchema} />
    </div>
  )
}
