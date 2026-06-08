import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromptStudioCard } from "@/app/admin/ui/prompt-studio-card";
import { requireUserId } from "@/server/auth/user";
import {
  buildAdminPlanFilterWhere,
  normalizeAdminPlanFilter,
  type AdminPlanFilter,
} from "@/server/admin/plan-governance";
import { buildAdminPlanAuditChain } from "@/server/admin/plan-audit";
import { buildAdminPlanAuditExceptions } from "@/server/admin/plan-audit-exceptions";
import {
  summarizeDuplicateDailyPlanTopics,
  summarizeFlashcardQuality,
  summarizeKnowledgeVerificationQueue,
} from "@/server/admin/content-review";
import { buildAdminPromptStudioSummary } from "@/server/admin/prompt-studio";
import { buildAdminPlannerJobSummary } from "@/server/admin/planner-visibility";
import { summarizeDailyGenerationQualityJobs } from "@/server/ai/daily-generation-quality";
import { formatHomeDailyPlanStatusLabel, formatTodayPlanSourceLabel } from "@/app/_lib/home-labels";
import { explainCurriculumDecision } from "@/server/curriculum/explain-decision";
import {
  extractCurriculumSignalSnapshot,
  summarizeCurriculumSignalSnapshot,
} from "@/server/curriculum/signal-snapshot";
import { prisma } from "@/server/db";
import { localDateInTimeZone, utcStartOfLocalDay } from "@/server/time/day";
import { env } from "@/lib/env";
import {
  adminLoginAction,
  adminLogoutAction,
  ensureProfileAction,
  seedAction,
  generateTodayPlanAction,
  completeTodayPlanAction,
  loopCheckAction,
  generatePlanForLocalDateAction,
  regeneratePlanForLocalDateAction,
  loopCheckForLocalDateAction,
  archiveTestPlansAction,
  archiveFuturePlannedPlansAction,
  regenerateTodayAction,
  markPlanActiveAction,
  markPlanArchivedAction,
  retryFailedDailyCronJobAction,
  runDailyCronAction,
} from "@/app/admin/actions";
import { verifyAdminToken, getAdminCookieName, isAdminProtectionEnabled } from "@/server/admin/auth";
import { isPreviewMode } from "@/server/auth/preview";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const adminKnowledgeVerificationLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2";
const adminRecentPlanLinkClassName = "inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2";
const adminRecentPlanGovernanceCtaClassName = "min-h-11 w-full sm:w-auto";
const adminRecentPlanActionRowClassName = "flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end";
const adminPlanFilterCtaClassName = "min-h-11 px-3";
const adminPlanAuditCloseCtaClassName = "min-h-11 px-3";
const adminPlanAuditLessonLinkClassName = "mt-1 inline-flex min-h-11 items-center text-primary underline underline-offset-2";
const adminAuditExceptionLinkClassName = "min-h-11 px-3 shrink-0";
const adminAuthInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none";
const adminAuthCtaClassName = "min-h-11 w-full sm:w-auto";
const adminFormInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none";
const adminTodayLoopCtaClassName = "min-h-11 w-full sm:w-auto";
const adminFailedJobRetryCtaClassName = "min-h-11 w-full sm:w-auto";

function planFilterHref(filter: AdminPlanFilter) {
  return `/admin?planFilter=${filter}`;
}

function planAuditHref(planId: string, filter: AdminPlanFilter) {
  return `/admin?planFilter=${filter}&auditPlanId=${encodeURIComponent(planId)}`;
}

function adminPlanFilterLabel(filter: AdminPlanFilter) {
  if (filter === "active") return "正式";
  if (filter === "test") return "测试";
  if (filter === "archived") return "已归档";
  return "全部";
}

function adminPlanKindLabel(isTest: boolean) {
  return isTest ? "测试计划" : "正式计划";
}

function adminPlanActivationLabel(status: string) {
  if (status === "success") return "成功";
  if (status === "failed") return "失败";
  return status;
}

function adminSchemaVersionLabel(schemaVersion: string | null | undefined) {
  return `Schema 版本：${schemaVersion ?? "未标记"}`;
}

function adminAuditCheckStatusLabel(status: string) {
  if (status === "pass") return "通过";
  if (status === "warn") return "警告";
  if (status === "fail") return "失败";
  return status;
}

function adminAuditSeverityLabel(severity: string) {
  if (severity === "fail") return "失败";
  if (severity === "warn") return "警告";
  return severity;
}

function adminJobStatusLabel(status: string) {
  if (status === "success") return "成功";
  if (status === "succeeded") return "成功";
  if (status === "completed") return "完成";
  if (status === "failed") return "失败";
  if (status === "error") return "错误";
  if (status === "running") return "运行中";
  if (status === "pending") return "等待中";
  return status;
}

function firstQueryString(value: string | string[] | undefined) {
  const item = Array.isArray(value) ? value[0] : value;
  return typeof item === "string" && item.trim() ? item.trim() : null;
}

function jsonObjectValue(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = (value as Record<string, unknown>)[key];
  return typeof item === "string" ? item : null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userId = await requireUserId();
  if (await isPreviewMode()) {
    notFound();
  }

  const query = searchParams ? await searchParams : {};
  const planFilter = normalizeAdminPlanFilter(query.planFilter);
  const auditPlanId = firstQueryString(query.auditPlanId);
  const recentPlanWhere = buildAdminPlanFilterWhere({ userId, filter: planFilter });

  // Never allow /admin to be open-by-default in production.
  // If ADMIN_SECRET isn't configured, treat the route as not existing.
  if (process.env.NODE_ENV === "production" && !env.ADMIN_SECRET) {
    notFound();
  }

  const protectionEnabled = isAdminProtectionEnabled();
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(getAdminCookieName())?.value ?? null;
  const authed = protectionEnabled ? verifyAdminToken(adminToken) : true;

  // If admin protection is enabled and the user is not authenticated, only show a minimal login UI.
  // Avoid leaking DB contents or internal IDs.
  if (protectionEnabled && !authed) {
    return (
      <AppShell activePath="/admin" title="管理 / 调试">
        <PageHeader
          title="管理 / 调试（需要登录）"
          subtitle="此页面仅供开发/运维使用"
          badge="开发运维"
        />

        <div className="mx-auto mt-8 max-w-md">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">管理员登录</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="text-muted-foreground">
                请输入 <span className="font-mono">ADMIN_SECRET</span>（不会落库，仅写入 httpOnly cookie）。
              </div>
              <form action={adminLoginAction} className="grid gap-2">
                <input
                  name="secret"
                  type="password"
                  className={adminAuthInputClassName}
                  placeholder="ADMIN_SECRET"
                />
                <Button type="submit" size="sm" className={adminAuthCtaClassName}>
                  登录
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const now = new Date();
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: now, timeZone });
  const todayUtc = utcStartOfLocalDay({ localDate, timeZone });

  function nextLocalDate(d: string) {
    const [y, m, day] = d.split("-").map((x) => Number.parseInt(x, 10));
    const utc = new Date(Date.UTC(y!, (m ?? 1) - 1, day ?? 1, 0, 0, 0));
    utc.setUTCDate(utc.getUTCDate() + 1);
    const yy = String(utc.getUTCFullYear());
    const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(utc.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }
  const tomorrowLocalDate = nextLocalDate(localDate);

  const plan = await prisma.dailyPlan.findFirst({
    where: { userId, localDate, isTest: false, archivedAt: null },
    include: { lesson: { select: { id: true, title: true } } },
  });

  const [
    userProfileCount,
    dailyPlanCount,
    activeOfficialPlanCount,
    activeTestPlanCount,
    archivedPlanCount,
    lessonCount,
    flashcardCount,
    dueFlashcardCount,
    reviewLogCount,
    noteCount,
    planStatusGroups,
    planSourceGroups,
    planSchemaGroups,
    recentPlans,
    recentPlanActivations,
    recentFlashcards,
    recentJobs,
    promptStudioJobs,
    promptStudioPlans,
    recentCronJobs,
    recentDecisionLogs,
    plansForDuplicateTopicReview,
    flashcardsForQualityReview,
    glossaryTermsForVerification,
    radarEntitiesForVerification,
  ] = await Promise.all([
    prisma.userProfile.count({ where: { userId } }),
    prisma.dailyPlan.count({ where: { userId } }),
    prisma.dailyPlan.count({ where: { userId, isTest: false, archivedAt: null } }),
    prisma.dailyPlan.count({ where: { userId, isTest: true, archivedAt: null } }),
    prisma.dailyPlan.count({ where: { userId, archivedAt: { not: null } } }),
    prisma.lesson.count({}),
    prisma.flashcard.count({ where: { userId } }),
    prisma.flashcard.count({ where: { userId, dueAt: { lte: now } } }),
    prisma.reviewLog.count({ where: { flashcard: { userId } } }),
    prisma.note.count({ where: { userId } }),
    prisma.dailyPlan.groupBy({
      by: ["status"],
      where: { userId, isTest: false, archivedAt: null },
      _count: { _all: true },
      orderBy: [{ status: "asc" }],
    }),
    prisma.dailyPlan.groupBy({
      by: ["source"],
      where: { userId, isTest: false, archivedAt: null },
      _count: { _all: true },
      orderBy: [{ source: "asc" }],
    }),
    prisma.dailyPlan.groupBy({
      by: ["schemaVersion"],
      where: { userId, isTest: false, archivedAt: null },
      _count: { _all: true },
      orderBy: [{ schemaVersion: "asc" }],
    }),
    prisma.dailyPlan.findMany({
      where: recentPlanWhere,
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: {
        id: true,
        date: true,
        localDate: true,
        status: true,
        lessonId: true,
        source: true,
        schemaVersion: true,
        isTest: true,
        archivedAt: true,
        selectedTopic: true,
        selectedDomain: true,
        generationJobId: true,
        lesson: { select: { title: true } },
      },
    }),
    prisma.aiGenerationJob.findMany({
      where: { userId, type: "admin_plan_activation" },
      orderBy: [{ createdAt: "desc" }],
      take: 30,
      select: { id: true, createdAt: true, input: true, output: true, status: true },
    }),
    prisma.flashcard.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      select: { id: true, front: true, dueAt: true, reviewCount: true, lessonId: true },
    }),
    prisma.aiGenerationJob.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      select: { id: true, type: true, status: true, createdAt: true, error: true, model: true, input: true, output: true },
    }),
    prisma.aiGenerationJob.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 30,
      select: { id: true, type: true, status: true, createdAt: true, error: true, model: true, input: true, output: true },
    }),
    prisma.dailyPlan.findMany({
      where: { userId },
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      take: 30,
      select: {
        id: true,
        localDate: true,
        status: true,
        source: true,
        schemaVersion: true,
        isTest: true,
        archivedAt: true,
      },
    }),
    prisma.aiGenerationJob.findMany({
      where: { userId, type: "cron_daily_plan" },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      select: { id: true, type: true, status: true, createdAt: true, error: true, model: true, output: true },
    }),
    prisma.curriculumDecisionLog.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      select: {
        id: true,
        localDate: true,
        isTest: true,
        domain: true,
        topic: true,
        reason: true,
        scoreBreakdown: true,
        inputSnapshot: true,
        createdAt: true,
      },
    }),
    prisma.dailyPlan.findMany({
      where: { userId },
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      take: 120,
      select: {
        id: true,
        localDate: true,
        selectedDomain: true,
        selectedTopic: true,
        status: true,
        source: true,
        isTest: true,
        archivedAt: true,
        lesson: { select: { title: true } },
      },
    }),
    prisma.flashcard.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      take: 300,
      select: {
        id: true,
        front: true,
        back: true,
        tags: true,
        reviewCount: true,
        type: true,
        lessonId: true,
        createdAt: true,
      },
    }),
    prisma.glossaryTerm.findMany({
      orderBy: [{ updatedAt: "desc" }],
      take: 300,
      select: {
        id: true,
        slug: true,
        fullName: true,
        category: true,
        sourceRefs: true,
        updatedAt: true,
      },
    }),
    prisma.knowledgeEntity.findMany({
      orderBy: [{ lastVerifiedAt: "asc" }, { updatedAt: "desc" }],
      take: 300,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        confidence: true,
        sourceRefs: true,
        lastVerifiedAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const vercelEnv = process.env.VERCEL_ENV ?? null;
  const nodeEnv = process.env.NODE_ENV ?? null;
  const hasAdminSecret = Boolean(env.ADMIN_SECRET);

  // Show a few useful derived counters for the loop:
  const todayLessonId = plan?.lessonId ?? null;
  const todayFlashcardsCount = todayLessonId
    ? await prisma.flashcard.count({ where: { userId, lessonId: todayLessonId } })
    : 0;
  const activationHistoryByPlanId = new Map(
    recentPlans.map((p) => [
      p.id,
      recentPlanActivations.filter((a) => jsonObjectValue(a.input, "planId") === p.id),
    ]),
  );
  const recentDecisionExplanations = recentDecisionLogs.map((d) => ({
    ...d,
    explanation: explainCurriculumDecision({
      domain: d.domain,
      topic: d.topic,
      reason: d.reason,
      scoreBreakdown: d.scoreBreakdown,
    }),
    signalSummary: summarizeCurriculumSignalSnapshot(
      extractCurriculumSignalSnapshot(d.inputSnapshot),
      d.domain,
    ),
  }));
  const recentJobSummaries = recentJobs.map((job) => ({
    ...job,
    plannerSummary: buildAdminPlannerJobSummary(job.input),
  }));
  const promptStudioSummary = buildAdminPromptStudioSummary({
    jobs: promptStudioJobs,
    plans: promptStudioPlans,
  });
  const contentQualitySummary = summarizeDailyGenerationQualityJobs(recentJobs);
  const duplicateTopicSummary = summarizeDuplicateDailyPlanTopics(
    plansForDuplicateTopicReview.map((plan) => ({
      id: plan.id,
      localDate: plan.localDate,
      selectedDomain: plan.selectedDomain,
      selectedTopic: plan.selectedTopic,
      lessonTitle: plan.lesson.title,
      status: plan.status,
      source: plan.source,
      isTest: plan.isTest,
      archivedAt: plan.archivedAt,
    })),
  );
  const flashcardQualitySummary = summarizeFlashcardQuality(flashcardsForQualityReview);
  const knowledgeVerificationSummary = summarizeKnowledgeVerificationQueue({
    now,
    glossaryTerms: glossaryTermsForVerification,
    radarEntities: radarEntitiesForVerification,
  });
  const planAuditExceptions = await buildAdminPlanAuditExceptions({
    userId,
    filter: planFilter,
    take: 10,
  });
  const planAudit = auditPlanId
    ? await buildAdminPlanAuditChain({ userId, planId: auditPlanId })
        .then((chain) => ({ chain, error: null as string | null }))
        .catch((error: unknown) => ({
          chain: null,
          error: error instanceof Error ? error.message : String(error),
        }))
    : null;

  return (
    <AppShell activePath="/admin" title="管理 / 调试">
      <PageHeader
        title="管理 / 调试（开发期）"
        subtitle="用于验证闭环、快速查看 DB 状态、执行初始化与一键闭环检查"
        badge="开发运维"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">环境</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>userId: <span className="font-mono">{userId}</span></div>
            <div>NODE_ENV: <span className="font-mono">{nodeEnv ?? "-"}</span></div>
            <div>VERCEL_ENV: <span className="font-mono">{vercelEnv ?? "-"}</span></div>
            <div>now(UTC): <span className="font-mono">{now.toISOString()}</span></div>
            <div>timeZone: <span className="font-mono">{timeZone}</span></div>
            <div>localDate: <span className="font-mono">{localDate}</span></div>
            <div>local day start(UTC): <span className="font-mono">{todayUtc.toISOString()}</span></div>
            <div>ADMIN_SECRET: <span className="font-mono">{hasAdminSecret ? "set" : "unset"}</span></div>
            <div>Admin 认证：<span className="font-mono">{authed ? "已登录" : "需要登录"}</span></div>
            {protectionEnabled && !authed ? (
              <form action={adminLoginAction} className="mt-2 grid gap-2">
                <input
                  name="secret"
                  type="password"
                  className={adminAuthInputClassName}
                  placeholder="输入 ADMIN_SECRET（不会落库）"
                />
                <Button type="submit" size="sm" className={adminAuthCtaClassName}>登录（写入 httpOnly cookie）</Button>
              </form>
            ) : null}
            {protectionEnabled && authed ? (
              <form action={adminLogoutAction} className="mt-2">
                <Button type="submit" size="sm" variant="secondary" className={adminAuthCtaClassName}>退出 admin</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">数据概览（当前用户）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>用户档案: <span className="font-mono">{userProfileCount}</span></div>
            <div>每日计划: <span className="font-mono">{dailyPlanCount}</span></div>
            <div>正式计划: <span className="font-mono">{activeOfficialPlanCount}</span></div>
            <div>测试计划: <span className="font-mono">{activeTestPlanCount}</span></div>
            <div>已归档计划: <span className="font-mono">{archivedPlanCount}</span></div>
            <div>复习卡片: <span className="font-mono">{flashcardCount}</span></div>
            <div>到期复习卡片: <span className="font-mono">{dueFlashcardCount}</span></div>
            <div>复习记录: <span className="font-mono">{reviewLogCount}</span></div>
            <div>笔记: <span className="font-mono">{noteCount}</span></div>
            <div className="mt-2 grid gap-1 rounded-md border bg-muted/30 p-2 text-xs">
              <div className="font-medium text-foreground">正式计划状态</div>
              {planStatusGroups.length ? (
                planStatusGroups.map((g) => (
                  <div key={g.status} className="flex justify-between gap-3">
                    <span>{formatHomeDailyPlanStatusLabel(g.status)}</span>
                    <span className="font-mono">{g._count._all}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">暂无正式计划状态</div>
              )}
            </div>
            <div className="grid gap-1 rounded-md border bg-muted/30 p-2 text-xs">
              <div className="font-medium text-foreground">来源 / Schema 版本</div>
              {planSourceGroups.map((g) => (
                <div key={g.source ?? "null"} className="flex justify-between gap-3">
                  <span>{formatTodayPlanSourceLabel(g.source)}</span>
                  <span className="font-mono">{g._count._all}</span>
                </div>
              ))}
              {planSchemaGroups.map((g) => (
                <div key={g.schemaVersion ?? "null"} className="flex justify-between gap-3">
                  <span>Schema 版本：{g.schemaVersion ?? "未标记"}</span>
                  <span className="font-mono">{g._count._all}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              全局课程总数：{lessonCount}
            </div>
          </CardContent>
        </Card>

        <PromptStudioCard
          summary={promptStudioSummary}
          defaultLocalDate={tomorrowLocalDate}
          authed={authed}
          regenerateAction={regeneratePlanForLocalDateAction}
        />

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">今日闭环</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>今日计划: <span className="font-mono">{formatHomeDailyPlanStatusLabel(plan?.status)}</span></div>
            <div>今日课程: <span className="font-mono">{plan?.lesson?.title ?? "-"}</span></div>
            <div>今日卡片数: <span className="font-mono">{todayFlashcardsCount}</span></div>

            <div className="mt-2 grid gap-2">
              <form action={ensureProfileAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  确保用户档案
                </Button>
              </form>
              <form action={seedAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  初始化领域/主题
                </Button>
              </form>
              <form action={generateTodayPlanAction}>
                <Button type="submit" size="sm" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  生成今日计划
                </Button>
              </form>
              <form action={completeTodayPlanAction} className="grid gap-2">
                <input type="hidden" name="date" value={todayUtc.toISOString()} />
                <input
                  name="reflection"
                  className={adminFormInputClassName}
                  placeholder="今日反思（可选）"
                />
                <Button type="submit" size="sm" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  完成今日计划并生成卡片
                </Button>
              </form>
              <form action={loopCheckAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  一键闭环检查（生成 → 完成 → 验证）
                </Button>
              </form>
              <form action={runDailyCronAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  运行每日定时任务
                </Button>
              </form>
              <form action={regenerateTodayAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  重建今日计划
                </Button>
              </form>
              <form action={archiveTestPlansAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  归档所有测试计划
                </Button>
              </form>
              <form action={archiveFuturePlannedPlansAction}>
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  归档未来待完成计划
                </Button>
              </form>

              <div className="mt-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                用于验证新 schema（例如 Sprint 2.3）是否真的进入 DB：可以生成“明天”的计划，
                避免被“今日计划已存在”卡住。
              </div>

              <form action={generatePlanForLocalDateAction} className="grid gap-2">
                <input
                  name="localDate"
                  className={adminFormInputClassName}
                  defaultValue={tomorrowLocalDate}
                  placeholder="YYYY-MM-DD"
                />
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  生成指定日期计划（localDate）
                </Button>
              </form>

              <form action={loopCheckForLocalDateAction} className="grid gap-2">
                <input
                  name="localDate"
                  className={adminFormInputClassName}
                  defaultValue={tomorrowLocalDate}
                  placeholder="YYYY-MM-DD"
                />
                <Button type="submit" size="sm" variant="secondary" className={adminTodayLoopCtaClassName} disabled={!authed}>
                  指定日期闭环检查（生成 → 完成 → 验证）
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">重复主题检测</CardTitle>
              <Badge
                variant={duplicateTopicSummary.duplicateTopicCount ? "destructive" : "secondary"}
              >
                {duplicateTopicSummary.duplicateTopicCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                扫描计划：<span className="font-mono">{duplicateTopicSummary.scannedCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                重复主题：<span className="font-mono">{duplicateTopicSummary.duplicateTopicCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                受影响计划：<span className="font-mono">{duplicateTopicSummary.repeatedPlanCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                只读检查：<span className="font-mono">no write</span>
              </div>
            </div>

            {duplicateTopicSummary.reviewItems.length ? (
              <div className="grid gap-2">
                {duplicateTopicSummary.reviewItems.slice(0, 4).map((item) => (
                  <div key={item.topicKey} className="rounded-md border px-3 py-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">{item.topicLabel}</div>
                      <Badge variant="outline">{item.count} 次</Badge>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {item.domain ?? "未分领域"} / {item.dateRange}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.reasons.map((reason) => (
                        <Badge key={reason} variant="outline">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 grid gap-1 text-muted-foreground">
                      {item.plans.slice(0, 3).map((planItem) => (
                        <div key={planItem.id} className="flex flex-wrap justify-between gap-2">
                          <span>{planItem.localDate} / {planItem.lessonTitle}</span>
                          <span className="font-mono">
                            {formatHomeDailyPlanStatusLabel(planItem.status)} / {formatTodayPlanSourceLabel(planItem.source)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                最近计划暂无重复主题。
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">内容质量摘要</CardTitle>
              <Badge
                variant={
                  contentQualitySummary.lowScoreCount || contentQualitySummary.failedCount
                    ? "destructive"
                    : "secondary"
                }
              >
                {contentQualitySummary.averageScore || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                扫描任务：<span className="font-mono">{contentQualitySummary.scannedCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                质量快照：<span className="font-mono">{contentQualitySummary.snapshotCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                低分内容：<span className="font-mono">{contentQualitySummary.lowScoreCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                失败任务：<span className="font-mono">{contentQualitySummary.failedCount}</span>
              </div>
            </div>

            {contentQualitySummary.topWarnings.length ? (
              <div className="flex flex-wrap gap-1">
                {contentQualitySummary.topWarnings.map((warning) => (
                  <Badge key={warning} variant="outline">
                    {warning}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                最近生成内容暂无质量警告。
              </div>
            )}

            {contentQualitySummary.attentionItems.length ? (
              <div className="grid gap-2">
                {contentQualitySummary.attentionItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-md border px-3 py-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono">{item.id}</span>
                      <Badge variant={item.score === null || item.score < 70 ? "destructive" : "outline"}>
                        {item.score === null ? item.status : item.score}
                      </Badge>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {item.type} / {item.createdAt.toISOString()}
                    </div>
                    {item.error ? (
                      <div className="mt-1 text-destructive">{item.error}</div>
                    ) : null}
                    {item.warnings.length ? (
                      <div className="mt-1 text-muted-foreground">
                        {item.warnings.slice(0, 3).join(" / ")}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">卡片质量审查</CardTitle>
              <Badge
                variant={flashcardQualitySummary.reviewItems.length ? "destructive" : "secondary"}
              >
                {flashcardQualitySummary.reviewItems.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                扫描卡片：<span className="font-mono">{flashcardQualitySummary.scannedCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                重复 front：<span className="font-mono">{flashcardQualitySummary.duplicateFrontCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                过长卡片：<span className="font-mono">{flashcardQualitySummary.longCardCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                答案过短：<span className="font-mono">{flashcardQualitySummary.shortAnswerCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                缺少 tags：<span className="font-mono">{flashcardQualitySummary.missingTagsCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                从未复习：<span className="font-mono">{flashcardQualitySummary.unreviewedCount}</span>
              </div>
            </div>

            {flashcardQualitySummary.reviewItems.length ? (
              <div className="grid gap-2">
                {flashcardQualitySummary.reviewItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-md border px-3 py-2 text-xs">
                    <div className="line-clamp-2 font-medium">{item.front}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.reasons.map((reason) => (
                        <Badge key={reason} variant="outline">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {item.type} / review {item.reviewCount} / {item.lessonId ?? "standalone"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                最近卡片暂无明显质量审查项。
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">来源核验队列</CardTitle>
              <Badge
                variant={knowledgeVerificationSummary.reviewItems.length ? "destructive" : "secondary"}
              >
                {knowledgeVerificationSummary.reviewItems.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                Glossary 缺来源：
                <span className="font-mono">{knowledgeVerificationSummary.glossaryMissingSourceCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                Radar 缺来源：
                <span className="font-mono">{knowledgeVerificationSummary.radarMissingSourceCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                Radar 过期：
                <span className="font-mono">{knowledgeVerificationSummary.radarStaleVerificationCount}</span>
              </div>
              <div className="rounded-md border bg-muted/30 px-3 py-2">
                低置信度：
                <span className="font-mono">{knowledgeVerificationSummary.radarLowConfidenceCount}</span>
              </div>
            </div>

            {knowledgeVerificationSummary.reviewItems.length ? (
              <div className="grid gap-2">
                {knowledgeVerificationSummary.reviewItems.slice(0, 4).map((item) => (
                  <div key={`${item.kind}:${item.id}`} className="rounded-md border px-3 py-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a className={adminKnowledgeVerificationLinkClassName} href={item.href}>
                        {item.title}
                      </a>
                      <Badge variant="outline">{item.kind}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.reasons.map((reason) => (
                        <Badge key={reason} variant="outline">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {item.category} / {item.slug}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                Glossary / Radar 暂无来源核验项。
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {planAudit ? (
        <div className="mt-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">单条计划审计链路</CardTitle>
                <Button asChild size="xs" variant="secondary" className={adminPlanAuditCloseCtaClassName}>
                  <a href={planFilterHref(planFilter)}>关闭审计</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {planAudit.error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
                  {planAudit.error}
                </div>
              ) : planAudit.chain ? (
                <>
                  <div className="grid gap-2 rounded-md border bg-muted/30 p-3 text-xs md:grid-cols-3">
                    <div>
                      <div className="font-medium text-foreground">每日计划</div>
                      <div className="mt-1 font-mono">{planAudit.chain.plan.id}</div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.plan.localDate} / {formatHomeDailyPlanStatusLabel(planAudit.chain.plan.status)} /
                        {" "}{formatTodayPlanSourceLabel(planAudit.chain.plan.source)} / {adminSchemaVersionLabel(planAudit.chain.plan.schemaVersion)}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {adminPlanKindLabel(planAudit.chain.plan.isTest)}
                        {planAudit.chain.plan.archivedAt ? " / 已归档" : ""}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">课程</div>
                      <div className="mt-1">{planAudit.chain.plan.lessonTitle}</div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.plan.domainSlug} / {planAudit.chain.plan.topicSlug}
                      </div>
                      <a
                        className={adminPlanAuditLessonLinkClassName}
                        href={`/library?lessonId=${encodeURIComponent(planAudit.chain.plan.lessonId)}`}
                      >
                        查看课程
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">生成任务</div>
                      <div className="mt-1 font-mono">
                        {planAudit.chain.generationJob?.id ?? planAudit.chain.plan.generationJobId ?? "-"}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.generationJob
                          ? `${planAudit.chain.generationJob.type} / ${adminJobStatusLabel(planAudit.chain.generationJob.status)}`
                          : "暂无关联生成任务"}
                        {planAudit.chain.generationJob?.model ? ` / ${planAudit.chain.generationJob.model}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-md border bg-muted/20 p-3 text-xs">
                    <div className="font-medium text-foreground">一致性检查</div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {planAudit.chain.checks.map((check) => (
                        <div key={check.key} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-background/60 px-2 py-1.5">
                          <div>
                            <div className="font-medium">{check.label}</div>
                            <div className="text-muted-foreground">{check.detail}</div>
                          </div>
                          <Badge
                            variant={
                              check.status === "pass"
                                ? "secondary"
                                : check.status === "warn"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {adminAuditCheckStatusLabel(check.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md border bg-muted/20 p-3 text-xs">
                      <div className="font-medium text-foreground">选题决策记录</div>
                      {planAudit.chain.decisionLog ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div className="font-mono">{planAudit.chain.decisionLog.id}</div>
                          <div>{planAudit.chain.decisionLog.domain} / {planAudit.chain.decisionLog.topic}</div>
                          <div>{planAudit.chain.decisionLog.reason}</div>
                          <details className="mt-2">
                            <summary className="cursor-pointer">查看输入快照 / 分数明细</summary>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.decisionLog.inputSnapshot ?? {}, null, 2)}</code>
                            </pre>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.decisionLog.scoreBreakdown ?? {}, null, 2)}</code>
                            </pre>
                          </details>
                        </div>
                      ) : (
                        <div className="mt-2 text-muted-foreground">暂无匹配的选题决策记录</div>
                      )}
                    </div>

                    <div className="rounded-md border bg-muted/20 p-3 text-xs">
                      <div className="font-medium text-foreground">选题输入摘要</div>
                      {planAudit.chain.plannerSummary ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div>
                            {planAudit.chain.plannerSummary.selectedDomain} / {planAudit.chain.plannerSummary.selectedTopic}
                          </div>
                          <div>{planAudit.chain.plannerSummary.mainReason}</div>
                          <div>
                            {adminSchemaVersionLabel(planAudit.chain.plannerSummary.schemaVersion)} /
                            {" "}{planAudit.chain.plannerSummary.difficulty ?? "-"} /
                            {" "}{planAudit.chain.plannerSummary.estimatedMinutes ?? "-"} min
                          </div>
                          {planAudit.chain.plannerSummary.activeSignals.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {planAudit.chain.plannerSummary.activeSignals.slice(0, 5).map((signal) => (
                                <Badge key={signal.key} variant="outline">
                                  {signal.label} {Math.round(signal.value * 100)}%
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                          <details className="mt-2">
                            <summary className="cursor-pointer">查看生成输入 / 输出</summary>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.generationJob?.input ?? {}, null, 2)}</code>
                            </pre>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.generationJob?.output ?? {}, null, 2)}</code>
                            </pre>
                          </details>
                        </div>
                      ) : (
                        <div className="mt-2 text-muted-foreground">暂无选题输入摘要</div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">计划审计异常</CardTitle>
              <Badge
                variant={planAuditExceptions.failCount ? "destructive" : "secondary"}
              >
                {planAuditExceptions.failCount
                  ? `${planAuditExceptions.failCount} 项失败`
                  : "正常"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              扫描最近 <span className="font-mono">{planAuditExceptions.scannedCount}</span> 条
              <span className="font-mono"> {planFilter}</span> 计划；
              异常计划 <span className="font-mono">{planAuditExceptions.plansWithExceptionsCount}</span> 条；
              失败 <span className="font-mono">{planAuditExceptions.failCount}</span>；
              警告 <span className="font-mono">{planAuditExceptions.warnCount}</span>。
            </div>

            {planAuditExceptions.items.length ? (
              planAuditExceptions.items.map((item) => (
                <div key={`${item.planId}-${item.kind}`} className="rounded-md border px-3 py-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant={item.severity === "fail" ? "destructive" : "outline"}>
                          {adminAuditSeverityLabel(item.severity)}
                        </Badge>
                        <Badge variant="secondary">{item.kind}</Badge>
                        {item.isTest ? <Badge variant="outline">{adminPlanKindLabel(item.isTest)}</Badge> : null}
                        {item.archivedAt ? <Badge variant="outline">已归档</Badge> : null}
                      </div>
                      <div className="mt-1 font-medium">{item.lessonTitle}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.localDate} / {formatHomeDailyPlanStatusLabel(item.status)} / {formatTodayPlanSourceLabel(item.source)} /
                        {adminSchemaVersionLabel(item.schemaVersion)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.label}: {item.detail}
                      </div>
                    </div>
                    <Button asChild size="xs" variant="secondary" className={adminAuditExceptionLinkClassName}>
                      <a href={planAuditHref(item.planId, planFilter)}>审计链路</a>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                最近计划未发现审计异常。
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">最近每日计划（10）</CardTitle>
              <div className="flex flex-wrap gap-1">
                {(["active", "test", "archived", "all"] as const).map((filter) => (
                  <Button
                    key={filter}
                    asChild
                    size="xs"
                    variant={planFilter === filter ? "default" : "secondary"}
                    className={adminPlanFilterCtaClassName}
                  >
                    <a href={planFilterHref(filter)}>{adminPlanFilterLabel(filter)}</a>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              当前过滤：<span className="font-mono">{adminPlanFilterLabel(planFilter)}</span>。
              正式=未归档正式计划；测试=测试计划；已归档=归档计划；全部=当前用户全部计划。
            </div>
            {recentPlans.length ? (
              recentPlans.map((p) => {
                const activationHistory = activationHistoryByPlanId.get(p.id) ?? [];
                return (
                <div key={p.id} className="rounded-md border px-3 py-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-mono text-xs">{p.id}</span>
                        <Badge variant={p.isTest ? "outline" : "secondary"}>{adminPlanKindLabel(p.isTest)}</Badge>
                        {p.archivedAt ? <Badge variant="outline">已归档</Badge> : null}
                      </div>
                      <div className="mt-1 text-sm font-medium">{p.lesson.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.localDate} / {formatHomeDailyPlanStatusLabel(p.status)} / {formatTodayPlanSourceLabel(p.source)} / {adminSchemaVersionLabel(p.schemaVersion)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.selectedDomain ?? "-"} / {p.selectedTopic ?? "-"}
                        {p.generationJobId ? ` / job ${p.generationJobId}` : ""}
                      </div>
                        </div>
                        <div className={adminRecentPlanActionRowClassName}>
                          <a
                            className={adminRecentPlanLinkClassName}
                            href={`/library?lessonId=${encodeURIComponent(p.lessonId)}`}
                          >
                            查看课程
                          </a>
                          <a
                            className={adminRecentPlanLinkClassName}
                            href={planAuditHref(p.id, planFilter)}
                          >
                        审计链路
                      </a>
                      <form action={markPlanActiveAction}>
                        <input type="hidden" name="planId" value={p.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          className={adminRecentPlanGovernanceCtaClassName}
                          disabled={!authed || (!p.isTest && !p.archivedAt)}
                        >
                          设为正式
                        </Button>
                      </form>
                      <form action={markPlanArchivedAction}>
                        <input type="hidden" name="planId" value={p.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          className={adminRecentPlanGovernanceCtaClassName}
                          disabled={!authed || Boolean(p.archivedAt)}
                        >
                          归档
                        </Button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-2 rounded-md bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">激活历史</div>
                    {activationHistory.length ? (
                      <div className="mt-1 grid gap-1">
                        {activationHistory.slice(0, 3).map((a) => (
                          <div key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                            <span>{a.createdAt.toISOString()}</span>
                            <span>{adminPlanActivationLabel(a.status)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1">暂无激活记录</div>
                    )}
                  </div>
                </div>
                );
              })
            ) : (
              <div className="text-muted-foreground">暂无记录</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">最近复习卡片（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentFlashcards.length ? (
              recentFlashcards.map((c) => (
                <div key={c.id} className="rounded-md border px-3 py-2">
                  <div className="font-mono text-xs">{c.id}</div>
                  <div className="mt-1 text-sm font-medium">{c.front}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    到期：{c.dueAt.toISOString()} / 复习次数：{c.reviewCount}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">暂无卡片</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">最近选题决策（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentDecisionExplanations.length ? (
              recentDecisionExplanations.map((d) => {
                const activeSignals = d.explanation.signals.filter((s) => s.active).slice(0, 4);
                return (
                <div key={d.id} className="rounded-md border px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-xs">{d.localDate}</div>
                    <Badge variant={d.isTest ? "outline" : "secondary"}>
                      {adminPlanKindLabel(d.isTest)}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm font-medium">{d.domain} / {d.topic}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {d.explanation.mainReason}
                  </div>
                  {activeSignals.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {activeSignals.map((signal) => (
                        <Badge key={signal.key} variant="outline">
                          {signal.label} {Math.round(signal.value * 100)}%
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {d.explanation.notes.length ? (
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                      {d.explanation.notes.map((note) => (
                        <div key={note}>{note}</div>
                      ))}
                    </div>
                  ) : null}
                  {d.signalSummary ? (
                    <div className="mt-2 rounded-md border bg-muted/30 p-2 text-xs">
                      <div className="font-medium text-foreground">选题信号快照</div>
                      <div className="mt-1 text-muted-foreground">
                        最近学习：{d.signalSummary.recentStudyText}
                      </div>
                      <div className="mt-2 grid gap-1">
                        {d.signalSummary.items.map((item) => (
                          <div
                            key={item.key}
                            className="flex flex-wrap items-center justify-between gap-2"
                          >
                            <span className={item.active ? "text-foreground" : "text-muted-foreground"}>
                              {item.label}
                            </span>
                            <span className="font-mono text-muted-foreground">{item.detail}</span>
                          </div>
                        ))}
                      </div>
                      {d.signalSummary.notes.length ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          {d.signalSummary.notes.map((note) => (
                            <div key={note}>{note}</div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-2 rounded-md border bg-muted/20 p-2 text-xs text-muted-foreground">
                      选题信号快照暂无记录（旧计划或管理员激活记录）。
                    </div>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看决策原因、分数明细和输入快照
                    </summary>
                    <div className="mt-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                      {d.reason}
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{JSON.stringify(d.scoreBreakdown ?? {}, null, 2)}</code>
                    </pre>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{JSON.stringify(d.inputSnapshot ?? {}, null, 2)}</code>
                    </pre>
                  </details>
                </div>
                );
              })
            ) : (
              <div className="text-muted-foreground">暂无规划记录</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">最近生成任务（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentJobSummaries.length ? (
              recentJobSummaries.map((j) => (
                <div key={j.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xs">{j.id}</div>
                    <div className="text-xs">{j.type} / {adminJobStatusLabel(j.status)}{j.model ? ` / ${j.model}` : ""}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {j.createdAt.toISOString()}
                  </div>
                  {j.error ? (
                    <div className="mt-1 text-xs text-destructive">{j.error}</div>
                  ) : null}
                  {j.plannerSummary ? (
                    <div className="mt-2 rounded-md border bg-muted/30 p-2 text-xs">
                      <div className="font-medium text-foreground">选题输入</div>
                      <div className="mt-1 text-muted-foreground">
                        {j.plannerSummary.localDate ?? "-"} / {adminSchemaVersionLabel(j.plannerSummary.schemaVersion)} /
                        {" "}{j.plannerSummary.difficulty ?? "-"} /
                        {" "}{j.plannerSummary.estimatedMinutes ?? "-"} min
                      </div>
                      <div className="mt-1 font-medium">
                        {j.plannerSummary.selectedDomain} / {j.plannerSummary.selectedTopic}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {j.plannerSummary.mainReason}
                      </div>
                      {j.plannerSummary.activeSignals.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {j.plannerSummary.activeSignals.slice(0, 5).map((signal) => (
                            <Badge key={signal.key} variant="outline">
                              {signal.label} {Math.round(signal.value * 100)}%
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      {j.plannerSummary.signalSummary ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div>最近学习：{j.plannerSummary.signalSummary.recentStudyText}</div>
                          {j.plannerSummary.signalSummary.items
                            .filter((item) => item.active)
                            .slice(0, 5)
                            .map((item) => (
                              <div key={item.key} className="flex flex-wrap justify-between gap-2">
                                <span>{item.label}</span>
                                <span className="font-mono">{item.detail}</span>
                              </div>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {j.status === "failed" ? (
                    <form action={retryFailedDailyCronJobAction} className="mt-2">
                      <input type="hidden" name="jobId" value={j.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        className={adminFailedJobRetryCtaClassName}
                        disabled={!authed}
                      >
                        重试此用户定时任务
                      </Button>
                    </form>
                  ) : null}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看生成输出 JSON
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{JSON.stringify(j.output ?? {}, null, 2)}</code>
                    </pre>
                  </details>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">暂无记录</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">最近每日定时任务（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentCronJobs.length ? (
              recentCronJobs.map((j) => (
                <div key={j.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xs">{j.id}</div>
                    <div className="text-xs">{adminJobStatusLabel(j.status)}{j.model ? ` / ${j.model}` : ""}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {j.createdAt.toISOString()}
                  </div>
                  {j.error ? (
                    <div className="mt-1 text-xs text-destructive">{j.error}</div>
                  ) : null}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看定时任务输出 JSON
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{JSON.stringify(j.output ?? {}, null, 2)}</code>
                    </pre>
                  </details>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">暂无定时任务记录</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
