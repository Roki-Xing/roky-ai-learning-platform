import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import {
  DEFAULT_PROJECT_TEMPLATES,
  PROJECT_TYPE_LABELS,
  buildProjectPortfolioItems,
  calculateProjectProgress,
  normalizeProjectType,
  type ProjectType,
} from "@/server/projects/base";
import {
  getProjectCodeFeedbackCardSummary,
  getProjectMilestoneFeedbackSummaries,
} from "@/server/projects/code-feedback-summary";
import { getProjectReviewCardSummary } from "@/server/projects/review-cards";
import { localDateInTimeZone } from "@/server/time/day";
import { getCurrentMissionData } from "@/server/learning/current-mission";
import {
  completeMilestoneAction,
  completeProjectAction,
  reviewMilestoneCodeAction,
  saveMilestoneDraftAction,
  startProjectAction,
} from "@/app/projects/actions";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningCTAGroup } from "@/components/learning/learning-cta-group";
import {
  formatCodeFeedbackIssueSeverityLabel,
  formatCodeFeedbackIssueTypeLabel,
  formatHomeCodeFeedbackOverallLabel,
} from "@/app/_lib/home-labels";
import {
  MissionCompletionCriteria,
  ProjectListPanel,
  ProjectMilestonePath,
  ProjectMissionBrief,
  ProjectMissionHero,
  ProjectPortfolioPanel,
  ProjectReviewQueuePanel,
  ProjectTemplateList,
  ProjectTypeFilter,
  formatProjectTemplateDifficultyLabel,
  missionStatusText,
  type ProjectListView,
  type ProjectMilestonePathItem,
  type ProjectMissionView,
  type ProjectTemplateView,
  type ProjectTypeFilterItem,
} from "@/app/projects/ui/project-mission-workspace";

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function projectTypeHref(type?: string) {
  return type ? `/projects?type=${encodeURIComponent(type)}` : "/projects";
}

const projectMilestoneInputClassName = "min-h-11";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; projectId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });
  const currentMission = await getCurrentMissionData(userId);
  const currentLocalDate = localDateInTimeZone({
    date: new Date(),
    timeZone: profile.timeZone ?? "Asia/Shanghai",
  });

  const selectedType = sp.type ? normalizeProjectType(sp.type) : null;
  const templates = selectedType
    ? DEFAULT_PROJECT_TEMPLATES.filter((project) => project.type === selectedType)
    : DEFAULT_PROJECT_TEMPLATES;

  const projects = await prisma.learningProject.findMany({
    where: { userId, ...(selectedType ? { type: selectedType } : {}) },
    include: { milestones: { orderBy: [{ position: "asc" }] } },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: 100,
  });
  const projectCardCounts = await prisma.flashcard
    .findMany({
      where: { userId, type: "project", id: { startsWith: "project:" } },
      select: { id: true },
    })
    .then((cards) => {
      const counts: Record<string, number> = {};
      for (const card of cards) {
        const [, projectId] = card.id.split(":");
        if (!projectId) continue;
        counts[projectId] = (counts[projectId] ?? 0) + 1;
      }
      return counts;
    });

  const selectedProject =
    projects.find((project) => project.id === sp.projectId) ??
    (sp.projectId
      ? await prisma.learningProject.findFirst({
          where: { id: sp.projectId, userId },
          include: { milestones: { orderBy: [{ position: "asc" }] } },
        })
      : null) ??
    projects.find((project) => project.status !== "completed") ??
    projects[0] ??
    null;

  const selectedProgress = selectedProject
    ? calculateProjectProgress(selectedProject.milestones)
    : null;
  const selectedReviewCards = selectedProject
    ? await getProjectReviewCardSummary({ userId, projectId: selectedProject.id })
    : null;
  const selectedCodeFeedbackCards = selectedProject
    ? await getProjectCodeFeedbackCardSummary({ userId, projectId: selectedProject.id })
    : null;
  const selectedMilestoneFeedback = selectedProject
    ? await getProjectMilestoneFeedbackSummaries({ userId, projectId: selectedProject.id })
    : [];
  const feedbackByMilestoneId = new Map(
    selectedMilestoneFeedback.map((summary) => [summary.milestoneId, summary]),
  );
  const activeProjectCount = projects.filter((project) => project.status !== "completed").length;
  const completedProjectCount = projects.filter((project) => project.status === "completed").length;
  const activeMilestone =
    selectedProject?.milestones.find((milestone) => milestone.status !== "completed") ?? null;
  const activeMilestoneFeedback = activeMilestone
    ? feedbackByMilestoneId.get(activeMilestone.id)
    : null;

  const typeEntries = Object.entries(PROJECT_TYPE_LABELS) as Array<[ProjectType, string]>;
  const typeFilterItems: ProjectTypeFilterItem[] = [
    { href: "/projects", label: "全部", active: selectedType === null },
    ...typeEntries.map(([type, label]) => ({
      href: projectTypeHref(type),
      label,
      active: selectedType === type,
    })),
  ];
  const templateViews: ProjectTemplateView[] = templates.map((template) => {
    const existing = projects.find((project) => project.templateSlug === template.slug);
    return {
      slug: template.slug,
      title: template.title,
      description: template.description,
      difficulty: formatProjectTemplateDifficultyLabel(template.difficulty),
      typeLabel: PROJECT_TYPE_LABELS[template.type],
      estimatedHours: template.estimatedHours,
      milestoneCount: template.milestones.length,
      existingProjectId: existing?.id ?? null,
    };
  });
  const projectViews: ProjectListView[] = projects.map((project) => {
    const progress = calculateProjectProgress(project.milestones);
    return {
      id: project.id,
      title: project.title,
      typeLabel: PROJECT_TYPE_LABELS[normalizeProjectType(project.type)],
      status: project.status,
      percent: progress.percent,
    };
  });
  const selectedMission: ProjectMissionView | null =
    selectedProject && selectedProgress
      ? {
          id: selectedProject.id,
          title: selectedProject.title,
          description: selectedProject.description,
          typeLabel: PROJECT_TYPE_LABELS[normalizeProjectType(selectedProject.type)],
          status: selectedProject.status,
          percent: selectedProgress.percent,
          totalMilestones: selectedProgress.total,
          completedMilestones: selectedProgress.completed,
          remainingMilestones: selectedProgress.remaining,
          topicCount: strings(selectedProject.relatedTopics).length,
          activeMilestoneTitle: activeMilestone?.title ?? null,
          activeMilestoneTask: activeMilestone?.task ?? null,
          reviewDue: selectedReviewCards?.due ?? 0,
          reviewTotal: selectedReviewCards?.total ?? 0,
          codeDue: selectedCodeFeedbackCards?.due ?? 0,
          codeTotal: selectedCodeFeedbackCards?.total ?? 0,
        }
      : null;
  const milestonePathItems: ProjectMilestonePathItem[] =
    selectedProject?.milestones.map((milestone) => {
      const milestoneFeedback = feedbackByMilestoneId.get(milestone.id);
      return {
        id: milestone.id,
        position: milestone.position,
        title: milestone.title,
        task: milestone.task,
        status: milestone.status,
        hasCode: Boolean(milestone.code),
        hasReflection: Boolean(milestone.reflection),
        hasFeedback: Boolean(milestone.codeSubmissionId || milestoneFeedback),
        feedbackSummary: milestoneFeedback?.feedback.summary ?? null,
      };
    }) ?? [];
  const portfolioItems = buildProjectPortfolioItems(projects, projectCardCounts);

  return (
    <AppShell
      activePath="/projects"
      title="项目实践"
      missionBanner={
        <CurrentMissionCard
          mission={currentMission.mission}
          signals={currentMission.signals}
          progress={currentMission.progress}
        />
      }
      actions={
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="min-h-11 w-full sm:w-auto"
        >
          <Link href="/progress">看进度</Link>
        </Button>
      }
    >
      <PageHeader
        title="项目实践"
        subtitle="把每日学习推进到可保存的 Python、算法、RAG、Agent 与复现小项目"
        badge="项目实践"
      />

      <div className="mt-4">
        <ProjectMissionHero mission={selectedMission} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="grid content-start gap-4">
          <LearningSectionCard title="项目类型" description="先缩小任务范围，再开始实践。">
            <ProjectTypeFilter items={typeFilterItems} />
          </LearningSectionCard>

          <LearningSectionCard title="项目模板" description="选择一个能在几小时内收尾的小项目。">
            <ProjectTemplateList templates={templateViews} startAction={startProjectAction} />
          </LearningSectionCard>

          <LearningSectionCard title="我的项目" description="继续未完成任务，避免重复开坑。">
            <ProjectListPanel
              activeCount={activeProjectCount}
              completedCount={completedProjectCount}
              projects={projectViews}
              selectedProjectId={selectedProject?.id ?? null}
            />
          </LearningSectionCard>
        </aside>

        {selectedProject && selectedProgress ? (
          <main className="grid gap-4">
            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
              <LearningSectionCard
                title="今日项目任务"
                description="保存草稿、请求代码评审、完成里程碑都在这里完成。"
                action={
                  activeMilestone ? (
                    <LearningStatusBadge
                      tone={activeMilestone.status === "completed" ? "success" : "warning"}
                    >
                      {missionStatusText(activeMilestone.status)}
                    </LearningStatusBadge>
                  ) : (
                    <LearningStatusBadge tone="success">全部完成</LearningStatusBadge>
                  )
                }
              >
                {activeMilestone ? (
                  <form action={completeMilestoneAction} className="grid gap-3">
                    <input type="hidden" name="projectId" value={selectedProject.id} />
                    <input type="hidden" name="milestoneId" value={activeMilestone.id} />
                    <input type="hidden" name="localDate" value={currentLocalDate} />

                    <ProjectMissionBrief
                      position={activeMilestone.position}
                      title={activeMilestone.title}
                      task={activeMilestone.task}
                      codePrompt={activeMilestone.codePrompt}
                      status={activeMilestone.status}
                    />
                    <MissionCompletionCriteria />

                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_160px]">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">关联 lessonId（可选）</span>
                        <Input
                          name="lessonId"
                          className={projectMilestoneInputClassName}
                          defaultValue={activeMilestone.lessonId ?? ""}
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">关联 noteId（可选）</span>
                        <Input
                          name="noteId"
                          className={projectMilestoneInputClassName}
                          defaultValue={activeMilestone.noteId ?? ""}
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">代码语言</span>
                        <Input
                          name="language"
                          className={projectMilestoneInputClassName}
                          defaultValue="python"
                        />
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium">代码产物</span>
                      <Textarea
                        name="code"
                        className="min-h-48 font-mono text-xs"
                        defaultValue={activeMilestone.code ?? ""}
                        placeholder="# 这里保存代码，不在服务端执行"
                      />
                    </label>
                    <div className="grid gap-3 lg:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">笔记</span>
                        <Textarea
                          name="note"
                          className="min-h-28"
                          defaultValue={activeMilestone.note ?? ""}
                          placeholder="实现思路、测试用例、边界条件..."
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">反思</span>
                        <Textarea
                          name="reflection"
                          className="min-h-28"
                          defaultValue={activeMilestone.reflection ?? ""}
                          placeholder={activeMilestone.reflectionPrompt}
                        />
                      </label>
                    </div>

                    <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
                      <LearningCTAGroup className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
                        <Button type="submit" className="min-h-11 w-full sm:w-auto">
                          完成里程碑
                        </Button>
                        <Button
                          formAction={saveMilestoneDraftAction}
                          type="submit"
                          variant="secondary"
                          className="min-h-11 w-full sm:w-auto"
                        >
                          保存草稿
                        </Button>
                        <Button
                          formAction={reviewMilestoneCodeAction}
                          type="submit"
                          variant="outline"
                          className="min-h-11 w-full sm:w-auto"
                        >
                          保存并评审代码
                        </Button>
                      </LearningCTAGroup>
                      {activeMilestone.codeSubmissionId ? (
                        <LearningStatusBadge tone="info">
                          代码反馈 {activeMilestone.codeSubmissionId.slice(0, 8)}
                        </LearningStatusBadge>
                      ) : null}
                    </div>

                    {activeMilestoneFeedback ? (
                      <div className="rounded-lg border bg-card px-3 py-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">代码反馈</div>
                          <LearningStatusBadge tone="info">
                            {formatHomeCodeFeedbackOverallLabel(activeMilestoneFeedback.feedback.overall) ?? "已评审"}
                          </LearningStatusBadge>
                        </div>
                        <div className="mt-2 text-muted-foreground">
                          {activeMilestoneFeedback.feedback.summary}
                        </div>
                        {activeMilestoneFeedback.feedback.issues.length ? (
                          <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                            {activeMilestoneFeedback.feedback.issues.slice(0, 3).map((issue) => (
                              <li key={`${issue.type}-${issue.message}`}>
                                {formatCodeFeedbackIssueSeverityLabel(issue.severity)} /{" "}
                                {formatCodeFeedbackIssueTypeLabel(issue.type)}：{issue.message}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ) : null}
                  </form>
                ) : (
                  <div className="rounded-lg border bg-emerald-50/50 p-4 text-sm text-emerald-800">
                    所有里程碑已完成。可以生成项目总结并进入项目卡片复习。
                  </div>
                )}
              </LearningSectionCard>

              <div className="grid content-start gap-4">
                <LearningSectionCard title="复习队列" description="项目实践产出的卡片会进入主动回忆。">
                  <ProjectReviewQueuePanel
                    codeDue={selectedCodeFeedbackCards?.due ?? 0}
                    codeTotal={selectedCodeFeedbackCards?.total ?? 0}
                    codeHref={selectedCodeFeedbackCards?.reviewHref}
                    projectDue={selectedReviewCards?.due ?? 0}
                    projectTotal={selectedReviewCards?.total ?? 0}
                    projectHref={selectedReviewCards?.reviewHref}
                  />
                </LearningSectionCard>

                <LearningSectionCard title="项目复盘" description="完成所有里程碑后生成总结和项目卡。">
                  {selectedProject.summary ? (
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <LearningStatusBadge tone="success">已总结</LearningStatusBadge>
                        <LearningStatusBadge tone="neutral">
                          {selectedReviewCards?.total ?? 0} 张项目卡片
                        </LearningStatusBadge>
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {selectedProject.summary}
                      </div>
                      <Button asChild size="sm" className="min-h-11 w-full sm:w-auto">
                        <Link href={selectedReviewCards?.reviewHref ?? "/review"}>复习项目卡片</Link>
                      </Button>
                    </div>
                  ) : (
                    <form action={completeProjectAction} className="grid gap-3">
                      <input type="hidden" name="projectId" value={selectedProject.id} />
                      <div className="text-sm text-muted-foreground">
                        已完成 {selectedProgress.completed} / {selectedProgress.total} 个里程碑。
                      </div>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={!selectedProgress.isComplete}
                            variant={selectedProgress.isComplete ? "default" : "secondary"}
                            className="min-h-11 w-full sm:w-auto"
                          >
                        生成项目总结
                      </Button>
                    </form>
                  )}
                </LearningSectionCard>
              </div>
            </div>

            <LearningSectionCard title="里程碑路线" description="按顺序推进，每一步都沉淀代码、反思和反馈。">
              <ProjectMilestonePath items={milestonePathItems} />
            </LearningSectionCard>
          </main>
        ) : (
          <LearningSectionCard title="选择一个项目" description="从模板开始后，这里会显示任务工作台。">
            <div className="text-sm text-muted-foreground">
              从左侧模板开始一个项目后，这里会显示里程碑、代码提交区和项目总结。
            </div>
          </LearningSectionCard>
        )}
      </div>

      <div className="mt-4">
        <LearningSectionCard
          title="项目作品集"
          description="已完成项目会沉淀为总结、代码片段、相关知识和复习卡片。"
          action={
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
            >
              <Link href="/projects/portfolio">打开作品集</Link>
            </Button>
          }
        >
          <ProjectPortfolioPanel items={portfolioItems} />
        </LearningSectionCard>
      </div>
    </AppShell>
  );
}
