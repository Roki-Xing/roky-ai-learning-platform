# Sprint 39 Evidence

## 本地验证

- RED：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 失败，错误包括 `getProjectCodeFeedbackCardSummary is not a function`、`code-feedback` source 未归一化、focused queue 返回 0。
- GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 20 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 118 项通过。
- 本地：`npm run build` 通过，路由表包含 `/projects` 和 `/review`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint39-20260525-041700.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机远端目标测试：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 20 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/projects` 和 `/review`。
- 备用机应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `ok`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
- 本地强制解析备用机 HTTP：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 当前真实 DNS 仍指向 `118.89.119.107`。
- 当前真实 HTTPS：`curl -I https://learn.roky.chat/api/health` 返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72`，或等待 `118.89.119.107` 恢复后补公网/HTTPS 验收。
