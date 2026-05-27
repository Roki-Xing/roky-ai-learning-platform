# Sprint 44 Review Schedule Summary - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 0 / Phase 7，把 `/review` 从占位说明推进为真实可用的复习体验。
- Goal: 移除 `/review` 右侧“后续可切换 FSRS”的占位卡，展示当前实际队列范围和 1/3/7/14 天复习规则。
- Success evidence:
  - 新增 `buildReviewScheduleSummary()` 服务层口径。
  - `/review` 右侧展示当前队列、范围、到期卡片数。
  - `/review` 右侧展示 `forgot/hard/good/easy` 对应 +1/+3/+7/+14 天规则。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不接入 FSRS。
  - 不改变评分算法。
  - 不改变 `rateFlashcard()` 幂等行为。
  - 不新增数据库 migration。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/review/page.tsx`
- `src/app/review/ui/review-card.tsx`
- `src/server/review/schedule.ts`
- `src/server/review/filter.ts`
- `tests/unit/review-schedule.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只展示已生效的复习规则与队列范围；复习调度、评分、队列筛选和数据写入保持原行为。
- Affected layers:
  - `src/server/review/schedule.ts`
  - `src/app/review/page.tsx`
  - `tests/unit/review-schedule.test.ts`
  - docs/helloagents
- Invariants:
  - 到期队列仍按 `userId` scope。
  - `forgot/hard/good/easy` 仍对应 +1/+3/+7/+14 天。
  - 项目队列和 code-feedback 队列继续保留当前过滤规则。
  - 重复评分仍由 `dueAt <= now` 保护。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
