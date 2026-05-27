# Sprint 19 Evidence

## 本地验证

- RED：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts` 初次失败于未避开最近使用 slug、缺少 `@/server/profile/settings`。
- 本地迁移：`npm run db:migrate:manual:knowledge-preferences` 通过。
- `npx prisma generate`：通过。
- `npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts`：7 项通过。
- `npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/knowledge-base.test.ts`：15 项通过。
- `npm test`：77 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint19-20260524-082430.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npm run db:migrate:manual:knowledge-preferences`：通过。
- `npx prisma generate`：通过。
- `npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts`：7 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- 生产 Prisma 只读确认 `preferredTermSlugs`、`preferredEntitySlugs`、`knowledgeAvoidDays` 字段可读。
- Host-header `/settings`：`每日术语偏好`、`每日 Radar 偏好`、`知识卡去重天数` 均 PASS。
- Host-header `/today`：`今日术语`、`今日广度`、`查看术语库`、`查看 Radar` 均 PASS。
