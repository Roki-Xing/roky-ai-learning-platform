# Sprint 44 Checkpoint

## Scope

- Phase: Review usability hardening.
- Slice: Replace `/review` placeholder settings card with real queue and schedule summary.

## Completed

- [√] 写入 RED 测试，覆盖 review schedule summary 和队列范围口径。
- [√] 新增 `buildReviewScheduleSummary()`。
- [√] `/review` 右侧展示队列范围、scope 和 due count。
- [√] `/review` 右侧展示当前 MVP 复习规则。
- [√] 本地目标测试、lint、完整测试、build 通过。

## Completed Remote

- [√] 备用机备份与同步。
- [√] 备用机目标测试与构建。
- [√] 备用机容器重启和 health 验收。
- [√] 补充远端证据。

## Drift Check

- 没有新增 migration。
- 没有接入 FSRS。
- 没有改变 `rateFlashcard()` 或 ReviewLog 写入逻辑。
- 没有改变复习卡片默认队列筛选。
