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
  generateCardsFromThoughtReviewAction,
  submitThoughtReviewAction,
} from "@/app/coach/actions";

type ReviewJson = {
  provider?: string;
  normalizedText?: string;
  mainClaim?: string;
  whatIsCorrect?: string[];
  possibleIssues?: Array<{
    type?: string;
    severity?: string;
    issue?: string;
    explanation?: string;
  }>;
  missingConcepts?: Array<{ term?: string; reason?: string }>;
  relatedTerms?: string[];
  socraticQuestions?: string[];
  suggestedNextLessons?: string[];
  flashcards?: Array<{ front?: string; back?: string; type?: string }>;
  finalAdvice?: string;
};

const MODES = [
  ["today_lesson", "今日课程"],
  ["concept_question", "概念疑问"],
  ["code_reasoning", "代码思路"],
  ["algorithm_design", "算法设计"],
  ["glossary_term", "术语理解"],
  ["industry_radar", "行业广度"],
  ["free_thought", "自由想法"],
] as const;

function asReviewJson(value: unknown): ReviewJson {
  return typeof value === "object" && value !== null ? (value as ReviewJson) : {};
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ reviewId?: string }>;
}) {
  const sp = await searchParams;
  const userId = await requireUserId();

  const todayPlan = await prisma.dailyPlan.findFirst({
    where: { userId, isTest: false, archivedAt: null },
    orderBy: [{ localDate: "desc" }],
    include: { lesson: { select: { id: true, title: true } } },
  });

  const reviews = await prisma.thoughtReview.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      mode: true,
      mainClaim: true,
      lessonId: true,
      createdAt: true,
    },
  });
  const selectedId = sp.reviewId ?? reviews[0]?.id ?? null;
  const selected = selectedId
    ? await prisma.thoughtReview.findFirst({
        where: { id: selectedId, userId },
      })
    : null;
  const review = asReviewJson(selected?.reviewJson);
  const possibleIssues = Array.isArray(review.possibleIssues) ? review.possibleIssues : [];
  const missingConcepts = Array.isArray(review.missingConcepts) ? review.missingConcepts : [];
  const flashcards = Array.isArray(review.flashcards) ? review.flashcards : [];
  const relatedTerms = list(review.relatedTerms);
  const questions = list(review.socraticQuestions);
  const nextLessons = list(review.suggestedNextLessons);
  const correctParts = list(review.whatIsCorrect);

  const generatedCardCount = selected
    ? await prisma.flashcard.count({
        where: { id: { startsWith: `thought:${selected.id}:` }, userId },
      })
    : 0;

  return (
    <AppShell activePath="/coach" title="思路评审">
      <PageHeader
        title="思路评审"
        subtitle="输入自己的理解、代码思路或疑问，让 Coach 帮你找出正确点、误区和下一步。"
        badge="Sprint 3"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">提交思路</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitThoughtReviewAction} className="grid gap-3">
              <div className="grid gap-2">
                <div className="text-sm font-medium">模式</div>
                <select
                  name="mode"
                  defaultValue="today_lesson"
                  className="h-9 rounded-md border bg-background px-3 text-sm outline-none"
                >
                  {MODES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="includeTodayLesson"
                  defaultChecked
                  className="size-4"
                />
                关联最近课程
              </label>
              {todayPlan ? (
                <input type="hidden" name="lessonId" value={todayPlan.lessonId} />
              ) : null}
              <div className="grid gap-2">
                <div className="text-sm font-medium">我的理解</div>
                <Textarea
                  name="rawText"
                  className="min-h-64"
                  placeholder="例如：我觉得 Self-Attention 就是把所有 token 平均一下；或者贴一段代码思路让 Coach 找问题。"
                  required
                />
              </div>
              {todayPlan ? (
                <div className="text-xs text-muted-foreground">
                  当前关联：{todayPlan.localDate} / {todayPlan.lesson.title}
                </div>
              ) : null}
              <Button type="submit">提交评审</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Coach 反馈</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {selected ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{selected.mode}</Badge>
                    <Badge variant="outline">{review.provider ?? "template"}</Badge>
                    {selected.lessonId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/library?lessonId=${encodeURIComponent(selected.lessonId)}`}>
                          查看关联课程
                        </Link>
                      </Button>
                    ) : null}
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">整理后的观点</div>
                    <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {review.normalizedText ?? selected.normalizedText ?? selected.rawText}
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="font-medium">主张：</span>
                      {review.mainClaim ?? selected.mainClaim}
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium">正确部分</div>
                      <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
                        {correctParts.length ? (
                          correctParts.map((x) => <li key={x}>{x}</li>)
                        ) : (
                          <li>Coach 需要更多上下文来确认正确点。</li>
                        )}
                      </ul>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium">缺失概念</div>
                      <div className="mt-2 grid gap-2">
                        {missingConcepts.length ? (
                          missingConcepts.map((x, idx) => (
                            <div key={`${x.term}:${idx}`} className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{x.term}</span>：
                              {x.reason}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">暂无明显缺失概念。</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-sm font-medium">可能问题</div>
                    <div className="mt-2 grid gap-2">
                      {possibleIssues.map((x, idx) => (
                        <div key={`${x.issue}:${idx}`} className="rounded-md border bg-muted/30 p-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge variant="outline">{x.type ?? "issue"}</Badge>
                            <Badge variant="secondary">{x.severity ?? "medium"}</Badge>
                          </div>
                          <div className="mt-2 text-sm font-medium">{x.issue}</div>
                          <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                            {x.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium">追问</div>
                      <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm text-muted-foreground">
                        {questions.map((q) => <li key={q}>{q}</li>)}
                      </ol>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium">下一步</div>
                      <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {review.finalAdvice}
                      </div>
                      {nextLessons.length ? (
                        <div className="mt-3 text-xs text-muted-foreground">
                          推荐：{nextLessons.join(" / ")}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">可生成卡片</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          已生成：{generatedCardCount} / 建议：{flashcards.length}
                        </div>
                      </div>
                      <form action={generateCardsFromThoughtReviewAction}>
                        <input type="hidden" name="reviewId" value={selected.id} />
                        <Button type="submit" size="sm" disabled={!flashcards.length}>
                          生成复习卡片
                        </Button>
                      </form>
                    </div>
                    {flashcards.length ? (
                      <div className="mt-3 grid gap-2">
                        {flashcards.map((c, idx) => (
                          <div key={`${c.front}:${idx}`} className="rounded-md border bg-muted/30 p-3">
                            <div className="text-sm font-medium">{c.front}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{c.back}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {relatedTerms.length ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {relatedTerms.map((t) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  暂无 Coach 记录。提交一段自己的理解后，这里会显示结构化反馈。
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">最近评审</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {reviews.length ? (
                reviews.map((r) => (
                  <Link
                    key={r.id}
                    href={`/coach?reviewId=${encodeURIComponent(r.id)}`}
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 font-medium">{r.mainClaim ?? "未命名评审"}</div>
                      <Badge variant="outline">{r.mode}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">暂无历史评审。</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
