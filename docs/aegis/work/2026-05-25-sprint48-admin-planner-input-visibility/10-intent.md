# Sprint 48 Admin Planner Input Visibility - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 1/2 的治理验收，把 `/admin` 中最近 AI 生成任务的 planner 输入变成可读摘要。
- Goal: 管理端不仅能看到 `CurriculumDecisionLog`，也能直接从 `AiGenerationJob.input.curriculum` 看见生成时实际使用的选题、schema、理由和 planner signal snapshot。
- Success evidence:
  - 新增 `buildAdminPlannerJobSummary()` 服务层 helper。
  - `/admin` 最近 `AiGenerationJob` 卡片展示 `Planner input` 摘要。
  - 摘要包含 localDate、schemaVersion、难度、预计分钟、领域、主题、主理由、活跃信号和 signal snapshot。
  - 原始大段 JSON 继续默认折叠，不改生成链路。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不改变 `selectNextTopic()`。
  - 不改变 `generateDailyPlanTemplate()` 或 DeepSeek 请求。
  - 不新增数据库 migration。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/admin/page.tsx`
- `src/server/ai/generate-daily-plan.ts`
- `src/server/curriculum/signal-snapshot.ts`
- `src/server/curriculum/explain-decision.ts`
- `tests/unit/daily-generation-prompt.test.ts`
- `tests/unit/curriculum-signal-snapshot.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只增强 admin 可见性；生成、选题、持久化和 user scope 保持原样。
- Affected layers:
  - `src/server/admin/planner-visibility.ts`
  - `src/app/admin/page.tsx`
  - `tests/unit/admin-planner-visibility.test.ts`
  - docs/helloagents
- Invariants:
  - `AiGenerationJob.input.curriculum` 仍由生成入口写入。
  - `/admin` 仍需要登录和 admin protection。
  - 原始 `output JSON` 默认折叠。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
