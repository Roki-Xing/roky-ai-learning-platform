import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookMarked,
  Bot,
  CopyCheck,
  Layers,
  MessageSquareText,
  NotebookText,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getBookById, getBookShelf } from "@/server/books/base";
import { requireUserId } from "@/server/auth/user";
import { getCurrentMissionData } from "@/server/learning/current-mission";

const readerCtaClassName = "min-h-11 w-full sm:w-auto";

function progressWidth(percent: number) {
  return `${Math.max(0, Math.min(100, percent))}%`;
}

export function generateStaticParams() {
  return getBookShelf().map((book) => ({ id: book.id }));
}

export default async function BookReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) notFound();

  const userId = await requireUserId();
  const currentMission = await getCurrentMissionData(userId);

  return (
    <AppShell
      activePath="/books"
      title="同读书籍"
      missionBanner={
        <CurrentMissionCard
          mission={currentMission.mission}
          signals={currentMission.signals}
          progress={currentMission.progress}
        />
      }
      actions={
        <Button asChild size="sm" variant="secondary" className={readerCtaClassName}>
          <Link href="/books">
            <ArrowLeft className="size-4" aria-hidden="true" />
            返回书架
          </Link>
        </Button>
      }
    >
      <PageHeader
        title={book.title}
        subtitle={`第 ${book.currentPage}-${book.nextPage} 页，读完后生成笔记、卡片和 Coach 问题。`}
        badge="Book Companion"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-4">
          <LearningSectionCard
            title="PDF Viewer"
            description="MVP 保留原 PDF 阅读位置，同时提取当前页文本给 AI 伴读使用。"
            action={<LearningStatusBadge tone="info">{book.stage}</LearningStatusBadge>}
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-h-[520px] rounded-lg border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{book.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {book.author} / 第 {book.currentPage}-{book.nextPage} 页
                    </div>
                  </div>
                  <Badge variant="secondary">{book.progressPercent}%</Badge>
                </div>
                <article className="mx-auto mt-5 grid max-w-2xl gap-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookMarked className="size-4" aria-hidden="true" />
                    当前页文本提取
                  </div>
                  <p className="text-base leading-8 text-foreground">{book.currentPageText}</p>
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
                    文本选择：下面的选区会进入 AI 伴读、Note、Flashcards 和 Coach。
                  </div>
                  <Textarea
                    readOnly
                    aria-label="文本选择"
                    className="min-h-28"
                    value={book.selectedText}
                  />
                </article>
              </div>

              <div className="grid content-start gap-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>阅读进度</span>
                    <span>{book.progressPercent}%</span>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`${book.title} 阅读进度`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={book.progressPercent}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: progressWidth(book.progressPercent) }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                  {book.summary}
                </div>
              </div>
            </div>
          </LearningSectionCard>

          <div
            aria-label="AI 伴读移动操作"
            className="sticky bottom-16 z-20 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur xl:hidden"
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button className="min-h-11 w-full">
                  <Bot className="size-4" aria-hidden="true" />
                  打开 AI 伴读
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[82vh] overflow-y-auto p-0">
                <div className="border-b px-4 py-3">
                  <SheetTitle className="text-sm font-semibold">AI 伴读</SheetTitle>
                  <SheetDescription>
                    针对当前页和文本选择生成解释、总结、笔记和卡片。
                  </SheetDescription>
                </div>
                <div className="p-4">
                  <BookCompanionPanel book={book} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>

        <aside className="hidden content-start gap-4 xl:grid">
          <BookCompanionPanel book={book} />
        </aside>
      </div>
    </AppShell>
  );
}

function BookCompanionPanel({
  book,
}: {
  book: NonNullable<ReturnType<typeof getBookById>>;
}) {
  return (
    <div className="grid gap-4">
      <LearningSectionCard title="AI 伴读" description="先处理选区，再决定进入哪个学习资产。">
        <div className="grid gap-3">
          <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-6">
            {book.aiCompanionAnswer}
          </div>
          <div className="grid gap-2">
            <Button className={readerCtaClassName}>
              <MessageSquareText className="size-4" aria-hidden="true" />
              解释选区
            </Button>
            <Button variant="secondary" className={readerCtaClassName}>
              <CopyCheck className="size-4" aria-hidden="true" />
              总结当前页
            </Button>
          </div>
        </div>
      </LearningSectionCard>

      <LearningSectionCard title="学习资产" description="读书产出回到主线，不另开资料孤岛。">
        <div className="grid gap-2">
          <Button asChild variant="secondary" className={readerCtaClassName}>
            <Link href="/notes">
              <NotebookText className="size-4" aria-hidden="true" />
              保存为 Note
            </Link>
          </Button>
          <Button asChild variant="secondary" className={readerCtaClassName}>
            <Link href="/review?source=book">
              <Layers className="size-4" aria-hidden="true" />
              生成 Flashcards
            </Link>
          </Button>
          <Button asChild variant="secondary" className={readerCtaClassName}>
            <Link href="/coach?mode=book_question">
              <Bot className="size-4" aria-hidden="true" />
              送 Coach
            </Link>
          </Button>
        </div>
      </LearningSectionCard>

      <LearningSectionCard title="下一步连接" description="把本页内容接到术语、Radar 和项目。">
        <div className="grid gap-3">
          <div>
            <div className="text-xs font-medium text-muted-foreground">Flashcards</div>
            <ul className="mt-2 grid gap-1 text-sm">
              {book.flashcardSeeds.map((card) => (
                <li key={card}>- {card}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            {book.glossaryTerms.map((term) => (
              <Badge key={term} variant="secondary">{term}</Badge>
            ))}
            {book.radarEntities.map((entity) => (
              <Badge key={entity} variant="outline">{entity}</Badge>
            ))}
          </div>
          <Button asChild variant="outline" className={readerCtaClassName}>
            <Link href="/projects">{book.projectPrompt}</Link>
          </Button>
        </div>
      </LearningSectionCard>
    </div>
  );
}
