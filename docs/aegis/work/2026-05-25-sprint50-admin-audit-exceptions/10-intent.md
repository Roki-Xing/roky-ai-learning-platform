# Sprint 50 Admin Audit Exceptions - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 1/2，把 Sprint 49 的单条计划审计链路升级为 `/admin` 自动异常发现。
- Goal: 管理端可以主动列出最近计划中的治理证据缺口，而不是只能手动点单条 plan 审计。
- Success evidence:
  - 新增 `buildAdminPlanAuditExceptions()` 服务层 helper。
  - helper 按当前 `userId` 和 plan filter 扫描最近计划，拒绝跨用户数据泄漏。
  - 异常覆盖缺 `generationJobId`、缺 linked `AiGenerationJob`、缺 `CurriculumDecisionLog`、topic/domain/schema mismatch。
  - 派生异常做根因去重，避免缺 decision/job 时重复制造噪音。
  - `/admin` 新增“计划审计异常”只读卡片，显示 scanned、异常计划数、fail/warn 和审计链路入口。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不改变 planner scoring。
  - 不改变 DeepSeek prompt 或生成逻辑。
  - 不新增数据库 migration。
  - 不自动修复或删除异常计划。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/admin/plan-audit.ts`
- `src/server/admin/plan-governance.ts`
- `src/server/admin/planner-visibility.ts`
- `src/app/admin/page.tsx`
- `tests/unit/admin-plan-audit-chain.test.ts`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 只增强 admin 读侧异常可见性；生成、选题、持久化、user scope、admin protection 和归档/激活动作保持原样。
- Affected layers:
  - `src/server/admin/plan-audit-exceptions.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-plan-audit-exceptions.test.ts`
  - docs/helloagents
- Invariants:
  - `/admin` 仍需要登录和 admin protection。
  - 所有审计读取必须按 `userId` scope。
  - 异常列表只读，不修改 DailyPlan。
  - 缺失证据显示为 warn/fail，不伪造。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
