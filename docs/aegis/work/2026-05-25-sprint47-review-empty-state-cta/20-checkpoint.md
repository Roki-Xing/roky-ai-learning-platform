# Sprint 47 Review Empty State CTA - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖默认队列空状态。
- [√] 写 RED 测试覆盖 project focused queue 空状态。
- [√] 写 RED 测试覆盖 code-feedback focused queue 空状态。
- [√] 新增 `src/server/review/empty-state.ts`。
- [√] `/review` 空队列状态展示标题、说明和 CTA。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。

## Drift Check

- 当前切片服务 Phase 0 第 8 条：`/review 没有到期卡时，有明确下一步建议`。
- 未改复习评分和 dueAt 更新规则。
- 未改 project/code-feedback focused queue 契约。
- 未新增迁移或持久化字段。
