import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test?schema=public";
process.env.CRON_SECRET ??= "test-cron-secret";

async function loadCurrentMission() {
  return import("@/server/learning/current-mission");
}

const baseInput = {
  todayPlanStatus: "completed",
  dueFlashcardsCount: 0,
  openMisconceptionCount: 0,
  codeFeedbackNeedsAttentionCount: 0,
  activeProject: null,
  todayLessonId: "lesson-1",
  todayNoteCount: 1,
  todayVoiceNoteCount: 1,
};

test("current mission prioritizes today's lesson before every other queue", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    todayPlanStatus: "planned",
    dueFlashcardsCount: 9,
  });

  assert.equal(mission.href, "/today");
  assert.match(mission.title, /今日学习/);
  assert.equal(mission.ctaLabel, "继续今日学习");
});

test("current mission exposes compact priority and time metadata", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    dueFlashcardsCount: 5,
  });

  assert.equal(mission.priorityLabel, "重要");
  assert.equal(mission.estimatedMinutes, 10);
  assert.equal(mission.companionLabel, "推荐");
});

test("current mission exposes where the learner goes after completion", async () => {
  const { buildCurrentMission } = await loadCurrentMission();

  const lessonMission = buildCurrentMission({
    ...baseInput,
    todayPlanStatus: "planned",
  });
  assert.deepEqual(lessonMission.afterComplete, {
    label: "完成后去复习",
    href: "/review",
  });

  const reviewMission = buildCurrentMission({
    ...baseInput,
    dueFlashcardsCount: 5,
  });
  assert.deepEqual(reviewMission.afterComplete, {
    label: "完成后去语音反思",
    href: "/voice",
  });

  const bookMission = buildCurrentMission({
    ...baseInput,
    activeBookSession: {
      documentId: "ai-engineering",
      title: "AI Engineering",
      currentPage: 12,
      nextPage: 14,
      progressPercent: 36,
    },
  });
  assert.deepEqual(bookMission.afterComplete, {
    label: "读完后生成笔记/卡片",
    href: "/notes",
  });
});

test("current mission progress summarizes the daily learning loop", async () => {
  const { buildCurrentMissionProgress } = await loadCurrentMission();
  const progress = buildCurrentMissionProgress({
    ...baseInput,
    todayPlanStatus: "completed",
    dueFlashcardsCount: 3,
    todayNoteCount: 1,
    todayVoiceNoteCount: 0,
  });

  assert.equal(progress.label, "今日闭环");
  assert.equal(progress.completed, 3);
  assert.equal(progress.total, 5);
  assert.deepEqual(progress.steps, [
    { label: "学习", state: "done", text: "已完成" },
    { label: "复习", state: "current", text: "3 张到期" },
    { label: "表达", state: "done", text: "已表达" },
    { label: "修复", state: "done", text: "已清空" },
    { label: "实践", state: "todo", text: "待实践" },
  ]);
});

test("current mission routes unresolved misconceptions to focused mistake repair", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    openMisconceptionCount: 2,
    openMisconceptionFocus: {
      id: "mistake-1",
      summary: "把 attention 当成简单平均",
      source: "quiz",
      occurrenceCount: 3,
    },
  });

  assert.equal(mission.href, "/mistakes?focus=mistake-1");
  assert.equal(mission.ctaLabel, "去修复");
  assert.equal(mission.tone, "danger");
  assert.match(mission.title, /attention/);
  assert.match(mission.reason, /2 个未解决误区/);
  assert.doesNotMatch(mission.reason, /open misconception/);
});

test("current mission recommends SWE-bench light exploration after main tasks are clear", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    todayPlanStatus: "completed",
    dueFlashcardsCount: 0,
    openMisconceptionCount: 0,
    codeFeedbackNeedsAttentionCount: 0,
    activeProject: null,
    todayNoteCount: 1,
    todayVoiceNoteCount: 1,
  });

  assert.equal(mission.title, "今天轻量探索：认识 SWE-bench");
  assert.equal(mission.href, "/radar?entity=swe-bench");
  assert.equal(mission.ctaLabel, "认识 SWE-bench");
  assert.match(mission.reason, /SWE-bench/);
});

test("current mission recommends active book reading before light exploration", async () => {
  const { buildCurrentMission, buildCurrentMissionSignals, buildCurrentMissionProgress } = await loadCurrentMission();
  const input = {
    ...baseInput,
    todayPlanStatus: "completed",
    dueFlashcardsCount: 0,
    openMisconceptionCount: 0,
    codeFeedbackNeedsAttentionCount: 0,
    activeProject: null,
    todayNoteCount: 1,
    todayVoiceNoteCount: 1,
    activeBookSession: {
      documentId: "ai-engineering",
      title: "AI Engineering",
      currentPage: 12,
      nextPage: 14,
      progressPercent: 36,
    },
  };

  const mission = buildCurrentMission(input);
  const signals = buildCurrentMissionSignals(input);
  const progress = buildCurrentMissionProgress(input);

  assert.equal(mission.title, "今天继续读《AI Engineering》第 12-14 页");
  assert.equal(mission.href, "/books/ai-engineering");
  assert.equal(mission.ctaLabel, "去同读");
  assert.equal(mission.priorityLabel, "轻量");
  assert.equal(mission.estimatedMinutes, 15);
  assert.match(mission.reason, /读完后生成 3 张卡片/);
  assert.equal(signals.find((signal) => signal.label === "同读书籍")?.value, "AI Engineering 36%");
  assert.equal(progress.total, 5);
  assert.deepEqual(progress.steps.map((step) => `${step.label}:${step.state}`), [
    "学习:done",
    "复习:done",
    "表达:done",
    "修复:done",
    "实践:current",
  ]);
});

test("learning sessions expose the unified session fields from current mission state", async () => {
  const { buildLearningSessions } = await loadCurrentMission();

  const sessions = buildLearningSessions({
    input: {
      ...baseInput,
      dueFlashcardsCount: 5,
    },
    completedDaysThisWeek: 3,
  });

  assert.equal(sessions.current.type, "review_session");
  assert.equal(sessions.current.title, "复习 5 张到期卡");
  assert.equal(sessions.current.goal, "清空到期复习，先把今天学过的内容留住。");
  assert.equal(sessions.current.status, "in_progress");
  assert.equal(sessions.current.startedAt, null);
  assert.equal(sessions.current.completedAt, null);
  assert.deepEqual(sessions.current.outputs, ["review logs", "weak signals"]);
  assert.equal(sessions.current.nextRecommendedSession?.type, "voice_reflection");

  assert.equal(sessions.next.type, "voice_reflection");
  assert.equal(sessions.next.title, "说出今天的理解");
  assert.equal(sessions.weekly.title, "本周会话：完成 3/7");
  assert.equal(sessions.weekly.status, "in_progress");
});

test("learning sessions cover all reduce-chaos session types with learner-facing goals", async () => {
  const { buildLearningSessions } = await loadCurrentMission();

  const scenario = (input: typeof baseInput) =>
    buildLearningSessions({ input, completedDaysThisWeek: 7 }).current;

  const sessions = [
    scenario({ ...baseInput, todayPlanStatus: "planned" }),
    scenario({ ...baseInput, dueFlashcardsCount: 3 }),
    scenario({ ...baseInput, openMisconceptionCount: 1, openMisconceptionFocus: { summary: "RAG 评估边界" } }),
    scenario({ ...baseInput, codeFeedbackNeedsAttentionCount: 1, codeFeedbackFocus: { summary: "空向量边界" } }),
    scenario({ ...baseInput, todayNoteCount: 0 }),
    scenario({ ...baseInput, todayVoiceNoteCount: 0 }),
    scenario({
      ...baseInput,
      activeProject: { id: "project-1", title: "Mini RAG", activeMilestoneTitle: "实现 top-k retrieval" },
    }),
    scenario({
      ...baseInput,
      activeBookSession: {
        documentId: "ai-engineering",
        title: "AI Engineering",
        currentPage: 12,
        nextPage: 14,
        progressPercent: 36,
      },
    }),
    buildLearningSessions({
      input: { ...baseInput },
      completedDaysThisWeek: 7,
      preferredCurrentType: "weekly_review",
    }).current,
    buildLearningSessions({
      input: { ...baseInput },
      completedDaysThisWeek: 7,
      preferredCurrentType: "glossary_explore",
    }).current,
    scenario({ ...baseInput }),
  ];

  const types = sessions.map((session) => session.type);
  assert.deepEqual(types, [
    "daily_lesson",
    "review_session",
    "mistake_repair",
    "coach_session",
    "daily_lesson",
    "voice_reflection",
    "project_milestone",
    "book_reading",
    "weekly_review",
    "glossary_explore",
    "radar_explore",
  ]);

  for (const session of sessions) {
    assert.equal(typeof session.title, "string");
    assert.ok(session.title.length > 0);
    assert.equal(typeof session.goal, "string");
    assert.ok(session.goal.length > 0);
    assert.ok(Array.isArray(session.outputs));
    assert.match(session.status, /^(not_started|in_progress|completed)$/);
  }
});

test("learning sessions route active mistake repair to a focused mistake page", async () => {
  const { buildLearningSessions } = await loadCurrentMission();

  const sessions = buildLearningSessions({
    input: {
      ...baseInput,
      openMisconceptionCount: 1,
      openMisconceptionFocus: {
        id: "mistake-1",
        summary: "RAG 评估边界",
      },
    },
    completedDaysThisWeek: 4,
  });

  assert.equal(sessions.current.type, "mistake_repair");
  assert.equal(sessions.current.href, "/mistakes?focus=mistake-1");
  assert.match(sessions.current.title, /RAG 评估边界/);
});

test("current mission localizes unresolved misconception fallback copy", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    openMisconceptionCount: 2,
    openMisconceptionFocus: null,
  });

  assert.equal(mission.href, "/mistakes");
  assert.equal(mission.title, "修复一个未解决误区");
  assert.equal(mission.ctaLabel, "去修复");
  assert.match(mission.reason, /2 个未解决误区/);
  assert.doesNotMatch(mission.reason, /open misconception/);
});

test("current mission card renders heading, signal summary, and action", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CurrentMissionCard, {
      mission: {
        title: "完成今日学习",
        reason: "今天的课程已经生成，先走完主课、引导步骤、小测验和反思。",
        href: "/today",
        ctaLabel: "继续今日学习",
        afterComplete: {
          label: "完成后去复习",
          href: "/review",
        },
        tone: "info",
        priorityLabel: "推荐",
        estimatedMinutes: 20,
        companionLabel: "AI 陪练",
      },
      signals: [
        { label: "误区", value: "2", tone: "danger" },
        { label: "代码反馈", value: "1", tone: "info" },
      ],
      progress: {
        label: "今日闭环",
        completed: 2,
        total: 5,
        steps: [
          { label: "学习", state: "done", text: "已完成" },
          { label: "复习", state: "current", text: "2 张到期" },
          { label: "表达", state: "todo", text: "待表达" },
          { label: "修复", state: "todo", text: "待修复" },
          { label: "实践", state: "todo", text: "待实践" },
        ],
      },
    }),
  );

  assert.match(markup, /当前任务/);
  assert.doesNotMatch(markup, /Current Mission/);
  assert.match(markup, /完成今日学习/);
  assert.match(markup, /今天的课程已经生成/);
  assert.match(markup, /误区/);
  assert.match(markup, /代码反馈/);
  assert.match(markup, /href="\/today"/);
  assert.match(markup, /继续今日学习/);
  assert.match(markup, /完成后去复习/);
  assert.match(markup, /href="\/review"/);
  assert.match(markup, /min-h-11/);
  assert.match(markup, /w-full sm:w-auto/);
  assert.match(markup, /推荐/);
  assert.match(markup, /20 分钟/);
  assert.match(markup, /AI 陪练/);
  assert.match(markup, /今日闭环/);
  for (const label of ["学习", "复习", "表达", "修复", "实践"]) {
    assert.match(markup, new RegExp(label));
  }
  assert.match(markup, /2 张到期/);
  assert.match(markup, /待表达/);
  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /aria-label="今日闭环：学习 已完成，复习 2 张到期，表达 待表达，修复 待修复，实践 待实践"/);
});

test("current mission page wiring uses localized learner-facing headings", () => {
  const files = ["src/app/today/page.tsx", "src/app/weekly/page.tsx", "src/app/path/page.tsx"];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /title="Current Mission \/ 当前任务"/);
  }
});
