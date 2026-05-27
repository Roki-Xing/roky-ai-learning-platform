# Sprint 50 Evidence

## 本地验证

- RED：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts` 失败于 `Cannot find module '@/server/admin/plan-audit-exceptions'`。
- GREEN：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts` 2 项通过。
- 相关目标测试：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-plan-audit-chain.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 138 项通过。
- 本地：`npm run build` 通过，路由表包含 `/admin`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint50-20260525-063130.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机远端目标测试：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-plan-audit-chain.test.ts` 4 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/admin`。
- 备用机应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `ok`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
- 本地强制解析备用机 HTTP：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 本地强制解析 `/admin` 返回 `307 Temporary Redirect` 到 `/login`，符合 admin 登录保护边界。

## DNS 边界

- 当前真实 DNS 仍指向 `118.89.119.107`。
- DNS 切换前只能声明备用机 `118.25.15.72` 已部署。
- 备用机验收使用 `curl --resolve learn.roky.chat:80:118.25.15.72`，不得把强制解析结果说成真实公网 DNS 已切换。
