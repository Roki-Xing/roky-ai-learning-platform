import test from "node:test";
import assert from "node:assert/strict";
import { buildNextBestAction } from "@/server/learning/next-best-action";

const baseInput = {
  todayPlanStatus: "completed",
  dueFlashcardsCount: 0,
  openMisconceptionCount: 0,
  codeFeedbackNeedsAttentionCount: 0,
  activeProject: null,
  todayLessonId: "lesson-1",
  todayNoteCount: 1,
  todayVoiceNoteCount: 1,
};

test("next best action starts with today's lesson when the plan is not complete", () => {
  const action = buildNextBestAction({
    ...baseInput,
    todayPlanStatus: "planned",
    dueFlashcardsCount: 10,
  });

  assert.equal(action.href, "/today");
  assert.match(action.title, /今日学习/);
});

test("next best action prioritizes due review after daily completion", () => {
  const action = buildNextBestAction({
    ...baseInput,
    dueFlashcardsCount: 5,
  });

  assert.equal(action.href, "/review");
  assert.match(action.title, /5/);
});

test("next best action routes open misconceptions to coach", () => {
  const action = buildNextBestAction({
    ...baseInput,
    openMisconceptionCount: 2,
  });

  assert.equal(action.href, "/coach");
  assert.equal(action.tone, "danger");
  assert.match(action.reason, /2 个未解决误区/);
  assert.doesNotMatch(action.reason, /open misconception/);
});

test("next best action names the active misconception focus", () => {
  const action = buildNextBestAction({
    ...baseInput,
    openMisconceptionCount: 2,
    openMisconceptionFocus: {
      summary: "把 attention 当成简单平均",
      source: "quiz",
      occurrenceCount: 3,
    },
  });

  assert.equal(action.href, "/coach");
  assert.match(action.title, /attention/);
  assert.match(action.reason, /把 attention 当成简单平均/);
  assert.match(action.reason, /2 个/);
});

test("next best action names the active code feedback focus", () => {
  const action = buildNextBestAction({
    ...baseInput,
    codeFeedbackNeedsAttentionCount: 1,
    codeFeedbackFocus: {
      summary: "缺少 Q/K 相似度与 softmax 归一化",
      overall: "partially_correct",
      localDate: "2026-05-29",
    },
  });

  assert.equal(action.href, "/review");
  assert.match(action.title, /代码反馈/);
  assert.match(action.reason, /缺少 Q\/K 相似度与 softmax 归一化/);
});

test("next best action links active project when learning chores are clear", () => {
  const action = buildNextBestAction({
    ...baseInput,
    todayNoteCount: 1,
    activeProject: {
      id: "project-1",
      title: "RAG 原型",
      activeMilestoneTitle: "实现检索器",
    },
  });

  assert.equal(action.href, "/projects?projectId=project-1");
  assert.match(action.reason, /实现检索器/);
});

test("next best action asks for a voice reflection before project work", () => {
  const action = buildNextBestAction({
    ...baseInput,
    todayNoteCount: 1,
    todayVoiceNoteCount: 0,
    activeProject: {
      id: "project-1",
      title: "RAG 原型",
      activeMilestoneTitle: "实现检索器",
    },
  });

  assert.equal(action.href, "/voice");
  assert.equal(action.tone, "info");
  assert.match(action.title, /说出/);
  assert.match(action.reason, /语音/);
});

test("next best action recommends lightweight breadth exploration when learning chores are clear", () => {
  const action = buildNextBestAction({
    ...baseInput,
    todayPlanStatus: "completed",
    dueFlashcardsCount: 0,
    openMisconceptionCount: 0,
    codeFeedbackNeedsAttentionCount: 0,
    todayVoiceNoteCount: 1,
    activeProject: null,
  });

  assert.equal(action.href, "/radar?entity=swe-bench");
  assert.equal(action.title, "今天轻量探索：认识 SWE-bench");
  assert.match(action.reason, /SWE-bench/);
  assert.equal(action.ctaLabel, "认识 SWE-bench");
  assert.equal(action.priorityLabel, "轻量");
});
