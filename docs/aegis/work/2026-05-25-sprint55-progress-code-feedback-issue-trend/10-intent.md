# Sprint 55 Progress Code Feedback Issue Trend - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 7，把 `/progress` 的代码练习趋势扩展到代码反馈问题趋势。
- Goal: `/progress` 顶部直接展示代码反馈问题趋势，用户能看到每日反馈次数、问题数、高/中/低严重度数量和高频问题类型。
- Success evidence:
  - `src/server/analytics/progress.ts` 新增 `summarizeCodeFeedbackIssueTrend()`。
  - `tests/unit/progress-analytics.test.ts` 覆盖按 localDate 聚合 feedbackCount/issueCount/high/medium/low/topIssueType。
  - `/progress` 顶部分析面板新增“代码反馈问题趋势”。
  - `/progress` 从当前用户 `CodeFeedback` 读取 `localDate` 和 `issues`。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改变 CodeSubmission 或 CodeFeedback 写入逻辑。
  - 不执行用户提交的代码。
  - 不改 DeepSeek 生成链路或 planner scoring。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/progress/page.tsx`
- `src/app/progress/analytics-panels.tsx`
- `src/server/analytics/progress.ts`
- `src/server/coding/view.ts`
- `tests/unit/progress-analytics.test.ts`
- `docs/aegis/work/2026-05-25-sprint54-progress-quiz-accuracy-trend/*`
- `helloagents/modules/learning-analytics.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只增强 `/progress` 的读侧趋势面板；代码提交、代码反馈生成、错题沉淀、复习卡片、生成、planner 和 schema 保持原样。
- Affected layers:
  - `src/server/analytics/progress.ts`
  - `src/app/progress/analytics-panels.tsx`
  - `src/app/progress/page.tsx`
  - `tests/unit/progress-analytics.test.ts`
  - docs/helloagents
- Invariants:
  - 所有查询按当前 `userId` scoped。
  - 趋势日期使用 `CodeFeedback.localDate`。
  - 不执行用户代码。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
