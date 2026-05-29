import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";
import { LearningMetricCard } from "@/components/learning/learning-metric-card";
import { LearningMissionCard } from "@/components/learning/learning-mission-card";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { buildNextBestAction } from "@/server/learning/next-best-action";
import { ProjectDailyRhythmCard } from "@/app/projects/ui/project-mission-workspace";
import {
  PROJECT_TYPE_LABELS,
  calculateProjectProgress,
  normalizeProjectType,
} from "@/server/projects/base";
import { getProjectCodeFeedbackCardSummary } from "@/server/projects/code-feedback-summary";
import { getProjectReviewCardSummary } from "@/server/projects/review-cards";

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

export default async function HomePage() {
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });

  const now = new Date();
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const todayLocalDate = localDateInTimeZone({ date: now, timeZone });
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(userId);

  const [
    todayPlan,
    dueFlashcardsCount,
    totalFlashcardsCount,
    completedPlansCount,
    totalPlansCount,
    completedDates,
  ] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId, localDate: todayLocalDate, isTest: false, archivedAt: null },
      include: { lesson: { select: { title: true, createdBy: true } } },
    }),
    prisma.flashcard.count({
      where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
    }),
    prisma.flashcard.count({ where: reviewableFlashcardWhere }),
    prisma.dailyPlan.count({ where: { userId, status: "completed", isTest: false, archivedAt: null } }),
    prisma.dailyPlan.count({ where: { userId, isTest: false, archivedAt: null } }),
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
  const [activeProjectReviewCards, activeProjectCodeFeedbackCards] = activeProject
    ? await Promise.all([
        getProjectReviewCardSummary({ userId, projectId: activeProject.id }),
        getProjectCodeFeedbackCardSummary({ userId, projectId: activeProject.id }),
      ])
    : [null, null];
  const nextBestAction = buildNextBestAction({
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
  });
  const remediationFocus = openMisconceptionFocus
    ? {
        label: "误区补弱",
        text: openMisconceptionFocus.summary,
        meta: `来源：${openMisconceptionFocus.source} · 出现 ${openMisconceptionFocus.occurrenceCount} 次`,
        tone: "danger" as const,
      }
    : codeFeedbackFocus
      ? {
          label: "代码补弱",
          text: codeFeedbackFocus.summary,
          meta: [
            codeFeedbackFocus.overall ? `状态：${codeFeedbackFocus.overall}` : null,
            codeFeedbackFocus.localDate ? `日期：${codeFeedbackFocus.localDate}` : null,
          ].filter(Boolean).join(" · "),
          tone: "info" as const,
        }
      : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Roky Learn</h1>
        <p className="text-sm text-muted-foreground">
          面向“广度探索 + 适度深入 + 长期积累”的每日引导式学习系统。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <LearningSectionCard
          title="今日学习"
          description="先完成今日内容，再去复习中心把到期卡片清空。"
          action={
            <Button asChild size="sm">
              <Link href="/today">{isTodayCompleted ? "回到今日" : "开始今日学习"}</Link>
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <LearningStatusBadge tone={isTodayCompleted ? "success" : todayPlan ? "info" : "warning"}>
                {todayPlan?.status ?? "未生成"}
              </LearningStatusBadge>
              <LearningStatusBadge tone="neutral">{todayLocalDate}</LearningStatusBadge>
              {todaySource ? <LearningStatusBadge tone="neutral">{todaySource}</LearningStatusBadge> : null}
            </div>
            <div className="text-lg font-semibold leading-snug">
              {todayTitle ?? "今天还没有生成学习内容"}
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">到期卡片</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{dueFlashcardsCount}</div>
                <div className="mt-1 text-xs text-muted-foreground">总卡片：{totalFlashcardsCount}</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">连续天数</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{streak}</div>
                <div className="mt-1 text-xs text-muted-foreground">按用户时区日期</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">已完成课程</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{completedPlansCount}</div>
                <div className="mt-1 text-xs text-muted-foreground">总计划：{totalPlansCount}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/review">去复习中心</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/notes">写今日笔记</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/coach">让 Coach 检查理解</Link>
              </Button>
            </div>
          </div>
        </LearningSectionCard>

        <div className="grid gap-4">
          <LearningMetricCard
            title="到期卡片"
            value={dueFlashcardsCount}
            subtitle={`总卡片：${totalFlashcardsCount}`}
          />
          <LearningMetricCard
            title="连续天数"
            value={streak}
            subtitle="按用户时区日期"
          />
          <LearningMetricCard
            title="已完成课程"
            value={completedPlansCount}
            subtitle={`总计划：${totalPlansCount}`}
          />
        </div>
      </div>

      <LearningSectionCard
        title="现在最值得做"
        description={nextBestAction.reason}
        action={
          <Button asChild size="sm">
            <Link href={nextBestAction.href}>{nextBestAction.ctaLabel}</Link>
          </Button>
        }
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <LearningStatusBadge tone={nextBestAction.tone}>Next Best Action</LearningStatusBadge>
              {openMisconceptionCount > 0 ? (
                <LearningStatusBadge tone="danger">误区 {openMisconceptionCount}</LearningStatusBadge>
              ) : null}
              {activeProject ? (
                <LearningStatusBadge tone="info">项目 {activeProject.title}</LearningStatusBadge>
              ) : null}
            </div>
            <div className="mt-2 text-lg font-semibold leading-snug">{nextBestAction.title}</div>
          </div>
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border bg-muted/20 px-3 py-2">今日笔记：{todayNoteCount}</div>
            <div className="rounded-md border bg-muted/20 px-3 py-2">语音表达：{todayVoiceNoteCount}</div>
            <div className="rounded-md border bg-muted/20 px-3 py-2">误区：{openMisconceptionCount}</div>
            <div className="rounded-md border bg-muted/20 px-3 py-2">代码反馈：{codeFeedbackNeedsAttentionCount}</div>
          </div>
        </div>
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
            <Button asChild size="sm" variant="secondary">
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
                className="flex items-start justify-between gap-3 rounded-lg border bg-card px-3 py-3"
              >
                <div className="min-w-0">
                  <div className="font-medium">{action.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{action.note}</div>
                </div>
                <Button asChild size="sm" variant="secondary" className="shrink-0">
                  <Link href={action.href}>打开</Link>
                </Button>
              </div>
            ))}
          </div>
        </LearningSectionCard>
      </div>

      <div className="text-xs text-muted-foreground">
        说明：学习数据按当前用户隔离；Demo 模式仅在开发或显式开启时使用 demo-user。
      </div>
    </div>
  );
}
