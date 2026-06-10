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
      "/coach?lessonId=lesson-2&mode=concept_question",
      "/projects?projectId=project-1",
    ],
  );
  assert.match(result.actions[4]?.description ?? "", /完成检索评估脚本/);
  assert.equal(result.projectPractice?.title, "RAG 小项目");
  assert.equal(result.projectPractice?.percent, 40);
  assert.match(result.projectPractice?.milestoneTask ?? "", /失败样例/);
});

test("today completion actions keep voice and coach available when the lesson is already well covered", () => {
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
    [
      "/voice?lessonId=lesson-3&mode=today_lesson",
      "/coach?lessonId=lesson-3&mode=concept_question",
      "/projects",
      "/progress",
    ],
  );
  assert.equal(result.actions[0]?.label, "继续语音复盘");
  assert.equal(result.actions[1]?.label, "继续 Coach 检查");
  assert.equal(result.actions[2]?.label, "开始项目实践");
  assert.match(result.summary, /可以继续复盘或进入项目实践/);
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
  assert.match(result.actions.map((action) => action.href).join(" "), /\/voice/);
  assert.match(result.actions.map((action) => action.href).join(" "), /\/coach/);
});

test("today completion actions summarize the completion hub metrics", () => {
  const result = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-8",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: false,
    hasCodingExercise: true,
    flashcardCount: 4,
    quizTotalCount: 3,
    quizAttemptedCount: 2,
    quizCorrectCount: 1,
    activeProject: null,
  });

  assert.equal(result.completionHub?.title, "今日完成 Hub");
  assert.equal(result.recommendedVoiceReflection?.title, "推荐语音反思");
  assert.equal(result.recommendedVoiceReflection?.href, "/voice?lessonId=lesson-8&mode=daily_understanding");
  assert.match(result.recommendedVoiceReflection?.prompt ?? "", /60 秒/);
  assert.match(result.recommendedVoiceReflection?.prompt ?? "", /我今天学了什么/);
  assert.deepEqual(
    result.completionHub?.metrics.map((metric) => [
      metric.label,
      metric.value,
      metric.helper,
    ]),
    [
      ["生成卡片", "4 张", "今日内容已进入复习循环。"],
      ["小测验", "答对 1/3", "已提交 2/3 题。"],
      ["代码提交", "未提交", "完成代码练习后再进入项目会更稳。"],
    ],
  );
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
  assert.match(markup, /aria-label="说出今天的理解"/);
  assert.match(markup, /aria-label="让 Coach 检查"/);
  assert.match(markup, /href="\/notes\?lessonId=lesson-4"/);
  assert.match(markup, /href="\/voice\?lessonId=lesson-4&amp;mode=today_lesson"/);
  assert.match(markup, /href="\/coach\?lessonId=lesson-4&amp;mode=concept_question"/);
});

test("learning completion card asks for course feedback after completion", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-feedback",
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

  assert.match(markup, /课程反馈/);
  assert.match(markup, /给后续选题和 Curriculum Planner/);
  assert.match(markup, /难度/);
  assert.match(markup, /太简单/);
  assert.match(markup, /刚好/);
  assert.match(markup, /太难/);
  assert.match(markup, /帮助度/);
  assert.match(markup, /有帮助/);
  assert.match(markup, /一般/);
  assert.match(markup, /没帮助/);
  assert.match(markup, /后续偏好/);
  assert.match(markup, /想深入/);
  assert.match(markup, /跳过类似主题/);
});

test("learning completion card hides course feedback before completion", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "planned",
    lessonId: "lesson-feedback-pending",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 0,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: false,
    activeProject: null,
  });

  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, { completion }),
  );

  assert.doesNotMatch(markup, /课程反馈/);
  assert.doesNotMatch(markup, /太简单/);
  assert.doesNotMatch(markup, /Curriculum Planner/);
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

  assert.match(markup, /下一步：把今天的知识用到项目里/);
  assert.match(markup, /推荐项目任务/);
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

  assert.match(markup, /下一步：把今天的知识用到项目里/);
  assert.match(markup, /推荐项目任务/);
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /开始一个小项目/);
  assert.match(markup, /把今天学到的内容落到代码或复盘里/);
  assert.match(markup, /继续语音复盘/);
  assert.match(markup, /继续 Coach 检查/);
  assert.match(markup, /href="\/projects"/);
});

test("learning completion card renders completion hub metrics", () => {
  const completion = buildTodayCompletionNextActions({
    planStatus: "completed",
    lessonId: "lesson-9",
    lessonDueFlashcardCount: 0,
    totalDueFlashcardCount: 0,
    noteCount: 1,
    voiceNoteCount: 0,
    thoughtReviewCount: 0,
    hasCodeSubmission: true,
    hasCodingExercise: true,
    flashcardCount: 6,
    quizTotalCount: 3,
    quizAttemptedCount: 3,
    quizCorrectCount: 2,
    activeProject: null,
  });

  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, { completion }),
  );

  assert.match(markup, /今日完成 Hub/);
  assert.match(markup, /推荐语音反思/);
  assert.match(markup, /60 秒/);
  assert.match(markup, /我今天学了什么/);
  assert.match(markup, /href="\/voice\?lessonId=lesson-9&amp;mode=daily_understanding"/);
  assert.match(markup, /生成卡片/);
  assert.match(markup, /6 张/);
  assert.match(markup, /小测验/);
  assert.match(markup, /答对 2\/3/);
  assert.match(markup, /代码提交/);
  assert.match(markup, /已提交/);
});
