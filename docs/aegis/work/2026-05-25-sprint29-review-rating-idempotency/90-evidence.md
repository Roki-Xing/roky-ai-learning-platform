# Sprint 29 Evidence

## 本地验证

- RED：`npm test -- tests/unit/review-rating.test.ts` 初次失败于 `rateFlashcard is not a function`。
- GREEN：`npm test -- tests/unit/review-rating.test.ts` 1 项通过。
- GREEN：`npm test -- tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts tests/unit/review-filter.test.ts` 5 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 97 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 待补：`118.89.119.107` 恢复 SSH/HTTP 后执行生产备份、rsync、远端目标测试、build、service health 和 `/review` Host-header 验收。
- 当前阻塞：
  - `timeout 20 ssh -i ~/.ssh/Roky.pem ... ubuntu@118.89.119.107 "echo ssh-ok"` 失败：`Connection timed out during banner exchange`。
  - `curl -H "Host: learn.roky.chat" http://118.89.119.107/api/health` 失败：12 秒无响应。
  - 去掉本机代理后访问 `https://learn.roky.chat/api/health` 失败：SSL connection timeout。
  - `118.25.15.72` 可 SSH，且本机 `ai-learning-db` Postgres 容器可连通；但 `learn.roky.chat` DNS 当前仍解析到 `118.89.119.107`，第二台没有现成 `ai-learning-platform` app 目录和完整生产密钥配置。
  - 第二台以 `Host: learn.roky.chat` 请求本机 80 当前返回 nginx `502 Bad Gateway`，不是可直接承接生产的状态。
