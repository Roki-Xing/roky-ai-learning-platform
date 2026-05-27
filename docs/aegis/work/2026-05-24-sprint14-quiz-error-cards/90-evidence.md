# Sprint 14 Evidence

## 本地验证

- RED：`npm test -- tests/unit/quiz-error-card.test.ts` 初次失败于缺少 `@/server/quiz/error-card`。
- `npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts`：5 项通过。
- `npm test`：59 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint14-20260524-064506.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npx prisma generate`：通过。
- `npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts`：5 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- Host-header `/today`：可见 `今日小测验`、`required`、`提交答案`。
- Host-header `/review`：可见 `显示答案`。
- Host-header `/progress`：可见 `学习效果` 与 `测验`。
