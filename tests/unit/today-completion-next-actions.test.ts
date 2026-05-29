import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearningCompletionCard } from "@/components/learning/learning-completion-card";
import { buildTodayCompletionNextActions } from "@/server/learning/today-completion-actions";

test("today completion actions keep unfinished plans focused on reflection", () => {
  const result = buildTodayCompletionNextActions({
    planStatus: "planned",
    lessonId: "lesson-1",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 4,
    noteCount: 0,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: false,
    activeProject: null,
  });

  assert.equal(result.statusLabel, "等待完成");
  assert.match(result.summary, /先写一句总结/);
  assert.equal(result.actions.length, 1);
  assert.equal(result.actions[0]?.href, "#today-reflection");
  assert.match(result.actions[0]?.label ?? "", /完成沉淀/);
});

test("today completion actions prioritize review, notes, voice, coach, and project after completion", () => {
  const result = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-2",
    lessonDueFlashcardCount: 3,
    totalDueFlashcardCount: 5,
    noteCount: 0,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: true,
    activeProject: {
      id: "project-1",
      title: "RAG 小项目",
      percent: 40,
      activeMilestoneTitle: "完成检索评估脚本",
      activeMilestoneTask: "保存一个可复现的评估脚本，并写下失败样例。",
    },
  });

  assert.equal(result.statusLabel, "今日已完成");
  assert.match(result.summary, /先复习本课 3 张卡片/);
  assert.deepEqual(
    result.actions.map((action) => action.href),
    [
      "/review",
      "/notes?lessonId=lesson-2",
      "/voice?lessonId=lesson-2&mode=today_lesson",
      "/coach?lessonId=lesson-2&mode=today_lesson",
      "/projects?projectId=project-1",
    ],
  );
  assert.match(result.actions[4]?.description ?? "", /完成检索评估脚本/);
  assert.equal(result.projectPractice?.title, "RAG 小项目");
  assert.equal(result.projectPractice?.percent, 40);
  assert.match(result.projectPractice?.milestoneTask ?? "", /失败样例/);
});

test("today completion actions recommend project practice and progress when the lesson is already well covered", () => {
  const result = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-3",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 1,
    thoughtReviewCount: 1,
    hasCodeSubmission: true,
    activeProject: null,
  });

  assert.deepEqual(
    result.actions.map((action) => action.href),
    ["/projects", "/progress"],
  );
  assert.equal(result.actions[0]?.label, "开始项目实践");
  assert.match(result.summary, /复习、笔记、语音和 Coach 都已接上/);
});

test("today completion actions keep project practice alive when no active project exists", () => {
  const result = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-6",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 1,
    thoughtReviewCount: 1,
    hasCodeSubmission: true,
    activeProject: null,
  });

  assert.equal(result.projectPractice?.title, "项目实践");
  assert.equal(result.projectPractice?.href, "/projects");
  assert.equal(result.projectPractice?.percent, 0);
  assert.match(result.projectPractice?.milestoneTitle ?? "", /开始一个小项目/);
  assert.match(result.actions.map((action) => action.href).join(" "), /\/projects/);
});

test("learning completion card renders ordered next actions", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-4",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 2,
    noteCount: 0,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: false,
    activeProject: null,
  });

  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, { completion }),
  );

  assert.match(markup, /完成后下一步/);
  assert.match(markup, /今日已完成/);
  assert.match(markup, /清空到期复习/);
  assert.match(markup, /写今日笔记/);
  assert.match(markup, /说出今天的理解/);
  assert.match(markup, /让 Coach 检查/);
  assert.match(markup, /href="\/notes\?lessonId=lesson-4"/);
  assert.match(markup, /href="\/voice\?lessonId=lesson-4&amp;mode=today_lesson"/);
  assert.match(markup, /href="\/coach\?lessonId=lesson-4&amp;mode=today_lesson"/);
});

test("learning completion card highlights the active project milestone as today's practice task", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-5",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 1,
    thoughtReviewCount: 1,
    hasCodeSubmission: true,
    activeProject: {
      id: "project-2",
      title: "Attention 可视化小项目",
      percent: 50,
      activeMilestoneTitle: "画出注意力矩阵",
      activeMilestoneTask: "用 Python 生成一张 heatmap，并解释两个 token 的关系。",
    },
  });

  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, { completion }),
  );

  assert.match(markup, /今日项目任务/);
  assert.match(markup, /Attention 可视化小项目/);
  assert.match(markup, /画出注意力矩阵/);
  assert.match(markup, /用 Python 生成一张 heatmap/);
  assert.match(markup, /50%/);
  assert.match(markup, /href="\/projects\?projectId=project-2"/);
});

test("learning completion card suggests starting a project when none is active", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-7",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 1,
    thoughtReviewCount: 1,
    hasCodeSubmission: true,
    activeProject: null,
  });

  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, { completion }),
  );

  assert.match(markup, /今日项目任务/);
  assert.match(markup, /开始一个小项目/);
  assert.match(markup, /把今天学到的内容落到代码或复盘里/);
  assert.match(markup, /href="\/projects"/);
});
