import { z } from "zod";
import type { Prisma } from "@prisma/client";

const CodeReviewIssueSchema = z
  .object({
    type: z.enum(["logic", "edge_case", "complexity", "style", "syntax", "concept"]),
    severity: z.enum(["low", "medium", "high"]),
    message: z.string().min(1),
  })
  .strict();

export const CodeReviewSchema = z
  .object({
    overall: z.enum(["likely_correct", "partially_correct", "incorrect", "cannot_judge"]),
    summary: z.string().min(1),
    strengths: z.array(z.string().min(1)).default([]),
    issues: z.array(CodeReviewIssueSchema).default([]),
    hints: z.array(z.string().min(1)).default([]),
    suggestedTests: z.array(z.string().min(1)).default([]),
    flashcards: z
      .array(
        z
          .object({
            front: z.string().min(1),
            back: z.string().min(1),
            type: z.enum(["code_bug", "concept", "algorithm"]).default("code_bug"),
          })
          .strict(),
      )
      .default([]),
    nextSteps: z.array(z.string().min(1)).default([]),
  })
  .strict();

export type CodeReview = z.infer<typeof CodeReviewSchema>;
export type CodeReviewIssue = z.infer<typeof CodeReviewIssueSchema>;

function stripToJsonObject(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return raw.trim();
  return raw.slice(start, end + 1);
}

function compactText(text: string, max = 120) {
  const oneLine = text.trim().replace(/\s+/g, " ");
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}...`;
}

function hasLikelyPlaceholder(code: string) {
  return /TODO|pass\s*$|return\s+None|return\s+scores|return\s+xs|return\s+input|return\s+\[\]/im.test(code);
}

function hasPythonFunction(code: string) {
  return /\bdef\s+\w+\s*\(/.test(code);
}

export function fallbackCodeReview(args: {
  language: string;
  code: string;
  prompt?: string | null;
  commonBugs?: string[];
}): CodeReview {
  const code = args.code.trim();
  const language = args.language.toLowerCase();
  const issues: CodeReviewIssue[] = [];
  const strengths: string[] = [];
  const hints: string[] = [];
  const suggestedTests: string[] = [];
  const nextSteps: string[] = [];

  if (code.length > 40) strengths.push("提交包含实际代码，不是空白占位。");
  if (language.startsWith("python") && hasPythonFunction(code)) {
    strengths.push("Python 函数入口清晰，便于后续测试和复用。");
  }

  if (hasLikelyPlaceholder(code)) {
    issues.push({
      type: "logic",
      severity: "high",
      message: "代码里仍有占位实现或直接返回输入，核心逻辑可能还没完成。",
    });
    hints.push("先替换 TODO/pass/直接返回输入这类占位路径，再用可见测试手动推演。");
  }

  if (!/\breturn\b/.test(code)) {
    issues.push({
      type: "logic",
      severity: "medium",
      message: "没有看到明确 return，函数型练习可能无法返回结果。",
    });
    hints.push("确认函数最终返回题目要求的值，而不是只修改局部变量。");
  }

  if (language.startsWith("python") && !hasPythonFunction(code)) {
    issues.push({
      type: "style",
      severity: "medium",
      message: "没有看到 Python 函数定义，提交可能没有沿用 starterCode 的函数签名。",
    });
    hints.push("把核心逻辑包进一个命名函数，保持和题目 starterCode 的函数签名一致。");
  }

  if (args.commonBugs?.length) {
    hints.push(`对照常见坑检查：${args.commonBugs.slice(0, 2).join("；")}。`);
  }

  suggestedTests.push("用题目给出的第一个 visible test 手动走一遍输入、关键中间变量和输出。");
  suggestedTests.push("补一个边界输入，例如空数组、单元素或重复值。");
  nextSteps.push("先用最小输入手动推演。");
  nextSteps.push("再用 visible tests 对照预期输出。");
  nextSteps.push("最后补一个边界输入检查实现是否稳定。");

  const highIssue = issues.find((issue) => issue.severity === "high") ?? null;
  const issueForCard = highIssue ?? issues[0] ?? null;

  return {
    overall: highIssue ? "partially_correct" : issues.length ? "partially_correct" : "likely_correct",
    summary: issues.length
      ? "这次提交已经有结构，但还需要检查占位代码、返回值和题目测试。"
      : "这次提交结构基本清晰，下一步重点是用可见测试验证边界情况。",
    strengths: strengths.length ? strengths : ["提交内容可读，适合继续迭代。"],
    issues,
    hints: hints.length ? hints : ["用一个具体输入写出每一步中间变量，确认实现和题意一致。"],
    suggestedTests,
    flashcards: issueForCard
      ? [
          {
            front: `代码反馈：${issueForCard.message}`,
            back: "遇到代码练习时，先识别占位路径、返回值和边界输入，再用可见测试验证。",
            type: "code_bug",
          },
        ]
      : [
          {
            front: `代码反馈：${compactText(args.prompt ?? "如何验证代码提交？")}`,
            back: "至少用一个正常输入和一个边界输入手动推演，确认返回值符合题意。",
            type: "code_bug",
          },
        ],
    nextSteps,
  };
}

export function buildCodeFeedbackFlashcards(args: {
  submissionId: string;
  userId: string;
  lessonId: string;
  review: CodeReview;
}) {
  return args.review.flashcards.map((card, index) => ({
    id: `code-feedback:${args.submissionId}:${index}`,
    userId: args.userId,
    lessonId: args.lessonId,
    front: card.front,
    back: card.back,
    type: card.type,
    tags: ["code-feedback", "code-bug"],
    difficulty: card.type === "code_bug" ? 4 : 3,
    dueAt: new Date(),
  })) satisfies Array<
    Prisma.FlashcardUncheckedCreateInput & {
      id: string;
      userId: string;
      lessonId: string;
    }
  >;
}

export function hasSeriousCodeIssue(review: CodeReview) {
  return (
    review.overall === "incorrect" ||
    review.issues.some((issue) => issue.severity === "high")
  );
}

export async function generateCodeFeedback(args: {
  userId: string;
  lessonTitle: string;
  localDate: string;
  language: string;
  prompt?: string | null;
  starterCode?: string | null;
  referenceSolution?: string | null;
  visibleTests?: unknown;
  commonBugs?: string[];
  code: string;
}): Promise<{ provider: "deepseek" | "template"; feedback: CodeReview; raw?: unknown }> {
  const fallback = () =>
    ({
      provider: "template" as const,
      feedback: fallbackCodeReview({
        language: args.language,
        code: args.code,
        prompt: args.prompt,
        commonBugs: args.commonBugs,
      }),
    });

  if (process.env.NODE_ENV === "test" || !process.env.DEEPSEEK_API_KEY) return fallback();

  try {
    const { deepseekChatJsonObject } = await import("@/server/ai/deepseek");
    const messages = [
      {
        role: "system" as const,
        content: [
          "You are a programming tutor. Return valid json only.",
          "Do not execute code. Do not claim that tests passed.",
          "Review the submitted code text against the exercise prompt.",
          "Do not reveal the full reference solution.",
          "JSON keys: overall, summary, strengths, issues, hints, suggestedTests, flashcards, nextSteps.",
          "Issue shape: { type, severity, message }.",
          "overall enum: likely_correct, partially_correct, incorrect, cannot_judge.",
        ].join("\n"),
      },
      {
        role: "user" as const,
        content: [
          "Return a concise json code review for this learning exercise.",
          `lessonTitle: ${args.lessonTitle}`,
          `localDate: ${args.localDate}`,
          `language: ${args.language}`,
          "",
          "exercisePrompt:",
          args.prompt ?? "",
          "",
          "visibleTests:",
          JSON.stringify(args.visibleTests ?? []),
          "",
          "commonBugs:",
          JSON.stringify(args.commonBugs ?? []),
          "",
          "starterCode:",
          args.starterCode ?? "",
          "",
          "referenceSolution is for tutor comparison only; do not reveal it verbatim:",
          args.referenceSolution ?? "",
          "",
          "submittedCode:",
          args.code.slice(0, 8_000),
          "",
          "Output json only.",
        ].join("\n"),
      },
    ];

    const res = await deepseekChatJsonObject({ messages, maxTokens: 1600 });
    const parsed = CodeReviewSchema.safeParse(JSON.parse(stripToJsonObject(res.content)));
    if (!parsed.success) return fallback();
    return { provider: "deepseek", feedback: parsed.data, raw: { model: res.model, usage: res.usage } };
  } catch {
    return fallback();
  }
}
