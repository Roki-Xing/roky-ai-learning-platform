import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LearningCompassCard } from "@/components/learning/learning-compass-card";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import {
  generateMistakeReviewCardAction,
  markMistakeResolvedAction,
} from "@/app/mistakes/actions";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import {
  buildCoachDraftForMistake,
  formatMistakeSourceLabel,
  formatMistakeStatusLabel,
  inferMistakeKind,
  mistakeMatchesKindFilter,
  parseMistakeKindFilter,
  parseMistakeSourceFilter,
  parseMistakeStatusFilter,
  type MistakeKindFilter,
  type MistakeSourceFilter,
  type MistakeStatusFilter,
} from "@/server/mistakes/view";

function filterHref(args: {
  status: MistakeStatusFilter;
  source: MistakeSourceFilter;
  kind: MistakeKindFilter;
  q: string;
  focus?: string;
}) {
  const query = new URLSearchParams();
  if (args.status !== "open") query.set("status", args.status);
  if (args.source !== "all") query.set("source", args.source);
  if (args.kind !== "all") query.set("kind", args.kind);
  if (args.q) query.set("q", args.q);
  if (args.focus) query.set("focus", args.focus);
  const suffix = query.toString();
  return suffix ? `/mistakes?${suffix}` : "/mistakes";
}

function buildMistakeCoachHref(mistake: {
  lessonId: string;
  summary?: string | null;
  prompt?: string | null;
  explanation?: string | null;
  userAnswer?: unknown;
}) {
  const query = new URLSearchParams({
    mode: "concept_question",
    draft: buildCoachDraftForMistake(mistake),
  });
  if (mistake.lessonId) query.set("lessonId", mistake.lessonId);
  return `/coach?${query.toString()}`;
}

function toneForStatus(status: string) {
  if (status === "resolved") return "success" as const;
  if (status === "ignored") return "neutral" as const;
  return "warning" as const;
}

function toneForKind(kind: string) {
  if (kind === "代码错误") return "info" as const;
  if (kind === "算法边界错误") return "danger" as const;
  if (kind === "事实性错误") return "warning" as const;
  if (kind === "术语混淆") return "neutral" as const;
  return "warning" as const;
}

const mistakeRepairActionCtaClassName = "min-h-11 w-full sm:w-auto";
const mistakePageCtaClassName = "min-h-11 w-full sm:w-auto";
const mistakeFilterCtaClassName = "min-h-11 w-full sm:w-auto";
const mistakeFilterRowClassName = "grid gap-2 sm:flex sm:flex-wrap";
const mistakeSearchInputClassName = "min-h-11";

export default async function MistakesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string; kind?: string; q?: string; focus?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  const status = parseMistakeStatusFilter(sp.status);
  const source = parseMistakeSourceFilter(sp.source);
  const kind = parseMistakeKindFilter(sp.kind);
  const q = (sp.q ?? "").trim();
  const focusMistakeId = (sp.focus ?? "").trim();

  const filteredWhere = {
    userId,
    ...(status === "resolved"
      ? { status: "resolved" }
      : status === "open"
        ? { status: { in: ["open", "active"] } }
        : {}),
    ...(source !== "all" ? { source } : {}),
    ...(q
      ? {
          OR: [
            { summary: { contains: q, mode: "insensitive" as const } },
            { prompt: { contains: q, mode: "insensitive" as const } },
            { explanation: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [
    totalCount,
    openCount,
    resolvedCount,
    quizCount,
    codeCount,
    coachCount,
    projectCount,
    mistakeRows,
  ] = await Promise.all([
    prisma.misconception.count({ where: { userId } }),
    prisma.misconception.count({ where: { userId, status: { in: ["open", "active"] } } }),
    prisma.misconception.count({ where: { userId, status: "resolved" } }),
    prisma.misconception.count({ where: { userId, source: "quiz", status: { in: ["open", "active"] } } }),
    prisma.misconception.count({ where: { userId, source: "code", status: { in: ["open", "active"] } } }),
    prisma.misconception.count({ where: { userId, source: "coach", status: { in: ["open", "active"] } } }),
    prisma.misconception.count({ where: { userId, source: "project", status: { in: ["open", "active"] } } }),
    prisma.misconception.findMany({
      where: filteredWhere,
      orderBy: [{ lastAttemptAt: "desc" }],
      take: 80,
      select: {
        id: true,
        lessonId: true,
        topicId: true,
        localDate: true,
        source: true,
        sourceKey: true,
        summary: true,
        prompt: true,
        explanation: true,
        status: true,
        occurrenceCount: true,
        lastAttemptAt: true,
        resolvedAt: true,
        userAnswer: true,
      },
    }),
  ]);
  const mistakes = mistakeRows.filter((item) => mistakeMatchesKindFilter(item, kind)).slice(0, 40);

  const lessonIds = [...new Set(mistakes.map((item) => item.lessonId).filter(Boolean))];
  const topicIds = [...new Set(mistakes.map((item) => item.topicId).filter(Boolean))] as string[];
  const [lessons, topics, lessonCards] = await Promise.all([
    lessonIds.length
      ? prisma.lesson.findMany({
          where: { id: { in: lessonIds } },
          select: { id: true, title: true },
        })
      : [],
    topicIds.length
      ? prisma.topic.findMany({
          where: { id: { in: topicIds } },
          select: { id: true, title: true },
        })
      : [],
    lessonIds.length
      ? prisma.flashcard.findMany({
          where: { userId, lessonId: { in: lessonIds } },
          select: { lessonId: true },
        })
      : [],
  ]);

  const lessonTitleById = new Map(lessons.map((lesson) => [lesson.id, lesson.title]));
  const topicTitleById = new Map(topics.map((topic) => [topic.id, topic.title]));
  const lessonCardCount = new Map<string, number>();
  for (const card of lessonCards) {
    if (!card.lessonId) continue;
    lessonCardCount.set(card.lessonId, (lessonCardCount.get(card.lessonId) ?? 0) + 1);
  }
  const focusedMistake = focusMistakeId
    ? mistakes.find((item) => item.id === focusMistakeId) ?? null
    : mistakes[0] ?? null;

  const statusOptions: Array<{ value: MistakeStatusFilter; label: string }> = [
    { value: "open", label: "未解决" },
    { value: "resolved", label: "已解决" },
    { value: "all", label: "全部" },
  ];
  const sourceOptions: Array<{ value: MistakeSourceFilter; label: string }> = [
    { value: "all", label: "全部来源" },
    { value: "quiz", label: "小测验" },
    { value: "code", label: "代码反馈" },
    { value: "coach", label: "Coach" },
    { value: "project", label: "项目实践" },
  ];
  const kindOptions: Array<{ value: MistakeKindFilter; label: string }> = [
    { value: "all", label: "全部类型" },
    { value: "concept", label: "概念" },
    { value: "code", label: "代码" },
    { value: "algorithm", label: "算法" },
    { value: "term", label: "术语" },
    { value: "fact", label: "事实" },
  ];

  return (
    <AppShell
      activePath="/mistakes"
      title="错题误区"
      actions={
        <Button asChild size="sm" variant="secondary" className={mistakePageCtaClassName}>
          <Link href="/coach">打开 Coach</Link>
        </Button>
      }
    >
      <PageHeader
        title="错题误区"
        subtitle="把概念误区、代码错误、边界问题和术语混淆集中起来，先修最容易反复出现的薄弱点。"
        badge="错题修复"
      />

      <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-3">
          <LearningCompassCard title="活跃误区" subtitle="当前仍会反复出现的问题" signal={String(openCount)} tone="warning">
            总记录 {totalCount} / 已解决 {resolvedCount}
          </LearningCompassCard>
          <LearningCompassCard
            title="主要来源"
            subtitle="最容易暴露薄弱点的输入方式"
            signal={
              quizCount >= codeCount && quizCount >= coachCount && quizCount >= projectCount
                ? "小测验"
                : codeCount >= coachCount && codeCount >= projectCount
                  ? "代码反馈"
                  : projectCount >= coachCount
                    ? "项目实践"
                    : "Coach"
            }
            tone="info"
          >
            小测验 {quizCount} / 代码 {codeCount} / Coach {coachCount} / 项目 {projectCount}
          </LearningCompassCard>
          <LearningCompassCard
            title="修复策略"
            subtitle="先解释，再补课，再复习"
            signal={openCount > 0 ? "建议处理" : "状态稳定"}
            tone={openCount > 0 ? "warning" : "success"}
            action={
              <Button asChild size="sm" variant="outline" className={mistakePageCtaClassName}>
                <Link href="/review">去复习</Link>
              </Button>
            }
          >
            开放误区会优先引导到 Coach 和后续复习，不再只停留在一次错误记录。
          </LearningCompassCard>
        </div>

        <LearningSectionCard title="筛选视图" description="默认先看未解决问题，再按来源或关键词收窄。">
          <form action="/mistakes" className="grid gap-3">
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="source" value={source} />
            <input type="hidden" name="kind" value={kind} />
            <Input
              name="q"
              defaultValue={q}
              placeholder="搜索 RAG / 二分 / SWE-bench / 术语混淆"
              className={mistakeSearchInputClassName}
            />
            <Button type="submit" size="sm" className={mistakePageCtaClassName}>搜索错题</Button>
          </form>
          <div className="mt-3 grid gap-2">
            <div className="text-xs font-medium text-muted-foreground">状态</div>
            <div className={mistakeFilterRowClassName}>
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  asChild
                  size="sm"
                  variant={status === option.value ? "default" : "outline"}
                  className={mistakeFilterCtaClassName}
                >
                  <Link href={filterHref({ status: option.value, source, kind, q, focus: focusMistakeId })}>{option.label}</Link>
                </Button>
              ))}
            </div>
            <div className="text-xs font-medium text-muted-foreground">来源</div>
            <div className={mistakeFilterRowClassName}>
              {sourceOptions.map((option) => (
                <Button
                  key={option.value}
                  asChild
                  size="sm"
                  variant={source === option.value ? "default" : "outline"}
                  className={mistakeFilterCtaClassName}
                >
                  <Link href={filterHref({ status, source: option.value, kind, q, focus: focusMistakeId })}>{option.label}</Link>
                </Button>
              ))}
            </div>
            <div className="text-xs font-medium text-muted-foreground">类型</div>
            <div className={mistakeFilterRowClassName}>
              {kindOptions.map((option) => (
                <Button
                  key={option.value}
                  asChild
                  size="sm"
                  variant={kind === option.value ? "default" : "outline"}
                  className={mistakeFilterCtaClassName}
                >
                  <Link href={filterHref({ status, source, kind: option.value, q, focus: focusMistakeId })}>{option.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </LearningSectionCard>
      </div>

      {focusedMistake ? (
        <LearningSectionCard
          title="当前先修这一条"
          description="先解释，再生成复习卡；修完后再回到清单。"
          action={<LearningStatusBadge tone="danger">重点修复</LearningStatusBadge>}
        >
          <div className="grid gap-3">
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{formatMistakeSourceLabel(focusedMistake.source)}</Badge>
                <Badge variant="outline">{inferMistakeKind(focusedMistake)}</Badge>
                <LearningStatusBadge tone={toneForStatus(focusedMistake.status)}>
                  {formatMistakeStatusLabel(focusedMistake.status)}
                </LearningStatusBadge>
              </div>
              <div className="mt-3 text-lg font-semibold leading-snug">{focusedMistake.summary}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {focusedMistake.prompt}
              </div>
            </div>

            <div
              aria-label="错题修复移动操作"
              className="sticky bottom-16 z-20 grid gap-2 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none sm:flex sm:flex-wrap"
            >
              <Button asChild size="sm" className={mistakeRepairActionCtaClassName}>
                <Link href={buildMistakeCoachHref(focusedMistake)}>让 Coach 解释</Link>
              </Button>
              <form action={generateMistakeReviewCardAction}>
                <input type="hidden" name="mistakeId" value={focusedMistake.id} />
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  className={mistakeRepairActionCtaClassName}
                >
                  生成复习卡
                </Button>
              </form>
              {focusedMistake.status === "resolved" ? null : (
                <form action={markMistakeResolvedAction}>
                  <input type="hidden" name="mistakeId" value={focusedMistake.id} />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className={mistakeRepairActionCtaClassName}
                  >
                    标记已解决
                  </Button>
                </form>
              )}
            </div>
          </div>
        </LearningSectionCard>
      ) : null}

      <LearningSectionCard
        title="误区清单"
        description="每条记录都能回到课程、看到关联卡片，并把上下文一键交给 Coach。"
        action={<LearningStatusBadge tone={mistakes.length ? "info" : "neutral"}>{mistakes.length} 条</LearningStatusBadge>}
      >
        {mistakes.length ? (
          <div className="grid gap-3">
            {mistakes.map((mistake) => {
              const kind = inferMistakeKind(mistake);
              const lessonTitle = lessonTitleById.get(mistake.lessonId) ?? "未知课程";
              const topicTitle = mistake.topicId ? topicTitleById.get(mistake.topicId) ?? "未关联主题" : "未关联主题";
              const coachHref = buildMistakeCoachHref(mistake);

              return (
                <div key={mistake.id} className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-semibold">{mistake.summary}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">{formatMistakeSourceLabel(mistake.source)}</Badge>
                        <Badge variant="outline">{kind}</Badge>
                        <LearningStatusBadge tone={toneForStatus(mistake.status)}>
                          {formatMistakeStatusLabel(mistake.status)}
                        </LearningStatusBadge>
                        <LearningStatusBadge tone={toneForKind(kind)}>
                          x{mistake.occurrenceCount}
                        </LearningStatusBadge>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{mistake.localDate ?? mistake.lastAttemptAt.toISOString().slice(0, 10)}</div>
                      {mistake.resolvedAt ? <div>解决于 {mistake.resolvedAt.toISOString().slice(0, 10)}</div> : null}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_260px]">
                    <div className="grid gap-2">
                      <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                        <div className="text-xs font-medium text-foreground">原问题 / 提示</div>
                        <div className="mt-1">{mistake.prompt}</div>
                      </div>
                      {mistake.explanation ? (
                        <div className="rounded-md border bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                          <div className="text-xs font-medium text-foreground">系统解释</div>
                          <div className="mt-1">{mistake.explanation}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <div className="rounded-md border bg-background px-3 py-2 text-sm">
                        <div className="text-xs font-medium text-muted-foreground">关联课程</div>
                        <div className="mt-1 font-medium">{lessonTitle}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{topicTitle}</div>
                      </div>
                      <div className="rounded-md border bg-background px-3 py-2 text-sm">
                        <div className="text-xs font-medium text-muted-foreground">关联卡片</div>
                        <div className="mt-1 font-medium">{lessonCardCount.get(mistake.lessonId) ?? 0} 张</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          使用同课卡片把这条误区重新压回复习系统。
                        </div>
                      </div>
                      <div className="grid gap-2 sm:flex sm:flex-wrap">
                        <Button asChild size="sm" className={mistakeRepairActionCtaClassName}>
                          <Link href={coachHref}>让 Coach 解释</Link>
                        </Button>
                        <form action={generateMistakeReviewCardAction}>
                          <input type="hidden" name="mistakeId" value={mistake.id} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="secondary"
                            className={mistakeRepairActionCtaClassName}
                          >
                            生成复习卡
                          </Button>
                        </form>
                        {mistake.status === "resolved" ? null : (
                          <form action={markMistakeResolvedAction}>
                            <input type="hidden" name="mistakeId" value={mistake.id} />
                            <Button
                              type="submit"
                              size="sm"
                              variant="outline"
                              className={mistakeRepairActionCtaClassName}
                            >
                              标记已解决
                            </Button>
                          </form>
                        )}
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className={mistakeRepairActionCtaClassName}
                        >
                          <Link href={`/library?lessonId=${encodeURIComponent(mistake.lessonId)}`}>回到课程</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <LearningEmptyState
            title="当前筛选下没有错题误区"
            description="去完成一节学习、提交测验或代码反馈后，这里会自动沉淀开放误区和已解决记录。"
            actions={[
              { href: "/today", label: "回到今日学习", variant: "secondary" },
              { href: "/coach", label: "打开 Coach", variant: "outline" },
            ]}
          />
        )}
      </LearningSectionCard>
    </AppShell>
  );
}
