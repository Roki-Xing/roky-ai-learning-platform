import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningInsightCard } from "@/components/learning/learning-insight-card";
import { requireUser } from "@/server/auth/require-user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import {
  aggregateKnowledgeMapStats,
  buildKnowledgeMapInsights,
  createEmptyKnowledgeMapStat,
} from "@/server/map/analytics";

function countDue(cards: Array<{ dueAt: Date }>, now: Date) {
  return cards.filter((card) => card.dueAt <= now).length;
}

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  await getOrCreateUserProfile({ userId: user.id });

  const now = new Date();
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(user.id);

  const [
    domains,
    plans,
    flashcards,
    glossaryCount,
    radarCount,
    glossaryCards,
    radarCards,
    radarTypeGroups,
  ] = await Promise.all([
    prisma.domain.findMany({
      orderBy: [{ weight: "desc" }, { createdAt: "asc" }],
      include: {
        topics: {
          orderBy: [{ depthLevel: "asc" }, { createdAt: "asc" }],
          select: { id: true, slug: true, title: true, summary: true, depthLevel: true },
        },
      },
    }),
    prisma.dailyPlan.findMany({
      where: { userId: user.id, isTest: false, archivedAt: null },
      include: {
        lesson: {
          include: {
            topic: { include: { domain: true } },
          },
        },
      },
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      take: 500,
    }),
    prisma.flashcard.findMany({
      where: {
        userId: user.id,
        lesson: {
          is: {
            dailyPlans: {
              some: { userId: user.id, isTest: false, archivedAt: null },
            },
          },
        },
      },
      select: {
        front: true,
        type: true,
        dueAt: true,
        reviewCount: true,
        lesson: {
          select: {
            id: true,
            title: true,
            topic: { select: { slug: true, title: true, domain: { select: { slug: true } } } },
          },
        },
      },
      take: 1000,
    }),
    prisma.glossaryTerm.count(),
    prisma.knowledgeEntity.count(),
    prisma.flashcard.findMany({
      where: { userId: user.id, lessonId: null, tags: { array_contains: ["glossary"] } },
      select: { id: true, dueAt: true, reviewCount: true },
      take: 1000,
    }),
    prisma.flashcard.findMany({
      where: { userId: user.id, lessonId: null, tags: { array_contains: ["radar"] } },
      select: { id: true, dueAt: true, reviewCount: true, type: true },
      take: 1000,
    }),
    prisma.knowledgeEntity.groupBy({
      by: ["type"],
      _count: { _all: true },
      orderBy: { type: "asc" },
    }),
  ]);
  const reviewableDueCount = await prisma.flashcard.count({
    where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
  });
  const lessonIds = plans.map((plan) => plan.lessonId);
  const lessonSignalById = new Map(
    plans.map((plan) => [
      plan.lessonId,
      {
        domainSlug: plan.selectedDomain ?? plan.lesson.topic.domain.slug,
        topicSlug: plan.selectedTopic ?? plan.lesson.topic.slug,
      },
    ]),
  );

  const [reviewLogs, quizAttempts, codeSubmissions, misconceptions] = lessonIds.length
    ? await Promise.all([
        prisma.reviewLog.findMany({
          where: {
            flashcard: {
              userId: user.id,
              lessonId: { in: lessonIds },
            },
          },
          select: {
            flashcard: {
              select: {
                lessonId: true,
                lesson: {
                  select: {
                    topic: {
                      select: {
                        slug: true,
                        domain: { select: { slug: true } },
                      },
                    },
                  },
                },
              },
            },
          },
          take: 2000,
        }),
        prisma.quizAttempt.findMany({
          where: {
            userId: user.id,
            question: { lessonId: { in: lessonIds } },
          },
          select: {
            isCorrect: true,
            question: {
              select: {
                lessonId: true,
                lesson: {
                  select: {
                    topic: {
                      select: {
                        slug: true,
                        domain: { select: { slug: true } },
                      },
                    },
                  },
                },
              },
            },
          },
          take: 2000,
        }),
        prisma.codeSubmission.findMany({
          where: { userId: user.id, lessonId: { in: lessonIds } },
          select: { lessonId: true, localDate: true },
          take: 1000,
        }),
        prisma.misconception.findMany({
          where: { userId: user.id, lessonId: { in: lessonIds } },
          select: {
            id: true,
            lessonId: true,
            status: true,
            summary: true,
            prompt: true,
            occurrenceCount: true,
            localDate: true,
            lastAttemptAt: true,
          },
          orderBy: [{ lastAttemptAt: "desc" }],
          take: 1000,
        }),
      ])
    : [[], [], [], []] as const;

  const flashcardSignals = flashcards.flatMap((card) => {
    const lesson = card.lesson;
    if (!lesson) return [];
    return [{
      lessonId: lesson.id,
      domainSlug: lesson.topic.domain.slug,
      topicSlug: lesson.topic.slug,
      dueAt: card.dueAt,
      reviewCount: card.reviewCount,
    }];
  });

  const reviewLogSignals = reviewLogs.flatMap((log) => {
    const lesson = log.flashcard.lesson;
    if (!lesson || !log.flashcard.lessonId) return [];
    return [{
      lessonId: log.flashcard.lessonId,
      domainSlug: lesson.topic.domain.slug,
      topicSlug: lesson.topic.slug,
    }];
  });

  const quizAttemptSignals = quizAttempts.map((attempt) => ({
    lessonId: attempt.question.lessonId,
    domainSlug: attempt.question.lesson.topic.domain.slug,
    topicSlug: attempt.question.lesson.topic.slug,
    isCorrect: attempt.isCorrect,
  }));

  const codeSubmissionSignals = codeSubmissions.flatMap((submission) => {
    const signal = lessonSignalById.get(submission.lessonId);
    return signal ? [{ lessonId: submission.lessonId, ...signal }] : [];
  });

  const misconceptionSignals = misconceptions.flatMap((misconception) => {
    const signal = lessonSignalById.get(misconception.lessonId);
    return signal ? [{ lessonId: misconception.lessonId, status: misconception.status, ...signal }] : [];
  });

  const { domainStats, topicStats } = aggregateKnowledgeMapStats({
    now,
    domains: domains.map((domain) => ({
      slug: domain.slug,
      topics: domain.topics.map((topic) => ({ slug: topic.slug })),
    })),
    plans: plans.map((plan) => ({
      id: plan.id,
      lessonId: plan.lessonId,
      localDate: plan.localDate,
      status: plan.status,
      domainSlug: plan.selectedDomain ?? plan.lesson.topic.domain.slug,
      topicSlug: plan.selectedTopic ?? plan.lesson.topic.slug,
    })),
    flashcards: flashcardSignals,
    reviewLogs: reviewLogSignals,
    quizAttempts: quizAttemptSignals,
    codeSubmissions: codeSubmissionSignals,
    misconceptions: misconceptionSignals,
  });
  const mapInsights = buildKnowledgeMapInsights({
    domainStats,
    domainLabels: Object.fromEntries(domains.map((domain) => [domain.slug, domain.name])),
  });

  const selectedDomainSlug = sp.domain ?? domains[0]?.slug ?? null;
  const selectedDomain = domains.find((d) => d.slug === selectedDomainSlug) ?? domains[0] ?? null;
  const selectedPlans = selectedDomain
    ? plans
        .filter((p) => (p.selectedDomain ?? p.lesson.topic.domain.slug) === selectedDomain.slug)
        .slice(0, 8)
    : [];
  const selectedLessonIds = selectedPlans.map((p) => p.lessonId);
  const selectedCards = selectedDomain
    ? flashcards
        .filter((card) => card.lesson?.topic.domain.slug === selectedDomain.slug)
        .slice(0, 8)
    : [];
  const selectedMisconceptions = selectedDomain
    ? misconceptions
        .filter((m) => lessonSignalById.get(m.lessonId)?.domainSlug === selectedDomain.slug)
        .slice(0, 8)
    : [];
  const relatedNotes = selectedLessonIds.length
    ? await prisma.note.findMany({
        where: { userId: user.id, lessonId: { in: selectedLessonIds } },
        orderBy: [{ updatedAt: "desc" }],
        take: 8,
      })
    : [];

  return (
    <AppShell activePath="/map" title="知识地图">
      <PageHeader
        title="知识地图"
        subtitle="按真实学习记录、术语库和 AI Radar 计算覆盖状态"
        badge="地图"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mapInsights.summaryCards.map((card) => (
          <Card key={card.key} className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{card.label}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="text-xl font-semibold">{card.value}</div>
              <div className="min-h-8 text-xs text-muted-foreground">{card.detail}</div>
              {card.domainSlug ? (
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/map?domain=${encodeURIComponent(card.domainSlug)}`}>
                    查看领域
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="secondary" disabled>
                  暂无信号
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">术语覆盖</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">
              {glossaryCards.length}/{glossaryCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              到期 {countDue(glossaryCards, now)} 张
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Radar 覆盖</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">
              {radarCards.length}/{radarCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              到期 {countDue(radarCards, now)} 张
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">复习队列</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-2xl font-semibold tabular-nums">{reviewableDueCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              含课程、Coach、语音和知识库卡片
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Radar 类型</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            {radarTypeGroups.map((group) => (
              <Badge key={group.type} variant="outline">
                {group.type} {group._count._all}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

	      <div className="grid gap-4 lg:grid-cols-3">
	        <Card className="rounded-lg">
	          <CardHeader className="pb-2">
	            <CardTitle className="text-base">领域列表</CardTitle>
	          </CardHeader>
	          <CardContent className="grid gap-2">
	            {domains.length ? (
	              domains.map((domain) => {
	                const stat = domainStats.get(domain.slug) ?? createEmptyKnowledgeMapStat();
	                const progress = Math.max(
	                  0,
	                  Math.min(1, stat.completedLessons / Math.max(1, stat.planCount)),
	                );
	                const active = selectedDomain?.slug === domain.slug;
	                return (
	                  <Link
	                    key={domain.id}
	                    href={`/map?domain=${encodeURIComponent(domain.slug)}`}
	                    className={[
	                      "rounded-md border px-3 py-2 text-sm transition-colors",
	                      active ? "bg-muted" : "hover:bg-muted/50",
	                    ].join(" ")}
	                  >
	                    <div className="flex items-start justify-between gap-3">
	                      <div className="min-w-0">
	                        <div className="truncate font-medium">{domain.name}</div>
	                        <div className="mt-1 text-xs text-muted-foreground">
	                          {domain.description ?? domain.slug}
	                        </div>
	                      </div>
	                      <LearningStatusBadge
	                        tone={stat.dueFlashcardCount > 0 ? "warning" : "neutral"}
	                      >
	                        {stat.masteryScore}
	                      </LearningStatusBadge>
	                    </div>
	                    <div className="mt-2">
	                      <LearningProgressBar value={progress} />
	                    </div>
	                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
	                      <div>完成 {stat.completedLessons}</div>
	                      <div>卡片 {stat.flashcardCount}</div>
	                      <div>错题 {stat.activeMisconceptionCount}</div>
	                      <div>测验 {stat.quizAccuracy}%</div>
	                      <div>代码 {stat.codeSubmissionCount}</div>
	                      <div>到期 {stat.dueFlashcardCount}</div>
	                    </div>
	                  </Link>
	                );
	              })
            ) : (
              <div className="text-sm text-muted-foreground">
                暂无领域数据。请先在 /admin 执行 seed domains/topics。
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">主题列表</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {selectedDomain ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{selectedDomain.name}</Badge>
                  <Badge variant="outline">{selectedDomain.slug}</Badge>
                </div>
                {selectedDomain.topics.length ? (
                  <div className="grid gap-2">
                    {selectedDomain.topics.map((topic) => {
                      const stat = topicStats.get(topic.slug) ?? createEmptyKnowledgeMapStat();
                      return (
                        <div key={topic.id} className="rounded-md border px-3 py-2 text-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-medium">{topic.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {topic.summary ?? topic.slug}
                              </div>
                            </div>
                            <Badge variant="outline">score {stat.masteryScore}</Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>完成 {stat.completedLessons}</div>
                            <div>卡片 {stat.flashcardCount}</div>
                            <div>测验 {stat.quizAccuracy}%</div>
                            <div>代码 {stat.codeSubmissionCount}</div>
                            <div>错题 {stat.activeMisconceptionCount}</div>
                            <div>最近 {stat.lastStudiedLocalDate ?? "-"}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">该领域暂无主题。</div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">选择领域查看主题。</div>
            )}
          </CardContent>
        </Card>

	        <Card className="rounded-lg">
	          <CardHeader className="pb-2">
	            <CardTitle className="text-base">领域详情</CardTitle>
	          </CardHeader>
	          <CardContent className="grid gap-4 text-sm">
	            {selectedDomain ? (
	              <>
	                {(() => {
	                  const stat = domainStats.get(selectedDomain.slug) ?? createEmptyKnowledgeMapStat();
	                  return (
	                    <div className="grid gap-2 rounded-md border p-3">
	                      <div className="flex items-center justify-between gap-3">
	                        <div className="font-medium">{selectedDomain.name}</div>
	                        <LearningStatusBadge tone="info">score {stat.masteryScore}</LearningStatusBadge>
	                      </div>
	                      <LearningInsightCard
	                        title="下一步建议"
	                        tone={stat.dueFlashcardCount > 0 ? "warning" : "neutral"}
	                      >
	                        {stat.dueFlashcardCount > 0
	                          ? `先清空本领域到期卡片：${stat.dueFlashcardCount} 张`
	                          : stat.plannedLessons > 0
	                            ? `本领域还有 ${stat.plannedLessons} 节待学内容，建议从最近主题继续`
	                            : "本领域暂时没有待处理项，考虑切到薄弱领域或做一个小项目"}
	                      </LearningInsightCard>
	                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
	                        <div>计划：{stat.planCount}</div>
	                        <div>待学：{stat.plannedLessons}</div>
	                        <div>完成：{stat.completedLessons}</div>
	                        <div>卡片：{stat.flashcardCount}</div>
                        <div>到期：{stat.dueFlashcardCount}</div>
                        <div>已复习卡：{stat.reviewedCardCount}</div>
                        <div>ReviewLog：{stat.reviewLogCount}</div>
                        <div>测验：{stat.correctQuizCount}/{stat.quizAttemptCount}</div>
                        <div>正确率：{stat.quizAccuracy}%</div>
                        <div>代码提交：{stat.codeSubmissionCount}</div>
                        <div>错题：{stat.activeMisconceptionCount}/{stat.misconceptionCount}</div>
                        <div>最近：{stat.lastStudiedLocalDate ?? "-"}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        masteryScore = 完成课程 * 10 + ReviewLog * 2 + 正确测验 * 3 + 代码提交 * 3 - 到期卡 - 活跃错题 * 5
                      </div>
                    </div>
                  );
                })()}

                <div className="grid gap-2">
                  <div className="font-medium">相关课程</div>
                  {selectedPlans.length ? (
                    selectedPlans.map((plan) => (
                      <Link
                        key={plan.id}
                        href={`/library?lessonId=${encodeURIComponent(plan.lessonId)}`}
                        className="rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="font-medium">{plan.lesson.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {plan.localDate} / {plan.status} / {plan.source ?? "unknown"}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">该领域暂无课程记录。</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">相关卡片</div>
                  {selectedCards.length ? (
                    selectedCards.map((card, index) => (
                      <div key={`${card.front}:${index}`} className="rounded-md border px-3 py-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="line-clamp-2 font-medium">{card.front}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {card.lesson?.title ?? "-"}
                            </div>
                          </div>
                          <Badge variant={card.dueAt <= now ? "secondary" : "outline"}>
                            {card.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">该领域暂无关联卡片。</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">相关错题</div>
                  {selectedMisconceptions.length ? (
                    selectedMisconceptions.map((item) => (
                      <div key={item.id} className="rounded-md border px-3 py-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="line-clamp-2 font-medium">{item.summary}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {item.localDate ?? item.lastAttemptAt.toISOString().slice(0, 10)} / {item.prompt}
                            </div>
                          </div>
                          <Badge variant={item.status === "open" ? "secondary" : "outline"}>
                            {item.status} x{item.occurrenceCount}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">该领域暂无错题记录。</div>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="font-medium">相关笔记</div>
                  {relatedNotes.length ? (
                    relatedNotes.map((note) => (
                      <div key={note.id} className="rounded-md border px-3 py-2">
                        <div className="font-medium">{note.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {note.updatedAt.toISOString().slice(0, 10)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">该领域暂无关联笔记。</div>
                  )}
                </div>

                <Button asChild size="sm" variant="secondary">
                  <Link href="/today">生成下一节</Link>
                </Button>

                {mapInsights.nextFocus ? (
                  <div className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">下一步建议</div>
                    <div className="mt-1">
                      优先补：
                      <Link
                        className="font-medium text-primary underline underline-offset-2"
                        href={`/map?domain=${encodeURIComponent(mapInsights.nextFocus.slug)}`}
                      >
                        {mapInsights.nextFocus.label}
                      </Link>
                    </div>
                    <div className="mt-1">{mapInsights.nextFocus.reason}</div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="text-muted-foreground">暂无领域数据。</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
