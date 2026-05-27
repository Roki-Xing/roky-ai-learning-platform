# Sprint 57 Evidence

## 本地验证

- RED：`npm test -- tests/unit/voice-submit.test.ts` 失败于 `saveVoiceNote rejects explicit lesson ids outside the current user's visible plans` 未发生预期 rejection。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 148 项通过。
- 本地：`npm run build` 通过，路由表包含 `/voice`。

## 生产验证

- 备用机备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint57-20260525-080755.tar.gz`。
- 备用机同步：已通过 `rsync` 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform/`，排除 `.git`、`node_modules`、`.next`、`.env`、`.env.*`。
- 备用机目标测试：`docker exec ai-learning-platform sh -lc "cd /app && npm test -- tests/unit/voice-submit.test.ts && npm run build"` 中 `tests/unit/voice-submit.test.ts` 10 项通过。
- 备用机构建：同一命令内 `npm run build` 通过，路由表包含 `/voice`。
- 备用机重启：`docker restart ai-learning-platform` 后容器状态为 `ai-learning-platform Up 3 seconds`。
- 备用机 health：`http://127.0.0.1:3102/api/health` 返回 `{"ok":true,"service":"ai-learning-platform"}`。
- 备用机 Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `{"ok":true,"service":"ai-learning-platform"}`。
- 本地强制解析 health：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 本地强制解析 `/voice`：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/voice` 返回 `HTTP/1.1 307 Temporary Redirect` 到 `/login?next=%2Fvoice`，符合登录保护边界。

## DNS 边界

- 当前真实 DNS 仍指向 `118.89.119.107`。
- DNS 切换前只能声明备用机 `118.25.15.72` 已部署。
- 备用机验收使用 `curl --resolve learn.roky.chat:80:118.25.15.72`，不得把强制解析结果说成真实公网 DNS 已切换。
