# Sprint 18 Reflection

## What Changed

- 每日学习计划现在有稳定的“广度轮转”来源：术语、人物、公司/实验室、Benchmark、论文、工具/开源项目、周复盘。
- 今日术语和今日广度小卡优先来自真实 `GlossaryTerm` / `KnowledgeEntity`，而不是仅依赖生成模板。
- `Lesson.connections.knowledgeFocus` 记录 rotation 和详情链接，后续 `/today`、`/library`、`/map` 可复用。

## Verification Notes

- 单元测试覆盖 rotation、真实记录选择、卡片覆盖和 glossary fallback 链接边界。
- 集成测试覆盖 `getOrCreateTodayPlan()` 写入 `lesson.connections` 的真实链接。
- 本地全量门禁通过后再部署。

## Follow-Up

- 可在后续 Sprint 里增加“最近 7 天不要重复同一知识实体”的选择规则。
- 可把 weekly rotation 和 preferred entity type 暴露到 `/settings`。
