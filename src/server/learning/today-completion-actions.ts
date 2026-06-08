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
  completionHub: null | {
    title: string;
    metrics: Array<{
      label: string;
      value: string;
      helper: string;
      tone: LearningStatusTone;
    }>;
  };
  recommendedVoiceReflection: null | {
    title: string;
    prompt: string;
    href: string;
    ctaLabel: string;
  };
  projectPractice: null | {
    title: string;
    href: string;
    percent: number;
    milestoneTitle: string;
    milestoneTask: string | null;
    ctaLabel: string;
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
  hasCodingExercise?: boolean;
  flashcardCount?: number;
  quizTotalCount?: number;
  quizAttemptedCount?: number;
  quizCorrectCount?: number;
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

function encodedDailyUnderstandingVoiceHref(lessonId: string) {
  const query = new URLSearchParams({
    lessonId,
    mode: "daily_understanding",
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
      completionHub: null,
      recommendedVoiceReflection: null,
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

  const quizTotalCount = input.quizTotalCount ?? 0;
  const quizAttemptedCount = input.quizAttemptedCount ?? 0;
  const quizCorrectCount = input.quizCorrectCount ?? 0;
  const hasCodingExercise = input.hasCodingExercise ?? input.hasCodeSubmission;
  const completionHub: TodayCompletionNextActions["completionHub"] = {
    title: "今日完成 Hub",
    metrics: [
      {
        label: "生成卡片",
        value: `${input.flashcardCount ?? 0} 张`,
        helper: "今日内容已进入复习循环。",
        tone: "success",
      },
      {
        label: "小测验",
        value: quizTotalCount > 0 ? `答对 ${quizCorrectCount}/${quizTotalCount}` : "暂无测验",
        helper:
          quizTotalCount > 0
            ? `已提交 ${quizAttemptedCount}/${quizTotalCount} 题。`
            : "今天没有测验题，完成主课和反思即可。",
        tone: quizTotalCount > 0 && quizAttemptedCount < quizTotalCount ? "warning" : "info",
      },
      {
        label: "代码提交",
        value: hasCodingExercise ? (input.hasCodeSubmission ? "已提交" : "未提交") : "无需提交",
        helper: hasCodingExercise
          ? input.hasCodeSubmission
            ? "代码练习已接入今日沉淀。"
            : "完成代码练习后再进入项目会更稳。"
          : "今天没有代码练习，可以优先做复习或项目。",
        tone: hasCodingExercise && !input.hasCodeSubmission ? "warning" : "info",
      },
    ],
  };
  const recommendedVoiceReflection: TodayCompletionNextActions["recommendedVoiceReflection"] = {
    title: "推荐语音反思",
    prompt: "请用 60 秒说明：我今天学了什么？我哪里还不懂？我能举什么例子？我希望 Coach 检查什么？",
    href: encodedDailyUnderstandingVoiceHref(input.lessonId),
    ctaLabel: input.voiceNoteCount === 0 ? "开始 60 秒反思" : "继续语音反思",
  };

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

  actions.push({
    label: input.voiceNoteCount === 0 ? "说出今天的理解" : "继续语音复盘",
    description:
      input.voiceNoteCount === 0
        ? "用语音讲一遍，让转写、Coach 和卡片生成接上。"
        : `本课已有 ${input.voiceNoteCount} 条语音记录，可以继续补充新的理解。`,
    href: encodedVoiceHref(input.lessonId),
    tone: "info",
  });

  actions.push({
    label: input.thoughtReviewCount === 0 ? "让 Coach 检查" : "继续 Coach 检查",
    description:
      input.thoughtReviewCount > 0
        ? `本课已有 ${input.thoughtReviewCount} 次思路评审，可以继续追问或复盘。`
        : input.hasCodeSubmission
          ? "把今日代码思路和概念理解交给 Coach 找漏洞。"
          : "把自己的理解交给 Coach，尽早暴露概念混淆。",
    href: encodedCoachHref(input.lessonId),
    tone: "info",
  });

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
        ctaLabel: "继续项目",
      }
    : input.noteCount > 0 && input.voiceNoteCount > 0 && input.thoughtReviewCount > 0
      ? {
          title: "项目实践",
          href: "/projects",
          percent: 0,
          milestoneTitle: "开始一个小项目",
          milestoneTask: "把今天学到的内容落到代码或复盘里，避免只停留在阅读和卡片。",
          ctaLabel: "选择项目",
        }
      : null;

  if (projectPractice && !input.activeProject) {
    actions.push({
      label: "开始项目实践",
      description: "选一个 3 到 6 小时能收尾的小项目，把今天的概念落到代码里。",
      href: projectPractice.href,
      tone: "neutral",
    });
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
          ? "今日已完成，复习、笔记、语音和 Coach 都已接上；可以继续复盘或进入项目实践。"
          : "今日已完成，下一步把理解沉淀到复习、笔记、语音和 Coach。";

  return {
    title: "完成后下一步",
    statusLabel: "今日已完成",
    summary,
    completionHub,
    recommendedVoiceReflection,
    projectPractice,
    actions,
  };
}
