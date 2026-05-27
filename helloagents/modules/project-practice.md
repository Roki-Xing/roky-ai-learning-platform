# Project Practice

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/projects`。
2. 按类型筛选项目模板：Python 基础、数据结构、算法、AI 工程、RAG、Agent、数据分析、论文复现。
3. 点击“开始项目”，模板会复制成当前用户自己的 `LearningProject`。
4. 在项目详情里查看 milestones、当前任务、代码提示和反思提示。
5. 保存 milestone 草稿，或填写代码产物、笔记、反思后完成 milestone。
6. 所有 milestones 完成后生成项目总结和项目复习卡片。
7. 在 `/review` 复习项目总结卡和里程碑卡。
8. 在 `/progress` 查看项目数量、完成项目数、里程碑进度和最近项目。

## 数据模型

- `LearningProject`
  - `userId`
  - `templateSlug`
  - `type`
  - `title`
  - `description`
  - `difficulty`
  - `status`
  - `summary`
  - `relatedTopics`
  - `relatedLessons`
  - `startedAt`
  - `completedAt`
- `ProjectMilestone`
  - `projectId`
  - `userId`
  - `position`
  - `title`
  - `task`
  - `codePrompt`
  - `reflectionPrompt`
  - `status`
  - `relatedTopics`
  - `lessonId`
  - `noteId`
  - `codeSubmissionId`
  - `code`
  - `note`
  - `reflection`
  - `completedAt`
- `Flashcard`
  - Project 完成后生成 standalone cards。
  - `lessonId=null`
  - `type="project"`
  - `tags=["project", projectType]`
  - stable id: `project:<projectId>:summary`、`project:<projectId>:milestone-<n>`

## 重要约束

- 项目模板保存在代码常量 `DEFAULT_PROJECT_TEMPLATES`，不直接 seed 成个人项目。
- 每个用户同一 `templateSlug` 只允许一个项目，重复点击“开始项目”会打开已有项目。
- milestone 代码只保存为学习产物，不在服务端执行。
- milestone 代码可以通过“保存并评审代码”进入现有 `CodeSubmission` / `CodeFeedback` 链路；评审结果通过 `ProjectMilestone.codeSubmissionId` 关联。
- 所有 Server Actions 必须通过 `requireUserId()` 获取当前用户，并按 `userId` 过滤项目归属。
- 项目总结由本地确定性函数生成，后续可接入 Coach/DeepSeek 评审。
- 项目未完成所有 milestones 时不能生成完成卡片。
- 完成项目必须幂等：重复完成不重复创建 Flashcards，也不能重置已有卡片的 `dueAt`、`reviewCount` 等复习进度。
- Project 卡片必须带 `project` 标签，使 `/review` 和进度统计能识别 standalone 项目复习来源。

## 本地验收

- `npm test`：28 项通过。
- `npm run lint`：通过。
- `npm run build`：通过，路由表包含 `/projects`。

## 生产验收

- 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint6-20260524-040653.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:learning-projects`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`，内网 `/api/health` 返回 `ok`。
- 线上：`/projects` 显示 Sprint 6 项目模板与项目实践导航。
- 线上：`/progress` 显示项目实践统计和最近项目实践区域。
- Playwright：创建 `单词频率统计器`，完成 3 个 milestone 后页面显示 `100% / completed` 与“所有里程碑已完成”。
- 生产数据库：`LearningProject=1`、`ProjectMilestone=3`；最新项目 `completed`、`summary=true`、`codeSaved=3`、`reflectionSaved=3`。

## Sprint 34 项目卡片补强

- `completeLearningProject()` 现在是项目完成的服务层入口。
- `completeMilestoneAction()` 在最后一个 milestone 完成时会通过同一服务生成项目卡片。
- `completeProjectAction()` 也复用同一服务，避免页面 action 分叉。
- `buildProjectCompletionFlashcards()` 为项目总结和已完成 milestones 生成稳定 project cards。
- `src/server/review/filter.ts` 已把 `project` 纳入 standalone review source。
- 本地目标测试：
  - `npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts`：11 项通过。
  - `npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts tests/unit/progress-analytics.test.ts`：17 项通过。

## Sprint 35 项目复习入口

- `src/server/projects/review-cards.ts` 新增 `getProjectReviewCardSummary()`。
- 完成项目的 summary 区会显示项目复习卡片数量、当前到期数量和“去复习项目卡片”入口。
- 摘要查询按 `userId + projectId` scope，只统计 `project:<projectId>:` 前缀卡片。
- 本地目标测试：
  - RED：缺少 `@/server/projects/review-cards` 时 `tests/unit/projects.test.ts` 失败。
  - GREEN：`npm test -- tests/unit/projects.test.ts`：9 项通过。

## Sprint 36 项目专属复习队列

- `/projects` 的“去复习项目卡片”现在进入 `/review?source=project&projectId=<projectId>`。
- `/review` 支持读取 `source` 和 `projectId`，项目模式只加载当前项目的到期卡片。
- `src/server/review/filter.ts` 新增 `normalizeReviewSource()` 和 focused `buildReviewableFlashcardWhere()`。
- `src/server/review/queue.ts` 的 `getDueFlashcards()` 支持 source/projectId。
- 默认 `/review` 队列仍保持原行为，继续展示所有 reviewable due cards。
- 本地目标测试：
  - RED：项目入口仍为普通 `/review`、focused queue 混入其他卡、缺少 `normalizeReviewSource()`。
  - GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts`：15 项通过。

## Sprint 37 项目里程碑代码评审

- `ProjectMilestone` 新增 `codeSubmissionId`，用于关联 milestone 代码评审结果。
- `prisma/manual-migrations/20260525_project_milestone_code_submission.sql` 以 `ADD COLUMN IF NOT EXISTS` 和 `CREATE INDEX IF NOT EXISTS` 方式可重复执行。
- `src/server/projects/code-submission.ts` 新增 `reviewProjectMilestoneCode()`。
- `reviewProjectMilestoneCode()` 按 `userId + projectId + milestoneId` scope 读取 milestone。
- 缺少 milestone、`lessonId` 或代码时明确拒绝。
- 服务复用 `submitCodeForReview()`，因此继续生成 `CodeSubmission`、`CodeFeedback`、Misconception 和 code feedback flashcards。
- 重复评审同一 milestone 复用 `CodeSubmission_userId_lessonId_localDate_key`，不会重复创建提交。
- `/projects` 当前任务新增“保存并评审代码”按钮，并展示 linked feedback id。
- 项目代码评审日期使用用户 `timeZone` 对应的 localDate。
- 本地目标测试：
  - RED：缺少 `@/server/projects/code-submission` 时 `tests/unit/projects.test.ts` 失败。
  - GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/code-submit.test.ts`：13 项通过。

## Sprint 38 项目里程碑代码反馈摘要

- `src/server/projects/code-feedback-summary.ts` 新增 `getProjectMilestoneFeedbackSummaries()`。
- 服务按 `userId + projectId` scope 读取当前项目 linked `CodeFeedback`，不会泄露其他用户反馈。
- `/projects` 当前任务会在 linked feedback 存在时展示：
  - `overall`
  - summary
  - 前两个 issues
- `/projects` 里程碑列表会展示 linked feedback 的 `overall` 和 summary。
- 没有 linked feedback 的 milestone 仍按原样显示。
- 本地目标测试：
  - RED：缺少 `@/server/projects/code-feedback-summary` 时 `tests/unit/projects.test.ts` 失败。
  - GREEN：`npm test -- tests/unit/projects.test.ts`：13 项通过。

## Sprint 39 项目代码反馈卡片复习入口

- `src/server/projects/code-feedback-summary.ts` 新增 `getProjectCodeFeedbackSubmissionIds()`、`buildProjectCodeFeedbackFlashcardWhere()` 和 `getProjectCodeFeedbackCardSummary()`。
- 项目代码反馈卡片统计通过 `ProjectMilestone.codeSubmissionId` 关联当前项目 linked submission。
- 统计只匹配当前用户 `code-feedback:<submissionId>:` stable id 卡片，并要求 tags 包含 `code-feedback`。
- `/projects` 项目详情新增“代码反馈卡片”区域，显示总数、到期数和“去复习代码反馈卡片”入口。
- `/review` 支持 `/review?source=code-feedback&projectId=<projectId>`。
- `source=code-feedback` 时，复习队列只加载当前项目 linked submission 的到期卡片。
- `code-feedback` 是 review source，但不是 standalone source；这些卡片仍关联 official lesson。
- 默认 `/review` 队列和 `source=project` 项目完成卡片队列保持原行为。
- 本地目标测试：
  - RED：缺少 `getProjectCodeFeedbackCardSummary()`、`code-feedback` source 未归一化、focused queue 返回 0。
  - GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts`：20 项通过。
