import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import type { LearningHabitGoal, LearningHabitProtectionStatus } from "@/server/learning/habit-goal";

function protectionTone(status: LearningHabitProtectionStatus): LearningStatusTone {
  if (status === "protected") return "success";
  if (status === "at_risk") return "warning";
  return "info";
}

export function LearningHabitGoalCard({ goal }: { goal: LearningHabitGoal }) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="周目标">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">周目标</div>
          <div className="mt-1 text-xs text-muted-foreground">
            本周完成 {goal.weekly.label}，还差 {goal.weekly.remainingDays} 天。
          </div>
        </div>
        <LearningStatusBadge tone={goal.weekly.remainingDays === 0 ? "success" : "info"}>
          {goal.weekly.label}
        </LearningStatusBadge>
      </div>

      <div className="mt-3">
        <LearningProgressBar value={goal.weekly.ratio} label="周目标进度" />
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className="rounded-md border bg-muted/10 p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
            <div className="text-sm font-medium">连续学习保护</div>
            <LearningStatusBadge tone={protectionTone(goal.protection.status)}>
              {goal.protection.status === "protected" ? "已保护" : "待保护"}
            </LearningStatusBadge>
          </div>
          <div className="mt-2 text-xs leading-5 text-muted-foreground">
            {goal.protection.message}
          </div>
        </div>

        <div className="rounded-md border bg-muted/10 p-3">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-indigo-600" aria-hidden="true" />
            <div className="text-sm font-medium">{goal.lightweightMode.title}</div>
          </div>
          <div className="mt-2 text-xs leading-5 text-muted-foreground">
            {goal.lightweightMode.description}
          </div>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="mt-3 min-h-11 w-full sm:w-auto"
          >
            <Link href={goal.lightweightMode.href}>{goal.lightweightMode.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
