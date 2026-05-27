# Sprint 51 Reflection

## What Changed

- `/map` 顶部新增“偏弱领域 / 复习欠账 / 代码练习少 / 下一步补哪里”摘要卡。
- `buildKnowledgeMapInsights()` 从真实领域指标生成弱点、复习欠账、代码练习缺口和下一步补弱建议。
- 摘要卡可直接进入对应领域详情。

## What Stayed Stable

- masteryScore 公式不变。
- Planner 选题评分不变。
- 生成链路不变。
- 数据模型不变。
- 密钥只在服务端环境变量中读取，未进入页面或文档。

## Follow-up

- 后续可继续 Phase 7 `/progress`：把 weak domain list 和 generation quality stats 做成更完整的长期趋势视图。
