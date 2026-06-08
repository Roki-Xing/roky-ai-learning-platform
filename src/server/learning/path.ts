import {
  getCurrentMissionData,
  type CurrentMission,
  type CurrentMissionSignal,
} from "@/server/learning/current-mission";
import { prisma } from "@/server/db";

type CriterionKind =
  | "minLessons"
  | "minReviewedCards"
  | "minCodeSubmissions"
  | "maxOpenMisconceptions"
  | "minStartedProjects"
  | "minCompletedMilestones"
  | "minKnowledgeCards";

type StageCriterionConfig = {
  kind: CriterionKind;
  label: string;
  target: number;
  helper: string;
};

type LearningPathStageConfig = {
  id: string;
  title: string;
  summary: string;
  whyThisStage: string;
  completionStandard: string;
  domains: string[];
  href: string;
  ctaLabel: string;
  criteria: StageCriterionConfig[];
};

type DomainProgressStat = {
  slug: string;
  label: string;
  completedLessons: number;
  plannedLessons: number;
  dueFlashcardCount: number;
  reviewedFlashcards: number;
  quizAttempts: number;
  correctQuizAnswers: number;
  codeSubmissions: number;
  activeMisconceptions: number;
  lastStudiedLocalDate: string | null;
};

type LearningPathStageMetrics = {
  completedLessons: number;
  plannedLessons: number;
  dueFlashcardCount: number;
  reviewedFlashcards: number;
  quizAttempts: number;
  correctQuizAnswers: number;
  quizAccuracy: number;
  codeSubmissions: number;
  activeMisconceptions: number;
  startedProjects: number;
  completedMilestones: number;
  totalMilestones: number;
  knowledgeCardsReviewed: number;
  lastStudiedLocalDate: string | null;
};

export type LearningPathCriterion = {
  label: string;
  current: number;
  target: number;
  targetLabel: string;
  done: boolean;
  helper: string;
};

export type LearningPathStageStatus = "completed" | "current" | "upcoming";

export type LearningPathStage = {
  id: string;
  title: string;
  summary: string;
  whyThisStage: string;
  completionStandard: string;
  href: string;
  ctaLabel: string;
  domains: string[];
  status: LearningPathStageStatus;
  statusLabel: string;
  progressRatio: number;
  metrics: LearningPathStageMetrics;
  criteria: LearningPathCriterion[];
  blockers: string[];
  unlockCondition: string;
  nextTopic: string;
};

export type LearningPathFocus = {
  lessonTitle: string | null;
  domainLabel: string | null;
  reason: string;
  localDate: string | null;
};

export type LearningPathData = {
  mission: CurrentMission;
  missionSignals: CurrentMissionSignal[];
  currentStage: LearningPathStage;
  nextStage: LearningPathStage | null;
  todayFocus: LearningPathFocus;
  stages: LearningPathStage[];
};

export type LearningPathSnapshotInput = {
  mission: CurrentMission;
  missionSignals: CurrentMissionSignal[];
  todayFocus: {
    lessonTitle: string | null;
    domainSlug: string | null;
    reason: string | null;
    localDate: string | null;
  };
  domainStats: DomainProgressStat[];
  startedProjects: number;
  completedMilestones: number;
  totalMilestones: number;
  knowledgeCardsReviewed: number;
};

const LEARNING_PATH_STAGES: LearningPathStageConfig[] = [
  {
    id: "python-expression",
    title: "Python 表达能力",
    summary: "先把函数、调试、类型提示和边界表达说清楚。",
    whyThisStage: "没有稳定的代码表达，后面的算法、RAG 和项目都会反复卡在实现细节。",
    completionStandard: "至少完成 3 节 Python 主课，复习 6 张相关卡，并做 2 次最小代码练习。",
    domains: ["python-coding"],
    href: "/map?domain=python-coding",
    ctaLabel: "看 Python 进展",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 3,
        helper: "先把函数、调试和边界用例讲清楚。",
      },
      {
        kind: "minReviewedCards",
        label: "已复习卡片",
        target: 6,
        helper: "让 Python 常见坑进入主动回忆。",
      },
      {
        kind: "minCodeSubmissions",
        label: "代码练习",
        target: 2,
        helper: "至少写两次最小实现，不要只看不写。",
      },
    ],
  },
  {
    id: "data-structures",
    title: "数据结构基础",
    summary: "数组、哈希表、栈队列和树图是算法表达的底座。",
    whyThisStage: "如果常见数据结构不熟，做题和写项目都会频繁选错表示方式。",
    completionStandard: "至少完成 3 节数据结构主课，复习 6 张卡，并做 2 次相关代码练习。",
    domains: ["data-structures"],
    href: "/map?domain=data-structures",
    ctaLabel: "看数据结构进展",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 3,
        helper: "覆盖数组、哈希表、栈队列中的核心模式。",
      },
      {
        kind: "minReviewedCards",
        label: "已复习卡片",
        target: 6,
        helper: "把常见结构的选择条件记牢。",
      },
      {
        kind: "minCodeSubmissions",
        label: "代码练习",
        target: 2,
        helper: "通过实现把抽象结构落到代码里。",
      },
    ],
  },
  {
    id: "algorithm-patterns",
    title: "算法模式入门",
    summary: "二分、双指针、动态规划和图搜索是后续题解与工程问题的模式库。",
    whyThisStage: "掌握模式比背题更重要，它决定你能否把问题归类并写出稳定解法。",
    completionStandard: "至少完成 3 节算法主课，复习 8 张卡，并做 2 次算法实现练习。",
    domains: ["algorithm-design"],
    href: "/map?domain=algorithm-design",
    ctaLabel: "看算法进展",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 3,
        helper: "先把二分、双指针和 DP 走通。",
      },
      {
        kind: "minReviewedCards",
        label: "已复习卡片",
        target: 8,
        helper: "把边界条件和不变量留在记忆里。",
      },
      {
        kind: "minCodeSubmissions",
        label: "代码练习",
        target: 2,
        helper: "至少做两次最小实现，别只停留在口头理解。",
      },
    ],
  },
  {
    id: "llm-rag-agent",
    title: "LLM / RAG / Agent",
    summary: "把 AI 基础、模型直觉和 RAG / Agent 串成一条可解释主线。",
    whyThisStage: "你最终关心的是会用会解释，而不是零散术语；这一步把概念连成系统。",
    completionStandard: "至少完成 5 节相关主课，复习 10 张卡，并把活跃误区压到 1 个以内。",
    domains: ["ai-fundamentals", "ml", "dl", "llm-rag-agent"],
    href: "/map?domain=llm-rag-agent",
    ctaLabel: "看 LLM 路线",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 5,
        helper: "把基础、模型和 RAG / Agent 串起来。",
      },
      {
        kind: "minReviewedCards",
        label: "已复习卡片",
        target: 10,
        helper: "核心术语和流程不能只靠当天记忆。",
      },
      {
        kind: "maxOpenMisconceptions",
        label: "活跃误区",
        target: 1,
        helper: "进入工程实践前，先把主要概念误区压下去。",
      },
    ],
  },
  {
    id: "ai-engineering",
    title: "AI 工程实践",
    summary: "把数据、训练、推理、部署和可靠性意识接到真实系统上。",
    whyThisStage: "会讲概念还不够，工程阶段要开始关心数据流、成本、监控和稳定性。",
    completionStandard: "至少完成 3 节工程主课，做 2 次代码练习，并把活跃误区压到 1 个以内。",
    domains: ["ai-engineering", "review-remediation"],
    href: "/progress",
    ctaLabel: "看工程薄弱点",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 3,
        helper: "至少把数据、推理和部署三块走一遍。",
      },
      {
        kind: "minCodeSubmissions",
        label: "代码练习",
        target: 2,
        helper: "把工程概念落成可运行实现。",
      },
      {
        kind: "maxOpenMisconceptions",
        label: "活跃误区",
        target: 1,
        helper: "工程阶段的误区要尽快收口，避免带进项目。",
      },
    ],
  },
  {
    id: "project-application",
    title: "项目综合应用",
    summary: "把前面的知识压进能跑起来的小项目和里程碑交付里。",
    whyThisStage: "项目会强迫你把理解、实现、调试和复盘放在同一条链路里。",
    completionStandard: "至少开始 1 个项目，并完成 2 个 milestone，形成真实交付闭环。",
    domains: ["projects"],
    href: "/projects",
    ctaLabel: "去项目实践",
    criteria: [
      {
        kind: "minStartedProjects",
        label: "已开始项目",
        target: 1,
        helper: "先跑起一个项目，不要只停留在模板浏览。",
      },
      {
        kind: "minCompletedMilestones",
        label: "已完成 milestone",
        target: 2,
        helper: "至少完成两个里程碑，进入真实反馈循环。",
      },
    ],
  },
  {
    id: "papers-benchmarks-breadth",
    title: "论文 / Benchmark / 行业广度",
    summary: "把论文、评测和行业信息变成可解释的长期广度，而不是一次性刷资讯。",
    whyThisStage: "到这一步，重点不是追新，而是知道如何定位论文、benchmark 和生态变化。",
    completionStandard: "至少完成 2 节相关主课，复习 4 张卡，并累计 6 张广度/术语知识卡复习记录。",
    domains: ["papers-benchmarks", "people-companies-tools"],
    href: "/radar",
    ctaLabel: "去看 AI Radar",
    criteria: [
      {
        kind: "minLessons",
        label: "主课完成",
        target: 2,
        helper: "至少把论文阅读和 benchmark 对比走起来。",
      },
      {
        kind: "minReviewedCards",
        label: "已复习卡片",
        target: 4,
        helper: "把 benchmark、工具和人物卡片真的复习过。",
      },
      {
        kind: "minKnowledgeCards",
        label: "广度知识卡",
        target: 6,
        helper: "术语库和 AI Radar 至少要有一批真实复习记录。",
      },
    ],
  },
];

function latestLocalDate(a: string | null, b: string | null) {
  if (!a) return b;
  if (!b) return a;
  return a.localeCompare(b) >= 0 ? a : b;
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function stageStatusLabel(status: LearningPathStageStatus) {
  switch (status) {
    case "completed":
      return "已达成";
    case "current":
      return "当前阶段";
    default:
      return "下一阶段";
  }
}

function formatTargetLabel(config: StageCriterionConfig) {
  if (config.kind === "maxOpenMisconceptions") return `<= ${config.target}`;
  return String(config.target);
}

function criterionProgress(current: number, config: StageCriterionConfig) {
  if (config.kind === "maxOpenMisconceptions") {
    return current <= config.target ? 1 : clamp01(config.target / Math.max(current, 1));
  }
  return clamp01(current / Math.max(config.target, 1));
}

function buildCriterion(
  config: StageCriterionConfig,
  metrics: LearningPathStageMetrics,
): LearningPathCriterion {
  const current =
    config.kind === "minLessons"
      ? metrics.completedLessons
      : config.kind === "minReviewedCards"
        ? metrics.reviewedFlashcards
        : config.kind === "minCodeSubmissions"
          ? metrics.codeSubmissions
          : config.kind === "maxOpenMisconceptions"
            ? metrics.activeMisconceptions
            : config.kind === "minStartedProjects"
              ? metrics.startedProjects
              : config.kind === "minCompletedMilestones"
                ? metrics.completedMilestones
                : metrics.knowledgeCardsReviewed;

  return {
    label: config.label,
    current,
    target: config.target,
    targetLabel: formatTargetLabel(config),
    done:
      config.kind === "maxOpenMisconceptions"
        ? current <= config.target
        : current >= config.target,
    helper: config.helper,
  };
}

function aggregateStageMetrics(
  config: LearningPathStageConfig,
  domainStats: DomainProgressStat[],
  input: LearningPathSnapshotInput,
) {
  const metrics: LearningPathStageMetrics = {
    completedLessons: 0,
    plannedLessons: 0,
    dueFlashcardCount: 0,
    reviewedFlashcards: 0,
    quizAttempts: 0,
    correctQuizAnswers: 0,
    quizAccuracy: 0,
    codeSubmissions: 0,
    activeMisconceptions: 0,
    startedProjects: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    knowledgeCardsReviewed: 0,
    lastStudiedLocalDate: null,
  };

  for (const stat of domainStats) {
    if (!config.domains.includes(stat.slug)) continue;
    metrics.completedLessons += stat.completedLessons;
    metrics.plannedLessons += stat.plannedLessons;
    metrics.dueFlashcardCount += stat.dueFlashcardCount;
    metrics.reviewedFlashcards += stat.reviewedFlashcards;
    metrics.quizAttempts += stat.quizAttempts;
    metrics.correctQuizAnswers += stat.correctQuizAnswers;
    metrics.codeSubmissions += stat.codeSubmissions;
    metrics.activeMisconceptions += stat.activeMisconceptions;
    metrics.lastStudiedLocalDate = latestLocalDate(
      metrics.lastStudiedLocalDate,
      stat.lastStudiedLocalDate,
    );
  }

  if (config.id === "project-application") {
    metrics.startedProjects = input.startedProjects;
    metrics.completedMilestones = input.completedMilestones;
    metrics.totalMilestones = input.totalMilestones;
  }

  if (config.id === "papers-benchmarks-breadth") {
    metrics.knowledgeCardsReviewed = input.knowledgeCardsReviewed;
  }

  metrics.quizAccuracy = metrics.quizAttempts
    ? Math.round((metrics.correctQuizAnswers / metrics.quizAttempts) * 100)
    : 0;

  return metrics;
}

function buildStageBlockers(
  config: LearningPathStageConfig,
  metrics: LearningPathStageMetrics,
) {
  const blockers: string[] = [];
  if (metrics.dueFlashcardCount > 0) {
    blockers.push(`到期卡片 ${metrics.dueFlashcardCount}`);
  }
  if (metrics.activeMisconceptions > 0) {
    blockers.push(`活跃误区 ${metrics.activeMisconceptions}`);
  }
  if (
    config.criteria.some((criterion) => criterion.kind === "minCodeSubmissions") &&
    metrics.codeSubmissions === 0 &&
    metrics.completedLessons + metrics.plannedLessons > 0
  ) {
    blockers.push("代码练习偏少");
  }
  if (config.id === "project-application" && metrics.startedProjects === 0) {
    blockers.push("还没有启动项目");
  }
  return blockers;
}

function formatCriterionProgress(criterion: LearningPathCriterion) {
  return `${criterion.current}/${criterion.targetLabel}`;
}

function buildUnlockCondition(criteria: LearningPathCriterion[]) {
  const unmet = criteria.filter((criterion) => !criterion.done);
  if (!unmet.length) {
    return "当前阶段已满足解锁条件，可以进入下一阶段。";
  }
  return `还差：${unmet
    .map((criterion) => `${criterion.label} ${formatCriterionProgress(criterion)}`)
    .join("、")}`;
}

function buildNextTopic(
  config: LearningPathStageConfig,
  criteria: LearningPathCriterion[],
  input: LearningPathSnapshotInput,
) {
  const todayDomain = input.todayFocus.domainSlug ?? "";
  const todayLesson = input.todayFocus.lessonTitle?.trim();
  if (todayLesson && config.domains.includes(todayDomain)) {
    return `继续完成：${todayLesson}`;
  }

  const firstUnmet = criteria.find((criterion) => !criterion.done);
  if (firstUnmet) {
    return `${config.title}：补齐${firstUnmet.label}`;
  }
  return `${config.title}：保持复习并进入下一阶段`;
}

function buildTodayFocus(input: LearningPathSnapshotInput, currentStage: LearningPathStage) {
  return {
    lessonTitle: input.todayFocus.lessonTitle,
    domainLabel: currentStage.title,
    reason:
      input.todayFocus.reason?.trim() ||
      `${currentStage.title} 还在推进中，所以今天继续补这条主线。`,
    localDate: input.todayFocus.localDate,
  } satisfies LearningPathFocus;
}

export function buildLearningPathSnapshot(
  input: LearningPathSnapshotInput,
): LearningPathData {
  const stagesWithoutStatus = LEARNING_PATH_STAGES.map((config) => {
    const metrics = aggregateStageMetrics(config, input.domainStats, input);
    const criteria = config.criteria.map((criterion) => buildCriterion(criterion, metrics));
    const progressRatio = criteria.length
      ? criteria.reduce(
          (sum, criterion, index) => sum + criterionProgress(criterion.current, config.criteria[index]!),
          0,
        ) / criteria.length
      : 0;

    return {
      id: config.id,
      title: config.title,
      summary: config.summary,
      whyThisStage: config.whyThisStage,
      completionStandard: config.completionStandard,
      href: config.href,
      ctaLabel: config.ctaLabel,
      domains: config.domains,
      status: "upcoming" as LearningPathStageStatus,
      statusLabel: stageStatusLabel("upcoming"),
      progressRatio,
      metrics,
      criteria,
      blockers: buildStageBlockers(config, metrics),
      unlockCondition: buildUnlockCondition(criteria),
      nextTopic: buildNextTopic(config, criteria, input),
    } satisfies LearningPathStage;
  });

  const focusStageId =
    stagesWithoutStatus.find((stage) => stage.domains.includes(input.todayFocus.domainSlug ?? ""))
      ?.id ??
    stagesWithoutStatus.find((stage) => stage.criteria.some((criterion) => !criterion.done))?.id ??
    stagesWithoutStatus[0]?.id;

  const currentStageIndex = Math.max(
    0,
    stagesWithoutStatus.findIndex((stage) => stage.id === focusStageId),
  );

  const stages = stagesWithoutStatus.map((stage, index) => {
    const allCriteriaDone = stage.criteria.every((criterion) => criterion.done);
    const status: LearningPathStageStatus =
      stage.id === focusStageId
        ? "current"
        : allCriteriaDone && index < currentStageIndex
          ? "completed"
          : allCriteriaDone && index === currentStageIndex
            ? "completed"
            : "upcoming";

    return {
      ...stage,
      status,
      statusLabel: stageStatusLabel(status),
    } satisfies LearningPathStage;
  });

  const currentStage = stages[currentStageIndex] ?? stages[0]!;
  const nextStage = stages[currentStageIndex + 1] ?? null;

  return {
    mission: input.mission,
    missionSignals: input.missionSignals,
    currentStage,
    nextStage,
    todayFocus: buildTodayFocus(input, currentStage),
    stages,
  };
}

export async function getLearningPathData(userId: string) {
  const currentMission = await getCurrentMissionData(userId);
  const activeOfficialPlanWhere = { userId, isTest: false, archivedAt: null };
  const now = new Date();

  const [
    todayPlan,
    plans,
    flashcards,
    quizAttempts,
    codeSubmissions,
    misconceptions,
    projects,
    glossaryReviewed,
    radarReviewed,
  ] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { ...activeOfficialPlanWhere, localDate: currentMission.todayLocalDate },
      orderBy: [{ createdAt: "desc" }],
      select: {
        localDate: true,
        selectionReason: true,
        selectedDomain: true,
        lesson: {
          select: {
            title: true,
            topic: { select: { domain: { select: { slug: true } } } },
          },
        },
      },
    }),
    prisma.dailyPlan.findMany({
      where: activeOfficialPlanWhere,
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      select: {
        lessonId: true,
        localDate: true,
        status: true,
        selectedDomain: true,
        lesson: {
          select: {
            topic: {
              select: {
                domain: {
                  select: { slug: true, name: true },
                },
              },
            },
          },
        },
      },
      take: 500,
    }),
    prisma.flashcard.findMany({
      where: {
        userId,
        lesson: {
          is: {
            dailyPlans: {
              some: activeOfficialPlanWhere,
            },
          },
        },
      },
      select: {
        lessonId: true,
        dueAt: true,
        reviewCount: true,
      },
      take: 1500,
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
        question: {
          lesson: {
            dailyPlans: {
              some: activeOfficialPlanWhere,
            },
          },
        },
      },
      select: {
        isCorrect: true,
        question: { select: { lessonId: true } },
      },
      take: 1500,
    }),
    prisma.codeSubmission.findMany({
      where: { userId },
      select: { lessonId: true },
      take: 1000,
    }).catch(() => []),
    prisma.misconception.findMany({
      where: { userId },
      select: { lessonId: true, status: true },
      take: 1000,
    }),
    prisma.learningProject.findMany({
      where: { userId },
      select: {
        id: true,
        milestones: { select: { id: true, status: true } },
      },
      take: 50,
    }).catch(() => []),
    prisma.flashcard.count({
      where: {
        userId,
        lessonId: null,
        tags: { array_contains: ["glossary"] },
        reviewCount: { gt: 0 },
      },
    }).catch(() => 0),
    prisma.flashcard.count({
      where: {
        userId,
        lessonId: null,
        tags: { array_contains: ["radar"] },
        reviewCount: { gt: 0 },
      },
    }).catch(() => 0),
  ]);

  const domainStats = new Map<string, DomainProgressStat>();
  const lessonSignalById = new Map(
    plans.map((plan) => [
      plan.lessonId,
      {
        domainSlug: plan.selectedDomain ?? plan.lesson.topic.domain.slug,
        domainName: plan.lesson.topic.domain.name,
      },
    ]),
  );

  function ensureDomainStat(slug: string, label: string) {
    const current = domainStats.get(slug);
    if (current) return current;
    const next = {
      slug,
      label,
      completedLessons: 0,
      plannedLessons: 0,
      dueFlashcardCount: 0,
      reviewedFlashcards: 0,
      quizAttempts: 0,
      correctQuizAnswers: 0,
      codeSubmissions: 0,
      activeMisconceptions: 0,
      lastStudiedLocalDate: null,
    } satisfies DomainProgressStat;
    domainStats.set(slug, next);
    return next;
  }

  for (const plan of plans) {
    const slug = plan.selectedDomain ?? plan.lesson.topic.domain.slug;
    const current = ensureDomainStat(slug, plan.lesson.topic.domain.name);
    current.plannedLessons += 1;
    if (plan.status === "completed") current.completedLessons += 1;
    current.lastStudiedLocalDate = latestLocalDate(current.lastStudiedLocalDate, plan.localDate);
  }

  for (const flashcard of flashcards) {
    if (!flashcard.lessonId) continue;
    const signal = lessonSignalById.get(flashcard.lessonId);
    if (!signal) continue;
    const current = ensureDomainStat(signal.domainSlug, signal.domainName);
    if (flashcard.dueAt <= now) current.dueFlashcardCount += 1;
    if (flashcard.reviewCount > 0) current.reviewedFlashcards += 1;
  }

  for (const attempt of quizAttempts) {
    const signal = lessonSignalById.get(attempt.question.lessonId);
    if (!signal) continue;
    const current = ensureDomainStat(signal.domainSlug, signal.domainName);
    current.quizAttempts += 1;
    if (attempt.isCorrect) current.correctQuizAnswers += 1;
  }

  for (const submission of codeSubmissions) {
    const signal = lessonSignalById.get(submission.lessonId);
    if (!signal) continue;
    ensureDomainStat(signal.domainSlug, signal.domainName).codeSubmissions += 1;
  }

  for (const misconception of misconceptions) {
    if (!misconception.lessonId) continue;
    const signal = lessonSignalById.get(misconception.lessonId);
    if (!signal) continue;
    if (misconception.status === "open" || misconception.status === "active") {
      ensureDomainStat(signal.domainSlug, signal.domainName).activeMisconceptions += 1;
    }
  }

  const startedProjects = projects.length;
  const completedMilestones = projects.reduce(
    (sum, project) => sum + project.milestones.filter((milestone) => milestone.status === "completed").length,
    0,
  );
  const totalMilestones = projects.reduce((sum, project) => sum + project.milestones.length, 0);

  return buildLearningPathSnapshot({
    mission: currentMission.mission,
    missionSignals: currentMission.signals,
    todayFocus: {
      lessonTitle: todayPlan?.lesson.title ?? null,
      domainSlug: todayPlan?.selectedDomain ?? todayPlan?.lesson.topic.domain.slug ?? null,
      reason: todayPlan?.selectionReason ?? currentMission.mission.reason,
      localDate: todayPlan?.localDate ?? currentMission.todayLocalDate,
    },
    domainStats: [...domainStats.values()],
    startedProjects,
    completedMilestones,
    totalMilestones,
    knowledgeCardsReviewed: glossaryReviewed + radarReviewed,
  });
}
