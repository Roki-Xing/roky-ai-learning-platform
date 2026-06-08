import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sprint9AnalyticsPanels } from "@/app/progress/analytics-panels";
import {
  buildCalendarDays,
  buildWeeklyRemediationPlan,
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

test("progress learning calendar exposes day status without relying on color", () => {
  const markup = renderToStaticMarkup(
    React.createElement(Sprint9AnalyticsPanels, {
      calendarDays: [
        { localDate: "2026-05-22", status: "completed", intensity: 1 },
        { localDate: "2026-05-23", status: "planned", intensity: 1 },
        { localDate: "2026-05-24", status: "none", intensity: 0 },
      ],
      qualityRows: [],
      learningEffect: {
        quizAccuracy: 0,
        reviewRetention: 0,
        codeSubmissionRate: 0,
        misconceptionResolutionRate: 0,
        streak: 0,
        domainCoverage: 0,
        topicDiversity: 0,
      },
      quizAccuracyTrend: [],
      codeTrend: [],
      codeFeedbackIssueTrend: [],
      misconceptionTrend: [],
      weakDomains: [],
      reviewRetentionTrend: [],
      knowledgeCoverage: {
        glossaryCoveragePct: 0,
        radarCoveragePct: 0,
        glossaryTotal: 0,
        glossaryReviewed: 0,
        radarTotal: 0,
        radarReviewed: 0,
      },
      generationHealth: {
        totalPlans: 0,
        deepseekPlanCount: 0,
        fallbackPlanCount: 0,
        successJobCount: 0,
        failedJobCount: 0,
        repairCount: 0,
        fallbackRate: 0,
        repairRate: 0,
        averageQualityScore: 0,
        lowQualityJobCount: 0,
        qualityScoreCoverage: 0,
        schemaVersionDistribution: [],
        modelDistribution: [],
      },
      weeklyRemediationPlan: {
        title: "本周补弱计划",
        summary: "先保持节奏。",
        focusDomain: null,
        steps: [],
      },
    }),
  );

  assert.match(markup, /学习日历/);
  assert.match(markup, /aria-label="2026-05-22：已完成学习"/);
  assert.match(markup, /aria-label="2026-05-23：已安排学习"/);
  assert.match(markup, /aria-label="2026-05-24：暂无学习记录"/);
});

test("progress weekly remediation steps use Chinese step labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(Sprint9AnalyticsPanels, {
      calendarDays: [],
      qualityRows: [],
      learningEffect: {
        quizAccuracy: 0,
        reviewRetention: 0,
        codeSubmissionRate: 0,
        misconceptionResolutionRate: 0,
        streak: 0,
        domainCoverage: 0,
        topicDiversity: 0,
      },
      quizAccuracyTrend: [],
      codeTrend: [],
      codeFeedbackIssueTrend: [],
      misconceptionTrend: [],
      weakDomains: [],
      reviewRetentionTrend: [],
      knowledgeCoverage: {
        glossaryCoveragePct: 0,
        radarCoveragePct: 0,
        glossaryTotal: 0,
        glossaryReviewed: 0,
        radarTotal: 0,
        radarReviewed: 0,
      },
      generationHealth: {
        totalPlans: 0,
        deepseekPlanCount: 0,
        fallbackPlanCount: 0,
        successJobCount: 0,
        failedJobCount: 0,
        repairCount: 0,
        fallbackRate: 0,
        repairRate: 0,
        averageQualityScore: 0,
        lowQualityJobCount: 0,
        qualityScoreCoverage: 0,
        schemaVersionDistribution: [],
        modelDistribution: [],
      },
      weeklyRemediationPlan: {
        title: "本周补弱计划",
        summary: "先处理最弱领域。",
        focusDomain: null,
        steps: [
          {
            title: "复习到期卡片",
            description: "先清空今天最影响留存的卡片。",
            href: "/review",
            tone: "warning",
          },
          {
            title: "让 Coach 讲解错题",
            description: "把卡住的知识点转成补弱解释。",
            href: "/coach",
            tone: "info",
          },
        ],
      },
    }),
  );

  assert.match(markup, /本周补弱计划/);
  assert.match(markup, /第 1 步/);
  assert.match(markup, /第 2 步/);
  assert.doesNotMatch(markup, />Step 1</);
  assert.doesNotMatch(markup, />Step 2</);
});

test("progress trend badges use Chinese issue and mistake status labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(Sprint9AnalyticsPanels, {
      calendarDays: [],
      qualityRows: [],
      learningEffect: {
        quizAccuracy: 0,
        reviewRetention: 0,
        codeSubmissionRate: 0,
        misconceptionResolutionRate: 0,
        streak: 0,
        domainCoverage: 0,
        topicDiversity: 0,
      },
      quizAccuracyTrend: [],
      codeTrend: [],
      codeFeedbackIssueTrend: [
        {
          localDate: "2026-06-06",
          feedbackCount: 2,
          issueCount: 3,
          highIssueCount: 2,
          mediumIssueCount: 1,
          lowIssueCount: 0,
          topIssueType: "logic",
        },
      ],
      misconceptionTrend: [
        {
          localDate: "2026-06-06",
          total: 3,
          active: 1,
          resolved: 2,
          ignored: 0,
          resolutionRate: 67,
        },
      ],
      weakDomains: [],
      reviewRetentionTrend: [],
      knowledgeCoverage: {
        glossaryCoveragePct: 0,
        radarCoveragePct: 0,
        glossaryTotal: 0,
        glossaryReviewed: 0,
        radarTotal: 0,
        radarReviewed: 0,
      },
      generationHealth: {
        totalPlans: 0,
        deepseekPlanCount: 0,
        fallbackPlanCount: 0,
        successJobCount: 0,
        failedJobCount: 0,
        repairCount: 0,
        fallbackRate: 0,
        repairRate: 0,
        averageQualityScore: 0,
        lowQualityJobCount: 0,
        qualityScoreCoverage: 0,
        schemaVersionDistribution: [],
        modelDistribution: [],
      },
      weeklyRemediationPlan: {
        title: "本周补弱计划",
        summary: "先保持节奏。",
        focusDomain: null,
        steps: [],
      },
    }),
  );

  assert.match(markup, /高优先级 2/);
  assert.match(markup, /未解决 1/);
  assert.doesNotMatch(markup, />high 2</);
  assert.doesNotMatch(markup, />open 1</);
});

test("progress content quality source labels are learner-friendly Chinese text", () => {
  function renderSource(source: string | null | undefined) {
    return renderToStaticMarkup(
      React.createElement(Sprint9AnalyticsPanels, {
        calendarDays: [],
        qualityRows: [
          {
            id: `quality-${source ?? "missing"}`,
            title: "今日课程",
            localDate: "2026-06-06",
            status: "completed",
            score: 82,
            metrics: {
              contentLength: 680,
              guidedStepCount: 5,
              quizCount: 3,
              codingExerciseQuality: "strong",
              flashcardCount: 2,
              schemaVersion: "2.3",
              source,
              generationRetries: 0,
              fallbackUsed: source !== "deepseek",
            },
            warnings: [],
          },
        ],
        learningEffect: {
          quizAccuracy: 0,
          reviewRetention: 0,
          codeSubmissionRate: 0,
          misconceptionResolutionRate: 0,
          streak: 0,
          domainCoverage: 0,
          topicDiversity: 0,
        },
        quizAccuracyTrend: [],
        codeTrend: [],
        codeFeedbackIssueTrend: [],
        misconceptionTrend: [],
        weakDomains: [],
        reviewRetentionTrend: [],
        knowledgeCoverage: {
          glossaryCoveragePct: 0,
          radarCoveragePct: 0,
          glossaryTotal: 0,
          glossaryReviewed: 0,
          radarTotal: 0,
          radarReviewed: 0,
        },
        generationHealth: {
          totalPlans: 0,
          deepseekPlanCount: 0,
          fallbackPlanCount: 0,
          successJobCount: 0,
          failedJobCount: 0,
          repairCount: 0,
          fallbackRate: 0,
          repairRate: 0,
          averageQualityScore: 0,
          lowQualityJobCount: 0,
          qualityScoreCoverage: 0,
          schemaVersionDistribution: [],
          modelDistribution: [],
        },
        weeklyRemediationPlan: {
          title: "本周补弱计划",
          summary: "先保持节奏。",
          focusDomain: null,
          steps: [],
        },
      }),
    );
  }

  assert.match(renderSource("deepseek"), /来源：AI 生成/);
  assert.match(renderSource("template"), /来源：模板兜底/);
  assert.match(renderSource("fallback"), /来源：系统兜底/);
  assert.match(renderSource(null), /来源：未标记来源/);
  assert.match(renderSource(undefined), /来源：未标记来源/);

  const combinedMarkup = [
    renderSource("deepseek"),
    renderSource("template"),
    renderSource("fallback"),
    renderSource(null),
    renderSource(undefined),
  ].join("\n");

  assert.doesNotMatch(combinedMarkup, /来源：deepseek/);
  assert.doesNotMatch(combinedMarkup, /来源：template/);
  assert.doesNotMatch(combinedMarkup, /来源：fallback/);
  assert.doesNotMatch(combinedMarkup, /unknown/);
});

test("progress content quality coding exercise labels are learner-friendly Chinese text", () => {
  function renderCodingQuality(codingExerciseQuality: "strong" | "basic" | "missing" | "legacy") {
    return renderToStaticMarkup(
      React.createElement(Sprint9AnalyticsPanels, {
        calendarDays: [],
        qualityRows: [
          {
            id: `quality-${codingExerciseQuality}`,
            title: "今日课程",
            localDate: "2026-06-07",
            status: "completed",
            score: 76,
            metrics: {
              contentLength: 680,
              guidedStepCount: 5,
              quizCount: 3,
              codingExerciseQuality,
              flashcardCount: 2,
              schemaVersion: "2.3",
              source: "deepseek",
              generationRetries: 0,
              fallbackUsed: false,
            },
            warnings: [],
          },
        ],
        learningEffect: {
          quizAccuracy: 0,
          reviewRetention: 0,
          codeSubmissionRate: 0,
          misconceptionResolutionRate: 0,
          streak: 0,
          domainCoverage: 0,
          topicDiversity: 0,
        },
        quizAccuracyTrend: [],
        codeTrend: [],
        codeFeedbackIssueTrend: [],
        misconceptionTrend: [],
        weakDomains: [],
        reviewRetentionTrend: [],
        knowledgeCoverage: {
          glossaryCoveragePct: 0,
          radarCoveragePct: 0,
          glossaryTotal: 0,
          glossaryReviewed: 0,
          radarTotal: 0,
          radarReviewed: 0,
        },
        generationHealth: {
          totalPlans: 0,
          deepseekPlanCount: 0,
          fallbackPlanCount: 0,
          successJobCount: 0,
          failedJobCount: 0,
          repairCount: 0,
          fallbackRate: 0,
          repairRate: 0,
          averageQualityScore: 0,
          lowQualityJobCount: 0,
          qualityScoreCoverage: 0,
          schemaVersionDistribution: [],
          modelDistribution: [],
        },
        weeklyRemediationPlan: {
          title: "本周补弱计划",
          summary: "先保持节奏。",
          focusDomain: null,
          steps: [],
        },
      }),
    );
  }

  assert.match(renderCodingQuality("strong"), /代码练习：完整练习/);
  assert.match(renderCodingQuality("basic"), /代码练习：基础练习/);
  assert.match(renderCodingQuality("missing"), /代码练习：暂无练习/);
  assert.match(renderCodingQuality("legacy"), /代码练习：待评估/);

  const combinedMarkup = [
    renderCodingQuality("strong"),
    renderCodingQuality("basic"),
    renderCodingQuality("missing"),
    renderCodingQuality("legacy"),
  ].join("\n");

  assert.doesNotMatch(combinedMarkup, /代码练习：strong/);
  assert.doesNotMatch(combinedMarkup, /代码练习：basic/);
  assert.doesNotMatch(combinedMarkup, /代码练习：missing/);
  assert.doesNotMatch(combinedMarkup, /代码练习：legacy/);
});

test("progress generation stability copy uses learner-friendly Chinese labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(Sprint9AnalyticsPanels, {
      calendarDays: [],
      qualityRows: [],
      learningEffect: {
        quizAccuracy: 0,
        reviewRetention: 0,
        codeSubmissionRate: 0,
        misconceptionResolutionRate: 0,
        streak: 0,
        domainCoverage: 0,
        topicDiversity: 0,
      },
      quizAccuracyTrend: [],
      codeTrend: [],
      codeFeedbackIssueTrend: [],
      misconceptionTrend: [],
      weakDomains: [],
      reviewRetentionTrend: [],
      knowledgeCoverage: {
        glossaryCoveragePct: 0,
        radarCoveragePct: 0,
        glossaryTotal: 0,
        glossaryReviewed: 0,
        radarTotal: 0,
        radarReviewed: 0,
      },
      generationHealth: {
        totalPlans: 4,
        deepseekPlanCount: 2,
        fallbackPlanCount: 2,
        successJobCount: 3,
        failedJobCount: 1,
        repairCount: 2,
        fallbackRate: 50,
        repairRate: 50,
        averageQualityScore: 66,
        lowQualityJobCount: 2,
        qualityScoreCoverage: 4,
        schemaVersionDistribution: [
          { schemaVersion: "2.3", count: 3 },
          { schemaVersion: "unknown", count: 1 },
        ],
        modelDistribution: [
          { model: "deepseek-v4-flash", count: 3 },
          { model: "deepseek-v4-pro", count: 1 },
          { model: "unknown", count: 1 },
        ],
      },
      weeklyRemediationPlan: {
        title: "本周补弱计划",
        summary: "先保持节奏。",
        focusDomain: null,
        steps: [],
      },
    }),
  );

  assert.match(markup, /AI 生成 \/ 兜底生成/);
  assert.match(markup, /兜底率 50%/);
  assert.match(markup, /生成任务/);
  assert.match(markup, /成功\/失败，修复率 50%/);
  assert.match(markup, /覆盖 4 个任务，低质量 2/);
  assert.match(markup, /Schema 版本 2\.3：3/);
  assert.match(markup, /Schema 版本 未标记：1/);
  assert.match(markup, /AI 模型：DeepSeek Flash：3/);
  assert.match(markup, /AI 模型：DeepSeek Pro：1/);
  assert.match(markup, /AI 模型：未标记：1/);

  assert.doesNotMatch(markup, /DeepSeek \/ fallback/);
  assert.doesNotMatch(markup, /fallback 50%/);
  assert.doesNotMatch(markup, /生成 job/);
  assert.doesNotMatch(markup, /success\/error，repair/);
  assert.doesNotMatch(markup, /覆盖 4 个 job/);
  assert.doesNotMatch(markup, /schema 2\.3: 3/);
  assert.doesNotMatch(markup, /Schema 版本 unknown/);
  assert.doesNotMatch(markup, /deepseek-v4-flash/);
  assert.doesNotMatch(markup, /deepseek-v4-pro/);
  assert.doesNotMatch(markup, /AI 模型：unknown/);
});

test("progress summary cards hide internal model names from learners", () => {
  const source = readFileSync("src/app/progress/page.tsx", "utf8");

  assert.match(source, /以完成学习日为准（用户时区日期）/);
  assert.match(source, /复习记录：\{reviewLogsCount\}/);
  assert.doesNotMatch(source, /以 DailyPlan\.completed 为准/);
  assert.doesNotMatch(source, /ReviewLog：\{reviewLogsCount\}/);
});

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
        output: { schemaVersion: "2.3", qualityScore: 92 },
      },
      {
        status: "success",
        model: "deepseek-v4-flash",
        output: { schemaVersion: "2.3", qualityScore: 58, meta: { repaired: true } },
      },
      {
        status: "error",
        model: "deepseek-v4-flash",
        output: { rawPrimary: "{broken json", qualityScore: 41 },
      },
      {
        status: "success",
        model: "deepseek-v4-pro",
        output: {
          schemaVersion: "2.3",
          lesson: {
            contentMarkdown:
              "# Title\n\nA detailed lesson body that is definitely long enough to count as a real lesson.",
            guidedSteps: [
              { type: "activation" },
              { type: "concept" },
              { type: "example" },
              { type: "coding" },
              { type: "reflection" },
            ],
          },
          quiz: [
            { type: "single_choice", options: ["A", "B"] },
            { type: "single_choice", options: ["A", "B"] },
            { type: "true_false" },
          ],
          codingExercise: {
            title: "Two Sum",
            visibleTests: [{ input: "x", expectedOutput: "y" }],
            commonBugs: ["off-by-one"],
          },
          flashcards: [{ front: "Q", back: "A" }, { front: "Q2", back: "A2" }],
        },
      },
    ],
  });

  assert.equal(health.totalPlans, 4);
  assert.equal(health.deepseekPlanCount, 2);
  assert.equal(health.fallbackPlanCount, 2);
  assert.equal(health.successJobCount, 3);
  assert.equal(health.failedJobCount, 1);
  assert.equal(health.repairCount, 2);
  assert.equal(health.fallbackRate, 50);
  assert.equal(health.repairRate, 50);
  assert.equal(health.averageQualityScore, 66);
  assert.equal(health.lowQualityJobCount, 2);
  assert.equal(health.qualityScoreCoverage, 4);
  assert.deepEqual(health.schemaVersionDistribution, [
    { schemaVersion: "2.3", count: 3 },
    { schemaVersion: "unknown", count: 1 },
  ]);
  assert.deepEqual(health.modelDistribution, [
    { model: "deepseek-v4-flash", count: 3 },
    { model: "deepseek-v4-pro", count: 1 },
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

test("buildWeeklyRemediationPlan turns weak domains into actionable weekly steps", () => {
  const plan = buildWeeklyRemediationPlan({
    weakDomains: [
      {
        slug: "python-coding",
        label: "Python 编程",
        masteryScore: 18,
        weaknessScore: 96,
        quizAccuracy: 33,
        completedLessons: 1,
        plannedLessons: 1,
        dueFlashcardCount: 4,
        activeMisconceptionCount: 2,
        codeSubmissionCount: 0,
        lastStudiedLocalDate: "2026-05-24",
        reason: "活跃错题 2 / 复习欠账 4 / 代码练习 0 / 测验正确率 33%",
      },
    ],
    dueFlashcardsCount: 6,
    openMisconceptionsCount: 3,
    codeFeedbackCount: 2,
  });

  assert.equal(plan.focusDomain?.slug, "python-coding");
  assert.match(plan.title, /本周补弱计划/);
  assert.equal(plan.steps.length, 3);
  assert.equal(plan.steps[0]?.href, "/review");
  assert.match(plan.steps[0]?.title ?? "", /复习/);
  assert.equal(plan.steps[1]?.href, "/coach");
  assert.match(plan.steps[1]?.description ?? "", /Python 编程/);
  assert.equal(plan.steps[2]?.href, "/review?source=code-feedback");
  assert.match(plan.summary, /Python 编程/);
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

test("progress recent signal links keep mobile touch targets", () => {
  const source = readFileSync("src/app/progress/page.tsx", "utf8");

  assert.match(
    source,
    /const progressRecentSignalLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted\/50";/,
  );
  assert.equal(
    (source.match(/className=\{progressRecentSignalLinkClassName\}/g) ?? []).length,
    5,
  );
});

test("progress weak domain links keep mobile touch targets", () => {
  const source = readFileSync("src/app/progress/analytics-panels.tsx", "utf8");

  assert.match(
    source,
    /const progressWeakDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted\/50";/,
  );

  const weakDomainIndex = source.indexOf("薄弱领域");
  assert.notEqual(weakDomainIndex, -1);
  const weakDomainBlock = source.slice(Math.max(0, weakDomainIndex - 120), weakDomainIndex + 650);
  assert.match(weakDomainBlock, /className=\{progressWeakDomainLinkClassName\}/);
  assert.doesNotMatch(
    source,
    /className="rounded-md border px-3 py-2 transition-colors hover:bg-muted\/50"/,
  );
});

test("progress recent signal lists localize learner-visible status labels", () => {
  const source = readFileSync("src/app/progress/page.tsx", "utf8");

  assert.match(source, /formatHomeCodeFeedbackOverallLabel\(f\.overall\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(f\.provider\)/);
  assert.match(source, /formatCoachModeLabel\(r\.mode\)/);
  assert.match(source, /missionStatusText\(project\.status\)/);
  assert.doesNotMatch(source, /<Badge variant="outline">\s*\{f\.provider\}/);
  assert.doesNotMatch(source, /` \/ \$\{f\.overall\}`/);
  assert.doesNotMatch(source, /<Badge variant="outline">\{r\.mode\}<\/Badge>/);
  assert.doesNotMatch(source, /\{PROJECT_TYPE_LABELS\[normalizeProjectType\(project\.type\)\]\} \/ \{project\.status\}/);
});

test("progress weak topic cards localize exposure and missing domain labels", () => {
  const source = readFileSync("src/app/progress/page.tsx", "utf8");

  assert.match(source, /function formatProgressWeakTopicDomainLabel/);
  assert.match(source, /formatProgressWeakTopicDomainLabel\(topic\?\.domain\.name\)/);
  assert.match(source, /"未标记领域"/);
  assert.match(source, /接触次数：\{s\.exposureCount\}/);
  assert.doesNotMatch(source, /topic\?\.domain\.name \?\? "-"/);
  assert.doesNotMatch(source, /exposure \{s\.exposureCount\}/);
});
