/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Trusted OG image sources from RSS feeds
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google/DeepMind
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "openai.com" },
      { protocol: "https", hostname: "*.openai.com" },
      { protocol: "https", hostname: "www.anthropic.com" },
      { protocol: "https", hostname: "anthropic.com" },
      { protocol: "https", hostname: "deepmind.google" },
      { protocol: "https", hostname: "*.microsoft.com" },
      { protocol: "https", hostname: "wp.technologyreview.com" },
      { protocol: "https", hostname: "www.technologyreview.com" },
      { protocol: "https", hostname: "hai.stanford.edu" },
      { protocol: "https", hostname: "*.stanford.edu" },
      // TODO: Tighten these permissive patterns once we know all OG image CDN sources
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Fallback: allow any HTTPS image (less secure but ensures images load)
      { protocol: "https", hostname: "**" },
    ],
  },
}

export default nextConfig
