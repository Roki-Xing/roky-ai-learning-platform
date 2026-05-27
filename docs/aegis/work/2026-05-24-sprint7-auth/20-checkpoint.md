# Sprint 7 Auth Checkpoint

## Current Todo

- [√] Add auth policy tests.
- [√] Implement explicit demo mode and demo session cookie.
- [√] Update Proxy protected-route logic.
- [√] Update login page copy and Demo entry point.
- [√] Run local verification.
- [√] Deploy to production.
- [√] Verify production redirect and Demo entry point.
- [√] Update knowledge-base production evidence.

## Active Slice

Sprint 7 completed and production verified.

## Evidence Refs

- `npm test`: 33 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Production backup: `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint7-20260524-042549.tar.gz`.
- Production `ALLOW_DEMO_USER=true` explicitly configured in `/etc/ai-learning-platform.env`.
- Production `npm ci`, `npx prisma generate`, `npm run build`, service restart passed.
- Unauthenticated `/today` returns `307 Location: /login?next=%2Ftoday`.
- Unauthenticated `/api/me` returns `307 Location: /login?next=%2Fapi%2Fme`.
- `/login?next=/today` shows `进入 Demo 模式`.
- Playwright clicked `进入 Demo 模式` and landed on `/today`.

## Blocked On

None.

## Drift Check

- Scope: Sprint 7 auth baseline, not full role management.
- Compatibility: preserve demo-user access through explicit demo mode.
- Decision: Sprint 7 done; continue long-term plan with Sprint 8 cron/reminders.
