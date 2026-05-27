# Sprint 20 Checkpoint

## TodoCheckpointDraft

- [√] 写 RED 测试覆盖 plan 激活和越权拒绝。
- [√] 新增 `src/server/admin/plan-governance.ts`。
- [√] 新增 `markPlanActiveAction()` 并保持 admin 鉴权。
- [√] `/admin` 最近 DailyPlan 列表新增“设为 active”按钮。
- [√] 本地目标测试、相邻回归、全量测试、lint、build 通过。
- [√] 生产同步、远端目标测试、build、重启和 Host-header 验收。

## ResumeStateHint

- 当前活跃切片：生产部署后证据同步。
- 下一步：同步 `docs/` 和 `helloagents/` 到生产，确认生产文档包含 Sprint 20 证据。
- 不要同步 `.env*`，不要删除计划数据。

## DriftCheckDraft

- Scope: 仍在长期文档 Sprint 2.3 Data Governance 内。
- Compatibility: 没有新增迁移；仅使用已有 DailyPlan 字段。
- New owner: `src/server/admin/plan-governance.ts`。
- Fallback/retirement: 旧的只读 recent plan 列表保留，新增按钮提供治理动作。
- Evidence: 生产备份、rsync、远端目标测试、build、service health 和 `/admin` Host-header 验收已完成。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
