import test from "node:test";
import assert from "node:assert/strict";
import {
  CodeReviewSchema,
  buildCodeFeedbackFlashcards,
  fallbackCodeReview,
} from "@/server/ai/code-feedback";

test("fallbackCodeReview returns structured feedback for incomplete code", () => {
  const review = fallbackCodeReview({
    language: "python",
    code: "def solve(xs):\n    # TODO\n    return xs\n",
    prompt: "Return normalized probabilities.",
    commonBugs: ["Returning raw scores instead of normalized values"],
  });

  const parsed = CodeReviewSchema.safeParse(review);
  assert.equal(parsed.success, true, parsed.success ? "" : parsed.error.message);
  assert.equal(review.overall, "partially_correct");
  assert.ok(review.issues.some((issue) => issue.severity === "high"));
  assert.ok(review.hints.length >= 1);
  assert.ok(review.suggestedTests.length >= 1);
  assert.ok(review.flashcards.length >= 1);
});

test("buildCodeFeedbackFlashcards creates stable bug cards", () => {
  const review = fallbackCodeReview({
    language: "python",
    code: "def softmax(scores):\n    return scores\n",
    prompt: "Implement softmax.",
  });

  const cards = buildCodeFeedbackFlashcards({
    submissionId: "submission-1",
    userId: "demo-user",
    lessonId: "lesson-1",
    review,
  });

  assert.ok(cards.length >= 1);
  assert.equal(cards[0]?.id, "code-feedback:submission-1:0");
  assert.equal(cards[0]?.userId, "demo-user");
  assert.equal(cards[0]?.lessonId, "lesson-1");
  assert.equal(cards[0]?.type, "code_bug");
  assert.match(cards[0]?.front ?? "", /代码反馈|bug|实现/i);
});

