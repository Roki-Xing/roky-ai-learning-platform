import { prisma } from "@/server/db";
import { buildKnowledgeLink, normalizeSlug } from "@/server/knowledge/base";
import { weekdayFromLocalDate } from "@/server/curriculum/domains";

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function firstSourceUrl(value: unknown) {
  if (!Array.isArray(value)) return null;
  const first = value.find(
    (x): x is { url?: string } => typeof x === "object" && x !== null && "url" in x,
  );
  return typeof first?.url === "string" ? first.url : null;
}

function dateDaysBefore(localDate: string, days: number) {
  const d = new Date(`${localDate}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function sourceSlug(value: unknown) {
  if (!value || typeof value !== "object") return null;
  if (!("sourceSlug" in value)) return null;
  const slug = value.sourceSlug;
  return typeof slug === "string" && slug.trim() ? slug.trim() : null;
}

async function recentlyUsedKnowledgeSlugs(args: {
  userId: string;
  localDate: string;
  avoidRecentDays: number;
  isTest?: boolean | null;
}) {
  if (args.avoidRecentDays <= 0) return { terms: new Set<string>(), entities: new Set<string>() };

  const since = dateDaysBefore(args.localDate, args.avoidRecentDays);
  const rows = await prisma.dailyPlan.findMany({
    where: {
      userId: args.userId,
      archivedAt: null,
      localDate: { gte: since, lt: args.localDate },
      ...(typeof args.isTest === "boolean" ? { isTest: args.isTest } : {}),
    },
    select: {
      lesson: { select: { connections: true } },
    },
    orderBy: [{ localDate: "desc" }],
    take: Math.max(1, args.avoidRecentDays * 2),
  });

  const terms = new Set<string>();
  const entities = new Set<string>();
  for (const row of rows) {
    const connections = row.lesson.connections as {
      glossary?: unknown;
      breadth?: unknown;
    } | null;
    const termSlug = sourceSlug(connections?.glossary);
    const entitySlug = sourceSlug(connections?.breadth);
    if (termSlug) terms.add(normalizeSlug(termSlug));
    if (entitySlug) entities.add(normalizeSlug(entitySlug));
  }

  return { terms, entities };
}

export function dailyBreadthRotationForLocalDate(localDate: string) {
  const day = weekdayFromLocalDate(localDate);
  switch (day) {
    case 1:
      return { day, focus: "term" as const, entityTypes: [] as string[] };
    case 2:
      return { day, focus: "person" as const, entityTypes: ["person"] };
    case 3:
      return { day, focus: "company_lab" as const, entityTypes: ["company", "lab"] };
    case 4:
      return { day, focus: "benchmark" as const, entityTypes: ["benchmark"] };
    case 5:
      return { day, focus: "paper" as const, entityTypes: ["paper"] };
    case 6:
      return { day, focus: "tool" as const, entityTypes: ["tool", "open_source_project"] };
    case 0:
    default:
      return { day, focus: "review" as const, entityTypes: [] as string[] };
  }
}

async function pickGlossaryTerm(args: {
  preferredTermSlugs?: string[];
  avoidSlugs?: Set<string>;
}) {
  const avoid = args.avoidSlugs ?? new Set<string>();
  const preferred = args.preferredTermSlugs
    ?.map(normalizeSlug)
    .filter((slug) => Boolean(slug) && !avoid.has(slug)) ?? [];
  const term = preferred.length
    ? await prisma.glossaryTerm.findFirst({
        where: { slug: { in: preferred } },
        orderBy: [{ updatedAt: "asc" }],
      })
    : null;
  return (
    term ??
    (await prisma.glossaryTerm.findFirst({
      where: avoid.size ? { slug: { notIn: [...avoid] } } : undefined,
      orderBy: [{ updatedAt: "asc" }, { difficulty: "asc" }, { slug: "asc" }],
    }))
  );
}

async function pickEntity(args: {
  entityTypes: string[];
  preferredEntitySlugs?: string[];
  avoidSlugs?: Set<string>;
}) {
  const avoid = args.avoidSlugs ?? new Set<string>();
  const preferred = args.preferredEntitySlugs
    ?.map(normalizeSlug)
    .filter((slug) => Boolean(slug) && !avoid.has(slug)) ?? [];
  const whereType = args.entityTypes.length ? { type: { in: args.entityTypes } } : {};
  const preferredEntity = preferred.length
    ? await prisma.knowledgeEntity.findFirst({
        where: { ...whereType, slug: { in: preferred } },
        orderBy: [{ lastVerifiedAt: "desc" }, { updatedAt: "asc" }],
      })
    : null;
  return (
    preferredEntity ??
    (await prisma.knowledgeEntity.findFirst({
      where: {
        ...whereType,
        ...(avoid.size ? { slug: { notIn: [...avoid] } } : {}),
      },
      orderBy: [{ confidence: "desc" }, { lastVerifiedAt: "desc" }, { updatedAt: "asc" }],
    }))
  );
}

export async function selectDailyKnowledgeFocus(args: {
  userId: string;
  localDate: string;
  preferredTermSlugs?: string[];
  preferredEntitySlugs?: string[];
  avoidRecentDays?: number;
  isTest?: boolean | null;
}) {
  const rotation = dailyBreadthRotationForLocalDate(args.localDate);
  const avoid = await recentlyUsedKnowledgeSlugs({
    userId: args.userId,
    localDate: args.localDate,
    avoidRecentDays: args.avoidRecentDays ?? 7,
    isTest: args.isTest ?? null,
  });
  const glossary = await pickGlossaryTerm({
    preferredTermSlugs: args.preferredTermSlugs,
    avoidSlugs: avoid.terms,
  });
  const entity =
    rotation.entityTypes.length > 0
      ? await pickEntity({
          entityTypes: rotation.entityTypes,
          preferredEntitySlugs: args.preferredEntitySlugs,
          avoidSlugs: avoid.entities,
        })
      : null;

  const breadth = entity
    ? {
        sourceKind: "radar" as const,
        type: entity.type,
        name: entity.name,
        slug: entity.slug,
        oneLine: entity.oneLine,
        whyImportant: entity.whyImportant,
        representativeWorks: entity.representativeWorks,
        relatedTerms: entity.relatedTerms,
        sourceRefs: entity.sourceRefs,
        selfCheckQuestion: entity.selfCheckQuestion,
      }
    : glossary
      ? {
          sourceKind: "glossary" as const,
          type: "concept",
          name: glossary.fullName,
          slug: glossary.slug,
          oneLine: glossary.oneLine,
          whyImportant: glossary.whyImportant,
          representativeWorks: glossary.examples,
          relatedTerms: glossary.relatedTerms,
          sourceRefs: glossary.sourceRefs,
          selfCheckQuestion: `${glossary.abbreviation ?? glossary.fullName} 最容易被误解成什么？`,
        }
      : null;

  return {
    userId: args.userId,
    localDate: args.localDate,
    rotation,
    avoidRecentDays: args.avoidRecentDays ?? 7,
    avoided: {
      glossarySlugs: [...avoid.terms],
      entitySlugs: [...avoid.entities],
    },
    glossary: glossary
      ? {
          slug: glossary.slug,
          term: glossary.abbreviation ?? glossary.fullName,
          fullName: glossary.fullName,
          oneLine: glossary.oneLine,
          explanation: glossary.explanation,
          whyImportant: glossary.whyImportant ?? "",
          relatedTerms: strings(glossary.relatedTerms),
          commonMistakes: strings(glossary.commonMistakes),
          examples: strings(glossary.examples),
          sourceUrl: firstSourceUrl(glossary.sourceRefs),
        }
      : null,
    breadth: breadth
      ? {
          slug: breadth.slug,
          kind: breadth.type,
          title: breadth.name,
          oneLine: breadth.oneLine,
          whyItMatters: breadth.whyImportant ?? "",
          representativeWorks: strings(breadth.representativeWorks),
          relatedTerms: strings(breadth.relatedTerms),
          selfCheckQuestion: breadth.selfCheckQuestion ?? "",
          sourceUrl: firstSourceUrl(breadth.sourceRefs),
        }
      : null,
    links: {
      glossary: glossary ? buildKnowledgeLink({ kind: "glossary", slug: glossary.slug }) : null,
      radar:
        breadth?.sourceKind === "radar"
          ? buildKnowledgeLink({ kind: "radar", slug: breadth.slug })
          : null,
    },
  };
}

export function buildKnowledgeCardsFromFocus(
  focus: Awaited<ReturnType<typeof selectDailyKnowledgeFocus>>,
) {
  return {
    glossary: focus.glossary
      ? {
          term: focus.glossary.term,
          oneLine: focus.glossary.oneLine,
          definition: focus.glossary.explanation,
          whyItMatters: focus.glossary.whyImportant,
          relatedTerms: focus.glossary.relatedTerms,
          commonMistakes: focus.glossary.commonMistakes,
          selfCheckQuestion:
            focus.glossary.commonMistakes[0] ??
            `用一句话解释 ${focus.glossary.term}。`,
          sourceSlug: focus.glossary.slug,
          sourceUrl: focus.links.glossary,
          externalSourceUrl: focus.glossary.sourceUrl,
        }
      : null,
    breadth: focus.breadth
      ? {
          kind: focus.breadth.kind,
          title: focus.breadth.title,
          oneLine: focus.breadth.oneLine,
          whyItMatters: focus.breadth.whyItMatters,
          representativeWorks: focus.breadth.representativeWorks,
          relatedTerms: focus.breadth.relatedTerms,
          selfCheckQuestion: focus.breadth.selfCheckQuestion,
          sourceSlug: focus.breadth.slug,
          sourceUrl: focus.links.radar ?? focus.links.glossary,
          externalSourceUrl: focus.breadth.sourceUrl,
        }
      : null,
  };
}
