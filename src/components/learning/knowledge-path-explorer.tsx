import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import type { KnowledgePathItemStatus } from "@/server/knowledge/paths";

export type KnowledgePathExplorerPath = {
  id: string;
  label: string;
  kind: "glossary" | "radar";
  description: string;
  items: KnowledgePathItemStatus[];
  viewedCount: number;
  cardCount: number;
  reviewedCount: number;
  weakCount: number;
  nextSlug: string | null;
  nextStatusLabel: string | null;
};

function statusTone(item: KnowledgePathItemStatus): LearningStatusTone {
  if (item.weak) return "danger";
  if (item.reviewed) return "success";
  if (item.hasCard) return "info";
  if (item.viewed) return "warning";
  return "neutral";
}

export function KnowledgePathExplorer(props: {
  paths: KnowledgePathExplorerPath[];
  hrefForSlug: (slug: string) => string;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">路径化学习</div>
          <div className="mt-1 text-xs text-muted-foreground">
            按顺序看、制卡、复习，把广度知识变成可追踪路径。
          </div>
        </div>
        <LearningStatusBadge tone="info">Path Mode</LearningStatusBadge>
      </div>

      <div className="mt-3 grid gap-3">
        {props.paths.map((path) => {
          const total = path.items.length || 1;
          const nextHref = path.nextSlug ? props.hrefForSlug(path.nextSlug) : null;
          return (
            <section key={path.id} className="rounded-md border bg-background p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{path.label}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {path.description}
                  </div>
                </div>
                {nextHref ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={nextHref}>下一项：{path.nextSlug}</Link>
                  </Button>
                ) : null}
              </div>

              <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <PathMetric label="已看过" value={`${path.viewedCount}/${total}`} />
                <PathMetric label="已制卡" value={`${path.cardCount}/${total}`} />
                <PathMetric label="已复习" value={`${path.reviewedCount}/${total}`} />
                <PathMetric label="未掌握" value={path.weakCount} />
              </div>

              <div className="mt-3">
                <LearningProgressBar value={path.reviewedCount / total} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.items.map((item) => (
                  <LearningStatusBadge key={item.slug} tone={statusTone(item)}>
                    <Link href={props.hrefForSlug(item.slug)}>
                      {item.slug} · {item.statusLabel}
                    </Link>
                  </LearningStatusBadge>
                ))}
              </div>

              {path.nextSlug ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  下一项：{path.nextSlug}
                  {path.nextStatusLabel ? ` / ${path.nextStatusLabel}` : ""}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PathMetric(props: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border bg-muted/20 px-3 py-2" aria-label={`${props.label} ${props.value}`}>
      <div>{props.label}</div>
      <div className="mt-1 font-semibold tabular-nums text-foreground">{props.value}</div>
    </div>
  );
}
