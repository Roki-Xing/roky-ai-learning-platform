import { Check, Circle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningStatusTone } from "@/components/learning/learning-status-badge";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";

export type LearningStepCardStatus = "done" | "active" | "todo";

function statusTone(status: LearningStepCardStatus): LearningStatusTone {
  if (status === "done") return "success";
  if (status === "active") return "info";
  return "neutral";
}

function statusLabel(status: LearningStepCardStatus) {
  if (status === "done") return "完成";
  if (status === "active") return "进行中";
  return "待办";
}

function StatusIcon(props: { status: LearningStepCardStatus }) {
  if (props.status === "done") return <Check className="size-4" />;
  if (props.status === "active") return <CircleDot className="size-4" />;
  return <Circle className="size-4" />;
}

export function LearningStepCard(props: {
  index: number;
  title: string;
  description?: string;
  status?: LearningStepCardStatus;
  action?: React.ReactNode;
  className?: string;
}) {
  const status = props.status ?? "todo";
  const label = statusLabel(status);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-card p-3",
        status === "active" ? "border-indigo-200 bg-indigo-50/30" : null,
        props.className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-medium",
          status === "done"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : status === "active"
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-border bg-muted/30 text-muted-foreground",
        )}
      >
        <StatusIcon status={status} />
        <span className="sr-only">
          第 {props.index} 步，{label}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">{props.title}</div>
          <LearningStatusBadge tone={statusTone(status)}>{label}</LearningStatusBadge>
        </div>
        {props.description ? (
          <div className="mt-1 text-sm text-muted-foreground">{props.description}</div>
        ) : null}
        {props.action ? <div className="mt-3">{props.action}</div> : null}
      </div>
    </div>
  );
}
