import test from "node:test";
import assert from "node:assert/strict";
import { explainCurriculumDecision } from "@/server/curriculum/explain-decision";

test("explainCurriculumDecision turns score breakdown into a readable main reason and signals", () => {
  const explanation = explainCurriculumDecision({
    domain: "Python 编程",
    topic: "列表与字典",
    reason:
      "weekly=0.25, coverage=0.40, weakness=0.10, mapWeakness=0.95, coding=1.00, preference=0.00, novelty=1.00",
    scoreBreakdown: {
      score: 0.9125,
      weeklyRotationScore: 0.25,
      underCoverageScore: 0.4,
      weaknessScore: 0.1,
      mapWeaknessScore: 0.95,
      combinedWeaknessScore: 0.95,
      codingNeedScore: 1,
      userPreferenceScore: 0,
      noveltyScore: 1,
      remediationBoost: 0,
      recentTopicPenalty: false,
      recentDomainPenalty: false,
    },
  });

  assert.equal(explanation.selectedDomain, "Python 编程");
  assert.equal(explanation.selectedTopic, "列表与字典");
  assert.match(explanation.mainReason, /知识地图/);
  assert.match(explanation.mainReason, /代码练习/);
  assert.deepEqual(
    explanation.signals
      .filter((s) => s.active)
      .map((s) => s.key),
    ["mapWeakness", "codingNeed", "novelty"],
  );
  assert.deepEqual(explanation.notes, []);
});

test("explainCurriculumDecision exposes recent penalties and handles missing score breakdown", () => {
  const explanation = explainCurriculumDecision({
    domain: "LLM / RAG / Agent",
    topic: "RAG 检索链路",
    reason: "fallback selection",
    scoreBreakdown: {
      score: 0.2,
      recentTopicPenalty: true,
      recentDomainPenalty: true,
    },
  });

  assert.equal(explanation.mainReason, "当前计划来自基础兜底选题：fallback selection");
  assert.deepEqual(explanation.notes, [
    "最近 7 次学习已覆盖相同主题，系统已降低重复主题优先级。",
    "最近 3 次学习已覆盖相同领域，系统已降低连续领域重复。",
  ]);
  assert.equal(explanation.signals.every((s) => s.active === false), true);
});

test("explainCurriculumDecision exposes active misconception signal", () => {
  const explanation = explainCurriculumDecision({
    domain: "Python 编程",
    topic: "列表与字典",
    reason: "misconception=1.00",
    scoreBreakdown: {
      score: 0.9,
      misconceptionScore: 1,
      combinedWeaknessScore: 1,
    },
  });

  const activeKeys = explanation.signals.filter((s) => s.active).map((s) => s.key);

  assert.ok(activeKeys.includes("misconception"));
  assert.match(explanation.mainReason, /活跃误区/);
});
