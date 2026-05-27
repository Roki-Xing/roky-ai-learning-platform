import { z } from "zod";

export const ThoughtReviewSchema = z
  .object({
    normalizedText: z.string().min(1),
    mainClaim: z.string().min(1),
    whatIsCorrect: z.array(z.string().min(1)).default([]),
    possibleIssues: z
      .array(
        z
          .object({
            type: z.enum([
              "conceptual",
              "factual",
              "logical",
              "missing_context",
              "implementation",
              "terminology",
            ]),
            severity: z.enum(["low", "medium", "high"]),
            issue: z.string().min(1),
            explanation: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
    missingConcepts: z
      .array(
        z.object({
          term: z.string().min(1),
          reason: z.string().min(1),
        }),
      )
      .default([]),
    relatedTerms: z.array(z.string().min(1)).default([]),
    socraticQuestions: z.array(z.string().min(1)).default([]),
    suggestedNextLessons: z.array(z.string().min(1)).default([]),
    flashcards: z
      .array(
        z
          .object({
            front: z.string().min(1),
            back: z.string().min(1),
            type: z.enum(["concept", "term", "mistake", "code", "algorithm"]),
          })
          .strict(),
      )
      .default([]),
    finalAdvice: z.string().min(1),
  })
  .strict();

export type ThoughtReviewResult = z.infer<typeof ThoughtReviewSchema>;

const STORED_REVIEW_KEYS = new Set(Object.keys(ThoughtReviewSchema.shape));

export function parseStoredThoughtReview(value: unknown): ThoughtReviewResult {
  if (typeof value !== "object" || value === null) {
    return ThoughtReviewSchema.parse(value);
  }
  const review = Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([key]) =>
      STORED_REVIEW_KEYS.has(key),
    ),
  );
  return ThoughtReviewSchema.parse(review);
}

function stripToJsonObject(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return raw.trim();
  return raw.slice(start, end + 1);
}

function shortText(text: string, max = 180) {
  const oneLine = text.trim().replace(/\s+/g, " ");
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export function fallbackThoughtReview(args: {
  mode: string;
  rawText: string;
  lessonTitle?: string | null;
}): ThoughtReviewResult {
  const raw = args.rawText.trim();
  const claim = shortText(raw, 140);
  const lower = raw.toLowerCase();
  const isCode =
    args.mode === "code_reasoning" ||
    /\b(def|return|for|while|softmax|function|bug|代码|实现)\b/i.test(raw);
  const isAttention = /attention|transformer|token|q\/k\/v|qkv|注意力/i.test(raw);

  const possibleIssues: ThoughtReviewResult["possibleIssues"] = [];
  const missingConcepts: ThoughtReviewResult["missingConcepts"] = [];
  const relatedTerms = new Set<string>();

  if (isAttention) {
    relatedTerms.add("Self-Attention");
    relatedTerms.add("Q/K/V");
    relatedTerms.add("Softmax");
    if (/平均|average|mean/.test(lower)) {
      possibleIssues.push({
        type: "conceptual",
        severity: "medium",
        issue: "把 attention 简化成平均可能会丢掉“按相关性加权”的核心。",
        explanation:
          "Self-Attention 不是固定平均，而是用 Query 与 Key 的相似度产生权重，再对 Value 做加权和。",
      });
      missingConcepts.push({
        term: "Attention weights",
        reason: "需要区分固定平均和由上下文动态决定的权重。",
      });
    }
  }

  if (isCode) {
    relatedTerms.add("边界条件");
    relatedTerms.add("复杂度");
    if (/直接返回|return\s+scores|exp 后直接返回|只要 exp/.test(lower)) {
      possibleIssues.push({
        type: "implementation",
        severity: "high",
        issue: "实现可能缺少归一化步骤。",
        explanation:
          "Softmax 需要先计算 exp，再除以所有 exp 的总和；只返回 exp 或原数组都不会形成概率分布。",
      });
      missingConcepts.push({
        term: "Normalization",
        reason: "概率分布需要所有输出加起来约等于 1。",
      });
    }
  }

  if (!possibleIssues.length) {
    possibleIssues.push({
      type: "missing_context",
      severity: "low",
      issue: "当前表述还比较短，缺少例子、反例或推导步骤。",
      explanation:
        "Coach 已保留你的主张，但需要更多中间推理才能判断是否存在深层误区。",
    });
  }

  const frontHint = isCode
    ? `思路评审：${claim}`
    : isAttention
      ? `Coach：${claim}`
      : `思路评审：${claim}`;

  return {
    normalizedText: raw,
    mainClaim: claim,
    whatIsCorrect: [
      args.lessonTitle
        ? `你把问题放在「${args.lessonTitle}」上下文里，这是正确的学习入口。`
        : "你先写出了自己的理解，这比直接看答案更适合发现误区。",
    ],
    possibleIssues,
    missingConcepts,
    relatedTerms: [...relatedTerms],
    socraticQuestions: [
      "能否给一个最小例子来验证你的说法？",
      isCode ? "这段思路在边界输入下会返回什么？" : "这里的权重或因果关系是谁决定的？",
    ],
    suggestedNextLessons: [
      isCode ? "用可见测试手动推演一次实现" : "补一个反例来区分相近概念",
    ],
    flashcards: [
      {
        front: frontHint,
        back: possibleIssues[0]?.explanation ?? "复述主张后，检查是否缺少例子或边界条件。",
        type: isCode ? "code" : "concept",
      },
    ],
    finalAdvice: "先用一句更精确的话重写主张，再用一个例子和一个反例检验它。",
  };
}

export async function generateThoughtReview(args: {
  userId: string;
  mode: string;
  rawText: string;
  lessonTitle?: string | null;
  contextSummary: string;
}): Promise<{ provider: "deepseek" | "template"; review: ThoughtReviewResult; raw?: unknown }> {
  const fallback = () =>
    ({
      provider: "template" as const,
      review: fallbackThoughtReview({
        mode: args.mode,
        rawText: args.rawText,
        lessonTitle: args.lessonTitle,
      }),
    });

  if (!process.env.DEEPSEEK_API_KEY || process.env.NODE_ENV === "test") return fallback();

  try {
    const { deepseekChatJsonObject } = await import("@/server/ai/deepseek");
    const messages = [
      {
        role: "system" as const,
        content: [
          "You are Roky Learn Coach. Return valid json only.",
          "Do not output markdown. Do not wrap json in code fences.",
          "Review the user's thinking as a tutor, not as an answer machine.",
          "For code reasoning: give hints and bug type before reference thinking; do not execute code.",
          "JSON must include normalizedText, mainClaim, whatIsCorrect, possibleIssues, missingConcepts, relatedTerms, socraticQuestions, suggestedNextLessons, flashcards, finalAdvice.",
        ].join("\n"),
      },
      {
        role: "user" as const,
        content: [
          "Return a structured json ThoughtReview.",
          `mode: ${args.mode}`,
          `lessonTitle: ${args.lessonTitle ?? ""}`,
          "",
          "contextSummary:",
          args.contextSummary,
          "",
          "userThought:",
          args.rawText.slice(0, 10_000),
          "",
          "Compact example json:",
          JSON.stringify({
            normalizedText: "user idea restated",
            mainClaim: "main claim",
            whatIsCorrect: ["correct point"],
            possibleIssues: [
              {
                type: "conceptual",
                severity: "medium",
                issue: "possible issue",
                explanation: "why it matters",
              },
            ],
            missingConcepts: [{ term: "term", reason: "why missing" }],
            relatedTerms: ["term"],
            socraticQuestions: ["question"],
            suggestedNextLessons: ["next lesson"],
            flashcards: [{ front: "front", back: "back", type: "concept" }],
            finalAdvice: "next action",
          }),
          "Output json only.",
        ].join("\n"),
      },
    ];

    const res = await deepseekChatJsonObject({ messages, maxTokens: 2200 });
    const parsed = ThoughtReviewSchema.safeParse(JSON.parse(stripToJsonObject(res.content)));
    if (!parsed.success) return fallback();
    return { provider: "deepseek", review: parsed.data, raw: { model: res.model, usage: res.usage } };
  } catch {
    return fallback();
  }
}

export function buildThoughtReviewFlashcards(args: {
  reviewId: string;
  userId: string;
  lessonId?: string | null;
  review: ThoughtReviewResult;
}) {
  const sourceCards = args.review.flashcards.length
    ? args.review.flashcards
    : [
        {
          front: `思路评审：${args.review.mainClaim}`,
          back: args.review.finalAdvice,
          type: "concept" as const,
        },
      ];

  return sourceCards.slice(0, 8).map((card, index) => ({
    id: `thought:${args.reviewId}:${index}`,
    userId: args.userId,
    lessonId: args.lessonId ?? null,
    front: card.front,
    back: card.back,
    type: card.type,
    tags: ["coach", "thought-review", ...args.review.relatedTerms.slice(0, 4)],
  }));
}
