# Sprint 18 Daily Breadth Rotation - Intent

## TaskIntentDraft

- Requested outcome: 完成 Phase 9 Glossary + AI Radar 中的每日广度轮转，让今日计划稳定引用真实术语库和 Radar 记录。
- Goal: `getOrCreateTodayPlan()` 生成每日课程时，不只保留 DeepSeek/模板里的文本卡，而是按本地日期星期轮转选择真实 `GlossaryTerm` 和 `KnowledgeEntity`，并把详情链接写入 `Lesson.connections`。
- Success evidence:
  - 周一到周日有稳定 rotation：term、person、company/lab、benchmark、paper、tool/open_source_project、review。
  - `selectDailyKnowledgeFocus()` 可以按 rotation 和偏好 slug 选择真实 glossary/radar 记录。
  - 术语 fallback 不误生成 `/radar` 链接。
  - `buildKnowledgeCardsFromFocus()` 生成带 `sourceSlug`、`sourceUrl`、`externalSourceUrl` 的今日术语/广度卡。
  - `getOrCreateTodayPlan()` 把 `knowledgeFocus`、glossary 链接和 radar 链接写入 `lesson.connections`。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后服务 active，Host-header 验证 `/today`、`/glossary`、`/radar`。
- Stop condition: 上述证据满足，或数据库迁移/生产环境阻塞需要暂停。
- Non-goals:
  - 不新增复杂知识图谱可视化。
  - 不做联网自动更新人物、公司、论文和 benchmark。
  - 不新增新的持久化模型或迁移。
  - 不暴露任何 API key、数据库连接串或 admin secret。
- Scope: daily knowledge selection service, DailyPlan generation integration, tests, docs, production deployment。
- Change kinds:
  - feature
  - integration

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Phase 9。
- `src/server/knowledge/base.ts`
- `src/server/knowledge/glossary-seeds.ts`
- `src/server/knowledge/radar-seeds.ts`
- `src/server/lesson/daily-plan.ts`
- `src/server/content/templates.ts`
- `src/app/today/page.tsx`
- `src/app/glossary/page.tsx`
- `src/app/radar/page.tsx`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 复用已有 `GlossaryTerm`、`KnowledgeEntity`、`Lesson.connections`，不新增数据库字段。
- Affected layers:
  - `src/server/knowledge/daily-breadth.ts`
  - `src/server/lesson/daily-plan.ts`
  - `tests/unit/daily-breadth.test.ts`
  - helloagents/docs
- Owners:
  - `dailyBreadthRotationForLocalDate()` 负责本地日期到轮转类型的确定。
  - `selectDailyKnowledgeFocus()` 负责按轮转选择真实知识记录和详情链接。
  - `buildKnowledgeCardsFromFocus()` 负责把真实知识记录转换成 `/today` 可展示卡片。
  - `getOrCreateTodayPlan()` 负责把选择结果沉淀到课程连接数据。
- Invariants:
  - 详情链接必须指向 `/glossary?term=<slug>` 或 `/radar?entity=<slug>`。
  - 没有 radar 实体时，术语 fallback 只能链接到 glossary。
  - 生成今日计划仍保持 user/localDate/isTest 幂等。
  - API key 和 secret server-side only。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
