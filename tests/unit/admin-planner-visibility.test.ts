import test from "node:test";
import assert from "node:assert/strict";
import { buildAdminPlannerJobSummary } from "@/server/admin/planner-visibility";

test("buildAdminPlannerJobSummary exposes AiGenerationJob curriculum input for admin audit", () => {
  const summary = buildAdminPlannerJobSummary({
    localDate: "2026-05-25",
    timeZone: "Asia/Shanghai",
    topicSlug: "python-lists",
    schemaVersion: "2.3",
    curriculum: {
      domain: "Python / 代码表达",
      domainSlug: "python-coding",
      topic: "列表与字典",
      topicSlug: "python-lists",
      reason: "codingNeed=1.00, misconception=0.80",
      difficulty: "easy",
      estimatedMinutes: 35,
      scoreBreakdown: {
        codingNeedScore: 1,
        misconceptionScore: 0.8,
        recentTopicPenalty: true,
      },
      signalSnapshot: {
        recentStudies: [
          { domainSlug: "llm-rag-agent", topicSlug: "rag", localDate: "2026-05-24" },
        ],
        completedCountByDomain: { "python-coding": 0 },
        dueCountByDomain: { "python-coding": 3 },
        hardReviewCountByDomain: { "python-coding": 2 },
        incorrectQuizCountByDomain: { "python-coding": 4 },
        activeMisconceptionCountByDomain: { "python-coding": 1 },
        mapWeaknessByDomain: { "python-coding": 0.7 },
        codeSubmissionCountLast7: 0,
      },
    },
  });

  assert.ok(summary);
  assert.equal(summary.localDate, "2026-05-25");
  assert.equal(summary.schemaVersion, "2.3");
  assert.equal(summary.selectedDomain, "Python / 代码表达");
  assert.equal(summary.selectedTopic, "列表与字典");
  assert.match(summary.mainReason, /列表与字典/);
  assert.match(summary.rawReason, /codingNeed=1\.00/);
  assert.deepEqual(
    summary.activeSignals.map((signal) => signal.key),
    ["misconception", "codingNeed"],
  );
  assert.equal(summary.signalSummary?.domainSlug, "python-coding");
  assert.match(summary.signalSummary?.recentStudyText ?? "", /llm-rag-agent\/rag/);
  assert.match(summary.signalSummary?.items.find((item) => item.key === "codingPractice")?.detail ?? "", /0 次/);
});

test("buildAdminPlannerJobSummary returns null for jobs without curriculum input", () => {
  assert.equal(
    buildAdminPlannerJobSummary({
      localDate: "2026-05-25",
      timeZone: "Asia/Shanghai",
      topicSlug: "manual",
    }),
    null,
  );
});
