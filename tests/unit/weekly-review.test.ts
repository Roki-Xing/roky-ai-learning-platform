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
      summary: "二分搜索边界条件",
      source: "quiz",
      occurrenceCount: 3,
      lessonTitle: "二分搜索",
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
  assert.equal(snapshot.codePractice.topIssueType, "edge_case");
  assert.equal(snapshot.reviewRetention.retentionRate, 63);
  assert.match(snapshot.aiSummary.mostImportantGain, /LLM \/ RAG \/ Agent/);
  assert.match(snapshot.aiSummary.mainWeakness, /算法设计/);
  assert.match(snapshot.aiSummary.nextWeekSuggestion, /算法设计/);
  assert.match(snapshot.aiSummary.recommendedNextStage, /算法设计/);
  assert.match(snapshot.weeklyReportMarkdown, /# Roky Learn 每周复盘/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /# Roky Learn Weekly Report/);
  assert.match(snapshot.weeklyReportMarkdown, /2026-05-27 ~ 2026-06-02/);
  assert.match(snapshot.weeklyReportMarkdown, /## 7 天总览/);
  assert.match(snapshot.weeklyReportMarkdown, /- 学习天数：1/);
  assert.match(snapshot.weeklyReportMarkdown, /- 小测验正确率：60%/);
  assert.match(snapshot.weeklyReportMarkdown, /- 语音笔记：2/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /Voice Note/);
  assert.match(snapshot.weeklyReportMarkdown, /错题最多：二分搜索边界条件（小测验，3 次）/);
  assert.match(snapshot.weeklyReportMarkdown, /高频问题：边界条件/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /Quiz 正确率/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /（quiz，3 次）/);
  assert.doesNotMatch(snapshot.weeklyReportMarkdown, /高频问题：edge_case/);
  assert.match(snapshot.weeklyReportMarkdown, /## AI 周总结/);
  assert.match(snapshot.weeklyReportMarkdown, /## 下周建议/);
  assert.match(snapshot.nextWeekPlan.summary, /算法设计/);
  assert.equal(snapshot.nextWeekPlan.steps.length, 3);
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
