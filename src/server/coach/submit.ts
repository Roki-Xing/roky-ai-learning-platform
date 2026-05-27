import { Prisma } from "@prisma/client";
import {
  buildThoughtReviewFlashcards,
  generateThoughtReview,
  parseStoredThoughtReview,
  type ThoughtReviewResult,
} from "@/server/ai/thought-review";
import { buildCoachContext } from "@/server/coach/context";
import { prisma } from "@/server/db";

const MODES = new Set([
  "today_lesson",
  "concept_question",
  "code_reasoning",
  "algorithm_design",
  "glossary_term",
  "industry_radar",
  "free_thought",
]);

export function normalizeCoachMode(value: string | null | undefined) {
  const mode = (value ?? "").trim();
  return MODES.has(mode) ? mode : "free_thought";
}

type CoachHighSeverityIssue = ThoughtReviewResult["possibleIssues"][number] & {
  sourceIndex: number;
};

function highSeverityCoachIssues(review: ThoughtReviewResult): CoachHighSeverityIssue[] {
  return review.possibleIssues
    .map((issue, sourceIndex) => ({ ...issue, sourceIndex }))
    .filter((issue) => issue.severity === "high");
}

async function persistCoachMisconceptions(args: {
  userId: string;
  reviewId: string;
  lessonId: string | null;
  mode: string;
  rawText: string;
  review: ThoughtReviewResult;
}) {
  if (!args.lessonId) return 0;

  const issues = highSeverityCoachIssues(args.review);
  if (!issues.length) return 0;

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: args.lessonId,
      dailyPlans: {
        some: { userId: args.userId, isTest: false, archivedAt: null },
      },
    },
    select: {
      id: true,
      topicId: true,
      dailyPlans: {
        where: { userId: args.userId, isTest: false, archivedAt: null },
        orderBy: [{ localDate: "desc" }],
        take: 1,
        select: { localDate: true },
      },
    },
  });
  if (!lesson) return 0;

  const now = new Date();
  const localDate = lesson.dailyPlans[0]?.localDate ?? null;

  await prisma.$transaction(async (tx) => {
    for (const issue of issues) {
      await tx.misconception.upsert({
        where: { sourceKey: `coach:${args.reviewId}:${issue.sourceIndex}` },
        update: {
          lessonId: lesson.id,
          topicId: lesson.topicId,
          localDate,
          source: "coach",
          summary: issue.issue,
          prompt: args.rawText,
          userAnswer: {
            thought: args.rawText,
            mode: args.mode,
          } as Prisma.InputJsonValue,
          explanation: issue.explanation,
          status: "open",
          occurrenceCount: { increment: 1 },
          lastAttemptAt: now,
          resolvedAt: null,
        },
        create: {
          userId: args.userId,
          questionId: null,
          codeSubmissionId: null,
          lessonId: lesson.id,
          topicId: lesson.topicId,
          localDate,
          source: "coach",
          sourceKey: `coach:${args.reviewId}:${issue.sourceIndex}`,
          summary: issue.issue,
          prompt: args.rawText,
          userAnswer: {
            thought: args.rawText,
            mode: args.mode,
          } as Prisma.InputJsonValue,
          explanation: issue.explanation,
        },
      });
    }

    if (lesson.topicId) {
      await tx.userTopicState.upsert({
        where: { userId_topicId: { userId: args.userId, topicId: lesson.topicId } },
        update: {
          exposureCount: { increment: issues.length },
          weaknessScore: { increment: issues.length },
          lastStudiedAt: now,
        },
        create: {
          userId: args.userId,
          topicId: lesson.topicId,
          exposureCount: issues.length,
          weaknessScore: issues.length,
          lastStudiedAt: now,
        },
      });
    }
  });

  return issues.length;
}

/**
 * Creates a persisted ThoughtReview from the current user's learning context.
 *
 * Args:
 *   args: User, mode, raw thought text, and optional lesson binding.
 *
 * Returns:
 *   The persisted review id, linked lesson id, provider, and structured review.
 */
export async function createThoughtReview(args: {
  userId: string;
  mode: string;
  rawText: string;
  includeTodayLesson: boolean;
  lessonId?: string | null;
  reviewJsonExtra?: Record<string, unknown>;
}) {
  const rawText = args.rawText.trim();
  if (!rawText) throw new Error("Missing thought text");
  if (rawText.length > 10_000) throw new Error("Thought text is too long");

  const mode = normalizeCoachMode(args.mode);
  const context = await buildCoachContext({
    userId: args.userId,
    mode,
    includeTodayLesson: args.includeTodayLesson,
    lessonId: args.lessonId ?? null,
  });
  const generated = await generateThoughtReview({
    userId: args.userId,
    mode,
    rawText,
    lessonTitle: context.lessonTitle,
    contextSummary: context.summary,
  });

  const row = await prisma.thoughtReview.create({
    data: {
      userId: args.userId,
      lessonId: context.lessonId,
      mode,
      rawText,
      normalizedText: generated.review.normalizedText,
      mainClaim: generated.review.mainClaim,
      reviewJson: {
        provider: generated.provider,
        ...(args.reviewJsonExtra ?? {}),
        ...generated.review,
        raw: generated.raw ?? null,
      } as Prisma.InputJsonValue,
      generatedCards: generated.review.flashcards as Prisma.InputJsonValue,
    },
    select: { id: true, lessonId: true, mode: true },
  });

  await persistCoachMisconceptions({
    userId: args.userId,
    reviewId: row.id,
    lessonId: row.lessonId,
    mode,
    rawText,
    review: generated.review,
  });

  return {
    reviewId: row.id,
    lessonId: row.lessonId,
    mode: row.mode,
    provider: generated.provider,
    review: generated.review,
  };
}

/**
 * Generates stable flashcards for a ThoughtReview without creating duplicates.
 *
 * Args:
 *   args: Review id, owner user id, and optional extra tags.
 *
 * Returns:
 *   The generated card payloads and count written by idempotent upserts.
 */
export async function generateFlashcardsForThoughtReview(args: {
  userId: string;
  reviewId: string;
  extraTags?: string[];
}) {
  const reviewRow = await prisma.thoughtReview.findFirst({
    where: { id: args.reviewId, userId: args.userId },
    select: { id: true, lessonId: true, reviewJson: true },
  });
  if (!reviewRow) throw new Error("ThoughtReview not found");

  const review: ThoughtReviewResult = parseStoredThoughtReview(reviewRow.reviewJson);
  const extraTags = args.extraTags ?? [];
  const cards = buildThoughtReviewFlashcards({
    reviewId: reviewRow.id,
    userId: args.userId,
    lessonId: reviewRow.lessonId,
    review,
  }).map((card) => ({
    ...card,
    tags: [...extraTags, ...card.tags],
  }));

  await prisma.$transaction(async (tx) => {
    for (const card of cards) {
      await tx.flashcard.upsert({
        where: { id: card.id },
        update: {
          front: card.front,
          back: card.back,
          type: card.type,
          tags: card.tags as Prisma.InputJsonValue,
        },
        create: {
          id: card.id,
          userId: card.userId,
          lessonId: card.lessonId,
          front: card.front,
          back: card.back,
          type: card.type,
          tags: card.tags as Prisma.InputJsonValue,
        },
      });
    }

    await tx.thoughtReview.update({
      where: { id: reviewRow.id },
      data: { generatedCards: cards as Prisma.InputJsonValue },
    });
  });

  return {
    reviewId: reviewRow.id,
    cards,
    createdOrUpdatedCount: cards.length,
  };
}
