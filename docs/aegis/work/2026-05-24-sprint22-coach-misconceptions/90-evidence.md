# Sprint 22 Evidence

## 本地验证

- RED：`npm test -- tests/unit/coach-submit.test.ts` 初次失败于 `assert.ok(misconception)`，证明 Coach high severity issue 尚未沉淀。
- GREEN：`npm test -- tests/unit/coach-submit.test.ts` 3 项通过。
- 相邻回归：`npm test -- tests/unit/coach-submit.test.ts tests/unit/coach-context.test.ts tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts` 13 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 82 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint22-20260524-231729.tar.gz`。
- 生产：已通过 `rsync` 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除了 `.git/`、`node_modules/`、`.next/` 和 `.env*`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/coach-submit.test.ts` 3 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/coach` 可见 `Coach` 与 `提交思路`。
- 生产：Host-header 验证 `/progress` 可见 `思路评审` 与 `错题`。
- 生产：Host-header 验证 `/map` 可见 `知识地图` 与 `错题`。
