import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import {
  generateVoiceNoteFlashcardsAction,
  saveVoiceNoteAction,
  saveVoiceNoteAsNoteAction,
  sendVoiceNoteToCoachAction,
} from "@/app/voice/actions";
import { VoiceCapture } from "@/app/voice/ui/voice-capture";

const MODES = [
  ["free_thought", "自由想法"],
  ["today_lesson", "今日课程"],
  ["code_debug", "代码调试"],
  ["paper_reading", "论文阅读"],
  ["industry_radar", "行业广度"],
  ["glossary_question", "术语问题"],
] as const;

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

  return (
    <AppShell activePath="/voice" title="语音笔记">
      <PageHeader
        title="语音笔记"
        subtitle="录音或上传音频后编辑 transcript，再送入 Coach、保存笔记和生成卡片。"
        badge="Sprint 4"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">录音 / 上传</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveVoiceNoteAction} className="grid gap-3">
              <VoiceCapture />
              <div className="grid gap-2">
                <div className="text-sm font-medium">模式</div>
                <select
                  name="mode"
                  defaultValue="free_thought"
                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none"
                >
                  {MODES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {recentPlan ? <input type="hidden" name="lessonId" value={recentPlan.lessonId} /> : null}
              <div className="grid gap-2">
                <div className="text-sm font-medium">Transcript</div>
                <Textarea
                  name="transcript"
                  className="min-h-48"
                  placeholder="把语音转写粘贴到这里，或直接写下你刚才说的内容..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">编辑后 Transcript（可选）</div>
                <Textarea
                  name="editedTranscript"
                  className="min-h-32"
                  placeholder="如果需要，可以在这里放整理后的版本；留空则使用原 transcript。"
                />
              </div>
              {recentPlan ? (
                <div className="text-xs text-muted-foreground">
                  默认关联：{recentPlan.localDate} / {recentPlan.lesson.title}
                </div>
              ) : null}
              <Button type="submit">保存 Voice Note</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">分析区</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {selected ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{selected.mode}</Badge>
                    {selected.thoughtReviewId ? <Badge variant="outline">Coach linked</Badge> : null}
                    {selected.noteId ? <Badge variant="outline">Note saved</Badge> : null}
                    {selected.audioUrl ? <Badge variant="outline">{selected.audioUrl}</Badge> : null}
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">Transcript</div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {selected.editedTranscript || selected.transcript}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={sendVoiceNoteToCoachAction}>
                      <input type="hidden" name="voiceNoteId" value={selected.id} />
                      <Button type="submit" size="sm">
                        发送到 Coach
                      </Button>
                    </form>
                    <form action={saveVoiceNoteAsNoteAction}>
                      <input type="hidden" name="voiceNoteId" value={selected.id} />
                      <Button type="submit" size="sm" variant="secondary">
                        保存为 Note
                      </Button>
                    </form>
                    <form action={generateVoiceNoteFlashcardsAction}>
                      <input type="hidden" name="voiceNoteId" value={selected.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        disabled={!selected.thoughtReviewId}
                      >
                        生成 Flashcards
                      </Button>
                    </form>
                    {selected.thoughtReviewId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/coach?reviewId=${encodeURIComponent(selected.thoughtReviewId)}`}>
                          查看 Coach
                        </Link>
                      </Button>
                    ) : null}
                    {selected.noteId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href="/notes">查看 Note</Link>
                      </Button>
                    ) : null}
                    <div className="flex items-center text-xs text-muted-foreground">
                      已生成卡片：{linkedCards}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无 Voice Note。保存 transcript 后，这里会出现分析入口。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近 Voice Notes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {notes.length ? (
                notes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/voice?voiceNoteId=${encodeURIComponent(n.id)}`}
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">
                        {(n.editedTranscript || n.transcript).slice(0, 80)}
                      </div>
                      <Badge variant="outline">{n.mode}</Badge>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
