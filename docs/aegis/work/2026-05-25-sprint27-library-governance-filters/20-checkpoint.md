# Sprint 27 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 27 范围和基线读集。
- [√] 写 RED 测试覆盖 `/library` 治理筛选。
- [√] 实现 `src/server/library/plan-filter.ts`。
- [√] `/library` 使用统一过滤 where。
- [√] `/library` 展示 `source/schemaVersion/status/localDate` 筛选。
- [√] `/library` 课程链接保留当前筛选。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 27 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 仍 SSH banner timeout、HTTP/HTTPS 超时，生产远端门禁要等网关机恢复。
- 下一步：生产恢复后 rsync，同步 Sprint 25-27，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标 Phase 1 数据治理范围内。
- Compatibility: 没有新增迁移；只读取既有 DailyPlan governance fields。
- New owner: `src/server/library/plan-filter.ts` 负责 `/library` 查询参数和 DailyPlan where。
- Fallback/retirement: 页面里原先散落的 `showTest/showArchived` URL 构造已集中到 helper；不保留重复 owner。
- Evidence: RED/GREEN 目标测试、本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
