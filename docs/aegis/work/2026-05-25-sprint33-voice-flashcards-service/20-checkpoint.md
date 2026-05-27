# Sprint 33 Checkpoint

## TodoCheckpointDraft

- [√] 读取目标文档并定位 Voice Note → Flashcards 服务层测试缺口。
- [√] 复核 `/voice` 已有生成 Flashcards UI 和 action。
- [√] 写 RED 测试覆盖 VoiceNote 通过 linked ThoughtReview 生成卡片。
- [√] 写 RED 测试覆盖重复生成不重复创建卡片。
- [√] 写 RED 测试覆盖没有 ThoughtReview 的 VoiceNote 拒绝。
- [√] 写 RED 测试覆盖跨用户 VoiceNote 拒绝。
- [√] 新增 `generateVoiceNoteFlashcards()` 服务函数。
- [√] `generateVoiceNoteFlashcardsAction()` 改为复用服务函数。
- [√] 本地 Voice/Coach/Review 相关回归通过。
- [√] 本地全量测试、lint、build 通过。
- [√] 备用机同步、远端目标测试、build、容器启动和 HTTP Host-header 验收。
- [ ] DNS 从主生产机切换到备用机后的真实公网域名验收。

## ResumeStateHint

- 当前活跃切片：Sprint 33 本地代码实现、目标测试和完整本地门禁已完成。
- 当前阻塞：`118.89.119.107` 仍不可观测；`118.25.15.72` 已部署并通过备用机 HTTP Host-header 验收，但 `learn.roky.chat` DNS 仍解析到 `118.89.119.107`。
- 下一步：将 `learn.roky.chat` A 记录切到 `118.25.15.72`，再补真实公网域名验收和 HTTPS 证书配置。
- 不要同步 `.env*`，不要清理 dirty worktree，不要执行 destructive git 操作。

## DriftCheckDraft

- Scope: 仍在长期目标的 Voice Note → Coach → Flashcards 沉淀闭环范围内。
- Compatibility: 没有新增 migration；ThoughtReview/Flashcard schema 不变。
- New owner: `src/server/voice/submit.ts` 现在负责 Voice Note 创建、Voice Note → Note、Voice Note → Coach、Voice Note → Flashcards 四条服务层路径。
- Fallback/retirement: `/voice` action 内联查 VoiceNote 和调用 Coach 生成卡片的逻辑已收敛到服务层；没有保留重复实现。
- Evidence: RED/GREEN 目标测试、相关回归、本地 `npm run lint`、`npm test`、`npm run build` 已通过；备用机远端目标测试、build、health 和 HTTP Host-header 验收已通过。
- Decision: continue。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
