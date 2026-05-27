import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/server/auth/user";
import {
  buildAdminPlanFilterWhere,
  normalizeAdminPlanFilter,
  type AdminPlanFilter,
} from "@/server/admin/plan-governance";
import { buildAdminPlanAuditChain } from "@/server/admin/plan-audit";
import { buildAdminPlanAuditExceptions } from "@/server/admin/plan-audit-exceptions";
import { buildAdminPlannerJobSummary } from "@/server/admin/planner-visibility";
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
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

function planFilterHref(filter: AdminPlanFilter) {
  return `/admin?planFilter=${filter}`;
}

function planAuditHref(planId: string, filter: AdminPlanFilter) {
  return `/admin?planFilter=${filter}&auditPlanId=${encodeURIComponent(planId)}`;
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
          badge="DEV"
        />

        <div className="mx-auto mt-8 max-w-md">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="text-muted-foreground">
                请输入 <span className="font-mono">ADMIN_SECRET</span>（不会落库，仅写入 httpOnly cookie）。
              </div>
              <form action={adminLoginAction} className="grid gap-2">
                <input
                  name="secret"
                  type="password"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="ADMIN_SECRET"
                />
                <Button type="submit" size="sm">
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
    recentCronJobs,
    recentDecisionLogs,
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
        subtitle="用于验证闭环、快速查看 DB 状态、执行 seed 与一键 loop check"
        badge="DEV"
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
            <div>Admin Auth: <span className="font-mono">{authed ? "ok" : "required"}</span></div>
            {protectionEnabled && !authed ? (
              <form action={adminLoginAction} className="mt-2 grid gap-2">
                <input
                  name="secret"
                  type="password"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="输入 ADMIN_SECRET（不会落库）"
                />
                <Button type="submit" size="sm">登录（写入 httpOnly cookie）</Button>
              </form>
            ) : null}
            {protectionEnabled && authed ? (
              <form action={adminLogoutAction} className="mt-2">
                <Button type="submit" size="sm" variant="secondary">退出 admin</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">数据概览（当前 user）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>UserProfile: <span className="font-mono">{userProfileCount}</span></div>
            <div>DailyPlan: <span className="font-mono">{dailyPlanCount}</span></div>
            <div>Active official: <span className="font-mono">{activeOfficialPlanCount}</span></div>
            <div>Active test: <span className="font-mono">{activeTestPlanCount}</span></div>
            <div>Archived: <span className="font-mono">{archivedPlanCount}</span></div>
            <div>Flashcard: <span className="font-mono">{flashcardCount}</span></div>
            <div>Due Flashcard: <span className="font-mono">{dueFlashcardCount}</span></div>
            <div>ReviewLog: <span className="font-mono">{reviewLogCount}</span></div>
            <div>Note: <span className="font-mono">{noteCount}</span></div>
            <div className="mt-2 grid gap-1 rounded-md border bg-muted/30 p-2 text-xs">
              <div className="font-medium text-foreground">Official plan status</div>
              {planStatusGroups.length ? (
                planStatusGroups.map((g) => (
                  <div key={g.status} className="flex justify-between gap-3">
                    <span>{g.status}</span>
                    <span className="font-mono">{g._count._all}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">none</div>
              )}
            </div>
            <div className="grid gap-1 rounded-md border bg-muted/30 p-2 text-xs">
              <div className="font-medium text-foreground">Source / schema</div>
              {planSourceGroups.map((g) => (
                <div key={g.source ?? "null"} className="flex justify-between gap-3">
                  <span>{g.source ?? "unknown"}</span>
                  <span className="font-mono">{g._count._all}</span>
                </div>
              ))}
              {planSchemaGroups.map((g) => (
                <div key={g.schemaVersion ?? "null"} className="flex justify-between gap-3">
                  <span>schema {g.schemaVersion ?? "unknown"}</span>
                  <span className="font-mono">{g._count._all}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              全局 Lesson 总数：{lessonCount}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">今日闭环</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>今日计划: <span className="font-mono">{plan ? plan.status : "none"}</span></div>
            <div>今日课程: <span className="font-mono">{plan?.lesson?.title ?? "-"}</span></div>
            <div>今日卡片数: <span className="font-mono">{todayFlashcardsCount}</span></div>

            <div className="mt-2 grid gap-2">
              <form action={ensureProfileAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  ensure profile
                </Button>
              </form>
              <form action={seedAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  seed domains/topics
                </Button>
              </form>
              <form action={generateTodayPlanAction}>
                <Button type="submit" size="sm" disabled={!authed}>
                  生成今日计划
                </Button>
              </form>
              <form action={completeTodayPlanAction} className="grid gap-2">
                <input type="hidden" name="date" value={todayUtc.toISOString()} />
                <input
                  name="reflection"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="reflection（可选）"
                />
                <Button type="submit" size="sm" disabled={!authed}>
                  完成今日计划并生成卡片
                </Button>
              </form>
              <form action={loopCheckAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  一键 loop check（generate → complete → verify）
                </Button>
              </form>
              <form action={runDailyCronAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  运行 daily cron
                </Button>
              </form>
              <form action={regenerateTodayAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  重建今日计划
                </Button>
              </form>
              <form action={archiveTestPlansAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  归档所有 test 计划
                </Button>
              </form>
              <form action={archiveFuturePlannedPlansAction}>
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  归档未来 planned 计划
                </Button>
              </form>

              <div className="mt-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                用于验证新 schema（例如 Sprint 2.3）是否真的进入 DB：可以生成“明天”的计划，
                避免被“今日计划已存在”卡住。
              </div>

              <form action={generatePlanForLocalDateAction} className="grid gap-2">
                <input
                  name="localDate"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                  defaultValue={tomorrowLocalDate}
                  placeholder="YYYY-MM-DD"
                />
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  生成指定日期计划（localDate）
                </Button>
              </form>

              <form action={loopCheckForLocalDateAction} className="grid gap-2">
                <input
                  name="localDate"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
                  defaultValue={tomorrowLocalDate}
                  placeholder="YYYY-MM-DD"
                />
                <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                  指定日期 loop check（generate → complete → verify）
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {planAudit ? (
        <div className="mt-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">单条计划审计链路</CardTitle>
                <Button asChild size="xs" variant="secondary">
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
                      <div className="font-medium text-foreground">DailyPlan</div>
                      <div className="mt-1 font-mono">{planAudit.chain.plan.id}</div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.plan.localDate} / {planAudit.chain.plan.status} /
                        {" "}{planAudit.chain.plan.source ?? "unknown"} / schema {planAudit.chain.plan.schemaVersion ?? "-"}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.plan.isTest ? "test" : "official"}
                        {planAudit.chain.plan.archivedAt ? " / archived" : ""}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Lesson</div>
                      <div className="mt-1">{planAudit.chain.plan.lessonTitle}</div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.plan.domainSlug} / {planAudit.chain.plan.topicSlug}
                      </div>
                      <a
                        className="mt-1 inline-flex text-primary underline underline-offset-2"
                        href={`/library?lessonId=${encodeURIComponent(planAudit.chain.plan.lessonId)}`}
                      >
                        查看课程
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Generation</div>
                      <div className="mt-1 font-mono">
                        {planAudit.chain.generationJob?.id ?? planAudit.chain.plan.generationJobId ?? "-"}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        {planAudit.chain.generationJob
                          ? `${planAudit.chain.generationJob.type} / ${planAudit.chain.generationJob.status}`
                          : "无 linked job"}
                        {planAudit.chain.generationJob?.model ? ` / ${planAudit.chain.generationJob.model}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-md border bg-muted/20 p-3 text-xs">
                    <div className="font-medium text-foreground">Consistency checks</div>
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
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md border bg-muted/20 p-3 text-xs">
                      <div className="font-medium text-foreground">CurriculumDecisionLog</div>
                      {planAudit.chain.decisionLog ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div className="font-mono">{planAudit.chain.decisionLog.id}</div>
                          <div>{planAudit.chain.decisionLog.domain} / {planAudit.chain.decisionLog.topic}</div>
                          <div>{planAudit.chain.decisionLog.reason}</div>
                          <details className="mt-2">
                            <summary className="cursor-pointer">查看 inputSnapshot / scoreBreakdown</summary>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.decisionLog.inputSnapshot ?? {}, null, 2)}</code>
                            </pre>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.decisionLog.scoreBreakdown ?? {}, null, 2)}</code>
                            </pre>
                          </details>
                        </div>
                      ) : (
                        <div className="mt-2 text-muted-foreground">暂无 matching decision log</div>
                      )}
                    </div>

                    <div className="rounded-md border bg-muted/20 p-3 text-xs">
                      <div className="font-medium text-foreground">Planner input summary</div>
                      {planAudit.chain.plannerSummary ? (
                        <div className="mt-2 grid gap-1 text-muted-foreground">
                          <div>
                            {planAudit.chain.plannerSummary.selectedDomain} / {planAudit.chain.plannerSummary.selectedTopic}
                          </div>
                          <div>{planAudit.chain.plannerSummary.mainReason}</div>
                          <div>
                            schema {planAudit.chain.plannerSummary.schemaVersion ?? "-"} /
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
                            <summary className="cursor-pointer">查看 generation input / output</summary>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.generationJob?.input ?? {}, null, 2)}</code>
                            </pre>
                            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3">
                              <code>{JSON.stringify(planAudit.chain.generationJob?.output ?? {}, null, 2)}</code>
                            </pre>
                          </details>
                        </div>
                      ) : (
                        <div className="mt-2 text-muted-foreground">暂无 planner input summary</div>
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
                  ? `${planAuditExceptions.failCount} fail`
                  : "ok"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              扫描最近 <span className="font-mono">{planAuditExceptions.scannedCount}</span> 条
              <span className="font-mono"> {planFilter}</span> 计划；
              异常计划 <span className="font-mono">{planAuditExceptions.plansWithExceptionsCount}</span> 条；
              fail <span className="font-mono">{planAuditExceptions.failCount}</span>；
              warn <span className="font-mono">{planAuditExceptions.warnCount}</span>。
            </div>

            {planAuditExceptions.items.length ? (
              planAuditExceptions.items.map((item) => (
                <div key={`${item.planId}-${item.kind}`} className="rounded-md border px-3 py-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant={item.severity === "fail" ? "destructive" : "outline"}>
                          {item.severity}
                        </Badge>
                        <Badge variant="secondary">{item.kind}</Badge>
                        {item.isTest ? <Badge variant="outline">test</Badge> : null}
                        {item.archivedAt ? <Badge variant="outline">archived</Badge> : null}
                      </div>
                      <div className="mt-1 font-medium">{item.lessonTitle}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.localDate} / {item.status} / {item.source ?? "unknown"} /
                        schema {item.schemaVersion ?? "-"}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.label}: {item.detail}
                      </div>
                    </div>
                    <Button asChild size="xs" variant="secondary" className="shrink-0">
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
              <CardTitle className="text-base">最近 DailyPlan（10）</CardTitle>
              <div className="flex flex-wrap gap-1">
                {(["active", "test", "archived", "all"] as const).map((filter) => (
                  <Button key={filter} asChild size="xs" variant={planFilter === filter ? "default" : "secondary"}>
                    <a href={planFilterHref(filter)}>
                      {filter === "active"
                        ? "active"
                        : filter === "test"
                          ? "test"
                          : filter === "archived"
                            ? "archived"
                            : "all"}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              当前过滤：<span className="font-mono">{planFilter}</span>。active=正式且未归档；test=测试计划；
              archived=已归档；all=当前用户全部计划。
            </div>
            {recentPlans.length ? (
              recentPlans.map((p) => {
                const activationHistory = activationHistoryByPlanId.get(p.id) ?? [];
                return (
                <div key={p.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-mono text-xs">{p.id}</span>
                        {p.isTest ? <Badge variant="outline">test</Badge> : <Badge variant="secondary">official</Badge>}
                        {p.archivedAt ? <Badge variant="outline">archived</Badge> : null}
                      </div>
                      <div className="mt-1 text-sm font-medium">{p.lesson.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.localDate} / {p.status} / {p.source ?? "unknown"} / schema {p.schemaVersion ?? "-"}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.selectedDomain ?? "-"} / {p.selectedTopic ?? "-"}
                        {p.generationJobId ? ` / job ${p.generationJobId}` : ""}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap justify-end gap-2">
                      <a
                        className="text-xs text-primary underline underline-offset-2"
                        href={`/library?lessonId=${encodeURIComponent(p.lessonId)}`}
                      >
                        查看课程
                      </a>
                      <a
                        className="text-xs text-primary underline underline-offset-2"
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
                          disabled={!authed || (!p.isTest && !p.archivedAt)}
                        >
                          设为 active
                        </Button>
                      </form>
                      <form action={markPlanArchivedAction}>
                        <input type="hidden" name="planId" value={p.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          disabled={!authed || Boolean(p.archivedAt)}
                        >
                          归档
                        </Button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-2 rounded-md bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">Activation history</div>
                    {activationHistory.length ? (
                      <div className="mt-1 grid gap-1">
                        {activationHistory.slice(0, 3).map((a) => (
                          <div key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                            <span>{a.createdAt.toISOString()}</span>
                            <span className="font-mono">{a.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1">暂无 activation history</div>
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
            <CardTitle className="text-base">最近 Flashcard（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentFlashcards.length ? (
              recentFlashcards.map((c) => (
                <div key={c.id} className="rounded-md border px-3 py-2">
                  <div className="font-mono text-xs">{c.id}</div>
                  <div className="mt-1 text-sm font-medium">{c.front}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    due: {c.dueAt.toISOString()} / reviews: {c.reviewCount}
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
            <CardTitle className="text-base">最近 CurriculumDecision（10）</CardTitle>
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
                      {d.isTest ? "test" : "official"}
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
                      <div className="font-medium text-foreground">Planner signal snapshot</div>
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
                      Planner signal snapshot 暂无记录（旧计划或 admin 激活记录）。
                    </div>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看 reason / scoreBreakdown / inputSnapshot
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
            <CardTitle className="text-base">最近 AiGenerationJob（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentJobSummaries.length ? (
              recentJobSummaries.map((j) => (
                <div key={j.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xs">{j.id}</div>
                    <div className="text-xs">{j.type} / {j.status}{j.model ? ` / ${j.model}` : ""}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {j.createdAt.toISOString()}
                  </div>
                  {j.error ? (
                    <div className="mt-1 text-xs text-destructive">{j.error}</div>
                  ) : null}
                  {j.plannerSummary ? (
                    <div className="mt-2 rounded-md border bg-muted/30 p-2 text-xs">
                      <div className="font-medium text-foreground">Planner input</div>
                      <div className="mt-1 text-muted-foreground">
                        {j.plannerSummary.localDate ?? "-"} / schema {j.plannerSummary.schemaVersion ?? "-"} /
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
                      <Button type="submit" size="sm" variant="secondary" disabled={!authed}>
                        重试此用户 cron
                      </Button>
                    </form>
                  ) : null}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看 output JSON
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
            <CardTitle className="text-base">最近 Daily Cron（10）</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {recentCronJobs.length ? (
              recentCronJobs.map((j) => (
                <div key={j.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono text-xs">{j.id}</div>
                    <div className="text-xs">{j.status}{j.model ? ` / ${j.model}` : ""}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {j.createdAt.toISOString()}
                  </div>
                  {j.error ? (
                    <div className="mt-1 text-xs text-destructive">{j.error}</div>
                  ) : null}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      查看 cron output JSON
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                      <code>{JSON.stringify(j.output ?? {}, null, 2)}</code>
                    </pre>
                  </details>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">暂无 cron 记录</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
