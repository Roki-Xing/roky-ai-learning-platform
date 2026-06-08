import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CoachContextCompass,
  CoachFlashcardPanel,
  CoachHero,
  CoachIssueList,
  CoachModeRail,
  CoachQuickLinks,
  CoachRemediationQueue,
  CoachSignalStrip,
  CoachVoiceSourcePanel,
} from "@/app/coach/ui/coach-workspace";

test("coach workspace hero and signals render the learning workspace hierarchy", () => {
  const hero = renderToStaticMarkup(
    React.createElement(CoachHero, {
      lessonTitle: "Transformer 架构入门",
      localDate: "2026-05-28",
      dueCount: 7,
      issueCount: 2,
    }),
  );
  const signals = renderToStaticMarkup(
    React.createElement(CoachSignalStrip, {
      items: [
        { label: "正确点", value: 1, tone: "success" },
        { label: "追问", value: 3, tone: "info" },
        { label: "建议卡片", value: 4, tone: "warning" },
      ],
    }),
  );

  assert.match(hero, /Coach 工作区/);
  assert.doesNotMatch(hero, /Tutor Workspace/);
  assert.match(hero, /Transformer 架构入门/);
  assert.match(hero, /到期卡片/);
  assert.match(hero, /待澄清/);
  assert.match(signals, /正确点/);
  assert.match(signals, /追问/);
  assert.match(signals, /建议卡片/);
});

test("coach workspace issue block localizes issue type and severity labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachIssueList, {
      issues: [
        {
          type: "conceptual",
          severity: "high",
          issue: "把 attention 当成平均",
          explanation: "权重来自 Q/K 相似度，不是简单平均。",
        },
      ],
    }),
  );

  assert.match(markup, /可能问题/);
  assert.match(markup, /概念问题/);
  assert.match(markup, /高优先级/);
  assert.doesNotMatch(markup, /conceptual/);
  assert.doesNotMatch(markup, /high/);
  assert.match(markup, /把 attention 当成平均/);
  assert.match(markup, /权重来自 Q\/K 相似度/);
});

test("coach mode rail renders the review mode options", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachModeRail, {
      modes: [
        ["today_lesson", "今日课程"],
        ["code_reasoning", "代码思路"],
      ],
      defaultMode: "code_reasoning",
    }),
  );

  assert.match(markup, /评审模式/);
  assert.match(markup, /<select[^>]+aria-label="评审模式"[^>]+class="[^"]*min-h-11[^"]*"/);
  assert.doesNotMatch(markup, /class="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"/);
  assert.match(markup, /今日课程/);
  assert.match(markup, /代码思路/);
  assert.match(markup, /<option value="code_reasoning" selected="">代码思路<\/option>/);
});

test("coach context compass makes the strongest context signal visible", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachContextCompass, {
      localDate: "2026-05-29",
      lessonTitle: "Transformer 架构入门",
      signals: [
        { label: "到期卡片", value: 5, tone: "warning", href: "/review" },
        { label: "最近错题", value: 1, tone: "danger", href: "/progress" },
        { label: "代码反馈", value: 0, tone: "info", href: "/projects" },
        { label: "活跃误区", value: 2, tone: "warning", href: "/coach" },
      ],
    }),
  );

  assert.match(markup, /上下文指南针/);
  assert.doesNotMatch(markup, /Context Compass/);
  assert.match(markup, /最强信号/);
  assert.match(markup, /到期卡片/);
  assert.match(markup, /5/);
  assert.match(markup, /Transformer 架构入门/);
  assert.match(markup, /href="\/review"/);
});

test("coach remediation queue turns misconceptions and code feedback into next tasks", () => {
  const source = readFileSync("src/app/coach/ui/coach-workspace.tsx", "utf8");
  const markup = renderToStaticMarkup(
    React.createElement(CoachRemediationQueue, {
      misconceptions: [
        {
          title: "把 attention 当成简单平均",
          subtitle: "权重来自 Q/K 相似度，不是平均。",
          tone: "warning",
        },
      ],
      codeFeedback: [
        {
          title: "缺少 softmax 归一化",
          subtitle: "2026-05-29 / partially_correct",
          tone: "info",
        },
      ],
    }),
  );

  assert.match(markup, /补弱队列/);
  assert.match(markup, /优先澄清/);
  assert.match(markup, /把 attention 当成简单平均/);
  assert.match(markup, /缺少 softmax 归一化/);
  assert.match(markup, /href="\/coach"/);
  assert.match(markup, /href="\/review\?source=code-feedback"/);
  assert.match(
    source,
    /const coachRemediationQueueLinkClassName =\s*"min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted\/60";/,
  );
  assert.doesNotMatch(
    source,
    /className=\{cn\("rounded-md border px-3 py-2 transition-colors hover:bg-muted\/60"/,
  );

  assert.match(markup, /<a class="[^"]*min-h-11[^"]*" href="\/coach"/);
  assert.match(markup, /<a class="[^"]*min-h-11[^"]*" href="\/review\?source=code-feedback"/);
});

test("coach flashcard panel hands generated cards to the focused review queue", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachFlashcardPanel, {
      reviewId: "review-1",
      generatedCardCount: 2,
      flashcards: [
        {
          front: "Self-Attention 不是简单平均的原因？",
          back: "权重由 Q/K 相似度和 softmax 决定。",
          type: "concept",
        },
      ],
      action: async () => {},
      relatedTerms: ["attention"],
    }),
  );

  assert.match(markup, /Coach 卡片已进入复习队列/);
  assert.match(markup, /复习这 2 张 Coach 卡片/);
  assert.match(markup, /href="\/review\?source=thought-review"/);
  assert.match(markup, /概念卡/);
  assert.doesNotMatch(markup, />concept</);
  const ctaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.ok(ctaMatches.length >= 2);
  for (const label of ["生成卡片", "复习这 2 张 Coach 卡片"]) {
    const index = markup.indexOf(label);
    assert.notEqual(index, -1);
    const window = markup.slice(Math.max(0, index - 220), index + 100);
    assert.match(window, /min-h-11 w-full sm:w-auto/);
  }
});

test("coach flashcard panel routes voice-linked cards to the voice note review queue", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachFlashcardPanel, {
      reviewId: "voice-review-1",
      generatedCardCount: 2,
      flashcards: [
        {
          front: "语音里把 attention 说成平均池化的问题？",
          back: "应回到 Q/K 权重和 Value 加权聚合。",
          type: "concept",
        },
      ],
      action: async () => {},
      relatedTerms: ["attention"],
      reviewSource: "voice-note",
    }),
  );

  assert.match(markup, /Coach 卡片已进入复习队列/);
  assert.match(markup, /复习这 2 张 Coach 卡片/);
  assert.match(markup, /href="\/review\?source=voice-note"/);
  assert.doesNotMatch(markup, /href="\/review\?source=thought-review"/);
});

test("coach voice source panel shows localized voice note origin and note handoff", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachVoiceSourcePanel, {
      voiceNoteId: "voice-1",
      mode: "code_debug",
      transcriptPreview: "我的 softmax 代码直接 return scores。",
      noteId: null,
      saveAsNoteAction: async () => {},
    }),
  );

  assert.match(markup, /来自语音笔记/);
  assert.doesNotMatch(markup, /来自 Voice Note/);
  assert.match(markup, /代码调试/);
  assert.doesNotMatch(markup, /code_debug/);
  assert.match(markup, /softmax/);
  assert.match(markup, /一键生成卡片/);
  assert.match(markup, /保存为 Note/);
  assert.match(markup, /查看语音笔记/);
  assert.doesNotMatch(markup, /查看 Voice Note/);
  assert.match(markup, /href="\/voice\?voiceNoteId=voice-1"/);
  assert.match(markup, /type="hidden" name="voiceNoteId" value="voice-1"/);
});

test("coach quick links keep mobile-friendly touch targets", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CoachQuickLinks, {
      lessonId: "lesson-1",
    }),
  );

  for (const label of ["今日学习", "复习中心", "查看关联课程"]) {
    const index = markup.indexOf(label);
    assert.notEqual(index, -1);
    const window = markup.slice(Math.max(0, index - 220), index + 100);
    assert.match(window, /min-h-11 w-full sm:w-auto/);
  }
});

test("coach page source keeps primary CTAs and history links mobile friendly", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /const coachPageCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /const coachReviewHistoryLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted\/50";/);

  for (const label of ["提交给 Coach", "查看课程"]) {
    const index = label === "提交给 Coach" ? source.lastIndexOf(label) : source.indexOf(label);
    assert.notEqual(index, -1);
    const window = source.slice(Math.max(0, index - 220), index + 100);
    assert.match(window, /className=\{coachPageCtaClassName\}/);
  }

  assert.match(source, /className=\{coachReviewHistoryLinkClassName\}/);
});

test("coach include lesson checkbox keeps a mobile touch target", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(
    source,
    /const coachIncludeLessonLabelClassName = "flex min-h-11 items-center gap-2 rounded-md border bg-muted\/20 px-3 py-2 text-sm";/,
  );
  assert.match(source, /<label className=\{coachIncludeLessonLabelClassName\}>/);
  assert.doesNotMatch(
    source,
    /<label className="flex items-center gap-2 rounded-md border bg-muted\/20 px-3 py-2 text-sm">/,
  );
});

test("coach page header badge is localized for learners", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /badge="思路评审"/);
  assert.doesNotMatch(source, /badge="Coach"/);
});

test("coach required input badge is localized for learners", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /<LearningStatusBadge tone="info">必填<\/LearningStatusBadge>/);
  assert.doesNotMatch(source, /<LearningStatusBadge tone="info">required<\/LearningStatusBadge>/);
});

test("coach review provider badge is localized for learners", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /formatTodayPlanSourceLabel\(review\.provider \?\? "template"\)/);
  assert.doesNotMatch(source, /\{review\.provider \?\? "template"\}/);
});

test("coach code feedback context localizes overall labels", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /formatHomeCodeFeedbackOverallLabel\(f\.overall\)/);
  assert.equal(source.includes('[f.localDate, f.overall].filter(Boolean).join(" / ")'), false);
});

test("coach page source localizes selected and recent review mode labels", () => {
  const source = readFileSync("src/app/coach/page.tsx", "utf8");

  assert.match(source, /formatCoachModeLabel/);
  assert.match(source, /formatCoachModeLabel\(selected\.mode\)/);
  assert.match(source, /formatCoachModeLabel\(r\.mode\)/);
  assert.doesNotMatch(source, /<LearningStatusBadge tone="neutral">\{selected\.mode\}<\/LearningStatusBadge>/);
  assert.doesNotMatch(source, /<LearningStatusBadge tone="neutral">\{r\.mode\}<\/LearningStatusBadge>/);
});
