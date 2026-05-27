# Sprint 32 Evidence

## 本地验证

- RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `sendVoiceNoteToCoach is not a function`。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts` 6 项通过。
- GREEN：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts` 18 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 103 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 待补：`118.89.119.107` 恢复 SSH/HTTP 后执行生产备份、rsync、远端目标测试、build、service health 和 `/voice` Host-header 验收。
- 当前阻塞沿用 Sprint 29-31 复核结果：主生产机 SSH banner exchange timeout，Host-header HTTP 无响应，`learn.roky.chat` DNS 仍指向 `118.89.119.107`。
