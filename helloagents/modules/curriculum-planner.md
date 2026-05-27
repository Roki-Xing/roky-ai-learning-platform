# Curriculum Planner

## 当前行为

- Curriculum Planner 在生成 DailyPlan 前先选择领域和主题。
- `selectNextTopic()` 聚合最近学习、完成数、到期卡片、hard/forgot 复习、错题、代码提交、open/active Misconception 和知识地图弱点。
- `scoreTopicCandidates()` 输出 `scoreBreakdown`，包含：
  - `weeklyRotationScore`
  - `underCoverageScore`
  - `weaknessScore`
  - `mapWeaknessScore`
  - `misconceptionScore`
  - `combinedWeaknessScore`
  - `codingNeedScore`
  - `userPreferenceScore`
  - `noveltyScore`
  - `remediationBoost`
  - `recentTopicPenalty`
  - `recentDomainPenalty`
- `DailyPlan` 保存 `selectedDomain`、`selectedTopic`、`selectionReason`、`source`、`schemaVersion` 和 `generationJobId`。
- `CurriculumDecisionLog` 保存每次正式/测试计划的 planner 输入快照和评分拆解。
- Sprint 24 后，`CurriculumDecision` 同时携带 `signalSnapshot`：
  - `recentStudies`
  - `completedCountByDomain`
  - `dueCountByDomain`
  - `hardReviewCountByDomain`
  - `incorrectQuizCountByDomain`
  - `activeMisconceptionCountByDomain`
  - `mapWeaknessByDomain`
  - `codeSubmissionCountLast7`
- `signalSnapshot` 会随 `decision` 写入 `CurriculumDecisionLog.inputSnapshot`，并进入 `AiGenerationJob.input.curriculum`。
- `buildDailyPlanMessages()` 会把 `Planner signal snapshot` 显式写入 DeepSeek prompt，用于调整补弱点、代码练习和去重重点。
- `/admin` 可以把某个 DailyPlan 设为正式 active plan：
  - 选中计划会变为 `isTest=false`、`archivedAt=null`、`source=admin`。
  - 同一 user/localDate 的其他正式 active plan 会被归档。
  - 越权 planId 会被拒绝。
- `/admin` 最近 DailyPlan 支持 `active/test/archived/all` 过滤：
  - 默认只看 active official plans。
  - `planFilter=test` 只看未归档测试计划。
  - `planFilter=archived` 只看已归档计划。
  - `planFilter=all` 显式查看当前用户全部计划。
- 计划激活会写入 `AiGenerationJob(type="admin_plan_activation")`，计划卡片展示 `Activation history`。
- Sprint 28 后，`/admin` 可对单个 DailyPlan 执行治理性归档：
  - `markPlanArchived()` 只按当前 `userId + planId` 操作。
  - 归档只写 `archivedAt`，不删除历史数据。
  - 操作会写入 `AiGenerationJob(type="admin_plan_archive")`。
- `/library` 默认隐藏 test 和 archived plan。
- Sprint 27 后，`/library` 支持按 DailyPlan 治理字段筛选：
  - `source`
  - `schemaVersion`
  - `status`
  - `localDate`
- `src/server/library/plan-filter.ts` 集中管理 `/library` 查询参数、DailyPlan where 和课程链接参数保留。

## Sprint 13 解释层

- `src/server/curriculum/explain-decision.ts` 将 planner score 转成用户可读解释。
- `/today` 展示“为什么今天学这个”，优先显示主理由和活跃信号，不暴露原始 JSON。
- `/admin` 最近 CurriculumDecision 展示同一套解释摘要，原始 `reason` 与 `scoreBreakdown` 仅在折叠区查看。
- Sprint 23 后，解释层会把 `misconceptionScore` 显示为“活跃误区”，让 `/today` 可以说明错题、代码反馈或 Coach 评审为什么影响今天选题。

## Sprint 14 Quiz 错误反馈

- `submitQuizAttempt()` 是 quiz 提交后的服务层入口。
- 答错时写入或更新：
  - `QuizAttempt`
  - `Misconception(status="open")`
  - `Flashcard(type="quiz_error")`
  - `UserTopicState.weaknessScore`
- 错题卡 ID 使用 `quiz-error:{userId}:{questionId}`，重复答错同一道题只更新同一张卡。
- 答对后会把 open Misconception 标记为 resolved，但不删除错题卡历史。
- Server Action 不信任前端题型隐藏字段，服务层按数据库中的 `QuizQuestion.type` 解析答案。

## Sprint 23 Planner 误区信号

- `src/server/curriculum/select-next-topic.ts` 会读取当前用户 `Misconception(status in ["open", "active"])`。
- domain 映射规则：
  - 优先使用 `Misconception.topicId -> Topic.domain`
  - 无 `topicId` 时使用 `Misconception.lessonId -> Lesson.topic.domain`
- `activeMisconceptionCountByDomain` 会传入 `scoreTopicCandidates()`。
- `scoreTopicCandidates()` 将该计数归一化为 `misconceptionScore`，并纳入 `combinedWeaknessScore`。
- `reason` 中包含 `misconception=...`，`scoreBreakdown` 中包含 `misconceptionScore`。
- 这使 quiz/code/coach 三类误区都能影响下一次课程选择。

## Sprint 24 Planner 信号快照

- `src/server/curriculum/types.ts` 定义 `CurriculumSignalSnapshot`。
- `src/server/curriculum/scoring.ts` 以 scoring input 为来源，在每个 `CurriculumDecision` 上输出完整快照。
- `src/server/curriculum/select-next-topic.ts` 的 fallback decision 也返回同结构空快照，保证消费侧不用猜字段。
- `src/server/ai/generate-daily-plan.ts` 导出 `buildDailyPlanMessages()`，该纯函数可单测导入，不触发 DB 或 env 校验。
- 真实 DeepSeek 调用路径仍只在服务端按需动态导入 DB 和 DeepSeek adapter，密钥不进入前端。

## Sprint 25 Admin 信号快照摘要

- `src/server/curriculum/signal-snapshot.ts` 从 `CurriculumDecisionLog.inputSnapshot.decision.signalSnapshot` 提取 planner 快照。
- 同一模块把快照转成管理端摘要：
  - 最近学习
  - 活跃误区
  - 错题压力
  - 到期复习
  - 困难复习
  - 地图薄弱
  - 代码练习
  - 完成覆盖
- `/admin` 最近 CurriculumDecision 卡片展示 `Planner signal snapshot`，原始 `inputSnapshot` 仍在折叠区。
- 老计划或 admin 激活记录没有 snapshot 时显示空态，不伪造信号。

## Sprint 48 Admin Planner Input 可见性

- `src/server/admin/planner-visibility.ts` 从 `AiGenerationJob.input.curriculum` 构建 admin 摘要。
- `/admin` 最近 `AiGenerationJob` 查询包含 `input`，并在卡片中显示 `Planner input`。
- 摘要展示：
  - `localDate`
  - `schemaVersion`
  - 难度和预计分钟
  - 选中领域和主题
  - `explainCurriculumDecision()` 生成的主理由
  - 活跃 score signals
  - `signalSnapshot` 中的最近学习、误区、错题、复习、地图薄弱和代码练习信号
- 没有 `curriculum` input 的 job 不显示摘要，避免把 admin activation 或旧 job 伪装成 planner 生成任务。
- 原始 `output JSON` 仍默认折叠，避免页面默认暴露大段调试数据。

## Sprint 49 Admin Plan 审计链路

- `src/server/admin/plan-audit.ts` 提供 `buildAdminPlanAuditChain()`。
- 该 helper 只按 `userId + planId` 读取计划，跨用户 planId 会返回 `DailyPlan not found`。
- 审计链路关联：
  - `DailyPlan`
  - `Lesson` 的 topic/domain
  - 同 `userId + localDate + isTest` 的 `CurriculumDecisionLog`
  - `DailyPlan.generationJobId` 指向的 `AiGenerationJob`
  - `AiGenerationJob.input.curriculum` 的 planner 摘要
- 返回 consistency checks：
  - decision log 是否存在
  - generation job 是否存在
  - topic 是否一致
  - domain 是否一致
  - schemaVersion 是否一致
- `/admin` 最近 DailyPlan 行提供“审计链路”入口。
- `/admin?auditPlanId=...` 展示单条计划的证据链，原始 input/output JSON 仍默认折叠。

## Sprint 50 Admin 审计异常列表

- `src/server/admin/plan-audit-exceptions.ts` 提供 `buildAdminPlanAuditExceptions()`。
- 该 helper 按当前 `userId` 和 admin plan filter 扫描最近计划，不跨用户聚合。
- 异常覆盖：
  - 缺 `generationJobId`
  - 缺 linked `AiGenerationJob`
  - 缺 `CurriculumDecisionLog`
  - topic mismatch
  - domain mismatch
  - schemaVersion mismatch
- 聚合层会复用 Sprint 49 单条审计链路的 checks，并对缺 decision/job 的派生异常做根因去重。
- `/admin` 新增“计划审计异常”卡片，展示 scanned、异常计划数、fail/warn 和每条异常的“审计链路”入口。
- 该卡片只读，不自动修复、归档或删除计划。

## Sprint 26 Today 信号快照摘要

- `src/server/curriculum/signal-snapshot.ts` 新增 `buildTodayCurriculumSignalInsight()`，复用同一份 planner snapshot 生成学习者可读摘要。
- `/today` 的“为什么今天学这个”读取 `CurriculumDecisionLog.inputSnapshot`，显示 `Planner 信号快照`。
- 今日页展示最近学习和活跃补弱信号，不暴露原始 JSON。
- 老计划没有 snapshot 时不显示额外信号区块，避免伪造解释。

## 约束

- 不绕过最近 7 次 topic 去重；活跃误区可以提高弱点领域，但不应让同一 topic 连续重复。
- 不新增数据库迁移。
- 不调用外部 AI。
- 不输出密钥或数据库连接串。
- 不执行用户代码。
- 不 hard delete 历史计划；治理动作使用 archive。

## 验证

- `tests/unit/curriculum-scoring.test.ts` 覆盖评分排序、知识地图弱点和最近 7 次 topic 去重。
- `tests/unit/curriculum-scoring.test.ts` 覆盖 active misconception 对选题排序的影响。
- `tests/unit/curriculum-select-next-topic.test.ts` 覆盖 `selectNextTopic()` 从 DB 读取 open Misconception 并映射到 domain。
- `tests/unit/curriculum-select-next-topic.test.ts` 覆盖 `selectNextTopic()` 返回 planner signal snapshot。
- `tests/unit/daily-plan-idempotency.test.ts` 覆盖 `CurriculumDecisionLog.inputSnapshot.decision.signalSnapshot` 持久化。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 `buildDailyPlanMessages()` 把 planner signal snapshot 写入生成上下文。
- `tests/unit/curriculum-signal-snapshot.test.ts` 覆盖 admin signal snapshot 提取和摘要。
- `tests/unit/curriculum-signal-snapshot.test.ts` 覆盖 today learner-facing signal insight。
- `tests/unit/admin-planner-visibility.test.ts` 覆盖 `AiGenerationJob.input.curriculum` 的 admin 摘要和无 curriculum input 的空态。
- `tests/unit/admin-plan-audit-chain.test.ts` 覆盖单条 plan 的 DailyPlan、CurriculumDecisionLog、AiGenerationJob 审计链路，以及跨用户拒绝。
- `tests/unit/admin-plan-audit-exceptions.test.ts` 覆盖异常计划聚合、根因去重、只读性和跨用户隔离。
- `tests/unit/curriculum-explanation.test.ts` 覆盖解释主理由、活跃信号、fallback reason、活跃误区和重复惩罚提示。
- Sprint 23 本地：`npm run lint`、`npm test`、`npm run build` 通过。
- Sprint 23 生产：目标测试、`npm run build`、service health、`/today`、`/progress`、`/map` Host-header 验收通过。
- `tests/unit/admin-plan-governance.test.ts` 覆盖 admin 计划激活、跨用户拒绝、activation audit event 和 plan filter 规则。
- `tests/unit/admin-plan-governance.test.ts` 覆盖单计划归档、跨用户拒绝和 archive audit event。
- `tests/unit/library-plan-filter.test.ts` 覆盖课程库治理筛选、默认 active official 查询和链接参数保留。
- `tests/unit/quiz-error-card.test.ts` 覆盖错题卡构造与 true/false 空提交边界。
- `tests/unit/quiz-submit.test.ts` 覆盖重复答错只生成一张错题卡，以及答对后 resolved Misconception。
