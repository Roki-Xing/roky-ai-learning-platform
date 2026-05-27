# Sprint 21 Evidence

## 本地验证

- RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于缺少 `admin_plan_activation` 审计事件。
- GREEN：`npm test -- tests/unit/admin-plan-governance.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 81 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint21-20260524-090357.tar.gz`。
- 生产：已通过 `rsync` 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除了 `.git/`、`node_modules/`、`.next/` 和 `.env*`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/admin-plan-governance.test.ts` 4 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/admin` 未授权只显示 `Admin Login`，不会暴露 `最近 DailyPlan`。
- 生产：Host-header 验证 `/admin?planFilter=active|test|archived|all` 授权后均可见 `最近 DailyPlan`、`当前过滤：` 和当前 filter。
- 生产：Host-header 验证 `/admin?planFilter=...` 可见 `Activation history` 或空列表状态。
