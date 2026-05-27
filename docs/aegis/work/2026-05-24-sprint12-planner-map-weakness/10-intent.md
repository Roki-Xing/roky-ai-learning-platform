# Sprint 12: Planner Map Weakness

## 目标

让 Curriculum Planner 消费 `/map` 的弱点信号，实现“知识地图发现薄弱领域 -> 下一课优先补弱”。

## 范围

- `scoreTopicCandidates()` 支持 `mapWeaknessByDomain`。
- `selectNextTopic()` 从已有学习数据构造 map weakness 信号。
- `scoreBreakdown` 暴露 `mapWeaknessScore`，让 Admin/CurriculumDecisionLog 能解释为什么选这个主题。

## 非目标

- 不改变 DeepSeek 生成 schema。
- 不改变 `/map` 页面 UI。
- 不新增持久化模型。

## 验收

- 单元测试证明 map weakness 可以推动薄弱领域排名上升。
- `npm test`、`npm run lint`、`npm run build` 通过。
- 生产构建和 health check 通过。
