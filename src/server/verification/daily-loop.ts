import { prisma } from "@/server/db";
import { submitCodeForReview } from "@/server/coding/submit";
import { completeTodayPlan, getOrCreateTodayPlan } from "@/server/lesson/daily-plan";
import { saveGuidedProgress } from "@/server/lesson/guided-progress";
import { submitQuizAttempt } from "@/server/quiz/submit";
import { rateFlashcard } from "@/server/review/actions";
import { getDueFlashcards } from "@/server/review/queue";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { seedDefaultDomainsAndTopics, seedDefaultKnowledgeBase } from "@/server/seed/seed";

type LessonExamples = {
  guidedSteps?: unknown[];
  codingExercise?: {
    language?: string;
    starterCode?: string;
  };
};

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asLessonExamples(value: unknown): LessonExamples {
  const examples = asRecord(value);
  return {
    guidedSteps: Array.isArray(examples.guidedSteps) ? examples.guidedSteps : [],
    codingExercise: asRecord(examples.codingExercise) as LessonExamples["codingExercise"],
  };
}

function answerValuesForQuestion(args: {
  type: string;
  answer: unknown;
  options: unknown;
}) {
  if (args.type === "multi_choice" && Array.isArray(args.answer)) {
    return args.answer.map((value) => String(value));
  }

  if (args.type === "true_false") return [String(args.answer)];

  if (typeof args.answer === "number" || typeof args.answer === "boolean") {
    return [String(args.answer)];
  }

  if (typeof args.answer === "string") {
    const options = Array.isArray(args.options) ? args.options : [];
    const optionIndex = options.findIndex((option) => option === args.answer);
    return [optionIndex >= 0 ? String(optionIndex) : args.answer];
  }

  return [String(args.answer ?? "")];
}

function verifierCode(language: string, starterCode?: string) {
  if (language.toLowerCase().startsWith("python")) {
    return [
      starterCode?.trim() || "def solve(values):",
      "    # verifier intentionally submits a minimal placeholder for tutor feedback.",
      "    return values",
    ].join("\n");
  }

  return [
    starterCode?.trim() || "function solve(values) {",
    "  return values;",
    "}",
  ].join("\n");
}

export async function runDailyLoopVerification(args: {
  userId: string;
  now?: Date;
}) {
  const now = args.now ?? new Date();

  await seedDefaultDomainsAndTopics();
  await seedDefaultKnowledgeBase();

  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: { timeZone: "Asia/Shanghai" },
    create: { userId: args.userId, timeZone: "Asia/Shanghai" },
  });

  const initialPlan = await getOrCreateTodayPlan({
    userId: args.userId,
    now,
  });
  const planWithLesson = await prisma.dailyPlan.findFirstOrThrow({
    where: {
      id: initialPlan.id,
      userId: args.userId,
      isTest: false,
      archivedAt: null,
    },
    include: { lesson: { include: { quizzes: true } } },
  });

  const examples = asLessonExamples(planWithLesson.lesson.examples);
  const stepCount = Math.max(2, examples.guidedSteps?.length ?? 0);
  const guidedProgress = await saveGuidedProgress({
    userId: args.userId,
    planId: planWithLesson.id,
    input: {
      activeStep: 1,
      answers: { "0": "我先用自己的话解释核心概念，再检查实现细节。" },
    },
    stepCount,
    now,
  });

  const firstQuestion = planWithLesson.lesson.quizzes[0];
  if (!firstQuestion) throw new Error("DailyPlan lesson has no quiz question");
  await submitQuizAttempt({
    userId: args.userId,
    questionId: firstQuestion.id,
    rawAnswerValues: answerValuesForQuestion({
      type: firstQuestion.type,
      answer: firstQuestion.answer,
      options: firstQuestion.options,
    }),
  });

  const codingExercise = examples.codingExercise ?? {};
  const language = codingExercise.language ?? "python";
  const codeReview = await submitCodeForReview({
    userId: args.userId,
    lessonId: planWithLesson.lessonId,
    localDate: planWithLesson.localDate,
    language,
    code: verifierCode(language, codingExercise.starterCode),
  });

  const completed = await completeTodayPlan({
    userId: args.userId,
    date: now,
    reflection: "每日闭环验收：已完成引导、测验、代码提交、复习入口检查。",
  });

  // Use a post-completion timestamp for due checks; AI generation/review can exceed the
  // earlier fixed offset and would incorrectly classify newly-created cards as not-due.
  const reviewNow = new Date();
  const reviewQueueBeforeRating = await getDueFlashcards({
    userId: args.userId,
    now: reviewNow,
  });
  const firstDue = reviewQueueBeforeRating[0];
  if (!firstDue) throw new Error("Daily loop did not create any due flashcards");

  const reviewRating = await rateFlashcard({
    userId: args.userId,
    flashcardId: firstDue.id,
    rating: "good",
    now: reviewNow,
  });

  const reviewableWhere = buildReviewableFlashcardWhere(args.userId);
  const [
    quizAttemptCount,
    codeSubmission,
    codeFeedbackCount,
    completedPlanCount,
    flashcardCount,
    reviewLogCount,
  ] = await Promise.all([
    prisma.quizAttempt.count({ where: { userId: args.userId } }),
    prisma.codeSubmission.findUniqueOrThrow({
      where: {
        userId_lessonId_localDate: {
          userId: args.userId,
          lessonId: planWithLesson.lessonId,
          localDate: planWithLesson.localDate,
        },
      },
    }),
    prisma.codeFeedback.count({ where: { userId: args.userId } }),
    prisma.dailyPlan.count({
      where: {
        userId: args.userId,
        status: "completed",
        isTest: false,
        archivedAt: null,
      },
    }),
    prisma.flashcard.count({ where: reviewableWhere }),
    prisma.reviewLog.count({ where: { flashcard: reviewableWhere } }),
  ]);

  return {
    userId: args.userId,
    localDate: planWithLesson.localDate,
    plan: {
      id: completed.id,
      lessonId: completed.lessonId,
      status: completed.status,
    },
    guidedProgress,
    quizAttemptCount,
    codeReview,
    codeSubmission,
    codeFeedbackCount,
    completedPlanCount,
    flashcardCount,
    reviewQueueBeforeRating,
    reviewRating,
    reviewLogCount,
    progressSignals: {
      completedLessons: completedPlanCount,
      quizAttempts: quizAttemptCount,
      codeSubmissions: codeSubmission ? 1 : 0,
      reviewLogs: reviewLogCount,
    },
  };
}
