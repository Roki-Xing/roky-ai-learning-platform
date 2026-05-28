"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { VoiceCapture } from "@/app/voice/ui/voice-capture";
import { saveVoiceNoteAction } from "@/app/voice/actions";

export function VoiceWorkspaceForm(props: {
  modes: Array<readonly [string, string]>;
  recentPlan: null | { lessonId: string; localDate: string; title: string };
}) {
  const { modes, recentPlan } = props;
  const [mode, setMode] = useState("free_thought");
  const [transcript, setTranscript] = useState("");
  const [editedTranscript, setEditedTranscript] = useState("");

  const canSave = useMemo(() => {
    return Boolean((editedTranscript || transcript).trim());
  }, [editedTranscript, transcript]);

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">说出你的理解</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <form action={saveVoiceNoteAction} className="grid gap-3">
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

          {recentPlan ? <input type="hidden" name="lessonId" value={recentPlan.lessonId} /> : null}

          <VoiceCapture
            getMode={() => mode}
            onTranscript={(value) => {
              // Only auto-fill if the user hasn't started typing.
              setTranscript((prev) => (prev.trim() ? prev : value));
            }}
          />

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">Transcript</div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setTranscript("")}
              >
                清空
              </Button>
            </div>
            <Textarea
              name="transcript"
              className="min-h-44"
              placeholder="录音后点“自动转写”，或者直接写下你刚才说的内容..."
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
              className="min-h-28"
              placeholder="把核心观点写成 3-5 句..."
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
            />
          </LearningSectionCard>

          <Button type="submit" disabled={!canSave}>
            保存 Voice Note
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

