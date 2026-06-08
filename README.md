这是一个基于 [Next.js](https://nextjs.org)（App Router）的个人化 AI 学习平台。

目标是做一个“AI 学习广度 + 深度 + 长期积累”的系统：每日学习（/today）+ 复习（/review）+ 知识地图（/map）+ 课程库（/library）+ 笔记（/notes）+ 进度（/progress）+ 设置（/settings）。

当前能力（已实现）：

- DeepSeek 结构化生成每日课程与卡片（默认 Provider）
- 今日学习闭环：生成 → 学习 → 完成 → 生成卡片 → 进入复习
- Review（记忆训练器）：主动回忆、键盘快捷键、会话进度与统计
- Coach（思路评审）：结构化反馈 + 可生成复习卡片 + 右侧上下文
- Voice Note（语音笔记）：录音/上传 → 服务端转写（可选）→ 自动填 transcript → 一键送 Coach/存 Note/生成卡片
- Glossary / Radar：术语库与实体库 + 复习卡片生成 + 探索路径/关系卡
- Projects：项目实践（里程碑、草稿、AI 代码评审、任务感 UI）
- Knowledge Map：领域/主题统计、masteryScore、进度条、下一步建议
- Read-only Preview：`/preview?token=...` 使用 demo-user 只读数据，拒绝生成、保存、提交和 admin 操作
- Learning UX Polish：首页 Next Best Action、登录页产品入口、主课 Markdown/GFM 渲染、Today Focus Mode、Voice 录音计时器
- Manual migrations：以 `prisma/manual-migrations/*.sql` 管理历史库演进

## Getting Started

1. 安装依赖：

```bash
npm install
```

2. 准备环境变量（本地开发示例）：

```bash
cp .env.example .env
```

3. 启动开发服务器：

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 当前状态

- 页面路由：`/today /review /map /library /notes /progress /settings /admin /coach /voice /glossary /radar /projects`
- UI：已初始化 `shadcn/ui`（Radix Nova 风格），并加入常用组件
- Prisma：以 `prisma/schema.prisma` 为准
- 健康检查：`GET /api/health`

## 数据库

本项目使用 PostgreSQL + Prisma，并支持 Supabase Auth（魔法链接登录）。

本地如果暂时没有 Postgres，可以先只跑前端页面；接入数据库后再执行迁移与 seed。

### 生产/已有库升级（Sprint 1.1：timeZone + localDate）

本项目在开发过程中做过一次**手工 DDL**（为了解决 `localDate/timeZone` 与历史 migration 不一致的问题）。

如果你的数据库里还没有以下字段/约束：

- `UserProfile.timeZone`（默认 `Asia/Shanghai`）
- `DailyPlan.localDate`（`YYYY-MM-DD`，并且 `@@unique([userId, localDate])`）

可以直接执行本仓库内的手工迁移脚本（可重复执行）：

```bash
npm run db:migrate:manual:localdate-timezone
```

说明：

- 该命令依赖 `DATABASE_URL` 指向目标 Postgres。
- 如果你的库里已经存在列/索引，脚本会自动跳过（`IF NOT EXISTS`）。
- 如果你的库里存在同一天重复的 `DailyPlan (userId, localDate)`，脚本会报错并中止，需要先人工处理重复数据。

### 生产/已有库升级（Sprint 2.1：CodeSubmission）

为了支持 `/today` 的“代码练习提交（仅保存，不执行）”，本项目新增了 `CodeSubmission` 表（手工 DDL，可重复执行）：

```bash
npm run db:migrate:manual:code-submission
```

说明：

- 该命令依赖 `DATABASE_URL` 指向目标 Postgres。
- 若你的库已存在该表/索引，会自动跳过（`IF NOT EXISTS`）。

### Supabase Auth（可选）

环境变量（至少二选一）：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

并设置站点地址用于邮件跳转：

- `NEXT_PUBLIC_SITE_URL`（例如本地 `http://localhost:3000`，线上 `https://learn.roky.chat`）

登录入口：`/login`（邮箱魔法链接），回跳：`/auth/confirm`。

如果当前服务器还没配置 Supabase，登录页会直接提示“当前服务器未启用邮箱 Magic Link”；此时应通过 Demo 模式或 Preview 链接体验，而不是继续输入邮箱。

## 部署（两台服务器建议）

- 网关机（118.89.119.107）：Nginx 网关 + Next.js 应用容器
- 应用机（118.25.15.72）：Postgres（docker compose）+（可选）worker/cron

最终通过子域名访问（例如 `learn.roky.chat`）。HTTPS 证书需要包含该子域名（推荐 wildcard `*.roky.chat`，走 DNS-01）。

部署和页面验收请参考：

- `docs/deploy-checklist.md`
- `docs/ui-review-checklist.md`
