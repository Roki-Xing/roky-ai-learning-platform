# Sprint 41 Checkpoint

## Scope

- 新增每日学习闭环服务层 verifier。
- 新增一条覆盖完整学习链路的单元验收测试。
- 新增 CLI 验收脚本，供本地和容器内快速运行。

## Key Decisions

- 不引入 Playwright：当前目标是先验证数据和服务闭环，避免浏览器依赖成为部署门槛。
- 使用正式 active DailyPlan：`submitQuizAttempt()` 和 `submitCodeForReview()` 的当前业务规则只允许正式 active lesson，verifier 应覆盖同一条路径。
- 保留 verifier 数据：不自动清除，方便线上排查；用唯一 `loop-verifier-*` userId 隔离。

## Expected Checks

- `npm test -- tests/unit/daily-usability-loop.test.ts`
- `npm run verify:daily-loop`
- `npm run lint`
- `npm test`
- `npm run build`
