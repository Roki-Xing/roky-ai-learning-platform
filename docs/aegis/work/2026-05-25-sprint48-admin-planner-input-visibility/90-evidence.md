# Sprint 48 Evidence

## 本地验证

- RED：`npm test -- tests/unit/admin-planner-visibility.test.ts` 失败于 `Cannot find module '@/server/admin/planner-visibility'`。
- GREEN：`npm test -- tests/unit/admin-planner-visibility.test.ts` 2 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 134 项通过。
- 本地：`npm run build` 通过，路由表包含 `/admin`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint48-20260525-060225.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机远端目标测试：`npm test -- tests/unit/admin-planner-visibility.test.ts` 2 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/admin`。
- 备用机应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `ok`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
- 本地强制解析备用机 HTTP：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 本地强制解析 `/admin` 返回 `307 Temporary Redirect` 到 `/login`，符合 admin 登录保护边界。

## DNS 边界

- 当前真实 DNS 仍指向 `118.89.119.107`。
- 若 `learn.roky.chat` 仍解析到旧机，应使用 `curl --resolve learn.roky.chat:80:118.25.15.72` 验证备用机，不得声明真实公网域名已命中新部署。
