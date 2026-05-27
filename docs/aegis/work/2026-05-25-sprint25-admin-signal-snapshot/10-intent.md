# Sprint 25 Admin Signal Snapshot - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标，把 Sprint 24 已保存的 Planner signal snapshot 变成 `/admin` 可读审计信息。
- Goal: 在 `/admin` 最近 CurriculumDecision 卡片中展示 Planner signal snapshot 摘要，帮助判断“为什么今天选这个主题”。
- Success evidence:
  - 新增纯函数可从 `CurriculumDecisionLog.inputSnapshot.decision.signalSnapshot` 提取快照。
  - 新增纯函数可把快照转成管理端摘要项：活跃误区、错题压力、到期复习、困难复习、地图薄弱、代码练习、完成覆盖。
  - `/admin` 查询 `inputSnapshot` 并展示 `Planner signal snapshot` 摘要。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和 `/admin` Host-header 验收通过。
- Stop condition: 上述证据满足，或生产部署阻塞需要暂停。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变选题评分算法。
  - 不改变 DeepSeek prompt。
  - 不输出密钥或数据库连接串。
  - 不执行用户代码。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `docs/aegis/work/2026-05-24-sprint24-planner-signal-snapshot/20-checkpoint.md`
- `src/app/admin/page.tsx`
- `src/server/curriculum/types.ts`
- `src/server/curriculum/explain-decision.ts`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 只读取既有 JSON `inputSnapshot`，不改变持久化 schema。
- Affected layers:
  - `src/server/curriculum/signal-snapshot.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/curriculum-signal-snapshot.test.ts`
  - docs/helloagents
- Invariants:
  - `/admin` 仍受现有 admin 鉴权保护。
  - 老计划没有 signal snapshot 时显示明确空态。
  - 原始 `reason`、`scoreBreakdown` 和 `inputSnapshot` 仍折叠查看。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
