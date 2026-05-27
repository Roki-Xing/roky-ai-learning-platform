# Sprint 9 Evidence

## Local Verification

- `npm test -- tests/unit/progress-analytics.test.ts`: 6 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; route table includes `/progress`.
- `npm test`: 44 tests passed.

## Production Verification

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint9-20260524-050521.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`。
- 生产：内网 `/api/health` 返回 `ok`。
- 生产：带 `ral_demo=1` cookie 访问 `/progress` 返回 200。
- 生产：`/progress` 页面可见 `Sprint 9`、`学习日历`、`内容质量`、`学习效果`、`代码练习趋势`、`知识覆盖`。
