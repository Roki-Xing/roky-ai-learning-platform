import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TodayRemediationBanner } from "@/components/learning/today-remediation-banner";
import { buildTodayRemediationIntent } from "@/server/learning/today-remediation-intent";

test("today remediation intent accepts review session handoff params", () => {
  const intent = buildTodayRemediationIntent({
    mode: "remediation",
    source: "review",
    focus: "RAG",
    lesson: "RAG 检索链路",
    topic: "LLM / RAG / Agent",
  });

  assert.deepEqual(intent, {
    title: "Review 补弱短课",
    sourceLabel: "Review Session Summary",
    focusLabel: "RAG",
    lessonTitle: "RAG 检索链路",
    topicTitle: "LLM / RAG / Agent",
  });
});

test("today remediation intent ignores unrelated query params", () => {
  assert.equal(buildTodayRemediationIntent({ mode: "today_lesson" }), null);
  assert.equal(buildTodayRemediationIntent({ mode: "remediation", source: "coach" }), null);
});

test("today remediation banner renders the review remediation landing", () => {
  const intent = buildTodayRemediationIntent({
    mode: "remediation",
    source: "review",
    focus: "RAG",
    lesson: "RAG 检索链路",
  });

  assert.ok(intent);

  const markup = renderToStaticMarkup(
    React.createElement(TodayRemediationBanner, { intent }),
  );

  assert.match(markup, /Review 补弱短课/);
  assert.match(markup, /补弱短课已带入/);
  assert.match(markup, /RAG/);
  assert.match(markup, /RAG 检索链路/);
  assert.match(markup, /href="#today-lesson"/);
  assert.match(markup, /href="#today-reflection"/);
  assert.match(markup, /href="\/review"/);
});

test("today remediation banner keeps action CTAs mobile friendly", () => {
  const intent = buildTodayRemediationIntent({
    mode: "remediation",
    source: "review",
    focus: "RAG",
    lesson: "RAG 检索链路",
  });

  assert.ok(intent);

  const markup = renderToStaticMarkup(
    React.createElement(TodayRemediationBanner, { intent }),
  );

  assert.match(markup, /mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  assert.doesNotMatch(markup, /mt-4 flex flex-wrap gap-2/);

  const ctaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(ctaMatches.length, 3);
});
