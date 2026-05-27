# Sprint 15 Checkpoint

## Todo

- [√] 审计 Phase 5 当前差距并建立 Sprint 15 工作记录
- [√] 为结构化代码反馈和严重问题信号写 RED 测试
- [√] 实现 CodeSubmission AI feedback 结构升级和卡片/错题沉淀
- [√] 更新 `/today` 展示和相关文档
- [√] 运行本地测试、lint、build
- [√] 同步生产、重启服务并验收

## Current Slice

完成。

## Evidence Refs

- RED：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 初次失败于缺少 `submitCodeForReview`，且旧 `code-feedback` 顶层 env 导入导致 fallback 测试无法独立运行。
- RED 后续：目标测试失败于本地数据库缺少 `CodeSubmission.status` 字段，确认需要 Sprint 15 手动迁移。
- 本地迁移：`npm run db:migrate:manual:code-feedback-structured` 通过。
- GREEN：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 3 项通过。
- 本地：`npm test` 62 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint15-20260524-071231.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm run db:migrate:manual:code-feedback-structured` 通过。
- 生产：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 3 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/today` 可见 `仅保存，不执行`、`保存提交`、`代码反馈`、`overall`。
- 生产：通过 Host-header 验证 `/library` 可见 `代码提交与反馈`。
- 生产：通过 Host-header 验证 `/progress` 可见 `最近代码反馈` 与 `代码提交率`。
- 生产：Prisma 只读结构检查确认新增列存在，并显示 `CodeFeedbackWithOverall=1`、`CodeMisconception=1`、`CodeBugCards=1`。

## Drift Check

- 当前工作仍服务长期文档 Phase 5。
- 保持“不执行用户代码”的安全边界。
- 反馈 owner 采用 `CodeFeedback` 详表，同时把 Phase 5 明确要求的 `CodeSubmission.aiFeedback/feedbackJson/status` 作为提交状态摘要同步写入。
