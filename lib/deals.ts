export type DealKind = "deal" | "credit"
export type DealLanding = "external" | "internal"

/** FAQ item for deal pages */
export interface DealFaq {
  q: string
  a: string
}

/** Deal/Credit item for homepage and deal pages */
export interface Deal {
  /** Unique identifier / slug */
  id: string
  /** Display title */
  title: string
  /** Short description for homepage */
  description: string
  /** External destination URL */
  url: string
  /** Type of offer */
  kind: DealKind
  /** Where clicking leads - external URL or internal explainer page */
  landing: DealLanding
  /** Slug for internal page (required when landing="internal") */
  internalSlug?: string
  /** Whether this is an affiliate link */
  isAffiliate?: boolean
}

/** Extended deal info for explainer pages */
export interface DealExplainer extends Deal {
  /** Detailed summary for the explainer page */
  summary: string
  /** Who is eligible */
  eligibility: string[]
  /** Steps to apply */
  steps: string[]
  /** Best use cases */
  bestUseCases: string[]
  /** Estimated value (e.g., "Up to $100,000 in credits") */
  valueEstimate: string
  /** Primary CTA button text */
  primaryCtaLabel: string
  /** Primary CTA URL (usually same as url) */
  primaryCtaUrl: string
  /** FAQ items for the page */
  faq?: DealFaq[]
}

/**
 * Homepage deals list - shown in "Also Tracking" section
 */
export const homepageDeals: Deal[] = [
  {
    id: "aws-activate",
    title: "AWS Activate Credits",
    description: "Up to $100k in cloud credits for eligible startups building AI agents.",
    url: "https://aws.amazon.com/activate/",
    kind: "credit",
    landing: "internal",
    internalSlug: "aws-activate",
    isAffiliate: true,
  },
  {
    id: "azure-startups",
    title: "Azure for Startups",
    description: "Free tier + credits for founders building on Azure AI services.",
    url: "https://azure.microsoft.com/en-us/free/startups/",
    kind: "credit",
    landing: "internal",
    internalSlug: "azure-startups",
    isAffiliate: false,
  },
  {
    id: "openai-enterprise",
    title: "OpenAI Enterprise Trial Credits",
    description: "New enterprise accounts receive credits for testing agent workflows.",
    url: "https://openai.com/enterprise/",
    kind: "credit",
    landing: "external",
    isAffiliate: false,
  },
  {
    id: "anthropic-academic",
    title: "Anthropic Academic Research Program",
    description: "Free API access for researchers studying agent safety and alignment.",
    url: "https://www.anthropic.com/research",
    kind: "deal",
    landing: "external",
    isAffiliate: false,
  },
]

/**
 * Full deal explainers for internal pages
 */
export const dealExplainers: DealExplainer[] = [
  {
    id: "aws-activate",
    title: "AWS Activate Credits for AI Startups",
    description: "Up to $100k in cloud credits for eligible startups building AI agents.",
    summary: "AWS Activate provides startups with AWS credits, technical support, and training to help build and scale on AWS. For AI agent development, this can significantly reduce infrastructure costs during the critical early stages.",
    url: "https://aws.amazon.com/activate/",
    kind: "credit",
    landing: "internal",
    internalSlug: "aws-activate",
    isAffiliate: true,
    eligibility: [
      "Early-stage startup (typically pre-Series B)",
      "Building a technology product or service",
      "Not previously received AWS Activate credits",
      "Associated with an approved accelerator, incubator, or VC (for higher tiers)",
    ],
    steps: [
      "Create an AWS account if you don't have one",
      "Apply through the AWS Activate portal",
      "Provide company details and business plan summary",
      "Wait for approval (typically 1-2 weeks)",
      "Credits are automatically applied to your account",
    ],
    bestUseCases: [
      "Running AI model inference on EC2 or SageMaker",
      "Hosting agent runtime environments",
      "Storing training data and model artifacts in S3",
      "Using Bedrock for foundation model access",
      "Building with Lambda for serverless agent orchestration",
    ],
    valueEstimate: "Up to $100,000 in AWS credits",
    primaryCtaLabel: "Apply for AWS Activate",
    primaryCtaUrl: "https://aws.amazon.com/activate/",
    faq: [
      {
        q: "How long does AWS Activate approval take?",
        a: "Typically 1-2 weeks for standard applications. If you're part of an approved accelerator or VC portfolio, approval can be faster.",
      },
      {
        q: "Can I use AWS Activate credits for AI model training?",
        a: "Yes, credits can be used for SageMaker, EC2 GPU instances, and other compute resources commonly used for AI/ML workloads.",
      },
      {
        q: "Do AWS Activate credits expire?",
        a: "Yes, credits typically expire 12-24 months after activation depending on your tier. Check your Activate dashboard for exact expiration dates.",
      },
      {
        q: "Can I apply if I've already used AWS?",
        a: "Yes, existing AWS customers can apply as long as they haven't previously received Activate credits and meet the startup eligibility criteria.",
      },
    ],
  },
  {
    id: "azure-startups",
    title: "Microsoft for Startups (Azure Credits)",
    description: "Free tier + credits for founders building on Azure AI services.",
    summary: "Microsoft for Startups Founders Hub provides free access to Azure credits, development tools, and technical support. The program is particularly valuable for startups leveraging Azure OpenAI Service or other Azure AI capabilities for agent development.",
    url: "https://azure.microsoft.com/en-us/free/startups/",
    kind: "credit",
    landing: "internal",
    internalSlug: "azure-startups",
    isAffiliate: false,
    eligibility: [
      "Privately held startup less than 7 years old",
      "Building a software-based product or service",
      "Not a subsidiary of a large company",
      "New to Microsoft for Startups program",
    ],
    steps: [
      "Apply through Microsoft for Startups Founders Hub",
      "Complete company verification",
      "Describe your product and how you'll use Azure",
      "Get approved and access your credits dashboard",
      "Redeem credits as you build",
    ],
    bestUseCases: [
      "Azure OpenAI Service for GPT-4 and embeddings",
      "Azure AI Search for RAG implementations",
      "Azure Functions for agent orchestration",
      "Azure Cosmos DB for conversation state",
      "GitHub Copilot for development acceleration",
    ],
    valueEstimate: "Up to $150,000 in Azure credits (varies by tier)",
    primaryCtaLabel: "Join Founders Hub",
    primaryCtaUrl: "https://azure.microsoft.com/en-us/free/startups/",
    faq: [
      {
        q: "What's the difference between Azure free tier and Founders Hub?",
        a: "Azure free tier is available to everyone with limited resources. Founders Hub provides significantly more credits (up to $150k) specifically for startups, plus access to technical mentorship and business resources.",
      },
      {
        q: "Can I use Azure credits with Azure OpenAI Service?",
        a: "Yes, Azure credits from Founders Hub can be applied to Azure OpenAI Service for GPT-4, embeddings, and other AI models.",
      },
      {
        q: "How do credit tiers work in Founders Hub?",
        a: "Credits are allocated based on startup stage. Early-stage startups typically receive $1,000-$5,000 initially, with opportunities to unlock more as you grow or partner with approved VCs.",
      },
      {
        q: "Is GitHub Copilot included?",
        a: "Yes, Founders Hub members get free access to GitHub Copilot, which can significantly accelerate AI agent development.",
      },
    ],
  },
]

/**
 * Get a deal explainer by slug
 */
export function getDealBySlug(slug: string): DealExplainer | undefined {
  return dealExplainers.find(d => d.internalSlug === slug)
}

/**
 * Get all deal slugs for static generation
 */
export function getAllDealSlugs(): string[] {
  return dealExplainers.map(d => d.internalSlug).filter((s): s is string => !!s)
}

