import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { selectNextTopic } from "@/server/curriculum/select-next-topic";

async function createPlannerMisconceptionFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `planner-misconception-${suffix}`;

  const pythonDomain = await prisma.domain.upsert({
    where: { slug: "python-coding" },
    update: { name: "Python / 代码表达" },
    create: {
      slug: "python-coding",
      name: "Python / 代码表达",
      description: "Python implementation practice",
    },
  });
  const llmDomain = await prisma.domain.upsert({
    where: { slug: "llm-rag-agent" },
    update: { name: "LLM / RAG / Agent" },
    create: {
      slug: "llm-rag-agent",
      name: "LLM / RAG / Agent",
      description: "LLM systems",
    },
  });

  const pythonTopic = await prisma.topic.upsert({
    where: { slug: "python-lists-dicts" },
    update: { domainId: pythonDomain.id, title: "列表与字典" },
    create: {
      domainId: pythonDomain.id,
      slug: "python-lists-dicts",
      title: "列表与字典",
    },
  });
  await prisma.topic.upsert({
    where: { slug: "rag" },
    update: { domainId: llmDomain.id, title: "RAG" },
    create: {
      domainId: llmDomain.id,
      slug: "rag",
      title: "RAG",
    },
  });

  await prisma.userProfile.create({ data: { userId, timeZone: "Asia/Shanghai" } });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: pythonTopic.id,
      title: "Python Misconception Lesson",
      summary: "A lesson used to attach planner misconceptions.",
      contentMarkdown: "Lesson body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });

  for (let i = 0; i < 4; i++) {
    await prisma.misconception.create({
      data: {
        userId,
        lessonId: lesson.id,
        topicId: pythonTopic.id,
        localDate: "2026-05-27",
        source: i % 2 === 0 ? "coach" : "code",
        sourceKey: `planner-misconception:${suffix}:${i}`,
        summary: "Python implementation misconception",
        prompt: "I can return exp values directly.",
        explanation: "Implementation needs normalization and edge case checks.",
        status: "open",
      },
    });
  }

  return { userId };
}

test("selectNextTopic uses active misconceptions from DB as planner weakness input", async () => {
  const { userId } = await createPlannerMisconceptionFixture();

  const decision = await selectNextTopic({
    userId,
    localDate: "2026-05-28",
  });

  assert.equal(decision.domainSlug, "python-coding");
  assert.equal(decision.scoreBreakdown.misconceptionScore, 1);
  assert.match(decision.reason, /misconception=1\.00/);
});

test("selectNextTopic returns a planner signal snapshot for auditability", async () => {
  const { userId } = await createPlannerMisconceptionFixture();

  const decision = await selectNextTopic({
    userId,
    localDate: "2026-05-28",
  });

  assert.equal(decision.signalSnapshot.activeMisconceptionCountByDomain["python-coding"], 4);
  assert.equal(decision.signalSnapshot.codeSubmissionCountLast7, 0);
  assert.ok(Array.isArray(decision.signalSnapshot.recentStudies));
  assert.ok("dueCountByDomain" in decision.signalSnapshot);
  assert.ok("hardReviewCountByDomain" in decision.signalSnapshot);
  assert.ok("incorrectQuizCountByDomain" in decision.signalSnapshot);
});
