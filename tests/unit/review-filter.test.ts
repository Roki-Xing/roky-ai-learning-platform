import test from "node:test";
import assert from "node:assert/strict";
import {
  REVIEW_SOURCES,
  STANDALONE_REVIEW_SOURCE_TAGS,
  buildReviewableFlashcardWhere,
  hasStandaloneReviewSourceTag,
  normalizeReviewSource,
} from "@/server/review/filter";

test("standalone review source tags include independent card sources", () => {
  assert.ok(STANDALONE_REVIEW_SOURCE_TAGS.includes("glossary"));
  assert.ok(STANDALONE_REVIEW_SOURCE_TAGS.includes("radar"));
  assert.ok(STANDALONE_REVIEW_SOURCE_TAGS.includes("voice-note"));
  assert.ok(STANDALONE_REVIEW_SOURCE_TAGS.includes("thought-review"));
  assert.ok(STANDALONE_REVIEW_SOURCE_TAGS.includes("project"));
  assert.equal(STANDALONE_REVIEW_SOURCE_TAGS.includes("code-feedback" as never), false);
});

test("hasStandaloneReviewSourceTag accepts only known independent card sources", () => {
  assert.equal(hasStandaloneReviewSourceTag(["glossary", "rag"]), true);
  assert.equal(hasStandaloneReviewSourceTag(["radar", "benchmark"]), true);
  assert.equal(hasStandaloneReviewSourceTag(["misc"]), false);
  assert.equal(hasStandaloneReviewSourceTag(null), false);
});

test("buildReviewableFlashcardWhere keeps official lesson cards and tagged standalone cards", () => {
  const where = buildReviewableFlashcardWhere("demo-user");

  assert.equal(where.userId, "demo-user");
  assert.ok(Array.isArray(where.OR));
  assert.equal(where.OR.length, STANDALONE_REVIEW_SOURCE_TAGS.length + 1);
  assert.deepEqual(where.OR.at(1), {
    lessonId: null,
    tags: { array_contains: ["glossary"] },
  });
});

test("normalizeReviewSource accepts only supported review sources", () => {
  assert.ok(REVIEW_SOURCES.includes("code-feedback"));
  assert.equal(normalizeReviewSource("project"), "project");
  assert.equal(normalizeReviewSource("code-feedback"), "code-feedback");
  assert.equal(normalizeReviewSource("glossary"), "glossary");
  assert.equal(normalizeReviewSource("lesson"), null);
  assert.equal(normalizeReviewSource(undefined), null);
});

test("buildReviewableFlashcardWhere can target one project queue", () => {
  const where = buildReviewableFlashcardWhere("demo-user", {
    source: "project",
    projectId: "project-123",
  });

  assert.deepEqual(where, {
    userId: "demo-user",
    lessonId: null,
    tags: { array_contains: ["project"] },
    id: { startsWith: "project:project-123:" },
  });
});

test("buildReviewableFlashcardWhere keeps thought review queue independent of lesson binding", () => {
  const where = buildReviewableFlashcardWhere("demo-user", {
    source: "thought-review",
  });

  assert.deepEqual(where, {
    userId: "demo-user",
    tags: { array_contains: ["thought-review"] },
  });
});
