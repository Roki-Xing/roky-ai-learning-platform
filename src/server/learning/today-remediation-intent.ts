export type TodayRemediationSearchParams = Record<string, string | string[] | undefined>;

export type TodayRemediationIntent = {
  title: string;
  sourceLabel: string;
  focusLabel: string;
  lessonTitle: string | null;
  topicTitle: string | null;
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

  if (mode !== "remediation" || source !== "review") return null;

  return {
    title: "Review 补弱短课",
    sourceLabel: "Review Session Summary",
    focusLabel: cleanParam(firstParam(params.focus)) ?? "本轮忘了/模糊卡片",
    lessonTitle: cleanParam(firstParam(params.lesson)),
    topicTitle: cleanParam(firstParam(params.topic)),
  };
}
