import { buildAdminPlanFilterWhere, type AdminPlanFilter } from "@/server/admin/plan-governance";
import { buildAdminPlanAuditChain, type AdminPlanAuditCheck } from "@/server/admin/plan-audit";
import { prisma } from "@/server/db";

export type AdminPlanAuditExceptionKind =
  | "missing_decision_log"
  | "missing_generation_job_id"
  | "missing_generation_job"
  | "topic_mismatch"
  | "domain_mismatch"
  | "schema_mismatch";

export type AdminPlanAuditExceptionItem = {
  planId: string;
  lessonTitle: string;
  localDate: string;
  status: string;
  source: string | null;
  schemaVersion: string | null;
  isTest: boolean;
  archivedAt: Date | null;
  kind: AdminPlanAuditExceptionKind;
  severity: "warn" | "fail";
  label: string;
  detail: string;
};

export type AdminPlanAuditExceptions = {
  scannedCount: number;
  plansWithExceptionsCount: number;
  warnCount: number;
  failCount: number;
  items: AdminPlanAuditExceptionItem[];
};

function exceptionKindForCheck(
  check: AdminPlanAuditCheck,
  hasGenerationJobId: boolean,
): AdminPlanAuditExceptionKind | null {
  if (check.key === "decision_log") return "missing_decision_log";
  if (check.key === "generation_job") {
    return hasGenerationJobId ? "missing_generation_job" : "missing_generation_job_id";
  }
  if (check.key === "topic_match") return "topic_mismatch";
  if (check.key === "domain_match") return "domain_mismatch";
  if (check.key === "schema_match") return "schema_mismatch";
  return null;
}

function shouldSuppressDerivedCheck(args: {
  check: AdminPlanAuditCheck;
  hasDecisionLog: boolean;
  hasGenerationJobId: boolean;
  hasGenerationJob: boolean;
}) {
  if (
    (args.check.key === "topic_match" || args.check.key === "domain_match") &&
    !args.hasDecisionLog
  ) {
    return true;
  }
  if (args.check.key === "schema_match" && (!args.hasGenerationJobId || !args.hasGenerationJob)) {
    return true;
  }
  return false;
}

export async function buildAdminPlanAuditExceptions(args: {
  userId: string;
  filter: AdminPlanFilter;
  take?: number;
}): Promise<AdminPlanAuditExceptions> {
  const plans = await prisma.dailyPlan.findMany({
    where: buildAdminPlanFilterWhere({ userId: args.userId, filter: args.filter }),
    orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
    take: args.take ?? 10,
    select: { id: true },
  });

  const auditChains = await Promise.all(
    plans.map((plan) =>
      buildAdminPlanAuditChain({ userId: args.userId, planId: plan.id }),
    ),
  );

  const items = auditChains.flatMap((chain) =>
    chain.checks.flatMap((check): AdminPlanAuditExceptionItem[] => {
      if (check.status === "pass") return [];
      if (
        shouldSuppressDerivedCheck({
          check,
          hasDecisionLog: Boolean(chain.decisionLog),
          hasGenerationJobId: Boolean(chain.plan.generationJobId),
          hasGenerationJob: Boolean(chain.generationJob),
        })
      ) {
        return [];
      }
      const kind = exceptionKindForCheck(check, Boolean(chain.plan.generationJobId));
      if (!kind) return [];
      return [
        {
          planId: chain.plan.id,
          lessonTitle: chain.plan.lessonTitle,
          localDate: chain.plan.localDate,
          status: chain.plan.status,
          source: chain.plan.source,
          schemaVersion: chain.plan.schemaVersion,
          isTest: chain.plan.isTest,
          archivedAt: chain.plan.archivedAt,
          kind,
          severity: check.status === "fail" ? "fail" : "warn",
          label: check.label,
          detail: check.detail,
        },
      ];
    }),
  );

  return {
    scannedCount: plans.length,
    plansWithExceptionsCount: new Set(items.map((item) => item.planId)).size,
    warnCount: items.filter((item) => item.severity === "warn").length,
    failCount: items.filter((item) => item.severity === "fail").length,
    items,
  };
}
