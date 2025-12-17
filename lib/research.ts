export type ResearchCategory = "benchmark" | "framework" | "dataset" | "paper" | "tool"
export type ResearchLanding = "external" | "internal"

/** Research item for homepage and research pages */
export interface Research {
  /** Unique identifier / slug */
  id: string
  /** Display title */
  title: string
  /** Short description for homepage */
  description: string
  /** External source URL */
  url: string
  /** Type of research */
  category: ResearchCategory
  /** Where clicking leads - external URL or internal explainer page */
  landing: ResearchLanding
  /** Slug for internal page (required when landing="internal") */
  internalSlug?: string
  /** Institution/organization */
  institution?: string
}

/** Extended research info for explainer pages */
export interface ResearchExplainer extends Research {
  /** Detailed summary for the explainer page */
  summary: string
  /** Key highlights / what it offers */
  highlights: string[]
  /** How to access or use */
  howToUse: string[]
  /** Best applications for AI agents */
  applications: string[]
  /** Primary CTA button text */
  primaryCtaLabel: string
  /** Primary CTA URL (usually same as url) */
  primaryCtaUrl: string
}

/**
 * Homepage research list - shown in "Also Tracking" section
 */
export const homepageResearch: Research[] = [
  {
    id: "stanford-agentbench",
    title: "Stanford AgentBench Framework",
    description: "New testing suite evaluates agent performance across real-world task completion scenarios.",
    url: "https://agentbench.stanford.edu/",
    category: "benchmark",
    landing: "internal",
    internalSlug: "stanford-agentbench",
    institution: "Stanford University",
  },
  {
    id: "mit-drug-discovery",
    title: "MIT Agent-Based Drug Discovery",
    description: "Multi-agent system screens molecular compounds and designs synthesis pathways autonomously.",
    url: "https://news.mit.edu/",
    category: "paper",
    landing: "internal",
    internalSlug: "mit-drug-discovery",
    institution: "MIT",
  },
  {
    id: "anthropic-model-spec",
    title: "Anthropic Model Spec",
    description: "Research on how to specify model behavior for safer and more reliable AI agents.",
    url: "https://www.anthropic.com/research",
    category: "paper",
    landing: "internal",
    internalSlug: "anthropic-model-spec",
    institution: "Anthropic",
  },
  {
    id: "gaia-benchmark",
    title: "GAIA: General AI Assistants Benchmark",
    description: "Benchmark for measuring real-world assistant capabilities across 466 curated questions.",
    url: "https://huggingface.co/spaces/gaia-benchmark/leaderboard",
    category: "benchmark",
    landing: "internal",
    internalSlug: "gaia-benchmark",
    institution: "Hugging Face / Meta",
  },
  {
    id: "metagpt-framework",
    title: "MetaGPT Multi-Agent Framework",
    description: "Open-source framework for building collaborative multi-agent systems with role-based workflows.",
    url: "https://github.com/geekan/MetaGPT",
    category: "framework",
    landing: "external",
    institution: "DeepWisdom",
  },
]

/**
 * Full research explainers for internal pages
 */
export const researchExplainers: ResearchExplainer[] = [
  {
    id: "stanford-agentbench",
    title: "Stanford AgentBench Framework",
    description: "New testing suite evaluates agent performance across real-world task completion scenarios.",
    summary: "AgentBench is a comprehensive benchmarking framework developed by Stanford researchers to evaluate LLM-based agents on real-world interactive tasks. It tests agents across operating systems, databases, knowledge graphs, and web environments, providing standardized metrics for comparing agent capabilities.",
    url: "https://agentbench.stanford.edu/",
    category: "benchmark",
    landing: "internal",
    internalSlug: "stanford-agentbench",
    institution: "Stanford University",
    highlights: [
      "Tests agents across 8 distinct environments",
      "Evaluates multi-turn reasoning and tool use",
      "Provides reproducible evaluation protocols",
      "Open-source implementation available",
      "Leaderboard tracks state-of-the-art performance",
    ],
    howToUse: [
      "Clone the AgentBench repository from GitHub",
      "Set up the evaluation environments (Docker recommended)",
      "Configure your agent's API endpoint",
      "Run the benchmark suite against your agent",
      "Submit results to the public leaderboard",
    ],
    applications: [
      "Comparing different LLM backends for agent tasks",
      "Measuring regression in agent capabilities across versions",
      "Identifying specific weaknesses in agent reasoning",
      "Validating agent improvements before production deployment",
      "Research publications on agent architectures",
    ],
    primaryCtaLabel: "Explore AgentBench",
    primaryCtaUrl: "https://agentbench.stanford.edu/",
  },
  {
    id: "mit-drug-discovery",
    title: "MIT Agent-Based Drug Discovery System",
    description: "Multi-agent system screens molecular compounds and designs synthesis pathways autonomously.",
    summary: "MIT researchers have developed a multi-agent AI system capable of autonomously screening molecular compounds, predicting binding affinities, and designing synthesis pathways for potential drug candidates. The system demonstrates how coordinated AI agents can accelerate pharmaceutical research.",
    url: "https://news.mit.edu/",
    category: "paper",
    landing: "internal",
    internalSlug: "mit-drug-discovery",
    institution: "MIT",
    highlights: [
      "Autonomous molecular screening at scale",
      "Multi-agent coordination for complex workflows",
      "Integration with chemistry databases",
      "Synthesis pathway generation",
      "Demonstrated results on real drug targets",
    ],
    howToUse: [
      "Review the published research paper",
      "Access the open-source implementation (if available)",
      "Configure molecular databases and tools",
      "Set up the multi-agent orchestration layer",
      "Run screening campaigns on target molecules",
    ],
    applications: [
      "Drug discovery research acceleration",
      "Material science compound screening",
      "Automated chemistry lab integration",
      "Multi-agent workflow design patterns",
      "Scientific research automation",
    ],
    primaryCtaLabel: "Read the Research",
    primaryCtaUrl: "https://news.mit.edu/",
  },
  {
    id: "anthropic-model-spec",
    title: "Anthropic Model Specification Research",
    description: "Research on how to specify model behavior for safer and more reliable AI agents.",
    summary: "Anthropic's Model Spec research explores methods for precisely specifying how AI models should behave in various scenarios. This work is crucial for building reliable AI agents that follow intended guidelines while remaining helpful, providing a foundation for safer agent deployment.",
    url: "https://www.anthropic.com/research",
    category: "paper",
    landing: "internal",
    internalSlug: "anthropic-model-spec",
    institution: "Anthropic",
    highlights: [
      "Formal methods for behavior specification",
      "Constitutional AI principles in practice",
      "Guidelines for agent boundary setting",
      "Research on instruction following",
      "Safety considerations for autonomous agents",
    ],
    howToUse: [
      "Study the published research papers",
      "Apply principles to your agent's system prompts",
      "Implement behavioral boundaries based on the spec",
      "Test agent responses against edge cases",
      "Iterate on specifications based on real-world usage",
    ],
    applications: [
      "Designing safer autonomous agents",
      "Setting appropriate agent boundaries",
      "Improving instruction following reliability",
      "Building trust in agent deployments",
      "Enterprise AI governance frameworks",
    ],
    primaryCtaLabel: "View Research",
    primaryCtaUrl: "https://www.anthropic.com/research",
  },
  {
    id: "gaia-benchmark",
    title: "GAIA: General AI Assistants Benchmark",
    description: "Benchmark for measuring real-world assistant capabilities across 466 curated questions.",
    summary: "GAIA (General AI Assistants) is a benchmark designed to test AI assistants on real-world tasks that humans can easily solve but remain challenging for AI. It includes 466 carefully curated questions across three difficulty levels, focusing on web browsing, multi-modal reasoning, and tool use.",
    url: "https://huggingface.co/spaces/gaia-benchmark/leaderboard",
    category: "benchmark",
    landing: "internal",
    internalSlug: "gaia-benchmark",
    institution: "Hugging Face / Meta",
    highlights: [
      "466 hand-crafted evaluation questions",
      "Three difficulty levels (L1, L2, L3)",
      "Tests web browsing and tool use",
      "Multi-modal reasoning challenges",
      "Public leaderboard for model comparison",
    ],
    howToUse: [
      "Access the GAIA dataset on Hugging Face",
      "Set up your agent with web browsing capabilities",
      "Run evaluations on the validation set",
      "Submit predictions to the leaderboard",
      "Analyze failure cases to improve your agent",
    ],
    applications: [
      "Evaluating web-capable AI agents",
      "Measuring multi-step reasoning ability",
      "Testing tool use and API integration",
      "Comparing commercial vs. open-source models",
      "Identifying gaps in agent capabilities",
    ],
    primaryCtaLabel: "View Leaderboard",
    primaryCtaUrl: "https://huggingface.co/spaces/gaia-benchmark/leaderboard",
  },
]

/**
 * Get a research explainer by slug
 */
export function getResearchBySlug(slug: string): ResearchExplainer | undefined {
  return researchExplainers.find(r => r.internalSlug === slug)
}

/**
 * Get all research slugs for static generation
 */
export function getAllResearchSlugs(): string[] {
  return researchExplainers.map(r => r.internalSlug).filter((s): s is string => !!s)
}

/**
 * Keywords that indicate research relevance for article linking
 */
export const researchKeywords = [
  "benchmark",
  "eval",
  "evaluation",
  "framework",
  "dataset",
  "research",
  "paper",
  "study",
  "agentbench",
  "gaia",
  "metagpt",
]

