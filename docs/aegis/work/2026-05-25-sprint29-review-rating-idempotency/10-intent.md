# Sprint 29 Review Rating Idempotency - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标中的复习闭环稳定化，防止 `/review` 中同一张到期卡片被重复评分后重复写入 ReviewLog 或重复增加计数。
- Goal: 抽出可测试的 `rateFlashcard()` 服务层，并让 Server Action 复用它；评分只作用于仍然 `dueAt <= now` 的当前用户卡片。
- Success evidence:
  - 首次评分会更新 `dueAt`、`intervalDays`、`reviewCount` 和 `correctCount`。
  - 重复评分同一张已经移出 due 队列的卡片返回 `not_due`。
  - 重复评分不会重复创建 `ReviewLog`。
  - 重复评分不会重复增加 `reviewCount` 或 `correctCount`。
  - `rateFlashcardAction()` 继续 revalidate `/review` 和 `/progress`。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/review` Host-header 验收。
- Stop condition: 上述本地证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不改变 1/3/7/14 天复习排期规则。
  - 不新增数据库迁移。
  - 不执行前端提交的代码。
  - 不暴露数据库连接串、API key、admin secret 或 cron secret。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/review/actions.ts`
- `src/server/review/schedule.ts`
- `src/server/review/filter.ts`
- `src/app/review/ui/review-card.tsx`
- `tests/unit/review-rating.test.ts`
- `tests/unit/review-schedule.test.ts`
- `tests/unit/review-filter.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只改变 review rating 服务层的幂等行为，不改变卡片过滤规则、排期天数或页面交互文案。
- Affected layers:
  - `src/server/review/actions.ts`
  - `tests/unit/review-rating.test.ts`
  - docs/helloagents
- Invariants:
  - 评分必须按 `userId` scope。
  - 只有到期卡片可被评分。
  - 评分成功才写 `ReviewLog`。
  - 已经被第一次评分推迟到未来的卡片，不应被重复点击重复计数。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
