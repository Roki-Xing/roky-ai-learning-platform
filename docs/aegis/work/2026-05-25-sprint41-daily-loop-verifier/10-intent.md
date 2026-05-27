# Sprint 41 Daily Loop Verifier - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 0，把每日学习闭环从“散落功能可用”升级为“可一键验收”。
- Goal: 用服务层 verifier 覆盖 `/today -> 学习 -> 提交测验 -> 提交代码 -> 完成 -> /review -> /progress` 的核心数据链路。
- Success evidence:
  - 新增 `runDailyLoopVerification()` 服务函数。
  - 新增 `tests/unit/daily-usability-loop.test.ts`，真实调用现有服务而不是 mock。
  - 新增 `scripts/verify-daily-loop.ts` 和 `npm run verify:daily-loop`。
  - verifier 断言正式 active DailyPlan、guidedProgress、QuizAttempt、CodeSubmission、CodeFeedback、completed plan、due review cards、ReviewLog 和 progress 核心计数。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、verifier、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增浏览器 Playwright 依赖。
  - 不执行用户提交代码。
  - 不新增 migration。
  - 不改动 DeepSeek provider 或生成 prompt。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/lesson/daily-plan.ts`
- `src/server/lesson/guided-progress.ts`
- `src/server/quiz/submit.ts`
- `src/server/coding/submit.ts`
- `src/server/review/queue.ts`
- `src/server/review/actions.ts`
- `src/app/progress/page.tsx`
- `tests/unit/daily-plan-idempotency.test.ts`
- `tests/unit/quiz-submit.test.ts`
- `tests/unit/code-submit.test.ts`
- `tests/unit/review-rating.test.ts`
- `tests/unit/progress-analytics.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增可重复验收入口；既有页面、server action 和 schema 保持原行为。
- Affected layers:
  - `src/server/verification/daily-loop.ts`
  - `scripts/verify-daily-loop.ts`
  - `tests/unit/daily-usability-loop.test.ts`
  - `package.json`
  - docs/helloagents
- Invariants:
  - verifier 使用正式 active plan，以覆盖真实用户路径。
  - verifier userId 使用 `loop-verifier-*` 前缀，避免污染 demo-user。
  - verifier 不删除任何生产数据。
  - verifier 只保存代码文本和 AI 文本反馈，不执行用户代码。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
