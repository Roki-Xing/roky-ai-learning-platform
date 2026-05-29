import type { LearningStatusTone } from "@/components/learning/learning-status-badge";

export type ReviewSessionCounts = {
  forgot: number;
  hard: number;
  good: number;
  easy: number;
};

export type ReviewSessionSummary = {
  reviewedCount: number;
  retainedCount: number;
  weakCount: number;
  retentionRate: number;
  title: string;
  description: string;
  tone: LearningStatusTone;
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  actionPlan: Array<{
    title: string;
    description: string;
  }>;
};

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function buildReviewSessionSummary(counts: ReviewSessionCounts): ReviewSessionSummary {
  const forgot = Math.max(0, counts.forgot);
  const hard = Math.max(0, counts.hard);
  const good = Math.max(0, counts.good);
  const easy = Math.max(0, counts.easy);
  const reviewedCount = forgot + hard + good + easy;
  const retainedCount = good + easy;
  const weakCount = forgot + hard;
  const retentionRate = pct(retainedCount, reviewedCount);

  if (weakCount > retainedCount) {
    return {
      reviewedCount,
      retainedCount,
      weakCount,
      retentionRate,
      title: "这轮复习暴露了补弱点",
      description: `留存率 ${retentionRate}%。先把忘了和模糊的卡片写成自己的理解，再交给 Coach 找概念缺口。`,
      tone: "danger",
      primaryAction: { href: "/coach", label: "去 Coach 补弱" },
      secondaryAction: { href: "/today", label: "回到今日学习" },
      actionPlan: [
        {
          title: "先复述忘记的卡片",
          description: "把忘了和模糊的卡片用自己的话各写一句，别急着开新内容。",
        },
        {
          title: "交给 Coach 找缺口",
          description: "把复述内容交给 Coach，重点检查概念混淆和缺失前提。",
        },
        {
          title: "回到今日学习补上下文",
          description: "补完概念缺口后再回到今日学习，避免错题孤立存在。",
        },
      ],
    };
  }

  if (retentionRate >= 70) {
    return {
      reviewedCount,
      retainedCount,
      weakCount,
      retentionRate,
      title: "这轮复习保持稳定",
      description: `留存率 ${retentionRate}%。可以看进度曲线，再决定继续复习还是推进今日任务。`,
      tone: "success",
      primaryAction: { href: "/progress", label: "查看进度" },
      secondaryAction: { href: "/today", label: "回到今日学习" },
      actionPlan: [
        {
          title: "查看进度趋势",
          description: "确认强项是否稳定增长，避免只凭这轮复习的感觉判断。",
        },
        {
          title: "继续今日任务",
          description: "如果今日学习还没完成，优先把主课、测验和反思走完。",
        },
        {
          title: "保持明天复习节奏",
          description: "留存稳定时不要加量过猛，按到期队列继续推进。",
        },
      ],
    };
  }

  return {
    reviewedCount,
    retainedCount,
    weakCount,
    retentionRate,
    title: "这轮复习有稳定也有欠账",
    description: `留存率 ${retentionRate}%。先清理模糊卡片，再回到今日学习继续沉淀。`,
    tone: "warning",
    primaryAction: { href: "/review", label: "继续复习" },
    secondaryAction: { href: "/today", label: "回到今日学习" },
    actionPlan: [
      {
        title: "先清理模糊卡片",
        description: "把 hard 卡片再过一轮，确认问题是记忆不稳还是概念没懂。",
      },
      {
        title: "补一句自己的解释",
        description: "为最不稳的一张卡写一句自己的理解，再决定是否送 Coach。",
      },
      {
        title: "回到今日学习",
        description: "完成补弱后再继续今日任务，保持复习和新内容的节奏。",
      },
    ],
  };
}
