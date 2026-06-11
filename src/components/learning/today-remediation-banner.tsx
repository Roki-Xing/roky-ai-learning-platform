import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import type { TodayRemediationIntent } from "@/server/learning/today-remediation-intent";

export function TodayRemediationBanner(props: {
  intent: TodayRemediationIntent;
  className?: string;
}) {
  const { intent } = props;

  return (
    <section className={cn("rounded-lg border border-rose-200 bg-rose-50/50 p-4", props.className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <BookOpenCheck className="size-4 text-rose-700" aria-hidden="true" />
            <div className="text-sm font-semibold text-rose-950">{intent.title}</div>
            <LearningStatusBadge tone="danger">{intent.statusLabel}</LearningStatusBadge>
          </div>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            来自 {intent.sourceLabel}：先补「{intent.focusLabel}」，再完成一次短课沉淀。
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {intent.lessonTitle ? <span>课程：{intent.lessonTitle}</span> : null}
            {intent.topicTitle ? <span>领域：{intent.topicTitle}</span> : null}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Button asChild size="sm" variant="secondary" className="min-h-11 w-full sm:w-auto">
          <Link href="#today-lesson">
            先回到主课
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild size="sm" className="min-h-11 w-full sm:w-auto">
          <Link href="#today-reflection">
            {intent.primaryActionLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="min-h-11 w-full sm:w-auto">
          <Link href={intent.returnHref}>
            {intent.returnActionLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
