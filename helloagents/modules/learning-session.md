# Learning Session

## 状态

已完成首页读侧 MVP：用户在首页看到 `当前会话`、`下一会话` 和 `本周会话`，而不是再增加一组独立页面快捷入口。

## 目标

把 Roky Learn 现有功能收束成学习会话，让用户每天打开后能直接回答：

- 现在先做哪一个学习动作
- 做完以后进入哪一个动作
- 本周进度如何被统一汇总

## 会话类型

`buildLearningSessions()` 当前覆盖指导文件第 15 节的 10 种类型：

- `daily_lesson`
- `review_session`
- `coach_session`
- `voice_reflection`
- `mistake_repair`
- `project_milestone`
- `book_reading`
- `weekly_review`
- `glossary_explore`
- `radar_explore`

## 统一字段

每个会话统一输出：

- `type`
- `title`
- `goal`
- `status`
- `startedAt`
- `completedAt`
- `outputs`
- `nextRecommendedSession`
- `href`
- `ctaLabel`

`href` 和 `ctaLabel` 是本项目 UI 需要的读侧扩展字段；指导字段仍保持完整。

## 当前实现边界

- 会话从 `CurrentMissionInput`、active project、active book session、周完成天数等现有信号派生。
- 当前不新增 `LearningSession` 数据表，不新增 Prisma migration，也不保存真实开始/完成时间。
- `startedAt` 和 `completedAt` 暂为 `null`，代表本阶段只做“读侧会话化”和首页主线收束。
- `nextRecommendedSession` 只保存下一会话的 `type / title / goal`，避免嵌套完整会话对象。
- 首页只为当前会话提供主 CTA，下一会话和本周会话保持信息提示，避免重新制造多入口混乱。

## 优先级

会话当前沿用 Current Mission 主线：

1. 今日学习未完成 → `daily_lesson`
2. 到期复习 → `review_session`
3. 未解决误区 → `mistake_repair`
4. 代码反馈待处理 → `coach_session`
5. 今日没有笔记 → 写一句今日笔记，归入 `daily_lesson`
6. 今日没有语音复盘 → `voice_reflection`
7. active project → `project_milestone`
8. active book session → `book_reading`
9. 主线清空 → `radar_explore`

## 代码位置

- 服务：`src/server/learning/current-mission.ts`
- 首页组件：`src/components/learning/learning-session-strip.tsx`
- 首页接线：`src/app/page.tsx`
- 单测：`tests/unit/current-mission.test.ts`、`tests/unit/home-page-labels.test.ts`、`tests/unit/learning-ui-components.test.ts`

## 验收

- RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于会话条仍出现说明型功能文案。
- GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts` 43 项通过。
- 项目门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、`npm test`、`npm run build`。

## 后续方向

- 如果要做真实会话生命周期，再新增持久化 schema、开始/完成 action、Weekly session 汇总和 Path session 推进。
- 持久化前必须先定义 `LearningSession` 写入契约和 Preview 写保护边界，不能把当前读侧派生对象直接当作数据库模型。
