# Auth and Demo Mode

## 状态

已上线并完成生产验收。

## 用户流程

1. 未登录访问学习数据页会跳转到 `/login?next=...`。
2. 配置 Supabase 后，用户可通过邮箱 Magic Link 登录。
3. 未配置 Supabase 或演示场景下，可在允许 Demo 模式时点击“进入 Demo 模式”。
4. Demo 模式会设置 httpOnly `ral_demo` cookie，并使用 `demo-user`。
5. 所有学习数据写入仍通过 `requireUserId()` 获取当前用户并按 `userId` 过滤。

## 重要约束

- 生产环境不会隐式 fallback 到 `demo-user`。
- 生产环境只有设置 `ALLOW_DEMO_USER=true` 时才显示 Demo 入口。
- `/admin` 不依赖 Supabase 登录，继续由 `ADMIN_SECRET` 和 admin cookie 保护。
- Demo cookie 不是长期鉴权方案，只用于开发和临时演示。
- 密钥、数据库连接串、Supabase key 不写入知识库。

## Read-only Preview Mode

- `/preview?token=...&next=/today` 校验 `PREVIEW_TOKEN` 后设置 httpOnly `ral_preview=1`。
- Preview 使用 `demo-user` 读取真实学习数据，但所有写操作必须调用 `assertWritableRequest()` 并拒绝执行。
- Preview 下 `/admin` 直接 404，admin server actions 也会拒绝。
- `AppShell` 在 Preview 下显示黄色只读提示条，说明保存、生成、提交和管理操作都会被拒绝。
- Preview token 只允许放在服务端环境变量，不写入 README、知识库或提交记录。

## 本地验收

- `npm test`：33 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验收

- 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint7-20260524-042549.tar.gz`。
- 生产：`ALLOW_DEMO_USER=true` 已显式写入 systemd 环境文件。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`，内网 `/api/health` 返回 `ok`。
- 线上：未登录访问 `/today` 返回 `307 Location: /login?next=%2Ftoday`。
- 线上：未登录访问 `/api/me` 返回 `307 Location: /login?next=%2Fapi%2Fme`。
- 线上：`/login?next=/today` 显示“进入 Demo 模式”。
- Playwright：点击“进入 Demo 模式”后成功进入 `/today`。
