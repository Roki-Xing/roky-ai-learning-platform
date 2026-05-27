# Sprint 11: Knowledge Map Analytics

## 目标

按照长期开发文档补齐 `/map` 真实知识地图 MVP，让领域和主题指标包含 quiz、code、reviewLog、misconception，并使用文档定义的 masteryScore。

## 范围

- 抽出 `src/server/map/analytics.ts` 作为知识地图指标聚合服务。
- `/map` 展示真实领域指标：完成、计划、卡片、到期、复习、测验、正确率、代码提交、错题、最近学习、masteryScore。
- 领域详情展示相关课程、笔记、错题和关键指标。

## 非目标

- 不做复杂图谱可视化。
- 不新增新的持久化模型。
- 不改变 DailyPlan 生成、Review、Quiz、CodeSubmission 的写入逻辑。

## 验收

- `npm test -- tests/unit/map-analytics.test.ts` 通过。
- `/map` 不再以旧公式展示 masteryScore。
- `/map` 可见 quiz/code/misconception/reviewLog 指标。
- 本地 `npm test`、`npm run lint`、`npm run build` 通过。
