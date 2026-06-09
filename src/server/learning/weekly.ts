import {
  buildProgressWeakDomainSummary,
  buildWeeklyRemediationPlan,
  type ProgressWeakDomainSummary,
  type WeeklyRemediationPlan,
} from "@/server/analytics/progress";
import { normalizeCodeFeedbackIssues } from "@/server/coding/view";
import { prisma } from "@/server/db";
import {
  getCurrentMissionData,
  type CurrentMission,
  type CurrentMissionProgress,
  type CurrentMissionSignal,
} from "@/server/learning/current-mission";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import {
  addDaysUTC,
  utcStartOfLocalDay,
} from "@/server/time/day";

type WeeklyDomainStat = {
  slug: string;
  label: string;
  completedLessons: number;
  plannedLessons: number;
  reviewedCount: number;
  dueFlashcardCount: number;
  quizAttemptCount: number;
  correctQuizCount: number;
  codeSubmissionCount: number;
  activeMisconceptionCount: number;
};

export type WeeklyLessonSummary = {
  localDate: string;
  lessonTitle: string;
  domainLabel: string;
};

export type WeeklyDomainHighlight = {
  label: string;
  summary: string;
};

export type WeeklyMistakeHighlight = {
  summary: string;
  source: string;
  occurrenceCount: number;
  lessonTitle: string | null;
};

export type WeeklyCodePractice = {
  submissionCount: number;
  feedbackCount: number;
  issueCount: number;
  topIssueType: string | null;
  latestFeedbackSummary: string | null;
};

export type WeeklyReviewRetention = {
  reviewedCount: number;
  retainedCount: number;
  retentionRate: number;
};

export type WeeklyActivityMetrics = {
  voiceNotes: number;
  coachReviews: number;
  completedProjectMilestones: number;
  newMisconceptions: number;
  resolvedMisconceptions: number;
  glossaryReviewed: number;
  radarReviewed: number;
};

export type WeeklyOverviewMetrics = WeeklyActivityMetrics & {
  studyDays: number;
  completedLessons: number;
  reviewedCards: number;
  quizAttempts: number;
  correctQuizCount: number;
  quizAccuracy: number;
  codeSubmissions: number;
};

export type WeeklyAiSummary = {
  mostImportantGain: string;
  mainWeakness: string;
  nextWeekSuggestion: string;
  recommendedNextStage: string;
};

export type WeeklyReviewData = {
  mission: CurrentMission;
  missionSignals: CurrentMissionSignal[];
  missionProgress: CurrentMissionProgress;
  windowLabel: string;
  weeklyOverview: WeeklyOverviewMetrics;
  weeklyReportMarkdown: string;
  lessons: WeeklyLessonSummary[];
  strongestDomain: WeeklyDomainHighlight | null;
  weakestDomain: ProgressWeakDomainSummary | null;
  topMistake: WeeklyMistakeHighlight | null;
  codePractice: WeeklyCodePractice;
  reviewRetention: WeeklyReviewRetention;
  nextWeekPlan: WeeklyRemediationPlan;
  aiSummary: WeeklyAiSummary;
};

export type WeeklySnapshotInput = {
  mission: CurrentMission;
  missionSignals: CurrentMissionSignal[];
  missionProgress: CurrentMissionProgress;
  windowLabel: string;
  lessons: WeeklyLessonSummary[];
  domains: WeeklyDomainStat[];
  topMistake: WeeklyMistakeHighlight | null;
  codePractice: WeeklyCodePractice;
  reviewRetention: WeeklyReviewRetention;
  dueFlashcardsCount: number;
  openMisconceptionsCount: number;
  codeFeedbackNeedsAttentionCount: number;
  activity: WeeklyActivityMetrics;
};

function addLocalDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map((value) => Number.parseInt(value, 10));
  const date = new Date(Date.UTC(year!, (month ?? 1) - 1, day ?? 1, 0, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function strongestDomainReason(stat: WeeklyDomainStat) {
  const parts = [
    `完成主课 ${stat.completedLessons}`,
    `复习 ${stat.reviewedCount}`,
  ];
  if (stat.codeSubmissionCount > 0) parts.push(`代码练习 ${stat.codeSubmissionCount}`);
  if (stat.quizAttemptCount > 0) {
    const accuracy = Math.round((stat.correctQuizCount / Math.max(stat.quizAttemptCount, 1)) * 100);
    parts.push(`测验正确率 ${accuracy}%`);
  }
  return parts.join(" / ");
}

function strongestDomainScore(stat: WeeklyDomainStat) {
  const accuracy = stat.quizAttemptCount
    ? Math.round((stat.correctQuizCount / Math.max(stat.quizAttemptCount, 1)) * 100)
    : 0;
  return (
    stat.completedLessons * 20 +
    stat.reviewedCount * 4 +
    stat.codeSubmissionCount * 10 +
    accuracy * 0.3 -
    stat.activeMisconceptionCount * 15 -
    stat.dueFlashcardCount * 5
  );
}

function tagsOf(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function buildWeeklyOverview(input: WeeklySnapshotInput): WeeklyOverviewMetrics {
  const quizAttempts = input.domains.reduce((sum, domain) => sum + domain.quizAttemptCount, 0);
  const correctQuizCount = input.domains.reduce((sum, domain) => sum + domain.correctQuizCount, 0);

  return {
    studyDays: new Set(input.lessons.map((lesson) => lesson.localDate)).size,
    completedLessons: input.lessons.length,
    reviewedCards: input.reviewRetention.reviewedCount,
    quizAttempts,
    correctQuizCount,
    quizAccuracy: quizAttempts ? Math.round((correctQuizCount / quizAttempts) * 100) : 0,
    codeSubmissions: input.codePractice.submissionCount,
    ...input.activity,
  };
}

export function weeklyMistakeSourceLabel(source: string) {
  const normalized = source.toLowerCase();
  if (normalized === "quiz") return "小测验";
  if (normalized === "code") return "代码反馈";
  if (normalized === "coach") return "Coach";
  if (normalized === "project") return "项目实践";
  if (normalized === "voice") return "语音笔记";
  if (normalized === "review") return "复习";
  return source;
}

export function weeklyCodeIssueTypeLabel(type: string | null | undefined) {
  if (!type) return "暂无";
  if (type === "logic") return "逻辑问题";
  if (type === "edge_case") return "边界条件";
  if (type === "complexity") return "复杂度问题";
  if (type === "style") return "代码风格";
  if (type === "syntax") return "语法问题";
  if (type === "concept") return "概念问题";
  return "一般问题";
}

function buildWeeklyAiSummary(args: {
  strongestDomain: WeeklyDomainHighlight | null;
  weakestDomain: ProgressWeakDomainSummary | null;
  topMistake: WeeklyMistakeHighlight | null;
  nextWeekPlan: WeeklyRemediationPlan;
}): WeeklyAiSummary {
  const mostImportantGain = args.strongestDomain
    ? `本周最重要收获来自 ${args.strongestDomain.label}：${args.strongestDomain.summary}。`
    : "还没有足够数据判断本周最重要收获，先恢复每日学习和复习节奏。";
  const mainWeakness = args.weakestDomain
    ? `主要薄弱点是 ${args.weakestDomain.label}：${args.weakestDomain.reason}。`
    : args.topMistake
      ? `主要薄弱点是 ${args.topMistake.summary}，建议先回到错题修复中心处理。`
      : "本周暂无明显薄弱点，继续保持主课、复习和项目实践。";

  return {
    mostImportantGain,
    mainWeakness,
    nextWeekSuggestion: args.nextWeekPlan.summary,
    recommendedNextStage: args.weakestDomain
      ? `优先补强 ${args.weakestDomain.label}`
      : args.strongestDomain
        ? `继续沿着 ${args.strongestDomain.label} 推进`
        : "先恢复每日主课节奏",
  };
}

function buildWeeklyReportMarkdown(args: {
  windowLabel: string;
  weeklyOverview: WeeklyOverviewMetrics;
  lessons: WeeklyLessonSummary[];
  strongestDomain: WeeklyDomainHighlight | null;
  weakestDomain: ProgressWeakDomainSummary | null;
  topMistake: WeeklyMistakeHighlight | null;
  codePractice: WeeklyCodePractice;
  reviewRetention: WeeklyReviewRetention;
  aiSummary: WeeklyAiSummary;
  nextWeekPlan: WeeklyRemediationPlan;
}) {
  const lessonLines = args.lessons.length
    ? args.lessons
        .slice(0, 7)
        .map((lesson) => `- ${lesson.localDate}：${lesson.lessonTitle}（${lesson.domainLabel}）`)
        .join("\n")
    : "- 本周还没有完成正式课程。";
  const nextStepLines = args.nextWeekPlan.steps.length
    ? args.nextWeekPlan.steps
        .map((step, index) => `${index + 1}. ${step.title}：${step.description}`)
        .join("\n")
    : "1. 先恢复每日主课和复习节奏。";

  return [
    "# Roky Learn 每周复盘",
    "",
    `周窗口：${args.windowLabel}`,
    "",
    "## 7 天总览",
    "",
    `- 学习天数：${args.weeklyOverview.studyDays}`,
    `- 完成课程：${args.weeklyOverview.completedLessons}`,
    `- 复习卡片：${args.weeklyOverview.reviewedCards}`,
    `- 小测验正确率：${args.weeklyOverview.quizAccuracy}%`,
    `- 代码提交：${args.weeklyOverview.codeSubmissions}`,
    `- 语音笔记：${args.weeklyOverview.voiceNotes}`,
    `- Coach 次数：${args.weeklyOverview.coachReviews}`,
    `- 项目里程碑：${args.weeklyOverview.completedProjectMilestones}`,
    `- 新增误区：${args.weeklyOverview.newMisconceptions}`,
    `- 已解决误区：${args.weeklyOverview.resolvedMisconceptions}`,
    `- 术语/Radar 覆盖：${args.weeklyOverview.glossaryReviewed}/${args.weeklyOverview.radarReviewed}`,
    "",
    "## 本周课程",
    "",
    lessonLines,
    "",
    "## 领域与错题",
    "",
    `- 最强领域：${args.strongestDomain ? `${args.strongestDomain.label}（${args.strongestDomain.summary}）` : "暂无足够数据"}`,
    `- 最弱领域：${args.weakestDomain ? `${args.weakestDomain.label}（${args.weakestDomain.reason}）` : "暂无明显弱项"}`,
    `- 错题最多：${args.topMistake ? `${args.topMistake.summary}（${weeklyMistakeSourceLabel(args.topMistake.source)}，${args.topMistake.occurrenceCount} 次）` : "暂无新错题"}`,
    "",
    "## 代码与复习",
    "",
    `- 代码提交：${args.codePractice.submissionCount}`,
    `- 代码反馈：${args.codePractice.feedbackCount}`,
    `- 高频问题：${weeklyCodeIssueTypeLabel(args.codePractice.topIssueType)}`,
    `- 复习留存率：${args.reviewRetention.retentionRate}%（${args.reviewRetention.retainedCount}/${args.reviewRetention.reviewedCount}）`,
    "",
    "## AI 周总结",
    "",
    `- 本周最重要收获：${args.aiSummary.mostImportantGain}`,
    `- 主要薄弱点：${args.aiSummary.mainWeakness}`,
    `- 下周建议：${args.aiSummary.nextWeekSuggestion}`,
    `- 推荐下一阶段：${args.aiSummary.recommendedNextStage}`,
    "",
    "## 下周建议",
    "",
    nextStepLines,
    "",
  ].join("\n");
}

export function buildWeeklyReviewSnapshot(
  input: WeeklySnapshotInput,
): WeeklyReviewData {
  const weakDomains = buildProgressWeakDomainSummary(
    input.domains.map((domain) => ({
      slug: domain.slug,
      label: domain.label,
      completedLessons: domain.completedLessons,
      plannedLessons: domain.plannedLessons,
      dueFlashcardCount: domain.dueFlashcardCount,
      activeMisconceptionCount: domain.activeMisconceptionCount,
      quizAttemptCount: domain.quizAttemptCount,
      correctQuizCount: domain.correctQuizCount,
      codeSubmissionCount: domain.codeSubmissionCount,
      lastStudiedLocalDate: null,
    })),
  );

  const strongestDomainStat = [...input.domains]
    .sort(
      (a, b) =>
        strongestDomainScore(b) - strongestDomainScore(a) ||
        b.completedLessons - a.completedLessons ||
        b.reviewedCount - a.reviewedCount,
    )[0] ?? null;
  const strongestDomain = strongestDomainStat
    ? {
        label: strongestDomainStat.label,
        summary: strongestDomainReason(strongestDomainStat),
      }
    : null;
  const weakestDomain = weakDomains[0] ?? null;
  const nextWeekPlan = buildWeeklyRemediationPlan({
    weakDomains,
    dueFlashcardsCount: input.dueFlashcardsCount,
    openMisconceptionsCount: input.openMisconceptionsCount,
    codeFeedbackCount: input.codeFeedbackNeedsAttentionCount,
  });
  const weeklyOverview = buildWeeklyOverview(input);
  const aiSummary = buildWeeklyAiSummary({
    strongestDomain,
    weakestDomain,
    topMistake: input.topMistake,
    nextWeekPlan,
  });

  return {
    mission: input.mission,
    missionSignals: input.missionSignals,
    missionProgress: input.missionProgress,
    windowLabel: input.windowLabel,
    weeklyOverview,
    weeklyReportMarkdown: buildWeeklyReportMarkdown({
      windowLabel: input.windowLabel,
      weeklyOverview,
      lessons: input.lessons,
      strongestDomain,
      weakestDomain,
      topMistake: input.topMistake,
      codePractice: input.codePractice,
      reviewRetention: input.reviewRetention,
      aiSummary,
      nextWeekPlan,
    }),
    lessons: input.lessons,
    strongestDomain,
    weakestDomain,
    topMistake: input.topMistake,
    codePractice: input.codePractice,
    reviewRetention: input.reviewRetention,
    nextWeekPlan,
    aiSummary,
  };
}

export async function getWeeklyReviewData(userId: string) {
  const profile = await getOrCreateUserProfile({ userId });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const currentMission = await getCurrentMissionData(userId);
  const todayLocalDate = currentMission.todayLocalDate;
  const weekStartLocalDate = addLocalDays(todayLocalDate, -6);
  const weekStartUtc = utcStartOfLocalDay({
    localDate: weekStartLocalDate,
    timeZone,
  });
  const weekEndUtc = addDaysUTC(
    utcStartOfLocalDay({ localDate: todayLocalDate, timeZone }),
    1,
  );
  const activeOfficialPlanWhere = { userId, isTest: false, archivedAt: null };

  const [
    plans,
    reviewLogs,
    quizAttempts,
    dueFlashcards,
    codeSubmissions,
    codeFeedback,
    misconceptions,
    voiceNoteCount,
    coachReviewCount,
    completedMilestoneCount,
    newMisconceptionCount,
    resolvedMisconceptionCount,
    knowledgeReviewLogs,
  ] = await Promise.all([
    prisma.dailyPlan.findMany({
      where: {
        ...activeOfficialPlanWhere,
        localDate: { gte: weekStartLocalDate, lte: todayLocalDate },
      },
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      select: {
        lessonId: true,
        localDate: true,
        status: true,
        selectedDomain: true,
        lesson: {
          select: {
            title: true,
            topic: {
              select: {
                domain: { select: { slug: true, name: true } },
              },
            },
          },
        },
      },
      take: 120,
    }),
    prisma.reviewLog.findMany({
      where: {
        createdAt: { gte: weekStartUtc, lt: weekEndUtc },
        flashcard: {
          userId,
          lesson: {
            is: {
              dailyPlans: {
                some: activeOfficialPlanWhere,
              },
            },
          },
        },
      },
      select: {
        rating: true,
        flashcard: {
          select: {
            lessonId: true,
            lesson: {
              select: {
                topic: {
                  select: {
                    domain: { select: { slug: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
      take: 1000,
    }),
    prisma.quizAttempt.findMany({
      where: {
        userId,
        createdAt: { gte: weekStartUtc, lt: weekEndUtc },
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
        question: {
          select: {
            lessonId: true,
            lesson: {
              select: {
                topic: {
                  select: {
                    domain: { select: { slug: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
      take: 1000,
    }),
    prisma.flashcard.findMany({
      where: {
        userId,
        dueAt: { lte: new Date() },
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
        lesson: {
          select: {
            topic: {
              select: {
                domain: { select: { slug: true, name: true } },
              },
            },
          },
        },
      },
      take: 1000,
    }),
    prisma.codeSubmission.findMany({
      where: {
        userId,
        localDate: { gte: weekStartLocalDate, lte: todayLocalDate },
      },
      select: { lessonId: true },
      take: 1000,
    }).catch(() => []),
    prisma.codeFeedback.findMany({
      where: {
        userId,
        localDate: { gte: weekStartLocalDate, lte: todayLocalDate },
      },
      orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
      select: {
        summary: true,
        issues: true,
      },
      take: 200,
    }).catch(() => []),
    prisma.misconception.findMany({
      where: {
        userId,
        OR: [
          { localDate: { gte: weekStartLocalDate, lte: todayLocalDate } },
          { lastAttemptAt: { gte: weekStartUtc, lt: weekEndUtc } },
        ],
      },
      orderBy: [{ occurrenceCount: "desc" }, { lastAttemptAt: "desc" }],
      select: {
        summary: true,
        source: true,
        occurrenceCount: true,
        lessonId: true,
        status: true,
      },
      take: 200,
    }),
    prisma.voiceNote.count({
      where: { userId, createdAt: { gte: weekStartUtc, lt: weekEndUtc } },
    }).catch(() => 0),
    prisma.thoughtReview.count({
      where: { userId, createdAt: { gte: weekStartUtc, lt: weekEndUtc } },
    }).catch(() => 0),
    prisma.projectMilestone.count({
      where: {
        userId,
        status: "completed",
        completedAt: { gte: weekStartUtc, lt: weekEndUtc },
      },
    }).catch(() => 0),
    prisma.misconception.count({
      where: { userId, createdAt: { gte: weekStartUtc, lt: weekEndUtc } },
    }),
    prisma.misconception.count({
      where: { userId, resolvedAt: { gte: weekStartUtc, lt: weekEndUtc } },
    }),
    prisma.reviewLog.findMany({
      where: {
        createdAt: { gte: weekStartUtc, lt: weekEndUtc },
        flashcard: {
          userId,
          lessonId: null,
          OR: [
            { tags: { array_contains: ["glossary"] } },
            { tags: { array_contains: ["radar"] } },
          ],
        },
      },
      select: {
        flashcard: { select: { tags: true } },
      },
      take: 1000,
    }).catch(() => []),
  ]);

  const lessonTitleById = new Map(plans.map((plan) => [plan.lessonId, plan.lesson.title]));
  const lessonDomainById = new Map(
    plans.map((plan) => [
      plan.lessonId,
      {
        slug: plan.selectedDomain ?? plan.lesson.topic.domain.slug,
        label: plan.lesson.topic.domain.name,
      },
    ]),
  );
  const domainStats = new Map<string, WeeklyDomainStat>();

  function ensureDomainStat(slug: string, label: string) {
    const current = domainStats.get(slug);
    if (current) return current;
    const next = {
      slug,
      label,
      completedLessons: 0,
      plannedLessons: 0,
      reviewedCount: 0,
      dueFlashcardCount: 0,
      quizAttemptCount: 0,
      correctQuizCount: 0,
      codeSubmissionCount: 0,
      activeMisconceptionCount: 0,
    } satisfies WeeklyDomainStat;
    domainStats.set(slug, next);
    return next;
  }

  for (const plan of plans) {
    const slug = plan.selectedDomain ?? plan.lesson.topic.domain.slug;
    const current = ensureDomainStat(slug, plan.lesson.topic.domain.name);
    current.plannedLessons += 1;
    if (plan.status === "completed") current.completedLessons += 1;
  }

  for (const log of reviewLogs) {
    const lesson = log.flashcard.lesson;
    const lessonId = log.flashcard.lessonId;
    if (!lesson || !lessonId) continue;
    ensureDomainStat(lesson.topic.domain.slug, lesson.topic.domain.name).reviewedCount += 1;
  }

  for (const attempt of quizAttempts) {
    const lesson = attempt.question.lesson;
    const current = ensureDomainStat(lesson.topic.domain.slug, lesson.topic.domain.name);
    current.quizAttemptCount += 1;
    if (attempt.isCorrect) current.correctQuizCount += 1;
  }

  for (const card of dueFlashcards) {
    if (!card.lessonId || !card.lesson) continue;
    const lesson = card.lesson;
    ensureDomainStat(lesson.topic.domain.slug, lesson.topic.domain.name).dueFlashcardCount += 1;
  }

  for (const submission of codeSubmissions) {
    const lessonDomain = lessonDomainById.get(submission.lessonId);
    if (!lessonDomain) continue;
    ensureDomainStat(lessonDomain.slug, lessonDomain.label).codeSubmissionCount += 1;
  }

  for (const misconception of misconceptions) {
    if (!misconception.lessonId) continue;
    const lessonDomain = lessonDomainById.get(misconception.lessonId);
    if (!lessonDomain) continue;
    if (misconception.status === "open" || misconception.status === "active") {
      ensureDomainStat(lessonDomain.slug, lessonDomain.label).activeMisconceptionCount += 1;
    }
  }

  const issueTypeCounts = new Map<string, number>();
  let issueCount = 0;
  for (const feedback of codeFeedback) {
    for (const issue of normalizeCodeFeedbackIssues(feedback.issues)) {
      issueCount += 1;
      issueTypeCounts.set(issue.type, (issueTypeCounts.get(issue.type) ?? 0) + 1);
    }
  }
  const topIssueType =
    [...issueTypeCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ??
    null;

  const retainedCount = reviewLogs.filter((log) => log.rating === "good" || log.rating === "easy").length;
  const reviewRetention = {
    reviewedCount: reviewLogs.length,
    retainedCount,
    retentionRate: reviewLogs.length
      ? Math.round((retainedCount / reviewLogs.length) * 100)
      : 0,
  } satisfies WeeklyReviewRetention;
  const glossaryReviewed = knowledgeReviewLogs.filter((log) => tagsOf(log.flashcard.tags).includes("glossary")).length;
  const radarReviewed = knowledgeReviewLogs.filter((log) => tagsOf(log.flashcard.tags).includes("radar")).length;

  return buildWeeklyReviewSnapshot({
    mission: currentMission.mission,
    missionSignals: currentMission.signals,
    missionProgress: currentMission.progress,
    windowLabel: `${weekStartLocalDate} ~ ${todayLocalDate}`,
    lessons: plans
      .filter((plan) => plan.status === "completed")
      .map((plan) => ({
        localDate: plan.localDate,
        lessonTitle: plan.lesson.title,
        domainLabel: plan.lesson.topic.domain.name,
      }))
      .slice(0, 7),
    domains: [...domainStats.values()],
    topMistake: misconceptions[0]
      ? {
          summary: misconceptions[0].summary,
          source: misconceptions[0].source,
          occurrenceCount: misconceptions[0].occurrenceCount,
          lessonTitle: misconceptions[0].lessonId
            ? (lessonTitleById.get(misconceptions[0].lessonId) ?? null)
            : null,
        }
      : null,
    codePractice: {
      submissionCount: codeSubmissions.length,
      feedbackCount: codeFeedback.length,
      issueCount,
      topIssueType,
      latestFeedbackSummary: codeFeedback[0]?.summary ?? null,
    },
    reviewRetention,
    dueFlashcardsCount: currentMission.input.dueFlashcardsCount,
    openMisconceptionsCount: currentMission.input.openMisconceptionCount,
    codeFeedbackNeedsAttentionCount: currentMission.input.codeFeedbackNeedsAttentionCount,
    activity: {
      voiceNotes: voiceNoteCount,
      coachReviews: coachReviewCount,
      completedProjectMilestones: completedMilestoneCount,
      newMisconceptions: newMisconceptionCount,
      resolvedMisconceptions: resolvedMisconceptionCount,
      glossaryReviewed,
      radarReviewed,
    },
  });
}
