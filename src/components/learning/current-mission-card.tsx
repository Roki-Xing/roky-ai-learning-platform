import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";
import type {
  CurrentMission,
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

export function CurrentMissionCard(props: {
  mission: CurrentMission;
  signals?: CurrentMissionSignal[];
  title?: string;
  className?: string;
}) {
  const title = props.title ?? "当前任务";

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
