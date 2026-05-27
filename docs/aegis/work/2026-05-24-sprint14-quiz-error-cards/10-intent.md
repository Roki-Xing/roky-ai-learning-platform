# Sprint 14 Quiz Error Cards

## Requested Outcome

补齐长期文档 Sprint 2.4：用户答错 quiz 后，不仅创建 Misconception，还要自动生成一张可复习的错题卡，并保持重复提交幂等。

## Scope

- 新增 quiz error flashcard builder。
- `submitQuizAttemptAction` 答错时 upsert 错题 Flashcard。
- 答对后保留卡片历史但更新 Misconception 为 resolved。
- 更新 `/progress` 与 `/map` 已有统计不需要改公式。
- 更新知识库与证据。

## Non-goals

- 不新增数据库迁移。
- 不改变 quiz 判分规则。
- 不执行用户代码。
- 不调用外部 AI。
- 不改 review 调度规则。

## Baseline Read Set

- `src/server/quiz/actions.ts`
- `src/app/today/ui/today-quiz.tsx`
- `prisma/schema.prisma`
- `src/server/review/filter.ts`
- `src/app/progress/page.tsx`
- `src/app/map/page.tsx`
- `tests/unit/daily-plan-idempotency.test.ts`

## Impact Statement

改动只影响 quiz 提交后的沉淀行为：错误尝试会多生成一个 `Flashcard(type="quiz_error")`，进入现有 `/review` 队列并被 `/progress`、`/map` 的既有 flashcard 统计捕获。
