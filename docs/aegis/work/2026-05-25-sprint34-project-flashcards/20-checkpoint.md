# Sprint 34 Checkpoint

## TodoCheckpointDraft

- [√] 读取目标文档并定位 Project Practice 完成后复习卡片沉淀缺口。
- [√] 复核 `/projects` milestone 完成路径、手动完成项目 action 和 review filter。
- [√] 新增 `buildProjectCompletionFlashcards()`，生成 stable standalone project cards。
- [√] 新增 `completeLearningProject()` 服务函数。
- [√] `completeProjectAction()` 改为复用服务函数。
- [√] `completeMilestoneAction()` 在最后 milestone 完成后通过同一服务生成项目卡片。
- [√] `/review` standalone source tags 纳入 `project`。
- [√] 单测覆盖 card builder、项目完成、幂等、未完成拒绝和跨用户拒绝。
- [√] 本地目标测试通过。
- [√] 本地全量 lint/test/build 门禁。
- [√] 备用机同步、远端目标测试、build、容器启动和 Host-header health 验收。
- [ ] DNS 从主生产机切换到备用机后的真实公网域名验收。

## ResumeStateHint

- 当前活跃切片：Sprint 34 代码实现、文档记录、本地完整门禁和备用机远端验证已完成。
- 当前阻塞：真实 `learn.roky.chat` DNS 仍需用户把 A 记录切到 `118.25.15.72` 后才能补公网/HTTPS 验收。
- 下一步：跑本地 `npm run lint`、`npm test`、`npm run build`；通过后同步备用机并验证。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标的 Project Practice → Flashcards → Review 沉淀闭环范围内。
- Compatibility: 没有新增 migration；LearningProject、ProjectMilestone 和 Flashcard schema 不变。
- New owner: `src/server/projects/submit.ts` 负责项目完成、summary 写入和 project flashcards upsert。
- Fallback/retirement: `/projects` action 内联完成项目和生成总结路径已收敛到服务层；review filter 明确接受 `project` standalone cards。
- Evidence: 目标测试已覆盖 builder、服务层幂等、拒绝路径和 review filter；本地 `npm run lint`、`npm test`、`npm run build` 已通过；备用机目标测试、build、容器启动和 HTTP health 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
