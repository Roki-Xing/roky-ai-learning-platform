# Sprint 10 Evidence

## 本地验证

- `npm test -- tests/unit/guided-progress.test.ts`：3 项通过。
- `npm run lint`：通过。
- `npm test`：47 项通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint10-20260524-052356.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm run db:migrate:manual:guided-progress` 通过。
- 生产：`npm run build` 通过，路由表包含 `/today`。
- 生产：`sudo systemctl restart ai-learning-platform.service` 后服务为 `active`。
- 生产：内网 `http://127.0.0.1:3102/api/health` 返回 `ok`。
- 生产：只读 DB 检查返回 `{"guidedProgressColumn":true}`。
- 生产：Host-header 检查 `/today` 返回：
  - `sprint10: true`
  - `saveProgress: true`
  - `synced: true`
  - `staleLostCopy: false`
  - `guidedSteps: true`

## 边界说明

- 当前 Codex 运行环境直接 `curl https://learn.roky.chat` 超时；因此公网链路未在本机 curl 中完成。
- 生产机本机通过 `Host: learn.roky.chat` 直连 Next 服务已验证页面内容，说明新构建和服务进程已经生效。
