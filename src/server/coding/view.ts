export type CodeFeedbackIssueView = {
  type: string;
  severity: string;
  message: string;
};

export type CodeFeedbackCardView = {
  front: string;
  back: string;
  type?: string;
};

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export function normalizeCodeFeedbackIssues(value: unknown): CodeFeedbackIssueView[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") {
      return [{ type: "general", severity: "medium", message: item }];
    }
    if (typeof item !== "object" || item === null) return [];
    const rec = item as Record<string, unknown>;
    const message = typeof rec.message === "string" ? rec.message : null;
    if (!message) return [];
    return [
      {
        type: typeof rec.type === "string" ? rec.type : "general",
        severity: typeof rec.severity === "string" ? rec.severity : "medium",
        message,
      },
    ];
  });
}

export function normalizeCodeFeedbackCards(value: unknown): CodeFeedbackCardView[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const rec = item as Record<string, unknown>;
    const front = typeof rec.front === "string" ? rec.front : null;
    const back = typeof rec.back === "string" ? rec.back : null;
    if (!front || !back) return [];
    return [
      {
        front,
        back,
        type: typeof rec.type === "string" ? rec.type : undefined,
      },
    ];
  });
}

export function toCodeFeedbackView(feedback: {
  provider: string;
  overall?: string | null;
  summary: string;
  strengths?: unknown;
  issues?: unknown;
  suggestions?: unknown;
  hints?: unknown;
  suggestedTests?: unknown;
  flashcards?: unknown;
  nextSteps?: unknown;
  updatedAt: Date;
}) {
  const hints = stringArray(feedback.hints);
  return {
    provider: feedback.provider,
    overall: feedback.overall ?? null,
    summary: feedback.summary,
    strengths: stringArray(feedback.strengths),
    issues: normalizeCodeFeedbackIssues(feedback.issues),
    suggestions: stringArray(feedback.suggestions),
    hints: hints.length ? hints : stringArray(feedback.suggestions),
    suggestedTests: stringArray(feedback.suggestedTests),
    flashcards: normalizeCodeFeedbackCards(feedback.flashcards),
    nextSteps: stringArray(feedback.nextSteps),
    updatedAt: feedback.updatedAt.toISOString(),
  };
}

