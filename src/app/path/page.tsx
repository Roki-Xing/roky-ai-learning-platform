import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/server/auth/user";
import {
  getLearningPathData,
  type LearningPathStage,
  type LearningPathStageStatus,
} from "@/server/learning/path";

function stageTone(status: LearningPathStageStatus) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "current":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function stageShellClass(status: LearningPathStageStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-200 bg-emerald-50/40";
    case "current":
      return "border-indigo-200 bg-indigo-50/40";
    default:
      return "border-border bg-card";
  }
}

function pathStageMapStatusLabel(stage: LearningPathStage) {
  if (stage.blockers.length > 0 && stage.status !== "completed") return "补弱";
  switch (stage.status) {
    case "completed":
      return "完成";
    case "current":
      return "当前";
    default:
      return "锁定";
  }
}

const pathStageMapNodeClassName = (stage: LearningPathStage) => {
  if (stage.blockers.length > 0 && stage.status !== "completed") {
    return "border-amber-300 bg-amber-50 text-amber-900";
  }
  switch (stage.status) {
    case "completed":
      return "border-emerald-300 bg-emerald-50 text-emerald-900";
    case "current":
      return "border-indigo-300 bg-indigo-50 text-indigo-900";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
};

const pathStageCtaClassName =
  "min-h-11 w-full sm:w-auto inline-flex items-center justify-center rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-background/80";

const pathReadingLinkClassName =
  "min-h-11 w-full sm:w-auto inline-flex items-center justify-center rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-background/80";

function PathStageMap({ stages }: { stages: LearningPathStage[] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">阶段地图</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-7">
          {stages.map((stage, index) => (
            <div key={stage.id} className="grid gap-2 md:grid-rows-[auto_1fr]">
              <div className="flex items-center gap-2 md:flex-col">
                <div
                  className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left transition-colors ${pathStageMapNodeClassName(stage)}`}
                >
                  <span className="truncate text-sm font-medium">{stage.title}</span>
                  <span className="shrink-0 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium">
                    {pathStageMapStatusLabel(stage)}
                  </span>
                </div>
                {index < stages.length - 1 ? (
                  <div className="h-px w-5 shrink-0 bg-border md:h-5 md:w-px" aria-hidden="true" />
                ) : null}
              </div>
              <div className="text-xs leading-5 text-muted-foreground">
                {Math.round(stage.progressRatio * 100)}%
                {stage.blockers.length > 0 ? ` / 当前阻塞：${stage.blockers.join("、")}` : ""}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StageCard({ stage, index }: { stage: LearningPathStage; index: number }) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${stageShellClass(stage.status)}`}>
      <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LearningStatusBadge tone={stageTone(stage.status)}>
              第 {index + 1} 阶段
            </LearningStatusBadge>
            <LearningStatusBadge tone={stageTone(stage.status)}>
              {stage.statusLabel}
            </LearningStatusBadge>
          </div>
          <div className="mt-3 text-lg font-semibold">{stage.title}</div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">{stage.summary}</div>
          <div className="mt-2 text-xs leading-5 text-muted-foreground">
            完成标准：{stage.completionStandard}
          </div>
        </div>
        <a
          href={stage.href}
          className={pathStageCtaClassName}
        >
          {stage.ctaLabel}
        </a>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>阶段进度</span>
          <span>{Math.round(stage.progressRatio * 100)}%</span>
        </div>
        <LearningProgressBar value={stage.progressRatio} label={`阶段进度：${stage.title}`} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border bg-background/80 px-3 py-3">
          <div className="text-sm font-medium">当前阻塞</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">
            {stage.blockers.length ? stage.blockers.join("、") : "暂无阻塞，保持当前节奏。"}
          </div>
        </div>
        <div className="rounded-md border bg-background/80 px-3 py-3">
          <div className="text-sm font-medium">解锁条件</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">
            {stage.unlockCondition}
          </div>
        </div>
        <div className="rounded-md border bg-background/80 px-3 py-3">
          <div className="text-sm font-medium">下一步</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">{stage.nextTopic}</div>
        </div>
      </div>

      {stage.readingMaterials.length ? (
        <div className="mt-4 rounded-md border bg-background/80 p-3">
          <div className="text-sm font-medium">阶段阅读</div>
          <div className="mt-3 grid gap-2">
            {stage.readingMaterials.map((reading) => (
              <div
                key={reading.bookId}
                className="grid gap-3 rounded-md border bg-card/80 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium">{reading.bookTitle}</div>
                    <Badge variant="outline">{reading.pageLabel}</Badge>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {reading.summary}
                  </div>
                </div>
                <a href={reading.href} className={pathReadingLinkClassName}>
                  {reading.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <details className="mt-4 rounded-md border bg-background/80 px-3 py-3">
        <summary className="cursor-pointer text-sm font-medium">详细指标</summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
          <div className="grid gap-2 rounded-md border bg-card/70 p-3">
            <div className="text-sm font-medium">为什么要过这一阶段</div>
            <div className="text-xs leading-6 text-muted-foreground">{stage.whyThisStage}</div>
          </div>

          <div className="grid gap-2 rounded-md border bg-card/70 p-3">
            <div className="text-sm font-medium">当前信号</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>已完成主课：{stage.metrics.completedLessons}</div>
              <div>已复习卡片：{stage.metrics.reviewedFlashcards}</div>
              <div>
                测验正确率：
                {stage.metrics.quizAttempts > 0 ? `${stage.metrics.quizAccuracy}%` : "暂无测验"}
              </div>
              <div>代码练习：{stage.metrics.codeSubmissions}</div>
              <div>到期卡片：{stage.metrics.dueFlashcardCount}</div>
              <div>活跃误区：{stage.metrics.activeMisconceptions}</div>
              {stage.metrics.completedMilestones > 0 || stage.metrics.totalMilestones > 0 ? (
                <div>
                  项目里程碑：{stage.metrics.completedMilestones}/{stage.metrics.totalMilestones}
                </div>
              ) : null}
              {stage.metrics.knowledgeCardsReviewed > 0 ? (
                <div>广度知识卡：{stage.metrics.knowledgeCardsReviewed}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {stage.criteria.map((criterion) => (
            <div key={criterion.label} className="rounded-md border bg-card/70 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{criterion.label}</div>
                <Badge variant={criterion.done ? "secondary" : "outline"}>
                  {criterion.current}/{criterion.targetLabel}
                </Badge>
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">{criterion.helper}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default async function PathPage() {
  const userId = await requireUserId();
  const path = await getLearningPathData(userId);
  const currentCriteria = path.currentStage.criteria;

  return (
    <AppShell activePath="/path" title="学习路径">
      <PageHeader
        title="学习路径"
        subtitle="回答四个问题：我现在在哪个阶段、下一个阶段是什么、为什么今天学这个、这一阶段怎样算完成。"
        badge="学习路径"
      />

      <div className="grid gap-4">
        <CurrentMissionCard
          mission={path.mission}
          signals={path.missionSignals}
          progress={path.missionProgress}
          title="当前任务"
        />

        <PathStageMap stages={path.stages} />

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">我现在处于哪个阶段？</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <LearningStatusBadge tone={stageTone(path.currentStage.status)}>
                  {path.currentStage.statusLabel}
                </LearningStatusBadge>
                <Badge variant="outline">{Math.round(path.currentStage.progressRatio * 100)}%</Badge>
              </div>
              <div className="text-xl font-semibold">{path.currentStage.title}</div>
              <div className="leading-6 text-muted-foreground">{path.currentStage.summary}</div>
              <div className="text-xs text-muted-foreground">
                最近学习：{path.currentStage.metrics.lastStudiedLocalDate ?? "还没有正式开始"}
              </div>
              <div className="text-xs text-muted-foreground">
                测验正确率：
                {path.currentStage.metrics.quizAttempts > 0
                  ? `${path.currentStage.metrics.quizAccuracy}%`
                  : "暂无测验"}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">下一个阶段是什么？</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {path.nextStage ? (
                <>
                  <LearningStatusBadge tone="neutral">下一阶段</LearningStatusBadge>
                  <div className="text-xl font-semibold">{path.nextStage.title}</div>
                  <div className="leading-6 text-muted-foreground">{path.nextStage.summary}</div>
                  <div className="text-xs text-muted-foreground">
                    当你把当前阶段的完成标准走到位后，就该把重心切到这里。
                  </div>
                </>
              ) : (
                <>
                  <LearningStatusBadge tone="success">已到路线后段</LearningStatusBadge>
                  <div className="text-xl font-semibold">继续做项目和广度巩固</div>
                  <div className="leading-6 text-muted-foreground">
                    现在更重要的是保持复习、项目交付和行业广度，不是盲目再开新线。
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">为什么我今天学这个？</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="text-lg font-semibold">
                {path.todayFocus.lessonTitle ?? "今天还没有生成正式课程"}
              </div>
              <div className="leading-6 text-muted-foreground">{path.todayFocus.reason}</div>
              <div className="text-xs text-muted-foreground">
                路线归属：{path.todayFocus.domainLabel ?? path.currentStage.title}
                {path.todayFocus.localDate ? ` / ${path.todayFocus.localDate}` : ""}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">完成这个阶段的标准是什么？</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="leading-6 text-muted-foreground">
                {path.currentStage.completionStandard}
              </div>
              <div className="rounded-md border px-3 py-2">
                <div className="font-medium">解锁条件</div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  {path.currentStage.unlockCondition}
                </div>
              </div>
              <div className="rounded-md border px-3 py-2">
                <div className="font-medium">下一步主题</div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  {path.currentStage.nextTopic}
                </div>
              </div>
              <div className="grid gap-2">
                {currentCriteria.map((criterion) => (
                  <div key={criterion.label} className="rounded-md border px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{criterion.label}</div>
                      <Badge variant={criterion.done ? "secondary" : "outline"}>
                        {criterion.current}/{criterion.targetLabel}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">
                      {criterion.helper}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">路线图</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {path.stages.map((stage, index) => (
              <StageCard key={stage.id} stage={stage} index={index} />
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
