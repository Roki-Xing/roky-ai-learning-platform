import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCalendarDays,
  calculateContentQuality,
  calculateLearningEffect,
  calculateQualityScore,
  buildProgressWeakDomainSummary,
  summarizeCodeFeedbackIssueTrend,
  summarizeCodeTrend,
  summarizeGenerationHealth,
  summarizeKnowledgeCoverage,
  summarizeMisconceptionTrend,
  summarizeQuizAccuracyTrend,
  summarizeReviewRetentionTrend,
} from "@/server/analytics/progress";

test("calculateContentQuality extracts Sprint 9 lesson quality metrics", () => {
  const quality = calculateContentQuality({
    lesson: {
      contentMarkdown: "# Title\n\nA short lesson body.",
      examples: {
        guidedSteps: [
          { type: "activation" },
          { type: "concept" },
          { type: "coding" },
        ],
        codingExercise: {
          title: "Softmax",
          language: "python",
          visibleTests: [{ input: "softmax([1,2])", expectedOutput: "..." }],
          commonBugs: ["忘记归一化"],
        },
      },
      connections: { schemaVersion: "2.3" },
      createdBy: "deepseek",
    },
    quizCount: 3,
    flashcardCount: 2,
    generationRetries: 1,
  });

  assert.equal(quality.contentLength, 28);
  assert.equal(quality.guidedStepCount, 3);
  assert.equal(quality.quizCount, 3);
  assert.equal(quality.flashcardCount, 2);
  assert.equal(quality.schemaVersion, "2.3");
  assert.equal(quality.source, "deepseek");
  assert.equal(quality.generationRetries, 1);
  assert.equal(quality.fallbackUsed, false);
  assert.equal(quality.codingExerciseQuality, "strong");
});

test("calculateQualityScore rewards complete structured lessons", () => {
  const strong = calculateQualityScore({
    contentLength: 1200,
    guidedStepCount: 6,
    quizCount: 3,
    codingExerciseQuality: "strong",
    flashcardCount: 3,
    schemaVersion: "2.3",
    source: "deepseek",
    generationRetries: 0,
    fallbackUsed: false,
  });
  const weak = calculateQualityScore({
    contentLength: 120,
    guidedStepCount: 1,
    quizCount: 0,
    codingExerciseQuality: "missing",
    flashcardCount: 0,
    schemaVersion: null,
    source: "template",
    generationRetries: 2,
    fallbackUsed: true,
  });

  assert.equal(strong, 100);
  assert.ok(weak < 50);
});

test("calculateLearningEffect returns quiz, review, code and misconception rates", () => {
  const effect = calculateLearningEffect({
    quizAttempts: [
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: true },
    ],
    reviewLogs: [
      { rating: "good" },
      { rating: "easy" },
      { rating: "hard" },
      { rating: "forgot" },
    ],
    completedLessonCount: 4,
    codeSubmissionCount: 2,
    openMisconceptionCount: 1,
    resolvedMisconceptionCount: 3,
    streak: 5,
    domainCoverageCount: 3,
    topicDiversityCount: 7,
  });

  assert.equal(effect.quizAccuracy, 67);
  assert.equal(effect.reviewRetention, 50);
  assert.equal(effect.codeSubmissionRate, 50);
  assert.equal(effect.misconceptionResolutionRate, 75);
  assert.equal(effect.streak, 5);
  assert.equal(effect.domainCoverage, 3);
  assert.equal(effect.topicDiversity, 7);
});

test("buildCalendarDays marks completed and planned days", () => {
  const days = buildCalendarDays({
    todayLocalDate: "2026-05-24",
    planDays: [
      { localDate: "2026-05-24", status: "planned" },
      { localDate: "2026-05-23", status: "completed" },
      { localDate: "2026-05-20", status: "completed" },
    ],
    days: 7,
  });

  assert.equal(days.length, 7);
  assert.deepEqual(days.at(-1), {
    localDate: "2026-05-24",
    status: "planned",
    intensity: 1,
  });
  assert.equal(days.find((d) => d.localDate === "2026-05-23")?.status, "completed");
  assert.equal(days.find((d) => d.localDate === "2026-05-22")?.intensity, 0);
});

test("summarizeCodeTrend groups submissions by local date", () => {
  const trend = summarizeCodeTrend([
    { localDate: "2026-05-23" },
    { localDate: "2026-05-23" },
    { localDate: "2026-05-24" },
  ]);

  assert.deepEqual(trend, [
    { localDate: "2026-05-23", submissions: 2 },
    { localDate: "2026-05-24", submissions: 1 },
  ]);
});

test("summarizeCodeFeedbackIssueTrend groups issue severity and top issue type by local date", () => {
  const trend = summarizeCodeFeedbackIssueTrend([
    {
      localDate: "2026-05-22",
      issues: [
        { type: "logic", severity: "high", message: "placeholder return" },
        { type: "edge_case", severity: "medium", message: "empty input" },
      ],
    },
    {
      localDate: "2026-05-22",
      issues: [{ type: "logic", severity: "low", message: "naming" }],
    },
    {
      localDate: "2026-05-23",
      issues: ["missing visible test"],
    },
  ]);

  assert.deepEqual(trend, [
    {
      localDate: "2026-05-22",
      feedbackCount: 2,
      issueCount: 3,
      highIssueCount: 1,
      mediumIssueCount: 1,
      lowIssueCount: 1,
      topIssueType: "logic",
    },
    {
      localDate: "2026-05-23",
      feedbackCount: 1,
      issueCount: 1,
      highIssueCount: 0,
      mediumIssueCount: 1,
      lowIssueCount: 0,
      topIssueType: "general",
    },
  ]);
});

test("summarizeQuizAccuracyTrend groups quiz accuracy by local date", () => {
  const trend = summarizeQuizAccuracyTrend([
    { localDate: "2026-05-22", isCorrect: true },
    { localDate: "2026-05-22", isCorrect: false },
    { localDate: "2026-05-23", isCorrect: true },
    { localDate: "2026-05-23", isCorrect: true },
    { localDate: "2026-05-23", isCorrect: false },
  ]);

  assert.deepEqual(trend, [
    {
      localDate: "2026-05-22",
      attempts: 2,
      correct: 1,
      accuracy: 50,
    },
    {
      localDate: "2026-05-23",
      attempts: 3,
      correct: 2,
      accuracy: 67,
    },
  ]);
});

test("summarizeKnowledgeCoverage calculates coverage percentages", () => {
  const coverage = summarizeKnowledgeCoverage({
    glossaryTotal: 20,
    glossaryReviewed: 5,
    radarTotal: 10,
    radarReviewed: 3,
  });

  assert.equal(coverage.glossaryCoveragePct, 25);
  assert.equal(coverage.radarCoveragePct, 30);
});

test("summarizeGenerationHealth reports provider stability and schema distribution", () => {
  const health = summarizeGenerationHealth({
    plans: [
      { source: "deepseek", schemaVersion: "2.3" },
      { source: "deepseek", schemaVersion: "2.3" },
      { source: "template", schemaVersion: "2.3" },
      { source: "fallback", schemaVersion: null },
    ],
    jobs: [
      {
        status: "success",
        model: "deepseek-v4-flash",
        output: { schemaVersion: "2.3" },
      },
      {
        status: "success",
        model: "deepseek-v4-flash",
        output: { schemaVersion: "2.3", meta: { repaired: true } },
      },
      {
        status: "error",
        model: "deepseek-v4-flash",
        output: { rawPrimary: "{broken json" },
      },
    ],
  });

  assert.equal(health.totalPlans, 4);
  assert.equal(health.deepseekPlanCount, 2);
  assert.equal(health.fallbackPlanCount, 2);
  assert.equal(health.successJobCount, 2);
  assert.equal(health.failedJobCount, 1);
  assert.equal(health.repairCount, 2);
  assert.equal(health.fallbackRate, 50);
  assert.equal(health.repairRate, 67);
  assert.deepEqual(health.schemaVersionDistribution, [
    { schemaVersion: "2.3", count: 3 },
    { schemaVersion: "unknown", count: 1 },
  ]);
  assert.deepEqual(health.modelDistribution, [
    { model: "deepseek-v4-flash", count: 3 },
  ]);
});

test("buildProgressWeakDomainSummary ranks domains by mastery, review debt, code gap and mistakes", () => {
  const weakDomains = buildProgressWeakDomainSummary([
    {
      slug: "python-coding",
      label: "Python 编程",
      completedLessons: 1,
      plannedLessons: 1,
      dueFlashcardCount: 4,
      activeMisconceptionCount: 2,
      quizAttemptCount: 3,
      correctQuizCount: 1,
      codeSubmissionCount: 0,
      lastStudiedLocalDate: "2026-05-24",
    },
    {
      slug: "llm-rag-agent",
      label: "LLM / RAG / Agent",
      completedLessons: 4,
      plannedLessons: 0,
      dueFlashcardCount: 1,
      activeMisconceptionCount: 0,
      quizAttemptCount: 5,
      correctQuizCount: 4,
      codeSubmissionCount: 3,
      lastStudiedLocalDate: "2026-05-23",
    },
    {
      slug: "algorithm-design",
      label: "算法设计",
      completedLessons: 2,
      plannedLessons: 0,
      dueFlashcardCount: 0,
      activeMisconceptionCount: 0,
      quizAttemptCount: 2,
      correctQuizCount: 2,
      codeSubmissionCount: 0,
      lastStudiedLocalDate: "2026-05-21",
    },
  ]);

  assert.equal(weakDomains[0]?.slug, "python-coding");
  assert.equal(weakDomains[0]?.quizAccuracy, 33);
  assert.match(weakDomains[0]?.reason ?? "", /活跃错题 2/);
  assert.match(weakDomains[0]?.reason ?? "", /复习欠账 4/);
  assert.match(weakDomains[0]?.reason ?? "", /代码练习 0/);
  assert.equal(weakDomains[1]?.slug, "algorithm-design");
  assert.ok((weakDomains[0]?.weaknessScore ?? 0) > (weakDomains[1]?.weaknessScore ?? 0));
});

test("summarizeReviewRetentionTrend groups review retention by local date", () => {
  const trend = summarizeReviewRetentionTrend([
    { localDate: "2026-05-22", rating: "forgot" },
    { localDate: "2026-05-22", rating: "good" },
    { localDate: "2026-05-23", rating: "easy" },
    { localDate: "2026-05-23", rating: "hard" },
    { localDate: "2026-05-23", rating: "good" },
  ]);

  assert.deepEqual(trend, [
    {
      localDate: "2026-05-22",
      reviewed: 2,
      retained: 1,
      retentionRate: 50,
    },
    {
      localDate: "2026-05-23",
      reviewed: 3,
      retained: 2,
      retentionRate: 67,
    },
  ]);
});

test("summarizeMisconceptionTrend groups active and resolved mistakes by local date", () => {
  const trend = summarizeMisconceptionTrend([
    { localDate: "2026-05-22", status: "open" },
    { localDate: "2026-05-22", status: "resolved" },
    { localDate: "2026-05-23", status: "active" },
    { localDate: "2026-05-23", status: "ignored" },
    { localDate: "2026-05-23", status: "resolved" },
  ]);

  assert.deepEqual(trend, [
    {
      localDate: "2026-05-22",
      total: 2,
      active: 1,
      resolved: 1,
      ignored: 0,
      resolutionRate: 50,
    },
    {
      localDate: "2026-05-23",
      total: 3,
      active: 1,
      resolved: 1,
      ignored: 1,
      resolutionRate: 33,
    },
  ]);
});
