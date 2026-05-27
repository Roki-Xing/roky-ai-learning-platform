# Sprint 50 Admin Audit Exceptions - Checkpoint

## Checklist

- [√] 写 RED 测试覆盖异常计划聚合。
- [√] 新增 `src/server/admin/plan-audit-exceptions.ts`。
- [√] 复用 Sprint 49 单条审计链路检查口径。
- [√] 聚合层做根因去重，避免缺 decision/job 时重复报派生异常。
- [√] `/admin` 新增“计划审计异常”卡片。
- [√] 异常项提供“审计链路”入口。
- [√] 本地目标测试通过。
- [√] 本地 lint/test/build 通过。
- [√] 备用机目标测试、构建、重启和 health 验收。

## ResumeStateHint

- 本地切片已经完成并验证通过。
- 备用机 `118.25.15.72` 已部署并通过目标测试、构建、容器重启和 health 验收。
- 真实 DNS 仍指向 `118.89.119.107`，公网 `learn.roky.chat` 需 DNS 切换后再补验收。

## Drift Check

- 当前切片服务 Phase 1/2：让管理端能主动发现 DailyPlan 治理证据缺口。
- 未改 DailyPlan、CurriculumDecisionLog 或 AiGenerationJob schema。
- 未改 planner scoring 或 DeepSeek prompt。
- 未新增迁移或持久化字段。
- Decision: continue。
