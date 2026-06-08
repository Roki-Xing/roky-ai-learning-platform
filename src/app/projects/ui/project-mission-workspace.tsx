import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge, type LearningStatusTone } from "@/components/learning/learning-status-badge";
import { LearningCelebrationCue } from "@/components/learning/learning-celebration-cue";
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

export type ProjectDailyRhythmView = {
  id: string;
  title: string;
  typeLabel: string;
  status: string;
  percent: number;
  completedMilestones: number;
  totalMilestones: number;
  activeMilestoneTitle?: string | null;
  activeMilestoneTask?: string | null;
  reviewDue: number;
  codeDue: number;
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

export type ProjectPortfolioView = {
  id: string;
  title: string;
  typeLabel: string;
  summary: string;
  completedMilestones: number;
  codeSnippetCount: number;
  reflectionCount: number;
  cardCount: number;
  relatedTopics: string[];
  reviewHref: string;
  featuredCodeSnippet?: string | null;
  portfolioMarkdown?: string;
};

function statusTone(status: string): LearningStatusTone {
  if (status === "completed") return "success";
  if (status === "active" || status === "in_progress") return "info";
  return "warning";
}

export function missionStatusText(status: string) {
  if (status === "completed") return "已完成";
  if (status === "active" || status === "in_progress") return "进行中";
  if (status === "planned") return "待开始";
  return status;
}

export function formatProjectTemplateDifficultyLabel(difficulty: string) {
  const value = difficulty.trim();
  if (!value) return "未标记难度";
  if (value === "beginner") return "入门";
  if (value === "intermediate") return "进阶";
  if (value === "advanced") return "高阶";
  if (value === "入门" || value === "进阶" || value === "高阶") return value;
  return `当前难度：${value}`;
}

const projectTopicLabels: Record<string, string> = {
  "binary-search": "二分搜索",
  "cosine-similarity": "余弦相似度",
  "dependency-injection": "依赖注入",
  "edge-cases": "边界情况",
  "file-io": "文件读写",
  "hash-map": "哈希表",
  "inverted-index": "倒排索引",
  "open-source-project": "开源项目",
  "set-operations": "集合运算",
  "state-machine": "状态机",
  "string-processing": "字符串处理",
  "tie-break": "平局规则",
  "tool-calling": "工具调用",
  "tool-schema": "工具协议",
  "vector-search": "向量检索",
};

function formatProjectRelatedTopicLabel(topic: string) {
  const value = topic.trim();
  if (!value) return "未标记知识";
  return projectTopicLabels[value] ?? value;
}

export function ProjectMissionHero({ mission }: { mission: ProjectMissionView | null }) {
  if (!mission) {
    return (
      <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
        <LearningStatusBadge tone="warning">项目任务模式</LearningStatusBadge>
        <h2 className="mt-3 text-xl font-semibold tracking-normal md:text-2xl">
          选择一个项目开始实践
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          从左侧模板开始一个项目后，这里会显示当前任务、完成条件和里程碑路线。
        </p>
        <div className="mt-4 rounded-lg border bg-muted/20 p-3">
          <div className="text-xs font-medium text-muted-foreground">今日项目任务</div>
          <div className="mt-1 text-sm font-semibold">先从模板开始一个项目</div>
          <div className="mt-1 text-sm text-muted-foreground">
            建议选择一个 3 到 6 小时能收尾的小项目，今天只推进第一个里程碑。
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone="info">项目任务模式</LearningStatusBadge>
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
        <LearningProgressBar value={mission.percent / 100} label="项目任务进度" />
      </div>
      {mission.status === "completed" ? (
        <LearningCelebrationCue
          kind="project_milestone"
          metric={`${mission.completedMilestones}/${mission.totalMilestones} 里程碑`}
          className="mt-4"
        />
      ) : null}
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

export function ProjectDailyRhythmCard({ project }: { project: ProjectDailyRhythmView | null }) {
  if (!project) {
    return (
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <LearningStatusBadge tone="neutral">项目实践</LearningStatusBadge>
          <LearningStatusBadge tone="warning">未开始</LearningStatusBadge>
        </div>
        <h2 className="mt-3 text-base font-semibold tracking-normal">当前项目进度</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          还没有进行中的项目。选一个小项目，把今天学到的概念落到代码和复盘里。
        </p>
        <div className="mt-3 rounded-lg border bg-muted/20 p-3">
          <div className="text-xs font-medium text-muted-foreground">今日项目任务 / 今日里程碑</div>
          <div className="mt-1 text-sm font-semibold">先选择一个小项目</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">
            从第一个里程碑开始，只保存一段代码或一条反思也算推进。
          </div>
        </div>
        <div className="mt-3">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
          >
            <Link href="/projects">选择项目</Link>
          </Button>
        </div>
      </section>
    );
  }

  const projectHref = `/projects?projectId=${encodeURIComponent(project.id)}`;

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <LearningStatusBadge tone="info">当前项目进度</LearningStatusBadge>
          <LearningStatusBadge tone={statusTone(project.status)}>
            {missionStatusText(project.status)}
          </LearningStatusBadge>
          <LearningStatusBadge tone="neutral">{project.typeLabel}</LearningStatusBadge>
        </div>
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="min-h-11 w-full sm:w-auto"
        >
          <Link href={projectHref}>继续项目</Link>
        </Button>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-normal">{project.title}</h2>
          <div className="mt-2 rounded-lg border bg-indigo-50/40 p-3">
            <div className="text-xs font-medium text-muted-foreground">今日项目任务 / 今日里程碑</div>
            <div className="mt-1 text-sm font-semibold">
              {project.activeMilestoneTitle ?? "所有里程碑已完成"}
            </div>
            {project.activeMilestoneTask ? (
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {project.activeMilestoneTask}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <MissionMetric label="进度" value={`${project.percent}%`} tone="info" />
          <MissionMetric
            label="里程碑"
            value={`${project.completedMilestones}/${project.totalMilestones}`}
            tone={project.percent === 100 ? "success" : "warning"}
          />
        </div>
      </div>

      <div className="mt-3">
        <LearningProgressBar value={project.percent / 100} label="当前项目进度" />
      </div>

      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="rounded-md border bg-muted/20 px-3 py-2">
          项目卡片到期：{project.reviewDue}
        </div>
        <div className="rounded-md border bg-muted/20 px-3 py-2">
          代码反馈到期：{project.codeDue}
        </div>
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

const projectTypeFilterLinkClassName =
  "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50";

export function ProjectTypeFilter({ items }: { items: ProjectTypeFilterItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            projectTypeFilterLinkClassName,
            item.active ? "border-secondary bg-secondary text-secondary-foreground" : "bg-background",
          )}
        >
          {item.label}
        </Link>
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
            <LearningStatusBadge tone="neutral">
              {formatProjectTemplateDifficultyLabel(template.difficulty)}
            </LearningStatusBadge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{template.typeLabel}</span>
            <span>约 {template.estimatedHours} 小时</span>
            <span>{template.milestoneCount} 个里程碑</span>
          </div>
          <div className="mt-3">
            {template.existingProjectId ? (
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={`/projects?projectId=${encodeURIComponent(template.existingProjectId)}`}>
                  打开项目
                </Link>
              </Button>
            ) : (
              <form action={props.startAction}>
                <input type="hidden" name="templateSlug" value={template.slug} />
                <Button type="submit" size="sm" className="min-h-11 w-full sm:w-auto">
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

const projectListPanelLinkClassName =
  "min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors";

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
                    projectListPanelLinkClassName,
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
                <LearningProgressBar
                  value={project.percent / 100}
                  label={`项目进度：${project.title}`}
                />
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
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <MissionBriefDetail
          label="当前任务"
          value={props.task}
        />
        <MissionBriefDetail
          label="输入/输出"
          value={props.codePrompt ?? "输入：当前里程碑材料；输出：可保存的代码、笔记和反思。"}
        />
        <MissionBriefDetail
          label="需要提交什么"
          value="代码产物、笔记、反思，至少补一个边界或测试用例。"
        />
        <MissionBriefDetail
          label="AI 评审入口"
          value="点击保存并评审代码，把当前代码提交给 Coach 生成反馈卡片。"
        />
      </div>
    </div>
  );
}

function MissionBriefDetail(props: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/70 px-3 py-2">
      <div className="text-xs font-medium text-muted-foreground">{props.label}</div>
      <div className="mt-1 text-sm leading-5">{props.value}</div>
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
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
          >
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
          <Button
            asChild
            size="sm"
            variant="outline"
            className="min-h-11 w-full sm:w-auto"
          >
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
            {item.hasCode ? <span>已保存代码</span> : null}
            {item.hasReflection ? <span>已保存反思</span> : null}
            {item.hasFeedback ? <span>AI 已评审</span> : null}
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

export function ProjectPortfolioPanel({ items }: { items: ProjectPortfolioView[] }) {
  if (!items.length) {
    return (
      <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
        完成项目后，这里会展示总结、代码片段、相关知识和项目复习卡片。
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-medium">项目作品集</div>
          <div className="mt-1 text-xs text-muted-foreground">
            已完成项目会沉淀为可展示成果和长期复习卡片。
          </div>
        </div>
        <LearningStatusBadge tone="success">已完成 {items.length} 个项目</LearningStatusBadge>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border bg-card p-3">
            <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.typeLabel}</div>
              </div>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={item.reviewHref}>复习项目卡片</Link>
              </Button>
            </div>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {item.summary}
            </p>

            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                里程碑 {item.completedMilestones}
              </div>
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                代码片段 {item.codeSnippetCount}
              </div>
              <div className="rounded-md border bg-muted/20 px-2 py-1.5">
                项目卡片 {item.cardCount}
              </div>
            </div>

            {item.relatedTopics.length ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {item.relatedTopics.slice(0, 5).map((topic) => (
                  <Badge key={topic} variant="outline">
                    {formatProjectRelatedTopicLabel(topic)}
                  </Badge>
                ))}
              </div>
            ) : null}

            {item.featuredCodeSnippet ? (
              <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs">
                <code>{item.featuredCodeSnippet}</code>
              </pre>
            ) : null}

            {item.portfolioMarkdown ? (
              <div className="mt-3 grid gap-2 rounded-md border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Download className="size-4" aria-hidden="true" />
                  导出 Portfolio Markdown
                </div>
                <p className="text-xs text-muted-foreground">
                  复制到笔记或简历，保留项目总结、学习证据和代表代码片段。
                </p>
                <Textarea
                  readOnly
                  aria-label={`导出 ${item.title} Portfolio Markdown`}
                  className="min-h-36 resize-y bg-background font-mono text-xs"
                  value={item.portfolioMarkdown}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProjectPortfolioPageContent({ items }: { items: ProjectPortfolioView[] }) {
  const completedCount = items.length;
  const artifactCount = items.reduce(
    (sum, item) => sum + item.codeSnippetCount + item.reflectionCount + item.cardCount,
    0,
  );

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border bg-card p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <LearningStatusBadge tone="success">项目作品集</LearningStatusBadge>
              <LearningStatusBadge tone="neutral">已完成 {completedCount} 个项目</LearningStatusBadge>
            </div>
            <h1 className="mt-3 text-xl font-semibold tracking-normal md:text-2xl">
              项目作品集
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              可导出的学习 portfolio，把已完成项目、代码片段、相关知识和项目卡片整理成可复制成果。
            </p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
            <MissionMetric label="完成项目" value={completedCount} tone="success" />
            <MissionMetric label="学习证据" value={artifactCount} tone="info" />
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
            >
              <Link href="/projects">回到项目实践</Link>
            </Button>
          </div>
        </div>
      </section>

      <ProjectPortfolioPanel items={items} />
    </div>
  );
}
