import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  buildKnowledgeCardsFromFocus,
  dailyBreadthRotationForLocalDate,
  selectDailyKnowledgeFocus,
} from "@/server/knowledge/daily-breadth";
import { getOrCreateTodayPlan } from "@/server/lesson/daily-plan";

async function seedKnowledgeFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const termSlug = `rag-${suffix}`;
  const alternateTermSlug = `embedding-${suffix}`;
  const personSlug = `person-${suffix}`;
  const alternatePersonSlug = `alt-person-${suffix}`;
  const benchmarkSlug = `bench-${suffix}`;

  const termData = {
    abbreviation: "RAG",
    fullName: "Retrieval-Augmented Generation",
    chineseName: "检索增强生成",
    category: "retrieval",
    oneLine: "先检索再生成。",
    explanation: "RAG 用外部资料约束回答。",
    whyImportant: "它降低过期知识和幻觉风险。",
    relatedTerms: ["Embedding"],
    commonMistakes: ["以为向量库等于 RAG"],
    examples: ["检索文档后回答"],
    sourceRefs: [{ title: "RAG", url: "https://arxiv.org/abs/2005.11401" }],
    difficulty: "beginner",
  };
  await prisma.glossaryTerm.create({ data: { slug: termSlug, ...termData } });
  await prisma.glossaryTerm.create({
    data: {
      slug: alternateTermSlug,
      ...termData,
      abbreviation: "Embedding",
      fullName: "Embedding",
      oneLine: "把离散对象映射成向量表示。",
      explanation: "Embedding 把 token、文档或实体转成可比较的向量。",
    },
  });
  await prisma.knowledgeEntity.createMany({
    data: [
      {
        type: "person",
        name: `Shunyu Yao ${suffix}`,
        slug: personSlug,
        aliases: ["姚顺雨"],
        oneLine: "Agent 研究者。",
        whyImportant: "连接推理、行动和反思。",
        representativeWorks: ["ReAct"],
        relatedTerms: ["Agent"],
        timeline: [{ year: "2022", event: "ReAct" }],
        sourceRefs: [{ title: "Homepage", url: "https://ysymyth.github.io/" }],
        lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
        confidence: "high",
        selfCheckQuestion: "ReAct 解决什么问题？",
      },
      {
        type: "person",
        name: `Andrej Karpathy ${suffix}`,
        slug: alternatePersonSlug,
        aliases: ["Karpathy"],
        oneLine: "AI 教育与工程实践代表人物。",
        whyImportant: "善于把深度学习和工程直觉讲清楚。",
        representativeWorks: ["nanoGPT"],
        relatedTerms: ["Transformer"],
        timeline: [{ year: "2023", event: "LLM teaching materials" }],
        sourceRefs: [{ title: "Homepage", url: "https://karpathy.ai/" }],
        lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
        confidence: "high",
        selfCheckQuestion: "nanoGPT 为什么适合教学？",
      },
      {
        type: "benchmark",
        name: `SWE-bench ${suffix}`,
        slug: benchmarkSlug,
        aliases: ["SWE Bench"],
        oneLine: "真实 issue 修复 benchmark。",
        whyImportant: "更接近真实软件工程。",
        representativeWorks: ["SWE-bench Verified"],
        relatedTerms: ["Agent"],
        timeline: [{ year: "2023", event: "SWE-bench" }],
        sourceRefs: [{ title: "SWE-bench", url: "https://www.swebench.com/" }],
        lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
        confidence: "high",
        selfCheckQuestion: "它为什么比 HumanEval 更真实？",
      },
    ],
  });

  return { termSlug, alternateTermSlug, personSlug, alternatePersonSlug, benchmarkSlug };
}

async function createRecentKnowledgePlan(args: {
  userId: string;
  localDate: string;
  termSlug?: string;
  entitySlug?: string;
}) {
  await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {},
    create: { userId: args.userId },
  });
  const domain = await prisma.domain.upsert({
    where: { slug: `knowledge-test-${args.userId}` },
    update: {},
    create: {
      slug: `knowledge-test-${args.userId}`,
      name: "Knowledge Test",
    },
  });
  const topic = await prisma.topic.upsert({
    where: { slug: `knowledge-test-topic-${args.userId}` },
    update: {},
    create: {
      slug: `knowledge-test-topic-${args.userId}`,
      title: "Knowledge Test Topic",
      domainId: domain.id,
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Recent Knowledge",
      summary: "Recent knowledge selection history.",
      contentMarkdown: "Recent knowledge selection history.",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      connections: {
        glossary: args.termSlug ? { sourceSlug: args.termSlug } : null,
        breadth: args.entitySlug ? { sourceSlug: args.entitySlug } : null,
      },
    },
  });
  await prisma.dailyPlan.create({
    data: {
      userId: args.userId,
      lessonId: lesson.id,
      date: new Date(`${args.localDate}T00:00:00.000Z`),
      localDate: args.localDate,
      status: "planned",
      isTest: true,
      source: "test",
    },
  });
}

async function seedTemplateKnowledgeFixture() {
  await prisma.glossaryTerm.upsert({
    where: { slug: "self-attention" },
    update: {
      abbreviation: "Self-Attention",
      fullName: "Self-Attention",
      chineseName: "自注意力",
      category: "architecture",
      oneLine: "让序列中每个位置按上下文动态聚合信息。",
      explanation: "Self-Attention 用 Q/K 相似度生成权重，再对 V 做加权和。",
      whyImportant: "它是 Transformer 能捕获长依赖关系的核心机制。",
      relatedTerms: ["Q/K/V", "Transformer", "Softmax"],
      commonMistakes: ["把 attention 误解成外部检索记忆库"],
      examples: ["每个 token 根据全序列上下文更新表示"],
      sourceRefs: [{ title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" }],
      difficulty: "beginner",
    },
    create: {
      slug: "self-attention",
      abbreviation: "Self-Attention",
      fullName: "Self-Attention",
      chineseName: "自注意力",
      category: "architecture",
      oneLine: "让序列中每个位置按上下文动态聚合信息。",
      explanation: "Self-Attention 用 Q/K 相似度生成权重，再对 V 做加权和。",
      whyImportant: "它是 Transformer 能捕获长依赖关系的核心机制。",
      relatedTerms: ["Q/K/V", "Transformer", "Softmax"],
      commonMistakes: ["把 attention 误解成外部检索记忆库"],
      examples: ["每个 token 根据全序列上下文更新表示"],
      sourceRefs: [{ title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" }],
      difficulty: "beginner",
    },
  });

  await prisma.knowledgeEntity.upsert({
    where: { slug: "swe-bench" },
    update: {
      type: "benchmark",
      name: "SWE-bench",
      aliases: ["SWE Bench"],
      oneLine: "真实 issue 修复 benchmark。",
      whyImportant: "它更接近真实软件工程。",
      representativeWorks: ["SWE-bench Verified"],
      relatedTerms: ["Agent", "Code Repair"],
      timeline: [{ year: "2023", event: "SWE-bench" }],
      sourceRefs: [{ title: "SWE-bench", url: "https://www.swebench.com/" }],
      lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
      confidence: "high",
      selfCheckQuestion: "它为什么比 HumanEval 更真实？",
    },
    create: {
      type: "benchmark",
      name: "SWE-bench",
      slug: "swe-bench",
      aliases: ["SWE Bench"],
      oneLine: "真实 issue 修复 benchmark。",
      whyImportant: "它更接近真实软件工程。",
      representativeWorks: ["SWE-bench Verified"],
      relatedTerms: ["Agent", "Code Repair"],
      timeline: [{ year: "2023", event: "SWE-bench" }],
      sourceRefs: [{ title: "SWE-bench", url: "https://www.swebench.com/" }],
      lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
      confidence: "high",
      selfCheckQuestion: "它为什么比 HumanEval 更真实？",
    },
  });

  return { termSlug: "self-attention", benchmarkSlug: "swe-bench" };
}

test("dailyBreadthRotationForLocalDate follows the documented weekly rotation", () => {
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-25"), {
    day: 1,
    focus: "term",
    entityTypes: [],
  });
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-26").entityTypes, ["person"]);
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-27").entityTypes, ["company", "lab"]);
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-28").entityTypes, ["benchmark"]);
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-29").entityTypes, ["paper"]);
  assert.deepEqual(dailyBreadthRotationForLocalDate("2026-05-30").entityTypes, ["tool", "open_source_project"]);
  assert.equal(dailyBreadthRotationForLocalDate("2026-05-31").focus, "review");
});

test("selectDailyKnowledgeFocus picks real glossary and radar records for the rotation", async () => {
  const { termSlug, personSlug, benchmarkSlug } = await seedKnowledgeFixture();

  const monday = await selectDailyKnowledgeFocus({
    userId: "knowledge-user",
    localDate: "2026-05-25",
    preferredTermSlugs: [termSlug],
  });
  assert.equal(monday.glossary?.slug, termSlug);
  assert.equal(monday.breadth?.kind, "concept");
  assert.equal(monday.links.glossary, `/glossary?term=${termSlug}`);
  assert.equal(monday.links.radar, null);

  const tuesday = await selectDailyKnowledgeFocus({
    userId: "knowledge-user",
    localDate: "2026-05-26",
    preferredEntitySlugs: [personSlug],
  });
  assert.equal(tuesday.breadth?.slug, personSlug);
  assert.equal(tuesday.breadth?.kind, "person");
  assert.equal(tuesday.links.radar, `/radar?entity=${personSlug}`);

  const thursday = await selectDailyKnowledgeFocus({
    userId: "knowledge-user",
    localDate: "2026-05-28",
    preferredEntitySlugs: [benchmarkSlug],
  });
  assert.equal(thursday.breadth?.slug, benchmarkSlug);
  assert.equal(thursday.breadth?.kind, "benchmark");
});

test("buildKnowledgeCardsFromFocus overrides generated daily glossary and breadth cards", async () => {
  const { termSlug, benchmarkSlug } = await seedKnowledgeFixture();
  const focus = await selectDailyKnowledgeFocus({
    userId: "knowledge-user",
    localDate: "2026-05-28",
    preferredTermSlugs: [termSlug],
    preferredEntitySlugs: [benchmarkSlug],
  });

  const cards = buildKnowledgeCardsFromFocus(focus);

  assert.equal(cards.glossary.term, "RAG");
  assert.equal(cards.glossary.sourceSlug, termSlug);
  assert.equal(cards.breadth.kind, "benchmark");
  assert.equal(cards.breadth.sourceSlug, benchmarkSlug);
  assert.match(cards.breadth.sourceUrl, /^\/radar\?entity=/);
});

test("selectDailyKnowledgeFocus avoids recently used glossary and radar slugs", async () => {
  const { termSlug, alternateTermSlug, personSlug, alternatePersonSlug } =
    await seedKnowledgeFixture();
  const userId = `knowledge-avoid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await createRecentKnowledgePlan({
    userId,
    localDate: "2026-06-01",
    termSlug,
    entitySlug: personSlug,
  });

  const monday = await selectDailyKnowledgeFocus({
    userId,
    localDate: "2026-06-08",
    preferredTermSlugs: [termSlug, alternateTermSlug],
    avoidRecentDays: 14,
  });
  assert.equal(monday.glossary?.slug, alternateTermSlug);

  const tuesday = await selectDailyKnowledgeFocus({
    userId,
    localDate: "2026-06-09",
    preferredEntitySlugs: [personSlug, alternatePersonSlug],
    avoidRecentDays: 14,
  });
  assert.equal(tuesday.breadth?.slug, alternatePersonSlug);
  assert.equal(tuesday.breadth?.kind, "person");
});

test("getOrCreateTodayPlan stores daily knowledge focus links in lesson connections", async () => {
  const { termSlug, benchmarkSlug } = await seedTemplateKnowledgeFixture();
  const userId = `daily-focus-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      timeZone: "Asia/Shanghai",
      preferredAreas: ["dl"],
    },
    create: {
      userId,
      timeZone: "Asia/Shanghai",
      preferredAreas: ["dl"],
    },
  });

  const plan = await getOrCreateTodayPlan({
    userId,
    now: new Date("2026-05-28T04:00:00.000Z"),
    isTest: true,
  });
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: plan.lessonId },
    select: { connections: true },
  });
  const connections = lesson.connections as {
    glossary?: { sourceSlug?: string; sourceUrl?: string | null };
    breadth?: { sourceSlug?: string; sourceUrl?: string | null };
    knowledgeFocus?: {
      rotation?: { focus?: string };
      links?: { glossary?: string | null; radar?: string | null };
    };
  };

  assert.equal(connections.glossary?.sourceSlug, termSlug);
  assert.equal(connections.glossary?.sourceUrl, `/glossary?term=${termSlug}`);
  assert.equal(connections.breadth?.sourceSlug, benchmarkSlug);
  assert.equal(connections.breadth?.sourceUrl, `/radar?entity=${benchmarkSlug}`);
  assert.equal(connections.knowledgeFocus?.rotation?.focus, "benchmark");
  assert.equal(connections.knowledgeFocus?.links?.glossary, `/glossary?term=${termSlug}`);
  assert.equal(connections.knowledgeFocus?.links?.radar, `/radar?entity=${benchmarkSlug}`);
});
