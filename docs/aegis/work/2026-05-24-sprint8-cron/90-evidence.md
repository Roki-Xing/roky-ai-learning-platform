# Sprint 8 Evidence

## Local Verification

- `npm test -- tests/unit/cron-daily.test.ts`: 5 tests passed.
- `npm test -- tests/unit/cron-daily.test.ts tests/unit/auth-policy.test.ts`: 10 tests passed.
- `npm test`: 38 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; route table includes `/api/cron/daily`.

## Production Verification

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint8-20260524-044552.tar.gz`。
- 生产：补齐 `/etc/ai-learning-platform.env` 中的 `CRON_SECRET`，只验证存在性，不输出值。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`。
- 生产：内网 `/api/health` 返回 `ok`。
- 生产：无 secret 调用 `/api/cron/daily` 返回 `401 {"ok":false,"error":"Unauthorized"}`。
- 生产：带 secret 调用 `/api/cron/daily` 返回 `ok:true`，`totalUsers=2`，`successCount=2`。
- 生产：第二次带 secret 调用复用相同 `planId`，没有重复生成同一天计划。
- 生产：只读 DB 检查确认 `2026-05-24` 每个用户 active official DailyPlan 计数均为 1。
- 生产：只读 DB 检查确认最近 `cron_daily_plan` job 均为 `success / internal`。
- 生产：`/admin` 未登录返回 307 到 `/login`；带 demo/admin cookie 可见“运行 daily cron”按钮和 Daily Cron 记录区。
