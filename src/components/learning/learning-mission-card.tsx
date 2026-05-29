import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";

function missionToneClass(tone: LearningStatusTone) {
  switch (tone) {
    case "info":
      return "border-indigo-200 bg-indigo-50/40";
    case "success":
      return "border-emerald-200 bg-emerald-50/50";
    case "warning":
      return "border-amber-200 bg-amber-50/50";
    case "danger":
      return "border-rose-200 bg-rose-50/50";
    default:
      return "border-border bg-card";
  }
}

export function LearningMissionCard(props: {
  title: string;
  description: string;
  statusLabel: string;
  tone?: LearningStatusTone;
  href?: string;
  actionLabel?: string;
  className?: string;
}) {
  const tone = props.tone ?? "neutral";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border p-3 text-sm",
        missionToneClass(tone),
        props.className,
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">{props.title}</div>
          <LearningStatusBadge tone={tone}>{props.statusLabel}</LearningStatusBadge>
        </div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">
          {props.description}
        </div>
      </div>
      {props.href && props.actionLabel ? (
        <Button asChild size="sm" variant={tone === "success" ? "outline" : "secondary"} className="shrink-0">
          <Link href={props.href}>
            {props.actionLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
