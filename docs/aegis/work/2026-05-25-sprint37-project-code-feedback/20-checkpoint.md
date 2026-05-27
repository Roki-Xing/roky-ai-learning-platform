# Sprint 37 Checkpoint

## Completed

- [√] RED 测试：`npm test -- tests/unit/projects.test.ts` 初次失败于缺少 `@/server/projects/code-submission`。
- [√] `ProjectMilestone` 新增 `codeSubmissionId` 字段和索引。
- [√] 新增安全手动迁移 `prisma/manual-migrations/20260525_project_milestone_code_submission.sql`。
- [√] `package.json` 新增 `db:migrate:manual:project-milestone-code-submission`。
- [√] 新增 `reviewProjectMilestoneCode()` 服务函数。
- [√] `/projects` 新增“保存并评审代码” action 和按钮。
- [√] 页面展示 linked feedback id。
- [√] 项目代码评审使用用户时区 localDate。
- [√] 本地目标测试 GREEN。
- [√] 本地 lint/test/build 通过。

## Pending

- [√] 同步到备用机。
- [√] 在备用机容器内执行新增手动迁移。
- [√] 备用机目标测试、build、health 验证。
- [X] 真实 DNS 指向主机 `118.89.119.107` 部署未完成：SSH/HTTP/HTTPS 当前超时。

## Drift

- 未扩大到代码执行沙箱。
- 未改变 `submitCodeForReview()` 的正式 DailyPlan lesson scope。
- 未改变项目完成卡片或项目复习筛选。
- 备用机 `118.25.15.72` 已部署 Sprint 37；真实 `learn.roky.chat` 仍解析到 `118.89.119.107`，需要切 DNS 或等待主机恢复后补部署。
