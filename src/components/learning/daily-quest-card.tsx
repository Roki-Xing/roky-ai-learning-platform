import Link from "next/link";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import {
  summarizeDailyQuestProgress,
  type DailyQuest,
  type DailyQuestStatus,
} from "@/server/learning/daily-quests";

function statusTone(status: DailyQuestStatus): LearningStatusTone {
  if (status === "completed") return "success";
  if (status === "in_progress") return "warning";
  return "neutral";
}

function statusLabel(status: DailyQuestStatus) {
  if (status === "completed") return "完成";
  if (status === "in_progress") return "进行中";
  return "未开始";
}

function StatusIcon(props: { status: DailyQuestStatus }) {
  if (props.status === "completed") {
    return <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />;
  }
  if (props.status === "in_progress") {
    return <Clock3 className="size-4 text-amber-600" aria-hidden="true" />;
  }
  return <Circle className="size-4 text-muted-foreground" aria-hidden="true" />;
}

export function DailyQuestCard(props: { quests: DailyQuest[] }) {
  const summary = summarizeDailyQuestProgress(props.quests);

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="今日任务">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">今日任务</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {summary.completed}/{summary.total} 完成 · 已拿 {summary.earnedXp} XP
          </div>
        </div>
        <LearningStatusBadge tone={summary.completed === summary.total ? "success" : "info"}>
          {summary.possibleXp} XP
        </LearningStatusBadge>
      </div>

      <div className="mt-3">
        <LearningProgressBar value={summary.ratio} label="今日任务进度" />
      </div>

      <div className="mt-3 grid gap-2">
        {props.quests.map((quest) => (
          <div
            key={quest.id}
            className="flex flex-col gap-3 rounded-md border bg-muted/10 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-2">
              <StatusIcon status={quest.status} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium">{quest.title}</div>
                  <LearningStatusBadge tone={statusTone(quest.status)}>
                    {statusLabel(quest.status)}
                  </LearningStatusBadge>
                </div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  {quest.description}
                </div>
              </div>
            </div>
            <div className="grid gap-2 sm:flex sm:items-center sm:justify-end">
              <LearningStatusBadge tone="neutral" className="w-fit">
                +{quest.rewardXp} XP
              </LearningStatusBadge>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={quest.href}>{quest.ctaLabel}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
