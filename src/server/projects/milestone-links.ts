import { prisma } from "@/server/db";

/**
 * Validates that optional lesson/note links provided for a project milestone
 * belong to the current user and are part of formal learning records.
 *
 * Security note:
 * - `lessonId`/`noteId` can be tampered in form submissions. Treat them as
 *   untrusted and always validate server-side.
 */
export async function validateMilestoneLinks(args: {
  userId: string;
  lessonId: string | null;
  noteId: string | null;
}) {
  const lessonId = args.lessonId?.trim() || null;
  const noteId = args.noteId?.trim() || null;

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
    if (!ownedPlan) throw new Error("Lesson not available for projects");
  }

  if (noteId) {
    const ownedNote = await prisma.note.findFirst({
      where: { id: noteId, userId: args.userId },
      select: { id: true },
    });
    if (!ownedNote) throw new Error("Note not available for projects");
  }

  return { lessonId, noteId };
}

