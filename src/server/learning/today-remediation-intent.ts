export type TodayRemediationSearchParams = Record<string, string | string[] | undefined>;

export type TodayRemediationIntent = {
  title: string;
  sourceLabel: string;
  focusLabel: string;
  lessonTitle: string | null;
  topicTitle: string | null;
  statusLabel: string;
  returnHref: string;
  returnActionLabel: string;
  primaryActionLabel: string;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanParam(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildTodayRemediationIntent(
  params: TodayRemediationSearchParams,
): TodayRemediationIntent | null {
  const mode = cleanParam(firstParam(params.mode));
  const source = cleanParam(firstParam(params.source));

  if (mode !== "remediation") return null;

  if (source === "mistake") {
    return {
      title: "Mistake 同类题短练习",
      sourceLabel: "错题修复中心",
      focusLabel: cleanParam(firstParam(params.focus)) ?? "当前误区",
      lessonTitle: cleanParam(firstParam(params.lesson)),
      topicTitle: cleanParam(firstParam(params.topic)),
      statusLabel: "同类题已带入",
      returnHref: "/mistakes",
      returnActionLabel: "回到错题中心",
      primaryActionLabel: "生成同类题短练习",
    };
  }

  if (source !== "review") return null;

  return {
    title: "Review 补弱短课",
    sourceLabel: "Review Session Summary",
    focusLabel: cleanParam(firstParam(params.focus)) ?? "本轮忘了/模糊卡片",
    lessonTitle: cleanParam(firstParam(params.lesson)),
    topicTitle: cleanParam(firstParam(params.topic)),
    statusLabel: "补弱短课已带入",
    returnHref: "/review",
    returnActionLabel: "继续复习",
    primaryActionLabel: "生成补弱小课",
  };
}
