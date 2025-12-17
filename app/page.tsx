import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { getAllArticlesSorted, getLatestArticles, ScoredArticle, shouldShowResourcesOnHomepage, getHomepageResources } from "@/lib/articles"
import { FeaturedImage, CardImage, SmallCardImage } from "@/components/article-image"
import { HomePageJsonLd } from "@/components/seo/jsonld"
import { SmartLink } from "@/components/smart-link"
import { homepageDeals, Deal } from "@/lib/deals"
import { homepageResearch, Research } from "@/lib/research"

// Get all articles sorted by score DESC, publishedAt DESC
const sortedArticles = getAllArticlesSorted()

// Featured article: top scored, prefer first-party (non-aggregated) content
const firstPartyArticles = sortedArticles.filter(a => !a.aggregated)
const featuredArticle = firstPartyArticles[0] || sortedArticles[0]

// Latest 5 by score: exclude the featured article, maintain score order
const latestByScore = sortedArticles
  .filter(a => a.id !== featuredArticle.id)
  .slice(0, 5)

// Latest 8 by publishedAt (for freshness rail)
const latestByDate = getLatestArticles(8)

// Track top 3 article IDs for "Top" badge
const top3Ids = new Set(sortedArticles.slice(0, 3).map(a => a.id))

// Format date for display
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Deal Pill Component for "Also Tracking" section
function DealPill({ deal }: { deal: Deal }) {
  const isInternal = deal.landing === "internal" && deal.internalSlug
  const href = isInternal ? `/deals/${deal.internalSlug}` : deal.url

  const pillClasses = "inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"

  return (
    <div>
      <SmartLink 
        href={href} 
        className={pillClasses}
        isAffiliate={deal.isAffiliate}
        ariaLabel={deal.title}
        hideExternalIcon={!isInternal}
      >
        {deal.title}
        {!isInternal && <span className="ml-1.5 text-neutral-400">↗</span>}
      </SmartLink>
      {deal.description && (
        <p className="text-xs text-neutral-500 mt-1.5 ml-1">{deal.description}</p>
      )}
    </div>
  )
}

// Research Pill Component for "Also Tracking" section
function ResearchPill({ research }: { research: Research }) {
  const isInternal = research.landing === "internal" && research.internalSlug
  const href = isInternal ? `/research/${research.internalSlug}` : research.url

  const pillClasses = "inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"

  return (
    <div>
      <SmartLink 
        href={href} 
        className={pillClasses}
        ariaLabel={research.title}
        hideExternalIcon={!isInternal}
      >
        {research.title}
        {!isInternal && <span className="ml-1.5 text-neutral-400">↗</span>}
      </SmartLink>
      {research.description && (
        <p className="text-xs text-neutral-500 mt-1.5 ml-1">{research.description}</p>
      )}
    </div>
  )
}

// Featured Story Component
function FeaturedStory({ article, isTop }: { article: ScoredArticle; isTop?: boolean }) {
  return (
    <section className="border-b border-neutral-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Featured</span>
          {isTop && <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">· Top</span>}
        </div>
        <Link href={`/article/${article.id}`} className="group block">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Left */}
            <div className="order-2 md:order-1">
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                {article.category}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-neutral-600 transition-colors">
                {article.headline}
              </h2>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-4">
                {article.summary}
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span>{formatDate(article.publishedAt)}</span>
                {article.aggregated && <span className="text-neutral-300">· Source coverage</span>}
              </div>
            </div>
            {/* Image Right */}
            <div className="order-1 md:order-2 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
              <FeaturedImage src={article.image} alt={article.headline} priority />
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

// Latest Intelligence Strip Component
function LatestStrip({ articles, topIds }: { articles: ScoredArticle[]; topIds: Set<string> }) {
  return (
    <section className="border-b border-neutral-300 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-6">Latest Intelligence</div>
        {/* Horizontal scroll on mobile, 5-column grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 md:overflow-visible scrollbar-hide">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group flex-shrink-0 w-56 md:w-auto"
            >
              <div className="border border-neutral-200 bg-white hover:border-black transition-colors h-full">
                <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <SmallCardImage src={article.image} alt={article.headline} />
                </div>
                <div className="p-4">
                  {topIds.has(article.id) && (
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1 block">Top</span>
                  )}
                  <h3 className="text-sm font-bold leading-tight mb-2 group-hover:text-neutral-600 transition-colors line-clamp-3">
                    {article.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.aggregated && <span className="text-neutral-300">· Source coverage</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  // Group articles by category for front page display (already score-sorted)
  const agentsArticles = sortedArticles.filter((a) => a.category === "Agents").slice(0, 2)
  const policyArticles = sortedArticles.filter((a) => a.category === "Policy").slice(0, 1)
  const safetyArticles = sortedArticles.filter((a) => a.category === "Safety").slice(0, 1)
  const industriesArticles = sortedArticles.filter((a) => a.category === "Industries").slice(0, 1)
  const infrastructureArticles = sortedArticles.filter((a) => a.category === "Infrastructure").slice(0, 1)

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      {/* Hero */}
      <section className="border-b border-neutral-300 relative overflow-hidden">
        {/* Decorative watermark - purely visual, hidden from screen readers */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <div 
            className="absolute top-1/2 left-1/2 flex flex-col items-center gap-0"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <span
              className="font-black tracking-tighter opacity-[0.03] whitespace-nowrap leading-none"
              style={{ fontSize: "clamp(4rem, 10vw, 10rem)", transform: "translateX(-10%)" }}
            >
              AUTOMATE
            </span>
            <span
              className="font-black tracking-tighter opacity-[0.03] whitespace-nowrap leading-none"
              style={{ fontSize: "clamp(4rem, 10vw, 10rem)", transform: "translateX(15%)" }}
            >
              EVERYTHING
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight leading-none">The AI Agent Guide</h1>
          <p className="text-xs md:text-sm font-mono tracking-wider text-neutral-500">Decide · Act · Learn · Repeat</p>
        </div>
      </section>

      {/* Featured Story */}
      <FeaturedStory article={featuredArticle} isTop={top3Ids.has(featuredArticle.id)} />

      {/* Top Intelligence Strip (by score) */}
      <LatestStrip articles={latestByScore} topIds={top3Ids} />

      {/* Front Page Content - Snippets */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Agents Section */}
          {agentsArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group border border-neutral-200 hover:border-black transition-colors"
            >
              <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <CardImage src={article.image} alt={article.headline} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  <span>{article.category}</span>
                  {top3Ids.has(article.id) && <span className="text-neutral-400">· Top</span>}
                  {article.aggregated && <span className="text-neutral-300 normal-case">· Source coverage</span>}
                </div>
                <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-neutral-600 transition-colors">
                  {article.headline}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">{article.summary}</p>
              </div>
            </Link>
          ))}

          {/* Policy Section */}
          {policyArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group border border-neutral-200 hover:border-black transition-colors"
            >
              <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <CardImage src={article.image} alt={article.headline} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  <span>{article.category}</span>
                  {top3Ids.has(article.id) && <span className="text-neutral-400">· Top</span>}
                  {article.aggregated && <span className="text-neutral-300 normal-case">· Source coverage</span>}
                </div>
                <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-neutral-600 transition-colors">
                  {article.headline}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">{article.summary}</p>
              </div>
            </Link>
          ))}

          {/* Safety Section */}
          {safetyArticles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group border border-neutral-200 hover:border-black transition-colors"
            >
              <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <CardImage src={article.image} alt={article.headline} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  <span>{article.category}</span>
                  {top3Ids.has(article.id) && <span className="text-neutral-400">· Top</span>}
                  {article.aggregated && <span className="text-neutral-300 normal-case">· Source coverage</span>}
                </div>
                <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-neutral-600 transition-colors">
                  {article.headline}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">{article.summary}</p>
              </div>
            </Link>
          ))}

          {/* Industries Section */}
          {industriesArticles.map((article) => (
            <div key={article.id} className="border border-neutral-200 hover:border-black transition-colors">
              <Link href={`/article/${article.id}`} className="group block">
                <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <CardImage src={article.image} alt={article.headline} />
                </div>
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    <span>{article.category}</span>
                    {top3Ids.has(article.id) && <span className="text-neutral-400">· Top</span>}
                    {article.aggregated && <span className="text-neutral-300 normal-case">· Source coverage</span>}
                  </div>
                  <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-neutral-600 transition-colors">
                    {article.headline}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">{article.summary}</p>
                </div>
              </Link>
              {/* Resources (only for qualifying articles) */}
              {shouldShowResourcesOnHomepage(article) && article.resources && (
                <div className="px-6 pb-4 pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                    Resources
                  </span>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {getHomepageResources(article.resources, 2).map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel={resource.isAffiliate ? "noopener noreferrer nofollow sponsored" : "noopener noreferrer"}
                        className="text-xs text-neutral-600 underline hover:text-neutral-400 transition-colors"
                      >
                        {resource.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Infrastructure Section */}
          {infrastructureArticles.map((article) => (
            <div key={article.id} className="border border-neutral-200 hover:border-black transition-colors">
              <Link href={`/article/${article.id}`} className="group block">
                <div className="overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <CardImage src={article.image} alt={article.headline} />
                </div>
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    <span>{article.category}</span>
                    {top3Ids.has(article.id) && <span className="text-neutral-400">· Top</span>}
                    {article.aggregated && <span className="text-neutral-300 normal-case">· Source coverage</span>}
                  </div>
                  <h2 className="text-lg font-bold mb-2 leading-tight group-hover:text-neutral-600 transition-colors">
                    {article.headline}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">{article.summary}</p>
                </div>
              </Link>
              {/* Resources (only for qualifying articles) */}
              {shouldShowResourcesOnHomepage(article) && article.resources && (
                <div className="px-6 pb-4 pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                    Resources
                  </span>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {getHomepageResources(article.resources, 2).map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel={resource.isAffiliate ? "noopener noreferrer nofollow sponsored" : "noopener noreferrer"}
                        className="text-xs text-neutral-600 underline hover:text-neutral-400 transition-colors"
                      >
                        {resource.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Latest Rail - sorted by publishedAt */}
        <div className="border-t border-neutral-300 pt-12 mb-16">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-6">Latest</div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {latestByDate.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group flex items-baseline gap-3 py-2 border-b border-neutral-100 hover:border-neutral-300 transition-colors"
              >
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {formatDate(article.publishedAt)}
                </span>
                <span className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                  {article.headline}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Experimental Blocks */}
        <div className="border-t border-neutral-300 pt-12">
          <h2 className="text-2xl font-bold mb-8">Also Tracking</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Deals & Credits */}
            <div className="border border-neutral-200 p-6">
              <Link 
                href="/deals" 
                aria-label="View all Deals & Credits"
                className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4 hover:text-neutral-700 hover:underline focus:outline-none focus:underline focus:text-neutral-700 transition-colors"
              >
                Deals & Credits
              </Link>
              <div className="space-y-4">
                {homepageDeals.slice(0, 4).map((deal) => (
                  <DealPill key={deal.id} deal={deal} />
                ))}
              </div>
            </div>

            {/* Research & Development */}
            <div className="border border-neutral-200 p-6">
              <Link 
                href="/research" 
                aria-label="View all Research & Development"
                className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4 hover:text-neutral-700 hover:underline focus:outline-none focus:underline focus:text-neutral-700 transition-colors"
              >
                Research & Development
              </Link>
              <div className="space-y-4">
                {homepageResearch.slice(0, 4).map((research) => (
                  <ResearchPill key={research.id} research={research} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-300 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-neutral-600">AI-Agent Guide · A neutral briefing hub for AI agent developments</p>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <HomePageJsonLd />
    </div>
  )
}
