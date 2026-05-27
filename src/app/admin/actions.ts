"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  verifyAdminToken,
  verifyAdminSecretOrToken,
  getAdminCookieName,
  isAdminProtectionEnabled,
  getExpectedAdminToken,
} from "@/server/admin/auth";
import { prisma } from "@/server/db";
import { retryFailedDailyCronJob, runDailyCronForUsers } from "@/server/cron/daily";
import { markPlanActive, markPlanArchived } from "@/server/admin/plan-governance";
import { getOrCreateTodayPlan, completeTodayPlan } from "@/server/lesson/daily-plan";
import { seedDefaultDomainsAndTopics } from "@/server/seed/seed";
import { requireUserId } from "@/server/auth/user";
import { startOfDayUTC, localDateInTimeZone, utcStartOfLocalDay } from "@/server/time/day";
import { Prisma } from "@prisma/client";

async function requireAdmin() {
  if (!isAdminProtectionEnabled()) return;
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value ?? null;
  if (!verifyAdminToken(token)) {
    throw new Error("Admin unauthorized");
  }
}

export async function adminLoginAction(formData: FormData) {
  const secret = String(formData.get("secret") ?? "");
  const cookieName = getAdminCookieName();

  if (!isAdminProtectionEnabled()) {
    // Nothing to do in dev; keep the UX simple.
    revalidatePath("/admin");
    return;
  }

  const expected = getExpectedAdminToken();
  if (!expected) throw new Error("ADMIN_SECRET not configured");

  const ok = verifyAdminSecretOrToken(secret);
  if (!ok) throw new Error("Invalid secret");

  const cookieStore = await cookies();
  cookieStore.set(cookieName, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });

  revalidatePath("/admin");
}

export async function adminLogoutAction() {
  await requireAdmin();
  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  revalidatePath("/admin");
}

export async function ensureProfileAction() {
  await requireAdmin();
  const userId = await requireUserId();
  await prisma.userProfile.upsert({ where: { userId }, update: {}, create: { userId } });
  revalidatePath("/admin");
}

export async function seedAction() {
  await requireAdmin();
  await seedDefaultDomainsAndTopics();
  revalidatePath("/admin");
  revalidatePath("/today");
}

export async function generateTodayPlanAction() {
  await requireAdmin();
  const userId = await requireUserId();
  await getOrCreateTodayPlan({ userId });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
}

export async function completeTodayPlanAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const reflection = (formData.get("reflection") as string | null) ?? null;
  const dateStr = (formData.get("date") as string | null) ?? null;
  const date = dateStr ? new Date(dateStr) : startOfDayUTC(new Date());
  await completeTodayPlan({ userId, date, reflection });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/review");
  revalidatePath("/library");
  revalidatePath("/progress");
}

export async function loopCheckAction() {
  await requireAdmin();
  const userId = await requireUserId();

  // Capture a timestamp for plan generation, but compute due-cards *after* completion.
  // Otherwise cards created with dueAt=now() may end up slightly after our captured time.
  const now = new Date();

  const plan = await getOrCreateTodayPlan({ userId, now });
  await completeTodayPlan({ userId, date: plan.date, reflection: "admin loop check" });
  const nowAfter = new Date();

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const timeZone = profile?.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: plan.date, timeZone });

  const [planAfter, totalCards, dueCards] = await Promise.all([
    prisma.dailyPlan.findFirst({ where: { userId, localDate, isTest: false, archivedAt: null } }),
    prisma.flashcard.count({ where: { userId, lessonId: plan.lessonId } }),
    prisma.flashcard.count({ where: { userId, dueAt: { lte: nowAfter } } }),
  ]);

  const ok =
    planAfter?.status === "completed" &&
    totalCards > 0 &&
    dueCards > 0;

  await prisma.aiGenerationJob.create({
    data: {
      userId,
      type: "admin_loop_check",
      status: ok ? "success" : "failed",
      input: { date: plan.date.toISOString() },
      output: { planStatus: planAfter?.status ?? null, totalCards, dueCards, now, nowAfter },
      error: ok ? null : "Loop check failed",
      model: "internal",
    },
  });

  revalidatePath("/admin");
}

export async function archiveTestPlansAction() {
  await requireAdmin();
  const userId = await requireUserId();
  await prisma.dailyPlan.updateMany({
    where: { userId, isTest: true, archivedAt: null },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/admin");
  revalidatePath("/library");
  revalidatePath("/today");
}

export async function archiveFuturePlannedPlansAction() {
  await requireAdmin();
  const userId = await requireUserId();
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const localDate = localDateInTimeZone({
    date: new Date(),
    timeZone: profile.timeZone ?? "Asia/Shanghai",
  });
  await prisma.dailyPlan.updateMany({
    where: {
      userId,
      status: "planned",
      archivedAt: null,
      localDate: { gt: localDate },
    },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/admin");
  revalidatePath("/library");
  revalidatePath("/today");
}

export async function regenerateTodayAction() {
  await requireAdmin();
  const userId = await requireUserId();
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: new Date(), timeZone });
  await prisma.dailyPlan.updateMany({
    where: { userId, localDate, isTest: false, archivedAt: null },
    data: { archivedAt: new Date() },
  });
  await getOrCreateTodayPlan({ userId });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
}

export async function markPlanActiveAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const planId = String(formData.get("planId") ?? "").trim();
  if (!planId) throw new Error("Missing planId");

  await markPlanActive({ userId, planId });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
  revalidatePath("/progress");
}

export async function markPlanArchivedAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const planId = String(formData.get("planId") ?? "").trim();
  if (!planId) throw new Error("Missing planId");

  await markPlanArchived({ userId, planId });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
  revalidatePath("/progress");
}

export async function runDailyCronAction() {
  await requireAdmin();
  await runDailyCronForUsers();
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
  revalidatePath("/progress");
}

export async function retryFailedDailyCronJobAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const jobId = String(formData.get("jobId") ?? "").trim();
  if (!jobId) throw new Error("Missing jobId");

  await retryFailedDailyCronJob({ userId, jobId });
  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
  revalidatePath("/progress");
}

function requireLocalDate(input: FormDataEntryValue | null) {
  const localDate = String(input ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    throw new Error("Invalid localDate (expected YYYY-MM-DD)");
  }
  return localDate;
}

export async function generatePlanForLocalDateAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const localDate = requireLocalDate(formData.get("localDate"));

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const now = utcStartOfLocalDay({ localDate, timeZone });

  await getOrCreateTodayPlan({ userId, now, isTest: true });

  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/library");
}

export async function loopCheckForLocalDateAction(formData: FormData) {
  await requireAdmin();
  const userId = await requireUserId();
  const localDate = requireLocalDate(formData.get("localDate"));

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const now = utcStartOfLocalDay({ localDate, timeZone });

  const plan = await getOrCreateTodayPlan({ userId, now, isTest: true });
  await completeTodayPlan({
    userId,
    date: plan.date,
    reflection: `admin loop check ${localDate}`,
    isTest: true,
  });
  const nowAfter = new Date();

  const [planAfter, totalCards, dueCards] = await Promise.all([
    prisma.dailyPlan.findFirst({ where: { userId, localDate, isTest: true, archivedAt: null } }),
    prisma.flashcard.count({ where: { userId, lessonId: plan.lessonId } }),
    prisma.flashcard.count({ where: { userId, dueAt: { lte: nowAfter } } }),
  ]);

  const ok = planAfter?.status === "completed" && totalCards > 0 && dueCards > 0;

  await prisma.aiGenerationJob.create({
    data: {
      userId,
      type: "admin_loop_check",
      status: ok ? "success" : "failed",
      input: { localDate, timeZone } as Prisma.InputJsonValue,
      output: {
        planStatus: planAfter?.status ?? null,
        totalCards,
        dueCards,
        now: plan.date.toISOString(),
        nowAfter: nowAfter.toISOString(),
      } as Prisma.InputJsonValue,
      error: ok ? null : "Loop check failed",
      model: "internal",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/today");
  revalidatePath("/review");
  revalidatePath("/library");
  revalidatePath("/progress");
}
