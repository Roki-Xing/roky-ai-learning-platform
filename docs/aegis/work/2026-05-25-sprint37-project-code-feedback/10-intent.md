# Sprint 37 Project Code Feedback - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 12 Project Practice，让 milestone 可关联 `CodeSubmission` 并进入现有 AI code feedback 链路。
- Goal: `/projects` 中保存的 milestone 代码可以复用 `submitCodeForReview()`，生成 `CodeSubmission`、`CodeFeedback`、bug/concept cards，并把 `ProjectMilestone.codeSubmissionId` 写回 milestone。
- Success evidence:
  - `ProjectMilestone` 新增 `codeSubmissionId` 字段和索引。
  - 新增可重复执行的手动迁移 `20260525_project_milestone_code_submission.sql`。
  - 新增 `reviewProjectMilestoneCode()` 服务函数，按 `userId + projectId + milestoneId` scope 读取 milestone。
  - 缺少 milestone、lessonId 或 code 时明确拒绝。
  - 重复评审同一 milestone 复用同一 `CodeSubmission`，不重复创建。
  - `/projects` 当前任务支持“保存并评审代码”，并展示 linked feedback id。
  - 本地目标测试先 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成新增迁移、远端目标测试、build、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不执行用户代码。
  - 不新增代码沙箱。
  - 不改变 `submitCodeForReview()` 的现有 lesson ownership 规则。
  - 不暴露 provider key。
  - 不改变项目完成卡片和项目专属复习队列逻辑。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `prisma/schema.prisma`
- `src/server/coding/submit.ts`
- `src/server/projects/submit.ts`
- `src/app/projects/actions.ts`
- `src/app/projects/page.tsx`
- `tests/unit/projects.test.ts`
- `tests/unit/code-submit.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只新增 milestone 到 existing CodeSubmission feedback 的链接，不改变代码提交唯一键、feedback 生成规则或 review rating 规则。
- Affected layers:
  - `prisma/schema.prisma`
  - `prisma/manual-migrations/20260525_project_milestone_code_submission.sql`
  - `src/server/projects/code-submission.ts`
  - `src/app/projects/actions.ts`
  - `src/app/projects/page.tsx`
  - `tests/unit/projects.test.ts`
  - docs/helloagents
- Invariants:
  - milestone 代码只保存和评审，不在服务端执行。
  - 所有项目操作必须按当前 `userId` scope。
  - `submitCodeForReview()` 仍只接受当前用户正式 DailyPlan 里的 lesson。
  - `CodeSubmission` 继续通过 `userId + lessonId + localDate` 幂等。
  - 项目代码评审日期使用用户时区 localDate，不回退到 UTC 日期。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
