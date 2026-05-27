# Sprint 31 Voice Note Service - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档中 Voice Note 验收项，把“语音笔记保存为 Note”的沉淀路径从页面 action 内联逻辑收敛为可测试服务层。
- Goal: 新增 `saveVoiceNoteAsNote()`，确保 VoiceNote 只能由所属 user 转为 Note，重复保存更新同一条 linked Note。
- Success evidence:
  - `saveVoiceNoteAsNote()` 按 `userId + voiceNoteId` scope 读取 VoiceNote。
  - 首次调用创建 Note，并把 `VoiceNote.noteId` 指向该 Note。
  - 重复调用更新同一条 Note，不重复创建。
  - 跨用户调用被拒绝。
  - `/voice` 的 `saveVoiceNoteAsNoteAction()` 复用服务函数，页面行为不变。
  - 本地目标测试通过。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 生产恢复后同步并补远端目标测试、build、service health 和 `/voice` Host-header 验收。
- Stop condition: 上述本地证据满足，或生产部署被 `118.89.119.107` SSH/HTTP 不可观测阻塞。
- Non-goals:
  - 不新增数据库迁移。
  - 不改变 VoiceNote 创建、转写或 Coach 发送逻辑。
  - 不长期保存音频文件。
  - 不在前端暴露 provider key。
  - 不执行用户提交代码。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/voice/submit.ts`
- `src/server/voice/voice-note.ts`
- `src/app/voice/actions.ts`
- `src/app/voice/page.tsx`
- `tests/unit/voice-submit.test.ts`
- `tests/unit/voice-note.test.ts`
- `tests/unit/voice-transcription.test.ts`

## ImpactStatementDraft

- Compatibility boundary: 只抽取 Voice Note → Note 持久化逻辑，不改变用户页面流程或数据模型。
- Affected layers:
  - `src/server/voice/submit.ts`
  - `src/app/voice/actions.ts`
  - `tests/unit/voice-submit.test.ts`
  - docs/helloagents
- Invariants:
  - VoiceNote 和 Note 都必须按 `userId` scope。
  - 已 linked 的 VoiceNote 重复保存为 Note 应更新原 Note，不重复创建。
  - Note 内容继续使用 `buildVoiceNoteMarkdown()`。
  - Note 标题继续使用 `buildVoiceNoteTitle()`。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
