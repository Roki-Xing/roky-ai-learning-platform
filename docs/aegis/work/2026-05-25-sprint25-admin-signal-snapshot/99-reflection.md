# Sprint 25 Reflection

## What Changed

- 新增 `src/server/curriculum/signal-snapshot.ts`，把 planner signal snapshot 从 `inputSnapshot` 中提取并转成管理端摘要。
- `/admin` 最近 CurriculumDecision 卡片现在展示 `Planner signal snapshot`：
  - 最近学习
  - 活跃误区
  - 错题压力
  - 到期复习
  - 困难复习
  - 地图薄弱
  - 代码练习
  - 完成覆盖
- 原始 `reason`、`scoreBreakdown` 和 `inputSnapshot` 仍保留在折叠区，便于深查。

## Verification Notes

- 目标测试覆盖了快照提取和摘要排序。
- `/admin` 对旧记录提供“暂无记录”空态，避免误导。
- 完整 lint/test/build 已通过。
- 生产备份和 rsync 同步已完成；远端目标测试、build、重启和 `/admin` 页面验收因 `118.89.119.107` SSH/HTTP 应用层不可观测待补。

## Follow-Up

- 后续可以把同一套摘要用于 `/today` 的“为什么今天学这个”详情展开。
- 后续可在 `/admin` 增加按 signal 过滤 CurriculumDecision 的能力。
- 运维后续需要先恢复 `118.89.119.107` 的 SSH banner 和 HTTP 响应，再继续 Sprint 25 生产门禁。
