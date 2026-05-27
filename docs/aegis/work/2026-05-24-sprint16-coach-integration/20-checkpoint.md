# Sprint 16 Coach Integration - Checkpoint

## Todo

- [√] 审计现有 `/coach` 页面、actions、AI schema、context、library/progress 集成。
- [√] 创建 Sprint 16 工作记录。
- [√] 写 RED 测试覆盖 Coach context 与 submit/card 服务层。
- [√] 新增 `src/server/coach/submit.ts` 并接入 `/coach`、`/voice` actions。
- [√] 补齐 Coach context 的代码反馈、知识卡、glossary/breadth 摘要。
- [√] 本地目标测试、全量测试、lint、build 通过。
- [√] 生产同步、重启和 Host-header 验收。
- [√] 补齐生产证据和 reflection。

## Current Slice

完成。

## Evidence Refs

- RED：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts` 初次失败于缺少 `@/server/coach/submit`。
- RED：同一轮测试显示 `buildCoachContext()` 缺少 `recentCodeFeedback`、`recentKnowledge`、`standaloneReviewCards`。
- GREEN：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts` 9 项通过。
- 本地：`npm test` 65 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- Aegis helper：`check --root` 失败于历史 `docs/aegis/work/*` markdown 未索引；这是既有文档结构警告，不影响本次功能门禁。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint16-20260524-073404.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、Coach 目标测试、`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/coach`、`/voice`、`/library`、`/progress` 关键文本均 PASS。
- 生产：只读计数 `ThoughtReview=4`、`ThoughtReviewCards=3`、`VoiceNotesLinkedToCoach=1`。

## Drift Check

- 当前工作仍服务长期文档 Phase 7：Thought Review Coach。
- 保持“不执行用户代码”和“API key server-side only”的边界。
- 未新增数据模型，避免生产迁移风险。
- 服务层抽取减少 `/coach` 与 `/voice` 行为分叉。

## Next

继续长期文档后续阶段，可进入 Coach 多轮追问、misconception 自动沉淀或下一阶段语音增强。
