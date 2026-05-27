# Sprint 13 Planner Explanation UX

## Requested Outcome

让用户和管理员能看懂“为什么今天学这个”，把 Sprint 12 的 planner score / decision log 从机器可读字段变成产品内可读解释。

## Scope

- 新增 curriculum decision explanation 服务。
- `/today` 展示今日选题解释，不暴露原始 JSON。
- `/admin` 在最近 `CurriculumDecisionLog` 列表中展示主要信号摘要，原始 scoreBreakdown 继续折叠。
- 更新知识库与证据记录。

## Non-goals

- 不改选题评分公式。
- 不新增数据库迁移。
- 不调用外部 AI。
- 不展示或修改任何密钥。

## Baseline Read Set

- `src/server/curriculum/types.ts`
- `src/server/curriculum/scoring.ts`
- `src/server/curriculum/select-next-topic.ts`
- `src/app/today/page.tsx`
- `src/app/admin/page.tsx`
- `prisma/schema.prisma`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Impact Statement

用户可见变化集中在 `/today` 与 `/admin`；服务层新增只读解释函数，不改变生成、复习、提交、Cron 或权限边界。
