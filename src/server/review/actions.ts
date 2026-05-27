"use server";

import { prisma } from "@/server/db";
import { requireUserId } from "@/server/auth/user";
import { nextDueAtFromRating, type ReviewRating } from "@/server/review/schedule";
import { revalidatePath } from "next/cache";

export type RateFlashcardResult = {
  applied: boolean;
  reason: "rated" | "not_due";
  nextDueAt: Date;
};

export async function rateFlashcard(args: {
  userId: string;
  flashcardId: string;
  rating: ReviewRating;
  now?: Date;
}): Promise<RateFlashcardResult> {
  const now = args.now ?? new Date();
  const nextDueAt = nextDueAtFromRating({ now, rating: args.rating });
  const intervalDays = Math.max(1, Math.ceil((nextDueAt.getTime() - now.getTime()) / 86400000));

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.flashcard.updateMany({
      where: {
        id: args.flashcardId,
        userId: args.userId,
        dueAt: { lte: now },
      },
      data: {
        dueAt: nextDueAt,
        intervalDays,
        reviewCount: { increment: 1 },
        correctCount: { increment: args.rating === "good" || args.rating === "easy" ? 1 : 0 },
      },
    });

    if (updated.count === 0) {
      const card = await tx.flashcard.findFirst({
        where: { id: args.flashcardId, userId: args.userId },
        select: { dueAt: true },
      });
      if (!card) throw new Error("Not found");
      return { applied: false, reason: "not_due", nextDueAt: card.dueAt };
    }

    await tx.reviewLog.create({
      data: {
        flashcardId: args.flashcardId,
        rating: args.rating,
        nextDueAt,
      },
    });

    return { applied: true, reason: "rated", nextDueAt };
  });
}

export async function rateFlashcardAction(formData: FormData) {
  const userId = await requireUserId();
  const flashcardId = String(formData.get("flashcardId") ?? "");
  const rating = String(formData.get("rating") ?? "") as ReviewRating;
  if (!flashcardId) throw new Error("Missing flashcardId");

  await rateFlashcard({ userId, flashcardId, rating });

  revalidatePath("/review");
  revalidatePath("/progress");
}
