# Sprint 7 Evidence

## Local Verification

- `npm test`: 33 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.

## Production Deployment

- Backup created: `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint7-20260524-042549.tar.gz`.
- Synced code to `ubuntu@118.89.119.107:/home/ubuntu/ai-learning-platform`.
- Set `ALLOW_DEMO_USER=true` in `/etc/ai-learning-platform.env`.
- Production commands passed:
  - `npm ci`
  - `npx prisma generate`
  - `npm run build`
  - `sudo systemctl restart ai-learning-platform.service`
- `systemctl is-active ai-learning-platform.service`: `active`.
- `http://127.0.0.1:3102/api/health`: `{"ok":true,"service":"ai-learning-platform"}`.

## Live Auth Check

- Unauthenticated `GET /today`: `307 Location: /login?next=%2Ftoday`.
- Unauthenticated `GET /api/me`: `307 Location: /login?next=%2Fapi%2Fme`.
- `GET /login?next=/today` shows `进入 Demo 模式` and production auth copy.
- Playwright clicked `进入 Demo 模式` and landed on `/today`.
- Runtime env check showed `ALLOW_DEMO_USER=true`; sensitive values were only verified as present, not printed.
