import { cn } from "@/lib/utils";

export function LearningProgressBar(props: {
  value: number; // 0..1
  label?: string;
  className?: string;
}) {
  const v = Number.isFinite(props.value) ? Math.min(1, Math.max(0, props.value)) : 0;
  const percent = Math.round(v * 100);
  return (
    <div
      role="progressbar"
      aria-label={props.label ?? "学习进度"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent}%`}
      className={cn("h-2 w-full rounded-full bg-muted/60", props.className)}
    >
      <div
        className="h-2 rounded-full bg-indigo-600 transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
