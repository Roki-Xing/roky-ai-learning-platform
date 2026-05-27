# Sprint 57 Voice Lesson Scope - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 14 Auth 与多用户完善，补强 Voice Note 保存时的显式 lesson 归属校验。
- Goal: 用户保存 VoiceNote 时，如果表单显式传入 `lessonId`，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝，避免静默降级或错误关联。
- Success evidence:
  - `saveVoiceNote()` 对显式不可见 `lessonId` 抛出 `Lesson not available for voice note`。
  - 未传入 `lessonId` 时仍可回退到当前用户最近正式课程。
  - `tests/unit/voice-submit.test.ts` 覆盖 cross-user explicit lesson 拒绝。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增数据库 migration。
  - 不改变 VoiceNote schema。
  - 不改变 VoiceNote → Coach / Note / Flashcards 的既有用户归属校验。
  - 不改转写 provider 或音频保存策略。
  - 不记录任何 API key、数据库连接串或 secret。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/server/voice/submit.ts`
- `tests/unit/voice-submit.test.ts`
- `helloagents/modules/voice-note.md`
- `helloagents/modules/auth-demo-mode.md`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只收紧 VoiceNote 保存时显式 `lessonId` 的 owner 检查；无显式 lesson 的默认回退逻辑保持。
- Affected layers:
  - `src/server/voice/submit.ts`
  - `tests/unit/voice-submit.test.ts`
  - docs/helloagents
- Invariants:
  - VoiceNote 写入按当前 `userId` scoped。
  - 显式绑定 lesson 必须来自当前用户正式、未归档、非测试 DailyPlan。
  - 不长期保存音频文件。
  - 不暴露 secret。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
