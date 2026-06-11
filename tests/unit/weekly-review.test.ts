import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildWeeklyReviewSnapshot,
  weeklyCodeIssueTypeLabel,
  weeklyMistakeSourceLabel,
} from "@/server/learning/weekly";

test("weekly review snapshot highlights strongest weakest and next week plan", () => {
  const snapshot = buildWeeklyReviewSnapshot({
    mission: {
      title: "先复习到期卡片",
      reason: "这周还有复习欠账。",
      href: "/review",
      ctaLabel: "去复习",
      tone: "warning",
    },
    missionSignals: [],
    windowLabel: "2026-05-27 ~ 2026-06-02",
    lessons: [
      {
        localDate: "2026-06-02",
        lessonTitle: "RAG 检索链路",
        domainLabel: "LLM / RAG / Agent",
      },
    ],
    domains: [
      {
        slug: "llm-rag-agent",
        label: "LLM / RAG / Agent",
        completedLessons: 2,
        plannedLessons: 0,
        reviewedCount: 5,
        dueFlashcardCount: 1,
        quizAttemptCount: 3,
        correctQuizCount: 3,
        codeSubmissionCount: 1,
        activeMisconceptionCount: 0,
      },
      {
        slug: "algorithm-design",
        label: "算法设计",
        completedLessons: 1,
        plannedLessons: 1,
        reviewedCount: 1,
        dueFlashcardCount: 4,
        quizAttemptCount: 2,
        correctQuizCount: 0,
        codeSubmissionCount: 0,
        activeMisconceptionCount: 2,
      },
    ],
    topMistake: {
      id: "mistake-binary-search",
      summary: "二分搜索边界条件",
      source: "quiz",
      occurrenceCount: 3,
      lessonTitle: "二分搜索",
      status: "open",
      href: "/mistakes?focus=mistake-binary-search",
    },
    codePractice: {
      submissionCount: 2,
      feedbackCount: 1,
      issueCount: 3,
      topIssueType: "edge_case",
      latestFeedbackSummary: "边界处理还不稳定。",
    },
    reviewRetention: {
      reviewedCount: 8,
      retainedCount: 5,
      retentionRate: 63,
    },
    dueFlashcardsCount: 4,
    openMisconceptionsCount: 2,
    codeFeedbackNeedsAttentionCount: 1,
    activity: {
      voiceNotes: 2,
      coachReviews: 1,
      completedProjectMilestones: 1,
      newMisconceptions: 3,
      resolvedMisconceptions: 1,
      glossaryReviewed: 4,
      radarReviewed: 2,
    },
  });

  assert.equal(snapshot.weeklyOverview.studyDays, 1);
  assert.equal(snapshot.weeklyOverview.completedLessons, 1);
  assert.equal(snapshot.weeklyOverview.reviewedCards, 8);
  assert.equal(snapshot.weeklyOverview.quizAccuracy, 60);
  assert.equal(snapshot.weeklyOverview.voiceNotes, 2);
  assert.equal(snapshot.weeklyOverview.coachReviews, 1);
  assert.equal(snapshot.weeklyOverview.completedProjectMilestones, 1);
  assert.equal(snapshot.weeklyOverview.newMisconceptions, 3);
  assert.equal(snapshot.weeklyOverview.resolvedMisconceptions, 1);
  assert.equal(snapshot.weeklyOverview.glossaryReviewed, 4);
  assert.equal(snapshot.weeklyOverview.radarReviewed, 2);
  assert.equal(snapshot.strongestDomain?.label, "LLM / RAG / Agent");
  assert.equal(snapshot.weakestDomain?.label, "算法设计");
  assert.equal(snapshot.topMistake?.summary, "二分搜索边界条件");
  assert.equal(snapshot.topMistake?.href, "/mistakes?focus=mistake-binary-search");
  assert.deepEqual(
    snapshot.mistakeRepairQueue.map((mistake) => ({
      id: mistake.id,
      summary: mistake.summary,
      href: mistake.href,
    })),
    [
      {
        id: "mistake-binary-search",
        summary: "二分搜索边界条件",
        href: "/mistakes?focus=mistake-binary-search",
      },
    ],
  );
  assert.equal(snapshot.codePractice.topIssueType, "edge_case");
  assert.equal(snapshot.reviewRetention.retentionRate, 63);
  assert.equal(
    snapshot.weeklyRitualSummary.summary,
    "你学习了 1 天，完成 1 节课，复习 8 张卡，修复 1 个误区。",
  );
  assert.equal(snapshot.weeklyRitualSummary.badgeTitle, "误区修复者");
  assert.match(snapshot.weeklyRitualSummary.badgeReason, /修复了 1 个误区/);
  assert.match(snapshot.weeklyRitualSummary.reflectionTemplate, /我这周最大的收获是\.\.\./);
  assert.match(snapshot.weeklyRitualSummary.reflectionTemplate, /我下周想重点学\.\.\./);
  assert.match(snapshot.aiSummary.mostImportantGain, /LLM \/ RAG \/ Agent/);
  assert.match(snapshot.aiSummary.mainWeakness, /算法设计/);
  assert.match(snapshot.aiSummary.nextWeekSuggestion, /算法设计/);
  assert.match(snapshot.aiSummary.recommendedNextStage, /算法设计/);
  assert.match(snapshot.weeklyReportMarkdown, /# Roky Learn 每周复盘/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /# Roky Learn Weekly Report/);
  assert.match(snapshot.weeklyReportMarkdown, /2026-05-27 ~ 2026-06-02/);
  assert.match(snapshot.weeklyReportMarkdown, /## 本周学习总结/);
  assert.match(snapshot.weeklyReportMarkdown, /本周称号：误区修复者/);
  assert.match(snapshot.weeklyReportMarkdown, /你学习了 1 天，完成 1 节课，复习 8 张卡，修复 1 个误区。/);
  assert.match(snapshot.weeklyReportMarkdown, /## 7 天总览/);
  assert.match(snapshot.weeklyReportMarkdown, /- 学习天数：1/);
  assert.match(snapshot.weeklyReportMarkdown, /- 小测验正确率：60%/);
  assert.match(snapshot.weeklyReportMarkdown, /- 语音笔记：2/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /Voice Note/);
  assert.match(snapshot.weeklyReportMarkdown, /错题最多：二分搜索边界条件（小测验，3 次）/);
  assert.match(snapshot.weeklyReportMarkdown, /本周最值得修复的 3 个误区/);
  assert.match(snapshot.weeklyReportMarkdown, /1\. 二分搜索边界条件（小测验，3 次）/);
  assert.match(snapshot.weeklyReportMarkdown, /高频问题：边界条件/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /Quiz 正确率/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /（quiz，3 次）/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /高频问题：edge_case/);
  assert.match(snapshot.weeklyReportMarkdown, /## AI 周总结/);
  assert.match(snapshot.weeklyReportMarkdown, /## 下周建议/);
  assert.match(snapshot.nextWeekPlan.summary, /算法设计/);
  assert.equal(snapshot.nextWeekPlan.steps.length, 3);
});

test("weekly review snapshot exposes top three mistake repair links", () => {
  const snapshot = buildWeeklyReviewSnapshot({
    mission: {
      title: "先修复本周误区",
      reason: "这周有三类错误重复出现。",
      href: "/mistakes?focus=mistake-a",
      ctaLabel: "修复误区",
      tone: "danger",
    },
    missionSignals: [],
    windowLabel: "2026-05-27 ~ 2026-06-02",
    lessons: [],
    domains: [],
    topMistake: null,
    mistakeRepairQueue: [
      {
        id: "mistake-a",
        summary: "二分搜索边界条件",
        source: "quiz",
        occurrenceCount: 5,
        lessonTitle: "二分搜索",
        status: "open",
      },
      {
        id: "mistake-b",
        summary: "RAG 召回与排序混在一起",
        source: "coach",
        occurrenceCount: 3,
        lessonTitle: "RAG 检索链路",
        status: "active",
      },
      {
        id: "mistake-c",
        summary: "复杂度只看一层循环",
        source: "code",
        occurrenceCount: 2,
        lessonTitle: null,
        status: "open",
      },
      {
        id: "mistake-d",
        summary: "已解决的历史误区不应挤进前三",
        source: "review",
        occurrenceCount: 20,
        lessonTitle: null,
        status: "resolved",
      },
    ],
    codePractice: {
      submissionCount: 0,
      feedbackCount: 0,
      issueCount: 0,
      topIssueType: null,
      latestFeedbackSummary: null,
    },
    reviewRetention: {
      reviewedCount: 0,
      retainedCount: 0,
      retentionRate: 0,
    },
    dueFlashcardsCount: 0,
    openMisconceptionsCount: 3,
    codeFeedbackNeedsAttentionCount: 0,
    activity: {
      voiceNotes: 0,
      coachReviews: 0,
      completedProjectMilestones: 0,
      newMisconceptions: 3,
      resolvedMisconceptions: 1,
      glossaryReviewed: 0,
      radarReviewed: 0,
    },
  });

  assert.equal(snapshot.mistakeRepairQueue.length, 3);
  assert.deepEqual(
    snapshot.mistakeRepairQueue.map((mistake) => mistake.href),
    [
      "/mistakes?focus=mistake-a",
      "/mistakes?focus=mistake-b",
      "/mistakes?focus=mistake-c",
    ],
  );
  assert.equal(snapshot.topMistake?.id, "mistake-a");
  assert.match(snapshot.weeklyReportMarkdown, /## 本周最值得修复的 3 个误区/);
  assert.match(snapshot.weeklyReportMarkdown, /1\. 二分搜索边界条件（小测验，5 次）/);
  assert.match(snapshot.weeklyReportMarkdown, /2\. RAG 召回与排序混在一起（Coach，3 次）/);
  assert.match(snapshot.weeklyReportMarkdown, /3\. 复杂度只看一层循环（代码反馈，2 次）/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /已解决的历史误区不应挤进前三/);
});

test("weekly review snapshot includes book chapters in weekly ritual output", async () => {
  const { getActiveBookSession } = await import("@/server/books/base");
  const activeBookSession = getActiveBookSession();

  assert.ok(activeBookSession);

  const snapshot = buildWeeklyReviewSnapshot({
    mission: {
      title: "继续同读书籍",
      reason: "本周读书章节需要回到周复盘。",
      href: "/books/ai-engineering",
      ctaLabel: "继续阅读",
      tone: "info",
    },
    missionSignals: [],
    windowLabel: "2026-05-27 ~ 2026-06-02",
    lessons: [],
    domains: [],
    topMistake: null,
    weeklyBookChapters: [
      {
        bookId: activeBookSession.documentId,
        title: activeBookSession.title,
        currentPage: activeBookSession.currentPage,
        nextPage: activeBookSession.nextPage,
        href: `/books/${activeBookSession.documentId}`,
      },
    ],
    codePractice: {
      submissionCount: 0,
      feedbackCount: 0,
      issueCount: 0,
      topIssueType: null,
      latestFeedbackSummary: null,
    },
    reviewRetention: {
      reviewedCount: 0,
      retainedCount: 0,
      retentionRate: 0,
    },
    dueFlashcardsCount: 0,
    openMisconceptionsCount: 0,
    codeFeedbackNeedsAttentionCount: 0,
    activity: {
      voiceNotes: 0,
      coachReviews: 0,
      completedProjectMilestones: 0,
      newMisconceptions: 0,
      resolvedMisconceptions: 0,
      glossaryReviewed: 0,
      radarReviewed: 0,
    },
  });

  assert.deepEqual(snapshot.weeklyBookChapters, [
    {
      bookId: "ai-engineering",
      title: "AI Engineering",
      pageRange: "第 12-14 页",
      href: "/books/ai-engineering",
    },
  ]);
  assert.match(snapshot.weeklyReportMarkdown, /## 本周同读章节/);
  assert.match(snapshot.weeklyReportMarkdown, /- AI Engineering：第 12-14 页/);
  assert.match(snapshot.weeklyReportMarkdown, /\/books\/ai-engineering/);
});

test("weekly code issue type labels stay learner-friendly", () => {
  assert.equal(weeklyCodeIssueTypeLabel("logic"), "逻辑问题");
  assert.equal(weeklyCodeIssueTypeLabel("edge_case"), "边界条件");
  assert.equal(weeklyCodeIssueTypeLabel("bounds"), "一般问题");
  assert.equal(weeklyCodeIssueTypeLabel(null), "暂无");
  assert.equal(weeklyMistakeSourceLabel("voice"), "语音笔记");
});

test("weekly review snapshot tolerates empty weekly data", () => {
  const snapshot = buildWeeklyReviewSnapshot({
    mission: {
      title: "继续今日学习",
      reason: "还没有明显补弱项。",
      href: "/today",
      ctaLabel: "继续",
      tone: "info",
    },
    missionSignals: [],
    windowLabel: "2026-05-27 ~ 2026-06-02",
    lessons: [],
    domains: [],
    topMistake: null,
    codePractice: {
      submissionCount: 0,
      feedbackCount: 0,
      issueCount: 0,
      topIssueType: null,
      latestFeedbackSummary: null,
    },
    reviewRetention: {
      reviewedCount: 0,
      retainedCount: 0,
      retentionRate: 0,
    },
    dueFlashcardsCount: 0,
    openMisconceptionsCount: 0,
    codeFeedbackNeedsAttentionCount: 0,
    activity: {
      voiceNotes: 0,
      coachReviews: 0,
      completedProjectMilestones: 0,
      newMisconceptions: 0,
      resolvedMisconceptions: 0,
      glossaryReviewed: 0,
      radarReviewed: 0,
    },
  });

  assert.equal(snapshot.weeklyOverview.studyDays, 0);
  assert.equal(snapshot.weeklyOverview.quizAccuracy, 0);
  assert.equal(snapshot.strongestDomain, null);
  assert.equal(snapshot.weakestDomain, null);
  assert.equal(snapshot.topMistake, null);
  assert.deepEqual(snapshot.mistakeRepairQueue, []);
  assert.equal(
    snapshot.weeklyRitualSummary.summary,
    "你学习了 0 天，完成 0 节课，复习 0 张卡，修复 0 个误区。",
  );
  assert.equal(snapshot.weeklyRitualSummary.badgeTitle, "学习节奏重启者");
  assert.match(snapshot.aiSummary.mostImportantGain, /还没有足够数据/);
  assert.match(snapshot.weeklyReportMarkdown, /# Roky Learn 每周复盘/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /# Roky Learn Weekly Report/);
  assert.match(snapshot.weeklyReportMarkdown, /还没有足够数据/);
  assert.match(snapshot.nextWeekPlan.summary, /没有明显弱项/);
});

test("weekly page renders overview and fallback AI summary labels", () => {
  const source = readFileSync("src/app/weekly/page.tsx", "utf8");

  assert.match(source, /badge="每周复盘"/);
  assert.doesNotMatch(source, /badge="Weekly"/);
  assert.match(source, /7 天总览/);
  assert.match(source, /小测验正确率/);
  assert.doesNotMatch(source, /quiz 正确率/);
  assert.match(source, /最强/);
  assert.match(source, /待补强/);
  assert.doesNotMatch(source, /Strongest/);
  assert.doesNotMatch(source, /Weakest/);
  assert.match(source, /掌握分/);
  assert.match(source, /薄弱分/);
  assert.match(source, /测验正确率/);
  assert.doesNotMatch(source, /mastery：/);
  assert.doesNotMatch(source, /weakness：/);
  assert.doesNotMatch(source, /quiz：/);
  assert.match(source, /weeklyMistakeSourceLabel/);
  assert.match(source, /小测验/);
  assert.doesNotMatch(source, /weekly\.topMistake\.source\}<\/LearningStatusBadge>/);
  assert.match(source, /weeklyCodeIssueTypeLabel\(weekly\.codePractice\.topIssueType\)/);
  assert.doesNotMatch(source, /weekly\.codePractice\.topIssueType \?\? "暂无"/);
  assert.match(source, /语音笔记/);
  assert.doesNotMatch(source, /Voice Note/);
  assert.match(source, /Coach 次数/);
  assert.match(source, /项目里程碑/);
  assert.match(source, /术语\/Radar 覆盖/);
  assert.match(source, /AI 周总结/);
  assert.match(source, /推荐下一阶段/);
  assert.match(source, /第 \{index \+ 1\} 步/);
  assert.doesNotMatch(source, /Step \{index \+ 1\}/);
  assert.match(source, /导出 Weekly Markdown/);
  assert.match(source, /weeklyReportMarkdown/);
  assert.match(source, /readOnly/);
  assert.doesNotMatch(source, /aria-label="weekly report markdown"/);
  assert.match(source, /aria-label="导出 Weekly Markdown 周报"/);
  assert.match(source, /复习留存率/);
  assert.match(source, /本周最值得修复的 3 个误区/);
  assert.match(source, /weekly\.mistakeRepairQueue\.map/);
  assert.match(source, /href=\{mistake\.href\}/);
  assert.match(source, /weeklyMistakeRepairLinkClassName/);
  assert.match(source, /关联课程：\{mistake\.lessonTitle \?\? "未关联课程"\}/);
  assert.match(source, /本周同读章节/);
  assert.match(source, /weekly\.weeklyBookChapters\.map/);
  assert.match(source, /href=\{chapter\.href\}/);
  assert.match(source, /weeklyBookChapterLinkClassName/);
  assert.match(source, /chapter\.pageRange/);
  assert.doesNotMatch(source, /错题最多的概念/);
});

test("weekly page renders ritual summary badge and reflection note form", () => {
  const source = readFileSync("src/app/weekly/page.tsx", "utf8");

  assert.match(source, /saveWeeklyReflectionAction/);
  assert.match(source, /本周学习总结/);
  assert.match(source, /本周称号/);
  assert.match(source, /weekly\.weeklyRitualSummary\.summary/);
  assert.match(source, /weekly\.weeklyRitualSummary\.badgeTitle/);
  assert.match(source, /weekly\.weeklyRitualSummary\.badgeReason/);
  assert.match(source, /action=\{saveWeeklyReflectionAction\}/);
  assert.match(source, /name="title"/);
  assert.match(source, /name="windowLabel"/);
  assert.match(source, /name="content"/);
  assert.match(source, /defaultValue=\{weekly\.weeklyRitualSummary\.reflectionTemplate\}/);
  assert.match(source, /我这周最大的收获是\.\.\./);
  assert.match(source, /我下周想重点学\.\.\./);
  assert.match(
    source,
    /const weeklyReflectionButtonClassName = "min-h-11 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary\/90 sm:w-auto";/,
  );
});

test("weekly reflection action writes standalone notes behind preview guard", () => {
  const source = readFileSync("src/app/weekly/actions.ts", "utf8");

  assert.match(source, /"use server"/);
  assert.match(source, /assertWritableRequest/);
  assert.match(source, /requireUserId/);
  assert.match(source, /createScopedNote/);
  assert.match(source, /lessonId: null/);
  assert.match(source, /每周复盘：/);
  assert.match(source, /revalidatePath\("\/weekly"\)/);
  assert.match(source, /revalidatePath\("\/notes"\)/);
  assert.match(source, /redirect\(`\/notes\?noteId=\$\{encodeURIComponent\(note\.id\)\}`\)/);
});

test("weekly next week plan links keep mobile touch targets", () => {
  const source = readFileSync("src/app/weekly/page.tsx", "utf8");

  assert.match(
    source,
    /const weeklyNextStepLinkClassName = "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted\/40";/,
  );
  assert.equal(
    (source.match(/className=\{weeklyNextStepLinkClassName\}/g) ?? []).length,
    1,
  );
});

test("weekly mistake repair links keep mobile touch targets", () => {
  const source = readFileSync("src/app/weekly/page.tsx", "utf8");

  assert.match(
    source,
    /const weeklyMistakeRepairLinkClassName = "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted\/40";/,
  );
  assert.equal(
    (source.match(/className=\{weeklyMistakeRepairLinkClassName\}/g) ?? []).length,
    1,
  );
});
