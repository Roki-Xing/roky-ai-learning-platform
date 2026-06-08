import {
  calculateContentQuality,
  calculateQualityScore,
  type ContentQualityMetrics,
} from "@/server/analytics/progress";
import type { RecentStudySignal } from "@/server/curriculum/types";
import type { DailyPlanTemplate } from "@/server/content/templates";

export type DailyGenerationQualityChecks = {
  hasCodingExercise: boolean;
  hasQuizOptions: boolean;
  hasGlossaryCard: boolean;
  hasBreadthCard: boolean;
  hasCommonBugs: boolean;
  tooShort: boolean;
  repeatedRecentTopic: boolean;
  invalidJsonFallback: boolean;
};

export type PersistedDailyGenerationQuality = {
  qualityScore: number;
  qualityChecks: DailyGenerationQualityChecks;
  qualityWarnings: string[];
  qualityMetrics: ContentQualityMetrics;
};

export type PersistedDailyGenerationOutput = DailyPlanTemplate &
  PersistedDailyGenerationQuality & {
    meta?: Record<string, unknown>;
  };

export type DailyGenerationQualityJobInput = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  output?: unknown;
  error?: string | null;
};

export type DailyGenerationQualityAttentionItem = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  score: number | null;
  warnings: string[];
  error: string | null;
};

export type DailyGenerationQualityJobSummary = {
  scannedCount: number;
  snapshotCount: number;
  failedCount: number;
  lowScoreCount: number;
  averageScore: number;
  topWarnings: string[];
  attentionItems: DailyGenerationQualityAttentionItem[];
};

const MIN_CONTENT_LENGTH = 240;
const MIN_GUIDED_STEPS = 4;

function isFilledString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function hasCodingExerciseCard(value: DailyPlanTemplate["codingExercise"]) {
  return Boolean(
    isFilledString(value.title) &&
      isFilledString(value.prompt) &&
      isFilledString(value.starterCode) &&
      isFilledString(value.referenceSolution) &&
      Array.isArray(value.visibleTests) &&
      value.visibleTests.length > 0,
  );
}

function hasGlossaryCard(value: DailyPlanTemplate["glossary"]) {
  return Boolean(
    isFilledString(value.term) &&
      isFilledString(value.oneLine) &&
      isFilledString(value.definition) &&
      isFilledString(value.selfCheckQuestion),
  );
}

function hasBreadthCard(value: DailyPlanTemplate["breadth"]) {
  return Boolean(
    isFilledString(value.kind) &&
      isFilledString(value.title) &&
      isFilledString(value.oneLine) &&
      isFilledString(value.selfCheckQuestion),
  );
}

function buildWarnings(checks: DailyGenerationQualityChecks) {
  const warnings: string[] = [];
  if (!checks.hasCodingExercise) warnings.push("缺少代码练习");
  if (!checks.hasQuizOptions) warnings.push("缺少带 options 的 quiz");
  if (!checks.hasGlossaryCard) warnings.push("缺少术语卡");
  if (!checks.hasBreadthCard) warnings.push("缺少广度卡");
  if (!checks.hasCommonBugs) warnings.push("缺少 commonBugs");
  if (checks.tooShort) warnings.push("正文过短");
  if (checks.repeatedRecentTopic) warnings.push("重复近期主题");
  if (checks.invalidJsonFallback) warnings.push("触发 JSON repair 或 fallback");
  return warnings;
}

export function buildPersistedDailyGenerationOutput(args: {
  tpl: DailyPlanTemplate;
  source: "deepseek" | "template";
  topicSlug: string;
  recentStudies?: RecentStudySignal[] | null;
  generationRetries?: number;
  repairReason?: string | null;
  meta?: Record<string, unknown>;
}): PersistedDailyGenerationOutput {
  const generationRetries = args.generationRetries ?? 0;
  const metrics = calculateContentQuality({
    lesson: {
      contentMarkdown: args.tpl.lesson.contentMarkdown,
      examples: {
        guidedSteps: args.tpl.lesson.guidedSteps,
        codingExercise: args.tpl.codingExercise,
      },
      connections: { schemaVersion: args.tpl.schemaVersion },
      createdBy: args.source,
    },
    quizCount: args.tpl.quiz.length,
    flashcardCount: args.tpl.flashcards.length,
    generationRetries,
  });
  const invalidJsonFallback =
    args.source === "template" || generationRetries > 0 || Boolean(args.repairReason);
  const recentStudies = args.recentStudies ?? [];
  const qualityChecks = {
    hasCodingExercise: hasCodingExerciseCard(args.tpl.codingExercise),
    hasQuizOptions: args.tpl.quiz.some(
      (question) => Array.isArray(question.options) && question.options.length >= 2,
    ),
    hasGlossaryCard: hasGlossaryCard(args.tpl.glossary),
    hasBreadthCard: hasBreadthCard(args.tpl.breadth),
    hasCommonBugs:
      Array.isArray(args.tpl.codingExercise.commonBugs) &&
      args.tpl.codingExercise.commonBugs.length > 0,
    tooShort:
      metrics.contentLength < MIN_CONTENT_LENGTH ||
      metrics.guidedStepCount < MIN_GUIDED_STEPS,
    repeatedRecentTopic: recentStudies.slice(0, 7).some((study) => study.topicSlug === args.topicSlug),
    invalidJsonFallback,
  } satisfies DailyGenerationQualityChecks;
  const qualityWarnings = buildWarnings(qualityChecks);
  const output: PersistedDailyGenerationOutput = {
    ...args.tpl,
    qualityScore: calculateQualityScore(metrics),
    qualityChecks,
    qualityWarnings,
    qualityMetrics: metrics,
  };
  const meta = {
    ...(args.meta ?? {}),
    ...(args.repairReason ? { repaired: true, repairReason: args.repairReason } : {}),
  };
  if (Object.keys(meta).length > 0) {
    output.meta = meta;
  }
  return output;
}

export function readPersistedDailyGenerationQuality(
  output: unknown,
): PersistedDailyGenerationQuality | null {
  const root = asRecord(output);
  if (!root) return null;

  const qualityScore = root.qualityScore;
  const qualityChecks = root.qualityChecks;
  const qualityWarnings = root.qualityWarnings;
  const qualityMetrics = root.qualityMetrics;

  if (typeof qualityScore !== "number" || !Number.isFinite(qualityScore)) {
    return null;
  }
  if (!asRecord(qualityChecks) || !asRecord(qualityMetrics) || !Array.isArray(qualityWarnings)) {
    return null;
  }

  return {
    qualityScore,
    qualityChecks: qualityChecks as DailyGenerationQualityChecks,
    qualityWarnings: qualityWarnings.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    ),
    qualityMetrics: qualityMetrics as ContentQualityMetrics,
  };
}

export function summarizeDailyGenerationQualityJobs(
  jobs: DailyGenerationQualityJobInput[],
): DailyGenerationQualityJobSummary {
  const snapshots = jobs
    .map((job) => ({ job, quality: readPersistedDailyGenerationQuality(job.output) }))
    .filter((item): item is { job: DailyGenerationQualityJobInput; quality: PersistedDailyGenerationQuality } =>
      Boolean(item.quality),
    );
  const failedJobs = jobs.filter((job) => job.status === "failed" || Boolean(job.error));
  const lowScore = snapshots.filter((item) => item.quality.qualityScore < 70);
  const warningCounts = new Map<string, number>();

  for (const item of snapshots) {
    for (const warning of item.quality.qualityWarnings) {
      warningCounts.set(warning, (warningCounts.get(warning) ?? 0) + 1);
    }
  }

  const attentionItems: DailyGenerationQualityAttentionItem[] = [
    ...lowScore.map((item) => ({
      id: item.job.id,
      type: item.job.type,
      status: item.job.status,
      createdAt: item.job.createdAt,
      score: item.quality.qualityScore,
      warnings: item.quality.qualityWarnings,
      error: item.job.error ?? null,
    })),
    ...failedJobs.map((job) => ({
      id: job.id,
      type: job.type,
      status: job.status,
      createdAt: job.createdAt,
      score: null,
      warnings: [],
      error: job.error ?? null,
    })),
  ].sort((a, b) => {
    if (a.score === null && b.score !== null) return 1;
    if (a.score !== null && b.score === null) return -1;
    if (a.score !== null && b.score !== null && a.score !== b.score) return a.score - b.score;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return {
    scannedCount: jobs.length,
    snapshotCount: snapshots.length,
    failedCount: failedJobs.length,
    lowScoreCount: lowScore.length,
    averageScore: snapshots.length
      ? Math.round(
          snapshots.reduce((sum, item) => sum + item.quality.qualityScore, 0) / snapshots.length,
        )
      : 0,
    topWarnings: [...warningCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([warning]) => warning),
    attentionItems: attentionItems.slice(0, 8),
  };
}
