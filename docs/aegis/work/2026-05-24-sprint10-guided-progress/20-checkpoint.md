# Sprint 10 Checkpoint

## 当前任务

- [√] RED 测试：`tests/unit/guided-progress.test.ts`
- [√] Schema + manual migration：`DailyPlan.guidedProgress`
- [√] 服务层：`src/server/lesson/guided-progress.ts`
- [√] `/today` action 与 UI 接入
- [√] 本地验证
- [√] 生产部署与验收

## 证据

- RED：`npm test -- tests/unit/guided-progress.test.ts` 初次失败于缺少 `@/server/lesson/guided-progress`。
- GREEN：`npm test -- tests/unit/guided-progress.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 47 项通过。
- 本地：`npm run build` 通过。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint10-20260524-052356.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:guided-progress`、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，`/api/health` 返回 `ok`。
- 生产：只读 DB 检查 `DailyPlan.guidedProgress` 字段存在。
- 生产：Host-header 验收 `/today` 显示 `Sprint 10`、`保存进度`、`已同步`，且不含“刷新会丢失”。

## 风险

- 生产数据库手动迁移已执行。
- Server Action 必须校验当前用户拥有目标 DailyPlan。
- 当前 Codex 运行环境公网 `https://learn.roky.chat` curl 超时，已使用生产机本机 Host-header 路径完成服务内容验收。
