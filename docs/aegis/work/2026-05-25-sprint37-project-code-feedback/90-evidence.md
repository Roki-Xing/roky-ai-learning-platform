# Sprint 37 Evidence

## 本地验证

- RED：`npm test -- tests/unit/projects.test.ts` 失败，错误为 `Cannot find module '@/server/projects/code-submission'`。
- GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/code-submit.test.ts` 13 项通过。
- 本地迁移：`npm run db:migrate:manual:project-milestone-code-submission` 执行成功。
- 本地 Prisma Client：`npm run prisma:generate` 执行成功。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 115 项通过。
- 本地：`npm run build` 通过，路由表包含 `/projects`、`/review`、`/progress`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint37-20260525-033510.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机容器内 Prisma Client：`npm run prisma:generate` 执行成功。
- 备用机容器内新增迁移：`npm run db:migrate:manual:project-milestone-code-submission` 执行成功。
- 备用机远端目标测试：`npm test -- tests/unit/projects.test.ts tests/unit/code-submit.test.ts` 13 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/projects`、`/review`、`/progress`。
- 备用机应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `ok`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
- 本地强制解析备用机 HTTP：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 当前真实 DNS：`learn.roky.chat` 仍解析到 `118.89.119.107`。
- 主机 `118.89.119.107` 部署尝试：
  - SSH 一度可达，已完成部署前备份和 rsync 同步。
  - 执行 `npm run prisma:generate` 失败于 `sh: 1: prisma: not found`，根因为远端 `node_modules/.bin/prisma` 不存在。
  - 后续 `npm ci` 长时间无输出，新 SSH 连接出现 `Connection timed out during banner exchange`。
  - 最终 SSH、HTTP Host-header、真实 HTTPS health 均超时。
  - 未对主机执行 migration、build 或 service restart，因此不能声明真实 DNS 主机完成 Sprint 37 部署。
- 当前真实 HTTPS：`curl -I https://learn.roky.chat/api/health` 返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72`，或等待 `118.89.119.107` 恢复后补迁移/build/restart。
