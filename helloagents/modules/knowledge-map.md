# Knowledge Map

## 当前行为

- `/map` 使用真实学习信号展示领域、主题和领域详情。
- `src/server/map/analytics.ts` 负责聚合知识地图指标。
- 领域和主题指标包含：
  - `completedLessons`
  - `plannedLessons`
  - `flashcardCount`
  - `dueFlashcardCount`
  - `reviewedCardCount`
  - `reviewLogCount`
  - `quizAttemptCount`
  - `quizAccuracy`
  - `codeSubmissionCount`
  - `misconceptionCount`
  - `activeMisconceptionCount`
  - `lastStudiedLocalDate`
  - `masteryScore`
- masteryScore 公式保持目标文档定义：
  - 完成课程 * 10
  - ReviewLog * 2
  - 正确测验 * 3
  - 代码提交 * 3
  - 到期卡片 * -1
  - 活跃错题 * -5
  - 结果截断在 0-100。
- `/map` 右侧领域详情展示相关课程、相关卡片、相关错题和相关笔记。
- `/map` 学习者可见标签使用展示层 helper：
  - Radar 类型分布显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目`。
  - 相关课程显示 `已完成` / `待完成` 和 `AI 生成` / `模板兜底` 等状态、来源标签。
  - 相关卡片显示 `概念卡`、`代码反馈卡`、`错题卡`、`术语卡` 等类型标签。
  - 相关错题显示 `未解决`、`已解决`、`已忽略`。
  - 掌握度文案统一为 `掌握分`，不直接显示英文 `score` 或 `masteryScore`。
  - 领域详情复习日志显示 `复习记录：N`，掌握分说明使用 `复习记录 * 2`，不把 `ReviewLog` 作为学习者可见文案。

## Sprint 51 强弱领域摘要

- `buildKnowledgeMapInsights()` 从领域指标生成：
  - `weakDomains`
  - `reviewDebtDomains`
  - `codeLightDomains`
  - `nextFocus`
  - `summaryCards`
- `/map` 顶部新增 4 张摘要卡：
  - 偏弱领域
  - 复习欠账
  - 代码练习少
  - 下一步补哪里
- 摘要卡只使用当前用户的真实学习数据，不调用外部 AI。
- 摘要卡可以直接跳转到对应领域详情。
- 领域列表每条领域入口复用 `mapDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，手机端满足 44px 触控高度。
- 领域列表入口触控样式不改变 `buildVisibleKnowledgeMapTopics()` 的首屏窗口、当前领域保留逻辑、领域排序或领域统计口径。
- 摘要卡的 `查看领域` 和 disabled `暂无信号` CTA 复用 `mapSummaryCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
- 摘要 CTA 触控样式不改变 `buildKnowledgeMapInsights()` 的摘要排序、弱点理由或统计口径。
- 领域详情底部 `生成下一节` CTA 复用 `mapPageCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
- `生成下一节` CTA 触控样式不改变 Knowledge Map 统计、下一步建议或 `/today` 生成逻辑。
- 领域详情底部 `下一步建议` 里的 `优先补` 领域链接复用 `mapNextFocusLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2"`，手机端满足 44px 触控高度。
- `优先补` 链接触控样式不改变 `buildKnowledgeMapInsights()` 的 next focus 排序、原因文案或领域路由参数。
- 领域详情 `相关课程` 每条课程入口复用 `mapRelatedLessonLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"`，手机端满足 44px 触控高度。
- `相关课程` 入口触控样式不改变 Knowledge Map 统计、DailyPlan 查询、状态/来源标签、课程库路由参数或 `/today` 生成逻辑。

## 约束

- 不改变 `/map` 的 masteryScore 公式。
- 不新增数据库迁移。
- 不跨用户聚合学习信号。
- 不把 `/map` 的弱点摘要作为 Planner 的唯一依据；Planner 仍使用自己的 scoring input。

## 验证

- `tests/unit/map-analytics.test.ts` 覆盖 masteryScore 公式、0-100 截断、多信号聚合和 map insights。
- Sprint 51 本地：`npm run lint`、`npm test`、`npm run build` 通过。
- Phase 10 Knowledge Map Label Localization 本地：`npm test -- tests/unit/map-analytics.test.ts` 8 项通过。
- Phase 10 Knowledge Map Label Localization 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过。
- Phase 10 Knowledge Map Label Localization 覆盖扫描：`rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{plan\\.localDate\\} / \\{plan\\.status\\} / \\{plan\\.source \\?\\? \\\"unknown\\\"\\}|\\{card\\.type\\}|\\{item\\.status\\} x\\{item\\.occurrenceCount\\}|score \\{stat\\.masteryScore\\}|masteryScore =|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatHomeDailyPlanStatusLabel\\(plan\\.status\\)|formatTodayPlanSourceLabel\\(plan\\.source\\)|formatFlashcardTypeLabel\\(card\\.type\\)|formatMapMisconceptionStatusLabel\\(item\\.status\\)|掌握分|代码反馈卡|错题卡|开源项目|未解决|已解决" src/app/map/page.tsx src/app/_lib/home-labels.ts tests/unit/map-analytics.test.ts` 确认旧 raw label 直出模板不存在。
- Phase 10 Knowledge Map Label Localization 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/map`。
- Phase E Knowledge Map Summary CTA Mobile Touch Targets 本地：`npm test -- tests/unit/map-analytics.test.ts` 9 项通过。
- Phase E Knowledge Map Summary CTA Mobile Touch Targets 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 51 项通过。
- Phase E Knowledge Map Summary CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Knowledge Map Summary CTA|mapSummaryCtaClassName|查看领域|暂无信号|min-h-11 w-full sm:w-auto" src/app/map/page.tsx tests/unit/map-analytics.test.ts docs/ui-review-checklist.md helloagents/CHANGELOG.md helloagents/modules/knowledge-map.md docs/aegis/work/2026-06-03-roky-learning-desire/20-checkpoint.md docs/aegis/work/2026-06-03-roky-learning-desire/90-evidence.md` 通过。
- Phase E Knowledge Map Summary CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/map`。
- Phase E Knowledge Map Next Lesson CTA Mobile Touch Targets 本地：`npm test -- tests/unit/map-analytics.test.ts` RED 首次失败于 `/map` 缺少 `mapPageCtaClassName`，且 `生成下一节` 未接入移动端大触控 class；GREEN 后 10 项通过。
- Phase E Knowledge Map Next Lesson CTA Mobile Touch Targets 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过。
- Phase E Knowledge Map Next Lesson CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Knowledge Map Next Lesson|mapPageCtaClassName|生成下一节|min-h-11 w-full sm:w-auto|Knowledge Map Next Lesson CTA Mobile Touch Targets" src/app/map/page.tsx tests/unit/map-analytics.test.ts docs/ui-review-checklist.md helloagents/CHANGELOG.md helloagents/modules/knowledge-map.md docs/aegis/work/2026-06-03-roky-learning-desire/20-checkpoint.md docs/aegis/work/2026-06-03-roky-learning-desire/90-evidence.md` 通过。
- Phase E Knowledge Map Next Lesson CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 343 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/map` 和 `/today`。
- Phase E Knowledge Map Related Lesson Link Mobile Touch Targets 本地：`npm test -- tests/unit/map-analytics.test.ts` RED 首次失败于 `/map` 缺少 `mapRelatedLessonLinkClassName`，且领域详情 `相关课程` Link 仍使用旧小触控模板；GREEN 后 11 项通过。
- Phase E Knowledge Map Related Lesson Link Mobile Touch Targets 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts` 64 项通过。
- Phase E Knowledge Map Related Lesson Link Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Knowledge Map Related Lesson|mapRelatedLessonLinkClassName|相关课程|领域详情.*相关课程|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.296\\.0" src/app/map/page.tsx tests/unit/map-analytics.test.ts docs/ui-review-checklist.md helloagents/CHANGELOG.md helloagents/modules/knowledge-map.md docs/aegis/work/2026-06-03-roky-learning-desire/20-checkpoint.md docs/aegis/work/2026-06-03-roky-learning-desire/90-evidence.md` 通过。
- Phase E Knowledge Map ReviewLog Copy Localization 本地：`npm test -- tests/unit/map-analytics.test.ts` RED 首次失败于 `/map` 领域详情仍显示 `ReviewLog：{stat.reviewLogCount}`；GREEN 后 12 项通过。
- Phase E Knowledge Map ReviewLog Copy Localization 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 85 项通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 复习记录文案。
- Phase E Knowledge Map ReviewLog Copy Localization 覆盖扫描：`rg -n "Phase E Knowledge Map ReviewLog|复习记录：\\{stat\\.reviewLogCount\\}|ReviewLog：\\{stat\\.reviewLogCount\\}|掌握分 = 完成课程 \\* 10 \\+ 复习记录 \\* 2|掌握分 = 完成课程 \\* 10 \\+ ReviewLog \\* 2|0\\.308\\.0" ...` 确认源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入本切片。
- Phase E Knowledge Map ReviewLog Copy Localization 收尾：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 404 项通过，Next 生产构建生成 28 个页面，路由表包含 `/map`。
- Phase E Knowledge Map Domain Link Mobile Touch Targets 本地：`npm test -- tests/unit/map-analytics.test.ts` RED 首次失败于 `/map` 缺少 `mapDomainLinkClassName`，且领域列表 Link 仍使用旧小触控 inline class；GREEN 后 13 项通过。
- Phase E Knowledge Map Domain Link Mobile Touch Targets 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 86 项通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 回归。
- Phase E Knowledge Map Next Focus Link Mobile Touch Targets 本地：`npm test -- tests/unit/map-analytics.test.ts` RED 首次失败于 `/map` 缺少 `mapNextFocusLinkClassName`，且 `优先补` 领域链接仍使用旧小触控 inline class；GREEN 后 14 项通过。
- Phase E Knowledge Map Next Focus Link Mobile Touch Targets 回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 88 项通过，覆盖 Knowledge Map、首页标签、Today、Glossary/Radar、共享学习 UI 和 Progress。
