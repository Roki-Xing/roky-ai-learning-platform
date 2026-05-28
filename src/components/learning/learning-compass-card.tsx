import { cn } from "@/lib/utils";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";

export function LearningCompassCard(props: {
  title: string;
  subtitle?: string;
  signal?: string;
  tone?: LearningStatusTone;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-sm", props.className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{props.title}</div>
          {props.subtitle ? (
            <div className="mt-1 text-xs text-muted-foreground">{props.subtitle}</div>
          ) : null}
        </div>
        {props.signal ? (
          <LearningStatusBadge tone={props.tone ?? "neutral"}>{props.signal}</LearningStatusBadge>
        ) : null}
      </div>
      {props.children ? <div className="mt-3 text-sm text-muted-foreground">{props.children}</div> : null}
      {props.action ? <div className="mt-3">{props.action}</div> : null}
    </div>
  );
}
