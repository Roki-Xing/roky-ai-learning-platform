# Sprint 32 Voice Coach Service - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档中 Voice Note 到 Coach 的闭环，把“发送到 Coach”的沉淀路径从页面 action 内联逻辑收敛为可测试服务层。
- Goal: 新增 `sendVoiceNoteToCoach()`，确保 VoiceNote 只能由所属 user 发送到 Coach，重复发送复用已 linked ThoughtReview。
- Success evidence:
  - `sendVoiceNoteToCoach()` 按 `userId + voiceNoteId` scope 读取 VoiceNote。
  - 首次调用创建 ThoughtReview，并把 `VoiceNote.thoughtReviewId` 指向该 review。
  - 重复调用返回同一条 linked ThoughtReview，不重复创建。
  - Voice mode 正确映射到 Coach mode。
  - 跨用户调用被拒绝。
  - `/voice` 的 `sendVoiceNoteToCoachAction()` 复用服务函数，页面行为不变。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/voice` Host-header 验收。
- Stop condition: 上述本地证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 VoiceNote 创建、转写、保存 Note 或生成卡片逻辑。
  - 不改变 ThoughtReview schema。
  - 不长期保存音频文件。
  - 不在前端暴露 provider key。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/voice/submit.ts`
- `src/server/voice/voice-note.ts`
- `src/app/voice/actions.ts`
- `src/app/voice/page.tsx`
- `src/server/coach/submit.ts`
- `tests/unit/voice-submit.test.ts`
- `tests/unit/coach-submit.test.ts`
- `tests/unit/thought-review.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只抽取 Voice Note → Coach 持久化逻辑，不改变用户页面流程或数据模型。
- Affected layers:
  - `src/server/voice/submit.ts`
  - `src/app/voice/actions.ts`
  - `tests/unit/voice-submit.test.ts`
  - docs/helloagents
- Invariants:
  - VoiceNote 和 ThoughtReview 都必须按 `userId` scope。
  - 已 linked 的 VoiceNote 重复发送到 Coach 应返回原 ThoughtReview，不重复创建。
  - Voice Note 进入 Coach 时继续写入 `reviewJson.source = "voice-note"` 和 `voiceNoteId` 元数据。
  - 不执行用户代码，不暴露密钥。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
