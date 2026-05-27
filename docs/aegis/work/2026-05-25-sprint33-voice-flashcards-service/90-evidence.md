# Sprint 33 Evidence

## 本地验证

- RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `generateVoiceNoteFlashcards is not a function`。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts` 9 项通过。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/review-filter.test.ts` 24 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 106 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 当前阻塞已复核：
  - SSH：`Connection timed out during banner exchange`。
  - 直连 HTTPS：`https://learn.roky.chat/api/health` 返回 `SSL connection timeout`。
  - Host-header HTTP：`http://118.89.119.107/api/health` 12 秒无响应。
  - `--resolve learn.roky.chat:443:118.89.119.107` 仍为 `SSL connection timeout`。
- 备用机 `118.25.15.72` 已作为临时接管目标部署：
  - 代码已同步到 `/home/ubuntu/ai-learning-platform`。
  - 私有环境文件 `.env.production` 已生成，权限 `600`；未写入仓库，未打印密钥。
  - 使用 `node:22-bookworm` 容器构建和运行，避免修改备用机全局 Node v18。
  - 备用库基础 Prisma migration 状态：`Database schema is up to date!`。
  - 已执行剩余手工迁移脚本和 `npm run db:seed`；旧 `20260522_localdate_timezone.sql` 因测试历史重复数据触发全局唯一保护，且备用库已具备后续治理用部分唯一索引，已跳过。
  - 远端目标测试：`npm test -- tests/unit/review-rating.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/voice-submit.test.ts` 12 项通过。
  - 远端构建：`npm run build` 通过。
  - 应用容器：`ai-learning-platform` 已启动，监听 `127.0.0.1:3102`。
  - 本机 health：`http://127.0.0.1:3102/api/health` 返回 `ok`。
  - Nginx 容器已新增 `learn.roky.chat` 专用 HTTP server block，转发到 `127.0.0.1:3102`。
  - 备用机 Host-header health：`curl -H "Host: learn.roky.chat" http://127.0.0.1/api/health` 返回 `ok`。
  - 本地强制解析验证：`curl --resolve learn.roky.chat:80:118.25.15.72 http://learn.roky.chat/api/health` 返回 `ok`。
  - 本地强制解析 `/voice`：返回 `307 /login?next=%2Fvoice`，符合生产鉴权策略。
- 待补：DNS A 记录仍指向 `118.89.119.107`；需要切到 `118.25.15.72` 后补真实公网域名和 HTTPS 验收。
