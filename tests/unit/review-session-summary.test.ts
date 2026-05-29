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
  assert.deepEqual(summary.actionPlan.map((item) => item.title), [
    "先复述忘记的卡片",
    "交给 Coach 找缺口",
    "回到今日学习补上下文",
  ]);
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
  assert.deepEqual(summary.actionPlan.map((item) => item.title), [
    "查看进度趋势",
    "继续今日任务",
    "保持明天复习节奏",
  ]);
});
