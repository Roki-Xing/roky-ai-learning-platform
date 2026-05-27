# Sprint 30 Checkpoint

## TodoCheckpointDraft

- [√] 读取长期目标文档并定位 Library 关联笔记缺口。
- [√] 复核 `/library` 已展示测验、卡片、Coach 评审、代码提交与反馈。
- [√] 写 RED 测试覆盖课程详情关联笔记按 `userId + lessonId` 读取。
- [√] 新增 `getLessonDetailNotes()`。
- [√] `/library` 课程详情新增“关联笔记”区域和“写笔记”入口。
- [√] 写 RED 测试覆盖 `lessonId` 只能来自当前可见计划列表。
- [√] 新增 `resolveVisibleLibraryLessonId()` 并接入 `/library`。
- [√] 本地目标测试和相关回归通过。
- [√] 本地全量测试、lint、build 通过。
- [ ] 生产同步、远端目标测试、build、重启和页面验收。

## ResumeStateHint

- 当前活跃切片：Sprint 30 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 需要恢复 SSH/HTTP 可观测性后才能补生产远端门禁；`118.25.15.72` 可登录但不是当前 `learn.roky.chat` DNS 目标，也没有完整生产 app 环境。
- 下一步：生产恢复后 rsync，同步 Sprint 25-30，运行远端目标测试、build、service health 和 Host-header 验收。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标的课程库沉淀和学习档案范围内。
- Compatibility: 没有新增 migration；Note 写入路径不变。
- New owner: `src/server/library/lesson-detail.ts` 负责课程详情补充数据与可见 lessonId 选择。
- Fallback/retirement: `/library` 原先直接使用请求 `lessonId` 或首条 plan 的内联选择逻辑已收敛到 `resolveVisibleLibraryLessonId()`。
- Evidence: RED/GREEN 目标测试、相关回归、本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
