"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

export type LearningFocusPlayerStage = {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  guidance?: {
    task: string;
    reason: string;
    completion: string;
  };
  status: "todo" | "active" | "done";
  body: React.ReactNode;
};

export type LearningFocusPlayerOverviewItem = {
  label: string;
  value: React.ReactNode;
  helper?: string;
};

function toneForStatus(status: LearningFocusPlayerStage["status"]): LearningStatusTone {
  if (status === "done") return "success";
  if (status === "active") return "info";
  return "neutral";
}

function labelForStatus(status: LearningFocusPlayerStage["status"]) {
  if (status === "done") return "完成";
  if (status === "active") return "进行中";
  return "待办";
}

export function LearningFocusPlayer(props: {
  stages: LearningFocusPlayerStage[];
  overview: LearningFocusPlayerOverviewItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  const initialIndex = Math.max(
    0,
    props.stages.findIndex((stage) => stage.status !== "done"),
  );
  const [index, setIndex] = useState(initialIndex === -1 ? Math.max(0, props.stages.length - 1) : initialIndex);
  const current = props.stages[index] ?? props.stages[0];

  const progress = useMemo(() => {
    if (!props.stages.length) return 0;
    const done = props.stages.filter((stage) => stage.status === "done").length;
    return done / props.stages.length;
  }, [props.stages]);

  if (!current) return null;

  return (
    <section
      className={cn("rounded-lg border bg-card shadow-sm", props.className)}
      aria-label="专注学习模式"
    >
      <div className="grid min-h-[560px] lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col">
          <div className="sticky top-0 z-10 border-b bg-card/95 p-4 backdrop-blur md:p-5 lg:static lg:bg-transparent lg:backdrop-blur-none">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <LearningStatusBadge tone="info">专注学习模式</LearningStatusBadge>
                  <LearningStatusBadge tone={toneForStatus(current.status)}>
                    {labelForStatus(current.status)}
                  </LearningStatusBadge>
                  {current.eyebrow ? (
                    <span className="text-xs font-medium text-muted-foreground">
                      {current.eyebrow}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-snug md:text-2xl">
                  {current.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {current.description}
                </p>
                {current.guidance ? (
                  <dl className="mt-4 grid max-w-4xl gap-2 md:grid-cols-3">
                    <div className="rounded-md bg-muted/40 px-3 py-2">
                      <dt className="text-xs font-medium text-foreground">你现在要做什么</dt>
                      <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                        {current.guidance.task}
                      </dd>
                    </div>
                    <div className="rounded-md bg-muted/40 px-3 py-2">
                      <dt className="text-xs font-medium text-foreground">为什么做这个</dt>
                      <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                        {current.guidance.reason}
                      </dd>
                    </div>
                    <div className="rounded-md bg-muted/40 px-3 py-2">
                      <dt className="text-xs font-medium text-foreground">完成标准</dt>
                      <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                        {current.guidance.completion}
                      </dd>
                    </div>
                  </dl>
                ) : null}
              </div>
              <div className="w-full max-w-[220px] text-xs text-muted-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span>{index + 1} / {props.stages.length}</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <LearningProgressBar value={progress} label="今日学习进度" className="mt-2" />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 p-4 md:p-5">
            <div className="mx-auto w-full max-w-4xl">{current.body}</div>
          </div>

          <div className="sticky bottom-16 z-20 border-t bg-card/95 p-4 backdrop-blur md:p-5 lg:static lg:bg-transparent lg:backdrop-blur-none">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 flex-1 sm:flex-none"
                disabled={index === 0}
                onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              >
                <ArrowLeft className="size-4" />
                上一步
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {props.stages.map((stage, stageIndex) => (
                  <button
                    key={stage.id}
                    type="button"
                    aria-label={`切换到${stage.title}（${labelForStatus(stage.status)}）`}
                    aria-current={stageIndex === index ? "step" : undefined}
                    onClick={() => setIndex(stageIndex)}
                    className={cn(
                      "h-2.5 w-8 rounded-full border transition-colors",
                      stageIndex === index
                        ? "border-primary bg-primary"
                        : stage.status === "done"
                          ? "border-emerald-300 bg-emerald-300"
                          : "border-border bg-muted",
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                className="min-h-11 flex-1 sm:flex-none"
                disabled={index >= props.stages.length - 1}
                onClick={() => setIndex((prev) => Math.min(props.stages.length - 1, prev + 1))}
              >
                下一步
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <aside className="border-t bg-muted/20 p-4 lg:border-l lg:border-t-0 md:p-5">
          <div className="sticky top-16 grid gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListChecks className="size-4 text-primary" />
                今日概览
              </div>
              <div className="mt-3 grid gap-2">
                {props.overview.map((item) => (
                  <div key={item.label} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                    {item.helper ? (
                      <div className="mt-1 text-xs text-muted-foreground">{item.helper}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">阶段列表</div>
              <div className="mt-3 grid gap-2">
                {props.stages.map((stage, stageIndex) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setIndex(stageIndex)}
                    className={cn(
                      "flex items-start gap-2 rounded-md border bg-card p-3 text-left transition-colors hover:bg-muted/40",
                      stageIndex === index ? "border-primary/40 bg-primary/5" : null,
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border text-[10px]",
                        stage.status === "done"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : stageIndex === index
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-muted/30 text-muted-foreground",
                      )}
                    >
                      {stage.status === "done" ? <Check className="size-3.5" /> : stageIndex + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{stage.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {stage.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {props.actions ? (
              <div className="rounded-md border bg-card p-3">
                <div className="text-sm font-medium">完整视图</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  需要快速跳转或连续编辑时，可回到下方完整页面。
                </div>
                <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">{props.actions}</div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
