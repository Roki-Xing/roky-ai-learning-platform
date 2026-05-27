export type SeedDomain = {
  slug: string;
  name: string;
  description?: string;
  weight?: number;
  topics: SeedTopic[];
};

export type SeedTopic = {
  slug: string;
  title: string;
  summary?: string;
  depthLevel?: number;
  prerequisites?: string[];
  children?: SeedTopic[];
};

export const DEFAULT_DOMAINS: SeedDomain[] = [
  {
    slug: "ai-fundamentals",
    name: "AI 基础",
    description: "数学直觉、机器学习基础、模型训练与评估",
    weight: 12,
    topics: [
      { slug: "ai-roadmap", title: "AI 学习路线" },
      { slug: "linear-algebra", title: "线性代数直觉" },
      { slug: "probability", title: "概率与统计直觉" },
      { slug: "optimization", title: "优化与梯度下降" },
    ],
  },
  {
    slug: "python-coding",
    name: "Python / 代码表达",
    description: "Python 基础、调试、函数设计与实现表达",
    weight: 13,
    topics: [
      { slug: "python-functions", title: "函数与类型提示" },
      { slug: "python-lists-dicts", title: "列表与字典" },
      { slug: "python-debugging", title: "调试与边界用例" },
      { slug: "python-comprehensions", title: "推导式与迭代" },
    ],
  },
  {
    slug: "data-structures",
    name: "数据结构",
    description: "数组、哈希表、栈队列、树图等编码基础",
    weight: 12,
    topics: [
      { slug: "arrays-strings", title: "数组与字符串" },
      { slug: "hash-table", title: "哈希表" },
      { slug: "stack-queue", title: "栈与队列" },
      { slug: "tree-graph", title: "树与图" },
    ],
  },
  {
    slug: "algorithm-design",
    name: "算法设计",
    description: "二分、双指针、动态规划、图算法",
    weight: 12,
    topics: [
      { slug: "binary-search", title: "二分搜索" },
      { slug: "two-pointers", title: "双指针" },
      { slug: "dynamic-programming", title: "动态规划" },
      { slug: "graph-search", title: "图搜索" },
    ],
  },
  {
    slug: "ml",
    name: "机器学习",
    description: "监督学习、泛化、特征、损失函数与评估",
    weight: 10,
    topics: [
      { slug: "supervised", title: "监督学习" },
      { slug: "generalization", title: "泛化与过拟合" },
      { slug: "loss-functions", title: "损失函数" },
      { slug: "features", title: "特征工程与表示" },
    ],
  },
  {
    slug: "dl",
    name: "深度学习",
    description: "神经网络、Transformer、Diffusion、强化学习",
    weight: 10,
    topics: [
      { slug: "nn-basics", title: "神经网络基础" },
      { slug: "transformer", title: "Transformer" },
      { slug: "diffusion", title: "Diffusion" },
      { slug: "rl", title: "强化学习（RL）" },
    ],
  },
  {
    slug: "llm-rag-agent",
    name: "LLM / RAG / Agent",
    description: "Prompt、RAG、工具调用、Agent 与评估",
    weight: 13,
    topics: [
      { slug: "prompting", title: "Prompt Engineering" },
      { slug: "rag", title: "RAG" },
      { slug: "react-agent", title: "ReAct Agent" },
      { slug: "llm-evaluation", title: "LLM Evaluation" },
    ],
  },
  {
    slug: "ai-engineering",
    name: "AI 工程",
    description: "数据、训练、推理、部署、成本与可靠性",
    weight: 10,
    topics: [
      { slug: "data-pipeline", title: "数据管线" },
      { slug: "training", title: "训练流程" },
      { slug: "inference", title: "推理服务" },
      { slug: "deployment", title: "部署与监控" },
      { slug: "cost", title: "成本优化" },
    ],
  },
  {
    slug: "papers-benchmarks",
    name: "论文 / Benchmark",
    description: "经典论文、近期论文、评测集与读论文方法",
    weight: 9,
    topics: [
      { slug: "paper-reading", title: "论文阅读方法" },
      { slug: "swe-bench", title: "SWE-bench" },
      { slug: "humaneval", title: "HumanEval" },
      { slug: "mmlu-gpqa", title: "MMLU / GPQA" },
    ],
  },
  {
    slug: "people-companies-tools",
    name: "人物 / 公司 / 工具",
    description: "AI 生态中的人物、公司、工具与产业线索",
    weight: 8,
    topics: [
      { slug: "openai", title: "OpenAI" },
      { slug: "anthropic", title: "Anthropic" },
      { slug: "deepmind", title: "Google DeepMind" },
      { slug: "huggingface", title: "Hugging Face" },
      { slug: "cursor", title: "Cursor" },
    ],
  },
  {
    slug: "review-remediation",
    name: "复盘 / 错误本",
    description: "错题复盘、概念混淆修复与知识巩固",
    weight: 11,
    topics: [
      { slug: "mistake-review", title: "错误复盘方法" },
      { slug: "misconception-repair", title: "概念混淆修复" },
      { slug: "active-recall", title: "主动回忆" },
      { slug: "spaced-repetition", title: "间隔重复" },
    ],
  },
  {
    slug: "projects",
    name: "小项目 / 工程实践",
    description: "把学习内容落到可运行项目、脚本和工具中",
    weight: 10,
    topics: [
      { slug: "cli-tool", title: "CLI 小工具" },
      { slug: "web-app", title: "Web App MVP" },
      { slug: "ai-workflow", title: "AI 工作流自动化" },
      { slug: "testing-debugging", title: "测试与调试" },
    ],
  },
];
