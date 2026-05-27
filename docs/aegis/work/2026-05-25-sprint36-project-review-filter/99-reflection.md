# Sprint 36 Reflection

## What Changed

- `src/server/review/filter.ts`：
  - 新增 `ReviewSource` 和 `normalizeReviewSource()`。
  - `buildReviewableFlashcardWhere()` 支持 standalone source filter。
  - `source="project" + projectId` 时按 `project:<projectId>:` stable id 前缀筛选。
- `src/server/review/queue.ts`：
  - `getDueFlashcards()` 接收 `source` 和 `projectId`。
- `src/app/review/page.tsx`：
  - 读取 Promise `searchParams`。
  - 传入 focused queue。
  - 项目筛选时标题显示“项目卡片复习”。
- `src/server/projects/review-cards.ts`：
  - 项目复习入口从 `/review` 改为 `/review?source=project&projectId=<id>`。

## Verification Notes

- RED 测试证明旧行为会把项目入口带到普通队列，并混入其他到期卡。
- GREEN 测试覆盖 focused where、source normalization、项目专属 due queue 和 project review href。
- 没有新增 migration。

## Follow-Up

- 后续可在 `/review` 页面增加 source badge 或返回项目详情链接；本切片先保持 focused queue 行为最小化。
