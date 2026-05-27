# Sprint 35 Checkpoint

## TodoCheckpointDraft

- [√] 读取目标文档 Phase 12 并定位项目完成后复习入口可见性缺口。
- [√] 复核 `/projects` 完成态 UI、project flashcard id 规则和 `/review` standalone card 筛选。
- [√] 写 RED 测试覆盖项目复习卡片摘要 user scope、总数和到期数。
- [√] 新增 `getProjectReviewCardSummary()` 服务函数。
- [√] `/projects` 完成态 summary 区显示项目卡片数量、到期数量和“去复习项目卡片”入口。
- [√] 本地目标测试 GREEN。
- [√] 本地全量 lint/test/build 门禁。
- [√] 备用机同步、远端目标测试、build、容器启动和 Host-header health 验收。
- [ ] DNS 从主生产机切换到备用机后的真实公网域名验收。

## ResumeStateHint

- 当前活跃切片：Sprint 35 代码实现、文档记录、本地完整门禁和备用机远端验证已完成。
- 当前阻塞：真实 `learn.roky.chat` DNS 仍解析到 `118.89.119.107`，真实 HTTPS 验收需要切 DNS 后补。
- 下一步：跑本地 `npm run lint`、`npm test`、`npm run build`；通过后同步备用机并验证。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在目标文档 Phase 12 Project Practice 的项目完成 → 复习卡片 → Review 闭环范围内。
- Compatibility: 没有新增 migration；Flashcard 和 Project schema 不变。
- New owner: `src/server/projects/review-cards.ts` 负责项目复习卡片摘要查询。
- Fallback/retirement: 没有新增 fallback；UI 从“只显示 summary”升级为显示 summary + review card entry。
- Evidence: RED 缺模块失败、GREEN 项目测试 9 项通过；本地 `npm run lint`、`npm test`、`npm run build` 已通过；备用机目标测试、build、容器启动和 HTTP health 已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
