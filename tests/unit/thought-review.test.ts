import test from "node:test";
import assert from "node:assert/strict";
import {
  buildThoughtReviewFlashcards,
  fallbackThoughtReview,
  parseStoredThoughtReview,
  ThoughtReviewSchema,
} from "@/server/ai/thought-review";

test("fallbackThoughtReview produces a valid structured review", () => {
  const review = fallbackThoughtReview({
    mode: "concept_question",
    rawText: "我觉得 attention 就是把所有 token 平均一下。",
    lessonTitle: "Transformer 的最小工作原理",
  });

  const parsed = ThoughtReviewSchema.safeParse(review);
  assert.equal(parsed.success, true, parsed.success ? "" : parsed.error.message);
  assert.equal(review.mainClaim.includes("attention"), true);
  assert.ok(review.possibleIssues.length >= 1);
  assert.ok(review.socraticQuestions.length >= 1);
});

test("buildThoughtReviewFlashcards maps review flashcards to source-keyed cards", () => {
  const review = fallbackThoughtReview({
    mode: "code_reasoning",
    rawText: "softmax 只要 exp 后直接返回就行。",
    lessonTitle: "Softmax 练习",
  });

  const cards = buildThoughtReviewFlashcards({
    reviewId: "review-1",
    userId: "demo-user",
    lessonId: "lesson-1",
    review,
  });

  assert.ok(cards.length >= 1);
  assert.equal(cards[0]?.id, "thought:review-1:0");
  assert.equal(cards[0]?.userId, "demo-user");
  assert.equal(cards[0]?.lessonId, "lesson-1");
  assert.match(cards[0]?.front ?? "", /思路评审|Coach|softmax|attention/i);
});

test("parseStoredThoughtReview ignores persistence metadata", () => {
  const review = fallbackThoughtReview({
    mode: "free_thought",
    rawText: "多头注意力可能是在不同子空间里看不同关系。",
    lessonTitle: "Transformer 架构入门",
  });

  const parsed = parseStoredThoughtReview({
    provider: "deepseek",
    source: "voice-note",
    voiceNoteId: "voice-1",
    raw: { model: "deepseek-v4-flash" },
    ...review,
  });

  assert.deepEqual(parsed, review);
});
