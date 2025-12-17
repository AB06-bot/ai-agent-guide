import type { ArticleResource } from "@/lib/articles"
import { hasAffiliateLinks } from "@/lib/articles"
import { SmartLink } from "@/components/smart-link"

interface ArticleResourcesProps {
  resources: ArticleResource[]
  /** Compact mode for homepage snippets (no disclosure, simpler layout) */
  compact?: boolean
  /** Maximum number of resources to show */
  maxItems?: number
}

/**
 * Editorial Resources section for article pages.
 * Renders resource links with proper affiliate handling and disclosure.
 */
export function ArticleResources({ 
  resources, 
  compact = false,
  maxItems 
}: ArticleResourcesProps) {
  if (!resources || resources.length === 0) return null

  const displayResources = maxItems ? resources.slice(0, maxItems) : resources
  const showDisclosure = !compact && hasAffiliateLinks(resources)

  return (
    <section className={compact ? "" : "pt-8 mt-8 border-t border-neutral-200"}>
      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
        Resources
      </h2>
      
      {/* Affiliate disclosure - shown under header when applicable */}
      {showDisclosure && (
        <p className="text-xs text-neutral-400 mb-4">
          Disclosure: Some links may be affiliate links. If you use them, it helps support AI-Agent Guide at no extra cost to you.
        </p>
      )}

      <ul className={compact ? "space-y-1" : "space-y-2"}>
        {displayResources.map((resource, index) => (
          <li key={index} className={compact ? "text-sm" : ""}>
            <ResourceLink resource={resource} compact={compact} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Individual resource link with proper rel attributes for affiliate handling.
 */
function ResourceLink({ 
  resource, 
  compact = false 
}: { 
  resource: ArticleResource
  compact?: boolean 
}) {
  return (
    <span>
      <SmartLink
        href={resource.url}
        isAffiliate={resource.isAffiliate}
        ariaLabel={resource.name}
        className={`${
          compact 
            ? "text-sm text-neutral-700 underline hover:text-neutral-500" 
            : "text-base text-neutral-900 underline hover:text-neutral-600"
        } transition-colors`}
      >
        {resource.name}
      </SmartLink>
      {/* Show note if present (not in compact mode) */}
      {!compact && resource.note && (
        <span className="text-sm text-neutral-400 ml-2">
          — {resource.note}
        </span>
      )}
    </span>
  )
}

/**
 * Compact inline resources for homepage cards.
 * Shows max 2 resources with minimal styling.
 */
export function CompactResources({ resources }: { resources: ArticleResource[] }) {
  if (!resources || resources.length === 0) return null

  // Only show max 2 resources on homepage
  const displayResources = resources.slice(0, 2)

  return (
    <div className="mt-3 pt-3 border-t border-neutral-100">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
        Resources
      </span>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        {displayResources.map((resource, index) => (
          <SmartLink
            key={index}
            href={resource.url}
            isAffiliate={resource.isAffiliate}
            ariaLabel={resource.name}
            className="text-xs text-neutral-600 underline hover:text-neutral-400 transition-colors"
          >
            {resource.name}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

