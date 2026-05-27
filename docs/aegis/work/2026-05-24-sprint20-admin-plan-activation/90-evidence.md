# Sprint 20 Evidence

## 本地验证

- RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于缺少 `@/server/admin/plan-governance`。
- GREEN：`npm test -- tests/unit/admin-plan-governance.test.ts` 2 项通过。
- 相邻回归：`npm test -- tests/unit/admin-plan-governance.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/cron-daily.test.ts` 10 项通过。
- `npm test`：79 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint20-20260524-084009.tar.gz`。
- 生产：已通过 `rsync` 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除了 `.git/`、`node_modules/`、`.next/` 和 `.env*`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/admin-plan-governance.test.ts` 2 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/admin` 未授权只显示 `Admin Login`，不会暴露 `最近 DailyPlan`。
- 生产：Host-header 验证 `/admin` 授权后可见 `最近 DailyPlan`、`设为 active`、`归档所有 test 计划`、`归档未来 planned 计划`。
