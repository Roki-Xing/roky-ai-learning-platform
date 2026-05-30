import type { Prisma } from "@prisma/client";

export const STANDALONE_REVIEW_SOURCE_TAGS = [
  "glossary",
  "radar",
  "voice-note",
  "thought-review",
  "project",
] as const;

export const REVIEW_SOURCES = [
  ...STANDALONE_REVIEW_SOURCE_TAGS,
  "code-feedback",
] as const;

export type ReviewSource = (typeof REVIEW_SOURCES)[number];

export function normalizeReviewSource(value: unknown): ReviewSource | null {
  if (typeof value !== "string") return null;
  return REVIEW_SOURCES.includes(value as ReviewSource)
    ? (value as ReviewSource)
    : null;
}

export function hasStandaloneReviewSourceTag(tags: unknown) {
  if (!Array.isArray(tags)) return false;
  return tags.some(
    (tag) =>
      typeof tag === "string" &&
      STANDALONE_REVIEW_SOURCE_TAGS.includes(
        tag as (typeof STANDALONE_REVIEW_SOURCE_TAGS)[number],
      ),
  );
}

export function buildReviewableFlashcardWhere(
  userId: string,
  options?: { source?: ReviewSource | null; projectId?: string | null },
): Prisma.FlashcardWhereInput {
  if (options?.source) {
    const where: Prisma.FlashcardWhereInput = {
      userId,
      tags: { array_contains: [options.source] },
    };

    if (
      options.source !== "code-feedback" &&
      options.source !== "thought-review" &&
      options.source !== "voice-note"
    ) {
      where.lessonId = null;
    }

    if (options.source === "project" && options.projectId) {
      where.id = { startsWith: `project:${options.projectId}:` };
    }

    return where;
  }

  const officialLessonFilter = {
    dailyPlans: { some: { userId, isTest: false, archivedAt: null } },
  };

  return {
    userId,
    OR: [
      { lesson: { is: officialLessonFilter } },
      ...STANDALONE_REVIEW_SOURCE_TAGS.map((tag) => ({
        lessonId: null,
        tags: { array_contains: [tag] },
      })),
    ],
  };
}
