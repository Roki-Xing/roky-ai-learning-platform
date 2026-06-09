import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import {
  getWeeklyReviewData,
  weeklyCodeIssueTypeLabel,
  weeklyMistakeSourceLabel,
} from "@/server/learning/weekly";

const weeklyNextStepLinkClassName = "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted/40";
const weeklyMistakeRepairLinkClassName = "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted/40";

function pct(value: number) {
  return `${value}%`;
}

export default async function WeeklyPage() {
  const userId = await requireUserId();
  const weekly = await getWeeklyReviewData(userId);

  return (
    <AppShell activePath="/weekly" title="每周复盘">
      <PageHeader
        title="每周复盘"
        subtitle="把这一周真正学过什么、哪里最强、哪里最弱、错在什么地方，以及下周该怎么补弱，放到同一页里。"
        badge="每周复盘"
      />

      <div className="grid gap-4">
        <CurrentMissionCard
          mission={weekly.mission}
          signals={weekly.missionSignals}
          progress={weekly.missionProgress}
          title="当前任务"
        />

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">本周窗口</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{weekly.windowLabel}</Badge>
            <span>这页只用真实学习数据生成，不是静态模板。</span>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">7 天总览</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">学习天数</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.studyDays} 天</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">完成课程</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.completedLessons}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">复习卡片</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.reviewedCards}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">小测验正确率</div>
              <div className="mt-1 text-lg font-semibold">{pct(weekly.weeklyOverview.quizAccuracy)}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">代码提交</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.codeSubmissions}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">语音笔记</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.voiceNotes}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">Coach 次数</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.coachReviews}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">项目里程碑</div>
              <div className="mt-1 text-lg font-semibold">
                {weekly.weeklyOverview.completedProjectMilestones}
              </div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">新增误区</div>
              <div className="mt-1 text-lg font-semibold">{weekly.weeklyOverview.newMisconceptions}</div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-xs text-muted-foreground">已解决误区</div>
              <div className="mt-1 text-lg font-semibold">
                {weekly.weeklyOverview.resolvedMisconceptions}
              </div>
            </div>
            <div className="rounded-md border px-3 py-3 sm:col-span-2">
              <div className="text-xs text-muted-foreground">术语/Radar 覆盖</div>
              <div className="mt-1 text-lg font-semibold">
                术语 {weekly.weeklyOverview.glossaryReviewed} / Radar {weekly.weeklyOverview.radarReviewed}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">本周学了什么</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="text-2xl font-semibold">{weekly.lessons.length}</div>
              <div className="text-muted-foreground">已完成课程</div>
              <div className="grid gap-2">
                {weekly.lessons.length ? (
                  weekly.lessons.slice(0, 4).map((lesson) => (
                    <div key={`${lesson.localDate}:${lesson.lessonTitle}`} className="rounded-md border px-3 py-2">
                      <div className="font-medium">{lesson.lessonTitle}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {lesson.localDate} / {lesson.domainLabel}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">这周还没有完成正式课程。</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最强领域</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {weekly.strongestDomain ? (
                <>
                  <LearningStatusBadge tone="success">最强</LearningStatusBadge>
                  <div className="text-xl font-semibold">{weekly.strongestDomain.label}</div>
                  <div className="leading-6 text-muted-foreground">
                    {weekly.strongestDomain.summary}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">这周还没有足够的主课数据来判断强项。</div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最弱领域</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {weekly.weakestDomain ? (
                <>
                  <LearningStatusBadge tone="warning">待补强</LearningStatusBadge>
                  <div className="text-xl font-semibold">{weekly.weakestDomain.label}</div>
                  <div className="leading-6 text-muted-foreground">
                    {weekly.weakestDomain.reason}
                  </div>
                  <div className="grid gap-1 text-xs text-muted-foreground">
                    <div>掌握分：{weekly.weakestDomain.masteryScore}</div>
                    <div>薄弱分：{weekly.weakestDomain.weaknessScore}</div>
                    <div>测验正确率：{weekly.weakestDomain.quizAccuracy}%</div>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">这周暂时没有明显弱项。</div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">本周最值得修复的 3 个误区</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              {weekly.mistakeRepairQueue.length ? (
                weekly.mistakeRepairQueue.map((mistake, index) => (
                  <a
                    key={mistake.id}
                    href={mistake.href}
                    className={weeklyMistakeRepairLinkClassName}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <LearningStatusBadge tone="danger">
                        {weeklyMistakeSourceLabel(mistake.source)}
                      </LearningStatusBadge>
                      <Badge variant="outline">第 {index + 1} 条</Badge>
                    </div>
                    <div className="mt-2 font-semibold leading-6">{mistake.summary}</div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">
                      出现次数：{mistake.occurrenceCount}
                    </div>
                    <div className="text-xs leading-5 text-muted-foreground">
                      关联课程：{mistake.lessonTitle ?? "未关联课程"}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-muted-foreground">这周还没有需要优先修复的误区。</div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">代码练习情况</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="grid gap-1 text-muted-foreground">
                <div>提交次数：{weekly.codePractice.submissionCount}</div>
                <div>反馈条数：{weekly.codePractice.feedbackCount}</div>
                <div>问题数：{weekly.codePractice.issueCount}</div>
                <div>高频问题：{weeklyCodeIssueTypeLabel(weekly.codePractice.topIssueType)}</div>
              </div>
              {weekly.codePractice.latestFeedbackSummary ? (
                <div className="rounded-md border px-3 py-2 text-xs leading-5 text-muted-foreground">
                  最近反馈：{weekly.codePractice.latestFeedbackSummary}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">复习保持情况</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">留存率</span>
                <Badge variant={weekly.reviewRetention.retentionRate >= 70 ? "secondary" : "outline"}>
                  {pct(weekly.reviewRetention.retentionRate)}
                </Badge>
              </div>
              <LearningProgressBar
                value={weekly.reviewRetention.retentionRate / 100}
                label="复习留存率"
              />
              <div className="grid gap-1 text-xs text-muted-foreground">
                <div>本周复习：{weekly.reviewRetention.reviewedCount}</div>
                <div>记住：{weekly.reviewRetention.retainedCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI 周总结</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border px-3 py-3">
              <div className="text-sm font-medium">本周最重要收获</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {weekly.aiSummary.mostImportantGain}
              </div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-sm font-medium">主要薄弱点</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {weekly.aiSummary.mainWeakness}
              </div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-sm font-medium">下周建议</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {weekly.aiSummary.nextWeekSuggestion}
              </div>
            </div>
            <div className="rounded-md border px-3 py-3">
              <div className="text-sm font-medium">推荐下一阶段</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {weekly.aiSummary.recommendedNextStage}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">下周建议</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <div className="text-lg font-semibold">{weekly.nextWeekPlan.title}</div>
              <div className="text-sm leading-6 text-muted-foreground">
                {weekly.nextWeekPlan.summary}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {weekly.nextWeekPlan.steps.map((step, index) => (
                <a
                  key={`${step.href}:${index}`}
                  href={step.href}
                  className={weeklyNextStepLinkClassName}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{step.title}</div>
                    <Badge variant={step.tone === "success" ? "secondary" : "outline"}>
                      第 {index + 1} 步
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    {step.description}
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">导出 Weekly Markdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="text-sm leading-6 text-muted-foreground">
              复制到笔记或学习档案，保留 7 天总览、AI 周总结和下周建议。
            </div>
            <Textarea
              readOnly
              aria-label="导出 Weekly Markdown 周报"
              className="min-h-72 resize-y bg-background font-mono text-xs"
              value={weekly.weeklyReportMarkdown}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
