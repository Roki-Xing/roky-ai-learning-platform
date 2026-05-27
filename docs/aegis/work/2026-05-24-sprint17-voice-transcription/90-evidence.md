# Sprint 17 Evidence

## 本地验证

- RED：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts` 初次失败于缺少 `@/server/voice/transcription` 和 `@/server/voice/submit`。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts`：8 项通过。
- `npm test`：70 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint17-20260524-074933.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npx prisma generate`：通过。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts`：8 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- Host-header `/voice`：`临时发送到服务端转写`、`如果服务端没有转写密钥`、`保存 Voice Note`、`发送到 Coach`、`生成 Flashcards` 均 PASS。
- Provider 状态：`OPENAI_API_KEY=false`、`OPENAI_TRANSCRIBE_MODEL=null`；当前生产会走手动 transcript fallback。
