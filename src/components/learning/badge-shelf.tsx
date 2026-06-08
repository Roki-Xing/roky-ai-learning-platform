import { Award, LockKeyhole } from "lucide-react";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import type { LearningBadge } from "@/server/learning/badges";

export function BadgeShelf(props: { badges: LearningBadge[] }) {
  const earned = props.badges.filter((badge) => badge.earned).length;

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="徽章">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">徽章</div>
          <div className="mt-1 text-xs text-muted-foreground">
            已解锁 {earned}/{props.badges.length}
          </div>
        </div>
        <LearningStatusBadge tone={earned ? "success" : "neutral"}>已解锁 {earned} 个</LearningStatusBadge>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {props.badges.map((badge) => {
          const ratio = badge.progressCurrent / Math.max(1, badge.progressTarget);
          return (
            <div key={badge.id} className="rounded-md border bg-muted/10 p-3">
              <div className="flex items-start gap-2">
                {badge.earned ? (
                  <Award className="mt-0.5 size-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <LockKeyhole className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium">{badge.title}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {badge.description}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{badge.earned ? "已解锁" : "进行中"}</span>
                  <span className="tabular-nums">
                    {badge.progressCurrent}/{badge.progressTarget}
                  </span>
                </div>
                <LearningProgressBar value={ratio} label={`徽章进度：${badge.title}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
