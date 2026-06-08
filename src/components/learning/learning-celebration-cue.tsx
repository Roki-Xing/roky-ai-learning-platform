import { CheckCircle2, Sparkles } from "lucide-react";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

export type LearningCelebrationKind =
  | "today_complete"
  | "review_cleared"
  | "project_milestone"
  | "misconception_resolved";

const celebrationCopy = {
  today_complete: {
    title: "今日学习完成",
    description: "主课、练习和沉淀已经进入复习循环。",
    badge: "完成反馈",
    className: "border-emerald-200 bg-emerald-50/60 text-emerald-950",
  },
  review_cleared: {
    title: "复习清空",
    description: "本轮卡片已重新排程，薄弱点已经进入下一步。",
    badge: "复习总结",
    className: "border-indigo-200 bg-indigo-50/60 text-indigo-950",
  },
  project_milestone: {
    title: "里程碑完成",
    description: "项目进度已经形成可复盘的实践证据。",
    badge: "项目进度",
    className: "border-orange-200 bg-orange-50/60 text-orange-950",
  },
  misconception_resolved: {
    title: "误区已解决",
    description: "这条薄弱点已经从待修复资产转为掌握证据。",
    badge: "掌握证据",
    className: "border-sky-200 bg-sky-50/60 text-sky-950",
  },
} satisfies Record<
  LearningCelebrationKind,
  { title: string; description: string; badge: string; className: string }
>;

/**
 * Renders a restrained completion cue for learning milestones.
 *
 * Args:
 *   kind: Completion context to display.
 *   metric: Optional short evidence metric.
 *   className: Optional wrapper className.
 *
 * Returns:
 *   A compact non-persistent feedback block for completed learning actions.
 */
export function LearningCelebrationCue({
  kind,
  metric,
  className,
}: {
  kind: LearningCelebrationKind;
  metric?: string;
  className?: string;
}) {
  const copy = celebrationCopy[kind];

  return (
    <section
      aria-label={copy.title}
      className={cn("rounded-lg border px-3 py-2.5", copy.className, className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-background/70">
            <CheckCircle2 className="size-4 text-current" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold">{copy.title}</div>
              <LearningStatusBadge tone="success">{copy.badge}</LearningStatusBadge>
            </div>
            <div className="mt-1 text-xs leading-5 text-muted-foreground">
              {copy.description}
            </div>
          </div>
        </div>
        {metric ? (
          <div className="inline-flex shrink-0 items-center gap-1 rounded-md bg-background/70 px-2 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {metric}
          </div>
        ) : null}
      </div>
    </section>
  );
}
