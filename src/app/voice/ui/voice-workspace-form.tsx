"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningStepCard } from "@/components/learning/learning-step-card";
import { VoiceCapture } from "@/app/voice/ui/voice-capture";
import { resolveVoiceTranscriptAutofill } from "@/app/voice/ui/voice-transcript-autofill";

export function VoiceWorkspaceForm(props: {
  modes: Array<readonly [string, string]>;
  recentPlan: null | { lessonId: string; localDate: string; title: string };
  defaultMode?: string | null;
  defaultLessonId?: string | null;
  saveAction?: (formData: FormData) => void | Promise<void>;
}) {
  const { modes, recentPlan } = props;
  const defaultMode = modes.some(([value]) => value === props.defaultMode)
    ? props.defaultMode ?? "free_thought"
    : "free_thought";
  const [mode, setMode] = useState(defaultMode);
  const [transcript, setTranscript] = useState("");
  const [editedTranscript, setEditedTranscript] = useState("");
  const [transcriptNotice, setTranscriptNotice] = useState("");
  const transcriptRef = useRef<HTMLTextAreaElement | null>(null);
  const linkedLessonId =
    props.defaultLessonId && recentPlan?.lessonId === props.defaultLessonId
      ? props.defaultLessonId
      : recentPlan?.lessonId;

  const canSave = useMemo(() => {
    return Boolean((editedTranscript || transcript).trim());
  }, [editedTranscript, transcript]);

  return (
    <LearningSectionCard
      title="说出你的理解"
      description="先说出来，再整理成 Coach 能检查的内容。"
      action={<LearningStatusBadge tone={canSave ? "success" : "warning"}>{canSave ? "已就绪" : "草稿"}</LearningStatusBadge>}
      className="rounded-lg"
    >
      <div className="grid gap-3">
        <div className="grid gap-2">
          <LearningStepCard
            index={1}
            title="录音或上传"
            description="把当前理解、卡住的问题、代码思路说出来。"
            status="active"
          />
          <LearningStepCard
            index={2}
            title="转写并整理"
            description="自动转写可用时直接填入 transcript；否则手动粘贴。"
            status={transcript.trim() ? "done" : "todo"}
          />
          <LearningStepCard
            index={3}
            title="保存后进入分析"
            description="保存 Voice Note 后可以送 Coach、存 Note、生成卡片。"
            status={canSave ? "active" : "todo"}
          />
        </div>

        <form action={props.saveAction} className="grid gap-3" data-testid="voice-note-form">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <LearningStatusBadge tone="info">Voice Note</LearningStatusBadge>
            {recentPlan ? (
              <LearningStatusBadge tone="neutral">
                关联：{recentPlan.localDate} / {recentPlan.title}
              </LearningStatusBadge>
            ) : (
              <LearningStatusBadge tone="warning">未关联课程</LearningStatusBadge>
            )}
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">模式</div>
            <select
              name="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm outline-none"
            >
              {modes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {linkedLessonId ? <input type="hidden" name="lessonId" value={linkedLessonId} /> : null}

          <VoiceCapture
            getMode={() => mode}
            onTranscript={(value) => {
              setTranscript((prev) => {
                const result = resolveVoiceTranscriptAutofill({
                  currentTranscript: prev,
                  incomingTranscript: value,
                });
                setTranscriptNotice(result.notice);
                if (result.shouldFocusTranscript) {
                  window.requestAnimationFrame(() => {
                    transcriptRef.current?.focus();
                  });
                }
                return result.nextTranscript;
              });
            }}
          />

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">Transcript</div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setTranscript("");
                  setTranscriptNotice("");
                }}
              >
                清空
              </Button>
            </div>
            {transcriptNotice ? (
              <div className="rounded-md border bg-emerald-50/70 px-3 py-2 text-xs text-emerald-900">
                {transcriptNotice}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                转写后会自动聚焦到这里；先检查术语、变量名和漏掉的关键句，再保存。
              </div>
            )}
            <Textarea
              ref={transcriptRef}
              name="transcript"
              aria-label="Transcript"
              className="min-h-44"
              placeholder="录音后点“自动转写”，或者直接写下你刚才说的理解、疑问、代码思路..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>

          <LearningSectionCard
            title="整理版（可选）"
            description="把口语整理成更清晰的表达；留空则使用 transcript。"
            className="rounded-md"
          >
            <Textarea
              name="editedTranscript"
              aria-label="整理版"
              className="min-h-28"
              placeholder="把核心观点写成 3-5 句..."
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
            />
          </LearningSectionCard>

          <Button type="submit" disabled={!canSave}>
            保存并进入分析
          </Button>
        </form>
      </div>
    </LearningSectionCard>
  );
}
