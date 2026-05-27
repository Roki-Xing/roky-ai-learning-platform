# Sprint 21 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 21 范围和基线读集。
- [√] 写 RED 测试覆盖 activation audit event。
- [√] 写 RED 测试覆盖 admin plan filter 规则。
- [√] 实现 `admin_plan_activation` 审计事件。
- [√] 实现 `/admin` planFilter 查询与 activation history 展示。
- [√] 本地目标测试、全量测试、lint、build 通过。
- [√] 生产同步、远端目标测试、build、重启和 Host-header 验收。

## ResumeStateHint

- 当前活跃切片：生产部署后证据同步。
- 下一步：同步 `docs/` 和 `helloagents/` 到生产，确认生产文档包含 Sprint 21 证据。
- 不要同步 `.env*`，不要删除计划数据。

## DriftCheckDraft

- Scope: 仍在长期文档 Data Governance 内。
- Compatibility: 没有新增迁移；激活历史复用 `AiGenerationJob(type="admin_plan_activation")`。
- New owner: `src/server/admin/plan-governance.ts` 同时负责计划激活、过滤规则和审计事件。
- Fallback/retirement: 未保留旧过滤分支；默认 recent plan 从“全部”收紧为 `active`，并提供 `all` 显式入口。
- Evidence: 生产备份、rsync、远端目标测试、build、service health 和 `/admin?planFilter=...` Host-header 验收已完成。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
