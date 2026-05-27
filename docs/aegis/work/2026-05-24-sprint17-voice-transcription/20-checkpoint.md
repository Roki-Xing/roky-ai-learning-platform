# Sprint 17 Voice Transcription - Checkpoint

## Todo

- [√] 审计 Phase 8 与当前 `/voice` 实现差距。
- [√] 写 RED 测试覆盖音频校验、无 key fallback、转写保存。
- [√] 新增服务端转写适配和 VoiceNote 保存服务层。
- [√] `/voice` 文件输入提交到服务端，action 复用服务层。
- [√] 本地目标测试、全量测试、lint、build 通过。
- [√] 生产同步、重启和 Host-header 验收。
- [√] 补齐生产证据和 reflection。

## Current Slice

完成。

## Evidence Refs

- RED：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts` 初次失败于缺少 `@/server/voice/transcription` 和 `@/server/voice/submit`。
- GREEN：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts` 8 项通过。
- 本地：`npm test` 70 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint17-20260524-074933.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、Voice 目标测试、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/voice` 关键文本均 PASS。
- 生产：`OPENAI_API_KEY=false`，当前自动转写 provider 未配置，会按设计回退到手动 transcript。

## Drift Check

- 当前工作服务长期文档 Phase 8。
- 保持音频不长期保存、API key 不进前端。
- 未新增数据模型，避免生产迁移风险。

## Next

继续长期文档后续阶段，优先补 Phase 9 Glossary/Radar 的每日广度轮转与来源可验证性。
