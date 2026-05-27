# 项目上下文

Roky Learn 是一个面向 AI、算法、代码能力和行业广度的每日学习系统。当前使用 Next.js App Router、Prisma、PostgreSQL 和 DeepSeek 结构化生成，默认 demo 用户为 `demo-user`。

## 当前主线

- Sprint 1：每日学习闭环。
- Sprint 2：DeepSeek 结构化生成和交互学习。
- Sprint 3：Coach 文本思路评审。
- Sprint 4：Voice Note MVP。
- Sprint 5：术语库和 AI Radar。
- Sprint 6：项目实践与算法代码长期训练。
- Sprint 7：鉴权与多用户基线，真实登录优先，demo-user 仅通过显式 Demo 模式使用。
- Sprint 8：Daily Cron，每用户按 timeZone/localDate 幂等生成每日计划。
- Sprint 9：Learning Analytics，在 `/progress` 展示学习日历、内容质量、学习效果、代码趋势和知识覆盖。
- Sprint 10：Guided Progress，`/today` 引导式步骤可保存并刷新恢复。
- Sprint 11：Knowledge Map Analytics，`/map` 使用真实测验、复习、代码、错题和卡片信号。
- Sprint 51：Map Insights，`/map` 顶部展示偏弱领域、复习欠账、代码练习少和下一步补哪里。
- Sprint 12：Planner Map Weakness，Planner 消费知识地图弱点补弱。
- Sprint 13：Planner Explanation UX，`/today` 和 `/admin` 展示“为什么今天学这个”。

## 生产环境

- 线上入口：`https://learn.roky.chat`
- 应用服务：`ai-learning-platform.service`
- 内部监听：`127.0.0.1:3102`

不要在知识库、README、提交信息或代码中记录 API Key、Admin Secret、数据库连接串或其他密钥。
