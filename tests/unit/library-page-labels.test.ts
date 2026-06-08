import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("library page routes learner-visible status source and type labels through display helpers", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatHomeDailyPlanStatusLabel, "function");
  assert.equal(typeof labels.formatTodayPlanSourceLabel, "function");
  assert.equal(typeof labels.formatKnowledgeEntityTypeLabel, "function");
  assert.equal(typeof labels.formatQuizQuestionTypeLabel, "function");
  assert.equal(typeof labels.formatCodeSubmissionStatusLabel, "function");
  assert.equal(typeof labels.formatHomeCodeFeedbackOverallLabel, "function");
  assert.equal(typeof labels.formatCoachModeLabel, "function");
  assert.equal(labels.formatQuizQuestionTypeLabel("single_choice"), "单选题");
  assert.equal(labels.formatCodeSubmissionStatusLabel("feedback_ready"), "反馈已生成");
  assert.equal(labels.formatCoachModeLabel("code_reasoning"), "代码思路");

  const source = readFileSync("src/app/library/page.tsx", "utf8");
  assert.match(source, /formatTodayPlanSourceLabel\(p\.source\)/);
  assert.match(source, /formatLibraryPlanSchemaVersionLabel\(p\.schemaVersion\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(p\.status\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(planForLesson\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(planForLesson\.source\)/);
  assert.match(source, /formatLibraryPlanSchemaVersionLabel\(planForLesson\.schemaVersion\)/);
  assert.match(source, /formatKnowledgeEntityTypeLabel\(breadth\.kind\)/);
  assert.match(source, /formatQuizQuestionTypeLabel\(q\.type\)/);
  assert.match(source, /formatCoachModeLabel\(r\.mode\)/);
  assert.match(source, /formatCodeSubmissionStatusLabel\(submission\.status\)/);
  assert.match(source, /formatHomeCodeFeedbackOverallLabel\(feedback\.overall\)/);
  assert.match(source, /反馈来源：\{formatTodayPlanSourceLabel\(feedback\.provider\)\}/);
  assert.match(source, /来源：\{formatTodayPlanSourceLabel\(filters\.source\)\}/);
  assert.match(source, /内容版本：\{filters\.schemaVersion\}/);
  assert.match(source, /状态：\{formatHomeDailyPlanStatusLabel\(filters\.status\)\}/);
  assert.match(source, /日期：\{filters\.localDate\}/);
  assert.doesNotMatch(source, /\{p\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /\{p\.status\}/);
  assert.doesNotMatch(source, /\$\{planForLesson\.status\}/);
  assert.doesNotMatch(source, /\$\{planForLesson\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /schema \{p\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /schema \$\{planForLesson\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /类型：\{breadth\.kind\}/);
  assert.doesNotMatch(source, /类型：\{q\.type\}/);
  assert.doesNotMatch(source, /<Badge variant="outline">\{r\.mode\}<\/Badge>/);
  assert.doesNotMatch(source, /\{submission\.status\}/);
  assert.doesNotMatch(source, /\$\{feedback\.overall\}/);
  assert.doesNotMatch(source, /反馈：\{feedback\.provider\}/);
  assert.doesNotMatch(source, /<Badge variant="outline">source: \{filters\.source\}<\/Badge>/);
  assert.doesNotMatch(source, /<Badge variant="outline">status: \{filters\.status\}<\/Badge>/);
  assert.doesNotMatch(source, /<Badge variant="outline">schema: \{filters\.schemaVersion\}<\/Badge>/);
  assert.doesNotMatch(source, /<Badge variant="outline">date: \{filters\.localDate\}<\/Badge>/);
});

test("library page keeps lesson next-action and note CTAs mobile friendly", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /const libraryCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(
    source,
    /className="grid gap-3 sm:flex sm:items-start sm:justify-between"/,
  );
  assert.match(source, /<div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);
  assert.match(source, /lessonNextActions\.actions\.map\(\(action, index\) =>/);
  assert.match(source, /variant=\{index === 0 \? "default" : "outline"\}[\s\S]{0,120}className=\{libraryCtaClassName\}/);

  const noteHeaderIndex = source.indexOf("关联笔记");
  assert.notEqual(noteHeaderIndex, -1);
  const noteHeaderBlock = source.slice(noteHeaderIndex - 160, noteHeaderIndex + 420);
  assert.match(noteHeaderBlock, /className="grid gap-2 sm:flex sm:items-center sm:justify-between"/);
  assert.match(noteHeaderBlock, /className=\{libraryCtaClassName\}/);
  assert.match(noteHeaderBlock, /写笔记/);
});

test("library page keeps filter action CTAs mobile friendly", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /const libraryCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(
    source,
    /const libraryFilterInputClassName = "min-h-11 rounded-md border bg-background px-3 text-sm";/,
  );
  const firstToggleIndex = source.indexOf("切换测试计划");
  const clearFilterIndex = source.indexOf("清空筛选");
  const applyFilterIndex = source.indexOf("应用筛选");
  assert.notEqual(firstToggleIndex, -1);
  assert.notEqual(clearFilterIndex, -1);
  assert.notEqual(applyFilterIndex, -1);

  const topFilterBlock = source.slice(firstToggleIndex - 900, clearFilterIndex + 140);
  assert.match(topFilterBlock, /<div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);
  assert.match(topFilterBlock, /variant="outline" className=\{libraryCtaClassName\}>[\s\S]*切换测试计划/);
  assert.match(topFilterBlock, /variant="outline" className=\{libraryCtaClassName\}>[\s\S]*切换归档计划/);
  assert.match(topFilterBlock, /variant="ghost" className=\{libraryCtaClassName\}>[\s\S]*清空筛选/);
  assert.doesNotMatch(source, /className="h-8 rounded-md border bg-background px-2 text-sm"/);
  assert.equal((source.match(/className=\{libraryFilterInputClassName\}/g) ?? []).length, 4);

  const applyFilterRowIndex = source.lastIndexOf(
    '<div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">',
    applyFilterIndex,
  );
  assert.notEqual(applyFilterRowIndex, -1);
  const applyFilterBlock = source.slice(applyFilterRowIndex, applyFilterIndex + 80);
  assert.match(applyFilterBlock, /<div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);
  assert.match(
    applyFilterBlock,
    /<Button size="sm" type="submit" variant="secondary" className=\{libraryCtaClassName\}>[\s\S]*应用筛选/,
  );

  const summaryFilterIndex = source.indexOf("来源：{formatTodayPlanSourceLabel(filters.source)}");
  assert.notEqual(summaryFilterIndex, -1);
  const summaryFilterRowIndex = source.lastIndexOf(
    '<div className="grid gap-2 text-xs sm:flex sm:flex-wrap sm:items-center">',
    summaryFilterIndex,
  );
  assert.notEqual(summaryFilterRowIndex, -1);
  const summaryFilterBlock = source.slice(summaryFilterRowIndex, source.indexOf("{plans.length") - 1);
  assert.match(summaryFilterBlock, /className="grid gap-2 text-xs sm:flex sm:flex-wrap sm:items-center"/);
  assert.match(summaryFilterBlock, /variant="outline" className=\{libraryCtaClassName\}>[\s\S]*切换测试计划/);
  assert.match(summaryFilterBlock, /variant="outline" className=\{libraryCtaClassName\}>[\s\S]*切换归档计划/);
});

test("library filter placeholders explain governance values with Chinese labels", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /placeholder="AI 生成 deepseek \/ 模板兜底 template \/ 后台重建 admin"/);
  assert.match(source, /placeholder="待完成 planned \/ 已完成 completed"/);
  assert.doesNotMatch(source, /placeholder="deepseek \/ fallback \/ admin"/);
  assert.doesNotMatch(source, /placeholder="planned \/ completed"/);
});

test("library filter field labels are learner-facing while preserving query parameter names", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");
  const filterFields = [
    { label: "来源", name: "source", rawLabel: "source" },
    { label: "内容版本", name: "schemaVersion", rawLabel: "schemaVersion" },
    { label: "状态", name: "status", rawLabel: "status" },
    { label: "日期", name: "localDate", rawLabel: "localDate" },
  ];

  for (const field of filterFields) {
    assert.match(
      source,
      new RegExp(`<span className="text-muted-foreground">${field.label}<\\/span>[\\s\\S]{0,120}<input\\s+name="${field.name}"`),
    );
    assert.doesNotMatch(
      source,
      new RegExp(`<span className="text-muted-foreground">${field.rawLabel}<\\/span>[\\s\\S]{0,120}<input\\s+name="${field.name}"`),
    );
  }
});

test("library lesson list links keep mobile touch targets", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(
    source,
    /const libraryPlanLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";/,
  );
  assert.match(source, /className=\{\[\s*libraryPlanLinkClassName,\s*active \? "bg-muted" : "hover:bg-muted\/50",\s*\]\.join\(" "\)\}/);
  assert.doesNotMatch(source, /"rounded-md border px-3 py-2 text-sm transition-colors",\s*active \?/);
});

test("library lesson detail localizes missing domain and topic labels", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /function formatLibraryPlanDomainLabel/);
  assert.match(source, /function formatLibraryPlanTopicLabel/);
  assert.match(source, /"未标记领域"/);
  assert.match(source, /"未标记主题"/);
  assert.match(source, /formatLibraryPlanDomainLabel\(planForLesson\.selectedDomain\)/);
  assert.match(source, /formatLibraryPlanTopicLabel\(planForLesson\.selectedTopic\)/);
  assert.doesNotMatch(source, /planForLesson\.selectedDomain \?\? "unknown"/);
  assert.doesNotMatch(source, /planForLesson\.selectedTopic \?\? "unknown"/);
});

test("library page localizes test and archived plan labels", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /filters\.showTest \? "显示测试计划" : "隐藏测试计划"/);
  assert.match(source, /filters\.showArchived \? "显示归档计划" : "隐藏归档计划"/);
  assert.match(source, /切换测试计划/);
  assert.match(source, /切换归档计划/);
  assert.match(source, /p\.isTest \? <Badge variant="outline">测试计划<\/Badge> : null/);
  assert.match(source, /p\.archivedAt \? <Badge variant="outline">已归档<\/Badge> : null/);
  assert.match(source, /planForLesson\.isTest \? <Badge variant="outline">测试计划<\/Badge> : null/);
  assert.match(source, /planForLesson\.archivedAt \? <Badge variant="outline">已归档<\/Badge> : null/);
  assert.doesNotMatch(source, />test<\/Badge>/);
  assert.doesNotMatch(source, />archived<\/Badge>/);
  assert.doesNotMatch(source, /切换 test/);
  assert.doesNotMatch(source, /切换 archived/);
  assert.doesNotMatch(source, /显示 test/);
  assert.doesNotMatch(source, /显示 archived/);
});

test("library lesson flashcard metadata uses learner-facing Chinese labels", () => {
  const source = readFileSync("src/app/library/page.tsx", "utf8");

  assert.match(source, /到期：\{c\.dueAt\.toISOString\(\)\.slice\(0, 10\)\}/);
  assert.match(source, /复习次数：\s*\{c\.reviewCount\}/);
  assert.doesNotMatch(
    source,
    /due: \{c\.dueAt\.toISOString\(\)\.slice\(0, 10\)\}/,
  );
  assert.doesNotMatch(source, /reviews:\s*\{"\s*"\}\s*\{c\.reviewCount\}/);
});
