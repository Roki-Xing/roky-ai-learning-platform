# Sprint 51 Map Insights - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖 map insight 摘要。
- [√] 新增 `buildKnowledgeMapInsights()`。
- [√] `/map` 顶部接入偏弱、复习欠账、代码练习少、下一步补哪里摘要卡。
- [√] 摘要卡链接到对应领域。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地切片已经完成并验证通过。
- 备用机 `118.25.15.72` 已部署并通过目标测试、构建、容器重启和 health 验收。
- 真实 DNS 仍指向 `118.89.119.107`，公网 `learn.roky.chat` 需 DNS 切换后再补验收。

## Drift Check

- 当前切片服务 Phase 6：让用户能一眼看到偏科方向和下一步补哪里。
- 未改知识地图 masteryScore 公式。
- 未改 planner scoring、DeepSeek prompt 或任何持久化 schema。
- 未新增迁移。
- Decision: continue。
