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

## 约束

- 不改变 `/map` 的 masteryScore 公式。
- 不新增数据库迁移。
- 不跨用户聚合学习信号。
- 不把 `/map` 的弱点摘要作为 Planner 的唯一依据；Planner 仍使用自己的 scoring input。

## 验证

- `tests/unit/map-analytics.test.ts` 覆盖 masteryScore 公式、0-100 截断、多信号聚合和 map insights。
- Sprint 51 本地：`npm run lint`、`npm test`、`npm run build` 通过。
