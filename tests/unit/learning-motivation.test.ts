import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  buildBreadthChallengeFromLessonConnections,
  buildDailyQuests,
  type DailyQuestInput,
} from "@/server/learning/daily-quests";
import {
  calculateLearningXp,
  getLearningLevel,
} from "@/server/learning/xp";
import {
  buildLearningMomentum,
} from "@/server/learning/momentum";
import { buildLearningBadges } from "@/server/learning/badges";
import {
  buildLearningHabitGoal,
  countCompletedDaysInLocalWeek,
} from "@/server/learning/habit-goal";
import { DailyQuestCard } from "@/components/learning/daily-quest-card";
import { XpLevelCard } from "@/components/learning/xp-level-card";
import { BadgeShelf } from "@/components/learning/badge-shelf";
import { LearningHabitGoalCard } from "@/components/learning/learning-habit-goal-card";
import { LearningMomentumStrip } from "@/components/learning/learning-momentum-strip";

const questInput: DailyQuestInput = {
  todayPlanStatus: "completed",
  dueFlashcardsCount: 0,
  todayNoteCount: 1,
  todayVoiceNoteCount: 0,
  todayCodeSubmissionCount: 1,
  activeProjectMilestoneCompletedToday: false,
};

test("daily quests convert learning signals into actionable rewards", () => {
  const quests = buildDailyQuests(questInput);

  assert.equal(quests.length, 5);
  assert.equal(quests[0]?.id, "complete-today");
  assert.equal(quests[0]?.status, "completed");
  assert.equal(quests[0]?.rewardXp, 50);
  assert.equal(quests[1]?.id, "clear-review");
  assert.equal(quests[1]?.status, "completed");
  assert.equal(quests[2]?.id, "write-note");
  assert.equal(quests[2]?.status, "completed");
  assert.equal(quests[3]?.id, "voice-reflection");
  assert.equal(quests[3]?.status, "not_started");
  assert.equal(quests[4]?.href, "/projects");
});

test("daily quests include today's breadth challenge from glossary or radar focus", () => {
  const termQuests = buildDailyQuests({
    ...questInput,
    breadthChallenge: {
      kind: "term",
      title: "RAG",
      href: "/glossary?term=rag",
      completed: false,
    },
  });
  const personQuests = buildDailyQuests({
    ...questInput,
    breadthChallenge: {
      kind: "person",
      title: "Shunyu Yao",
      href: "/radar?entity=shunyu-yao",
      completed: true,
    },
  });
  const benchmarkQuests = buildDailyQuests({
    ...questInput,
    breadthChallenge: {
      kind: "benchmark",
      title: "SWE-bench",
      href: "/radar?entity=swe-bench",
      completed: false,
    },
  });

  const termQuest = termQuests.find((quest) => quest.id === "breadth-challenge");
  assert.equal(termQuests.length, 6);
  assert.equal(termQuest?.title, "今日术语挑战");
  assert.equal(termQuest?.description, "理解并自测：RAG。");
  assert.equal(termQuest?.href, "/glossary?term=rag");
  assert.equal(termQuest?.status, "not_started");

  const personQuest = personQuests.find((quest) => quest.id === "breadth-challenge");
  assert.equal(personQuest?.title, "今日人物挑战");
  assert.equal(personQuest?.status, "completed");

  const benchmarkQuest = benchmarkQuests.find((quest) => quest.id === "breadth-challenge");
  assert.equal(benchmarkQuest?.title, "今日 Benchmark 挑战");
  assert.equal(benchmarkQuest?.ctaLabel, "探索");
});

test("breadth challenge maps lesson knowledge connections into glossary or radar quest input", () => {
  const termChallenge = buildBreadthChallengeFromLessonConnections({
    userId: "demo-user",
    connections: {
      glossary: {
        term: "RAG",
        sourceSlug: "rag",
      },
      breadth: {
        kind: "benchmark",
        title: "SWE-bench",
        sourceKind: "radar",
        sourceSlug: "swe-bench",
      },
    },
    generatedCardIds: new Set(),
  });
  const completedPersonChallenge = buildBreadthChallengeFromLessonConnections({
    userId: "demo-user",
    connections: {
      breadth: {
        kind: "person",
        title: "Shunyu Yao",
        sourceKind: "radar",
        sourceSlug: "shunyu-yao",
      },
    },
    generatedCardIds: new Set(["radar:demo-user:shunyu-yao"]),
  });
  const benchmarkChallenge = buildBreadthChallengeFromLessonConnections({
    userId: "demo-user",
    connections: {
      breadth: {
        kind: "benchmark",
        title: "SWE-bench",
        sourceKind: "radar",
        sourceSlug: "swe-bench",
      },
    },
    generatedCardIds: new Set(),
  });

  assert.deepEqual(termChallenge, {
    kind: "term",
    title: "RAG",
    href: "/glossary?term=rag",
    completed: false,
  });
  assert.deepEqual(completedPersonChallenge, {
    kind: "person",
    title: "Shunyu Yao",
    href: "/radar?entity=shunyu-yao",
    completed: true,
  });
  assert.deepEqual(benchmarkChallenge, {
    kind: "benchmark",
    title: "SWE-bench",
    href: "/radar?entity=swe-bench",
    completed: false,
  });
});

test("breadth challenge follows the daily knowledge rotation when glossary and radar both exist", () => {
  const benchmarkChallenge = buildBreadthChallengeFromLessonConnections({
    userId: "demo-user",
    connections: {
      glossary: {
        term: "RAG",
        sourceSlug: "rag",
      },
      breadth: {
        kind: "benchmark",
        title: "SWE-bench",
        sourceKind: "radar",
        sourceSlug: "swe-bench",
      },
      knowledgeFocus: {
        rotation: { focus: "benchmark" },
      },
    },
    generatedCardIds: new Set(),
  });
  const personChallenge = buildBreadthChallengeFromLessonConnections({
    userId: "demo-user",
    connections: {
      glossary: {
        term: "RAG",
        sourceSlug: "rag",
      },
      breadth: {
        kind: "person",
        title: "Shunyu Yao",
        sourceKind: "radar",
        sourceSlug: "shunyu-yao",
      },
      knowledgeFocus: {
        rotation: { focus: "person" },
      },
    },
    generatedCardIds: new Set(["radar:demo-user:shunyu-yao"]),
  });

  assert.deepEqual(benchmarkChallenge, {
    kind: "benchmark",
    title: "SWE-bench",
    href: "/radar?entity=swe-bench",
    completed: false,
  });
  assert.deepEqual(personChallenge, {
    kind: "person",
    title: "Shunyu Yao",
    href: "/radar?entity=shunyu-yao",
    completed: true,
  });
});

test("xp calculation and levels are derived from existing activity counts", () => {
  const xp = calculateLearningXp({
    completedLessons: 8,
    reviewedCards: 21,
    correctQuizAttempts: 12,
    codeSubmissions: 3,
    resolvedMisconceptions: 2,
    notes: 5,
    voiceNotes: 4,
    completedProjectMilestones: 2,
  });
  const level = getLearningLevel(xp.totalXp);

  assert.equal(xp.breakdown.completedLessons, 400);
  assert.equal(xp.breakdown.reviewedCards, 105);
  assert.equal(xp.breakdown.correctQuizAttempts, 120);
  assert.equal(xp.breakdown.codeSubmissions, 90);
  assert.equal(xp.breakdown.resolvedMisconceptions, 80);
  assert.equal(xp.breakdown.notes, 100);
  assert.equal(xp.breakdown.voiceNotes, 80);
  assert.equal(xp.breakdown.completedProjectMilestones, 160);
  assert.equal(xp.totalXp, 1135);
  assert.equal(level.label, "Algorithm Thinker");
  assert.equal(level.nextLabel, "LLM Practitioner");
});

test("xp level card localizes learner-visible level labels", () => {
  const xp = calculateLearningXp({
    completedLessons: 8,
    reviewedCards: 21,
    correctQuizAttempts: 12,
    codeSubmissions: 3,
    resolvedMisconceptions: 2,
    notes: 5,
    voiceNotes: 4,
    completedProjectMilestones: 2,
  });
  const markup = renderToStaticMarkup(
    React.createElement(XpLevelCard, { xp }),
  );

  assert.match(markup, /第 3 级/);
  assert.match(markup, /算法思考者/);
  assert.match(markup, /距离 LLM 实践者还差 665 XP/);
  assert.doesNotMatch(markup, /Lv\./);
  assert.doesNotMatch(markup, /Algorithm Thinker|LLM Practitioner/);
});

test("badge shelf marks earned and next badges without persistence", () => {
  const badges = buildLearningBadges({
    streakDays: 7,
    codeSubmissions: 1,
    voiceNotes: 1,
    thoughtReviews: 0,
    resolvedMisconceptions: 1,
    completedProjects: 0,
    glossaryCards: 10,
    radarCards: 6,
  });

  assert.equal(badges.find((badge) => badge.id === "streak-7")?.earned, true);
  assert.equal(badges.find((badge) => badge.id === "first-code")?.earned, true);
  assert.equal(badges.find((badge) => badge.id === "first-voice")?.title, "首次语音笔记");
  assert.equal(badges.find((badge) => badge.id === "first-coach")?.earned, false);
  assert.equal(badges.find((badge) => badge.id === "radar-10")?.progressCurrent, 6);
});

test("weekly habit goal exposes streak protection and lightweight mode", () => {
  assert.equal(
    countCompletedDaysInLocalWeek({
      completedLocalDates: ["2026-06-05", "2026-06-04", "2026-06-01", "2026-05-30"],
      todayLocalDate: "2026-06-05",
    }),
    3,
  );

  const habit = buildLearningHabitGoal({
    completedDaysThisWeek: 4,
    weeklyTargetDays: 5,
    streakDays: 6,
    todayQuestCompleted: false,
    lightweightQuestHref: "/voice?mode=daily_understanding",
  });

  assert.equal(habit.weekly.completedDays, 4);
  assert.equal(habit.weekly.targetDays, 5);
  assert.equal(habit.weekly.remainingDays, 1);
  assert.equal(habit.protection.status, "at_risk");
  assert.match(habit.protection.message, /连续学习保护/);
  assert.equal(habit.lightweightMode.href, "/voice?mode=daily_understanding");

  const markup = renderToStaticMarkup(
    React.createElement(LearningHabitGoalCard, { goal: habit }),
  );

  assert.match(markup, /周目标/);
  assert.match(markup, /4\/5 天/);
  assert.match(markup, /aria-label="周目标进度"/);
  assert.match(markup, /连续学习保护/);
  assert.match(markup, /轻量学习模式/);
  assert.match(markup, /60 秒语音/);
  assert.match(markup, /min-h-11 w-full sm:w-auto/);
  assert.doesNotMatch(markup, /class="[^"]* mt-3"/);
});

test("motivation components render compact learning progress", () => {
  const quests = buildDailyQuests(questInput);
  const xp = calculateLearningXp({
    completedLessons: 2,
    reviewedCards: 4,
    correctQuizAttempts: 3,
    codeSubmissions: 1,
    resolvedMisconceptions: 0,
    notes: 1,
    voiceNotes: 0,
    completedProjectMilestones: 0,
  });
  const badges = buildLearningBadges({
    streakDays: 2,
    codeSubmissions: 1,
    voiceNotes: 0,
    thoughtReviews: 1,
    resolvedMisconceptions: 0,
    completedProjects: 0,
    glossaryCards: 2,
    radarCards: 0,
  });

  const markup = renderToStaticMarkup(
    React.createElement("div", null,
      React.createElement(DailyQuestCard, { quests }),
      React.createElement(XpLevelCard, { xp }),
      React.createElement(BadgeShelf, { badges }),
    ),
  );

  assert.match(markup, /今日任务/);
  assert.match(markup, /完成今日学习/);
  assert.match(markup, /XP/);
  assert.match(markup, /aria-label="今日任务进度"/);
  assert.match(markup, /aria-label="XP 等级进度"/);
  assert.match(markup, /aria-label="徽章进度：首次提交代码"/);
  assert.doesNotMatch(markup, /aria-label="学习进度"/);
  assert.match(markup, /代码建造者|AI 探索者/);
  assert.doesNotMatch(markup, /Code Builder|AI Explorer/);
  assert.match(markup, /徽章/);
  assert.match(markup, /已解锁 \d+ 个/);
  assert.doesNotMatch(markup, />\d+ earned</);
  assert.match(markup, /首次提交代码/);
});

test("learning momentum turns homepage signals into next unlock guidance", () => {
  const quests = buildDailyQuests(questInput);
  const xp = calculateLearningXp({
    completedLessons: 8,
    reviewedCards: 21,
    correctQuizAttempts: 12,
    codeSubmissions: 3,
    resolvedMisconceptions: 2,
    notes: 5,
    voiceNotes: 4,
    completedProjectMilestones: 2,
  });
  const momentum = buildLearningMomentum({
    xp,
    quests,
    streakDays: 6,
    completedDaysThisWeek: 3,
    weeklyTargetDays: 5,
  });

  assert.equal(momentum.stageLabel, "算法思考者");
  assert.equal(momentum.nextUnlockLabel, "LLM 实践者");
  assert.equal(momentum.nextUnlockProgress, "26%");
  assert.equal(momentum.weeklyLabel, "3/5 天");
  assert.equal(momentum.dailyLoopLabel, "4/5");
  assert.equal(momentum.encouragement, "今天还差 1 步，把语音复盘补上就能收尾。");
});

test("learning momentum strip renders compact desktop and mobile status", () => {
  const quests = buildDailyQuests(questInput);
  const xp = calculateLearningXp({
    completedLessons: 8,
    reviewedCards: 21,
    correctQuizAttempts: 12,
    codeSubmissions: 3,
    resolvedMisconceptions: 2,
    notes: 5,
    voiceNotes: 4,
    completedProjectMilestones: 2,
  });
  const momentum = buildLearningMomentum({
    xp,
    quests,
    streakDays: 6,
    completedDaysThisWeek: 3,
    weeklyTargetDays: 5,
  });
  const markup = renderToStaticMarkup(
    React.createElement(LearningMomentumStrip, { momentum }),
  );

  assert.match(markup, /学习状态/);
  assert.match(markup, /算法思考者/);
  assert.match(markup, /下一步解锁/);
  assert.match(markup, /LLM 实践者/);
  assert.match(markup, /本周目标/);
  assert.match(markup, /3\/5 天/);
  assert.match(markup, /今日闭环/);
  assert.match(markup, /4\/5/);
  assert.match(markup, /aria-label="下一步解锁进度"/);
  assert.match(markup, /今天还差 1 步/);
  assert.doesNotMatch(markup, /Algorithm Thinker|LLM Practitioner/);
});

test("daily quest card actions use full-width mobile touch targets", () => {
  const quests = buildDailyQuests(questInput);
  const markup = renderToStaticMarkup(
    React.createElement(DailyQuestCard, { quests }),
  );

  assert.match(markup, /今日任务/);
  assert.match(markup, /完成今日学习/);
  assert.match(markup, /grid gap-2 sm:flex sm:items-center sm:justify-end/);
  const questCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(questCtaMatches.length, quests.length);
});
