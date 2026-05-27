# Sprint 23 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 23 范围和基线读集。
- [√] 写 RED 测试覆盖 scoring active misconception signal。
- [√] 实现 `activeMisconceptionCountByDomain` 和 `misconceptionScore`。
- [√] 写 RED 测试覆盖 `selectNextTopic()` 从 DB 读取 open `Misconception`。
- [√] 实现 open/active `Misconception` 到 domain 的汇总。
- [√] 写 RED 测试覆盖解释层“活跃误区”信号。
- [√] 实现 `explainCurriculumDecision()` 的 misconception signal。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [√] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 23 已完成，等待下一轮长期目标切片。
- 下一步：继续推进让 Planner 的输入快照和 admin 解释更可审计，或进入下一项学习闭环增强。
- 不要同步 `.env*`，不要清理 dirty worktree。

## DriftCheckDraft

- Scope: 仍在长期目标“错误、代码提交、复习表现影响下一次生成”范围内。
- Compatibility: 没有新增迁移；复用现有 `Misconception`。
- New owner: `src/server/curriculum/select-next-topic.ts` 现在负责把 active misconception 汇总为 Planner domain weakness。
- Fallback/retirement: 未新增 fallback；topicId 优先，lessonId 只作为映射 fallback。
- Evidence: RED/GREEN 目标测试、本地全量测试、lint、build、生产目标测试、生产 build、service health 和页面验收已完成。
- Decision: complete。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
