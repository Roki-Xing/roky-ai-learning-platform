import { prisma } from "@/server/db";

export function resolveVisibleLibraryLessonId(args: {
  requestedLessonId: string | null;
  visibleLessonIds: string[];
}) {
  if (args.requestedLessonId && args.visibleLessonIds.includes(args.requestedLessonId)) {
    return args.requestedLessonId;
  }
  return args.visibleLessonIds[0] ?? null;
}

/**
 * Loads notes that belong to the selected lesson detail panel.
 *
 * Args:
 *   args: Current owner user id and selected lesson id.
 *
 * Returns:
 *   The newest notes for that user and lesson.
 */
export async function getLessonDetailNotes(args: {
  userId: string;
  lessonId: string;
}) {
  return await prisma.note.findMany({
    where: {
      userId: args.userId,
      lessonId: args.lessonId,
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  });
}
