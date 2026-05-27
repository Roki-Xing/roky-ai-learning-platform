# Sprint 31 Evidence

## 本地验证

- RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `saveVoiceNoteAsNote is not a function`。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts` 4 项通过。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 101 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 待补：`118.89.119.107` 恢复 SSH/HTTP 后执行生产备份、rsync、远端目标测试、build、service health 和 `/voice` Host-header 验收。
- 当前阻塞沿用 Sprint 29/30 复核结果：主生产机 SSH banner exchange timeout，Host-header HTTP 无响应，`learn.roky.chat` DNS 仍指向 `118.89.119.107`。
