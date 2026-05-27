# Sprint 52 Progress Learning State - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 7，把 `/progress` 从统计页推进到学习状态页。
- Goal: `/progress` 明确展示当前薄弱领域和复习留存趋势，让用户能看到错题、复习欠账、代码练习缺口和复习质量变化。
- Success evidence:
  - `src/server/analytics/progress.ts` 新增 `buildProgressWeakDomainSummary()`。
  - `src/server/analytics/progress.ts` 新增 `summarizeReviewRetentionTrend()`。
  - `/progress` 顶部分析面板新增“薄弱领域”和“复习留存趋势”。
  - 薄弱领域来自真实 DailyPlan、Flashcard、QuizAttempt、CodeSubmission、Misconception 信号。
  - 复习留存趋势按用户 `timeZone` 把 `ReviewLog.createdAt` 转成 `localDate` 后聚合。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改 `/map` masteryScore 公式。
  - 不改 DeepSeek 生成链路或 planner scoring。
  - 不执行用户提交的代码。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/progress/page.tsx`
- `src/app/progress/analytics-panels.tsx`
- `src/server/analytics/progress.ts`
- `tests/unit/progress-analytics.test.ts`
- `src/server/map/analytics.ts`
- `docs/aegis/work/2026-05-25-sprint51-map-insights/*`
- `helloagents/modules/learning-analytics.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只增强 `/progress` 的读侧状态面板；学习、复习、测验、代码提交、生成、planner 和 schema 保持原样。
- Affected layers:
  - `src/server/analytics/progress.ts`
  - `src/app/progress/analytics-panels.tsx`
  - `src/app/progress/page.tsx`
  - `tests/unit/progress-analytics.test.ts`
  - docs/helloagents
- Invariants:
  - 所有查询按当前 `userId` scoped。
  - 每日/趋势口径使用用户时区 localDate。
  - 独立 glossary/radar 卡片不混入领域弱项。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
