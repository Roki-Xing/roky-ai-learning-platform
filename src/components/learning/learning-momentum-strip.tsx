import { Sparkles } from "lucide-react";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import type { LearningMomentum } from "@/server/learning/momentum";

export function LearningMomentumStrip(props: { momentum: LearningMomentum }) {
  const items = [
    ["当前阶段", props.momentum.stageLabel],
    ["本周目标", props.momentum.weeklyLabel],
    ["今日闭环", props.momentum.dailyLoopLabel],
    ["连续学习", props.momentum.streakLabel],
  ] as const;

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="学习状态">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">学习状态</LearningStatusBadge>
            <LearningStatusBadge tone="neutral">
              下一步解锁：{props.momentum.nextUnlockLabel}
            </LearningStatusBadge>
          </div>
          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-indigo-600" aria-hidden="true" />
            <span>{props.momentum.encouragement}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {items.map(([label, value]) => (
              <div key={label} className="rounded-md border bg-muted/10 px-3 py-2">
                <div className="text-muted-foreground">{label}</div>
                <div className="mt-1 font-semibold tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
            <span>下一步解锁进度</span>
            <span className="tabular-nums">{props.momentum.nextUnlockProgress}</span>
          </div>
          <LearningProgressBar
            value={props.momentum.nextUnlockRatio}
            label="下一步解锁进度"
          />
        </div>
      </div>
    </section>
  );
}
