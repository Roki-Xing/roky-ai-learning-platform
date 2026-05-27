import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  getGuidedProgressForPlan,
  normalizeGuidedProgress,
  saveGuidedProgress,
} from "@/server/lesson/guided-progress";
import { getOrCreateTodayPlan } from "@/server/lesson/daily-plan";

test("normalizeGuidedProgress clamps active step and keeps text answers", () => {
  const progress = normalizeGuidedProgress(
    {
      activeStep: 99,
      answers: {
        0: "直觉解释",
        1: "  ",
        2: 42,
        bad: "ignored",
      },
    },
    { stepCount: 3, now: new Date("2026-05-24T01:02:03.000Z") },
  );

  assert.deepEqual(progress, {
    activeStep: 2,
    answers: {
      "0": "直觉解释",
      "1": "  ",
    },
    updatedAt: "2026-05-24T01:02:03.000Z",
  });
});

test("saveGuidedProgress persists and restores progress for the owning user", async () => {
  const userId = `guided-owner-${Date.now()}`;
  const now = new Date("2026-05-24T04:00:00.000Z");
  const plan = await getOrCreateTodayPlan({ userId, now, isTest: true });

  const saved = await saveGuidedProgress({
    userId,
    planId: plan.id,
    input: {
      activeStep: 1,
      answers: {
        0: "我理解 residual connection 是保留原信号。",
        1: "LayerNorm 稳定尺度。",
      },
    },
    stepCount: 5,
    now: new Date("2026-05-24T05:00:00.000Z"),
  });

  assert.equal(saved.activeStep, 1);
  assert.equal(saved.answers["0"], "我理解 residual connection 是保留原信号。");
  assert.equal(saved.updatedAt, "2026-05-24T05:00:00.000Z");

  const restored = await getGuidedProgressForPlan({ userId, planId: plan.id, stepCount: 5 });

  assert.deepEqual(restored, saved);
});

test("saveGuidedProgress rejects writes for a non-owner", async () => {
  const ownerId = `guided-owner-${Date.now()}`;
  const intruderId = `${ownerId}-intruder`;
  const plan = await getOrCreateTodayPlan({
    userId: ownerId,
    now: new Date("2026-05-24T06:00:00.000Z"),
    isTest: true,
  });

  await assert.rejects(
    () =>
      saveGuidedProgress({
        userId: intruderId,
        planId: plan.id,
        input: { activeStep: 1, answers: { 0: "bad write" } },
        stepCount: 3,
      }),
    /DailyPlan not found/,
  );

  const row = await prisma.dailyPlan.findUnique({
    where: { id: plan.id },
    select: { guidedProgress: true },
  });
  assert.equal(row?.guidedProgress, null);
});
