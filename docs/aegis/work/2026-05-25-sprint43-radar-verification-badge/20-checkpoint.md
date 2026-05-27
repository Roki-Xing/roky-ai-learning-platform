# Sprint 43 Checkpoint

## Scope

- Phase: AI Radar可信度治理。
- Slice: 对缺少来源或验证日期的 Radar 实体提供 `needs_verification` 明示状态。

## Completed

- [√] 写入 RED 测试，覆盖无来源实体 badge 和 Radar 卡片 tag。
- [√] 在 `src/server/knowledge/base.ts` 新增验证状态 helper。
- [√] 在 `/radar` 详情页展示 `verified` / `needs_verification`。
- [√] 在无来源区域展示 `needs_verification：该实体暂无可核验来源。`
- [√] 在 Radar 复习卡片生成 action 中加入验证状态 tags。
- [√] 修复 `buildEntityFlashcard()` 参数重复 `tags` 字段。
- [√] 本地目标测试、lint、完整测试、build 通过。

## Completed Remote

- [√] 备用机备份与同步。
- [√] 备用机目标测试与构建。
- [√] 备用机容器重启和 health 验收。
- [√] 补充远端证据。

## Drift Check

- 没有新增数据库字段或 migration。
- 没有引入外部联网抓取。
- 没有改动 API key、Admin Secret、DeepSeek provider 或 auth 策略。
- 保持所有 Radar 卡片生成按 `userId` scope。
