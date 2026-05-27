# Sprint 45 Today Review Summary - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 0 / Phase 7，把 `/today` 右侧仍存在的复习占位卡替换成真实复习入口状态。
- Goal: `/today` 不再显示 `PlaceholderCard` 的“复习区”，而是展示今日课程复习卡片、今日课程到期卡片、全部到期卡片和完成后的复习入口。
- Success evidence:
  - 新增 `buildTodayReviewSummary()` 服务层口径。
  - `/today` 右侧展示“今日复习入口”真实数据卡。
  - 未完成时 CTA 显示“完成后生成卡片”并禁用。
  - 已完成时 CTA 指向 `/review`。
  - 不改变完成学习、生成 flashcard、复习评分和队列筛选逻辑。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 migration。
  - 不改变 `completeTodayPlan()` 幂等逻辑。
  - 不改变 `buildReviewableFlashcardWhere()` 默认队列口径。
  - 不接入新的复习算法。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/today/page.tsx`
- `src/server/review/filter.ts`
- `src/server/review/schedule.ts`
- `helloagents/modules/review.md`
- `helloagents/modules/daily-loop-verification.md`

## ImpactStatementDraft

- Compatibility boundary: 只替换 `/today` 的展示占位；卡片生成、到期筛选、评分和持久化保持原行为。
- Affected layers:
  - `src/server/review/today-summary.ts`
  - `src/app/today/page.tsx`
  - `tests/unit/today-review-summary.test.ts`
  - docs/helloagents
- Invariants:
  - 所有计数继续按 `userId` scope。
  - 今日课程卡片按 `lessonId` scope。
  - 全部到期卡片复用 `buildReviewableFlashcardWhere(userId)`。
  - `/review` 登录保护边界不变。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
