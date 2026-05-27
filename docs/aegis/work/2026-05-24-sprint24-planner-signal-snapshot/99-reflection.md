# Sprint 24 Reflection

## What Changed

- `CurriculumDecision` 现在携带 `signalSnapshot`，包括最近学习、完成数、到期卡、hard review、错题、活跃误区、知识地图弱点和近 7 天代码提交数。
- `scoreTopicCandidates()` 在每个决策中输出该快照，`selectNextTopic()` fallback 也返回同结构空快照。
- `getOrCreateTodayPlan()` 通过既有 `CurriculumDecisionLog.inputSnapshot.decision` 自然持久化快照，不需要数据库迁移。
- `buildDailyPlanMessages()` 现在显式把 `Planner signal snapshot` 写入 DeepSeek prompt，让生成内容可以根据误区、复习压力和代码练习频率调整重点。
- `generate-daily-plan.ts` 的 prompt helper 可被单测安全导入，DeepSeek 和 DB 只在真实调用路径动态加载。

## Verification Notes

- 目标测试覆盖了 scoring 输出、daily plan 决策日志持久化和 prompt 文本。
- 纯 prompt helper 的 env 顶层耦合已用单测锁住。
- 完整 lint/test/build 已通过；生产目标测试、build、service health 和 Host-header 页面验收已通过。

## Follow-Up

- `/admin` 可以进一步把 `signalSnapshot` 做成折叠摘要，帮助解释每次选题。
- 后续可在 prompt 中把高权重 signal 转成更短的自然语言摘要，减少 token 占用。
