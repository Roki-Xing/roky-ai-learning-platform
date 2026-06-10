import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildHomeCodeFeedbackMeta,
  buildHomeMistakeMeta,
  formatCoachModeLabel,
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

test("shared Coach mode labels use learner intent wording", () => {
  assert.equal(formatCoachModeLabel("concept_question"), "解释概念");
  assert.equal(formatCoachModeLabel("code_reasoning"), "代码思路");
  assert.equal(formatCoachModeLabel("mistake_retell"), "错题复述");
  assert.equal(formatCoachModeLabel("book_question"), "书籍疑问");
  assert.equal(formatCoachModeLabel("glossary_term"), "术语/人物/Benchmark");

  assert.notEqual(formatCoachModeLabel("mistake_retell"), "思路评审");
  assert.notEqual(formatCoachModeLabel("book_question"), "思路评审");
});

test("home page source uses display helpers instead of raw enum output", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");

  assert.match(source, /formatHomeDailyPlanStatusLabel\(todayPlan\?\.status \?\? null\)/);
  assert.match(source, /buildHomeCodeFeedbackMeta\(codeFeedbackFocus\)/);
  assert.match(source, /buildHomeMistakeMeta\(openMisconceptionFocus\)/);
  assert.match(source, /const homeSecondaryActionCtaClassName = "min-h-11 w-full sm:w-auto shrink-0"/);
  assert.match(source, /className=\{homeSecondaryActionCtaClassName\}/);
  assert.match(source, /const homeSectionActionCtaClassName = "min-h-11 w-full sm:w-auto"/);
  assert.match(source, /className=\{homeSectionActionCtaClassName\}/);
  assert.doesNotMatch(source, /\{todayPlan\?\.status \?\? "未生成"\}/);
  assert.doesNotMatch(source, /`状态：\$\{codeFeedbackFocus\.overall\}`/);
});

test("home page keeps the first screen focused on the current mission", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  const heroStart = source.indexOf('<section aria-label="首页主任务"');
  assert.notEqual(heroStart, -1);
  const heroEnd = source.indexOf("</section>", heroStart);
  assert.notEqual(heroEnd, -1);
  const heroSource = source.slice(heroStart, heroEnd);

  assert.match(heroSource, /<CurrentMissionCard/);
  assert.doesNotMatch(heroSource, /<LearningSessionStrip/);
  assert.doesNotMatch(heroSource, /<LearningMomentumStrip/);
  assert.doesNotMatch(heroSource, /<LearningSectionCard/);
  assert.doesNotMatch(heroSource, /href="\/review"|href="\/voice"|href="\/notes"|href="\/projects"/);
  assert.doesNotMatch(heroSource, /title="今日能量"|title="今日三件事"|title="常用入口"/);
});

test("home page moves progress context below the first mission screen", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  const heroStart = source.indexOf('<section aria-label="首页主任务"');
  const heroEnd = source.indexOf("</section>", heroStart);
  const sessionIndex = source.indexOf("<LearningSessionStrip", heroEnd);
  const momentumIndex = source.indexOf("<LearningMomentumStrip", heroEnd);

  assert.ok(sessionIndex > heroEnd);
  assert.ok(momentumIndex > heroEnd);
  assert.ok(sessionIndex < momentumIndex);
});

test("home page shows learning sessions instead of more standalone page entry points", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");
  const sessionStripSource = readFileSync("src/components/learning/learning-session-strip.tsx", "utf8");
  const combinedSource = `${source}\n${sessionStripSource}`;

  assert.match(source, /buildLearningSessions\(/);
  assert.match(source, /<LearningSessionStrip sessions=\{learningSessions\}/);
  assert.match(combinedSource, /学习会话/);
  assert.match(combinedSource, /当前会话/);
  assert.match(combinedSource, /下一会话/);
  assert.match(combinedSource, /本周会话/);
  assert.doesNotMatch(combinedSource, /当前页面/);
  assert.doesNotMatch(combinedSource, /下一页面/);
});

test("home page folds secondary actions under today can also", () => {
  const source = readFileSync("src/app/page.tsx", "utf8");

  assert.match(source, /const TODAY_CAN_ALSO_ACTIONS = \[/);
  assert.match(source, /<summary className="flex min-h-11 cursor-pointer/);
  assert.match(source, />今天还可以<\/span>/);
  for (const label of ["写一句笔记", "说出今天的理解", "推进项目", "看当前路径"]) {
    assert.match(source, new RegExp(`label: "${label}"`));
  }

  assert.doesNotMatch(source, /const QUICK_ACTIONS = \[/);
  assert.doesNotMatch(source, /title="今日能量"/);
  assert.doesNotMatch(source, /title="今日三件事"/);
  assert.doesNotMatch(source, /title="常用入口"/);
});
