import test from "node:test";
import assert from "node:assert/strict";
import { buildLibraryLessonNextActions } from "@/server/library/next-actions";

test("buildLibraryLessonNextActions prioritizes unfinished lessons", () => {
  const result = buildLibraryLessonNextActions({
    lessonId: "lesson-1",
    planStatus: "planned",
    flashcardCount: 0,
    dueFlashcardCount: 0,
    noteCount: 0,
    thoughtReviewCount: 0,
    codeSubmissionCount: 0,
  });

  assert.equal(result.title, "课程下一步");
  assert.match(result.summary, /先把课程完成/);
  assert.equal(result.actions[0]?.href, "/today");
  assert.match(result.actions[0]?.label ?? "", /回到今日学习/);
});

test("buildLibraryLessonNextActions turns completed lesson gaps into concrete follow ups", () => {
  const result = buildLibraryLessonNextActions({
    lessonId: "lesson-2",
    planStatus: "completed",
    flashcardCount: 3,
    dueFlashcardCount: 2,
    noteCount: 0,
    thoughtReviewCount: 0,
    codeSubmissionCount: 0,
  });

  assert.equal(result.actions.length, 3);
  assert.equal(result.actions[0]?.href, "/review");
  assert.match(result.actions[0]?.label ?? "", /复习/);
  assert.equal(result.actions[1]?.href, "/notes?lessonId=lesson-2");
  assert.match(result.actions[1]?.label ?? "", /写课程笔记/);
  assert.equal(result.actions[2]?.href, "/coach");
  assert.match(result.summary, /2 张到期卡片/);
});

test("buildLibraryLessonNextActions recommends archive review when lesson is already well covered", () => {
  const result = buildLibraryLessonNextActions({
    lessonId: "lesson-3",
    planStatus: "completed",
    flashcardCount: 4,
    dueFlashcardCount: 0,
    noteCount: 1,
    thoughtReviewCount: 1,
    codeSubmissionCount: 1,
  });

  assert.equal(result.actions[0]?.href, "/progress");
  assert.match(result.actions[0]?.label ?? "", /看进度/);
  assert.match(result.summary, /已经有笔记、Coach 和代码记录/);
});
