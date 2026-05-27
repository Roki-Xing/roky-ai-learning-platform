# Sprint 19 Checkpoint

## TodoCheckpointDraft

- [√] 写 RED 测试覆盖知识偏好保存和最近 slug 去重。
- [√] 新增 `UserProfile` 知识偏好字段与 manual migration。
- [√] 抽出 `src/server/profile/settings.ts` 服务层。
- [√] `/settings` 增加每日术语偏好、Radar 偏好、知识卡去重天数。
- [√] `selectDailyKnowledgeFocus()` 避免最近使用过的 sourceSlug。
- [√] `getOrCreateTodayPlan()` 传入用户知识偏好和去重天数。
- [√] 本地目标测试、全量测试、lint、build 通过。
- [√] 生产同步、远端迁移、远端测试、build、重启、Host-header 验收。

## ResumeStateHint

- 当前活跃切片：Sprint 19 已部署，等待继续下一个长期文档优先项。
- 下一步：继续推进 planner/admin 解释面板或长期文档中尚未覆盖的下一项。
- 不要同步 `.env*`，不要执行 destructive git 命令。

## DriftCheckDraft

- Scope: 仍在长期文档 Phase 5.3 每日广度轮转增强内。
- Compatibility: 仅新增 UserProfile 字段；不改变 DailyPlan/Flashcard 核心契约。
- New owner: `src/server/profile/settings.ts` 承担设置保存服务层。
- Fallback: 去重后找不到偏好 slug 时回落到非重复默认知识记录。
- Decision: deployed。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
