import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/test";
process.env.CRON_SECRET ??= "test-cron-secret";

test("today quiz renders localized question type labels", async () => {
  const { TodayQuiz } = await import("@/app/today/ui/today-quiz");
  const markup = renderToStaticMarkup(
    React.createElement(TodayQuiz, {
      questions: [
        {
          id: "quiz-1",
          type: "single_choice",
          question: "RAG 的第一步通常是什么？",
          options: ["检索", "部署", "压缩"],
          explanation: "先检索相关上下文。",
          attempt: null,
        },
        {
          id: "quiz-2",
          type: "true_false",
          question: "LoRA 会直接替换全部模型权重。",
          options: null,
          explanation: "LoRA 只训练低秩适配参数。",
          attempt: null,
        },
      ],
    }),
  );

  assert.match(markup, /类型：单选题/);
  assert.match(markup, /类型：判断题/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  const quizSubmitMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(quizSubmitMatches.length, 2);
  assert.doesNotMatch(markup, /single_choice/);
  assert.doesNotMatch(markup, /true_false/);
});

test("today quiz answer options keep mobile touch targets", async () => {
  const source = readFileSync("src/app/today/ui/today-quiz.tsx", "utf8");

  assert.match(
    source,
    /const todayQuizOptionLabelClassName = "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted\/40";/,
  );
  assert.equal((source.match(/className=\{todayQuizOptionLabelClassName\}/g) ?? []).length, 4);
  assert.doesNotMatch(
    source,
    /className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted\/40"/,
  );

  const { TodayQuiz } = await import("@/app/today/ui/today-quiz");
  const markup = renderToStaticMarkup(
    React.createElement(TodayQuiz, {
      questions: [
        {
          id: "quiz-single",
          type: "single_choice",
          question: "RAG 的第一步通常是什么？",
          options: ["检索", "部署"],
          explanation: "先检索相关上下文。",
          attempt: null,
        },
        {
          id: "quiz-multi",
          type: "multi_choice",
          question: "哪些属于主动回忆？",
          options: ["不看答案复述", "直接复制笔记"],
          explanation: "主动回忆需要先尝试取回。",
          attempt: null,
        },
        {
          id: "quiz-bool",
          type: "true_false",
          question: "LoRA 会直接替换全部模型权重。",
          options: null,
          explanation: "LoRA 只训练低秩适配参数。",
          attempt: null,
        },
      ],
    }),
  );

  const optionLabelMatches =
    markup.match(/class="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted\/40"/g) ?? [];
  assert.equal(optionLabelMatches.length, 6);
});

test("guided steps render localized step type labels", async () => {
  const { GuidedSteps } = await import("@/app/today/ui/guided-steps");
  const markup = renderToStaticMarkup(
    React.createElement(GuidedSteps, {
      planId: "plan-1",
      steps: [
        {
          type: "activation",
          title: "先回忆",
          content: "写下你对注意力机制的已有理解。",
          expectedAnswer: "注意力机制会给不同上下文分配权重。",
          hints: ["先说 Query 和 Key 的关系。"],
        },
      ],
      initialProgress: {
        activeStep: 0,
        answers: {},
        updatedAt: "",
      },
    }),
  );

  assert.match(markup, /类型：背景唤醒/);
  assert.match(markup, /显示提示/);
  assert.match(markup, /显示参考答案/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  const guidedControlMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(guidedControlMatches.length, 5);
  assert.doesNotMatch(markup, /activation/);
});

test("today page routes visible plan labels through display helpers", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatTodayPlanSourceLabel, "function");
  assert.equal(typeof labels.formatKnowledgeEntityTypeLabel, "function");
  assert.equal(typeof labels.formatRadarConfidenceLabel, "function");
  assert.equal(labels.formatTodayPlanSourceLabel("deepseek"), "AI 生成");
  assert.equal(labels.formatTodayPlanSourceLabel("template"), "模板兜底");
  assert.equal(labels.formatTodayPlanSourceLabel(null), "系统生成");
  assert.equal(labels.formatKnowledgeEntityTypeLabel("person"), "人物");
  assert.equal(labels.formatKnowledgeEntityTypeLabel("benchmark"), "Benchmark");
  assert.equal(labels.formatKnowledgeEntityTypeLabel("open_source_project"), "开源项目");
  assert.equal(labels.formatRadarConfidenceLabel("high"), "可信度：高");
  assert.equal(labels.formatRadarConfidenceLabel("medium"), "可信度：中");

  const source = readFileSync("src/app/today/page.tsx", "utf8");
  assert.match(source, /const todayPlanStatusLabel = formatHomeDailyPlanStatusLabel\(plan\.status\);/);
  assert.match(source, /const todayPlanSourceLabel = formatTodayPlanSourceLabel\(plan\.source \?\? plan\.lesson\.createdBy\);/);
  assert.match(source, /const breadthTypeLabel = formatKnowledgeEntityTypeLabel\(breadthDetail\?\.type \?\? breadth\?\.kind\);/);
  assert.match(source, /const breadthConfidenceLabel = formatRadarConfidenceLabel\(breadthDetail\?\.confidence\);/);
  assert.match(source, /\{ label: "内容版本", value: plan\.schemaVersion \?\? "未标记" \}/);
  assert.match(source, /<span className="text-muted-foreground">内容版本<\/span>/);
  assert.match(source, /<span className="font-mono">\{plan\.schemaVersion \?\? "未标记"\}<\/span>/);
  assert.doesNotMatch(source, /value: plan\.status/);
  assert.doesNotMatch(source, /当前状态：\{plan\.status\}/);
  assert.doesNotMatch(source, /value: plan\.source \?\? plan\.lesson\.createdBy/);
  assert.doesNotMatch(source, /\{plan\.source \?\? plan\.lesson\.createdBy\}/);
  assert.doesNotMatch(source, /类型：\{breadthDetail\?\.type \?\? breadth\.kind\}/);
  assert.doesNotMatch(source, /\{breadthDetail\.confidence\}/);
  assert.doesNotMatch(source, /\{ label: "schema"/);
  assert.doesNotMatch(source, /<span className="text-muted-foreground">schema<\/span>/);
  assert.doesNotMatch(source, /plan\.schemaVersion \?\? "-"/);
});

test("today page keeps focus entry CTAs mobile friendly", () => {
  const source = readFileSync("src/app/today/page.tsx", "utf8");

  assert.match(source, /const todayFocusCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const generateTodayIndex = source.indexOf("生成今日内容");
  assert.notEqual(generateTodayIndex, -1);
  const generateTodayButton = source.slice(Math.max(0, generateTodayIndex - 220), generateTodayIndex + 80);
  assert.match(generateTodayButton, /className=\{todayFocusCtaClassName\}/);

  for (const cta of [
    { href: "#full-view", label: "完整视图" },
    { href: "/review", label: "复习入口" },
    { href: "#full-view", label: "查看完整课程内容" },
    { href: "#today-reflection", label: "完成沉淀" },
    { href: "#today-guided", label: "继续步骤" },
    { href: "#today-quiz", label: "去做小测验" },
    { href: "#today-reflection", label: "完成并生成卡片" },
  ]) {
    const anchor = `<a href="${cta.href}">${cta.label}</a>`;
    const anchorIndex = source.indexOf(anchor);
    assert.notEqual(anchorIndex, -1);
    const ctaWindow = source.slice(Math.max(0, anchorIndex - 260), anchorIndex + anchor.length);
    assert.match(ctaWindow, /className=\{todayFocusCtaClassName\}/);
  }

  const reviewCtaMatches = [...source.matchAll(/reviewSummary\.ctaLabel/g)];
  assert.equal(reviewCtaMatches.length, 2);
  for (const match of reviewCtaMatches) {
    const matchIndex = match.index ?? 0;
    const ctaWindow = source.slice(Math.max(0, matchIndex - 260), matchIndex + 80);
    assert.match(ctaWindow, /className=\{todayFocusCtaClassName\}/);
  }

  assert.match(source, /<LearningCTAGroup className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);
  assert.match(source, /<LearningCTAGroup className="mt-3 grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);

  const reflectionSubmitMatches = [...source.matchAll(/标记完成并生成卡片/g)];
  assert.equal(reflectionSubmitMatches.length, 2);
  for (const match of reflectionSubmitMatches) {
    const matchIndex = match.index ?? 0;
    const submitWindow = source.slice(Math.max(0, matchIndex - 260), matchIndex + 80);
    assert.match(submitWindow, /<div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">/);
    assert.match(submitWindow, /className=\{todayFocusCtaClassName\}/);
  }
});

test("today knowledge card CTAs stay mobile friendly", () => {
  const source = readFileSync("src/app/today/page.tsx", "utf8");

  assert.match(source, /const todayFocusCtaClassName = "min-h-11 w-full sm:w-auto";/);

  for (const label of ["查看术语库", "查看 Radar"]) {
    const labelIndex = source.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = source.slice(Math.max(0, labelIndex - 520), labelIndex + 80);
    assert.match(ctaWindow, /className=\{todayFocusCtaClassName\}/);
  }

  const knowledgeCtaRows =
    source.match(/className="mt-3 grid gap-2 sm:flex sm:flex-wrap"/g) ?? [];
  assert.ok(knowledgeCtaRows.length >= 2);
});
