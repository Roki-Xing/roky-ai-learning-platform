import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CalendarDay,
  CodeFeedbackIssueTrendRow,
  ContentQualityMetrics,
  GenerationHealthMetrics,
  LearningEffectMetrics,
  MisconceptionTrendRow,
  ProgressWeakDomainSummary,
  QuizAccuracyTrendRow,
  ReviewRetentionTrendRow,
  WeeklyRemediationPlan,
} from "@/server/analytics/progress";

export type QualityRow = {
  id: string;
  title: string;
  localDate: string;
  status: string;
  score: number;
  metrics: ContentQualityMetrics;
  warnings: string[];
};

export type CodeTrendRow = {
  localDate: string;
  submissions: number;
};

export type KnowledgeCoverageSummary = {
  glossaryCoveragePct: number;
  radarCoveragePct: number;
  glossaryTotal: number;
  glossaryReviewed: number;
  radarTotal: number;
  radarReviewed: number;
};

function pct(value: number) {
  return `${value}%`;
}

function calendarClass(day: CalendarDay) {
  if (day.status === "completed") return "bg-emerald-500";
  if (day.status === "planned") return "bg-sky-400";
  return "bg-muted";
}

function calendarStatusLabel(status: CalendarDay["status"]) {
  if (status === "completed") return "已完成学习";
  if (status === "planned") return "已安排学习";
  return "暂无学习记录";
}

function codeFeedbackSeverityLabel(severity: string) {
  if (severity === "high") return "高优先级";
  if (severity === "medium") return "中优先级";
  if (severity === "low") return "低优先级";
  return "待判断";
}

function codeFeedbackIssueTypeLabel(type: string | null | undefined) {
  if (type === "logic") return "逻辑问题";
  if (type === "syntax") return "语法问题";
  if (type === "edge_case") return "边界情况";
  if (type === "complexity") return "复杂度问题";
  if (type === "style") return "代码风格";
  return type ?? "待分类";
}

function contentQualitySourceLabel(source: string | null | undefined) {
  if (source === "deepseek") return "AI 生成";
  if (source === "template") return "模板兜底";
  if (source === "fallback") return "系统兜底";
  if (source === "admin") return "后台重建";
  if (source === "test") return "测试计划";
  if (!source || source === "unknown") return "未标记来源";
  return "其他来源";
}

function contentQualityCodingExerciseLabel(quality: string | null | undefined) {
  if (quality === "strong") return "完整练习";
  if (quality === "basic") return "基础练习";
  if (quality === "missing") return "暂无练习";
  return "待评估";
}

function schemaVersionLabel(version: string | null | undefined) {
  if (!version || version === "unknown") return "未标记";
  return version;
}

function generationModelLabel(model: string | null | undefined) {
  if (model === "deepseek-v4-flash") return "DeepSeek Flash";
  if (model === "deepseek-v4-pro") return "DeepSeek Pro";
  if (!model || model === "unknown") return "未标记";
  return "其他";
}

const progressWeakDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50";

export function Sprint9AnalyticsPanels(props: {
  calendarDays: CalendarDay[];
  qualityRows: QualityRow[];
  learningEffect: LearningEffectMetrics;
  quizAccuracyTrend: QuizAccuracyTrendRow[];
  codeTrend: CodeTrendRow[];
  codeFeedbackIssueTrend: CodeFeedbackIssueTrendRow[];
  misconceptionTrend: MisconceptionTrendRow[];
  weakDomains: ProgressWeakDomainSummary[];
  reviewRetentionTrend: ReviewRetentionTrendRow[];
  knowledgeCoverage: KnowledgeCoverageSummary;
  generationHealth: GenerationHealthMetrics;
  weeklyRemediationPlan: WeeklyRemediationPlan;
}) {
  const latestQuality = props.qualityRows[0] ?? null;

  return (
    <div className="mb-4 grid gap-4 xl:grid-cols-3">
      <Card className="rounded-lg xl:col-span-3">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{props.weeklyRemediationPlan.title}</CardTitle>
              <div className="mt-1 text-sm text-muted-foreground">
                {props.weeklyRemediationPlan.summary}
              </div>
            </div>
            {props.weeklyRemediationPlan.focusDomain ? (
              <Badge variant="outline">
                {props.weeklyRemediationPlan.focusDomain.label}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          {props.weeklyRemediationPlan.steps.map((step, index) => (
            <a
              key={`${step.href}:${index}`}
              href={step.href}
              className="rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
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
        </CardContent>
      </Card>

      <Card className="rounded-lg xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">学习日历</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="grid grid-cols-7 gap-1">
            {props.calendarDays.map((day) => (
              <div
                key={day.localDate}
                role="img"
                aria-label={`${day.localDate}：${calendarStatusLabel(day.status)}`}
                title={`${day.localDate} / ${calendarStatusLabel(day.status)}`}
                className={`h-8 rounded-md ${calendarClass(day)}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>绿色：已完成学习</span>
            <span>蓝色：已安排学习</span>
            <span>灰色：暂无学习记录</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">内容质量</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {latestQuality ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 font-medium">{latestQuality.title}</div>
                <Badge variant="secondary">{latestQuality.score}/100</Badge>
              </div>
              <div className="grid gap-1 text-xs text-muted-foreground">
                <div>内容长度：{latestQuality.metrics.contentLength}</div>
                <div>引导步骤：{latestQuality.metrics.guidedStepCount}</div>
                <div>测验：{latestQuality.metrics.quizCount}</div>
                <div>卡片：{latestQuality.metrics.flashcardCount}</div>
                <div>
                  代码练习：{contentQualityCodingExerciseLabel(latestQuality.metrics.codingExerciseQuality)}
                </div>
                <div>来源：{contentQualitySourceLabel(latestQuality.metrics.source)}</div>
                {latestQuality.warnings.slice(0, 2).map((warning) => (
                  <div key={warning}>警告：{warning}</div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">暂无课程质量数据。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">学习效果</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <Metric label="测验正确率" value={pct(props.learningEffect.quizAccuracy)} />
          <Metric label="复习留存率" value={pct(props.learningEffect.reviewRetention)} />
          <Metric label="代码提交率" value={pct(props.learningEffect.codeSubmissionRate)} />
          <Metric
            label="错题解决率"
            value={pct(props.learningEffect.misconceptionResolutionRate)}
          />
          <Metric label="主题多样性" value={String(props.learningEffect.topicDiversity)} />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">代码练习趋势</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.codeTrend.length ? (
            props.codeTrend.slice(-7).map((row) => (
              <div key={row.localDate} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{row.localDate}</span>
                <Badge variant="outline">{row.submissions}</Badge>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">暂无代码提交趋势。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">代码反馈问题趋势</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.codeFeedbackIssueTrend.length ? (
            props.codeFeedbackIssueTrend.slice(-7).map((row) => (
              <div key={row.localDate} className="grid gap-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{row.localDate}</span>
                  <Badge variant={row.highIssueCount > 0 ? "outline" : "secondary"}>
                    {codeFeedbackSeverityLabel("high")} {row.highIssueCount}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>反馈 {row.feedbackCount}</span>
                  <span>问题 {row.issueCount}</span>
                  <span>{codeFeedbackSeverityLabel("medium")} {row.mediumIssueCount}</span>
                  <span>{codeFeedbackSeverityLabel("low")} {row.lowIssueCount}</span>
                  {row.topIssueType ? (
                    <span>高频 {codeFeedbackIssueTypeLabel(row.topIssueType)}</span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">暂无代码反馈问题趋势。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">测验正确率趋势</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.quizAccuracyTrend.length ? (
            props.quizAccuracyTrend.slice(-7).map((row) => (
              <div key={row.localDate} className="grid gap-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{row.localDate}</span>
                  <Badge variant={row.accuracy >= 70 ? "secondary" : "outline"}>
                    {row.accuracy}%
                  </Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${row.accuracy}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  正确 {row.correct}/{row.attempts}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">暂无测验正确率趋势。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">错题趋势</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.misconceptionTrend.length ? (
            props.misconceptionTrend.slice(-7).map((row) => (
              <div key={row.localDate} className="grid gap-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{row.localDate}</span>
                  <Badge variant={row.active > 0 ? "outline" : "secondary"}>
                    未解决 {row.active}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>新增 {row.total}</span>
                  <span>已解 {row.resolved}</span>
                  {row.ignored ? <span>忽略 {row.ignored}</span> : null}
                  <span>解决率 {row.resolutionRate}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">暂无错题趋势。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">薄弱领域</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.weakDomains.length ? (
            props.weakDomains.slice(0, 4).map((domain) => (
              <a
                key={domain.slug}
                href={`/map?domain=${encodeURIComponent(domain.slug)}`}
                className={progressWeakDomainLinkClassName}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 font-medium">{domain.label}</div>
                  <Badge variant="outline">{domain.weaknessScore}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{domain.reason}</div>
              </a>
            ))
          ) : (
            <div className="text-muted-foreground">暂无明显薄弱领域。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">复习留存趋势</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {props.reviewRetentionTrend.length ? (
            props.reviewRetentionTrend.slice(-7).map((row) => (
              <div key={row.localDate} className="grid gap-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{row.localDate}</span>
                  <Badge variant={row.retentionRate >= 70 ? "secondary" : "outline"}>
                    {row.retentionRate}%
                  </Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${row.retentionRate}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  留存 {row.retained}/{row.reviewed}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">暂无复习留存趋势。</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">知识覆盖</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <Metric
            label="术语覆盖"
            value={`${props.knowledgeCoverage.glossaryReviewed}/${props.knowledgeCoverage.glossaryTotal}`}
            note={pct(props.knowledgeCoverage.glossaryCoveragePct)}
          />
          <Metric
            label="Radar 覆盖"
            value={`${props.knowledgeCoverage.radarReviewed}/${props.knowledgeCoverage.radarTotal}`}
            note={pct(props.knowledgeCoverage.radarCoveragePct)}
          />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">生成稳定性</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <Metric
            label="AI 生成 / 兜底生成"
            value={`${props.generationHealth.deepseekPlanCount}/${props.generationHealth.fallbackPlanCount}`}
            note={`兜底率 ${pct(props.generationHealth.fallbackRate)}`}
          />
          <Metric
            label="生成任务"
            value={`${props.generationHealth.successJobCount}/${props.generationHealth.failedJobCount}`}
            note={`成功/失败，修复率 ${pct(props.generationHealth.repairRate)}`}
          />
          <Metric
            label="最近质量"
            value={`${props.generationHealth.averageQualityScore}/100`}
            note={`覆盖 ${props.generationHealth.qualityScoreCoverage} 个任务，低质量 ${props.generationHealth.lowQualityJobCount}`}
          />
          <div className="flex flex-wrap gap-2">
            {props.generationHealth.schemaVersionDistribution.slice(0, 4).map((row) => (
              <Badge key={row.schemaVersion} variant="outline">
                Schema 版本 {schemaVersionLabel(row.schemaVersion)}：{row.count}
              </Badge>
            ))}
            {props.generationHealth.modelDistribution.slice(0, 3).map((row) => (
              <Badge key={row.model} variant="secondary">
                AI 模型：{generationModelLabel(row.model)}：{row.count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric(props: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
      <div className="min-w-0">
        <div className="font-medium">{props.label}</div>
        {props.note ? (
          <div className="mt-0.5 text-xs text-muted-foreground">{props.note}</div>
        ) : null}
      </div>
      <div className="shrink-0 font-mono text-sm">{props.value}</div>
    </div>
  );
}
