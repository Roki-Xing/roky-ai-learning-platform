# Sprint 36 Checkpoint

## TodoCheckpointDraft

- [√] 读取目标文档 Phase 12 和 Review 相关要求，定位项目复习入口进入普通队列的问题。
- [√] 复核 project flashcard stable id、review filter 和 review page searchParams 处理。
- [√] 写 RED 测试覆盖项目 reviewHref、项目专属 due 队列、source normalize 和 project where。
- [√] 实现 `normalizeReviewSource()`。
- [√] 扩展 `buildReviewableFlashcardWhere()` 支持 standalone source/projectId。
- [√] 扩展 `getDueFlashcards()` 支持 source/projectId。
- [√] `/review` 页面读取 source/projectId 并显示项目卡片复习标题。
- [√] `getProjectReviewCardSummary()` 返回项目专属 `/review` URL。
- [√] 本地目标测试 GREEN。
- [√] 本地全量 lint/test/build 门禁。
- [√] 备用机同步、远端目标测试、build、容器启动和 Host-header health 验收。
- [ ] DNS 从主生产机切换到备用机后的真实公网域名验收。

## ResumeStateHint

- 当前活跃切片：Sprint 36 代码实现、文档记录、本地完整门禁和备用机远端验证已完成。
- 当前阻塞：真实 `learn.roky.chat` DNS 仍解析到 `118.89.119.107`，真实 HTTPS 验收需要切 DNS 后补。
- 下一步：跑本地 `npm run lint`、`npm test`、`npm run build`；通过后同步备用机并验证。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在目标文档 Phase 12 Project Practice 和 Review 主动复习闭环范围内。
- Compatibility: 没有新增 migration；默认 review 队列保持兼容。
- New owner: `src/server/review/filter.ts` 负责 review source 规范化和 focused where 构建。
- Fallback/retirement: 没有新增 fallback；项目复习入口从普通 `/review` 收敛到 focused `/review?source=project&projectId=...`。
- Evidence: RED 目标测试出现 4 个预期失败；GREEN 后 `npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 15 项通过；本地 `npm run lint`、`npm test`、`npm run build` 已通过；备用机目标测试、build、容器启动和 HTTP health 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
