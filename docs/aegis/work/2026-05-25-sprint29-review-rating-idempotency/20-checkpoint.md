# Sprint 29 Checkpoint

## TodoCheckpointDraft

- [√] 建立 Sprint 29 范围和基线读集。
- [√] 写 RED 测试覆盖重复评分幂等行为。
- [√] 实现 `rateFlashcard()` 服务函数。
- [√] `rateFlashcardAction()` 改为复用服务函数。
- [√] 本地目标测试通过。
- [√] 本地 review 相关回归测试通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 29 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 仍需恢复 SSH/HTTP 可观测性后才能补生产远端门禁；`118.25.15.72` 可登录，但没有现成 ai-learning app 环境和完整生产密钥配置，不能直接宣称接管 `learn.roky.chat`。
- 下一步：生产恢复后 rsync，同步 Sprint 25-29，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标的 Sprint 2/复习闭环稳定化范围内。
- Compatibility: 没有新增 migration；复习排期规则保持 1/3/7/14 天。
- New owner: `src/server/review/actions.ts` 新增服务层函数，继续由 review action 模块负责评分写入。
- Fallback/retirement: Server Action 的内联评分写入路径已收敛到 `rateFlashcard()`；没有保留重复实现。
- Evidence: RED/GREEN 目标测试、相关回归、本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
