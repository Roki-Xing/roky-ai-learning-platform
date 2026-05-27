# Sprint 44 Reflection

## What Changed

- `/review` 不再在右侧展示“后续可切换 FSRS”的占位说明。
- 页面现在直接展示当前队列范围、到期数量和真实调度规则。
- `buildReviewScheduleSummary()` 把页面文案从散落 UI 收敛成可测试服务层口径。

## What Stayed Stable

- 评分间隔仍是 1 / 3 / 7 / 14 天。
- 主动回忆流程仍是先显示 front，再显示答案，再评分。
- 项目队列和 code-feedback 聚焦队列保持原行为。
- 没有新增数据库结构。

## Follow-up

- 未来若接入 FSRS，应先新增算法选项和迁移计划，再让 `buildReviewScheduleSummary()` 显示当前启用策略。
