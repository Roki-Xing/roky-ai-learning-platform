import type { Prisma } from "@prisma/client";
import { toCodeFeedbackView } from "@/server/coding/view";
import { prisma } from "@/server/db";

export async function getProjectCodeFeedbackSubmissionIds(args: {
  userId: string;
  projectId: string;
}) {
  const milestones = await prisma.projectMilestone.findMany({
    where: {
      userId: args.userId,
      projectId: args.projectId,
      codeSubmissionId: { not: null },
    },
    select: { codeSubmissionId: true },
    orderBy: [{ position: "asc" }],
  });

  return milestones
    .map((milestone) => milestone.codeSubmissionId)
    .filter((id): id is string => Boolean(id));
}

export function buildProjectCodeFeedbackFlashcardWhere(
  userId: string,
  submissionIds: string[],
): Prisma.FlashcardWhereInput {
  return {
    userId,
    tags: { array_contains: ["code-feedback"] },
    OR: submissionIds.map((submissionId) => ({
      id: { startsWith: `code-feedback:${submissionId}:` },
    })),
  };
}

/**
 * Loads code feedback summaries for milestones in an owned project.
 *
 * Args:
 *   args: Current user and project id.
 *
 * Returns:
 *   Linked milestone feedback summaries scoped to the current user.
 */
export async function getProjectMilestoneFeedbackSummaries(args: {
  userId: string;
  projectId: string;
}) {
  const milestones = await prisma.projectMilestone.findMany({
    where: {
      userId: args.userId,
      projectId: args.projectId,
      codeSubmissionId: { not: null },
    },
    select: {
      id: true,
      codeSubmissionId: true,
    },
    orderBy: [{ position: "asc" }],
  });
  const submissionIds = milestones
    .map((milestone) => milestone.codeSubmissionId)
    .filter((id): id is string => Boolean(id));
  if (!submissionIds.length) return [];

  const feedbackRows = await prisma.codeFeedback.findMany({
    where: {
      userId: args.userId,
      submissionId: { in: submissionIds },
    },
    orderBy: [{ updatedAt: "desc" }],
  });
  const feedbackBySubmissionId = new Map(
    feedbackRows.map((feedback) => [feedback.submissionId, feedback]),
  );

  return milestones.flatMap((milestone) => {
    if (!milestone.codeSubmissionId) return [];
    const feedback = feedbackBySubmissionId.get(milestone.codeSubmissionId);
    if (!feedback) return [];
    return [
      {
        milestoneId: milestone.id,
        submissionId: milestone.codeSubmissionId,
        feedback: toCodeFeedbackView(feedback),
      },
    ];
  });
}

/**
 * Summarizes flashcards produced by project milestone code feedback.
 *
 * Args:
 *   args: Current user, owned project id, and optional clock for due checks.
 *
 * Returns:
 *   Total linked code-feedback cards, due count, and focused review href.
 */
export async function getProjectCodeFeedbackCardSummary(args: {
  userId: string;
  projectId: string;
  now?: Date;
}) {
  const now = args.now ?? new Date();
  const submissionIds = await getProjectCodeFeedbackSubmissionIds(args);
  const reviewHref = `/review?source=code-feedback&projectId=${encodeURIComponent(args.projectId)}`;

  if (!submissionIds.length) {
    return { total: 0, due: 0, reviewHref };
  }

  const where = buildProjectCodeFeedbackFlashcardWhere(args.userId, submissionIds);
  const [total, due] = await Promise.all([
    prisma.flashcard.count({ where }),
    prisma.flashcard.count({
      where: {
        ...where,
        dueAt: { lte: now },
      },
    }),
  ]);

  return { total, due, reviewHref };
}
