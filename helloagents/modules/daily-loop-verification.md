# Daily Loop Verification

## 当前行为

- `runDailyLoopVerification()` 是每日学习闭环的服务层验收入口。
- `/today` 右侧“今日复习入口”展示当前课程卡片、当前课程到期卡片和全部到期卡片。
- 验收链路覆盖：
  - 创建或读取今日正式 active DailyPlan。
  - 保存 guided learning progress。
  - 提交第一道测验并写入 QuizAttempt。
  - 提交代码文本，生成 CodeSubmission、CodeFeedback 和代码反馈卡片。
  - 完成 DailyPlan，生成 lesson flashcards。
  - 读取 due review queue。
  - 对第一张 due card 评分并写入 ReviewLog。
  - 查询 progress 依赖的核心计数。

## 命令

```bash
npm run verify:daily-loop
```

可选环境变量：

```bash
DAILY_LOOP_USER_ID="loop-verifier-manual"
DAILY_LOOP_NOW="2026-05-25T04:00:00.000Z"
```

## 安全约束

- 不执行用户提交代码。
- 不输出或读取任何 API key。
- 默认使用唯一 `loop-verifier-*` userId，不污染 demo-user。
- 不自动删除验收数据，便于部署排查。

## 验证

- 单元测试：`npm test -- tests/unit/daily-usability-loop.test.ts`。
- 今日复习入口摘要：`npm test -- tests/unit/today-review-summary.test.ts`。
- 发布前门禁：`npm run verify:daily-loop`。
