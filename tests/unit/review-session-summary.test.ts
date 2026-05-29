import test from "node:test";
import assert from "node:assert/strict";
import { buildReviewSessionSummary } from "@/server/review/session-summary";

test("review session summary recommends coach when forgot and hard dominate", () => {
  const summary = buildReviewSessionSummary({
    forgot: 2,
    hard: 1,
    good: 1,
    easy: 0,
  });

  assert.equal(summary.reviewedCount, 4);
  assert.equal(summary.retentionRate, 25);
  assert.equal(summary.tone, "danger");
  assert.match(summary.title, /补弱/);
  assert.equal(summary.primaryAction.href, "/coach");
});

test("review session summary recommends progress when retention is strong", () => {
  const summary = buildReviewSessionSummary({
    forgot: 0,
    hard: 1,
    good: 2,
    easy: 2,
  });

  assert.equal(summary.reviewedCount, 5);
  assert.equal(summary.retentionRate, 80);
  assert.equal(summary.tone, "success");
  assert.match(summary.title, /稳定/);
  assert.equal(summary.primaryAction.href, "/progress");
});
