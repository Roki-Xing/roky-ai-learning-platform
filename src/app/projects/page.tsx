import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import {
  DEFAULT_PROJECT_TEMPLATES,
  PROJECT_TYPE_LABELS,
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
import {
  completeMilestoneAction,
  completeProjectAction,
  reviewMilestoneCodeAction,
  saveMilestoneDraftAction,
  startProjectAction,
} from "@/app/projects/actions";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningCTAGroup } from "@/components/learning/learning-cta-group";

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function projectTypeHref(type?: string) {
  return type ? `/projects?type=${encodeURIComponent(type)}` : "/projects";
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; projectId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });
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

  return (
    <AppShell
      activePath="/projects"
      title="项目实践"
      actions={
        <Button asChild size="sm" variant="secondary">
          <Link href="/progress">看进度</Link>
        </Button>
      }
    >
      <PageHeader
        title="项目实践"
        subtitle="把每日学习推进到可保存的 Python、算法、RAG、Agent 与复现小项目"
        badge="Mission"
      />

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">项目类型</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge asChild variant={selectedType ? "outline" : "secondary"}>
                <Link href="/projects">全部</Link>
              </Badge>
              {typeEntries.map(([type, label]) => (
                <Badge
                  key={type}
                  asChild
                  variant={selectedType === type ? "secondary" : "outline"}
                >
                  <Link href={projectTypeHref(type)}>{label}</Link>
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">项目模板</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {templates.map((template) => {
                const existing = projects.find((project) => project.templateSlug === template.slug);
                return (
                  <div key={template.slug} className="rounded-md border px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium">{template.title}</div>
                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                      <Badge variant="outline">{template.difficulty}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{PROJECT_TYPE_LABELS[template.type]}</span>
                      <span>{template.estimatedHours}h</span>
                      <span>{template.milestones.length} milestones</span>
                    </div>
                    <div className="mt-3">
                      {existing ? (
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/projects?projectId=${encodeURIComponent(existing.id)}`}>
                            打开项目
                          </Link>
                        </Button>
                      ) : (
                        <form action={startProjectAction}>
                          <input type="hidden" name="templateSlug" value={template.slug} />
                          <Button type="submit" size="sm">开始项目</Button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">我的项目</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border px-3 py-2">
                  <div className="text-xl font-semibold tabular-nums">{activeProjectCount}</div>
                  <div className="text-xs text-muted-foreground">进行中</div>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <div className="text-xl font-semibold tabular-nums">{completedProjectCount}</div>
                  <div className="text-xs text-muted-foreground">已完成</div>
                </div>
              </div>

              {projects.length ? (
                projects.map((project) => {
                  const progress = calculateProjectProgress(project.milestones);
                  const active = selectedProject?.id === project.id;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects?projectId=${encodeURIComponent(project.id)}`}
                      className={[
                        "rounded-md border px-3 py-2 text-sm transition-colors",
                        active ? "bg-muted" : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 truncate font-medium">{project.title}</div>
                        <Badge variant={project.status === "completed" ? "secondary" : "outline"}>
                          {progress.percent}%
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {PROJECT_TYPE_LABELS[normalizeProjectType(project.type)]} / {project.status}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">还没有项目。先从模板开始一个。</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {selectedProject && selectedProgress ? (
            <>
              <LearningSectionCard
                title="项目概览"
                description="你在做什么，以及离完成还有多远。"
                action={
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/review">去复习</Link>
                  </Button>
                }
              >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold">{selectedProject.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {selectedProject.description}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <LearningStatusBadge tone="neutral">
                        {PROJECT_TYPE_LABELS[normalizeProjectType(selectedProject.type)]}
                      </LearningStatusBadge>
                      <LearningStatusBadge
                        tone={selectedProject.status === "completed" ? "success" : "info"}
                      >
                        {selectedProject.status}
                      </LearningStatusBadge>
                      <LearningStatusBadge tone="neutral">{selectedProgress.percent}%</LearningStatusBadge>
                    </div>
                  </div>

                  <LearningProgressBar value={selectedProgress.percent / 100} />

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-md border px-3 py-2 text-sm">
                      <div className="text-xl font-semibold tabular-nums">{selectedProgress.total}</div>
                      <div className="text-xs text-muted-foreground">里程碑</div>
                    </div>
                    <div className="rounded-md border px-3 py-2 text-sm">
                      <div className="text-xl font-semibold tabular-nums">{selectedProgress.completed}</div>
                      <div className="text-xs text-muted-foreground">已完成</div>
                    </div>
                    <div className="rounded-md border px-3 py-2 text-sm">
                      <div className="text-xl font-semibold tabular-nums">{selectedProgress.remaining}</div>
                      <div className="text-xs text-muted-foreground">剩余</div>
                    </div>
                    <div className="rounded-md border px-3 py-2 text-sm">
                      <div className="text-xl font-semibold tabular-nums">{strings(selectedProject.relatedTopics).length}</div>
                      <div className="text-xs text-muted-foreground">主题</div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">代码反馈卡片</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          当前项目里程碑代码评审生成的复习卡片
                        </div>
                      </div>
                      <Badge variant={selectedCodeFeedbackCards?.due ? "secondary" : "outline"}>
                        到期 {selectedCodeFeedbackCards?.due ?? 0} / 总计 {selectedCodeFeedbackCards?.total ?? 0}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={selectedCodeFeedbackCards?.reviewHref ?? "/review"}>
                          去复习代码反馈卡片
                        </Link>
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        只会进入当前项目 linked submission 的代码反馈卡片队列
                      </span>
                    </div>
                  </div>

                  {selectedProject.summary ? (
                    <div className="rounded-md border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-medium">项目总结</div>
                        {selectedReviewCards?.total ? (
                          <Badge variant="secondary">
                            {selectedReviewCards.total} 张项目卡片
                          </Badge>
                        ) : null}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {selectedProject.summary}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button asChild size="sm">
                          <Link href={selectedReviewCards?.reviewHref ?? "/review"}>
                            去复习项目卡片
                          </Link>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          当前到期 {selectedReviewCards?.due ?? 0} 张
                        </span>
                      </div>
                    </div>
                  ) : (
                    <form action={completeProjectAction}>
                      <input type="hidden" name="projectId" value={selectedProject.id} />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!selectedProgress.isComplete}
                        variant={selectedProgress.isComplete ? "default" : "secondary"}
                      >
                        生成项目总结
                      </Button>
                    </form>
                  )}
              </LearningSectionCard>

              <LearningSectionCard
                title="今日项目任务"
                description="今天只做这一小步。保存草稿 -> 评审 -> 完成。"
                action={
                  activeMilestone ? (
                    <LearningStatusBadge tone={activeMilestone.status === "completed" ? "success" : "warning"}>
                      {activeMilestone.status}
                    </LearningStatusBadge>
                  ) : (
                    <LearningStatusBadge tone="success">all done</LearningStatusBadge>
                  )
                }
              >
                  {activeMilestone ? (
                    <form action={completeMilestoneAction} className="grid gap-3">
                      <input type="hidden" name="projectId" value={selectedProject.id} />
                      <input type="hidden" name="milestoneId" value={activeMilestone.id} />
                      <input
                        type="hidden"
                        name="localDate"
                        value={currentLocalDate}
                      />
                      <div className="rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">
                            {activeMilestone.position}. {activeMilestone.title}
                          </div>
                          <Badge variant="outline">{activeMilestone.status}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">{activeMilestone.task}</div>
                        <div className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">
                          {activeMilestone.codePrompt}
                        </div>
                      </div>

                      <div className="rounded-md border bg-muted/20 p-3 text-sm">
                        <div className="text-sm font-medium">完成条件</div>
                        <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
                          <li>代码与思路已保存（允许未完全正确）</li>
                          <li>至少写出 1 个边界/测试用例</li>
                          <li>有需要时先点“保存并评审代码”，再修正一次</li>
                        </ul>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <div className="text-sm font-medium">关联 lessonId（可选）</div>
                          <Input name="lessonId" defaultValue={activeMilestone.lessonId ?? ""} />
                        </div>
                        <div className="grid gap-2">
                          <div className="text-sm font-medium">关联 noteId（可选）</div>
                          <Input name="noteId" defaultValue={activeMilestone.noteId ?? ""} />
                        </div>
                      </div>

                      <div className="grid gap-2 sm:max-w-xs">
                        <div className="text-sm font-medium">代码语言</div>
                        <Input name="language" defaultValue="python" />
                      </div>

                      <div className="grid gap-2">
                        <div className="text-sm font-medium">代码产物</div>
                        <Textarea
                          name="code"
                          className="min-h-44 font-mono text-xs"
                          defaultValue={activeMilestone.code ?? ""}
                          placeholder="# 这里保存代码，不在服务端执行"
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm font-medium">笔记</div>
                        <Textarea
                          name="note"
                          className="min-h-24"
                          defaultValue={activeMilestone.note ?? ""}
                          placeholder="实现思路、测试用例、边界条件..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="text-sm font-medium">反思</div>
                        <Textarea
                          name="reflection"
                          className="min-h-24"
                          defaultValue={activeMilestone.reflection ?? ""}
                          placeholder={activeMilestone.reflectionPrompt}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <LearningCTAGroup>
                          <Button type="submit">完成里程碑</Button>
                          <Button formAction={saveMilestoneDraftAction} type="submit" variant="secondary">
                            保存草稿
                          </Button>
                          <Button formAction={reviewMilestoneCodeAction} type="submit" variant="outline">
                            保存并评审代码
                          </Button>
                        </LearningCTAGroup>
                        {activeMilestone.codeSubmissionId ? (
                          <LearningStatusBadge tone="info">
                            feedback {activeMilestone.codeSubmissionId.slice(0, 8)}
                          </LearningStatusBadge>
                        ) : null}
                      </div>
                      {activeMilestoneFeedback ? (
                        <div className="rounded-md border px-3 py-2 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-medium">代码反馈</div>
                            <Badge variant="outline">
                              {activeMilestoneFeedback.feedback.overall ?? "reviewed"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-muted-foreground">
                            {activeMilestoneFeedback.feedback.summary}
                          </div>
                          {activeMilestoneFeedback.feedback.issues.length ? (
                            <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                              {activeMilestoneFeedback.feedback.issues.slice(0, 2).map((issue) => (
                                <li key={`${issue.type}-${issue.message}`}>
                                  {issue.severity} / {issue.type}: {issue.message}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </form>
                  ) : (
                    <div className="text-sm text-muted-foreground">所有里程碑已完成。</div>
                  )}
              </LearningSectionCard>

              <Card className="rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">里程碑</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {selectedProject.milestones.map((milestone) => {
                    const milestoneFeedback = feedbackByMilestoneId.get(milestone.id);
                    return (
                      <div key={milestone.id} className="rounded-md border px-3 py-2 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">
                            {milestone.position}. {milestone.title}
                          </div>
                          <Badge variant={milestone.status === "completed" ? "secondary" : "outline"}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{milestone.task}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {milestone.lessonId ? <span>lesson {milestone.lessonId.slice(0, 8)}</span> : null}
                          {milestone.noteId ? <span>note {milestone.noteId.slice(0, 8)}</span> : null}
                          {milestone.codeSubmissionId ? (
                            <span>code feedback {milestone.codeSubmissionId.slice(0, 8)}</span>
                          ) : null}
                          {milestone.code ? <span>code saved</span> : null}
                          {milestone.reflection ? <span>reflection saved</span> : null}
                        </div>
                        {milestoneFeedback ? (
                          <div className="mt-2 rounded-md bg-muted px-3 py-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-medium">AI code review</span>
                              <Badge variant="outline">
                                {milestoneFeedback.feedback.overall ?? "reviewed"}
                              </Badge>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {milestoneFeedback.feedback.summary}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">选择一个项目</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                从左侧模板开始一个项目后，这里会显示里程碑、代码提交区和项目总结。
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
