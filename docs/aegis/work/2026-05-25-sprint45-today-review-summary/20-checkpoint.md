# Sprint 45 Today Review Summary - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖今日复习入口摘要口径。
- [√] 新增 `src/server/review/today-summary.ts`。
- [√] `/today` 移除 `PlaceholderCard` 复习区。
- [√] `/today` 展示今日课程卡片数、今日课程到期数和全部到期数。
- [√] 未完成时禁用“完成后生成卡片” CTA。
- [√] 已完成时显示“去复习” CTA。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。

## Drift Check

- 未新增数据库字段或 migration。
- 未改变 `completeTodayAction`、`completeTodayPlan` 或 flashcard 创建逻辑。
- 未改变 `/review` 的队列和评分行为。
- 未读写任何 API key、secret 或生产环境变量。
