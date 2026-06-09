import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileUp, NotebookText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CurrentMissionCard } from "@/components/learning/current-mission-card";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getActiveBookSession, getBookShelf } from "@/server/books/base";
import { requireUserId } from "@/server/auth/user";
import { getCurrentMissionData } from "@/server/learning/current-mission";

const booksCtaClassName = "min-h-11 w-full sm:w-auto";

function progressWidth(percent: number) {
  return `${Math.max(0, Math.min(100, percent))}%`;
}

export default async function BooksPage() {
  const userId = await requireUserId();
  const currentMission = await getCurrentMissionData(userId);
  const books = getBookShelf();
  const activeSession = getActiveBookSession();
  const activeBook = activeSession
    ? books.find((book) => book.id === activeSession.documentId) ?? books[0]
    : books[0];

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
        activeBook ? (
          <Button asChild size="sm" className={booksCtaClassName}>
            <Link href={`/books/${activeBook.id}`}>
              <BookOpenCheck className="size-4" aria-hidden="true" />
              继续阅读
            </Link>
          </Button>
        ) : null
      }
    >
      <PageHeader
        title="同读书籍"
        subtitle="围绕当前任务读书，读完的选区会流向笔记、卡片、Coach、误区、项目和周复盘。"
        badge="Book Companion"
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="grid gap-4">
          {activeBook ? (
            <LearningSectionCard
              title="最近阅读"
              description="今天只推进当前页段，读完后生成可复习资产。"
              action={<LearningStatusBadge tone="info">{activeBook.stage}</LearningStatusBadge>}
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{activeBook.title}</h2>
                    <Badge variant="secondary">{activeBook.author}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {activeBook.summary}
                  </p>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>
                        第 {activeBook.currentPage}-{activeBook.nextPage} 页
                      </span>
                      <span>{activeBook.progressPercent}%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${activeBook.title} 阅读进度`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={activeBook.progressPercent}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: progressWidth(activeBook.progressPercent) }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                    <Button asChild className={booksCtaClassName}>
                      <Link href={`/books/${activeBook.id}`}>
                        继续阅读
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className={booksCtaClassName}>
                      <Link href="/notes">
                        <NotebookText className="size-4" aria-hidden="true" />
                        查看读书笔记
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="text-sm font-medium">读完产出</div>
                  <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    <li>3 张 Flashcards</li>
                    <li>1 条 Note 草稿</li>
                    <li>1 个 Coach 读书问题</li>
                    <li>术语进入 Glossary</li>
                  </ul>
                </div>
              </div>
            </LearningSectionCard>
          ) : null}

          <LearningSectionCard title="我的书架" description="只放正在服务当前学习路线的书。">
            <div className="grid gap-3 md:grid-cols-2">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="grid min-h-44 gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold">{book.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{book.author}</div>
                    </div>
                    <LearningStatusBadge tone={book.id === activeSession?.documentId ? "success" : "neutral"}>
                      {book.entryLabel}
                    </LearningStatusBadge>
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {book.description}
                  </p>
                  <div className="mt-auto grid gap-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>第 {book.currentPage}-{book.nextPage} 页</span>
                      <span>{book.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: progressWidth(book.progressPercent) }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </LearningSectionCard>
        </main>

        <aside className="grid content-start gap-4">
          <LearningSectionCard title="上传 PDF" description="MVP 先接入伴学流程，真实上传会接入私有存储。">
            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-medium">选择 PDF</span>
                <Input type="file" accept="application/pdf" disabled className="min-h-11" />
              </label>
              <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
                当前上线版本不会把本地 PDF 上传到服务器；先用示例书完成选区解释、笔记、卡片和 Coach 流转。
              </div>
              <Button disabled variant="secondary" className={booksCtaClassName}>
                <FileUp className="size-4" aria-hidden="true" />
                上传 PDF
              </Button>
            </div>
          </LearningSectionCard>

          <LearningSectionCard title="连接学习闭环" description="Books 不是资料库，它会产生学习资产。">
            <div className="grid gap-2">
              {activeBook?.assetConnections.slice(0, 7).map((item) => (
                <Link
                  key={item.target}
                  href={item.href}
                  className="rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                >
                  <div className="font-medium">{item.target}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.output}</div>
                </Link>
              ))}
            </div>
          </LearningSectionCard>
        </aside>
      </div>
    </AppShell>
  );
}
