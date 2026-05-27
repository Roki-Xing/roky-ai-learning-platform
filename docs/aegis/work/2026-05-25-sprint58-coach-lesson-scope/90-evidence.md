# Sprint 58 Evidence

## 本地验证

- RED：`npm test -- tests/unit/coach-submit.test.ts` 失败于 `createThoughtReview rejects explicit lesson ids outside the current user's visible plans` 未发生预期 rejection。
- GREEN：`npm test -- tests/unit/coach-submit.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 149 项通过。
- 本地：`npm run build` 通过（路由表包含 `/coach`）。

## 生产验证

- 备用机备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint58-20260525-231804.tar.gz`。
- 备用机远端：`npm test -- tests/unit/coach-submit.test.ts` 4 项通过。
- 备用机远端：`npm test -- tests/unit/projects.test.ts` 15 项通过。
- 备用机远端：`npm run build` 通过。
- 备用机远端：容器重启后 `http://127.0.0.1:3102/api/health` 返回 `{"ok":true,...}`。
- 备用机远端：Host-header `learn.roky.chat` health 返回 `{"ok":true,...}`。
- 本地强制解析：`learn.roky.chat:80 -> 118.25.15.72` 下 `/api/health` 返回 `200`。
- 本地强制解析：`learn.roky.chat:80 -> 118.25.15.72` 下 `/coach` 返回 `307` 到 `/login?next=%2Fcoach`（符合登录保护边界）。

## DNS 边界

- 当前真实 DNS 需部署后重新检查。
- DNS 切换前只能声明备用机 `118.25.15.72` 已部署。
- 备用机验收使用 `curl --resolve learn.roky.chat:80:118.25.15.72`，不得把强制解析结果说成真实公网 DNS 已切换。
