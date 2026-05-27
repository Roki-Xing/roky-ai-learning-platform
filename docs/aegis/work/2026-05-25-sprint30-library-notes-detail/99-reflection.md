# Sprint 30 Reflection

## What Changed

- 新增 `src/server/library/lesson-detail.ts`：
  - `getLessonDetailNotes()` 按 `userId + lessonId` 读取课程关联笔记。
  - `resolveVisibleLibraryLessonId()` 只允许打开当前 `/library` 筛选结果中可见的 lesson。
- `/library` 课程详情新增“关联笔记”区域：
  - 展示笔记标题、更新时间和摘要。
  - 提供跳转到 `/notes?lessonId=...` 的写笔记入口。
- `/library` 详情读取不再直接信任 querystring 中的任意 `lessonId`。

## Verification Notes

- 目标测试覆盖笔记查询 user scope 和 lesson scope。
- 目标测试覆盖不可见 lessonId 回退行为。
- 相关回归覆盖 library governance filters。
- 完整 lint/test/build 已通过。
- 没有新增 migration。

## Follow-Up

- 生产恢复后补 `/library` Host-header 验收，确认课程详情显示“关联笔记”区域和“写笔记”入口。
- 后续可以让 `/notes` 保存后带回原课程详情锚点，但当前只读沉淀闭环已经打通。
