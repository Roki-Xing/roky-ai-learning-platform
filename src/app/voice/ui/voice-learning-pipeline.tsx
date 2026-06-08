import Link from "next/link";
import { FileText, Layers, MessageSquareText, NotebookText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningCTAGroup } from "@/components/learning/learning-cta-group";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningStepCard } from "@/components/learning/learning-step-card";
import { buildVoicePipelineNextAction, type VoicePipelineNextActionTone } from "@/server/voice/pipeline-next-action";

function nextActionPanelClassName(tone: VoicePipelineNextActionTone) {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50/70 text-emerald-950";
    case "warning":
      return "border-amber-200 bg-amber-50/80 text-amber-950";
    case "danger":
      return "border-red-200 bg-red-50/80 text-red-950";
    case "info":
      return "border-indigo-200 bg-indigo-50/70 text-indigo-950";
    case "neutral":
    default:
      return "border-border bg-muted/30 text-foreground";
  }
}

const mobileCtaClassName = "min-h-11 w-full sm:w-auto";

export function VoiceLearningPipeline(props: {
  hasSelected: boolean;
  hasCoach: boolean;
  hasNote: boolean;
  hasCards: boolean;
  linkedCards: number;
  voiceNoteId: string | null;
  reviewId: string | null;
  noteId: string | null;
  sendToCoachAction?: (formData: FormData) => void | Promise<void>;
  saveAsNoteAction?: (formData: FormData) => void | Promise<void>;
  generateFlashcardsAction?: (formData: FormData) => void | Promise<void>;
}) {
  const canUseVoice = props.hasSelected && props.voiceNoteId;
  const canGenerateCards = Boolean(canUseVoice && props.hasCoach);
  const reviewHref = props.hasCards ? "/review?source=voice-note" : "/review";
  const reviewLabel =
    props.hasCards && props.linkedCards > 0
      ? `复习这 ${props.linkedCards} 张语音卡片`
      : "去复习";
  const nextAction = buildVoicePipelineNextAction({
    hasSelected: props.hasSelected,
    hasCoach: props.hasCoach,
    hasNote: props.hasNote,
    hasCards: props.hasCards,
    linkedCards: props.linkedCards,
    reviewId: props.reviewId,
    noteId: props.noteId,
  });

  return (
    <LearningSectionCard
      title="语音学习流水线"
      description="把一段口语理解依次沉淀为 Coach 反馈、笔记和复习卡。"
      action={
        <LearningStatusBadge tone={props.hasCards ? "success" : props.hasSelected ? "info" : "warning"}>
          {props.hasCards ? `${props.linkedCards} 张卡片` : props.hasSelected ? "进行中" : "待捕获"}
        </LearningStatusBadge>
      }
      className="rounded-lg"
    >
      <div className="grid gap-3">
        <div className="grid gap-2 md:grid-cols-4">
          <LearningStepCard
            index={1}
            title="已保存"
            description="先得到 transcript"
            status={props.hasSelected ? "done" : "active"}
          />
          <LearningStepCard
            index={2}
            title="Coach 检查"
            description="检查概念混淆"
            status={props.hasCoach ? "done" : props.hasSelected ? "active" : "todo"}
          />
          <LearningStepCard
            index={3}
            title="整理笔记"
            description="整理成笔记"
            status={props.hasNote ? "done" : props.hasSelected ? "active" : "todo"}
          />
          <LearningStepCard
            index={4}
            title="复习卡片"
            description="进入复习队列"
            status={props.hasCards ? "done" : props.hasCoach ? "active" : "todo"}
          />
        </div>

        <div className={`rounded-lg border p-3 ${nextActionPanelClassName(nextAction.tone)}`}>
          <div className="text-xs font-medium uppercase tracking-wide opacity-75">当前最优动作</div>
          <div className="mt-1 grid gap-3 sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="font-medium">{nextAction.label}</div>
              <div className="mt-1 text-xs opacity-80">{nextAction.description}</div>
            </div>
            {nextAction.href ? (
              <Button
                asChild
                size="sm"
                variant={nextAction.tone === "success" ? "default" : "outline"}
                className={mobileCtaClassName}
              >
                <Link href={nextAction.href}>{nextAction.primaryButtonLabel}</Link>
              </Button>
            ) : (
              <LearningStatusBadge tone={nextAction.tone === "danger" ? "warning" : nextAction.tone}>
                {nextAction.primaryButtonLabel}
              </LearningStatusBadge>
            )}
          </div>
        </div>

        {props.hasCards ? (
          <div className="rounded-lg border bg-emerald-50/60 p-3 text-sm text-emerald-900">
            <div className="font-medium">语音卡片已进入复习队列</div>
            <div className="mt-1 text-xs text-emerald-800">
              这次语音笔记生成了 {props.linkedCards} 张卡片，建议马上用主动回忆过一遍。
            </div>
          </div>
        ) : null}

        <LearningCTAGroup className="grid gap-2 sm:flex sm:flex-wrap">
          <form action={props.sendToCoachAction} className="grid">
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button
              type="submit"
              size="sm"
              disabled={!canUseVoice || props.hasCoach}
              className={mobileCtaClassName}
            >
              <MessageSquareText className="size-4" />
              {props.hasCoach ? "已送 Coach" : "送 Coach 检查"}
            </Button>
          </form>

          <form action={props.saveAsNoteAction} className="grid">
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={!canUseVoice || props.hasNote}
              className={mobileCtaClassName}
            >
              <NotebookText className="size-4" />
              {props.hasNote ? "已整理成笔记" : "整理成笔记"}
            </Button>
          </form>

          <form action={props.generateFlashcardsAction} className="grid">
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={!canGenerateCards || props.hasCards}
              className={mobileCtaClassName}
            >
              <Layers className="size-4" />
              {props.hasCards ? "已生成复习卡片" : "生成复习卡片"}
            </Button>
          </form>

          {props.reviewId ? (
            <Button asChild size="sm" variant="outline" className={mobileCtaClassName}>
              <Link href={`/coach?reviewId=${encodeURIComponent(props.reviewId)}`}>
                <MessageSquareText className="size-4" />
                查看 Coach
              </Link>
            </Button>
          ) : null}

          {props.noteId ? (
            <Button asChild size="sm" variant="outline" className={mobileCtaClassName}>
              <Link href={`/notes?noteId=${encodeURIComponent(props.noteId)}`}>
                <FileText className="size-4" />
                查看这条笔记
              </Link>
            </Button>
          ) : null}

          <Button asChild size="sm" variant={props.hasCards ? "default" : "outline"} className={mobileCtaClassName}>
            <Link href={reviewHref}>
              <RotateCcw className="size-4" />
              {reviewLabel}
            </Link>
          </Button>
        </LearningCTAGroup>
      </div>
    </LearningSectionCard>
  );
}
