import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { submitCodeForReview } from "@/server/coding/submit";

async function createCodeFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `code-user-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `code-domain-${suffix}`,
      name: "Code Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `code-topic-${suffix}`,
      title: "Code Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Softmax Implementation",
      summary: "Implement softmax safely.",
      contentMarkdown: "Softmax content",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {
        codingExercise: {
          language: "python",
          prompt: "Implement softmax.",
          starterCode: "def softmax(scores):\n    return []\n",
          referenceSolution: "def softmax(scores):\n    ...\n",
          visibleTests: [{ input: "softmax([0, 0])", expectedOutput: "[0.5, 0.5]" }],
          commonBugs: ["Returning raw scores instead of normalized values"],
        },
      },
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({ data: { userId } });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-24T00:00:00.000Z"),
      localDate: "2026-05-24",
      status: "planned",
      isTest: false,
    },
  });

  return { userId, lesson };
}

test("submitCodeForReview persists structured feedback, misconception, and bug flashcards", async () => {
  const { userId, lesson } = await createCodeFixture();

  const result = await submitCodeForReview({
    userId,
    lessonId: lesson.id,
    localDate: "2026-05-24",
    language: "python",
    code: "def softmax(scores):\n    return scores\n",
  });

  assert.equal(result.review.overall, "partially_correct");

  const submission = await prisma.codeSubmission.findUniqueOrThrow({
    where: { userId_lessonId_localDate: { userId, lessonId: lesson.id, localDate: "2026-05-24" } },
  });
  assert.equal(submission.status, "feedback_ready");
  assert.match(submission.aiFeedback ?? "", /结构|测试|实现|反馈/);
  assert.ok(submission.feedbackJson);

  const feedback = await prisma.codeFeedback.findUniqueOrThrow({
    where: { submissionId: submission.id },
  });
  assert.equal(feedback.overall, "partially_correct");
  assert.ok(feedback.feedbackJson);
  assert.ok(Array.isArray(feedback.issues));
  assert.ok(Array.isArray(feedback.hints));
  assert.ok(Array.isArray(feedback.suggestedTests));

  const misconception = await prisma.misconception.findUniqueOrThrow({
    where: { sourceKey: `code:${userId}:${submission.id}` },
  });
  assert.equal(misconception.source, "code");
  assert.equal(misconception.codeSubmissionId, submission.id);
  assert.equal(misconception.status, "open");

  const cards = await prisma.flashcard.findMany({
    where: { id: { startsWith: `code-feedback:${submission.id}:` } },
  });
  assert.ok(cards.length >= 1);
  assert.equal(cards[0]?.type, "code_bug");
});

