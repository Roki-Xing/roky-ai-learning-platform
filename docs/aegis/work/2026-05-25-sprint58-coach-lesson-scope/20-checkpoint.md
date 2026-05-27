# Sprint 58 Coach Lesson Scope - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖 Coach 显式 lesson 归属校验。
- [√] `buildCoachContext()` 显式不可见 lesson 直接拒绝。
- [√] 目标测试 GREEN。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地实现已完成。
- 本地门禁已通过：`npm run lint && npm test && npm run build`（149 tests 全绿）。
- 备用机已完成：备份、rsync、远端目标测试、远端构建、容器重启和 health 验收。
- 真实 DNS 仍需单独检查；若仍指向 `118.89.119.107`，只能声明备用机 `118.25.15.72` 已部署。

## Drift Check

- 当前切片服务 Phase 14：server actions 都检查 userId，并补强 Coach 显式 lesson 绑定边界。
- 未改 ThoughtReview schema。
- 未改 DeepSeek provider、prompt 或 fallback。
- 未新增 migration。
- Decision: continue。
