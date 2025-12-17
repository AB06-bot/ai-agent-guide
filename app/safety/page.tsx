import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { getArticlesByCategory } from "@/lib/articles"
import { HeroImage } from "@/components/article-image"
import { siteUrl, categoryMeta, defaultOgImage } from "@/lib/seo"

const category = "safety"
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

export default function SafetyPage() {
  const articles = getArticlesByCategory("Safety")

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Safety</h1>
          <p className="text-lg text-neutral-600">Research and practices for building reliable, aligned AI agents.</p>
        </div>

        <div className="space-y-8">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="block group border border-neutral-200 hover:border-black transition-colors"
            >
              <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <HeroImage src={article.image} alt={article.headline} priority={index === 0} />
              </div>
              <div className="p-6">
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  {article.category}
                </div>
                <h2 className="text-2xl font-bold mb-3 leading-tight group-hover:text-neutral-600 transition-colors">
                  {article.headline}
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">{article.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
