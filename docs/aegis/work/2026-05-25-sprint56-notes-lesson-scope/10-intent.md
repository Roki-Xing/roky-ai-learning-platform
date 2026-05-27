# Sprint 56 Notes Lesson Scope - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 14 Auth 与多用户完善，补强笔记创建时的 lesson 归属校验。
- Goal: 用户创建 Note 时，只能绑定当前用户正式、未归档、非测试 DailyPlan 关联的 Lesson，避免通过表单篡改 `lessonId` 把笔记挂到其他用户或不可见课程。
- Success evidence:
  - `src/server/notes/create-note.ts` 新增 `createScopedNote()`。
  - `createScopedNote()` 允许 standalone note。
  - `createScopedNote()` 拒绝不属于当前用户正式可见计划的 `lessonId`。
  - `/notes` 新建表单只从当前用户可见正式计划选择 lesson。
  - `tests/unit/notes-create.test.ts` 覆盖 owned lesson、cross-user lesson、standalone note。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改变 Note schema。
  - 不改变 `/library` 课程详情展示口径。
  - 不改 Auth provider、Demo 模式或 admin secret。
  - 不记录任何 API key、数据库连接串或 secret。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/notes/actions.ts`
- `src/app/notes/page.tsx`
- `src/server/library/lesson-detail.ts`
- `tests/unit/library-lesson-detail.test.ts`
- `helloagents/modules/library.md`
- `helloagents/modules/auth-demo-mode.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只收紧 Note 创建时的 lesson 绑定边界；不改变 standalone note、Note 表结构或课程详情读取。
- Affected layers:
  - `src/server/notes/create-note.ts`
  - `src/app/notes/actions.ts`
  - `src/app/notes/page.tsx`
  - `tests/unit/notes-create.test.ts`
  - docs/helloagents
- Invariants:
  - 所有 Note 写入按当前 `userId` scoped。
  - 绑定 lesson 必须来自当前用户正式、未归档、非测试 DailyPlan。
  - standalone note 继续允许。
  - 不暴露 secret。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
