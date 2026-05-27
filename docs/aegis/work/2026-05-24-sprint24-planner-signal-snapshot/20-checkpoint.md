# Sprint 24 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 24 范围和基线读集。
- [√] 给 `CurriculumDecision` 增加 `signalSnapshot` 类型。
- [√] 让 `scoreTopicCandidates()` 为每个候选决策返回信号快照。
- [√] 让 `selectNextTopic()` fallback decision 返回空信号快照。
- [√] 增加测试覆盖 planner signal snapshot 可审计性。
- [√] 增加测试覆盖 `CurriculumDecisionLog.inputSnapshot` 持久化快照。
- [√] 修复 `generate-daily-plan.ts` prompt helper 顶层 env/API 副作用。
- [√] 导出 `buildDailyPlanMessages()` 并把 signal snapshot 写入 prompt。
- [√] 本地目标测试通过。
- [√] 本地全量测试、lint、build 通过。
- [√] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 24 已完成并上线。
- 下一步：继续下一轮长期目标切片，可优先做 `/admin` 展示 signal snapshot 摘要或进入下一项生成质量增强。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标“学习反馈影响下一次每日生成，并可审计”范围内。
- Compatibility: 没有新增迁移；复用 JSON snapshot。
- New owner: `CurriculumDecision.signalSnapshot` 作为 planner signal 的统一快照载体。
- Fallback/retirement: `generate-daily-plan.ts` 的 prompt helper 改为可测试纯函数；真实 DeepSeek 调用仍在运行时路径动态导入。
- Evidence: Sprint 24 目标测试、本地 `npm run lint`、`npm test`、`npm run build`、生产目标测试、生产 build、service health 和 Host-header 页面验收已通过。
- Decision: complete。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
