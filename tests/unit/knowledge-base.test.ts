import test from "node:test";
import assert from "node:assert/strict";
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
