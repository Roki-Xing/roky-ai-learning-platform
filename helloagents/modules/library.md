# Library

## Owner

- UI: `/library`
- Plan filters: `src/server/library/plan-filter.ts`
- Lesson detail helpers: `src/server/library/lesson-detail.ts`

## Behavior

1. `/library` lists DailyPlan-backed lessons for the current user.
2. The default list hides test plans and archived plans.
3. Filters support:
   - `showTest`
   - `showArchived`
   - `source`
   - `schemaVersion`
   - `status`
   - `localDate`
4. Course detail shows related:
   - lesson body
   - guided steps
   - coding exercise
   - glossary and breadth cards
   - quiz questions
   - flashcards
   - Coach thought reviews
   - notes
   - code submissions and feedback

## Security Boundary

- Lesson detail only opens a lesson from the currently visible plan list.
- If `lessonId` is not visible under the current user and filters, the detail panel falls back to the first visible plan.
- Lesson notes are loaded through `getLessonDetailNotes()` with `userId + lessonId` scope.
- Note creation uses `createScopedNote()` and only allows binding to lessons from the current user's formal, non-test, non-archived DailyPlans.
- Standalone notes remain allowed with `lessonId = null`.

## Verification

- `npm test -- tests/unit/library-lesson-detail.test.ts`
- `npm test -- tests/unit/library-lesson-detail.test.ts tests/unit/library-plan-filter.test.ts`
- `npm test -- tests/unit/notes-create.test.ts tests/unit/library-lesson-detail.test.ts`
