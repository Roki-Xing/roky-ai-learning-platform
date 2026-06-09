import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LearningStatusBadge,
  type LearningStatusTone,
} from "@/components/learning/learning-status-badge";
import type {
  LearningSession,
  LearningSessionStatus,
  LearningSessionSummary,
} from "@/server/learning/current-mission";

const sessionCtaClassName = "min-h-11 w-full sm:w-auto";

function statusLabel(status: LearningSessionStatus) {
  switch (status) {
    case "completed":
      return "已完成";
    case "in_progress":
      return "进行中";
    case "not_started":
      return "未开始";
  }
}

function statusTone(status: LearningSessionStatus): LearningStatusTone {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "info";
    case "not_started":
      return "neutral";
  }
}

function outputText(outputs: string[]) {
  return outputs.length > 0 ? outputs.join(" / ") : "学习证据";
}

function SessionItem(props: {
  label: "当前会话" | "下一会话" | "本周会话";
  session: LearningSession;
  action?: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-3 rounded-lg border bg-background px-3 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <LearningStatusBadge tone={props.label === "当前会话" ? "info" : "neutral"}>
          {props.label}
        </LearningStatusBadge>
        <LearningStatusBadge tone={statusTone(props.session.status)}>
          {statusLabel(props.session.status)}
        </LearningStatusBadge>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold leading-6">{props.session.title}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">
          {props.session.goal}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          产出：{outputText(props.session.outputs)}
        </div>
      </div>
      {props.action ? (
        <Button asChild size="sm" variant="secondary" className={sessionCtaClassName}>
          <Link href={props.session.href}>
            {props.session.ctaLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function LearningSessionStrip(props: { sessions: LearningSessionSummary }) {
  return (
    <section
      aria-label="学习会话"
      className="grid gap-3 rounded-lg border bg-card/60 p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">学习会话</div>
          <div className="mt-1 text-xs text-muted-foreground">
            今天先完成一个清晰动作。
          </div>
        </div>
        {props.sessions.current.nextRecommendedSession ? (
          <LearningStatusBadge tone="neutral">
            下一步：{props.sessions.current.nextRecommendedSession.title}
          </LearningStatusBadge>
        ) : null}
      </div>
      <div className="grid gap-2 lg:grid-cols-3">
        <SessionItem label="当前会话" session={props.sessions.current} action />
        <SessionItem label="下一会话" session={props.sessions.next} />
        <SessionItem label="本周会话" session={props.sessions.weekly} />
      </div>
    </section>
  );
}
