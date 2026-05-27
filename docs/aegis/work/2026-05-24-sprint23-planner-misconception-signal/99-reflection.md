# Sprint 23 Reflection

## What Changed

- `scoreTopicCandidates()` 新增 `activeMisconceptionCountByDomain` 输入，并把它转换成 `misconceptionScore`。
- `selectNextTopic()` 现在直接读取当前用户 open/active `Misconception`，通过 `topicId` 或 `lessonId` 映射到 domain。
- `explainCurriculumDecision()` 新增“活跃误区”信号，`/today` 的选题解释可以显示错误和 Coach 误区为什么影响了今天的选题。

## Verification Notes

- RED 测试分别覆盖评分层、DB 服务层和解释层缺口。
- GREEN 后目标测试组合通过。
- 本地完整 gate 和生产 gate 均通过。

## Follow-Up

- 下一步可把 `CurriculumDecisionLog.inputSnapshot` 中的 misconception domain counts 显式展开，方便 `/admin` 排查为什么某个领域被补弱点。
- 后续也可以让 resolved misconception 降低相关领域弱点权重，但当前先只读取 open/active。
