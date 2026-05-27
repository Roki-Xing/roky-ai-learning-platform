# Sprint 37 Reflection

- 项目 milestone 的代码产物现在不再只是文本存档，可以进入现有代码反馈、misconception 和复习卡片链路。
- 本次刻意复用 `submitCodeForReview()`，避免引入第二套代码评审逻辑。
- `ProjectMilestone.codeSubmissionId` 是轻量链接字段，不承担 ownership 判定；ownership 仍由 `userId + projectId + milestoneId` 和 `submitCodeForReview()` 的 lesson scope 共同保证。
- 页面 hidden `localDate` 已改为用户时区日期，避免项目代码评审回退到 UTC 日。
