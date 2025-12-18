import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SmartLink } from "@/components/smart-link"
import { researchExplainers, homepageResearch } from "@/lib/research"
import { siteUrl } from "@/lib/seo"
import { buildBreadcrumbJsonLd, JsonLdScript } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Research & Development",
  description: "AI agent research, benchmarks, frameworks, and datasets. Tracking the latest developments from Stanford, MIT, Anthropic, and more.",
  openGraph: {
    title: "Research & Development",
    description: "AI agent research, benchmarks, frameworks, and datasets.",
    url: `${siteUrl}/research`,
  },
  alternates: {
    canonical: `${siteUrl}/research`,
  },
}

export default function ResearchIndexPage() {
  // Build breadcrumb schema
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Research & Development", url: "/research" },
  ], siteUrl)

  return (
    <div className="min-h-screen bg-white text-black">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb navigation */}
        <nav className="text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="select-none">›</li>
            <li className="text-neutral-500">Research & Development</li>
          </ol>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Research & Development</h1>
          <p className="text-lg text-neutral-600">
            AI agent research, benchmarks, frameworks, and datasets. 
            We track and explain significant developments shaping the future of AI agents.
          </p>
        </div>

        {/* Featured Research (with explainer pages) */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
            Featured Research
          </h2>
          <div className="grid gap-6">
            {researchExplainers.map((research) => (
              <Link
                key={research.id}
                href={`/research/${research.internalSlug}`}
                className="group block border border-neutral-200 p-6 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {research.category}
                      </span>
                      {research.institution && (
                        <span className="text-[10px] text-neutral-300">· {research.institution}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-neutral-600 transition-colors">
                      {research.title}
                    </h3>
                    <p className="text-neutral-600">{research.summary}</p>
                  </div>
                  <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Research (external only) */}
        {homepageResearch.filter(r => r.landing === "external").length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
              Other Resources
            </h2>
            <div className="grid gap-4">
              {homepageResearch
                .filter(r => r.landing === "external")
                .map((research) => (
                  <SmartLink
                    key={research.id}
                    href={research.url}
                    ariaLabel={research.title}
                    className="flex items-center justify-between border border-neutral-200 p-4 hover:border-neutral-400 transition-colors"
                    hideExternalIcon
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                          {research.category}
                        </span>
                        {research.institution && (
                          <span className="text-[10px] text-neutral-300">· {research.institution}</span>
                        )}
                      </div>
                      <h3 className="font-bold group-hover:text-neutral-600 transition-colors">
                        {research.title}
                      </h3>
                      <p className="text-sm text-neutral-600">{research.description}</p>
                    </div>
                    <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
                      ↗
                    </span>
                  </SmartLink>
                ))}
            </div>
          </section>
        )}

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-black transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* JSON-LD Structured Data */}
      <JsonLdScript data={breadcrumbSchema} />
    </div>
  )
}

