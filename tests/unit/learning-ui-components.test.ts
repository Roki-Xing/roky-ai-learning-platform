import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LearningFocusPanel } from "@/components/learning/learning-focus-panel";
import { LearningFocusPlayer } from "@/components/learning/learning-focus-player";
import { LearningMissionCard } from "@/components/learning/learning-mission-card";
import { LearningSessionStrip } from "@/components/learning/learning-session-strip";
import { LearningSectionCard } from "@/components/learning/learning-section-card";
import { LearningMarkdown } from "@/components/learning/learning-markdown";
import { CollapsibleContentSection } from "@/components/learning/collapsible-content-section";
import { LearningCelebrationCue } from "@/components/learning/learning-celebration-cue";
import { LearningCompletionCard } from "@/components/learning/learning-completion-card";
import { LearningEmptyState } from "@/components/learning/learning-empty-state";
import { KnowledgePathExplorer } from "@/components/learning/knowledge-path-explorer";
import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStepCard } from "@/components/learning/learning-step-card";
import { LearningTimeline } from "@/components/learning/learning-timeline";
import type { LearningSessionSummary } from "@/server/learning/current-mission";
import { VoiceLearningPipeline } from "@/app/voice/ui/voice-learning-pipeline";
import { ReviewRatingControls, ReviewTrainer } from "@/app/review/ui/review-trainer";
import { visualPages } from "@/../tests/e2e/visual-pages";

test("visual smoke covers the core learning archive pages", () => {
  const pageNames = visualPages.map((page) => page.name);

  assert.ok(pageNames.includes("login"));
  assert.ok(pageNames.includes("library"));
  assert.ok(pageNames.includes("map"));
  assert.ok(pageNames.includes("projects"));
  assert.ok(pageNames.includes("path"));
  assert.ok(pageNames.includes("weekly"));
  assert.ok(pageNames.includes("mistakes"));
  assert.ok(pageNames.includes("progress"));
  assert.ok(pageNames.includes("settings"));
});

test("learning session strip renders current next and weekly sessions", () => {
  const sessions: LearningSessionSummary = {
    current: {
      type: "review_session",
      title: "复习 5 张到期卡",
      goal: "清空到期复习，先把今天学过的内容留住。",
      status: "in_progress",
      startedAt: null,
      completedAt: null,
      outputs: ["review logs", "weak signals"],
      nextRecommendedSession: {
        type: "voice_reflection",
        title: "说出今天的理解",
        goal: "用 60 秒口述暴露卡住点，再交给 Coach 检查。",
      },
      href: "/review",
      ctaLabel: "开始复习",
    },
    next: {
      type: "voice_reflection",
      title: "说出今天的理解",
      goal: "用 60 秒口述暴露卡住点，再交给 Coach 检查。",
      status: "not_started",
      startedAt: null,
      completedAt: null,
      outputs: ["transcript", "note draft", "coach input"],
      nextRecommendedSession: {
        type: "coach_session",
        title: "让 Coach 检查理解",
        goal: "把模糊点说清楚，得到缺失概念和下一步问题。",
      },
      href: "/voice",
      ctaLabel: "去说一遍",
    },
    weekly: {
      type: "weekly_review",
      title: "本周会话：完成 3/7",
      goal: "把一周学习转成下周计划。",
      status: "in_progress",
      startedAt: null,
      completedAt: null,
      outputs: ["weekly summary", "next week plan"],
      nextRecommendedSession: {
        type: "glossary_explore",
        title: "探索一个术语路径",
        goal: "把术语放回知识路径，而不是只看孤立解释。",
      },
      href: "/weekly",
      ctaLabel: "做周复盘",
    },
  };

  const markup = renderToStaticMarkup(
    React.createElement(LearningSessionStrip, { sessions }),
  );

  assert.match(markup, /aria-label="学习会话"/);
  assert.match(markup, /当前会话/);
  assert.match(markup, /下一会话/);
  assert.match(markup, /本周会话/);
  assert.match(markup, /复习 5 张到期卡/);
  assert.match(markup, /本周会话：完成 3\/7/);
  assert.match(markup, /产出：review logs \/ weak signals/);
  assert.match(markup, /下一步：说出今天的理解/);
  assert.match(markup, /href="\/review"/);
  assert.match(markup, /开始复习/);
  assert.match(markup, /min-h-11 w-full sm:w-auto/);
  assert.doesNotMatch(markup, /用户看到的是会话/);
  assert.doesNotMatch(markup, /不是分散页面/);
});

test("learning markdown renders headings, tables, code, and math without raw html", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningMarkdown, {
      content: [
        "# Attention",
        "",
        "Use `softmax` safely.",
        "",
        "Inline math: $a^T b$.",
        "",
        "$$",
        "\\operatorname{softmax}(x_i)=\\frac{e^{x_i}}{\\sum_j e^{x_j}}",
        "$$",
        "",
        "| A | B |",
        "| - | - |",
        "| x | y |",
        "",
        "```python",
        "print('ok')",
        "```",
        "",
        "<script>alert('x')</script>",
      ].join("\n"),
    }),
  );

  assert.match(markup, /Attention/);
  assert.match(markup, /<table/);
  assert.match(markup, /language-python/);
  assert.match(markup, /class="katex"/);
  assert.match(markup, /class="katex-display"/);
  assert.match(markup, /softmax/);
  assert.doesNotMatch(markup, /<script>/);
});

test("learning markdown renders course callouts and copyable code blocks", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningMarkdown, {
      content: [
        "> 核心直觉：注意力是在候选信息里分配权重。",
        "",
        "> 常见误区：把 softmax 当成固定平均。",
        "",
        "> 重点：注意力权重表示每个候选信息对当前输出的贡献。",
        "",
        "> 例子卡：查询词像一个问题，键值对像可查阅的笔记。",
        "",
        "> 代码/伪代码：scores = q @ k.T，然后对 scores 做 softmax 得到权重。",
        "",
        "> 图示：把 Query 画在左侧，Key/Value 候选排成一列，用箭头粗细表示权重。",
        "",
        "> 互动实验：把 temperature 从 0.5 调到 2，观察 softmax 权重如何变平。",
        "",
        "> 自测卡：不看笔记说出 Query、Key、Value 各自的作用。",
        "",
        "```python",
        "def attention(q, k, v):",
        "    return v",
        "```",
      ].join("\n"),
    }),
  );

  assert.match(markup, /data-learning-callout="intuition"/);
  assert.match(markup, /data-learning-callout="mistake"/);
  assert.match(markup, /data-learning-callout="key_point"/);
  assert.match(markup, /data-learning-callout="example"/);
  assert.match(markup, /data-learning-callout="code_sketch"/);
  assert.match(markup, /data-learning-callout="diagram"/);
  assert.match(markup, /data-learning-callout="experiment"/);
  assert.match(markup, /data-learning-callout="self_check"/);
  assert.match(markup, /核心直觉/);
  assert.match(markup, /常见误区/);
  assert.match(markup, /重点/);
  assert.match(markup, /当前输出的贡献/);
  assert.match(markup, /例子卡/);
  assert.match(markup, /代码\/伪代码/);
  assert.match(markup, /softmax 得到权重/);
  assert.match(markup, /图示/);
  assert.match(markup, /箭头粗细表示权重/);
  assert.match(markup, /互动实验/);
  assert.match(markup, /观察 softmax 权重如何变平/);
  assert.match(markup, /自测/);
  assert.match(markup, /不看笔记说出 Query/);
  assert.match(markup, /data-copy-code="true"/);
  assert.match(markup, /min-h-11/);
  assert.match(markup, /复制代码/);
  assert.match(markup, /def attention/);
});

test("learning focus panel renders focused stage controls", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningFocusPanel, {
      stages: [
        {
          id: "goal",
          title: "今日目标",
          description: "明确主题",
          href: "#goal",
          status: "done",
        },
        {
          id: "lesson",
          title: "主课通读",
          description: "读正文",
          href: "#lesson",
          status: "active",
        },
      ],
    }),
  );

  assert.match(markup, /专注模式/);
  assert.match(markup, /主课通读/);
  assert.match(markup, /aria-label="专注模式进度"/);
  assert.doesNotMatch(markup, />Focus Mode</);
  assert.doesNotMatch(markup, /aria-label="Focus Mode 进度"/);
  assert.match(markup, /上一步/);
  assert.match(markup, /下一步/);
  assert.match(markup, /mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  const focusPanelControlMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(focusPanelControlMatches.length, 3);
});

test("learning progress bar exposes progressbar semantics", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningProgressBar, {
      value: 0.42,
      label: "今日学习进度",
    }),
  );

  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /aria-label="今日学习进度"/);
  assert.match(markup, /aria-valuemin="0"/);
  assert.match(markup, /aria-valuemax="100"/);
  assert.match(markup, /aria-valuenow="42"/);
  assert.match(markup, /aria-valuetext="42%"/);
  assert.match(markup, /width:42%/);
});

test("learning section card action wrapper supports full-width mobile actions", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningSectionCard, {
      title: "今日学习",
      description: "主课、复习和表达理解组成今天的闭环。",
      action: React.createElement("a", { href: "/today" }, "继续今日学习"),
    }, React.createElement("p", null, "今日内容")),
  );

  assert.match(markup, /今日学习/);
  assert.match(markup, /继续今日学习/);
  assert.match(markup, /w-full sm:w-auto sm:shrink-0/);
  assert.doesNotMatch(markup, /class="shrink-0"/);
});

test("learning step card exposes step and status text without noninteractive aria labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningStepCard, {
      index: 2,
      title: "送 Coach 检查",
      description: "先检查概念混淆。",
      status: "active",
    }),
  );

  assert.match(markup, /送 Coach 检查/);
  assert.match(markup, /进行中/);
  assert.match(markup, /sr-only/);
  assert.match(markup, /第 2 步，进行中/);
  assert.doesNotMatch(markup, /aria-label="第 2 步，进行中"/);
  assert.doesNotMatch(markup, /title="step 2"/);
});

test("learning timeline exposes step and status text without noninteractive aria labels", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningTimeline, {
      title: "今日流程",
      items: [
        { id: "goal", label: "今日目标", href: "#goal", status: "done" },
        { id: "lesson", label: "主课通读", href: "#lesson", status: "active" },
        { id: "quiz", label: "小测验", href: "#quiz", status: "todo" },
      ],
    }),
  );

  assert.match(markup, /今日流程/);
  assert.match(markup, /第 1 步，完成/);
  assert.match(markup, /第 2 步，进行中/);
  assert.match(markup, /第 3 步，待办/);
  assert.doesNotMatch(markup, /aria-label="第 2 步，进行中"/);
});

test("learning focus player renders one active stage with overview rail", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningFocusPlayer, {
      stages: [
        {
          id: "goal",
          title: "今日目标",
          eyebrow: "第 1 步",
          description: "先明确学习任务。",
          status: "done",
          body: React.createElement("p", null, "目标内容"),
        },
        {
          id: "lesson",
          title: "主课通读",
          eyebrow: "第 2 步",
          description: "读懂核心概念。",
          status: "active",
          guidance: {
            task: "读完核心概念并圈出一句自己的解释。",
            reason: "先建立直觉，再进入练习。",
            completion: "能用一句话说清楚 softmax 为什么要归一化。",
          },
          body: React.createElement("p", null, "主课内容"),
        },
      ],
      overview: [
        { label: "状态", value: "planned" },
        { label: "卡片", value: 3 },
      ],
      actions: React.createElement("a", { href: "/review" }, "去复习"),
    }),
  );

  assert.match(markup, /专注学习模式/);
  assert.match(markup, /主课通读/);
  assert.match(markup, /第 2 步/);
  assert.doesNotMatch(markup, />Step 1</);
  assert.doesNotMatch(markup, />Step 2</);
  assert.match(markup, /主课内容/);
  assert.match(markup, /今日概览/);
  assert.match(markup, /planned/);
  assert.match(markup, /2 \/ 2/);
  assert.match(markup, /aria-label="今日学习进度"/);
  assert.match(markup, /完整视图/);
  assert.match(markup, /aria-label="切换到今日目标（完成）"/);
  assert.match(markup, /aria-label="切换到主课通读（进行中）"/);
  assert.match(markup, /sticky top-0/);
  assert.match(markup, /sticky bottom-16/);
  assert.match(markup, /min-h-11/);
  assert.match(markup, /你现在要做什么/);
  assert.match(markup, /读完核心概念并圈出一句自己的解释/);
  assert.match(markup, /为什么做这个/);
  assert.match(markup, /先建立直觉，再进入练习/);
  assert.match(markup, /完成标准/);
  assert.match(markup, /能用一句话说清楚 softmax 为什么要归一化/);
  assert.match(markup, /mt-3 grid gap-2 sm:flex sm:flex-wrap/);
  assert.doesNotMatch(markup, /mt-3 flex flex-wrap gap-2/);
  assert.doesNotMatch(markup, /目标内容/);
});

test("today focus stages use localized step eyebrow labels", () => {
  const source = readFileSync("src/app/today/page.tsx", "utf8");

  assert.match(source, /eyebrow: "第 1 步"/);
  assert.match(source, /eyebrow: "第 7 步"/);
  assert.match(source, /"专注模式下方保留完整课程页面，按需展开。"/);
  assert.doesNotMatch(source, /eyebrow: "Step [0-9]"/);
  assert.doesNotMatch(source, /"Focus Mode 下方保留完整课程页面，按需展开。"/);
});

test("learning mission card renders mission status, reason, and action", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningMissionCard, {
      title: "完成今日学习",
      description: "一步一步走完引导步骤与小测验",
      statusLabel: "待完成",
      tone: "warning",
      href: "/today",
      actionLabel: "继续",
    }),
  );

  assert.match(markup, /完成今日学习/);
  assert.match(markup, /一步一步走完引导步骤与小测验/);
  assert.match(markup, /待完成/);
  assert.match(markup, /href="\/today"/);
  assert.match(markup, /继续/);
  assert.match(markup, /grid gap-3 rounded-lg border p-3 text-sm sm:flex sm:items-start sm:justify-between/);
  assert.match(markup, /min-h-11 w-full sm:w-auto sm:shrink-0/);
  assert.doesNotMatch(markup, /class="shrink-0"/);
});

test("learning empty state actions use full-width mobile touch targets", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningEmptyState, {
      title: "还没有语音笔记",
      description: "保存后这里会出现分析入口。",
      actions: [
        { href: "/today", label: "回到今日学习", variant: "secondary" },
        { href: "/coach", label: "打开 Coach", variant: "outline" },
      ],
    }),
  );

  assert.match(markup, /还没有语音笔记/);
  assert.match(markup, /保存后这里会出现分析入口/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap/);
  const emptyStateCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(emptyStateCtaMatches.length, 2);
});

test("collapsible content section keeps children hidden by default", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CollapsibleContentSection, {
      id: "full-view",
      title: "查看完整课程内容",
      description: "专注模式下方保留完整课程页面，按需展开。",
    }, React.createElement("div", null, "完整课程正文")),
  );

  assert.match(markup, /查看完整课程内容/);
  assert.match(markup, /按需展开/);
  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /aria-controls="full-view-panel"/);
  assert.doesNotMatch(markup, /完整课程正文/);
});

test("collapsible content section links expanded content to its toggle", () => {
  const markup = renderToStaticMarkup(
    React.createElement(CollapsibleContentSection, {
      id: "full-view",
      title: "查看完整课程内容",
      defaultOpen: true,
    }, React.createElement("div", null, "完整课程正文")),
  );

  assert.match(markup, /aria-expanded="true"/);
  assert.match(markup, /aria-controls="full-view-panel"/);
  assert.match(markup, /id="full-view-panel"/);
  assert.match(markup, /role="region"/);
  assert.match(markup, /aria-labelledby="full-view-toggle"/);
  assert.match(markup, /完整课程正文/);
});

test("learning celebration cue stays lightweight and task-specific", () => {
  const markup = renderToStaticMarkup(
    React.createElement("div", null,
      React.createElement(LearningCelebrationCue, {
        kind: "today_complete",
        metric: "生成 3 张复习卡",
      }),
      React.createElement(LearningCelebrationCue, {
        kind: "review_cleared",
        metric: "本轮 4 张",
      }),
      React.createElement(LearningCelebrationCue, {
        kind: "project_milestone",
        metric: "2/3 里程碑",
      }),
      React.createElement(LearningCelebrationCue, {
        kind: "misconception_resolved",
      }),
    ),
  );

  assert.match(markup, /完成反馈/);
  assert.match(markup, /复习总结/);
  assert.match(markup, /项目进度/);
  assert.match(markup, /掌握证据/);
  assert.doesNotMatch(markup, />Session summary</);
  assert.doesNotMatch(markup, />Project progress</);
  assert.doesNotMatch(markup, />Mastery signal</);
  assert.match(markup, /今日学习完成/);
  assert.match(markup, /复习清空/);
  assert.match(markup, /里程碑完成/);
  assert.match(markup, /误区已解决/);
  assert.match(markup, /生成 3 张复习卡/);
});

test("learning completion card shows a celebration cue after today's learning is complete", () => {
  const markup = renderToStaticMarkup(
    React.createElement(LearningCompletionCard, {
      completion: {
        title: "完成后下一步",
        statusLabel: "今日已完成",
        summary: "今日完成，已生成卡片。",
        recommendedVoiceReflection: {
          title: "推荐语音反思",
          prompt: "用 60 秒说清今天学到的一句话。",
          href: "/voice?lessonId=lesson-1&mode=daily_understanding",
          ctaLabel: "去语音反思",
        },
        projectPractice: {
          title: "RAG 问答原型",
          milestoneTitle: "接入向量检索",
          milestoneTask: "把今天学到的检索链路接进项目。",
          percent: 67,
          href: "/projects?projectId=project-1",
          ctaLabel: "继续项目",
        },
        actions: [
          {
            href: "/review",
            label: "复习今日卡片",
            description: "先巩固刚生成的卡片。",
            tone: "success",
          },
        ],
      },
    }),
  );

  assert.match(markup, /今日学习完成/);
  assert.match(markup, /完成反馈/);
  assert.match(markup, /aria-label="今日项目任务进度"/);
  assert.match(markup, /复习今日卡片/);
  assert.match(markup, /推荐语音反思/);
  assert.match(markup, /去语音反思/);
  assert.match(markup, /继续项目/);
  const mobileCompletionCtaMatches = markup.match(/min-h-11 w-full sm:w-auto sm:shrink-0/g) ?? [];
  assert.equal(mobileCompletionCtaMatches.length, 3);
  assert.doesNotMatch(markup, /class="shrink-0"/);
});

test("voice learning pipeline shows coach note cards and review next steps", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceLearningPipeline, {
      hasSelected: true,
      hasCoach: false,
      hasNote: false,
      hasCards: false,
      linkedCards: 0,
      voiceNoteId: "voice-1",
      reviewId: null,
      noteId: null,
    }),
  );

  assert.match(markup, /语音学习流水线/);
  assert.match(markup, /当前最优动作/);
  assert.doesNotMatch(markup, />Coach</);
  assert.doesNotMatch(markup, />Note</);
  assert.doesNotMatch(markup, />Cards</);
  assert.match(markup, />Coach 检查</);
  assert.match(markup, />整理笔记</);
  assert.match(markup, />复习卡片</);
  assert.match(markup, /送 Coach 检查/);
  assert.match(markup, /先检查概念混淆/);
  assert.match(markup, /整理成笔记/);
  assert.match(markup, /生成复习卡片/);
  assert.match(markup, /去复习/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap/);
  assert.match(markup, /min-h-11 w-full sm:w-auto/);
});

test("voice learning pipeline focuses review queue after cards are generated", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceLearningPipeline, {
      hasSelected: true,
      hasCoach: true,
      hasNote: true,
      hasCards: true,
      linkedCards: 3,
      voiceNoteId: "voice-1",
      reviewId: "review-1",
      noteId: "note-1",
    }),
  );

  assert.match(markup, /复习这 3 张语音卡片/);
  assert.match(markup, /当前最优动作/);
  assert.match(markup, />3 张卡片</);
  assert.doesNotMatch(markup, />3 cards</);
  assert.match(markup, /href="\/review\?source=voice-note"/);
  assert.match(markup, /语音卡片已进入复习队列/);
  assert.match(markup, /href="\/notes\?noteId=note-1"/);
  assert.match(markup, /查看这条笔记/);
  const nextActionBlock = markup.slice(markup.indexOf("当前最优动作"), markup.indexOf("语音卡片已进入复习队列"));
  assert.match(nextActionBlock, /grid gap-3 sm:flex sm:items-center sm:justify-between/);
  assert.match(nextActionBlock, /min-h-11 w-full sm:w-auto/);
});

test("knowledge path explorer renders viewed card reviewed weak and next states", () => {
  const markup = renderToStaticMarkup(
    React.createElement(KnowledgePathExplorer, {
      paths: [
        {
          id: "agent_basics",
          label: "Agent 基础链路",
          kind: "glossary",
          description: "从 CoT 到 SWE-bench。",
          items: [
            {
              slug: "cot",
              viewed: true,
              hasCard: true,
              reviewed: true,
              weak: false,
              statusLabel: "已复习",
            },
            {
              slug: "react",
              viewed: true,
              hasCard: true,
              reviewed: false,
              weak: true,
              statusLabel: "已生成卡片",
            },
          ],
          viewedCount: 2,
          cardCount: 2,
          reviewedCount: 1,
          weakCount: 1,
          masteredCount: 1,
          nextSlug: "react",
          nextStatusLabel: "已生成卡片",
        },
      ],
      hrefForSlug: (slug) => `/glossary?term=${slug}`,
    }),
  );

  assert.match(markup, /路径化学习/);
  assert.match(markup, /路径模式/);
  assert.match(markup, /Agent 基础链路/);
  assert.match(markup, /<div>已看<\/div><div class="[^"]*">2\/2<\/div>/);
  assert.match(markup, /<div>已生成卡片<\/div><div class="[^"]*">2\/2<\/div>/);
  assert.match(markup, /<div>已复习<\/div><div class="[^"]*">1\/2<\/div>/);
  assert.match(markup, /<div>掌握<\/div><div class="[^"]*">1\/2<\/div>/);
  assert.match(markup, /aria-label="路径进度：Agent 基础链路"/);
  assert.doesNotMatch(markup, /aria-label="已看 2\/2"/);
  assert.doesNotMatch(markup, /aria-label="已生成卡片 2\/2"/);
  assert.match(markup, /grid gap-3 sm:flex sm:items-start sm:justify-between/);
  assert.match(markup, /min-h-11 w-full sm:w-auto sm:shrink-0/);
  assert.match(markup, /下一项/);
  assert.match(markup, /react/);
  assert.doesNotMatch(markup, />Path Mode</);
  assert.doesNotMatch(markup, /未看过|已看过|已制卡|未掌握/);
});

test("review trainer completion summary highlights retention and next action", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ReviewTrainer, {
      card: null,
      queueSize: 0,
      initialSessionCounts: {
        forgot: 2,
        hard: 1,
        good: 1,
        easy: 0,
      },
      emptyState: {
        title: "暂无到期卡片",
        actions: [],
      },
    }),
  );

  assert.match(markup, /这轮复习暴露了补弱点/);
  assert.match(markup, /复习清空/);
  assert.match(markup, /留存 25%/);
  assert.match(markup, /让 Coach 拆解薄弱点/);
  assert.match(markup, /忘了/);
  assert.match(markup, /模糊/);
  assert.match(markup, /建议/);
  assert.match(markup, /把忘掉的卡片改写成自己的解释/);
  assert.match(markup, /补弱动作/);
  assert.match(markup, /让 Coach 解释这些卡片/);
  assert.match(markup, /生成补弱小课/);
  assert.match(markup, /查看错题中心/);
  assert.match(markup, /href="\/mistakes"/);
  assert.match(markup, /mt-4 grid gap-2 sm:flex sm:flex-wrap/);
  for (const label of ["让 Coach 拆解薄弱点", "回到今日学习"]) {
    const labelIndex = markup.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = markup.slice(Math.max(0, labelIndex - 320), labelIndex + 120);
    assert.match(ctaWindow, /min-h-11 w-full sm:w-auto/);
  }
});

test("review page header CTA uses mobile touch target classes", () => {
  const source = readFileSync("src/app/review/page.tsx", "utf8");

  assert.match(source, /const reviewPageCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(
    source,
    /<Button size="sm" asChild className=\{reviewPageCtaClassName\}>\s*<a href="#card">开始复习<\/a>/,
  );
});

test("review statistics use learner-facing copy for total review records", () => {
  const source = readFileSync("src/app/review/page.tsx", "utf8");

  assert.match(source, /累计复习记录/);
  assert.doesNotMatch(source, /累计 ReviewLog/);
});

test("review trainer active card keeps mobile controls large and centered", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ReviewTrainer, {
      card: {
        id: "card-1",
        front: "什么是注意力权重？",
        back: "在候选信息之间分配的重要性分数。",
        type: "concept",
      },
      queueSize: 4,
      emptyState: {
        title: "暂无到期卡片",
        actions: [],
      },
    }),
  );

  assert.match(markup, /max-w-2xl/);
  assert.match(markup, /显示答案/);
  assert.match(markup, /min-h-12/);
  assert.match(markup, /aria-label="复习队列进度"/);
  assert.match(markup, /hidden/);
  assert.match(markup, /sm:block/);
  assert.match(markup, /电脑快捷键/);
});

test("review trainer localizes active card type labels for learners", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ReviewTrainer, {
      card: {
        id: "card-code-feedback",
        front: "这段代码的边界条件哪里会失败？",
        back: "空数组时会访问不存在的下标。",
        type: "code_bug",
      },
      queueSize: 2,
      emptyState: {
        title: "暂无到期卡片",
        actions: [],
      },
    }),
  );

  assert.match(markup, /代码反馈卡/);
  assert.doesNotMatch(markup, />code_bug</);
});

test("review rating controls use large mobile buttons without relying on keyboard shortcuts", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ReviewRatingControls, {
      disabled: false,
      onRating: () => undefined,
    }),
  );

  assert.match(markup, /aria-label="复习评分"/);
  assert.match(markup, /grid gap-2 sm:grid-cols-4/);
  assert.match(markup, /min-h-12/);
  assert.match(markup, /忘了/);
  assert.match(markup, /模糊/);
  assert.match(markup, /记得/);
  assert.match(markup, /很熟/);
});
