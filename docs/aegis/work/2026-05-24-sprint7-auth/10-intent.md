# Sprint 7 Auth Intent

## Requested Outcome

Implement the Sprint 7 auth/multi-user hardening baseline: keep Supabase Auth as the real-user path, keep demo-user only as an explicit demo mode, require protected learning data pages to have either a real user session or an active demo session, and keep all writes scoped through `requireUserId()`.

## Scope

- Add testable auth policy helpers.
- Protect all learning data routes, including `/`, `/projects`, `/coach`, `/voice`, `/glossary`, and `/radar`.
- Replace implicit no-Supabase `demo-user` fallback with an explicit demo session cookie.
- Keep development demo mode available by default.
- In production, require `ALLOW_DEMO_USER=true` to expose the Demo entry point.
- Keep `/admin` protected by existing `ADMIN_SECRET` flow rather than Supabase user login.

## Non-goals

- No role-based admin users yet.
- No Supabase project provisioning from code.
- No migration of existing demo-user data into real accounts.

## Baseline Read Set

- Long-term guide Sprint 7 section.
- `src/server/auth/*`.
- `src/lib/supabase/*`.
- `src/app/login/*`.
- `src/proxy.ts`.
- Next.js local docs for Server Actions and Proxy/session behavior read earlier in this thread.

## Impact Statement

This changes the access boundary for production learning data. Existing data queries are already user-scoped; the main compatibility issue is preserving access to existing demo-user data during the transition. Production deployment should explicitly set `ALLOW_DEMO_USER=true` until a real Supabase user path is configured and tested.
