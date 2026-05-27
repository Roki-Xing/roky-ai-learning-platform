import { prisma } from "@/server/db";
import { pickDailyTemplate } from "@/server/content/templates";
import { localDateInTimeZone, utcStartOfLocalDay } from "@/server/time/day";
import { generateDailyPlanTemplate } from "@/server/ai/generate-daily-plan";
import { DAILY_PLAN_SCHEMA_VERSION } from "@/server/ai/schemas";
import { selectNextTopic } from "@/server/curriculum/select-next-topic";
import {
  buildKnowledgeCardsFromFocus,
  selectDailyKnowledgeFocus,
} from "@/server/knowledge/daily-breadth";
import { Prisma } from "@prisma/client";

export async function getOrCreateTodayPlan(args: {
  userId: string;
  now?: Date;
  isTest?: boolean;
}) {
  const now = args.now ?? new Date();
  const userId = args.userId;
  const isTest = args.isTest ?? false;

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: now, timeZone });
  const date = utcStartOfLocalDay({ localDate, timeZone });

  const existing = await prisma.dailyPlan.findFirst({
    where: { userId, localDate, isTest, archivedAt: null },
    include: { lesson: { include: { quizzes: true } } },
  });
  if (existing) return existing;

  const decision = await selectNextTopic({
    userId,
    localDate,
    preferredAreas: profile.preferredAreas,
  });

  const topic = await prisma.topic.findFirst({
    where: { slug: decision.topicSlug },
    include: { domain: true },
  });
  if (!topic) {
    throw new Error(`Missing seed data: Topic slug "${decision.topicSlug}" not found.`);
  }

  const gen = await generateDailyPlanTemplate({
    userId,
    localDate,
    timeZone,
    topicSlug: topic.slug,
    curriculum: decision,
    userProfile: {
      goal: profile.goal,
      level: profile.level,
      dailyMinutes: profile.dailyMinutes,
      language: profile.language,
      difficulty: profile.difficulty,
      preferredAreas: (profile.preferredAreas ?? null) as unknown,
    },
  });
  const tpl = gen.tpl;
  const source = gen.source;
  const knowledgeFocus = await selectDailyKnowledgeFocus({
    userId,
    localDate,
    preferredTermSlugs: [
      ...((Array.isArray(profile.preferredTermSlugs)
        ? profile.preferredTermSlugs.filter((x): x is string => typeof x === "string")
        : []) ?? []),
      ...(tpl.glossary?.term ? [tpl.glossary.term] : []),
    ],
    preferredEntitySlugs: [
      ...((Array.isArray(profile.preferredEntitySlugs)
        ? profile.preferredEntitySlugs.filter((x): x is string => typeof x === "string")
        : []) ?? []),
      ...(tpl.breadth?.title ? [tpl.breadth.title] : []),
    ],
    avoidRecentDays: profile.knowledgeAvoidDays,
    isTest,
  });
  const knowledgeCards = buildKnowledgeCardsFromFocus(knowledgeFocus);
  const glossaryCard = knowledgeCards.glossary ?? tpl.glossary;
  const breadthCard = knowledgeCards.breadth ?? tpl.breadth;

  const createPlan = () => prisma.$transaction(async (tx) => {
    const lesson = await tx.lesson.create({
      data: {
        topicId: topic.id,
        title: tpl.lesson.title,
        summary: tpl.lesson.summary,
        contentMarkdown: tpl.lesson.contentMarkdown,
        difficulty: "standard",
        estimatedMinutes: 30,
        objectives: tpl.lesson.objectives,
        keyTerms: tpl.lesson.keyTerms,
        examples: {
          guidedSteps: tpl.lesson.guidedSteps,
          codingExercise: tpl.codingExercise,
          flashcards: tpl.flashcards,
        },
        connections: {
          glossary: glossaryCard,
          breadth: breadthCard,
          knowledgeFocus: {
            rotation: knowledgeFocus.rotation,
            links: knowledgeFocus.links,
            avoided: knowledgeFocus.avoided,
            avoidRecentDays: knowledgeFocus.avoidRecentDays,
          },
          reflectionPrompt: tpl.reflectionPrompt ?? undefined,
          nextRecommendation: tpl.nextRecommendation ?? undefined,
          schemaVersion: tpl.schemaVersion,
          generationJobId: gen.jobId ?? null,
          selectedTopic: topic.slug,
          selectedDomain: topic.domain.slug,
          selectionReason: decision.reason,
        },
        createdBy: source,
      },
    });

    for (const q of tpl.quiz) {
      await tx.quizQuestion.create({
        data: {
          lessonId: lesson.id,
          type: q.type,
          question: q.question,
          options: q.options ?? undefined,
          answer: q.answer as Prisma.InputJsonValue,
          explanation: q.explanation,
          difficulty: "standard",
        },
      });
    }

    const plan = await tx.dailyPlan.create({
      data: {
        userId,
        lessonId: lesson.id,
        date,
        localDate,
        status: "planned",
        source,
        schemaVersion: tpl.schemaVersion ?? DAILY_PLAN_SCHEMA_VERSION,
        isTest,
        selectedTopic: topic.slug,
        selectedDomain: topic.domain.slug,
        selectionReason: decision.reason,
        generationJobId: gen.jobId ?? null,
      },
      include: { lesson: { include: { quizzes: true } } },
    });

    await tx.curriculumDecisionLog.upsert({
      where: { userId_localDate_isTest: { userId, localDate, isTest } },
      update: {
        domain: topic.domain.slug,
        topic: topic.slug,
        reason: decision.reason,
        inputSnapshot: {
          profile: {
            goal: profile.goal,
            level: profile.level,
            dailyMinutes: profile.dailyMinutes,
            difficulty: profile.difficulty,
            preferredAreas: profile.preferredAreas,
          },
          decision,
        } as Prisma.InputJsonValue,
        scoreBreakdown: decision.scoreBreakdown as Prisma.InputJsonValue,
      },
      create: {
        userId,
        localDate,
        isTest,
        domain: topic.domain.slug,
        topic: topic.slug,
        reason: decision.reason,
        inputSnapshot: {
          profile: {
            goal: profile.goal,
            level: profile.level,
            dailyMinutes: profile.dailyMinutes,
            difficulty: profile.difficulty,
            preferredAreas: profile.preferredAreas,
          },
          decision,
        } as Prisma.InputJsonValue,
        scoreBreakdown: decision.scoreBreakdown as Prisma.InputJsonValue,
      },
    });
    return plan;
  });

  try {
    return await createPlan();
  } catch (e) {
    // The production database uses partial unique indexes for active official/test
    // plans. Prisma cannot model those indexes, so on a duplicate race we read back
    // the active row instead of surfacing a failed repeated click.
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      const raced = await prisma.dailyPlan.findFirst({
        where: { userId, localDate, isTest, archivedAt: null },
        include: { lesson: { include: { quizzes: true } } },
      });
      if (raced) return raced;
    }
    throw e;
  }
}

export async function completeTodayPlan(args: {
  userId: string;
  date: Date;
  reflection?: string | null;
  isTest?: boolean;
}) {
  const profile = await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });

  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: args.date, timeZone });
  const utcDate = utcStartOfLocalDay({ localDate, timeZone });

  const plan = await prisma.dailyPlan.findFirst({
    where: { userId: args.userId, localDate, isTest: args.isTest ?? false, archivedAt: null },
    include: { lesson: { include: { quizzes: true } } },
  });
  if (!plan) throw new Error("DailyPlan not found");

  type SavedLessonExamples = {
    flashcards?: Array<{ front: string; back: string; type?: string; tags?: string[] }>;
  };
  const examples = (plan.lesson.examples ?? null) as unknown as SavedLessonExamples | null;
  const flashcards = examples?.flashcards?.length
    ? examples.flashcards
    : pickDailyTemplate({ topicSlug: "transformer" }).flashcards;

  const completed = await prisma.$transaction(async (tx) => {
    // Idempotency: if already completed, do not regenerate anything beyond upserts.
    if (plan.status === "completed") {
      return plan;
    }

    const updated = await tx.dailyPlan.update({
      where: { id: plan.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        // Keep UTC date consistent with localDate for reliable queries.
        date: utcDate,
        reflection: args.reflection ?? null,
      },
      include: { lesson: true },
    });

    // Generate flashcards (idempotent for the day+lesson).
    for (let i = 0; i < flashcards.length; i++) {
      const c = flashcards[i];
      await tx.flashcard.upsert({
        where: {
          id: `fc:${args.userId}:${plan.lessonId}:${i}`,
        },
        update: {
          front: c.front,
          back: c.back,
          type: c.type ?? "concept",
          tags: c.tags ?? undefined,
        },
        create: {
          id: `fc:${args.userId}:${plan.lessonId}:${i}`,
          userId: args.userId,
          lessonId: plan.lessonId,
          front: c.front,
          back: c.back,
          type: c.type ?? "concept",
          tags: c.tags ?? undefined,
          dueAt: new Date(),
        },
      });
    }

    return updated;
  });

  return completed;
}
