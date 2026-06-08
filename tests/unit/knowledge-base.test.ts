import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildEntityFlashcard,
  buildGlossaryFlashcard,
  buildKnowledgeLink,
  DEFAULT_GLOSSARY_TERMS,
  DEFAULT_KNOWLEDGE_ENTITIES,
  knowledgeEntityVerificationBadge,
  knowledgeEntityVerificationTags,
  normalizeSlug,
} from "@/server/knowledge/base";
import {
  DEFAULT_KNOWLEDGE_PATHS,
  buildKnowledgePathProgress,
} from "@/server/knowledge/paths";
import { buildRadarRelationGroups } from "@/server/knowledge/radar-relations";

test("default glossary terms cover Sprint 5 seed terms with unique slugs", () => {
  assert.ok(DEFAULT_GLOSSARY_TERMS.length >= 20);
  assert.ok(DEFAULT_GLOSSARY_TERMS.some((term) => term.slug === "rag"));
  assert.ok(DEFAULT_GLOSSARY_TERMS.some((term) => term.slug === "swe-bench"));
  assert.ok(DEFAULT_GLOSSARY_TERMS.every((term) => term.fullName.length > 0));
  assert.equal(new Set(DEFAULT_GLOSSARY_TERMS.map((term) => term.slug)).size, DEFAULT_GLOSSARY_TERMS.length);
});

test("default knowledge entities cover AI Radar types with source metadata", () => {
  const types = new Set(DEFAULT_KNOWLEDGE_ENTITIES.map((entity) => entity.type));

  for (const type of ["person", "company", "lab", "paper", "benchmark", "tool", "open_source_project"]) {
    assert.equal(types.has(type), true, `missing radar type: ${type}`);
  }

  assert.ok(DEFAULT_KNOWLEDGE_ENTITIES.every((entity) => entity.sourceRefs.length >= 1));
  assert.ok(DEFAULT_KNOWLEDGE_ENTITIES.every((entity) => entity.confidence.length > 0));
  assert.equal(
    new Set(DEFAULT_KNOWLEDGE_ENTITIES.map((entity) => entity.slug)).size,
    DEFAULT_KNOWLEDGE_ENTITIES.length,
  );
});

test("buildKnowledgeLink maps daily cards to detail pages", () => {
  assert.equal(buildKnowledgeLink({ kind: "glossary", slug: "rag" }), "/glossary?term=rag");
  assert.equal(buildKnowledgeLink({ kind: "radar", slug: "swe-bench" }), "/radar?entity=swe-bench");
});

test("flashcard builders use stable ids and compact tags", () => {
  const glossaryCard = buildGlossaryFlashcard({
    userId: "demo-user",
    slug: "rag",
    front: "RAG 是什么？",
    back: "Retrieval-Augmented Generation。",
    tags: ["LLM", "Retrieval"],
  });
  const entityCard = buildEntityFlashcard({
    userId: "demo-user",
    slug: "openai",
    front: "OpenAI 为什么重要？",
    back: "推动 GPT 系列和 ChatGPT 产品化。",
    tags: ["company", "LLM"],
  });

  assert.equal(glossaryCard.id, "glossary:demo-user:rag");
  assert.equal(entityCard.id, "radar:demo-user:openai");
  assert.deepEqual(glossaryCard.tags, ["glossary", "LLM", "Retrieval"]);
  assert.deepEqual(entityCard.tags, ["radar", "company", "LLM"]);
});

test("normalizeSlug keeps stable readable slugs", () => {
  assert.equal(normalizeSlug("SWE-bench"), "swe-bench");
  assert.equal(normalizeSlug("Vector Database"), "vector-database");
  assert.equal(normalizeSlug("  QLoRA  "), "qlora");
});

test("knowledgeEntityVerificationBadge marks unsourced radar entities as needs_verification", () => {
  assert.equal(
    knowledgeEntityVerificationBadge({
      sourceRefs: [],
      lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
      confidence: "medium",
    }),
    "needs_verification",
  );
  assert.equal(
    knowledgeEntityVerificationBadge({
      sourceRefs: [{ title: "Official", url: "https://example.com" }],
      lastVerifiedAt: null,
      confidence: "medium",
    }),
    "needs_verification",
  );
  assert.equal(
    knowledgeEntityVerificationBadge({
      sourceRefs: [{ title: "Official", url: "https://example.com" }],
      lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
      confidence: "high",
    }),
    "verified",
  );
});

test("knowledgeEntityVerificationTags adds needs_verification to radar card tags", () => {
  assert.deepEqual(
    knowledgeEntityVerificationTags({
      sourceRefs: [],
      lastVerifiedAt: null,
      confidence: "low",
    }),
    ["needs_verification", "confidence:low"],
  );
  assert.deepEqual(
    knowledgeEntityVerificationTags({
      sourceRefs: [{ title: "Official", url: "https://example.com" }],
      lastVerifiedAt: new Date("2026-05-24T00:00:00.000Z"),
      confidence: "high",
    }),
    ["verified", "confidence:high"],
  );
});

test("default knowledge paths include glossary and radar learning routes", () => {
  const agentPath = DEFAULT_KNOWLEDGE_PATHS.find((path) => path.id === "agent_path");
  const ragPath = DEFAULT_KNOWLEDGE_PATHS.find((path) => path.id === "rag_path");
  const llmTrainingPath = DEFAULT_KNOWLEDGE_PATHS.find((path) => path.id === "llm_training_path");
  const radarPath = DEFAULT_KNOWLEDGE_PATHS.find((path) => path.id === "ai_industry_path");
  const benchmarkPath = DEFAULT_KNOWLEDGE_PATHS.find((path) => path.id === "benchmark_path");
  const pathIds = DEFAULT_KNOWLEDGE_PATHS.map((path) => path.id);

  assert.deepEqual(pathIds, [
    "agent_path",
    "rag_path",
    "llm_training_path",
    "ai_industry_path",
    "benchmark_path",
  ]);
  assert.ok(agentPath);
  assert.equal(agentPath.kind, "glossary");
  assert.deepEqual(agentPath.slugs, ["cot", "react", "reflexion", "tool-calling", "swe-bench"]);
  assert.ok(ragPath);
  assert.deepEqual(ragPath.slugs, ["embedding", "vector-database", "retriever", "reranker", "rag-evaluation"]);
  assert.ok(llmTrainingPath);
  assert.equal(llmTrainingPath.kind, "glossary");
  assert.deepEqual(llmTrainingPath.slugs, ["pretraining", "sft", "rlhf", "dpo", "rft"]);
  assert.ok(radarPath);
  assert.equal(radarPath.kind, "radar");
  assert.deepEqual(radarPath.slugs, ["openai", "anthropic", "google-deepmind", "meta-ai", "mistral", "deepseek"]);
  assert.ok(benchmarkPath);
  assert.deepEqual(benchmarkPath.slugs, ["humaneval", "swe-bench", "mmlu", "gpqa", "livecodebench"]);
});

test("glossary and radar pages expose every curated learning path", () => {
  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  const radarSource = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.doesNotMatch(glossarySource, /\.slice\(0,\s*2\)/);
  assert.doesNotMatch(radarSource, /\.slice\(0,\s*2\)/);
});

test("glossary page keeps search review and flashcard CTAs mobile friendly", () => {
  const source = readFileSync("src/app/glossary/page.tsx", "utf8");

  assert.match(source, /const glossaryCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /const glossarySearchInputClassName = "min-h-11";/);
  assert.match(
    source,
    /<Input[\s\S]{0,160}name="q"[\s\S]{0,160}placeholder="搜索 CoT \/ RAG \/ SWE-bench"[\s\S]{0,160}defaultValue=\{q\}[\s\S]{0,160}className=\{glossarySearchInputClassName\}[\s\S]{0,40}\/>/,
  );
  assert.match(source, /<Button type="submit" size="sm" className=\{glossaryCtaClassName\}>搜索<\/Button>/);
  assert.match(source, /<form action=\{generateGlossaryFlashcardAction\} className="grid gap-2 sm:flex sm:flex-wrap">/);

  const reviewMatches = source.match(
    /<Button[\s\S]{0,140}className=\{glossaryCtaClassName\}[\s\S]{0,80}<Link href="\/review">去复习<\/Link>/g,
  );
  assert.equal(reviewMatches?.length, 2);

  for (const label of ["生成复习卡片", "复制详情入口"]) {
    const labelIndex = source.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const nearbyButton = source.slice(Math.max(0, labelIndex - 260), labelIndex + 80);
    assert.match(nearbyButton, /className=\{glossaryCtaClassName\}/);
  }
});

test("glossary category filter keeps filter chips mobile friendly", () => {
  const source = readFileSync("src/app/glossary/page.tsx", "utf8");

  assert.match(
    source,
    /const glossaryCategoryFilterLinkClassName =\s*"inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted\/50";/,
  );
  assert.match(source, /className=\{\[\s*glossaryCategoryFilterLinkClassName,/);
  assert.match(source, /<Link\s+href=\{q \? `\/glossary\?q=\$\{encodeURIComponent\(q\)\}` : "\/glossary"\}/);
  assert.doesNotMatch(source, /<Badge asChild variant=\{selectedCategory \? "outline" : "secondary"\}>/);
  assert.doesNotMatch(source, /<Badge[\s\S]{0,120}asChild[\s\S]{0,120}selectedCategory === c\.category/);
});

test("radar page routes visible entity labels through display helpers", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatKnowledgeEntityTypeLabel, "function");
  assert.equal(typeof labels.formatRadarConfidenceLabel, "function");
  assert.equal(typeof labels.formatRadarVerificationLabel, "function");
  assert.equal(labels.formatKnowledgeEntityTypeLabel("open_source_project"), "开源项目");
  assert.equal(labels.formatRadarConfidenceLabel("high"), "可信度：高");
  assert.equal(labels.formatRadarConfidenceLabel("medium"), "可信度：中");
  assert.equal(labels.formatRadarVerificationLabel("verified"), "已核验");
  assert.equal(labels.formatRadarVerificationLabel("needs_verification"), "待核验");

  const source = readFileSync("src/app/radar/page.tsx", "utf8");
  assert.match(source, /formatKnowledgeEntityTypeLabel\(group\.type\)/);
  assert.match(source, /formatKnowledgeEntityTypeLabel\(entity\.type\)/);
  assert.match(source, /formatKnowledgeEntityTypeLabel\(selectedEntity\.type\)/);
  assert.match(source, /formatRadarConfidenceLabel\(selectedEntity\.confidence\)/);
  assert.match(source, /formatRadarVerificationLabel\(verificationBadge\)/);
  assert.doesNotMatch(source, /\{group\.type\} \{group\._count\._all\}/);
  assert.doesNotMatch(source, /\{entity\.type\}/);
  assert.doesNotMatch(source, /\{selectedEntity\.type\}/);
  assert.doesNotMatch(source, /confidence \{selectedEntity\.confidence\}/);
  assert.doesNotMatch(source, /\{verificationBadge\}/);
  assert.doesNotMatch(source, /verified \{selectedEntity\.lastVerifiedAt/);
  assert.doesNotMatch(source, /needs_verification：/);
});

test("glossary category labels are localized on learner-facing knowledge pages", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatGlossaryCategoryLabel, "function");
  assert.equal(labels.formatGlossaryCategoryLabel("agent"), "Agent");
  assert.equal(labels.formatGlossaryCategoryLabel("retrieval"), "检索增强");
  assert.equal(labels.formatGlossaryCategoryLabel("fine-tuning"), "微调");
  assert.equal(labels.formatGlossaryCategoryLabel("unknown-category"), "术语分类");

  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  assert.match(glossarySource, /formatGlossaryCategoryLabel\(c\.category\)/);
  assert.match(glossarySource, /formatGlossaryCategoryLabel\(term\.category\)/);
  assert.match(glossarySource, /formatGlossaryCategoryLabel\(selectedTerm\.category\)/);
  assert.doesNotMatch(glossarySource, /\{c\.category\} \{c\._count\._all\}/);
  assert.doesNotMatch(glossarySource, /<Badge variant="outline">\{term\.category\}<\/Badge>/);
  assert.doesNotMatch(glossarySource, /<Badge variant="secondary">\{selectedTerm\.category\}<\/Badge>/);

  const todaySource = readFileSync("src/app/today/page.tsx", "utf8");
  assert.match(todaySource, /formatGlossaryCategoryLabel\(glossaryDetail\.category\)/);
  assert.doesNotMatch(todaySource, /<Badge variant="outline">\{glossaryDetail\.category\}<\/Badge>/);

  const radarSource = readFileSync("src/app/radar/page.tsx", "utf8");
  assert.match(radarSource, /function formatRadarRelationBadgeLabel/);
  assert.match(radarSource, /formatRadarRelationBadgeLabel\(item\)/);
  assert.doesNotMatch(radarSource, /<Badge variant="outline">\{item\.badge\}<\/Badge>/);
});

test("glossary difficulty labels are localized on the term detail page", async () => {
  const labels = await import("@/app/_lib/home-labels");
  assert.equal(typeof labels.formatGlossaryDifficultyLabel, "function");
  assert.equal(labels.formatGlossaryDifficultyLabel("beginner"), "入门");
  assert.equal(labels.formatGlossaryDifficultyLabel("intermediate"), "进阶");
  assert.equal(labels.formatGlossaryDifficultyLabel("advanced"), "高阶");
  assert.equal(labels.formatGlossaryDifficultyLabel("unknown"), "难度未标记");

  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  assert.match(glossarySource, /formatGlossaryDifficultyLabel\(selectedTerm\.difficulty\)/);
  assert.doesNotMatch(glossarySource, /<Badge variant="outline">\{selectedTerm\.difficulty\}<\/Badge>/);
});

test("radar page keeps search review and flashcard CTAs mobile friendly", () => {
  const source = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.match(source, /const radarCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /const radarSearchInputClassName = "min-h-11";/);
  assert.match(
    source,
    /<Input[\s\S]{0,160}name="q"[\s\S]{0,160}placeholder="搜索 OpenAI \/ SWE-bench \/ Cursor"[\s\S]{0,160}defaultValue=\{q\}[\s\S]{0,160}className=\{radarSearchInputClassName\}[\s\S]{0,40}\/>/,
  );
  assert.match(source, /<Button type="submit" size="sm" className=\{radarCtaClassName\}>搜索<\/Button>/);
  assert.match(source, /<form action=\{generateRadarFlashcardAction\} className="grid gap-2 sm:flex sm:flex-wrap">/);

  const reviewMatches = source.match(
    /<Button[\s\S]{0,140}className=\{radarCtaClassName\}[\s\S]{0,80}<Link href="\/review">去复习<\/Link>/g,
  );
  assert.equal(reviewMatches?.length, 2);

  for (const label of ["生成复习卡片", "复制详情入口"]) {
    const labelIndex = source.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const nearbyButton = source.slice(Math.max(0, labelIndex - 260), labelIndex + 80);
    assert.match(nearbyButton, /className=\{radarCtaClassName\}/);
  }
});

test("radar type filter keeps filter chips mobile friendly", () => {
  const source = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.match(
    source,
    /const radarTypeFilterLinkClassName =\s*"inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted\/50";/,
  );
  assert.match(source, /className=\{\[\s*radarTypeFilterLinkClassName,/);
  assert.match(source, /<Link\s+href=\{q \? `\/radar\?q=\$\{encodeURIComponent\(q\)\}` : "\/radar"\}/);
  assert.doesNotMatch(source, /<Badge asChild variant=\{selectedType \? "outline" : "secondary"\}>/);
  assert.doesNotMatch(source, /<Badge[\s\S]{0,120}asChild[\s\S]{0,120}selectedType === group\.type/);
});

test("glossary and radar result links keep mobile touch targets", () => {
  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  const radarSource = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.match(
    glossarySource,
    /const glossaryResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";/,
  );
  assert.match(
    glossarySource,
    /className=\{\[\s*glossaryResultLinkClassName,\s*active \? "bg-muted" : "hover:bg-muted\/50",\s*\]\.join\(" "\)\}/,
  );
  assert.doesNotMatch(
    glossarySource,
    /className=\{\[\s*"rounded-md border px-3 py-2 text-sm transition-colors",\s*active \? "bg-muted" : "hover:bg-muted\/50",\s*\]\.join\(" "\)\}/,
  );

  assert.match(
    radarSource,
    /const radarResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";/,
  );
  assert.match(
    radarSource,
    /className=\{\[\s*radarResultLinkClassName,\s*active \? "bg-muted" : "hover:bg-muted\/50",\s*\]\.join\(" "\)\}/,
  );
  assert.doesNotMatch(
    radarSource,
    /className=\{\[\s*"rounded-md border px-3 py-2 text-sm transition-colors",\s*active \? "bg-muted" : "hover:bg-muted\/50",\s*\]\.join\(" "\)\}/,
  );
});

test("glossary and radar relation links keep mobile touch targets", () => {
  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  const radarSource = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.match(
    glossarySource,
    /const glossaryRelatedTermLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted\/50";/,
  );
  assert.match(glossarySource, /className=\{glossaryRelatedTermLinkClassName\}/);
  assert.match(glossarySource, /<div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">/);
  assert.doesNotMatch(
    glossarySource,
    /<div className="mt-3 flex flex-wrap gap-2">[\s\S]{0,260}<Badge key=\{t\.slug\} asChild variant="outline">/,
  );

  assert.match(
    radarSource,
    /const radarRelationLinkClassName = "min-h-11 rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted\/50";/,
  );
  assert.match(radarSource, /className=\{radarRelationLinkClassName\}/);
  assert.doesNotMatch(
    radarSource,
    /className="rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted\/50"/,
  );
});

test("glossary and radar source external links keep mobile touch targets", () => {
  const glossarySource = readFileSync("src/app/glossary/page.tsx", "utf8");
  const radarSource = readFileSync("src/app/radar/page.tsx", "utf8");

  assert.match(
    glossarySource,
    /const glossarySourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline";/,
  );
  assert.match(glossarySource, /className=\{glossarySourceLinkClassName\}/);
  assert.doesNotMatch(
    glossarySource,
    /className="text-primary underline-offset-4 hover:underline"/,
  );

  assert.match(
    radarSource,
    /const radarSourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline";/,
  );
  assert.match(radarSource, /className=\{radarSourceLinkClassName\}/);
  assert.doesNotMatch(
    radarSource,
    /className="text-primary underline-offset-4 hover:underline"/,
  );
});

test("buildKnowledgePathProgress marks card and review progress", () => {
  const path = DEFAULT_KNOWLEDGE_PATHS.find((item) => item.id === "agent_path");
  assert.ok(path);

  const progress = buildKnowledgePathProgress({
    path,
    viewedSlugs: new Set(["cot"]),
    generatedCardIds: new Set(["glossary:demo-user:cot", "glossary:demo-user:react"]),
    reviewedCardIds: new Set(["glossary:demo-user:cot"]),
    weakCardIds: new Set(["glossary:demo-user:react"]),
    cardIdForSlug: (slug) => `glossary:demo-user:${slug}`,
  });

  assert.equal(progress.viewedCount, 1);
  assert.equal(progress.cardCount, 2);
  assert.equal(progress.reviewedCount, 1);
  assert.equal(progress.weakCount, 1);
  assert.equal(progress.items[0]?.viewed, true);
  assert.equal(progress.items[0]?.hasCard, true);
  assert.equal(progress.items[0]?.reviewed, true);
  assert.equal(progress.items[1]?.weak, true);
  assert.equal(progress.nextSlug, "react");
  assert.equal(progress.nextStatusLabel, "未掌握");
});

test("buildRadarRelationGroups builds card-chain groups for entities terms papers and benchmarks", () => {
  const groups = buildRadarRelationGroups({
    selectedEntity: {
      slug: "shunyu-yao",
      type: "person",
      name: "Shunyu Yao",
      representativeWorks: ["ReAct"],
      relatedTerms: ["Agent", "SWE-bench"],
    },
    glossaryTerms: [
      {
        slug: "agent",
        fullName: "Agent",
        abbreviation: null,
        category: "agent",
        oneLine: "能规划并调用工具的系统。",
      },
      {
        slug: "swe-bench",
        fullName: "SWE-bench",
        abbreviation: "SWE-bench",
        category: "benchmark",
        oneLine: "真实 issue 修复 benchmark。",
      },
    ],
    entities: [
      {
        slug: "react-paper",
        type: "paper",
        name: "ReAct",
        oneLine: "Reasoning and Acting paper.",
        representativeWorks: [],
        relatedTerms: ["Agent"],
      },
      {
        slug: "swe-bench",
        type: "benchmark",
        name: "SWE-bench",
        oneLine: "Software engineering benchmark.",
        representativeWorks: [],
        relatedTerms: ["Agent"],
      },
      {
        slug: "langchain",
        type: "open_source_project",
        name: "LangChain",
        oneLine: "Agent framework.",
        representativeWorks: ["Agents"],
        relatedTerms: ["Agent"],
      },
    ],
  });

  assert.deepEqual(groups.map((group) => group.title), [
    "相关实体",
    "相关术语",
    "相关论文",
    "相关 Benchmark",
  ]);
  assert.deepEqual(groups.map((group) => group.items.length), [1, 2, 1, 1]);
  assert.equal(groups[0]?.items[0]?.href, "/radar?entity=langchain");
  assert.equal(groups[1]?.items[0]?.href, "/glossary?term=agent");
  assert.equal(groups[2]?.items[0]?.href, "/radar?entity=react-paper");
  assert.equal(groups[3]?.items[0]?.href, "/radar?entity=swe-bench");
});
