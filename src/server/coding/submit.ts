import { Prisma } from "@prisma/client";
import { generateCodeFeedback, buildCodeFeedbackFlashcards, hasSeriousCodeIssue } from "@/server/ai/code-feedback";
import { prisma } from "@/server/db";

type LessonExamples = {
  codingExercise?: {
    prompt?: string;
    starterCode?: string;
    referenceSolution?: string;
    visibleTests?: unknown;
    commonBugs?: string[];
  } | null;
};

function asLessonExamples(value: unknown): LessonExamples | null {
  if (typeof value !== "object" || value === null) return null;
  return value as LessonExamples;
}

function feedbackSummaryText(review: Awaited<ReturnType<typeof generateCodeFeedback>>["feedback"]) {
  const issueText = review.issues.length
    ? ` 主要问题：${review.issues.map((issue) => issue.message).slice(0, 2).join("；")}`
    : "";
  return `结构化代码反馈：${review.overall}。${review.summary}${issueText}`;
}

export async function submitCodeForReview(args: {
  userId: string;
  lessonId: string;
  localDate: string;
  language: string;
  code: string;
}) {
  if (!args.lessonId) throw new Error("Missing lessonId");
  if (!args.localDate) throw new Error("Missing localDate");
  if (!args.code.trim()) throw new Error("Missing code");

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: args.lessonId,
      dailyPlans: { some: { userId: args.userId, isTest: false, archivedAt: null } },
    },
    select: {
      id: true,
      title: true,
      topicId: true,
      examples: true,
    },
  });
  if (!lesson) throw new Error("Lesson not found");

  const examples = asLessonExamples(lesson.examples);
  const exercise = examples?.codingExercise ?? null;

  const submission = await prisma.codeSubmission.upsert({
    where: {
      userId_lessonId_localDate: {
        userId: args.userId,
        lessonId: args.lessonId,
        localDate: args.localDate,
      },
    },
    update: {
      language: args.language,
      code: args.code,
      status: "submitted",
    },
    create: {
      userId: args.userId,
      lessonId: args.lessonId,
      localDate: args.localDate,
      language: args.language,
      code: args.code,
      status: "submitted",
    },
  });

  const generated = await generateCodeFeedback({
    userId: args.userId,
    lessonTitle: lesson.title,
    localDate: args.localDate,
    language: args.language,
    prompt: exercise?.prompt ?? null,
    starterCode: exercise?.starterCode ?? null,
    referenceSolution: exercise?.referenceSolution ?? null,
    visibleTests: exercise?.visibleTests ?? [],
    commonBugs: exercise?.commonBugs ?? [],
    code: args.code,
  });
  const review = generated.feedback;
  const feedbackJson = review as Prisma.InputJsonValue;
  const aiFeedback = feedbackSummaryText(review);

  await prisma.$transaction(async (tx) => {
    await tx.codeSubmission.update({
      where: { id: submission.id },
      data: {
        status: "feedback_ready",
        aiFeedback,
        feedbackJson,
      },
    });

    await tx.codeFeedback.upsert({
      where: { submissionId: submission.id },
      update: {
        provider: generated.provider,
        status: "success",
        overall: review.overall,
        summary: review.summary,
        strengths: review.strengths as Prisma.InputJsonValue,
        issues: review.issues as Prisma.InputJsonValue,
        suggestions: review.hints as Prisma.InputJsonValue,
        hints: review.hints as Prisma.InputJsonValue,
        suggestedTests: review.suggestedTests as Prisma.InputJsonValue,
        flashcards: review.flashcards as Prisma.InputJsonValue,
        nextSteps: review.nextSteps as Prisma.InputJsonValue,
        feedbackJson,
        raw: (generated.raw ?? null) as Prisma.InputJsonValue,
      },
      create: {
        submissionId: submission.id,
        userId: args.userId,
        lessonId: args.lessonId,
        localDate: args.localDate,
        provider: generated.provider,
        status: "success",
        overall: review.overall,
        summary: review.summary,
        strengths: review.strengths as Prisma.InputJsonValue,
        issues: review.issues as Prisma.InputJsonValue,
        suggestions: review.hints as Prisma.InputJsonValue,
        hints: review.hints as Prisma.InputJsonValue,
        suggestedTests: review.suggestedTests as Prisma.InputJsonValue,
        flashcards: review.flashcards as Prisma.InputJsonValue,
        nextSteps: review.nextSteps as Prisma.InputJsonValue,
        feedbackJson,
        raw: (generated.raw ?? null) as Prisma.InputJsonValue,
      },
    });

    if (hasSeriousCodeIssue(review)) {
      const firstIssue = review.issues.find((issue) => issue.severity === "high") ?? review.issues[0] ?? null;
      await tx.misconception.upsert({
        where: { sourceKey: `code:${args.userId}:${submission.id}` },
        update: {
          lessonId: args.lessonId,
          topicId: lesson.topicId,
          localDate: args.localDate,
          source: "code",
          summary: firstIssue?.message ?? review.summary,
          prompt: exercise?.prompt ?? "Code submission",
          userAnswer: { code: args.code.slice(0, 2_000), language: args.language } as Prisma.InputJsonValue,
          explanation: review.summary,
          status: "open",
          occurrenceCount: { increment: 1 },
          lastAttemptAt: new Date(),
          resolvedAt: null,
          codeSubmissionId: submission.id,
        },
        create: {
          userId: args.userId,
          questionId: null,
          codeSubmissionId: submission.id,
          lessonId: args.lessonId,
          topicId: lesson.topicId,
          localDate: args.localDate,
          source: "code",
          sourceKey: `code:${args.userId}:${submission.id}`,
          summary: firstIssue?.message ?? review.summary,
          prompt: exercise?.prompt ?? "Code submission",
          userAnswer: { code: args.code.slice(0, 2_000), language: args.language } as Prisma.InputJsonValue,
          explanation: review.summary,
        },
      });
    }

    const cards = buildCodeFeedbackFlashcards({
      submissionId: submission.id,
      userId: args.userId,
      lessonId: args.lessonId,
      review,
    });
    for (const card of cards) {
      await tx.flashcard.upsert({
        where: { id: card.id },
        update: {
          front: card.front,
          back: card.back,
          type: card.type,
          tags: card.tags as Prisma.InputJsonValue,
          difficulty: card.difficulty,
          dueAt: card.dueAt,
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
    }
  });

  return { submissionId: submission.id, provider: generated.provider, review };
}

