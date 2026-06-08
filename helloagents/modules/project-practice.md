# Project Practice

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/projects`，页头 badge 显示 `项目实践`，不显示英文 `Mission`。
2. 在 Mission Hero 查看当前项目、进度、剩余里程碑、项目卡片到期数和代码反馈到期数。
3. 按类型筛选项目模板：Python 基础、数据结构、算法、AI 工程、RAG、Agent、数据分析、论文复现。
4. 点击“开始项目”，模板会复制成当前用户自己的 `LearningProject`。
5. 在“今日项目任务”里查看当前 milestone、完成条件、代码提示和反思提示。
6. 保存 milestone 草稿，或填写代码产物、笔记、反思后完成 milestone。
7. 需要代码反馈时点击“保存并评审代码”，结果会回写到当前 milestone 并生成代码反馈卡片。
8. 所有 milestones 完成后生成项目总结和项目复习卡片。
9. 在“项目作品集”复制 `Portfolio Markdown`，沉淀项目总结、学习证据、相关知识和代表代码片段。
10. 打开 `/projects/portfolio` 查看独立项目作品集页，并把完成项目导出到笔记、简历或学习档案。
11. 在 `/review` 复习项目总结卡、里程碑卡和项目代码反馈卡。
12. 在 `/progress` 查看项目数量、完成项目数、里程碑进度和最近项目。

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
- `DEFAULT_PROJECT_TEMPLATES.difficulty` 继续使用保存契约中的 raw enum；学习者可见模板难度必须通过 `formatProjectTemplateDifficultyLabel()` 显示为 `入门`、`进阶`、`高阶`，不能直接展示 `beginner`、`intermediate` 或 `advanced`。
- 每个用户同一 `templateSlug` 只允许一个项目，重复点击“开始项目”会打开已有项目。
- milestone 代码只保存为学习产物，不在服务端执行。
- milestone 代码可以通过“保存并评审代码”进入现有 `CodeSubmission` / `CodeFeedback` 链路；评审结果通过 `ProjectMilestone.codeSubmissionId` 关联。
- 所有 Server Actions 必须通过 `requireUserId()` 获取当前用户，并按 `userId` 过滤项目归属。
- 项目总结由本地确定性函数生成，后续可接入 Coach/DeepSeek 评审。
- 项目未完成所有 milestones 时不能生成完成卡片。
- 完成项目必须幂等：重复完成不重复创建 Flashcards，也不能重置已有卡片的 `dueAt`、`reviewCount` 等复习进度。
- Project 卡片必须带 `project` 标签，使 `/review` 和进度统计能识别 standalone 项目复习来源。
- `Portfolio Markdown` 是读侧导出文本，不创建新表、不写入数据库、不执行用户代码。

## Mission Workspace UI

- `src/app/projects/page.tsx` 负责服务端取数和 server action 表单编排。
- `src/app/projects/portfolio/page.tsx` 负责独立项目作品集页，只读展示已完成项目的 portfolio。
- 首页通过 `ProjectDailyRhythmCard` 显示当前项目节奏：
  - 当前项目进度
  - 项目标题
  - 进度
  - 今日项目任务 / 今日里程碑
  - 继续项目
- `src/app/projects/ui/project-mission-workspace.tsx` 只负责 `/projects` 展示组件：
  - `ProjectMissionHero`
  - `ProjectTypeFilter`
  - `ProjectTemplateList`
  - `ProjectListPanel`
  - `ProjectMissionBrief`
  - `MissionCompletionCriteria`
  - `ProjectReviewQueuePanel`
  - `ProjectMilestonePath`
  - `ProjectPortfolioPageContent`
- 页面结构为顶部 Mission Hero、左侧任务导航、主任务区、右侧复习/复盘上下文、底部里程碑路线和项目作品集。
- `ProjectTypeFilter` 的每个类型筛选入口直接渲染移动友好的 `Link`，并复用 `projectTypeFilterLinkClassName` 保证手机端至少 44px 触控高度；不再使用小尺寸 `Badge asChild` 链接模板。
- `ProjectListPanel` 的每个项目入口复用 `projectListPanelLinkClassName`，手机端至少 44px 触控高度，方便从“我的项目”继续当前任务。
- 学习者可见状态文案保持中文：
  - Mission Hero 徽章显示 `项目任务模式`。
  - 当前任务状态显示 `进行中` / `已完成` / `待开始`；全部完成 fallback 显示 `全部完成`，不向学习者暴露 raw `planned`。
  - 当前里程碑代码反馈显示 `部分正确` / `已评审`、`高优先级 / 逻辑问题` 和 `代码反馈 <id>`，不向学习者暴露 raw `partially_correct`、`high / logic` 或英文 `feedback` 前缀。
  - 里程碑路线保存状态显示 `已保存代码`、`已保存反思`、`AI 已评审`。
  - 项目模板元信息显示 `约 N 小时` 和 `N 个里程碑`，不向学习者暴露 `Nh` 或 `N steps`。
  - 项目模板难度显示 `入门`、`进阶`、`高阶`，不向学习者暴露 `beginner`、`intermediate` 或 `advanced`。
  - 项目作品集数量显示 `已完成 N 个项目`；独立作品集页顶部徽章显示 `项目作品集`。
  - 项目作品集相关知识 badge 显示中文业务标签，例如 `倒排索引`、`文件读写`、`向量检索`，不向学习者暴露 `inverted-index`、`file-io` 等 raw topic slug。
  - `导出 Portfolio Markdown` 中的 `相关知识` 行显示中文业务标签，例如 `倒排索引, 文件读写`，不把 raw topic slug 写入可复制成果。
- 底部“项目作品集”会为已完成项目展示可复制的 `导出 Portfolio Markdown` 文本区，并提供 `/projects/portfolio` 独立页入口。
- `/projects/portfolio` 保留 `回到项目实践` 入口，复用同一 portfolio panel 和 Markdown 导出文本，不新增写 action。
- `Portfolio Markdown` 包含项目标题、项目总结、完成里程碑、代码片段数、反思/笔记数、项目卡片数、相关知识和代表代码片段。
- `ProjectMissionBrief` 必须显式展示：
  - `当前任务`
  - `输入/输出`
  - `需要提交什么`
  - `AI 评审入口`
- `AI 评审入口` 当前落到现有 `保存并评审代码` 按钮；该路径只保存并评审代码文本，不执行用户代码。
- 工作台不执行用户代码，只保存代码文本并可调用现有代码评审链路。
- 今日项目任务表单中的 `lessonId`、`noteId` 和 `代码语言` 三个单行输入框复用 `projectMilestoneInputClassName = "min-h-11"`，手机端满足 44px 触控高度。
- 项目完成态复用共享 `LearningCelebrationCue`，成就徽章显示中文 `项目进度`，不显示英文 `Project progress`。
- UI 测试位于 `tests/unit/project-mission-workspace.test.ts`，用静态渲染覆盖核心文案与面板层级。

## 本地验收

- Phase E Projects Header Badge Localization：
  - `npm test -- tests/unit/project-mission-workspace.test.ts`：RED 后 GREEN，18 项通过；覆盖 `/projects` 页头 badge 显示 `项目实践`，并防止 `badge="Mission"` 回退。
  - `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：43 项通过，覆盖 Projects UI、项目服务规则和 Today 完成后项目推荐回归。
  - `rg -n 'Projects Header Badge|badge="项目实践"|badge="Mission"|0\\.251\\.0|项目实践页头' ...`：覆盖扫描通过，确认 `/projects` 源码、测试、UI checklist、CHANGELOG、Project Practice 模块文档和 Aegis 记录均接入页头 badge 中文化要求；`src/app/projects/page.tsx` 中 `badge="Mission"` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 362 项通过，Next 构建生成 28 个静态页面，路由表包含 `/projects`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Code Feedback Label Localization RED 首次因 `/projects` 仍直接渲染 raw `overall`、`severity/type` 和英文 `feedback` 前缀失败；GREEN 后 17 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/progress-analytics.test.ts`：54 项通过，覆盖 Projects UI、项目服务规则、共享标签 helper、Today code exercise 和 Progress code trend 回归。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Type Filter Mobile Touch Targets RED 首次因 `ProjectTypeFilter` 仍渲染 `h-5` Badge 链接且缺少 `min-h-11` 失败；GREEN 后 19 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：69 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：16 项通过，覆盖 Projects 里程碑输入框移动触控目标、状态文案中文化和工作台层级。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：41 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：12 项通过，覆盖 Projects 状态文案中文化。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：37 项通过。
- `rg -n "code saved|reflection saved|AI reviewed|all done|\\{items\\.length\\} completed|\\{completedCount\\} completed|[0-9]+ completed|Mission Mode|>Portfolio<|已保存代码|已保存反思|AI 已评审|全部完成|已完成 .* 个项目|项目任务模式" src/app/projects tests/unit/project-mission-workspace.test.ts`：生产代码使用中文状态文案，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts`：27 项通过。
- `npm run audit:routes && npm run audit:learning`：通过，路由表包含 `/projects/portfolio`。
- `git diff --check`：通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Template Difficulty Label Localization RED 首次因 page 缺少 `formatProjectTemplateDifficultyLabel(template.difficulty)` 且组件直显 raw `beginner/advanced` 失败；GREEN 后 21 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：71 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Template Difficulty Label Localization 本地门禁通过；全量单测 428 项通过，Next 构建生成 28 个页面。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects List Panel Mobile Touch Targets RED 首次因项目列表链接缺少 `min-h-11` 且源码缺少 `projectListPanelLinkClassName` 失败；GREEN 后 22 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：72 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects List Panel Mobile Touch Targets 本地门禁通过；全量单测 429 项通过，Next 构建生成 28 个页面。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Planned Status Label Localization RED 首次因 planned 项目和里程碑状态仍直显 raw `planned` 失败；GREEN 后 23 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：73 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `rg -n "Phase E Projects Planned Status|Projects Planned Status Label|0\\.334\\.0|planned.*待开始|待开始|project workspace localizes planned|missionStatusText\\(status\\)|raw planned" ...`：覆盖扫描确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入 planned 状态中文化切片。
- `rg -n ">planned<|/ planned|\\{missionStatusText\\([^)]*\\)\\}|status === \\\"planned\\\"" src/app/projects/ui/project-mission-workspace.tsx src/app/projects/page.tsx`：窄扫只命中 `missionStatusText()` helper 和正常调用，未发现 `>planned<` 或 `/ planned` 可见直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Planned Status Label Localization 本地门禁通过；全量单测 430 项通过，Next 构建生成 28 个页面。
- Aegis helper `bundle` / `check`：仍失败于历史 Markdown-only 结构债，`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Portfolio Related Topic Label Localization RED 首次因作品集相关知识 badge 仍直显 raw `inverted-index` / `file-io` 失败；GREEN 后 23 项通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：73 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `rg -n "Project Portfolio Related Topic|Portfolio Related Topic|projectTopicLabels|formatProjectRelatedTopicLabel|倒排索引|文件读写|0\\.335\\.0|related topic|相关知识标签" ...`：覆盖扫描确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入作品集相关知识标签中文化切片。
- `rg -n ">inverted-index<|>file-io<|\\{topic\\}" src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts`：窄扫只命中测试反向断言和 `Badge key={topic}`，生产渲染不再使用 `{topic}` 直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Portfolio Related Topic Label Localization 本地门禁通过；全量单测 430 项通过，Next 构建生成 28 个页面。
- Aegis helper `bundle` / `check`：仍失败于历史 Markdown-only 结构债，`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；不是产品 UI 验证失败。
- `npm test -- tests/unit/projects.test.ts`：Phase E Projects Portfolio Markdown Related Topic Label Localization RED 首次因 `portfolioMarkdown` 仍输出 raw `- 相关知识：inverted-index, file-io` 失败；GREEN 后 16 项通过。
- `npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：73 项通过，覆盖项目服务、Projects UI、Today 完成后项目推荐和共享学习 UI。
- `rg -n "relatedTopics\\.join\\(\\\", \\\"\\)|- 相关知识：inverted-index, file-io|\\$\\{args\\.relatedTopics\\.join" src/server/projects/base.ts tests/unit/projects.test.ts`：窄扫只命中测试反向断言，服务层不再通过 `relatedTopics.join(", ")` 直出 raw slug。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Portfolio Markdown Related Topic Label Localization 本地门禁通过；全量单测 430 项通过，Next 构建生成 28 个页面。
- Aegis helper `bundle` / `check`：仍失败于历史 Markdown-only 结构债，`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；不是产品 UI 验证失败。

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
