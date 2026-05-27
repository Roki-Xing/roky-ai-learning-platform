# Sprint 25 Evidence

## 本地验证

- RED：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 初次失败于缺少 `@/server/curriculum/signal-snapshot`。
- GREEN：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 2 项通过。
- GREEN：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts` 8 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 90 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 生产备份已创建：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint25-20260525-001247.tar.gz`。
- 已执行 rsync 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除 `.env*`、`.git/`、`node_modules/`、`.next/`。
- 远端门禁暂未完成：
  - 本地到 `118.89.119.107`：SSH 失败，`Connection timed out during banner exchange`。
  - 本地到 `https://learn.roky.chat/api/health`：超时。
  - 本地 Host-header 到 `http://118.89.119.107/api/health`：超时。
  - 从 `118.25.15.72` 旁路到 `118.89.119.107`：TCP 22/80/443 open，但 HTTP 超时，SSH 同样 `Connection timed out during banner exchange`。
- 待补：网关机恢复后执行远端目标测试、`npm run build`、service restart、内网 `/api/health` 和 `/admin` Host-header 验收。
