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
