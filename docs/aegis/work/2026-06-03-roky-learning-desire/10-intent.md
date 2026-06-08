# Roky Learning Desire Optimization Intent

## Requested Outcome

按 `/mnt/c/Users/Xing/Desktop/roky_learn_learning_desire_full_guidance.md` 继续全面优化 Roky Learn，让产品更有每日学习欲望、更适合移动端，并补齐审查与验收标准化。

## Scope

- Phase 1：同步审查脚本、Preview 验收文档、部署校验卡、版本信息展示。
- Phase 2：Daily Quest、XP、Badge 的计算型 MVP，并接入首页和 `/progress`。
- Phase 3：移动端底部导航组件化、PWA manifest、移动端 metadata。
- 后续 Phase：在不新增数据库迁移的前提下增强 Today、Voice、Glossary/Radar、Projects 的学习入口。

## Non-goals

- 不改生产 Nginx、DNS、数据库、密钥。
- 不新增高风险迁移。
- 不回滚当前 worktree 中已有的 Roky Learn 改动。
- 不混入 Shike/拾刻/云真机/release evidence 目标。

## Risk Hints

- 生产部署、容器重启、root/sudo、密钥和 Preview token 都属于高风险边界，本地优化阶段不触碰。
- 当前 worktree 已有大量未提交改动，需要在现有基础上叠加，不能清理或重置。
- Preview Mode 必须继续保持只读。

## Baseline Read Set

- `/mnt/c/Users/Xing/Desktop/roky_learn_learning_desire_full_guidance.md`
- `AGENTS.md`
- `src/lib/routes.ts`
- `src/components/app-shell.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/progress/page.tsx`
- `src/app/today/page.tsx`
- `src/server/voice/*`
- `src/server/knowledge/paths.ts`
- `docs/deploy-checklist.md`
- `docs/ui-review-checklist.md`

## Impact Statement

本轮主要是读侧/展示侧与工具侧增强，目标是提升学习动机和移动可用性；核心持久化、鉴权、Preview 写保护、AI provider secret 注入和生产部署边界保持不变。
