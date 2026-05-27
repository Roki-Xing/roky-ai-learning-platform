import test from "node:test";
import assert from "node:assert/strict";
import { buildQuizErrorFlashcard } from "@/server/quiz/error-card";
import { isCorrectQuizAnswer, parseQuizUserAnswer } from "@/server/quiz/submit";

test("buildQuizErrorFlashcard creates a stable review card for wrong quiz answers", () => {
  const card = buildQuizErrorFlashcard({
    userId: "demo-user",
    questionId: "question-1",
    lessonId: "lesson-1",
    question: "Self-Attention 的输出是什么？",
    expectedAnswer: "对 V 的加权和",
    userAnswer: "平均所有 embedding",
    explanation: "Attention 权重来自 Q/K 相似度，然后对 V 加权求和。",
    localDate: "2026-05-24",
  });

  assert.equal(card.id, "quiz-error:demo-user:question-1");
  assert.equal(card.userId, "demo-user");
  assert.equal(card.lessonId, "lesson-1");
  assert.equal(card.type, "quiz_error");
  assert.equal(card.difficulty, 4);
  assert.deepEqual(card.tags, ["quiz-error", "misconception", "2026-05-24"]);
  assert.match(card.front, /错题复盘/);
  assert.match(card.front, /Self-Attention/);
  assert.match(card.back, /正确答案/);
  assert.match(card.back, /我的答案/);
  assert.match(card.back, /Attention 权重/);
});

test("buildQuizErrorFlashcard keeps back content compact for object answers", () => {
  const card = buildQuizErrorFlashcard({
    userId: "demo-user",
    questionId: "question-2",
    lessonId: "lesson-2",
    question: "选择所有正确说法",
    expectedAnswer: [0, 2],
    userAnswer: [1],
    explanation: "第 1 和第 3 项正确。",
    localDate: null,
  });

  assert.equal(card.id, "quiz-error:demo-user:question-2");
  assert.deepEqual(card.tags, ["quiz-error", "misconception"]);
  assert.match(card.back, /\[0,2\]/);
  assert.match(card.back, /\[1\]/);
});

test("parseQuizUserAnswer does not treat an empty true_false submission as false", () => {
  const userAnswer = parseQuizUserAnswer({
    questionType: "true_false",
    rawValues: [],
  });

  assert.equal(userAnswer, null);
  assert.equal(
    isCorrectQuizAnswer({
      questionType: "true_false",
      correct: false,
      options: null,
      userAnswer,
    }),
    false,
  );
});
