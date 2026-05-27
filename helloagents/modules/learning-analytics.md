# Learning Analytics

## 当前行为

- Sprint 9 将 `/progress` 从基础计数升级为学习分析面板。
- Sprint 52 将 `/progress` 继续推进为学习状态页，补齐薄弱领域和复习留存趋势。
- Sprint 53 补齐错题趋势，让 Phase 7 的“错题和代码练习趋势”同时可见。
- Sprint 54 补齐测验正确率趋势，让学习效果从总正确率扩展到按日期观察。
- Sprint 55 补齐代码反馈问题趋势，让代码练习从提交次数扩展到问题严重度观察。
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
  - 生成稳定性：DeepSeek/fallback 计划数、fallback rate、daily_plan job success/error、repair rate、schemaVersion 分布和 model 分布。
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

## 验证

- 单元测试覆盖内容质量、质量评分、学习效果、学习日历、代码趋势、代码反馈问题趋势、测验正确率趋势、错题趋势、薄弱领域、复习留存趋势、知识覆盖和生成稳定性计算。
- 本地构建验证 `/progress` 仍为动态服务端页面。
