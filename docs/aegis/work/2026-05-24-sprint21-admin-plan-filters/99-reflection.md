# Sprint 21 Reflection

## What Changed

- `/admin` 最近 DailyPlan 列表新增 `active/test/archived/all` 过滤。
- `markPlanActive()` 现在写入 `AiGenerationJob(type="admin_plan_activation")`，用于计划激活历史追踪。
- `/admin` 每个计划卡片展示 `Activation history`，能看到该计划是否被 admin 激活过。

## Verification Notes

- 服务层测试覆盖 activation audit event、filter normalize 和 filter where 条件。
- 本地全量测试、lint、build 均通过。

## Follow-Up

- 后续可把 activation history 从 `AiGenerationJob` 升级为独立 `AdminAuditLog`，前提是需要更细粒度审计维度。
