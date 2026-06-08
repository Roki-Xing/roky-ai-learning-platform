import test from "node:test";
import assert from "node:assert/strict";
import {
  summarizeDuplicateDailyPlanTopics,
  summarizeFlashcardQuality,
  summarizeKnowledgeVerificationQueue,
} from "@/server/admin/content-review";

test("summarizeDuplicateDailyPlanTopics builds an admin duplicate-topic queue", () => {
  const plans = [
    {
      id: "plan-1",
      localDate: "2026-06-06",
      selectedDomain: "llm-rag-agent",
      selectedTopic: "rag",
      lessonTitle: "RAG 入门",
      status: "completed",
      source: "deepseek",
      isTest: false,
      archivedAt: null,
    },
    {
      id: "plan-2",
      localDate: "2026-06-05",
      selectedDomain: "llm-rag-agent",
      selectedTopic: "RAG",
      lessonTitle: "RAG 复习",
      status: "planned",
      source: "deepseek",
      isTest: false,
      archivedAt: null,
    },
    {
      id: "plan-3",
      localDate: "2026-06-04",
      selectedDomain: "llm-rag-agent",
      selectedTopic: null,
      lessonTitle: "Vector Database",
      status: "planned",
      source: "template",
      isTest: true,
      archivedAt: null,
    },
    {
      id: "plan-4",
      localDate: "2026-06-03",
      selectedDomain: "llm-rag-agent",
      selectedTopic: "Vector Database",
      lessonTitle: "Vector Database",
      status: "completed",
      source: "deepseek",
      isTest: false,
      archivedAt: null,
    },
    {
      id: "plan-5",
      localDate: "2026-05-20",
      selectedDomain: "llm-rag-agent",
      selectedTopic: "rag",
      lessonTitle: "RAG archived",
      status: "completed",
      source: "deepseek",
      isTest: false,
      archivedAt: new Date("2026-05-21T00:00:00.000Z"),
    },
  ];

  const summary = summarizeDuplicateDailyPlanTopics(plans);

  assert.equal(summary.scannedCount, 5);
  assert.equal(summary.duplicateTopicCount, 2);
  assert.equal(summary.repeatedPlanCount, 4);
  assert.deepEqual(
    summary.reviewItems.map((item) => [item.topicLabel, item.count, item.dateRange]),
    [
      ["rag", 2, "2026-06-05 -> 2026-06-06"],
      ["vector database", 2, "2026-06-03 -> 2026-06-04"],
    ],
  );
  assert.deepEqual(summary.reviewItems[0]?.planIds, ["plan-1", "plan-2"]);
  assert.match(summary.reviewItems[0]?.reasons.join(" / ") ?? "", /重复主题|最近 2 次/);
});

test("summarizeFlashcardQuality surfaces long, short, duplicate, untagged, and unreviewed cards", () => {
  const now = new Date("2026-06-03T00:00:00.000Z");
  const cards = [
    {
      id: "card-1",
      front: "What is RAG?",
      back: "Retrieval-Augmented Generation connects a retriever with a generator.",
      tags: ["rag"],
      reviewCount: 1,
      type: "concept",
      lessonId: "lesson-1",
      createdAt: now,
    },
    {
      id: "card-2",
      front: "What is RAG?",
      back: "Same duplicate prompt.",
      tags: ["rag"],
      reviewCount: 0,
      type: "concept",
      lessonId: "lesson-2",
      createdAt: now,
    },
    {
      id: "card-3",
      front: "Explain ".repeat(30),
      back: "Too short",
      tags: [],
      reviewCount: 0,
      type: "concept",
      lessonId: null,
      createdAt: now,
    },
  ];

  const summary = summarizeFlashcardQuality(cards);

  assert.equal(summary.scannedCount, 3);
  assert.equal(summary.duplicateFrontCount, 2);
  assert.equal(summary.longCardCount, 1);
  assert.equal(summary.shortAnswerCount, 2);
  assert.equal(summary.missingTagsCount, 1);
  assert.equal(summary.unreviewedCount, 2);
  assert.deepEqual(
    summary.reviewItems.map((item) => item.id),
    ["card-3", "card-2", "card-1"],
  );
  assert.match(summary.reviewItems[0]?.reasons.join(" / ") ?? "", /过长|答案过短|缺少 tags|从未复习/);
});

test("summarizeKnowledgeVerificationQueue builds glossary and radar source review queues", () => {
  const now = new Date("2026-06-03T00:00:00.000Z");
  const summary = summarizeKnowledgeVerificationQueue({
    now,
    glossaryTerms: [
      {
        id: "term-1",
        slug: "rag",
        fullName: "Retrieval-Augmented Generation",
        category: "RAG",
        sourceRefs: [{ title: "RAG paper", url: "https://example.com/rag" }],
        updatedAt: now,
      },
      {
        id: "term-2",
        slug: "mcp",
        fullName: "Model Context Protocol",
        category: "Agent",
        sourceRefs: [],
        updatedAt: now,
      },
    ],
    radarEntities: [
      {
        id: "entity-1",
        slug: "swe-bench",
        name: "SWE-bench",
        type: "benchmark",
        confidence: "high",
        sourceRefs: [{ title: "SWE-bench", url: "https://example.com/swe-bench" }],
        lastVerifiedAt: new Date("2026-05-30T00:00:00.000Z"),
        updatedAt: now,
      },
      {
        id: "entity-2",
        slug: "old-paper",
        name: "Old Paper",
        type: "paper",
        confidence: "medium",
        sourceRefs: [{ title: "Paper", url: "https://example.com/paper" }],
        lastVerifiedAt: new Date("2025-12-01T00:00:00.000Z"),
        updatedAt: now,
      },
      {
        id: "entity-3",
        slug: "unknown-tool",
        name: "Unknown Tool",
        type: "tool",
        confidence: "low",
        sourceRefs: [],
        lastVerifiedAt: null,
        updatedAt: now,
      },
    ],
  });

  assert.equal(summary.glossaryMissingSourceCount, 1);
  assert.equal(summary.radarMissingSourceCount, 1);
  assert.equal(summary.radarStaleVerificationCount, 1);
  assert.equal(summary.radarLowConfidenceCount, 1);
  assert.deepEqual(
    summary.reviewItems.map((item) => [item.kind, item.slug]),
    [
      ["radar", "unknown-tool"],
      ["radar", "old-paper"],
      ["glossary", "mcp"],
    ],
  );
  assert.match(summary.reviewItems[0]?.reasons.join(" / ") ?? "", /缺少来源|未验证|低置信度/);
});
