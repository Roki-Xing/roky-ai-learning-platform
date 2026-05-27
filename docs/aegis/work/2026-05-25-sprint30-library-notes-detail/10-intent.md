# Sprint 30 Library Notes Detail - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档中 Library 验收项，让课程库详情不仅展示测验、代码、卡片和 Coach 评审，也展示关联到当前课程的笔记。
- Goal: 在 `/library` 课程详情中展示当前用户、当前课程的 Note 列表，并收紧手填 `lessonId` 的详情读取边界。
- Success evidence:
  - `getLessonDetailNotes()` 只读取当前 `userId + lessonId` 的笔记。
  - `/library` 课程详情展示“关联笔记”区域、笔记摘要和“写笔记”入口。
  - `/library?lessonId=...` 只能打开当前筛选结果中可见的课程；不可见 lessonId 会回退到列表第一条。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/library` Host-header 验收。
- Stop condition: 上述本地证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 Note 创建逻辑。
  - 不改变 `/notes` 页面信息架构。
  - 不改变 `/library` 默认治理筛选规则。
  - 不输出密钥或数据库连接串。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/library/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/notes/actions.ts`
- `src/server/library/plan-filter.ts`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 只补课程详情关联笔记展示和详情 lessonId 可见性约束，不改变 DailyPlan、Note 或 Lesson 数据结构。
- Affected layers:
  - `src/server/library/lesson-detail.ts`
  - `src/app/library/page.tsx`
  - `tests/unit/library-lesson-detail.test.ts`
  - docs/helloagents
- Invariants:
  - 所有 Note 查询必须按 `userId` scope。
  - 课程详情只能显示当前用户在当前筛选范围内可见的课程。
  - 关联笔记展示是只读摘要；写入仍走 `/notes`。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
