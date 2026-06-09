import { getBookById } from "@/server/books/base";

export type LearningPathReadingMaterial = {
  bookId: string;
  bookTitle: string;
  href: string;
  pageLabel: string;
  summary: string;
  actionLabel: string;
};

type PathReadingRule = {
  stageId: string;
  bookId: string;
  summary: string;
};

const PATH_READING_RULES: PathReadingRule[] = [
  {
    stageId: "data-structures",
    bookId: "designing-data-intensive-applications",
    summary: "把可靠性、错误恢复和数据结构选择连接到后续工程项目。",
  },
  {
    stageId: "llm-rag-agent",
    bookId: "ai-engineering",
    summary: "把 RAG、评估和线上反馈放回同一条工程闭环。",
  },
  {
    stageId: "ai-engineering",
    bookId: "ai-engineering",
    summary: "用工程视角理解检索、重排、上下文压缩和评估。",
  },
  {
    stageId: "project-application",
    bookId: "designing-data-intensive-applications",
    summary: "把可靠性和恢复流程转成可交付的项目检查清单。",
  },
  {
    stageId: "papers-benchmarks-breadth",
    bookId: "ai-engineering",
    summary: "从评估章节进入 Benchmark、反馈数据和线上验证。",
  },
];

function formatBookPageLabel(currentPage: number, nextPage: number) {
  return currentPage === nextPage ? `第 ${currentPage} 页` : `第 ${currentPage}-${nextPage} 页`;
}

/**
 * Builds the reading materials that connect a learning path stage back to Books.
 *
 * Args:
 *   stageId: Stable learning path stage id.
 *
 * Returns:
 *   Reading links that can be shown on the stage card.
 */
export function buildLearningPathReadingMaterials(stageId: string): LearningPathReadingMaterial[] {
  return PATH_READING_RULES.filter((rule) => rule.stageId === stageId)
    .map((rule) => {
      const book = getBookById(rule.bookId);
      if (!book) return null;
      return {
        bookId: book.id,
        bookTitle: book.title,
        href: `/books/${encodeURIComponent(book.id)}`,
        pageLabel: formatBookPageLabel(book.currentPage, book.nextPage),
        summary: rule.summary,
        actionLabel: "去同读",
      } satisfies LearningPathReadingMaterial;
    })
    .filter((reading): reading is LearningPathReadingMaterial => reading !== null);
}
