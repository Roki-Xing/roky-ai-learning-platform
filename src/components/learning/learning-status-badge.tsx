import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LearningStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

function toneClass(tone: LearningStatusTone) {
  switch (tone) {
    case "info":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
}

export function LearningStatusBadge(props: {
  children: React.ReactNode;
  tone?: LearningStatusTone;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", toneClass(props.tone ?? "neutral"), props.className)}
    >
      {props.children}
    </Badge>
  );
}

