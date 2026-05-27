# Sprint 25 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 25 范围和基线读集。
- [√] 写 RED 测试覆盖 signal snapshot 提取和摘要。
- [√] 实现 `src/server/curriculum/signal-snapshot.ts`。
- [√] `/admin` 最近 CurriculumDecision 查询 `inputSnapshot`。
- [√] `/admin` 展示 `Planner signal snapshot` 摘要。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [√] 生产备份与 rsync 同步已执行。
- [ ] 远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 25 本地实现、完整本地门禁、生产备份和 rsync 同步已完成。
- 当前阻塞：`118.89.119.107` TCP 22/80/443 可连接，但 SSH 卡在 banner exchange，HTTP/HTTPS 不返回内容；从第二台服务器 `118.25.15.72` 旁路复核结果一致。
- 下一步：等待网关机恢复可观测性后，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标“数据治理和选题可审计”范围内。
- Compatibility: 没有新增迁移；只消费既有 `CurriculumDecisionLog.inputSnapshot`。
- New owner: `src/server/curriculum/signal-snapshot.ts` 负责把 planner snapshot 转成管理端可读摘要。
- Fallback/retirement: 老计划或 admin 激活记录缺少 snapshot 时显示空态，不伪造信号。
- Evidence: Sprint 25 目标测试、本地 `npm run lint`、`npm test`、`npm run build` 已通过；生产备份和 rsync 已完成；远端门禁因网关机应用层不可观测待补。
- Decision: blocked-by-infra，继续低频恢复探测。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
