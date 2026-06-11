import test from "node:test";
import assert from "node:assert/strict";
import { buildReviewSessionSummary } from "@/server/review/session-summary";

test("review session summary recommends coach when forgot and hard dominate", () => {
  const summary = buildReviewSessionSummary({
    forgot: 2,
    hard: 1,
    good: 1,
    easy: 0,
  }, [
    {
      id: "card-1",
      front: "RAG 里的 retrieval 和 rerank 差别是什么？",
      rating: "forgot",
      type: "concept",
      tags: ["rag"],
      lessonTitle: "RAG 检索链路",
      topicTitle: "LLM / RAG / Agent",
    },
    {
      id: "card-2",
      front: "二分搜索 left/right 边界为什么会死循环？",
      rating: "forgot",
      type: "concept",
      tags: ["binary-search-boundary"],
      lessonTitle: "二分搜索边界条件",
      topicTitle: "算法模式入门",
    },
    {
      id: "card-3",
      front: "RAG 里的 query rewrite 什么时候有帮助？",
      rating: "hard",
      type: "concept",
      tags: ["rag"],
      lessonTitle: "RAG 检索链路",
      topicTitle: "LLM / RAG / Agent",
    },
  ]);

  assert.equal(summary.reviewedCount, 4);
  assert.equal(summary.retentionRate, 25);
  assert.equal(summary.tone, "danger");
  assert.match(summary.title, /补弱/);
  assert.match(summary.description, /今天先不要学新内容，建议复习和修复。/);
  assert.match(summary.primaryAction.href, /^\/coach\?/);
  assert.equal(summary.weakAreas[0]?.label, "RAG");
  assert.equal(summary.remediationLessonLabel, "RAG");
  assert.match(summary.recommendations[0] ?? "", /明天先安排 10 分钟补弱/);
  assert.ok(Array.isArray(summary.remediationActions));
  assert.deepEqual(summary.remediationActions.map((action) => action.label), [
    "让 Coach 解释这些卡片",
    "生成补弱小课",
    "明天安排补弱",
    "查看错题中心",
  ]);
  assert.match(summary.remediationActions[0]?.href ?? "", /^\/coach\?/);
  assert.match(summary.remediationActions[1]?.href ?? "", /^\/today\?/);
  assert.match(summary.remediationActions[2]?.href ?? "", /^\/today\?/);
  assert.match(summary.remediationActions[2]?.href ?? "", /when=tomorrow/);
  assert.match(summary.remediationActions[2]?.description ?? "", /明天/);
  assert.equal(summary.remediationActions[3]?.href, "/mistakes");
  assert.deepEqual(summary.actionPlan.map((item) => item.title), [
    "先补 RAG",
    "把忘掉的卡片改写成自己的解释",
    "交给 Coach 生成补弱问题",
  ]);
});

test("review session summary keeps progress primary action when retention is strong", () => {
  const summary = buildReviewSessionSummary({
    forgot: 0,
    hard: 1,
    good: 2,
    easy: 2,
  }, [
    {
      id: "card-1",
      front: "为什么 React state 更新是异步批处理？",
      rating: "hard",
      type: "concept",
      tags: ["react-state"],
      lessonTitle: "React 状态管理",
      topicTitle: "AI 工程实践",
    },
  ]);

  assert.equal(summary.reviewedCount, 5);
  assert.equal(summary.retentionRate, 80);
  assert.equal(summary.tone, "success");
  assert.match(summary.title, /稳定/);
  assert.equal(summary.primaryAction.href, "/progress");
  assert.ok(Array.isArray(summary.remediationActions));
  assert.deepEqual(summary.remediationActions.map((action) => action.label), [
    "让 Coach 解释这些卡片",
    "生成补弱小课",
    "明天安排补弱",
    "查看错题中心",
  ]);
  assert.equal(summary.weakAreas[0]?.label, "react state");
  assert.deepEqual(summary.actionPlan.map((item) => item.title), [
    "查看进度趋势",
    "顺手补 react state",
    "保持明天复习节奏",
  ]);
});
