# Sprint 11 Checkpoint

## 当前任务

- [√] RED 测试：`tests/unit/map-analytics.test.ts`
- [√] 服务层：`src/server/map/analytics.ts`
- [√] `/map` 页面接入完整指标
- [√] 本地验证
- [√] 生产部署与验收

## 证据

- RED：`npm test -- tests/unit/map-analytics.test.ts` 初次失败于缺少 `@/server/map/analytics`。
- GREEN：`npm test -- tests/unit/map-analytics.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 50 项通过。
- 本地：`npm run build` 通过。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint11-20260524-055051.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验收 `/map` 显示 `Sprint 11`、`ReviewLog`、`正确率`、`代码提交`、`相关错题`、`相关卡片`。
- 生产：Host-header 验收 `/map` 不再包含旧 mastery 公式。

## 风险

- `/map` 页面统计逻辑已抽到 `src/server/map/analytics.ts`。
- ReviewLog 没有 userId 字段，需要通过 Flashcard 归属关联到当前用户。
- 当前 Codex 运行环境公网 `https://learn.roky.chat` curl 可能超时，已使用生产机本机 Host-header 路径完成服务内容验收。
