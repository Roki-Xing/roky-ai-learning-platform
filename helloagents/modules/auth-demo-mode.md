# Auth and Demo Mode

## 状态

已上线并完成生产验收。

## 用户流程

1. 未登录访问学习数据页会跳转到 `/login?next=...`。
2. 如果服务器配置了 `LOGIN_PASSWORD`，用户可直接输入访问密码登录，不需要邮箱。
3. 配置 Supabase 后，用户仍可通过邮箱 Magic Link 登录。
4. 未配置 Supabase 时，`/login` 不显示邮箱表单，而是明确提示当前服务器未启用邮箱 Magic Link。
5. 只有在显式允许 Demo 模式时，登录页才显示“进入 Demo 模式”。
6. Preview 入口继续用于只读验收：`/preview?token=...&next=/today`。
7. 访问密码模式会设置 httpOnly `ral_password` cookie，并把当前用户态映射到共享 `demo-user` 数据。
8. 所有学习数据写入仍通过 `requireUserId()` 获取当前用户并按 `userId` 过滤。
9. 登录页三类主要 CTA（`用访问密码进入`、`发送登录链接`、`进入 Demo 模式`）在手机端保持全宽大触控目标。
10. 登录页访问密码输入框和邮箱输入框在手机端保持至少 44px 触控高度。

## 重要约束

- 生产环境不会隐式 fallback 到 `demo-user`。
- 未配置 Supabase 时，生产登录页不会再误导用户输入邮箱。
- 生产环境只有设置 `ALLOW_DEMO_USER=true` 时才显示 Demo 入口。
- 生产环境如果设置 `LOGIN_PASSWORD`，应优先把它作为“直接可用”的主登录方式。
- `/admin` 不依赖 Supabase 登录，继续由 `ADMIN_SECRET` 和 admin cookie 保护。
- Demo cookie 不是长期鉴权方案，只用于开发和临时演示。
- 如果生产容器在创建时就注入了 `ALLOW_DEMO_USER` / `LOGIN_PASSWORD`，修改 `.env.production` 后必须重建容器，单纯 restart 不会刷新旧 env。
- 密钥、数据库连接串、Supabase key 不写入知识库。

## Read-only Preview Mode

- `/preview?token=...&next=/today` 校验 `PREVIEW_TOKEN` 后设置 httpOnly `ral_preview=1`。
- Preview 使用 `demo-user` 读取真实学习数据，但所有写操作必须调用 `assertWritableRequest()` 并拒绝执行。
- Preview 下 `/admin` 直接 404，admin server actions 也会拒绝。
- `AppShell` 在 Preview 下显示黄色只读提示条，说明保存、生成、提交和管理操作都会被拒绝。
- Preview token 只允许放在服务端环境变量，不写入 README、知识库或提交记录。

## 本地验收

- `npm test -- tests/unit/login-page-ui.test.ts`：2 项通过，覆盖登录页 CTA 和访问密码/邮箱输入框移动端触控目标。
- `npm test -- tests/unit/login-page-ui.test.ts tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：38 项通过，覆盖登录页输入/CTA、访问密码、Auth/Preview 路由策略和共享学习 UI。
- `npm test`：33 项通过（历史全量记录）。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验收

- 真实承载机为 `118.25.15.72`，运行方式是 Docker 容器 `ai-learning-platform`，不是 `118.89.119.107` 上那条失效 systemd 服务。
- 生产：相关登录单测和 `npm run build` 已在容器环境通过。
- 生产：内网与公网 `/api/health` 均返回 `ok`。
- 线上：未登录访问 `/today` 仍会跳转到 `/login?next=%2Ftoday`。
- 线上：`/login?next=/today` 显示“访问密码”和“用访问密码进入”，不再显示“进入 Demo 模式”。
- Playwright：输入访问密码后成功进入 `/today`，页面没有 `Preview Mode` 只读提示。
