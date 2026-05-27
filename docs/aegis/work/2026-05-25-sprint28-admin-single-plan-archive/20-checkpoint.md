# Sprint 28 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 28 范围和基线读集。
- [√] 写 RED 测试覆盖单计划归档和跨用户拒绝。
- [√] 实现 `markPlanArchived()`。
- [√] 新增 `markPlanArchivedAction()`。
- [√] `/admin` 最近 DailyPlan 列表新增“归档”按钮。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 28 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 仍 SSH banner timeout、HTTP/HTTPS 超时，生产远端门禁要等网关机恢复。
- 下一步：生产恢复后 rsync，同步 Sprint 25-28，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标 Phase 1 数据治理范围内。
- Compatibility: 没有新增迁移；只新增治理性 archive action。
- New owner: `src/server/admin/plan-governance.ts` 继续负责 admin plan governance。
- Fallback/retirement: 没有保留旧的单计划归档路径；bulk archive 继续负责批量治理。
- Evidence: RED/GREEN 目标测试、本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
