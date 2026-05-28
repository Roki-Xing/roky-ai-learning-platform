import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTE_GROUPS } from "@/lib/routes";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";
import { LearningMetricCard } from "@/components/learning/learning-metric-card";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";

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

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          AI Learning Platform
        </h1>
        <p className="text-sm text-muted-foreground">
          面向“广度探索 + 适度深入 + 长期积累”的每日引导式学习系统（已接入生成与复习闭环）。
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

      <div className="grid gap-4 lg:grid-cols-2">
        <LearningSectionCard
          title="今日三件事"
          description="把学习闭环跑顺，第二天自然会更轻松。"
          action={
            <Button asChild size="sm" variant="secondary">
              <Link href="/today">继续学习</Link>
            </Button>
          }
        >
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
              <div className="min-w-0">
                <div className="font-medium">完成今日学习</div>
                <div className="mt-0.5 text-xs text-muted-foreground">一步一步走完引导步骤与小测验</div>
              </div>
              <LearningStatusBadge tone={isTodayCompleted ? "success" : "warning"}>
                {isTodayCompleted ? "已完成" : "待完成"}
              </LearningStatusBadge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
              <div className="min-w-0">
                <div className="font-medium">清空到期复习</div>
                <div className="mt-0.5 text-xs text-muted-foreground">主动回忆，比“看答案”更有效</div>
              </div>
              <LearningStatusBadge tone={dueFlashcardsCount > 0 ? "warning" : "success"}>
                {dueFlashcardsCount > 0 ? `剩余 ${dueFlashcardsCount}` : "已清空"}
              </LearningStatusBadge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
              <div className="min-w-0">
                <div className="font-medium">写下自己的理解</div>
                <div className="mt-0.5 text-xs text-muted-foreground">一句话也行，沉淀到笔记库</div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/notes">去写</Link>
              </Button>
            </div>
          </div>
        </LearningSectionCard>

        <LearningSectionCard
          title="快捷入口"
          description="把高频动作放在同一个地方。"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {APP_ROUTE_GROUPS.flatMap((g) => g.routes).map((r) => (
              <Card key={r.href} className="rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{r.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">{r.href}</div>
                  <Button asChild size="sm" className="shrink-0" variant="secondary">
                    <Link href={r.href}>打开</Link>
                  </Button>
                </CardContent>
              </Card>
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
