# Knowledge Base and AI Radar

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/glossary` 查看术语库。
2. 搜索或按分类筛选术语。
3. 打开术语详情，查看解释、重要性、相关术语、误区、例子和来源。
4. 点击“生成复习卡片”，卡片进入 `/review`。
5. 打开 `/radar` 查看人物、公司、实验室、论文、Benchmark、工具、开源项目和概念实体。
6. 打开实体详情，查看代表内容、时间线、来源、可信度、核验状态和自测问题。
7. 点击“生成复习卡片”，卡片进入 `/review`。
8. 在 `/today` 的今日术语和今日广度小卡中跳转到对应详情页。
9. 在 `/map` 查看术语库覆盖、Radar 覆盖、类型分布和复习队列状态。
10. 在 `/glossary` 和 `/radar` 使用学习路径查看 `已看 / 已生成卡片 / 已复习 / 掌握 / 下一项`，节点状态只显示 `未看 / 已查看 / 已生成卡片 / 已复习 / 掌握`。

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

## Daily Quest 广度挑战

- 首页 `/` 会读取今日 `Lesson.connections`，通过 `buildBreadthChallengeFromLessonConnections()` 生成 Daily Quest 的 `breadth-challenge`。
- Daily Quest 支持三种标题：
  - `今日术语挑战`
  - `今日人物挑战`
  - `今日 Benchmark 挑战`
- 挑战链接沿用详情页：
  - 术语：`/glossary?term=<slug>`
  - 人物或 Benchmark：`/radar?entity=<slug>`
- 完成态通过独立知识卡稳定 ID 判断：
- `glossary:<userId>:<slug>`
- `radar:<userId>:<slug>`
- 如果 `Lesson.connections` 同时有 glossary 和 radar，且 `knowledgeFocus.rotation.focus` 是 `person` 或 `benchmark`，Daily Quest 必须优先显示对应 Radar 挑战；周一术语日或没有可用 Radar 挑战时再显示术语挑战。

## Radar 关系卡片链

- `/radar` 详情页的 `关系卡片链` 使用 `buildRadarRelationGroups()` 生成四组卡片：
  - `相关实体`
  - `相关术语`
  - `相关论文`
  - `相关 Benchmark`
- 关系卡片必须是可点击卡片，而不是普通文本列表或单纯 badge。
- 链接规则：
  - `相关术语` → `/glossary?term=<slug>`
  - `相关实体`、`相关论文`、`相关 Benchmark` → `/radar?entity=<slug>`
- 关系匹配来源：
  - 当前实体的 `relatedTerms`
  - 当前实体的 `representativeWorks`
  - 候选实体的 `relatedTerms`
  - 候选实体的 `representativeWorks`
- 空组仍显示组标题和空态，避免用户误以为关系链模块缺失。

## Radar 展示标签

- `/radar` 类型筛选、实体列表和详情类型使用中文业务标签：
  - `person` → `人物`
  - `company` → `公司`
  - `lab` → `实验室`
  - `paper` → `论文`
  - `benchmark` → `Benchmark`
  - `tool` → `工具`
  - `open_source_project` → `开源项目`
- 实体详情可信度显示：
  - `high` → `可信度：高`
  - `medium` → `可信度：中`
  - `low` → `可信度：低`
  - 缺失或未知 → `可信度：待确认`
- 实体详情核验状态显示 `已核验` / `待核验`；核验日期显示为 `核验日期 YYYY-MM-DD`。
- 来源缺失时显示 `待核验：该实体暂无可核验来源。`，不把 `needs_verification` 直接展示给学习者。
- `/radar` 关系卡片链 badge 必须区分关系项来源：
  - `entity:` 关系项复用实体类型中文标签
  - `term:` 关系项复用术语分类中文标签
  - 不应把 `open_source_project`、`agent`、`retrieval` 等 raw 值直接展示给学习者

## Glossary 展示标签

- `/glossary` 分类筛选、术语结果列表、术语详情和 `/today` 今日术语分类 badge 使用 `formatGlossaryCategoryLabel()`：
  - `prompting` → `提示工程`
  - `agent` → `Agent`
  - `reasoning` → `推理`
  - `retrieval` → `检索增强`
  - `alignment` → `对齐`
  - `training` → `预训练`
  - `fine-tuning` → `微调`
  - `architecture` → `模型架构`
  - `benchmark` → `Benchmark`
  - 缺失或未知 → `术语分类`
- 该映射只用于读侧展示，不改变 `GlossaryTerm.category`、`category` query、排序、筛选、复习卡片 tag 或 seed 数据。

## Radar CTA 移动端触控目标

- `/radar` 检索输入复用 `radarSearchInputClassName = "min-h-11"`，让 `搜索 OpenAI / SWE-bench / Cursor` 满足 44px 触控高度。
- `/radar` 类型筛选复用 `radarTypeFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，保证 `全部` 和每个实体类型筛选入口在手机端满足 44px 触控高度，且不再依赖小尺寸 `Badge asChild` 链接模板。
- `/radar` 实体结果列表复用 `radarResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，保证每条可点击实体结果在手机端满足 44px 触控高度。
- `/radar` 关系卡片链可点击关系项复用 `radarRelationLinkClassName = "min-h-11 rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted/50"`，保证每个关系跳转卡片在手机端满足 44px 触控高度。
- `/radar` 实体详情来源外链复用 `radarSourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"`，保证资料来源外链在手机端满足 44px 触控高度。
- `/radar` 学习者主流程 CTA 复用 `radarCtaClassName = "min-h-11 w-full sm:w-auto"`：
  - 顶部 `去复习`
  - 筛选区 `搜索`
  - 关系卡片链 `去复习`
  - 详情底部 `生成复习卡片`
  - 详情底部 `复制详情入口`
- 关系卡片链 header 在手机端使用 `grid gap-2`，桌面端保留 `sm:flex sm:items-center sm:justify-between`。
- 详情底部生成复习卡片 action 区在手机端使用 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
- 该规则只约束 `/radar` 页面 CTA 可触控性，不改变 Radar 数据、关系卡片服务、复习卡片生成 action 或 Preview 写保护。

## Glossary CTA 移动端触控目标

- `/glossary` 检索输入复用 `glossarySearchInputClassName = "min-h-11"`，让 `搜索 CoT / RAG / SWE-bench` 满足 44px 触控高度。
- `/glossary` 分类筛选复用 `glossaryCategoryFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，保证 `全部` 和每个分类筛选入口在手机端满足 44px 触控高度，且不再依赖小尺寸 `Badge asChild` 链接模板。
- `/glossary` 术语结果列表复用 `glossaryResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，保证每条可点击术语结果在手机端满足 44px 触控高度。
- `/glossary` 相关术语链可点击术语入口复用 `glossaryRelatedTermLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"`，并让手机端关系链默认单列显示。
- `/glossary` 术语详情来源外链复用 `glossarySourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"`，保证资料来源外链在手机端满足 44px 触控高度。
- `/glossary` 学习者主流程 CTA 复用 `glossaryCtaClassName = "min-h-11 w-full sm:w-auto"`：
  - 顶部 `去复习`
  - 检索区 `搜索`
  - 相关术语链 `去复习`
  - 详情底部 `生成复习卡片`
  - 详情底部 `复制详情入口`
- 相关术语链 header 在手机端使用 `grid gap-2`，桌面端保留 `sm:flex sm:items-center sm:justify-between`。
- 详情底部生成复习卡片 action 区在手机端使用 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
- 该规则只约束 `/glossary` 页面 CTA 可触控性，不改变术语查询、复习卡片生成 action、Preview 写保护或数据库。

## Phase E 验证记录

- Glossary Category Label Localization 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `formatGlossaryCategoryLabel` 不存在；GREEN 后 20 项通过。
- Glossary Category Label Localization 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/today-activity-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 67 项通过。
- Glossary Category Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 432 项通过，Next 生产构建生成 28 个页面，路由表包含 `/glossary`、`/radar` 和 `/today`。
- Glossary Category Label Localization 覆盖范围：`/glossary` 分类筛选、术语结果列表、术语详情、Today 术语卡和 Radar 关系卡片链；不改变查询参数、卡片 tag、生成 action、Preview 写保护或数据库。
- Knowledge Source External Link Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/glossary` 缺少 `glossarySourceLinkClassName`，GREEN 后 17 项通过。
- Knowledge Source External Link Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 63 项通过。
- Knowledge Relation Link Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/glossary` 缺少 `glossaryRelatedTermLinkClassName`，GREEN 后 16 项通过。
- Knowledge Relation Link Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 57 项通过。
- Knowledge Result Link Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/glossary` 缺少 `glossaryResultLinkClassName`，GREEN 后 15 项通过。
- Knowledge Result Link Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过。
- Knowledge Result Link Mobile Touch Targets 覆盖扫描：`rg -n "Knowledge Result Link|glossaryResultLinkClassName|radarResultLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|术语列表每条|实体列表每条|0\\.293\\.0" ...` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入本切片。
- Knowledge Search Input Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/glossary` 和 `/radar` 缺少搜索输入专用 `min-h-11` class；GREEN 后 14 项通过。
- Knowledge Search Input Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过。
- Knowledge Search Input Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面，路由表包含 `/glossary` 和 `/radar`。
- Glossary CTA Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于缺少 `glossaryCtaClassName`、搜索 CTA、复习 CTA 和底部制卡/复制 CTA 的移动端大触控 class；GREEN 后 14 项通过。
- Glossary CTA Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过。
- Glossary CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Glossary CTA|glossaryCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" src/app/glossary/page.tsx tests/unit/knowledge-base.test.ts docs/ui-review-checklist.md helloagents/CHANGELOG.md helloagents/modules/knowledge-base-radar.md docs/aegis/work/2026-06-03-roky-learning-desire/20-checkpoint.md docs/aegis/work/2026-06-03-roky-learning-desire/90-evidence.md` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入 Glossary CTA 移动触控要求。
- Glossary CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/glossary`。
- Glossary Category Filter Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/glossary` 缺少 `glossaryCategoryFilterLinkClassName` 且分类筛选仍使用旧 `<Badge asChild>` 小触控模板；GREEN 后 18 项通过。
- Glossary Category Filter Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts` 51 项通过。
- Glossary Category Filter Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Glossary Category Filter|glossaryCategoryFilterLinkClassName|0\\.327\\.0|分类筛选入口|Badge asChild" ...` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入本切片。
- Glossary Category Filter Mobile Touch Targets 窄扫：`rg -n "<Badge asChild variant=\\{selectedCategory \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedCategory === c\\.category|inline-flex h-5 w-fit" src/app/glossary/page.tsx tests/unit/knowledge-base.test.ts` 无匹配，确认旧分类筛选小触控模板未回到生产源码或聚焦测试目标。
- Glossary Category Filter Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 423 项通过，Next 生产构建生成 28 个页面，路由表包含 `/glossary`。Aegis helper 仍失败于既有 Markdown-only 结构债，不是产品 UI 验证失败。
- Radar Type Filter Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` RED 首次失败于 `/radar` 缺少 `radarTypeFilterLinkClassName` 且类型筛选仍使用旧 `<Badge asChild>` 小触控模板；GREEN 后 19 项通过。
- Radar Type Filter Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 66 项通过。
- Radar Type Filter Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Radar Type Filter|radarTypeFilterLinkClassName|0\\.328\\.0|类型筛选入口|Badge asChild" ...` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入本切片。
- Radar Type Filter Mobile Touch Targets 窄扫：`rg -n "<Badge asChild variant=\\{selectedType \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedType === group\\.type|inline-flex h-5 w-fit" src/app/radar/page.tsx tests/unit/knowledge-base.test.ts` 无匹配，确认旧类型筛选小触控模板未回到生产源码或聚焦测试目标。
- Radar Type Filter Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 424 项通过，Next 生产构建生成 28 个页面，路由表包含 `/radar`。Aegis helper 仍失败于既有 Markdown-only 结构债，不是产品 UI 验证失败。
- Radar CTA Mobile Touch Targets 本地：`npm test -- tests/unit/knowledge-base.test.ts` 13 项通过。
- Radar CTA Mobile Touch Targets 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 50 项通过。
- Radar CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Radar CTA|radarCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" src/app/radar/page.tsx tests/unit/knowledge-base.test.ts docs/ui-review-checklist.md helloagents/CHANGELOG.md helloagents/modules/knowledge-base-radar.md docs/aegis/work/2026-06-03-roky-learning-desire/20-checkpoint.md docs/aegis/work/2026-06-03-roky-learning-desire/90-evidence.md` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入 Radar CTA 移动触控要求。
- Radar CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/radar`。

## Phase 10 验证记录

- Radar Visible Label Localization 本地：`npm test -- tests/unit/knowledge-base.test.ts` 12 项通过。
- Radar Visible Label Localization 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 46 项通过。
- Radar Visible Label Localization 覆盖扫描：`rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{entity\\.type\\}|\\{selectedEntity\\.type\\}|confidence \\{selectedEntity\\.confidence\\}|\\{verificationBadge\\}|verified \\{selectedEntity\\.lastVerifiedAt|needs_verification：|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatKnowledgeEntityTypeLabel\\(entity\\.type\\)|formatKnowledgeEntityTypeLabel\\(selectedEntity\\.type\\)|formatRadarConfidenceLabel\\(selectedEntity\\.confidence\\)|formatRadarVerificationLabel\\(verificationBadge\\)|可信度：高|已核验|待核验|核验日期|开源项目" src/app/radar/page.tsx src/app/_lib/home-labels.ts tests/unit/knowledge-base.test.ts` 确认旧 raw label 直出模板不存在。
- Radar Visible Label Localization 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/radar`。
- Glossary Category Label Localization 本地：`npm test -- tests/unit/knowledge-base.test.ts` 先 RED 后 GREEN，21 项通过，覆盖 `/glossary`、Today 术语卡和 `/radar` 关系链的术语分类 display helper。
- Glossary Difficulty Label Localization 本地：`npm test -- tests/unit/knowledge-base.test.ts` 先 RED 后 GREEN，21 项通过，覆盖 `formatGlossaryDifficultyLabel()` 和术语详情难度 badge。
- Glossary Difficulty Label Localization 回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/today-activity-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 68 项通过。
- Glossary Difficulty Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过，全量单测 433 项通过，Next 构建生成 28 个页面。

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

## 学习路径

- 当前路径由 `src/server/knowledge/paths.ts` 定义，不新增表结构。
- Glossary 路径：
  - Agent Path：`cot -> react -> reflexion -> agent -> swe-bench`
  - RAG Path：`embedding -> vector-database -> retriever -> reranker -> rag-evaluation`
  - LLM Training Path：`sft -> rlhf -> dpo -> alignment`
- Radar 路径：
  - AI Industry Path：`openai -> anthropic -> google-deepmind -> meta-ai -> mistral -> deepseek`
  - Benchmark Path：`humaneval -> swe-bench -> swe-agent -> tau-bench`
- `/glossary` 必须展示全部 `kind === "glossary"` 的 curated paths，不能截断导致 `LLM Training Path` 不可见。
- `/radar` 必须展示全部 `kind === "radar"` 的 curated paths，不能截断未来新增路径。
- 学习路径模块的模式徽章显示 `路径模式`，不显示 `Path Mode`。
- 路径进度通过稳定卡片 ID 计算：
  - `glossary:<userId>:<slug>`
  - `radar:<userId>:<slug>`
- `reviewCount > 0` 视为已复习，`hasCard` 视为已生成卡片。
- 学习路径卡指标文案必须对齐 guidance：`已看`、`已生成卡片`、`已复习`、`掌握`、`下一项`。
- 学习路径节点状态必须对齐 guidance 五态：`未看`、`已查看`、`已生成卡片`、`已复习`、`掌握`；`weak` 只作为内部排序/风险信号，不作为节点状态文案展示。

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
- `/radar` 详情页 UI 必须显示中文 `已核验` 或 `待核验`，不把 raw `verified` / `needs_verification` 直接展示给学习者。
- 来源为空时必须显示 `待核验：该实体暂无可核验来源。`
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
