import { prisma } from "@/server/db";

/**
 * Summarizes review cards generated from a completed learning project.
 *
 * Args:
 *   args: Current user id, project id, and optional clock for due-card checks.
 *
 * Returns:
 *   Total project cards, due project cards, and the review page href.
 */
export async function getProjectReviewCardSummary(args: {
  userId: string;
  projectId: string;
  now?: Date;
}) {
  const now = args.now ?? new Date();
  const projectCardWhere = {
    userId: args.userId,
    id: { startsWith: `project:${args.projectId}:` },
  };

  const [total, due] = await Promise.all([
    prisma.flashcard.count({ where: projectCardWhere }),
    prisma.flashcard.count({
      where: {
        ...projectCardWhere,
        dueAt: { lte: now },
      },
    }),
  ]);

  return {
    total,
    due,
    reviewHref: `/review?source=project&projectId=${encodeURIComponent(args.projectId)}`,
  };
}
