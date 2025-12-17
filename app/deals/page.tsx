import Link from "next/link"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SmartLink } from "@/components/smart-link"
import { dealExplainers, homepageDeals } from "@/lib/deals"
import { siteUrl, siteName } from "@/lib/seo"
import { buildBreadcrumbJsonLd, JsonLdScript } from "@/lib/schema.tsx"

export const metadata: Metadata = {
  title: "Deals & Credits",
  description: "Cloud credits, startup programs, and resources for building AI agents. Curated deals from AWS, Azure, OpenAI, and more.",
  openGraph: {
    title: "Deals & Credits",
    description: "Cloud credits, startup programs, and resources for building AI agents.",
    url: `${siteUrl}/deals`,
  },
  alternates: {
    canonical: `${siteUrl}/deals`,
  },
}

export default function DealsIndexPage() {
  // Build breadcrumb schema
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Deals & Credits", url: "/deals" },
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
            <li className="text-neutral-500">Deals & Credits</li>
          </ol>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Deals & Credits</h1>
          <p className="text-lg text-neutral-600">
            Cloud credits, startup programs, and resources for building AI agents. 
            We research and explain each program so you can make informed decisions.
          </p>
        </div>

        {/* Featured Deals (with explainer pages) */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
            Featured Programs
          </h2>
          <div className="grid gap-6">
            {dealExplainers.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.internalSlug}`}
                className="group block border border-neutral-200 p-6 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {deal.kind}
                      </span>
                      {deal.isAffiliate && (
                        <span className="text-[10px] text-neutral-300">· Partner</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-neutral-600 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-neutral-600 mb-3">{deal.summary}</p>
                    <div className="text-sm font-medium text-neutral-500">
                      {deal.valueEstimate}
                    </div>
                  </div>
                  <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Deals (external only) */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
            Other Programs
          </h2>
          <div className="grid gap-4">
            {homepageDeals
              .filter(d => d.landing === "external")
              .map((deal) => (
                <SmartLink
                  key={deal.id}
                  href={deal.url}
                  isAffiliate={deal.isAffiliate}
                  ariaLabel={deal.title}
                  className="flex items-center justify-between border border-neutral-200 p-4 hover:border-neutral-400 transition-colors"
                  hideExternalIcon
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        {deal.kind}
                      </span>
                    </div>
                    <h3 className="font-bold group-hover:text-neutral-600 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-neutral-600">{deal.description}</p>
                  </div>
                  <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0">
                    ↗
                  </span>
                </SmartLink>
              ))}
          </div>
        </section>

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
