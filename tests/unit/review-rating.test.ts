import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { rateFlashcard } from "@/server/review/actions";

async function createReviewCard(userId: string) {
  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  return await prisma.flashcard.create({
    data: {
      userId,
      front: "What is RAG?",
      back: "Retrieval augmented generation.",
      type: "concept",
      dueAt: new Date("2026-05-25T00:00:00.000Z"),
    },
  });
}

test("rateFlashcard ignores duplicate ratings for a card already moved out of due queue", async () => {
  const userId = `review-rating-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const card = await createReviewCard(userId);
  const now = new Date("2026-05-25T00:00:00.000Z");

  const first = await rateFlashcard({
    userId,
    flashcardId: card.id,
    rating: "good",
    now,
  });
  const duplicate = await rateFlashcard({
    userId,
    flashcardId: card.id,
    rating: "easy",
    now,
  });

  assert.equal(first.applied, true);
  assert.equal(duplicate.applied, false);
  assert.equal(duplicate.reason, "not_due");

  const [updated, logCount] = await Promise.all([
    prisma.flashcard.findUniqueOrThrow({ where: { id: card.id } }),
    prisma.reviewLog.count({ where: { flashcardId: card.id } }),
  ]);

  assert.equal(updated.reviewCount, 1);
  assert.equal(updated.correctCount, 1);
  assert.equal(logCount, 1);
  assert.equal(updated.intervalDays, 7);
});
