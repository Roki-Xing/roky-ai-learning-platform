import { DAILY_PLAN_PROMPT_VERSION } from "@/server/ai/generate-daily-plan";
import { DAILY_PLAN_SCHEMA_VERSION } from "@/server/ai/schemas";

export type AdminPromptStudioJobInput = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  model?: string | null;
  error?: string | null;
  input?: unknown;
  output?: unknown;
};

export type AdminPromptStudioPlanInput = {
  id: string;
  localDate: string;
  status: string;
  source: string | null;
  schemaVersion: string | null;
  isTest: boolean;
  archivedAt: Date | null;
};

export type AdminPromptStudioExample = {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  model: string | null;
  localDate: string | null;
  schemaVersion: string | null;
  error: string | null;
};

export type AdminPromptStudioFallbackExample = AdminPromptStudioExample & {
  reasons: Array<"fallback" | "repair" | "rawPrimary" | "quality-warning">;
};

export type AdminPromptStudioSummary = {
  promptVersion: string;
  currentSchemaVersion: string;
  latestJobSchemaVersion: string | null;
  schemaVersionCounts: Array<{ schemaVersion: string; count: number }>;
  schemaDriftCount: number;
  failedExamples: AdminPromptStudioExample[];
  fallbackExamples: AdminPromptStudioFallbackExample[];
  manualRepair: {
    status: "ready" | "waiting-for-sample";
    sampleJobId: string | null;
    note: string;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function booleanValue(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function jobSchemaVersion(job: AdminPromptStudioJobInput) {
  const input = asRecord(job.input);
  const output = asRecord(job.output);
  return stringValue(input.schemaVersion) ?? stringValue(output.schemaVersion);
}

function jobPromptVersion(job: AdminPromptStudioJobInput) {
  const input = asRecord(job.input);
  const output = asRecord(job.output);
  const meta = asRecord(output.meta);
  return (
    stringValue(input.promptVersion) ??
    stringValue(output.promptVersion) ??
    stringValue(meta.promptVersion)
  );
}

function jobLocalDate(job: AdminPromptStudioJobInput) {
  return stringValue(asRecord(job.input).localDate);
}

function hasRepairOrFallbackWarning(output: Record<string, unknown>) {
  const warnings = Array.isArray(output.qualityWarnings)
    ? output.qualityWarnings.filter((item): item is string => typeof item === "string")
    : [];
  const checks = asRecord(output.qualityChecks);
  return (
    booleanValue(checks.invalidJsonFallback) ||
    warnings.some((warning) => /repair|fallback|JSON/i.test(warning))
  );
}

function fallbackReasons(job: AdminPromptStudioJobInput) {
  const output = asRecord(job.output);
  const meta = asRecord(output.meta);
  const reasons: AdminPromptStudioFallbackExample["reasons"] = [];

  if (booleanValue(meta.fallback)) reasons.push("fallback");
  if (booleanValue(meta.repaired)) reasons.push("repair");
  if (stringValue(output.rawPrimary)) reasons.push("rawPrimary");
  if (hasRepairOrFallbackWarning(output)) reasons.push("quality-warning");

  return reasons;
}

function toExample(job: AdminPromptStudioJobInput): AdminPromptStudioExample {
  return {
    id: job.id,
    type: job.type,
    status: job.status,
    createdAt: job.createdAt,
    model: job.model ?? null,
    localDate: jobLocalDate(job),
    schemaVersion: jobSchemaVersion(job),
    error: job.error ?? null,
  };
}

function incrementCount(map: Map<string, number>, version: string | null) {
  if (!version) return;
  map.set(version, (map.get(version) ?? 0) + 1);
}

/**
 * Builds the Admin Prompt Studio summary from already scoped recent rows.
 *
 * Args:
 *   jobs: Recent AiGenerationJob rows for the current admin user.
 *   plans: Recent DailyPlan rows for the current admin user.
 *   take: Maximum failed/fallback examples to expose.
 *
 * Returns:
 *   Version, drift, failure, fallback, and repair-readiness data for /admin.
 */
export function buildAdminPromptStudioSummary(args: {
  jobs: AdminPromptStudioJobInput[];
  plans: AdminPromptStudioPlanInput[];
  take?: number;
}): AdminPromptStudioSummary {
  const take = args.take ?? 3;
  const jobs = [...args.jobs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const schemaCounts = new Map<string, number>();

  incrementCount(schemaCounts, DAILY_PLAN_SCHEMA_VERSION);
  for (const job of jobs) {
    incrementCount(schemaCounts, stringValue(asRecord(job.input).schemaVersion));
  }
  for (const plan of args.plans) {
    incrementCount(schemaCounts, plan.schemaVersion);
  }

  const failedExamples = jobs
    .filter((job) => job.status === "failed" || job.status === "error" || Boolean(job.error))
    .map(toExample)
    .slice(0, take);

  const fallbackExamples = jobs
    .map((job) => ({ job, reasons: fallbackReasons(job) }))
    .filter((item): item is { job: AdminPromptStudioJobInput; reasons: AdminPromptStudioFallbackExample["reasons"] } =>
      item.reasons.length > 0,
    )
    .map((item) => ({ ...toExample(item.job), reasons: item.reasons }))
    .slice(0, take);

  const repairSample =
    fallbackExamples.find((item) => item.reasons.includes("rawPrimary")) ??
    failedExamples[0] ??
    fallbackExamples[0] ??
    null;

  return {
    promptVersion: jobs.map(jobPromptVersion).find((version): version is string => Boolean(version)) ??
      DAILY_PLAN_PROMPT_VERSION,
    currentSchemaVersion: DAILY_PLAN_SCHEMA_VERSION,
    latestJobSchemaVersion: jobs.map(jobSchemaVersion).find((version): version is string => Boolean(version)) ?? null,
    schemaVersionCounts: [...schemaCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([schemaVersion, count]) => ({ schemaVersion, count })),
    schemaDriftCount: [...schemaCounts.entries()]
      .filter(([schemaVersion]) => schemaVersion !== DAILY_PLAN_SCHEMA_VERSION)
      .reduce((sum, [, count]) => sum + count, 0),
    failedExamples,
    fallbackExamples,
    manualRepair: repairSample
      ? {
          status: "ready",
          sampleJobId: repairSample.id,
          note:
            "最近已有原始输出/失败样例，可用当前修复提示做手动验证；此面板不自动调用模型。",
        }
      : {
          status: "waiting-for-sample",
          sampleJobId: null,
          note: "最近没有失败、兜底或修复样例；等待下一次异常生成后再做手动修复验证。",
        },
  };
}
