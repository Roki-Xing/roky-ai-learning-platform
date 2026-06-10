import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildReviewableFlashcardWhere } from "@/server/review/filter";
import { localDateInTimeZone } from "@/server/time/day";
import { getActiveBookSession } from "@/server/books/base";
import {
  buildNextBestAction,
  type NextBestAction,
  type NextBestActionInput,
  type NextBestActionTone,
} from "@/server/learning/next-best-action";

export type CurrentMission = NextBestAction;
export type CurrentMissionInput = NextBestActionInput;

export type CurrentMissionSignal = {
  label: string;
  value: string;
  tone?: NextBestActionTone;
};

export type CurrentMissionProgress = {
  label: string;
  completed: number;
  total: number;
  steps: CurrentMissionProgressStep[];
};

export type CurrentMissionProgressStep = {
  label: "学习" | "复习" | "表达" | "修复" | "实践";
  state: "done" | "current" | "todo";
  text: string;
};

export type LearningSessionType =
  | "daily_lesson"
  | "review_session"
  | "coach_session"
  | "voice_reflection"
  | "mistake_repair"
  | "project_milestone"
  | "book_reading"
  | "weekly_review"
  | "glossary_explore"
  | "radar_explore";

export type LearningSessionStatus = "not_started" | "in_progress" | "completed";

export type LearningSession = {
  type: LearningSessionType;
  title: string;
  goal: string;
  status: LearningSessionStatus;
  startedAt: string | null;
  completedAt: string | null;
  outputs: string[];
  nextRecommendedSession: Pick<LearningSession, "type" | "title" | "goal"> | null;
  href: string;
  ctaLabel: string;
};

export type LearningSessionSummary = {
  current: LearningSession;
  next: LearningSession;
  weekly: LearningSession;
};

export type CurrentMissionData = {
  mission: CurrentMission;
  signals: CurrentMissionSignal[];
  progress: CurrentMissionProgress;
  input: CurrentMissionInput;
  todayLocalDate: string;
};

export function buildCurrentMission(input: CurrentMissionInput): CurrentMission {
  return buildNextBestAction(input);
}

type LearningSessionBlueprint = Omit<
  LearningSession,
  "startedAt" | "completedAt" | "nextRecommendedSession"
>;

function sessionBlueprint(
  type: LearningSessionType,
  overrides: Partial<Omit<LearningSessionBlueprint, "type">> = {},
): LearningSessionBlueprint {
  const defaults: Record<LearningSessionType, LearningSessionBlueprint> = {
    daily_lesson: {
      type: "daily_lesson",
      title: "完成今日学习",
      goal: "走完主课、引导步骤、小测验和反思。",
      status: "in_progress",
      outputs: ["lesson progress", "quiz attempt", "reflection", "flashcards"],
      href: "/today",
      ctaLabel: "继续今日学习",
    },
    review_session: {
      type: "review_session",
      title: "复习到期卡片",
      goal: "清空到期复习，先把今天学过的内容留住。",
      status: "in_progress",
      outputs: ["review logs", "weak signals"],
      href: "/review",
      ctaLabel: "开始复习",
    },
    coach_session: {
      type: "coach_session",
      title: "让 Coach 检查理解",
      goal: "把模糊点说清楚，得到缺失概念和下一步问题。",
      status: "not_started",
      outputs: ["thought review", "missing concepts", "cards"],
      href: "/coach",
      ctaLabel: "打开 Coach",
    },
    voice_reflection: {
      type: "voice_reflection",
      title: "说出今天的理解",
      goal: "用 60 秒口述暴露卡住点，再交给 Coach 检查。",
      status: "not_started",
      outputs: ["transcript", "note draft", "coach input"],
      href: "/voice",
      ctaLabel: "去说一遍",
    },
    mistake_repair: {
      type: "mistake_repair",
      title: "修复一个误区",
      goal: "把最影响理解的错误解释清楚，并沉淀成复习卡。",
      status: "in_progress",
      outputs: ["resolved misconception", "mistake cards"],
      href: "/mistakes",
      ctaLabel: "去修复",
    },
    project_milestone: {
      type: "project_milestone",
      title: "推进今日项目任务",
      goal: "把当前知识放进一个可提交的小任务。",
      status: "in_progress",
      outputs: ["code", "project milestone", "feedback"],
      href: "/projects",
      ctaLabel: "继续项目",
    },
    book_reading: {
      type: "book_reading",
      title: "同读书籍",
      goal: "读一个短页段，把选区生成笔记、卡片和 Coach 问题。",
      status: "in_progress",
      outputs: ["book notes", "flashcards", "coach question"],
      href: "/books",
      ctaLabel: "去同读",
    },
    weekly_review: {
      type: "weekly_review",
      title: "本周复盘",
      goal: "把一周学习转成下周计划。",
      status: "not_started",
      outputs: ["weekly summary", "next week plan"],
      href: "/weekly",
      ctaLabel: "做周复盘",
    },
    glossary_explore: {
      type: "glossary_explore",
      title: "探索一个术语路径",
      goal: "把术语放回知识路径，而不是只看孤立解释。",
      status: "not_started",
      outputs: ["glossary card", "path signal"],
      href: "/glossary",
      ctaLabel: "看术语",
    },
    radar_explore: {
      type: "radar_explore",
      title: "今天轻量探索：认识 SWE-bench",
      goal: "连接 Agent、真实工程任务和后续项目练习。",
      status: "not_started",
      outputs: ["radar signal", "breadth card"],
      href: "/radar?entity=swe-bench",
      ctaLabel: "认识 SWE-bench",
    },
  };

  return {
    ...defaults[type],
    ...overrides,
    type,
  };
}

function nextSessionTypeFor(type: LearningSessionType): LearningSessionType {
  switch (type) {
    case "daily_lesson":
      return "review_session";
    case "review_session":
      return "voice_reflection";
    case "voice_reflection":
      return "coach_session";
    case "coach_session":
    case "mistake_repair":
      return "project_milestone";
    case "project_milestone":
      return "book_reading";
    case "book_reading":
      return "weekly_review";
    case "weekly_review":
      return "glossary_explore";
    case "glossary_explore":
      return "radar_explore";
    case "radar_explore":
      return "daily_lesson";
  }
}

function completeLearningSession(
  session: Omit<LearningSession, "startedAt" | "completedAt" | "nextRecommendedSession">,
): LearningSession {
  const next = sessionBlueprint(nextSessionTypeFor(session.type));
  return {
    ...session,
    startedAt: null,
    completedAt: null,
    nextRecommendedSession: {
      type: next.type,
      title: next.title,
      goal: next.goal,
    },
  };
}

export function buildLearningSessions(args: {
  input: CurrentMissionInput;
  completedDaysThisWeek: number;
  preferredCurrentType?: Extract<LearningSessionType, "weekly_review" | "glossary_explore" | "radar_explore">;
}): LearningSessionSummary {
  const { input } = args;
  let current: Omit<LearningSession, "startedAt" | "completedAt" | "nextRecommendedSession">;

  if (args.preferredCurrentType) {
    current = sessionBlueprint(args.preferredCurrentType);
  } else if (input.todayPlanStatus !== "completed") {
    current = sessionBlueprint("daily_lesson", {
      status: input.todayPlanStatus ? "in_progress" : "not_started",
    });
  } else if (input.dueFlashcardsCount > 0) {
    current = sessionBlueprint("review_session", {
      title: `复习 ${input.dueFlashcardsCount} 张到期卡`,
    });
  } else if (input.openMisconceptionCount > 0) {
    const focus = input.openMisconceptionFocus?.summary?.trim();
    const focusId = input.openMisconceptionFocus?.id?.trim();
    current = sessionBlueprint("mistake_repair", {
      title: focus ? `修复误区：${focus}` : "修复一个误区",
      href: focusId ? `/mistakes?focus=${encodeURIComponent(focusId)}` : "/mistakes",
    });
  } else if (input.codeFeedbackNeedsAttentionCount > 0) {
    const focus = input.codeFeedbackFocus?.summary?.trim();
    current = sessionBlueprint("coach_session", {
      title: focus ? `复盘代码反馈：${focus}` : "处理代码反馈",
      status: "in_progress",
    });
  } else if (input.todayLessonId && input.todayNoteCount === 0) {
    current = sessionBlueprint("daily_lesson", {
      title: "写一句今日笔记",
      goal: "把今天最清楚的一句话沉淀下来，给后续复习和 Coach 使用。",
      outputs: ["note draft", "review seed"],
      href: `/notes?lessonId=${encodeURIComponent(input.todayLessonId)}`,
      ctaLabel: "写今日笔记",
    });
  } else if (input.todayLessonId && input.todayVoiceNoteCount === 0) {
    current = sessionBlueprint("voice_reflection");
  } else if (input.activeProject) {
    current = sessionBlueprint("project_milestone", {
      title: input.activeProject.activeMilestoneTitle
        ? `项目小步：${input.activeProject.activeMilestoneTitle}`
        : `继续项目：${input.activeProject.title}`,
      href: `/projects?projectId=${encodeURIComponent(input.activeProject.id)}`,
    });
  } else if (input.activeBookSession) {
    current = sessionBlueprint("book_reading", {
      title: `读《${input.activeBookSession.title}》第 ${input.activeBookSession.currentPage}-${input.activeBookSession.nextPage} 页`,
      href: `/books/${encodeURIComponent(input.activeBookSession.documentId)}`,
    });
  } else {
    current = sessionBlueprint("radar_explore");
  }

  const completeCurrent = completeLearningSession(current);
  const next = completeLearningSession(sessionBlueprint(nextSessionTypeFor(completeCurrent.type)));
  const weekly = completeLearningSession(sessionBlueprint("weekly_review", {
    title: `本周会话：完成 ${Math.max(0, Math.min(7, args.completedDaysThisWeek))}/7`,
    status: args.completedDaysThisWeek >= 7 ? "completed" : "in_progress",
  }));

  return {
    current: completeCurrent,
    next,
    weekly,
  };
}

export function buildCurrentMissionProgress(
  input: CurrentMissionInput,
): CurrentMissionProgress {
  const learningDone = input.todayPlanStatus === "completed";
  const reviewDone = input.dueFlashcardsCount === 0;
  const expressionDone = Boolean(
    input.todayLessonId && (input.todayNoteCount > 0 || input.todayVoiceNoteCount > 0),
  );
  const repairDone =
    input.openMisconceptionCount === 0 && input.codeFeedbackNeedsAttentionCount === 0;
  const hasPracticeTask = Boolean(input.activeProject || input.activeBookSession);

  const rawSteps: Array<{
    label: CurrentMissionProgressStep["label"];
    done: boolean;
    text: string;
  }> = [
    {
      label: "学习",
      done: learningDone,
      text: learningDone ? "已完成" : input.todayPlanStatus ? "进行中" : "待开始",
    },
    {
      label: "复习",
      done: reviewDone,
      text: reviewDone ? "已清空" : `${input.dueFlashcardsCount} 张到期`,
    },
    {
      label: "表达",
      done: expressionDone,
      text: expressionDone ? "已表达" : "待表达",
    },
    {
      label: "修复",
      done: repairDone,
      text: repairDone ? "已清空" : "待修复",
    },
    {
      label: "实践",
      done: false,
      text: hasPracticeTask ? "进行中" : "待实践",
    },
  ];
  const firstTodoIndex = rawSteps.findIndex((step) => !step.done);
  const steps = rawSteps.map((step, index): CurrentMissionProgressStep => ({
    label: step.label,
    state: step.done ? "done" : index === firstTodoIndex ? "current" : "todo",
    text: step.text,
  }));

  return {
    label: "今日闭环",
    completed: rawSteps.filter((step) => step.done).length,
    total: steps.length,
    steps,
  };
}

export function buildCurrentMissionSignals(
  input: CurrentMissionInput,
): CurrentMissionSignal[] {
  const signals: CurrentMissionSignal[] = [];

  if (input.dueFlashcardsCount > 0) {
    signals.push({
      label: "到期卡片",
      value: String(input.dueFlashcardsCount),
      tone: "warning",
    });
  }

  if (input.openMisconceptionCount > 0) {
    signals.push({
      label: "误区",
      value: String(input.openMisconceptionCount),
      tone: "danger",
    });
  }

  if (input.codeFeedbackNeedsAttentionCount > 0) {
    signals.push({
      label: "代码反馈",
      value: String(input.codeFeedbackNeedsAttentionCount),
      tone: "info",
    });
  }

  if (input.activeProject?.title) {
    signals.push({
      label: "项目",
      value: input.activeProject.title,
      tone: "info",
    });
  }

  if (input.activeBookSession?.title) {
    signals.push({
      label: "同读书籍",
      value: `${input.activeBookSession.title} ${input.activeBookSession.progressPercent}%`,
      tone: "success",
    });
  }

  if (signals.length === 0 && input.todayLessonId) {
    signals.push({
      label: "今日笔记",
      value: String(input.todayNoteCount),
      tone: input.todayNoteCount > 0 ? "success" : "warning",
    });
    signals.push({
      label: "语音复盘",
      value: String(input.todayVoiceNoteCount),
      tone: input.todayVoiceNoteCount > 0 ? "success" : "info",
    });
  }

  return signals;
}

export async function getCurrentMissionData(
  userId: string,
): Promise<CurrentMissionData> {
  const profile = await getOrCreateUserProfile({ userId });
  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const now = new Date();
  const todayLocalDate = localDateInTimeZone({ date: now, timeZone });
  const reviewableFlashcardWhere = buildReviewableFlashcardWhere(userId);
  const codeFeedbackNeedsAttentionWhere = {
    userId,
    overall: { in: ["partially_correct", "incorrect", "cannot_judge"] },
  };

  const [
    todayPlan,
    dueFlashcardsCount,
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject,
  ] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId, localDate: todayLocalDate, isTest: false, archivedAt: null },
      select: { lessonId: true, status: true },
    }),
    prisma.flashcard.count({
      where: { ...reviewableFlashcardWhere, dueAt: { lte: now } },
    }),
    prisma.misconception.count({ where: { userId, status: "open" } }),
    prisma.misconception.findFirst({
      where: { userId, status: "open" },
      select: { id: true, summary: true, source: true, occurrenceCount: true },
      orderBy: [{ lastAttemptAt: "desc" }],
    }),
    prisma.codeFeedback.count({
      where: codeFeedbackNeedsAttentionWhere,
    }).catch(() => 0),
    prisma.codeFeedback.findFirst({
      where: codeFeedbackNeedsAttentionWhere,
      select: { summary: true, overall: true, localDate: true },
      orderBy: [{ updatedAt: "desc" }],
    }).catch(() => null),
    prisma.learningProject.findFirst({
      where: { userId, status: { not: "completed" } },
      include: { milestones: { orderBy: [{ position: "asc" }] } },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  const [todayNoteCount, todayVoiceNoteCount] = todayPlan
    ? await Promise.all([
        prisma.note.count({ where: { userId, lessonId: todayPlan.lessonId } }),
        prisma.voiceNote.count({ where: { userId, lessonId: todayPlan.lessonId } }),
      ])
    : [0, 0];

  const input: CurrentMissionInput = {
    todayPlanStatus: todayPlan?.status ?? null,
    dueFlashcardsCount,
    openMisconceptionCount,
    openMisconceptionFocus,
    codeFeedbackNeedsAttentionCount,
    codeFeedbackFocus,
    activeProject: activeProject
      ? {
          id: activeProject.id,
          title: activeProject.title,
          activeMilestoneTitle:
            activeProject.milestones.find((milestone) => milestone.status !== "completed")
              ?.title ?? null,
        }
      : null,
    todayLessonId: todayPlan?.lessonId ?? null,
    todayNoteCount,
    todayVoiceNoteCount,
    activeBookSession: getActiveBookSession(),
  };

  return {
    mission: buildCurrentMission(input),
    signals: buildCurrentMissionSignals(input),
    progress: buildCurrentMissionProgress(input),
    input,
    todayLocalDate,
  };
}
