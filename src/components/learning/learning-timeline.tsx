import { cn } from "@/lib/utils";
import { Check, Circle, CircleDot } from "lucide-react";

export type LearningTimelineItemStatus = "todo" | "active" | "done";

export type LearningTimelineItem = {
  id: string;
  label: string;
  href: string;
  status: LearningTimelineItemStatus;
  hint?: string;
};

function StatusIcon(props: { status: LearningTimelineItemStatus }) {
  switch (props.status) {
    case "done":
      return <Check className="size-4 text-emerald-700" />;
    case "active":
      return <CircleDot className="size-4 text-indigo-700" />;
    default:
      return <Circle className="size-4 text-muted-foreground" />;
  }
}

function statusRingClass(status: LearningTimelineItemStatus) {
  switch (status) {
    case "done":
      return "border-emerald-200 bg-emerald-50";
    case "active":
      return "border-indigo-200 bg-indigo-50";
    default:
      return "border-border bg-card";
  }
}

export function LearningTimeline(props: { title?: string; items: LearningTimelineItem[] }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="px-1 text-xs font-medium text-muted-foreground">
        {props.title ?? "学习流程"}
      </div>
      <ol className="mt-2 grid gap-1">
        {props.items.map((item, idx) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={cn(
                "group flex items-start gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/40",
                item.status === "active" ? "bg-muted/30" : null,
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-7 items-center justify-center rounded-md border",
                  statusRingClass(item.status),
                )}
              >
                <StatusIcon status={item.status} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium">{item.label}</div>
                  <div className="text-[10px] tabular-nums text-muted-foreground">
                    {idx + 1}
                  </div>
                </div>
                {item.hint ? (
                  <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {item.hint}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

