# Sprint 40 Cron Retry - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 13 Cron 与提醒，补齐 `/admin` 可对失败 cron 记录手动 retry 的能力。
- Goal: 失败的 `cron_daily_plan` job 能按当前 `userId` scope 定向重试，并复用 daily cron 的 localDate 幂等生成逻辑。
- Success evidence:
  - 新增 `retryFailedDailyCronJob()` 服务函数。
  - 只能重试当前用户自己的 `type="cron_daily_plan"` 且 `status="failed"` 的 `AiGenerationJob`。
  - retry 使用失败 job input 里的 `now`，保证重试同一个用户 localDate。
  - retry 复用 `runDailyCronForUsers({ userIds: [userId] })`，不重复创建同日 active plan。
  - `/admin` 最近 Daily Cron 的失败记录显示“重试此用户 cron”按钮。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增提醒渠道。
  - 不新增 migration。
  - 不改变 cron route secret 校验。
  - 不支持跨用户 retry。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/cron/daily.ts`
- `src/app/admin/actions.ts`
- `src/app/admin/page.tsx`
- `tests/unit/cron-daily.test.ts`
- `helloagents/modules/daily-cron.md`

## ImpactStatementDraft

- Compatibility boundary: 只新增失败 cron job 的定向 retry 能力；cron route、secret、daily plan 生成和 admin auth 保持原行为。
- Affected layers:
  - `src/server/cron/daily.ts`
  - `src/app/admin/actions.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/cron-daily.test.ts`
  - docs/helloagents
- Invariants:
  - cron retry 必须按当前 `userId` scope。
  - successful job 不能被 retry。
  - 其他用户 job 不能被当前用户 retry。
  - retry 不能绕过现有 `getOrCreateTodayPlan()` 幂等保护。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
