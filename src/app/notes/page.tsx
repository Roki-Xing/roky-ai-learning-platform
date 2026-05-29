import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { resolveVisibleLibraryLessonId } from "@/server/library/lesson-detail";
import { buildLessonNoteTemplate } from "@/server/notes/template";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { localDateInTimeZone } from "@/server/time/day";
import { createNoteAction } from "@/app/notes/actions";

function strings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ lessonId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();
  const profile = await getOrCreateUserProfile({ userId });

  const timeZone = profile.timeZone ?? "Asia/Shanghai";
  const localDate = localDateInTimeZone({ date: new Date(), timeZone });
  const [todayPlan, recentPlans, notes] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: { userId, localDate, isTest: false, archivedAt: null },
      include: { lesson: { select: { id: true, title: true } } },
    }),
    prisma.dailyPlan.findMany({
      where: { userId, isTest: false, archivedAt: null },
      orderBy: [{ date: "desc" }],
      include: { lesson: { select: { id: true, title: true } } },
      take: 20,
    }),
    prisma.note.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }],
      take: 50,
    }),
  ]);

  const visibleLessonIds = recentPlans.map((plan) => plan.lessonId);
  const selectedLessonId =
    resolveVisibleLibraryLessonId({
      requestedLessonId: sp.lessonId ?? todayPlan?.lessonId ?? null,
      visibleLessonIds,
    }) ?? "";

  const lessonIds = Array.from(
    new Set(notes.map((n) => n.lessonId).filter((x): x is string => !!x)),
  );
  const lessons = lessonIds.length
    ? await prisma.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { id: true, title: true },
      })
    : [];
  const lessonTitleById = new Map(lessons.map((l) => [l.id, l.title]));

  const [selectedLesson, selectedLessonQuizCount, selectedLessonCodeSubmissionCount] =
    selectedLessonId
      ? await Promise.all([
          prisma.lesson.findUnique({
            where: { id: selectedLessonId },
            select: { id: true, title: true, objectives: true, keyTerms: true },
          }),
          prisma.quizQuestion.count({ where: { lessonId: selectedLessonId } }),
          prisma.codeSubmission.count({ where: { userId, lessonId: selectedLessonId } }),
        ])
      : [null, 0, 0] as const;
  const selectedPlan =
    selectedLessonId
      ? recentPlans.find((plan) => plan.lessonId === selectedLessonId) ?? null
      : null;
  const selectedHasExistingNote = selectedLessonId
    ? notes.some((note) => note.lessonId === selectedLessonId)
    : false;
  const noteTemplate = buildLessonNoteTemplate({
    lessonTitle: selectedLesson?.title ?? null,
    localDate,
    planStatus: selectedPlan?.status ?? null,
    objectives: strings(selectedLesson?.objectives),
    keyTerms: strings(selectedLesson?.keyTerms),
    quizCount: selectedLessonQuizCount,
    codeSubmissionCount: selectedLessonCodeSubmissionCount,
    hasExistingNote: selectedHasExistingNote,
  });

  return (
    <AppShell activePath="/notes" title="我的笔记">
      <PageHeader
        title="我的笔记"
        subtitle="学习笔记"
        badge="笔记"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">笔记列表</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {notes.length ? (
              <div className="grid gap-1">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-md border px-3 py-2">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {n.updatedAt.toISOString().slice(0, 16).replace("T", " ")}
                      {n.lessonId ? (
                        <>
                          {" "}
                          /{" "}
                          <Link
                            className="underline underline-offset-4"
                            href={`/library?lessonId=${encodeURIComponent(n.lessonId)}`}
                          >
                            {lessonTitleById.get(n.lessonId) ?? "关联课程"}
                          </Link>
                        </>
                      ) : null}
                    </div>
                    <div className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-muted-foreground">
                      {n.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                暂无笔记。你可以先去 /today 完成学习，然后在这里沉淀总结。
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">新建笔记</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
              <div className="min-w-0">
                <div className="text-sm font-medium">关联课程</div>
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  {selectedLesson ? selectedLesson.title : "（未选择）"}
                </div>
                <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                  <span>计划：{selectedPlan?.status ?? "未关联"}</span>
                  <span>/</span>
                  <span>测验：{selectedLessonQuizCount}</span>
                  <span>/</span>
                  <span>代码：{selectedLessonCodeSubmissionCount}</span>
                  <span>/</span>
                  <span>已有笔记：{selectedHasExistingNote ? "是" : "否"}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/today">去今日学习</Link>
                </Button>
                {selectedLesson ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/library?lessonId=${encodeURIComponent(selectedLesson.id)}`}>
                      看课程档案
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-md border bg-muted/20 p-3 text-sm">
              <div className="font-medium">今日笔记模板已预填</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                先补“我能用自己的话解释”和“仍然模糊的地方”，保存后会回流到课程库与进度页。
              </div>
            </div>

            <form action={createNoteAction} className="grid gap-3">
              <input type="hidden" name="lessonId" value={selectedLessonId} />
              <div className="grid gap-2">
                <div className="text-sm font-medium">标题</div>
                <Input
                  name="title"
                  placeholder="例如：Transformer 今日总结"
                  defaultValue={
                    selectedLesson ? `${selectedLesson.title} - 总结` : "今日总结"
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">内容（Markdown）</div>
                <Textarea
                  name="content"
                  className="min-h-48"
                  placeholder="今天我学到了..."
                  defaultValue={noteTemplate}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit">保存笔记</Button>
                <div className="text-xs text-muted-foreground">
                  今日计划：{todayPlan ? "已生成" : "未生成"}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
