import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  runDailyCronForUsers,
  retryFailedDailyCronJob,
  verifyCronSecret,
} from "@/server/cron/daily";
import { isProtectedPath } from "@/server/auth/policy";

test("verifyCronSecret accepts bearer token and query secret", () => {
  const expectedSecret = "cron-secret-for-test";

  assert.equal(
    verifyCronSecret({
      request: new Request("https://example.test/api/cron/daily", {
        headers: { authorization: `Bearer ${expectedSecret}` },
      }),
      expectedSecret,
    }),
    true,
  );

  assert.equal(
    verifyCronSecret({
      request: new Request(
        `https://example.test/api/cron/daily?secret=${expectedSecret}`,
      ),
      expectedSecret,
    }),
    true,
  );
});

test("verifyCronSecret rejects missing or wrong secret", () => {
  const expectedSecret = "cron-secret-for-test";

  assert.equal(
    verifyCronSecret({
      request: new Request("https://example.test/api/cron/daily"),
      expectedSecret,
    }),
    false,
  );

  assert.equal(
    verifyCronSecret({
      request: new Request("https://example.test/api/cron/daily", {
        headers: { authorization: "Bearer wrong" },
      }),
      expectedSecret,
    }),
    false,
  );

  assert.equal(
    verifyCronSecret({
      request: new Request("https://example.test/api/cron/daily"),
      expectedSecret: "",
    }),
    false,
  );
});

test("cron route stays public at proxy level and relies on cron secret", () => {
  assert.equal(isProtectedPath("/api/cron/daily"), false);
  assert.equal(isProtectedPath("/api/me"), true);
});

test("runDailyCronForUsers is idempotent per user localDate", async () => {
  const userId = `cron-user-${Date.now()}`;
  const now = new Date("2026-05-24T02:00:00.000Z");

  await prisma.userProfile.upsert({
    where: { userId },
    update: { timeZone: "Asia/Shanghai" },
    create: { userId, timeZone: "Asia/Shanghai" },
  });

  const first = await runDailyCronForUsers({ now, userIds: [userId] });
  const second = await runDailyCronForUsers({ now, userIds: [userId] });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.results.length, 1);
  assert.equal(second.results.length, 1);
  assert.equal(first.results[0]?.status, "success");
  assert.equal(second.results[0]?.status, "success");
  assert.equal(first.results[0]?.planId, second.results[0]?.planId);

  const planCount = await prisma.dailyPlan.count({
    where: {
      userId,
      localDate: first.results[0]?.localDate,
      isTest: false,
      archivedAt: null,
    },
  });
  assert.equal(planCount, 1);

  const jobCount = await prisma.aiGenerationJob.count({
    where: { userId, type: "cron_daily_plan", status: "success" },
  });
  assert.equal(jobCount, 2);
});

test("runDailyCronForUsers records failed AiGenerationJob when a user fails", async () => {
  const userId = `cron-fail-${Date.now()}`;
  const now = new Date("2026-05-24T02:00:00.000Z");

  await prisma.userProfile.upsert({
    where: { userId },
    update: { timeZone: "Invalid/Timezone" },
    create: { userId, timeZone: "Invalid/Timezone" },
  });

  const result = await runDailyCronForUsers({ now, userIds: [userId] });

  assert.equal(result.ok, false);
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0]?.status, "failed");
  assert.match(result.results[0]?.error ?? "", /Invalid|timezone|time zone/i);

  const job = await prisma.aiGenerationJob.findFirst({
    where: { userId, type: "cron_daily_plan", status: "failed" },
    orderBy: { createdAt: "desc" },
  });
  assert.ok(job);
  assert.match(job.error ?? "", /Invalid|timezone|time zone/i);
});

test("retryFailedDailyCronJob reruns a failed cron job for the owning user", async () => {
  const userId = `cron-retry-${Date.now()}`;
  const now = new Date("2026-05-24T02:00:00.000Z");

  await prisma.userProfile.upsert({
    where: { userId },
    update: { timeZone: "Invalid/Timezone" },
    create: { userId, timeZone: "Invalid/Timezone" },
  });

  const failed = await runDailyCronForUsers({ now, userIds: [userId] });
  assert.equal(failed.ok, false);

  const failedJob = await prisma.aiGenerationJob.findFirstOrThrow({
    where: { userId, type: "cron_daily_plan", status: "failed" },
    orderBy: { createdAt: "desc" },
  });

  await prisma.userProfile.update({
    where: { userId },
    data: { timeZone: "Asia/Shanghai" },
  });

  const retried = await retryFailedDailyCronJob({
    userId,
    jobId: failedJob.id,
  });

  assert.equal(retried.ok, true);
  assert.equal(retried.results.length, 1);
  assert.equal(retried.results[0]?.userId, userId);
  assert.equal(retried.results[0]?.status, "success");
  assert.equal(retried.results[0]?.localDate, "2026-05-24");

  const planCount = await prisma.dailyPlan.count({
    where: { userId, localDate: "2026-05-24", isTest: false, archivedAt: null },
  });
  assert.equal(planCount, 1);
});

test("retryFailedDailyCronJob rejects successful or cross-user jobs", async () => {
  const userId = `cron-retry-owner-${Date.now()}`;
  const otherUserId = `${userId}-other`;
  const now = new Date("2026-05-24T02:00:00.000Z");

  await prisma.userProfile.createMany({
    data: [
      { userId, timeZone: "Asia/Shanghai" },
      { userId: otherUserId, timeZone: "Invalid/Timezone" },
    ],
  });

  await runDailyCronForUsers({ now, userIds: [userId] });
  await runDailyCronForUsers({ now, userIds: [otherUserId] });

  const successJob = await prisma.aiGenerationJob.findFirstOrThrow({
    where: { userId, type: "cron_daily_plan", status: "success" },
    orderBy: { createdAt: "desc" },
  });
  const otherFailedJob = await prisma.aiGenerationJob.findFirstOrThrow({
    where: { userId: otherUserId, type: "cron_daily_plan", status: "failed" },
    orderBy: { createdAt: "desc" },
  });

  await assert.rejects(
    () => retryFailedDailyCronJob({ userId, jobId: successJob.id }),
    /failed cron job/i,
  );
  await assert.rejects(
    () => retryFailedDailyCronJob({ userId, jobId: otherFailedJob.id }),
    /failed cron job/i,
  );
});
