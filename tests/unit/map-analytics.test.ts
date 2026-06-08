import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  aggregateKnowledgeMapStats,
  buildVisibleKnowledgeMapTopics,
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

test("buildVisibleKnowledgeMapTopics caps first-screen topic rendering and reports hidden topics", () => {
  const topics = Array.from({ length: 24 }, (_, index) => ({
    id: `topic-${index}`,
    slug: `topic-${index}`,
    title: `Topic ${index}`,
    summary: `Summary ${index}`,
    depthLevel: index % 3,
  }));

  const result = buildVisibleKnowledgeMapTopics(topics, 8);

  assert.equal(result.visibleTopics.length, 8);
  assert.equal(result.hiddenCount, 16);
  assert.equal(result.totalCount, 24);
  assert.equal(result.visibleTopics.at(-1)?.slug, "topic-7");
});

test("buildVisibleKnowledgeMapTopics keeps an active item inside the rendered window", () => {
  const topics = Array.from({ length: 24 }, (_, index) => ({
    id: `topic-${index}`,
    slug: `topic-${index}`,
    title: `Topic ${index}`,
    summary: `Summary ${index}`,
    depthLevel: index % 3,
  }));

  const result = buildVisibleKnowledgeMapTopics(topics, 8, "topic-18");

  assert.equal(result.visibleTopics.length, 8);
  assert.equal(result.hiddenCount, 16);
  assert.ok(result.visibleTopics.some((topic) => topic.slug === "topic-18"));
  assert.equal(result.visibleTopics.at(0)?.slug, "topic-11");
});

test("map domain cards expose specific progress bar labels", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(source, /领域掌握进度：/);
});

test("map domain detail localizes review log labels", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(source, /复习记录：\{stat\.reviewLogCount\}/);
  assert.match(source, /掌握分 = 完成课程 \* 10 \+ 复习记录 \* 2 \+ 正确测验 \* 3/);
  assert.doesNotMatch(source, /ReviewLog：\{stat\.reviewLogCount\}/);
  assert.doesNotMatch(source, /掌握分 = 完成课程 \* 10 \+ ReviewLog \* 2/);
});

test("map summary insight CTAs stay mobile friendly", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(source, /const mapSummaryCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const viewDomainIndex = source.indexOf("查看领域");
  assert.notEqual(viewDomainIndex, -1);
  const viewDomainButton = source.slice(Math.max(0, viewDomainIndex - 220), viewDomainIndex + 80);
  assert.match(viewDomainButton, /className=\{mapSummaryCtaClassName\}/);

  const emptySignalIndex = source.indexOf("暂无信号");
  assert.notEqual(emptySignalIndex, -1);
  const emptySignalButton = source.slice(Math.max(0, emptySignalIndex - 220), emptySignalIndex + 80);
  assert.match(emptySignalButton, /className=\{mapSummaryCtaClassName\}/);
});

test("map domain list links stay mobile friendly", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(
    source,
    /const mapDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";/,
  );

  const domainListIndex = source.indexOf("领域列表");
  assert.notEqual(domainListIndex, -1);
  const domainListBlock = source.slice(domainListIndex, domainListIndex + 900);
  assert.match(domainListBlock, /mapDomainLinkClassName,\s*active \? "bg-muted" : "hover:bg-muted\/50"/);
  assert.doesNotMatch(
    domainListBlock,
    /"rounded-md border px-3 py-2 text-sm transition-colors",\s*active \?/,
  );
});

test("map next lesson CTA stays mobile friendly", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(source, /const mapPageCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const nextLessonIndex = source.indexOf("生成下一节");
  assert.notEqual(nextLessonIndex, -1);
  const nextLessonButton = source.slice(Math.max(0, nextLessonIndex - 220), nextLessonIndex + 80);
  assert.match(nextLessonButton, /className=\{mapPageCtaClassName\}/);
});

test("map next focus link stays mobile friendly", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(
    source,
    /const mapNextFocusLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2";/,
  );

  const nextFocusIndex = source.indexOf("优先补：");
  assert.notEqual(nextFocusIndex, -1);
  const nextFocusBlock = source.slice(nextFocusIndex, nextFocusIndex + 520);
  assert.match(nextFocusBlock, /className=\{mapNextFocusLinkClassName\}/);
  assert.doesNotMatch(
    nextFocusBlock,
    /className="font-medium text-primary underline underline-offset-2"/,
  );
});

test("map related lesson links stay mobile friendly", () => {
  const source = readFileSync("src/app/map/page.tsx", "utf8");

  assert.match(
    source,
    /const mapRelatedLessonLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted\/50";/,
  );

  const relatedCoursesIndex = source.indexOf("相关课程");
  assert.notEqual(relatedCoursesIndex, -1);
  const relatedCoursesBlock = source.slice(
    Math.max(0, relatedCoursesIndex - 120),
    relatedCoursesIndex + 650,
  );
  assert.match(relatedCoursesBlock, /className=\{mapRelatedLessonLinkClassName\}/);
  assert.doesNotMatch(
    source,
    /className="rounded-md border px-3 py-2 transition-colors hover:bg-muted\/50"/,
  );
});

test("map page routes visible status source and type labels through display helpers", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatFlashcardTypeLabel, "function");
  assert.equal(typeof labels.formatMapMisconceptionStatusLabel, "function");
  assert.equal(labels.formatKnowledgeEntityTypeLabel("open_source_project"), "开源项目");
  assert.equal(labels.formatFlashcardTypeLabel("code_bug"), "代码反馈卡");
  assert.equal(labels.formatFlashcardTypeLabel("quiz_error"), "错题卡");
  assert.equal(labels.formatMapMisconceptionStatusLabel("open"), "未解决");
  assert.equal(labels.formatMapMisconceptionStatusLabel("resolved"), "已解决");

  const source = readFileSync("src/app/map/page.tsx", "utf8");
  assert.match(source, /formatKnowledgeEntityTypeLabel\(group\.type\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(plan\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(plan\.source\)/);
  assert.match(source, /formatFlashcardTypeLabel\(card\.type\)/);
  assert.match(source, /formatMapMisconceptionStatusLabel\(item\.status\)/);
  assert.doesNotMatch(source, /\{group\.type\} \{group\._count\._all\}/);
  assert.doesNotMatch(source, /\{plan\.localDate\} \/ \{plan\.status\} \/ \{plan\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /\{card\.type\}/);
  assert.doesNotMatch(source, /\{item\.status\} x\{item\.occurrenceCount\}/);
  assert.doesNotMatch(source, /score \{stat\.masteryScore\}/);
  assert.doesNotMatch(source, /masteryScore =/);
});
