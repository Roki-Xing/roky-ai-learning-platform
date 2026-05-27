import test from "node:test";
import assert from "node:assert/strict";
import { buildTodayReviewSummary } from "@/server/review/today-summary";

test("buildTodayReviewSummary exposes completed lesson review counts", () => {
  const summary = buildTodayReviewSummary({
    planStatus: "completed",
    lessonFlashcardCount: 3,
    lessonDueFlashcardCount: 2,
    totalDueFlashcardCount: 5,
  });

  assert.equal(summary.isCompleted, true);
  assert.equal(summary.lessonFlashcardCount, 3);
  assert.equal(summary.lessonDueFlashcardCount, 2);
  assert.equal(summary.totalDueFlashcardCount, 5);
  assert.equal(summary.statusLabel, "已完成今日学习");
  assert.equal(summary.ctaLabel, "去复习");
  assert.equal(summary.helperText, "今日课程已有 2 张到期卡片，可直接进入复习。");
});

test("buildTodayReviewSummary keeps planned lessons in pre-completion state", () => {
  const summary = buildTodayReviewSummary({
    planStatus: "planned",
    lessonFlashcardCount: 0,
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
  });

  assert.equal(summary.isCompleted, false);
  assert.equal(summary.statusLabel, "等待完成今日学习");
  assert.equal(summary.ctaLabel, "完成后生成卡片");
  assert.equal(summary.helperText, "完成今日学习后会生成复习卡片。");
});

test("buildTodayReviewSummary preserves lesson due and global due counts", () => {
  const summary = buildTodayReviewSummary({
    planStatus: "completed",
    lessonFlashcardCount: 3,
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 4,
  });

  assert.equal(summary.lessonFlashcardCount, 3);
  assert.equal(summary.lessonDueFlashcardCount, 0);
  assert.equal(summary.totalDueFlashcardCount, 4);
  assert.equal(summary.helperText, "今日课程暂无到期卡片，全部复习队列还有 4 张。");
});
