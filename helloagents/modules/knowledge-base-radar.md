# Knowledge Base and AI Radar

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/glossary` 查看术语库。
2. 搜索或按分类筛选术语。
3. 打开术语详情，查看解释、重要性、相关术语、误区、例子和来源。
4. 点击“生成复习卡片”，卡片进入 `/review`。
5. 打开 `/radar` 查看人物、公司、实验室、论文、Benchmark、工具、开源项目和概念实体。
6. 打开实体详情，查看代表内容、时间线、来源、置信度和自测问题。
7. 点击“生成复习卡片”，卡片进入 `/review`。
8. 在 `/today` 的今日术语和今日广度小卡中跳转到对应详情页。
9. 在 `/map` 查看术语库覆盖、Radar 覆盖、类型分布和复习队列状态。

## 每日广度轮转

- `dailyBreadthRotationForLocalDate(localDate)` 按用户本地日期的星期生成每日 focus：
  - 周一：术语 `term`
  - 周二：人物 `person`
  - 周三：公司/实验室 `company` / `lab`
  - 周四：Benchmark `benchmark`
  - 周五：论文 `paper`
  - 周六：工具/开源项目 `tool` / `open_source_project`
  - 周日：复盘 `review`
- `selectDailyKnowledgeFocus()` 从真实 `GlossaryTerm` 和 `KnowledgeEntity` 中选择当日 focus。
- `selectDailyKnowledgeFocus()` 会避开最近 `knowledgeAvoidDays` 天已用过的 `glossary.sourceSlug` 和 `breadth.sourceSlug`。
- `buildKnowledgeCardsFromFocus()` 把真实知识记录转换成 `/today` 的今日术语卡和今日广度小卡。
- `getOrCreateTodayPlan()` 会把 `knowledgeFocus.rotation`、`knowledgeFocus.links`、`glossary.sourceSlug/sourceUrl` 和 `breadth.sourceSlug/sourceUrl` 写入 `Lesson.connections`。
- `/settings` 可以保存：
  - `preferredTermSlugs`
  - `preferredEntitySlugs`
  - `knowledgeAvoidDays`
- 用户偏好会优先参与每日知识选择，但最近已用项仍会被去重过滤。
- 如果当天没有匹配的 Radar 实体，广度卡可以退回术语 concept，但链接只能指向 `/glossary?term=<slug>`，不能伪造成 `/radar?entity=<slug>`。

## 数据模型

- `GlossaryTerm`
  - `slug`
  - `abbreviation`
  - `fullName`
  - `chineseName`
  - `category`
  - `oneLine`
  - `explanation`
  - `whyImportant`
  - `relatedTerms`
  - `commonMistakes`
  - `examples`
  - `sourceRefs`
  - `difficulty`
- `KnowledgeEntity`
  - `type`
  - `name`
  - `slug`
  - `aliases`
  - `oneLine`
  - `whyImportant`
  - `representativeWorks`
  - `relatedTerms`
  - `timeline`
  - `sourceRefs`
  - `lastVerifiedAt`
  - `confidence`
  - `selfCheckQuestion`
- `UserProfile`
  - `preferredTermSlugs`
  - `preferredEntitySlugs`
  - `knowledgeAvoidDays`

## 重要约束

- 术语和 Radar 卡片使用稳定 ID：
  - `glossary:<userId>:<slug>`
  - `radar:<userId>:<slug>`
- 重复点击生成卡片必须通过 `createMany(..., skipDuplicates: true)` 保持幂等。
- 独立知识卡片 `lessonId = null`，必须通过 `tags` 进入复习队列。
- `/review` 的队列和统计必须使用同一套 reviewable 过滤规则。
- `sourceRefs` 用于资料来源提示，不记录 API Key、Admin Secret 或数据库连接串。
- 不在服务端执行用户提交的代码。

## Radar 可信度治理

- Radar 实体是可变事实，尤其是人物、公司、产品、Benchmark、论文和工具。
- 每个实体应具备：
  - `sourceRefs`
  - `lastVerifiedAt`
  - `confidence`
- `knowledgeEntityVerificationBadge()` 是当前服务层口径：
  - 缺少可用 `sourceRefs` → `needs_verification`
  - 缺少 `lastVerifiedAt` → `needs_verification`
  - 来源和验证日期都存在 → `verified`
- `/radar` 详情页必须显示 `verified` 或 `needs_verification`。
- 来源为空时必须显示 `needs_verification：该实体暂无可核验来源。`
- Radar 生成复习卡片时必须通过 `knowledgeEntityVerificationTags()` 写入：
  - `verified` 或 `needs_verification`
  - `confidence:<level>`
- 缺少来源的实体可以继续展示，但不能伪装成已核验。

## 生产验收

- `/glossary?term=rag` 显示 RAG、Retrieval-Augmented Generation、检索增强生成和“生成复习卡片”。
- `/radar?entity=swe-bench` 显示 SWE-bench、benchmark、confidence 和“生成复习卡片”。
- `/map` 显示术语库、AI Radar、复习队列和 Radar 类型分布。
- `/today` 显示“查看术语库”和“查看 Radar”入口。
- 生产数据库已 seed：`GlossaryTerm=23`、`KnowledgeEntity=11`。
- 生产 `ai-learning-platform.service` 为 `active`，`/api/health` 返回 `ok`。
