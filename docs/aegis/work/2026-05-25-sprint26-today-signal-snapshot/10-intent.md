# Sprint 26 Today Signal Snapshot - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标，把 Sprint 24/25 已保存和摘要化的 Planner signal snapshot 接到 `/today`，让学习者能看到“为什么今天学这个”的真实补弱信号。
- Goal: `/today` 的“为什么今天学这个”卡片不只显示 `scoreBreakdown` 解释，还展示来自 `CurriculumDecisionLog.inputSnapshot.decision.signalSnapshot` 的学习者可读摘要。
- Success evidence:
  - 新增纯函数可从 planner input snapshot 生成 today learner-facing insight。
  - `/today` 查询 `CurriculumDecisionLog.inputSnapshot`。
  - `/today` 展示 `Planner 信号快照`，包括最近学习和活跃补弱信号。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/today` Host-header 验收。
- Stop condition: 上述证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 planner scoring。
  - 不改变 DeepSeek prompt。
  - 不输出原始 `inputSnapshot` 到普通学习页。
  - 不输出密钥或数据库连接串。
  - 不执行用户代码。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `docs/aegis/work/2026-05-24-sprint24-planner-signal-snapshot/10-intent.md`
- `docs/aegis/work/2026-05-25-sprint25-admin-signal-snapshot/10-intent.md`
- `src/app/today/page.tsx`
- `src/server/curriculum/signal-snapshot.ts`
- `src/server/curriculum/explain-decision.ts`
- `tests/unit/curriculum-signal-snapshot.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只读取既有 `CurriculumDecisionLog.inputSnapshot` JSON，不改变持久化 schema。
- Affected layers:
  - `src/server/curriculum/signal-snapshot.ts`
  - `src/app/today/page.tsx`
  - `tests/unit/curriculum-signal-snapshot.test.ts`
  - docs/helloagents
- Invariants:
  - `/today` 仍优先展示现有 `explainCurriculumDecision()` 主理由。
  - 普通学习页只显示摘要，不展示原始 JSON。
  - 老计划没有 signal snapshot 时保持无额外区块，不伪造信号。
  - `/admin` 的原始审计能力不变。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
