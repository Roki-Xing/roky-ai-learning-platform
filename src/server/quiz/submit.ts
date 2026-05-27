import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { buildQuizErrorFlashcard } from "@/server/quiz/error-card";

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string") out.push(v);
  }
  return out.length ? out : null;
}

function normalizeScalar(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string") return v.trim().toLowerCase();
  return String(v ?? "").trim().toLowerCase();
}

function normalizeNumberArray(v: unknown): number[] | null {
  if (!Array.isArray(v)) return null;
  const nums = v
    .map((x) => (typeof x === "number" ? x : Number.parseInt(String(x), 10)))
    .filter((x) => Number.isFinite(x));
  if (!nums.length) return null;
  nums.sort((a, b) => a - b);
  return nums;
}

export function parseQuizUserAnswer(args: {
  questionType: string;
  rawValues: unknown[];
}) {
  if (args.questionType === "multi_choice") {
    return args.rawValues
      .map((x) => String(x).trim())
      .filter(Boolean)
      .map((s) => Number.parseInt(s, 10))
      .filter((n) => Number.isFinite(n));
  }

  const raw = String(args.rawValues[0] ?? "").trim();
  if (args.questionType === "true_false") {
    if (!raw) return null;
    const normalized = raw.toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "y";
  }

  const asNum = Number.parseInt(raw, 10);
  return raw && Number.isFinite(asNum) ? asNum : raw;
}

export function isCorrectQuizAnswer(args: {
  questionType: string;
  correct: unknown;
  options: unknown;
  userAnswer: unknown;
}) {
  const { questionType, correct, options, userAnswer } = args;

  if (questionType === "true_false") {
    return normalizeScalar(correct) === normalizeScalar(userAnswer);
  }

  if (questionType === "multi_choice") {
    const ca = normalizeNumberArray(correct);
    const ua = normalizeNumberArray(userAnswer);
    if (ca && ua) {
      if (ca.length !== ua.length) return false;
      for (let i = 0; i < ca.length; i++) {
        if (ca[i] !== ua[i]) return false;
      }
      return true;
    }
    return normalizeScalar(correct) === normalizeScalar(userAnswer);
  }

  if (typeof correct === "number") {
    const u = typeof userAnswer === "number" ? userAnswer : Number.parseInt(String(userAnswer), 10);
    return Number.isFinite(u) && u === correct;
  }

  const opts = asStringArray(options);
  if (opts && typeof userAnswer === "number" && opts[userAnswer]) {
    return normalizeScalar(correct) === normalizeScalar(opts[userAnswer]);
  }
  return normalizeScalar(correct) === normalizeScalar(userAnswer);
}

export async function submitQuizAttempt(args: {
  userId: string;
  questionId: string;
  rawAnswerValues: unknown[];
}) {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: args.questionId },
    select: {
      id: true,
      type: true,
      question: true,
      answer: true,
      options: true,
      explanation: true,
      lessonId: true,
      lesson: {
        select: {
          topicId: true,
          dailyPlans: {
            where: { userId: args.userId, isTest: false, archivedAt: null },
            orderBy: [{ localDate: "desc" }],
            take: 1,
            select: { localDate: true },
          },
        },
      },
    },
  });
  if (!question) throw new Error("QuizQuestion not found");
  if (!question.lesson.dailyPlans.length) {
    throw new Error("QuizQuestion is not available for the current active lesson");
  }

  const userAnswer = parseQuizUserAnswer({
    questionType: question.type,
    rawValues: args.rawAnswerValues,
  });
  const isCorrect = isCorrectQuizAnswer({
    questionType: question.type,
    correct: question.answer,
    options: question.options,
    userAnswer,
  });

  const attemptId = `qa:${args.userId}:${args.questionId}`;
  await prisma.$transaction(async (tx) => {
    await tx.quizAttempt.upsert({
      where: { id: attemptId },
      update: {
        userAnswer: userAnswer as Prisma.InputJsonValue,
        isCorrect,
      },
      create: {
        id: attemptId,
        userId: args.userId,
        questionId: args.questionId,
        userAnswer: userAnswer as Prisma.InputJsonValue,
        isCorrect,
      },
    });

    const topicId = question.lesson.topicId;
    if (isCorrect) {
      await tx.misconception.updateMany({
        where: { userId: args.userId, questionId: args.questionId, status: "open" },
        data: { status: "resolved", resolvedAt: new Date() },
      });
      if (topicId) {
        await tx.userTopicState.upsert({
          where: { userId_topicId: { userId: args.userId, topicId } },
          update: { weaknessScore: { decrement: 0.5 } },
          create: { userId: args.userId, topicId, masteryLevel: 1, exposureCount: 1, weaknessScore: 0 },
        });
      }
      return;
    }

    const localDate = question.lesson.dailyPlans[0]?.localDate ?? null;
    await tx.misconception.upsert({
      where: { userId_questionId: { userId: args.userId, questionId: args.questionId } },
      update: {
        summary: `错题：${question.question}`,
        prompt: question.question,
        expectedAnswer: question.answer as Prisma.InputJsonValue,
        userAnswer: userAnswer as Prisma.InputJsonValue,
        explanation: question.explanation,
        localDate,
        status: "open",
        occurrenceCount: { increment: 1 },
        lastAttemptAt: new Date(),
        resolvedAt: null,
      },
      create: {
        userId: args.userId,
        questionId: args.questionId,
        lessonId: question.lessonId,
        topicId,
        localDate,
        source: "quiz",
        summary: `错题：${question.question}`,
        prompt: question.question,
        expectedAnswer: question.answer as Prisma.InputJsonValue,
        userAnswer: userAnswer as Prisma.InputJsonValue,
        explanation: question.explanation,
      },
    });

    const card = buildQuizErrorFlashcard({
      userId: args.userId,
      questionId: args.questionId,
      lessonId: question.lessonId,
      question: question.question,
      expectedAnswer: question.answer,
      userAnswer,
      explanation: question.explanation,
      localDate,
    });
    await tx.flashcard.upsert({
      where: { id: card.id },
      update: {
        front: card.front,
        back: card.back,
        type: card.type,
        tags: card.tags as Prisma.InputJsonValue,
        difficulty: card.difficulty,
        dueAt: new Date(),
      },
      create: {
        id: card.id,
        userId: card.userId,
        lessonId: card.lessonId,
        front: card.front,
        back: card.back,
        type: card.type,
        tags: card.tags as Prisma.InputJsonValue,
        difficulty: card.difficulty,
        dueAt: card.dueAt,
      },
    });

    if (topicId) {
      await tx.userTopicState.upsert({
        where: { userId_topicId: { userId: args.userId, topicId } },
        update: {
          exposureCount: { increment: 1 },
          weaknessScore: { increment: 1 },
          lastStudiedAt: new Date(),
        },
        create: {
          userId: args.userId,
          topicId,
          exposureCount: 1,
          weaknessScore: 1,
          lastStudiedAt: new Date(),
        },
      });
    }
  });

  return { isCorrect };
}
