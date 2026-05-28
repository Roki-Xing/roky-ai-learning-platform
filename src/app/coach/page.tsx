import Link from "next/link";
import { BookOpen, Code2, Lightbulb, MessageSquareText, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { buildCoachContext } from "@/server/coach/context";
import {
  generateCardsFromThoughtReviewAction,
  submitThoughtReviewAction,
} from "@/app/coach/actions";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import {
  CoachClaimCard,
  CoachContextGroup,
  CoachFlashcardPanel,
  CoachHero,
  CoachIssueList,
  CoachListBlock,
  CoachMetricPill,
  CoachMissingConcepts,
  CoachModeRail,
  CoachQuickLinks,
  CoachResultBlock,
  CoachSignalStrip,
  coachIcons,
} from "@/app/coach/ui/coach-workspace";

type ReviewJson = {
  provider?: string;
  normalizedText?: string;
  mainClaim?: string;
  whatIsCorrect?: string[];
  possibleIssues?: Array<{
    type?: string;
    severity?: string;
    issue?: string;
    explanation?: string;
  }>;
  missingConcepts?: Array<{ term?: string; reason?: string }>;
  relatedTerms?: string[];
  socraticQuestions?: string[];
  suggestedNextLessons?: string[];
  flashcards?: Array<{ front?: string; back?: string; type?: string }>;
  finalAdvice?: string;
};

const MODES = [
  ["today_lesson", "今日课程"],
  ["concept_question", "概念疑问"],
  ["code_reasoning", "代码思路"],
  ["algorithm_design", "算法设计"],
  ["glossary_term", "术语理解"],
  ["industry_radar", "行业广度"],
  ["free_thought", "自由想法"],
] as const;

function asReviewJson(value: unknown): ReviewJson {
  return typeof value === "object" && value !== null ? (value as ReviewJson) : {};
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

type ContextItem = { title: string; subtitle?: string; tone?: "neutral" | "info" | "success" | "warning" | "danger" };

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ reviewId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();

  const todayPlan = await prisma.dailyPlan.findFirst({
    where: { userId, isTest: false, archivedAt: null },
    orderBy: [{ localDate: "desc" }],
    include: { lesson: { select: { id: true, title: true } } },
  });

  // This is a lightweight, UI-facing context snapshot (not the full prompt summary string).
  const coachContext = await buildCoachContext({
    userId,
    mode: "free_thought",
    includeTodayLesson: true,
    lessonId: todayPlan?.lessonId ?? null,
  });

  const reviews = await prisma.thoughtReview.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      mode: true,
      mainClaim: true,
      lessonId: true,
      createdAt: true,
    },
  });
  const selectedId = sp.reviewId ?? reviews[0]?.id ?? null;
  const selected = selectedId
    ? await prisma.thoughtReview.findFirst({
        where: { id: selectedId, userId },
      })
    : null;
  const review = asReviewJson(selected?.reviewJson);
  const possibleIssues = Array.isArray(review.possibleIssues) ? review.possibleIssues : [];
  const missingConcepts = Array.isArray(review.missingConcepts) ? review.missingConcepts : [];
  const flashcards = Array.isArray(review.flashcards) ? review.flashcards : [];
  const relatedTerms = list(review.relatedTerms);
  const questions = list(review.socraticQuestions);
  const nextLessons = list(review.suggestedNextLessons);
  const correctParts = list(review.whatIsCorrect);

  const generatedCardCount = selected
    ? await prisma.flashcard.count({
        where: { id: { startsWith: `thought:${selected.id}:` }, userId },
      })
    : 0;

  const dueCardItems: ContextItem[] = coachContext.dueCardItems.map((c) => ({
    title: c.front,
    subtitle: c.type ?? undefined,
    tone: "warning",
  }));
  const quizMistakes: ContextItem[] = coachContext.quizMistakes.map((m) => ({
    title: m.question,
    subtitle: m.explanation ? m.explanation.slice(0, 80) : undefined,
    tone: "danger",
  }));
  const codeFeedbackItems: ContextItem[] = coachContext.codeFeedbackItems.map((f) => ({
    title: f.summary,
    subtitle: [f.localDate, f.overall].filter(Boolean).join(" / ") || undefined,
    tone: f.overall === "good" || f.overall === "excellent" ? "success" : "info",
  }));
  const misconceptionItems: ContextItem[] = coachContext.misconceptionItems.map((m) => ({
    title: `${m.summary} (x${m.occurrenceCount})`,
    subtitle: m.explanation ? m.explanation.slice(0, 80) : undefined,
    tone: "warning",
  }));
  const recentKnowledgeItems: ContextItem[] = coachContext.recentKnowledgeItems.map((k) => ({
    title: k.title,
    subtitle: [k.kind, k.tag].filter(Boolean).join(" / ") || undefined,
    tone: "neutral",
  }));
  const contextSignalCount =
    dueCardItems.length +
    quizMistakes.length +
    codeFeedbackItems.length +
    misconceptionItems.length +
    recentKnowledgeItems.length;

  return (
    <AppShell activePath="/coach" title="思路评审">
      <PageHeader
        title="思路评审"
        subtitle="写出你的理解，Coach 会结合最近课程、错题、代码反馈和到期卡片做结构化评审。"
        badge="Coach"
      />

      <div className="mb-4">
        <CoachHero
          lessonTitle={coachContext.lessonTitle}
          localDate={coachContext.todayLocalDate}
          dueCount={dueCardItems.length}
          issueCount={possibleIssues.length + missingConcepts.length}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_340px]">
        <LearningSectionCard
          title="我的理解"
          description="先说判断，再写证据或代码思路。越具体，反馈越可用。"
          className="self-start rounded-lg"
        >
          <form action={submitThoughtReviewAction} className="grid gap-3">
            <CoachModeRail modes={MODES} />
            <label className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm">
              <input type="checkbox" name="includeTodayLesson" defaultChecked className="size-4" />
              关联最近课程
            </label>
            {todayPlan ? <input type="hidden" name="lessonId" value={todayPlan.lessonId} /> : null}
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">输入内容</div>
                <LearningStatusBadge tone="info">required</LearningStatusBadge>
              </div>
              <Textarea
                name="rawText"
                className="min-h-72 resize-y text-sm leading-6"
                placeholder="例如：我觉得 Self-Attention 就是把所有 token 平均一下；或者贴一段代码思路让 Coach 找问题。"
                required
              />
            </div>
            {todayPlan ? (
              <div className="rounded-md border bg-indigo-50/50 px-3 py-2 text-xs text-indigo-900">
                当前关联：{todayPlan.localDate} / {todayPlan.lesson.title}
              </div>
            ) : null}
            <Button type="submit" className="w-full">提交给 Coach</Button>
          </form>
        </LearningSectionCard>

        <LearningSectionCard
          title="导师反馈"
          description="先看主张是否成立，再处理问题、缺口和下一步。"
          className="rounded-lg"
        >
          <div className="grid gap-4">
              {selected ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <LearningStatusBadge tone="neutral">{selected.mode}</LearningStatusBadge>
                      <LearningStatusBadge tone={review.provider === "deepseek" ? "info" : "neutral"}>
                        {review.provider ?? "template"}
                      </LearningStatusBadge>
                      <LearningStatusBadge tone={possibleIssues.length ? "danger" : "success"}>
                        问题 {possibleIssues.length}
                      </LearningStatusBadge>
                      <LearningStatusBadge tone={missingConcepts.length ? "warning" : "success"}>
                        缺口 {missingConcepts.length}
                      </LearningStatusBadge>
                    </div>
                    {selected.lessonId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/library?lessonId=${encodeURIComponent(selected.lessonId)}`}>
                          查看课程
                        </Link>
                      </Button>
                    ) : null}
                  </div>

                  <CoachSignalStrip
                    items={[
                      { label: "正确点", value: correctParts.length, tone: "success" },
                      { label: "追问", value: questions.length, tone: "info" },
                      { label: "建议卡片", value: flashcards.length, tone: "warning" },
                    ]}
                  />

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                      <CoachClaimCard
                        normalizedText={review.normalizedText ?? selected.normalizedText ?? selected.rawText}
                        mainClaim={review.mainClaim ?? selected.mainClaim}
                      />
                    </div>
                    <CoachListBlock
                      title="正确部分"
                      icon={coachIcons.check}
                      tone="success"
                      items={correctParts}
                      empty="Coach 需要更多上下文来确认正确点。"
                    />
                    <CoachMissingConcepts concepts={missingConcepts} />
                    <div className="lg:col-span-2">
                      <CoachIssueList issues={possibleIssues} />
                    </div>
                    <CoachListBlock
                      title="追问"
                      icon={coachIcons.help}
                      tone="info"
                      items={questions}
                      empty="暂无追问。你可以补一个具体例子再提交。"
                      ordered
                    />
                    <CoachResultBlock title="下一步" icon={Lightbulb} tone="warning">
                      <div className="whitespace-pre-wrap">
                        {review.finalAdvice ?? "把当前理解改写成一个例子，再让 Coach 检查一次。"}
                      </div>
                      {nextLessons.length ? (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {nextLessons.map((lesson) => (
                            <LearningStatusBadge key={lesson} tone="neutral">
                              {lesson}
                            </LearningStatusBadge>
                          ))}
                        </div>
                      ) : null}
                    </CoachResultBlock>
                  </div>

                  <CoachFlashcardPanel
                    reviewId={selected.id}
                    generatedCardCount={generatedCardCount}
                    flashcards={flashcards}
                    action={generateCardsFromThoughtReviewAction}
                    relatedTerms={relatedTerms}
                  />
                </>
              ) : (
                <LearningEmptyState
                  title="暂无 Coach 记录"
                  description="先在左侧写下你的理解并提交，Coach 会返回结构化反馈。"
                  actions={[
                    { href: "/today", label: "回到今日学习", variant: "secondary" },
                    { href: "/review", label: "去复习中心", variant: "outline" },
                  ]}
                />
              )}
          </div>
        </LearningSectionCard>

        <div className="grid gap-4">
          <LearningSectionCard
            title="学习上下文"
            description="这些信号会进入 Coach 的判断范围。"
            className="self-start rounded-lg"
          >
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <CoachMetricPill label="本地日期" value={coachContext.todayLocalDate} tone="neutral" />
                <CoachMetricPill label="上下文信号" value={contextSignalCount} tone="info" />
              </div>
              <div className="rounded-lg border bg-indigo-50/50 px-3 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-950">
                  <BookOpen className="size-4" aria-hidden="true" />
                  关联课程
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-indigo-900">
                  {coachContext.lessonTitle ?? "暂无"}
                </div>
              </div>
              <CoachContextGroup
                title="到期卡片"
                icon={RotateCcw}
                items={dueCardItems}
                empty="暂无到期卡片。"
              />
              <CoachContextGroup
                title="最近错题"
                icon={MessageSquareText}
                items={quizMistakes}
                empty="暂无近期错题。"
              />
              <CoachContextGroup
                title="代码反馈"
                icon={Code2}
                items={codeFeedbackItems}
                empty="暂无代码反馈。"
              />
              <CoachContextGroup
                title="活跃误区"
                icon={Lightbulb}
                items={misconceptionItems}
                empty="暂无活跃误区。"
              />
              <CoachContextGroup
                title="最近术语/实体"
                icon={coachIcons.book}
                items={recentKnowledgeItems}
                empty="暂无记录。"
                maxItems={5}
              />
              <CoachQuickLinks lessonId={coachContext.lessonId} />
            </div>
          </LearningSectionCard>

          <LearningSectionCard title="最近评审" description="点击回看历史记录。" className="rounded-lg">
            <div className="grid gap-2">
              {reviews.length ? (
                reviews.map((r) => (
                  <Link
                    key={r.id}
                    href={`/coach?reviewId=${encodeURIComponent(r.id)}`}
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">{r.mainClaim ?? "未命名评审"}</div>
                      <LearningStatusBadge tone="neutral">{r.mode}</LearningStatusBadge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">暂无历史评审。</div>
              )}
            </div>
          </LearningSectionCard>
        </div>
      </div>
    </AppShell>
  );
}
