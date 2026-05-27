# Sprint 26 Reflection

## What Changed

- `src/server/curriculum/signal-snapshot.ts` 新增 `buildTodayCurriculumSignalInsight()`。
- `/today` 的“为什么今天学这个”现在读取 `CurriculumDecisionLog.inputSnapshot`，并展示 `Planner 信号快照`：
  - 最近学习
  - 活跃误区
  - 错题压力
  - 到期复习
  - 困难复习
  - 地图薄弱
  - 代码练习
  - 完成覆盖
- `/today` 仍保留原有 `scoreBreakdown` 主理由和活跃信号，不暴露原始 JSON。

## Verification Notes

- 目标测试覆盖了 learner-facing insight 的提取、排序和摘要文本。
- 没有新增 migration。
- 没有新增外部 AI 调用。
- 完整 lint/test/build 已通过。
- 生产验收因 `118.89.119.107` SSH/HTTP 应用层不可观测待补。

## Follow-Up

- 生产恢复后补 `/today` Host-header 验收，确认页面包含 `Planner 信号快照`。
- 后续可把同一套 insight 用于 `/progress` 的“下一步为什么推荐这里”。
