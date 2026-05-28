import { cn } from "@/lib/utils";

export function LearningProgressBar(props: {
  value: number; // 0..1
  className?: string;
}) {
  const v = Number.isFinite(props.value) ? Math.min(1, Math.max(0, props.value)) : 0;
  return (
    <div className={cn("h-2 w-full rounded-full bg-muted/60", props.className)}>
      <div
        className="h-2 rounded-full bg-indigo-600 transition-[width]"
        style={{ width: `${Math.round(v * 100)}%` }}
      />
    </div>
  );
}

