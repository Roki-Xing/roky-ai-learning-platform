# Sprint 27 Reflection

## What Changed

- 新增 `src/server/library/plan-filter.ts`：
  - `normalizeLibraryPlanFilters()`
  - `buildLibraryPlanWhere()`
  - `buildLibraryPlanHref()`
- `/library` 默认仍隐藏 test 和 archived plan。
- `/library` 新增治理筛选：
  - `source`
  - `schemaVersion`
  - `status`
  - `localDate`
- 课程列表链接会保留当前筛选条件，避免查看详情时丢失治理上下文。

## Verification Notes

- 目标测试覆盖默认 active official 条件、治理字段 where 和链接参数保留。
- 完整 lint/test/build 已通过。
- 没有新增 migration。
- 生产验收因 `118.89.119.107` SSH/HTTP 应用层不可观测待补。

## Follow-Up

- 生产恢复后补 `/library` Host-header 验收，确认筛选控件可见。
- 后续可在 `/admin` 与 `/library` 之间共享更多治理字段展示口径。
