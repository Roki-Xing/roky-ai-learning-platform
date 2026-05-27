import test from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { buildAdminPlanAuditChain } from "@/server/admin/plan-audit";

async function createAuditedPlan(args: {
  userId: string;
  localDate: string;
  isTest?: boolean;
}) {
  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });

  const domain = await prisma.domain.upsert({
    where: { slug: `audit-domain-${args.userId}` },
    update: {},
    create: {
      slug: `audit-domain-${args.userId}`,
      name: "Audit Domain",
    },
  });
  const topic = await prisma.topic.upsert({
    where: { slug: `audit-topic-${args.userId}` },
    update: {},
    create: {
      slug: `audit-topic-${args.userId}`,
      title: "Audit Topic",
      domainId: domain.id,
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Audit Lesson",
      summary: "Audit Lesson",
      contentMarkdown: "Audit Lesson",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
    },
  });

  const generationJob = await prisma.aiGenerationJob.create({
    data: {
      userId: args.userId,
      type: "daily_plan",
      status: "success",
      model: "deepseek-v4-flash",
      input: {
        localDate: args.localDate,
        timeZone: "Asia/Shanghai",
        topicSlug: topic.slug,
        schemaVersion: "2.3",
        curriculum: {
          domain: domain.name,
          domainSlug: domain.slug,
          topic: topic.title,
          topicSlug: topic.slug,
          reason: "codingNeed=1.00, novelty=0.90",
          difficulty: "easy",
          estimatedMinutes: 30,
          scoreBreakdown: {
            codingNeedScore: 1,
            noveltyScore: 0.9,
          },
          signalSnapshot: {
            recentStudies: [],
            completedCountByDomain: { [domain.slug]: 0 },
            dueCountByDomain: { [domain.slug]: 2 },
            hardReviewCountByDomain: { [domain.slug]: 1 },
            incorrectQuizCountByDomain: { [domain.slug]: 0 },
            activeMisconceptionCountByDomain: { [domain.slug]: 0 },
            mapWeaknessByDomain: { [domain.slug]: 0.5 },
            codeSubmissionCountLast7: 0,
          },
        },
      } as Prisma.InputJsonValue,
      output: {
        schemaVersion: "2.3",
        lesson: { title: "Audit Lesson" },
      } as Prisma.InputJsonValue,
    },
  });

  const plan = await prisma.dailyPlan.create({
    data: {
      userId: args.userId,
      lessonId: lesson.id,
      date: new Date(`${args.localDate}T00:00:00.000Z`),
      localDate: args.localDate,
      status: "planned",
      isTest: args.isTest ?? false,
      source: "deepseek",
      schemaVersion: "2.3",
      selectedDomain: domain.slug,
      selectedTopic: topic.slug,
      selectionReason: "codingNeed=1.00, novelty=0.90",
      generationJobId: generationJob.id,
    },
  });

  await prisma.curriculumDecisionLog.create({
    data: {
      userId: args.userId,
      localDate: args.localDate,
      isTest: args.isTest ?? false,
      domain: domain.slug,
      topic: topic.slug,
      reason: "codingNeed=1.00, novelty=0.90",
      inputSnapshot: {
        decision: {
          domain: domain.name,
          domainSlug: domain.slug,
          topic: topic.title,
          topicSlug: topic.slug,
          reason: "codingNeed=1.00, novelty=0.90",
          signalSnapshot: {
            recentStudies: [],
            completedCountByDomain: { [domain.slug]: 0 },
            dueCountByDomain: { [domain.slug]: 2 },
            hardReviewCountByDomain: { [domain.slug]: 1 },
            incorrectQuizCountByDomain: { [domain.slug]: 0 },
            activeMisconceptionCountByDomain: { [domain.slug]: 0 },
            mapWeaknessByDomain: { [domain.slug]: 0.5 },
            codeSubmissionCountLast7: 0,
          },
        },
      } as Prisma.InputJsonValue,
      scoreBreakdown: {
        codingNeedScore: 1,
        noveltyScore: 0.9,
      } as Prisma.InputJsonValue,
    },
  });

  return { plan, generationJob, domain, topic, lesson };
}

test("buildAdminPlanAuditChain links plan, decision log, generation job, and checks", async () => {
  const userId = `audit-chain-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const localDate = "2026-06-20";
  const { plan, generationJob, domain, topic, lesson } = await createAuditedPlan({ userId, localDate });

  const audit = await buildAdminPlanAuditChain({ userId, planId: plan.id });

  assert.ok(audit);
  assert.equal(audit.plan.id, plan.id);
  assert.equal(audit.plan.lessonTitle, lesson.title);
  assert.equal(audit.plan.selectedDomain, domain.slug);
  assert.equal(audit.plan.selectedTopic, topic.slug);
  assert.equal(audit.decisionLog?.domain, domain.slug);
  assert.equal(audit.decisionLog?.topic, topic.slug);
  assert.equal(audit.generationJob?.id, generationJob.id);
  assert.equal(audit.generationJob?.model, "deepseek-v4-flash");
  assert.equal(audit.plannerSummary?.selectedDomainSlug, domain.slug);
  assert.equal(audit.plannerSummary?.selectedTopicSlug, topic.slug);
  assert.deepEqual(
    audit.checks.map((check) => [check.key, check.status]),
    [
      ["decision_log", "pass"],
      ["generation_job", "pass"],
      ["topic_match", "pass"],
      ["domain_match", "pass"],
      ["schema_match", "pass"],
    ],
  );
});

test("buildAdminPlanAuditChain rejects plan ids outside the current user", async () => {
  const ownerId = `audit-owner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const otherUserId = `audit-other-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const { plan } = await createAuditedPlan({ userId: ownerId, localDate: "2026-06-21" });

  await assert.rejects(
    buildAdminPlanAuditChain({ userId: otherUserId, planId: plan.id }),
    /DailyPlan not found/,
  );
});
