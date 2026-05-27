import test from "node:test";
import assert from "node:assert/strict";
import { runDailyLoopVerification } from "@/server/verification/daily-loop";

test("daily learning usability loop persists quiz, code, completion, review, and progress signals", async () => {
  const result = await runDailyLoopVerification({
    userId: `loop-verifier-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    now: new Date("2026-05-25T04:00:00.000Z"),
  });

  assert.equal(result.plan.status, "completed");
  assert.equal(result.guidedProgress.activeStep, 1);
  assert.ok(result.quizAttemptCount >= 1);
  assert.equal(result.codeSubmission.status, "feedback_ready");
  assert.ok(result.codeFeedbackCount >= 1);
  assert.ok(result.completedPlanCount >= 1);
  assert.ok(result.flashcardCount >= 1);
  assert.ok(result.reviewQueueBeforeRating.length >= 1);
  assert.equal(result.reviewRating.applied, true);
  assert.ok(result.reviewLogCount >= 1);
  assert.ok(result.progressSignals.completedLessons >= 1);
  assert.ok(result.progressSignals.quizAttempts >= 1);
  assert.ok(result.progressSignals.codeSubmissions >= 1);
  assert.ok(result.progressSignals.reviewLogs >= 1);
});
