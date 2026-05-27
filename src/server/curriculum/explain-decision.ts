export type CurriculumDecisionExplanationSignalKey =
  | "weeklyRotation"
  | "underCoverage"
  | "weakness"
  | "mapWeakness"
  | "misconception"
  | "codingNeed"
  | "preference"
  | "novelty"
  | "remediation";

export type CurriculumDecisionExplanationSignal = {
  key: CurriculumDecisionExplanationSignalKey;
  label: string;
  value: number;
  active: boolean;
  detail: string;
};

export type CurriculumDecisionExplanation = {
  selectedDomain: string;
  selectedTopic: string;
  mainReason: string;
  signals: CurriculumDecisionExplanationSignal[];
  notes: string[];
  rawReason: string;
};

type ExplainCurriculumDecisionArgs = {
  domain?: string | null;
  topic?: string | null;
  reason?: string | null;
  scoreBreakdown?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function num(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function bool(record: Record<string, unknown>, key: string) {
  return record[key] === true;
}

function pct(value: number) {
  return `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;
}

function buildSignal(
  key: CurriculumDecisionExplanationSignalKey,
  label: string,
  value: number,
  threshold: number,
  detail: string,
): CurriculumDecisionExplanationSignal {
  return {
    key,
    label,
    value,
    active: value >= threshold,
    detail,
  };
}

export function explainCurriculumDecision(
  args: ExplainCurriculumDecisionArgs,
): CurriculumDecisionExplanation {
  const score = asRecord(args.scoreBreakdown);
  const selectedDomain = args.domain ?? "unknown";
  const selectedTopic = args.topic ?? "unknown";
  const rawReason = args.reason ?? "";

  const signals = [
    buildSignal(
      "weeklyRotation",
      "周计划匹配",
      num(score, "weeklyRotationScore"),
      0.7,
      `本周轮转匹配度 ${pct(num(score, "weeklyRotationScore"))}`,
    ),
    buildSignal(
      "underCoverage",
      "覆盖不足",
      num(score, "underCoverageScore"),
      0.6,
      `该领域覆盖不足程度 ${pct(num(score, "underCoverageScore"))}`,
    ),
    buildSignal(
      "weakness",
      "复习/测验薄弱",
      num(score, "weaknessScore"),
      0.5,
      `复习和测验暴露的薄弱信号 ${pct(num(score, "weaknessScore"))}`,
    ),
    buildSignal(
      "mapWeakness",
      "知识地图薄弱",
      num(score, "mapWeaknessScore"),
      0.5,
      `知识地图薄弱度 ${pct(num(score, "mapWeaknessScore"))}`,
    ),
    buildSignal(
      "misconception",
      "活跃误区",
      num(score, "misconceptionScore"),
      0.5,
      `开放错题和思路误区信号 ${pct(num(score, "misconceptionScore"))}`,
    ),
    buildSignal(
      "codingNeed",
      "代码练习需求",
      num(score, "codingNeedScore"),
      0.7,
      `最近代码练习不足信号 ${pct(num(score, "codingNeedScore"))}`,
    ),
    buildSignal(
      "preference",
      "个人偏好匹配",
      num(score, "userPreferenceScore"),
      0.5,
      `与你设置的学习偏好匹配度 ${pct(num(score, "userPreferenceScore"))}`,
    ),
    buildSignal(
      "novelty",
      "主题新鲜度",
      num(score, "noveltyScore"),
      0.7,
      `近期未重复学习的程度 ${pct(num(score, "noveltyScore"))}`,
    ),
    buildSignal(
      "remediation",
      "错题补弱",
      num(score, "remediationBoost"),
      0.2,
      `错题补弱加权 ${pct(num(score, "remediationBoost"))}`,
    ),
  ];

  const active = signals.filter((s) => s.active);
  const notes: string[] = [];
  if (bool(score, "recentTopicPenalty")) {
    notes.push("最近 7 次学习已覆盖相同主题，系统已降低重复主题优先级。");
  }
  if (bool(score, "recentDomainPenalty")) {
    notes.push("最近 3 次学习已覆盖相同领域，系统已降低连续领域重复。");
  }

  const mainReason = active.length
    ? `今天选择 ${selectedTopic}，主要因为${active
        .slice(0, 3)
        .map((s) => s.label)
        .join("、")}。`
    : `当前计划来自基础兜底选题：${rawReason || "暂无详细评分信号"}`;

  return {
    selectedDomain,
    selectedTopic,
    mainReason,
    signals,
    notes,
    rawReason,
  };
}
