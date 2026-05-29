import type { LearningStatusTone } from "@/components/learning/learning-status-badge";

export type TodayCompletionAction = {
  label: string;
  description: string;
  href: string;
  tone: LearningStatusTone;
};

export type TodayCompletionNextActions = {
  title: string;
  statusLabel: string;
  summary: string;
  projectPractice: null | {
    title: string;
    href: string;
    percent: number;
    milestoneTitle: string;
    milestoneTask: string | null;
  };
  actions: TodayCompletionAction[];
};

export type TodayCompletionNextActionsInput = {
  planStatus: string;
  lessonId: string;
  lessonDueFlashcardCount: number;
  totalDueFlashcardCount: number;
  noteCount: number;
  voiceNoteCount: number;
  thoughtReviewCount: number;
  hasCodeSubmission: boolean;
  activeProject: null | {
    id: string;
    title: string;
    percent: number;
    activeMilestoneTitle: string | null;
    activeMilestoneTask: string | null;
  };
};

function encodedLessonHref(lessonId: string) {
  return `/notes?lessonId=${encodeURIComponent(lessonId)}`;
}

function encodedVoiceHref(lessonId: string) {
  const query = new URLSearchParams({
    lessonId,
    mode: "today_lesson",
  });
  return `/voice?${query.toString()}`;
}

function encodedCoachHref(lessonId: string) {
  const query = new URLSearchParams({
    lessonId,
    mode: "today_lesson",
  });
  return `/coach?${query.toString()}`;
}

function encodedProjectHref(projectId: string) {
  return `/projects?projectId=${encodeURIComponent(projectId)}`;
}

export function buildTodayCompletionNextActions(
  input: TodayCompletionNextActionsInput,
): TodayCompletionNextActions {
  if (input.planStatus !== "completed") {
    return {
      title: "完成后下一步",
      statusLabel: "等待完成",
      summary: "先写一句总结并完成今日学习，系统会生成复习卡片，再进入后续沉淀。",
      projectPractice: null,
      actions: [
        {
          label: "完成沉淀",
          description: "写下今天最重要的一句话，生成复习卡片。",
          href: "#today-reflection",
          tone: "info",
        },
      ],
    };
  }

  const actions: TodayCompletionAction[] = [];
  if (input.lessonDueFlashcardCount > 0) {
    actions.push({
      label: "复习本课卡片",
      description: `本课已有 ${input.lessonDueFlashcardCount} 张卡片到期，先做主动回忆。`,
      href: "/review",
      tone: "warning",
    });
  } else if (input.totalDueFlashcardCount > 0) {
    actions.push({
      label: "清空到期复习",
      description: `当前复习队列还有 ${input.totalDueFlashcardCount} 张到期卡片。`,
      href: "/review",
      tone: "warning",
    });
  }

  if (input.noteCount === 0) {
    actions.push({
      label: "写今日笔记",
      description: "把今天的概念、卡点和下一步写成自己的话。",
      href: encodedLessonHref(input.lessonId),
      tone: "success",
    });
  }

  if (input.voiceNoteCount === 0) {
    actions.push({
      label: "说出今天的理解",
      description: "用语音讲一遍，让转写、Coach 和卡片生成接上。",
      href: encodedVoiceHref(input.lessonId),
      tone: "info",
    });
  }

  if (input.thoughtReviewCount === 0) {
    actions.push({
      label: "让 Coach 检查",
      description: input.hasCodeSubmission
        ? "把今日代码思路和概念理解交给 Coach 找漏洞。"
        : "把自己的理解交给 Coach，尽早暴露概念混淆。",
      href: encodedCoachHref(input.lessonId),
      tone: "info",
    });
  }

  if (input.activeProject) {
    actions.push({
      label: "继续项目实践",
      description: input.activeProject.activeMilestoneTitle
        ? `${input.activeProject.title}：${input.activeProject.activeMilestoneTitle}`
        : `${input.activeProject.title} 还有未完成里程碑。`,
      href: encodedProjectHref(input.activeProject.id),
      tone: "neutral",
    });
  }

  const projectPractice = input.activeProject
    ? {
        title: input.activeProject.title,
        href: encodedProjectHref(input.activeProject.id),
        percent: input.activeProject.percent,
        milestoneTitle: input.activeProject.activeMilestoneTitle ?? "所有里程碑已完成",
        milestoneTask: input.activeProject.activeMilestoneTask,
      }
    : null;

  if (!actions.length) {
    actions.push({
      label: "查看学习进度",
      description: "今日学习、复习和沉淀都已完成，回到进度页看长期趋势。",
      href: "/progress",
      tone: "neutral",
    });
  }

  const summary =
    input.lessonDueFlashcardCount > 0
      ? `今日已完成，先复习本课 ${input.lessonDueFlashcardCount} 张卡片，再补笔记、语音或 Coach。`
      : input.totalDueFlashcardCount > 0
        ? `今日已完成，本课暂无到期卡片；先清空全部 ${input.totalDueFlashcardCount} 张到期复习。`
        : input.noteCount > 0 && input.voiceNoteCount > 0 && input.thoughtReviewCount > 0
          ? "今日已完成，复习、笔记、语音和 Coach 都已接上，可以查看进度或继续项目实践。"
          : "今日已完成，下一步把理解沉淀到复习、笔记、语音和 Coach。";

  return {
    title: "完成后下一步",
    statusLabel: "今日已完成",
    summary,
    projectPractice,
    actions,
  };
}
