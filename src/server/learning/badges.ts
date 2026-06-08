export type LearningBadge = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  progressCurrent: number;
  progressTarget: number;
};

export type LearningBadgeInput = {
  streakDays: number;
  codeSubmissions: number;
  voiceNotes: number;
  thoughtReviews: number;
  resolvedMisconceptions: number;
  completedProjects: number;
  glossaryCards: number;
  radarCards: number;
};

function badge(args: {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
}): LearningBadge {
  return {
    id: args.id,
    title: args.title,
    description: args.description,
    progressCurrent: args.current,
    progressTarget: args.target,
    earned: args.current >= args.target,
  };
}

/**
 * Builds badge progress without creating badge records.
 *
 * Args:
 *   input: Aggregated counts for milestone-like learning actions.
 *
 * Returns:
 *   The deterministic badge shelf state for the current user.
 */
export function buildLearningBadges(input: LearningBadgeInput): LearningBadge[] {
  return [
    badge({
      id: "streak-7",
      title: "7 天连续学习",
      description: "连续 7 天完成课程。",
      current: input.streakDays,
      target: 7,
    }),
    badge({
      id: "first-code",
      title: "首次提交代码",
      description: "完成第一段代码练习或项目草稿。",
      current: input.codeSubmissions,
      target: 1,
    }),
    badge({
      id: "first-voice",
      title: "首次语音笔记",
      description: "第一次说出自己的理解。",
      current: input.voiceNotes,
      target: 1,
    }),
    badge({
      id: "first-coach",
      title: "首次 Coach 评审",
      description: "让 Coach 检查一次理解。",
      current: input.thoughtReviews,
      target: 1,
    }),
    badge({
      id: "first-mistake-resolved",
      title: "首次解决误区",
      description: "把一个错误点修复成资产。",
      current: input.resolvedMisconceptions,
      target: 1,
    }),
    badge({
      id: "first-project",
      title: "首次完成项目",
      description: "完成一个完整项目作品。",
      current: input.completedProjects,
      target: 1,
    }),
    badge({
      id: "glossary-10",
      title: "术语卡 10 张",
      description: "把 10 个术语变成复习卡。",
      current: input.glossaryCards,
      target: 10,
    }),
    badge({
      id: "radar-10",
      title: "Radar 卡 10 张",
      description: "把 10 个广度实体变成复习卡。",
      current: input.radarCards,
      target: 10,
    }),
  ];
}
