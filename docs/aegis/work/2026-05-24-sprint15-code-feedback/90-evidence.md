# Sprint 15 Evidence

## 本地验证

- RED：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 初次失败于缺少 `@/server/coding/submit`。
- RED：旧 `src/server/ai/code-feedback.ts` 顶层导入 `env`，导致仅测试 fallback 也要求 `DATABASE_URL`/`CRON_SECRET`。
- RED：结构化字段实现后，目标测试失败于本地数据库缺少 `CodeSubmission.status`。
- 本地迁移：`npm run db:migrate:manual:code-feedback-structured` 通过。
- `npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts`：3 项通过。
- `npm test`：62 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint15-20260524-071231.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npx prisma generate`：通过。
- `npm run db:migrate:manual:code-feedback-structured`：通过。
- `npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts`：3 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- Host-header `/today`：可见 `仅保存，不执行`、`保存提交`、`代码反馈`、`overall`。
- Host-header `/library`：可见 `代码提交与反馈`。
- Host-header `/progress`：可见 `最近代码反馈` 与 `代码提交率`。
- Prisma 只读结构检查确认：
  - `CodeSubmission.status`
  - `CodeSubmission.aiFeedback`
  - `CodeSubmission.feedbackJson`
  - `CodeFeedback.overall`
  - `CodeFeedback.hints`
  - `CodeFeedback.suggestedTests`
  - `CodeFeedback.flashcards`
  - `CodeFeedback.feedbackJson`
  - `Misconception.sourceKey`
  - `Misconception.codeSubmissionId`
- 生产数据计数：`CodeFeedback=2`、`CodeFeedbackWithOverall=1`、`CodeMisconception=1`、`CodeBugCards=1`。
