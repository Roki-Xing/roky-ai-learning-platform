import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  buildAdminPlanFilterWhere,
  markPlanArchived,
  markPlanActive,
  normalizeAdminPlanFilter,
} from "@/server/admin/plan-governance";

async function createGovernancePlan(args: {
  userId: string;
  localDate: string;
  title: string;
  isTest?: boolean;
  archivedAt?: Date | null;
}) {
  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });
  const domain = await prisma.domain.upsert({
    where: { slug: `admin-governance-${args.userId}` },
    update: {},
    create: {
      slug: `admin-governance-${args.userId}`,
      name: "Admin Governance",
    },
  });
  const topic = await prisma.topic.upsert({
    where: { slug: `admin-governance-topic-${args.userId}` },
    update: {},
    create: {
      slug: `admin-governance-topic-${args.userId}`,
      title: "Admin Governance Topic",
      domainId: domain.id,
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: args.title,
      summary: args.title,
      contentMarkdown: args.title,
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
    },
  });
  return await prisma.dailyPlan.create({
    data: {
      userId: args.userId,
      lessonId: lesson.id,
      date: new Date(`${args.localDate}T00:00:00.000Z`),
      localDate: args.localDate,
      status: "planned",
      isTest: args.isTest ?? false,
      archivedAt: args.archivedAt ?? null,
      source: args.isTest ? "admin" : "deepseek",
      schemaVersion: "2.3",
    },
  });
}

test("markPlanActive promotes a selected test plan and archives same-day official plans", async () => {
  const userId = `admin-active-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const localDate = "2026-06-10";
  const oldOfficial = await createGovernancePlan({ userId, localDate, title: "Old official" });
  const selected = await createGovernancePlan({
    userId,
    localDate,
    title: "Selected test",
    isTest: true,
  });

  const result = await markPlanActive({ userId, planId: selected.id });

  assert.equal(result.planId, selected.id);
  assert.equal(result.localDate, localDate);
  assert.equal(result.archivedSameDayOfficialCount, 1);

  const [oldAfter, selectedAfter] = await Promise.all([
    prisma.dailyPlan.findUniqueOrThrow({ where: { id: oldOfficial.id } }),
    prisma.dailyPlan.findUniqueOrThrow({ where: { id: selected.id } }),
  ]);

  assert.equal(selectedAfter.isTest, false);
  assert.equal(selectedAfter.archivedAt, null);
  assert.equal(selectedAfter.source, "admin");
  assert.ok(selectedAfter.selectionReason?.includes("marked active"));
  assert.ok(oldAfter.archivedAt instanceof Date);

  const activeOfficialCount = await prisma.dailyPlan.count({
    where: { userId, localDate, isTest: false, archivedAt: null },
  });
  assert.equal(activeOfficialCount, 1);
});

test("markPlanActive writes an activation audit event", async () => {
  const userId = `admin-audit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const localDate = "2026-06-12";
  const selected = await createGovernancePlan({
    userId,
    localDate,
    title: "Audit selected test",
    isTest: true,
  });

  const result = await markPlanActive({ userId, planId: selected.id });

  const audit = await prisma.aiGenerationJob.findFirst({
    where: {
      userId,
      type: "admin_plan_activation",
      status: "success",
    },
    orderBy: { createdAt: "desc" },
  });

  assert.ok(audit);
  assert.equal(audit.model, "internal");
  assert.deepEqual(audit.input, {
    planId: selected.id,
    localDate,
    action: "markPlanActive",
  });
  assert.deepEqual(audit.output, {
    planId: selected.id,
    localDate,
    archivedSameDayOfficialCount: result.archivedSameDayOfficialCount,
  });
});

test("markPlanArchived archives a selected plan and writes an audit event", async () => {
  const userId = `admin-archive-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const localDate = "2026-06-13";
  const plan = await createGovernancePlan({
    userId,
    localDate,
    title: "Archive selected plan",
  });

  const result = await markPlanArchived({ userId, planId: plan.id });

  assert.equal(result.planId, plan.id);
  assert.equal(result.localDate, localDate);

  const archived = await prisma.dailyPlan.findUniqueOrThrow({ where: { id: plan.id } });
  assert.ok(archived.archivedAt instanceof Date);

  const audit = await prisma.aiGenerationJob.findFirst({
    where: {
      userId,
      type: "admin_plan_archive",
      status: "success",
    },
    orderBy: { createdAt: "desc" },
  });

  assert.ok(audit);
  assert.equal(audit.model, "internal");
  assert.deepEqual(audit.input, {
    planId: plan.id,
    localDate,
    action: "markPlanArchived",
  });
  assert.deepEqual(audit.output, result);
});

test("admin plan filter scopes recent plans by governance state", () => {
  const userId = "admin-filter-user";

  assert.equal(normalizeAdminPlanFilter(undefined), "active");
  assert.equal(normalizeAdminPlanFilter("test"), "test");
  assert.equal(normalizeAdminPlanFilter("archived"), "archived");
  assert.equal(normalizeAdminPlanFilter("all"), "all");
  assert.equal(normalizeAdminPlanFilter("unexpected"), "active");

  assert.deepEqual(buildAdminPlanFilterWhere({ userId, filter: "active" }), {
    userId,
    isTest: false,
    archivedAt: null,
  });
  assert.deepEqual(buildAdminPlanFilterWhere({ userId, filter: "test" }), {
    userId,
    isTest: true,
    archivedAt: null,
  });
  assert.deepEqual(buildAdminPlanFilterWhere({ userId, filter: "archived" }), {
    userId,
    archivedAt: { not: null },
  });
  assert.deepEqual(buildAdminPlanFilterWhere({ userId, filter: "all" }), {
    userId,
  });
});

test("markPlanActive rejects plans outside the current user", async () => {
  const ownerId = `admin-owner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const otherUserId = `admin-other-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const plan = await createGovernancePlan({
    userId: ownerId,
    localDate: "2026-06-11",
    title: "Owned by someone else",
    isTest: true,
  });

  await assert.rejects(
    markPlanActive({ userId: otherUserId, planId: plan.id }),
    /DailyPlan not found/,
  );
});

test("markPlanArchived rejects plans outside the current user", async () => {
  const ownerId = `archive-owner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const otherUserId = `archive-other-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const plan = await createGovernancePlan({
    userId: ownerId,
    localDate: "2026-06-14",
    title: "Archive owned by someone else",
  });

  await assert.rejects(
    markPlanArchived({ userId: otherUserId, planId: plan.id }),
    /DailyPlan not found/,
  );
});
