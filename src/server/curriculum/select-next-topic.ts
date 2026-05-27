import { prisma } from "@/server/db";
import { scoreTopicCandidates } from "@/server/curriculum/scoring";
import type { CurriculumCandidate, CurriculumDecision } from "@/server/curriculum/types";

function parsePreferredAreas(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
}

function normalizeCount(v: number, max: number) {
  return Math.min(1, Math.max(0, v / max));
}

function buildMapWeaknessByDomain(args: {
  domainSlugs: string[];
  completedCountByDomain: Record<string, number>;
  dueCountByDomain: Record<string, number>;
  hardReviewCountByDomain: Record<string, number>;
  incorrectQuizCountByDomain: Record<string, number>;
}) {
  const maxCompleted = Math.max(1, ...Object.values(args.completedCountByDomain), 1);
  const out: Record<string, number> = {};

  for (const domainSlug of args.domainSlugs) {
    const underCoverage =
      1 - Math.min(1, (args.completedCountByDomain[domainSlug] ?? 0) / maxCompleted);
    const duePressure = normalizeCount(args.dueCountByDomain[domainSlug] ?? 0, 8);
    const reviewPressure = normalizeCount(args.hardReviewCountByDomain[domainSlug] ?? 0, 4);
    const quizPressure = normalizeCount(args.incorrectQuizCountByDomain[domainSlug] ?? 0, 4);

    out[domainSlug] = Number(
      Math.min(
        1,
        underCoverage * 0.35 +
          duePressure * 0.2 +
          reviewPressure * 0.2 +
          quizPressure * 0.25,
      ).toFixed(4),
    );
  }

  return out;
}

async function countActiveMisconceptionsByDomain(args: {
  userId: string;
}): Promise<Record<string, number>> {
  const misconceptions = await prisma.misconception.findMany({
    where: {
      userId: args.userId,
      status: { in: ["open", "active"] },
    },
    orderBy: [{ lastAttemptAt: "desc" }],
    take: 500,
    select: {
      topicId: true,
      lessonId: true,
    },
  });
  if (!misconceptions.length) return {};

  const topicIds = [
    ...new Set(misconceptions.map((m) => m.topicId).filter((x): x is string => Boolean(x))),
  ];
  const lessonIds = [
    ...new Set(misconceptions.map((m) => m.lessonId).filter(Boolean)),
  ];

  const [topics, lessons] = await Promise.all([
    topicIds.length
      ? prisma.topic.findMany({
          where: { id: { in: topicIds } },
          select: { id: true, domain: { select: { slug: true } } },
        })
      : Promise.resolve([]),
    lessonIds.length
      ? prisma.lesson.findMany({
          where: { id: { in: lessonIds } },
          select: {
            id: true,
            topic: { select: { domain: { select: { slug: true } } } },
          },
        })
      : Promise.resolve([]),
  ]);

  const domainByTopicId = new Map(topics.map((t) => [t.id, t.domain.slug]));
  const domainByLessonId = new Map(lessons.map((l) => [l.id, l.topic.domain.slug]));

  return misconceptions.reduce<Record<string, number>>((acc, m) => {
    const domainSlug =
      (m.topicId ? domainByTopicId.get(m.topicId) : null) ??
      domainByLessonId.get(m.lessonId);
    if (!domainSlug) return acc;
    acc[domainSlug] = (acc[domainSlug] ?? 0) + 1;
    return acc;
  }, {});
}

export async function selectNextTopic(args: {
  userId: string;
  localDate: string;
  preferredAreas?: unknown;
}): Promise<CurriculumDecision> {
  const [
    topics,
    recentPlans,
    completedByDomainRows,
    dueFlashcards,
    hardReviews,
    incorrectAttempts,
    activeMisconceptionCountByDomain,
    codeSubmissionCountLast7,
  ] = await Promise.all([
    prisma.topic.findMany({
      include: { domain: { select: { slug: true, name: true } } },
      orderBy: [{ createdAt: "asc" }],
      take: 300,
    }),
    prisma.dailyPlan.findMany({
      where: { userId: args.userId, archivedAt: null, isTest: false },
      include: {
        lesson: {
          include: { topic: { include: { domain: true } } },
        },
      },
      orderBy: [{ localDate: "desc" }],
      take: 14,
    }),
    prisma.dailyPlan.groupBy({
      by: ["selectedDomain"],
      where: { userId: args.userId, archivedAt: null, isTest: false, status: "completed" },
      _count: { _all: true },
    }),
    prisma.flashcard.findMany({
      where: {
        userId: args.userId,
        dueAt: { lte: new Date() },
        lesson: {
          is: {
            dailyPlans: {
              some: { userId: args.userId, isTest: false, archivedAt: null },
            },
          },
        },
      },
      select: { lesson: { select: { topic: { select: { domain: { select: { slug: true } } } } } } },
      take: 500,
    }),
    prisma.reviewLog.findMany({
      where: {
        rating: { in: ["forgot", "hard"] },
        flashcard: {
          userId: args.userId,
          lesson: {
            is: {
              dailyPlans: {
                some: { userId: args.userId, isTest: false, archivedAt: null },
              },
            },
          },
        },
      },
      select: { flashcard: { select: { lesson: { select: { topic: { select: { domain: { select: { slug: true } } } } } } } } },
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId: args.userId,
        isCorrect: false,
        question: {
          lesson: {
            dailyPlans: {
              some: { userId: args.userId, isTest: false, archivedAt: null },
            },
          },
        },
      },
      select: { question: { select: { lesson: { select: { topic: { select: { domain: { select: { slug: true } } } } } } } } },
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    }),
    countActiveMisconceptionsByDomain({ userId: args.userId }),
    prisma.codeSubmission.count({
      where: {
        userId: args.userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const candidates: CurriculumCandidate[] = topics.map((t) => ({
    domain: t.domain.name,
    domainSlug: t.domain.slug,
    topic: t.title,
    topicSlug: t.slug,
  }));

  const recentStudies = recentPlans.map((p) => ({
    domainSlug: p.selectedDomain ?? p.lesson.topic.domain.slug,
    topicSlug: p.selectedTopic ?? p.lesson.topic.slug,
    localDate: p.localDate,
  }));

  const completedCountByDomain = Object.fromEntries(
    completedByDomainRows
      .filter((r) => r.selectedDomain)
      .map((r) => [r.selectedDomain!, r._count._all]),
  );

  const countDomain = (items: string[]) =>
    items.reduce<Record<string, number>>((acc, slug) => {
      acc[slug] = (acc[slug] ?? 0) + 1;
      return acc;
    }, {});

  const dueCountByDomain = countDomain(
    dueFlashcards
      .map((c) => c.lesson?.topic?.domain?.slug ?? null)
      .filter((x): x is string => Boolean(x)),
  );
  const hardReviewCountByDomain = countDomain(
    hardReviews
      .map((r) => r.flashcard.lesson?.topic?.domain?.slug ?? null)
      .filter((x): x is string => Boolean(x)),
  );
  const incorrectQuizCountByDomain = countDomain(
    incorrectAttempts
      .map((a) => a.question.lesson.topic.domain.slug ?? null)
      .filter((x): x is string => Boolean(x)),
  );
  const mapWeaknessByDomain = buildMapWeaknessByDomain({
    domainSlugs: [...new Set(topics.map((t) => t.domain.slug))],
    completedCountByDomain,
    dueCountByDomain,
    hardReviewCountByDomain,
    incorrectQuizCountByDomain,
  });

  const scored = scoreTopicCandidates({
    localDate: args.localDate,
    preferredAreas: parsePreferredAreas(args.preferredAreas),
    candidates,
    recentStudies,
    completedCountByDomain,
    dueCountByDomain,
    hardReviewCountByDomain,
    incorrectQuizCountByDomain,
    activeMisconceptionCountByDomain,
    mapWeaknessByDomain,
    codeSubmissionCountLast7,
  });

  const selected = scored[0] ?? {
    domain: "深度学习",
    domainSlug: "dl",
    topic: "Transformer",
    topicSlug: "transformer",
    reason: "fallback selection",
    difficulty: "standard" as const,
    estimatedMinutes: 30,
    scoreBreakdown: { score: 0 },
    signalSnapshot: {
      recentStudies: [],
      completedCountByDomain: {},
      dueCountByDomain: {},
      hardReviewCountByDomain: {},
      incorrectQuizCountByDomain: {},
      activeMisconceptionCountByDomain: {},
      mapWeaknessByDomain: {},
      codeSubmissionCountLast7: 0,
    },
  };

  return selected;
}
