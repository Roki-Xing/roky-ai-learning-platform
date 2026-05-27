"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitQuizAttemptAction } from "@/server/quiz/actions";

export type TodayQuizQuestion = {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
  explanation: string;
  attempt: null | {
    isCorrect: boolean;
    userAnswer: unknown;
    createdAt: string;
  };
};

function isIndexChecked(userAnswer: unknown, idx: number) {
  if (typeof userAnswer === "number") return userAnswer === idx;
  if (typeof userAnswer === "string") return userAnswer.trim() === String(idx);
  if (Array.isArray(userAnswer)) return userAnswer.includes(idx);
  return false;
}

function isBoolChecked(userAnswer: unknown, v: boolean) {
  if (typeof userAnswer === "boolean") return userAnswer === v;
  if (typeof userAnswer === "string") return userAnswer.trim().toLowerCase() === (v ? "true" : "false");
  return false;
}

function formatUserAnswer(userAnswer: unknown, options: string[] | null) {
  if (typeof userAnswer === "number") {
    const opt = options?.[userAnswer];
    return opt ? `${userAnswer + 1}. ${opt}` : String(userAnswer);
  }
  if (typeof userAnswer === "boolean") return userAnswer ? "正确" : "错误";
  if (Array.isArray(userAnswer)) {
    const parts = userAnswer
      .map((x) => (typeof x === "number" ? x : Number.parseInt(String(x), 10)))
      .filter((n) => Number.isFinite(n))
      .map((n) => {
        const opt = options?.[n];
        return opt ? `${n + 1}. ${opt}` : String(n);
      });
    return parts.length ? parts.join("，") : JSON.stringify(userAnswer);
  }
  if (typeof userAnswer === "string") return userAnswer;
  return JSON.stringify(userAnswer);
}

export function TodayQuiz(props: { questions: TodayQuizQuestion[] }) {
  const { questions } = props;

  return (
    <div className="mt-3 grid gap-3">
      {questions.map((q, idx) => {
        const attempt = q.attempt;
        return (
          <div key={q.id} className="rounded-md border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  Q{idx + 1}. {q.question}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  类型：{q.type}
                  {attempt ? (
                    <>
                      {" "}
                      /{" "}
                      <span className="font-mono">
                        {attempt.createdAt.slice(0, 16).replace("T", " ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              {attempt ? (
                <Badge variant={attempt.isCorrect ? "secondary" : "outline"}>
                  {attempt.isCorrect ? "正确" : "错误"}
                </Badge>
              ) : (
                <Badge variant="outline">未作答</Badge>
              )}
            </div>

            <form action={submitQuizAttemptAction} className="mt-3 grid gap-2">
              <input type="hidden" name="questionId" value={q.id} />

              {q.type === "true_false" ? (
                <div className="grid gap-2 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40">
                    <input
                      type="radio"
                      name="userAnswer"
                      value="true"
                      required
                      defaultChecked={attempt ? isBoolChecked(attempt.userAnswer, true) : false}
                    />
                    <span>对</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40">
                    <input
                      type="radio"
                      name="userAnswer"
                      value="false"
                      required
                      defaultChecked={attempt ? isBoolChecked(attempt.userAnswer, false) : false}
                    />
                    <span>错</span>
                  </label>
                </div>
              ) : q.type === "multi_choice" ? (
                <div className="grid gap-2 text-sm">
                  {(q.options ?? []).map((opt, i) => (
                    <label
                      key={`${q.id}:${i}`}
                      className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40"
                    >
                      <input
                        type="checkbox"
                        name="userAnswer"
                        value={String(i)}
                        defaultChecked={attempt ? isIndexChecked(attempt.userAnswer, i) : false}
                      />
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="min-w-0">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid gap-2 text-sm">
                  {(q.options ?? []).map((opt, i) => (
                    <label
                      key={`${q.id}:${i}`}
                      className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40"
                    >
                      <input
                        type="radio"
                        name="userAnswer"
                        value={String(i)}
                        defaultChecked={attempt ? isIndexChecked(attempt.userAnswer, i) : false}
                        required
                      />
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="min-w-0">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" size="sm">
                  提交答案
                </Button>
                {attempt ? (
                  <div className="text-xs text-muted-foreground">
                    已提交：{formatUserAnswer(attempt.userAnswer, q.options)}
                  </div>
                ) : null}
              </div>

              {attempt ? (
                <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {q.explanation}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  提交后显示解析
                </div>
              )}
            </form>
          </div>
        );
      })}
    </div>
  );
}
