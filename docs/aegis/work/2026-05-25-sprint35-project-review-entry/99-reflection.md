# Sprint 35 Reflection

## What Changed

- 新增 `src/server/projects/review-cards.ts`：
  - `getProjectReviewCardSummary()` 按 `userId + projectId` 统计项目卡片。
  - 仅统计 `project:<projectId>:` 前缀的当前用户卡片。
  - 返回 `total`、`due` 和 `/review` href。
- `/projects` 完成态项目总结区域新增：
  - 项目卡片数量 badge。
  - “去复习项目卡片”按钮。
  - 当前到期项目卡片数量。

## Verification Notes

- RED 测试证明新增服务缺失时会失败。
- GREEN 测试覆盖 user scope，确保其他用户同 project 前缀卡片不会被计入。
- 没有新增 migration。

## Follow-Up

- 后续可以给 `/review` 增加 `source=project` 查询参数筛选项目卡片；本切片先保持现有 review 队列入口，避免扩大范围。
