# Learning Analytics

## 当前行为

- Sprint 9 将 `/progress` 从基础计数升级为学习分析面板。
- Sprint 52 将 `/progress` 继续推进为学习状态页，补齐薄弱领域和复习留存趋势。
- Sprint 53 补齐错题趋势，让 Phase 7 的“错题和代码练习趋势”同时可见。
- Sprint 54 补齐测验正确率趋势，让学习效果从总正确率扩展到按日期观察。
- Sprint 55 补齐代码反馈问题趋势，让代码练习从提交次数扩展到问题严重度观察。
- Sprint 56 把每日课程生成质量落到 `AiGenerationJob.output`，并把 `/progress` 的生成稳定性升级为可观察最近平均质量。
- 新增 `src/server/analytics/progress.ts`，集中计算：
  - 内容质量：内容长度、引导步骤数、测验数、代码练习质量、卡片数、schemaVersion、source、fallbackUsed。
  - 学习效果：测验正确率、复习留存率、代码提交率、错题解决率、streak、领域覆盖、主题多样性。
  - 学习日历：最近 28 天 planned/completed/none 状态。
  - 代码趋势：按 `localDate` 聚合提交次数。
  - 代码反馈问题趋势：按 `CodeFeedback.localDate` 聚合反馈次数、问题数、严重度和高频问题类型。
  - 测验正确率趋势：按用户时区 localDate 聚合 QuizAttempt 的 attempts/correct/accuracy。
  - 错题趋势：按 `localDate` 聚合 Misconception 的 active/resolved/ignored 和解决率。
  - 薄弱领域：按领域聚合课程、到期卡片、测验正确率、代码提交和开放错题，生成 weaknessScore 和原因。
  - 复习留存趋势：按用户时区 localDate 聚合 ReviewLog，计算 good/easy 留存率。
  - 知识覆盖：术语库和 AI Radar 的复习覆盖比例。
  - 生成稳定性：DeepSeek/fallback 计划数、fallback rate、daily_plan job success/error、repair rate、最近平均质量、低质量 job 数、schemaVersion 分布和 model 分布。
- `/progress` 新增 Sprint 9 面板：
  - 学习日历
  - 内容质量
  - 学习效果
  - 代码练习趋势
  - 代码反馈问题趋势
  - 测验正确率趋势
  - 错题趋势
  - 薄弱领域
  - 复习留存趋势
  - 知识覆盖
  - 生成稳定性
- `/progress` 现在同时显示 `周目标`、`连续学习保护` 和 `轻量学习模式`，复用 `src/server/learning/habit-goal.ts` 的读侧计算。
- `/progress` 学习日历日期格用中文 `aria-label` 暴露状态，避免只依赖颜色和 `title` 传达 completed/planned/none。
- `/progress` 本周补弱计划步骤徽章显示 `第 n 步`，避免学习者可见补弱路径继续暴露英文 `Step n`。
- `/progress` 代码反馈问题趋势和错题趋势徽章使用中文业务标签：`高优先级 N`、`中优先级 N`、`低优先级 N`、`高频 逻辑问题`、`未解决 N`；不再直接展示 `high N`、`open N` 或 raw issue type。
- `/progress` 最近完成、开放错题、最近代码反馈、最近思路评审和最近项目实践列表入口复用 `progressRecentSignalLinkClassName`，手机端保持至少 44px 触控高度。
- `/progress` 最近代码反馈复用 `formatHomeCodeFeedbackOverallLabel()` 显示 `部分正确`、`需要重写` 等中文反馈结论，避免把 `partially_correct` 等 `overall` 直接展示给学习者。
- `/progress` 最近代码反馈复用 `formatTodayPlanSourceLabel()` 显示 `AI 生成`、`模板兜底` 等中文 provider 来源，避免把 `deepseek` / `template` 直接展示给学习者。
- `/progress` 最近思路评审复用 `formatCoachModeLabel()` 显示 `代码思路`、`概念疑问` 等中文 Coach mode 标签，避免把 `code_reasoning`、`concept_question` 等 raw mode 直接展示给学习者。
- `/progress` 最近项目实践复用 `missionStatusText()` 显示 `进行中`、`已完成` 等中文任务状态，避免把 `active` / `completed` 等项目状态 raw 值直接展示给学习者。
- `/progress` 薄弱主题卡片显示 `领域：... / 接触次数：N`，领域缺失时显示 `未标记领域`，避免把裸 `-` 或英文 `exposure` 直接展示给学习者。
- `/progress` 概览卡片不直接显示内部模型名：连续天数说明显示 `以完成学习日为准（用户时区日期）`，复习日志计数显示 `复习记录：N`，避免把 `DailyPlan.completed` 或 `ReviewLog` 直接展示给学习者。
- `/progress` 内容质量卡通过 `contentQualitySourceLabel()` 显示 `AI 生成`、`模板兜底`、`系统兜底`、`未标记来源` 等中文来源文案，避免把 `deepseek`、`template`、`fallback`、`unknown` 或空 source 直接展示给学习者。
- `/progress` 内容质量卡通过 `contentQualityCodingExerciseLabel()` 显示 `完整练习`、`基础练习`、`暂无练习`、`待评估`，避免把 `strong`、`basic`、`missing` 等 coding quality enum 直接展示给学习者。
- `/progress` 生成稳定性卡显示 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本` 和 `未标记`，避免把 `DeepSeek / fallback`、`success/error`、`repair`、`schema ...` 或 raw `unknown` 直接展示给学习者。
- `/progress` 生成稳定性卡通过 `generationModelLabel()` 显示 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro`、`AI 模型：未标记` 等学习者友好模型标签，避免把 `deepseek-v4-flash`、`deepseek-v4-pro` 或 raw `unknown` 模型值直接展示给学习者。
- `/progress` 薄弱领域列表入口复用 `progressWeakDomainLinkClassName`，手机端保持至少 44px 触控高度。
- 所有复用 `LearningProgressBar` 的学习进度条都暴露 `role="progressbar"`、百分比值和可访问名称，避免只靠条形宽度传达进度。

## 数据来源

- `DailyPlan`
- `Lesson`
- `QuizAttempt`
- `ReviewLog`
- `Misconception`
- `CodeSubmission`
- `Flashcard`
- `GlossaryTerm`
- `KnowledgeEntity`
- `UserTopicState`
- `AiGenerationJob`

## Sprint 52 口径

- 薄弱领域只统计 official DailyPlan 关联的 Lesson 信号。
- 到期卡片只统计同一用户、同一 official lesson 的 `Flashcard.dueAt <= now`。
- 测验正确率来自 official lesson 下的 `QuizAttempt`。
- 代码缺口来自 official lesson 下的 `CodeSubmission`。
- 活跃错题来自 official lesson 下 status 为 `open` 或 `active` 的 `Misconception`。
- 复习留存趋势从 `ReviewLog.createdAt` 转换为用户 `timeZone` 对应 localDate 后聚合。

## Sprint 53 口径

- 错题趋势读取当前用户全部 `Misconception`。
- 趋势优先使用 `Misconception.localDate`。
- 当旧记录缺少 `localDate` 时，用用户 `timeZone` 将 `lastAttemptAt` 转成 localDate。
- `open` 和 `active` 都计入开放错题。
- `resolved` 计入已解决，`ignored` 计入忽略。
- 解决率为 `resolved / total`。

## Sprint 54 口径

- 测验正确率趋势读取当前用户 official lesson 下的 `QuizAttempt`。
- 使用 `QuizAttempt.createdAt` 按用户 `timeZone` 转换成 localDate。
- 每日 `attempts` 为当天答题次数，`correct` 为当天正确次数。
- `accuracy = correct / attempts`，按百分比四舍五入并限制在 0..100。

## Sprint 55 口径

- 代码反馈问题趋势读取当前用户 `CodeFeedback`。
- 使用 `CodeFeedback.localDate` 作为趋势日期。
- 使用 `normalizeCodeFeedbackIssues()` 兼容 string 和 object 两种历史 issues 形态。
- 每日统计 `feedbackCount`、`issueCount`、`highIssueCount`、`mediumIssueCount`、`lowIssueCount`。
- `topIssueType` 为当天出现最多的问题类型；无 issue 时为 `null`。

## 约束

- 不新增数据库迁移。
- 所有查询按当前 `userId` scoped。
- 不执行用户代码，只统计已保存的提交和反馈。
- 复杂可视化图谱仍然不在当前阶段做。
- 生成稳定性不显示任何 provider key。
- DeepSeek repair 成功只记录 `output.meta.repaired` 和 `repairReason`，不记录敏感配置。
- 生成质量评分直接复用 `AiGenerationJob.output` JSON，不新增 `GeneratedContentQuality` 表。
- 习惯目标只用现有 DailyPlan localDate、streak 和今日轻量任务状态计算，不新增持久化。
- 学习日历保留颜色编码，但状态语义必须同步体现在 `aria-label`，用于辅助技术和非视觉验收。
- 进度条保留现有视觉样式，但语义层必须同步 `aria-valuenow` 和 `aria-valuetext`。
- 薄弱领域列表入口只调整触控目标，不改变 `buildProgressWeakDomainSummary()`、统计口径、Prisma 查询、`/map` 路由参数、Preview 写保护或数据库契约。
- 最近学习信号列表入口只调整触控目标，不改变 `/progress` 的统计口径、趋势聚合、Prisma 查询或跳转目的地。
- 最近学习信号标签只调整读侧展示，不改变 `CodeFeedback.overall`、`Project.status`、项目统计、Prisma 查询、Preview 写保护或数据库契约。
- 最近代码反馈 provider 标签只调整读侧展示，不改变 `CodeFeedback.provider`、AI 反馈生成、Prisma 查询、Preview 写保护或数据库契约。
- 最近思路评审 mode 标签只调整读侧展示，不改变 `ThoughtReview.mode`、Coach 提交流程、Voice-to-Coach mode 映射、Preview 写保护或数据库契约。
- 薄弱主题卡片只调整读侧展示，不改变 `UserTopicState.exposureCount`、`weakTopicStates` 排序、Topic 查询、Prisma 查询、Preview 写保护或数据库契约。
- 概览卡片内部名清理只调整读侧文案，不改变 `DailyPlan.completed` 统计口径、`ReviewLog` 计数、Prisma 查询、Preview 写保护或数据库契约。
- 生成稳定性标签只调整读侧展示，不改变 `GenerationHealthMetrics`、`summarizeGenerationHealth()`、`AiGenerationJob` 聚合口径、Prisma 查询、Preview 写保护或数据库契约。
- 生成稳定性模型分布标签只调整读侧展示，不改变 `GenerationHealthMetrics.modelDistribution`、`summarizeGenerationHealth()`、`AiGenerationJob.model` 聚合口径、Prisma 查询、Preview 写保护或数据库契约。

## 验证

- 单元测试覆盖内容质量、质量评分、学习效果、学习日历、学习日历可访问状态文案、本周补弱计划步骤徽章中文化、趋势徽章中文业务标签、共享进度条语义、代码趋势、代码反馈问题趋势、测验正确率趋势、错题趋势、薄弱领域、复习留存趋势、知识覆盖和生成稳定性计算。
- 最近针对最近学习信号列表入口的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` 17 项通过；`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 45 项通过。
- 最近针对最近学习信号标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` 18 项通过；`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-code-exercise.test.ts tests/unit/projects.test.ts` 55 项通过。
- 最近针对最近代码反馈 provider 标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于缺少 `formatTodayPlanSourceLabel(f.provider)`，GREEN 后 21 项通过；`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/coach-workspace.test.ts tests/unit/map-analytics.test.ts` 57 项通过。
- 最近针对最近思路评审 mode 标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` 18 项通过。
- 最近针对薄弱主题卡片文案本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于缺少 `formatProgressWeakTopicDomainLabel()` 且仍显示 `exposure`，GREEN 后 23 项通过；相关回归 `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts` 83 项通过。
- 最近针对 Progress 概览内部模型名本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于 `以 DailyPlan.completed 为准` 和 `ReviewLog：{reviewLogsCount}`，GREEN 后 24 项通过；相关回归 `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts` 69 项通过。
- 最近针对内容质量来源标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于 `来源：deepseek`，GREEN 后 19 项通过，覆盖 `deepseek`、`template`、`fallback`、空 source 和 `unknown` 防回归。
- 最近针对内容质量代码练习质量标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于 `代码练习：strong`，GREEN 后 20 项通过，覆盖 `strong`、`basic`、`missing` 和历史未知值防回归。
- 最近针对生成稳定性卡中文化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于 `DeepSeek / fallback`，GREEN 后 21 项通过，覆盖 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本` 和 `未标记` 防回归。
- 最近针对生成稳定性模型分布标签本地化的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于缺少 `AI 模型：DeepSeek Flash`，GREEN 后 24 项通过；相关回归 `npm test -- tests/unit/progress-analytics.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 62 项通过。
- 最近针对薄弱领域入口移动触控的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` RED 首次失败于缺少 `progressWeakDomainLinkClassName`，GREEN 后 22 项通过；相关回归 `npm test -- tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 70 项通过。
- 最近针对趋势徽章的本地验证：`npm test -- tests/unit/progress-analytics.test.ts` 16 项通过；`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 42 项通过。
- 本地构建验证 `/progress` 仍为动态服务端页面。
