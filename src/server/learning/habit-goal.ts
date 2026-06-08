import { summarizeDailyQuestProgress, type DailyQuest } from "@/server/learning/daily-quests";

export type LearningHabitProtectionStatus = "protected" | "at_risk" | "recovering";

export type LearningHabitGoal = {
  weekly: {
    completedDays: number;
    targetDays: number;
    remainingDays: number;
    ratio: number;
    label: string;
  };
  protection: {
    status: LearningHabitProtectionStatus;
    message: string;
  };
  lightweightMode: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
  };
};

export type LearningHabitGoalInput = {
  completedDaysThisWeek: number;
  weeklyTargetDays?: number;
  streakDays: number;
  todayQuestCompleted: boolean;
  lightweightQuestHref?: string;
};

function localDateToUtc(localDate: string) {
  const [year, month, day] = localDate.split("-").map((part) => Number.parseInt(part, 10));
  return Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

export function countCompletedDaysInLocalWeek(args: {
  completedLocalDates: string[];
  todayLocalDate: string;
}) {
  const today = localDateToUtc(args.todayLocalDate);
  const dayOfWeek = new Date(today).getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const weekStart = today - daysSinceMonday * 24 * 60 * 60 * 1000;
  return Array.from(new Set(args.completedLocalDates))
    .filter((localDate) => {
      const time = localDateToUtc(localDate);
      return time >= weekStart && time <= today;
    }).length;
}

function protectionStatus(input: LearningHabitGoalInput): LearningHabitProtectionStatus {
  if (input.todayQuestCompleted) return "protected";
  if (input.streakDays > 0) return "at_risk";
  return "recovering";
}

function protectionMessage(status: LearningHabitProtectionStatus, streakDays: number) {
  if (status === "protected") {
    return "连续学习保护已完成：今天已经有一次有效学习记录。";
  }
  if (status === "at_risk") {
    return `连续学习保护：今天做一个轻量动作，就能守住 ${streakDays} 天连续记录。`;
  }
  return "连续学习保护：先完成一个轻量动作，把节奏重新接上。";
}

/**
 * Builds weekly goal and streak-protection copy from existing activity signals.
 *
 * Args:
 *   input: Weekly completion count, streak, and today's quest status.
 *
 * Returns:
 *   A read-only habit goal model for home and progress surfaces.
 */
export function buildLearningHabitGoal(input: LearningHabitGoalInput): LearningHabitGoal {
  const targetDays = input.weeklyTargetDays ?? 5;
  const completedDays = Math.max(0, Math.min(7, input.completedDaysThisWeek));
  const remainingDays = Math.max(0, targetDays - completedDays);
  const status = protectionStatus(input);

  return {
    weekly: {
      completedDays,
      targetDays,
      remainingDays,
      ratio: completedDays / Math.max(1, targetDays),
      label: `${completedDays}/${targetDays} 天`,
    },
    protection: {
      status,
      message: protectionMessage(status, Math.max(0, input.streakDays)),
    },
    lightweightMode: {
      title: "轻量学习模式",
      description: "没时间完整学习时，用 60 秒语音或一句笔记保住节奏。",
      href: input.lightweightQuestHref ?? "/voice?mode=daily_understanding",
      ctaLabel: "做 60 秒语音",
    },
  };
}

export function buildLearningHabitGoalFromQuests(args: {
  completedDaysThisWeek: number;
  weeklyTargetDays?: number;
  streakDays: number;
  quests: DailyQuest[];
}): LearningHabitGoal {
  const summary = summarizeDailyQuestProgress(args.quests);
  return buildLearningHabitGoal({
    completedDaysThisWeek: args.completedDaysThisWeek,
    weeklyTargetDays: args.weeklyTargetDays,
    streakDays: args.streakDays,
    todayQuestCompleted: summary.completed > 0,
    lightweightQuestHref:
      args.quests.find((quest) => quest.id === "voice-reflection")?.href ??
      args.quests.find((quest) => quest.id === "write-note")?.href,
  });
}
