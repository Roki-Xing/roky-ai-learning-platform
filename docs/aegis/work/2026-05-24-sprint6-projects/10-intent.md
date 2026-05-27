# Sprint 6 Projects Intent

## Requested Outcome

Implement Sprint 6 MVP for Roky Learn: a `/projects` practice loop that lets the user start a learning project, work through milestones, complete milestones with code/notes/reflection, finish the project with a summary, and see project progress on `/progress`.

## Scope

- Add durable project and milestone data models.
- Add default project templates for Python, data structures, algorithms, AI engineering, RAG, Agent, data analysis, and paper reproduction practice.
- Add server-side project actions protected by current user scoping.
- Add `/projects` UI for filtering, starting projects, milestone work, and completion.
- Add project progress metrics to `/progress`.
- Add manual migration, seed wiring, tests, and knowledge-base documentation.

## Non-goals

- No arbitrary code execution sandbox.
- No multi-user auth overhaul.
- No real-time collaboration.
- No complex project recommendation engine.

## Baseline Read Set

- `/mnt/c/Users/Xing/Desktop/Roky Learn 长期开发指导文档.md` Sprint 6 section.
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`.
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`.
- `prisma/schema.prisma`.
- `src/app/progress/page.tsx`.
- `src/server/seed/seed.ts`.
- Existing server action and page patterns under `src/app/today`, `src/app/radar`, and `src/server/coding`.

## Impact Statement

This is a cross-module feature touching persistence, seeded data, Server Actions, navigation, UI pages, progress statistics, tests, production migration, and documentation. The compatibility boundary is additive: existing daily learning, review, notes, coach, voice, glossary, and radar flows must keep working.
