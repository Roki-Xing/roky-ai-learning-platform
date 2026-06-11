import type { LearningStatusTone } from "@/components/learning/learning-status-badge";

export type ReviewSessionCounts = {
  forgot: number;
  hard: number;
  good: number;
  easy: number;
};

export type ReviewSessionRatedCard = {
  id: string;
  front: string;
  rating: keyof ReviewSessionCounts;
  type: string | null;
  tags?: string[] | null;
  lessonTitle?: string | null;
  topicTitle?: string | null;
};

export type ReviewSessionWeakArea = {
  label: string;
  weakCount: number;
  forgotCount: number;
  hardCount: number;
  lessonTitle: string | null;
  topicTitle: string | null;
  exampleCards: string[];
};

export type ReviewSessionRemediationAction = {
  href: string;
  label: string;
  description: string;
};

export type ReviewSessionSummary = {
  reviewedCount: number;
  retainedCount: number;
  weakCount: number;
  retentionRate: number;
  ratingBreakdown: ReviewSessionCounts;
  title: string;
  description: string;
  tone: LearningStatusTone;
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  weakAreas: ReviewSessionWeakArea[];
  recommendations: string[];
  remediationLessonLabel: string | null;
  remediationActions: ReviewSessionRemediationAction[];
  actionPlan: Array<{
    title: string;
    description: string;
  }>;
};

const REVIEW_SOURCE_TAGS = new Set([
  "glossary",
  "radar",
  "voice-note",
  "thought-review",
  "project",
  "code-feedback",
]);

const TAG_LABELS: Record<string, string> = {
  rag: "RAG",
  rlhf: "RLHF",
  dpo: "DPO",
  sft: "SFT",
  lora: "LoRA",
  moe: "MoE",
  mmlu: "MMLU",
  gpqa: "GPQA",
  cot: "CoT",
  react: "ReAct",
  tot: "ToT",
  mcp: "MCP",
  humaneval: "HumanEval",
  "swe-bench": "SWE-bench",
};

const TYPE_LABELS: Record<string, string> = {
  concept: "概念卡",
  glossary: "术语卡",
  radar: "广度卡",
  code: "代码卡",
  quiz: "测验卡",
  misconception: "错题卡",
};

const REVIEW_NO_NEW_CONTENT_CUE = "今天先不要学新内容，建议复习和修复。";

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function uniq(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

function compactCardFront(front: string) {
  const trimmed = front.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 56) return trimmed;
  return `${trimmed.slice(0, 53)}...`;
}

function formatTypeLabel(type: string | null) {
  if (!type) return "复习卡";
  return TYPE_LABELS[type] ?? `${type} 卡`;
}

function formatTagLabel(tag: string) {
  const normalized = tag.trim().toLowerCase();
  if (!normalized) return "";
  if (TAG_LABELS[normalized]) return TAG_LABELS[normalized];
  return normalized.replace(/[_/]+/g, " ").replace(/-/g, " ");
}

function pickWeakAreaLabel(card: ReviewSessionRatedCard) {
  const tags = (card.tags ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag && !REVIEW_SOURCE_TAGS.has(tag.toLowerCase()));

  const firstTag = tags[0];
  if (firstTag) return formatTagLabel(firstTag);
  if (card.topicTitle?.trim()) return card.topicTitle.trim();
  if (card.lessonTitle?.trim()) return card.lessonTitle.trim();
  return formatTypeLabel(card.type);
}

function buildWeakAreas(ratedCards: ReviewSessionRatedCard[]) {
  const buckets = new Map<string, ReviewSessionWeakArea>();

  for (const card of ratedCards) {
    if (card.rating !== "forgot" && card.rating !== "hard") continue;

    const label = pickWeakAreaLabel(card);
    const key = label.toLowerCase();
    const existing = buckets.get(key);

    if (existing) {
      existing.weakCount += 1;
      if (card.rating === "forgot") existing.forgotCount += 1;
      if (card.rating === "hard") existing.hardCount += 1;
      if (existing.exampleCards.length < 2) {
        existing.exampleCards = uniq([...existing.exampleCards, compactCardFront(card.front)]).slice(0, 2);
      }
      continue;
    }

    buckets.set(key, {
      label,
      weakCount: 1,
      forgotCount: card.rating === "forgot" ? 1 : 0,
      hardCount: card.rating === "hard" ? 1 : 0,
      lessonTitle: card.lessonTitle?.trim() || null,
      topicTitle: card.topicTitle?.trim() || null,
      exampleCards: [compactCardFront(card.front)],
    });
  }

  return Array.from(buckets.values())
    .sort((a, b) => b.weakCount - a.weakCount || b.forgotCount - a.forgotCount || a.label.localeCompare(b.label))
    .slice(0, 3);
}

function buildCoachDraft(weakAreas: ReviewSessionWeakArea[], counts: ReviewSessionCounts) {
  const lines = [
    "我刚完成一轮复习，请帮我做补弱总结。",
    `评分分布：忘了 ${counts.forgot}，模糊 ${counts.hard}，记得 ${counts.good}，很熟 ${counts.easy}。`,
    "主要薄弱：",
    ...weakAreas.map((area) => {
      const examples = area.exampleCards.length ? `；相关卡片：${area.exampleCards.join(" / ")}` : "";
      return `- ${area.label}（忘了 ${area.forgotCount}，模糊 ${area.hardCount}）${examples}`;
    }),
    "请输出：",
    "1. 我最容易混淆的概念",
    "2. 一个最小例子或反例",
    "3. 明天 10 分钟补弱安排",
  ];

  return lines.join("\n");
}

function buildCoachHref(weakAreas: ReviewSessionWeakArea[], counts: ReviewSessionCounts) {
  const params = new URLSearchParams({
    mode: "concept_question",
    draft: buildCoachDraft(weakAreas, counts),
  });
  return `/coach?${params.toString()}`;
}

function buildRemediationLessonHref(
  weakAreas: ReviewSessionWeakArea[],
  options: { when?: "tomorrow" } = {},
) {
  const topWeak = weakAreas[0] ?? null;
  const params = new URLSearchParams({
    mode: "remediation",
    source: "review",
  });

  if (topWeak?.label) params.set("focus", topWeak.label);
  if (topWeak?.lessonTitle) params.set("lesson", topWeak.lessonTitle);
  if (topWeak?.topicTitle) params.set("topic", topWeak.topicTitle);
  if (options.when) params.set("when", options.when);

  return `/today?${params.toString()}`;
}

function buildRemediationActions(args: {
  weakCount: number;
  counts: ReviewSessionCounts;
  weakAreas: ReviewSessionWeakArea[];
}): ReviewSessionRemediationAction[] {
  const { weakCount, counts, weakAreas } = args;
  if (!weakCount) return [];

  const topWeak = weakAreas[0] ?? null;
  const focusLabel = topWeak?.label ?? "本轮忘了/模糊卡片";

  return [
    {
      href: buildCoachHref(weakAreas, counts),
      label: "让 Coach 解释这些卡片",
      description: `带着 ${focusLabel} 进入 Coach，先拆概念缺口、最小例子和反例。`,
    },
    {
      href: buildRemediationLessonHref(weakAreas),
      label: "生成补弱小课",
      description: `把 ${focusLabel} 安排成 Today 的 10 分钟补弱短课。`,
    },
    {
      href: buildRemediationLessonHref(weakAreas, { when: "tomorrow" }),
      label: "明天安排补弱",
      description: `明天先用 10 分钟复盘 ${focusLabel}，再决定是否继续开新内容。`,
    },
    {
      href: "/mistakes",
      label: "查看错题中心",
      description: "检查同类错题和误区是否还没有解决，避免复习卡单点补弱。",
    },
  ];
}

function buildRecommendations(args: {
  retentionRate: number;
  counts: ReviewSessionCounts;
  weakAreas: ReviewSessionWeakArea[];
}) {
  const { retentionRate, counts, weakAreas } = args;
  const topWeak = weakAreas[0] ?? null;
  const focusLabel = topWeak?.label ?? "最弱的一组卡片";
  const reviewAnchor = topWeak?.lessonTitle ?? topWeak?.topicTitle ?? focusLabel;
  const promptCoachText =
    counts.forgot > 0
      ? `把 ${counts.forgot} 张“忘了”卡交给 Coach，先拆概念缺口和最小例子。`
      : `把最模糊的 ${Math.max(1, counts.hard)} 张卡交给 Coach，补齐边界条件和反例。`;

  if (!weakAreas.length) {
    return [
      "保持今天的复习节奏，不要因为一轮顺手就突然加量。",
      "先回到今日任务，把主课、测验和反思闭环走完。",
      "明天继续按到期队列复习，优先保持稳定留存。",
    ];
  }

  if (retentionRate >= 70) {
    return [
      `主线可以继续推进，但明天先补 10 分钟：${focusLabel}。`,
      `先回看 ${reviewAnchor} 对应部分，再把忘掉的卡片改写成自己的解释。`,
      promptCoachText,
    ];
  }

  return [
    `明天先安排 10 分钟补弱：${focusLabel}。`,
    `先回看 ${reviewAnchor} 对应内容，再把相关卡片各讲一遍。`,
    promptCoachText,
  ];
}

export function buildReviewSessionSummary(
  counts: ReviewSessionCounts,
  ratedCards: ReviewSessionRatedCard[] = [],
): ReviewSessionSummary {
  const forgot = Math.max(0, counts.forgot);
  const hard = Math.max(0, counts.hard);
  const good = Math.max(0, counts.good);
  const easy = Math.max(0, counts.easy);
  const reviewedCount = forgot + hard + good + easy;
  const retainedCount = good + easy;
  const weakCount = forgot + hard;
  const retentionRate = pct(retainedCount, reviewedCount);
  const ratingBreakdown = { forgot, hard, good, easy };
  const weakAreas = buildWeakAreas(ratedCards);
  const topWeak = weakAreas[0] ?? null;
  const recommendations = buildRecommendations({ retentionRate, counts: ratingBreakdown, weakAreas });
  const remediationLessonLabel = topWeak?.label ?? null;
  const coachHref = weakAreas.length ? buildCoachHref(weakAreas, ratingBreakdown) : "/coach";
  const remediationActions = buildRemediationActions({
    weakCount,
    counts: ratingBreakdown,
    weakAreas,
  });

  if (weakCount > retainedCount) {
    return {
      reviewedCount,
      retainedCount,
      weakCount,
      retentionRate,
      ratingBreakdown,
      title: "这轮复习暴露了补弱点",
      description: topWeak
        ? `留存率 ${retentionRate}%。${REVIEW_NO_NEW_CONTENT_CUE} 最弱的是「${topWeak.label}」，先补弱再回到主线。`
        : `留存率 ${retentionRate}%。${REVIEW_NO_NEW_CONTENT_CUE} 先把忘了和模糊的卡片写成自己的理解，再交给 Coach 找概念缺口。`,
      tone: "danger",
      primaryAction: { href: coachHref, label: "让 Coach 拆解薄弱点" },
      secondaryAction: { href: "/today", label: "回到今日学习" },
      weakAreas,
      recommendations,
      remediationLessonLabel,
      remediationActions,
      actionPlan: [
        {
          title: topWeak ? `先补 ${topWeak.label}` : "先复述忘记的卡片",
          description: topWeak
            ? `明天先花 10 分钟把 ${topWeak.label} 讲给自己听，再决定是否开新内容。`
            : "把忘了和模糊的卡片用自己的话各写一句，别急着开新内容。",
        },
        {
          title: "把忘掉的卡片改写成自己的解释",
          description: "先用自己的话重写最不稳的卡片，再把解释交给 Coach 找缺口。",
        },
        {
          title: "交给 Coach 生成补弱问题",
          description: "让 Coach 用最小例子、反例和追问帮你补齐边界条件。",
        },
      ],
    };
  }

  if (retentionRate >= 70) {
    return {
      reviewedCount,
      retainedCount,
      weakCount,
      retentionRate,
      ratingBreakdown,
      title: "这轮复习保持稳定",
      description: topWeak
        ? `留存率 ${retentionRate}%。主线可以继续，但记得顺手补一下「${topWeak.label}」。`
        : `留存率 ${retentionRate}%。可以看进度曲线，再决定继续复习还是推进今日任务。`,
      tone: "success",
      primaryAction: { href: "/progress", label: "查看进度" },
      secondaryAction: { href: "/today", label: "回到今日学习" },
      weakAreas,
      recommendations,
      remediationLessonLabel,
      remediationActions,
      actionPlan: [
        {
          title: "查看进度趋势",
          description: "确认强项是否稳定增长，避免只凭这轮复习的感觉判断。",
        },
        {
          title: topWeak ? `顺手补 ${topWeak.label}` : "继续今日任务",
          description: topWeak
            ? `保留主线推进，但明天先花 10 分钟补 ${topWeak.label}。`
            : "如果今日学习还没完成，优先把主课、测验和反思走完。",
        },
        {
          title: "保持明天复习节奏",
          description: "留存稳定时不要加量过猛，按到期队列继续推进。",
        },
      ],
    };
  }

  return {
    reviewedCount,
    retainedCount,
    weakCount,
    retentionRate,
    ratingBreakdown,
    title: "这轮复习有稳定也有欠账",
    description: topWeak
      ? `留存率 ${retentionRate}%。先清理「${topWeak.label}」，再回到今日学习继续沉淀。`
      : `留存率 ${retentionRate}%。先清理模糊卡片，再回到今日学习继续沉淀。`,
    tone: "warning",
    primaryAction: weakAreas.length
      ? { href: coachHref, label: "让 Coach 帮我补弱" }
      : { href: "/review", label: "继续复习" },
    secondaryAction: { href: "/today", label: "回到今日学习" },
    weakAreas,
    recommendations,
    remediationLessonLabel,
    remediationActions,
    actionPlan: [
      {
        title: topWeak ? `先清理 ${topWeak.label}` : "先清理模糊卡片",
        description: topWeak
          ? `先把 ${topWeak.label} 相关卡片再过一轮，确认问题是记忆不稳还是概念没懂。`
          : "把 hard 卡片再过一轮，确认问题是记忆不稳还是概念没懂。",
      },
      {
        title: "补一句自己的解释",
        description: "为最不稳的一张卡写一句自己的理解，再决定是否送 Coach。",
      },
      {
        title: "安排明天补弱",
        description: topWeak
          ? `明天把 ${topWeak.label} 安排成一节 10 分钟短课，再回到主线。`
          : "完成补弱后再继续今日任务，保持复习和新内容的节奏。",
      },
    ],
  };
}
