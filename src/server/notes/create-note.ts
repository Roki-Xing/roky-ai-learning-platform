import { prisma } from "@/server/db";

/**
 * Creates a note scoped to the current user's formal learning records.
 *
 * Args:
 *   args: Current user id, optional visible lesson id, and Markdown note body.
 *
 * Returns:
 *   The persisted note.
 */
export async function createScopedNote(args: {
  userId: string;
  lessonId: string | null;
  title: string;
  content: string;
}) {
  const title = args.title.trim();
  const content = args.content.trim();
  const lessonId = args.lessonId?.trim() || null;

  if (!title) throw new Error("Missing title");
  if (!content) throw new Error("Missing content");

  if (lessonId) {
    const ownedPlan = await prisma.dailyPlan.findFirst({
      where: {
        userId: args.userId,
        lessonId,
        isTest: false,
        archivedAt: null,
      },
      select: { id: true },
    });
    if (!ownedPlan) throw new Error("Lesson not available for notes");
  }

  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });

  return await prisma.note.create({
    data: {
      userId: args.userId,
      lessonId,
      title,
      content,
    },
  });
}
