# Sprint 54 Progress Quiz Accuracy Trend - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖 quiz accuracy trend。
- [√] 新增 `summarizeQuizAccuracyTrend()`。
- [√] `/progress` 顶部接入“测验正确率趋势”面板。
- [√] 页面查询当前用户 official lesson 下的 QuizAttempt 并按用户时区转 localDate。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地切片已经完成并验证通过。
- 备用机 `118.25.15.72` 已完成备份、rsync、远端目标测试、远端构建、容器重启和 health 验收。
- 真实 DNS 仍指向 `118.89.119.107`，只能声明备用机 `118.25.15.72` 已部署。

## Drift Check

- 当前切片服务 Phase 7：让 `/progress` 能看到测验正确率趋势。
- 未改 QuizAttempt 写入行为。
- 未改 planner scoring、DeepSeek prompt 或任何持久化 schema。
- 未新增迁移。
- Decision: needs-dns-cutover-for-public-domain。
