import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SmartLink } from "@/components/smart-link"
import { getResearchBySlug, getAllResearchSlugs, ResearchExplainer } from "@/lib/research"
import { siteUrl, siteName, truncateText } from "@/lib/seo"
import { buildBreadcrumbJsonLd, JsonLdScript } from "@/lib/schema.tsx"
import { use } from "react"

export function generateStaticParams() {
  return getAllResearchSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const research = getResearchBySlug(slug)

  if (!research) {
    return { title: "Research Not Found" }
  }

  const description = truncateText(research.summary, 160)
  const canonicalUrl = `${siteUrl}/research/${slug}`

  return {
    title: research.title,
    description,
    openGraph: {
      type: "article",
      title: research.title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: research.title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// CTA Button Component (no affiliate disclosure for research)
function CtaButton({ research }: { research: ResearchExplainer }) {
  return (
    <SmartLink
      href={research.primaryCtaUrl}
      ariaLabel={research.primaryCtaLabel}
      className="inline-flex items-center justify-center px-6 py-3 border border-neutral-900 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
      hideExternalIcon
    >
      {research.primaryCtaLabel}
      <span className="ml-2">↗</span>
    </SmartLink>
  )
}

export default function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const research = getResearchBySlug(slug)

  if (!research) {
    notFound()
  }

  // Build JSON-LD schemas
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
    { name: research.title, url: `/research/${research.internalSlug}` },
  ], siteUrl)

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
              <Link href="/research" className="hover:text-neutral-600 transition-colors">
                Research
              </Link>
            </li>
            <li className="select-none">›</li>
            <li className="text-neutral-500 truncate max-w-[200px]" title={research.title}>
              {research.title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {research.category}
            </span>
            {research.institution && (
              <span className="text-xs text-neutral-300">· {research.institution}</span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{research.title}</h1>
          <p className="text-lg text-neutral-600 mb-6">{research.summary}</p>
          
          {/* Top CTA */}
          <div className="flex items-center gap-4">
            <CtaButton research={research} />
          </div>
        </header>

        {/* Key Highlights */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Key Highlights
          </h2>
          <ul className="space-y-2">
            {research.highlights.map((item, index) => (
              <li
                key={index}
                className="text-neutral-700 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How to Use */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            How to Access & Use
          </h2>
          <ol className="space-y-3">
            {research.howToUse.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-sm font-bold text-neutral-400 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-neutral-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Applications */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Applications for AI Agents
          </h2>
          <ul className="space-y-2">
            {research.applications.map((application, index) => (
              <li
                key={index}
                className="text-neutral-700 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-neutral-400"
              >
                {application}
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom CTA */}
        <section className="pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CtaButton research={research} />
            {research.institution && (
              <p className="text-sm text-neutral-500">
                Research from {research.institution}
              </p>
            )}
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <Link
              href="/research"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
            >
              ← All Research
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
      <JsonLdScript data={breadcrumbSchema} />
    </div>
  )
}

