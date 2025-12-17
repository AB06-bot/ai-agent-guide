import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { getArticlesByCategory } from "@/lib/articles"
import { HeroImage } from "@/components/article-image"
import { siteUrl, categoryMeta, defaultOgImage } from "@/lib/seo"

const category = "industries"
const meta = categoryMeta[category]

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `${siteUrl}/${category}`,
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    images: [defaultOgImage],
  },
  alternates: {
    canonical: `${siteUrl}/${category}`,
  },
}

export default function IndustriesPage() {
  const articles = getArticlesByCategory("Industries")

  const articlesByVertical = articles.reduce(
    (acc, article) => {
      const vertical = article.industryVertical || "Other"
      if (!acc[vertical]) {
        acc[vertical] = []
      }
      acc[vertical].push(article)
      return acc
    },
    {} as Record<string, typeof articles>,
  )

  const verticals = ["Education", "Healthcare", "Finance", "Manufacturing", "Other"]

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Industries</h1>
          <p className="text-lg text-neutral-600">How AI agents are being deployed across sectors and use cases.</p>
        </div>

        {verticals.map((vertical) => {
          const verticalArticles = articlesByVertical[vertical]
          if (!verticalArticles || verticalArticles.length === 0) return null

          return (
            <div key={vertical} className="mb-16">
              <h2 className="text-2xl font-bold mb-8 pb-2 border-b-2 border-black">{vertical}</h2>
              <div className="space-y-8">
                {verticalArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="block group border border-neutral-200 hover:border-black transition-colors"
                  >
                    <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                      <HeroImage src={article.image} alt={article.headline} priority={index === 0} />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-neutral-600 transition-colors">
                        {article.headline}
                      </h3>
                      <p className="text-base text-neutral-600 leading-relaxed">{article.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
