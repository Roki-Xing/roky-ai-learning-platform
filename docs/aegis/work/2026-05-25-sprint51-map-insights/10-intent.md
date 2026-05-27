# Sprint 51 Map Insights - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 6，把 `/map` 从“有真实指标”推进到“能一眼看出偏弱方向和下一步补哪里”。
- Goal: `/map` 顶部直接回答偏弱领域、复习欠账、代码练习少和下一步补弱方向。
- Success evidence:
  - 新增 `buildKnowledgeMapInsights()` 服务层 helper。
  - helper 从真实 `domainStats` 生成 weakDomains、reviewDebtDomains、codeLightDomains 和 nextFocus。
  - `/map` 顶部新增 4 张摘要卡：偏弱领域、复习欠账、代码练习少、下一步补哪里。
  - 摘要卡链接到对应领域详情。
  - 现有领域列表、主题列表和右侧 lessons/cards/notes/misconceptions 详情保持可用。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不改知识地图 masteryScore 公式。
  - 不新增数据库 migration。
  - 不改变 Planner 选题评分。
  - 不调用外部 AI。
  - 不展示密钥、数据库连接串或原始 env。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/map/page.tsx`
- `src/server/map/analytics.ts`
- `tests/unit/map-analytics.test.ts`
- `docs/aegis/work/2026-05-24-sprint11-knowledge-map/*`
- `helloagents/CHANGELOG.md`

## ImpactStatementDraft

- Compatibility boundary: 只增强 `/map` 的读侧摘要和推荐可见性；学习、复习、测验、代码提交、生成和 planner scoring 保持原样。
- Affected layers:
  - `src/server/map/analytics.ts`
  - `src/app/map/page.tsx`
  - `tests/unit/map-analytics.test.ts`
  - docs/helloagents
- Invariants:
  - `/map` 仍按当前用户 `userId` 聚合学习信号。
  - masteryScore 公式保持目标文档定义。
  - `/map` 不显示占位文案作为核心内容。
  - 不把 API key 或 env secret 写入页面、日志或文档。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
