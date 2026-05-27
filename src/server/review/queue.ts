import { prisma } from "@/server/db";
import {
  buildProjectCodeFeedbackFlashcardWhere,
  getProjectCodeFeedbackSubmissionIds,
} from "@/server/projects/code-feedback-summary";
import { buildReviewableFlashcardWhere, type ReviewSource } from "@/server/review/filter";

export async function getDueFlashcards(args: {
  userId: string;
  now?: Date;
  source?: ReviewSource | null;
  projectId?: string | null;
}) {
  const now = args.now ?? new Date();
  if (args.source === "code-feedback" && args.projectId) {
    const submissionIds = await getProjectCodeFeedbackSubmissionIds({
      userId: args.userId,
      projectId: args.projectId,
    });
    if (!submissionIds.length) return [];

    return await prisma.flashcard.findMany({
      where: {
        ...buildProjectCodeFeedbackFlashcardWhere(args.userId, submissionIds),
        dueAt: { lte: now },
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
      take: 50,
    });
  }

  return await prisma.flashcard.findMany({
    where: {
      ...buildReviewableFlashcardWhere(args.userId, {
        source: args.source,
        projectId: args.projectId,
      }),
      dueAt: { lte: now },
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
    take: 50,
  });
}
