export type NextBestActionTone = "info" | "success" | "warning" | "danger" | "neutral";

export type NextBestActionInput = {
  todayPlanStatus: string | null;
  dueFlashcardsCount: number;
  openMisconceptionCount: number;
  codeFeedbackNeedsAttentionCount: number;
  activeProject: null | {
    id: string;
    title: string;
    activeMilestoneTitle: string | null;
  };
  todayLessonId: string | null;
  todayNoteCount: number;
};

export type NextBestAction = {
  title: string;
  reason: string;
  href: string;
  ctaLabel: string;
  tone: NextBestActionTone;
};

export function buildNextBestAction(input: NextBestActionInput): NextBestAction {
  if (input.todayPlanStatus !== "completed") {
    return {
      title: "完成今日学习",
      reason: input.todayPlanStatus
        ? "今天的课程已经生成，先走完主课、引导步骤、小测验和反思。"
        : "今天还没有开始，先生成并进入今日学习闭环。",
      href: "/today",
      ctaLabel: "继续今日学习",
      tone: "info",
    };
  }

  if (input.dueFlashcardsCount > 0) {
    return {
      title: `复习 ${input.dueFlashcardsCount} 张到期卡片`,
      reason: "今日学习已完成，现在清空到期卡片比继续开新内容更重要。",
      href: "/review",
      ctaLabel: "开始复习",
      tone: "warning",
    };
  }

  if (input.openMisconceptionCount > 0) {
    return {
      title: "让 Coach 处理未解决误区",
      reason: `你还有 ${input.openMisconceptionCount} 个 open misconception，先把模糊点说清楚。`,
      href: "/coach",
      ctaLabel: "打开 Coach",
      tone: "danger",
    };
  }

  if (input.codeFeedbackNeedsAttentionCount > 0) {
    return {
      title: "处理代码反馈",
      reason: `有 ${input.codeFeedbackNeedsAttentionCount} 条代码反馈需要回看，适合先修正实现思路。`,
      href: input.activeProject ? `/projects?projectId=${encodeURIComponent(input.activeProject.id)}` : "/review",
      ctaLabel: input.activeProject ? "继续项目" : "复习反馈",
      tone: "info",
    };
  }

  if (input.todayLessonId && input.todayNoteCount === 0) {
    return {
      title: "写一句今日笔记",
      reason: "今天已经学完，但还没有沉淀自己的表述。写一句也能帮后续 Coach 和复习卡更准。",
      href: `/notes?lessonId=${encodeURIComponent(input.todayLessonId)}`,
      ctaLabel: "写今日笔记",
      tone: "success",
    };
  }

  if (input.activeProject) {
    return {
      title: "推进今日项目任务",
      reason: input.activeProject.activeMilestoneTitle
        ? `当前项目 ${input.activeProject.title} 的下一步是：${input.activeProject.activeMilestoneTitle}。`
        : `当前项目 ${input.activeProject.title} 还未收尾，适合继续推进。`,
      href: `/projects?projectId=${encodeURIComponent(input.activeProject.id)}`,
      ctaLabel: "继续项目",
      tone: "info",
    };
  }

  return {
    title: "查看知识地图",
    reason: "今日学习、复习和沉淀都已完成，可以回到知识地图选择下一块能力。",
    href: "/map",
    ctaLabel: "查看地图",
    tone: "neutral",
  };
}
