import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildHomeCodeFeedbackMeta,
  buildHomeMistakeMeta,
  formatHomeCodeFeedbackOverallLabel,
  formatHomeDailyPlanStatusLabel,
  formatHomeMistakeSourceLabel,
} from "@/app/_lib/home-labels";

test("home page helpers localize daily plan and remediation labels", () => {
  assert.equal(formatHomeDailyPlanStatusLabel("completed"), "已完成");
  assert.equal(formatHomeDailyPlanStatusLabel("planned"), "待完成");
  assert.equal(formatHomeDailyPlanStatusLabel(null), "未生成");

  assert.equal(formatHomeCodeFeedbackOverallLabel("partially_correct"), "部分正确");
  assert.equal(formatHomeCodeFeedbackOverallLabel("incorrect"), "需要重写");
  assert.equal(formatHomeCodeFeedbackOverallLabel("cannot_judge"), "需要更多信息");

  assert.equal(formatHomeMistakeSourceLabel("quiz"), "小测验");
  assert.equal(formatHomeMistakeSourceLabel("code"), "代码反馈");
  assert.equal(formatHomeMistakeSourceLabel("project"), "项目实践");

  const codeMeta = buildHomeCodeFeedbackMeta({
    overall: "partially_correct",
    localDate: "2026-06-06",
  });
  assert.equal(codeMeta, "状态：部分正确 · 日期：2026-06-06");
  assert.doesNotMatch(codeMeta, /partially_correct/);

  const mistakeMeta = buildHomeMistakeMeta({
    source: "quiz",
    occurrenceCount: 3,
  });
  assert.equal(mistakeMeta, "来源：小测验 · 出现 3 次");
  assert.doesNotMatch(mistakeMeta, /来源：quiz/);
});

test("home page source uses display helpers instead of raw enum output", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");

  assert.match(source, /formatHomeDailyPlanStatusLabel\(todayPlan\?\.status \?\? null\)/);
  assert.match(source, /buildHomeCodeFeedbackMeta\(codeFeedbackFocus\)/);
  assert.match(source, /buildHomeMistakeMeta\(openMisconceptionFocus\)/);
  assert.match(source, /const homeQuickCtaClassName = "min-h-11 w-full sm:w-auto"/);
  assert.match(source, /className=\{homeQuickCtaClassName\}/);
  assert.match(source, /const homeCommonEntryCtaClassName = "min-h-11 w-full sm:w-auto shrink-0"/);
  assert.match(source, /className=\{homeCommonEntryCtaClassName\}/);
  assert.match(source, /const homeSectionActionCtaClassName = "min-h-11 w-full sm:w-auto"/);
  assert.match(source, /className=\{homeSectionActionCtaClassName\}/);
  assert.doesNotMatch(source, /\{todayPlan\?\.status \?\? "未生成"\}/);
  assert.doesNotMatch(source, /`状态：\$\{codeFeedbackFocus\.overall\}`/);
});
