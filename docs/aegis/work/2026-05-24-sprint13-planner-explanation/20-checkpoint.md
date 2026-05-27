# Sprint 13 Checkpoint

## Todo

- [√] 建立 Sprint 13 工作记录与基线读集
- [√] 为选题解释服务写 RED 测试
- [√] 实现解释服务并接入 `/today`、`/admin`
- [√] 更新知识库与变更记录
- [√] 运行本地测试、lint、build
- [√] 同步生产、重启服务并验收

## Current Slice

完成，等待下一 Sprint。

## Evidence Refs

- RED：`npm test -- tests/unit/curriculum-explanation.test.ts` 初次失败于缺少 `@/server/curriculum/explain-decision`。
- GREEN：`npm test -- tests/unit/curriculum-explanation.test.ts` 2 项通过。
- 本地：`npm test` 54 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint13-20260524-062249.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm test -- tests/unit/curriculum-explanation.test.ts`、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：`/today` Host-header 验证命中“为什么今天学这个”。
- 生产：`/admin` 临时 admin cookie 验证返回 200，命中“最近 CurriculumDecision”、“查看 reason / scoreBreakdown”和“今天选择”。

## Drift Check

- 当前工作仍服务 Sprint 13 目标。
- 无数据库迁移。
- 无新权限边界。
- 选题评分公式未改变，只新增解释层和展示层。
- 生产验收使用服务器本机 Host-header，不依赖外部 DNS 链路。
