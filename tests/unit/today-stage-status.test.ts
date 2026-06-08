import test from "node:test";
import assert from "node:assert/strict";
import {
  getKnowledgeStageStatus,
  getQuizStageStatus,
} from "@/server/learning/today-stage-status";

test("today quiz stage status distinguishes none, partial, and complete attempts", () => {
  assert.equal(getQuizStageStatus({ totalCount: 0, attemptedCount: 0 }), "done");
  assert.equal(getQuizStageStatus({ totalCount: 3, attemptedCount: 0 }), "todo");
  assert.equal(getQuizStageStatus({ totalCount: 3, attemptedCount: 1 }), "active");
  assert.equal(getQuizStageStatus({ totalCount: 3, attemptedCount: 3 }), "done");
});

test("today knowledge stage status tracks glossary and radar card availability", () => {
  assert.equal(
    getKnowledgeStageStatus({
      hasGlossaryConnection: false,
      hasBreadthConnection: false,
      hasGlossaryDetail: false,
      hasBreadthDetail: false,
    }),
    "done",
  );
  assert.equal(
    getKnowledgeStageStatus({
      hasGlossaryConnection: true,
      hasBreadthConnection: false,
      hasGlossaryDetail: false,
      hasBreadthDetail: false,
    }),
    "todo",
  );
  assert.equal(
    getKnowledgeStageStatus({
      hasGlossaryConnection: true,
      hasBreadthConnection: true,
      hasGlossaryDetail: true,
      hasBreadthDetail: false,
    }),
    "active",
  );
  assert.equal(
    getKnowledgeStageStatus({
      hasGlossaryConnection: true,
      hasBreadthConnection: true,
      hasGlossaryDetail: true,
      hasBreadthDetail: true,
    }),
    "done",
  );
});
