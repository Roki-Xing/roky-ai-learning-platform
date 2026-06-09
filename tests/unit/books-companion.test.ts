import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("book companion seed exposes an active reading session tied to learning assets", async () => {
  const {
    getActiveBookSession,
    getBookById,
    getBookShelf,
  } = await import("@/server/books/base");

  const shelf = getBookShelf();
  const active = getActiveBookSession();

  assert.ok(shelf.length >= 2);
  assert.equal(active?.documentId, "ai-engineering");
  assert.equal(active?.title, "AI Engineering");
  assert.equal(active?.currentPage, 12);
  assert.equal(active?.nextPage, 14);
  assert.equal(active?.progressPercent, 36);

  const book = getBookById(active.documentId);
  assert.equal(book?.entryLabel, "同读书籍");
  assert.match(book?.currentPageText ?? "", /RAG|检索|评估/);
  assert.deepEqual(
    book?.assetConnections.map((item) => item.target),
    ["Coach", "Note", "Flashcard", "Mistake", "Weekly", "Project", "Glossary", "Radar", "Current Mission", "Path"],
  );
});

test("books routes exist and keep companion reading copy learner-facing", () => {
  assert.equal(existsSync("src/app/books/page.tsx"), true);
  assert.equal(existsSync("src/app/books/[id]/page.tsx"), true);

  const booksPage = readFileSync("src/app/books/page.tsx", "utf8");
  const readerPage = readFileSync("src/app/books/[id]/page.tsx", "utf8");

  assert.match(booksPage, /activePath="\/books"/);
  assert.match(booksPage, /同读书籍/);
  assert.match(booksPage, /继续阅读/);
  assert.match(booksPage, /上传 PDF/);
  assert.doesNotMatch(booksPage, /PDF 管理/);

  assert.match(readerPage, /params: Promise<\{ id: string \}>/);
  assert.match(readerPage, /AI 伴读/);
  assert.match(readerPage, /解释选区/);
  assert.match(readerPage, /总结当前页/);
  assert.match(readerPage, /保存为 Note/);
  assert.match(readerPage, /生成 Flashcards/);
  assert.match(readerPage, /送 Coach/);
});

test("book reader keeps the AI companion as a sticky mobile bottom action", () => {
  const readerPage = readFileSync("src/app/books/[id]/page.tsx", "utf8");

  assert.match(readerPage, /aria-label="AI 伴读移动操作"/);
  assert.match(readerPage, /sticky bottom-16 z-20/);
  assert.match(readerPage, /bg-background\/95/);
  assert.match(readerPage, /backdrop-blur/);
  assert.match(readerPage, /<SheetContent side="bottom"/);
  assert.match(readerPage, /打开 AI 伴读/);
  assert.match(readerPage, /min-h-11 w-full/);
});
