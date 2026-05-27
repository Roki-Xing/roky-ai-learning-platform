# Sprint 16 Coach Integration - Intent

## TaskIntentDraft

- Requested outcome: 按《Roky Learn 长期开发指导文档》推进 Phase 7：Thought Review Coach 文本版。
- Goal: 让 `/coach` 的思路评审具备稳定服务层、完整学习上下文、可追溯评审记录和幂等卡片生成，并确保 `/library`、`/progress` 可读取沉淀结果。
- Success evidence:
  - Coach context 包含当前课程、recent lessons、due cards、recent quiz、recent code、code feedback、open misconceptions、glossary/breadth。
  - 提交 Coach review 会保存 `ThoughtReview` 并关联当前课程。
  - 生成 ThoughtReview flashcards 可重复执行但不重复创建卡片。
  - `/coach` 与 `/voice` 复用同一服务层。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后服务 active，Host-header 验证 `/coach`、`/library`、`/progress`。
- Stop condition: 上述证据满足，或发现数据库结构/生产环境阻塞需要暂停。
- Non-goals:
  - 不实现实时语音。
  - 不执行用户代码。
  - 不重写 DeepSeek provider。
  - 不新增 Prisma 字段或迁移。
- Scope: Coach service layer, context, review persistence, flashcard generation, library/progress evidence。
- Change kinds:
  - feature
  - hardening

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Phase 7 摘要。
- `src/app/coach/page.tsx`
- `src/app/coach/actions.ts`
- `src/server/coach/context.ts`
- `src/server/ai/thought-review.ts`
- `src/app/voice/actions.ts`
- `src/app/library/page.tsx`
- `src/app/progress/page.tsx`
- `prisma/schema.prisma`
- Next.js 16 docs: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`

## ImpactStatementDraft

- Compatibility boundary: 复用现有 `ThoughtReview`、`Flashcard`、`VoiceNote` 数据模型，不新增迁移；Server Action 仍只负责鉴权、调用服务层、revalidate、redirect。
- Affected layers:
  - `src/server/coach/*`
  - `src/app/coach/actions.ts`
  - `src/app/voice/actions.ts`
  - unit tests
  - helloagents/docs
- Owners:
  - `createThoughtReview()` 负责保存结构化评审。
  - `generateFlashcardsForThoughtReview()` 负责 stable-id flashcard upsert。
  - `buildCoachContext()` 负责 AI 输入上下文摘要。
- Invariants:
  - API key 不进入前端。
  - 不执行用户提交代码。
  - 用户只能访问自己 DailyPlan 关联课程。
  - 重复生成卡片不重复插入。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
