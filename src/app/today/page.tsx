import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { explainCurriculumDecision } from "@/server/curriculum/explain-decision";
import { buildTodayCurriculumSignalInsight } from "@/server/curriculum/signal-snapshot";
import { getOrCreateTodayPlan } from "@/server/lesson/daily-plan";
import { buildKnowledgeLink, normalizeSlug } from "@/server/knowledge/base";
import { completeTodayAction, generateTodayAction } from "@/app/today/actions";
import { TodayQuiz, type TodayQuizQuestion } from "@/app/today/ui/today-quiz";
import { GuidedSteps, type GuidedStep } from "@/app/today/ui/guided-steps";
import { normalizeGuidedProgress } from "@/server/lesson/guided-progress";
import { toCodeFeedbackView } from "@/server/coding/view";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { buildTodayReviewSummary } from "@/server/review/today-summary";
import {
  CodeExercise,
  type CodeFeedbackView,
  type CodeSubmissionView,
  type TodayCodingExercise,
} from "@/app/today/ui/code-exercise";
import { LearningTimeline } from "@/components/learning/learning-timeline";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningCTAGroup } from "@/components/learning/learning-cta-group";
import { LearningFocusPanel, type LearningFocusStage } from "@/components/learning/learning-focus-panel";
import { LearningMarkdown } from "@/components/learning/learning-markdown";
import type {
  LearningTimelineItem,
  LearningTimelineItemStatus,
} from "@/components/learning/learning-timeline";

type LessonExamples = {
  guidedSteps?: unknown;
  codingExercise?: unknown;
};

type LessonConnections = {
  glossary?: {
    term?: string;
    definition?: string;
    whyItMatters?: string;
    selfCheckQuestion?: string;
  } | null;
  breadth?: {
    kind?: string;
    title?: string;
    oneLine?: string;
    blurb?: string;
    whyItMatters?: string;
    selfCheckQuestion?: string;
  } | null;
};

export default async function TodayPage() {
  const userId = await requireUserId();
  const plan = await getOrCreateTodayPlan({ userId });
  const now = new Date();

  const [flashcardCount, lessonDueFlashcardCount, totalDueFlashcardCount] =
    await Promise.all([
      prisma.flashcard.count({
        where: { userId, lessonId: plan.lessonId },
      }),
      prisma.flashcard.count({
        where: { userId, lessonId: plan.lessonId, dueAt: { lte: now } },
      }),
      prisma.flashcard.count({
        where: {
          ...buildReviewableFlashcardWhere(userId),
          dueAt: { lte: now },
        },
      }),
    ]);

  const reviewSummary = buildTodayReviewSummary({
    planStatus: plan.status,
    lessonFlashcardCount: flashcardCount,
    lessonDueFlashcardCount,
    totalDueFlashcardCount,
  });

  const quizRows = plan.lesson.quizzes.slice(0, 3);
  const quizAttemptRows = quizRows.length
    ? await prisma.quizAttempt.findMany({
        where: {
          userId,
          questionId: { in: quizRows.map((q) => q.id) },
        },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      })
    : [];

  const latestAttemptByQuestionId = new Map<
    string,
    { isCorrect: boolean; userAnswer: unknown; createdAt: string }
  >();
  for (const a of quizAttemptRows) {
    if (latestAttemptByQuestionId.has(a.questionId)) continue;
    latestAttemptByQuestionId.set(a.questionId, {
      isCorrect: a.isCorrect,
      userAnswer: a.userAnswer,
      createdAt: a.createdAt.toISOString(),
    });
  }

  const quizQuestions: TodayQuizQuestion[] = quizRows.map((q) => {
    const options = Array.isArray(q.options)
      ? q.options.filter((x): x is string => typeof x === "string")
      : null;
    return {
      id: q.id,
      type: q.type,
      question: q.question,
      options,
      explanation: q.explanation,
      attempt: latestAttemptByQuestionId.get(q.id) ?? null,
    };
  });

  const examples = (plan.lesson.examples ?? null) as unknown as LessonExamples | null;
  const connections = (plan.lesson.connections ?? null) as unknown as LessonConnections | null;
  const guidedSteps = (Array.isArray(examples?.guidedSteps) ? examples.guidedSteps : []) as GuidedStep[] | string[];
  const guidedProgress = normalizeGuidedProgress(plan.guidedProgress, {
    stepCount: guidedSteps.length,
  });
  const codingExercise = (examples?.codingExercise ?? null) as TodayCodingExercise | null;
  const glossary = connections?.glossary ?? null;
  const breadth = connections?.breadth ?? null;
  const glossaryTermText = glossary?.term?.trim() ?? "";
  const breadthTitle = breadth?.title?.trim() ?? "";
  const breadthKind = breadth?.kind?.trim().toLowerCase() ?? "";

  const [glossaryDetail, breadthDetail, decisionLog] = await Promise.all([
    glossaryTermText
      ? prisma.glossaryTerm.findFirst({
          where: {
            OR: [
              { slug: normalizeSlug(glossaryTermText) },
              { abbreviation: { equals: glossaryTermText, mode: "insensitive" } },
              { fullName: { equals: glossaryTermText, mode: "insensitive" } },
              { chineseName: { equals: glossaryTermText, mode: "insensitive" } },
            ],
          },
          select: { slug: true, category: true },
        })
      : null,
    breadthTitle
      ? prisma.knowledgeEntity.findFirst({
          where: {
            OR: [
              { slug: normalizeSlug(breadthTitle) },
              { name: { equals: breadthTitle, mode: "insensitive" } },
            ],
            ...(breadthKind ? { type: breadthKind } : {}),
          },
          select: { slug: true, type: true, confidence: true },
        })
      : null,
    prisma.curriculumDecisionLog.findUnique({
      where: {
        userId_localDate_isTest: {
          userId,
          localDate: plan.localDate,
          isTest: false,
        },
      },
      select: {
        domain: true,
        topic: true,
        reason: true,
        scoreBreakdown: true,
        inputSnapshot: true,
      },
    }),
  ]);
  const activeProject = await prisma.learningProject.findFirst({
    where: { userId, status: { not: "completed" } },
    include: { milestones: { orderBy: [{ position: "asc" }] } },
    orderBy: [{ updatedAt: "desc" }],
  });
  const activeProjectMilestone =
    activeProject?.milestones.find((milestone) => milestone.status !== "completed") ?? null;

  const decisionExplanation = explainCurriculumDecision({
    domain: decisionLog?.domain ?? plan.selectedDomain,
    topic: decisionLog?.topic ?? plan.selectedTopic,
    reason: decisionLog?.reason ?? plan.selectionReason,
    scoreBreakdown: decisionLog?.scoreBreakdown ?? null,
  });
  const todaySignalInsight = buildTodayCurriculumSignalInsight(
    decisionLog?.inputSnapshot ?? null,
    decisionLog?.domain ?? plan.selectedDomain,
  );
  const activeDecisionSignals = decisionExplanation.signals.filter((s) => s.active);

  function isMissingCodeSubmissionTable(err: unknown) {
    const rec =
      typeof err === "object" && err !== null
        ? (err as Record<string, unknown>)
        : null;
    const code = rec && typeof rec.code === "string" ? rec.code : null;
    const message = rec && typeof rec.message === "string" ? rec.message : "";
    if (code === "P2021") return true;
    if (message.toLowerCase().includes("does not exist") && message.includes("CodeSubmission")) return true;
    return false;
  }

  let codeSubmissionSupported = true;
  let codeSubmission: CodeSubmissionView = null;
  let codeFeedback: CodeFeedbackView = null;
  if (codingExercise) {
    try {
      const row = await prisma.codeSubmission.findUnique({
        where: {
          userId_lessonId_localDate: {
            userId,
            lessonId: plan.lessonId,
            localDate: plan.localDate,
          },
        },
        select: { id: true, code: true, language: true, status: true, updatedAt: true },
      });
      if (row) {
        codeSubmission = {
          code: row.code,
          language: row.language,
          status: row.status,
          updatedAt: row.updatedAt.toISOString(),
        };
        const feedback = await prisma.codeFeedback.findUnique({
          where: { submissionId: row.id },
          select: {
            provider: true,
            overall: true,
            summary: true,
            strengths: true,
            issues: true,
            suggestions: true,
            hints: true,
            suggestedTests: true,
            flashcards: true,
            nextSteps: true,
            updatedAt: true,
          },
        });
        if (feedback) {
          codeFeedback = toCodeFeedbackView(feedback);
        }
      }
    } catch (e) {
      if (!isMissingCodeSubmissionTable(e)) throw e;
      codeSubmissionSupported = false;
      codeSubmission = null;
      codeFeedback = null;
    }
  }

  const guidedStatus: LearningTimelineItemStatus = (() => {
    if (!guidedSteps.length) return "todo";
    const answerCount = Object.values(guidedProgress.answers ?? {}).filter((x) => x.trim()).length;
    if (answerCount >= Math.max(1, guidedSteps.length)) return "done";
    if (answerCount > 0) return "active";
    return "todo";
  })();

  const timelineItems: LearningTimelineItem[] = [
    {
      id: "goal",
      label: "今日目标",
      href: "#today-hero",
      status: "done" as const,
      hint: plan.lesson.title,
    },
    {
      id: "lesson",
      label: "主课",
      href: "#today-lesson",
      status: "active" as const,
      hint: "先通读，再做步骤。",
    },
    {
      id: "guided",
      label: "引导步骤",
      href: "#today-guided",
      status: guidedStatus,
      hint: guidedSteps.length ? `${guidedSteps.length} 步` : "暂无",
    },
    {
      id: "code",
      label: "代码练习",
      href: "#today-code",
      status: codingExercise ? (codeSubmission ? "done" : "todo") : "todo",
      hint: codingExercise ? (codeSubmission ? "已提交" : "未提交") : "暂无",
    },
    {
      id: "quiz",
      label: "小测验",
      href: "#today-quiz",
      status: quizQuestions.some((q) => q.attempt) ? "done" : quizQuestions.length ? "todo" : "todo",
      hint: quizQuestions.length ? `${quizQuestions.filter((q) => q.attempt).length}/${quizQuestions.length}` : "暂无",
    },
    {
      id: "cards",
      label: "术语/广度",
      href: "#today-knowledge",
      status: glossary || breadth ? "todo" : "todo",
      hint: glossary?.term ?? breadth?.title ?? "",
    },
    {
      id: "reflect",
      label: "反思与完成",
      href: "#today-reflection",
      status: plan.status === "completed" ? "done" : "todo",
      hint: plan.status === "completed" ? "已生成卡片" : "写一句话总结",
    },
  ];
  const focusStages: LearningFocusStage[] = [
    {
      id: "goal",
      title: "今日目标",
      description: `先明确今天要掌握什么：${plan.lesson.title}`,
      href: "#today-hero",
      status: "done",
    },
    {
      id: "lesson",
      title: "主课通读",
      description: "用 Markdown 结构读完正文，重点看标题、列表、代码块和例子。",
      href: "#today-lesson",
      status: "active",
    },
    {
      id: "guided",
      title: "引导步骤",
      description: guidedSteps.length ? `逐步完成 ${guidedSteps.length} 个引导问题。` : "今天没有引导步骤。",
      href: "#today-guided",
      status: guidedStatus,
    },
    {
      id: "code",
      title: "代码练习",
      description: codingExercise ? "先保存实现思路，必要时请求 AI 反馈；服务端不会执行你的代码。" : "今天没有代码练习。",
      href: "#today-code",
      status: codingExercise ? (codeSubmission ? "done" : "todo") : "todo",
    },
    {
      id: "quiz",
      title: "小测验",
      description: quizQuestions.length ? "提交答案后看解析，把错误点交给复习系统。" : "今天没有测验题。",
      href: "#today-quiz",
      status: quizQuestions.some((q) => q.attempt) ? "done" : "todo",
    },
    {
      id: "knowledge",
      title: "术语与广度",
      description: "把今日术语、人物、公司或 Benchmark 连接到长期知识库。",
      href: "#today-knowledge",
      status: glossary || breadth ? "todo" : "done",
    },
    {
      id: "reflection",
      title: "反思与完成",
      description: plan.status === "completed" ? "今日学习已完成，下一步进入复习或笔记。" : "写一句自己的总结，然后生成复习卡片。",
      href: "#today-reflection",
      status: plan.status === "completed" ? "done" : "todo",
    },
  ];

  return (
    <AppShell
      activePath="/today"
      title="今日学习"
      actions={
        <form action={generateTodayAction}>
          <Button size="sm" type="submit">
            生成今日内容
          </Button>
        </form>
      }
    >
      <PageHeader
        title="今日学习"
        subtitle={`今日主题：${plan.lesson.title}`}
        badge="今日"
      />

      <LearningFocusPanel stages={focusStages} className="mb-4" />

      <div className="grid gap-4 lg:grid-cols-[260px_1fr_340px]">
        <div className="hidden lg:block">
          <div className="sticky top-16">
            <LearningTimeline title="今日流程" items={timelineItems} />
          </div>
        </div>

        <div className="grid gap-4">
          <div id="today-hero" className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground">今日主题</div>
                <div className="mt-1 text-lg font-semibold leading-snug">{plan.lesson.title}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LearningStatusBadge tone={plan.status === "completed" ? "success" : "info"}>
                  {plan.status}
                </LearningStatusBadge>
                <LearningStatusBadge tone="neutral">{plan.localDate}</LearningStatusBadge>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              你现在要做的事很简单：按步骤走完，最后写一句自己的总结。
            </div>
            <LearningCTAGroup className="mt-3">
              <Button asChild size="sm">
                <a href="#today-guided">继续步骤</a>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <a href="#today-quiz">去做小测验</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="#today-reflection">完成并生成卡片</a>
              </Button>
            </LearningCTAGroup>
          </div>

          <div id="today-lesson" className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">今日主课</div>
              <div className="text-xs text-muted-foreground">建议：先通读，再做步骤</div>
            </div>
            <LearningMarkdown content={plan.lesson.contentMarkdown} className="mt-3" />
          </div>

            {guidedSteps.length ? (
              <div id="today-guided" className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">引导式学习步骤</div>
                  <div className="text-xs text-muted-foreground">一步一步完成</div>
                </div>
                <GuidedSteps
                  planId={plan.id}
                  steps={guidedSteps}
                  initialProgress={guidedProgress}
                />
              </div>
            ) : null}

            {codingExercise ? (
                <div id="today-code" className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">今日代码练习</div>
                    <div className="text-xs text-muted-foreground">
                      {codeSubmission ? "已提交" : "未提交"}
                    </div>
                  </div>
                  <CodeExercise
                    lessonId={plan.lessonId}
                    localDate={plan.localDate}
                    exercise={codingExercise as TodayCodingExercise}
                    submission={codeSubmission}
                    feedback={codeFeedback}
                    supported={codeSubmissionSupported}
                  />
                </div>
            ) : null}

            {glossary || breadth ? (
              <div id="today-knowledge" className="grid gap-4 lg:grid-cols-2">
                {glossary ? (
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">今日术语</div>
                      {glossaryDetail ? (
                        <Badge variant="outline">{glossaryDetail.category}</Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 text-sm">{glossary.term}</div>
                    <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                      {glossary.definition}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                      {glossary.whyItMatters}
                    </div>
                    {glossary.selfCheckQuestion ? (
                      <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                        自测：{glossary.selfCheckQuestion}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link
                          href={
                            glossaryDetail
                              ? buildKnowledgeLink({ kind: "glossary", slug: glossaryDetail.slug })
                              : `/glossary?q=${encodeURIComponent(glossaryTermText)}`
                          }
                        >
                          查看术语库
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
                {breadth ? (
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">今日广度小卡</div>
                      {breadthDetail ? (
                        <Badge variant="outline">{breadthDetail.confidence}</Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      类型：{breadthDetail?.type ?? breadth.kind}
                    </div>
                    <div className="mt-1 text-sm">{breadth.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                      {breadth.oneLine ?? breadth.blurb ?? ""}
                    </div>
                    {breadth.whyItMatters ? (
                      <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                        {breadth.whyItMatters}
                      </div>
                    ) : null}
                    {breadth.selfCheckQuestion ? (
                      <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                        自测：{breadth.selfCheckQuestion}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link
                          href={
                            breadthDetail
                              ? buildKnowledgeLink({ kind: "radar", slug: breadthDetail.slug })
                              : `/radar?q=${encodeURIComponent(breadthTitle)}`
                          }
                        >
                          查看 Radar
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div id="today-quiz" className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium">今日小测验（3 题）</div>
              {quizQuestions.length ? (
                <TodayQuiz questions={quizQuestions} />
              ) : (
                <div className="mt-3 text-sm text-muted-foreground">
                  暂无测验题。
                </div>
              )}
            </div>

            <div id="today-reflection" className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-sm font-medium">沉淀</div>
              <form action={completeTodayAction} className="mt-3 grid gap-3">
                <input type="hidden" name="date" value={plan.date.toISOString()} />
                <div className="text-sm text-muted-foreground">
                  写一句总结（完成后会生成复习卡片）
                </div>
                <textarea
                  name="reflection"
                  className="min-h-24 w-full rounded-lg border bg-transparent p-3 text-sm outline-none"
                  placeholder="今天我学到了..."
                  defaultValue={plan.reflection ?? ""}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="submit" disabled={plan.status === "completed"}>
                    {plan.status === "completed" ? "已完成" : "标记完成并生成卡片"}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    当前状态：{plan.status} / 卡片：{flashcardCount}
                  </div>
                </div>

                {plan.status === "completed" ? (
                  <div className="grid gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <a href="/review">去复习</a>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <a href={`/notes?lessonId=${encodeURIComponent(plan.lessonId)}`}>写笔记</a>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <a href={`/library?lessonId=${encodeURIComponent(plan.lessonId)}`}>查看课程库</a>
                      </Button>
                    </div>
                    {activeProject ? (
                      <div className="rounded-lg border bg-indigo-50/40 p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">今日项目任务</div>
                          <Badge variant="outline">{activeProject.title}</Badge>
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          {activeProjectMilestone
                            ? activeProjectMilestone.title
                            : "项目里程碑已完成，可以生成项目总结。"}
                        </div>
                        {activeProjectMilestone?.task ? (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {activeProjectMilestone.task}
                          </div>
                        ) : null}
                        <div className="mt-3">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/projects?projectId=${encodeURIComponent(activeProject.id)}`}>
                              继续项目
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </form>
            </div>
        </div>

        <div className="grid gap-4">
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">今日复习入口</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">状态</span>
                <Badge variant={reviewSummary.isCompleted ? "secondary" : "outline"}>
                  {reviewSummary.statusLabel}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">本课卡片</div>
                  <div className="mt-1 font-mono text-lg">
                    {reviewSummary.lessonFlashcardCount}
                  </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">本课到期</div>
                  <div className="mt-1 font-mono text-lg">
                    {reviewSummary.lessonDueFlashcardCount}
                  </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">全部到期</div>
                  <div className="mt-1 font-mono text-lg">
                    {reviewSummary.totalDueFlashcardCount}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {reviewSummary.helperText}
              </div>
              {reviewSummary.isCompleted ? (
                <Button asChild size="sm" variant="secondary">
                  <Link href="/review">{reviewSummary.ctaLabel}</Link>
                </Button>
              ) : (
                <Button size="sm" variant="secondary" disabled>
                  {reviewSummary.ctaLabel}
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">今日概览</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">状态</span>
                <Badge variant={plan.status === "completed" ? "secondary" : "outline"}>
                  {plan.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">复习卡片</span>
                <span className="font-mono">{flashcardCount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">日期</span>
                <span className="font-mono">{plan.localDate}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">来源</span>
                <span>{plan.source ?? plan.lesson.createdBy}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">schema</span>
                <span className="font-mono">{plan.schemaVersion ?? "-"}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">为什么今天学这个</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{decisionExplanation.selectedDomain}</Badge>
                <Badge variant="outline">{decisionExplanation.selectedTopic}</Badge>
              </div>
              <div className="text-muted-foreground">
                {decisionExplanation.mainReason}
              </div>
              {todaySignalInsight ? (
                <div className="rounded-md border bg-muted/30 p-3 text-xs">
                  <div className="font-medium text-foreground">Planner 信号快照</div>
                  <div className="mt-1 text-muted-foreground">
                    {todaySignalInsight.summaryText}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    最近学习：{todaySignalInsight.recentStudyText}
                  </div>
                  {todaySignalInsight.highlights.length ? (
                    <div className="mt-2 grid gap-1">
                      {todaySignalInsight.highlights.map((item) => (
                        <div
                          key={item.key}
                          className="flex flex-wrap items-center justify-between gap-2"
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="font-mono text-muted-foreground">{item.detail}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {todaySignalInsight.notes.length ? (
                    <div className="mt-2 grid gap-1 text-muted-foreground">
                      {todaySignalInsight.notes.map((note) => (
                        <div key={note}>{note}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {activeDecisionSignals.length ? (
                <div className="grid gap-2">
                  {activeDecisionSignals.map((signal) => (
                    <div key={signal.key} className="rounded-md border bg-muted/30 px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{signal.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {Math.round(signal.value * 100)}%
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{signal.detail}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  暂无可量化规划信号，使用基础兜底选题。
                </div>
              )}
              {decisionExplanation.notes.length ? (
                <div className="grid gap-1 text-xs text-muted-foreground">
                  {decisionExplanation.notes.map((note) => (
                    <div key={note}>{note}</div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
