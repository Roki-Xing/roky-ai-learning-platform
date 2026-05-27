import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { localDateInTimeZone } from "@/server/time/day";

function compact(value: string | null | undefined, max = 240) {
  const s = (value ?? "").trim().replace(/\s+/g, " ");
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export async function buildCoachContext(args: {
  userId: string;
  mode: string;
  includeTodayLesson: boolean;
  lessonId?: string | null;
}) {
  const profile = await getOrCreateUserProfile({ userId: args.userId });
  const todayLocalDate = localDateInTimeZone({
    date: new Date(),
    timeZone: profile.timeZone ?? "Asia/Shanghai",
  });

  const activePlanWhere = {
    userId: args.userId,
    isTest: false,
    archivedAt: null,
  };

  const todayPlan = args.includeTodayLesson
    ? await prisma.dailyPlan.findFirst({
        where: { ...activePlanWhere, localDate: todayLocalDate },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              summary: true,
              contentMarkdown: true,
              connections: true,
              topic: { select: { title: true, domain: { select: { name: true } } } },
            },
          },
        },
      })
    : null;

  let explicitLesson: {
    id: string;
    title: string;
    summary: string;
    connections: unknown;
    topic: { title: string; domain: { name: string } };
  } | null = null;
  if (args.lessonId) {
    explicitLesson = await prisma.lesson.findFirst({
        where: {
          id: args.lessonId,
          dailyPlans: { some: activePlanWhere },
        },
        select: {
          id: true,
          title: true,
          summary: true,
          connections: true,
          topic: { select: { title: true, domain: { select: { name: true } } } },
        },
      });
    if (!explicitLesson) throw new Error("Lesson not available for coach");
  }

  const lesson = explicitLesson ?? todayPlan?.lesson ?? null;

  const [
    recentPlans,
    dueCards,
    recentAttempts,
    recentCodeSubmissions,
    recentCodeFeedback,
    activeMisconceptions,
    standaloneReviewCards,
  ] = await Promise.all([
    prisma.dailyPlan.findMany({
      where: activePlanWhere,
      orderBy: [{ localDate: "desc" }],
      take: 7,
      select: {
        localDate: true,
        status: true,
        selectedDomain: true,
        selectedTopic: true,
        lesson: { select: { title: true } },
      },
    }),
    prisma.flashcard.findMany({
      where: {
        userId: args.userId,
        dueAt: { lte: new Date() },
        lesson: { is: { dailyPlans: { some: activePlanWhere } } },
      },
      orderBy: [{ dueAt: "asc" }],
      take: 8,
      select: { front: true, type: true },
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: args.userId,
        question: { lesson: { dailyPlans: { some: activePlanWhere } } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 8,
      select: {
        isCorrect: true,
        createdAt: true,
        question: { select: { question: true, explanation: true } },
      },
    }),
    prisma.codeSubmission.findMany({
      where: { userId: args.userId },
      orderBy: [{ updatedAt: "desc" }],
      take: 5,
      select: { language: true, localDate: true, code: true },
    }).catch(() => []),
    prisma.codeFeedback.findMany({
      where: { userId: args.userId },
      orderBy: [{ updatedAt: "desc" }],
      take: 5,
      select: { overall: true, summary: true, localDate: true },
    }).catch(() => []),
    prisma.misconception.findMany({
      where: { userId: args.userId, status: "open" },
      orderBy: [{ lastAttemptAt: "desc" }],
      take: 6,
      select: { summary: true, explanation: true, occurrenceCount: true },
    }),
    prisma.flashcard.findMany({
      where: {
        userId: args.userId,
        lessonId: null,
        tags: { array_contains: ["glossary"] },
      },
      orderBy: [{ dueAt: "asc" }],
      take: 5,
      select: { front: true, type: true },
    }).catch(() => []),
  ]);

  const lessonConnections =
    typeof lesson?.connections === "object" && lesson.connections !== null
      ? (lesson.connections as {
          glossary?: { term?: string | null } | null;
          breadth?: { kind?: string | null; title?: string | null } | null;
        })
      : null;
  const glossaryTerm = lessonConnections?.glossary?.term?.trim() || "none";
  const breadthKind = lessonConnections?.breadth?.kind?.trim() || "none";
  const breadthTitle = lessonConnections?.breadth?.title?.trim() || "none";

  const summary = [
    `profile: level=${profile.level}, goal=${profile.goal}, dailyMinutes=${profile.dailyMinutes}, difficulty=${profile.difficulty}, language=${profile.language}`,
    lesson
      ? `currentLesson: ${lesson.title}; topic=${lesson.topic.title}; domain=${lesson.topic.domain.name}; summary=${compact(lesson.summary)}`
      : "currentLesson: none",
    `recentLessons: ${recentPlans
      .map((p) => `${p.localDate}:${p.lesson.title}(${p.status})`)
      .join(" | ")}`,
    `dueCards: ${dueCards.map((c) => `${c.type}:${compact(c.front, 80)}`).join(" | ")}`,
    `recentQuiz: ${recentAttempts
      .map((a) => `${a.isCorrect ? "correct" : "wrong"}:${compact(a.question.question, 80)}`)
      .join(" | ")}`,
    `recentCode: ${recentCodeSubmissions
      .map((s) => `${s.localDate}:${s.language}:${compact(s.code, 100)}`)
      .join(" | ")}`,
    `recentCodeFeedback: ${recentCodeFeedback
      .map((f) => `${f.overall ?? "unknown"}:${compact(f.summary, 120)}`)
      .join(" | ")}`,
    `activeMisconceptions: ${activeMisconceptions
      .map((m) => `${m.summary}(x${m.occurrenceCount})`)
      .join(" | ")}`,
    `recentKnowledge: glossary=${glossaryTerm}; breadth=${breadthKind}:${breadthTitle}`,
    `standaloneReviewCards: ${standaloneReviewCards
      .map((c) => `${c.type}:${compact(c.front, 80)}`)
      .join(" | ")}`,
  ].join("\n");

  return {
    profile,
    todayLocalDate,
    lessonId: lesson?.id ?? null,
    lessonTitle: lesson?.title ?? null,
    summary,
  };
}
