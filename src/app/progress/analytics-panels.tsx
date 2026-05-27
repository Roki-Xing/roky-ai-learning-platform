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
} from "@/server/analytics/progress";

export type QualityRow = {
  id: string;
  title: string;
  localDate: string;
  status: string;
  score: number;
  metrics: ContentQualityMetrics;
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
}) {
  const latestQuality = props.qualityRows[0] ?? null;

  return (
    <div className="mb-4 grid gap-4 xl:grid-cols-3">
      <Card className="rounded-lg xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">学习日历</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="grid grid-cols-7 gap-1">
            {props.calendarDays.map((day) => (
              <div
                key={day.localDate}
                title={`${day.localDate} / ${day.status}`}
                className={`h-8 rounded-md ${calendarClass(day)}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>绿色：completed</span>
            <span>蓝色：planned</span>
            <span>灰色：none</span>
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
                <div>代码练习：{latestQuality.metrics.codingExerciseQuality}</div>
                <div>来源：{latestQuality.metrics.source ?? "unknown"}</div>
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
                    high {row.highIssueCount}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>反馈 {row.feedbackCount}</span>
                  <span>问题 {row.issueCount}</span>
                  <span>中 {row.mediumIssueCount}</span>
                  <span>低 {row.lowIssueCount}</span>
                  {row.topIssueType ? <span>高频 {row.topIssueType}</span> : null}
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
                    open {row.active}
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
                className="rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"
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
            label="DeepSeek / fallback"
            value={`${props.generationHealth.deepseekPlanCount}/${props.generationHealth.fallbackPlanCount}`}
            note={`fallback ${pct(props.generationHealth.fallbackRate)}`}
          />
          <Metric
            label="生成 job"
            value={`${props.generationHealth.successJobCount}/${props.generationHealth.failedJobCount}`}
            note={`success/error，repair ${pct(props.generationHealth.repairRate)}`}
          />
          <div className="flex flex-wrap gap-2">
            {props.generationHealth.schemaVersionDistribution.slice(0, 4).map((row) => (
              <Badge key={row.schemaVersion} variant="outline">
                schema {row.schemaVersion}: {row.count}
              </Badge>
            ))}
            {props.generationHealth.modelDistribution.slice(0, 3).map((row) => (
              <Badge key={row.model} variant="secondary">
                {row.model}: {row.count}
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
