"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { LearningStepCard } from "@/components/learning/learning-step-card";
import { VoiceCapture } from "@/app/voice/ui/voice-capture";
import { resolveVoiceTranscriptAutofill } from "@/app/voice/ui/voice-transcript-autofill";
import { buildVoiceReflectionTemplates } from "@/server/voice/reflection-template";

const voiceFormCtaClassName = "min-h-11 w-full sm:w-auto";
const voiceModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none";
const voiceReflectionTemplateButtonClassName =
  "min-h-11 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50";
const transcriptPlaceholderByMode = new Map([
  ["book_question", "我正在读第 X 页，我不理解的是..."],
]);
const defaultTranscriptPlaceholder = "我今天学的是...\n我理解为...\n我卡住的是...\n我想让 Coach 检查...";

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
  const reflectionTemplates = buildVoiceReflectionTemplates();
  const defaultReflectionTemplate = reflectionTemplates[0]?.prompt ?? "";

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
            description="自动转写可用时直接填入转写文本；否则手动粘贴。"
            status={transcript.trim() ? "done" : "todo"}
          />
          <LearningStepCard
            index={3}
            title="保存后进入分析"
            description="保存语音笔记后可以送 Coach、存 Note、生成卡片。"
            status={canSave ? "active" : "todo"}
          />
        </div>

        <form action={props.saveAction} className="grid gap-3" data-testid="voice-note-form">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <LearningStatusBadge tone="info">语音笔记</LearningStatusBadge>
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
              aria-label="语音笔记模式"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={voiceModeSelectClassName}
            >
              {modes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="rounded-md border bg-muted/20 px-3 py-3 text-xs leading-6 text-muted-foreground">
              <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                <div className="font-medium text-foreground">60 秒反思模板</div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={voiceFormCtaClassName}
                  onClick={() => {
                    setTranscript((prev) => {
                      const nextTranscript = prev.includes(defaultReflectionTemplate)
                        ? prev
                        : prev.trim()
                          ? `${prev.trim()}\n\n${defaultReflectionTemplate}`
                          : defaultReflectionTemplate;
                      setTranscriptNotice("已插入 60 秒反思模板，先按这四句说，再检查术语和关键句。");
                      window.requestAnimationFrame(() => {
                        transcriptRef.current?.focus();
                      });
                      return nextTranscript;
                    });
                  }}
                >
                  开始 60 秒反思
                </Button>
              </div>
              <div className="mt-2 grid gap-2">
                {reflectionTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className={voiceReflectionTemplateButtonClassName}
                    onClick={() => {
                      setTranscript((prev) => {
                        const nextTranscript = prev.includes(template.prompt)
                          ? prev
                          : prev.trim()
                            ? `${prev.trim()}\n\n${template.prompt}`
                            : template.prompt;
                        setTranscriptNotice(`已插入“${template.label}”模板。`);
                        window.requestAnimationFrame(() => {
                          transcriptRef.current?.focus();
                        });
                        return nextTranscript;
                      });
                    }}
                  >
                    <div className="font-medium text-foreground">{template.label}</div>
                    <div className="mt-1 line-clamp-2 whitespace-pre-wrap text-muted-foreground">
                      {template.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
            <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
              <div className="text-sm font-medium">转写文本</div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={voiceFormCtaClassName}
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
              aria-label="语音转写文本"
              className="min-h-44"
              placeholder={transcriptPlaceholderByMode.get(mode) ?? defaultTranscriptPlaceholder}
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

          <Button type="submit" disabled={!canSave} className={voiceFormCtaClassName}>
            保存并进入分析
          </Button>
        </form>
      </div>
    </LearningSectionCard>
  );
}
