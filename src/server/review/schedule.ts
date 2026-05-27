import { addDaysUTC } from "@/server/time/day";
import type { ReviewSource } from "@/server/review/filter";

export type ReviewRating = "forgot" | "hard" | "good" | "easy";

const REVIEW_RATING_LABELS: Record<ReviewRating, string> = {
  forgot: "忘了",
  hard: "模糊",
  good: "记得",
  easy: "很熟",
};

export function ratingToIntervalDays(rating: ReviewRating) {
  switch (rating) {
    case "forgot":
      return 1;
    case "hard":
      return 3;
    case "good":
      return 7;
    case "easy":
      return 14;
  }
}

export function nextDueAtFromRating(args: { now: Date; rating: ReviewRating }) {
  const days = ratingToIntervalDays(args.rating);
  return addDaysUTC(args.now, days);
}

function queueLabel(source: ReviewSource | null | undefined) {
  if (source === "project") return "项目卡片复习";
  if (source === "code-feedback") return "代码反馈复习";
  if (source === "glossary") return "术语卡片复习";
  if (source === "radar") return "Radar 卡片复习";
  if (source === "voice-note") return "语音笔记复习";
  if (source === "thought-review") return "思路评审复习";
  return "综合复习队列";
}

export function buildReviewScheduleSummary(args: {
  dueCount: number;
  source?: ReviewSource | null;
  projectId?: string | null;
}) {
  const rules = (["forgot", "hard", "good", "easy"] as const).map((rating) => ({
    rating,
    label: REVIEW_RATING_LABELS[rating],
    intervalDays: ratingToIntervalDays(rating),
  }));

  return {
    queueLabel: queueLabel(args.source),
    scopeLabel:
      args.source === "project" || args.source === "code-feedback"
        ? args.projectId
          ? "当前项目"
          : "项目未选择"
        : args.source
          ? "当前来源"
          : "全部到期卡片",
    dueCount: args.dueCount,
    rules,
  };
}
