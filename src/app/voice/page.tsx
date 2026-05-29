import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import {
  generateVoiceNoteFlashcardsAction,
  saveVoiceNoteAsNoteAction,
  sendVoiceNoteToCoachAction,
} from "@/app/voice/actions";
import { VoiceLearningPipeline } from "@/app/voice/ui/voice-learning-pipeline";
import { VoiceWorkspaceForm } from "@/app/voice/ui/voice-workspace-form";
import { LearningCompassCard } from "@/components/learning/learning-compass-card";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";

const MODES = [
  ["free_thought", "自由想法"],
  ["today_lesson", "今日课程"],
  ["code_debug", "代码调试"],
  ["paper_reading", "论文阅读"],
  ["industry_radar", "行业广度"],
  ["glossary_question", "术语问题"],
] as const;

const MODE_LABELS = new Map<string, string>(MODES);

function compactText(value: string, max = 120) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

export default async function VoicePage({
  searchParams,
}: {
  searchParams: Promise<{ voiceNoteId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();

  const recentPlan = await prisma.dailyPlan.findFirst({
    where: { userId, isTest: false, archivedAt: null },
    orderBy: [{ localDate: "desc" }],
    include: { lesson: { select: { title: true } } },
  });

  const notes = await prisma.voiceNote.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      mode: true,
      transcript: true,
      editedTranscript: true,
      thoughtReviewId: true,
      noteId: true,
      createdAt: true,
    },
  });
  const selectedId = sp.voiceNoteId ?? notes[0]?.id ?? null;
  const selected = selectedId
    ? await prisma.voiceNote.findFirst({ where: { id: selectedId, userId } })
    : null;
  const linkedCards =
    selected?.thoughtReviewId
      ? await prisma.flashcard.count({
          where: { id: { startsWith: `thought:${selected.thoughtReviewId}:` }, userId },
        })
      : 0;
  const selectedText = selected ? selected.editedTranscript || selected.transcript : "";
  const hasSelected = Boolean(selected);
  const hasCoach = Boolean(selected?.thoughtReviewId);
  const hasNote = Boolean(selected?.noteId);
  const hasCards = linkedCards > 0;

  return (
    <AppShell
      activePath="/voice"
      title="语音笔记"
      actions={
        <Button asChild size="sm" variant="secondary">
          <Link href="/coach">打开 Coach</Link>
        </Button>
      }
    >
      <PageHeader
        title="语音学习捕获"
        subtitle="说出你的理解，Roky 帮你整理、检查并沉淀成笔记和卡片。"
        badge="Voice"
      />

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)_320px]">
        <VoiceWorkspaceForm
          modes={MODES as unknown as Array<readonly [string, string]>}
          recentPlan={
            recentPlan
              ? {
                  lessonId: recentPlan.lessonId,
                  localDate: recentPlan.localDate,
                  title: recentPlan.lesson.title,
                }
              : null
          }
        />

        <div className="grid gap-4">
          <LearningCompassCard
            title={selected ? "当前 Voice Note" : "等待捕获"}
            subtitle={
              selected
                ? `${selected.createdAt.toISOString().slice(0, 16).replace("T", " ")} / ${
                    MODE_LABELS.get(selected.mode) ?? selected.mode
                  }`
                : "先录音或粘贴 transcript"
            }
            signal={selected ? "已捕获" : "待输入"}
            tone={selected ? "info" : "warning"}
          >
            {selected
              ? "下一步：把这段理解送到 Coach，或者先保存成笔记。"
              : "Voice Note 的价值不是保存音频，而是把口语思路变成可复习、可追问的学习材料。"}
          </LearningCompassCard>

          <VoiceLearningPipeline
            hasSelected={hasSelected}
            hasCoach={hasCoach}
            hasNote={hasNote}
            hasCards={hasCards}
            linkedCards={linkedCards}
            voiceNoteId={selected?.id ?? null}
            reviewId={selected?.thoughtReviewId ?? null}
            noteId={selected?.noteId ?? null}
            sendToCoachAction={sendVoiceNoteToCoachAction}
            saveAsNoteAction={saveVoiceNoteAsNoteAction}
            generateFlashcardsAction={generateVoiceNoteFlashcardsAction}
          />

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            {selected ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <LearningStatusBadge tone="info">
                    {MODE_LABELS.get(selected.mode) ?? selected.mode}
                  </LearningStatusBadge>
                  {hasCoach ? <LearningStatusBadge tone="success">Coach linked</LearningStatusBadge> : null}
                  {hasNote ? <LearningStatusBadge tone="success">Note saved</LearningStatusBadge> : null}
                  {hasCards ? <LearningStatusBadge tone="success">{linkedCards} cards</LearningStatusBadge> : null}
                  {selected.audioUrl ? <LearningStatusBadge tone="neutral">{selected.audioUrl}</LearningStatusBadge> : null}
                </div>

                <div>
                  <div className="text-sm font-medium">Transcript</div>
                  <div className="mt-2 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                    {selectedText}
                  </div>
                </div>
              </div>
            ) : (
              <LearningEmptyState
                title="还没有 Voice Note"
                description="在左侧录音、上传音频或直接输入 transcript，保存后这里会出现分析入口。"
                actions={[
                  { href: "/today", label: "回到今日学习", variant: "secondary" },
                  { href: "/coach", label: "打开 Coach", variant: "outline" },
                ]}
              />
            )}
          </div>

        </div>

        <div className="grid gap-4 content-start">
          <LearningCompassCard
            title="学习链路"
            subtitle="把声音变成长期记忆"
            signal={recentPlan ? "关联课程" : "独立记录"}
            tone={recentPlan ? "success" : "neutral"}
            action={
              <Button asChild size="sm" variant="secondary">
                <Link href="/review">去复习</Link>
              </Button>
            }
          >
            {recentPlan ? (
              <>
                最近课程：{recentPlan.localDate} / {recentPlan.lesson.title}
              </>
            ) : (
              "没有关联课程时，Voice Note 也可以作为独立想法进入 Coach。"
            )}
          </LearningCompassCard>

          <LearningSectionCard title="最近 Voice Notes" description="点击回到任意一次语音学习记录。">
            <div className="grid gap-2">
              {notes.length ? (
                notes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/voice?voiceNoteId=${encodeURIComponent(n.id)}`}
                    className={[
                      "rounded-md border px-3 py-2 text-sm transition-colors",
                      selected?.id === n.id ? "bg-muted" : "hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">
                        {compactText(n.editedTranscript || n.transcript, 72)}
                      </div>
                      <LearningStatusBadge tone="neutral">
                        {MODE_LABELS.get(n.mode) ?? n.mode}
                      </LearningStatusBadge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {n.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                      {n.thoughtReviewId ? " / Coach" : ""}
                      {n.noteId ? " / Note" : ""}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">暂无历史 Voice Note。</div>
              )}
            </div>
          </LearningSectionCard>
        </div>
      </div>
    </AppShell>
  );
}
