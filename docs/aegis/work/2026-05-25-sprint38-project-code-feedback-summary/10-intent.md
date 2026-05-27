# Sprint 38 Project Code Feedback Summary - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 12 Project Practice，让项目 milestone 的 AI review 不只存入后台，也能在 `/projects` 当前任务和里程碑列表中直接看到反馈摘要。
- Goal: 新增 user-scoped 项目里程碑代码反馈摘要查询，并在 `/projects` 展示 `overall`、summary 和主要 issues。
- Success evidence:
  - 新增 `getProjectMilestoneFeedbackSummaries()` 服务函数。
  - 服务按 `userId + projectId` scope 读取当前项目 linked `CodeFeedback`。
  - 服务不会泄露其他用户的 `CodeFeedback`。
  - `/projects` 当前任务展示 linked feedback 的 `overall`、summary 和前几个 issue。
  - `/projects` 里程碑列表展示 linked feedback 摘要。
  - 本地目标测试先 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 migration。
  - 不改变 `CodeFeedback` schema。
  - 不执行用户代码。
  - 不改变 project completion cards 或 review queue。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/coding/view.ts`
- `src/server/projects/code-submission.ts`
- `src/app/projects/page.tsx`
- `tests/unit/projects.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增读取和展示 linked `CodeFeedback` 的项目页体验，不改变代码评审生成、项目完成、复习评分或数据模型。
- Affected layers:
  - `src/server/projects/code-feedback-summary.ts`
  - `src/app/projects/page.tsx`
  - `tests/unit/projects.test.ts`
  - docs/helloagents
- Invariants:
  - `CodeFeedback` 必须按当前 `userId` scope。
  - 没有 linked feedback 的 milestone 仍按原样显示。
  - 项目代码仍只做文本评审，不在服务端执行。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
