import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";
import type {
  CurrentMission,
  CurrentMissionProgress,
  CurrentMissionSignal,
} from "@/server/learning/current-mission";

function missionToneClass(tone: CurrentMission["tone"]) {
  switch (tone) {
    case "info":
      return "border-indigo-200 bg-indigo-50/50";
    case "success":
      return "border-emerald-200 bg-emerald-50/50";
    case "warning":
      return "border-amber-200 bg-amber-50/60";
    case "danger":
      return "border-rose-200 bg-rose-50/60";
    default:
      return "border-border bg-card";
  }
}

function clampProgress(progress: CurrentMissionProgress) {
  const total = Math.max(progress.total, 1);
  const completed = Math.min(Math.max(progress.completed, 0), total);

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function CurrentMissionCard(props: {
  mission: CurrentMission;
  signals?: CurrentMissionSignal[];
  progress?: CurrentMissionProgress;
  title?: string;
  className?: string;
}) {
  const title = props.title ?? "当前任务";
  const metaBadges = [
    props.mission.priorityLabel,
    props.mission.estimatedMinutes ? `${props.mission.estimatedMinutes} 分钟` : null,
    props.mission.companionLabel,
  ].filter(Boolean);
  const progress = props.progress ? clampProgress(props.progress) : null;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-sm",
        missionToneClass(props.mission.tone),
        props.className,
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone={props.mission.tone}>{title}</LearningStatusBadge>
            {(props.signals ?? []).slice(0, 4).map((signal) => (
              <LearningStatusBadge
                key={`${signal.label}:${signal.value}`}
                tone={signal.tone ?? "neutral"}
              >
                {signal.label} {signal.value}
              </LearningStatusBadge>
            ))}
          </div>
          <div className="mt-3 text-lg font-semibold leading-snug">
            {props.mission.title}
          </div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {props.mission.reason}
          </div>
          {metaBadges.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {metaBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          {props.progress && progress ? (
            <div className="mt-3 grid max-w-md gap-1.5">
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                <span>{props.progress.label}</span>
                <span className="tabular-nums">
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={props.progress.label}
                aria-valuemin={0}
                aria-valuemax={progress.total}
                aria-valuenow={progress.completed}
                className="h-1.5 overflow-hidden rounded-full bg-background/80"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <Button asChild size="sm" className="min-h-11 w-full sm:w-auto shrink-0">
          <Link href={props.mission.href}>
            {props.mission.ctaLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
