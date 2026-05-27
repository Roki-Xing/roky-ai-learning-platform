import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { getOrCreateTodayPlan, completeTodayPlan } from "@/server/lesson/daily-plan";

test("getOrCreateTodayPlan is idempotent per user+localDate", async () => {
  const userId = "demo-user";
  const now = new Date("2026-05-22T05:00:00.000Z");

  const a = await getOrCreateTodayPlan({ userId, now });
  const b = await getOrCreateTodayPlan({ userId, now });

  assert.equal(a.id, b.id);
  assert.equal(a.localDate, b.localDate);
});

test("completeTodayPlan is idempotent and does not duplicate flashcards", async () => {
  const userId = "demo-user";
  const now = new Date("2026-05-22T06:00:00.000Z");
  const plan = await getOrCreateTodayPlan({ userId, now });

  await completeTodayPlan({ userId, date: plan.date, reflection: "test" });
  await completeTodayPlan({ userId, date: plan.date, reflection: "test again" });

  const planAfter = await prisma.dailyPlan.findFirst({
    where: { userId, localDate: plan.localDate, isTest: false, archivedAt: null },
  });
  assert.equal(planAfter?.status, "completed");

  const cards = await prisma.flashcard.findMany({
    where: { userId, lessonId: plan.lessonId },
    select: { id: true },
  });
  const ids = new Set(cards.map((c) => c.id));
  assert.equal(ids.size, cards.length);
  assert.ok(cards.length > 0);
});

test("official and test plans can coexist for the same user+localDate", async () => {
  const userId = `test-governance-${Date.now()}`;
  const now = new Date("2026-05-23T05:00:00.000Z");

  const official = await getOrCreateTodayPlan({ userId, now });
  const testPlan = await getOrCreateTodayPlan({ userId, now, isTest: true });
  const testPlanAgain = await getOrCreateTodayPlan({ userId, now, isTest: true });

  assert.equal(official.localDate, testPlan.localDate);
  assert.notEqual(official.id, testPlan.id);
  assert.equal(testPlan.id, testPlanAgain.id);
  assert.equal(official.isTest, false);
  assert.equal(testPlan.isTest, true);
});

test("getOrCreateTodayPlan persists planner signal snapshot in CurriculumDecisionLog", async () => {
  const userId = `planner-snapshot-${Date.now()}`;
  const now = new Date("2026-05-24T05:00:00.000Z");

  const plan = await getOrCreateTodayPlan({ userId, now, isTest: true });
  const decisionLog = await prisma.curriculumDecisionLog.findUniqueOrThrow({
    where: {
      userId_localDate_isTest: {
        userId,
        localDate: plan.localDate,
        isTest: true,
      },
    },
  });
  const inputSnapshot = decisionLog.inputSnapshot as {
    decision?: {
      signalSnapshot?: {
        codeSubmissionCountLast7?: number;
        activeMisconceptionCountByDomain?: Record<string, number>;
      };
    };
  };

  assert.equal(inputSnapshot.decision?.signalSnapshot?.codeSubmissionCountLast7, 0);
  assert.ok(inputSnapshot.decision?.signalSnapshot?.activeMisconceptionCountByDomain);
});
