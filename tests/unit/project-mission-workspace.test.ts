import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MissionCompletionCriteria,
  ProjectDailyRhythmCard,
  ProjectListPanel,
  ProjectMilestonePath,
  ProjectMissionHero,
  ProjectReviewQueuePanel,
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

  assert.match(markup, /Mission Mode/);
  assert.match(markup, /Markdown 笔记搜索器/);
  assert.match(markup, /今日只做这一小步/);
  assert.match(markup, /建立倒排索引/);
  assert.match(markup, /代码反馈到期/);
});

test("project mission hero keeps today's task slot visible before a project starts", () => {
  const markup = renderToStaticMarkup(
    React.createElement(ProjectMissionHero, {
      mission: null,
    }),
  );

  assert.match(markup, /选择一个项目开始实践/);
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /先从模板开始一个项目/);
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
  assert.match(markup, /今日项目任务/);
  assert.match(markup, /接入向量检索/);
  assert.match(markup, /67%/);
  assert.match(markup, /继续项目/);
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
});

test("mission completion criteria keeps practical completion rules visible", () => {
  const markup = renderToStaticMarkup(React.createElement(MissionCompletionCriteria));

  assert.match(markup, /完成条件/);
  assert.match(markup, /代码与思路已保存/);
  assert.match(markup, /边界\/测试用例/);
  assert.match(markup, /保存并评审代码/);
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
  assert.match(queues, /代码反馈卡片/);
  assert.match(queues, /项目复盘卡片/);
  assert.match(queues, /到期 2/);
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
  assert.match(markup, /code saved/);
  assert.match(markup, /reflection saved/);
  assert.match(markup, /AI reviewed/);
  assert.match(markup, /边界处理要覆盖空目录/);
});
