import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import {
  buildProjectCompletionFlashcards,
  buildProjectCompletionSummary,
  normalizeProjectType,
} from "@/server/projects/base";

/**
 * Completes a project and creates stable review cards from its summary.
 *
 * Args:
 *   args: Current user id and owned project id.
 *
 * Returns:
 *   The completed project id, summary, and generated review cards.
 */
export async function completeLearningProject(args: {
  userId: string;
  projectId: string;
  now?: Date;
}) {
  const now = args.now ?? new Date();
  const project = await prisma.learningProject.findFirst({
    where: { id: args.projectId, userId: args.userId },
    include: { milestones: { orderBy: [{ position: "asc" }] } },
  });
  if (!project) throw new Error("Project not found");

  const allCompleted =
    project.milestones.length > 0 &&
    project.milestones.every((milestone) => milestone.status === "completed");
  if (!allCompleted) throw new Error("Project is not complete");

  const summary =
    project.summary ??
    buildProjectCompletionSummary({
      title: project.title,
      type: normalizeProjectType(project.type),
      completedMilestones: project.milestones,
    });
  const cards = buildProjectCompletionFlashcards({
    projectId: project.id,
    userId: args.userId,
    title: project.title,
    type: normalizeProjectType(project.type),
    summary,
    completedMilestones: project.milestones,
    now,
  });

  await prisma.$transaction(async (tx) => {
    await tx.learningProject.update({
      where: { id: project.id },
      data: {
        status: "completed",
        completedAt: project.completedAt ?? now,
        summary,
      },
    });

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
          dueAt: card.dueAt,
        },
      });
    }
  });

  return {
    projectId: project.id,
    summary,
    cards,
  };
}
