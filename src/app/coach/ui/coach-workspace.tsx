import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, BookOpen, Brain, CheckCircle2, HelpCircle, Layers3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

type CoachMetric = {
  label: string;
  value: string | number;
  tone?: LearningStatusTone;
};

type CoachContextItem = {
  title: string;
  subtitle?: string;
  tone?: LearningStatusTone;
};

export type CoachContextCompassSignal = {
  label: string;
  value: number;
  tone?: LearningStatusTone;
  href?: string;
};

function toneClass(tone: LearningStatusTone) {
  switch (tone) {
    case "info":
      return "border-indigo-200 bg-indigo-50/70 text-indigo-800";
    case "success":
      return "border-emerald-200 bg-emerald-50/70 text-emerald-800";
    case "warning":
      return "border-amber-200 bg-amber-50/80 text-amber-900";
    case "danger":
      return "border-rose-200 bg-rose-50/80 text-rose-800";
    default:
      return "border-border bg-card text-foreground";
  }
}

function mutedToneClass(tone: LearningStatusTone) {
  switch (tone) {
    case "info":
      return "border-indigo-100 bg-indigo-50/50";
    case "success":
      return "border-emerald-100 bg-emerald-50/50";
    case "warning":
      return "border-amber-100 bg-amber-50/60";
    case "danger":
      return "border-rose-100 bg-rose-50/60";
    default:
      return "border-border bg-muted/20";
  }
}

export function CoachHero(props: {
  lessonTitle?: string | null;
  localDate?: string | null;
  dueCount: number;
  issueCount: number;
}) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">Tutor Workspace</LearningStatusBadge>
            {props.localDate ? (
              <LearningStatusBadge tone="neutral">{props.localDate}</LearningStatusBadge>
            ) : null}
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-normal md:text-2xl">
            把模糊理解交给 Coach
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            左侧写出你的判断或代码思路，中间看反馈，右侧持续保留最近课程、错题、代码反馈和到期卡片。
          </p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:min-w-[360px]">
          <CoachMetricPill label="关联课程" value={props.lessonTitle ?? "暂无"} tone="info" />
          <CoachMetricPill label="到期卡片" value={props.dueCount} tone={props.dueCount ? "warning" : "success"} />
          <CoachMetricPill label="待澄清" value={props.issueCount} tone={props.issueCount ? "danger" : "success"} />
        </div>
      </div>
    </section>
  );
}

export function CoachMetricPill({ label, value, tone = "neutral" }: CoachMetric) {
  return (
    <div className={cn("min-w-0 rounded-lg border px-3 py-2", mutedToneClass(tone))}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export function CoachModeRail(props: { modes: readonly (readonly [string, string])[] }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">评审模式</div>
      <select
        name="mode"
        defaultValue="today_lesson"
        className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {props.modes.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="rounded-md border bg-muted/20 px-2 py-2">概念</div>
        <div className="rounded-md border bg-muted/20 px-2 py-2">代码</div>
        <div className="rounded-md border bg-muted/20 px-2 py-2">算法</div>
        <div className="rounded-md border bg-muted/20 px-2 py-2">广度</div>
      </div>
    </div>
  );
}

export function CoachSignalStrip(props: { items: CoachMetric[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {props.items.map((item) => (
        <CoachMetricPill key={item.label} {...item} />
      ))}
    </div>
  );
}

export function CoachContextCompass(props: {
  localDate: string;
  lessonTitle?: string | null;
  signals: CoachContextCompassSignal[];
}) {
  const totalSignals = props.signals.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const strongest =
    props.signals
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)[0] ?? null;

  return (
    <section className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">Context Compass</LearningStatusBadge>
            <LearningStatusBadge tone="neutral">{props.localDate}</LearningStatusBadge>
          </div>
          <div className="mt-2 text-sm font-semibold">学习上下文指南针</div>
        </div>
        <div className="rounded-md border bg-muted/20 px-2.5 py-1 text-right">
          <div className="text-[11px] text-muted-foreground">上下文信号</div>
          <div className="text-sm font-semibold tabular-nums">{totalSignals}</div>
        </div>
      </div>

      <div className="mt-3 rounded-md border bg-indigo-50/50 px-3 py-2">
        <div className="text-xs text-indigo-900">关联课程</div>
        <div className="mt-1 line-clamp-2 text-sm font-medium text-indigo-950">
          {props.lessonTitle ?? "暂无"}
        </div>
      </div>

      <div className="mt-3 rounded-md border bg-muted/20 px-3 py-2">
        <div className="text-xs text-muted-foreground">最强信号</div>
        {strongest ? (
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">{strongest.label}</div>
            <LearningStatusBadge tone={strongest.tone ?? "neutral"}>
              {strongest.value}
            </LearningStatusBadge>
          </div>
        ) : (
          <div className="mt-1 text-sm text-muted-foreground">暂无强信号，适合自由提问。</div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {props.signals.map((signal) => {
          const body = (
            <>
              <div className="text-xs text-muted-foreground">{signal.label}</div>
              <div className="mt-1 text-base font-semibold tabular-nums">{signal.value}</div>
            </>
          );
          const className = cn(
            "rounded-md border px-3 py-2 text-left transition-colors",
            mutedToneClass(signal.tone ?? "neutral"),
            signal.href ? "hover:bg-muted/60" : null,
          );

          return signal.href ? (
            <Link key={signal.label} href={signal.href} className={className}>
              {body}
            </Link>
          ) : (
            <div key={signal.label} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CoachResultBlock(props: {
  title: string;
  icon: LucideIcon;
  tone?: LearningStatusTone;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const Icon = props.icon;
  return (
    <section className={cn("rounded-lg border p-4", mutedToneClass(props.tone ?? "neutral"))}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border", toneClass(props.tone ?? "neutral"))}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-semibold">{props.title}</h3>
        </div>
        {props.action ? <div className="shrink-0">{props.action}</div> : null}
      </div>
      <div className="mt-3 text-sm leading-6 text-muted-foreground">{props.children}</div>
    </section>
  );
}

export function CoachClaimCard(props: {
  normalizedText: string;
  mainClaim?: string | null;
}) {
  return (
    <CoachResultBlock title="你的观点" icon={Brain} tone="info">
      <div className="whitespace-pre-wrap">{props.normalizedText}</div>
      {props.mainClaim ? (
        <div className="mt-3 rounded-md border bg-background/70 px-3 py-2 text-foreground">
          <span className="font-medium">主张：</span>
          {props.mainClaim}
        </div>
      ) : null}
    </CoachResultBlock>
  );
}

export function CoachListBlock(props: {
  title: string;
  icon: LucideIcon;
  tone?: LearningStatusTone;
  items: string[];
  empty: string;
  ordered?: boolean;
}) {
  const ListTag = props.ordered ? "ol" : "ul";
  return (
    <CoachResultBlock title={props.title} icon={props.icon} tone={props.tone}>
      {props.items.length ? (
        <ListTag className={cn("grid gap-1", props.ordered ? "list-decimal pl-5" : "list-disc pl-5")}>
          {props.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      ) : (
        <div>{props.empty}</div>
      )}
    </CoachResultBlock>
  );
}

export function CoachIssueList(props: {
  issues: Array<{ type?: string; severity?: string; issue?: string; explanation?: string }>;
}) {
  return (
    <CoachResultBlock title="可能问题" icon={AlertTriangle} tone={props.issues.length ? "danger" : "success"}>
      {props.issues.length ? (
        <div className="grid gap-2">
          {props.issues.map((issue, idx) => (
            <div key={`${issue.issue}:${idx}`} className="rounded-md border bg-background/80 p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline">{issue.type ?? "issue"}</Badge>
                <LearningStatusBadge
                  tone={
                    issue.severity === "high"
                      ? "danger"
                      : issue.severity === "medium"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {issue.severity ?? "medium"}
                </LearningStatusBadge>
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">{issue.issue}</div>
              {issue.explanation ? (
                <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {issue.explanation}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div>暂未发现明显问题，继续用例子验证你的理解。</div>
      )}
    </CoachResultBlock>
  );
}

export function CoachMissingConcepts(props: {
  concepts: Array<{ term?: string; reason?: string }>;
}) {
  return (
    <CoachResultBlock title="缺失概念" icon={Layers3} tone={props.concepts.length ? "warning" : "success"}>
      {props.concepts.length ? (
        <div className="grid gap-2">
          {props.concepts.map((concept, idx) => (
            <div key={`${concept.term}:${idx}`} className="rounded-md border bg-background/80 px-3 py-2">
              <div className="font-medium text-foreground">{concept.term ?? "未命名概念"}</div>
              {concept.reason ? <div className="mt-1">{concept.reason}</div> : null}
            </div>
          ))}
        </div>
      ) : (
        <div>暂无明显缺失概念。</div>
      )}
    </CoachResultBlock>
  );
}

export function CoachFlashcardPanel(props: {
  reviewId: string;
  generatedCardCount: number;
  flashcards: Array<{ front?: string; back?: string; type?: string }>;
  action: (formData: FormData) => Promise<void>;
  relatedTerms: string[];
}) {
  return (
    <CoachResultBlock
      title="卡片沉淀"
      icon={Sparkles}
      tone="info"
      action={
        <form action={props.action}>
          <input type="hidden" name="reviewId" value={props.reviewId} />
          <Button type="submit" size="sm" disabled={!props.flashcards.length}>
            生成卡片
          </Button>
        </form>
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <LearningStatusBadge tone="neutral">已生成 {props.generatedCardCount}</LearningStatusBadge>
        <LearningStatusBadge tone="info">建议 {props.flashcards.length}</LearningStatusBadge>
      </div>
      {props.flashcards.length ? (
        <div className="mt-3 grid gap-2">
          {props.flashcards.map((card, idx) => (
            <div key={`${card.front}:${idx}`} className="rounded-md border bg-background/80 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-sm font-medium text-foreground">{card.front}</div>
                {card.type ? <Badge variant="outline">{card.type}</Badge> : null}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{card.back}</div>
            </div>
          ))}
        </div>
      ) : null}
      {props.relatedTerms.length ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {props.relatedTerms.map((term) => (
            <Badge key={term} variant="outline">
              {term}
            </Badge>
          ))}
        </div>
      ) : null}
    </CoachResultBlock>
  );
}

export function CoachContextGroup(props: {
  title: string;
  icon: LucideIcon;
  items: CoachContextItem[];
  empty: string;
  maxItems?: number;
}) {
  const Icon = props.icon;
  const items = props.items.slice(0, props.maxItems ?? 3);
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <div className="text-sm font-medium">{props.title}</div>
      </div>
      <div className="mt-3 grid gap-2">
        {items.length ? (
          items.map((item, idx) => (
            <div key={`${item.title}:${idx}`} className={cn("rounded-md border px-3 py-2", mutedToneClass(item.tone ?? "neutral"))}>
              <div className="line-clamp-2 text-sm font-medium">{item.title}</div>
              {item.subtitle ? (
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.subtitle}</div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">{props.empty}</div>
        )}
      </div>
    </div>
  );
}

export function CoachQuickLinks(props: { lessonId?: string | null }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href="/today">今日学习</Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link href="/review">复习中心</Link>
      </Button>
      {props.lessonId ? (
        <Button asChild size="sm" variant="outline" className="col-span-2">
          <Link href={`/library?lessonId=${encodeURIComponent(props.lessonId)}`}>查看关联课程</Link>
        </Button>
      ) : null}
    </div>
  );
}

export const coachIcons = {
  book: BookOpen,
  check: CheckCircle2,
  help: HelpCircle,
};
