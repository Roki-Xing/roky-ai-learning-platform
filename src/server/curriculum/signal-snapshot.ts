import type { CurriculumSignalSnapshot } from "@/server/curriculum/types";

export type CurriculumSignalSnapshotSummaryItem = {
  key:
    | "activeMisconceptions"
    | "incorrectQuiz"
    | "dueReview"
    | "hardReview"
    | "mapWeakness"
    | "codingPractice"
    | "completedCoverage";
  label: string;
  value: number;
  active: boolean;
  detail: string;
};

export type CurriculumSignalSnapshotSummary = {
  domainSlug: string;
  recentStudyText: string;
  items: CurriculumSignalSnapshotSummaryItem[];
  notes: string[];
};

export type TodayCurriculumSignalInsight = {
  domainSlug: string;
  recentStudyText: string;
  highlights: CurriculumSignalSnapshotSummaryItem[];
  summaryText: string;
  notes: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function numberRecord(value: unknown): Record<string, number> {
  return Object.fromEntries(
    Object.entries(asRecord(value)).filter(([, v]) => typeof v === "number" && Number.isFinite(v)),
  ) as Record<string, number>;
}

function domainValue(map: Record<string, number>, domainSlug: string) {
  return map[domainSlug] ?? 0;
}

function normalizeRecentStudies(value: unknown): CurriculumSignalSnapshot["recentStudies"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const r = asRecord(item);
      const domainSlug = typeof r.domainSlug === "string" ? r.domainSlug : null;
      const topicSlug = typeof r.topicSlug === "string" ? r.topicSlug : null;
      const localDate = typeof r.localDate === "string" ? r.localDate : null;
      return domainSlug && topicSlug && localDate ? { domainSlug, topicSlug, localDate } : null;
    })
    .filter((item): item is CurriculumSignalSnapshot["recentStudies"][number] => Boolean(item));
}

function normalizeSnapshot(value: unknown): CurriculumSignalSnapshot | null {
  const r = asRecord(value);
  const hasKnownKey =
    "recentStudies" in r ||
    "activeMisconceptionCountByDomain" in r ||
    "codeSubmissionCountLast7" in r;
  if (!hasKnownKey) return null;

  const codeSubmissionCountLast7 =
    typeof r.codeSubmissionCountLast7 === "number" && Number.isFinite(r.codeSubmissionCountLast7)
      ? r.codeSubmissionCountLast7
      : 0;

  return {
    recentStudies: normalizeRecentStudies(r.recentStudies),
    completedCountByDomain: numberRecord(r.completedCountByDomain),
    dueCountByDomain: numberRecord(r.dueCountByDomain),
    hardReviewCountByDomain: numberRecord(r.hardReviewCountByDomain),
    incorrectQuizCountByDomain: numberRecord(r.incorrectQuizCountByDomain),
    activeMisconceptionCountByDomain: numberRecord(r.activeMisconceptionCountByDomain),
    mapWeaknessByDomain: numberRecord(r.mapWeaknessByDomain),
    codeSubmissionCountLast7,
  };
}

export function extractCurriculumSignalSnapshot(inputSnapshot: unknown): CurriculumSignalSnapshot | null {
  const input = asRecord(inputSnapshot);
  const decision = asRecord(input.decision);
  return normalizeSnapshot(decision.signalSnapshot) ?? normalizeSnapshot(inputSnapshot);
}

export function summarizeCurriculumSignalSnapshot(
  snapshot: CurriculumSignalSnapshot | null,
  selectedDomainSlug?: string | null,
): CurriculumSignalSnapshotSummary | null {
  if (!snapshot) return null;

  const domainSlug =
    selectedDomainSlug ||
    snapshot.recentStudies[0]?.domainSlug ||
    Object.keys(snapshot.activeMisconceptionCountByDomain)[0] ||
    "unknown";

  const recentStudyText = snapshot.recentStudies.length
    ? snapshot.recentStudies
        .slice(0, 5)
        .map((s) => `${s.localDate} ${s.domainSlug}/${s.topicSlug}`)
        .join("; ")
    : "暂无最近学习记录";

  const activeMisconceptions = domainValue(snapshot.activeMisconceptionCountByDomain, domainSlug);
  const incorrectQuiz = domainValue(snapshot.incorrectQuizCountByDomain, domainSlug);
  const dueReview = domainValue(snapshot.dueCountByDomain, domainSlug);
  const hardReview = domainValue(snapshot.hardReviewCountByDomain, domainSlug);
  const mapWeakness = domainValue(snapshot.mapWeaknessByDomain, domainSlug);
  const completedCoverage = domainValue(snapshot.completedCountByDomain, domainSlug);
  const codeSubmissionCountLast7 = snapshot.codeSubmissionCountLast7;

  const items: CurriculumSignalSnapshotSummaryItem[] = [
    {
      key: "activeMisconceptions",
      label: "活跃误区",
      value: activeMisconceptions,
      active: activeMisconceptions > 0,
      detail: `${domainSlug}: ${activeMisconceptions} 个 open/active misconception`,
    },
    {
      key: "incorrectQuiz",
      label: "错题压力",
      value: incorrectQuiz,
      active: incorrectQuiz > 0,
      detail: `${domainSlug}: ${incorrectQuiz} 次近期 quiz 错误`,
    },
    {
      key: "dueReview",
      label: "到期复习",
      value: dueReview,
      active: dueReview > 0,
      detail: `${domainSlug}: ${dueReview} 张到期卡片`,
    },
    {
      key: "hardReview",
      label: "困难复习",
      value: hardReview,
      active: hardReview > 0,
      detail: `${domainSlug}: ${hardReview} 次 forgot/hard 复习`,
    },
    {
      key: "mapWeakness",
      label: "地图薄弱",
      value: mapWeakness,
      active: mapWeakness >= 0.5,
      detail: `${domainSlug}: 知识地图弱点 ${Math.round(Math.max(0, Math.min(1, mapWeakness)) * 100)}%`,
    },
    {
      key: "codingPractice",
      label: "代码练习",
      value: codeSubmissionCountLast7,
      active: codeSubmissionCountLast7 < 2,
      detail: `近 7 天代码提交 ${codeSubmissionCountLast7} 次`,
    },
    {
      key: "completedCoverage",
      label: "完成覆盖",
      value: completedCoverage,
      active: completedCoverage === 0,
      detail: `${domainSlug}: 已完成 ${completedCoverage} 节正式课程`,
    },
  ];

  const notes: string[] = [];
  if (codeSubmissionCountLast7 < 2) {
    notes.push(`近 7 天代码提交为 ${codeSubmissionCountLast7}，Planner 会提高 Python/算法实现练习权重。`);
  }
  if (snapshot.recentStudies.some((s) => s.domainSlug === domainSlug)) {
    notes.push("该领域近期出现过，只有弱点或补弱信号足够强时才应继续选择。");
  }
  if (activeMisconceptions > 0 || incorrectQuiz > 0 || hardReview > 0) {
    notes.push("当前选择受到错误、复习或 Coach 误区的补弱信号影响。");
  }

  return { domainSlug, recentStudyText, items, notes };
}

export function buildTodayCurriculumSignalInsight(
  inputSnapshot: unknown,
  selectedDomainSlug?: string | null,
): TodayCurriculumSignalInsight | null {
  const summary = summarizeCurriculumSignalSnapshot(
    extractCurriculumSignalSnapshot(inputSnapshot),
    selectedDomainSlug,
  );
  if (!summary) return null;

  const highlights = summary.items.filter((item) => item.active);
  const summaryText = highlights.length
    ? `今日选题依据包含：${highlights.map((item) => item.label).join("、")}。`
    : "暂无明显补弱信号，今天主要来自基础轮转、覆盖和主题新鲜度。";

  return {
    domainSlug: summary.domainSlug,
    recentStudyText: summary.recentStudyText,
    highlights,
    summaryText,
    notes: summary.notes,
  };
}
