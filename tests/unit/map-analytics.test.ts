import test from "node:test";
import assert from "node:assert/strict";
import {
  aggregateKnowledgeMapStats,
  buildKnowledgeMapInsights,
  createEmptyKnowledgeMapStat,
  calculateKnowledgeMapMasteryScore,
} from "@/server/map/analytics";

test("calculateKnowledgeMapMasteryScore follows the long-term map formula", () => {
  const score = calculateKnowledgeMapMasteryScore({
    completedLessons: 3,
    reviewLogCount: 4,
    correctQuizCount: 2,
    codeSubmissionCount: 1,
    dueFlashcardCount: 5,
    activeMisconceptionCount: 2,
  });

  assert.equal(score, 32);
});

test("calculateKnowledgeMapMasteryScore clamps to 0..100", () => {
  assert.equal(
    calculateKnowledgeMapMasteryScore({
      completedLessons: 0,
      reviewLogCount: 0,
      correctQuizCount: 0,
      codeSubmissionCount: 0,
      dueFlashcardCount: 20,
      activeMisconceptionCount: 20,
    }),
    0,
  );

  assert.equal(
    calculateKnowledgeMapMasteryScore({
      completedLessons: 20,
      reviewLogCount: 100,
      correctQuizCount: 100,
      codeSubmissionCount: 20,
      dueFlashcardCount: 0,
      activeMisconceptionCount: 0,
    }),
    100,
  );
});

test("aggregateKnowledgeMapStats combines plans, cards, reviews, quiz attempts, code and misconceptions", () => {
  const now = new Date("2026-05-24T08:00:00.000Z");
  const result = aggregateKnowledgeMapStats({
    now,
    domains: [
      {
        slug: "llm-rag-agent",
        topics: [{ slug: "transformer" }, { slug: "rag" }],
      },
      {
        slug: "python-coding",
        topics: [{ slug: "python-functions" }],
      },
    ],
    plans: [
      {
        id: "plan-1",
        lessonId: "lesson-1",
        localDate: "2026-05-23",
        status: "completed",
        domainSlug: "llm-rag-agent",
        topicSlug: "transformer",
      },
      {
        id: "plan-2",
        lessonId: "lesson-2",
        localDate: "2026-05-24",
        status: "planned",
        domainSlug: "python-coding",
        topicSlug: "python-functions",
      },
    ],
    flashcards: [
      {
        lessonId: "lesson-1",
        domainSlug: "llm-rag-agent",
        topicSlug: "transformer",
        dueAt: new Date("2026-05-24T07:00:00.000Z"),
        reviewCount: 2,
      },
      {
        lessonId: "lesson-2",
        domainSlug: "python-coding",
        topicSlug: "python-functions",
        dueAt: new Date("2026-05-25T07:00:00.000Z"),
        reviewCount: 0,
      },
    ],
    reviewLogs: [
      { lessonId: "lesson-1", domainSlug: "llm-rag-agent", topicSlug: "transformer" },
      { lessonId: "lesson-1", domainSlug: "llm-rag-agent", topicSlug: "transformer" },
    ],
    quizAttempts: [
      { lessonId: "lesson-1", domainSlug: "llm-rag-agent", topicSlug: "transformer", isCorrect: true },
      { lessonId: "lesson-1", domainSlug: "llm-rag-agent", topicSlug: "transformer", isCorrect: false },
      { lessonId: "lesson-2", domainSlug: "python-coding", topicSlug: "python-functions", isCorrect: true },
    ],
    codeSubmissions: [
      { lessonId: "lesson-2", domainSlug: "python-coding", topicSlug: "python-functions" },
    ],
    misconceptions: [
      {
        lessonId: "lesson-1",
        domainSlug: "llm-rag-agent",
        topicSlug: "transformer",
        status: "open",
      },
      {
        lessonId: "lesson-1",
        domainSlug: "llm-rag-agent",
        topicSlug: "transformer",
        status: "resolved",
      },
    ],
  });

  const llm = result.domainStats.get("llm-rag-agent") ?? createEmptyKnowledgeMapStat();
  assert.equal(llm.completedLessons, 1);
  assert.equal(llm.plannedLessons, 0);
  assert.equal(llm.flashcardCount, 1);
  assert.equal(llm.dueFlashcardCount, 1);
  assert.equal(llm.reviewLogCount, 2);
  assert.equal(llm.quizAttemptCount, 2);
  assert.equal(llm.correctQuizCount, 1);
  assert.equal(llm.quizAccuracy, 50);
  assert.equal(llm.codeSubmissionCount, 0);
  assert.equal(llm.misconceptionCount, 2);
  assert.equal(llm.activeMisconceptionCount, 1);
  assert.equal(llm.lastStudiedLocalDate, "2026-05-23");
  assert.equal(llm.masteryScore, 11);

  const pythonTopic = result.topicStats.get("python-functions") ?? createEmptyKnowledgeMapStat();
  assert.equal(pythonTopic.plannedLessons, 1);
  assert.equal(pythonTopic.codeSubmissionCount, 1);
  assert.equal(pythonTopic.correctQuizCount, 1);
  assert.equal(pythonTopic.masteryScore, 6);
});

test("buildKnowledgeMapInsights surfaces weak, review-heavy, code-light, and next focus domains", () => {
  const domainStats = new Map([
    [
      "python-coding",
      {
        ...createEmptyKnowledgeMapStat(),
        completedLessons: 0,
        plannedLessons: 1,
        flashcardCount: 3,
        dueFlashcardCount: 3,
        reviewLogCount: 0,
        quizAttemptCount: 2,
        correctQuizCount: 0,
        quizAccuracy: 0,
        codeSubmissionCount: 0,
        misconceptionCount: 2,
        activeMisconceptionCount: 2,
        lastStudiedLocalDate: "2026-05-24",
        masteryScore: 0,
      },
    ],
    [
      "llm-rag-agent",
      {
        ...createEmptyKnowledgeMapStat(),
        completedLessons: 3,
        flashcardCount: 6,
        dueFlashcardCount: 4,
        reviewLogCount: 5,
        quizAttemptCount: 4,
        correctQuizCount: 3,
        quizAccuracy: 75,
        codeSubmissionCount: 2,
        lastStudiedLocalDate: "2026-05-23",
        masteryScore: 45,
      },
    ],
    [
      "algorithm-design",
      {
        ...createEmptyKnowledgeMapStat(),
        completedLessons: 2,
        flashcardCount: 2,
        dueFlashcardCount: 0,
        reviewLogCount: 4,
        quizAttemptCount: 3,
        correctQuizCount: 3,
        quizAccuracy: 100,
        codeSubmissionCount: 0,
        lastStudiedLocalDate: "2026-05-22",
        masteryScore: 37,
      },
    ],
  ]);

  const insights = buildKnowledgeMapInsights({
    domainStats,
    domainLabels: {
      "python-coding": "Python 编程",
      "llm-rag-agent": "LLM / RAG / Agent",
      "algorithm-design": "算法设计",
    },
  });

  assert.equal(insights.weakDomains[0]?.slug, "python-coding");
  assert.equal(insights.reviewDebtDomains[0]?.slug, "llm-rag-agent");
  assert.deepEqual(
    insights.codeLightDomains.map((item) => item.slug),
    ["python-coding", "algorithm-design"],
  );
  assert.equal(insights.nextFocus?.slug, "python-coding");
  assert.match(insights.nextFocus?.reason ?? "", /活跃错题|复习欠账|代码练习/);
  assert.equal(insights.summaryCards.find((card) => card.key === "weak")?.value, "Python 编程");
});
