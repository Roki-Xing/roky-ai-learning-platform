import test from "node:test";
import assert from "node:assert/strict";
import { scoreTopicCandidates } from "@/server/curriculum/scoring";

test("scoreTopicCandidates avoids repeating a topic studied in the last 7 entries", () => {
  const ranked = scoreTopicCandidates({
    localDate: "2026-05-26",
    preferredAreas: [],
    candidates: [
      {
        domain: "Python / 代码表达",
        domainSlug: "python-coding",
        topic: "函数与类型提示",
        topicSlug: "python-functions",
      },
      {
        domain: "Python / 代码表达",
        domainSlug: "python-coding",
        topic: "列表与字典",
        topicSlug: "python-lists-dicts",
      },
    ],
    recentStudies: [
      {
        domainSlug: "python-coding",
        topicSlug: "python-functions",
        localDate: "2026-05-25",
      },
    ],
    completedCountByDomain: {},
    dueCountByDomain: {},
    hardReviewCountByDomain: {},
    incorrectQuizCountByDomain: {},
    codeSubmissionCountLast7: 2,
  });

  assert.equal(ranked[0]?.topicSlug, "python-lists-dicts");
});

test("scoreTopicCandidates uses knowledge map weakness to prioritize weak domains", () => {
  const ranked = scoreTopicCandidates({
    localDate: "2026-05-27",
    preferredAreas: [],
    candidates: [
      {
        domain: "LLM / RAG / Agent",
        domainSlug: "llm-rag-agent",
        topic: "RAG 检索链路",
        topicSlug: "rag-pipeline",
      },
      {
        domain: "Python 编程",
        domainSlug: "python-coding",
        topic: "列表与字典",
        topicSlug: "python-lists-dicts",
      },
    ],
    recentStudies: [],
    completedCountByDomain: {
      "llm-rag-agent": 3,
      "python-coding": 3,
    },
    dueCountByDomain: {},
    hardReviewCountByDomain: {},
    incorrectQuizCountByDomain: {},
    mapWeaknessByDomain: {
      "llm-rag-agent": 0,
      "python-coding": 0.95,
    },
    codeSubmissionCountLast7: 3,
  });

  assert.equal(ranked[0]?.domainSlug, "python-coding");
  assert.equal(ranked[0]?.scoreBreakdown.mapWeaknessScore, 0.95);
});

test("scoreTopicCandidates keeps recent topic avoidance stronger than map weakness", () => {
  const ranked = scoreTopicCandidates({
    localDate: "2026-05-27",
    preferredAreas: [],
    candidates: [
      {
        domain: "Python 编程",
        domainSlug: "python-coding",
        topic: "列表与字典",
        topicSlug: "python-lists-dicts",
      },
      {
        domain: "Python 编程",
        domainSlug: "python-coding",
        topic: "函数与类型提示",
        topicSlug: "python-functions",
      },
    ],
    recentStudies: [
      {
        domainSlug: "python-coding",
        topicSlug: "python-lists-dicts",
        localDate: "2026-05-26",
      },
    ],
    completedCountByDomain: { "python-coding": 1 },
    dueCountByDomain: {},
    hardReviewCountByDomain: {},
    incorrectQuizCountByDomain: {},
    mapWeaknessByDomain: { "python-coding": 1 },
    codeSubmissionCountLast7: 3,
  });

  assert.equal(ranked[0]?.topicSlug, "python-functions");
  assert.equal(ranked[1]?.scoreBreakdown.recentTopicPenalty, true);
});

test("scoreTopicCandidates uses active misconceptions as a remediation signal", () => {
  const ranked = scoreTopicCandidates({
    localDate: "2026-05-28",
    preferredAreas: [],
    candidates: [
      {
        domain: "LLM / RAG / Agent",
        domainSlug: "llm-rag-agent",
        topic: "RAG 检索链路",
        topicSlug: "rag-pipeline",
      },
      {
        domain: "Python 编程",
        domainSlug: "python-coding",
        topic: "列表与字典",
        topicSlug: "python-lists-dicts",
      },
    ],
    recentStudies: [],
    completedCountByDomain: {
      "llm-rag-agent": 3,
      "python-coding": 3,
    },
    dueCountByDomain: {},
    hardReviewCountByDomain: {},
    incorrectQuizCountByDomain: {},
    activeMisconceptionCountByDomain: {
      "python-coding": 4,
    },
    mapWeaknessByDomain: {},
    codeSubmissionCountLast7: 3,
  });

  assert.equal(ranked[0]?.domainSlug, "python-coding");
  assert.equal(ranked[0]?.scoreBreakdown.misconceptionScore, 1);
  assert.ok(Number(ranked[0]?.scoreBreakdown.combinedWeaknessScore) >= 1);
});
