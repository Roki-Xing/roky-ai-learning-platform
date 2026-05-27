# Sprint 58 Coach Lesson Scope - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 14 Auth 与多用户完善，补强 Coach 文本评审时的显式 lesson 归属校验。
- Goal: 用户创建 ThoughtReview 时，如果表单显式传入 `lessonId`，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝，避免静默回退或错误关联。
- Success evidence:
  - `buildCoachContext()` 对显式不可见 `lessonId` 抛出 `Lesson not available for coach`。
  - 未传入 `lessonId` 时仍可根据 `includeTodayLesson` 使用当前用户今日课程。
  - `tests/unit/coach-submit.test.ts` 覆盖 cross-user explicit lesson 拒绝。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改变 ThoughtReview schema。
  - 不改变 Coach prompt、DeepSeek provider 或 fallback 逻辑。
  - 不改变 VoiceNote 进入 Coach 的既有流程。
  - 不记录任何 API key、数据库连接串或 secret。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/coach/context.ts`
- `src/server/coach/submit.ts`
- `tests/unit/coach-submit.test.ts`
- `helloagents/modules/coach.md`
- `helloagents/modules/auth-demo-mode.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只收紧 Coach context 显式 `lessonId` 的 owner 检查；无显式 lesson 的 today lesson 逻辑保持。
- Affected layers:
  - `src/server/coach/context.ts`
  - `tests/unit/coach-submit.test.ts`
  - docs/helloagents
- Invariants:
  - ThoughtReview 写入按当前 `userId` scoped。
  - 显式绑定 lesson 必须来自当前用户正式、未归档、非测试 DailyPlan。
  - Coach 不执行用户代码。
  - 不暴露 secret。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
