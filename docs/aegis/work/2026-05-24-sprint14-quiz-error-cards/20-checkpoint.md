# Sprint 14 Checkpoint

## Todo

- [√] 建立 Sprint 14 工作记录与基线读集
- [√] 为 quiz 错题卡幂等生成写 RED 测试
- [√] 实现错题 Flashcard 生成并接入 quiz action
- [√] 更新知识库与变更记录
- [√] 运行本地测试、lint、build
- [√] 同步生产、重启服务并验收

## Current Slice

完成。

## Evidence Refs

- RED：`npm test -- tests/unit/quiz-error-card.test.ts` 初次失败于缺少 `@/server/quiz/error-card`。
- GREEN：`npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts` 5 项通过。
- 本地：`npm test` 59 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint14-20260524-064506.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts` 5 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/today` 可见 `今日小测验`、`required`、`提交答案`。
- 生产：通过 Host-header 验证 `/review` 可见 `显示答案`。
- 生产：通过 Host-header 验证 `/progress` 可见 `学习效果` 与 `测验`。

## Drift Check

- 当前工作仍服务长期文档 Sprint 2.4。
- 无数据库迁移。
- 无新权限边界。
- Server Action 仍先鉴权；服务层按数据库题型解析答案，不信任客户端隐藏字段。
