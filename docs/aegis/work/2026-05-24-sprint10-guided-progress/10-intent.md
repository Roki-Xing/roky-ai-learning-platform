# Sprint 10: Guided Step Progress

## 目标

让 `/today` 的引导式学习步骤进度保存到服务端，刷新页面后能恢复当前步骤和每一步的回答。

## 范围

- `DailyPlan.guidedProgress` 保存当前步骤、回答与更新时间。
- `/today` 提供保存引导进度的 Server Action。
- `GuidedSteps` 从服务端初始值恢复，并允许显式保存。
- 保留现有课程、测验、代码提交和完成课程行为。

## 非目标

- 不新增在线代码执行。
- 不重做完整学习会话模型。
- 不改变 DailyPlan 生成逻辑。

## 验收

- 单元测试覆盖进度规范化、读取恢复、owner scoped save。
- `/today` 不再显示“刷新会丢失”文案。
- 本地 `npm test`、`npm run lint`、`npm run build` 通过。
