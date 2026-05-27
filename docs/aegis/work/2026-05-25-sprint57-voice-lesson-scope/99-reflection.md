# Sprint 57 Reflection

## What Changed

- `saveVoiceNote()` 对显式传入的 `lessonId` 执行当前用户正式计划归属校验。
- 不可见 lesson 直接抛出 `Lesson not available for voice note`。
- 未显式传入 `lessonId` 时，仍按当前用户最近正式计划回退。

## What Stayed Stable

- 没有数据库迁移。
- VoiceNote → Note、VoiceNote → Coach、VoiceNote → Flashcards 的既有 `userId + voiceNoteId` scope 保持。
- 音频仍不长期保存。
- 转写 provider 和密钥读取方式未变。

## Follow-up

- 继续 Phase 14 的 server action scope audit，优先补缺少跨用户测试的写入入口。
