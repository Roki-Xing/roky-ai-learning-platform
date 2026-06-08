import { normalizeCodeFeedbackIssues } from "@/server/coding/view";

export type CodingExerciseQuality = "missing" | "basic" | "strong";

export type ContentQualityMetrics = {
  contentLength: number;
  guidedStepCount: number;
  quizCount: number;
  codingExerciseQuality: CodingExerciseQuality;
  flashcardCount: number;
  schemaVersion: string | null;
  source: string | null;
  generationRetries: number;
  fallbackUsed: boolean;
};

export type LearningEffectMetrics = {
  quizAccuracy: number;
  reviewRetention: number;
  codeSubmissionRate: number;
  misconceptionResolutionRate: number;
  streak: number;
  domainCoverage: number;
  topicDiversity: number;
};

export type GenerationHealthMetrics = {
  totalPlans: number;
  deepseekPlanCount: number;
  fallbackPlanCount: number;
  successJobCount: number;
  failedJobCount: number;
  repairCount: number;
  fallbackRate: number;
  repairRate: number;
  averageQualityScore: number;
  lowQualityJobCount: number;
  qualityScoreCoverage: number;
  schemaVersionDistribution: Array<{ schemaVersion: string; count: number }>;
  modelDistribution: Array<{ model: string; count: number }>;
};

export type CalendarDay = {
  localDate: string;
  status: "none" | "planned" | "completed";
  intensity: number;
};

export type CodeFeedbackIssueTrendRow = {
  localDate: string;
  feedbackCount: number;
  issueCount: number;
  highIssueCount: number;
  mediumIssueCount: number;
  lowIssueCount: number;
  topIssueType: string | null;
};

export type ProgressWeakDomainInput = {
  slug: string;
  label: string;
  completedLessons: number;
  plannedLessons: number;
  dueFlashcardCount: number;
  activeMisconceptionCount: number;
  quizAttemptCount: number;
  correctQuizCount: number;
  codeSubmissionCount: number;
  lastStudiedLocalDate: string | null;
};

export type ProgressWeakDomainSummary = {
  slug: string;
  label: string;
  masteryScore: number;
  weaknessScore: number;
  quizAccuracy: number;
  completedLessons: number;
  plannedLessons: number;
  dueFlashcardCount: number;
  activeMisconceptionCount: number;
  codeSubmissionCount: number;
  lastStudiedLocalDate: string | null;
  reason: string;
};

export type WeeklyRemediationStep = {
  title: string;
  description: string;
  href: string;
  tone: "warning" | "danger" | "info" | "success";
};

export type WeeklyRemediationPlan = {
  title: string;
  summary: string;
  focusDomain: ProgressWeakDomainSummary | null;
  steps: WeeklyRemediationStep[];
};

export type ReviewRetentionTrendRow = {
  localDate: string;
  reviewed: number;
  retained: number;
  retentionRate: number;
};

export type QuizAccuracyTrendRow = {
  localDate: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

export type MisconceptionTrendRow = {
  localDate: string;
  total: number;
  active: number;
  resolved: number;
  ignored: number;
  resolutionRate: number;
};

type LessonQualityInput = {
  contentMarkdown: string;
  examples?: unknown;
  connections?: unknown;
  createdBy?: string | null;
};

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function codingQuality(value: unknown): CodingExerciseQuality {
  const exercise = asRecord(value);
  if (!Object.keys(exercise).length) return "missing";

  const hasTitle =
    typeof exercise.title === "string" && exercise.title.trim().length > 0;
  const visibleTests = asArray(exercise.visibleTests);
  const commonBugs = asArray(exercise.commonBugs);

  if (hasTitle && visibleTests.length > 0 && commonBugs.length > 0) {
    return "strong";
  }
  return "basic";
}

function textLength(content: string) {
  return content.trim().replace(/[。！？.,!?]/g, "").length;
}

export function calculateContentQuality(args: {
  lesson: LessonQualityInput;
  quizCount: number;
  flashcardCount: number;
  generationRetries?: number;
}) {
  const examples = asRecord(args.lesson.examples);
  const connections = asRecord(args.lesson.connections);
  const source = args.lesson.createdBy ?? null;

  return {
    contentLength: textLength(args.lesson.contentMarkdown),
    guidedStepCount: asArray(examples.guidedSteps).length,
    quizCount: args.quizCount,
    codingExerciseQuality: codingQuality(examples.codingExercise),
    flashcardCount: args.flashcardCount,
    schemaVersion:
      typeof connections.schemaVersion === "string" ? connections.schemaVersion : null,
    source,
    generationRetries: args.generationRetries ?? 0,
    fallbackUsed: source === "template",
  } satisfies ContentQualityMetrics;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateQualityScore(metrics: ContentQualityMetrics) {
  let score = 0;

  score += Math.min(25, Math.floor(metrics.contentLength / 40));
  score += Math.min(20, metrics.guidedStepCount * 4);
  score += Math.min(20, metrics.quizCount * 7);
  score += metrics.codingExerciseQuality === "strong"
    ? 15
    : metrics.codingExerciseQuality === "basic"
      ? 8
      : 0;
  score += Math.min(15, metrics.flashcardCount * 5);
  if (metrics.schemaVersion) score += 5;
  if (metrics.fallbackUsed) score -= 10;
  score -= metrics.generationRetries * 5;

  return clampPercent(score);
}

export function calculateLearningEffect(args: {
  quizAttempts: Array<{ isCorrect: boolean }>;
  reviewLogs: Array<{ rating: string }>;
  completedLessonCount: number;
  codeSubmissionCount: number;
  openMisconceptionCount: number;
  resolvedMisconceptionCount: number;
  streak: number;
  domainCoverageCount: number;
  topicDiversityCount: number;
}) {
  const quizAccuracy = args.quizAttempts.length
    ? (args.quizAttempts.filter((a) => a.isCorrect).length / args.quizAttempts.length) * 100
    : 0;
  const retainedRatings = new Set(["good", "easy"]);
  const reviewRetention = args.reviewLogs.length
    ? (args.reviewLogs.filter((log) => retainedRatings.has(log.rating)).length /
        args.reviewLogs.length) *
      100
    : 0;
  const codeSubmissionRate = args.completedLessonCount
    ? (args.codeSubmissionCount / args.completedLessonCount) * 100
    : 0;
  const totalMisconceptions =
    args.openMisconceptionCount + args.resolvedMisconceptionCount;
  const misconceptionResolutionRate = totalMisconceptions
    ? (args.resolvedMisconceptionCount / totalMisconceptions) * 100
    : 0;

  return {
    quizAccuracy: clampPercent(quizAccuracy),
    reviewRetention: clampPercent(reviewRetention),
    codeSubmissionRate: clampPercent(codeSubmissionRate),
    misconceptionResolutionRate: clampPercent(misconceptionResolutionRate),
    streak: args.streak,
    domainCoverage: args.domainCoverageCount,
    topicDiversity: args.topicDiversityCount,
  } satisfies LearningEffectMetrics;
}

function addLocalDays(localDate: string, days: number) {
  const [year, month, day] = localDate.split("-").map((x) => Number.parseInt(x, 10));
  const date = new Date(Date.UTC(year!, (month ?? 1) - 1, day ?? 1, 0, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function buildCalendarDays(args: {
  todayLocalDate: string;
  planDays: Array<{ localDate: string; status: string }>;
  days?: number;
}) {
  const days = args.days ?? 28;
  const byDate = new Map<string, string>();
  for (const plan of args.planDays) {
    const current = byDate.get(plan.localDate);
    if (current === "completed") continue;
    byDate.set(plan.localDate, plan.status);
  }

  return Array.from({ length: days }, (_, index) => {
    const localDate = addLocalDays(args.todayLocalDate, index - days + 1);
    const raw = byDate.get(localDate);
    const status = raw === "completed" ? "completed" : raw === "planned" ? "planned" : "none";
    return {
      localDate,
      status,
      intensity: status === "completed" ? 2 : status === "planned" ? 1 : 0,
    } satisfies CalendarDay;
  });
}

export function summarizeCodeTrend(submissions: Array<{ localDate: string }>) {
  const counts = new Map<string, number>();
  for (const submission of submissions) {
    counts.set(submission.localDate, (counts.get(submission.localDate) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, submissions]) => ({ localDate, submissions }));
}

export function summarizeCodeFeedbackIssueTrend(
  feedbackRows: Array<{ localDate: string; issues: unknown }>,
) {
  const byDate = new Map<
    string,
    {
      feedbackCount: number;
      issueCount: number;
      highIssueCount: number;
      mediumIssueCount: number;
      lowIssueCount: number;
      issueTypeCounts: Map<string, number>;
    }
  >();

  for (const feedback of feedbackRows) {
    const current = byDate.get(feedback.localDate) ?? {
      feedbackCount: 0,
      issueCount: 0,
      highIssueCount: 0,
      mediumIssueCount: 0,
      lowIssueCount: 0,
      issueTypeCounts: new Map<string, number>(),
    };
    current.feedbackCount += 1;

    for (const issue of normalizeCodeFeedbackIssues(feedback.issues)) {
      current.issueCount += 1;
      if (issue.severity === "high") current.highIssueCount += 1;
      if (issue.severity === "medium") current.mediumIssueCount += 1;
      if (issue.severity === "low") current.lowIssueCount += 1;
      increment(current.issueTypeCounts, issue.type);
    }

    byDate.set(feedback.localDate, current);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, row]) => ({
      localDate,
      feedbackCount: row.feedbackCount,
      issueCount: row.issueCount,
      highIssueCount: row.highIssueCount,
      mediumIssueCount: row.mediumIssueCount,
      lowIssueCount: row.lowIssueCount,
      topIssueType: sortedDistribution(row.issueTypeCounts)[0]?.key ?? null,
    })) satisfies CodeFeedbackIssueTrendRow[];
}

export function summarizeQuizAccuracyTrend(
  attempts: Array<{ localDate: string; isCorrect: boolean }>,
) {
  const byDate = new Map<string, { attempts: number; correct: number }>();
  for (const attempt of attempts) {
    const current = byDate.get(attempt.localDate) ?? { attempts: 0, correct: 0 };
    current.attempts += 1;
    if (attempt.isCorrect) current.correct += 1;
    byDate.set(attempt.localDate, current);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, row]) => ({
      localDate,
      attempts: row.attempts,
      correct: row.correct,
      accuracy: row.attempts ? clampPercent((row.correct / row.attempts) * 100) : 0,
    })) satisfies QuizAccuracyTrendRow[];
}

function progressDomainMastery(input: ProgressWeakDomainInput, quizAccuracy: number) {
  return clampPercent(
    input.completedLessons * 12 +
      input.codeSubmissionCount * 6 +
      Math.round(quizAccuracy / 10) * 2 -
      input.dueFlashcardCount * 3 -
      input.activeMisconceptionCount * 10,
  );
}

function progressWeakReason(input: ProgressWeakDomainInput, quizAccuracy: number) {
  const reasons: string[] = [];
  if (input.activeMisconceptionCount > 0) {
    reasons.push(`活跃错题 ${input.activeMisconceptionCount}`);
  }
  if (input.dueFlashcardCount > 0) {
    reasons.push(`复习欠账 ${input.dueFlashcardCount}`);
  }
  if ((input.completedLessons > 0 || input.plannedLessons > 0) && input.codeSubmissionCount === 0) {
    reasons.push("代码练习 0");
  }
  if (input.quizAttemptCount > 0 && quizAccuracy < 70) {
    reasons.push(`测验正确率 ${quizAccuracy}%`);
  }
  return reasons.join(" / ");
}

export function buildProgressWeakDomainSummary(inputs: ProgressWeakDomainInput[]) {
  return inputs
    .map((input) => {
      const quizAccuracy = input.quizAttemptCount
        ? clampPercent((input.correctQuizCount / input.quizAttemptCount) * 100)
        : 0;
      const masteryScore = progressDomainMastery(input, quizAccuracy);
      const codeGap =
        (input.completedLessons > 0 || input.plannedLessons > 0) &&
        input.codeSubmissionCount === 0
          ? 1
          : 0;
      const quizGap = input.quizAttemptCount > 0 ? Math.max(0, 70 - quizAccuracy) / 10 : 0;
      const weaknessScore = clampPercent(
        input.activeMisconceptionCount * 18 +
          input.dueFlashcardCount * 8 +
          codeGap * 16 +
          quizGap * 3 +
          Math.max(0, 60 - masteryScore) * 0.5,
      );

      return {
        slug: input.slug,
        label: input.label,
        masteryScore,
        weaknessScore,
        quizAccuracy,
        completedLessons: input.completedLessons,
        plannedLessons: input.plannedLessons,
        dueFlashcardCount: input.dueFlashcardCount,
        activeMisconceptionCount: input.activeMisconceptionCount,
        codeSubmissionCount: input.codeSubmissionCount,
        lastStudiedLocalDate: input.lastStudiedLocalDate,
        reason: progressWeakReason(input, quizAccuracy),
      } satisfies ProgressWeakDomainSummary;
    })
    .filter((domain) => domain.reason.length > 0)
    .sort(
      (a, b) =>
        b.weaknessScore - a.weaknessScore ||
        a.masteryScore - b.masteryScore ||
        b.dueFlashcardCount - a.dueFlashcardCount ||
        a.label.localeCompare(b.label),
    );
}

export function buildWeeklyRemediationPlan(args: {
  weakDomains: ProgressWeakDomainSummary[];
  dueFlashcardsCount: number;
  openMisconceptionsCount: number;
  codeFeedbackCount: number;
}) {
  const focusDomain = args.weakDomains[0] ?? null;
  const focusLabel = focusDomain?.label ?? "当前学习";
  const steps: WeeklyRemediationStep[] = [];

  if (args.dueFlashcardsCount > 0 || focusDomain?.dueFlashcardCount) {
    steps.push({
      title: `先复习 ${args.dueFlashcardsCount || focusDomain?.dueFlashcardCount || 0} 张到期卡片`,
      description: "先清掉记忆欠账，再继续补新内容。",
      href: "/review",
      tone: "warning",
    });
  }

  if (args.openMisconceptionsCount > 0 || focusDomain?.activeMisconceptionCount) {
    steps.push({
      title: "用 Coach 澄清一个误区",
      description: `围绕 ${focusLabel} 重讲一遍最模糊的概念，让 Coach 找出具体问题。`,
      href: "/coach",
      tone: "danger",
    });
  }

  if (args.codeFeedbackCount > 0) {
    steps.push({
      title: "回看代码反馈卡",
      description: "把最近实现错误转成主动回忆，先修正实现思路。",
      href: "/review?source=code-feedback",
      tone: "info",
    });
  } else if (focusDomain?.codeSubmissionCount === 0 && (focusDomain.completedLessons > 0 || focusDomain.plannedLessons > 0)) {
    steps.push({
      title: "补一次代码练习",
      description: `${focusLabel} 已经学过但代码练习不足，回到今日学习或项目里写一个最小实现。`,
      href: "/today",
      tone: "info",
    });
  }

  if (steps.length < 3 && focusDomain) {
    steps.push({
      title: "看知识地图里的薄弱领域",
      description: `${focusLabel} 当前弱项分 ${focusDomain.weaknessScore}，先看关联课程和卡片。`,
      href: `/map?domain=${encodeURIComponent(focusDomain.slug)}`,
      tone: "success",
    });
  }

  if (!steps.length) {
    steps.push({
      title: "保持每日闭环",
      description: "今天没有明显补弱项，继续完成今日学习、复习和一句笔记。",
      href: "/today",
      tone: "success",
    });
  }

  return {
    title: "本周补弱计划",
    summary: focusDomain
      ? `本周优先补 ${focusDomain.label}：${focusDomain.reason || "当前弱项最高"}。`
      : "本周没有明显弱项，保持每日学习闭环即可。",
    focusDomain,
    steps: steps.slice(0, 3),
  } satisfies WeeklyRemediationPlan;
}

export function summarizeReviewRetentionTrend(
  logs: Array<{ localDate: string; rating: string }>,
) {
  const retainedRatings = new Set(["good", "easy"]);
  const byDate = new Map<string, { reviewed: number; retained: number }>();
  for (const log of logs) {
    const current = byDate.get(log.localDate) ?? { reviewed: 0, retained: 0 };
    current.reviewed += 1;
    if (retainedRatings.has(log.rating)) current.retained += 1;
    byDate.set(log.localDate, current);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, row]) => ({
      localDate,
      reviewed: row.reviewed,
      retained: row.retained,
      retentionRate: row.reviewed ? clampPercent((row.retained / row.reviewed) * 100) : 0,
    })) satisfies ReviewRetentionTrendRow[];
}

export function summarizeMisconceptionTrend(
  misconceptions: Array<{ localDate: string | null; status: string }>,
) {
  const byDate = new Map<
    string,
    { total: number; active: number; resolved: number; ignored: number }
  >();

  for (const misconception of misconceptions) {
    if (!misconception.localDate) continue;
    const current = byDate.get(misconception.localDate) ?? {
      total: 0,
      active: 0,
      resolved: 0,
      ignored: 0,
    };

    current.total += 1;
    if (misconception.status === "open" || misconception.status === "active") {
      current.active += 1;
    } else if (misconception.status === "resolved") {
      current.resolved += 1;
    } else if (misconception.status === "ignored") {
      current.ignored += 1;
    }

    byDate.set(misconception.localDate, current);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([localDate, row]) => ({
      localDate,
      total: row.total,
      active: row.active,
      resolved: row.resolved,
      ignored: row.ignored,
      resolutionRate: row.total ? clampPercent((row.resolved / row.total) * 100) : 0,
    })) satisfies MisconceptionTrendRow[];
}

export function summarizeKnowledgeCoverage(args: {
  glossaryTotal: number;
  glossaryReviewed: number;
  radarTotal: number;
  radarReviewed: number;
}) {
  return {
    glossaryCoveragePct: args.glossaryTotal
      ? clampPercent((args.glossaryReviewed / args.glossaryTotal) * 100)
      : 0,
    radarCoveragePct: args.radarTotal
      ? clampPercent((args.radarReviewed / args.radarTotal) * 100)
      : 0,
  };
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedDistribution(map: Map<string, number>) {
  return [...map.entries()]
    .sort(([aKey, aCount], [bKey, bCount]) => bCount - aCount || aKey.localeCompare(bKey))
    .map(([key, count]) => ({ key, count }));
}

function outputIndicatesRepair(output: unknown) {
  const root = asRecord(output);
  const meta = asRecord(root.meta);
  return Boolean(
    root.rawPrimary ||
      root.repaired ||
      meta.repaired ||
      meta.repair === true ||
      meta.repairAttempted === true,
  );
}

function inferGenerationQualityScore(args: { status: string; output: unknown }) {
  const root = asRecord(args.output);
  if (typeof root.qualityScore === "number" && Number.isFinite(root.qualityScore)) {
    return clampPercent(root.qualityScore);
  }

  const lesson = asRecord(root.lesson);
  if (typeof lesson.contentMarkdown !== "string") return null;

  const metrics = {
    contentLength: textLength(lesson.contentMarkdown),
    guidedStepCount: asArray(lesson.guidedSteps).length,
    quizCount: asArray(root.quiz).length,
    codingExerciseQuality: codingQuality(root.codingExercise),
    flashcardCount: asArray(root.flashcards).length,
    schemaVersion: typeof root.schemaVersion === "string" ? root.schemaVersion : null,
    source: args.status === "error" || args.status === "failed" ? "template" : "deepseek",
    generationRetries: outputIndicatesRepair(root) ? 1 : 0,
    fallbackUsed: args.status === "error" || args.status === "failed",
  } satisfies ContentQualityMetrics;

  return calculateQualityScore(metrics);
}

export function summarizeGenerationHealth(args: {
  plans: Array<{ source: string | null; schemaVersion: string | null }>;
  jobs: Array<{ status: string; model: string | null; output: unknown }>;
}) {
  const schemaCounts = new Map<string, number>();
  const modelCounts = new Map<string, number>();

  let deepseekPlanCount = 0;
  let fallbackPlanCount = 0;
  for (const plan of args.plans) {
    if (plan.source === "deepseek") deepseekPlanCount++;
    if (plan.source === "template" || plan.source === "fallback") fallbackPlanCount++;
    increment(schemaCounts, plan.schemaVersion ?? "unknown");
  }

  let successJobCount = 0;
  let failedJobCount = 0;
  let repairCount = 0;
  let qualityScoreTotal = 0;
  let qualityScoreCoverage = 0;
  let lowQualityJobCount = 0;
  for (const job of args.jobs) {
    if (job.status === "success") successJobCount++;
    if (job.status === "error" || job.status === "failed") failedJobCount++;
    if (job.model) increment(modelCounts, job.model);
    if (outputIndicatesRepair(job.output)) repairCount++;
    const score = inferGenerationQualityScore(job);
    if (score !== null) {
      qualityScoreTotal += score;
      qualityScoreCoverage += 1;
      if (score < 70) lowQualityJobCount += 1;
    }
  }

  const totalPlans = args.plans.length;
  const jobCount = args.jobs.length;

  return {
    totalPlans,
    deepseekPlanCount,
    fallbackPlanCount,
    successJobCount,
    failedJobCount,
    repairCount,
    fallbackRate: totalPlans ? clampPercent((fallbackPlanCount / totalPlans) * 100) : 0,
    repairRate: jobCount ? clampPercent((repairCount / jobCount) * 100) : 0,
    averageQualityScore: qualityScoreCoverage
      ? clampPercent(qualityScoreTotal / qualityScoreCoverage)
      : 0,
    lowQualityJobCount,
    qualityScoreCoverage,
    schemaVersionDistribution: sortedDistribution(schemaCounts).map(({ key, count }) => ({
      schemaVersion: key,
      count,
    })),
    modelDistribution: sortedDistribution(modelCounts).map(({ key, count }) => ({
      model: key,
      count,
    })),
  } satisfies GenerationHealthMetrics;
}
