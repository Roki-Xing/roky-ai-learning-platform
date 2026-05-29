import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LearningCTAGroup } from "@/components/learning/learning-cta-group";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningStepCard } from "@/components/learning/learning-step-card";

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

  return (
    <LearningSectionCard
      title="语音学习流水线"
      description="把一段口语理解依次沉淀为 Coach 反馈、笔记和复习卡。"
      action={
        <LearningStatusBadge tone={props.hasCards ? "success" : props.hasSelected ? "info" : "warning"}>
          {props.hasCards ? `${props.linkedCards} cards` : props.hasSelected ? "进行中" : "待捕获"}
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
            title="Coach"
            description="检查概念混淆"
            status={props.hasCoach ? "done" : props.hasSelected ? "active" : "todo"}
          />
          <LearningStepCard
            index={3}
            title="Note"
            description="整理成笔记"
            status={props.hasNote ? "done" : props.hasSelected ? "active" : "todo"}
          />
          <LearningStepCard
            index={4}
            title="Cards"
            description="进入复习队列"
            status={props.hasCards ? "done" : props.hasCoach ? "active" : "todo"}
          />
        </div>

        <LearningCTAGroup>
          <form action={props.sendToCoachAction}>
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button type="submit" size="sm" disabled={!canUseVoice || props.hasCoach}>
              {props.hasCoach ? "已送 Coach" : "送 Coach 检查"}
            </Button>
          </form>

          <form action={props.saveAsNoteAction}>
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button type="submit" size="sm" variant="secondary" disabled={!canUseVoice || props.hasNote}>
              {props.hasNote ? "已整理成笔记" : "整理成笔记"}
            </Button>
          </form>

          <form action={props.generateFlashcardsAction}>
            <input type="hidden" name="voiceNoteId" value={props.voiceNoteId ?? ""} />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={!canGenerateCards || props.hasCards}
            >
              {props.hasCards ? "已生成复习卡片" : "生成复习卡片"}
            </Button>
          </form>

          {props.reviewId ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/coach?reviewId=${encodeURIComponent(props.reviewId)}`}>查看 Coach</Link>
            </Button>
          ) : null}

          {props.noteId ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/notes">查看笔记</Link>
            </Button>
          ) : null}

          <Button asChild size="sm" variant="outline">
            <Link href="/review">去复习</Link>
          </Button>
        </LearningCTAGroup>
      </div>
    </LearningSectionCard>
  );
}
