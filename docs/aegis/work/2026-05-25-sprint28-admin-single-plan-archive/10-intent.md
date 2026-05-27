# Sprint 28 Admin Single Plan Archive - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标中的 Phase 1 数据治理，让 `/admin` 可以对单个 DailyPlan 做治理性归档，而不是只能批量归档 test/future planned plans。
- Goal: 新增 user-scoped 单计划归档服务、Server Action 和 `/admin` 按钮，归档使用 `archivedAt`，并写入审计事件。
- Success evidence:
  - `markPlanArchived()` 只能归档当前 user 的 DailyPlan。
  - 单计划归档只设置 `archivedAt`，不删除历史记录。
  - 单计划归档写入 `AiGenerationJob(type="admin_plan_archive")`。
  - `/admin` 最近 DailyPlan 列表出现“归档”按钮，已归档计划禁用。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/admin` Host-header 验收。
- Stop condition: 上述证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不 hard delete DailyPlan。
  - 不新增数据库迁移。
  - 不改变 `/today` active plan 查询规则。
  - 不改变 `markPlanActive()` 逻辑。
  - 不输出密钥或数据库连接串。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/admin/plan-governance.ts`
- `src/app/admin/actions.ts`
- `src/app/admin/page.tsx`
- `tests/unit/admin-plan-governance.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增单计划归档治理动作，不改变现有 bulk archive 和 activation 行为。
- Affected layers:
  - `src/server/admin/plan-governance.ts`
  - `src/app/admin/actions.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-plan-governance.test.ts`
  - docs/helloagents
- Invariants:
  - 所有 admin action 仍受 `requireAdmin()` 保护。
  - 所有计划操作必须按 `userId` scope。
  - 归档保留历史数据，不删除 lesson、quiz、cards 或 jobs。
  - 归档操作写审计事件，方便生产排查。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
