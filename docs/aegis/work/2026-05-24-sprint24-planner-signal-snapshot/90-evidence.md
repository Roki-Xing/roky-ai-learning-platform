# Sprint 24 Evidence

## 本地验证

- RED：`npm test -- tests/unit/daily-generation-prompt.test.ts` 初次失败于导入 `generate-daily-plan.ts` 时触发 `DATABASE_URL` / `CRON_SECRET` env 校验。
- Root cause: prompt helper 与真实 DeepSeek/env/db 调用路径在同一模块顶层耦合，导致纯函数测试加载服务端 env。
- Fix: 移除 `generate-daily-plan.ts` 顶层 `env`、`prisma`、`deepseek` 运行时导入；导出 `buildDailyPlanMessages()`；真实生成路径按需动态导入 DB 和 DeepSeek adapter。
- GREEN：`npm test -- tests/unit/daily-generation-prompt.test.ts` 1 项通过。
- GREEN：`npm test -- tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/daily-generation-prompt.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 88 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint24-20260524-235753.tar.gz`。
- 生产：已通过 `rsync` 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除了 `.git/`、`node_modules/`、`.next/` 和 `.env*`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/daily-generation-prompt.test.ts tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts` 7 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/today` 可见 `为什么今天学这个` 与 `今日主课`。
- 生产：Host-header 验证 `/admin` 未授权显示 `Admin Login`，或授权状态可见 `最近 CurriculumDecision`。
- 生产：Host-header 验证 `/progress` 可见 `错题` 与 `思路评审`。
- 生产：Host-header 验证 `/map` 可见 `知识地图` 与 `错题`。
