export type DailyQuestStatus = "not_started" | "in_progress" | "completed";

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  status: DailyQuestStatus;
  rewardXp: number;
  href: string;
  ctaLabel: string;
};

export type DailyQuestInput = {
  todayPlanStatus: string | null;
  dueFlashcardsCount: number;
  todayNoteCount: number;
  todayVoiceNoteCount: number;
  todayCodeSubmissionCount: number;
  activeProjectMilestoneCompletedToday: boolean;
  breadthChallenge?: {
    kind: "term" | "person" | "benchmark";
    title: string;
    href: string;
    completed: boolean;
  } | null;
};

type LessonKnowledgeConnections = {
  glossary?: {
    term?: unknown;
    sourceSlug?: unknown;
  } | null;
  breadth?: {
    kind?: unknown;
    title?: unknown;
    sourceKind?: unknown;
    sourceSlug?: unknown;
  } | null;
  knowledgeFocus?: {
    rotation?: {
      focus?: unknown;
    } | null;
  } | null;
} | null;

function normalizeQuestSlug(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRadarChallengeKind(value: unknown): "person" | "benchmark" | null {
  if (value === "person") return "person";
  if (value === "benchmark") return "benchmark";
  return null;
}

function shouldUseRadarBreadthChallenge(args: {
  focus: unknown;
  radarKind: "person" | "benchmark" | null;
}) {
  if (!args.radarKind) return false;
  return args.focus === args.radarKind;
}

function completedOrStarted(count: number): DailyQuestStatus {
  return count > 0 ? "completed" : "not_started";
}

function breadthChallengeTitle(kind: NonNullable<DailyQuestInput["breadthChallenge"]>["kind"]) {
  if (kind === "person") return "今日人物挑战";
  if (kind === "benchmark") return "今日 Benchmark 挑战";
  return "今日术语挑战";
}

function buildBreadthChallengeQuest(
  challenge: NonNullable<DailyQuestInput["breadthChallenge"]>,
): DailyQuest {
  return {
    id: "breadth-challenge",
    title: breadthChallengeTitle(challenge.kind),
    description: `理解并自测：${challenge.title}。`,
    status: challenge.completed ? "completed" : "not_started",
    rewardXp: 15,
    href: challenge.href,
    ctaLabel: "探索",
  };
}

export function buildBreadthChallengeFromLessonConnections(args: {
  userId: string;
  connections: unknown;
  generatedCardIds: Set<string>;
}): DailyQuestInput["breadthChallenge"] {
  const connections =
    typeof args.connections === "object" && args.connections !== null
      ? (args.connections as LessonKnowledgeConnections)
      : null;
  const radarSlug = normalizeQuestSlug(connections?.breadth?.sourceSlug);
  const radarTitle = normalizeQuestSlug(connections?.breadth?.title);
  const radarKind = normalizeRadarChallengeKind(connections?.breadth?.kind);
  const hasRadarChallenge =
    connections?.breadth?.sourceKind === "radar" && radarSlug && radarTitle && radarKind;
  const rotationFocus = connections?.knowledgeFocus?.rotation?.focus;
  if (hasRadarChallenge && shouldUseRadarBreadthChallenge({ focus: rotationFocus, radarKind })) {
    return {
      kind: radarKind,
      title: radarTitle,
      href: `/radar?entity=${encodeURIComponent(radarSlug)}`,
      completed: args.generatedCardIds.has(`radar:${args.userId}:${radarSlug}`),
    };
  }

  const glossarySlug = normalizeQuestSlug(connections?.glossary?.sourceSlug);
  const glossaryTitle = normalizeQuestSlug(connections?.glossary?.term);
  if (glossarySlug && glossaryTitle) {
    return {
      kind: "term",
      title: glossaryTitle,
      href: `/glossary?term=${encodeURIComponent(glossarySlug)}`,
      completed: args.generatedCardIds.has(`glossary:${args.userId}:${glossarySlug}`),
    };
  }

  if (hasRadarChallenge) {
    return {
      kind: radarKind,
      title: radarTitle,
      href: `/radar?entity=${encodeURIComponent(radarSlug)}`,
      completed: args.generatedCardIds.has(`radar:${args.userId}:${radarSlug}`),
    };
  }

  return null;
}

/**
 * Builds the daily quest list from existing learning signals.
 *
 * Args:
 *   input: Today's plan, review, note, voice, code, and project signals.
 *
 * Returns:
 *   A stable quest list with status, reward, and navigation target.
 */
export function buildDailyQuests(input: DailyQuestInput): DailyQuest[] {
  const todayDone = input.todayPlanStatus === "completed";
  const quests: DailyQuest[] = [
    {
      id: "complete-today",
      title: "完成今日学习",
      description: "走完主课、引导步骤、小测验和反思。",
      status: todayDone ? "completed" : input.todayPlanStatus ? "in_progress" : "not_started",
      rewardXp: 50,
      href: "/today",
      ctaLabel: todayDone ? "查看" : "继续",
    },
    {
      id: "clear-review",
      title: "清空到期卡片",
      description: "把今天该复习的卡片先主动回忆一遍。",
      status: input.dueFlashcardsCount <= 0 ? "completed" : "in_progress",
      rewardXp: 25,
      href: "/review",
      ctaLabel: "复习",
    },
    {
      id: "write-note",
      title: "写一句笔记",
      description: "用自己的话沉淀今天的一个理解。",
      status: completedOrStarted(input.todayNoteCount),
      rewardXp: 20,
      href: "/notes",
      ctaLabel: "记录",
    },
    {
      id: "voice-reflection",
      title: "说出今天理解",
      description: "用 60 秒讲清楚今天最重要的概念。",
      status: completedOrStarted(input.todayVoiceNoteCount),
      rewardXp: 20,
      href: "/voice",
      ctaLabel: "语音",
    },
    {
      id: "code-or-project",
      title: "推进代码或项目",
      description: "提交一次代码练习，或完成一个项目里程碑。",
      status:
        input.todayCodeSubmissionCount > 0 || input.activeProjectMilestoneCompletedToday
          ? "completed"
          : "not_started",
      rewardXp: 30,
      href: "/projects",
      ctaLabel: "实践",
    },
  ];
  if (input.breadthChallenge) quests.splice(4, 0, buildBreadthChallengeQuest(input.breadthChallenge));
  return quests;
}

export function summarizeDailyQuestProgress(quests: DailyQuest[]) {
  const completed = quests.filter((quest) => quest.status === "completed").length;
  const total = quests.length;
  const earnedXp = quests
    .filter((quest) => quest.status === "completed")
    .reduce((sum, quest) => sum + quest.rewardXp, 0);

  return {
    completed,
    total,
    ratio: total ? completed / total : 0,
    earnedXp,
    possibleXp: quests.reduce((sum, quest) => sum + quest.rewardXp, 0),
  };
}
