import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";

export type GuidedProgress = {
  activeStep: number;
  answers: Record<string, string>;
  updatedAt: string;
};

type NormalizeOptions = {
  stepCount: number;
  now?: Date;
};

function clampActiveStep(value: unknown, stepCount: number) {
  const fallback = 0;
  const numeric = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : fallback;
  const max = Math.max(0, stepCount - 1);
  return Math.min(Math.max(0, numeric), max);
}

function normalizeAnswers(value: unknown, stepCount: number) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const max = Math.max(0, stepCount - 1);
  const answers: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index > max) continue;
    if (typeof raw !== "string") continue;
    answers[String(index)] = raw;
  }
  return answers;
}

/**
 * Normalizes guided learning progress before it is persisted or restored.
 *
 * Args:
 *   input: Untrusted progress payload from a form or database JSON field.
 *   options: Step count and optional timestamp used for deterministic tests.
 *
 * Returns:
 *   A bounded progress payload safe to store in DailyPlan.guidedProgress.
 */
export function normalizeGuidedProgress(
  input: unknown,
  options: NormalizeOptions,
): GuidedProgress {
  const payload = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const stepCount = Math.max(0, Math.trunc(options.stepCount));
  const now = options.now ?? new Date();
  const updatedAt =
    typeof payload.updatedAt === "string" && !Number.isNaN(Date.parse(payload.updatedAt))
      ? payload.updatedAt
      : now.toISOString();

  return {
    activeStep: clampActiveStep(payload.activeStep, stepCount),
    answers: normalizeAnswers(payload.answers, stepCount),
    updatedAt,
  };
}

export async function getGuidedProgressForPlan(args: {
  userId: string;
  planId: string;
  stepCount: number;
}) {
  const plan = await prisma.dailyPlan.findFirst({
    where: { id: args.planId, userId: args.userId },
    select: { guidedProgress: true },
  });
  if (!plan) throw new Error("DailyPlan not found");
  if (!plan.guidedProgress) {
    return normalizeGuidedProgress(null, { stepCount: args.stepCount });
  }
  return normalizeGuidedProgress(plan.guidedProgress, { stepCount: args.stepCount });
}

export async function saveGuidedProgress(args: {
  userId: string;
  planId: string;
  input: unknown;
  stepCount: number;
  now?: Date;
}) {
  const progress = normalizeGuidedProgress(args.input, {
    stepCount: args.stepCount,
    now: args.now,
  });

  const updated = await prisma.dailyPlan.updateMany({
    where: { id: args.planId, userId: args.userId },
    data: {
      guidedProgress: progress as unknown as Prisma.InputJsonValue,
    },
  });
  if (updated.count !== 1) throw new Error("DailyPlan not found");

  return progress;
}
