export function buildTodayReviewSummary(args: {
  planStatus: string;
  lessonFlashcardCount: number;
  lessonDueFlashcardCount: number;
  totalDueFlashcardCount: number;
}) {
  const isCompleted = args.planStatus === "completed";

  let helperText = "完成今日学习后会生成复习卡片。";
  if (isCompleted && args.lessonDueFlashcardCount > 0) {
    helperText = `今日课程已有 ${args.lessonDueFlashcardCount} 张到期卡片，可直接进入复习。`;
  } else if (isCompleted && args.totalDueFlashcardCount > 0) {
    helperText = `今日课程暂无到期卡片，全部复习队列还有 ${args.totalDueFlashcardCount} 张。`;
  } else if (isCompleted) {
    helperText = "今日课程暂无到期卡片，当前复习队列已清空。";
  }

  return {
    isCompleted,
    lessonFlashcardCount: args.lessonFlashcardCount,
    lessonDueFlashcardCount: args.lessonDueFlashcardCount,
    totalDueFlashcardCount: args.totalDueFlashcardCount,
    statusLabel: isCompleted ? "已完成今日学习" : "等待完成今日学习",
    ctaLabel: isCompleted ? "去复习" : "完成后生成卡片",
    helperText,
  };
}
