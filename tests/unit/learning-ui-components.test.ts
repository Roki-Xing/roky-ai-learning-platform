import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearningFocusPanel } from "@/components/learning/learning-focus-panel";
import { LearningFocusPlayer } from "@/components/learning/learning-focus-player";
import { LearningMarkdown } from "@/components/learning/learning-markdown";
import { KnowledgePathExplorer } from "@/components/learning/knowledge-path-explorer";
import { VoiceLearningPipeline } from "@/app/voice/ui/voice-learning-pipeline";
import { ReviewTrainer } from "@/app/review/ui/review-trainer";

test("learning markdown renders headings, tables, and code without raw html", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningMarkdown, {
      content: [
        "# Attention",
        "",
        "Use `softmax` safely.",
        "",
        "| A | B |",
        "| - | - |",
        "| x | y |",
        "",
        "```python",
        "print('ok')",
        "```",
        "",
        "<script>alert('x')</script>",
      ].join("\n"),
    }),
  );

  assert.match(markup, /Attention/);
  assert.match(markup, /<table/);
  assert.match(markup, /language-python/);
  assert.doesNotMatch(markup, /<script>/);
});

test("learning focus panel renders focused stage controls", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningFocusPanel, {
      stages: [
        {
          id: "goal",
          title: "今日目标",
          description: "明确主题",
          href: "#goal",
          status: "done",
        },
        {
          id: "lesson",
          title: "主课通读",
          description: "读正文",
          href: "#lesson",
          status: "active",
        },
      ],
    }),
  );

  assert.match(markup, /Focus Mode/);
  assert.match(markup, /主课通读/);
  assert.match(markup, /上一步/);
  assert.match(markup, /下一步/);
});

test("learning focus player renders one active stage with overview rail", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningFocusPlayer, {
      stages: [
        {
          id: "goal",
          title: "今日目标",
          eyebrow: "Step 1",
          description: "先明确学习任务。",
          status: "done",
          body: React.createElement("p", null, "目标内容"),
        },
        {
          id: "lesson",
          title: "主课通读",
          eyebrow: "Step 2",
          description: "读懂核心概念。",
          status: "active",
          body: React.createElement("p", null, "主课内容"),
        },
      ],
      overview: [
        { label: "状态", value: "planned" },
        { label: "卡片", value: 3 },
      ],
      actions: React.createElement("a", { href: "/review" }, "去复习"),
    }),
  );

  assert.match(markup, /专注学习模式/);
  assert.match(markup, /主课通读/);
  assert.match(markup, /主课内容/);
  assert.match(markup, /今日概览/);
  assert.match(markup, /planned/);
  assert.match(markup, /2 \/ 2/);
  assert.match(markup, /完整视图/);
  assert.doesNotMatch(markup, /目标内容/);
});

test("voice learning pipeline shows coach note cards and review next steps", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceLearningPipeline, {
      hasSelected: true,
      hasCoach: false,
      hasNote: false,
      hasCards: false,
      linkedCards: 0,
      voiceNoteId: "voice-1",
      reviewId: null,
      noteId: null,
    }),
  );

  assert.match(markup, /语音学习流水线/);
  assert.match(markup, /送 Coach 检查/);
  assert.match(markup, /整理成笔记/);
  assert.match(markup, /生成复习卡片/);
  assert.match(markup, /去复习/);
});

test("voice learning pipeline focuses review queue after cards are generated", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceLearningPipeline, {
      hasSelected: true,
      hasCoach: true,
      hasNote: true,
      hasCards: true,
      linkedCards: 3,
      voiceNoteId: "voice-1",
      reviewId: "review-1",
      noteId: "note-1",
    }),
  );

  assert.match(markup, /复习这 3 张语音卡片/);
  assert.match(markup, /href="\/review\?source=voice-note"/);
  assert.match(markup, /语音卡片已进入复习队列/);
});

test("knowledge path explorer renders viewed card reviewed weak and next states", () => {
  const markup = renderToStaticMarkup(
    React.createElement(KnowledgePathExplorer, {
      paths: [
        {
          id: "agent_basics",
          label: "Agent 基础链路",
          kind: "glossary",
          description: "从 CoT 到 SWE-bench。",
          items: [
            {
              slug: "cot",
              viewed: true,
              hasCard: true,
              reviewed: true,
              weak: false,
              statusLabel: "已复习",
            },
            {
              slug: "react",
              viewed: true,
              hasCard: true,
              reviewed: false,
              weak: true,
              statusLabel: "未掌握",
            },
          ],
          viewedCount: 2,
          cardCount: 2,
          reviewedCount: 1,
          weakCount: 1,
          nextSlug: "react",
          nextStatusLabel: "未掌握",
        },
      ],
      hrefForSlug: (slug) => `/glossary?term=${slug}`,
    }),
  );

  assert.match(markup, /路径化学习/);
  assert.match(markup, /Agent 基础链路/);
  assert.match(markup, /已看过 2\/2/);
  assert.match(markup, /已制卡 2\/2/);
  assert.match(markup, /已复习 1\/2/);
  assert.match(markup, /未掌握 1/);
  assert.match(markup, /下一项/);
  assert.match(markup, /react/);
});

test("review trainer completion summary highlights retention and next action", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ReviewTrainer, {
      card: null,
      queueSize: 0,
      initialSessionCounts: {
        forgot: 2,
        hard: 1,
        good: 1,
        easy: 0,
      },
      emptyState: {
        title: "暂无到期卡片",
        actions: [],
      },
    }),
  );

  assert.match(markup, /这轮复习暴露了补弱点/);
  assert.match(markup, /留存 25%/);
  assert.match(markup, /去 Coach 补弱/);
  assert.match(markup, /需要补弱/);
});
