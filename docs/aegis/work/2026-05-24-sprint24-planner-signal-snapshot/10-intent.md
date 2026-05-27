# Sprint 24 Planner Signal Snapshot - Intent

## TaskIntentDraft

- Requested outcome: 继续长期目标，让每日课程生成不只依赖最终选题，还能携带可审计的 Planner 信号快照进入日志和 DeepSeek prompt。
- Goal: 在 `CurriculumDecision` 中保存 `signalSnapshot`，让 `CurriculumDecisionLog.inputSnapshot` 和 `AiGenerationJob.input.curriculum` 都能追溯选题信号，并让生成 prompt 显式包含这些信号。
- Success evidence:
  - `scoreTopicCandidates()` 返回包含 recent studies、domain counts、review/quiz/misconception/map/code signals 的 `signalSnapshot`。
  - `getOrCreateTodayPlan()` 持久化的 `CurriculumDecisionLog.inputSnapshot.decision.signalSnapshot` 可读。
  - `buildDailyPlanMessages()` 的 user prompt 包含 `Planner signal snapshot` 和关键字段。
  - prompt helper 可被单元测试导入，不触发服务端 env 校验。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产同步后目标测试、build、service health 和页面验收通过。
- Stop condition: 上述证据满足，或生产部署阻塞需要暂停。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变现有 `CurriculumDecisionLog` schema。
  - 不把密钥、数据库连接串或完整 env 写入日志。
  - 不调用外部 AI 作为测试前提。
  - 不执行用户代码。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/curriculum/types.ts`
- `src/server/curriculum/scoring.ts`
- `src/server/curriculum/select-next-topic.ts`
- `src/server/lesson/daily-plan.ts`
- `src/server/ai/generate-daily-plan.ts`
- `tests/unit/curriculum-select-next-topic.test.ts`
- `tests/unit/daily-plan-idempotency.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只扩展已有 planner decision 对象和 JSON input snapshot，不新增表或列。
- Affected layers:
  - `src/server/curriculum/types.ts`
  - `src/server/curriculum/scoring.ts`
  - `src/server/curriculum/select-next-topic.ts`
  - `src/server/ai/generate-daily-plan.ts`
  - `tests/unit/curriculum-select-next-topic.test.ts`
  - `tests/unit/daily-plan-idempotency.test.ts`
  - `tests/unit/daily-generation-prompt.test.ts`
  - docs/helloagents
- Invariants:
  - Planner 仍按同一套 scoring 选择主题。
  - `signalSnapshot` 只记录 domain/topic slug、日期和计数，不记录敏感 env。
  - DeepSeek 未配置或测试环境仍走 template fallback。
  - 最近 topic 去重、active misconception 权重和计划幂等规则保持不变。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
