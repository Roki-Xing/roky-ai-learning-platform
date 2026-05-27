# Sprint 26 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 26 范围和基线读集。
- [√] 写 RED 测试覆盖 `/today` learner-facing planner signal insight。
- [√] 实现 `buildTodayCurriculumSignalInsight()`。
- [√] `/today` 查询 `CurriculumDecisionLog.inputSnapshot`。
- [√] `/today` 展示 `Planner 信号快照` 摘要。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 26 本地代码实现已完成，目标测试和完整本地门禁已通过。
- 当前阻塞：`118.89.119.107` 仍 SSH banner timeout、HTTP/HTTPS 超时，生产远端门禁要等网关机恢复。
- 下一步：运行 `npm run lint`、`npm test`、`npm run build`；生产恢复后再 rsync 并验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标“每天可用、选题可解释、数据治理可审计”范围内。
- Compatibility: 没有新增迁移；只消费既有 `CurriculumDecisionLog.inputSnapshot`。
- New owner: `src/server/curriculum/signal-snapshot.ts` 继续负责把 planner snapshot 转成不同场景摘要。
- Fallback/retirement: 老计划缺少 snapshot 时 `/today` 不显示额外区块，不伪造信号。
- Evidence: RED/GREEN 目标测试已通过；本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
