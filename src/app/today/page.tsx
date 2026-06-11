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
import { calculateProjectProgress } from "@/server/projects/base";
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
import { LearningCompletionCard } from "@/components/learning/learning-completion-card";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { CollapsibleContentSection } from "@/components/learning/collapsible-content-section";
import {
  LearningFocusPlayer,
  type LearningFocusPlayerOverviewItem,
  type LearningFocusPlayerStage,
} from "@/components/learning/learning-focus-player";
import { LearningMarkdown } from "@/components/learning/learning-markdown";
import { TodayRemediationBanner } from "@/components/learning/today-remediation-banner";
import { buildTodayCompletionNextActions } from "@/server/learning/today-completion-actions";
import { getCurrentMissionData } from "@/server/learning/current-mission";
import {
  getKnowledgeStageStatus,
  getQuizStageStatus,
} from "@/server/learning/today-stage-status";
import {
  buildTodayRemediationIntent,
  type TodayRemediationSearchParams,
} from "@/server/learning/today-remediation-intent";
import { getActiveBookSession } from "@/server/books/base";
import {
  formatGlossaryCategoryLabel,
  formatHomeDailyPlanStatusLabel,
  formatKnowledgeEntityTypeLabel,
  formatRadarConfidenceLabel,
  formatTodayPlanSourceLabel,
} from "@/app/_lib/home-labels";
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

type TodayPageProps = {
  searchParams?: Promise<TodayRemediationSearchParams>;
};

const todayFocusCtaClassName = "min-h-11 w-full sm:w-auto";

export default async function TodayPage({ searchParams }: TodayPageProps = {}) {
  const remediationIntent = buildTodayRemediationIntent(searchParams ? await searchParams : {});
  const userId = await requireUserId();
  const currentMission = await getCurrentMissionData(userId);
  const plan = await getOrCreateTodayPlan({ userId });
  const now = new Date();

  const [
    flashcardCount,
    lessonDueFlashcardCount,
    totalDueFlashcardCount,
    noteCount,
    voiceNoteCount,
    thoughtReviewCount,
  ] =
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
      prisma.note.count({ where: { userId, lessonId: plan.lessonId } }),
      prisma.voiceNote.count({ where: { userId, lessonId: plan.lessonId } }),
      prisma.thoughtReview.count({ where: { userId, lessonId: plan.lessonId } }),
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
  const attemptedQuizQuestions = quizQuestions.filter((q) => q.attempt);
  const quizCorrectCount = attemptedQuizQuestions.filter((q) => q.attempt?.isCorrect).length;

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
  const activeProjectProgress = activeProject
    ? calculateProjectProgress(activeProject.milestones)
    : null;
  const activeProjectMilestone =
    activeProject?.milestones.find((milestone) => milestone.status !== "completed") ?? null;
  const activeBookSession = getActiveBookSession();
  const quizStatus = getQuizStageStatus({
    totalCount: quizQuestions.length,
    attemptedCount: attemptedQuizQuestions.length,
  });
  const knowledgeStatus = getKnowledgeStageStatus({
    hasGlossaryConnection: Boolean(glossary),
    hasBreadthConnection: Boolean(breadth),
    hasGlossaryDetail: Boolean(glossaryDetail),
    hasBreadthDetail: Boolean(breadthDetail),
  });
  const todayPlanStatusLabel = formatHomeDailyPlanStatusLabel(plan.status);
  const todayPlanSourceLabel = formatTodayPlanSourceLabel(plan.source ?? plan.lesson.createdBy);
  const breadthTypeLabel = formatKnowledgeEntityTypeLabel(breadthDetail?.type ?? breadth?.kind);
  const breadthConfidenceLabel = formatRadarConfidenceLabel(breadthDetail?.confidence);

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
      status: quizStatus,
      hint: quizQuestions.length ? `${attemptedQuizQuestions.length}/${quizQuestions.length}` : "暂无",
    },
    {
      id: "cards",
      label: "术语/广度",
      href: "#today-knowledge",
      status: knowledgeStatus,
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
  const focusOverview: LearningFocusPlayerOverviewItem[] = [
    { label: "状态", value: todayPlanStatusLabel, helper: plan.status === "completed" ? "今天已沉淀" : "等待完成" },
    { label: "日期", value: plan.localDate },
    { label: "复习卡片", value: flashcardCount, helper: `${lessonDueFlashcardCount} 张本课到期` },
    { label: "全部到期", value: totalDueFlashcardCount, helper: reviewSummary.helperText },
    { label: "来源", value: todayPlanSourceLabel },
    { label: "内容版本", value: plan.schemaVersion ?? "未标记" },
  ];
  const completionNextActions = buildTodayCompletionNextActions({
    planStatus: plan.status,
    lessonId: plan.lessonId,
    lessonDueFlashcardCount,
    totalDueFlashcardCount,
    noteCount,
    voiceNoteCount,
    thoughtReviewCount,
    hasCodeSubmission: Boolean(codeSubmission),
    hasCodingExercise: Boolean(codingExercise),
    flashcardCount,
    quizTotalCount: quizQuestions.length,
    quizAttemptedCount: attemptedQuizQuestions.length,
    quizCorrectCount,
    activeProject: activeProject
      ? {
          id: activeProject.id,
          title: activeProject.title,
          percent: activeProjectProgress?.percent ?? 0,
          activeMilestoneTitle: activeProjectMilestone?.title ?? null,
          activeMilestoneTask: activeProjectMilestone?.task ?? null,
        }
      : null,
    activeBookSession,
  });
  const focusStages: LearningFocusPlayerStage[] = [
    {
      id: "goal",
      title: "今日目标",
      eyebrow: "第 1 步",
      description: `先明确今天要掌握什么：${plan.lesson.title}`,
      guidance: {
        task: "看清今日主题、状态和可用入口。",
        reason: "先确认学习目标，后面的主课、练习和复习才不会散。",
        completion: "能说出今天要掌握的主题，并知道可以去完整视图或复习入口。",
      },
      status: "done",
      body: (
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">今日主题</div>
              <div className="mt-1 text-lg font-semibold leading-snug">{plan.lesson.title}</div>
              <div className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                这节课会按主课、引导、代码、小测验、知识卡和反思推进。先把目标看清楚，再进入主课。
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LearningStatusBadge tone={plan.status === "completed" ? "success" : "info"}>
                {todayPlanStatusLabel}
              </LearningStatusBadge>
              <LearningStatusBadge tone="neutral">{plan.localDate}</LearningStatusBadge>
            </div>
          </div>
          <LearningCTAGroup className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Button asChild size="sm" className={todayFocusCtaClassName}>
              <a href="#full-view">完整视图</a>
            </Button>
            <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
              <a href="/review">复习入口</a>
            </Button>
          </LearningCTAGroup>
        </div>
      ),
    },
    {
      id: "lesson",
      title: "主课通读",
      eyebrow: "第 2 步",
      description: "用 Markdown 结构读完正文，重点看标题、列表、代码块和例子。",
      guidance: {
        task: "读完正文，标出核心直觉、公式、代码片段和不懂的一句话。",
        reason: "先建立概念骨架，再进入引导步骤和练习，避免直接做题变成猜答案。",
        completion: "能用自己的话复述本课核心概念，并找出一个还需要验证的点。",
      },
      status: "active",
      body: (
        <div className="rounded-lg border bg-card p-4">
          <LearningMarkdown content={plan.lesson.contentMarkdown} />
        </div>
      ),
    },
    {
      id: "guided",
      title: "引导步骤",
      eyebrow: "第 3 步",
      description: guidedSteps.length ? `逐步完成 ${guidedSteps.length} 个引导问题。` : "今天没有引导步骤。",
      guidance: {
        task: guidedSteps.length ? "逐题写下自己的推理，不要只看答案。" : "确认本课没有引导步骤，直接进入下一阶段。",
        reason: "引导问题把被动阅读转成主动回忆，是生成长期记忆的关键步骤。",
        completion: guidedSteps.length ? "每个引导问题都有自己的回答或明确卡住点。" : "已跳过引导步骤并进入代码或测验。",
      },
      status: guidedStatus,
      body: guidedSteps.length ? (
        <div className="rounded-lg border bg-card p-4">
          <GuidedSteps
            planId={plan.id}
            steps={guidedSteps}
            initialProgress={guidedProgress}
          />
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          今天没有引导步骤，可以直接进入代码或测验。
        </div>
      ),
    },
    {
      id: "code",
      title: "代码练习",
      eyebrow: "第 4 步",
      description: codingExercise ? "先保存实现思路，必要时请求 AI 反馈；服务端不会执行你的代码。" : "今天没有代码练习。",
      guidance: {
        task: codingExercise ? "写出函数主体、伪代码或最小实现，并保存一次提交。" : "确认本课没有代码练习，继续测验或知识卡。",
        reason: "把数学直觉转成代码，能暴露真正没有理解的变量、边界和流程。",
        completion: codingExercise ? "保存提交，至少有可解释的函数主体或伪代码。" : "已确认代码阶段无需动作。",
      },
      status: codingExercise ? (codeSubmission ? "done" : "todo") : "todo",
      body: codingExercise ? (
        <div className="rounded-lg border bg-card p-4">
          <CodeExercise
            lessonId={plan.lessonId}
            localDate={plan.localDate}
            exercise={codingExercise as TodayCodingExercise}
            submission={codeSubmission}
            feedback={codeFeedback}
            supported={codeSubmissionSupported}
          />
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          今天没有代码练习。
        </div>
      ),
    },
    {
      id: "quiz",
      title: "小测验",
      eyebrow: "第 5 步",
      description: quizQuestions.length ? "提交答案后看解析，把错误点交给复习系统。" : "今天没有测验题。",
      guidance: {
        task: quizQuestions.length ? "完成小测验，错题要看解析而不是只看分数。" : "确认本课没有测验题，继续知识卡或反思。",
        reason: "测验负责检查刚读过的概念是否能被主动调用。",
        completion: quizQuestions.length ? "每道题都已提交，并知道至少一个正确或错误原因。" : "已确认测验阶段无需动作。",
      },
      status: quizStatus,
      body: (
        <div className="rounded-lg border bg-card p-4">
          {quizQuestions.length ? (
            <TodayQuiz questions={quizQuestions} />
          ) : (
            <div className="text-sm text-muted-foreground">暂无测验题。</div>
          )}
        </div>
      ),
    },
    {
      id: "knowledge",
      title: "术语与广度",
      eyebrow: "第 6 步",
      description: "把今日术语、人物、公司或 Benchmark 连接到长期知识库。",
      guidance: {
        task: "阅读今日术语和广度卡，把陌生名词连接到知识库。",
        reason: "AI 学习需要长期积累术语、人物、公司和 Benchmark 的关系。",
        completion: "能说出今日术语或广度卡为什么和主课有关。",
      },
      status: knowledgeStatus,
      body: (
        <div className="grid gap-4 lg:grid-cols-2">
          {glossary ? (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">今日术语</div>
                {glossaryDetail ? (
                  <Badge variant="outline">{formatGlossaryCategoryLabel(glossaryDetail.category)}</Badge>
                ) : null}
              </div>
              <div className="mt-2 text-sm">{glossary.term}</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {glossary.definition}
              </div>
              {glossary.selfCheckQuestion ? (
                <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                  自测：{glossary.selfCheckQuestion}
                </div>
              ) : null}
            </div>
          ) : null}
          {breadth ? (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">今日广度小卡</div>
                {breadthDetail ? <Badge variant="outline">{breadthConfidenceLabel}</Badge> : null}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                类型：{breadthTypeLabel}
              </div>
              <div className="mt-1 text-sm">{breadth.title}</div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {breadth.oneLine ?? breadth.blurb ?? ""}
              </div>
              {breadth.selfCheckQuestion ? (
                <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                  自测：{breadth.selfCheckQuestion}
                </div>
              ) : null}
            </div>
          ) : null}
          {!glossary && !breadth ? (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              今天没有术语或广度卡。
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "reflection",
      title: "反思与完成",
      eyebrow: "第 7 步",
      description: plan.status === "completed" ? "今日学习已完成，下一步进入复习或笔记。" : "写一句自己的总结，然后生成复习卡片。",
      guidance: {
        task: plan.status === "completed" ? "选择复习、笔记、Coach 或项目实践中的下一步。" : "写一句自己的总结，并提交完成今日学习。",
        reason: "反思把今天的内容变成可复习卡片，下一步 CTA 负责保持学习连续性。",
        completion: plan.status === "completed" ? "已选择一个后续动作继续推进。" : "完成提交并生成今日复习卡片。",
      },
      status: plan.status === "completed" ? "done" : "todo",
      body: (
        <div className="grid gap-3">
          <div className="rounded-lg border bg-card p-4">
            <form action={completeTodayAction} className="grid gap-3">
              <input type="hidden" name="date" value={plan.date.toISOString()} />
              <div className="text-sm text-muted-foreground">
                写一句总结（完成后会生成复习卡片）
              </div>
              <textarea
                name="reflection"
                className="min-h-32 w-full rounded-lg border bg-transparent p-3 text-sm outline-none"
                placeholder="今天我学到了..."
                defaultValue={plan.reflection ?? ""}
              />
              <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
                <Button type="submit" disabled={plan.status === "completed"} className={todayFocusCtaClassName}>
                  {plan.status === "completed" ? "已完成" : "标记完成并生成卡片"}
                </Button>
                <div className="text-xs text-muted-foreground">
                  当前状态：{todayPlanStatusLabel} / 卡片：{flashcardCount}
                </div>
              </div>
            </form>
          </div>
          <LearningCompletionCard completion={completionNextActions} />
        </div>
      ),
    },
  ];

  return (
    <AppShell
      activePath="/today"
      title="今日学习"
      missionBanner={
        <CurrentMissionCard
          mission={currentMission.mission}
          signals={currentMission.signals}
          progress={currentMission.progress}
          title="当前任务"
        />
      }
      actions={
        <form action={generateTodayAction}>
          <Button size="sm" type="submit" className={todayFocusCtaClassName}>
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

      {remediationIntent ? (
        <TodayRemediationBanner intent={remediationIntent} className="mb-4" />
      ) : null}

      <LearningFocusPlayer
        stages={focusStages}
        overview={focusOverview}
        actions={
          <>
            <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
              <a href="#full-view">查看完整课程内容</a>
            </Button>
            <Button asChild size="sm" variant="outline" className={todayFocusCtaClassName}>
              <a href="#today-reflection">完成沉淀</a>
            </Button>
          </>
        }
        className="mb-4"
      />

      <CollapsibleContentSection
        id="full-view"
        title="查看完整课程内容"
        description="专注模式下方保留完整课程页面，按需展开。"
      >
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
                  {todayPlanStatusLabel}
                </LearningStatusBadge>
                <LearningStatusBadge tone="neutral">{plan.localDate}</LearningStatusBadge>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              你现在要做的事很简单：按步骤走完，最后写一句自己的总结。
            </div>
            <LearningCTAGroup className="mt-3 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
              <Button asChild size="sm" className={todayFocusCtaClassName}>
                <a href="#today-guided">继续步骤</a>
              </Button>
              <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
                <a href="#today-quiz">去做小测验</a>
              </Button>
              <Button asChild size="sm" variant="outline" className={todayFocusCtaClassName}>
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
                        <Badge variant="outline">{formatGlossaryCategoryLabel(glossaryDetail.category)}</Badge>
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
                    <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
                      <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
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
                        <Badge variant="outline">{breadthConfidenceLabel}</Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      类型：{breadthTypeLabel}
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
                    <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
                      <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
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

            <div id="today-reflection" className="grid gap-3">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
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
                  <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
                    <Button type="submit" disabled={plan.status === "completed"} className={todayFocusCtaClassName}>
                      {plan.status === "completed" ? "已完成" : "标记完成并生成卡片"}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      当前状态：{todayPlanStatusLabel} / 卡片：{flashcardCount}
                    </div>
                  </div>
                </form>
              </div>
              <LearningCompletionCard completion={completionNextActions} />
            </div>
          </div>

          <div className="grid gap-4">
            <CurrentMissionCard
              mission={currentMission.mission}
              signals={currentMission.signals}
              progress={currentMission.progress}
              title="当前任务"
            />
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
                <Button asChild size="sm" variant="secondary" className={todayFocusCtaClassName}>
                  <Link href="/review">{reviewSummary.ctaLabel}</Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled
                  className={todayFocusCtaClassName}
                >
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
                  {todayPlanStatusLabel}
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
                <span>{todayPlanSourceLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">内容版本</span>
                <span className="font-mono">{plan.schemaVersion ?? "未标记"}</span>
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
      </CollapsibleContentSection>
    </AppShell>
  );
}
