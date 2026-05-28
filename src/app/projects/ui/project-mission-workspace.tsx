import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import { cn } from "@/lib/utils";

export type ProjectTypeFilterItem = {
  href: string;
  label: string;
  active: boolean;
};

export type ProjectTemplateView = {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  typeLabel: string;
  estimatedHours: number;
  milestoneCount: number;
  existingProjectId?: string | null;
};

export type ProjectListView = {
  id: string;
  title: string;
  typeLabel: string;
  status: string;
  percent: number;
};

export type ProjectMissionView = {
  id: string;
  title: string;
  description: string;
  typeLabel: string;
  status: string;
  percent: number;
  totalMilestones: number;
  completedMilestones: number;
  remainingMilestones: number;
  topicCount: number;
  activeMilestoneTitle?: string | null;
  activeMilestoneTask?: string | null;
  reviewDue: number;
  reviewTotal: number;
  codeDue: number;
  codeTotal: number;
};

export type ProjectMilestonePathItem = {
  id: string;
  position: number;
  title: string;
  task: string;
  status: string;
  hasCode: boolean;
  hasReflection: boolean;
  hasFeedback: boolean;
  feedbackSummary?: string | null;
};

function statusTone(status: string): LearningStatusTone {
  if (status === "completed") return "success";
  if (status === "active" || status === "in_progress") return "info";
  return "warning";
}

function missionStatusText(status: string) {
  if (status === "completed") return "已完成";
  if (status === "active" || status === "in_progress") return "进行中";
  return status;
}

export function ProjectMissionHero({ mission }: { mission: ProjectMissionView | null }) {
  if (!mission) {
    return (
      <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
        <LearningStatusBadge tone="warning">Mission Mode</LearningStatusBadge>
        <h2 className="mt-3 text-xl font-semibold tracking-normal md:text-2xl">
          选择一个项目开始实践
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          从左侧模板开始一个项目后，这里会显示当前任务、完成条件和里程碑路线。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">Mission Mode</LearningStatusBadge>
            <LearningStatusBadge tone={statusTone(mission.status)}>
              {missionStatusText(mission.status)}
            </LearningStatusBadge>
            <LearningStatusBadge tone="neutral">{mission.typeLabel}</LearningStatusBadge>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-normal md:text-2xl">
            {mission.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {mission.description}
          </p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:min-w-[420px]">
          <MissionMetric label="进度" value={`${mission.percent}%`} tone="info" />
          <MissionMetric label="剩余里程碑" value={mission.remainingMilestones} tone={mission.remainingMilestones ? "warning" : "success"} />
          <MissionMetric label="项目卡片到期" value={mission.reviewDue} tone={mission.reviewDue ? "warning" : "success"} />
          <MissionMetric label="代码反馈到期" value={mission.codeDue} tone={mission.codeDue ? "warning" : "success"} />
        </div>
      </div>
      <div className="mt-4">
        <LearningProgressBar value={mission.percent / 100} />
      </div>
      <div className="mt-4 rounded-lg border bg-muted/20 p-3">
        <div className="text-xs font-medium text-muted-foreground">今日只做这一小步</div>
        <div className="mt-1 text-sm font-semibold">
          {mission.activeMilestoneTitle ?? "所有里程碑已完成"}
        </div>
        {mission.activeMilestoneTask ? (
          <div className="mt-1 text-sm text-muted-foreground">{mission.activeMilestoneTask}</div>
        ) : null}
      </div>
    </section>
  );
}

export function MissionMetric(props: {
  label: string;
  value: string | number;
  tone?: LearningStatusTone;
}) {
  return (
    <div className={cn("rounded-lg border px-3 py-2", metricToneClass(props.tone ?? "neutral"))}>
      <div className="text-xs text-muted-foreground">{props.label}</div>
      <div className="mt-1 truncate text-base font-semibold tabular-nums">{props.value}</div>
    </div>
  );
}

function metricToneClass(tone: LearningStatusTone) {
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

export function ProjectTypeFilter({ items }: { items: ProjectTypeFilterItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item.href} asChild variant={item.active ? "secondary" : "outline"}>
          <Link href={item.href}>{item.label}</Link>
        </Badge>
      ))}
    </div>
  );
}

export function ProjectTemplateList(props: {
  templates: ProjectTemplateView[];
  startAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="grid gap-2">
      {props.templates.map((template) => (
        <div key={template.slug} className="rounded-lg border bg-card px-3 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{template.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {template.description}
              </div>
            </div>
            <LearningStatusBadge tone="neutral">{template.difficulty}</LearningStatusBadge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{template.typeLabel}</span>
            <span>{template.estimatedHours}h</span>
            <span>{template.milestoneCount} steps</span>
          </div>
          <div className="mt-3">
            {template.existingProjectId ? (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/projects?projectId=${encodeURIComponent(template.existingProjectId)}`}>
                  打开项目
                </Link>
              </Button>
            ) : (
              <form action={props.startAction}>
                <input type="hidden" name="templateSlug" value={template.slug} />
                <Button type="submit" size="sm">
                  开始项目
                </Button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectListPanel(props: {
  activeCount: number;
  completedCount: number;
  projects: ProjectListView[];
  selectedProjectId?: string | null;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <MissionMetric label="进行中" value={props.activeCount} tone="info" />
        <MissionMetric label="已完成" value={props.completedCount} tone="success" />
      </div>

      {props.projects.length ? (
        props.projects.map((project) => {
          const active = props.selectedProjectId === project.id;
          return (
            <Link
              key={project.id}
              href={`/projects?projectId=${encodeURIComponent(project.id)}`}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                active ? "border-indigo-200 bg-indigo-50/50" : "hover:bg-muted/50",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate font-medium">{project.title}</div>
                <LearningStatusBadge tone={project.status === "completed" ? "success" : "info"}>
                  {project.percent}%
                </LearningStatusBadge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {project.typeLabel} / {missionStatusText(project.status)}
              </div>
              <div className="mt-2">
                <LearningProgressBar value={project.percent / 100} />
              </div>
            </Link>
          );
        })
      ) : (
        <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
          还没有项目。先从模板开始一个。
        </div>
      )}
    </div>
  );
}

export function ProjectMissionBrief(props: {
  position: number;
  title: string;
  task: string;
  codePrompt?: string | null;
  status: string;
}) {
  return (
    <div className="rounded-lg border bg-indigo-50/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-medium">
          {props.position}. {props.title}
        </div>
        <LearningStatusBadge tone={statusTone(props.status)}>
          {missionStatusText(props.status)}
        </LearningStatusBadge>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{props.task}</div>
      {props.codePrompt ? (
        <div className="mt-2 rounded-md border bg-background/80 px-3 py-2 font-mono text-xs">
          {props.codePrompt}
        </div>
      ) : null}
    </div>
  );
}

export function MissionCompletionCriteria() {
  return (
    <div className="rounded-lg border bg-amber-50/60 p-3 text-sm">
      <div className="text-sm font-medium">完成条件</div>
      <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
        <li>代码与思路已保存（允许未完全正确）</li>
        <li>至少写出 1 个边界/测试用例</li>
        <li>有需要时先点“保存并评审代码”，再修正一次</li>
      </ul>
    </div>
  );
}

export function ProjectReviewQueuePanel(props: {
  codeDue: number;
  codeTotal: number;
  codeHref?: string | null;
  projectDue: number;
  projectTotal: number;
  projectHref?: string | null;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-medium">代码反馈卡片</div>
            <div className="mt-1 text-xs text-muted-foreground">只进入当前项目的代码反馈队列</div>
          </div>
          <LearningStatusBadge tone={props.codeDue ? "warning" : "neutral"}>
            到期 {props.codeDue} / 总计 {props.codeTotal}
          </LearningStatusBadge>
        </div>
        <div className="mt-3">
          <Button asChild size="sm" variant="secondary">
            <Link href={props.codeHref ?? "/review"}>复习代码反馈</Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-medium">项目复盘卡片</div>
            <div className="mt-1 text-xs text-muted-foreground">项目完成后沉淀的长期复习卡</div>
          </div>
          <LearningStatusBadge tone={props.projectDue ? "warning" : "neutral"}>
            到期 {props.projectDue} / 总计 {props.projectTotal}
          </LearningStatusBadge>
        </div>
        <div className="mt-3">
          <Button asChild size="sm" variant="outline">
            <Link href={props.projectHref ?? "/review"}>复习项目卡片</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectMilestonePath({ items }: { items: ProjectMilestonePathItem[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-card px-3 py-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium">
              {item.position}. {item.title}
            </div>
            <LearningStatusBadge tone={statusTone(item.status)}>
              {missionStatusText(item.status)}
            </LearningStatusBadge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{item.task}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {item.hasCode ? <span>code saved</span> : null}
            {item.hasReflection ? <span>reflection saved</span> : null}
            {item.hasFeedback ? <span>AI reviewed</span> : null}
          </div>
          {item.feedbackSummary ? (
            <div className="mt-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {item.feedbackSummary}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
