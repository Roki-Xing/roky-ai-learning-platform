# Sprint 36 Project Review Filter - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 12 Project Practice，让“去复习项目卡片”进入当前项目专属复习队列。
- Goal: `/review` 支持 `source=project&projectId=...`，项目完成页的复习入口只展示该项目生成的到期卡片。
- Success evidence:
  - `normalizeReviewSource()` 只接受已支持的 standalone review source。
  - `buildReviewableFlashcardWhere()` 支持按 source 构建 standalone card 查询。
  - `source=project` 且带 `projectId` 时只匹配 `project:<projectId>:` 前缀卡片。
  - `getDueFlashcards()` 能接收 source/projectId 并返回项目专属到期队列。
  - `getProjectReviewCardSummary()` 返回 `/review?source=project&projectId=<id>`。
  - `/review` 页面读取 Next.js 16 Promise `searchParams` 并传入 queue。
  - 本地目标测试先 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 migration。
  - 不改变 review rating 规则。
  - 不改变非项目 review 默认队列。
  - 不新增复杂筛选 UI。
  - 不执行用户代码，不暴露 provider key。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/review/filter.ts`
- `src/server/review/queue.ts`
- `src/app/review/page.tsx`
- `src/server/projects/review-cards.ts`
- `src/app/projects/page.tsx`
- `tests/unit/review-filter.test.ts`
- `tests/unit/projects.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只扩展 review 队列筛选参数和项目入口 URL，不改变数据库、卡片生成或评分更新行为。
- Affected layers:
  - `src/server/review/filter.ts`
  - `src/server/review/queue.ts`
  - `src/app/review/page.tsx`
  - `src/server/projects/review-cards.ts`
  - `tests/unit/review-filter.test.ts`
  - `tests/unit/projects.test.ts`
  - docs/helloagents
- Invariants:
  - 默认 `/review` 必须继续显示所有 reviewable due cards。
  - `source=project&projectId=...` 只能显示当前用户该项目的卡片。
  - 不得把其他项目或 glossary/radar/voice/thought cards 混入项目队列。
  - 所有 review 查询继续按 `userId` scope。
  - Next.js 16 页面 `searchParams` 继续按 Promise 处理。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
