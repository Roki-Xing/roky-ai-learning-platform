import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/routes";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">今日</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">
              {todayPlan?.status ?? "未生成"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {todayLocalDate}
              {todayPlan?.lesson?.createdBy ? ` / ${todayPlan.lesson.createdBy}` : ""}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">到期卡片</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">{dueFlashcardsCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">总卡片：{totalFlashcardsCount}</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">连续天数</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">{streak}</div>
            <div className="mt-1 text-xs text-muted-foreground">按用户时区日期</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">已完成课程</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">{completedPlansCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">总计划：{totalPlansCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APP_ROUTES.map((r) => (
          <Card key={r.href} className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{r.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">{r.href}</div>
              <Button asChild size="sm" className="shrink-0">
                <Link href={r.href}>打开</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        说明：学习数据按当前用户隔离；Demo 模式仅在开发或显式开启时使用 demo-user。
      </div>
    </div>
  );
}
