# Sprint 23 Planner Misconception Signal - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标，让错误、代码提交、复习表现和 Coach 误区真正影响下一次每日学习规划。
- Goal: `selectNextTopic()` 直接读取 open/active `Misconception`，将其汇总为 domain-level weakness，并让 `/today` 的选题解释显示“活跃误区”信号。
- Success evidence:
  - RED 测试证明当前 scoring 不会使用 active misconceptions。
  - RED 测试证明当前 `selectNextTopic()` 不会从 DB 读取 open `Misconception`。
  - RED 测试证明当前 `explainCurriculumDecision()` 不显示 misconception 信号。
  - GREEN 后 `scoreBreakdown.misconceptionScore` 可见，且对应 domain 排名提高。
  - GREEN 后 `selectNextTopic()` 可从 `Misconception(topicId/lessonId)` 映射到 domain。
  - GREEN 后解释层显示“活跃误区”。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和页面验收通过。
- Stop condition: 上述证据满足，或生产部署阻塞需要暂停。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 `Misconception` schema。
  - 不调用外部 AI。
  - 不执行用户代码。
  - 不输出或记录任何环境密钥。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/curriculum/select-next-topic.ts`
- `src/server/curriculum/scoring.ts`
- `src/server/curriculum/types.ts`
- `src/server/curriculum/explain-decision.ts`
- `tests/unit/curriculum-scoring.test.ts`
- `tests/unit/curriculum-explanation.test.ts`
- `prisma/schema.prisma`

## ImpactStatementDraft

- Compatibility boundary: 复用现有 `Misconception`、`Topic`、`Lesson`、`Domain` 数据，不新增 schema。
- Affected layers:
  - `src/server/curriculum/select-next-topic.ts`
  - `src/server/curriculum/scoring.ts`
  - `src/server/curriculum/types.ts`
  - `src/server/curriculum/explain-decision.ts`
  - `tests/unit/curriculum-scoring.test.ts`
  - `tests/unit/curriculum-select-next-topic.test.ts`
  - `tests/unit/curriculum-explanation.test.ts`
  - docs/helloagents
- Invariants:
  - 最近 7 次 topic 去重仍强于普通弱点信号。
  - Planner 只读取当前 userId 的 open/active misconception。
  - 无 topicId 的 misconception 通过 lessonId fallback 映射到 domain。
  - 不改变 `/today` 生成和完成计划的幂等规则。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
