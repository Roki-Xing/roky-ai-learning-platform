import { AppShell } from "@/components/app-shell";
import { Sprint9AnalyticsPanels, type QualityRow } from "@/app/progress/analytics-panels";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildCalendarDays,
  buildProgressWeakDomainSummary,
  calculateContentQuality,
  calculateLearningEffect,
  calculateQualityScore,
  summarizeCodeFeedbackIssueTrend,
  summarizeCodeTrend,
  summarizeGenerationHealth,
  summarizeKnowledgeCoverage,
  summarizeMisconceptionTrend,
  summarizeQuizAccuracyTrend,
  summarizeReviewRetentionTrend,
} from "@/server/analytics/progress";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { normalizeCodeFeedbackIssues } from "@/server/coding/view";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { calculateProjectProgress, normalizeProjectType, PROJECT_TYPE_LABELS } from "@/server/projects/base";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";

export default async function ProgressPage() {
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });

  const now = new Date();
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const todayLocalDate = localDateInTimeZone({ date: now, timeZone });
  const activeOfficialPlanWhere = { userId, isTest: false, archivedAt: null };
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(userId);

  const [
    completedPlansCount,
    totalPlansCount,
    totalFlashcardsCount,
    dueFlashcardsCount,
    reviewLogsCount,
    quizAttemptsCount,
    openMisconceptionsCount,
    resolvedMisconceptionsCount,
    codeSubmissionsCount,
    codeFeedbackCount,
    thoughtReviewsCount,
    notesCount,
    completedDates,
    domainPlans,
    qualityPlans,
    quizAttemptsForEffect,
    reviewLogsForEffect,
    codeSubmissionsForTrend,
    codeFeedbackForTrend,
    glossaryTotal,
    radarTotal,
    glossaryReviewed,
    radarReviewed,
    recentMisconceptions,
    recentCodeFeedback,
    recentThoughtReviews,
    projectCounts,
    recentProjects,
    weakTopicStates,
    generationPlans,
    dailyGenerationJobs,
    misconceptionsForTrend,
  ] = await Promise.all([
    prisma.dailyPlan.count({ where: { ...activeOfficialPlanWhere, status: "completed" } }),
    prisma.dailyPlan.count({ where: activeOfficialPlanWhere }),
    prisma.flashcard.count({ where: reviewableFlashcardWhere }),
    prisma.flashcard.count({
      where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
    }),
    prisma.reviewLog.count({
      where: { flashcard: reviewableFlashcardWhere },
    }),
    prisma.quizAttempt.count({
      where: { userId, question: { lesson: { dailyPlans: { some: activeOfficialPlanWhere } } } },
    }),
    prisma.misconception.count({ where: { userId, status: "open" } }),
    prisma.misconception.count({ where: { userId, status: "resolved" } }),
    prisma.codeSubmission.count({ where: { userId } }).catch(() => 0),
    prisma.codeFeedback.count({ where: { userId } }).catch(() => 0),
    prisma.thoughtReview.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
    prisma.dailyPlan.findMany({
      where: { ...activeOfficialPlanWhere, status: "completed" },
      select: { localDate: true },
      orderBy: [{ localDate: "desc" }],
      take: 365,
    }),
    prisma.dailyPlan.findMany({
      where: activeOfficialPlanWhere,
      select: {
        lessonId: true,
        localDate: true,
        status: true,
        selectedDomain: true,
        selectedTopic: true,
        lesson: {
          select: {
            topic: { select: { slug: true, domain: { select: { slug: true, name: true } } } },
          },
        },
      },
      take: 500,
    }),
    prisma.dailyPlan.findMany({
      where: activeOfficialPlanWhere,
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      take: 8,
      select: {
        id: true,
        localDate: true,
        status: true,
        lessonId: true,
        lesson: {
          select: {
            title: true,
            contentMarkdown: true,
            examples: true,
            connections: true,
            createdBy: true,
            _count: { select: { quizzes: true } },
          },
        },
      },
    }),
    prisma.quizAttempt.findMany({
      where: { userId, question: { lesson: { dailyPlans: { some: activeOfficialPlanWhere } } } },
      orderBy: [{ createdAt: "asc" }],
      select: { isCorrect: true, createdAt: true },
      take: 500,
    }),
    prisma.reviewLog.findMany({
      where: { flashcard: reviewableFlashcardWhere },
      select: { rating: true },
      take: 500,
    }),
    prisma.codeSubmission.findMany({
      where: { userId },
      orderBy: [{ localDate: "asc" }, { createdAt: "asc" }],
      select: { localDate: true },
      take: 120,
    }).catch(() => []),
    prisma.codeFeedback.findMany({
      where: { userId },
      orderBy: [{ localDate: "asc" }, { createdAt: "asc" }],
      select: { localDate: true, issues: true },
      take: 120,
    }).catch(() => []),
    prisma.glossaryTerm.count().catch(() => 0),
    prisma.knowledgeEntity.count().catch(() => 0),
    prisma.flashcard.count({
      where: { userId, lessonId: null, tags: { array_contains: ["glossary"] }, reviewCount: { gt: 0 } },
    }).catch(() => 0),
    prisma.flashcard.count({
      where: { userId, lessonId: null, tags: { array_contains: ["radar"] }, reviewCount: { gt: 0 } },
    }).catch(() => 0),
    prisma.misconception.findMany({
      where: { userId, status: "open" },
      orderBy: [{ lastAttemptAt: "desc" }],
      take: 8,
      select: {
        id: true,
        summary: true,
        prompt: true,
        occurrenceCount: true,
        lastAttemptAt: true,
        lessonId: true,
      },
    }),
    prisma.codeFeedback.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        lessonId: true,
        localDate: true,
        provider: true,
        overall: true,
        summary: true,
        issues: true,
        updatedAt: true,
      },
    }).catch(() => []),
    prisma.thoughtReview.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        lessonId: true,
        mode: true,
        mainClaim: true,
        createdAt: true,
      },
    }),
    prisma.learningProject.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
      orderBy: [{ status: "asc" }],
    }).catch(() => []),
    prisma.learningProject.findMany({
      where: { userId },
      include: { milestones: { orderBy: [{ position: "asc" }] } },
      orderBy: [{ updatedAt: "desc" }],
      take: 6,
    }).catch(() => []),
    prisma.userTopicState.findMany({
      where: { userId, weaknessScore: { gt: 0 } },
      orderBy: [{ weaknessScore: "desc" }, { updatedAt: "desc" }],
      take: 8,
      select: {
        topicId: true,
        weaknessScore: true,
        exposureCount: true,
        lastStudiedAt: true,
      },
    }),
    prisma.dailyPlan.findMany({
      where: activeOfficialPlanWhere,
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      select: {
        source: true,
        schemaVersion: true,
      },
      take: 120,
    }),
    prisma.aiGenerationJob.findMany({
      where: { userId, type: "daily_plan" },
      orderBy: [{ createdAt: "desc" }],
      select: {
        status: true,
        model: true,
        output: true,
      },
      take: 120,
    }),
    prisma.misconception.findMany({
      where: { userId },
      orderBy: [{ lastAttemptAt: "asc" }],
      select: {
        localDate: true,
        status: true,
        lastAttemptAt: true,
      },
      take: 500,
    }),
  ]);

  const officialLessonIdSet = new Set(domainPlans.map((p) => p.lessonId));
  const lessonSignalById = new Map(
    domainPlans.map((plan) => [
      plan.lessonId,
      {
        domainSlug: plan.selectedDomain ?? plan.lesson.topic.domain.slug,
        domainName: plan.lesson.topic.domain.name,
        topicSlug: plan.selectedTopic ?? plan.lesson.topic.slug,
      },
    ]),
  );
  const filteredCodeSubmissionsCount = officialLessonIdSet.size
    ? await prisma.codeSubmission.count({
        where: { userId, lessonId: { in: [...officialLessonIdSet] } },
      }).catch(() => 0)
    : codeSubmissionsCount;

  const [
    domainFlashcards,
    domainReviewLogs,
    domainQuizAttempts,
    domainCodeSubmissions,
    domainMisconceptions,
  ] = officialLessonIdSet.size
    ? await Promise.all([
        prisma.flashcard.findMany({
          where: {
            userId,
            lessonId: { in: [...officialLessonIdSet] },
          },
          select: { lessonId: true, dueAt: true },
          take: 2000,
        }),
        prisma.reviewLog.findMany({
          where: {
            flashcard: {
              userId,
              lessonId: { in: [...officialLessonIdSet] },
            },
          },
          select: {
            rating: true,
            createdAt: true,
            flashcard: { select: { lessonId: true } },
          },
          orderBy: [{ createdAt: "asc" }],
          take: 2000,
        }),
        prisma.quizAttempt.findMany({
          where: { userId, question: { lessonId: { in: [...officialLessonIdSet] } } },
          select: { isCorrect: true, question: { select: { lessonId: true } } },
          take: 2000,
        }),
        prisma.codeSubmission.findMany({
          where: { userId, lessonId: { in: [...officialLessonIdSet] } },
          select: { lessonId: true },
          take: 1000,
        }).catch(() => []),
        prisma.misconception.findMany({
          where: { userId, lessonId: { in: [...officialLessonIdSet] } },
          select: { lessonId: true, status: true },
          take: 2000,
        }),
      ])
    : [[], [], [], [], []] as const;

  const completedSet = new Set(
    completedDates.map((d) => d.localDate),
  );

  // Streak: count consecutive completed local days ending at today (or yesterday if not completed today).
  function prevLocalDate(d: string) {
    // Treat d as a local calendar date and move by 1 day in UTC to avoid timezone pitfalls.
    const [y, m, day] = d.split("-").map((x) => Number.parseInt(x, 10));
    const utc = new Date(Date.UTC(y!, (m ?? 1) - 1, day ?? 1, 0, 0, 0));
    utc.setUTCDate(utc.getUTCDate() - 1);
    const yy = String(utc.getUTCFullYear());
    const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(utc.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }

  let cursor = todayLocalDate;
  if (!completedSet.has(cursor)) {
    cursor = prevLocalDate(cursor);
  }
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (!completedSet.has(cursor)) break;
    streak++;
    cursor = prevLocalDate(cursor);
  }

  const recentCompletedPlans = await prisma.dailyPlan.findMany({
    where: { ...activeOfficialPlanWhere, status: "completed" },
    include: { lesson: { select: { id: true, title: true } } },
    orderBy: [{ date: "desc" }],
    take: 10,
  });

  const domainStats = new Map<
    string,
    {
      name: string;
      planned: number;
      completed: number;
      dueFlashcardCount: number;
      activeMisconceptionCount: number;
      quizAttemptCount: number;
      correctQuizCount: number;
      codeSubmissionCount: number;
      lastStudiedLocalDate: string | null;
    }
  >();
  function ensureDomainStat(slug: string, name: string) {
    const current = domainStats.get(slug);
    if (current) return current;
    const next = {
      name,
      planned: 0,
      completed: 0,
      dueFlashcardCount: 0,
      activeMisconceptionCount: 0,
      quizAttemptCount: 0,
      correctQuizCount: 0,
      codeSubmissionCount: 0,
      lastStudiedLocalDate: null,
    };
    domainStats.set(slug, next);
    return next;
  }
  for (const plan of domainPlans) {
    const slug = plan.selectedDomain ?? plan.lesson.topic.domain.slug;
    const current = ensureDomainStat(slug, plan.lesson.topic.domain.name);
    current.planned += 1;
    if (plan.status === "completed") current.completed += 1;
    current.lastStudiedLocalDate = current.lastStudiedLocalDate
      ? [current.lastStudiedLocalDate, plan.localDate].sort().at(-1) ?? plan.localDate
      : plan.localDate;
  }
  for (const card of domainFlashcards) {
    if (!card.lessonId || card.dueAt > now) continue;
    const signal = lessonSignalById.get(card.lessonId);
    if (!signal) continue;
    ensureDomainStat(signal.domainSlug, signal.domainName).dueFlashcardCount += 1;
  }
  for (const attempt of domainQuizAttempts) {
    const signal = lessonSignalById.get(attempt.question.lessonId);
    if (!signal) continue;
    const current = ensureDomainStat(signal.domainSlug, signal.domainName);
    current.quizAttemptCount += 1;
    if (attempt.isCorrect) current.correctQuizCount += 1;
  }
  for (const submission of domainCodeSubmissions) {
    const signal = lessonSignalById.get(submission.lessonId);
    if (!signal) continue;
    ensureDomainStat(signal.domainSlug, signal.domainName).codeSubmissionCount += 1;
  }
  for (const misconception of domainMisconceptions) {
    const signal = lessonSignalById.get(misconception.lessonId);
    if (!signal) continue;
    if (misconception.status === "open" || misconception.status === "active") {
      ensureDomainStat(signal.domainSlug, signal.domainName).activeMisconceptionCount += 1;
    }
  }
  const domainCoverage = [...domainStats.entries()]
    .map(([slug, stat]) => ({ slug, ...stat }))
    .sort((a, b) => b.completed - a.completed || b.planned - a.planned)
    .slice(0, 8);
  const weakDomains = buildProgressWeakDomainSummary(
    [...domainStats.entries()].map(([slug, stat]) => ({
      slug,
      label: stat.name,
      completedLessons: stat.completed,
      plannedLessons: stat.planned - stat.completed,
      dueFlashcardCount: stat.dueFlashcardCount,
      activeMisconceptionCount: stat.activeMisconceptionCount,
      quizAttemptCount: stat.quizAttemptCount,
      correctQuizCount: stat.correctQuizCount,
      codeSubmissionCount: stat.codeSubmissionCount,
      lastStudiedLocalDate: stat.lastStudiedLocalDate,
    })),
  );
  const reviewRetentionTrend = summarizeReviewRetentionTrend(
    domainReviewLogs.map((log) => ({
      localDate: localDateInTimeZone({ date: log.createdAt, timeZone }),
      rating: log.rating,
    })),
  );
  const topicDiversityCount = new Set(
    domainPlans.map((p) => p.selectedTopic ?? p.lesson.topic.slug).filter(Boolean),
  ).size;
  const calendarDays = buildCalendarDays({
    todayLocalDate,
    planDays: domainPlans.map((plan) => ({
      localDate: plan.localDate,
      status: plan.status,
    })),
    days: 28,
  });
  const qualityLessonIds = qualityPlans.map((p) => p.lessonId);
  const flashcardGroups = qualityLessonIds.length
    ? await prisma.flashcard.groupBy({
        by: ["lessonId"],
        where: { userId, lessonId: { in: qualityLessonIds } },
        _count: { _all: true },
      })
    : [];
  const flashcardCountByLesson = new Map(
    flashcardGroups.map((g) => [g.lessonId, g._count._all]),
  );
  const qualityRows: QualityRow[] = qualityPlans.map((plan) => {
    const metrics = calculateContentQuality({
      lesson: plan.lesson,
      quizCount: plan.lesson._count.quizzes,
      flashcardCount: flashcardCountByLesson.get(plan.lessonId) ?? 0,
      generationRetries: 0,
    });
    return {
      id: plan.id,
      title: plan.lesson.title,
      localDate: plan.localDate,
      status: plan.status,
      metrics,
      score: calculateQualityScore(metrics),
    };
  });
  const learningEffect = calculateLearningEffect({
    quizAttempts: quizAttemptsForEffect,
    reviewLogs: reviewLogsForEffect,
    completedLessonCount: completedPlansCount,
    codeSubmissionCount: filteredCodeSubmissionsCount,
    openMisconceptionCount: openMisconceptionsCount,
    resolvedMisconceptionCount: resolvedMisconceptionsCount,
    streak,
    domainCoverageCount: domainCoverage.length,
    topicDiversityCount,
  });
  const quizAccuracyTrend = summarizeQuizAccuracyTrend(
    quizAttemptsForEffect.map((attempt) => ({
      localDate: localDateInTimeZone({ date: attempt.createdAt, timeZone }),
      isCorrect: attempt.isCorrect,
    })),
  );
  const codeTrend = summarizeCodeTrend(codeSubmissionsForTrend);
  const codeFeedbackIssueTrend = summarizeCodeFeedbackIssueTrend(codeFeedbackForTrend);
  const misconceptionTrend = summarizeMisconceptionTrend(
    misconceptionsForTrend.map((misconception) => ({
      localDate:
        misconception.localDate ??
        localDateInTimeZone({ date: misconception.lastAttemptAt, timeZone }),
      status: misconception.status,
    })),
  );
  const knowledgeCoverage = {
    ...summarizeKnowledgeCoverage({
      glossaryTotal,
      glossaryReviewed,
      radarTotal,
      radarReviewed,
    }),
    glossaryTotal,
    glossaryReviewed,
    radarTotal,
    radarReviewed,
  };
  const generationHealth = summarizeGenerationHealth({
    plans: generationPlans,
    jobs: dailyGenerationJobs,
  });

  const weakTopicIds = weakTopicStates.map((s) => s.topicId);
  const weakTopics = weakTopicIds.length
    ? await prisma.topic.findMany({
        where: { id: { in: weakTopicIds } },
        select: { id: true, title: true, slug: true, domain: { select: { name: true } } },
      })
    : [];
  const weakTopicById = new Map(weakTopics.map((t) => [t.id, t]));
  const projectStatusCounts = new Map(
    projectCounts.map((group) => [group.status, group._count._all]),
  );
  const activeProjectCount =
    (projectStatusCounts.get("planned") ?? 0) + (projectStatusCounts.get("active") ?? 0);
  const completedProjectCount = projectStatusCounts.get("completed") ?? 0;
  const completedMilestoneCount = recentProjects.reduce(
    (sum, project) => sum + calculateProjectProgress(project.milestones).completed,
    0,
  );

  return (
    <AppShell activePath="/progress" title="学习进度">
      <PageHeader
        title="学习进度"
        subtitle="学习日历、内容质量、学习效果、代码趋势与知识覆盖"
        badge="进度"
      />

      <Sprint9AnalyticsPanels
        calendarDays={calendarDays}
        qualityRows={qualityRows}
        learningEffect={learningEffect}
        quizAccuracyTrend={quizAccuracyTrend}
        codeTrend={codeTrend}
        codeFeedbackIssueTrend={codeFeedbackIssueTrend}
        misconceptionTrend={misconceptionTrend}
        weakDomains={weakDomains}
        reviewRetentionTrend={reviewRetentionTrend}
        knowledgeCoverage={knowledgeCoverage}
        generationHealth={generationHealth}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">连续天数</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">{streak}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  以 DailyPlan.completed 为准（用户时区日期）
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">今日到期卡片</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">
                  {dueFlashcardsCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  总卡片：{totalFlashcardsCount}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">已完成课程</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">
                  {completedPlansCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  总计划：{totalPlansCount}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">笔记</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">{notesCount}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ReviewLog：{reviewLogsCount}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">测验</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">{quizAttemptsCount}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  开放错题：{openMisconceptionsCount}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">代码提交</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">
                  {filteredCodeSubmissionsCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  反馈：{codeFeedbackCount}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">思路评审</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">
                  {thoughtReviewsCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Coach 结构化评审
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">项目实践</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-2xl font-semibold tabular-nums">
                  {activeProjectCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  已完成：{completedProjectCount} / 里程碑：{completedMilestoneCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近完成</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {recentCompletedPlans.length ? (
                <div className="grid gap-1">
                  {recentCompletedPlans.map((p) => (
                    <a
                      key={p.id}
                      href={`/library?lessonId=${encodeURIComponent(p.lessonId)}`}
                      className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="font-medium">{p.lesson.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.date.toISOString().slice(0, 10)}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无完成记录。去 /today 完成一节学习后这里会更新。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">开放错题</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {recentMisconceptions.length ? (
                recentMisconceptions.map((m) => (
                  <a
                    key={m.id}
                    href={`/library?lessonId=${encodeURIComponent(m.lessonId)}`}
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">{m.summary}</div>
                      <Badge variant="outline">x{m.occurrenceCount}</Badge>
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {m.prompt}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {m.lastAttemptAt.toISOString().slice(0, 10)}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无开放错题。提交测验后，错误答案会沉淀到这里。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近代码反馈</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {recentCodeFeedback.length ? (
                recentCodeFeedback.map((f) => {
                  const issues = normalizeCodeFeedbackIssues(f.issues);
                  return (
                    <a
                      key={f.id}
                      href={`/library?lessonId=${encodeURIComponent(f.lessonId)}`}
                      className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-medium">{f.localDate}</div>
                        <Badge variant="outline">
                          {f.provider}{f.overall ? ` / ${f.overall}` : ""}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{f.summary}</div>
                      {issues.length ? (
                        <div className="mt-1 text-xs text-muted-foreground">
                          待处理：{issues.slice(0, 2).map((issue) => issue.message).join("；")}
                        </div>
                      ) : null}
                    </a>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无代码反馈。保存 /today 的代码提交后会自动生成。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近思路评审</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {recentThoughtReviews.length ? (
                recentThoughtReviews.map((r) => (
                  <a
                    key={r.id}
                    href={`/coach?reviewId=${encodeURIComponent(r.id)}`}
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">
                        {r.mainClaim ?? "未命名评审"}
                      </div>
                      <Badge variant="outline">{r.mode}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无思路评审。去 /coach 提交一段理解后会沉淀到这里。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近项目实践</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {recentProjects.length ? (
                recentProjects.map((project) => {
                  const progress = calculateProjectProgress(project.milestones);
                  return (
                    <a
                      key={project.id}
                      href={`/projects?projectId=${encodeURIComponent(project.id)}`}
                      className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 font-medium">{project.title}</div>
                        <Badge variant={project.status === "completed" ? "secondary" : "outline"}>
                          {progress.percent}%
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {PROJECT_TYPE_LABELS[normalizeProjectType(project.type)]} / {project.status}
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无项目实践。去 /projects 开始一个小项目后会沉淀到这里。
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">领域覆盖率</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {domainCoverage.length ? (
                domainCoverage.map((d) => (
                  <div key={d.slug} className="rounded-md border px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">{d.name}</div>
                      <Badge variant="secondary">{d.completed}/{d.planned}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{d.slug}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">暂无领域覆盖数据。</div>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">薄弱主题</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {weakTopicStates.length ? (
                weakTopicStates.map((s) => {
                  const topic = weakTopicById.get(s.topicId);
                  return (
                    <div key={s.topicId} className="rounded-md border px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium">{topic?.title ?? s.topicId}</div>
                        <Badge variant="outline">{s.weaknessScore.toFixed(1)}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {topic?.domain.name ?? "-"} / exposure {s.exposureCount}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground">暂无薄弱主题。</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
