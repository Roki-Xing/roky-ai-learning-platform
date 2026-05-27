# Sprint 42 Progress Generation Health - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 7，让 `/progress` 能展示生成质量是否稳定。
- Goal: 在学习进度页增加 DeepSeek/fallback/repair/schemaVersion/model 的生成健康指标，并为未来 repair 成功记录可统计 metadata。
- Success evidence:
  - 新增 `summarizeGenerationHealth()` 聚合函数。
  - `/progress` 读取当前用户正式 active DailyPlan 和 `daily_plan` AiGenerationJob。
  - `/progress` 展示 DeepSeek 计划数、fallback 计划数、fallback rate、job success/error、repair rate、schemaVersion 分布、model 分布。
  - DeepSeek repair 成功时在 `AiGenerationJob.output.meta` 写入 `repaired` 和 `repairReason`。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 migration。
  - 不改动 provider key 读取方式。
  - 不改变 DeepSeek prompt 或模型选择。
  - 不新增复杂图表，只做清晰指标卡。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/analytics/progress.ts`
- `src/app/progress/page.tsx`
- `src/app/progress/analytics-panels.tsx`
- `src/server/ai/generate-daily-plan.ts`
- `tests/unit/progress-analytics.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增统计和展示；既有生成、计划、复习、学习效果指标保持原行为。
- Affected layers:
  - `src/server/analytics/progress.ts`
  - `src/app/progress/analytics-panels.tsx`
  - `src/app/progress/page.tsx`
  - `src/server/ai/generate-daily-plan.ts`
  - `tests/unit/progress-analytics.test.ts`
  - docs/helloagents
- Invariants:
  - 所有 progress 查询按当前 `userId` scope。
  - 不显示 API key。
  - 不记录或展示 provider secret。
  - repair metadata 只记录状态和原因，不保存敏感信息。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
