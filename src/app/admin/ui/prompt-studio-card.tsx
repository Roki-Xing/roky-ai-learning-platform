import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminPromptStudioExample,
  AdminPromptStudioFallbackExample,
  AdminPromptStudioSummary,
} from "@/server/admin/prompt-studio";

const promptStudioCtaClassName = "min-h-11 w-full sm:w-auto";
const promptStudioInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none";

function formatPromptStudioJobStatusLabel(status: string) {
  if (status === "success") return "成功";
  if (status === "failed") return "失败";
  if (status === "error") return "错误";
  return status;
}

function formatPromptStudioJobTypeLabel(type: string) {
  if (type === "daily_plan") return "每日计划";
  if (type === "cron_daily_plan") return "Cron 计划";
  if (type === "admin_loop_check") return "闭环检查";
  return type;
}

function formatPromptStudioSchemaVersionLabel(schemaVersion: string | null | undefined) {
  return `Schema 版本：${schemaVersion ?? "未标记"}`;
}

function formatPromptStudioFallbackReasonLabel(
  reason: AdminPromptStudioFallbackExample["reasons"][number],
) {
  if (reason === "fallback") return "兜底生成";
  if (reason === "repair") return "JSON 修复";
  if (reason === "rawPrimary") return "原始输出";
  return "质量警告";
}

function formatManualRepairStatusLabel(status: AdminPromptStudioSummary["manualRepair"]["status"]) {
  if (status === "ready") return "可测试";
  return "等待样例";
}

function formatManualRepairNote(note: string) {
  return note
    .replaceAll("rawPrimary", "原始输出")
    .replaceAll("repair prompt", "修复提示")
    .replaceAll("fallback", "兜底")
    .replaceAll("repair", "修复");
}

function ExampleRow({
  item,
  reasons,
}: {
  item: AdminPromptStudioExample;
  reasons?: AdminPromptStudioFallbackExample["reasons"];
}) {
  return (
    <div className="rounded-md border px-3 py-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono">{item.id}</span>
        <Badge variant={item.status === "success" ? "outline" : "destructive"}>
          {formatPromptStudioJobStatusLabel(item.status)}
        </Badge>
      </div>
      <div className="mt-1 text-muted-foreground">
        {formatPromptStudioJobTypeLabel(item.type)} / {item.localDate ?? "-"} / {formatPromptStudioSchemaVersionLabel(item.schemaVersion)}
        {item.model ? ` / ${item.model}` : ""}
      </div>
      {reasons?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {reasons.map((reason) => (
            <Badge key={reason} variant="outline">
              {formatPromptStudioFallbackReasonLabel(reason)}
            </Badge>
          ))}
        </div>
      ) : null}
      {item.error ? (
        <div className="mt-1 text-destructive">{item.error}</div>
      ) : null}
    </div>
  );
}

export function PromptStudioCard({
  summary,
  defaultLocalDate,
  authed,
  regenerateAction,
}: {
  summary: AdminPromptStudioSummary;
  defaultLocalDate: string;
  authed: boolean;
  regenerateAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Prompt Studio</CardTitle>
          <Badge variant={summary.schemaDriftCount ? "destructive" : "secondary"}>
            {formatPromptStudioSchemaVersionLabel(summary.currentSchemaVersion)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            Prompt 版本：
            <span className="ml-1 font-mono">{summary.promptVersion}</span>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            Schema 版本：
            <span className="ml-1 font-mono">{summary.currentSchemaVersion}</span>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            最新生成 schema：
            <span className="ml-1 font-mono">{summary.latestJobSchemaVersion ?? "-"}</span>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2">
            漂移数量：
            <span className="ml-1 font-mono">{summary.schemaDriftCount}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {summary.schemaVersionCounts.map((item) => (
            <Badge key={item.schemaVersion} variant="outline">
              {formatPromptStudioSchemaVersionLabel(item.schemaVersion)} x{item.count}
            </Badge>
          ))}
        </div>

        <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-foreground">手动修复测试</span>
            <Badge variant={summary.manualRepair.status === "ready" ? "secondary" : "outline"}>
              {formatManualRepairStatusLabel(summary.manualRepair.status)}
            </Badge>
          </div>
          <div className="mt-1 text-muted-foreground">
            样例：<span className="font-mono">{summary.manualRepair.sampleJobId ?? "-"}</span>
          </div>
          <div className="mt-1 text-muted-foreground">
            {formatManualRepairNote(summary.manualRepair.note)}
          </div>
        </div>

        <form action={regenerateAction} className="grid gap-2">
          <input
            name="localDate"
            className={promptStudioInputClassName}
            defaultValue={defaultLocalDate}
            placeholder="YYYY-MM-DD"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className={promptStudioCtaClassName}
            disabled={!authed}
          >
            重新生成某日期计划（测试）
          </Button>
        </form>

        <div className="grid gap-2">
          <div className="text-xs font-medium text-foreground">最近失败样例</div>
          {summary.failedExamples.length ? (
            summary.failedExamples.map((item) => <ExampleRow key={item.id} item={item} />)
          ) : (
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              暂无失败样例。
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <div className="text-xs font-medium text-foreground">最近兜底 / 修复样例</div>
          {summary.fallbackExamples.length ? (
            summary.fallbackExamples.map((item) => (
              <ExampleRow key={item.id} item={item} reasons={item.reasons} />
            ))
          ) : (
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              暂无兜底 / 修复样例。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
