# Sprint 54 Evidence

## 本地验证

- RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于 `summarizeQuizAccuracyTrend is not a function`。
- GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 11 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 143 项通过。
- 本地：`npm run build` 通过，路由表包含 `/progress`。

## 生产验证

- 备用机备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint54-20260525-072927.tar.gz`。
- 备用机 rsync 同步已完成。
- 备用机目标测试：`npm test -- tests/unit/progress-analytics.test.ts` 11 项通过。
- 备用机：`npm run build` 通过，路由表包含 `/progress`。
- 备用机容器：`docker restart ai-learning-platform` 后状态为 `ai-learning-platform Up 3 seconds`。
- 备用机内网：`http://127.0.0.1:3102/api/health` 返回 `{"ok":true,"service":"ai-learning-platform"}`。
- 备用机 Host-header：`Host: learn.roky.chat` 调用 `/api/health` 返回 `{"ok":true,"service":"ai-learning-platform"}`。
- 本地强制解析：`learn.roky.chat:80:118.25.15.72` 调用 `/api/health` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 本地强制解析：`learn.roky.chat:80:118.25.15.72` 调用 `/progress` 返回 `HTTP/1.1 307 Temporary Redirect` 到 `/login?next=%2Fprogress`，符合登录保护边界。

## DNS 边界

- 当前真实 DNS 仍解析到 `118.89.119.107`。
- DNS 切换前只能声明备用机 `118.25.15.72` 已部署，不能声明 `learn.roky.chat` 真实公网已命中新部署。
- 备用机验收使用 `curl --resolve learn.roky.chat:80:118.25.15.72`，不得把强制解析结果说成真实公网 DNS 已切换。
