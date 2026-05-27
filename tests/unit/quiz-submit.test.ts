import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { submitQuizAttempt } from "@/server/quiz/submit";

async function createQuizFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `quiz-user-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `quiz-domain-${suffix}`,
      name: "Quiz Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `quiz-topic-${suffix}`,
      title: "Quiz Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Quiz Lesson",
      summary: "Quiz lesson summary",
      contentMarkdown: "Quiz content",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({ data: { userId } });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-24T00:00:00.000Z"),
      localDate: "2026-05-24",
      status: "planned",
      isTest: false,
    },
  });
  const question = await prisma.quizQuestion.create({
    data: {
      lessonId: lesson.id,
      type: "single_choice",
      question: "Self-Attention 的输出是什么？",
      options: ["对 V 的加权和", "平均 embedding"],
      answer: 0,
      explanation: "Attention 权重来自 Q/K 相似度，然后对 V 加权求和。",
    },
  });

  return { userId, lesson, question };
}

test("submitQuizAttempt creates one quiz-error flashcard for repeated wrong answers", async () => {
  const { userId, lesson, question } = await createQuizFixture();

  const first = await submitQuizAttempt({
    userId,
    questionId: question.id,
    rawAnswerValues: ["1"],
  });
  const second = await submitQuizAttempt({
    userId,
    questionId: question.id,
    rawAnswerValues: ["1"],
  });

  assert.equal(first.isCorrect, false);
  assert.equal(second.isCorrect, false);

  const cards = await prisma.flashcard.findMany({
    where: { id: `quiz-error:${userId}:${question.id}` },
  });
  assert.equal(cards.length, 1);
  assert.equal(cards[0]?.lessonId, lesson.id);
  assert.equal(cards[0]?.type, "quiz_error");
  assert.match(cards[0]?.front ?? "", /错题复盘/);
  assert.match(cards[0]?.back ?? "", /我的答案/);

  const misconception = await prisma.misconception.findUnique({
    where: { userId_questionId: { userId, questionId: question.id } },
  });
  assert.equal(misconception?.status, "open");
  assert.equal(misconception?.occurrenceCount, 2);
});

test("submitQuizAttempt resolves misconception when the answer becomes correct", async () => {
  const { userId, question } = await createQuizFixture();

  await submitQuizAttempt({ userId, questionId: question.id, rawAnswerValues: ["1"] });
  const correct = await submitQuizAttempt({ userId, questionId: question.id, rawAnswerValues: ["0"] });

  assert.equal(correct.isCorrect, true);
  const misconception = await prisma.misconception.findUnique({
    where: { userId_questionId: { userId, questionId: question.id } },
  });
  assert.equal(misconception?.status, "resolved");
  assert.ok(misconception?.resolvedAt);
});
