# Sprint 12 Checkpoint

## 当前任务

- [√] RED 测试：Planner 消费 map weakness
- [√] Scoring：加入 `mapWeaknessByDomain`
- [√] Selector：从真实数据生成 map weakness
- [√] 本地验证
- [√] 生产部署与验收

## 证据

- RED：`npm test -- tests/unit/curriculum-scoring.test.ts` 初次失败，Planner 未使用 `mapWeaknessByDomain`。
- GREEN：`npm test -- tests/unit/curriculum-scoring.test.ts` 3 项通过。
- 本地：`npm test` 52 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint12-20260524-060502.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm test -- tests/unit/curriculum-scoring.test.ts`、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。

## 风险

- 补弱权重不能压过最近 7 天 topic 去重规则。
- 同 domain 最近 3 天重复仍应只在 weakness 明显时放行。
- 已用单元测试覆盖 map weakness 不覆盖最近 7 天 topic 去重。
