# Sprint 39 Checkpoint

## Completed

- [√] 审计 Project milestone code feedback cards 当前生成形态。
- [√] RED：新增项目代码反馈卡片摘要测试，失败于缺少 `getProjectCodeFeedbackCardSummary()`。
- [√] RED：新增 `code-feedback` review source 和 focused queue 测试，失败于归一化缺失和队列为空。
- [√] 新增 `getProjectCodeFeedbackSubmissionIds()` 和 `getProjectCodeFeedbackCardSummary()`。
- [√] 新增 `buildProjectCodeFeedbackFlashcardWhere()`，复用到摘要和 review 统计。
- [√] `/review` 支持 `source=code-feedback&projectId=<id>`。
- [√] `/projects` 显示代码反馈卡片计数、到期数和聚焦复习入口。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。

## Pending

- [√] 同步到备用机。
- [√] 备用机目标测试、build、health 验证。
- [ ] 真实域名公网 HTTPS 验收，等待 DNS 从 `118.89.119.107` 切到 `118.25.15.72` 或主机恢复。

## Drift

- Scope: 仍在目标文档 Phase 12 Project Practice 的项目代码评审到复习闭环范围内。
- Compatibility: 未新增 migration，未改变 `CodeFeedback`、`CodeSubmission` 或 `Flashcard` schema。
- Security: 保持 `userId + projectId` scope，不执行用户代码，不暴露密钥。
- Production: 真实 DNS 仍指向 `118.89.119.107`，备用机 `118.25.15.72` 已通过强制解析 HTTP health 验证。
