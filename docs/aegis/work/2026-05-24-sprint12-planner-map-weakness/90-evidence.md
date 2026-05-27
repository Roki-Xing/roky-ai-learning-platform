# Sprint 12 Evidence

## 本地验证

- RED：`npm test -- tests/unit/curriculum-scoring.test.ts` 初次失败，`python-coding` map weakness 未影响排序。
- `npm test -- tests/unit/curriculum-scoring.test.ts`：3 项通过。
- `npm test`：52 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint12-20260524-060502.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/curriculum-scoring.test.ts` 3 项通过。
- 生产：`npm run build` 通过。
- 生产：`sudo systemctl restart ai-learning-platform.service` 后服务为 `active`。
- 生产：内网 `http://127.0.0.1:3102/api/health` 返回 `ok`。
