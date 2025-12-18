import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SmartLink } from "@/components/smart-link"
import { getDealBySlug, getAllDealSlugs, DealExplainer } from "@/lib/deals"
import { siteUrl, siteName, truncateText } from "@/lib/seo"
import {
  buildDealProductJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
  buildDealBreadcrumbs,
  JsonLdScript,
} from "@/lib/schema"
import { use } from "react"

export function generateStaticParams() {
  return getAllDealSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const deal = getDealBySlug(slug)

  if (!deal) {
    return { title: "Deal Not Found" }
  }

  const description = truncateText(deal.summary, 160)
  const canonicalUrl = `${siteUrl}/deals/${slug}`

  return {
    title: deal.title,
    description,
    openGraph: {
      type: "article",
      title: deal.title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: deal.title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// CTA Button Component
function CtaButton({ deal }: { deal: DealExplainer }) {
  return (
    <SmartLink
      href={deal.primaryCtaUrl}
      isAffiliate={deal.isAffiliate}
      ariaLabel={deal.primaryCtaLabel}
      className="inline-flex items-center justify-center px-6 py-3 border border-neutral-900 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
      hideExternalIcon
    >
      {deal.primaryCtaLabel}
      <span className="ml-2">↗</span>
    </SmartLink>
  )
}

export default function DealPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const deal = getDealBySlug(slug)

  if (!deal) {
    notFound()
  }

  // Build JSON-LD schemas
  const productSchema = buildDealProductJsonLd(deal, siteUrl)
  const breadcrumbSchema = buildBreadcrumbJsonLd(buildDealBreadcrumbs(deal, siteUrl), siteUrl)
  const faqSchema = deal.faq && deal.faq.length > 0 
    ? buildFaqJsonLd(deal.faq, siteUrl) 
    : null

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="select-none">›</li>
            <li>
              <Link href="/deals" className="hover:text-neutral-600 transition-colors">
                Deals
              </Link>
            </li>
            <li className="select-none">›</li>
            <li className="text-neutral-500 truncate max-w-[200px]" title={deal.title}>
              {deal.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {deal.kind}
            </span>
            {deal.isAffiliate && (
              <span className="text-xs text-neutral-300">· Partner Program</span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{deal.title}</h1>
          <p className="text-lg text-neutral-600 mb-6">{deal.summary}</p>
          
          {/* Top CTA */}
          <div className="flex items-center gap-4">
            <CtaButton deal={deal} />
            <span className="text-sm text-neutral-500">{deal.valueEstimate}</span>
          </div>
        </header>

        {/* Affiliate Disclosure */}
        {deal.isAffiliate && (
          <div className="mb-8 p-4 bg-neutral-50 border border-neutral-100 text-sm text-neutral-600">
            <strong className="text-neutral-700">Disclosure:</strong> This is a partner program. 
            If you sign up through our link, it helps support {siteName} at no extra cost to you.
          </div>
        )}

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Eligibility
          </h2>
          <ul className="space-y-2">
            {deal.eligibility.map((item, index) => (
              <li
                key={index}
                className="text-neutral-700 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How to Apply */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            How to Apply
          </h2>
          <ol className="space-y-3">
            {deal.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-sm font-bold text-neutral-400 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-neutral-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Best Use Cases */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Best Use Cases for AI Agents
          </h2>
          <ul className="space-y-2">
            {deal.bestUseCases.map((useCase, index) => (
              <li
                key={index}
                className="text-neutral-700 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-400"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        {deal.faq && deal.faq.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {deal.faq.map((item, index) => (
                <div key={index} className="border-l-2 border-neutral-200 pl-4">
                  <h3 className="font-medium text-neutral-900 mb-2">{item.q}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CtaButton deal={deal} />
            <p className="text-sm text-neutral-500">
              {deal.valueEstimate} · Application typically takes 5-10 minutes
            </p>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <Link
              href="/deals"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
            >
              ← All Deals
            </Link>
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-black transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </article>

      {/* JSON-LD Structured Data */}
      <JsonLdScript data={productSchema} />
      <JsonLdScript data={breadcrumbSchema} />
      <JsonLdScript data={faqSchema} />
    </div>
  )
}
