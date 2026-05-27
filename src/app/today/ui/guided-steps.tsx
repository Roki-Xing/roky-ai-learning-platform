"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveGuidedProgressAction } from "@/app/today/actions";

export type GuidedStep = {
  type:
    | "activation"
    | "intuition"
    | "concept"
    | "example"
    | "micro_question"
    | "pseudocode"
    | "coding"
    | "quiz"
    | "reflection";
  title: string;
  content: string;
  question?: string;
  expectedAnswer?: string;
  hints?: string[];
};

export type GuidedProgressView = {
  activeStep: number;
  answers: Record<string, string>;
  updatedAt: string;
};

export function GuidedSteps(props: {
  planId: string;
  steps: GuidedStep[] | string[];
  initialProgress: GuidedProgressView;
}) {
  const steps = useMemo<GuidedStep[]>(() => {
    // Backward compatible: older lessons stored guidedSteps as string[].
    if (!props.steps?.length) return [];
    const first = (props.steps as unknown[])[0];
    if (typeof first === "string") {
      return (props.steps as string[]).map((s, idx) => ({
        type: "concept",
        title: `步骤 ${idx + 1}`,
        content: s,
        hints: [],
      }));
    }
    return props.steps as GuidedStep[];
  }, [props.steps]);

  const total = steps.length;
  const initialActive = Math.min(Math.max(0, props.initialProgress.activeStep), Math.max(0, total - 1));
  const [active, setActive] = useState(initialActive);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const entries = Object.entries(props.initialProgress.answers).map(([key, value]) => [
      Number(key),
      value,
    ] as const);
    return Object.fromEntries(entries.filter(([key]) => Number.isInteger(key) && key >= 0));
  });
  const [showHints, setShowHints] = useState(false);
  const [showExpected, setShowExpected] = useState(false);

  const current = steps[active] ?? null;
  const currentAnswer = answers[active] ?? "";

  const progressLabel = useMemo(() => {
    const done = Object.values(answers).filter((v) => v.trim()).length;
    return `已记录：${done}/${total}`;
  }, [answers, total]);

  return (
    <div className="mt-3 grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div>
          当前步骤：{active + 1}/{total}
        </div>
        <div>{progressLabel}</div>
      </div>

      <div className="rounded-md border p-3">
        {current ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">
                {active + 1}. {current.title}
              </div>
              <div className="text-xs text-muted-foreground">类型：{current.type}</div>
            </div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {current.content}
            </div>

            {current.question ? (
              <div className="mt-3 rounded-md border bg-muted/30 p-3 text-sm">
                <div className="text-xs font-medium text-muted-foreground">自测问题</div>
                <div className="mt-1 whitespace-pre-wrap">{current.question}</div>
              </div>
            ) : null}

            {current.hints?.length ? (
              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowHints((v) => !v)}
                >
                  {showHints ? "隐藏提示" : "显示提示"}
                </Button>
                {showHints ? (
                  <ul className="mt-2 grid list-disc gap-1 pl-5 text-xs text-muted-foreground">
                    {current.hints.map((h, i) => (
                      <li key={`${active}:hint:${i}`}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {current.expectedAnswer ? (
              <div className="mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowExpected((v) => !v)}
                >
                  {showExpected ? "隐藏参考答案" : "显示参考答案"}
                </Button>
                {showExpected ? (
                  <div className="mt-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                    {current.expectedAnswer}
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">暂无步骤。</div>
        )}
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">我的回答（可选）</div>
        <Textarea
          value={currentAnswer}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [active]: e.target.value }))}
          placeholder="用自己的话写下来..."
          className="min-h-24"
        />
      </div>

      <form action={saveGuidedProgressAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="planId" value={props.planId} />
        <input type="hidden" name="activeStep" value={String(active)} />
        <input type="hidden" name="stepCount" value={String(total)} />
        {Object.entries(answers).map(([index, value]) => (
          <input key={index} type="hidden" name={`answer:${index}`} value={value} />
        ))}
        <Button
          type="button"
          variant="secondary"
          disabled={active <= 0}
          onClick={() => setActive((i) => Math.max(0, i - 1))}
        >
          上一步
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={active >= total - 1}
          onClick={() => setActive((i) => Math.min(total - 1, i + 1))}
        >
          下一步
        </Button>
        <Button type="submit" size="sm">
          保存进度
        </Button>
        <div className="text-xs text-muted-foreground">
          {props.initialProgress.updatedAt
            ? `已同步：${props.initialProgress.updatedAt.slice(0, 16).replace("T", " ")}`
            : "尚未同步"}
        </div>
      </form>
    </div>
  );
}
