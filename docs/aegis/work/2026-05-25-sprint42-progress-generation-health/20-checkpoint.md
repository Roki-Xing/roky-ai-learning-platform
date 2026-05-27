# Sprint 42 Checkpoint

## Scope

- 增加 `/progress` 生成稳定性指标。
- 给 DeepSeek repair 成功路径写入可统计 metadata。
- 扩展 progress analytics 单元测试。

## Key Decisions

- 生成健康统计以 `DailyPlan.source/schemaVersion` 作为用户可见结果口径。
- `AiGenerationJob` 用于补充 provider job 成功/失败、repair 和 model 分布。
- 旧数据如果缺少 repair metadata，仅通过历史 `rawPrimary` 字段做保守识别。
- 不新增 migration，避免扩大风险面。

## Expected Checks

- `npm test -- tests/unit/progress-analytics.test.ts`
- `npm run lint`
- `npm test`
- `npm run build`

## DriftCheckDraft

- Current work still serves Phase 7 `/progress` enhanced analytics.
- Compatibility boundary unchanged: stats/display only plus non-sensitive repair metadata.
- No new provider, fallback, or schema owner introduced.
- Decision: continue.
