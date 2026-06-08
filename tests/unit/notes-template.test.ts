import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLessonNoteTemplate, formatNotePlanStatusLabel } from "@/server/notes/template";

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
  assert.match(template, /课程状态：已完成/);
  assert.doesNotMatch(template, /课程状态：completed/);
  assert.match(template, /解释 Self-Attention 的输入输出/);
  assert.match(template, /Self-Attention/);
  assert.match(template, /测验：3 题/);
  assert.match(template, /代码提交：1 次/);
  assert.match(template, /今天我能用自己的话解释/);
  assert.match(template, /明天需要复习/);
});

test("formatNotePlanStatusLabel localizes note plan status for learner-facing notes", () => {
  assert.equal(formatNotePlanStatusLabel("completed"), "已完成");
  assert.equal(formatNotePlanStatusLabel("planned"), "待完成");
  assert.equal(formatNotePlanStatusLabel(null), "未关联计划");
  assert.equal(formatNotePlanStatusLabel("archived"), "待完成");
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
  assert.match(template, /课程状态：未关联计划/);
  assert.match(template, /已有笔记：是/);
  assert.match(template, /今天最值得保留的一句话/);
});

test("Notes page uses localized plan status in the selected lesson summary", () => {
  const source = readFileSync("src/app/notes/page.tsx", "utf8");

  assert.match(source, /formatNotePlanStatusLabel\(selectedPlan\?\.status\)/);
  assert.doesNotMatch(source, /计划：\{selectedPlan\?\.status \?\? "未关联"\}/);
});

test("Notes page keeps course and save CTAs mobile friendly", () => {
  const source = readFileSync("src/app/notes/page.tsx", "utf8");

  assert.match(source, /const notesCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(
    source,
    /className="grid gap-3 rounded-md border p-3 text-sm sm:flex sm:items-center sm:justify-between"/,
  );
  assert.match(source, /<div className="grid gap-2 sm:flex sm:flex-wrap">/);
  assert.match(source, /<div className="grid gap-2 sm:flex sm:items-center">/);

  for (const label of ["去今日学习", "看课程档案", "保存笔记"]) {
    const labelIndex = source.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const nearbyButton = source.slice(Math.max(0, labelIndex - 220), labelIndex + 80);
    assert.match(nearbyButton, /className=\{notesCtaClassName\}/);
  }
});

test("Notes page keeps title input mobile friendly", () => {
  const source = readFileSync("src/app/notes/page.tsx", "utf8");

  assert.match(source, /const notesInputClassName = "min-h-11";/);

  const titleIndex = source.indexOf("标题");
  assert.notEqual(titleIndex, -1);
  const titleInput = source.slice(titleIndex, titleIndex + 360);

  assert.match(titleInput, /name="title"/);
  assert.match(titleInput, /className=\{notesInputClassName\}/);
});
