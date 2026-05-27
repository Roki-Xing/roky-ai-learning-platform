# Sprint 56 Reflection

## What Changed

- Note 创建从 `/notes` action 直写收敛到 `createScopedNote()`。
- `createScopedNote()` 会在绑定 `lessonId` 前检查当前用户是否拥有正式、未归档、非测试 DailyPlan。
- `/notes` 页面复用 `resolveVisibleLibraryLessonId()`，避免 query string 中的不可见 lesson 被展示为当前选中课程。

## What Stayed Stable

- 没有数据库迁移。
- standalone note 仍可创建。
- `/library` 课程详情仍通过 `userId + lessonId` 读取笔记。
- Auth、Demo 模式、Admin 保护和 provider secret 管理保持不变。

## Follow-up

- 继续 Phase 14 的 server action scope audit，优先补缺少跨用户测试的写入入口。
