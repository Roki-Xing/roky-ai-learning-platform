export type KnowledgeMapStat = {
  planCount: number;
  completedLessons: number;
  plannedLessons: number;
  flashcardCount: number;
  dueFlashcardCount: number;
  reviewedCardCount: number;
  reviewLogCount: number;
  quizAttemptCount: number;
  correctQuizCount: number;
  quizAccuracy: number;
  codeSubmissionCount: number;
  misconceptionCount: number;
  activeMisconceptionCount: number;
  lastStudiedLocalDate: string | null;
  masteryScore: number;
};

export type KnowledgeMapDomainInput = {
  slug: string;
  topics: Array<{ slug: string }>;
};

export type KnowledgeMapPlanInput = {
  id: string;
  lessonId: string;
  localDate: string;
  status: string;
  domainSlug: string;
  topicSlug: string;
};

export type KnowledgeMapSignalInput = {
  lessonId: string;
  domainSlug: string;
  topicSlug: string;
};

export type KnowledgeMapFlashcardInput = KnowledgeMapSignalInput & {
  dueAt: Date;
  reviewCount: number;
};

export type KnowledgeMapQuizAttemptInput = KnowledgeMapSignalInput & {
  isCorrect: boolean;
};

export type KnowledgeMapMisconceptionInput = KnowledgeMapSignalInput & {
  status: string;
};

export type KnowledgeMapInsightDomain = {
  slug: string;
  label: string;
  masteryScore: number;
  dueFlashcardCount: number;
  codeSubmissionCount: number;
  activeMisconceptionCount: number;
  lastStudiedLocalDate: string | null;
  reason: string;
};

export type KnowledgeMapInsightSummaryCard = {
  key: "weak" | "reviewDebt" | "codeLight" | "nextFocus";
  label: string;
  value: string;
  detail: string;
  domainSlug: string | null;
};

export type KnowledgeMapInsights = {
  weakDomains: KnowledgeMapInsightDomain[];
  reviewDebtDomains: KnowledgeMapInsightDomain[];
  codeLightDomains: KnowledgeMapInsightDomain[];
  nextFocus: KnowledgeMapInsightDomain | null;
  summaryCards: KnowledgeMapInsightSummaryCard[];
};

export function createEmptyKnowledgeMapStat(): KnowledgeMapStat {
  return {
    planCount: 0,
    completedLessons: 0,
    plannedLessons: 0,
    flashcardCount: 0,
    dueFlashcardCount: 0,
    reviewedCardCount: 0,
    reviewLogCount: 0,
    quizAttemptCount: 0,
    correctQuizCount: 0,
    quizAccuracy: 0,
    codeSubmissionCount: 0,
    misconceptionCount: 0,
    activeMisconceptionCount: 0,
    lastStudiedLocalDate: null,
    masteryScore: 0,
  };
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateKnowledgeMapMasteryScore(args: {
  completedLessons: number;
  reviewLogCount: number;
  correctQuizCount: number;
  codeSubmissionCount: number;
  dueFlashcardCount: number;
  activeMisconceptionCount: number;
}) {
  return clampScore(
    args.completedLessons * 10 +
      args.reviewLogCount * 2 +
      args.correctQuizCount * 3 +
      args.codeSubmissionCount * 3 -
      args.dueFlashcardCount -
      args.activeMisconceptionCount * 5,
  );
}

function touchLastStudied(stat: KnowledgeMapStat, localDate: string) {
  stat.lastStudiedLocalDate = stat.lastStudiedLocalDate
    ? [stat.lastStudiedLocalDate, localDate].sort().at(-1) ?? localDate
    : localDate;
}

function ensureStat(map: Map<string, KnowledgeMapStat>, slug: string) {
  const existing = map.get(slug);
  if (existing) return existing;
  const next = createEmptyKnowledgeMapStat();
  map.set(slug, next);
  return next;
}

function applyToDomainAndTopic(
  args: {
    domainStats: Map<string, KnowledgeMapStat>;
    topicStats: Map<string, KnowledgeMapStat>;
    signal: { domainSlug: string; topicSlug: string };
  },
  update: (stat: KnowledgeMapStat) => void,
) {
  update(ensureStat(args.domainStats, args.signal.domainSlug));
  update(ensureStat(args.topicStats, args.signal.topicSlug));
}

function finalize(stat: KnowledgeMapStat) {
  stat.quizAccuracy = stat.quizAttemptCount
    ? clampScore((stat.correctQuizCount / stat.quizAttemptCount) * 100)
    : 0;
  stat.masteryScore = calculateKnowledgeMapMasteryScore({
    completedLessons: stat.completedLessons,
    reviewLogCount: stat.reviewLogCount,
    correctQuizCount: stat.correctQuizCount,
    codeSubmissionCount: stat.codeSubmissionCount,
    dueFlashcardCount: stat.dueFlashcardCount,
    activeMisconceptionCount: stat.activeMisconceptionCount,
  });
}

export function aggregateKnowledgeMapStats(args: {
  now: Date;
  domains: KnowledgeMapDomainInput[];
  plans: KnowledgeMapPlanInput[];
  flashcards: KnowledgeMapFlashcardInput[];
  reviewLogs: KnowledgeMapSignalInput[];
  quizAttempts: KnowledgeMapQuizAttemptInput[];
  codeSubmissions: KnowledgeMapSignalInput[];
  misconceptions: KnowledgeMapMisconceptionInput[];
}) {
  const domainStats = new Map<string, KnowledgeMapStat>();
  const topicStats = new Map<string, KnowledgeMapStat>();

  for (const domain of args.domains) {
    domainStats.set(domain.slug, createEmptyKnowledgeMapStat());
    for (const topic of domain.topics) {
      topicStats.set(topic.slug, createEmptyKnowledgeMapStat());
    }
  }

  for (const plan of args.plans) {
    applyToDomainAndTopic(
      { domainStats, topicStats, signal: plan },
      (stat) => {
        stat.planCount += 1;
        if (plan.status === "completed") stat.completedLessons += 1;
        if (plan.status === "planned") stat.plannedLessons += 1;
        touchLastStudied(stat, plan.localDate);
      },
    );
  }

  for (const card of args.flashcards) {
    applyToDomainAndTopic(
      { domainStats, topicStats, signal: card },
      (stat) => {
        stat.flashcardCount += 1;
        if (card.dueAt <= args.now) stat.dueFlashcardCount += 1;
        if (card.reviewCount > 0) stat.reviewedCardCount += 1;
      },
    );
  }

  for (const log of args.reviewLogs) {
    applyToDomainAndTopic({ domainStats, topicStats, signal: log }, (stat) => {
      stat.reviewLogCount += 1;
    });
  }

  for (const attempt of args.quizAttempts) {
    applyToDomainAndTopic(
      { domainStats, topicStats, signal: attempt },
      (stat) => {
        stat.quizAttemptCount += 1;
        if (attempt.isCorrect) stat.correctQuizCount += 1;
      },
    );
  }

  for (const submission of args.codeSubmissions) {
    applyToDomainAndTopic(
      { domainStats, topicStats, signal: submission },
      (stat) => {
        stat.codeSubmissionCount += 1;
      },
    );
  }

  for (const misconception of args.misconceptions) {
    applyToDomainAndTopic(
      { domainStats, topicStats, signal: misconception },
      (stat) => {
        stat.misconceptionCount += 1;
        if (misconception.status === "open" || misconception.status === "active") {
          stat.activeMisconceptionCount += 1;
        }
      },
    );
  }

  for (const stat of domainStats.values()) finalize(stat);
  for (const stat of topicStats.values()) finalize(stat);

  return { domainStats, topicStats };
}

function hasLearningSignal(stat: KnowledgeMapStat) {
  return (
    stat.planCount > 0 ||
    stat.completedLessons > 0 ||
    stat.plannedLessons > 0 ||
    stat.flashcardCount > 0 ||
    stat.reviewLogCount > 0 ||
    stat.quizAttemptCount > 0 ||
    stat.codeSubmissionCount > 0 ||
    stat.misconceptionCount > 0
  );
}

function labelForDomain(labels: Record<string, string> | undefined, slug: string) {
  return labels?.[slug] ?? slug;
}

function insightReason(stat: KnowledgeMapStat) {
  const reasons: string[] = [];
  if (stat.activeMisconceptionCount > 0) reasons.push(`活跃错题 ${stat.activeMisconceptionCount}`);
  if (stat.dueFlashcardCount > 0) reasons.push(`复习欠账 ${stat.dueFlashcardCount}`);
  if ((stat.completedLessons > 0 || stat.plannedLessons > 0) && stat.codeSubmissionCount === 0) {
    reasons.push("代码练习 0");
  }
  if (stat.quizAttemptCount > 0 && stat.quizAccuracy < 70) {
    reasons.push(`测验正确率 ${stat.quizAccuracy}%`);
  }
  if (!reasons.length) reasons.push(`masteryScore ${stat.masteryScore}`);
  return reasons.join(" / ");
}

function toInsightDomain(
  slug: string,
  stat: KnowledgeMapStat,
  labels: Record<string, string> | undefined,
): KnowledgeMapInsightDomain {
  return {
    slug,
    label: labelForDomain(labels, slug),
    masteryScore: stat.masteryScore,
    dueFlashcardCount: stat.dueFlashcardCount,
    codeSubmissionCount: stat.codeSubmissionCount,
    activeMisconceptionCount: stat.activeMisconceptionCount,
    lastStudiedLocalDate: stat.lastStudiedLocalDate,
    reason: insightReason(stat),
  };
}

function nextFocusScore(stat: KnowledgeMapStat) {
  if (!hasLearningSignal(stat)) return -1;
  const codeGap =
    (stat.completedLessons > 0 || stat.plannedLessons > 0) && stat.codeSubmissionCount === 0
      ? 1
      : 0;
  const quizGap = stat.quizAttemptCount > 0 ? Math.max(0, 70 - stat.quizAccuracy) / 70 : 0;
  return (
    (100 - stat.masteryScore) / 100 +
    stat.activeMisconceptionCount * 0.8 +
    Math.min(stat.dueFlashcardCount, 5) * 0.25 +
    codeGap * 0.7 +
    quizGap * 0.4
  );
}

function emptySummaryCard(
  key: KnowledgeMapInsightSummaryCard["key"],
  label: string,
  detail: string,
): KnowledgeMapInsightSummaryCard {
  return { key, label, value: "-", detail, domainSlug: null };
}

export function buildKnowledgeMapInsights(args: {
  domainStats: Map<string, KnowledgeMapStat>;
  domainLabels?: Record<string, string>;
}): KnowledgeMapInsights {
  const learnedDomains = [...args.domainStats.entries()]
    .filter(([, stat]) => hasLearningSignal(stat))
    .map(([slug, stat]) => ({ slug, stat }));

  const weakDomains = learnedDomains
    .filter((item) => item.stat.masteryScore < 60 || item.stat.activeMisconceptionCount > 0)
    .sort((a, b) =>
      a.stat.masteryScore - b.stat.masteryScore ||
      b.stat.activeMisconceptionCount - a.stat.activeMisconceptionCount ||
      b.stat.dueFlashcardCount - a.stat.dueFlashcardCount,
    )
    .map((item) => toInsightDomain(item.slug, item.stat, args.domainLabels));

  const reviewDebtDomains = learnedDomains
    .filter((item) => item.stat.dueFlashcardCount > 0)
    .sort((a, b) =>
      b.stat.dueFlashcardCount - a.stat.dueFlashcardCount ||
      a.stat.masteryScore - b.stat.masteryScore,
    )
    .map((item) => toInsightDomain(item.slug, item.stat, args.domainLabels));

  const codeLightDomains = learnedDomains
    .filter(
      (item) =>
        (item.stat.completedLessons > 0 || item.stat.plannedLessons > 0) &&
        item.stat.codeSubmissionCount === 0,
    )
    .sort((a, b) =>
      a.stat.masteryScore - b.stat.masteryScore ||
      b.stat.completedLessons + b.stat.plannedLessons -
        (a.stat.completedLessons + a.stat.plannedLessons),
    )
    .map((item) => toInsightDomain(item.slug, item.stat, args.domainLabels));

  const next = learnedDomains
    .map((item) => ({ ...item, score: nextFocusScore(item.stat) }))
    .sort((a, b) => b.score - a.score || a.stat.masteryScore - b.stat.masteryScore)[0];
  const nextFocus = next ? toInsightDomain(next.slug, next.stat, args.domainLabels) : null;

  const weak = weakDomains[0] ?? null;
  const reviewDebt = reviewDebtDomains[0] ?? null;
  const codeLight = codeLightDomains[0] ?? null;

  return {
    weakDomains,
    reviewDebtDomains,
    codeLightDomains,
    nextFocus,
    summaryCards: [
      weak
        ? {
            key: "weak",
            label: "偏弱领域",
            value: weak.label,
            detail: weak.reason,
            domainSlug: weak.slug,
          }
        : emptySummaryCard("weak", "偏弱领域", "暂无明显薄弱领域"),
      reviewDebt
        ? {
            key: "reviewDebt",
            label: "复习欠账",
            value: reviewDebt.label,
            detail: reviewDebt.reason,
            domainSlug: reviewDebt.slug,
          }
        : emptySummaryCard("reviewDebt", "复习欠账", "暂无到期复习欠账"),
      codeLight
        ? {
            key: "codeLight",
            label: "代码练习少",
            value: codeLight.label,
            detail: codeLight.reason,
            domainSlug: codeLight.slug,
          }
        : emptySummaryCard("codeLight", "代码练习少", "已有学习领域均有代码提交"),
      nextFocus
        ? {
            key: "nextFocus",
            label: "下一步补哪里",
            value: nextFocus.label,
            detail: nextFocus.reason,
            domainSlug: nextFocus.slug,
          }
        : emptySummaryCard("nextFocus", "下一步补哪里", "先完成今日学习以生成地图信号"),
    ],
  };
}
