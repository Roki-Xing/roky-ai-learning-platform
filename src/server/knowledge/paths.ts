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
  statusLabel: "未看过" | "已看过" | "已制卡" | "已复习" | "未掌握";
};

export const DEFAULT_KNOWLEDGE_PATHS: KnowledgePath[] = [
  {
    id: "agent_basics",
    label: "Agent 基础链路",
    kind: "glossary",
    slugs: ["cot", "react", "reflexion", "agent", "swe-bench"].map(normalizeSlug),
    description: "从推理提示到工具调用，再到评测：搭建 Agent 的最短认知路径。",
  },
  {
    id: "retrieval_stack",
    label: "RAG 基础链路",
    kind: "glossary",
    slugs: ["embedding", "vector-database", "bm25", "reranker", "rag"].map(normalizeSlug),
    description: "把检索增强从概念变成可实现的工程栈。",
  },
  {
    id: "ai_org_landscape",
    label: "AI 组织与生态链路",
    kind: "radar",
    slugs: ["openai", "anthropic", "google-deepmind", "hugging-face", "cursor"].map(normalizeSlug),
    description: "从模型公司、研究实验室到工具生态，建立行业广度坐标。",
  },
  {
    id: "coding_benchmark_path",
    label: "代码能力评测链路",
    kind: "radar",
    slugs: ["humaneval", "swe-bench", "langchain"].map(normalizeSlug),
    description: "从函数题到真实 issue，再到 Agent 应用框架，理解代码模型评测边界。",
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
    return {
      slug: normalized,
      viewed,
      hasCard,
      reviewed,
      weak,
      statusLabel: knowledgePathStatusLabel({ viewed, hasCard, reviewed, weak }),
    } satisfies KnowledgePathItemStatus;
  });
  const viewedCount = items.filter((item) => item.viewed).length;
  const cardCount = items.filter((item) => item.hasCard).length;
  const reviewedCount = items.filter((item) => item.reviewed).length;
  const weakCount = items.filter((item) => item.weak).length;
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
  if (args.weak) return "未掌握";
  if (args.reviewed) return "已复习";
  if (args.hasCard) return "已制卡";
  if (args.viewed) return "已看过";
  return "未看过";
}
