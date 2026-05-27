# Goal

Implement Sprint 49: Admin Plan Audit Chain.

The goal is to advance the goal document Phase 1/2 data-governance and Curriculum Planner requirements by giving `/admin` a single-plan audit view that links the current `DailyPlan` record to its `CurriculumDecisionLog` and `AiGenerationJob` evidence.

# Architecture

- `DailyPlan` remains the operational owner of the visible learning plan.
- `CurriculumDecisionLog` remains the planner decision evidence owner, keyed by `userId + localDate + isTest`.
- `AiGenerationJob` remains the generation evidence owner, usually linked by `DailyPlan.generationJobId`.
- A new server helper builds a read-only audit chain for one user-scoped `planId`.
- `/admin?auditPlanId=...` renders the chain with consistency checks and a link from each recent plan row.

# Tech Stack

- Next.js 16 App Router Server Component.
- Prisma 6 with existing PostgreSQL schema.
- Node test runner through `npm test`.
- No migration.

# Baseline/Authority Refs

- Goal doc: `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- Existing admin page: `src/app/admin/page.tsx`
- Existing governance service: `src/server/admin/plan-governance.ts`
- Existing planner input summary: `src/server/admin/planner-visibility.ts`
- Existing planner explanation: `src/server/curriculum/explain-decision.ts`
- Existing planner snapshot summary: `src/server/curriculum/signal-snapshot.ts`

# Compatibility Boundary

- Do not change generation, planner scoring, DeepSeek prompt, or database schema.
- Do not expose API keys, env values, `DATABASE_URL`, `ADMIN_SECRET`, `CRON_SECRET`, or `DEEPSEEK_API_KEY`.
- All audit reads must be scoped by `userId`.
- Missing evidence should render as missing, not be fabricated.
- Raw JSON remains folded or summarized by default in `/admin`.

# Verification

- RED: `npm test -- tests/unit/admin-plan-audit-chain.test.ts` must fail because helper is missing.
- GREEN: target test passes.
- Full local gate: `npm run lint`, `npm test`, `npm run build`.
- Remote gate on `118.25.15.72`: target test and build inside `ai-learning-platform` container, restart, health checks, forced `--resolve` check.

# Tasks

## Task 1: Add audit-chain service test

Files:

- Create `tests/unit/admin-plan-audit-chain.test.ts`.

Why:

- Proves a single plan can be traced to planner and generation evidence.

Steps:

- Write a DB-backed test that creates a user, lesson, generation job, daily plan, and curriculum decision log.
- Assert `buildAdminPlanAuditChain({ userId, planId })` returns the plan, linked decision log, linked generation job, planner summary, and passing consistency checks.
- Add a cross-user rejection assertion.
- Run `npm test -- tests/unit/admin-plan-audit-chain.test.ts` and verify RED.

## Task 2: Implement audit-chain service

Files:

- Create `src/server/admin/plan-audit.ts`.

Why:

- Centralizes `/admin` audit-chain logic and keeps page rendering simple.

Steps:

- Read the selected plan by `id + userId`.
- Include lesson title and topic/domain identifiers.
- Read matching `CurriculumDecisionLog` by `userId + localDate + isTest`.
- Read linked `AiGenerationJob` by `generationJobId + userId` when present.
- Build `plannerSummary` with `buildAdminPlannerJobSummary(job.input)`.
- Return consistency checks for missing/mismatched decision, job, topic, domain, and schema.
- Run target test and verify GREEN.

## Task 3: Render audit chain in `/admin`

Files:

- Modify `src/app/admin/page.tsx`.

Why:

- Gives admin users a concrete single-record audit view without digging through separate lists.

Steps:

- Parse `auditPlanId` from `searchParams`.
- Call the service when `auditPlanId` exists.
- Add an `审计链路` link on recent DailyPlan rows.
- Render a card showing plan, decision log, generation job, and consistency checks.
- Keep raw JSON folded.

## Task 4: Update project docs and verify

Files:

- Add `docs/aegis/work/2026-05-25-sprint49-admin-plan-audit-chain/*`.
- Update `docs/aegis/INDEX.md`.
- Update `helloagents/CHANGELOG.md`.
- Update `helloagents/modules/curriculum-planner.md`.

Why:

- Preserve requirement evidence and current behavior notes.

Steps:

- Record RED/GREEN/local/remote evidence.
- Run local full gate.
- Deploy to backup host and verify.

# Risks

- Existing historical plans may have missing `generationJobId` or missing decision logs. The UI must show this as a failed/missing check, not throw.
- A plan created by admin activation may have `source=admin`; it may intentionally have no `daily_plan` generation job. The audit view should still show plan and decision evidence if present.

# Retirement

- This does not retire previous `/admin` recent lists.
- It reduces reliance on manually correlating IDs across `DailyPlan`, `CurriculumDecisionLog`, and `AiGenerationJob`.
