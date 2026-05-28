import { normalizeSlug } from "@/server/knowledge/base";

type KnowledgePath = {
  id: string;
  label: string;
  kind: "glossary" | "radar";
  slugs: string[];
  description: string;
};

export const DEFAULT_KNOWLEDGE_PATHS: KnowledgePath[] = [
  {
    id: "agent_basics",
    label: "Agent 基础链路",
    kind: "glossary",
    slugs: ["cot", "react", "reflexion", "tool-calling", "swe-bench"].map(normalizeSlug),
    description: "从推理提示到工具调用，再到评测：搭建 Agent 的最短认知路径。",
  },
  {
    id: "retrieval_stack",
    label: "RAG 基础链路",
    kind: "glossary",
    slugs: ["rag", "embedding", "vector-database", "reranker"].map(normalizeSlug),
    description: "把检索增强从概念变成可实现的工程栈。",
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
