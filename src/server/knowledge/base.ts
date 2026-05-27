import type { Prisma } from "@prisma/client";

export type GlossarySeedTerm = {
  slug: string;
  abbreviation?: string;
  fullName: string;
  chineseName?: string;
  category: string;
  oneLine: string;
  explanation: string;
  whyImportant: string;
  relatedTerms: string[];
  commonMistakes: string[];
  examples: string[];
  sourceRefs: Array<{ title: string; url: string }>;
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type KnowledgeEntityType =
  | "person"
  | "company"
  | "lab"
  | "paper"
  | "benchmark"
  | "tool"
  | "open_source_project"
  | "concept";

export type KnowledgeEntitySeed = {
  type: KnowledgeEntityType;
  name: string;
  slug: string;
  aliases: string[];
  oneLine: string;
  whyImportant: string;
  representativeWorks: string[];
  relatedTerms: string[];
  timeline: Array<{ year: string; event: string }>;
  sourceRefs: Array<{ title: string; url: string }>;
  lastVerifiedAt: string;
  confidence: "low" | "medium" | "high";
  selfCheckQuestion: string;
};

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['".()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildKnowledgeLink(args: { kind: "glossary" | "radar"; slug: string }) {
  const slug = encodeURIComponent(args.slug);
  return args.kind === "glossary" ? `/glossary?term=${slug}` : `/radar?entity=${slug}`;
}

function hasSourceRef(value: unknown) {
  if (!Array.isArray(value)) return false;
  return value.some((ref) => {
    if (typeof ref !== "object" || ref === null) return false;
    const record = ref as Record<string, unknown>;
    return (
      (typeof record.url === "string" && record.url.trim().length > 0) ||
      (typeof record.title === "string" && record.title.trim().length > 0)
    );
  });
}

export function knowledgeEntityVerificationBadge(args: {
  sourceRefs: unknown;
  lastVerifiedAt: Date | string | null;
  confidence: string | null;
}) {
  if (!hasSourceRef(args.sourceRefs)) return "needs_verification";
  if (!args.lastVerifiedAt) return "needs_verification";
  return "verified";
}

export function knowledgeEntityVerificationTags(args: {
  sourceRefs: unknown;
  lastVerifiedAt: Date | string | null;
  confidence: string | null;
}) {
  return [
    knowledgeEntityVerificationBadge(args),
    `confidence:${args.confidence ?? "unknown"}`,
  ];
}

function compactTags(kind: "glossary" | "radar", tags: string[]) {
  return [kind, ...tags.filter(Boolean)].slice(0, 6);
}

export function buildGlossaryFlashcard(args: {
  userId: string;
  slug: string;
  front: string;
  back: string;
  tags?: string[];
}) {
  return {
    id: `glossary:${args.userId}:${args.slug}`,
    userId: args.userId,
    lessonId: null,
    front: args.front,
    back: args.back,
    type: "term",
    tags: compactTags("glossary", args.tags ?? []),
    dueAt: new Date(),
  };
}

export function buildEntityFlashcard(args: {
  userId: string;
  slug: string;
  front: string;
  back: string;
  tags?: string[];
}) {
  return {
    id: `radar:${args.userId}:${args.slug}`,
    userId: args.userId,
    lessonId: null,
    front: args.front,
    back: args.back,
    type: "benchmark",
    tags: compactTags("radar", args.tags ?? []),
    dueAt: new Date(),
  };
}

export function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export { DEFAULT_GLOSSARY_TERMS, DEFAULT_KNOWLEDGE_ENTITIES } from "@/server/knowledge/seeds";
