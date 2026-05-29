import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import type { TodayCompletionNextActions } from "@/server/learning/today-completion-actions";

function actionToneClass(tone: string) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50/50";
    case "warning":
      return "border-amber-200 bg-amber-50/50";
    case "danger":
      return "border-rose-200 bg-rose-50/50";
    case "info":
      return "border-indigo-200 bg-indigo-50/40";
    default:
      return "border-border bg-muted/30";
  }
}

export function LearningCompletionCard(props: {
  completion: TodayCompletionNextActions;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-sm", props.className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            <div className="text-sm font-medium">{props.completion.title}</div>
            <LearningStatusBadge
              tone={props.completion.statusLabel === "今日已完成" ? "success" : "info"}
            >
              {props.completion.statusLabel}
            </LearningStatusBadge>
          </div>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {props.completion.summary}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {props.completion.actions.map((action) => (
          <div
            key={`${action.href}:${action.label}`}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm",
              actionToneClass(action.tone),
            )}
          >
            <div className="min-w-0">
              <div className="font-medium">{action.label}</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {action.description}
              </div>
            </div>
            <Button asChild size="sm" variant="secondary" className="shrink-0">
              <Link href={action.href}>
                进入
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
