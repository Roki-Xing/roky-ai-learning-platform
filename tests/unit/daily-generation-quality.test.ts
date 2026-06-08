import test from "node:test";
import assert from "node:assert/strict";
import { calculateQualityScore } from "@/server/analytics/progress";
import {
  buildPersistedDailyGenerationOutput,
  readPersistedDailyGenerationQuality,
  summarizeDailyGenerationQualityJobs,
} from "@/server/ai/daily-generation-quality";
import { pickDailyTemplate } from "@/server/content/templates";

test("buildPersistedDailyGenerationOutput stores quality score, checks and metrics", () => {
  const tpl = pickDailyTemplate({ topicSlug: "transformer" });
  const output = buildPersistedDailyGenerationOutput({
    tpl,
    source: "deepseek",
    topicSlug: "transformer",
    recentStudies: [],
  });

  assert.equal(output.qualityScore, calculateQualityScore(output.qualityMetrics));
  assert.deepEqual(output.qualityChecks, {
    hasCodingExercise: true,
    hasQuizOptions: true,
    hasGlossaryCard: true,
    hasBreadthCard: true,
    hasCommonBugs: true,
    tooShort: false,
    repeatedRecentTopic: false,
    invalidJsonFallback: false,
  });
  assert.deepEqual(output.qualityWarnings, []);
  assert.equal(output.qualityMetrics.source, "deepseek");
});

test("buildPersistedDailyGenerationOutput flags degraded content and fallback signals", () => {
  const tpl = JSON.parse(
    JSON.stringify(pickDailyTemplate({ topicSlug: "transformer" })),
  ) as ReturnType<typeof pickDailyTemplate>;

  tpl.lesson.contentMarkdown = "太短";
  tpl.quiz = [
    {
      type: "true_false",
      question: "Attention 是卷积吗？",
      answer: false,
      explanation: "不是。",
    },
  ];
  tpl.codingExercise.title = "";
  tpl.codingExercise.prompt = "";
  tpl.codingExercise.starterCode = "";
  tpl.codingExercise.referenceSolution = "";
  tpl.codingExercise.visibleTests = [];
  tpl.codingExercise.commonBugs = [];
  tpl.glossary.term = "";
  tpl.glossary.definition = "";
  tpl.breadth.title = "";
  tpl.breadth.whyItMatters = "";

  const output = buildPersistedDailyGenerationOutput({
    tpl,
    source: "template",
    topicSlug: "transformer",
    recentStudies: [
      {
        domainSlug: "llm-rag-agent",
        topicSlug: "transformer",
        localDate: "2026-06-01",
      },
    ],
    generationRetries: 1,
    repairReason: "json_parse",
  });

  assert.deepEqual(output.qualityChecks, {
    hasCodingExercise: false,
    hasQuizOptions: false,
    hasGlossaryCard: false,
    hasBreadthCard: false,
    hasCommonBugs: false,
    tooShort: true,
    repeatedRecentTopic: true,
    invalidJsonFallback: true,
  });
  assert.ok(output.qualityScore < 60);
  assert.match(output.qualityWarnings.join(" / "), /缺少代码练习/);
  assert.match(output.qualityWarnings.join(" / "), /缺少带 options 的 quiz/);
  assert.match(output.qualityWarnings.join(" / "), /缺少术语卡/);
  assert.match(output.qualityWarnings.join(" / "), /缺少广度卡/);
  assert.match(output.qualityWarnings.join(" / "), /缺少 commonBugs/);
  assert.match(output.qualityWarnings.join(" / "), /正文过短/);
  assert.match(output.qualityWarnings.join(" / "), /重复近期主题/);
  assert.match(output.qualityWarnings.join(" / "), /JSON repair 或 fallback/);
});

test("readPersistedDailyGenerationQuality reads persisted snapshots", () => {
  const output = buildPersistedDailyGenerationOutput({
    tpl: pickDailyTemplate({ topicSlug: "transformer" }),
    source: "deepseek",
    topicSlug: "transformer",
    recentStudies: [],
  });

  assert.deepEqual(readPersistedDailyGenerationQuality(output), {
    qualityScore: output.qualityScore,
    qualityChecks: output.qualityChecks,
    qualityWarnings: output.qualityWarnings,
    qualityMetrics: output.qualityMetrics,
  });
  assert.equal(readPersistedDailyGenerationQuality({ qualityScore: "bad" }), null);
});

test("summarizeDailyGenerationQualityJobs builds an admin quality queue", () => {
  const good = buildPersistedDailyGenerationOutput({
    tpl: pickDailyTemplate({ topicSlug: "transformer" }),
    source: "deepseek",
    topicSlug: "transformer",
    recentStudies: [],
  });
  const degraded = buildPersistedDailyGenerationOutput({
    tpl: {
      ...pickDailyTemplate({ topicSlug: "rag" }),
      lesson: {
        ...pickDailyTemplate({ topicSlug: "rag" }).lesson,
        contentMarkdown: "太短",
        guidedSteps: [],
      },
    },
    source: "template",
    topicSlug: "rag",
    recentStudies: [{ domainSlug: "llm-rag-agent", topicSlug: "rag", localDate: "2026-06-01" }],
    generationRetries: 1,
  });

  const summary = summarizeDailyGenerationQualityJobs([
    {
      id: "job-good",
      type: "daily_plan",
      status: "success",
      createdAt: new Date("2026-06-03T00:00:00.000Z"),
      output: good,
    },
    {
      id: "job-low",
      type: "daily_plan",
      status: "success",
      createdAt: new Date("2026-06-02T00:00:00.000Z"),
      output: degraded,
    },
    {
      id: "job-failed",
      type: "daily_plan",
      status: "failed",
      createdAt: new Date("2026-06-01T00:00:00.000Z"),
      output: null,
      error: "json parse failed",
    },
  ]);

  assert.equal(summary.scannedCount, 3);
  assert.equal(summary.snapshotCount, 2);
  assert.equal(summary.failedCount, 1);
  assert.equal(summary.lowScoreCount, 1);
  assert.ok(summary.averageScore > 0);
  assert.match(summary.topWarnings.join(" / "), /正文过短|JSON repair 或 fallback/);
  assert.equal(summary.attentionItems[0]?.id, "job-low");
  assert.equal(summary.attentionItems.some((item) => item.id === "job-failed"), true);
});
