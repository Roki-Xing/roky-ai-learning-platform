export type MistakeStatusFilter = "open" | "resolved" | "all";
export type MistakeSourceFilter = "all" | "quiz" | "code" | "coach" | "project";
export type MistakeKindFilter = "all" | "concept" | "code" | "algorithm" | "term" | "fact";

type MistakeRecord = {
  source?: string | null;
  summary?: string | null;
  prompt?: string | null;
  explanation?: string | null;
  userAnswer?: unknown;
};

type MistakeReviewCardInput = MistakeRecord & {
  id: string;
  userId: string;
  lessonId: string;
};

function compact(value: string | null | undefined, max = 280) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function stringifyUserAnswer(value: unknown) {
  if (value == null) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function parseMistakeStatusFilter(value: string | null | undefined): MistakeStatusFilter {
  if (value === "resolved" || value === "all") return value;
  return "open";
}

export function parseMistakeSourceFilter(value: string | null | undefined): MistakeSourceFilter {
  if (value === "quiz" || value === "code" || value === "coach" || value === "project") return value;
  return "all";
}

export function parseMistakeKindFilter(value: string | null | undefined): MistakeKindFilter {
  if (
    value === "concept" ||
    value === "code" ||
    value === "algorithm" ||
    value === "term" ||
    value === "fact"
  ) {
    return value;
  }
  return "all";
}

export function formatMistakeStatusLabel(status: string | null | undefined) {
  if (status === "resolved") return "已解决";
  if (status === "ignored") return "已忽略";
  return "未解决";
}

export function formatMistakeSourceLabel(source: string | null | undefined) {
  if (source === "code") return "代码反馈";
  if (source === "coach") return "Coach";
  if (source === "project") return "项目实践";
  return "小测验";
}

export function inferMistakeKind(record: MistakeRecord) {
  const haystack = [
    record.summary ?? "",
    record.prompt ?? "",
    record.explanation ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (
    /边界|越界|off-?by-?one|binary search|二分|边界条件|upper bound|lower bound/.test(haystack)
  ) {
    return "算法边界错误";
  }
  if (
    /benchmark|作者|年份|paper|论文|swe-bench|humaneval|humaneval|mmlu|gpqa/.test(haystack)
  ) {
    return "事实性错误";
  }
  if (
    /术语|term|缩写|rag|cot|lora|mcp|react|tot|moe|rlhf|dpo|sft/.test(haystack)
  ) {
    return "术语混淆";
  }
  if (record.source === "code") {
    return "代码错误";
  }
  return "概念误区";
}

export function mistakeMatchesKindFilter(record: MistakeRecord, filter: MistakeKindFilter) {
  if (filter === "all") return true;
  const kind = inferMistakeKind(record);
  if (filter === "concept") return kind === "概念误区";
  if (filter === "code") return kind === "代码错误";
  if (filter === "algorithm") return kind === "算法边界错误";
  if (filter === "term") return kind === "术语混淆";
  return kind === "事实性错误";
}

export function buildCoachDraftForMistake(record: MistakeRecord) {
  const userAnswer = stringifyUserAnswer(record.userAnswer);

  return [
    "请帮我解释这个误区，并给我一个最小反例或正确思路。",
    `误区摘要：${compact(record.summary)}`,
    `原问题/提示：${compact(record.prompt)}`,
    userAnswer ? `我之前的回答：${compact(userAnswer, 220)}` : "",
    record.explanation ? `系统解释：${compact(record.explanation)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildReviewCardForMistake(record: MistakeReviewCardInput) {
  const userAnswer = stringifyUserAnswer(record.userAnswer);
  const kind = inferMistakeKind(record);

  return {
    id: `mistake-card:${record.id}`,
    userId: record.userId,
    lessonId: record.lessonId,
    front: `错题修复：${compact(record.summary, 80)}`,
    back: [
      record.prompt ? `原问题：${compact(record.prompt)}` : "",
      userAnswer ? `我之前的回答：${compact(userAnswer, 220)}` : "",
      record.explanation ? `正确解释：${compact(record.explanation)}` : "",
      "下一步：用自己的话重讲一次，并在 Review 里评分。",
    ]
      .filter(Boolean)
      .join("\n\n"),
    type: "misconception",
    tags: ["mistake", record.source ?? "quiz", kind],
    dueAt: new Date(),
  };
}
