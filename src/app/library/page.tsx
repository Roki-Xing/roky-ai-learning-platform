import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/server/auth/user";
import { toCodeFeedbackView } from "@/server/coding/view";
import { prisma } from "@/server/db";
import {
  buildLibraryPlanHref,
  buildLibraryPlanWhere,
  normalizeLibraryPlanFilters,
} from "@/server/library/plan-filter";
import {
  getLessonDetailNotes,
  resolveVisibleLibraryLessonId,
} from "@/server/library/lesson-detail";
import { buildLibraryLessonNextActions } from "@/server/library/next-actions";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { LearningMarkdown } from "@/components/learning/learning-markdown";

type LessonExamples = {
  guidedSteps?: string[] | Array<{ title?: string; content?: string }>;
  codingExercise?: {
    prompt?: string;
    starterCode?: string;
    visibleTests?: unknown[];
    expectedOutput?: string;
  } | null;
};

type LessonConnections = {
  glossary?: {
    term?: string;
    definition?: string;
    whyItMatters?: string;
    selfCheckQuestion?: string;
  } | null;
  breadth?: {
    kind?: string;
    title?: string;
    oneLine?: string;
    blurb?: string;
    whyItMatters?: string;
    selfCheckQuestion?: string;
  } | null;
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    lessonId?: string;
    showTest?: string;
    showArchived?: string;
    source?: string;
    schemaVersion?: string;
    status?: string;
    localDate?: string;
  }>;
}) {
  const sp = await searchParams;
  const selectedLessonId = sp.lessonId ?? null;
  const filters = normalizeLibraryPlanFilters(sp);

  const userId = await requireUserId();
  await getOrCreateUserProfile({ userId });

  const planWhere = buildLibraryPlanWhere({
    userId,
    filters,
  });

  const plans = await prisma.dailyPlan.findMany({
    where: planWhere,
    orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
    include: {
      lesson: { select: { id: true, title: true, summary: true, createdAt: true, createdBy: true } },
    },
    take: 50,
  });

  const lessonId = resolveVisibleLibraryLessonId({
    requestedLessonId: selectedLessonId,
    visibleLessonIds: plans.map((plan) => plan.lessonId),
  });

  const [
    lesson,
    planForLesson,
    flashcards,
    thoughtReviews,
    lessonNotes,
    codeSubmissions,
    codeFeedbackRows,
  ] = lessonId
    ? await Promise.all([
        prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { quizzes: true },
        }),
        prisma.dailyPlan.findFirst({
          where: {
            lessonId,
            ...planWhere,
          },
          orderBy: [{ localDate: "desc" }, { createdAt: "desc" }],
        }),
        prisma.flashcard.findMany({
          where: { userId, lessonId },
          orderBy: [{ createdAt: "asc" }],
          take: 200,
        }),
        prisma.thoughtReview.findMany({
          where: { userId, lessonId },
          orderBy: [{ createdAt: "desc" }],
          take: 20,
          select: {
            id: true,
            mode: true,
            mainClaim: true,
            createdAt: true,
          },
        }),
        getLessonDetailNotes({ userId, lessonId }),
        prisma.codeSubmission.findMany({
          where: { userId, lessonId },
          orderBy: [{ updatedAt: "desc" }],
          take: 20,
          select: {
            id: true,
            localDate: true,
            language: true,
            status: true,
            aiFeedback: true,
            updatedAt: true,
          },
        }).catch(() => []),
        prisma.codeFeedback.findMany({
          where: { userId, lessonId },
          orderBy: [{ updatedAt: "desc" }],
          take: 20,
          select: {
            submissionId: true,
            provider: true,
            overall: true,
            summary: true,
            strengths: true,
            issues: true,
            suggestions: true,
            hints: true,
            suggestedTests: true,
            flashcards: true,
            nextSteps: true,
            updatedAt: true,
          },
        }).catch(() => []),
      ])
    : [null, null, [] as const, [] as const, [] as const, [] as const, [] as const];

  const codeFeedbackBySubmissionId = new Map(
    codeFeedbackRows.map((row) => [row.submissionId, toCodeFeedbackView(row)]),
  );
  const now = new Date();
  const lessonNextActions =
    lesson && planForLesson
      ? buildLibraryLessonNextActions({
          lessonId: lesson.id,
          planStatus: planForLesson.status,
          flashcardCount: flashcards.length,
          dueFlashcardCount: flashcards.filter((card) => card.dueAt <= now).length,
          noteCount: lessonNotes.length,
          thoughtReviewCount: thoughtReviews.length,
          codeSubmissionCount: codeSubmissions.length,
        })
      : null;

  return (
    <AppShell activePath="/library" title="课程库">
      <PageHeader
        title="课程库"
        subtitle="历史课程与学习记录"
        badge="档案"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">课程列表</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <form action="/library" className="grid gap-2 rounded-md border bg-muted/20 p-2 text-xs">
              {selectedLessonId ? (
                <input type="hidden" name="lessonId" value={selectedLessonId} />
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{filters.showTest ? "显示 test" : "隐藏 test"}</Badge>
                <Badge variant="secondary">{filters.showArchived ? "显示 archived" : "隐藏 archived"}</Badge>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={buildLibraryPlanHref({
                      lessonId: selectedLessonId,
                      filters: {
                        ...filters,
                        showTest: !filters.showTest,
                      },
                    })}
                  >
                    切换 test
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={buildLibraryPlanHref({
                      lessonId: selectedLessonId,
                      filters: {
                        ...filters,
                        showArchived: !filters.showArchived,
                      },
                    })}
                  >
                    切换 archived
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/library">清空筛选</Link>
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-muted-foreground">source</span>
                  <input
                    name="source"
                    defaultValue={filters.source ?? ""}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                    placeholder="deepseek / fallback / admin"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-muted-foreground">schemaVersion</span>
                  <input
                    name="schemaVersion"
                    defaultValue={filters.schemaVersion ?? ""}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                    placeholder="2.3"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-muted-foreground">status</span>
                  <input
                    name="status"
                    defaultValue={filters.status ?? ""}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                    placeholder="planned / completed"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-muted-foreground">localDate</span>
                  <input
                    name="localDate"
                    defaultValue={filters.localDate ?? ""}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                    placeholder="YYYY-MM-DD"
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="showTest"
                    value="1"
                    defaultChecked={filters.showTest}
                  />
                  <span>显示测试计划</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="showArchived"
                    value="1"
                    defaultChecked={filters.showArchived}
                  />
                  <span>显示归档计划</span>
                </label>
                <Button size="sm" type="submit" variant="secondary">
                  应用筛选
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {filters.source ? <Badge variant="outline">source: {filters.source}</Badge> : null}
              {filters.schemaVersion ? <Badge variant="outline">schema: {filters.schemaVersion}</Badge> : null}
              {filters.status ? <Badge variant="outline">status: {filters.status}</Badge> : null}
              {filters.localDate ? <Badge variant="outline">date: {filters.localDate}</Badge> : null}
              <Button asChild size="sm" variant="outline">
                <Link
                  href={buildLibraryPlanHref({
                    lessonId: selectedLessonId,
                    filters: {
                      ...filters,
                      showTest: !filters.showTest,
                    },
                  })}
                >
                  切换 test
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={buildLibraryPlanHref({
                    lessonId: selectedLessonId,
                    filters: {
                      ...filters,
                      showArchived: !filters.showArchived,
                    },
                  })}
                >
                  切换 archived
                </Link>
              </Button>
            </div>
            {plans.length ? (
              <div className="grid gap-1">
                {plans.map((p) => {
                  const active = lessonId === p.lessonId;
                  return (
                    <Link
                      key={p.id}
                      href={buildLibraryPlanHref({
                        lessonId: p.lessonId,
                        filters,
                      })}
                      className={[
                        "rounded-md border px-3 py-2 text-sm transition-colors",
                        active ? "bg-muted" : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.lesson.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {p.localDate} / {p.source ?? "unknown"} / schema {p.schemaVersion ?? "-"}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={p.status === "completed" ? "secondary" : "outline"}>
                            {p.status}
                          </Badge>
                          {p.isTest ? <Badge variant="outline">test</Badge> : null}
                          {p.archivedAt ? <Badge variant="outline">archived</Badge> : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                暂无课程。去 /today 生成并完成一节学习后会出现在这里。
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">课程详情</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {lesson ? (
                <>
                  <div className="grid gap-1">
                    <div className="text-sm font-medium">{lesson.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {planForLesson
                        ? `${planForLesson.localDate} / ${planForLesson.status} / ${planForLesson.source ?? "unknown"} / schema ${planForLesson.schemaVersion ?? "-"}`
                        : "未关联到 DailyPlan"}
                    </div>
                    {planForLesson ? (
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{planForLesson.selectedDomain ?? "unknown"}</Badge>
                        <Badge variant="outline">{planForLesson.selectedTopic ?? "unknown"}</Badge>
                        {planForLesson.isTest ? <Badge variant="outline">test</Badge> : null}
                        {planForLesson.archivedAt ? <Badge variant="outline">archived</Badge> : null}
                      </div>
                    ) : null}
                  </div>

                  {lessonNextActions ? (
                    <div className="rounded-md border bg-muted/20 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{lessonNextActions.title}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {lessonNextActions.summary}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {lessonNextActions.actions.map((action, index) => (
                            <Button
                              key={`${action.href}:${action.label}`}
                              asChild
                              size="sm"
                              variant={index === 0 ? "default" : "outline"}
                            >
                              <Link href={action.href}>{action.label}</Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 md:grid-cols-3">
                        {lessonNextActions.actions.map((action) => (
                          <div
                            key={`${action.href}:${action.description}`}
                            className="rounded-md border bg-background/70 p-2 text-xs text-muted-foreground"
                          >
                            {action.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">正文</div>
                    <LearningMarkdown content={lesson.contentMarkdown} className="mt-3" />
                  </div>

                  {(() => {
                    const ex = (lesson.examples ?? null) as unknown as LessonExamples | null;
                    const steps = ex?.guidedSteps;
                    const arr = Array.isArray(steps) ? steps : [];
                    if (!arr.length) return null;
                    return (
                      <div className="rounded-md border p-3">
                        <div className="text-sm font-medium">引导步骤</div>
                        <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm text-muted-foreground">
                          {arr.map((s, i) => (
                            <li key={`${i}:${typeof s === "string" ? s : s?.title ?? i}`}>
                              {typeof s === "string" ? s : s?.content ?? JSON.stringify(s)}
                            </li>
                          ))}
                        </ol>
                      </div>
                    );
                  })()}

                  {(() => {
                    const ex = (lesson.examples ?? null) as unknown as LessonExamples | null;
                    const ce = ex?.codingExercise ?? null;
                    if (!ce) return null;
                    return (
                      <div className="rounded-md border p-3">
                        <div className="text-sm font-medium">代码练习</div>
                        <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                          {ce.prompt ?? ""}
                        </div>
                        <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 text-xs">
                          <code>{ce.starterCode}</code>
                        </pre>
                        <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                          {Array.isArray(ce.visibleTests) && ce.visibleTests.length
                            ? `可见测试：${ce.visibleTests.length}`
                            : ce.expectedOutput
                              ? `期望：${ce.expectedOutput}`
                              : ""}
                        </div>
                      </div>
                    );
                  })()}

                  {(() => {
                    const conn =
                      (lesson.connections ?? null) as unknown as LessonConnections | null;
                    const glossary = conn?.glossary ?? null;
                    const breadth = conn?.breadth ?? null;
                    if (!glossary && !breadth) return null;
                    return (
                      <div className="grid gap-3 lg:grid-cols-2">
                        {glossary ? (
                          <div className="rounded-md border p-3">
                            <div className="text-sm font-medium">术语卡</div>
                            <div className="mt-2 text-sm">{glossary.term}</div>
                            <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                              {glossary.definition}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                              {glossary.whyItMatters}
                            </div>
                            {glossary.selfCheckQuestion ? (
                              <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                                自测：{glossary.selfCheckQuestion}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                        {breadth ? (
                          <div className="rounded-md border p-3">
                            <div className="text-sm font-medium">广度卡</div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              类型：{breadth.kind}
                            </div>
                            <div className="mt-1 text-sm">{breadth.title}</div>
                            <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                              {breadth.oneLine ?? breadth.blurb ?? ""}
                            </div>
                            {breadth.whyItMatters ? (
                              <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                {breadth.whyItMatters}
                              </div>
                            ) : null}
                            {breadth.selfCheckQuestion ? (
                              <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                                自测：{breadth.selfCheckQuestion}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })()}

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      测验（{lesson.quizzes.length}）
                    </div>
                    <div className="mt-2 grid gap-2">
                      {lesson.quizzes.map((q, idx) => (
                        <div key={q.id} className="rounded-md border p-3">
                          <div className="text-sm font-medium">
                            Q{idx + 1}. {q.question}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            类型：{q.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      复习卡片（{flashcards.length}）
                    </div>
                    {flashcards.length ? (
                      <div className="mt-2 grid gap-2">
                        {flashcards.map((c) => (
                          <div key={c.id} className="rounded-md border p-3">
                            <div className="text-sm font-medium">{c.front}</div>
                            <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                              {c.back}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              due: {c.dueAt.toISOString().slice(0, 10)} / reviews:{" "}
                              {c.reviewCount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-muted-foreground">
                        该课程暂无卡片。完成 /today 后会生成。
                      </div>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      Coach 思路评审（{thoughtReviews.length}）
                    </div>
                    {thoughtReviews.length ? (
                      <div className="mt-2 grid gap-2">
                        {thoughtReviews.map((r) => (
                          <Link
                            key={r.id}
                            href={`/coach?reviewId=${encodeURIComponent(r.id)}`}
                            className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-sm font-medium">
                                {r.mainClaim ?? "未命名评审"}
                              </div>
                              <Badge variant="outline">{r.mode}</Badge>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-muted-foreground">
                        该课程暂无 Coach 评审。去 /coach 提交思路后会显示在这里。
                      </div>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">
                        关联笔记（{lessonNotes.length}）
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/notes?lessonId=${encodeURIComponent(lesson.id)}`}>
                          写笔记
                        </Link>
                      </Button>
                    </div>
                    {lessonNotes.length ? (
                      <div className="mt-2 grid gap-2">
                        {lessonNotes.map((note) => (
                          <div key={note.id} className="rounded-md border p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-sm font-medium">{note.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {note.updatedAt.toISOString().slice(0, 16).replace("T", " ")}
                              </div>
                            </div>
                            <div className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">
                              {note.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-muted-foreground">
                        该课程暂无笔记。完成学习后可以在 /notes 沉淀总结。
                      </div>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">
                      代码提交与反馈（{codeSubmissions.length}）
                    </div>
                    {codeSubmissions.length ? (
                      <div className="mt-2 grid gap-2">
                        {codeSubmissions.map((submission) => {
                          const feedback = codeFeedbackBySubmissionId.get(submission.id) ?? null;
                          return (
                            <div key={submission.id} className="rounded-md border p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm font-medium">
                                  {submission.localDate} / {submission.language}
                                </div>
                                <Badge variant="outline">{submission.status}</Badge>
                              </div>
                              {submission.aiFeedback ? (
                                <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                  {submission.aiFeedback}
                                </div>
                              ) : null}
                              {feedback ? (
                                <div className="mt-3 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                                  反馈：{feedback.provider}
                                  {feedback.overall ? ` / ${feedback.overall}` : ""}
                                  {"\n"}
                                  {feedback.summary}
                                  {feedback.issues.length
                                    ? `\n待处理：${feedback.issues
                                        .slice(0, 2)
                                        .map((issue) => issue.message)
                                        .join("；")}`
                                    : ""}
                                  {feedback.suggestedTests.length
                                    ? `\n建议测试：${feedback.suggestedTests.slice(0, 2).join("；")}`
                                    : ""}
                                </div>
                              ) : (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  暂无结构化反馈。下次从 /today 保存提交后会生成。
                                </div>
                              )}
                              <div className="mt-2 text-xs text-muted-foreground">
                                {submission.updatedAt.toISOString().slice(0, 16).replace("T", " ")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-muted-foreground">
                        该课程暂无代码提交。去 /today 保存代码后会显示在这里。
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  选择左侧课程查看详情。
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
