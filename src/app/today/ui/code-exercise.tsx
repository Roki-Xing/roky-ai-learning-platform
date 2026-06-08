"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatTodayPlanSourceLabel } from "@/app/_lib/home-labels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveCodeSubmissionAction } from "@/server/coding/actions";

export type TodayCodingExercise = {
  language?: string;
  title?: string;
  prompt: string;
  starterCode: string;
  expectedOutput?: string;
  visibleTests?: Array<{ input: string; expectedOutput: string }>;
  expectedComplexity?: string;
  commonBugs?: string[];
  hints?: string[];
};

export type CodeSubmissionView = {
  code: string;
  language: string;
  status?: string;
  updatedAt: string;
} | null;

export type CodeFeedbackIssueView = {
  type: string;
  severity: string;
  message: string;
};

export type CodeFeedbackView = {
  provider: string;
  overall?: string | null;
  summary: string;
  strengths: string[];
  issues: CodeFeedbackIssueView[];
  suggestions: string[];
  hints: string[];
  suggestedTests: string[];
  flashcards: Array<{ front: string; back: string; type?: string }>;
  nextSteps: string[];
  updatedAt: string;
} | null;

function codeSubmissionStatusLabel(status?: string) {
  switch (status) {
    case "feedback_ready":
      return "反馈已生成";
    case "submitted":
      return "已提交";
    case "saved":
      return "已保存";
    default:
      return status ? "已保存" : "";
  }
}

function codeFeedbackOverallLabel(overall?: string | null) {
  switch (overall) {
    case "likely_correct":
      return "大概率正确";
    case "partially_correct":
      return "部分正确";
    case "incorrect":
      return "需要重写";
    case "cannot_judge":
      return "需要更多信息";
    default:
      return null;
  }
}

function codeFeedbackIssueSeverityLabel(severity: string) {
  switch (severity) {
    case "high":
      return "高优先级";
    case "low":
      return "低优先级";
    case "medium":
    default:
      return "中优先级";
  }
}

function codeFeedbackIssueTypeLabel(type: string) {
  switch (type) {
    case "logic":
      return "逻辑问题";
    case "edge_case":
      return "边界条件";
    case "complexity":
      return "复杂度问题";
    case "style":
      return "代码风格";
    case "syntax":
      return "语法问题";
    case "concept":
      return "概念问题";
    default:
      return "一般问题";
  }
}

function codeLanguageLabel(language: string) {
  if (language === "python") return "Python";
  if (language === "typescript") return "TypeScript";
  if (language === "javascript") return "JavaScript";
  return language.toUpperCase();
}

export function CodeExercise(props: {
  lessonId: string;
  localDate: string;
  exercise: TodayCodingExercise;
  submission: CodeSubmissionView;
  feedback: CodeFeedbackView;
  supported: boolean;
}) {
  const { lessonId, localDate, exercise, submission, feedback, supported } = props;

  const defaultCode = useMemo(() => {
    return (submission?.code ?? exercise.starterCode ?? "").trimEnd();
  }, [submission, exercise.starterCode]);

  function guessLanguageFromCode(code: string) {
    const c = code.trim();
    if (!c) return null;
    if (c.includes("def ") || c.startsWith("from ") || c.includes("import ")) return "python";
    if (c.includes("export function") || c.includes("const ") || c.includes(": number")) return "typescript";
    if (c.includes("function ") || c.includes("=>")) return "typescript";
    return null;
  }

  const guessed = guessLanguageFromCode(exercise.starterCode ?? "") ?? null;
  const language = (exercise.language ?? submission?.language ?? guessed ?? "python").toLowerCase();
  const languageHint =
    language.startsWith("py") ? "python" : language.startsWith("ts") ? "typescript" : language;
  const submissionStatusLabel = codeSubmissionStatusLabel(submission?.status);
  const feedbackOverallLabel = codeFeedbackOverallLabel(feedback?.overall);
  const visibleLanguageLabel = codeLanguageLabel(languageHint);

  return (
    <div className="mt-2 grid gap-3" data-testid="today-code-exercise">
      {exercise.title ? (
        <div className="text-sm font-medium">{exercise.title}</div>
      ) : null}
      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
        {exercise.prompt}
      </div>

      <form action={saveCodeSubmissionAction} className="grid gap-2">
        <input type="hidden" name="lessonId" value={lessonId} />
        <input type="hidden" name="localDate" value={localDate} />
        <input type="hidden" name="language" value={submission?.language ?? languageHint} />

        <div className="grid gap-2">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium">代码思路模式</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  手机端可以先写思路或伪代码，回到电脑后再补完整实现。
                </div>
              </div>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={`/voice?lessonId=${encodeURIComponent(lessonId)}&mode=code_debug`}>
                  语音解释入口
                </Link>
              </Button>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
              <div className="rounded-md border bg-background/60 px-3 py-2">
                先说清思路
              </div>
              <div className="rounded-md border bg-background/60 px-3 py-2">
                伪代码草稿
              </div>
              <div className="rounded-md border bg-background/60 px-3 py-2">
                再补 Python / TypeScript
              </div>
            </div>
          </div>

          <div className="text-sm font-medium">我的提交（仅保存，不执行）</div>
          <Textarea
            name="code"
            aria-label="我的提交（仅保存，不执行）"
            className="min-h-56 font-mono text-xs"
            defaultValue={defaultCode}
            disabled={!supported}
            placeholder={supported ? "在这里写代码..." : "该环境未完成 CodeSubmission 迁移"}
          />
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button
            type="submit"
            size="sm"
            disabled={!supported}
            className="min-h-11 w-full sm:w-auto"
          >
            保存提交
          </Button>
          {submission ? (
            <div className="text-xs text-muted-foreground">
              上次保存：{submission.updatedAt.slice(0, 16).replace("T", " ")}
              {submissionStatusLabel ? ` / ${submissionStatusLabel}` : ""}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              尚未保存提交
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            代码语言：<span className="font-mono">{visibleLanguageLabel}</span>
          </div>
        </div>
      </form>

      {exercise.hints?.length ? (
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
          提示：
          {"\n"}
          {exercise.hints.map((h, i) => `${i + 1}. ${h}`).join("\n")}
        </div>
      ) : null}

      {exercise.visibleTests?.length ? (
        <div className="rounded-md border p-3">
          <div className="text-sm font-medium">可见测试</div>
          <div className="mt-2 grid gap-2 text-xs">
            {exercise.visibleTests.map((t, i) => (
              <div key={`${i}:${t.input}`} className="rounded-md border bg-muted/30 p-3">
                <div className="font-mono whitespace-pre-wrap">输入：{t.input}</div>
                <div className="mt-1 text-muted-foreground whitespace-pre-wrap">
                  期望：{t.expectedOutput}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : exercise.expectedOutput ? (
        <div className="text-xs text-muted-foreground whitespace-pre-wrap">
          期望：{exercise.expectedOutput}
        </div>
      ) : null}

      {exercise.expectedComplexity ? (
        <div className="text-xs text-muted-foreground whitespace-pre-wrap">
          期望复杂度：{exercise.expectedComplexity}
        </div>
      ) : null}

      {exercise.commonBugs?.length ? (
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
          常见坑：
          {"\n"}
          {exercise.commonBugs.map((b, i) => `${i + 1}. ${b}`).join("\n")}
        </div>
      ) : null}

      {feedback ? (
        <div className="rounded-md border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">代码反馈</div>
            <div className="text-xs text-muted-foreground">
              {formatTodayPlanSourceLabel(feedback.provider)}
              {feedbackOverallLabel ? ` / ${feedbackOverallLabel}` : ""} / {feedback.updatedAt.slice(0, 16).replace("T", " ")}
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {feedback.summary}
          </div>
          {feedback.strengths.length ? (
            <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
              做得好的地方：
              {"\n"}
              {feedback.strengths.map((x, i) => `${i + 1}. ${x}`).join("\n")}
            </div>
          ) : null}
          {feedback.issues.length ? (
            <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
              需要处理：
              {"\n"}
              {feedback.issues
                .map(
                  (x, i) =>
                    `${i + 1}. [${codeFeedbackIssueSeverityLabel(x.severity)} / ${codeFeedbackIssueTypeLabel(x.type)}] ${x.message}`,
                )
                .join("\n")}
            </div>
          ) : null}
          {feedback.hints.length ? (
            <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
              提示：
              {"\n"}
              {feedback.hints.map((x, i) => `${i + 1}. ${x}`).join("\n")}
            </div>
          ) : null}
          {feedback.suggestedTests.length ? (
            <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
              建议测试：
              {"\n"}
              {feedback.suggestedTests.map((x, i) => `${i + 1}. ${x}`).join("\n")}
            </div>
          ) : null}
          {feedback.flashcards.length ? (
            <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
              已生成复习卡：
              {"\n"}
              {feedback.flashcards.map((x, i) => `${i + 1}. ${x.front}`).join("\n")}
            </div>
          ) : null}
          {feedback.nextSteps.length ? (
            <div className="mt-3 text-xs text-muted-foreground whitespace-pre-wrap">
              下一步：{feedback.nextSteps.join(" / ")}
            </div>
          ) : null}
        </div>
      ) : submission ? (
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          已保存提交；下次保存会生成代码反馈。
        </div>
      ) : null}

      {!supported ? (
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
          CodeSubmission 表未就绪。需要先执行手动迁移：db:migrate:manual:code-submission
        </div>
      ) : null}
    </div>
  );
}
