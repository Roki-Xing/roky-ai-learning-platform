# Sprint 43 Evidence

## 本地验证

- RED：`npm test -- tests/unit/knowledge-base.test.ts` 失败于 `knowledgeEntityVerificationBadge is not a function` 和 `knowledgeEntityVerificationTags is not a function`。
- GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 124 项通过。
- 本地：`npm run build` 通过，路由表包含 `/radar`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint43-20260525-050755.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机远端目标测试：`npm test -- tests/unit/knowledge-base.test.ts` 7 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/radar`。
- 备用机应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `ok`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
- 本地强制解析备用机 HTTP：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 本地强制解析 `/radar?entity=swe-bench` 返回 `307 Temporary Redirect` 到 `/login?entity=swe-bench&next=%2Fradar`，符合登录保护边界。
- 当前真实 DNS 仍指向 `118.89.119.107`。
- 真实公网域名需要 DNS A 记录切到 `118.25.15.72` 后补 HTTPS 验收。
