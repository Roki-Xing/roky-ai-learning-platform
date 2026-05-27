import test from "node:test";
import assert from "node:assert/strict";
import {
  buildReviewScheduleSummary,
  nextDueAtFromRating,
} from "@/server/review/schedule";

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

test("nextDueAtFromRating uses 1/3/7/14 day rules", () => {
  const now = new Date("2026-05-22T00:00:00.000Z");

  assert.equal(daysBetween(now, nextDueAtFromRating({ now, rating: "forgot" })), 1);
  assert.equal(daysBetween(now, nextDueAtFromRating({ now, rating: "hard" })), 3);
  assert.equal(daysBetween(now, nextDueAtFromRating({ now, rating: "good" })), 7);
  assert.equal(daysBetween(now, nextDueAtFromRating({ now, rating: "easy" })), 14);
});

test("buildReviewScheduleSummary exposes active MVP schedule and queue scope", () => {
  const summary = buildReviewScheduleSummary({
    dueCount: 5,
    source: "code-feedback",
    projectId: "project-1",
  });

  assert.equal(summary.queueLabel, "代码反馈复习");
  assert.equal(summary.scopeLabel, "当前项目");
  assert.equal(summary.dueCount, 5);
  assert.deepEqual(
    summary.rules.map((rule) => [rule.rating, rule.label, rule.intervalDays]),
    [
      ["forgot", "忘了", 1],
      ["hard", "模糊", 3],
      ["good", "记得", 7],
      ["easy", "很熟", 14],
    ],
  );
});
