import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";

export type AdminPlanFilter = "active" | "test" | "archived" | "all";

export function normalizeAdminPlanFilter(input: unknown): AdminPlanFilter {
  const value = Array.isArray(input) ? input[0] : input;
  if (value === "test" || value === "archived" || value === "all") return value;
  return "active";
}

export function buildAdminPlanFilterWhere(args: {
  userId: string;
  filter: AdminPlanFilter;
}): Prisma.DailyPlanWhereInput {
  if (args.filter === "test") {
    return { userId: args.userId, isTest: true, archivedAt: null };
  }
  if (args.filter === "archived") {
    return { userId: args.userId, archivedAt: { not: null } };
  }
  if (args.filter === "all") {
    return { userId: args.userId };
  }
  return { userId: args.userId, isTest: false, archivedAt: null };
}

export async function markPlanActive(args: { userId: string; planId: string }) {
  return await prisma.$transaction(async (tx) => {
    const selected = await tx.dailyPlan.findFirst({
      where: { id: args.planId, userId: args.userId },
      select: {
        id: true,
        localDate: true,
        selectedTopic: true,
        selectedDomain: true,
        selectionReason: true,
      },
    });
    if (!selected) throw new Error("DailyPlan not found");

    const archivedSameDayOfficial = await tx.dailyPlan.updateMany({
      where: {
        userId: args.userId,
        localDate: selected.localDate,
        isTest: false,
        archivedAt: null,
        id: { not: selected.id },
      },
      data: { archivedAt: new Date() },
    });

    const reasonPrefix = "admin marked active";
    const nextReason = selected.selectionReason
      ? `${reasonPrefix}; previous=${selected.selectionReason}`
      : reasonPrefix;

    await tx.dailyPlan.update({
      where: { id: selected.id },
      data: {
        isTest: false,
        archivedAt: null,
        source: "admin",
        selectionReason: nextReason,
      },
    });

    await tx.curriculumDecisionLog.upsert({
      where: {
        userId_localDate_isTest: {
          userId: args.userId,
          localDate: selected.localDate,
          isTest: false,
        },
      },
      update: {
        domain: selected.selectedDomain ?? "admin",
        topic: selected.selectedTopic ?? "admin",
        reason: nextReason,
        inputSnapshot: {
          planId: selected.id,
          action: "markPlanActive",
        } as Prisma.InputJsonValue,
      },
      create: {
        userId: args.userId,
        localDate: selected.localDate,
        isTest: false,
        domain: selected.selectedDomain ?? "admin",
        topic: selected.selectedTopic ?? "admin",
        reason: nextReason,
        inputSnapshot: {
          planId: selected.id,
          action: "markPlanActive",
        } as Prisma.InputJsonValue,
      },
    });

    const result = {
      planId: selected.id,
      localDate: selected.localDate,
      archivedSameDayOfficialCount: archivedSameDayOfficial.count,
    };

    await tx.aiGenerationJob.create({
      data: {
        userId: args.userId,
        type: "admin_plan_activation",
        status: "success",
        input: {
          planId: selected.id,
          localDate: selected.localDate,
          action: "markPlanActive",
        } as Prisma.InputJsonValue,
        output: result as Prisma.InputJsonValue,
        model: "internal",
      },
    });

    return result;
  });
}

export async function markPlanArchived(args: { userId: string; planId: string }) {
  return await prisma.$transaction(async (tx) => {
    const selected = await tx.dailyPlan.findFirst({
      where: { id: args.planId, userId: args.userId },
      select: {
        id: true,
        localDate: true,
        archivedAt: true,
      },
    });
    if (!selected) throw new Error("DailyPlan not found");

    const archivedAt = selected.archivedAt ?? new Date();
    if (!selected.archivedAt) {
      await tx.dailyPlan.update({
        where: { id: selected.id },
        data: { archivedAt },
      });
    }

    const result = {
      planId: selected.id,
      localDate: selected.localDate,
      alreadyArchived: Boolean(selected.archivedAt),
    };

    await tx.aiGenerationJob.create({
      data: {
        userId: args.userId,
        type: "admin_plan_archive",
        status: "success",
        input: {
          planId: selected.id,
          localDate: selected.localDate,
          action: "markPlanArchived",
        } as Prisma.InputJsonValue,
        output: result as Prisma.InputJsonValue,
        model: "internal",
      },
    });

    return result;
  });
}
