import { normalizeSlug } from "@/server/knowledge/base";

type KnowledgePath = {
  id: string;
  label: string;
  kind: "glossary" | "radar";
  slugs: string[];
  description: string;
};

export type KnowledgePathItemStatus = {
  slug: string;
  viewed: boolean;
  hasCard: boolean;
  reviewed: boolean;
  weak: boolean;
  mastered: boolean;
  statusLabel: "未看" | "已查看" | "已生成卡片" | "已复习" | "掌握";
};

export const DEFAULT_KNOWLEDGE_PATHS: KnowledgePath[] = [
  {
    id: "agent_path",
    label: "Agent Path",
    kind: "glossary",
    slugs: ["cot", "react", "reflexion", "agent", "swe-bench"].map(normalizeSlug),
    description: "CoT -> ReAct -> Reflexion -> Agent -> SWE-bench。",
  },
  {
    id: "rag_path",
    label: "RAG Path",
    kind: "glossary",
    slugs: ["embedding", "vector-database", "retriever", "reranker", "rag-evaluation"].map(normalizeSlug),
    description: "Embedding -> Vector Database -> Retriever -> Reranker -> RAG Evaluation。",
  },
  {
    id: "llm_training_path",
    label: "LLM Training Path",
    kind: "glossary",
    slugs: ["sft", "rlhf", "dpo", "alignment"].map(normalizeSlug),
    description: "SFT -> RLHF -> DPO -> Alignment。",
  },
  {
    id: "ai_industry_path",
    label: "AI Industry Path",
    kind: "radar",
    slugs: ["openai", "anthropic", "google-deepmind", "meta-ai", "mistral", "deepseek"].map(normalizeSlug),
    description: "OpenAI -> Anthropic -> DeepMind -> Meta AI -> Mistral -> DeepSeek。",
  },
  {
    id: "benchmark_path",
    label: "Benchmark Path",
    kind: "radar",
    slugs: ["humaneval", "swe-bench", "swe-agent", "tau-bench"].map(normalizeSlug),
    description: "HumanEval -> SWE-bench -> SWE-agent -> tau-bench。",
  },
];

export function buildRelatedSlugChain(input: string[], candidates: string[]) {
  const set = new Set(input.map(normalizeSlug).filter(Boolean));
  const chain: string[] = [];
  for (const slug of candidates.map(normalizeSlug)) {
    if (!slug) continue;
    if (set.has(slug)) chain.push(slug);
  }
  return chain;
}

export function buildKnowledgePathProgress(args: {
  path: KnowledgePath;
  viewedSlugs?: Set<string>;
  generatedCardIds: Set<string>;
  reviewedCardIds: Set<string>;
  weakCardIds?: Set<string>;
  cardIdForSlug: (slug: string) => string;
}) {
  const items = args.path.slugs.map((slug) => {
    const normalized = normalizeSlug(slug);
    const cardId = args.cardIdForSlug(normalized);
    const viewed = args.viewedSlugs?.has(normalized) ?? false;
    const hasCard = args.generatedCardIds.has(cardId);
    const reviewed = args.reviewedCardIds.has(cardId);
    const weak = args.weakCardIds?.has(cardId) ?? false;
    const mastered = reviewed && !weak;
    return {
      slug: normalized,
      viewed,
      hasCard,
      reviewed,
      weak,
      mastered,
      statusLabel: knowledgePathStatusLabel({ viewed, hasCard, reviewed, weak }),
    } satisfies KnowledgePathItemStatus;
  });
  const viewedCount = items.filter((item) => item.viewed).length;
  const cardCount = items.filter((item) => item.hasCard).length;
  const reviewedCount = items.filter((item) => item.reviewed).length;
  const weakCount = items.filter((item) => item.weak).length;
  const masteredCount = items.filter((item) => item.mastered).length;
  const next =
    items.find((item) => item.weak) ??
    items.find((item) => !item.viewed) ??
    items.find((item) => !item.hasCard) ??
    items.find((item) => !item.reviewed) ??
    items[items.length - 1] ??
    null;
  return {
    ...args.path,
    items,
    viewedCount,
    cardCount,
    reviewedCount,
    weakCount,
    masteredCount,
    nextSlug: next?.slug ?? null,
    nextStatusLabel: next?.statusLabel ?? null,
  };
}

function knowledgePathStatusLabel(args: {
  viewed: boolean;
  hasCard: boolean;
  reviewed: boolean;
  weak: boolean;
}): KnowledgePathItemStatus["statusLabel"] {
  if (args.reviewed && !args.weak) return "掌握";
  if (args.reviewed) return "已复习";
  if (args.hasCard) return "已生成卡片";
  if (args.viewed) return "已查看";
  return "未看";
}
