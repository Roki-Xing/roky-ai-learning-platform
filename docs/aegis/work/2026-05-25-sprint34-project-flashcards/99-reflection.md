# Sprint 34 Reflection

## What Changed

- `src/server/projects/base.ts` 新增 `buildProjectCompletionFlashcards()`：
  - 生成 `project:<projectId>:summary` 总结卡。
  - 最多为前 5 个 completed milestones 生成稳定 id 的里程碑卡。
  - 卡片 `lessonId=null`，`type="project"`，tags 包含 `project` 和项目类型。
- `src/server/projects/submit.ts` 新增 `completeLearningProject()`：
  - 只允许当前用户完成自己拥有的项目。
  - 未完成所有 milestones 时拒绝。
  - 写入项目 summary、completed 状态和 completedAt。
  - 通过 upsert 写入项目复习卡片。
  - 更新已有卡片内容时保留 `dueAt`、`reviewCount` 等复习进度。
- `src/app/projects/actions.ts` 的 milestone 完成路径和手动项目完成路径复用服务函数。
- `src/server/review/filter.ts` 把 `project` 纳入 standalone review source。

## Verification Notes

- 目标测试覆盖 project card builder、完成项目生成总结和卡片、重复完成幂等、未完成拒绝、跨用户拒绝。
- Review filter 测试覆盖 `project` standalone tag。
- 没有新增 migration；本地缺表时只需执行既有幂等迁移 `npm run db:migrate:manual:learning-projects`。

## Follow-Up

- 在 `/projects` 页面补一个项目完成后的“去复习项目卡片”入口，让用户更清楚项目卡片已经进入复习队列。
- 后续可把项目总结接入 Coach/DeepSeek 评审，但必须继续保持“不执行用户代码”的安全边界。
