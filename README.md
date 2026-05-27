这是一个基于 [Next.js](https://nextjs.org)（App Router）的个人化 AI 学习平台（MVP 骨架）。

目标是做一个“AI 学习广度 + 深度 + 长期积累”的系统：每日学习（/today）+ 复习（/review）+ 知识地图（/map）+ 课程库（/library）+ 笔记（/notes）+ 进度（/progress）+ 设置（/settings）。

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

- 已生成页面路由：`/today /review /map /library /notes /progress /settings /admin`
- UI：已初始化 `shadcn/ui`（Radix Nova 风格），并加入常用组件
- Prisma：已提供 `prisma/schema.prisma`（与文档的模型一致）
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

## 部署（两台服务器建议）

- 网关机（118.89.119.107）：Nginx 网关 + Next.js 应用容器
- 应用机（118.25.15.72）：Postgres（docker compose）+（可选）worker/cron

最终通过子域名访问（例如 `learn.roky.chat`）。HTTPS 证书需要包含该子域名（推荐 wildcard `*.roky.chat`，走 DNS-01）。
