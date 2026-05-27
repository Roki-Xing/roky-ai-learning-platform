# Sprint 39 Project Code Feedback Review Entry - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 12 Project Practice，把项目 milestone 代码评审生成的复习卡片显式带回 `/projects` 和项目专属 `/review` 队列。
- Goal: 新增 user-scoped 项目代码反馈卡片摘要，并支持 `/review?source=code-feedback&projectId=<id>` 只复习当前项目 linked submission 的 code feedback cards。
- Success evidence:
  - 新增 `getProjectCodeFeedbackCardSummary()` 服务函数。
  - 服务按 `userId + projectId` 查找 `ProjectMilestone.codeSubmissionId`，只统计 linked submission 的 `code-feedback` 卡片。
  - `/projects` 显示当前项目代码反馈卡片总数、到期数和“去复习代码反馈卡片”入口。
  - `/review` 支持 `source=code-feedback&projectId=<id>`，标题显示“代码反馈复习”。
  - `getDueFlashcards()` 在 code-feedback 聚焦模式下只返回当前项目 linked submission 的 due cards。
  - 默认 `/review` 和项目完成卡片复习不退化。
  - 本地目标测试先 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 migration。
  - 不改变 `CodeFeedback` 或 `Flashcard` schema。
  - 不改变 code feedback card 生成逻辑。
  - 不执行用户代码。
  - 不扩大到普通 lesson 代码反馈的全局筛选 UX。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/ai/code-feedback.ts`
- `src/server/projects/code-feedback-summary.ts`
- `src/server/review/filter.ts`
- `src/server/review/queue.ts`
- `src/app/projects/page.tsx`
- `src/app/review/page.tsx`
- `tests/unit/projects.test.ts`
- `tests/unit/review-filter.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增项目 linked code feedback cards 的读取、计数和聚焦复习入口；不改变卡片生成、评分、项目完成或数据库模型。
- Affected layers:
  - `src/server/projects/code-feedback-summary.ts`
  - `src/server/review/filter.ts`
  - `src/server/review/queue.ts`
  - `src/app/projects/page.tsx`
  - `src/app/review/page.tsx`
  - `tests/unit/projects.test.ts`
  - `tests/unit/review-filter.test.ts`
  - docs/helloagents
- Invariants:
  - 所有项目代码反馈卡片查询必须按当前 `userId` scope。
  - 聚焦队列必须通过 `ProjectMilestone.codeSubmissionId` 限定项目归属。
  - `code-feedback` 是 review source，但不是 `lessonId=null` 的 standalone source。
  - 默认复习仍应包含 official lesson cards 和 standalone cards。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
