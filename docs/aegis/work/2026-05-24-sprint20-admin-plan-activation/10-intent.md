# Sprint 20 Admin Plan Activation - Intent

## TaskIntentDraft

- Requested outcome: 补齐长期文档 Data Governance 中的 “Mark selected plan as active” 管理能力。
- Goal: `/admin` 的最近 DailyPlan 列表可以把指定计划设为正式 active plan；同一 user/localDate 的旧正式 active plan 会被归档，保持同日只有一个正式 active DailyPlan。
- Success evidence:
  - `markPlanActive()` 服务层可测试。
  - 选中的 test/archived plan 可变成 `isTest=false`、`archivedAt=null`、`source=admin`。
  - 同一 user/localDate 其他正式 active plan 会被归档。
  - 越权 planId 会被拒绝。
  - `/admin` 最近 DailyPlan 列表提供“设为 active”按钮。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和 Host-header 验收通过。
- Stop condition: 上述证据满足，或生产部署/鉴权阻塞需要暂停。
- Non-goals:
  - 不绕过 `ADMIN_SECRET`。
  - 不删除历史计划，只归档。
  - 不改变 `/today` 当前 active plan 查询规则。
  - 不新增数据库字段。
- Scope: admin plan governance service, admin Server Action, admin UI, tests, docs, production deployment。
- Change kinds:
  - feature
  - governance

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Data Governance。
- `src/app/admin/page.tsx`
- `src/app/admin/actions.ts`
- `src/server/admin/auth.ts`
- `src/server/lesson/daily-plan.ts`
- `tests/unit/daily-plan-idempotency.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 复用已有 `DailyPlan.isTest`、`DailyPlan.archivedAt`、`DailyPlan.source` 和 `DailyPlan.selectionReason`。
- Affected layers:
  - `src/server/admin/plan-governance.ts`
  - `src/app/admin/actions.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-plan-governance.test.ts`
  - docs/helloagents
- Owners:
  - `markPlanActive()` 负责事务内归档旧正式计划和激活选中计划。
  - `markPlanActiveAction()` 负责 admin 鉴权和页面 revalidate。
- Invariants:
  - 只允许当前 userId 的 plan 被激活。
  - 不 hard delete 数据。
  - 同一 user/localDate 只保留一个 `isTest=false && archivedAt=null`。
  - admin action 必须先 `requireAdmin()`。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
