# Sprint 32 Checkpoint

## TodoCheckpointDraft

- [√] 读取目标文档并定位 Voice Note → Coach 服务层测试缺口。
- [√] 复核 `/voice` 已有发送 Coach UI 和 action。
- [√] 写 RED 测试覆盖 VoiceNote 发送 Coach 创建/复用 ThoughtReview。
- [√] 写 RED 测试覆盖跨用户 VoiceNote 拒绝。
- [√] 新增 `sendVoiceNoteToCoach()` 服务函数。
- [√] `sendVoiceNoteToCoachAction()` 改为复用服务函数。
- [√] 本地 Voice/Coach 相关回归通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 32 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 需要恢复 SSH/HTTP 可观测性后才能补生产远端门禁；`118.25.15.72` 可登录但不是当前 `learn.roky.chat` DNS 目标，也没有完整生产 app 环境。
- 下一步：生产恢复后 rsync，同步 Sprint 25-32，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标的 Voice Note → Coach → Flashcards 沉淀闭环范围内。
- Compatibility: 没有新增 migration；ThoughtReview 生成路径和 schema 不变。
- New owner: `src/server/voice/submit.ts` 现在负责 Voice Note 创建、Voice Note → Note、Voice Note → Coach 三条服务层路径。
- Fallback/retirement: `/voice` action 内联 Coach 创建/链接逻辑已收敛到服务层；没有保留重复实现。
- Evidence: RED/GREEN 目标测试、相关回归、本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
