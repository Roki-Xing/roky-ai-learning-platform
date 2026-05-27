# Sprint 45 Reflection

## What Changed

- `/today` 右侧复习区从静态占位升级为真实状态卡。
- 摘要逻辑集中在 `buildTodayReviewSummary()`，页面只负责查询和展示。
- 当前课程到期数和全局到期数分开展示，便于用户判断是复习今日课程还是进入总队列。

## What Stayed Stable

- 今日学习完成动作不变。
- 复习卡片创建和幂等边界不变。
- `/review` 队列筛选仍由 `buildReviewableFlashcardWhere()` 统一管理。

## Follow-up

- 若后续要进一步提升 `/today` 的复习体验，可以在完成学习后显示“先复习今日课程” focused queue；本切片未新增该 URL 参数，避免扩大复习队列契约。
