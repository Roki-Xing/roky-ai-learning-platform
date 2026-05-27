# Sprint 43 Reflection

## What Changed

- Radar 的可信度状态从隐含字段变成显式服务层规则。
- 缺少来源或缺少验证日期的实体不会被静默展示为普通实体，而是标记为 `needs_verification`。
- 由 Radar 生成的复习卡片会携带验证状态和 confidence tag，后续复习、过滤或审计可以继续使用该信号。

## What Stayed Stable

- 没有新增 schema 或 migration。
- 没有改变 Radar seed 策略。
- 没有执行用户提交代码。
- 没有暴露任何 secret。

## Follow-up

- 后续做 AI Radar 自动更新时，生成或导入实体必须同时写入 `sourceRefs`、`lastVerifiedAt` 和 `confidence`。
- 如果未来接入外部检索，应把来源抓取、可信度评估、人工确认拆成独立流水线，不直接覆盖现有实体。
