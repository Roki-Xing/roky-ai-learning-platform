# Sprint 22 Reflection

## What Changed

- `createThoughtReview()` 现在会把关联课程 ThoughtReview 中 high severity `possibleIssues` 自动沉淀为 `Misconception(source="coach")`。
- Coach 误区使用 stable sourceKey：`coach:{reviewId}:{issueIndex}`，重复处理不会创建重复记录。
- 每个 Coach 误区会携带 lesson/topic/localDate，并把对应 `UserTopicState` 的 exposure 与 weakness 分数上调。

## Verification Notes

- RED 测试先证明旧行为缺失。
- GREEN 后目标测试和 Coach context/progress/map 相邻回归通过。
- 本地完整 gate 和生产 gate 均通过。

## Follow-Up

- 后续可在 `/coach` UI 上显示“已沉淀误区”数量，帮助用户知道哪些思路问题已经进入长期复习和生成信号。
- 如果未来允许无课程自由评审沉淀误区，需要先调整 `Misconception.lessonId` 必填约束或引入独立 ThoughtReviewIssue 模型。
