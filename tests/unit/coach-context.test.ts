import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { buildCoachContext } from "@/server/coach/context";

async function createCoachContextFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `coach-context-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `coach-domain-${suffix}`,
      name: "Coach Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `coach-topic-${suffix}`,
      title: "Coach Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Transformer Coach Lesson",
      summary: "Study attention with implementation feedback.",
      contentMarkdown: "Lesson body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      connections: {
        glossary: {
          term: "Self-Attention",
          definition: "Dynamic token weighting.",
        },
        breadth: {
          kind: "benchmark",
          title: "SWE-bench",
          oneLine: "Agent coding benchmark.",
        },
      },
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({
    data: {
      userId,
      timeZone: "Asia/Shanghai",
      goal: "用数学直觉补强代码实现",
      level: "intermediate",
      dailyMinutes: 45,
      difficulty: "standard",
      language: "zh-CN",
    },
  });
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
  const question = await prisma.quizQuestion.create({
    data: {
      lessonId: lesson.id,
      type: "short_answer",
      question: "Self-Attention 的权重来自哪里？",
      answer: "Q/K 相似度",
      explanation: "Query 与 Key 点积后 softmax 得到权重。",
    },
  });
  await prisma.quizAttempt.create({
    data: {
      questionId: question.id,
      userId,
      userAnswer: "平均所有 token",
      isCorrect: false,
    },
  });
  const submission = await prisma.codeSubmission.create({
    data: {
      userId,
      lessonId: lesson.id,
      localDate: "2026-05-24",
      language: "python",
      code: "def attention(q, k, v):\n    return v\n",
      status: "feedback_ready",
      aiFeedback: "结构化代码反馈：缺少 Q/K 权重计算。",
      feedbackJson: { overall: "partially_correct" },
    },
  });
  await prisma.codeFeedback.create({
    data: {
      submissionId: submission.id,
      userId,
      lessonId: lesson.id,
      localDate: "2026-05-24",
      provider: "template",
      status: "success",
      overall: "partially_correct",
      summary: "缺少 Q/K 相似度与 softmax 归一化。",
      issues: [{ message: "缺少 softmax 权重", severity: "high" }],
    },
  });
  await prisma.misconception.create({
    data: {
      userId,
      questionId: question.id,
      lessonId: lesson.id,
      source: "quiz",
      summary: "把 attention 当成平均",
      prompt: question.question,
      explanation: "权重由 Q/K 相似度决定。",
    },
  });
  await prisma.flashcard.create({
    data: {
      id: `glossary:${userId}:self-attention`,
      userId,
      lessonId: null,
      front: "Self-Attention 是什么？",
      back: "按上下文相关性加权 Value。",
      type: "term",
      tags: ["glossary", "attention"],
      dueAt: new Date("2026-05-24T00:00:00.000Z"),
    },
  });

  return { userId, lesson };
}

test("buildCoachContext includes lesson, quiz, code feedback, misconceptions, and breadth context", async () => {
  const { userId, lesson } = await createCoachContextFixture();

  const context = await buildCoachContext({
    userId,
    mode: "code_reasoning",
    includeTodayLesson: true,
    lessonId: lesson.id,
  });

  assert.equal(context.lessonId, lesson.id);
  assert.match(context.summary, /currentLesson: Transformer Coach Lesson/);
  assert.match(context.summary, /recentQuiz: wrong:Self-Attention/);
  assert.match(context.summary, /recentCode:/);
  assert.match(context.summary, /recentCodeFeedback: partially_correct:缺少 Q\/K/);
  assert.match(context.summary, /activeMisconceptions: 把 attention 当成平均/);
  assert.match(context.summary, /recentKnowledge: glossary=Self-Attention; breadth=benchmark:SWE-bench/);
  assert.match(context.summary, /standaloneReviewCards: term:Self-Attention 是什么/);
});
