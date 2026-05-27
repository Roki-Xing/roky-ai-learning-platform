# Sprint 23 Evidence

## 本地验证

- RED：`npm test -- tests/unit/curriculum-scoring.test.ts` 初次失败于 active misconception 没有提高 `python-coding` 排名。
- RED：`npm test -- tests/unit/curriculum-select-next-topic.test.ts` 初次失败，`selectNextTopic()` 选中 `llm-engineering` 而不是带 open misconception 的 `python-coding`。
- RED：`npm test -- tests/unit/curriculum-explanation.test.ts` 初次失败于缺少 `misconception` active signal。
- GREEN：`npm test -- tests/unit/curriculum-explanation.test.ts tests/unit/curriculum-scoring.test.ts tests/unit/curriculum-select-next-topic.test.ts` 8 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 85 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint23-20260524-233627.tar.gz`。
- 生产：已通过 `rsync` 同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`，排除了 `.git/`、`node_modules/`、`.next/` 和 `.env*`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/curriculum-explanation.test.ts tests/unit/curriculum-scoring.test.ts tests/unit/curriculum-select-next-topic.test.ts` 8 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/today` 可见 `为什么今天学这个` 与 `今日主课`。
- 生产：Host-header 验证 `/progress` 可见 `错题` 与 `思路评审`。
- 生产：Host-header 验证 `/map` 可见 `知识地图` 与 `错题`。
