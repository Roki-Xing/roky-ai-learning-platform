# Sprint 57 Voice Lesson Scope - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖 VoiceNote 显式 lesson 归属校验。
- [√] `saveVoiceNote()` 显式不可见 lesson 直接拒绝。
- [√] 目标测试 GREEN。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地实现已完成。
- 本地 `npm run lint`、`npm test`、`npm run build` 已通过。
- 备用机 `118.25.15.72` 已完成备份、rsync、远端目标测试、远端构建、容器重启和 health 验收。
- 真实 DNS 仍指向 `118.89.119.107`；DNS 切换前只能声明备用机 `118.25.15.72` 已部署。

## Drift Check

- 当前切片服务 Phase 14：server actions 都检查 userId，并补强 VoiceNote 显式 lesson 绑定边界。
- 未改 VoiceNote schema。
- 未改转写 provider 或音频保存策略。
- 未新增 migration。
- Decision: needs-dns-cutover-for-public-domain。
