"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

export type LearningFocusStage = {
  id: string;
  title: string;
  description: string;
  href: string;
  status: "todo" | "active" | "done";
};

function toneForStatus(status: LearningFocusStage["status"]): LearningStatusTone {
  if (status === "done") return "success";
  if (status === "active") return "info";
  return "neutral";
}

export function LearningFocusPanel(props: {
  stages: LearningFocusStage[];
  className?: string;
}) {
  const initialIndex = Math.max(
    0,
    props.stages.findIndex((stage) => stage.status !== "done"),
  );
  const [index, setIndex] = useState(initialIndex === -1 ? props.stages.length - 1 : initialIndex);
  const current = props.stages[index] ?? props.stages[0];

  const progress = useMemo(() => {
    if (!props.stages.length) return 0;
    const done = props.stages.filter((stage) => stage.status === "done").length;
    return done / props.stages.length;
  }, [props.stages]);

  if (!current) return null;

  return (
    <section className={cn("rounded-lg border bg-card p-4 shadow-sm", props.className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">专注模式</LearningStatusBadge>
            <LearningStatusBadge tone={toneForStatus(current.status)}>
              {current.status === "done" ? "完成" : current.status === "active" ? "进行中" : "待办"}
            </LearningStatusBadge>
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-snug">{current.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{current.description}</p>
        </div>
        <div className="min-w-[160px] text-xs text-muted-foreground">
          {index + 1} / {props.stages.length}
          <LearningProgressBar value={progress} label="专注模式进度" className="mt-2" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-11 w-full sm:w-auto"
          disabled={index === 0}
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
        >
          上一步
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="min-h-11 w-full sm:w-auto"
          disabled={index >= props.stages.length - 1}
          onClick={() => setIndex((prev) => Math.min(props.stages.length - 1, prev + 1))}
        >
          下一步
        </Button>
        <Button asChild size="sm" className="min-h-11 w-full sm:w-auto">
          <a href={current.href}>进入当前阶段</a>
        </Button>
      </div>
    </section>
  );
}
