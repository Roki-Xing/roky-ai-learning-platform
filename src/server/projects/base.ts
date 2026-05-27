export type ProjectType =
  | "python_basics"
  | "data_structures"
  | "algorithms"
  | "ai_engineering"
  | "rag"
  | "agent"
  | "data_analysis"
  | "paper_reproduction";

export type ProjectMilestoneTemplate = {
  title: string;
  task: string;
  codePrompt: string;
  reflectionPrompt: string;
  relatedTopics: string[];
};

export type ProjectTemplate = {
  type: ProjectType;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  relatedTopics: string[];
  milestones: ProjectMilestoneTemplate[];
};

export type ProjectProgress = {
  total: number;
  completed: number;
  remaining: number;
  percent: number;
  isComplete: boolean;
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  python_basics: "Python 基础项目",
  data_structures: "数据结构项目",
  algorithms: "算法项目",
  ai_engineering: "AI 工程项目",
  rag: "RAG 小项目",
  agent: "Agent 小项目",
  data_analysis: "数据分析项目",
  paper_reproduction: "论文复现小项目",
};

export const DEFAULT_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    type: "python_basics",
    slug: "word-frequency-counter",
    title: "单词频率统计器",
    description: "读取文本、清洗 token、统计词频，并输出 Top-K 结果。",
    difficulty: "beginner",
    estimatedHours: 3,
    relatedTopics: ["python", "strings", "dict"],
    milestones: [
      {
        title: "读取文本并切分单词",
        task: "实现一个函数，接收一段文本并返回小写 token 列表。",
        codePrompt: "实现 tokenize(text: str) -> list[str]，过滤空白和常见标点。",
        reflectionPrompt: "哪些字符清洗规则会影响统计结果？",
        relatedTopics: ["python", "string-processing"],
      },
      {
        title: "统计词频",
        task: "用 dict 或 Counter 统计每个 token 出现次数。",
        codePrompt: "实现 count_words(tokens: list[str]) -> dict[str, int]。",
        reflectionPrompt: "dict 更新计数时最容易写错的边界是什么？",
        relatedTopics: ["dict", "counter"],
      },
      {
        title: "输出 Top-K",
        task: "按出现次数排序，并处理并列词的稳定排序。",
        codePrompt: "实现 top_k(counts: dict[str, int], k: int) -> list[tuple[str, int]]。",
        reflectionPrompt: "如果两个词频相同，你希望如何排序？为什么？",
        relatedTopics: ["sorting", "python"],
      },
    ],
  },
  {
    type: "data_structures",
    slug: "markdown-note-search",
    title: "Markdown 笔记搜索器",
    description: "扫描 Markdown 文件，建立倒排索引，并返回命中文档。",
    difficulty: "intermediate",
    estimatedHours: 6,
    relatedTopics: ["inverted-index", "sets", "file-io"],
    milestones: [
      {
        title: "扫描 Markdown 文件",
        task: "遍历目录并收集 .md 文件路径与正文。",
        codePrompt: "实现 scan_markdown(root: str) -> list[tuple[str, str]]。",
        reflectionPrompt: "递归扫描目录时应跳过哪些文件？",
        relatedTopics: ["file-io", "pathlib"],
      },
      {
        title: "建立倒排索引",
        task: "把词映射到包含它的文件集合。",
        codePrompt: "实现 build_index(docs: list[tuple[str, str]]) -> dict[str, set[str]]。",
        reflectionPrompt: "为什么倒排索引适合关键词搜索？",
        relatedTopics: ["hash-map", "set"],
      },
      {
        title: "实现搜索排序",
        task: "根据多个关键词命中数量返回结果。",
        codePrompt: "实现 search(index, query: str) -> list[str]。",
        reflectionPrompt: "多个关键词时，你会用交集还是并集？",
        relatedTopics: ["ranking", "set-operations"],
      },
    ],
  },
  {
    type: "algorithms",
    slug: "binary-search-playground",
    title: "二分搜索练习台",
    description: "实现标准二分、lower_bound 与边界测试生成器。",
    difficulty: "intermediate",
    estimatedHours: 4,
    relatedTopics: ["binary-search", "edge-cases"],
    milestones: [
      {
        title: "标准二分查找",
        task: "在有序数组中查找目标值下标。",
        codePrompt: "实现 binary_search(nums: list[int], target: int) -> int。",
        reflectionPrompt: "while 条件和左右边界如何保持不变量？",
        relatedTopics: ["binary-search"],
      },
      {
        title: "lower_bound",
        task: "找到第一个大于等于 target 的位置。",
        codePrompt: "实现 lower_bound(nums: list[int], target: int) -> int。",
        reflectionPrompt: "为什么 lower_bound 可以返回 len(nums)？",
        relatedTopics: ["bounds", "invariants"],
      },
      {
        title: "边界用例集",
        task: "写出空数组、单元素、重复元素和越界目标测试。",
        codePrompt: "实现 build_binary_search_tests() -> list[tuple[list[int], int, int]]。",
        reflectionPrompt: "哪些用例最容易暴露 off-by-one 错误？",
        relatedTopics: ["testing", "edge-cases"],
      },
    ],
  },
  {
    type: "ai_engineering",
    slug: "prompt-batch-evaluator",
    title: "Prompt 批量评测工具",
    description: "批量运行 prompt 样例，记录输出、评分和失败案例。",
    difficulty: "intermediate",
    estimatedHours: 6,
    relatedTopics: ["evaluation", "prompting", "json"],
    milestones: [
      {
        title: "定义评测样例",
        task: "设计 prompt、输入和期望行为的数据结构。",
        codePrompt: "用 dataclass 定义 EvalCase，并写 3 个样例。",
        reflectionPrompt: "评测样例应该覆盖哪些失败模式？",
        relatedTopics: ["schema", "evaluation"],
      },
      {
        title: "实现批量运行器",
        task: "遍历样例并收集模型输出或本地模拟输出。",
        codePrompt: "实现 run_cases(cases, runner) -> list[dict]。",
        reflectionPrompt: "为什么 runner 应该作为参数传入？",
        relatedTopics: ["dependency-injection", "batch-processing"],
      },
      {
        title: "输出评测报告",
        task: "统计通过率并列出失败样例。",
        codePrompt: "实现 summarize_results(results) -> str。",
        reflectionPrompt: "一个好评测报告应该先展示什么？",
        relatedTopics: ["reporting", "metrics"],
      },
    ],
  },
  {
    type: "rag",
    slug: "mini-vector-retrieval",
    title: "简单向量检索系统",
    description: "从文档切块到向量检索，构建一个不联网的 RAG 检索雏形。",
    difficulty: "intermediate",
    estimatedHours: 8,
    relatedTopics: ["rag", "embedding", "retrieval"],
    milestones: [
      {
        title: "文档切块",
        task: "把长文本切成带 metadata 的 chunk。",
        codePrompt: "实现 chunk_text(text: str, size: int, overlap: int) -> list[dict]。",
        reflectionPrompt: "chunk 过大或过小分别会影响什么？",
        relatedTopics: ["chunking", "metadata"],
      },
      {
        title: "相似度检索",
        task: "用本地向量列表和 cosine similarity 返回 Top-K。",
        codePrompt: "实现 cosine_similarity(a, b) 和 retrieve(query_vec, docs, k)。",
        reflectionPrompt: "为什么向量需要归一化？",
        relatedTopics: ["cosine-similarity", "vector-search"],
      },
      {
        title: "组装 RAG prompt",
        task: "把检索结果压缩成上下文并拼接回答 prompt。",
        codePrompt: "实现 build_rag_prompt(question: str, contexts: list[str]) -> str。",
        reflectionPrompt: "上下文里应该保留来源吗？为什么？",
        relatedTopics: ["prompting", "rag"],
      },
    ],
  },
  {
    type: "agent",
    slug: "tool-calling-agent-demo",
    title: "小型 Agent 工具调用 demo",
    description: "实现一个可选择工具、执行工具并生成最终回答的最小 Agent 循环。",
    difficulty: "advanced",
    estimatedHours: 8,
    relatedTopics: ["agent", "tool-calling", "state-machine"],
    milestones: [
      {
        title: "定义工具接口",
        task: "为 calculator/search_note 两个工具设计统一输入输出。",
        codePrompt: "定义 Tool dataclass 和 run_tool(tool_name, args)。",
        reflectionPrompt: "工具输入为什么需要结构化？",
        relatedTopics: ["tool-schema", "agent"],
      },
      {
        title: "实现单步决策",
        task: "根据用户请求选择工具或直接回答。",
        codePrompt: "实现 decide_next_action(user_message: str) -> dict。",
        reflectionPrompt: "哪些请求不应该触发工具？",
        relatedTopics: ["routing", "decision"],
      },
      {
        title: "组装执行循环",
        task: "执行工具、记录 observation，并生成最终答案。",
        codePrompt: "实现 run_agent(user_message: str, max_steps: int = 3) -> dict。",
        reflectionPrompt: "为什么必须限制 max_steps？",
        relatedTopics: ["state-machine", "safety"],
      },
    ],
  },
  {
    type: "data_analysis",
    slug: "knn-classifier",
    title: "KNN 分类器",
    description: "从距离函数到投票规则，实现一个可解释的 KNN 分类器。",
    difficulty: "intermediate",
    estimatedHours: 5,
    relatedTopics: ["knn", "distance", "classification"],
    milestones: [
      {
        title: "实现距离函数",
        task: "计算两个向量的欧氏距离。",
        codePrompt: "实现 euclidean_distance(a: list[float], b: list[float]) -> float。",
        reflectionPrompt: "距离函数对特征尺度敏感吗？",
        relatedTopics: ["distance", "normalization"],
      },
      {
        title: "寻找最近邻",
        task: "对训练样本排序并取最近的 k 个。",
        codePrompt: "实现 nearest_neighbors(train, x, k) -> list。",
        reflectionPrompt: "k 太小或太大会怎样？",
        relatedTopics: ["sorting", "knn"],
      },
      {
        title: "投票分类",
        task: "根据近邻标签投票并处理平票。",
        codePrompt: "实现 predict_knn(train, x, k) -> str。",
        reflectionPrompt: "平票时应该如何设计稳定规则？",
        relatedTopics: ["classification", "tie-break"],
      },
    ],
  },
  {
    type: "paper_reproduction",
    slug: "kmeans-reproduction",
    title: "K-means 聚类器复现",
    description: "用论文复现思路实现 K-means：初始化、分配、更新和收敛判断。",
    difficulty: "advanced",
    estimatedHours: 8,
    relatedTopics: ["k-means", "clustering", "reproduction"],
    milestones: [
      {
        title: "初始化中心点",
        task: "从数据集中选择 k 个初始中心。",
        codePrompt: "实现 init_centroids(points, k, seed=0) -> list。",
        reflectionPrompt: "随机初始化为什么会影响最终结果？",
        relatedTopics: ["initialization", "randomness"],
      },
      {
        title: "分配样本到簇",
        task: "把每个点分到最近中心。",
        codePrompt: "实现 assign_clusters(points, centroids) -> list[int]。",
        reflectionPrompt: "分配步骤的时间复杂度是多少？",
        relatedTopics: ["clustering", "complexity"],
      },
      {
        title: "更新中心并判断收敛",
        task: "根据簇内均值更新中心，直到变化很小。",
        codePrompt: "实现 update_centroids(points, labels, k) 和 has_converged(old, new)。",
        reflectionPrompt: "空簇应该如何处理？",
        relatedTopics: ["mean", "convergence"],
      },
    ],
  },
];

const PROJECT_TYPES = new Set<ProjectType>(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]);

export function normalizeProjectType(value: string): ProjectType {
  return PROJECT_TYPES.has(value as ProjectType) ? (value as ProjectType) : "python_basics";
}

export function calculateProjectProgress(milestones: Array<{ status: string }>): ProjectProgress {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const remaining = Math.max(total - completed, 0);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return {
    total,
    completed,
    remaining,
    percent,
    isComplete: total > 0 && completed === total,
  };
}

export function getProjectTemplate(slug: string) {
  return DEFAULT_PROJECT_TEMPLATES.find((project) => project.slug === slug) ?? null;
}

export function buildProjectCompletionSummary(args: {
  title: string;
  type: ProjectType;
  completedMilestones: Array<{
    title: string;
    reflection?: string | null;
    code?: string | null;
    note?: string | null;
  }>;
}) {
  const codeCount = args.completedMilestones.filter((m) => Boolean(m.code?.trim())).length;
  const noteCount = args.completedMilestones.filter(
    (m) => Boolean(m.note?.trim()) || Boolean(m.reflection?.trim()),
  ).length;
  const milestoneLines = args.completedMilestones
    .map((m, index) => `${index + 1}. ${m.title}`)
    .join("\n");

  return [
    `# 项目总结：${args.title}`,
    "",
    `类型：${PROJECT_TYPE_LABELS[args.type]}`,
    `完成里程碑：${args.completedMilestones.length}`,
    `代码产物：${codeCount}`,
    `笔记/反思：${noteCount}`,
    "",
    "## 已完成里程碑",
    milestoneLines || "- 暂无",
    "",
    "## 关键沉淀",
    "这次项目把知识学习推进到可运行产物。后续复习时优先回看代码里的边界处理、测试用例和反思记录。",
    "",
    "## 下一步",
    "选择一个更贴近真实工程的小项目，继续把概念、代码实现和复盘卡片连起来。",
  ].join("\n");
}

export function buildProjectCompletionFlashcards(args: {
  projectId: string;
  userId: string;
  title: string;
  type: ProjectType;
  summary: string;
  now?: Date;
  completedMilestones: Array<{
    title: string;
    reflection?: string | null;
    code?: string | null;
    note?: string | null;
  }>;
}) {
  const now = args.now ?? new Date();
  const tags = ["project", args.type];
  const cards = [
    {
      id: `project:${args.projectId}:summary`,
      front: `项目复盘：${args.title} 最核心的收获是什么？`,
      back: args.summary,
      type: "project",
      tags,
    },
  ];

  for (const [index, milestone] of args.completedMilestones.slice(0, 5).entries()) {
    const evidence = [
      milestone.reflection?.trim(),
      milestone.note?.trim(),
      milestone.code?.trim() ? "包含代码产物。" : null,
    ].filter(Boolean).join("\n");

    cards.push({
      id: `project:${args.projectId}:milestone-${index + 1}`,
      front: `项目里程碑：${milestone.title} 解决了什么？`,
      back: evidence || `这个里程碑服务于项目「${args.title}」的完整实现。`,
      type: "project",
      tags,
    });
  }

  return cards.map((card) => ({
    ...card,
    userId: args.userId,
    lessonId: null,
    dueAt: now,
  }));
}
