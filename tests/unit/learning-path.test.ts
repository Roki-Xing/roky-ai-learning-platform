import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLearningPathSnapshot } from "@/server/learning/path";

test("learning path picks today's domain as current stage and exposes next stage", () => {
  const snapshot = buildLearningPathSnapshot({
    mission: {
      title: "继续今日学习",
      reason: "今天的主课还没完成。",
      href: "/today",
      ctaLabel: "继续",
      tone: "info",
    },
    missionSignals: [],
    todayFocus: {
      lessonTitle: "RAG 检索链路",
      domainSlug: "llm-rag-agent",
      reason: "最近 RAG 误区比较多，所以今天继续补这一块。",
      localDate: "2026-06-02",
    },
    domainStats: [
      {
        slug: "python-coding",
        label: "Python / 代码表达",
        completedLessons: 3,
        plannedLessons: 0,
        dueFlashcardCount: 0,
        reviewedFlashcards: 6,
        quizAttempts: 0,
        correctQuizAnswers: 0,
        codeSubmissions: 2,
        activeMisconceptions: 0,
        lastStudiedLocalDate: "2026-05-20",
      },
      {
        slug: "llm-rag-agent",
        label: "LLM / RAG / Agent",
        completedLessons: 2,
        plannedLessons: 1,
        dueFlashcardCount: 2,
        reviewedFlashcards: 4,
        codeSubmissions: 0,
        activeMisconceptions: 2,
        quizAttempts: 4,
        correctQuizAnswers: 3,
        lastStudiedLocalDate: "2026-06-02",
      },
      {
        slug: "ai-fundamentals",
        label: "AI 基础",
        completedLessons: 1,
        plannedLessons: 1,
        dueFlashcardCount: 1,
        reviewedFlashcards: 2,
        codeSubmissions: 0,
        activeMisconceptions: 0,
        quizAttempts: 2,
        correctQuizAnswers: 1,
        lastStudiedLocalDate: "2026-05-31",
      },
    ],
    startedProjects: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    knowledgeCardsReviewed: 3,
  });

  assert.equal(snapshot.currentStage.title, "LLM / RAG / Agent");
  assert.equal(snapshot.currentStage.status, "current");
  assert.equal(snapshot.nextStage?.title, "AI 工程实践");
  assert.equal(snapshot.todayFocus.lessonTitle, "RAG 检索链路");
  assert.match(snapshot.todayFocus.reason, /RAG/);
  assert.equal(snapshot.stages[0]?.status, "completed");
  assert.match(snapshot.currentStage.blockers.join(" / "), /到期卡片 3/);
  assert.equal(snapshot.currentStage.metrics.quizAccuracy, 67);
  assert.match(snapshot.currentStage.unlockCondition, /还差/);
  assert.match(snapshot.currentStage.nextTopic, /RAG/);
});

test("learning path falls back to first unfinished stage when today has no domain focus", () => {
  const snapshot = buildLearningPathSnapshot({
    mission: {
      title: "去复习",
      reason: "到期卡片比较多。",
      href: "/review",
      ctaLabel: "去复习",
      tone: "warning",
    },
    missionSignals: [],
    todayFocus: {
      lessonTitle: null,
      domainSlug: null,
      reason: null,
      localDate: "2026-06-02",
    },
    domainStats: [
      {
        slug: "python-coding",
        label: "Python / 代码表达",
        completedLessons: 1,
        plannedLessons: 1,
        dueFlashcardCount: 0,
        reviewedFlashcards: 2,
        codeSubmissions: 0,
        activeMisconceptions: 0,
        quizAttempts: 0,
        correctQuizAnswers: 0,
        lastStudiedLocalDate: "2026-05-29",
      },
    ],
    startedProjects: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    knowledgeCardsReviewed: 0,
  });

  assert.equal(snapshot.currentStage.title, "Python 表达能力");
  assert.equal(snapshot.currentStage.status, "current");
  assert.equal(snapshot.nextStage?.title, "数据结构基础");
  assert.match(snapshot.todayFocus.reason, /Python 表达能力/);
  assert.equal(snapshot.currentStage.criteria[0]?.done, false);
  assert.match(snapshot.currentStage.unlockCondition, /主课完成/);
  assert.match(snapshot.currentStage.nextTopic, /Python/);
});

test("path page renders quiz accuracy, unlock condition, and next topic labels", () => {
  const source = readFileSync("src/app/path/page.tsx", "utf8");

  assert.match(source, /测验正确率/);
  assert.match(source, /解锁条件/);
  assert.match(source, /下一步主题/);
  assert.match(source, /项目里程碑：/);
  assert.doesNotMatch(source, /milestone：/);
  assert.match(source, /阶段进度：/);
  assert.match(source, /badge="学习路径"/);
  assert.doesNotMatch(source, /badge="Path"/);
  assert.match(source, /第 \{index \+ 1\} 阶段/);
  assert.doesNotMatch(source, /Stage \{index \+ 1\}/);
  assert.match(source, />下一阶段</);
  assert.doesNotMatch(source, />Next Stage</);
});

test("path stage cards keep mobile touch targets on route CTAs", () => {
  const source = readFileSync("src/app/path/page.tsx", "utf8");

  assert.match(source, /const pathStageCtaClassName =\s*"min-h-11 w-full sm:w-auto[^"]*";/);
  assert.match(
    source,
    /<a\s+href=\{stage\.href\}\s+className=\{pathStageCtaClassName\}\s*>\s*\{stage\.ctaLabel\}\s*<\/a>/,
  );
});
