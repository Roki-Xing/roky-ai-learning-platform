import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearningFocusPanel } from "@/components/learning/learning-focus-panel";
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
