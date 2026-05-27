# Sprint 6 Projects Checkpoint

## Current Todo

- [√] Add failing tests for project templates and project progress helpers.
- [√] Add Prisma models and manual migration.
- [√] Implement project service helpers and seed data.
- [√] Add `/projects` page and Server Actions.
- [√] Add navigation and `/progress` project metrics.
- [√] Update knowledge-base docs.
- [√] Run local verification.
- [√] Deploy to production and verify live pages.

## Active Slice

Sprint 6 completed and production verified.

## Evidence Refs

- Next Server Actions docs read locally.
- Sprint 6 requirements read from the long-term document.
- `npm test`: 28 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed, route table includes `/projects`.
- Production backup: `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint6-20260524-040653.tar.gz`.
- Production migration: `npm run db:migrate:manual:learning-projects` succeeded.
- Production build and `ai-learning-platform.service` restart succeeded; `/api/health` returned `ok`.
- Production `/projects` showed Sprint 6 templates and project practice navigation.
- Playwright created `单词频率统计器`, completed 3 milestones, and page showed `100% / completed` plus `所有里程碑已完成`.
- Production DB: `LearningProject=1`, `ProjectMilestone=3`, latest project `completed`, `summary=true`, `codeSaved=3`, `reflectionSaved=3`.

## Blocked On

None.

## Drift Check

- Scope: still Sprint 6 MVP.
- Compatibility: additive data models and routes only.
- New owners: `src/server/projects/*` will own project practice logic.
- Decision: Sprint 6 done; continue long-term plan with Sprint 7 auth/multi-user.
