# Sprint 18 Evidence

## 本地验证

- RED：`npm test -- tests/unit/daily-breadth.test.ts` 初次失败于缺少 `@/server/knowledge/daily-breadth`。
- 本地测试库补齐既有手工迁移：`npm run db:migrate:manual:glossary-radar` 通过。
- `npm test -- tests/unit/daily-breadth.test.ts`：4 项通过。
- `npm test -- tests/unit/daily-breadth.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/knowledge-base.test.ts`：12 项通过。
- `npm test`：74 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint18-20260524-080809.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npx prisma generate`：通过。
- `npm run db:migrate:manual:glossary-radar`：通过，迁移脚本幂等执行。
- `npm test -- tests/unit/daily-breadth.test.ts`：4 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- Host-header `/today`：`今日术语`、`今日广度`、`查看术语库`、`查看 Radar`、`SWE-bench` 均 PASS。
- Host-header `/glossary`：`术语库`、`AI Radar`、`SWE-bench` 均 PASS。
- Host-header `/radar`：`术语库`、`AI Radar`、`SWE-bench` 均 PASS。
