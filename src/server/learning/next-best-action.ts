export type NextBestActionTone = "info" | "success" | "warning" | "danger" | "neutral";

export type NextBestActionInput = {
  todayPlanStatus: string | null;
  dueFlashcardsCount: number;
  openMisconceptionCount: number;
  openMisconceptionFocus?: {
    id?: string | null;
    summary: string;
    source?: string | null;
    occurrenceCount?: number | null;
  } | null;
  codeFeedbackNeedsAttentionCount: number;
  codeFeedbackFocus?: {
    summary: string;
    overall?: string | null;
    localDate?: string | null;
  } | null;
  activeProject: null | {
    id: string;
    title: string;
    activeMilestoneTitle: string | null;
  };
  activeBookSession?: null | {
    documentId: string;
    title: string;
    currentPage: number;
    nextPage: number;
    progressPercent: number;
  };
  todayLessonId: string | null;
  todayNoteCount: number;
  todayVoiceNoteCount: number;
};

export type NextBestAction = {
  title: string;
  reason: string;
  href: string;
  ctaLabel: string;
  tone: NextBestActionTone;
  priorityLabel?: string;
  estimatedMinutes?: number;
  companionLabel?: string;
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
      priorityLabel: "推荐",
      estimatedMinutes: 20,
      companionLabel: "AI 陪练",
    };
  }

  if (input.dueFlashcardsCount > 0) {
    return {
      title: `复习 ${input.dueFlashcardsCount} 张到期卡片`,
      reason: "今日学习已完成，现在清空到期卡片比继续开新内容更重要。",
      href: "/review",
      ctaLabel: "开始复习",
      tone: "warning",
      priorityLabel: "重要",
      estimatedMinutes: 10,
      companionLabel: "推荐",
    };
  }

  if (input.openMisconceptionCount > 0) {
    const focus = input.openMisconceptionFocus?.summary?.trim();
    const focusId = input.openMisconceptionFocus?.id?.trim();
    return {
      title: focus ? `修复误区：${focus}` : "修复一个未解决误区",
      reason: focus
        ? `当前最需要修复的是：${focus}。你还有 ${input.openMisconceptionCount} 个未解决误区，先处理这一条。`
        : `你还有 ${input.openMisconceptionCount} 个未解决误区，先修复最该处理的一条。`,
      href: focusId ? `/mistakes?focus=${encodeURIComponent(focusId)}` : "/mistakes",
      ctaLabel: "去修复",
      tone: "danger",
      priorityLabel: "重要",
      estimatedMinutes: 12,
      companionLabel: "错题修复",
    };
  }

  if (input.codeFeedbackNeedsAttentionCount > 0) {
    const focus = input.codeFeedbackFocus?.summary?.trim();
    return {
      title: "处理代码反馈",
      reason: focus
        ? `当前最值得回看的代码反馈是：${focus}。先修正这个实现思路，再继续推进项目。`
        : `有 ${input.codeFeedbackNeedsAttentionCount} 条代码反馈需要回看，适合先修正实现思路。`,
      href: input.activeProject ? `/projects?projectId=${encodeURIComponent(input.activeProject.id)}` : "/review",
      ctaLabel: input.activeProject ? "继续项目" : "复习反馈",
      tone: "info",
      priorityLabel: "推荐",
      estimatedMinutes: 15,
      companionLabel: "Coach",
    };
  }

  if (input.todayLessonId && input.todayNoteCount === 0) {
    return {
      title: "写一句今日笔记",
      reason: "今天已经学完，但还没有沉淀自己的表述。写一句也能帮后续 Coach 和复习卡更准。",
      href: `/notes?lessonId=${encodeURIComponent(input.todayLessonId)}`,
      ctaLabel: "写今日笔记",
      tone: "success",
      priorityLabel: "轻量",
      estimatedMinutes: 5,
      companionLabel: "沉淀",
    };
  }

  if (input.todayLessonId && input.todayVoiceNoteCount === 0) {
    return {
      title: "说出今天的理解",
      reason: "今天已经完成学习和文字笔记，但还没有用语音把理解讲出来。说一遍可以更快暴露卡住点，并接到 Coach 检查。",
      href: "/voice",
      ctaLabel: "去说一遍",
      tone: "info",
      priorityLabel: "轻量",
      estimatedMinutes: 5,
      companionLabel: "AI 陪练",
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
      priorityLabel: "推荐",
      estimatedMinutes: 15,
      companionLabel: "项目",
    };
  }

  if (input.activeBookSession) {
    return {
      title: `今天继续读《${input.activeBookSession.title}》第 ${input.activeBookSession.currentPage}-${input.activeBookSession.nextPage} 页`,
      reason: "有活跃读书任务。今天只读一个短页段，读完后生成 3 张卡片，并把疑问送到 Coach。",
      href: `/books/${encodeURIComponent(input.activeBookSession.documentId)}`,
      ctaLabel: "去同读",
      tone: "success",
      priorityLabel: "轻量",
      estimatedMinutes: 15,
      companionLabel: "Book Companion",
    };
  }

  return {
    title: "今天轻量探索：认识 SWE-bench",
    reason: "今日学习、复习、笔记、语音复盘和项目任务都已完成，现在用 SWE-bench 连接 Agent、真实工程任务和后续项目练习。",
    href: "/radar?entity=swe-bench",
    ctaLabel: "认识 SWE-bench",
    tone: "success",
    priorityLabel: "轻量",
    estimatedMinutes: 8,
    companionLabel: "探索",
  };
}
