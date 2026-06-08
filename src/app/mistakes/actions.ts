"use server";

import { revalidatePath } from "next/cache";
import { assertWritableRequest } from "@/server/auth/preview";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { asJson } from "@/server/knowledge/base";
import { buildReviewCardForMistake } from "@/server/mistakes/view";

export async function generateMistakeReviewCardAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const mistakeId = String(formData.get("mistakeId") ?? "");
  if (!mistakeId) throw new Error("Missing mistakeId");

  const mistake = await prisma.misconception.findFirst({
    where: { id: mistakeId, userId },
    select: {
      id: true,
      userId: true,
      lessonId: true,
      source: true,
      summary: true,
      prompt: true,
      explanation: true,
      userAnswer: true,
    },
  });
  if (!mistake) throw new Error("Mistake not found");

  const card = buildReviewCardForMistake(mistake);
  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  await prisma.flashcard.createMany({
    data: [
      {
        id: card.id,
        userId: card.userId,
        lessonId: card.lessonId,
        front: card.front,
        back: card.back,
        type: card.type,
        tags: asJson(card.tags),
        dueAt: card.dueAt,
      },
    ],
    skipDuplicates: true,
  });

  revalidatePath("/mistakes");
  revalidatePath("/review");
  revalidatePath("/progress");
}

export async function markMistakeResolvedAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const mistakeId = String(formData.get("mistakeId") ?? "");
  if (!mistakeId) throw new Error("Missing mistakeId");

  await prisma.misconception.updateMany({
    where: { id: mistakeId, userId, status: { in: ["open", "active"] } },
    data: { status: "resolved", resolvedAt: new Date() },
  });

  revalidatePath("/mistakes");
  revalidatePath("/progress");
  revalidatePath("/map");
  revalidatePath("/path");
  revalidatePath("/weekly");
}
