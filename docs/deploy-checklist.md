# Deploy Checklist

## 目标入口

- 生产学习平台入口：`https://learn.roky.chat`
- 不要把 `https://roky.chat/` 根路径当成学习平台入口；根域名可以承载别的站点或网关首页。

## 上线前确认

- 确认本次要上线的 commit 已 push 到目标分支。
- 确认目标机器和域名映射：
  - 公网 HTTPS 网关：`198.10.0.92`，`learn.roky.chat` 当前 DNS 指向这里。
  - 应用机：`118.25.15.72`，运行 Docker 容器 `ai-learning-platform`。
  - 应用目录：`/home/ubuntu/ai-learning-platform`，容器挂载为 `/app`。
  - 内部监听：`127.0.0.1:3102`。
  - `118.89.119.107` 是旧拓扑/历史机器，部署前不要优先当作当前真实承载机。
- 确认服务环境变量已存在且没有占位值：
  - 必需：`DATABASE_URL`、`CRON_SECRET`
  - 常用：`ADMIN_SECRET`、`DEEPSEEK_API_KEY`、`LOGIN_PASSWORD`、`ALLOW_DEMO_USER`、`PREVIEW_TOKEN`
  - 如果要启用真实邮箱登录，还必须有：
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - 推荐：`NEXT_PUBLIC_SITE_URL=https://learn.roky.chat`
- 如果目标机使用 Docker 容器直接注入环境变量，而不是每次启动都重新读 `.env.production`：
  - 修改登录类 env 后必须重建容器
  - 只做 `docker stop && docker start` 不会刷新旧的容器环境变量

## 部署步骤

1. `git pull`
2. `npm ci`
3. `npm run prisma:generate`
4. 按需执行手工迁移
5. `npm run audit:routes`
6. `npm run audit:learning`
7. `npm run lint`
8. `npm test`
9. `npm run build`
10. 如果生产承载机是 Docker：
   - 当前常用方式是在 `118.25.15.72` 的现有容器内构建，再 `docker restart ai-learning-platform`
   - 修改登录类 env 后必须用原始挂载、网络和 env 重建容器，单纯 restart 不会刷新旧 env
11. `curl https://learn.roky.chat/api/health`
12. 打开 `https://learn.roky.chat/login`

## 手工迁移清单

- `npm run db:migrate:manual:localdate-timezone` / `20260522_localdate_timezone.sql`
- `npm run db:migrate:manual:code-submission` / `20260523_code_submission.sql`
- `npm run db:migrate:manual:data-governance` / `20260524_data_governance_curriculum.sql`
- `npm run db:migrate:manual:learning-feedback` / `20260524_learning_feedback.sql`
- `npm run db:migrate:manual:code-feedback-structured` / `20260524_code_feedback_structured.sql`
- `npm run db:migrate:manual:thought-review` / `20260524_thought_review.sql`
- `npm run db:migrate:manual:voice-note` / `20260524_voice_note.sql`
- `npm run db:migrate:manual:glossary-radar` / `20260524_glossary_radar.sql`
- `npm run db:migrate:manual:knowledge-preferences` / `20260524_knowledge_preferences.sql`
- `npm run db:migrate:manual:learning-projects` / `20260524_learning_projects.sql`
- `npm run db:migrate:manual:guided-progress` / `20260524_guided_progress.sql`
- `npm run db:migrate:manual:project-milestone-code-submission` / `20260525_project_milestone_code_submission.sql`

## 登录验收

- 打开 `https://learn.roky.chat/login`
- 如果服务器配置了 `LOGIN_PASSWORD`：
  - 登录页应显示“访问密码”
  - 页面应显示“用访问密码进入”
  - 输入正确密码后应直接进入 `/today`
  - 登录后的页面不应出现 `Preview Mode` 只读提示
- 如果服务器没有配置 Supabase：
  - 登录页不应展示邮箱输入框
  - 如果同时也没配置 `LOGIN_PASSWORD`，页面应明确提示当前服务器未启用邮箱 Magic Link
  - 只有在 `ALLOW_DEMO_USER=true` 时才应出现“进入 Demo 模式”
- 如果服务器已经配置 Supabase：
  - 登录页应显示邮箱表单
  - 输入邮箱后应提示已发送登录链接
  - 邮件回跳地址应落到 `/auth/confirm`

## Preview 验收

- 用 `https://learn.roky.chat/preview?token=...&next=/today` 进入只读预览
- 必看页面：
  - `/`
  - `/today`
  - `/review`
  - `/coach`
  - `/voice`
  - `/map`
  - `/glossary`
  - `/radar`
  - `/projects`
  - `/path`
  - `/weekly`
  - `/mistakes`
  - `/progress`
  - `/settings`
- 必验只读边界：
  - 生成
  - 保存
  - 提交
  - admin 操作
  - 上述操作在 Preview 下都应该被拒绝

## 最短可用路径

- 如果你只是想马上用起来，而不是立刻打通真实邮箱登录：
  - 直接打开 `https://learn.roky.chat/login`
  - 优先输入访问密码进入
  - 只有明确需要临时公开演示时，才打开 Demo 模式
- 如果你要做线上 UI 验收：
  - 优先走 Preview 链接，不要直接在生产数据上做写操作验收
