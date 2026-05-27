# Sprint 48 Admin Planner Input Visibility - Checkpoint

## Checklist

- [√] 审计 `/admin` planner 可见性现状。
- [√] 写 RED 测试覆盖 `AiGenerationJob.input.curriculum` 摘要。
- [√] 新增 `src/server/admin/planner-visibility.ts`。
- [√] `/admin` 最近 `AiGenerationJob` 查询包含 `input`。
- [√] `/admin` 最近 `AiGenerationJob` 卡片展示 `Planner input` 摘要。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## Drift Check

- 当前切片服务 Phase 1/2：让管理端能确认 DeepSeek 生成时实际消费了 planner decision 和 signal snapshot。
- 未改 DailyPlan、CurriculumDecisionLog 或 AiGenerationJob schema。
- 未改 planner scoring 或 DeepSeek prompt。
- 未新增迁移或持久化字段。
