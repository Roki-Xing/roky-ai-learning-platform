# Sprint 36 Evidence

## 本地验证

- RED：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 失败 4 项：
  - project review href 仍为 `/review`。
  - project-focused due queue 返回 5 张而不是 3 张。
  - `normalizeReviewSource is not a function`。
  - focused project where 未按 `project:<projectId>:` 前缀构建。
- GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 15 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 113 项通过。
- 本地：`npm run build` 通过，路由表包含 `/projects`、`/review`、`/progress`。

## 生产验证

- 备用机远端代码备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint36-20260525-031522.tar.gz`。
- 已通过 `rsync` 同步到备用机 `118.25.15.72:/home/ubuntu/ai-learning-platform`，同步排除 `.git/`、`node_modules/`、`.next/`、`.env`、`.env.*`。
- 备用机远端目标测试：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 15 项通过。
- 备用机远端构建：`npm run build` 通过，路由表包含 `/projects`、`/review`、`/progress`。
- 应用容器：`docker restart ai-learning-platform` 后容器为 `Up`。
- 备用机本机 app health：`curl http://127.0.0.1:3102/api/health` 返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- 备用机 Nginx Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- 本地强制解析备用机 HTTP：`curl --noproxy '*' --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 当前真实 DNS：`learn.roky.chat` 仍解析到 `118.89.119.107`。
- 当前真实 HTTPS：`curl --noproxy '*' -I https://learn.roky.chat/api/health` 返回 `SSL connection timeout`；需要 DNS A 记录切换到 `118.25.15.72` 后补真实公网和 HTTPS 验收。
