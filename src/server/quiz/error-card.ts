import type { Prisma } from "@prisma/client";

type BuildQuizErrorFlashcardArgs = {
  userId: string;
  questionId: string;
  lessonId: string;
  question: string;
  expectedAnswer: unknown;
  userAnswer: unknown;
  explanation: string;
  localDate?: string | null;
};

function compactJson(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

export function buildQuizErrorFlashcard(args: BuildQuizErrorFlashcardArgs) {
  return {
    id: `quiz-error:${args.userId}:${args.questionId}`,
    userId: args.userId,
    lessonId: args.lessonId,
    front: `错题复盘：${args.question}`,
    back: [
      `正确答案：${compactJson(args.expectedAnswer)}`,
      `我的答案：${compactJson(args.userAnswer)}`,
      `解析：${args.explanation}`,
    ].join("\n"),
    type: "quiz_error",
    tags: ["quiz-error", "misconception", args.localDate].filter(Boolean) as string[],
    difficulty: 4,
    dueAt: new Date(),
  } satisfies Prisma.FlashcardUncheckedCreateInput & {
    id: string;
    userId: string;
    lessonId: string;
  };
}
