# Sprint 19 Knowledge Preferences - Intent

## TaskIntentDraft

- Requested outcome: 让每日广度轮转支持用户偏好，并避免短期重复同一个术语或 Radar 实体。
- Goal: `/settings` 可保存每日术语偏好、Radar 偏好和知识卡去重天数；`getOrCreateTodayPlan()` 生成每日计划时使用这些偏好，同时避开最近已用过的 `sourceSlug`。
- Success evidence:
  - `UserProfile` 持久化 `preferredTermSlugs`、`preferredEntitySlugs`、`knowledgeAvoidDays`。
  - `updateUserProfileSettings()` 可测试并保存知识偏好。
  - `selectDailyKnowledgeFocus()` 避免最近 N 天已使用的 glossary/radar slug。
  - `getOrCreateTodayPlan()` 把偏好 slug 和去重天数传入每日知识选择。
  - `/settings` 展示并提交知识偏好字段。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后 migration、目标测试、build、service health 和 Host-header 验收通过。
- Stop condition: 上述证据满足，或生产迁移/构建阻塞需要暂停。
- Non-goals:
  - 不新增独立知识偏好页面。
  - 不做复杂推荐系统或联网更新 Radar。
  - 不删除现有 DeepSeek 生成和模板 fallback。
  - 不把任何 API Key 或 secret 写入代码/文档。
- Scope: UserProfile fields, settings service/action/UI, daily breadth selection, tests, docs, production deployment。
- Change kinds:
  - feature
  - persistence
  - integration

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Phase 5.3。
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `prisma/schema.prisma`
- `src/app/settings/page.tsx`
- `src/app/settings/actions.ts`
- `src/server/knowledge/daily-breadth.ts`
- `src/server/lesson/daily-plan.ts`
- `tests/unit/daily-breadth.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 新增 `UserProfile` 字段和幂等 manual migration，不改变 `DailyPlan` 唯一性和现有学习闭环。
- Affected layers:
  - Prisma schema/manual migration
  - `src/server/profile/settings.ts`
  - `/settings`
  - `src/server/knowledge/daily-breadth.ts`
  - `src/server/lesson/daily-plan.ts`
  - tests
  - helloagents/docs
- Owners:
  - `updateUserProfileSettings()` 负责设置保存和 slug 规范化。
  - `selectDailyKnowledgeFocus()` 负责短期去重和偏好选择。
  - `/settings` 负责展示可编辑偏好，不展示任何密钥。
- Invariants:
  - Server Action 继续调用 `requireUserId()`。
  - 知识偏好以 normalized slug 保存。
  - 最近已用 slug 只从当前 user 的非归档 DailyPlan 读取。
  - 去重失败时仍允许 fallback 到可用知识记录，不能让 `/today` 空白。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
