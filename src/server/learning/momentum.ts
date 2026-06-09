import {
  summarizeDailyQuestProgress,
  type DailyQuest,
} from "@/server/learning/daily-quests";
import {
  getLearningLevel,
  type LearningXp,
} from "@/server/learning/xp";

const LEVEL_LABELS = new Map<string, string>([
  ["AI Explorer", "AI 探索者"],
  ["Code Builder", "代码建造者"],
  ["Algorithm Thinker", "算法思考者"],
  ["LLM Practitioner", "LLM 实践者"],
  ["AI Systems Learner", "AI 系统学习者"],
]);

export type LearningMomentum = {
  stageLabel: string;
  nextUnlockLabel: string;
  nextUnlockProgress: string;
  nextUnlockRatio: number;
  weeklyLabel: string;
  dailyLoopLabel: string;
  streakLabel: string;
  encouragement: string;
};

export type LearningMomentumInput = {
  xp: LearningXp;
  quests: DailyQuest[];
  streakDays: number;
  completedDaysThisWeek: number;
  weeklyTargetDays?: number;
};

function formatLearningLevelLabel(label: string | null) {
  if (!label) return "下一阶段";
  return LEVEL_LABELS.get(label) ?? "学习成长者";
}

function buildEncouragement(args: {
  remainingQuests: number;
  nextQuestTitle: string | null;
  streakDays: number;
}) {
  if (args.remainingQuests === 0) {
    return args.streakDays > 0
      ? `今天闭环已完成，连续 ${args.streakDays} 天的节奏稳住了。`
      : "今天闭环已完成，可以做一个轻量广度探索。";
  }

  if (args.nextQuestTitle) {
    return `今天还差 ${args.remainingQuests} 步，把${args.nextQuestTitle}补上就能收尾。`;
  }

  return `今天还差 ${args.remainingQuests} 步，先完成一个轻量动作。`;
}

function questMomentumLabel(quest: DailyQuest | null) {
  if (!quest) return null;
  if (quest.id === "voice-reflection") return "语音复盘";
  if (quest.id === "write-note") return "一句笔记";
  if (quest.id === "clear-review") return "到期复习";
  return quest.title;
}

/**
 * Converts homepage activity signals into a compact learning momentum model.
 *
 * Args:
 *   input: XP, quest, streak, and weekly completion signals already loaded for home.
 *
 * Returns:
 *   Localized labels for the homepage learning status strip.
 */
export function buildLearningMomentum(input: LearningMomentumInput): LearningMomentum {
  const level = getLearningLevel(input.xp.totalXp);
  const summary = summarizeDailyQuestProgress(input.quests);
  const weeklyTargetDays = input.weeklyTargetDays ?? 5;
  const nextQuest = input.quests.find((quest) => quest.status !== "completed") ?? null;
  const remainingQuests = Math.max(0, summary.total - summary.completed);
  const nextUnlockRatio = level.progressRatio;
  const nextUnlockProgress = `${Math.round(nextUnlockRatio * 100)}%`;

  return {
    stageLabel: formatLearningLevelLabel(level.label),
    nextUnlockLabel: formatLearningLevelLabel(level.nextLabel),
    nextUnlockProgress,
    nextUnlockRatio,
    weeklyLabel: `${Math.max(0, input.completedDaysThisWeek)}/${weeklyTargetDays} 天`,
    dailyLoopLabel: `${summary.completed}/${summary.total}`,
    streakLabel: `${Math.max(0, input.streakDays)} 天`,
    encouragement: buildEncouragement({
      remainingQuests,
      nextQuestTitle: questMomentumLabel(nextQuest),
      streakDays: Math.max(0, input.streakDays),
    }),
  };
}
