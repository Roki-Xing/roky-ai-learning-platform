import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearningFocusPanel } from "@/components/learning/learning-focus-panel";
import { LearningFocusPlayer } from "@/components/learning/learning-focus-player";
import { LearningMarkdown } from "@/components/learning/learning-markdown";

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
