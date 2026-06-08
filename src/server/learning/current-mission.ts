import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";
import {
  buildNextBestAction,
  type NextBestAction,
  type NextBestActionInput,
  type NextBestActionTone,
} from "@/server/learning/next-best-action";

export type CurrentMission = NextBestAction;
export type CurrentMissionInput = NextBestActionInput;

export type CurrentMissionSignal = {
  label: string;
  value: string;
  tone?: NextBestActionTone;
};

export type CurrentMissionData = {
  mission: CurrentMission;
  signals: CurrentMissionSignal[];
  input: CurrentMissionInput;
  todayLocalDate: string;
};

export function buildCurrentMission(input: CurrentMissionInput): CurrentMission {
  return buildNextBestAction(input);
}

export function buildCurrentMissionSignals(
  input: CurrentMissionInput,
): CurrentMissionSignal[] {
  const signals: CurrentMissionSignal[] = [];

  if (input.dueFlashcardsCount > 0) {
    signals.push({
      label: "到期卡片",
      value: String(input.dueFlashcardsCount),
      tone: "warning",
    });
  }

  if (input.openMisconceptionCount > 0) {
    signals.push({
      label: "误区",
      value: String(input.openMisconceptionCount),
      tone: "danger",
    });
  }

  if (input.codeFeedbackNeedsAttentionCount > 0) {
    signals.push({
      label: "代码反馈",
      value: String(input.codeFeedbackNeedsAttentionCount),
      tone: "info",
    });
  }

  if (input.activeProject?.title) {
    signals.push({
      label: "项目",
      value: input.activeProject.title,
      tone: "info",
    });
  }

  if (signals.length === 0 && input.todayLessonId) {
    signals.push({
      label: "今日笔记",
      value: String(input.todayNoteCount),
      tone: input.todayNoteCount > 0 ? "success" : "warning",
    });
    signals.push({
      label: "语音复盘",
      value: String(input.todayVoiceNoteCount),
      tone: input.todayVoiceNoteCount > 0 ? "success" : "info",
    });
  }

  return signals;
}

export async function getCurrentMissionData(
  userId: string,
): Promise<CurrentMissionData> {
  const profile = await getOrCreateUserProfile({ userId });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const now = new Date();
  const todayLocalDate = localDateInTimeZone({ date: now, timeZone });
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(userId);
  const codeFeedbackNeedsAttentionWhere = {
    userId,
    overall: { in: ["partially_correct", "incorrect", "cannot_judge"] },
  };

  const [
    todayPlan,
    dueFlashcardsCount,
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject,
  ] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId, localDate: todayLocalDate, isTest: false, archivedAt: null },
      select: { lessonId: true, status: true },
    }),
    prisma.flashcard.count({
      where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
    }),
    prisma.misconception.count({ where: { userId, status: "open" } }),
    prisma.misconception.findFirst({
      where: { userId, status: "open" },
      select: { summary: true, source: true, occurrenceCount: true },
      orderBy: [{ lastAttemptAt: "desc" }],
    }),
    prisma.codeFeedback.count({
      where: codeFeedbackNeedsAttentionWhere,
    }).catch(() => 0),
    prisma.codeFeedback.findFirst({
      where: codeFeedbackNeedsAttentionWhere,
      select: { summary: true, overall: true, localDate: true },
      orderBy: [{ updatedAt: "desc" }],
    }).catch(() => null),
    prisma.learningProject.findFirst({
      where: { userId, status: { not: "completed" } },
      include: { milestones: { orderBy: [{ position: "asc" }] } },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  const [todayNoteCount, todayVoiceNoteCount] = todayPlan
    ? await Promise.all([
        prisma.note.count({ where: { userId, lessonId: todayPlan.lessonId } }),
        prisma.voiceNote.count({ where: { userId, lessonId: todayPlan.lessonId } }),
      ])
    : [0, 0];

  const input: CurrentMissionInput = {
    todayPlanStatus: todayPlan?.status ?? null,
    dueFlashcardsCount,
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject: activeProject
      ? {
          id: activeProject.id,
          title: activeProject.title,
          activeMilestoneTitle:
            activeProject.milestones.find((milestone) => milestone.status !== "completed")
              ?.title ?? null,
        }
      : null,
    todayLessonId: todayPlan?.lessonId ?? null,
    todayNoteCount,
    todayVoiceNoteCount,
  };

  return {
    mission: buildCurrentMission(input),
    signals: buildCurrentMissionSignals(input),
    input,
    todayLocalDate,
  };
}
