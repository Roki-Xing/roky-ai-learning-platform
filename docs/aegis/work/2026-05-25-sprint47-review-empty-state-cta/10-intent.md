# Sprint 47 Review Empty State CTA - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 0，把 `/review` 没有到期卡片时的下一步建议做成清晰可点击入口。
- Goal: `/review` 空队列不再只有纯文字，而是显示明确状态、说明和 CTA，帮助用户回到今日学习、课程库、进度或项目上下文。
- Success evidence:
  - 新增 `buildReviewEmptyState()` 服务层口径。
  - 默认复习队列空状态给出 `/today`、`/library`、`/progress` CTA。
  - 项目复习队列空状态保留项目上下文。
  - 代码反馈复习队列空状态保留项目和全部复习入口。
  - 不改变复习队列筛选、评分或调度规则。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不改变 `getDueFlashcards()`。
  - 不改变 `rateFlashcard()`。
  - 不新增数据库 migration。
  - 不接入新的复习算法。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/review/page.tsx`
- `src/app/review/ui/review-card.tsx`
- `src/server/review/filter.ts`
- `src/server/review/schedule.ts`

## ImpactStatementDraft

- Compatibility boundary: 只增强空状态展示；队列、评分、统计和 ReviewLog 行为保持原样。
- Affected layers:
  - `src/server/review/empty-state.ts`
  - `src/app/review/page.tsx`
  - `tests/unit/review-empty-state.test.ts`
  - docs/helloagents
- Invariants:
  - 默认队列继续复用 `buildReviewableFlashcardWhere(userId)`。
  - project/code-feedback focused queue 参数不变。
  - `/review` 仍受登录保护。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
