export type DailyPlanTemplate = {
  schemaVersion: string;
  lesson: {
    title: string;
    summary: string;
    contentMarkdown: string;
    objectives: string[];
    keyTerms: string[];
    guidedSteps: Array<{
      type:
        | "activation"
        | "intuition"
        | "concept"
        | "example"
        | "micro_question"
        | "pseudocode"
        | "coding"
        | "quiz"
        | "reflection";
      title: string;
      content: string;
      question?: string;
      expectedAnswer?: string;
      hints?: string[];
    }>;
  };
  quiz: Array<{
    type: "single_choice" | "multi_choice" | "true_false";
    question: string;
    options?: string[];
    answer: unknown;
    explanation: string;
  }>;
  codingExercise: {
    language: "python" | "typescript";
    title: string;
    prompt: string;
    starterCode: string;
    referenceSolution: string;
    visibleTests: Array<{ input: string; expectedOutput: string }>;
    expectedComplexity: string;
    commonBugs?: string[];
    hints?: string[];
  };
  glossary: {
    term: string;
    oneLine: string;
    definition: string;
    whyItMatters: string;
    relatedTerms?: string[];
    commonMistakes?: string[];
    selfCheckQuestion: string;
  };
  breadth: {
    kind: "person" | "company" | "paper" | "benchmark" | "tool" | "concept";
    title: string;
    oneLine: string;
    whyItMatters: string;
    representativeWorks?: string[];
    relatedTerms?: string[];
    selfCheckQuestion: string;
  };
  flashcards: Array<{ front: string; back: string; type?: string; tags?: string[] }>;
  reflectionPrompt?: string;
  nextRecommendation?: string;
};

const TEMPLATE_BY_TOPIC_SLUG: Record<string, DailyPlanTemplate> = {
  transformer: {
    schemaVersion: "2.3",
    lesson: {
      title: "Transformer 的最小工作原理",
      summary: "用 30 分钟建立一个可复述的 Transformer 心智模型：Attention 做了什么、为什么有效、常见误区。",
      contentMarkdown: [
        "# Transformer 的最小工作原理",
        "",
        "## Why it matters",
        "Transformer 是现代 LLM 的通用骨架。你不需要背公式，但要能解释：模型如何让每个 token 看到上下文，并在训练/推理时复用这个机制。",
        "",
        "## 核心概念",
        "- **Token**: 文本被切成 token。模型一次处理一个序列。",
        "- **Embedding**: 把 token id 映射到向量。",
        "- **Self-Attention**: 让每个位置根据上下文动态聚合信息。",
        "- **FFN**: 在每个位置做非线性变换，提供表达能力。",
        "- **Residual + LayerNorm**: 让深层训练稳定。",
        "",
        "## 直觉版 Self-Attention",
        "对每个 token 生成三组向量：Q/K/V。某个位置 i 的输出 = 对所有位置 j 的 V_j 做加权和，权重来自 Q_i 与 K_j 的相似度。",
        "",
        "## 常见误区",
        "- Attention 不是记忆库，它只是一次加权聚合。",
        "- Multi-head 不是为了更多参数，而是为了并行捕获不同关系。",
        "",
        "## Connections",
        "- RAG: 用外部检索补充上下文，但最终仍由 attention 融合。",
        "- Evaluation: 在 SWE-bench 等任务上，attention 的上下文窗口和工具调用决定了可达上限。",
      ].join("\n"),
      objectives: [
        "能用自己的话解释 Self-Attention 是什么",
        "知道 residual/LayerNorm 的作用",
        "能指出 2 个常见误区",
      ],
      keyTerms: ["Token", "Embedding", "Self-Attention", "Multi-Head", "Residual", "LayerNorm"],
      guidedSteps: [
        {
          type: "activation",
          title: "激活已有直觉",
          content: "用一句话写下：Transformer 想解决什么问题？",
          question: "Transformer 想解决什么问题？",
          expectedAnswer: "能让序列每个位置利用全局上下文进行表示学习，捕获长依赖。",
          hints: ["关键词：序列、上下文、长依赖"],
        },
        {
          type: "intuition",
          title: "Attention 的直觉",
          content: "用自己的话解释：Self-Attention 的输入/输出分别是什么？",
          question: "Self-Attention 的输入/输出是什么？",
          expectedAnswer: "输入是序列向量（embedding）；输出是每个位置对全序列 V 的加权和。",
          hints: ["输出是“加权和”而不是“选择一个 token”"],
        },
        {
          type: "concept",
          title: "Multi-Head 的意义",
          content: "回答：为什么需要 Multi-Head？给出 1 个直觉解释。",
          question: "为什么需要 Multi-Head？",
          expectedAnswer: "不同 head 在不同子空间捕获不同关系模式。",
          hints: ["不是“只是更多参数”"],
        },
        {
          type: "micro_question",
          title: "纠正一个常见误区",
          content: "做一道判断：Attention 是否等价于“检索记忆库”？",
          question: "Attention 是否等价于“检索记忆库”？",
          expectedAnswer: "不等价；它是一次对输入序列的加权聚合。",
          hints: ["对比：RAG 的检索 vs Attention 的聚合"],
        },
        {
          type: "reflection",
          title: "写下自己的澄清",
          content: "写下你最容易混淆的一点，并给出一个反例或澄清。",
          hints: ["例如：Multi-Head 的作用、Residual 的作用、Attention 与检索的区别"],
        },
      ],
    },
    quiz: [
      {
        type: "single_choice",
        question: "Self-Attention 的核心输出形式最接近哪一种？",
        options: [
          "对所有 token 的 V 做加权和，权重由 Q 与 K 的相似度决定",
          "对所有 token 的 embedding 做平均",
          "对序列做卷积",
          "只看相邻 token",
        ],
        answer: 0,
        explanation: "Attention 的关键是动态加权，权重来自 Q/K 相似度。",
      },
      {
        type: "true_false",
        question: "Multi-Head Attention 的主要目的只是增加参数量。",
        answer: false,
        explanation: "主要价值是并行捕获不同关系子空间（不同 head 学不同模式）。",
      },
      {
        type: "single_choice",
        question: "Residual + LayerNorm 在训练中最主要帮助是什么？",
        options: ["提升可解释性", "让深层网络更稳定、梯度更顺畅", "减少 token 数量"],
        answer: 1,
        explanation: "残差与归一化主要用于稳定训练、提高可训练性。",
      },
    ],
    codingExercise: {
      language: "python",
      title: "实现 Softmax（简化版）",
      prompt:
        "实现一个简化版 softmax，并用它把一组打分转换成概率分布（不需要考虑数值稳定性）。输入: List[float]，输出: List[float]，且和为 1。",
      starterCode: [
        "from typing import List",
        "",
        "def softmax(scores: List[float]) -> List[float]:",
        "    # TODO: implement",
        "    return scores",
      ].join("\n"),
      referenceSolution: [
        "from typing import List",
        "import math",
        "",
        "def softmax(scores: List[float]) -> List[float]:",
        "    exps = [math.exp(x) for x in scores]",
        "    s = sum(exps)",
        "    return [e / s for e in exps]",
      ].join("\n"),
      visibleTests: [
        { input: "softmax([1, 2])", expectedOutput: "[0.2689, 0.7311] (approx)" },
        { input: "sum(softmax([1, 2]))", expectedOutput: "1.0 (approx)" },
      ],
      expectedComplexity: "Time O(n), Space O(n)",
      commonBugs: ["忘记归一化（除以总和）", "对空数组未约定（可先假设非空）"],
      hints: ["先对每个元素取 exp", "再除以 exp 之和"],
    },
    glossary: {
      term: "Self-Attention",
      oneLine: "让每个位置对全序列做一次“可学习的加权聚合”。",
      definition: "一种让序列中每个位置根据上下文动态聚合信息的机制：输出是对 V 的加权和，权重由 Q 与 K 的相似度决定。",
      whyItMatters: "它让模型能在一个统一架构里处理长依赖关系，是 Transformer 的核心。",
      relatedTerms: ["Query/Key/Value", "Softmax", "Multi-Head Attention"],
      commonMistakes: ["把 Attention 当作“检索外部记忆库”", "以为 Multi-Head 只是增加参数"],
      selfCheckQuestion: "如果没有 Softmax，注意力权重会发生什么直观变化？",
    },
    breadth: {
      kind: "benchmark",
      title: "SWE-bench",
      oneLine: "面向真实软件工程修复的评测集合，衡量 coding agent 的实际修复能力。",
      whyItMatters: "它更接近真实工程工作流（定位 bug、修改代码、跑测试），能暴露“只会聊天不会修复”的差距。",
      representativeWorks: ["SWE-bench (original)", "SWE-bench Verified"],
      relatedTerms: ["Agent", "Tool Use", "Evaluation"],
      selfCheckQuestion: "为什么 SWE-bench 比纯算法题更能反映工程能力？",
    },
    flashcards: [
      {
        front: "Self-Attention 的输出形式是什么？",
        back: "对所有位置的 V 做加权和；权重来自当前位置 Q 与各位置 K 的相似度（softmax 后）。",
        type: "concept",
        tags: ["transformer"],
      },
      {
        front: "Residual + LayerNorm 在 Transformer 里的作用？",
        back: "稳定深层训练、改善梯度流动，让网络更易优化。",
        type: "concept",
        tags: ["transformer"],
      },
      {
        front: "Multi-Head Attention 为什么有用？",
        back: "不同 head 能在不同子空间捕获不同关系模式（并行注意力），不只是增加参数。",
        type: "concept",
        tags: ["transformer"],
      },
    ],
  },
};

export function pickDailyTemplate(args: { topicSlug?: string | null }) {
  const slug = args.topicSlug ?? null;
  if (slug && TEMPLATE_BY_TOPIC_SLUG[slug]) return TEMPLATE_BY_TOPIC_SLUG[slug];
  return TEMPLATE_BY_TOPIC_SLUG.transformer;
}
