# Sprint 38 Checkpoint

## Completed

- [√] 读取 Project 页面、CodeFeedback 数据结构和现有测试。
- [√] RED：新增测试后 `npm test -- tests/unit/projects.test.ts` 失败于缺少 `@/server/projects/code-feedback-summary`。
- [√] 新增 `getProjectMilestoneFeedbackSummaries()`。
- [√] `/projects` 当前任务展示代码反馈摘要。
- [√] `/projects` 里程碑列表展示代码反馈摘要。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。

## Pending

- [√] 同步到备用机。
- [√] 备用机目标测试、build、health 验证。
- [ ] 真实域名公网 HTTPS 验收，等待 DNS 从 `118.89.119.107` 切到 `118.25.15.72` 或主机恢复。

## Drift

- Scope: 仍在目标文档 Phase 12 Project Practice 的项目代码评审闭环范围内。
- Compatibility: 未新增 migration，未改变 `CodeFeedback` schema。
- Security: 保持 `userId + projectId` scope，不执行用户代码。
- Production: 真实 DNS 主机 `118.89.119.107` 仍不稳定；备用机 `118.25.15.72` 是当前可验证发布面。
