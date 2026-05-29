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
  };
}
