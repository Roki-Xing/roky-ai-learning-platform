# Sprint 19 Reflection

## What Changed

- 用户现在能在 `/settings` 配置每日术语偏好、Radar 偏好和知识卡去重天数。
- 每日知识选择会避开最近 N 天已经沉淀到 `Lesson.connections.glossary/breadth.sourceSlug` 的知识项。
- 生成每日计划时，用户偏好会优先于模板 hint，但仍受短期去重保护。

## Verification Notes

- RED 测试先证明旧实现会重复选择最近用过的 slug，并且没有可测试 settings 服务层。
- GREEN 后目标测试、相邻回归、全量测试、lint 和 build 均通过。

## Follow-Up

- 后续可以把“最近 7 天不要重复同一 topic/domain”的 planner 约束和知识实体去重统一显示到 `/admin` 的解释面板。
- 后续可以在 `/today` 展示“本次避开了哪些最近知识卡”的小型调试说明，仅限 admin/debug。
