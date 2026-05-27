import test from "node:test";
import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { buildAdminPlanAuditExceptions } from "@/server/admin/plan-audit-exceptions";

async function createPlanForExceptionAudit(args: {
  userId: string;
  localDate: string;
  title: string;
  selectedDomain?: string;
  selectedTopic?: string;
  decisionDomain?: string | null;
  decisionTopic?: string | null;
  jobDomain?: string;
  jobTopic?: string;
  planSchemaVersion?: string | null;
  jobSchemaVersion?: string | null;
  generationJobId?: string | null;
  createGenerationJob?: boolean;
}) {
  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });

  const suffix = `${args.userId}-${args.localDate}`;
  const domain = await prisma.domain.upsert({
    where: { slug: `audit-exceptions-domain-${suffix}` },
    update: {},
    create: {
      slug: `audit-exceptions-domain-${suffix}`,
      name: "Audit Exceptions Domain",
    },
  });
  const topic = await prisma.topic.upsert({
    where: { slug: `audit-exceptions-topic-${suffix}` },
    update: {},
    create: {
      slug: `audit-exceptions-topic-${suffix}`,
      title: "Audit Exceptions Topic",
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

  const selectedDomain = args.selectedDomain ?? domain.slug;
  const selectedTopic = args.selectedTopic ?? topic.slug;
  const jobSchemaVersion = args.jobSchemaVersion ?? args.planSchemaVersion ?? "2.3";
  const generationJob =
    args.createGenerationJob === false
      ? null
      : await prisma.aiGenerationJob.create({
          data: {
            userId: args.userId,
            type: "daily_plan",
            status: "success",
            model: "deepseek-v4-flash",
            input: {
              localDate: args.localDate,
              schemaVersion: jobSchemaVersion,
              curriculum: {
                domain: "Audit Exceptions Domain",
                domainSlug: args.jobDomain ?? selectedDomain,
                topic: "Audit Exceptions Topic",
                topicSlug: args.jobTopic ?? selectedTopic,
                reason: "novelty=0.90",
                difficulty: "standard",
                estimatedMinutes: 30,
              },
            } as Prisma.InputJsonValue,
            output: { schemaVersion: jobSchemaVersion } as Prisma.InputJsonValue,
          },
        });

  const plan = await prisma.dailyPlan.create({
    data: {
      userId: args.userId,
      lessonId: lesson.id,
      date: new Date(`${args.localDate}T00:00:00.000Z`),
      localDate: args.localDate,
      status: "planned",
      source: "deepseek",
      schemaVersion: args.planSchemaVersion ?? "2.3",
      selectedDomain,
      selectedTopic,
      selectionReason: "novelty=0.90",
      generationJobId:
        args.generationJobId === null
          ? null
          : args.generationJobId ?? generationJob?.id ?? null,
    },
  });

  if (args.decisionDomain !== null && args.decisionTopic !== null) {
    await prisma.curriculumDecisionLog.create({
      data: {
        userId: args.userId,
        localDate: args.localDate,
        isTest: false,
        domain: args.decisionDomain ?? selectedDomain,
        topic: args.decisionTopic ?? selectedTopic,
        reason: "novelty=0.90",
        inputSnapshot: { planId: plan.id } as Prisma.InputJsonValue,
        scoreBreakdown: { noveltyScore: 0.9 } as Prisma.InputJsonValue,
      },
    });
  }

  return { plan, lesson, domain, topic, generationJob };
}

test("buildAdminPlanAuditExceptions lists recent governance gaps without mutating plans", async () => {
  const userId = `audit-exceptions-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  await createPlanForExceptionAudit({
    userId,
    localDate: "2026-07-01",
    title: "Healthy plan",
  });
  const missingJobId = await createPlanForExceptionAudit({
    userId,
    localDate: "2026-07-02",
    title: "Missing job id",
    generationJobId: null,
  });
  const missingJob = await createPlanForExceptionAudit({
    userId,
    localDate: "2026-07-03",
    title: "Missing linked job",
    createGenerationJob: false,
    generationJobId: "missing-linked-job",
  });
  const missingDecision = await createPlanForExceptionAudit({
    userId,
    localDate: "2026-07-04",
    title: "Missing decision",
    decisionDomain: null,
    decisionTopic: null,
  });
  const mismatched = await createPlanForExceptionAudit({
    userId,
    localDate: "2026-07-05",
    title: "Mismatched plan",
    selectedDomain: "expected-domain",
    selectedTopic: "expected-topic",
    decisionDomain: "wrong-domain",
    decisionTopic: "wrong-topic",
    jobDomain: "wrong-job-domain",
    jobTopic: "wrong-job-topic",
    planSchemaVersion: "2.3",
    jobSchemaVersion: "2.2",
  });

  const audit = await buildAdminPlanAuditExceptions({ userId, filter: "all", take: 10 });

  assert.equal(audit.scannedCount, 5);
  assert.equal(audit.plansWithExceptionsCount, 4);
  assert.equal(audit.warnCount, 1);
  assert.equal(audit.failCount, 5);

  const byKind = new Map(audit.items.map((item) => [item.kind, item]));
  assert.equal(byKind.get("missing_generation_job_id")?.planId, missingJobId.plan.id);
  assert.equal(byKind.get("missing_generation_job_id")?.severity, "warn");
  assert.equal(byKind.get("missing_generation_job")?.planId, missingJob.plan.id);
  assert.equal(byKind.get("missing_decision_log")?.planId, missingDecision.plan.id);
  assert.equal(byKind.get("topic_mismatch")?.planId, mismatched.plan.id);
  assert.equal(byKind.get("domain_mismatch")?.planId, mismatched.plan.id);
  assert.equal(byKind.get("schema_mismatch")?.planId, mismatched.plan.id);
  assert.match(byKind.get("schema_mismatch")?.detail ?? "", /plan=2\.3; job=2\.2/);

  const missingJobIdAfter = await prisma.dailyPlan.findUniqueOrThrow({
    where: { id: missingJobId.plan.id },
  });
  assert.equal(missingJobIdAfter.generationJobId, null);
});

test("buildAdminPlanAuditExceptions only scans the current user's plans", async () => {
  const ownerId = `audit-exceptions-owner-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const otherUserId = `audit-exceptions-other-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await createPlanForExceptionAudit({
    userId: ownerId,
    localDate: "2026-07-06",
    title: "Owner missing job id",
    generationJobId: null,
  });

  const audit = await buildAdminPlanAuditExceptions({ userId: otherUserId, filter: "all", take: 10 });

  assert.equal(audit.scannedCount, 0);
  assert.equal(audit.items.length, 0);
});
