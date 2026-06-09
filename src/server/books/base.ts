export type BookAssetTarget =
  | "Coach"
  | "Note"
  | "Flashcard"
  | "Mistake"
  | "Weekly"
  | "Project"
  | "Glossary"
  | "Radar"
  | "Current Mission"
  | "Path";

export type BookAssetConnection = {
  target: BookAssetTarget;
  label: string;
  href: string;
  output: string;
};

export type BookCompanion = {
  id: string;
  title: string;
  author: string;
  entryLabel: "同读书籍";
  stage: string;
  description: string;
  currentPage: number;
  nextPage: number;
  totalPages: number;
  progressPercent: number;
  estimatedMinutes: number;
  currentPageText: string;
  selectedText: string;
  aiCompanionAnswer: string;
  summary: string;
  flashcardSeeds: string[];
  notePrompt: string;
  coachPrompt: string;
  projectPrompt: string;
  glossaryTerms: string[];
  radarEntities: string[];
  assetConnections: BookAssetConnection[];
};

export type ActiveBookSession = {
  documentId: string;
  title: string;
  currentPage: number;
  nextPage: number;
  progressPercent: number;
};

const assetConnections: BookAssetConnection[] = [
  {
    target: "Coach",
    label: "把读书疑问送 Coach",
    href: "/coach?mode=book_question",
    output: "生成理解缺口和追问",
  },
  {
    target: "Note",
    label: "保存为 Note",
    href: "/notes",
    output: "沉淀页码、选区和自己的解释",
  },
  {
    target: "Flashcard",
    label: "生成 Flashcards",
    href: "/review?source=book",
    output: "把概念变成主动回忆",
  },
  {
    target: "Mistake",
    label: "记录 confusion",
    href: "/mistakes?source=book",
    output: "把误解接入修复流程",
  },
  {
    target: "Weekly",
    label: "进入周复盘",
    href: "/weekly",
    output: "本周读书章节进入总结",
  },
  {
    target: "Project",
    label: "生成练习项目",
    href: "/projects",
    output: "把书中练习落到项目任务",
  },
  {
    target: "Glossary",
    label: "抽取术语",
    href: "/glossary",
    output: "术语进入路径化探索",
  },
  {
    target: "Radar",
    label: "关联作者/论文",
    href: "/radar",
    output: "人物、论文和 benchmark 进入 Radar",
  },
  {
    target: "Current Mission",
    label: "继续阅读",
    href: "/",
    output: "活跃读书任务进入当前任务",
  },
  {
    target: "Path",
    label: "连接学习路径",
    href: "/path",
    output: "阅读阶段回到长期路线",
  },
];

const bookShelf: BookCompanion[] = [
  {
    id: "ai-engineering",
    title: "AI Engineering",
    author: "Chip Huyen",
    entryLabel: "同读书籍",
    stage: "RAG 与评估",
    description: "用工程视角把 RAG、评估、数据反馈和上线闭环连起来。",
    currentPage: 12,
    nextPage: 14,
    totalPages: 320,
    progressPercent: 36,
    estimatedMinutes: 15,
    currentPageText:
      "RAG 的质量不只取决于模型回答，还取决于检索、重排、上下文压缩和评估。当前页重点是把离线评估、人工检查和线上反馈放到同一个闭环里。",
    selectedText: "RAG 的质量不只取决于模型回答，还取决于检索、重排、上下文压缩和评估。",
    aiCompanionAnswer:
      "这句话提醒你不要只调 prompt。RAG 出错时先拆成检索是否召回、重排是否排序、上下文是否压缩过度、评估是否覆盖真实问题四层，再决定修哪里。",
    summary:
      "第 12-14 页适合和今天的 RAG Evaluation 路径连读：先识别检索链路，再把评估信号沉淀成卡片。",
    flashcardSeeds: [
      "RAG 失败时先检查哪些环节？",
      "为什么离线评估不能替代线上反馈？",
      "重排器在检索链路里解决什么问题？",
    ],
    notePrompt: "用自己的话写下：我如何判断一个 RAG 系统是检索坏了，还是生成坏了？",
    coachPrompt: "我正在读 RAG 评估章节，不确定检索、重排、上下文压缩和评估之间的边界。",
    projectPrompt: "做一个 mini RAG 评估表：给 5 个问题记录召回、重排、答案和人工判定。",
    glossaryTerms: ["RAG Evaluation", "Retriever", "Reranker"],
    radarEntities: ["SWE-bench", "tau-bench"],
    assetConnections,
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    entryLabel: "同读书籍",
    stage: "数据系统基础",
    description: "把可靠性、可扩展性和可维护性连接到后续 AI 工程项目。",
    currentPage: 28,
    nextPage: 31,
    totalPages: 590,
    progressPercent: 18,
    estimatedMinutes: 18,
    currentPageText:
      "可靠系统需要把错误视为常态，并通过冗余、监控和恢复流程降低故障影响。",
    selectedText: "可靠系统需要把错误视为常态。",
    aiCompanionAnswer:
      "这句话可以迁移到学习系统：不要假设一次学会，而是用复习、错题、Coach 和项目反馈降低遗忘和误解的影响。",
    summary: "这一节适合连接到项目实践：为学习平台设计一个失败恢复清单。",
    flashcardSeeds: [
      "可靠性和可用性有什么区别？",
      "为什么错误预算可以帮助系统演进？",
      "恢复流程应该记录哪些信号？",
    ],
    notePrompt: "把可靠性迁移到学习系统：我应该怎样设计复习和修复流程？",
    coachPrompt: "我不确定可靠性、容错和恢复流程之间的关系。",
    projectPrompt: "写一个学习系统健康检查脚本，输出关键页面、接口和数据状态。",
    glossaryTerms: ["Reliability", "Fault Tolerance", "Observability"],
    radarEntities: ["SRE", "Postgres"],
    assetConnections,
  },
];

export function getBookShelf(): BookCompanion[] {
  return bookShelf;
}

export function getBookById(id: string): BookCompanion | null {
  return bookShelf.find((book) => book.id === id) ?? null;
}

export function getActiveBookSession(): ActiveBookSession | null {
  const active = bookShelf[0];
  if (!active) return null;
  return {
    documentId: active.id,
    title: active.title,
    currentPage: active.currentPage,
    nextPage: active.nextPage,
    progressPercent: active.progressPercent,
  };
}
