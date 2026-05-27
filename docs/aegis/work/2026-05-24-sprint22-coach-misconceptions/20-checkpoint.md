# Sprint 22 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 22 范围和基线读集。
- [√] 写 RED 测试覆盖 Coach high severity issue 自动沉淀。
- [√] 确认 RED 失败于缺少 `Misconception`。
- [√] 实现 `coach:{reviewId}:{issueIndex}` sourceKey 的 misconception upsert。
- [√] 同步更新 `UserTopicState.exposureCount` 与 `weaknessScore`。
- [√] 本地目标测试和相邻回归测试通过。
- [√] 本地全量测试、lint、build 通过。
- [√] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 22 已完成，等待下一轮长期目标切片。
- 下一步：继续推进能让“错误、代码提交、复习表现影响下一次生成”的后续切片。
- 不要同步 `.env*`，不要清理 dirty worktree。

## DriftCheckDraft

- Scope: 仍在长期目标“错误、代码提交、复习表现影响下一次生成”范围内。
- Compatibility: 没有新增迁移；复用 `Misconception` 和 `UserTopicState`。
- New owner: `src/server/coach/submit.ts` 现在负责 ThoughtReview 创建、卡片生成，以及 Coach source misconception 沉淀。
- Fallback/retirement: 没有旧分支需要保留；无课程关联时显式跳过 misconception 沉淀。
- Evidence: RED/GREEN 目标测试、相邻回归、全量测试、lint、build、生产目标测试、生产 build、service health 和页面验收已完成。
- Decision: complete。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
