"use client"

import Link from "next/link"
import type { ReactNode } from "react"

interface SmartLinkProps {
  href: string
  children: ReactNode
  className?: string
  isAffiliate?: boolean
  /** Optional aria-label override (otherwise auto-generated for external links) */
  ariaLabel?: string
  /** Hide the external link icon (useful when parent already shows one) */
  hideExternalIcon?: boolean
}

// Get site URL from env or fallback
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

/**
 * Determines if a URL is external (not part of this site)
 */
function isExternalUrl(href: string): boolean {
  // Relative URLs are internal
  if (!href.startsWith("http")) {
    return false
  }
  
  // Check if the URL belongs to our site
  try {
    const url = new URL(href)
    const siteHostname = new URL(siteUrl).hostname
    return url.hostname !== siteHostname
  } catch {
    // If URL parsing fails, treat as internal to be safe
    return false
  }
}

/**
 * External link icon that appears on hover/focus
 * - Small, subtle, appears only on interaction
 * - aria-hidden for screen readers (they get aria-label instead)
 */
function ExternalIcon() {
  return (
    <span
      className="ml-1 text-[0.75em] opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 transition-opacity duration-150"
      aria-hidden="true"
    >
      ↗
    </span>
  )
}

/**
 * SmartLink - Automatically handles internal vs external links
 * 
 * - Internal links: Use Next.js Link, same tab
 * - External links: Use <a> with target="_blank" and appropriate rel attributes
 * - Affiliate links: Include "nofollow sponsored" in rel
 * - Non-affiliate external: Include "noopener noreferrer nofollow" in rel
 * - External links show a subtle ↗ icon on hover/focus
 */
export function SmartLink({
  href,
  children,
  className,
  isAffiliate = false,
  ariaLabel,
  hideExternalIcon = false,
}: SmartLinkProps) {
  const isExternal = isExternalUrl(href)

  if (isExternal) {
    // Build rel attribute based on affiliate status
    const rel = isAffiliate
      ? "noopener noreferrer nofollow sponsored"
      : "noopener noreferrer nofollow"

    // Generate accessible aria-label for external links
    const externalAriaLabel = ariaLabel
      ? `${ariaLabel} (opens in new tab)`
      : undefined

    // Merge 'group' class with existing className for hover state
    const externalClassName = className
      ? `group ${className}`
      : "group"

    return (
      <a
        href={href}
        target="_blank"
        rel={rel}
        className={externalClassName}
        aria-label={externalAriaLabel}
      >
        {children}
        {!hideExternalIcon && <ExternalIcon />}
      </a>
    )
  }

  // Internal link - use Next.js Link
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}

/**
 * Hook to check if a URL is external (for use in components that need conditional rendering)
 */
export function useIsExternalUrl(href: string): boolean {
  return isExternalUrl(href)
}

/**
 * Utility to get the appropriate rel attribute for a link
 */
export function getExternalLinkRel(isAffiliate: boolean): string {
  return isAffiliate
    ? "noopener noreferrer nofollow sponsored"
    : "noopener noreferrer nofollow"
}

