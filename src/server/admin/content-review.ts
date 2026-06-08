export type FlashcardQualityInput = {
  id: string;
  front: string;
  back: string;
  tags: unknown;
  reviewCount: number;
  type: string;
  lessonId: string | null;
  createdAt: Date;
};

export type FlashcardQualityReviewItem = {
  id: string;
  front: string;
  type: string;
  lessonId: string | null;
  reviewCount: number;
  reasons: string[];
};

export type FlashcardQualitySummary = {
  scannedCount: number;
  longCardCount: number;
  shortAnswerCount: number;
  duplicateFrontCount: number;
  missingTagsCount: number;
  unreviewedCount: number;
  reviewItems: FlashcardQualityReviewItem[];
};

export type KnowledgeVerificationGlossaryInput = {
  id: string;
  slug: string;
  fullName: string;
  category: string;
  sourceRefs: unknown;
  updatedAt: Date;
};

export type KnowledgeVerificationRadarInput = {
  id: string;
  slug: string;
  name: string;
  type: string;
  confidence: string | null;
  sourceRefs: unknown;
  lastVerifiedAt: Date | null;
  updatedAt: Date;
};

export type KnowledgeVerificationReviewItem = {
  id: string;
  kind: "glossary" | "radar";
  slug: string;
  title: string;
  category: string;
  href: string;
  reasons: string[];
  updatedAt: Date;
};

export type KnowledgeVerificationQueueSummary = {
  glossaryMissingSourceCount: number;
  radarMissingSourceCount: number;
  radarStaleVerificationCount: number;
  radarLowConfidenceCount: number;
  reviewItems: KnowledgeVerificationReviewItem[];
};

export type DuplicateDailyPlanTopicInput = {
  id: string;
  localDate: string;
  selectedDomain: string | null;
  selectedTopic: string | null;
  lessonTitle: string;
  status: string;
  source: string | null;
  isTest: boolean;
  archivedAt: Date | null;
};

export type DuplicateDailyPlanTopicReviewItem = {
  topicKey: string;
  topicLabel: string;
  domain: string | null;
  count: number;
  dateRange: string;
  planIds: string[];
  reasons: string[];
  plans: Array<{
    id: string;
    localDate: string;
    lessonTitle: string;
    status: string;
    source: string | null;
    isTest: boolean;
  }>;
};

export type DuplicateDailyPlanTopicSummary = {
  scannedCount: number;
  duplicateTopicCount: number;
  repeatedPlanCount: number;
  reviewItems: DuplicateDailyPlanTopicReviewItem[];
};

const LONG_CARD_FRONT_LENGTH = 180;
const LONG_CARD_BACK_LENGTH = 700;
const MIN_BACK_LENGTH = 32;
const STALE_VERIFICATION_DAYS = 120;

function textLength(value: string) {
  return value.trim().replace(/\s+/g, " ").length;
}

function tagsArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function normalizeFront(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeTopic(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

function hasSourceRef(value: unknown) {
  if (!Array.isArray(value)) return false;
  return value.some((item) => {
    if (!item || typeof item !== "object") return false;
    const record = item as Record<string, unknown>;
    return (
      (typeof record.title === "string" && record.title.trim().length > 0) ||
      (typeof record.url === "string" && record.url.trim().length > 0)
    );
  });
}

function daysBetween(later: Date, earlier: Date) {
  return Math.floor((later.getTime() - earlier.getTime()) / 86_400_000);
}

function sortByReasonPressure<T extends { reasons: string[]; updatedAt?: Date; kind?: string }>(
  a: T,
  b: T,
) {
  const pressure = b.reasons.length - a.reasons.length;
  if (pressure !== 0) return pressure;
  if (a.kind !== b.kind) return a.kind === "radar" ? -1 : 1;
  return (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0);
}

/**
 * Builds an admin queue for repeated generated study topics.
 *
 * Args:
 *   plans: Recent DailyPlan rows already scoped to the current user.
 *   take: Maximum duplicate-topic groups to expose.
 *
 * Returns:
 *   Aggregate duplicate-topic counts plus recent repeated topic groups.
 */
export function summarizeDuplicateDailyPlanTopics(
  plans: DuplicateDailyPlanTopicInput[],
  take = 6,
): DuplicateDailyPlanTopicSummary {
  const activePlans = plans.filter((plan) => !plan.archivedAt);
  const groups = new Map<string, DuplicateDailyPlanTopicInput[]>();

  for (const plan of activePlans) {
    const topicKey = normalizeTopic(plan.selectedTopic) || normalizeTopic(plan.lessonTitle);
    if (!topicKey) continue;
    groups.set(topicKey, [...(groups.get(topicKey) ?? []), plan]);
  }

  const reviewItems = [...groups.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([topicKey, items]) => {
      const sorted = [...items].sort((a, b) =>
        b.localDate.localeCompare(a.localDate) || b.id.localeCompare(a.id),
      );
      const ascendingDates = [...new Set(sorted.map((item) => item.localDate))].sort();
      const firstDate = ascendingDates[0] ?? "-";
      const lastDate = ascendingDates[ascendingDates.length - 1] ?? firstDate;
      return {
        topicKey,
        topicLabel: topicKey,
        domain: sorted.find((item) => item.selectedDomain)?.selectedDomain ?? null,
        count: sorted.length,
        dateRange: firstDate === lastDate ? firstDate : `${firstDate} -> ${lastDate}`,
        planIds: sorted.map((item) => item.id),
        reasons: ["重复主题", `最近 ${sorted.length} 次`],
        plans: sorted.map((item) => ({
          id: item.id,
          localDate: item.localDate,
          lessonTitle: item.lessonTitle,
          status: item.status,
          source: item.source,
          isTest: item.isTest,
        })),
      };
    })
    .sort((a, b) => b.count - a.count || b.dateRange.localeCompare(a.dateRange))
    .slice(0, take);

  return {
    scannedCount: plans.length,
    duplicateTopicCount: reviewItems.length,
    repeatedPlanCount: reviewItems.reduce((sum, item) => sum + item.count, 0),
    reviewItems,
  };
}

/**
 * Builds the admin flashcard review queue from already scoped card rows.
 *
 * Args:
 *   cards: Flashcards owned by the current user.
 *   take: Maximum queue items to expose.
 *
 * Returns:
 *   Aggregate quality counts plus high-pressure review items.
 */
export function summarizeFlashcardQuality(
  cards: FlashcardQualityInput[],
  take = 8,
): FlashcardQualitySummary {
  const frontCounts = new Map<string, number>();
  for (const card of cards) {
    const key = normalizeFront(card.front);
    if (key) frontCounts.set(key, (frontCounts.get(key) ?? 0) + 1);
  }

  let longCardCount = 0;
  let shortAnswerCount = 0;
  let duplicateFrontCount = 0;
  let missingTagsCount = 0;
  let unreviewedCount = 0;

  const reviewItems = cards.flatMap((card) => {
    const reasons: string[] = [];
    const frontLength = textLength(card.front);
    const backLength = textLength(card.back);
    const duplicate = (frontCounts.get(normalizeFront(card.front)) ?? 0) > 1;

    if (frontLength > LONG_CARD_FRONT_LENGTH || backLength > LONG_CARD_BACK_LENGTH) {
      longCardCount += 1;
      reasons.push("过长卡片");
    }
    if (backLength < MIN_BACK_LENGTH) {
      shortAnswerCount += 1;
      reasons.push("答案过短");
    }
    if (duplicate) {
      duplicateFrontCount += 1;
      reasons.push("重复 front");
    }
    if (tagsArray(card.tags).length === 0) {
      missingTagsCount += 1;
      reasons.push("缺少 tags");
    }
    if (card.reviewCount === 0) {
      unreviewedCount += 1;
      reasons.push("从未复习");
    }

    return reasons.length
      ? [{
          id: card.id,
          front: card.front,
          type: card.type,
          lessonId: card.lessonId,
          reviewCount: card.reviewCount,
          reasons,
          updatedAt: card.createdAt,
        }]
      : [];
  }).sort(sortByReasonPressure);

  return {
    scannedCount: cards.length,
    longCardCount,
    shortAnswerCount,
    duplicateFrontCount,
    missingTagsCount,
    unreviewedCount,
    reviewItems: reviewItems.slice(0, take).map((item) => ({
      id: item.id,
      front: item.front,
      type: item.type,
      lessonId: item.lessonId,
      reviewCount: item.reviewCount,
      reasons: item.reasons,
    })),
  };
}

/**
 * Builds the admin source-verification queue for Glossary and Radar records.
 *
 * Args:
 *   now: Reference time for stale verification checks.
 *   glossaryTerms: Glossary rows to scan.
 *   radarEntities: Radar rows to scan.
 *   staleAfterDays: Days after which Radar verification is considered stale.
 *   take: Maximum queue items to expose.
 *
 * Returns:
 *   Aggregate source-review counts plus high-pressure review items.
 */
export function summarizeKnowledgeVerificationQueue(args: {
  now: Date;
  glossaryTerms: KnowledgeVerificationGlossaryInput[];
  radarEntities: KnowledgeVerificationRadarInput[];
  staleAfterDays?: number;
  take?: number;
}): KnowledgeVerificationQueueSummary {
  const staleAfterDays = args.staleAfterDays ?? STALE_VERIFICATION_DAYS;
  let glossaryMissingSourceCount = 0;
  let radarMissingSourceCount = 0;
  let radarStaleVerificationCount = 0;
  let radarLowConfidenceCount = 0;

  const glossaryItems = args.glossaryTerms.flatMap((term) => {
    if (hasSourceRef(term.sourceRefs)) return [];
    glossaryMissingSourceCount += 1;
    return [{
      id: term.id,
      kind: "glossary" as const,
      slug: term.slug,
      title: term.fullName,
      category: term.category,
      href: `/glossary?term=${encodeURIComponent(term.slug)}`,
      reasons: ["缺少来源"],
      updatedAt: term.updatedAt,
    }];
  });

  const radarItems = args.radarEntities.flatMap((entity) => {
    const reasons: string[] = [];
    const hasSource = hasSourceRef(entity.sourceRefs);

    if (!hasSource) {
      radarMissingSourceCount += 1;
      reasons.push("缺少来源");
    }
    if (!entity.lastVerifiedAt) {
      reasons.push("未验证");
    } else if (hasSource && daysBetween(args.now, entity.lastVerifiedAt) > staleAfterDays) {
      radarStaleVerificationCount += 1;
      reasons.push("来源过期");
    }
    if (entity.confidence === "low") {
      radarLowConfidenceCount += 1;
      reasons.push("低置信度");
    }

    return reasons.length
      ? [{
          id: entity.id,
          kind: "radar" as const,
          slug: entity.slug,
          title: entity.name,
          category: entity.type,
          href: `/radar?entity=${encodeURIComponent(entity.slug)}`,
          reasons,
          updatedAt: entity.updatedAt,
        }]
      : [];
  });

  return {
    glossaryMissingSourceCount,
    radarMissingSourceCount,
    radarStaleVerificationCount,
    radarLowConfidenceCount,
    reviewItems: [...radarItems, ...glossaryItems]
      .sort(sortByReasonPressure)
      .slice(0, args.take ?? 8),
  };
}
