import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CoachContextCompass,
  CoachHero,
  CoachIssueList,
  CoachModeRail,
  CoachSignalStrip,
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

  assert.match(hero, /Tutor Workspace/);
  assert.match(hero, /Transformer 架构入门/);
  assert.match(hero, /到期卡片/);
  assert.match(hero, /待澄清/);
  assert.match(signals, /正确点/);
  assert.match(signals, /追问/);
  assert.match(signals, /建议卡片/);
});

test("coach workspace issue block keeps issue severity and explanation visible", () => {
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
  assert.match(markup, /conceptual/);
  assert.match(markup, /high/);
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
    }),
  );

  assert.match(markup, /评审模式/);
  assert.match(markup, /今日课程/);
  assert.match(markup, /代码思路/);
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

  assert.match(markup, /Context Compass/);
  assert.match(markup, /最强信号/);
  assert.match(markup, /到期卡片/);
  assert.match(markup, /5/);
  assert.match(markup, /Transformer 架构入门/);
  assert.match(markup, /href="\/review"/);
});
