import test from "node:test";
import assert from "node:assert/strict";
import {
  buildTodayCurriculumSignalInsight,
  extractCurriculumSignalSnapshot,
  summarizeCurriculumSignalSnapshot,
} from "@/server/curriculum/signal-snapshot";

test("summarizeCurriculumSignalSnapshot exposes planner audit signals for admin", () => {
  const summary = summarizeCurriculumSignalSnapshot(
    {
      recentStudies: [
        { domainSlug: "llm-rag-agent", topicSlug: "rag", localDate: "2026-05-24" },
        { domainSlug: "python-coding", topicSlug: "lists", localDate: "2026-05-23" },
      ],
      completedCountByDomain: { "llm-rag-agent": 3 },
      dueCountByDomain: { "python-coding": 2 },
      hardReviewCountByDomain: { "python-coding": 1 },
      incorrectQuizCountByDomain: { "python-coding": 4 },
      activeMisconceptionCountByDomain: { "python-coding": 5 },
      mapWeaknessByDomain: { "python-coding": 0.85 },
      codeSubmissionCountLast7: 0,
    },
    "python-coding",
  );

  assert.equal(summary.recentStudyText, "2026-05-24 llm-rag-agent/rag; 2026-05-23 python-coding/lists");
  assert.deepEqual(
    summary.items.filter((item) => item.active).map((item) => item.key),
    [
      "activeMisconceptions",
      "incorrectQuiz",
      "dueReview",
      "hardReview",
      "mapWeakness",
      "codingPractice",
      "completedCoverage",
    ],
  );
  assert.match(summary.items[0]?.detail ?? "", /python-coding/);
  assert.match(summary.items[0]?.detail ?? "", /5/);
  assert.match(summary.items.find((item) => item.key === "completedCoverage")?.detail ?? "", /已完成 0/);
  assert.match(summary.notes.join("\n"), /近 7 天代码提交为 0/);
});

test("extractCurriculumSignalSnapshot reads decision snapshot from log input", () => {
  const snapshot = extractCurriculumSignalSnapshot({
    decision: {
      signalSnapshot: {
        recentStudies: [],
        completedCountByDomain: {},
        dueCountByDomain: {},
        hardReviewCountByDomain: {},
        incorrectQuizCountByDomain: {},
        activeMisconceptionCountByDomain: { "python-coding": 1 },
        mapWeaknessByDomain: {},
        codeSubmissionCountLast7: 2,
      },
    },
  });

  assert.equal(snapshot?.activeMisconceptionCountByDomain["python-coding"], 1);
  assert.equal(snapshot?.codeSubmissionCountLast7, 2);
});

test("buildTodayCurriculumSignalInsight keeps learner-facing active planner signals", () => {
  const insight = buildTodayCurriculumSignalInsight(
    {
      decision: {
        signalSnapshot: {
          recentStudies: [
            { domainSlug: "python-coding", topicSlug: "loops", localDate: "2026-05-24" },
          ],
          completedCountByDomain: { "python-coding": 0 },
          dueCountByDomain: { "python-coding": 3 },
          hardReviewCountByDomain: { "python-coding": 2 },
          incorrectQuizCountByDomain: { "python-coding": 4 },
          activeMisconceptionCountByDomain: { "python-coding": 1 },
          mapWeaknessByDomain: { "python-coding": 0.8 },
          codeSubmissionCountLast7: 0,
        },
      },
    },
    "python-coding",
  );

  assert.ok(insight);
  assert.equal(insight.domainSlug, "python-coding");
  assert.equal(insight.recentStudyText, "2026-05-24 python-coding/loops");
  assert.deepEqual(
    insight.highlights.map((item) => item.key),
    [
      "activeMisconceptions",
      "incorrectQuiz",
      "dueReview",
      "hardReview",
      "mapWeakness",
      "codingPractice",
      "completedCoverage",
    ],
  );
  assert.match(insight.summaryText, /错题|复习|代码|覆盖/);
  assert.match(insight.highlights[0]?.detail ?? "", /python-coding/);
});
