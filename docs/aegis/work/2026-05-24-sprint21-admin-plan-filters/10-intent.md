# Sprint 21 Admin Plan Filters - Intent

## TaskIntentDraft

- Requested outcome: 继续长期文档 Data Governance，补齐 Sprint 20 reflection 中遗留的 admin plan filtering 与 activation history。
- Goal: `/admin` 最近 DailyPlan 列表可以按 active/test/archived/all 过滤，并能看到每个计划的 activation history。
- Success evidence:
  - `markPlanActive()` 写入 `admin_plan_activation` 审计事件。
  - `normalizeAdminPlanFilter()` 和 `buildAdminPlanFilterWhere()` 有测试覆盖。
  - `/admin?planFilter=test|archived|all|active` 可切换最近计划列表。
  - `/admin` 计划卡片展示 `Activation history`。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和 Host-header 验收通过。
- Stop condition: 上述证据满足，或生产部署/鉴权阻塞需要暂停。
- Non-goals:
  - 不新增数据库迁移。
  - 不删除历史计划。
  - 不绕过 `ADMIN_SECRET`。
  - 不改变 `/today` active plan 查询规则。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md`
- `docs/aegis/work/2026-05-24-sprint20-admin-plan-activation/99-reflection.md`
- `src/app/admin/page.tsx`
- `src/server/admin/plan-governance.ts`
- `tests/unit/admin-plan-governance.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 复用 `AiGenerationJob` 记录 admin 操作审计事件；不新增 schema。
- Affected layers:
  - `src/server/admin/plan-governance.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-plan-governance.test.ts`
  - docs/helloagents
- Invariants:
  - admin 页面未授权时仍只显示登录页。
  - admin action 仍必须先通过 `requireAdmin()`。
  - test/archived/active 过滤只在当前 userId 作用域内。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
