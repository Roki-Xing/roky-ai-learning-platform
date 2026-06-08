import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  DEFAULT_PROJECT_TEMPLATES,
  buildProjectPortfolioItems,
  buildProjectCompletionFlashcards,
  buildProjectCompletionSummary,
  calculateProjectProgress,
  normalizeProjectType,
} from "@/server/projects/base";
import { getProjectReviewCardSummary } from "@/server/projects/review-cards";
import { reviewProjectMilestoneCode } from "@/server/projects/code-submission";
import {
  getProjectCodeFeedbackCardSummary,
  getProjectMilestoneFeedbackSummaries,
} from "@/server/projects/code-feedback-summary";
import { completeLearningProject } from "@/server/projects/submit";
import { getDueFlashcards } from "@/server/review/queue";

test("default project templates cover Sprint 6 practice types", () => {
  const types = new Set(DEFAULT_PROJECT_TEMPLATES.map((project) => project.type));

  for (const type of [
    "python_basics",
    "data_structures",
    "algorithms",
    "ai_engineering",
    "rag",
    "agent",
    "data_analysis",
    "paper_reproduction",
  ]) {
    assert.equal(types.has(type), true, `missing project type: ${type}`);
  }

  assert.ok(DEFAULT_PROJECT_TEMPLATES.length >= 8);
  assert.ok(DEFAULT_PROJECT_TEMPLATES.every((project) => project.milestones.length >= 3));
  assert.equal(
    new Set(DEFAULT_PROJECT_TEMPLATES.map((project) => project.slug)).size,
    DEFAULT_PROJECT_TEMPLATES.length,
  );
});

test("normalizeProjectType keeps known types and falls back to python_basics", () => {
  assert.equal(normalizeProjectType("rag"), "rag");
  assert.equal(normalizeProjectType("paper_reproduction"), "paper_reproduction");
  assert.equal(normalizeProjectType("unknown"), "python_basics");
  assert.equal(normalizeProjectType(""), "python_basics");
});

test("calculateProjectProgress returns completed counts and percent", () => {
  const progress = calculateProjectProgress([
    { status: "completed" },
    { status: "active" },
    { status: "planned" },
    { status: "completed" },
  ]);

  assert.deepEqual(progress, {
    total: 4,
    completed: 2,
    remaining: 2,
    percent: 50,
    isComplete: false,
  });
});

test("calculateProjectProgress treats all milestones complete as project complete", () => {
  const progress = calculateProjectProgress([
    { status: "completed" },
    { status: "completed" },
    { status: "completed" },
  ]);

  assert.equal(progress.completed, 3);
  assert.equal(progress.remaining, 0);
  assert.equal(progress.percent, 100);
  assert.equal(progress.isComplete, true);
});

test("buildProjectCompletionSummary includes milestones, artifacts, and next step", () => {
  const summary = buildProjectCompletionSummary({
    title: "Markdown 笔记搜索器",
    type: "data_structures",
    completedMilestones: [
      { title: "读取 Markdown 文件", reflection: "会遍历目录和过滤扩展名。", code: "def scan(): pass" },
      { title: "建立倒排索引", reflection: "理解了 token 到文件列表的映射。", note: "索引要去重。" },
    ],
  });

  assert.match(summary, /Markdown 笔记搜索器/);
  assert.match(summary, /完成里程碑：2/);
  assert.match(summary, /读取 Markdown 文件/);
  assert.match(summary, /代码产物：1/);
  assert.match(summary, /笔记\/反思：2/);
  assert.match(summary, /下一步/);
});

test("buildProjectCompletionFlashcards creates stable standalone project review cards", () => {
  const cards = buildProjectCompletionFlashcards({
    projectId: "project-1",
    userId: "user-1",
    title: "Markdown 笔记搜索器",
    type: "data_structures",
    summary: "完成了扫描、索引和搜索排序。",
    completedMilestones: [
      { title: "扫描 Markdown", reflection: "需要跳过隐藏目录。", code: "def scan(): pass" },
      { title: "倒排索引", reflection: "term -> docs 的映射要去重。", note: "set 去重" },
    ],
  });

  assert.equal(cards.length, 3);
  assert.equal(cards[0]?.id, "project:project-1:summary");
  assert.equal(cards[0]?.lessonId, null);
  assert.equal(cards[0]?.type, "project");
  assert.deepEqual(cards[0]?.tags, ["project", "data_structures"]);
  assert.match(cards[1]?.front ?? "", /里程碑/);
});

test("buildProjectPortfolioItems exposes completed project artifacts for portfolio view", () => {
  const items = buildProjectPortfolioItems([
    {
      id: "project-1",
      title: "Markdown 笔记搜索器",
      type: "data_structures",
      status: "completed",
      summary: "完成了扫描、索引和搜索排序。",
      relatedTopics: ["inverted-index", "file-io"],
      milestones: [
        {
          title: "扫描 Markdown",
          status: "completed",
          code: "def scan_markdown(root):\n    return []",
          reflection: "需要跳过隐藏目录。",
        },
        {
          title: "倒排索引",
          status: "completed",
          note: "term -> docs 的映射要去重。",
        },
      ],
    },
    {
      id: "project-2",
      title: "未完成项目",
      type: "rag",
      status: "active",
      summary: null,
      relatedTopics: ["rag"],
      milestones: [{ title: "文档切块", status: "active", code: null, reflection: null }],
    },
  ], { "project-1": 3 });

  assert.equal(items.length, 1);
  assert.equal(items[0]?.title, "Markdown 笔记搜索器");
  assert.equal(items[0]?.typeLabel, "数据结构项目");
  assert.equal(items[0]?.completedMilestones, 2);
  assert.equal(items[0]?.codeSnippetCount, 1);
  assert.equal(items[0]?.reflectionCount, 2);
  assert.equal(items[0]?.cardCount, 3);
  assert.equal(items[0]?.reviewHref, "/review?source=project&projectId=project-1");
  assert.match(items[0]?.featuredCodeSnippet ?? "", /def scan_markdown/);
  assert.deepEqual(items[0]?.relatedTopics, ["inverted-index", "file-io"]);
  assert.match(items[0]?.portfolioMarkdown ?? "", /# Markdown 笔记搜索器/);
  assert.match(items[0]?.portfolioMarkdown ?? "", /## 项目总结/);
  assert.match(items[0]?.portfolioMarkdown ?? "", /- 相关知识：倒排索引, 文件读写/);
  assert.doesNotMatch(items[0]?.portfolioMarkdown ?? "", /- 相关知识：inverted-index, file-io/);
  assert.match(items[0]?.portfolioMarkdown ?? "", /```python\n/);
});

async function createCompletedProjectFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `project-submit-${suffix}`;
  await prisma.userProfile.create({ data: { userId } });
  const project = await prisma.learningProject.create({
    data: {
      userId,
      templateSlug: `project-template-${suffix}`,
      type: "python_basics",
      title: "单词频率统计器",
      description: "统计 Top-K 词频。",
      difficulty: "beginner",
      status: "active",
      startedAt: new Date("2026-05-25T00:00:00.000Z"),
    },
  });

  await prisma.projectMilestone.createMany({
    data: [
      {
        projectId: project.id,
        userId,
        position: 1,
        title: "读取文本",
        task: "读取输入文本。",
        codePrompt: "实现 tokenize",
        reflectionPrompt: "边界是什么？",
        status: "completed",
        code: "def tokenize(text): return text.split()",
        reflection: "标点会影响 token。",
        completedAt: new Date("2026-05-25T01:00:00.000Z"),
      },
      {
        projectId: project.id,
        userId,
        position: 2,
        title: "统计词频",
        task: "统计每个 token。",
        codePrompt: "实现 count_words",
        reflectionPrompt: "dict 更新怎么写？",
        status: "completed",
        note: "Counter 更简洁。",
        reflection: "要处理空列表。",
        completedAt: new Date("2026-05-25T02:00:00.000Z"),
      },
    ],
  });

  return { userId, project };
}

async function createProjectMilestoneCodeFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `project-code-${suffix}`;
  const otherUserId = `${userId}-other`;
  const domain = await prisma.domain.create({
    data: {
      slug: `project-code-domain-${suffix}`,
      name: "Project Code Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `project-code-topic-${suffix}`,
      title: "Project Code Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Project Milestone Python",
      summary: "Use Python in project milestones.",
      contentMarkdown: "Project code content",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {
        codingExercise: {
          language: "python",
          prompt: "Implement a word counter.",
          starterCode: "def count_words(tokens):\n    return {}\n",
          referenceSolution: "from collections import Counter\n",
          visibleTests: [{ input: "count_words(['a', 'a'])", expectedOutput: "{'a': 2}" }],
          commonBugs: ["Returning a list instead of a frequency map"],
        },
      },
      createdBy: "test",
    },
  });
  await prisma.userProfile.createMany({
    data: [{ userId }, { userId: otherUserId }],
  });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-25T00:00:00.000Z"),
      localDate: "2026-05-25",
      status: "completed",
      isTest: false,
    },
  });
  const project = await prisma.learningProject.create({
    data: {
      userId,
      templateSlug: `project-code-template-${suffix}`,
      type: "python_basics",
      title: "项目代码评审",
      description: "把里程碑代码接入反馈。",
      difficulty: "beginner",
      status: "active",
      startedAt: new Date("2026-05-25T01:00:00.000Z"),
    },
  });
  const milestone = await prisma.projectMilestone.create({
    data: {
      projectId: project.id,
      userId,
      position: 1,
      title: "统计词频",
      task: "实现词频统计。",
      codePrompt: "实现 count_words",
      reflectionPrompt: "dict 更新有哪些边界？",
      status: "active",
      lessonId: lesson.id,
      code: "def count_words(tokens):\n    return tokens\n",
    },
  });

  return { userId, otherUserId, project, milestone, lesson };
}

test("completeLearningProject writes summary and idempotent review flashcards", async () => {
  const { userId, project } = await createCompletedProjectFixture();

  const first = await completeLearningProject({ userId, projectId: project.id });
  const firstCard = await prisma.flashcard.findUniqueOrThrow({
    where: { id: `project:${project.id}:summary` },
  });
  const preservedDueAt = new Date("2026-06-01T00:00:00.000Z");
  await prisma.flashcard.update({
    where: { id: firstCard.id },
    data: {
      dueAt: preservedDueAt,
      reviewCount: 2,
    },
  });
  const second = await completeLearningProject({ userId, projectId: project.id });

  assert.equal(first.projectId, project.id);
  assert.equal(second.projectId, project.id);
  assert.equal(first.cards.length, second.cards.length);

  const [projectRow, cards] = await Promise.all([
    prisma.learningProject.findUniqueOrThrow({ where: { id: project.id } }),
    prisma.flashcard.findMany({
      where: { userId, id: { startsWith: `project:${project.id}:` } },
      orderBy: [{ id: "asc" }],
    }),
  ]);

  assert.equal(projectRow.status, "completed");
  assert.match(projectRow.summary ?? "", /单词频率统计器/);
  assert.equal(cards.length, first.cards.length);
  assert.ok(cards.length >= 3);
  assert.ok(cards.every((card) => card.lessonId === null));
  assert.ok(cards.every((card) => JSON.stringify(card.tags).includes("project")));
  assert.equal(
    cards.find((card) => card.id === firstCard.id)?.dueAt.toISOString(),
    preservedDueAt.toISOString(),
  );
  assert.equal(cards.find((card) => card.id === firstCard.id)?.reviewCount, 2);
});

test("reviewProjectMilestoneCode creates feedback and links the milestone to CodeSubmission", async () => {
  const { userId, project, milestone, lesson } = await createProjectMilestoneCodeFixture();

  const first = await reviewProjectMilestoneCode({
    userId,
    projectId: project.id,
    milestoneId: milestone.id,
    localDate: "2026-05-25",
    language: "python",
  });
  const second = await reviewProjectMilestoneCode({
    userId,
    projectId: project.id,
    milestoneId: milestone.id,
    localDate: "2026-05-25",
    language: "python",
  });

  assert.equal(first.submissionId, second.submissionId);
  assert.equal(first.provider, second.provider);

  const milestoneRow = await prisma.projectMilestone.findUniqueOrThrow({
    where: { id: milestone.id },
  });
  assert.equal(milestoneRow.codeSubmissionId, first.submissionId);

  const submission = await prisma.codeSubmission.findUniqueOrThrow({
    where: { id: first.submissionId },
  });
  assert.equal(submission.userId, userId);
  assert.equal(submission.lessonId, lesson.id);
  assert.equal(submission.localDate, "2026-05-25");
  assert.equal(submission.language, "python");
  assert.equal(submission.status, "feedback_ready");

  const allSubmissions = await prisma.codeSubmission.findMany({
    where: { userId, lessonId: lesson.id, localDate: "2026-05-25" },
  });
  assert.equal(allSubmissions.length, 1);

  const feedback = await prisma.codeFeedback.findUniqueOrThrow({
    where: { submissionId: first.submissionId },
  });
  assert.equal(feedback.userId, userId);
});

test("getProjectMilestoneFeedbackSummaries returns current-user feedback for linked milestones", async () => {
  const { userId, otherUserId, project, milestone, lesson } = await createProjectMilestoneCodeFixture();
  const reviewed = await reviewProjectMilestoneCode({
    userId,
    projectId: project.id,
    milestoneId: milestone.id,
    localDate: "2026-05-25",
    language: "python",
  });
  await prisma.codeFeedback.update({
    where: { submissionId: reviewed.submissionId },
    data: {
      overall: "partially_correct",
      summary: "Current user feedback is visible in the project milestone.",
      issues: [
        {
          type: "logic",
          severity: "high",
          message: "Use a frequency map instead of returning raw tokens.",
        },
      ],
    },
  });
  const otherSubmission = await prisma.codeSubmission.create({
    data: {
      userId: otherUserId,
      lessonId: lesson.id,
      localDate: "2026-05-25",
      language: "python",
      code: "def count_words(tokens): return {}",
      status: "feedback_ready",
    },
  });
  await prisma.codeFeedback.create({
    data: {
      submissionId: otherSubmission.id,
      userId: otherUserId,
      lessonId: lesson.id,
      localDate: "2026-05-25",
      provider: "template",
      status: "success",
      overall: "incorrect",
      summary: "Other user feedback should not be visible.",
      issues: [{ type: "scope", severity: "high", message: "Do not leak this." }],
    },
  });

  const summaries = await getProjectMilestoneFeedbackSummaries({
    userId,
    projectId: project.id,
  });

  assert.equal(summaries.length, 1);
  assert.equal(summaries[0]?.milestoneId, milestone.id);
  assert.equal(summaries[0]?.submissionId, reviewed.submissionId);
  assert.equal(summaries[0]?.feedback.overall, "partially_correct");
  assert.match(summaries[0]?.feedback.summary ?? "", /Current user feedback/);
  assert.equal(summaries[0]?.feedback.issues[0]?.severity, "high");
  assert.match(summaries[0]?.feedback.issues[0]?.message ?? "", /frequency map/);
  assert.equal(
    summaries.some((summary) => summary.feedback.summary.includes("Other user")),
    false,
  );
});

test("getProjectCodeFeedbackCardSummary counts only linked project milestone feedback cards", async () => {
  const { userId, otherUserId, project, milestone, lesson } = await createProjectMilestoneCodeFixture();
  const reviewed = await reviewProjectMilestoneCode({
    userId,
    projectId: project.id,
    milestoneId: milestone.id,
    localDate: "2026-05-25",
    language: "python",
  });
  await prisma.flashcard.update({
    where: { id: `code-feedback:${reviewed.submissionId}:0` },
    data: { dueAt: new Date("2026-06-01T00:00:00.000Z") },
  });

  const otherProject = await prisma.learningProject.create({
    data: {
      userId,
      templateSlug: `other-code-feedback-${project.id}`,
      type: "python_basics",
      title: "其他项目",
      description: "不应统计到当前项目。",
      difficulty: "beginner",
      status: "active",
      startedAt: new Date("2026-05-25T02:00:00.000Z"),
    },
  });
  const otherSubmission = await prisma.codeSubmission.create({
    data: {
      userId,
      lessonId: lesson.id,
      localDate: "2026-05-26",
      language: "python",
      code: "def count_words(tokens): return {}",
      status: "feedback_ready",
    },
  });
  await prisma.projectMilestone.create({
    data: {
      projectId: otherProject.id,
      userId,
      position: 1,
      title: "其他里程碑",
      task: "其他任务。",
      codePrompt: "实现其他函数",
      reflectionPrompt: "其他反思。",
      status: "active",
      lessonId: lesson.id,
      codeSubmissionId: otherSubmission.id,
    },
  });
  await prisma.flashcard.create({
    data: {
      id: `code-feedback:${otherSubmission.id}:0`,
      userId,
      lessonId: lesson.id,
      front: "Other project code feedback",
      back: "Should not count",
      type: "code_bug",
      tags: ["code-feedback", "code-bug"],
      dueAt: new Date("2026-05-25T00:00:00.000Z"),
    },
  });
  await prisma.flashcard.create({
    data: {
      id: `code-feedback:${reviewed.submissionId}:other-user`,
      userId: otherUserId,
      lessonId: lesson.id,
      front: "Other user linked-looking code feedback",
      back: "Should not count",
      type: "code_bug",
      tags: ["code-feedback", "code-bug"],
      dueAt: new Date("2026-05-25T00:00:00.000Z"),
    },
  });

  const summary = await getProjectCodeFeedbackCardSummary({
    userId,
    projectId: project.id,
    now: new Date("2026-05-25T12:00:00.000Z"),
  });

  assert.equal(summary.total, 1);
  assert.equal(summary.due, 0);
  assert.equal(
    summary.reviewHref,
    `/review?source=code-feedback&projectId=${encodeURIComponent(project.id)}`,
  );
});

test("reviewProjectMilestoneCode rejects cross-user, missing lesson, and missing code cases", async () => {
  const { userId, otherUserId, project, milestone } = await createProjectMilestoneCodeFixture();

  await assert.rejects(
    () =>
      reviewProjectMilestoneCode({
        userId: otherUserId,
        projectId: project.id,
        milestoneId: milestone.id,
      }),
    /Milestone not found/,
  );

  await prisma.projectMilestone.update({
    where: { id: milestone.id },
    data: { lessonId: null },
  });
  await assert.rejects(
    () =>
      reviewProjectMilestoneCode({
        userId,
        projectId: project.id,
        milestoneId: milestone.id,
      }),
    /Missing lessonId/,
  );

  await prisma.projectMilestone.update({
    where: { id: milestone.id },
    data: { lessonId: "missing-lesson", code: "" },
  });
  await assert.rejects(
    () =>
      reviewProjectMilestoneCode({
        userId,
        projectId: project.id,
        milestoneId: milestone.id,
      }),
    /Missing code/,
  );
});

test("completeLearningProject rejects incomplete or cross-user projects", async () => {
  const { userId, project } = await createCompletedProjectFixture();
  const otherUserId = `${userId}-other`;
  await prisma.userProfile.create({ data: { userId: otherUserId } });
  await prisma.projectMilestone.updateMany({
    where: { projectId: project.id, position: 2 },
    data: { status: "active", completedAt: null },
  });

  await assert.rejects(
    () => completeLearningProject({ userId, projectId: project.id }),
    /Project is not complete/,
  );
  await assert.rejects(
    () => completeLearningProject({ userId: otherUserId, projectId: project.id }),
    /Project not found/,
  );
});

test("getProjectReviewCardSummary counts only the current user's project cards", async () => {
  const { userId, project } = await createCompletedProjectFixture();
  const now = new Date("2026-05-25T12:00:00.000Z");
  await completeLearningProject({ userId, projectId: project.id, now });
  await prisma.flashcard.update({
    where: { id: `project:${project.id}:summary` },
    data: { dueAt: new Date("2026-06-01T00:00:00.000Z") },
  });
  await prisma.userProfile.create({ data: { userId: `${userId}-other-summary` } });
  await prisma.flashcard.create({
    data: {
      id: `project:${project.id}:other-user-card`,
      userId: `${userId}-other-summary`,
      lessonId: null,
      front: "Other user project card",
      back: "Should not count",
      type: "project",
      tags: ["project"],
      dueAt: new Date("2026-05-25T00:00:00.000Z"),
    },
  });

  const summary = await getProjectReviewCardSummary({
    userId,
    projectId: project.id,
    now,
  });

  assert.equal(summary.total, 3);
  assert.equal(summary.due, 2);
  assert.equal(
    summary.reviewHref,
    `/review?source=project&projectId=${encodeURIComponent(project.id)}`,
  );
});

test("getDueFlashcards can focus the queue on one project's cards", async () => {
  const { userId, project } = await createCompletedProjectFixture();
  await completeLearningProject({ userId, projectId: project.id });
  await prisma.flashcard.updateMany({
    where: { userId, id: { startsWith: `project:${project.id}:` } },
    data: { dueAt: new Date("2026-05-25T00:00:00.000Z") },
  });
  await prisma.flashcard.createMany({
    data: [
      {
        id: `project:other-project-${project.id}:summary`,
        userId,
        lessonId: null,
        front: "Other project card",
        back: "Should not be in this queue",
        type: "project",
        tags: ["project"],
        dueAt: new Date("2026-05-25T00:00:00.000Z"),
      },
      {
        id: `glossary:${project.id}:summary`,
        userId,
        lessonId: null,
        front: "Glossary card",
        back: "Should not be in project queue",
        type: "term",
        tags: ["glossary"],
        dueAt: new Date("2026-05-25T00:00:00.000Z"),
      },
    ],
  });

  const due = await getDueFlashcards({
    userId,
    now: new Date("2026-05-25T12:00:00.000Z"),
    source: "project",
    projectId: project.id,
  });

  assert.equal(due.length, 3);
  assert.ok(due.every((card) => card.id.startsWith(`project:${project.id}:`)));
});

test("getDueFlashcards can focus on one project's code feedback cards", async () => {
  const { userId, project, milestone, lesson } = await createProjectMilestoneCodeFixture();
  const reviewed = await reviewProjectMilestoneCode({
    userId,
    projectId: project.id,
    milestoneId: milestone.id,
    localDate: "2026-05-25",
    language: "python",
  });
  await prisma.flashcard.update({
    where: { id: `code-feedback:${reviewed.submissionId}:0` },
    data: { dueAt: new Date("2026-05-25T00:00:00.000Z") },
  });
  await prisma.flashcard.createMany({
    data: [
      {
        id: `code-feedback:unlinked-${project.id}:0`,
        userId,
        lessonId: lesson.id,
        front: "Unlinked code feedback",
        back: "Should not be in this queue",
        type: "code_bug",
        tags: ["code-feedback", "code-bug"],
        dueAt: new Date("2026-05-25T00:00:00.000Z"),
      },
      {
        id: `project:${project.id}:summary-extra`,
        userId,
        lessonId: null,
        front: "Project summary card",
        back: "Should not be in code feedback queue",
        type: "project",
        tags: ["project"],
        dueAt: new Date("2026-05-25T00:00:00.000Z"),
      },
    ],
  });

  const due = await getDueFlashcards({
    userId,
    now: new Date("2026-05-25T12:00:00.000Z"),
    source: "code-feedback",
    projectId: project.id,
  });

  assert.equal(due.length, 1);
  assert.equal(due[0]?.id, `code-feedback:${reviewed.submissionId}:0`);
});
