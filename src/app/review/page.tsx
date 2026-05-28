import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/server/auth/user";
import { getDueFlashcards } from "@/server/review/queue";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import {
  buildProjectCodeFeedbackFlashcardWhere,
  getProjectCodeFeedbackSubmissionIds,
} from "@/server/projects/code-feedback-summary";
import { addDaysUTC, localDateInTimeZone, utcStartOfLocalDay } from "@/server/time/day";
import { buildReviewableFlashcardWhere, normalizeReviewSource } from "@/server/review/filter";
import { buildReviewScheduleSummary } from "@/server/review/schedule";
import { buildReviewEmptyState } from "@/server/review/empty-state";
import { ReviewTrainer } from "@/app/review/ui/review-trainer";

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; projectId?: string }>;
}) {
  const sp = await searchParams;
  const source = normalizeReviewSource(sp.source);
  const projectId =
    source === "project" || source === "code-feedback" ? (sp.projectId ?? null) : null;
  const userId = await requireUserId();
  const due = await getDueFlashcards({ userId, source, projectId });
  const current = due[0] ?? null;

  const profile = await getOrCreateUserProfile({ userId });
  const now = new Date();
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: now, timeZone });
  const start = utcStartOfLocalDay({ localDate, timeZone });
  const end = addDaysUTC(start, 1);
  const codeFeedbackSubmissionIds =
    source === "code-feedback" && projectId
      ? await getProjectCodeFeedbackSubmissionIds({ userId, projectId })
      : null;
  const reviewableFlashcardWhere =
    source === "code-feedback" && projectId
      ? codeFeedbackSubmissionIds?.length
        ? buildProjectCodeFeedbackFlashcardWhere(userId, codeFeedbackSubmissionIds)
        : { userId, id: "__no_project_code_feedback_cards__" }
      : buildReviewableFlashcardWhere(userId, { source, projectId });

  const [reviewedTodayCount, totalReviewLogCount, ratingGroups] = await Promise.all([
    prisma.reviewLog.count({
      where: {
        createdAt: { gte: start, lt: end },
        flashcard: reviewableFlashcardWhere,
      },
    }),
    prisma.reviewLog.count({
      where: { flashcard: reviewableFlashcardWhere },
    }),
    prisma.reviewLog.groupBy({
      by: ["rating"],
      where: {
        createdAt: { gte: start, lt: end },
        flashcard: reviewableFlashcardWhere,
      },
      _count: { _all: true },
    }),
  ]);

  const ratingCountByName = new Map(ratingGroups.map((g) => [g.rating, g._count._all]));
  const reviewScheduleSummary = buildReviewScheduleSummary({
    dueCount: due.length,
    source,
    projectId,
  });
  const emptyState = buildReviewEmptyState({ source, projectId });

  const scopeKey = `${source}:${projectId ?? ""}`;
  const currentDto = current
    ? {
        id: current.id,
        front: current.front,
        back: current.back,
        type: current.type ?? null,
      }
    : null;

  return (
    <AppShell
      activePath="/review"
      title="复习中心"
      actions={
        <Button size="sm" asChild>
          <a href="#card">开始复习</a>
        </Button>
      }
    >
      <PageHeader
        title={
          source === "project"
            ? "项目卡片复习"
            : source === "code-feedback"
              ? "代码反馈复习"
              : "复习中心"
        }
        subtitle={
          source === "project"
            ? "只复习当前项目生成的总结卡和里程碑卡"
            : source === "code-feedback"
              ? "只复习当前项目里程碑代码评审生成的卡片"
            : "间隔重复（MVP 先用简化规则：1/3/7/14 天）"
        }
        badge="MVP"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
          <div id="card" className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium">卡片</div>
            <ReviewTrainer
              scopeKey={scopeKey}
              card={currentDto}
              queueSize={due.length}
              emptyState={emptyState}
            />
          </div>
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">复习统计</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">今日已复习</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {reviewedTodayCount}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">时区日期：{localDate}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">剩余到期</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {due.length}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">当前队列</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">累计 ReviewLog</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {totalReviewLogCount}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">全量</div>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="text-sm font-medium">今日评分分布</div>
                <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                  <div>忘了：{ratingCountByName.get("forgot") ?? 0}</div>
                  <div>模糊：{ratingCountByName.get("hard") ?? 0}</div>
                  <div>记得：{ratingCountByName.get("good") ?? 0}</div>
                  <div>很熟：{ratingCountByName.get("easy") ?? 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">队列范围</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">当前队列</span>
                <Badge variant="secondary">{reviewScheduleSummary.queueLabel}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">范围</span>
                <span>{reviewScheduleSummary.scopeLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">到期卡片</span>
                <span className="font-mono">{reviewScheduleSummary.dueCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">复习规则</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {reviewScheduleSummary.rules.map((rule) => (
                <div
                  key={rule.rating}
                  className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                >
                  <span className="font-medium">{rule.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    +{rule.intervalDays}d
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
