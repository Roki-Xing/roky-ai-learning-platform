# Voice Note MVP

## 状态

已上线并完成生产闭环验收。

## 用户流程

1. 打开 `/voice`。
2. 录音或上传音频进行浏览器本地预览。
3. 上传音频可临时发送到服务端转写；无转写密钥时使用手动 transcript。
4. 在 Transcript 区粘贴或编辑转写文本。
5. 保存 Voice Note。
6. 在“语音学习流水线”中继续执行：
   - 送 Coach 检查，生成结构化 ThoughtReview。
   - 整理成笔记，保存为 Note。
   - 生成复习卡片。
   - 进入 `/review` 复习。

## 首页推荐

首页 `Next Best Action` 已纳入 `todayVoiceNoteCount`：

- 今日学习未完成：优先 `/today`。
- 今日有到期卡片：优先 `/review`。
- 有 open misconception：优先 `/coach`。
- 今日还没有笔记：优先 `/notes`。
- 今日已经学习并写过笔记，但还没有 Voice Note：优先 `/voice`，提示“说出今天的理解”。
- 学习、复习、笔记和语音表达都完成后，再推荐项目实践或知识地图。

## 数据模型

- `VoiceNote`
  - `userId`
  - `lessonId`
  - `mode`
  - `audioUrl`
  - `transcript`
  - `editedTranscript`
  - `thoughtReviewId`
  - `noteId`

## 重要约束

- MVP 不长期保存音频文件；服务端只保存 transcript 和本地/临时音频名称引用。
- 音频上传限制为 20MB。
- 仅允许常见音频 MIME 类型。
- `OPENAI_API_KEY` 和 `OPENAI_TRANSCRIBE_MODEL` 只在服务端读取。
- 无转写 key、测试环境、转写失败或返回空文本时，必须显式要求手动 transcript。
- 不在前端暴露 API Key。
- 不执行用户提交的代码或音频内容。
- 显式传入 `lessonId` 时，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝。
- 未显式传入 `lessonId` 时，可回退到当前用户最近正式课程。
- 从 Voice Note 进入 Coach 时，`reviewJson` 可包含持久化元数据；读取时必须通过 `parseStoredThoughtReview()` 过滤到 schema 字段后再校验。

## 服务层

- `src/server/voice/transcription.ts`
  - `validateVoiceAudioFile()`
  - `transcribeVoiceAudio()`
  - `MAX_VOICE_AUDIO_BYTES`
- `src/server/voice/submit.ts`
  - `saveVoiceNote()`
  - 支持 manual transcript 与 server-side transcription 两种路径。
  - `saveVoiceNoteAsNote()`
  - 按 `userId + voiceNoteId` 将 VoiceNote 沉淀为 Note，重复调用更新同一条 linked Note。
  - `sendVoiceNoteToCoach()`
  - 按 `userId + voiceNoteId` 将 VoiceNote 发送到 Coach，重复调用复用同一条 linked ThoughtReview。
  - `generateVoiceNoteFlashcards()`
  - 按 `userId + voiceNoteId` 将 linked ThoughtReview 生成稳定 Flashcards，重复调用不重复创建。
- `src/app/voice/ui/voice-learning-pipeline.tsx`
  - 展示 Voice Note → Coach → Note → Flashcards → Review 的阶段状态和 CTA。
  - 组件不直接 import server actions；由 `/voice` page 注入 action，保持 UI 单测不加载服务端 env。

## 本地验收

- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts`：10 项通过。
- `saveVoiceNoteAsNote()` 覆盖 VoiceNote → Note 创建、重复保存不重复创建、跨用户拒绝。
- `sendVoiceNoteToCoach()` 覆盖 VoiceNote → ThoughtReview 创建、重复发送不重复创建、跨用户拒绝。
- `generateVoiceNoteFlashcards()` 覆盖 VoiceNote → Flashcards 创建、重复生成不重复创建、没有 ThoughtReview 拒绝、跨用户拒绝。
- Sprint 57 后，`saveVoiceNote()` 覆盖显式跨用户 lesson 拒绝。
- `npm test`：106 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验收

- Sprint 33：
  - 主生产机 `118.89.119.107` 仍不可观测，SSH banner exchange timeout，真实 HTTPS health 超时。
  - 备用机 `118.25.15.72` 已部署 `/home/ubuntu/ai-learning-platform`。
  - 备用机使用 `node:22-bookworm` 容器运行应用，监听 `127.0.0.1:3102`。
  - 备用机远端目标测试 12 项通过，生产构建通过。
  - 备用机 Nginx 已添加 `learn.roky.chat` HTTP server block，Host-header health 返回 `ok`。
  - 真实域名仍需 DNS A 记录切到 `118.25.15.72` 后补 HTTPS。
- Sprint 17：
  - 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
  - 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint17-20260524-074933.tar.gz`。
  - 生产：`npm ci`、`npx prisma generate`、Voice 目标测试、`npm run build` 均通过。
  - 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
  - 线上：`/voice` 可见 `临时发送到服务端转写`、`如果服务端没有转写密钥`、`保存 Voice Note`、`发送到 Coach`、`生成 Flashcards`。
  - 生产当前未配置 `OPENAI_API_KEY`，自动转写会安全回退到手动 transcript。
- `/voice?voiceNoteId=cmpip5mt60001wg0znw0ti34v` 显示 `Coach linked`、`Note saved`、`已生成卡片：1`。
- `/coach?reviewId=cmpipaoov0003wg0z44txgyvo` 显示语音评审和已生成卡片。
- `/notes` 显示语音笔记 Markdown，包含 `thoughtReviewId`。
- `/review` 显示到期队列，包含 Voice Note 生成后的复习卡片。
