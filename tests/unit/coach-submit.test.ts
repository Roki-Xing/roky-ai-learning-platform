import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  createThoughtReview,
  generateFlashcardsForThoughtReview,
  normalizeCoachMode,
} from "@/server/coach/submit";

async function createCoachSubmitFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `coach-submit-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `coach-submit-domain-${suffix}`,
      name: "Coach Submit Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `coach-submit-topic-${suffix}`,
      title: "Coach Submit Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Softmax Coach Lesson",
      summary: "Review softmax thinking.",
      contentMarkdown: "Lesson body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({ data: { userId, timeZone: "Asia/Shanghai" } });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-24T00:00:00.000Z"),
      localDate: "2026-05-24",
      status: "completed",
      isTest: false,
    },
  });

  return { userId, lesson };
}

test("normalizeCoachMode accepts the focused Coach learner input types", () => {
  for (const mode of [
    "concept_question",
    "code_reasoning",
    "mistake_retell",
    "book_question",
    "glossary_term",
  ]) {
    assert.equal(normalizeCoachMode(mode), mode);
  }

  assert.equal(normalizeCoachMode("algorithm_design"), "code_reasoning");
  assert.equal(normalizeCoachMode("industry_radar"), "glossary_term");
  assert.equal(normalizeCoachMode("unknown"), "free_thought");
});

test("createThoughtReview rejects explicit lesson ids outside the current user's visible plans", async () => {
  const { userId } = await createCoachSubmitFixture();
  const other = await createCoachSubmitFixture();

  await assert.rejects(
    () => createThoughtReview({
      userId,
      mode: "concept_question",
      rawText: "我不应该能把 Coach 评审绑定到别人的课程。",
      includeTodayLesson: true,
      lessonId: other.lesson.id,
    }),
    /Lesson not available/,
  );

  const leaked = await prisma.thoughtReview.findFirst({
    where: { userId, lessonId: other.lesson.id },
  });
  assert.equal(leaked, null);
});

test("createThoughtReview saves a structured review linked to the current lesson", async () => {
  const { userId, lesson } = await createCoachSubmitFixture();

  const result = await createThoughtReview({
    userId,
    mode: "concept_question",
    rawText: "我觉得 softmax 只要对每个分数取 exp 后直接返回。",
    includeTodayLesson: true,
    lessonId: lesson.id,
  });

  assert.equal(result.lessonId, lesson.id);
  assert.equal(result.mode, "concept_question");
  assert.ok(result.reviewId);
  assert.match(result.review.mainClaim, /softmax/i);

  const row = await prisma.thoughtReview.findFirstOrThrow({
    where: { id: result.reviewId, userId },
  });
  assert.equal(row.lessonId, lesson.id);
  assert.equal(row.mode, "concept_question");
  assert.match(row.normalizedText ?? "", /softmax/i);
  assert.ok(row.generatedCards);
});

test("createThoughtReview persists high severity coach issues as misconceptions", async () => {
  const { userId, lesson } = await createCoachSubmitFixture();

  const result = await createThoughtReview({
    userId,
    mode: "code_reasoning",
    rawText: "softmax 只要 exp 后直接返回就行。",
    includeTodayLesson: true,
    lessonId: lesson.id,
  });

  const misconception = await prisma.misconception.findUnique({
    where: { sourceKey: `coach:${result.reviewId}:0` },
  });

  assert.ok(misconception);
  assert.equal(misconception.userId, userId);
  assert.equal(misconception.lessonId, lesson.id);
  assert.equal(misconception.topicId, lesson.topicId);
  assert.equal(misconception.localDate, "2026-05-24");
  assert.equal(misconception.source, "coach");
  assert.equal(misconception.status, "open");
  assert.match(misconception.summary, /归一化|Normalization|实现|Softmax/i);
});

test("generateFlashcardsForThoughtReview is idempotent and updates generated card metadata", async () => {
  const { userId, lesson } = await createCoachSubmitFixture();
  const result = await createThoughtReview({
    userId,
    mode: "code_reasoning",
    rawText: "softmax 只要 exp 后直接返回就行。",
    includeTodayLesson: true,
    lessonId: lesson.id,
  });

  const first = await generateFlashcardsForThoughtReview({
    userId,
    reviewId: result.reviewId,
  });
  const second = await generateFlashcardsForThoughtReview({
    userId,
    reviewId: result.reviewId,
  });

  assert.equal(first.createdOrUpdatedCount, second.createdOrUpdatedCount);
  assert.ok(first.cards.length >= 1);

  const cards = await prisma.flashcard.findMany({
    where: { id: { startsWith: `thought:${result.reviewId}:` }, userId },
  });
  assert.equal(cards.length, first.cards.length);

  const row = await prisma.thoughtReview.findUniqueOrThrow({
    where: { id: result.reviewId },
  });
  assert.match(JSON.stringify(row.generatedCards), /thought:/);
});

test("generateFlashcardsForThoughtReview keeps voice-linked reviews in the voice note queue", async () => {
  const { userId, lesson } = await createCoachSubmitFixture();
  const result = await createThoughtReview({
    userId,
    mode: "concept_question",
    rawText: "我用语音解释 attention 但把它说成平均池化。",
    includeTodayLesson: true,
    lessonId: lesson.id,
    reviewJsonExtra: {
      source: "voice-note",
      voiceNoteId: "voice-note-for-coach-action",
    },
  });

  const generated = await generateFlashcardsForThoughtReview({
    userId,
    reviewId: result.reviewId,
  });

  assert.equal(generated.reviewSource, "voice-note");

  const cards = await prisma.flashcard.findMany({
    where: { id: { startsWith: `thought:${result.reviewId}:` }, userId },
  });
  assert.ok(cards.length >= 1);
  assert.ok(cards.every((card) => JSON.stringify(card.tags).includes("voice-note")));
  assert.ok(cards.every((card) => JSON.stringify(card.tags).includes("thought-review")));
});
