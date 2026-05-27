# Sprint 39 Reflection

- Sprint 37 让项目 milestone 可以进入 `CodeSubmission` / `CodeFeedback` 链路，Sprint 38 让反馈摘要回到项目页，Sprint 39 把反馈生成的复习卡片带回项目页和项目专属复习队列。
- 本次没有新增卡片生成逻辑，而是复用已有 `code-feedback:<submissionId>:<index>` stable id 和 `ProjectMilestone.codeSubmissionId` 关联。
- `code-feedback` 被建模为 review source，但不是 standalone review source，因为这些卡片仍关联 official lesson。
- 后续可继续优化为项目详情里展示最近一张 code feedback card 或支持按 milestone 聚焦复习。
