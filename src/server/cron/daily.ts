import { Prisma } from "@prisma/client";
import { getOrCreateTodayPlan } from "@/server/lesson/daily-plan";
import { localDateInTimeZone } from "@/server/time/day";
import { prisma } from "@/server/db";

export type DailyCronUserResult = {
  userId: string;
  timeZone: string;
  localDate: string | null;
  status: "success" | "failed";
  planId?: string;
  lessonId?: string;
  planStatus?: string;
  source?: string | null;
  error?: string;
};

export type DailyCronResult = {
  ok: boolean;
  startedAt: string;
  finishedAt: string;
  totalUsers: number;
  successCount: number;
  failedCount: number;
  results: DailyCronUserResult[];
};

function safeStringEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function bearerToken(header: string | null) {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function verifyCronSecret(args: {
  request: Request;
  expectedSecret?: string | null;
}) {
  const expectedSecret = args.expectedSecret?.trim();
  if (!expectedSecret) return false;

  const url = new URL(args.request.url);
  const token =
    bearerToken(args.request.headers.get("authorization")) ??
    url.searchParams.get("secret")?.trim() ??
    null;

  return token ? safeStringEqual(token, expectedSecret) : false;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function cronInputNow(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const now = (input as Record<string, unknown>).now;
  if (typeof now !== "string") return null;
  const date = new Date(now);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function runDailyCronForUsers(args?: {
  now?: Date;
  userIds?: string[];
}) {
  const now = args?.now ?? new Date();
  const startedAt = new Date();
  const profiles = await prisma.userProfile.findMany({
    where: args?.userIds?.length
      ? { userId: { in: args.userIds } }
      : undefined,
    orderBy: { createdAt: "asc" },
    select: { userId: true, timeZone: true },
  });

  const results: DailyCronUserResult[] = [];

  for (const profile of profiles) {
    const timeZone = profile.timeZone ?? "Asia/Shanghai";
    let localDate: string | null = null;

    try {
      localDate = localDateInTimeZone({ date: now, timeZone });
      const plan = await getOrCreateTodayPlan({ userId: profile.userId, now });

      const result: DailyCronUserResult = {
        userId: profile.userId,
        timeZone,
        localDate,
        status: "success",
        planId: plan.id,
        lessonId: plan.lessonId,
        planStatus: plan.status,
        source: plan.source ?? null,
      };

      await prisma.aiGenerationJob.create({
        data: {
          userId: profile.userId,
          type: "cron_daily_plan",
          status: "success",
          input: {
            userId: profile.userId,
            localDate,
            timeZone,
            now: now.toISOString(),
          } as Prisma.InputJsonValue,
          output: {
            planId: plan.id,
            lessonId: plan.lessonId,
            planStatus: plan.status,
            source: plan.source ?? null,
          } as Prisma.InputJsonValue,
          model: "internal",
        },
      });

      results.push(result);
    } catch (error) {
      const message = errorMessage(error);
      const result: DailyCronUserResult = {
        userId: profile.userId,
        timeZone,
        localDate,
        status: "failed",
        error: message,
      };

      await prisma.aiGenerationJob.create({
        data: {
          userId: profile.userId,
          type: "cron_daily_plan",
          status: "failed",
          input: {
            userId: profile.userId,
            localDate,
            timeZone,
            now: now.toISOString(),
          } as Prisma.InputJsonValue,
          output: Prisma.JsonNull,
          error: message,
          model: "internal",
        },
      });

      results.push(result);
    }
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.length - successCount;

  return {
    ok: failedCount === 0,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    totalUsers: profiles.length,
    successCount,
    failedCount,
    results,
  } satisfies DailyCronResult;
}

/**
 * Retries one failed daily cron job for the same owning user.
 *
 * Args:
 *   args: Current user id and failed AiGenerationJob id.
 *
 * Returns:
 *   The normal daily cron result for that single user.
 */
export async function retryFailedDailyCronJob(args: {
  userId: string;
  jobId: string;
}) {
  const job = await prisma.aiGenerationJob.findFirst({
    where: {
      id: args.jobId,
      userId: args.userId,
      type: "cron_daily_plan",
      status: "failed",
    },
    select: { id: true, input: true },
  });
  if (!job) throw new Error("Failed cron job not found");

  const now = cronInputNow(job.input) ?? new Date();
  return await runDailyCronForUsers({
    now,
    userIds: [args.userId],
  });
}
