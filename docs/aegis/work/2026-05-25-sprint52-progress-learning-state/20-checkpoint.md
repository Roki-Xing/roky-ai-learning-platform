# Sprint 52 Progress Learning State - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖 progress weak domain summary。
- [√] 写 RED 测试覆盖 review retention trend。
- [√] 新增 `buildProgressWeakDomainSummary()`。
- [√] 新增 `summarizeReviewRetentionTrend()`。
- [√] `/progress` 顶部接入“薄弱领域”面板。
- [√] `/progress` 顶部接入“复习留存趋势”面板。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地切片已经完成并验证通过。
- 备用机 `118.25.15.72` 已部署并通过目标测试、构建、容器重启和 health 验收。
- 真实 DNS 仍指向 `118.89.119.107`，只能声明备用机 `118.25.15.72` 已部署。

## Drift Check

- 当前切片服务 Phase 7：让 `/progress` 能看到当前强弱领域、错题/代码/复习趋势和生成稳定性。
- 未改 `/map` 评分公式。
- 未改 planner scoring、DeepSeek prompt 或任何持久化 schema。
- 未新增迁移。
- Decision: continue。
