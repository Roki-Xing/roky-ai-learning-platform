# Sprint 6 Evidence

## Local Verification

- `npx prisma generate`: passed.
- `npm test`: 28 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.

## Production Deployment

- Backup created: `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint6-20260524-040653.tar.gz`.
- Synced code to `ubuntu@118.89.119.107:/home/ubuntu/ai-learning-platform`.
- Production commands passed:
  - `npm ci`
  - `npx prisma generate`
  - `npm run db:migrate:manual:learning-projects`
  - `npm run build`
  - `sudo systemctl restart ai-learning-platform.service`
- `systemctl is-active ai-learning-platform.service`: `active`.
- `http://127.0.0.1:3102/api/health`: `{"ok":true,"service":"ai-learning-platform"}`.

## Live Product Check

- `https://learn.roky.chat/projects` shows Sprint 6 project templates and `/projects` navigation.
- `https://learn.roky.chat/progress` shows project practice statistics and recent project practice section.
- Playwright started `单词频率统计器`, completed 3 milestones, and the project page showed `100% / completed`.
- Production DB query:
  - `LearningProject=1`
  - `ProjectMilestone=3`
  - latest project status: `completed`
  - `summary=true`
  - `codeSaved=3`
  - `reflectionSaved=3`
