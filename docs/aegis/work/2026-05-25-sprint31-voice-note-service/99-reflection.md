# Sprint 31 Reflection

## What Changed

- `src/server/voice/submit.ts` 新增 `saveVoiceNoteAsNote()`：
  - 只读取当前用户拥有的 VoiceNote。
  - 首次保存创建 Note，并写回 `VoiceNote.noteId`。
  - 重复保存更新同一条 Note。
  - 跨用户 VoiceNote id 会抛出 `VoiceNote not found`。
- `src/app/voice/actions.ts` 的 `saveVoiceNoteAsNoteAction()` 改为调用服务函数。

## Verification Notes

- 目标测试覆盖 VoiceNote → Note 创建、重复保存更新同一 Note、跨用户拒绝。
- 相关回归覆盖 VoiceNote helper、音频校验和无 key 转写 fallback。
- 完整 lint/test/build 已通过。
- 没有新增 migration。

## Follow-Up

- 生产恢复后补 `/voice` Host-header 验收，确认“保存为 Note”按钮仍可用且不会重复创建笔记。
- 后续可以在 `/notes` 给 voice-note 标签增加筛选，但当前沉淀路径已经可服务层验证。
