import test from "node:test";
import assert from "node:assert/strict";
import { buildLessonNoteTemplate } from "@/server/notes/template";

test("buildLessonNoteTemplate creates an editable learning reflection scaffold", () => {
  const template = buildLessonNoteTemplate({
    lessonTitle: "Transformer 架构入门",
    localDate: "2026-05-29",
    planStatus: "completed",
    objectives: ["解释 Self-Attention 的输入输出", "用 Python 写一个最小注意力计算"],
    keyTerms: ["Self-Attention", "LayerNorm"],
    quizCount: 3,
    codeSubmissionCount: 1,
    hasExistingNote: false,
  });

  assert.match(template, /# Transformer 架构入门 - 学习笔记/);
  assert.match(template, /日期：2026-05-29/);
  assert.match(template, /课程状态：completed/);
  assert.match(template, /解释 Self-Attention 的输入输出/);
  assert.match(template, /Self-Attention/);
  assert.match(template, /测验：3 题/);
  assert.match(template, /代码提交：1 次/);
  assert.match(template, /今天我能用自己的话解释/);
  assert.match(template, /明天需要复习/);
});

test("buildLessonNoteTemplate keeps standalone notes useful without a selected lesson", () => {
  const template = buildLessonNoteTemplate({
    lessonTitle: null,
    localDate: "2026-05-29",
    planStatus: null,
    objectives: [],
    keyTerms: [],
    quizCount: 0,
    codeSubmissionCount: 0,
    hasExistingNote: true,
  });

  assert.match(template, /# 今日总结/);
  assert.match(template, /暂无关联课程/);
  assert.match(template, /已有笔记：是/);
  assert.match(template, /今天最值得保留的一句话/);
});
