# Sprint 13 Evidence

## 本地验证

- RED：`npm test -- tests/unit/curriculum-explanation.test.ts` 初次失败于缺少 `@/server/curriculum/explain-decision`。
- `npm test -- tests/unit/curriculum-explanation.test.ts`：2 项通过。
- `npm test`：54 项通过。
- `npm run lint`：通过。
- `npm run build`：通过，路由表包含 `/today` 与 `/admin`。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint13-20260524-062249.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/curriculum-explanation.test.ts` 2 项通过。
- 生产：`npm run build` 通过。
- 生产：`sudo systemctl restart ai-learning-platform.service` 后服务为 `active`。
- 生产：内网 `http://127.0.0.1:3102/api/health` 返回 `{"ok":true,"service":"ai-learning-platform"}`。
- 生产：通过 Host-header 验证 `/today` 可见“为什么今天学这个”。
- 生产：通过临时 admin cookie 的 Host-header 验证 `/admin` 返回 200，并命中：
  - `最近 CurriculumDecision`
  - `查看 reason / scoreBreakdown`
  - `今天选择`
