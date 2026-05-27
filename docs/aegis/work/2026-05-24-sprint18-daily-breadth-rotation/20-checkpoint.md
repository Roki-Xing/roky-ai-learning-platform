# Sprint 18 Checkpoint

## TodoCheckpointDraft

- [√] 新增每日广度轮转服务。
- [√] 把真实 glossary/radar 选择接入 `getOrCreateTodayPlan()`。
- [√] 修复术语 fallback 被误判成 Radar 链接的边界。
- [√] 补 `daily-breadth` 单元测试和 DailyPlan 集成断言。
- [√] 本地目标测试、全量测试、lint、build 通过。
- [√] 生产同步、远端门禁和 Host-header 验收。

## ResumeStateHint

- 当前活跃切片：Sprint 18 已部署，等待继续下一个 Sprint。
- 下一步：进入下一个长期文档优先项前，先确认线上 `/today`、`/glossary`、`/radar` 的用户体验是否需要微调。
- 不要执行 `git reset`、`git clean` 或覆盖生产 `.env*`。

## DriftCheckDraft

- Scope: 仍在 Phase 9 Glossary + AI Radar 的每日广度轮转内。
- Compatibility: 没有新增数据库字段；复用已有 JSON connections。
- New owners: 新增 `src/server/knowledge/daily-breadth.ts`，职责明确。
- Fallback: 仅当 rotation 没有 radar 实体时用 glossary concept fallback，并只生成 glossary 链接。
- Decision: deployed。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
