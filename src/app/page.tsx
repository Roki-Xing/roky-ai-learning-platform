import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import {
  addDaysUTC,
  localDateInTimeZone,
  utcStartOfLocalDay,
} from "@/server/time/day";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { BadgeShelf } from "@/components/learning/badge-shelf";
import { DailyQuestCard } from "@/components/learning/daily-quest-card";
import { LearningHabitGoalCard } from "@/components/learning/learning-habit-goal-card";
import { LearningMomentumStrip } from "@/components/learning/learning-momentum-strip";
import { LearningMissionCard } from "@/components/learning/learning-mission-card";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { XpLevelCard } from "@/components/learning/xp-level-card";
import {
  buildCurrentMission,
  buildCurrentMissionProgress,
  buildCurrentMissionSignals,
} from "@/server/learning/current-mission";
import { buildLearningBadges } from "@/server/learning/badges";
import {
  buildBreadthChallengeFromLessonConnections,
  buildDailyQuests,
} from "@/server/learning/daily-quests";
import {
  buildLearningHabitGoalFromQuests,
  countCompletedDaysInLocalWeek,
} from "@/server/learning/habit-goal";
import { buildLearningMomentum } from "@/server/learning/momentum";
import { calculateLearningXp } from "@/server/learning/xp";
import { ProjectDailyRhythmCard } from "@/app/projects/ui/project-mission-workspace";
import {
  PROJECT_TYPE_LABELS,
  calculateProjectProgress,
  normalizeProjectType,
} from "@/server/projects/base";
import { getProjectCodeFeedbackCardSummary } from "@/server/projects/code-feedback-summary";
import { getProjectReviewCardSummary } from "@/server/projects/review-cards";
import { isPreviewMode } from "@/server/auth/preview";
import {
  buildHomeCodeFeedbackMeta,
  buildHomeMistakeMeta,
  formatHomeDailyPlanStatusLabel,
} from "@/app/_lib/home-labels";

const QUICK_ACTIONS = [
  {
    href: "/today",
    label: "继续今日学习",
    note: "主课、步骤、代码练习和小测验都在这里。",
  },
  {
    href: "/review",
    label: "去复习",
    note: "把今天到期的卡片清掉。",
  },
  {
    href: "/coach",
    label: "让 Coach 看看",
    note: "把自己的理解说出来，找出误区。",
  },
  {
    href: "/notes",
    label: "写今日笔记",
    note: "把今天学到的东西沉淀下来。",
  },
  {
    href: "/projects",
    label: "项目实践",
    note: "把知识放进任务和里程碑里。",
  },
  {
    href: "/map",
    label: "查看知识地图",
    note: "看哪些领域正在增长，下一步补哪里。",
  },
] as const;

const homeQuickCtaClassName = "min-h-11 w-full sm:w-auto";
const homeCommonEntryCtaClassName = "min-h-11 w-full sm:w-auto shrink-0";
const homeSectionActionCtaClassName = "min-h-11 w-full sm:w-auto";

export default async function HomePage() {
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });
  const previewMode = await isPreviewMode();

  const now = new Date();
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const todayLocalDate = localDateInTimeZone({ date: now, timeZone });
  const todayStartUtc = utcStartOfLocalDay({ localDate: todayLocalDate, timeZone });
  const tomorrowStartUtc = addDaysUTC(todayStartUtc, 1);
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(userId);

  const [
    todayPlan,
    dueFlashcardsCount,
    completedPlansCount,
    completedDates,
  ] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId, localDate: todayLocalDate, isTest: false, archivedAt: null },
      include: { lesson: { select: { title: true, createdBy: true, connections: true } } },
    }),
    prisma.flashcard.count({
      where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
    }),
    prisma.dailyPlan.count({ where: { userId, status: "completed", isTest: false, archivedAt: null } }),
    prisma.dailyPlan.findMany({
      where: { userId, status: "completed", isTest: false, archivedAt: null },
      select: { localDate: true },
      orderBy: [{ localDate: "desc" }],
      take: 365,
    }),
  ]);

  const codeFeedbackNeedsAttentionWhere = {
    userId,
    overall: { in: ["partially_correct", "incorrect", "cannot_judge"] },
  };
  const [
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject,
    todayNoteCount,
    todayVoiceNoteCount,
    todayCodeSubmissionCount,
    todayProjectMilestoneCompletedCount,
    reviewLogsCount,
    correctQuizAttemptsCount,
    allCodeSubmissionsCount,
    resolvedMisconceptionsCount,
    allNotesCount,
    allVoiceNotesCount,
    thoughtReviewsCount,
    completedProjectsCount,
    glossaryCardsCount,
    radarCardsCount,
    completedProjectMilestonesCount,
  ] = await Promise.all([
    prisma.misconception.count({ where: { userId, status: "open" } }),
    prisma.misconception.findFirst({
      where: { userId, status: "open" },
      select: { summary: true, source: true, occurrenceCount: true },
      orderBy: [{ lastAttemptAt: "desc" }],
    }),
    prisma.codeFeedback.count({
      where: codeFeedbackNeedsAttentionWhere,
    }).catch(() => 0),
    prisma.codeFeedback.findFirst({
      where: codeFeedbackNeedsAttentionWhere,
      select: { summary: true, overall: true, localDate: true },
      orderBy: [{ updatedAt: "desc" }],
    }).catch(() => null),
    prisma.learningProject.findFirst({
      where: { userId, status: { not: "completed" } },
      include: { milestones: { orderBy: [{ position: "asc" }] } },
      orderBy: [{ updatedAt: "desc" }],
    }),
    todayPlan
      ? prisma.note.count({ where: { userId, lessonId: todayPlan.lessonId } })
      : Promise.resolve(0),
    todayPlan
      ? prisma.voiceNote.count({ where: { userId, lessonId: todayPlan.lessonId } })
      : Promise.resolve(0),
    todayPlan
      ? prisma.codeSubmission.count({
          where: {
            userId,
            lessonId: todayPlan.lessonId,
            localDate: todayLocalDate,
          },
        }).catch(() => 0)
      : Promise.resolve(0),
    prisma.projectMilestone.count({
      where: {
        userId,
        status: "completed",
        completedAt: { gte: todayStartUtc, lt: tomorrowStartUtc },
      },
    }).catch(() => 0),
    prisma.reviewLog.count({ where: { flashcard: reviewableFlashcardWhere } }),
    prisma.quizAttempt.count({
      where: {
        userId,
        isCorrect: true,
        question: {
          lesson: {
            dailyPlans: { some: { userId, isTest: false, archivedAt: null } },
          },
        },
      },
    }),
    prisma.codeSubmission.count({ where: { userId } }).catch(() => 0),
    prisma.misconception.count({ where: { userId, status: "resolved" } }),
    prisma.note.count({ where: { userId } }),
    prisma.voiceNote.count({ where: { userId } }),
    prisma.thoughtReview.count({ where: { userId } }),
    prisma.learningProject.count({ where: { userId, status: "completed" } }).catch(() => 0),
    prisma.flashcard.count({
      where: { userId, lessonId: null, tags: { array_contains: ["glossary"] } },
    }).catch(() => 0),
    prisma.flashcard.count({
      where: { userId, lessonId: null, tags: { array_contains: ["radar"] } },
    }).catch(() => 0),
    prisma.projectMilestone.count({ where: { userId, status: "completed" } }).catch(() => 0),
  ]);

  const completedSet = new Set(completedDates.map((d) => d.localDate));

  function prevLocalDate(d: string) {
    const [y, m, day] = d.split("-").map((x) => Number.parseInt(x, 10));
    const utc = new Date(Date.UTC(y!, (m ?? 1) - 1, day ?? 1, 0, 0, 0));
    utc.setUTCDate(utc.getUTCDate() - 1);
    const yy = String(utc.getUTCFullYear());
    const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(utc.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }

  let cursor = todayLocalDate;
  if (!completedSet.has(cursor)) cursor = prevLocalDate(cursor);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (!completedSet.has(cursor)) break;
    streak++;
    cursor = prevLocalDate(cursor);
  }

  const todayTitle = todayPlan?.lesson?.title ?? null;
  const todaySource = todayPlan?.source ?? todayPlan?.lesson?.createdBy ?? null;
  const isTodayCompleted = todayPlan?.status === "completed";
  const activeMilestone =
    activeProject?.milestones.find((milestone) => milestone.status !== "completed") ?? null;
  const activeProjectProgress = activeProject
    ? calculateProjectProgress(activeProject.milestones)
    : null;
  const [
    activeProjectReviewCards,
    activeProjectCodeFeedbackCards,
    todayKnowledgeCards,
  ] = await Promise.all([
    activeProject ? getProjectReviewCardSummary({ userId, projectId: activeProject.id }) : null,
    activeProject ? getProjectCodeFeedbackCardSummary({ userId, projectId: activeProject.id }) : null,
    todayPlan
      ? prisma.flashcard.findMany({
          where: {
            userId,
            lessonId: null,
            OR: [
              { tags: { array_contains: ["glossary"] } },
              { tags: { array_contains: ["radar"] } },
            ],
          },
          select: { id: true },
          take: 500,
        })
      : Promise.resolve([]),
  ]);
  const breadthChallenge = buildBreadthChallengeFromLessonConnections({
    userId,
    connections: todayPlan?.lesson.connections ?? null,
    generatedCardIds: new Set(todayKnowledgeCards.map((card) => card.id)),
  });
  const currentMissionInput = {
    todayPlanStatus: todayPlan?.status ?? null,
    dueFlashcardsCount,
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject: activeProject
      ? {
          id: activeProject.id,
          title: activeProject.title,
          activeMilestoneTitle: activeMilestone?.title ?? null,
        }
      : null,
    todayLessonId: todayPlan?.lessonId ?? null,
    todayNoteCount,
    todayVoiceNoteCount,
  };
  const currentMission = buildCurrentMission(currentMissionInput);
  const currentMissionSignals = buildCurrentMissionSignals(currentMissionInput);
  const currentMissionProgress = buildCurrentMissionProgress(currentMissionInput);
  const dailyQuests = buildDailyQuests({
    todayPlanStatus: todayPlan?.status ?? null,
    dueFlashcardsCount,
    todayNoteCount,
    todayVoiceNoteCount,
    todayCodeSubmissionCount,
    activeProjectMilestoneCompletedToday: todayProjectMilestoneCompletedCount > 0,
    breadthChallenge,
  });
  const completedDaysThisWeek = countCompletedDaysInLocalWeek({
    completedLocalDates: completedDates.map((item) => item.localDate),
    todayLocalDate,
  });
  const habitGoal = buildLearningHabitGoalFromQuests({
    completedDaysThisWeek,
    streakDays: streak,
    quests: dailyQuests,
  });
  const learningXp = calculateLearningXp({
    completedLessons: completedPlansCount,
    reviewedCards: reviewLogsCount,
    correctQuizAttempts: correctQuizAttemptsCount,
    codeSubmissions: allCodeSubmissionsCount,
    resolvedMisconceptions: resolvedMisconceptionsCount,
    notes: allNotesCount,
    voiceNotes: allVoiceNotesCount,
    completedProjectMilestones: completedProjectMilestonesCount,
  });
  const learningBadges = buildLearningBadges({
    streakDays: streak,
    codeSubmissions: allCodeSubmissionsCount,
    voiceNotes: allVoiceNotesCount,
    thoughtReviews: thoughtReviewsCount,
    resolvedMisconceptions: resolvedMisconceptionsCount,
    completedProjects: completedProjectsCount,
    glossaryCards: glossaryCardsCount,
    radarCards: radarCardsCount,
  });
  const learningMomentum = buildLearningMomentum({
    xp: learningXp,
    quests: dailyQuests,
    streakDays: streak,
    completedDaysThisWeek,
  });
  const remediationFocus = openMisconceptionFocus
    ? {
        label: "误区补弱",
        text: openMisconceptionFocus.summary,
        meta: buildHomeMistakeMeta(openMisconceptionFocus),
        tone: "danger" as const,
      }
    : codeFeedbackFocus
      ? {
          label: "代码补弱",
          text: codeFeedbackFocus.summary,
          meta: buildHomeCodeFeedbackMeta(codeFeedbackFocus),
          tone: "info" as const,
        }
      : null;

  return (
    <AppShell activePath="/" title="Roky Learn">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Roky Learn
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                每天先看当前任务，再进入今日学习、复习和表达理解。
              </p>
            </div>
            <CurrentMissionCard
              mission={currentMission}
              signals={currentMissionSignals}
              progress={currentMissionProgress}
              className="p-4 md:p-5"
            />
            <LearningMomentumStrip momentum={learningMomentum} />
            {remediationFocus ? (
              <div className="rounded-lg border bg-muted/20 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <LearningStatusBadge tone={remediationFocus.tone}>补弱焦点</LearningStatusBadge>
                  <span className="text-xs font-medium text-muted-foreground">{remediationFocus.label}</span>
                </div>
                <div className="mt-2 text-sm font-medium leading-relaxed">{remediationFocus.text}</div>
                {remediationFocus.meta ? (
                  <div className="mt-1 text-xs text-muted-foreground">{remediationFocus.meta}</div>
                ) : null}
              </div>
            ) : null}
          </div>

          <LearningSectionCard
            title="今日能量"
            description="把今天拆成少量明确动作。"
          >
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">到期</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{dueFlashcardsCount}</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">连续</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{streak}</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">课程</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{completedPlansCount}</div>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
              <Button asChild size="sm" className={homeQuickCtaClassName}>
                <Link href="/today">{isTodayCompleted ? "回到今日" : "开始今日"}</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className={homeQuickCtaClassName}>
                <Link href="/review">复习</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className={homeQuickCtaClassName}>
                <Link href="/voice">说出理解</Link>
              </Button>
            </div>
          </LearningSectionCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          <DailyQuestCard quests={dailyQuests} />
          <div className="grid gap-4">
            <LearningHabitGoalCard goal={habitGoal} />
            <XpLevelCard xp={learningXp} />
            <BadgeShelf badges={learningBadges.slice(0, 4)} />
          </div>
        </section>

        <LearningSectionCard
          title="今日学习"
          description="主课、复习和表达理解组成今天的闭环。"
          action={
            <Button asChild size="sm" className={homeSectionActionCtaClassName}>
              <Link href="/today">{isTodayCompleted ? "回到今日" : "继续今日学习"}</Link>
            </Button>
          }
        >
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <LearningStatusBadge tone={isTodayCompleted ? "success" : todayPlan ? "info" : "warning"}>
                {formatHomeDailyPlanStatusLabel(todayPlan?.status ?? null)}
              </LearningStatusBadge>
              <LearningStatusBadge tone="neutral">{todayLocalDate}</LearningStatusBadge>
              {todaySource ? <LearningStatusBadge tone="neutral">{todaySource}</LearningStatusBadge> : null}
            </div>
            <div className="text-xl font-semibold leading-snug">
              {todayTitle ?? "今天还没有生成学习内容"}
            </div>
            <div className="grid gap-2 lg:grid-cols-3">
              <LearningMissionCard
                title="完成今日学习"
                description="主课、引导步骤、代码练习和小测验"
                statusLabel={isTodayCompleted ? "已完成" : "待完成"}
                tone={isTodayCompleted ? "success" : "warning"}
                href="/today"
                actionLabel={isTodayCompleted ? "查看" : "继续"}
              />
              <LearningMissionCard
                title="清到期复习"
                description="先主动回忆，再看答案"
                statusLabel={dueFlashcardsCount > 0 ? `${dueFlashcardsCount} 张` : "已清空"}
                tone={dueFlashcardsCount > 0 ? "warning" : "success"}
                href="/review"
                actionLabel="复习"
              />
              <LearningMissionCard
                title="表达理解"
                description="写一句笔记或录一段语音"
                statusLabel={todayVoiceNoteCount > 0 ? `${todayVoiceNoteCount} 段` : "待表达"}
                tone={todayVoiceNoteCount > 0 ? "success" : "info"}
                href="/voice"
                actionLabel="语音"
              />
            </div>
          </div>
        </LearningSectionCard>

      <ProjectDailyRhythmCard
        project={
          activeProject && activeProjectProgress
            ? {
                id: activeProject.id,
                title: activeProject.title,
                typeLabel: PROJECT_TYPE_LABELS[normalizeProjectType(activeProject.type)],
                status: activeProject.status,
                percent: activeProjectProgress.percent,
                completedMilestones: activeProjectProgress.completed,
                totalMilestones: activeProjectProgress.total,
                activeMilestoneTitle: activeMilestone?.title ?? null,
                activeMilestoneTask: activeMilestone?.task ?? null,
                reviewDue: activeProjectReviewCards?.due ?? 0,
                codeDue: activeProjectCodeFeedbackCards?.due ?? 0,
              }
            : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <LearningSectionCard
          title="今日三件事"
          description="先完成今天最重要的三步。"
          action={
            <Button asChild size="sm" variant="secondary" className={homeSectionActionCtaClassName}>
              <Link href="/today">继续学习</Link>
            </Button>
          }
        >
          <div className="grid gap-2 text-sm">
            <LearningMissionCard
              title="完成今日学习"
              description="一步一步走完引导步骤与小测验"
              statusLabel={isTodayCompleted ? "已完成" : "待完成"}
              tone={isTodayCompleted ? "success" : "warning"}
              href="/today"
              actionLabel={isTodayCompleted ? "查看" : "继续"}
            />
            <LearningMissionCard
              title="清空到期复习"
              description="主动回忆，比直接看答案更有效"
              statusLabel={dueFlashcardsCount > 0 ? `剩余 ${dueFlashcardsCount}` : "已清空"}
              tone={dueFlashcardsCount > 0 ? "warning" : "success"}
              href="/review"
              actionLabel="复习"
            />
            <LearningMissionCard
              title="写下自己的理解"
              description="一句话也行，沉淀到笔记库"
              statusLabel={todayNoteCount > 0 ? `${todayNoteCount} 篇` : "待沉淀"}
              tone={todayNoteCount > 0 ? "success" : "info"}
              href="/notes"
              actionLabel="去写"
            />
          </div>
        </LearningSectionCard>

        <LearningSectionCard
          title="常用入口"
          description="从今天最常打开的动作开始。"
        >
          <div className="grid gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <div
                    key={action.href}
                    className="grid gap-3 rounded-lg border bg-card px-3 py-3 sm:flex sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-medium">{action.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{action.note}</div>
                    </div>
                    <Button asChild size="sm" variant="secondary" className={homeCommonEntryCtaClassName}>
                      <Link href={action.href}>打开</Link>
                    </Button>
                  </div>
            ))}
          </div>
        </LearningSectionCard>
      </div>

        <div className="text-xs text-muted-foreground">
          {previewMode
            ? "Preview Mode 使用 demo-user 只读数据；保存、生成、提交和管理操作会被拒绝。"
            : "学习数据按当前用户隔离；Demo 模式仅在开发或显式开启时使用 demo-user。"}
        </div>
      </div>
    </AppShell>
  );
}
