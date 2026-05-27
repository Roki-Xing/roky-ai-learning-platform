import { prisma } from "@/server/db";
import {
  buildAdminPlannerJobSummary,
  type AdminPlannerJobSummary,
} from "@/server/admin/planner-visibility";

export type AdminPlanAuditCheck = {
  key:
    | "decision_log"
    | "generation_job"
    | "topic_match"
    | "domain_match"
    | "schema_match";
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export type AdminPlanAuditChain = {
  plan: {
    id: string;
    lessonId: string;
    lessonTitle: string;
    localDate: string;
    status: string;
    source: string | null;
    schemaVersion: string | null;
    isTest: boolean;
    archivedAt: Date | null;
    selectedDomain: string | null;
    selectedTopic: string | null;
    selectionReason: string | null;
    generationJobId: string | null;
    topicSlug: string;
    domainSlug: string;
  };
  decisionLog: {
    id: string;
    localDate: string;
    isTest: boolean;
    domain: string;
    topic: string;
    reason: string;
    scoreBreakdown: unknown;
    inputSnapshot: unknown;
    createdAt: Date;
  } | null;
  generationJob: {
    id: string;
    type: string;
    status: string;
    model: string | null;
    error: string | null;
    createdAt: Date;
    input: unknown;
    output: unknown;
  } | null;
  plannerSummary: AdminPlannerJobSummary | null;
  checks: AdminPlanAuditCheck[];
};

function check(
  key: AdminPlanAuditCheck["key"],
  label: string,
  status: AdminPlanAuditCheck["status"],
  detail: string,
): AdminPlanAuditCheck {
  return { key, label, status, detail };
}

function normalize(value: string | null | undefined) {
  return value?.trim() || null;
}

function expectedPlanTopic(plan: {
  selectedTopic: string | null;
  topicSlug: string;
}) {
  return normalize(plan.selectedTopic) ?? plan.topicSlug;
}

function expectedPlanDomain(plan: {
  selectedDomain: string | null;
  domainSlug: string;
}) {
  return normalize(plan.selectedDomain) ?? plan.domainSlug;
}

export async function buildAdminPlanAuditChain(args: {
  userId: string;
  planId: string;
}): Promise<AdminPlanAuditChain> {
  const plan = await prisma.dailyPlan.findFirst({
    where: { id: args.planId, userId: args.userId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          topic: {
            select: {
              slug: true,
              domain: { select: { slug: true } },
            },
          },
        },
      },
    },
  });
  if (!plan) throw new Error("DailyPlan not found");

  const [decisionLog, generationJob] = await Promise.all([
    prisma.curriculumDecisionLog.findUnique({
      where: {
        userId_localDate_isTest: {
          userId: args.userId,
          localDate: plan.localDate,
          isTest: plan.isTest,
        },
      },
    }),
    plan.generationJobId
      ? prisma.aiGenerationJob.findFirst({
          where: { id: plan.generationJobId, userId: args.userId },
        })
      : Promise.resolve(null),
  ]);

  const planSummary = {
    id: plan.id,
    lessonId: plan.lessonId,
    lessonTitle: plan.lesson.title,
    localDate: plan.localDate,
    status: plan.status,
    source: plan.source,
    schemaVersion: plan.schemaVersion,
    isTest: plan.isTest,
    archivedAt: plan.archivedAt,
    selectedDomain: plan.selectedDomain,
    selectedTopic: plan.selectedTopic,
    selectionReason: plan.selectionReason,
    generationJobId: plan.generationJobId,
    topicSlug: plan.lesson.topic.slug,
    domainSlug: plan.lesson.topic.domain.slug,
  };

  const plannerSummary = generationJob
    ? buildAdminPlannerJobSummary(generationJob.input)
    : null;
  const planTopic = expectedPlanTopic(planSummary);
  const planDomain = expectedPlanDomain(planSummary);
  const jobTopic = normalize(plannerSummary?.selectedTopicSlug);
  const jobDomain = normalize(plannerSummary?.selectedDomainSlug);

  const checks: AdminPlanAuditCheck[] = [
    check(
      "decision_log",
      "CurriculumDecisionLog",
      decisionLog ? "pass" : "fail",
      decisionLog
        ? `found ${decisionLog.id} for ${plan.localDate} / ${plan.isTest ? "test" : "official"}`
        : `missing for ${plan.localDate} / ${plan.isTest ? "test" : "official"}`,
    ),
    check(
      "generation_job",
      "AiGenerationJob",
      generationJob ? "pass" : plan.generationJobId ? "fail" : "warn",
      generationJob
        ? `found ${generationJob.id} (${generationJob.type}/${generationJob.status})`
        : plan.generationJobId
          ? `missing linked job ${plan.generationJobId}`
          : "DailyPlan has no generationJobId",
    ),
    check(
      "topic_match",
      "Topic match",
      decisionLog && decisionLog.topic === planTopic && (!jobTopic || jobTopic === planTopic)
        ? "pass"
        : "fail",
      `plan=${planTopic}; decision=${decisionLog?.topic ?? "-"}; job=${jobTopic ?? "-"}`,
    ),
    check(
      "domain_match",
      "Domain match",
      decisionLog && decisionLog.domain === planDomain && (!jobDomain || jobDomain === planDomain)
        ? "pass"
        : "fail",
      `plan=${planDomain}; decision=${decisionLog?.domain ?? "-"}; job=${jobDomain ?? "-"}`,
    ),
    check(
      "schema_match",
      "Schema match",
      plannerSummary?.schemaVersion && plan.schemaVersion === plannerSummary.schemaVersion
        ? "pass"
        : plannerSummary?.schemaVersion
          ? "fail"
          : "warn",
      `plan=${plan.schemaVersion ?? "-"}; job=${plannerSummary?.schemaVersion ?? "-"}`,
    ),
  ];

  return {
    plan: planSummary,
    decisionLog: decisionLog
      ? {
          id: decisionLog.id,
          localDate: decisionLog.localDate,
          isTest: decisionLog.isTest,
          domain: decisionLog.domain,
          topic: decisionLog.topic,
          reason: decisionLog.reason,
          scoreBreakdown: decisionLog.scoreBreakdown,
          inputSnapshot: decisionLog.inputSnapshot,
          createdAt: decisionLog.createdAt,
        }
      : null,
    generationJob: generationJob
      ? {
          id: generationJob.id,
          type: generationJob.type,
          status: generationJob.status,
          model: generationJob.model,
          error: generationJob.error,
          createdAt: generationJob.createdAt,
          input: generationJob.input,
          output: generationJob.output,
        }
      : null,
    plannerSummary,
    checks,
  };
}
