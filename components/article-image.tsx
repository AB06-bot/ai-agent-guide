"use client"

import Image from "next/image"

type AspectRatio = "16/9" | "4/3" | "2/1" | "1/1"

interface ArticleImageProps {
  src?: string | null
  alt?: string
  aspectRatio?: AspectRatio
  priority?: boolean
  className?: string
  sizes?: string
}

// Clean fallback placeholder - neutral gradient with subtle pattern
function ImagePlaceholder({ aspectRatio = "16/9" }: { aspectRatio?: AspectRatio }) {
  return (
    <div 
      className="w-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"
      style={{ aspectRatio }}
    >
      <div className="w-12 h-12 rounded-full bg-neutral-300/50" />
    </div>
  )
}

export function ArticleImage({ 
  src, 
  alt = "", 
  aspectRatio = "16/9",
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ArticleImageProps) {
  // No image - show clean placeholder
  if (!src) {
    return <ImagePlaceholder aspectRatio={aspectRatio} />
  }

  // Check if it's a remote URL or local path
  const isRemote = src.startsWith("http://") || src.startsWith("https://")

  return (
    <div 
      className={`relative w-full overflow-hidden bg-neutral-100 ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        // For remote images, we use unoptimized if the domain might not be in our config
        // This ensures images always load, even from unknown sources
        unoptimized={isRemote}
      />
    </div>
  )
}

// Preset variants for common use cases
export function FeaturedImage({ src, alt, priority = true }: Omit<ArticleImageProps, "aspectRatio" | "sizes">) {
  return (
    <ArticleImage 
      src={src} 
      alt={alt} 
      aspectRatio="16/9" 
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}

export function CardImage({ src, alt, priority = false }: Omit<ArticleImageProps, "aspectRatio" | "sizes">) {
  return (
    <ArticleImage 
      src={src} 
      alt={alt} 
      aspectRatio="16/9" 
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

export function HeroImage({ src, alt, priority = true }: Omit<ArticleImageProps, "aspectRatio" | "sizes">) {
  return (
    <ArticleImage 
      src={src} 
      alt={alt} 
      aspectRatio="2/1" 
      priority={priority}
      sizes="(max-width: 768px) 100vw, 768px"
    />
  )
}

export function SmallCardImage({ src, alt, priority = false }: Omit<ArticleImageProps, "aspectRatio" | "sizes">) {
  return (
    <ArticleImage 
      src={src} 
      alt={alt} 
      aspectRatio="4/3" 
      priority={priority}
      sizes="(max-width: 768px) 224px, 200px"
    />
  )
}

