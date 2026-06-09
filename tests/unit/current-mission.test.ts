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
  assert.equal(progress.completed, 2);
  assert.equal(progress.total, 4);
});

test("current mission routes unresolved misconceptions to coach with focus copy", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    openMisconceptionCount: 2,
    openMisconceptionFocus: {
      summary: "把 attention 当成简单平均",
      source: "quiz",
      occurrenceCount: 3,
    },
  });

  assert.equal(mission.href, "/coach");
  assert.equal(mission.tone, "danger");
  assert.match(mission.title, /attention/);
  assert.match(mission.reason, /2 个未解决误区/);
  assert.doesNotMatch(mission.reason, /open misconception/);
});

test("current mission localizes unresolved misconception fallback copy", async () => {
  const { buildCurrentMission } = await loadCurrentMission();
  const mission = buildCurrentMission({
    ...baseInput,
    openMisconceptionCount: 2,
    openMisconceptionFocus: null,
  });

  assert.equal(mission.href, "/coach");
  assert.equal(mission.title, "让 Coach 处理未解决误区");
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
        total: 4,
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
  assert.match(markup, /min-h-11/);
  assert.match(markup, /w-full sm:w-auto/);
  assert.match(markup, /推荐/);
  assert.match(markup, /20 分钟/);
  assert.match(markup, /AI 陪练/);
  assert.match(markup, /今日闭环/);
  assert.match(markup, /2\/4/);
  assert.match(markup, /role="progressbar"/);
});

test("current mission page wiring uses localized learner-facing headings", () => {
  const files = ["src/app/today/page.tsx", "src/app/weekly/page.tsx", "src/app/path/page.tsx"];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /title="Current Mission \/ 当前任务"/);
  }
});
