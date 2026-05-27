# Sprint 43 Radar Verification Badge - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 11，补齐 AI Radar 对当前人物、公司、产品、Benchmark 等可变事实的可信度治理。
- Goal: Radar 实体在缺少 `sourceRefs` 或 `lastVerifiedAt` 时必须明确标记 `needs_verification`，并且由 Radar 生成的复习卡片也保留该验证状态 tag。
- Success evidence:
  - 新增 `knowledgeEntityVerificationBadge()`。
  - 新增 `knowledgeEntityVerificationTags()`。
  - `/radar` 详情页显示 `verified` 或 `needs_verification`。
  - 无来源实体的来源区域显示明确的 `needs_verification` 文案。
  - Radar 复习卡片 tags 写入验证状态和 confidence。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增外部联网抓取。
  - 不自动刷新或改写既有 `KnowledgeEntity` 来源。
  - 不把低置信度实体从 Radar 中移除。
  - 不新增数据库 migration。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/knowledge/base.ts`
- `src/app/radar/page.tsx`
- `src/app/radar/actions.ts`
- `tests/unit/knowledge-base.test.ts`
- `helloagents/modules/knowledge-base-radar.md`

## ImpactStatementDraft

- Compatibility boundary: 只新增 Radar 来源验证状态的服务层口径、UI 标记和 flashcard tag；既有 seed、筛选、详情和复习生成入口保持原行为。
- Affected layers:
  - `src/server/knowledge/base.ts`
  - `src/app/radar/page.tsx`
  - `src/app/radar/actions.ts`
  - `tests/unit/knowledge-base.test.ts`
  - docs/helloagents
- Invariants:
  - `sourceRefs` 只作为可核验来源提示，不存储密钥。
  - Radar 生成卡片仍按当前 `userId` scope。
  - 重复生成 Radar 卡片继续使用稳定 ID 和 `skipDuplicates` 保持幂等。
  - 缺少来源时必须显式标记，不伪装成已验证。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
