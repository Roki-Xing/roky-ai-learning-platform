import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DAILY_PLAN_AI_TIMEOUT_MS,
  buildDailyPlanMessages,
  dailyPlanAiTimeoutMs,
} from "@/server/ai/generate-daily-plan";

test("dailyPlanAiTimeoutMs keeps page-triggered AI generation within a safe window", () => {
  assert.equal(dailyPlanAiTimeoutMs(undefined), DEFAULT_DAILY_PLAN_AI_TIMEOUT_MS);
  assert.equal(dailyPlanAiTimeoutMs("1000"), 5_000);
  assert.equal(dailyPlanAiTimeoutMs("25000"), 25_000);
  assert.equal(dailyPlanAiTimeoutMs("90000"), 60_000);
  assert.equal(dailyPlanAiTimeoutMs("not-a-number"), DEFAULT_DAILY_PLAN_AI_TIMEOUT_MS);
});

test("buildDailyPlanMessages includes planner signal snapshot for generation context", () => {
  const messages = buildDailyPlanMessages({
    localDate: "2026-05-24",
    timeZone: "Asia/Shanghai",
    topicSlug: "python-lists-dicts",
    quizCount: 3,
    flashcardCount: 3,
    curriculum: {
      domain: "Python / 代码表达",
      domainSlug: "python-coding",
      topic: "列表与字典",
      topicSlug: "python-lists-dicts",
      reason: "misconception=1.00, coding=1.00",
      difficulty: "easy",
      estimatedMinutes: 30,
      scoreBreakdown: {
        misconceptionScore: 1,
        codingNeedScore: 1,
      },
      signalSnapshot: {
        recentStudies: [{ domainSlug: "llm-rag-agent", topicSlug: "rag", localDate: "2026-05-23" }],
        completedCountByDomain: { "llm-rag-agent": 2 },
        dueCountByDomain: { "python-coding": 1 },
        hardReviewCountByDomain: { "python-coding": 2 },
        incorrectQuizCountByDomain: { "python-coding": 1 },
        activeMisconceptionCountByDomain: { "python-coding": 4 },
        mapWeaknessByDomain: { "python-coding": 1 },
        codeSubmissionCountLast7: 0,
      },
    },
  });

  const userMessage = messages.find((m) => m.role === "user")?.content ?? "";

  assert.match(userMessage, /Planner signal snapshot/);
  assert.match(userMessage, /activeMisconceptionCountByDomain/);
  assert.match(userMessage, /python-coding/);
  assert.match(userMessage, /codeSubmissionCountLast7/);
  assert.match(userMessage, /hardReviewCountByDomain/);
});
