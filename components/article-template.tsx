import Link from "next/link"
import type { Article, ScoredArticle } from "@/lib/articles"
import { RESOURCE_ALLOWED_CATEGORIES } from "@/lib/articles"
import { HeroImage, SmallCardImage } from "@/components/article-image"
import { ArticleResources } from "@/components/article-resources"
import { SmartLink } from "@/components/smart-link"

interface ArticleTemplateProps {
  article: Article
  relatedArticles?: ScoredArticle[]
}

/**
 * Breadcrumb navigation for article pages.
 * Format: Home > Category > Headline
 */
function Breadcrumb({ category, headline }: { category: string; headline: string }) {
  return (
    <nav className="text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-neutral-600 transition-colors">
            Home
          </Link>
        </li>
        <li className="select-none">›</li>
        <li>
          <Link 
            href={`/${category.toLowerCase()}`} 
            className="hover:text-neutral-600 transition-colors"
          >
            {category}
          </Link>
        </li>
        <li className="select-none">›</li>
        <li className="text-neutral-500 truncate max-w-[200px]" title={headline}>
          {headline}
        </li>
      </ol>
    </nav>
  )
}

/**
 * Related articles section for internal linking.
 */
function RelatedSection({ articles }: { articles: ScoredArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section className="pt-8 mt-8 border-t border-neutral-200">
      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">Related</h2>
      <div className="grid grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group block"
          >
            <div className="overflow-hidden mb-3">
              <SmallCardImage src={article.image} alt={article.headline} />
            </div>
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
              {article.category}
            </div>
            <h3 className="text-sm font-bold leading-tight group-hover:text-neutral-600 transition-colors line-clamp-2">
              {article.headline}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

/**
 * Check if resources should be shown for this category
 */
function shouldShowResources(category: string): boolean {
  return RESOURCE_ALLOWED_CATEGORIES.includes(category as typeof RESOURCE_ALLOWED_CATEGORIES[number])
}

export function ArticleTemplate({ article, relatedArticles = [] }: ArticleTemplateProps) {
  return (
    <article className="min-h-screen bg-white text-black">
      {/* Article Header */}
      <header className="border-b border-neutral-300">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb category={article.category} headline={article.headline} />

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">{article.headline}</h1>

          {/* Hero Image */}
          <HeroImage src={article.image} alt={article.headline} priority />
        </div>
      </header>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* WHAT HAPPENED */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">What Happened</h2>
          <div className="prose prose-lg">
            <p className="text-lg leading-relaxed text-neutral-900">{article.announcement}</p>
          </div>
        </section>

        {/* WHAT THIS ENABLES */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">What This Enables</h2>
          <ul className="space-y-3">
            {article.enables.map((item, index) => (
              <li
                key={index}
                className="text-base leading-relaxed text-neutral-900 pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* WHY IT MATTERS */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Why It Matters</h2>
          <div className="prose prose-lg">
            <p className="text-lg leading-relaxed text-neutral-900">{article.matters}</p>
          </div>
        </section>

        {/* SOURCE */}
        <section className="pt-8 border-t border-neutral-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Source</h2>
          <SmartLink
            href={article.source.url}
            ariaLabel={article.source.label}
            className="text-base text-black underline hover:text-neutral-600 transition-colors"
          >
            {article.source.label}
          </SmartLink>
          {/* Subtle aggregation indicator */}
          {article.aggregated && (
            <p className="text-xs text-neutral-400 mt-2">Source coverage</p>
          )}
        </section>

        {/* RESOURCES - Editorial resource links (only for allowed categories) */}
        {article.resources && article.resources.length > 0 && shouldShowResources(article.category) && (
          <ArticleResources resources={article.resources} />
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <RelatedSection articles={relatedArticles} />
        )}
      </div>

      {/* More in Category + Back Links */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <Link
              href={`/${article.category.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
            >
              More in {article.category} →
            </Link>
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-black transition-colors"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
