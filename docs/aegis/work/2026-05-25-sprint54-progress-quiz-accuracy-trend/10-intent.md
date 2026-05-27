# Sprint 54 Progress Quiz Accuracy Trend - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 7，把 `/progress` 的学习效果趋势补齐到测验正确率维度。
- Goal: `/progress` 顶部直接展示测验正确率趋势，用户能看到每天答题数、正确数和正确率。
- Success evidence:
  - `src/server/analytics/progress.ts` 新增 `summarizeQuizAccuracyTrend()`。
  - `tests/unit/progress-analytics.test.ts` 覆盖按 localDate 聚合 attempts/correct/accuracy。
  - `/progress` 顶部分析面板新增“测验正确率趋势”。
  - `/progress` 从当前用户 official lesson 下的 `QuizAttempt` 读取趋势数据。
  - `QuizAttempt.createdAt` 按用户 `timeZone` 转换为 localDate。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改变 QuizAttempt 写入逻辑。
  - 不改 DeepSeek 生成链路或 planner scoring。
  - 不执行用户提交的代码。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/progress/page.tsx`
- `src/app/progress/analytics-panels.tsx`
- `src/server/analytics/progress.ts`
- `tests/unit/progress-analytics.test.ts`
- `docs/aegis/work/2026-05-25-sprint53-progress-misconception-trend/*`
- `helloagents/modules/learning-analytics.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只增强 `/progress` 的读侧趋势面板；学习、复习、测验提交、代码提交、生成、planner 和 schema 保持原样。
- Affected layers:
  - `src/server/analytics/progress.ts`
  - `src/app/progress/analytics-panels.tsx`
  - `src/app/progress/page.tsx`
  - `tests/unit/progress-analytics.test.ts`
  - docs/helloagents
- Invariants:
  - 所有查询按当前 `userId` scoped。
  - 趋势日期使用用户时区 localDate。
  - 不执行用户代码。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
