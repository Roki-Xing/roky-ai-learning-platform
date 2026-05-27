# Sprint 22 Coach Misconceptions - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标，把 Coach 思路评审里的高风险错误沉淀成后续生成、进度和地图都能读取的弱点信号。
- Goal: `createThoughtReview()` 对关联课程的 high severity `possibleIssues` 自动创建 `Misconception(source="coach")`，并更新 `UserTopicState.weaknessScore`。
- Success evidence:
  - RED 测试证明当前 Coach 不会沉淀 high severity issue。
  - GREEN 后 `coach:{reviewId}:{issueIndex}` sourceKey 可查到 `Misconception`。
  - 误区记录带有 `userId`、`lessonId`、`topicId`、`localDate`、`source="coach"`、`status="open"`。
  - `UserTopicState` 同步增加 exposure 与 weakness。
  - Coach context、progress analytics、map analytics 相邻回归通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和页面验收通过。
- Stop condition: 上述证据满足，或生产部署阻塞需要暂停。
- Non-goals:
  - 不新增数据库迁移。
  - 不对无课程关联的自由想法强行创建 misconception。
  - 不执行用户提交代码。
  - 不把 DeepSeek key 或任何 env secret 写入日志、文档或前端。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/coach/submit.ts`
- `src/server/quiz/submit.ts`
- `src/server/coding/submit.ts`
- `tests/unit/coach-submit.test.ts`
- `src/server/coach/context.ts`
- `src/server/map/analytics.ts`
- `src/server/analytics/progress.ts`

## ImpactStatementDraft

- Compatibility boundary: 复用现有 `Misconception.sourceKey` 唯一约束和 `UserTopicState`，不新增 schema。
- Affected layers:
  - `src/server/coach/submit.ts`
  - `tests/unit/coach-submit.test.ts`
  - docs/helloagents
- Invariants:
  - Coach 只评审文本，不执行代码。
  - 课程关联仍必须通过当前用户正式 DailyPlan 校验。
  - 同一 review issue 重复处理通过 stable sourceKey 幂等 upsert。
  - 无 `lessonId` 的 ThoughtReview 不创建 `Misconception`，避免违反必填 lesson 约束。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
