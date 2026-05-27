# Sprint 27 Library Governance Filters - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标中的 Phase 1 数据治理，让 `/library` 不只是课程列表，还能按 DailyPlan 治理字段筛选学习档案。
- Goal: `/library` 默认仍隐藏 test/archived plan，同时新增 `source`、`schemaVersion`、`status`、`localDate` 过滤，便于排查正式计划、测试计划、旧 schema 和不同生成来源。
- Success evidence:
  - 新增纯函数规范化 `/library` 查询参数。
  - 新增纯函数生成 DailyPlan where 条件，默认只查 active official plans。
  - 新增纯函数在课程选择链接中保留当前治理筛选。
  - `/library` 页面展示筛选表单和当前筛选 badge。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/library` Host-header 验收。
- Stop condition: 上述证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 `/today` plan 选择规则。
  - 不改变 admin plan activation 行为。
  - 不 hard delete 历史计划。
  - 不输出密钥或数据库连接串。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/library/page.tsx`
- `src/server/admin/plan-governance.ts`
- `prisma/schema.prisma`
- `tests/unit/admin-plan-governance.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只增加 `/library` 查询过滤和链接参数保留，不改变 DailyPlan schema 或 existing records。
- Affected layers:
  - `src/server/library/plan-filter.ts`
  - `src/app/library/page.tsx`
  - `tests/unit/library-plan-filter.test.ts`
  - docs/helloagents
- Invariants:
  - `/library` 默认隐藏 `isTest=true` 和 `archivedAt != null`。
  - 显示 test/archived 需要用户显式打开。
  - 选择课程时保留当前筛选上下文。
  - 课程详情仍按当前筛选范围选择关联 DailyPlan。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
