# Sprint 47 Reflection

## What Changed

- `/review` 没有到期卡片时，用户能看到明确的下一步入口。
- 默认队列引导回 `/today`、`/library`、`/progress`。
- project/code-feedback focused queue 保留项目上下文，避免用户从专属队列迷路。

## What Stayed Stable

- 卡片揭示、评分按钮和 1/3/7/14 天调度不变。
- 复习统计和队列范围说明不变。
- 登录保护和 user scope 不变。

## Follow-up

- 后续如果要进一步优化，可以增加“查看全部队列中未来到期卡片”的预览；本切片只处理当前空状态下一步建议。
