import { cn } from "@/lib/utils";
import type { LearningStatusTone } from "@/components/learning/learning-status-badge";

function toneClass(tone: LearningStatusTone) {
  switch (tone) {
    case "info":
      return "border-indigo-200 bg-indigo-50/60";
    case "success":
      return "border-emerald-200 bg-emerald-50/60";
    case "warning":
      return "border-amber-200 bg-amber-50/60";
    case "danger":
      return "border-rose-200 bg-rose-50/60";
    default:
      return "border-border bg-muted/20";
  }
}

export function LearningInsightCard(props: {
  title: string;
  tone?: LearningStatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-sm",
        toneClass(props.tone ?? "neutral"),
        props.className,
      )}
    >
      <div className="text-sm font-medium">{props.title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{props.children}</div>
    </div>
  );
}

