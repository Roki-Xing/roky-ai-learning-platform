# Generation Quality

## Owner

- Generator: `src/server/ai/generate-daily-plan.ts`
- Quality snapshot: `src/server/ai/daily-generation-quality.ts`
- Admin review queues: `src/server/admin/content-review.ts`
- Prompt Studio: `src/server/admin/prompt-studio.ts`
- Analytics: `src/server/analytics/progress.ts`
- UI surface: `/progress`, `/admin`, `src/app/admin/ui/prompt-studio-card.tsx`

## Behavior

1. Every successful or fallback `daily_plan` generation job now persists a quality snapshot into `AiGenerationJob.output`.
2. Persisted fields:
   - `qualityScore`
   - `qualityChecks`
   - `qualityWarnings`
   - `qualityMetrics`
3. The quality checker explicitly tracks the product doc requirements:
   - 是否有代码练习
   - 是否有 quiz options
   - 是否有术语卡
   - 是否有广度卡
   - 是否有 `commonBugs`
   - 是否太短
   - 是否重复近期主题
   - 是否触发 JSON repair / fallback
4. `/progress` 的“内容质量”卡片优先读取持久化质量快照；如果历史计划没有 `generationJobId` 或旧 job 没有质量快照，才回退到运行时计算。
5. `/progress` 的“生成稳定性”新增最近平均质量、覆盖 job 数和低质量 job 数，便于观察模型质量是否在下降。
6. `/admin` 的“卡片质量审查”扫描当前用户最近卡片，标出：
   - 过长卡片
   - 答案过短
   - 重复 front
   - 缺少 tags
   - 从未复习
7. `/admin` 的“来源核验队列”扫描 Glossary / Radar，标出：
   - Glossary 缺少 `sourceRefs`
   - Radar 缺少 `sourceRefs`
   - Radar `lastVerifiedAt` 过期
   - Radar `confidence=low`
8. `/admin` 的“重复主题检测”扫描当前用户最近 DailyPlan，按 `selectedTopic` 或课程标题归一化分组，标出重复主题、受影响计划数、日期范围和关联计划，帮助维护者发现生成内容重复。
9. `/admin` 的 `Prompt Studio` 集中显示：
   - `Prompt 版本`
   - `Schema 版本`
   - `最新生成 schema`
   - `漂移数量`
   - 最近失败样例
   - 最近兜底 / 修复样例
   - 手动修复测试
   - 可测试 / 等待样例
   - 成功 / 失败 / 错误
   - 每日计划 / Cron 计划 / 兜底生成 / JSON 修复 / 原始输出 / 质量警告
   - 顶部状态、schema 分布和样例元信息使用 `Schema 版本：...` / `Schema 版本：未标记`
   - 指定日期测试计划重建入口
   - 指定日期测试计划的 `YYYY-MM-DD` 输入框和 `重新生成某日期计划（测试）` CTA 在手机端都满足 44px 触控目标，且不改变 `regeneratePlanForLocalDateAction` 或模型调用边界
10. `/admin` 的计划治理区统一本地化维护者可见状态标签：
   - 过滤按钮显示 `正式`、`测试`、`已归档`、`全部`
   - 计划类型显示 `正式计划`、`测试计划`
   - 归档状态显示 `已归档`
   - 激活历史显示 `成功`、`失败` 和 `暂无激活记录`
   - `test`、`official`、`archived` 只作为 query、枚举或内部技术值保留，不作为可见状态标签直出
11. `/admin` 的计划治理区复用学习者侧状态/来源 helper，避免维护者看到 raw DailyPlan 值：
   - DailyPlan 状态显示 `待完成`、`已完成`、`未生成`
   - DailyPlan 来源显示 `AI 生成`、`模板兜底`、`后台重建`、`系统生成`
   - 批量归档按钮显示 `归档所有测试计划`、`归档未来待完成计划`
   - `planned`、`completed`、`deepseek`、`template`、`unknown` 只作为数据、query 或内部技术值保留，不作为计划治理可见标签直出
12. `/admin` 登录态和已认证态页头 badge 显示 `开发运维`，不再显示英文 `DEV`。
    `/admin` 未登录 shell、环境卡登录和环境卡退出控件复用移动端触控 class：`ADMIN_SECRET` 输入框满足 `min-h-11`，登录/退出 CTA 满足 `min-h-11 w-full sm:w-auto`，不改变 `adminLoginAction`、`adminLogoutAction`、cookie 或 route protection。
13. `/admin` 今日闭环里的今日计划状态复用 `formatHomeDailyPlanStatusLabel(plan?.status)`，显示 `待完成`、`已完成` 或 `未生成`，不再把 `planned`、`completed` 或 `none` 作为维护者可见状态直出。
14. `/admin` 今日闭环操作区显示中文维护者文案：
   - 页头副标题显示 `执行初始化与一键闭环检查`
   - 用户档案和 seed action 显示 `确保用户档案`、`初始化领域/主题`
   - 反思输入提示显示 `今日反思（可选）`
   - loop/cron action 显示 `一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`指定日期闭环检查（生成 → 完成 → 验证）`
   - 反思输入和指定日期输入在手机端满足 44px 触控高度，且只改变展示层 class
   - 11 个今日闭环 action CTA 在手机端满足 `min-h-11 w-full sm:w-auto`，且只改变展示层 class
   - `ensure profile`、`seed domains/topics`、`reflection（可选）`、`loop check`、`daily cron` 只作为内部 action/function 命名或历史记录保留，不作为当前维护者可见操作文案直出
15. `/admin` 数据概览元信息显示 `暂无正式计划状态`、`来源 / Schema 版本`、`Schema 版本：未标记` 和 `全局课程总数`，不再把空状态 `none`、`schema unknown` 或 `全局 Lesson 总数` 作为维护者可见标签直出。
16. `/admin` 页面层的单条计划审计链路、planner summary、审计异常队列、最近 DailyPlan 和最近 AiGenerationJob planner input 使用 `Schema 版本：...` / `Schema 版本：未标记`，不再把 `schema 2.3`、`schema -` 或裸 `schema ...` 模板作为维护者可见标签直出。
17. `/admin` 审计与生成任务区域的维护者标题显示 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`、`最近每日计划（10）`、`最近生成任务（10）`、`选题输入`，不再把 `DailyPlan`、`Lesson`、`Generation`、`Consistency checks`、`CurriculumDecisionLog`、`Planner input summary`、`最近 DailyPlan（10）`、`最近 AiGenerationJob（10）` 或 `Planner input` 作为可见标题直出。
18. 新生成的 `daily_plan` job input 会记录 `promptVersion`，便于把 prompt 版本和 schema 版本一起审计。
19. 当前 prompt version 为 `daily-plan-v2.10-code-sketch-course-blocks`，要求 `lesson.contentMarkdown` 输出 `> 核心直觉 / > 常见误区 / > 重点 / > 例子卡 / > 代码/伪代码 / > 图示 / > 互动实验 / > 自测卡` 课程块，便于 `LearningMarkdown` 渲染成课程提示、重点提示、例子卡、代码/伪代码提示、心智图提示、小探索任务和检索练习卡。

## Persistence Contract

- `AiGenerationJob.output.qualityScore` 是 0..100 的数值分。
- `AiGenerationJob.output.qualityChecks` 是布尔检查项对象。
- `AiGenerationJob.output.qualityWarnings` 是面向产品/UI 的短警告列表。
- `AiGenerationJob.output.qualityMetrics` 复用内容质量基础指标：
  - `contentLength`
  - `guidedStepCount`
  - `quizCount`
  - `codingExerciseQuality`
  - `flashcardCount`
  - `schemaVersion`
  - `source`
  - `generationRetries`
  - `fallbackUsed`

## Constraints

- 不新增数据库迁移；继续复用 `AiGenerationJob.output` JSON。
- 质量快照必须同时覆盖 primary success、repair success 和 template fallback。
- Admin 审查队列只读，不自动修改卡片、术语或 Radar 实体。
- 重复主题检测只扫描当前用户的 DailyPlan，不自动归档、重建或改写计划。
- Prompt Studio 不自动调用模型修复；它只聚合样例并显示手动修复测试可用性。
- Prompt Studio 的状态、原因和样例类型必须走中文展示 helper；`success`、`failed`、`error`、`ready`、`fallback`、`repair`、`rawPrimary`、`quality-warning` 只作为内部技术值保留，不作为维护者可见标签直出。
- Prompt Studio 的 schemaVersion 可见标签必须走 `formatPromptStudioSchemaVersionLabel()`；`schema 2.3`、`schema 2.2`、`schema -` 只作为历史记录或测试反向断言保留，不作为当前维护者可见标签直出。
- `/admin` 页面层 schemaVersion 可见标签必须走 `adminSchemaVersionLabel()`；`schema 2.3`、`schema -` 只作为历史记录或测试反向断言保留，不作为当前维护者可见标签直出。
- 指定日期重建入口仅归档并重建 test 计划，不默认修改 active official 计划。
- Prompt Studio UI 组件不直接导入 `/admin/actions.ts`；页面层注入 server action，避免只读静态渲染测试加载 DB/env 依赖。
- prompt version 变更必须同步 `tests/unit/daily-generation-prompt.test.ts` 和 Prompt Studio 验收记录。
- 不记录 provider 密钥或其他敏感配置。

## Verification

- `npm test -- tests/unit/daily-generation-quality.test.ts`
- `npm test -- tests/unit/admin-content-review.test.ts`
- `npm test -- tests/unit/admin-prompt-studio.test.ts`
- `npm test -- tests/unit/admin-page-labels.test.ts`
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts`
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts`
- `npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/auth-policy.test.ts`
- `npm test -- tests/unit/daily-generation-quality.test.ts tests/unit/progress-analytics.test.ts tests/unit/daily-generation-prompt.test.ts`
- `npm run lint`
- `npm run build`
- Browser check:
  - `/progress` 可见“内容质量”和“生成稳定性”
  - “生成稳定性”可见 `最近质量`
  - 如果最近 job 有告警，内容质量卡可见 `警告：...`
  - `/admin` 可见“内容质量摘要”、“重复主题检测”、“卡片质量审查”和“来源核验队列”
  - `/admin` 页头 badge 可见 `开发运维`，不应直出 `DEV`
  - `/admin` 环境卡可见 `Admin 认证：已登录` 或 `Admin 认证：需要登录`，不应直出 `Admin Auth: ok` 或 `Admin Auth: required`
  - `/admin` 未登录 shell 卡片标题可见 `管理员登录`，不应直出 `Admin Login`
  - `/admin` 数据概览和最近卡片列表可见 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：` 和 `复习次数：`，不应直出 `Flashcard`、`Due Flashcard`、`最近 Flashcard`、`due:` 或 `reviews:`
  - `/admin` 数据概览标题和实体标签可见 `数据概览（当前用户）`、`用户档案`、`每日计划`、`复习记录`、`笔记`，不应直出 `数据概览（当前 user）`、`UserProfile`、`DailyPlan`、`ReviewLog` 或 `Note`
  - `/admin` 数据概览元信息可见 `暂无正式计划状态`、`来源 / Schema 版本`、`Schema 版本：未标记` 和 `全局课程总数`，不应直出 `none`、`schema unknown` 或 `全局 Lesson 总数`
  - `/admin` 今日闭环里的 `今日计划` 可见中文计划状态，例如 `待完成`、`已完成` 或 `未生成`，不应直出 `planned`、`completed` 或 `none`
  - `/admin` 今日闭环操作区可见 `确保用户档案`、`初始化领域/主题`、`今日反思（可选）`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`指定日期闭环检查（生成 → 完成 → 验证）`，不应直出 `ensure profile`、`seed domains/topics`、`reflection（可选）`、`loop check` 或 `daily cron`
  - `/admin` 来源核验队列每条审核项标题链接复用 `adminKnowledgeVerificationLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2"`，手机端满足 44px 触控高度。
  - 来源核验队列链接触控样式不改变 `summarizeKnowledgeVerificationQueue()`、审核原因、条目 href、Preview 写保护或内容审查数据。
  - `/admin` 可见 `Prompt Studio`、`Prompt 版本`、`Schema 版本`、`最新生成 schema`、`漂移数量`、`手动修复测试`、`最近失败样例`、`最近兜底 / 修复样例`、`重新生成某日期计划（测试）`
  - `/admin` Prompt Studio 顶部状态、schema 分布和样例元信息可见 `Schema 版本：2.3`、`Schema 版本：2.2`、`Schema 版本：未标记`，不应直出 `schema 2.3`、`schema 2.2` 或 `schema -`
  - `/admin` Prompt Studio 可见 `成功`、`失败`、`错误`、`可测试`、`等待样例`、`每日计划`、`Cron 计划`、`兜底生成`、`JSON 修复`、`原始输出`、`质量警告`，不应直出 `success`、`failed`、`error`、`ready`、`fallback`、`repair`、`rawPrimary` 或 `quality-warning`
  - `/admin` 计划治理区可见 `正式计划状态`、`正式计划`、`测试计划`、`已归档`、`设为正式`、`激活历史`，不应直出 `test`、`official`、`archived`
  - `/admin` 最近每日计划列表里的 `查看课程` 和 `审计链路` 链接复用 `adminRecentPlanLinkClassName = "inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2"`，手机端满足 44px 触控高度。
  - 最近每日计划链接触控样式不改变计划治理 action、`planAuditHref()`、课程路由、筛选逻辑、Preview 写保护或数据读取。
  - `/admin` 最近每日计划列表里的 `设为正式` 和 `归档` 治理按钮复用 `adminRecentPlanGovernanceCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端满足 44px 触控高度。
  - 最近每日计划治理按钮触控样式不改变 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview 写保护或数据读取。
  - `/admin` 最近每日计划卡片 action row 复用 `adminRecentPlanActionRowClassName = "flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end"`，手机端占满一行并允许换行，桌面端恢复右对齐。
  - 最近每日计划 action row 布局不改变 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview 写保护或数据读取。
  - `/admin` 单条计划审计链路里的 `查看课程` 链接复用 `adminPlanAuditLessonLinkClassName = "mt-1 inline-flex min-h-11 items-center text-primary underline underline-offset-2"`，手机端满足 44px 触控高度。
  - 单条计划审计链路课程链接触控样式不改变 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview 写保护或数据读取。
  - `/admin` 单条计划审计链路、审计异常队列、最近 DailyPlan 和最近 AiGenerationJob planner input 可见 `Schema 版本：...` 或 `Schema 版本：未标记`，不应直出 `schema 2.3`、`schema -` 或裸 `schema ...` 模板
  - `/admin` 审计与生成任务区域可见 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`、`最近每日计划（10）`、`最近生成任务（10）`、`选题输入`，不应直出旧英文标题
  - `/admin` 审计空态、状态 badge、详情展开和定时任务文案可见 `暂无关联生成任务`、`通过`、`警告`、`失败`、`暂无匹配的选题决策记录`、`暂无选题输入摘要`、`正常`、`N 项失败`、`最近选题决策（10）`、`选题信号快照`、`查看生成输出 JSON`、`最近每日定时任务（10）`、`查看定时任务输出 JSON`，不应直出 `无 linked job`、`matching decision log`、`planner input summary`、`fail`、`warn`、`ok`、`Planner signal snapshot`、`最近 Daily Cron（10）` 或 `{j.status}` 这类 raw 状态/文案
  - `/admin` 计划治理区可见 `待完成`、`已完成`、`AI 生成`、`模板兜底`、`后台重建`，不应直出 `planned`、`completed`、`deepseek`、`template`、`unknown`

## Recent Local Verification Notes

- Phase E Admin Audit Empty/Detail Copy Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，11 项通过；覆盖 `/admin` 审计空态、状态 badge、详情展开和定时任务文案显示 `暂无关联生成任务`、`通过`、`警告`、`失败`、`暂无匹配的选题决策记录`、`暂无选题输入摘要`、`正常`、`N 项失败`、`最近选题决策（10）`、`选题信号快照`、`查看生成输出 JSON`、`最近每日定时任务（10）`、`查看定时任务输出 JSON`，并防止旧 raw 文案回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：39 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 383 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Knowledge Verification Link Mobile Touch Targets：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminKnowledgeVerificationLinkClassName`，且来源核验队列标题链接仍使用旧小触控 inline class；GREEN 后 12 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：40 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 408 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Recent Plan Link Mobile Touch Targets：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminRecentPlanLinkClassName`，且最近每日计划 `查看课程` / `审计链路` 仍使用旧小触控 inline class；GREEN 后 13 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：41 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 409 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Recent Plan Filter CTA Mobile Touch Targets：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminPlanFilterCtaClassName`；GREEN 后 14 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：42 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 410 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Failed Job Retry CTA Mobile Touch Targets / `0.321.0`：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminFailedJobRetryCtaClassName`；修正测试截取窗口后 GREEN，19 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：49 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - 本切片只调整 `/admin` 最近生成任务失败重试按钮触控目标，不改变 `retryFailedDailyCronJobAction`、生成任务查询、状态文案、Preview 写保护、数据库或生产配置。
  - 覆盖扫描确认 `adminFailedJobRetryCtaClassName`、`0.321.0` 和本切片名贯通源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录；旧无 class 失败生成任务 `size="sm"` 重试按钮模板已退役。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 417 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Recent Plan Governance CTA Mobile Touch Targets / `0.322.0`：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminRecentPlanGovernanceCtaClassName`；修正测试截取窗口后 GREEN，20 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：50 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - 本切片只调整 `/admin` 最近每日计划 `设为正式` / `归档` 治理按钮触控目标，不改变 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview 写保护、数据库或生产配置。
  - 覆盖扫描确认 `adminRecentPlanGovernanceCtaClassName`、`0.322.0` 和本切片名贯通源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录；旧无 class 最近每日计划治理 `size="sm"` 按钮模板已退役。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 418 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Plan Audit Lesson Link Mobile Touch Targets / `0.323.0`：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminPlanAuditLessonLinkClassName`；GREEN 后 21 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：51 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - 本切片只调整 `/admin` 单条计划审计链路 `查看课程` 链接触控目标，不改变 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview 写保护、数据库或生产配置。
  - 覆盖扫描确认 `adminPlanAuditLessonLinkClassName`、`0.323.0` 和本切片名贯通源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录；旧内联小触控 `查看课程` 链接模板已退役。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 419 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Recent Plan Action Row Mobile Layout / `0.324.0`：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminRecentPlanActionRowClassName`，且最近每日计划 action row 仍使用旧 `flex shrink-0 flex-wrap justify-end gap-2` 横向挤压模板；GREEN 后 22 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：52 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - 本切片只调整 `/admin` 最近每日计划 action row 展示层布局，不改变 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview 写保护、数据库或生产配置。
  - 覆盖扫描确认 `adminRecentPlanActionRowClassName`、`0.324.0` 和本切片名贯通源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录；旧 `flex shrink-0 flex-wrap justify-end gap-2` 横向挤压模板已退役。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 420 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Today Loop CTA Mobile Touch Targets / `0.320.0`：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminTodayLoopCtaClassName`；GREEN 后 18 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：48 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - 覆盖扫描确认 `adminTodayLoopCtaClassName`、`0.320.0` 和本切片名贯通源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录；旧无 class 今日闭环 `size="sm"` 小触控模板已退役。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 416 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Audit Exception Link Mobile Touch Targets：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminAuditExceptionLinkClassName`；GREEN 后 15 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：43 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 411 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Plan Audit Close CTA Mobile Touch Targets：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 首次失败于 `/admin` 缺少 `adminPlanAuditCloseCtaClassName`；GREEN 后 16 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：44 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 412 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets：
  - `npm test -- tests/unit/admin-prompt-studio.test.ts`：RED 首次失败于 `PromptStudioCard` 缺少 `promptStudioCtaClassName`；GREEN 后 4 项通过。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：45 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 413 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Audit Heading Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，10 项通过；覆盖 `/admin` 单条计划审计链路和最近生成任务区域显示 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`、`最近每日计划（10）`、`最近生成任务（10）`、`选题输入`，并防止旧英文标题回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：38 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 382 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Page Schema Label Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，9 项通过；覆盖 `/admin` 页面层新增 `adminSchemaVersionLabel()`，单条计划审计链路、planner summary、审计异常队列、最近 DailyPlan 和最近 AiGenerationJob planner input 显示 `Schema 版本：...` / `Schema 版本：未标记`，并防止旧 `schema 2.3`、`schema -` 模板回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：37 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Prompt Studio Schema Version Label Localization：
  - `npm test -- tests/unit/admin-prompt-studio.test.ts`：RED 后 GREEN，3 项通过；覆盖 Prompt Studio 顶部状态、schema 分布和样例元信息显示 `Schema 版本：...` / `Schema 版本：未标记`，并防止旧 `schema 2.3`、`schema 2.2`、`schema -` 模板回退。
  - `npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/admin-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：19 项通过，覆盖 Prompt Studio、内容审查、Admin 标签和每日生成质量队列。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Data Overview Metadata Label Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，9 项通过；覆盖 `/admin` 数据概览显示 `暂无正式计划状态`、`来源 / Schema 版本`、`Schema 版本：未标记`、`全局课程总数`，并防止旧 `none`、`schema unknown` 和 `全局 Lesson 总数` 文案回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：37 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Today Loop Action Copy Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，8 项通过；覆盖 `/admin` 今日闭环页头副标题和操作区显示 `确保用户档案`、`初始化领域/主题`、`今日反思（可选）`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`指定日期闭环检查（生成 → 完成 → 验证）`，并防止旧 `ensure profile`、`seed domains/topics`、`reflection（可选）`、`loop check` 和 `daily cron` 可见文案回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：36 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 380 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Today Loop Plan Status Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，7 项通过；覆盖 `/admin` 今日闭环显示 `今日闭环`，且 `今日计划` 状态走 `formatHomeDailyPlanStatusLabel(plan?.status)`，并防止旧 `plan ? plan.status : "none"` raw 状态模板回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：35 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 379 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Data Overview Entity Label Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，6 项通过；覆盖 `/admin` 数据概览标题显示 `数据概览（当前用户）`，实体标签显示 `用户档案`、`每日计划`、`复习记录`、`笔记`，并防止旧 `数据概览（当前 user）`、`UserProfile`、`DailyPlan`、`ReviewLog`、`Note` 文案回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：34 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `rg -n '数据概览（当前用户）|用户档案|每日计划|复习记录|笔记|UserProfile:|DailyPlan:|ReviewLog:|Note:|0\\.268\\.0|Admin Data Overview' ...`：覆盖扫描确认本切片源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录均接入数据概览实体标签中文化；`rg -n '数据概览（当前 user）|>UserProfile:|>DailyPlan:|>ReviewLog:|>Note:' src/app/admin/page.tsx` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 378 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Flashcard Label Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，5 项通过；覆盖 `/admin` 数据概览和最近卡片列表显示 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：`、`复习次数：`，并防止旧英文 Flashcard/due/reviews 文案回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：33 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `rg -n '复习卡片|到期复习卡片|最近复习卡片|Flashcard:|Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount|0\\.267\\.0|Admin Flashcard' ...`：覆盖扫描确认本切片源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录均接入复习卡片文案中文化；`rg -n '>Flashcard:|>Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount' src/app/admin/page.tsx` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 377 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Login Shell Title Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，4 项通过；覆盖 `/admin` 未登录 shell 卡片标题显示 `管理员登录`，并防止旧英文 `Admin Login` 回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：32 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `rg -n '管理员登录|Admin Login|0\\.266\\.0|Admin Login Shell' ...`：覆盖扫描确认本切片源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录均接入未登录标题中文化；`rg -n "Admin Login" src/app/admin/page.tsx` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 376 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。

- Phase E Admin Header Badge Localization：
  - `npm test -- tests/unit/admin-page-labels.test.ts`：RED 后 GREEN，2 项通过；覆盖 `/admin` 登录态和已认证态页头 badge 显示 `开发运维`，并防止 `badge="DEV"` 回退。
  - `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：30 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
  - `rg -n 'Admin Header Badge|badge="开发运维"|badge="DEV"|0\\.253\\.0|开发运维页头' ...`：覆盖扫描通过，确认 `/admin` 源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录均接入页头 badge 中文化要求；`src/app/admin/page.tsx` 中 `badge="DEV"` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 364 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
