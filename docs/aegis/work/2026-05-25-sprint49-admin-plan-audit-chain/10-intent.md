# Sprint 49 Admin Plan Audit Chain - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 1/2，把 `/admin` 中分散的 DailyPlan、CurriculumDecisionLog 和 AiGenerationJob 证据串成单条审计链路。
- Goal: 管理端可以通过一个 planId 核对该计划的治理字段、课程、planner decision、generation job 和一致性检查。
- Success evidence:
  - 新增 `buildAdminPlanAuditChain()` 服务层 helper。
  - helper 按 `userId + planId` 读取计划，拒绝跨用户 planId。
  - helper 关联同 `userId + localDate + isTest` 的 `CurriculumDecisionLog`。
  - helper 通过 `DailyPlan.generationJobId` 关联 `AiGenerationJob`。
  - helper 返回 topic/domain/schema/job/decision 的一致性检查。
  - `/admin` 最近 DailyPlan 行新增“审计链路”入口。
  - `/admin?auditPlanId=...` 展示单条审计链路。
  - 原始 JSON 继续折叠展示，不改生成链路。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不改变 planner scoring。
  - 不改变 DeepSeek prompt 或生成逻辑。
  - 不新增数据库 migration。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `docs/aegis/plans/2026-05-25-admin-plan-audit-chain.md`
- `src/app/admin/page.tsx`
- `src/server/admin/plan-governance.ts`
- `src/server/admin/planner-visibility.ts`
- `src/server/curriculum/explain-decision.ts`
- `src/server/curriculum/signal-snapshot.ts`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 只增强 admin 读侧审计可见性；生成、选题、持久化、user scope 和 admin protection 保持原样。
- Affected layers:
  - `src/server/admin/plan-audit.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-plan-audit-chain.test.ts`
  - docs/helloagents
- Invariants:
  - `/admin` 仍需要登录和 admin protection。
  - 所有审计读取必须按 `userId` scope。
  - 缺失证据显示为 missing/warn/fail，不伪造。
  - 原始 JSON 默认折叠。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
