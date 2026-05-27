# Sprint 34 Project Flashcards - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档中 Project Practice 的学习沉淀闭环，让完成项目后自动生成可复习的项目卡片。
- Goal: 新增 `completeLearningProject()` 服务层能力，确保项目完成、项目总结和项目复习卡片生成具备 user scope、幂等性和 review 可见性。
- Success evidence:
  - 项目只有当前用户可完成，跨用户 project id 会被拒绝。
  - 未完成所有 milestones 的项目不能生成完成总结和卡片。
  - 完成项目会写入 `LearningProject.summary`、`status="completed"` 和 `completedAt`。
  - 完成项目会生成 standalone `project` Flashcards，`lessonId=null`，tags 包含 `project` 和项目类型。
  - 重复完成同一项目不会重复创建卡片，也不会重置已有卡片的 `dueAt` / `reviewCount`。
  - `/projects` 的 milestone 完成路径和手动完成项目路径复用同一服务函数。
  - `/review` 能把 `project` 标签卡片纳入 standalone review source。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、build、容器启动和 Host-header health 验收。
- Stop condition: 上述本地与备用机证据满足，或生产 DNS / SSH / HTTPS 外部不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不执行 milestone 中保存的代码。
  - 不把项目总结切换为 AI 生成。
  - 不改变 `LearningProject` / `ProjectMilestone` schema。
  - 不暴露 provider key 或生产环境变量。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/projects/base.ts`
- `src/server/projects/submit.ts`
- `src/app/projects/actions.ts`
- `src/app/projects/page.tsx`
- `src/server/review/filter.ts`
- `tests/unit/projects.test.ts`
- `tests/unit/review-filter.test.ts`
- `tests/unit/progress-analytics.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只把 Project Practice 完成结果接入 Flashcard / Review 闭环，不改变项目模板、milestone UI、schema 或代码执行策略。
- Affected layers:
  - `src/server/projects/base.ts`
  - `src/server/projects/submit.ts`
  - `src/app/projects/actions.ts`
  - `src/server/review/filter.ts`
  - `tests/unit/projects.test.ts`
  - `tests/unit/review-filter.test.ts`
  - docs/helloagents
- Invariants:
  - 所有 Project 查询和写入必须按 `userId` scope。
  - 未完成项目不能生成复习卡片。
  - 项目卡片 id 必须稳定，重复完成不能重复建卡。
  - 更新已有项目卡片内容时不能重置复习进度字段。
  - Project 代码产物只保存，不在服务端执行。
  - Project 卡片必须能被 `/review` 识别为 standalone source。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
