# Sprint 17 Voice Transcription - Intent

## TaskIntentDraft

- Requested outcome: 完成 Phase 8 Voice Note MVP 中的服务端音频上传与转写路径。
- Goal: `/voice` 不再只是本地音频预览 + 手动 transcript，而是可以把上传音频临时送到服务端转写；无 key 时仍安全回退到手动 transcript。
- Success evidence:
  - 音频上传有服务端大小和 MIME 类型校验。
  - `saveVoiceNote()` 可保存手动 transcript。
  - `saveVoiceNote()` 可在 transcript 为空时使用服务端转写结果。
  - 无转写 key 或测试环境不会伪造 transcript，而是返回 manual-required。
  - `/voice` 文件输入提交 `audioFile` 到 Server Action。
  - 本地 `npm test`、`npm run lint`、`npm run build` 通过。
  - 生产同步后服务 active，Host-header 验证 `/voice` 文案和表单。
- Stop condition: 上述证据满足，或转写 provider/生产环境阻塞需要暂停。
- Non-goals:
  - 不做实时语音对话。
  - 不长期保存音频文件。
  - 不把 API key 暴露到前端。
  - 不新增数据库字段。
- Scope: Voice upload validation, transcription adapter, voice note save service, `/voice` UI。
- Change kinds:
  - feature
  - hardening

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Phase 8。
- `src/app/voice/page.tsx`
- `src/app/voice/actions.ts`
- `src/app/voice/ui/voice-capture.tsx`
- `src/server/voice/voice-note.ts`
- `prisma/schema.prisma`
- Next.js 16 Server Actions docs: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`

## ImpactStatementDraft

- Compatibility boundary: 复用现有 `VoiceNote` 模型，不新增迁移；音频只临时进入 Server Action，不落盘。
- Affected layers:
  - `src/server/voice/*`
  - `src/app/voice/actions.ts`
  - `src/app/voice/ui/voice-capture.tsx`
  - tests
  - helloagents/docs
- Owners:
  - `transcribeVoiceAudio()` 负责音频校验和 provider 转写。
  - `saveVoiceNote()` 负责保存 VoiceNote 和 lesson 归属校验。
- Invariants:
  - API key server-side only。
  - 音频不长期保存。
  - 超大或非音频文件拒绝转写。
  - 无 key 时必须要求手动 transcript。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
