# Sprint 15 Intent

## Requested Outcome

继续按照《Roky Learn 长期开发指导文档》推进 Phase 5：CodeSubmission AI Feedback。

## Scope

- 代码提交后生成结构化反馈，不执行用户代码。
- 反馈结构包含 `overall`、`issues`、`hints`、`suggestedTests`、`flashcards`。
- 严重代码问题沉淀为 `Misconception` 和复习卡。
- `/today` 展示结构化反馈，`/library`、`/progress` 可继续读取反馈记录。
- 保持 DeepSeek 可用时调用 AI，无 key 或测试环境使用模板 fallback。

## Non-goals

- 不做服务器端代码执行沙箱。
- 不暴露 referenceSolution 全文。
- 不重做课程生成、Planner 或 Review 主流程。
- 不处理 npm audit 依赖升级。

## Baseline Read Set

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md`
- `src/server/ai/code-feedback.ts`
- `src/server/coding/actions.ts`
- `src/app/today/ui/code-exercise.tsx`
- `src/app/today/page.tsx`
- `prisma/schema.prisma`
- `prisma/manual-migrations/20260524_learning_feedback.sql`
- Next.js 16 docs: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- Next.js 16 docs: `node_modules/next/dist/docs/01-app/02-guides/forms.md`

## Impact Statement

This slice touches code-submission persistence, feedback schema, one Server Action owner, and the `/today` code exercise UI. It may require a repeatable manual migration for new columns.

