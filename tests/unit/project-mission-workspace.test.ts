import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MissionCompletionCriteria,
  ProjectCompletionRitual,
  ProjectDailyRhythmCard,
  ProjectFeedbackNextFix,
  ProjectListPanel,
  ProjectMilestonePath,
  ProjectMissionBrief,
  ProjectMissionHero,
  ProjectPortfolioPageContent,
  ProjectPortfolioPanel,
  ProjectReviewQueuePanel,
  ProjectTemplateList,
  ProjectTypeFilter,
} from "@/app/projects/ui/project-mission-workspace";

test("project mission hero renders the mission workspace hierarchy", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionHero, {
      mission: {
        id: "project-1",
        title: "Markdown 笔记搜索器",
        description: "用 Python 建一个可复习的小项目。",
        typeLabel: "Python 基础",
        status: "active",
        percent: 40,
        totalMilestones: 5,
        completedMilestones: 2,
        remainingMilestones: 3,
        topicCount: 4,
        activeMilestoneTitle: "建立倒排索引",
        activeMilestoneTask: "把 token 映射到文档集合。",
        reviewDue: 1,
        reviewTotal: 3,
        codeDue: 2,
        codeTotal: 5,
      },
    }),
  );

  assert.match(markup, /项目任务模式/);
  assert.doesNotMatch(markup, /Mission Mode/);
  assert.match(markup, /Markdown 笔记搜索器/);
  assert.match(markup, /今日只做这一小步/);
  assert.match(markup, /建立倒排索引/);
  assert.match(markup, /代码反馈到期/);
  assert.match(markup, /aria-label="项目任务进度"/);
});

test("project mission hero renders today's mission mode fields", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionHero, {
      mission: {
        id: "project-rag",
        title: "简单向量检索系统",
        description: "从文档切块到本地向量检索。",
        typeLabel: "RAG 小项目",
        status: "active",
        percent: 35,
        totalMilestones: 3,
        completedMilestones: 1,
        remainingMilestones: 2,
        topicCount: 3,
        estimatedMinutes: 20,
        activeMilestoneTitle: "实现 cosine similarity",
        activeMilestoneTask: "给出 3 个测试样例并覆盖空向量边界。",
        activeMilestoneCompletionStandard: "给出 3 个测试样例",
        reviewDue: 0,
        reviewTotal: 2,
        codeDue: 1,
        codeTotal: 3,
      },
    }),
  );

  assert.match(markup, /今日项目任务/);
  assert.match(markup, /项目：简单向量检索系统/);
  assert.match(markup, /任务：实现 cosine similarity/);
  assert.match(markup, /完成标准：给出 3 个测试样例/);
  assert.match(markup, /预计：20 分钟/);
});

test("project mission hero keeps today's task slot visible before a project starts", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionHero, {
      mission: null,
    }),
  );

  assert.match(markup, /选择一个项目开始实践/);
  assert.match(markup, /项目任务模式/);
  assert.doesNotMatch(markup, /Mission Mode/);
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /先从模板开始一个项目/);
});

test("project mission hero shows a milestone completion cue when the project is complete", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionHero, {
      mission: {
        id: "project-1",
        title: "RAG 问答原型",
        description: "用检索和生成完成一个可解释问答项目。",
        typeLabel: "RAG 小项目",
        status: "completed",
        percent: 100,
        totalMilestones: 3,
        completedMilestones: 3,
        remainingMilestones: 0,
        topicCount: 4,
        activeMilestoneTitle: null,
        activeMilestoneTask: null,
        reviewDue: 0,
        reviewTotal: 3,
        codeDue: 0,
        codeTotal: 3,
      },
    }),
  );

  assert.match(markup, /里程碑完成/);
  assert.match(markup, /3\/3 里程碑/);
});

test("project completion ritual shows learned topics and generated cards", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectCompletionRitual, {
      learnedTopics: ["向量表示", "cosine similarity", "top-k retrieval"],
      generatedCodeCards: 4,
      generatedConceptCards: 2,
    }),
  );

  assert.match(markup, /你完成了一个项目！/);
  assert.match(markup, /练到了：/);
  assert.match(markup, /向量表示/);
  assert.match(markup, /cosine similarity/);
  assert.match(markup, /top-k retrieval/);
  assert.match(markup, /生成：/);
  assert.match(markup, /4 张代码卡/);
  assert.match(markup, /2 张概念卡/);
});

test("project daily rhythm card connects active project to daily flow", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectDailyRhythmCard, {
      project: {
        id: "project-1",
        title: "RAG 问答原型",
        typeLabel: "RAG 小项目",
        status: "active",
        percent: 67,
        completedMilestones: 2,
        totalMilestones: 3,
        activeMilestoneTitle: "接入向量检索",
        activeMilestoneTask: "把 query embedding 与文档 embedding 做相似度排序。",
        reviewDue: 1,
        codeDue: 2,
      },
    }),
  );

  assert.match(markup, /当前项目进度/);
  assert.match(markup, /RAG 问答原型/);
  assert.match(markup, /今日里程碑/);
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /接入向量检索/);
  assert.match(markup, /67%/);
  assert.match(markup, /aria-label="当前项目进度"/);
  assert.match(markup, /继续项目/);
  assert.match(markup, /grid gap-3 sm:flex sm:items-center sm:justify-between/);
  const activeProjectCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(activeProjectCtaMatches.length, 1);
});

test("project daily rhythm card keeps today's task visible without active project", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectDailyRhythmCard, {
      project: null,
    }),
  );

  assert.match(markup, /当前项目进度/);
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /先选择一个小项目/);
  assert.match(markup, /选择项目/);
  const emptyProjectCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(emptyProjectCtaMatches.length, 1);
});

test("mission completion criteria keeps practical completion rules visible", () => {
  const markup = renderToStaticMarkup(React.createElement(MissionCompletionCriteria));

  assert.match(markup, /完成条件/);
  assert.match(markup, /代码与思路已保存/);
  assert.match(markup, /边界\/测试用例/);
  assert.match(markup, /保存并评审代码/);
});

test("project feedback next fix turns code feedback into one repair target", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectFeedbackNextFix, {
      issue: "边界条件：空向量时返回什么？",
      summary: "整体方向正确，但缺少空向量边界。",
    }),
  );

  assert.match(markup, /你现在只需要修这个问题：/);
  assert.match(markup, /边界条件：空向量时返回什么？/);
  assert.match(markup, /整体方向正确，但缺少空向量边界。/);
});

test("projects page keeps book generated project copy as future integration only", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /从《xxx》第 2 章生成一个小项目/);
  assert.doesNotMatch(source, /href="\/books"/);
});

test("project mission brief exposes input output submission and AI review entry", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionBrief, {
      position: 2,
      title: "建立倒排索引",
      task: "把 token 映射到文档集合。",
      codePrompt: "实现 build_index(docs) -> dict[str, set[str]]。",
      status: "active",
    }),
  );

  assert.match(markup, /当前任务/);
  assert.match(markup, /输入\/输出/);
  assert.match(markup, /需要提交什么/);
  assert.match(markup, /AI 评审入口/);
  assert.match(markup, /保存并评审代码/);
  assert.match(markup, /实现 build_index/);
});

test("projects page localizes active milestone and all-complete status badges", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /missionStatusText\(activeMilestone\.status\)/);
  assert.match(source, /全部完成/);
  assert.doesNotMatch(source, />\s*\{activeMilestone\.status\}\s*</);
  assert.doesNotMatch(source, />all done</);
});

test("projects page header badge is localized for learners", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /badge="项目实践"/);
  assert.doesNotMatch(source, /badge="Mission"/);
});

test("project type filter keeps filter chips mobile friendly", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectTypeFilter, {
      items: [
        { href: "/projects", label: "全部", active: true },
        { href: "/projects?type=rag", label: "RAG 小项目", active: false },
      ],
    }),
  );
  const source = readFileSync("src/app/projects/ui/project-mission-workspace.tsx", "utf8");

  assert.match(markup, /全部/);
  assert.match(markup, /RAG 小项目/);
  assert.match(markup, /href="\/projects\?type=rag"/);
  assert.match(markup, /min-h-11/);
  assert.match(source, /projectTypeFilterLinkClassName/);
  assert.doesNotMatch(source, /<Badge key=\{item\.href\} asChild/);
});

test("projects page localizes milestone code feedback labels", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /formatHomeCodeFeedbackOverallLabel\(activeMilestoneFeedback\.feedback\.overall\)/);
  assert.match(source, /formatCodeFeedbackIssueSeverityLabel\(issue\.severity\)/);
  assert.match(source, /formatCodeFeedbackIssueTypeLabel\(issue\.type\)/);
  assert.doesNotMatch(source, /\{activeMilestoneFeedback\.feedback\.overall \?\? "reviewed"\}/);
  assert.doesNotMatch(source, /\{issue\.severity\} \/ \{issue\.type\}:/);
  assert.doesNotMatch(source, /feedback \{activeMilestone\.codeSubmissionId\.slice\(0, 8\)\}/);
});

test("projects page keeps page-level CTAs mobile friendly", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  for (const label of ["看进度", "复习项目卡片", "生成项目总结", "打开作品集"]) {
    const labelIndex = source.lastIndexOf(label);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = source.slice(Math.max(0, labelIndex - 500), labelIndex + 120);
    assert.match(ctaWindow, /className="min-h-11 w-full sm:w-auto"/);
  }
});

test("projects page keeps milestone form CTAs mobile friendly", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");
  const groupStart = source.indexOf("<LearningCTAGroup");
  assert.notEqual(groupStart, -1);
  const ctaGroup = source.slice(groupStart, groupStart + 900);

  for (const label of ["完成里程碑", "保存草稿", "保存并评审代码"]) {
    const labelIndex = ctaGroup.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = ctaGroup.slice(Math.max(0, labelIndex - 160), labelIndex + 120);
    assert.match(ctaWindow, /className="min-h-11 w-full sm:w-auto"/);
  }
});

test("projects page keeps milestone form inputs mobile friendly", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /projectMilestoneInputClassName = "min-h-11"/);

  for (const label of ["关联 lessonId（可选）", "关联 noteId（可选）", "代码语言"]) {
    const labelIndex = source.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const inputWindow = source.slice(labelIndex, labelIndex + 240);
    assert.match(inputWindow, /className=\{projectMilestoneInputClassName\}/);
  }
});

test("project side panels render active project and review queues", () => {
  const projectList = renderToStaticMarkup(
    React.createElement(ProjectListPanel, {
      activeCount: 1,
      completedCount: 2,
      selectedProjectId: "project-1",
      projects: [
        {
          id: "project-1",
          title: "RAG 问答原型",
          typeLabel: "RAG",
          status: "active",
          percent: 60,
        },
      ],
    }),
  );
  const queues = renderToStaticMarkup(
    React.createElement(ProjectReviewQueuePanel, {
      codeDue: 2,
      codeTotal: 4,
      codeHref: "/review?type=code",
      projectDue: 1,
      projectTotal: 3,
      projectHref: "/review?type=project",
    }),
  );

  assert.match(projectList, /进行中/);
  assert.match(projectList, /RAG 问答原型/);
  assert.match(projectList, /60%/);
  assert.match(projectList, /aria-label="项目进度：RAG 问答原型"/);
  assert.match(projectList, /min-h-11/);
  assert.match(queues, /代码反馈卡片/);
  assert.match(queues, /项目复盘卡片/);
  assert.match(queues, /到期 2/);
  assert.match(queues, /复习代码反馈/);
  assert.match(queues, /复习项目卡片/);
  const reviewQueueCtaMatches = queues.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(reviewQueueCtaMatches.length, 2);
});

test("project workspace localizes planned project and milestone status", () => {
  const projectList = renderToStaticMarkup(
    React.createElement(ProjectListPanel, {
      activeCount: 0,
      completedCount: 0,
      selectedProjectId: "project-1",
      projects: [
        {
          id: "project-1",
          title: "二分搜索练习台",
          typeLabel: "算法项目",
          status: "planned",
          percent: 0,
        },
      ],
    }),
  );
  const missionBrief = renderToStaticMarkup(
    React.createElement(ProjectMissionBrief, {
      position: 2,
      title: "lower_bound",
      task: "找到第一个大于等于 target 的位置。",
      codePrompt: "实现 lower_bound(nums, target)。",
      status: "planned",
    }),
  );
  const milestonePath = renderToStaticMarkup(
    React.createElement(ProjectMilestonePath, {
      items: [
        {
          id: "milestone-2",
          position: 2,
          title: "lower_bound",
          task: "处理边界和重复元素。",
          status: "planned",
          hasCode: false,
          hasReflection: false,
          hasFeedback: false,
        },
      ],
    }),
  );
  const combined = `${projectList}${missionBrief}${milestonePath}`;

  assert.match(combined, /待开始/);
  assert.doesNotMatch(combined, /planned/);
});

test("project list panel source keeps project links mobile friendly", () => {
  const source = readFileSync("src/app/projects/ui/project-mission-workspace.tsx", "utf8");

  assert.match(source, /projectListPanelLinkClassName/);
  assert.doesNotMatch(source, /"rounded-lg border px-3 py-2 text-sm transition-colors"/);
});

test("project template list keeps start and open CTAs mobile friendly", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectTemplateList, {
      startAction: async () => {},
      templates: [
        {
          slug: "python-index",
          title: "Markdown 笔记搜索器",
          description: "扫描 Markdown 并建立倒排索引。",
          typeLabel: "Python 基础",
          difficulty: "入门",
          estimatedHours: 2,
          milestoneCount: 3,
          existingProjectId: null,
        },
        {
          slug: "rag-demo",
          title: "RAG 问答原型",
          description: "把检索和生成串成一个可解释问答原型。",
          typeLabel: "RAG 小项目",
          difficulty: "进阶",
          estimatedHours: 4,
          milestoneCount: 4,
          existingProjectId: "project-2",
        },
      ],
    }),
  );

  assert.match(markup, /开始项目/);
  assert.match(markup, /打开项目/);
  assert.match(markup, /约 2 小时/);
  assert.match(markup, /3 个里程碑/);
  assert.doesNotMatch(markup, /2h/);
  assert.doesNotMatch(markup, /3 steps/);
  const templateCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(templateCtaMatches.length, 2);
});

test("projects page maps template difficulty into learner-facing labels", () => {
  const source = readFileSync("src/app/projects/page.tsx", "utf8");

  assert.match(source, /formatProjectTemplateDifficultyLabel\(template\.difficulty\)/);
  assert.doesNotMatch(source, /difficulty:\s*template\.difficulty/);
});

test("project template list localizes raw template difficulty badges", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectTemplateList, {
      startAction: async () => {},
      templates: [
        {
          slug: "python-index",
          title: "Markdown 笔记搜索器",
          description: "扫描 Markdown 并建立倒排索引。",
          typeLabel: "Python 基础",
          difficulty: "beginner",
          estimatedHours: 2,
          milestoneCount: 3,
          existingProjectId: null,
        },
        {
          slug: "agent-demo",
          title: "Agent 工具调用 demo",
          description: "实现一个可选择工具的最小 Agent 循环。",
          typeLabel: "Agent 小项目",
          difficulty: "advanced",
          estimatedHours: 8,
          milestoneCount: 3,
          existingProjectId: null,
        },
      ],
    }),
  );

  assert.match(markup, /入门/);
  assert.match(markup, /高阶/);
  assert.doesNotMatch(markup, /beginner/);
  assert.doesNotMatch(markup, /advanced/);
});

test("project milestone path shows saved artifacts and feedback summary", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMilestonePath, {
      items: [
        {
          id: "milestone-1",
          position: 1,
          title: "读取 Markdown",
          task: "扫描目录并过滤文件。",
          status: "completed",
          hasCode: true,
          hasReflection: true,
          hasFeedback: true,
          feedbackSummary: "边界处理要覆盖空目录。",
        },
      ],
    }),
  );

  assert.match(markup, /里程碑|读取 Markdown/);
  assert.match(markup, /已保存代码/);
  assert.match(markup, /已保存反思/);
  assert.match(markup, /AI 已评审/);
  assert.doesNotMatch(markup, /code saved/);
  assert.doesNotMatch(markup, /reflection saved/);
  assert.doesNotMatch(markup, /AI reviewed/);
  assert.match(markup, /边界处理要覆盖空目录/);
});

test("project portfolio panel renders completed artifacts and review entry", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectPortfolioPanel, {
      items: [
        {
          id: "project-1",
          title: "Markdown 笔记搜索器",
          typeLabel: "数据结构项目",
          summary: "完成了扫描、索引和搜索排序。",
          completedMilestones: 2,
          codeSnippetCount: 1,
          reflectionCount: 2,
          cardCount: 3,
          relatedTopics: ["inverted-index", "file-io"],
          reviewHref: "/review?source=project&projectId=project-1",
          featuredCodeSnippet: "def scan_markdown(root):\n    return []",
          portfolioMarkdown:
            "# Markdown 笔记搜索器\n\n## 项目总结\n完成了扫描、索引和搜索排序。\n",
        },
      ],
    }),
  );

  assert.match(markup, /项目作品集/);
  assert.match(markup, /Markdown 笔记搜索器/);
  assert.match(markup, /已完成 1 个项目/);
  assert.doesNotMatch(markup, /1 completed/);
  assert.match(markup, /代码片段 1/);
  assert.match(markup, /项目卡片 3/);
  assert.match(markup, /倒排索引/);
  assert.match(markup, /文件读写/);
  assert.doesNotMatch(markup, />inverted-index</);
  assert.doesNotMatch(markup, />file-io</);
  assert.match(markup, /导出 Portfolio Markdown/);
  assert.match(markup, /复制到笔记或简历/);
  assert.doesNotMatch(markup, /aria-label="Markdown 笔记搜索器 portfolio markdown"/);
  assert.match(markup, /aria-label="导出 Markdown 笔记搜索器 Portfolio Markdown"/);
  assert.match(markup, /# Markdown 笔记搜索器/);
  assert.match(markup, /def scan_markdown/);
  assert.match(markup, /href="\/review\?source=project&amp;projectId=project-1"/);
  assert.match(markup, /grid gap-3 sm:flex sm:items-start sm:justify-between/);
  const portfolioReviewCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(portfolioReviewCtaMatches.length, 1);
});

test("project portfolio page content renders a dedicated portfolio workspace", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectPortfolioPageContent, {
      items: [
        {
          id: "project-1",
          title: "Markdown 笔记搜索器",
          typeLabel: "数据结构项目",
          summary: "完成了扫描、索引和搜索排序。",
          completedMilestones: 2,
          codeSnippetCount: 1,
          reflectionCount: 2,
          cardCount: 3,
          relatedTopics: ["inverted-index", "file-io"],
          reviewHref: "/review?source=project&projectId=project-1",
          featuredCodeSnippet: "def scan_markdown(root):\n    return []",
          portfolioMarkdown:
            "# Markdown 笔记搜索器\n\n## 项目总结\n完成了扫描、索引和搜索排序。\n",
        },
      ],
    }),
  );

  assert.match(markup, /项目作品集/);
  assert.match(markup, /可导出的学习 portfolio/);
  assert.match(markup, /已完成 1 个项目/);
  assert.doesNotMatch(markup, /Portfolio<\/span>/);
  assert.doesNotMatch(markup, /1 completed/);
  assert.match(markup, /回到项目实践/);
  assert.match(markup, /导出 Portfolio Markdown/);
  assert.match(markup, /href="\/projects"/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  const portfolioPageCtaMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(portfolioPageCtaMatches.length, 2);
});
