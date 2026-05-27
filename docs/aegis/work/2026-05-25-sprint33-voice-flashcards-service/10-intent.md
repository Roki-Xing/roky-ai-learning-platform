# Sprint 33 Voice Flashcards Service - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档中 Voice Note 到复习卡片的闭环，把“生成 Flashcards”的页面 action 内联逻辑收敛为可测试服务层。
- Goal: 新增 `generateVoiceNoteFlashcards()`，确保 VoiceNote 只能由所属 user 生成卡片，且必须先 linked ThoughtReview。
- Success evidence:
  - `generateVoiceNoteFlashcards()` 按 `userId + voiceNoteId` scope 读取 VoiceNote。
  - 没有 linked ThoughtReview 的 VoiceNote 会被拒绝。
  - 首次调用通过 linked ThoughtReview 生成 Flashcards，并自动带上 `voice-note` 标签。
  - 重复调用复用 `generateFlashcardsForThoughtReview()` 的稳定 id/upsert 机制，不重复创建卡片。
  - 跨用户 VoiceNote id 会被拒绝。
  - `/voice` 的 `generateVoiceNoteFlashcardsAction()` 复用服务函数，页面行为不变。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/voice` Host-header 验收。
- Stop condition: 上述本地证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 ThoughtReview schema 或 Flashcard schema。
  - 不改变 VoiceNote 创建、转写、保存 Note 或发送 Coach 逻辑。
  - 不执行用户提交代码。
  - 不在前端暴露 provider key。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/voice/submit.ts`
- `src/app/voice/actions.ts`
- `src/app/voice/page.tsx`
- `src/server/coach/submit.ts`
- `src/server/ai/thought-review.ts`
- `tests/unit/voice-submit.test.ts`
- `tests/unit/coach-submit.test.ts`
- `tests/unit/review-filter.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只抽取 Voice Note → ThoughtReview → Flashcards 持久化逻辑，不改变用户页面流程或数据模型。
- Affected layers:
  - `src/server/voice/submit.ts`
  - `src/app/voice/actions.ts`
  - `tests/unit/voice-submit.test.ts`
  - docs/helloagents
- Invariants:
  - VoiceNote、ThoughtReview 和 Flashcard 写入都必须按 `userId` scope。
  - 没有 linked ThoughtReview 的 VoiceNote 不能生成卡片。
  - 重复生成必须保持 Flashcard 数量稳定。
  - Voice Note 生成的卡片必须带 `voice-note` 标签，便于 review/filter/progress 归因。
  - 不执行用户代码，不暴露密钥。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
