# Sprint 38 Reflection

- Sprint 37 让项目 milestone 可以生成 `CodeSubmission` 和 `CodeFeedback`；Sprint 38 让这些反馈直接回到项目页，减少用户跳转成本。
- 新增服务只读 `CodeFeedback`，没有引入第二套反馈生成逻辑。
- 查询按 `userId + projectId` scope，并在测试里显式构造其他用户反馈，防止泄露。
- 后续可以继续补“从项目反馈一键生成/查看 bug card”，但当前复习卡生成仍由既有 `submitCodeForReview()` 保证。
