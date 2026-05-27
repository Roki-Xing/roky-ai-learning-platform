# Sprint 35 Project Review Entry - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 12 Project Practice，补齐项目完成后用户可见的“项目卡片已进入复习”入口。
- Goal: 在项目完成态展示项目复习卡片数量、到期数量和“去复习项目卡片”入口，让 Project Practice → Flashcards → Review 闭环对用户可见。
- Success evidence:
  - 新增 `getProjectReviewCardSummary()`，按 `userId + projectId` 统计项目卡片。
  - 统计只包含当前用户 `project:<projectId>:` stable id 卡片。
  - 返回总卡片数和当前到期卡片数。
  - `/projects` 完成项目 summary 区显示项目卡片数量。
  - `/projects` 完成项目 summary 区提供 `/review` 入口。
  - 本地目标测试先 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或生产 DNS 仍未切换导致真实 HTTPS 域名验收不可完成。
- Non-goals:
  - 不新增 migration。
  - 不改变项目卡片生成 id 规则。
  - 不改变 `/review` 队列筛选逻辑。
  - 不执行 milestone 代码。
  - 不暴露 provider key 或生产 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/projects/page.tsx`
- `src/server/projects/base.ts`
- `src/server/projects/submit.ts`
- `src/server/review/filter.ts`
- `src/server/review/queue.ts`
- `tests/unit/projects.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增项目复习卡片摘要查询和完成态 UI 入口，不改变数据模型、生成规则或 review 评分行为。
- Affected layers:
  - `src/server/projects/review-cards.ts`
  - `src/app/projects/page.tsx`
  - `tests/unit/projects.test.ts`
  - docs/helloagents
- Invariants:
  - Project review card summary 必须按 `userId` scope。
  - 不能把其他用户同 project id 前缀的卡片计入当前用户。
  - 到期数以 `dueAt <= now` 计算。
  - UI 只显示摘要和跳转，不直接修改卡片或复习记录。
  - 继续保持“不执行用户代码”的边界。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
