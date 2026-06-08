# Notes

## Owner

- UI: `/notes`
- Template helper: `src/server/notes/template.ts`
- Write action: `src/app/notes/actions.ts`
- Scope guard: `src/server/notes/create-note.ts`

## Behavior

1. `/notes` lists the current user's recent notes and highlights the selected note from `noteId`.
2. The new-note form can preselect a visible lesson from `lessonId`, or fall back to today's lesson.
3. `buildLessonNoteTemplate()` pre-fills an editable Markdown scaffold with date, linked lesson, plan status, objectives, key terms, quiz count, code submission count, and reflection prompts.
4. Learner-facing plan status labels in the note summary and Markdown template use Chinese business labels:
   - `completed` -> `已完成`
   - any linked unfinished/unknown plan -> `待完成`
   - no linked plan -> `未关联计划`
5. Raw DailyPlan status values should stay in query/state logic and tests, not in learner-visible notes or note templates.
6. The new-note course links and save action use `notesCtaClassName = "min-h-11 w-full sm:w-auto"` so `去今日学习`, `看课程档案`, and `保存笔记` are full-width 44px touch targets on mobile while remaining compact on desktop.
7. The new-note `标题` input uses `notesInputClassName = "min-h-11"` so the editable title field reaches the 44px mobile touch target without changing note creation logic.
8. 选中从语音笔记沉淀来的当前笔记时，列表 badge 显示 `来自语音笔记的当前笔记`，不显示 `来自 Voice 的当前笔记`。

## Security Boundary

- Note creation still goes through `createNoteAction()` and `createScopedNote()`.
- `createScopedNote()` only allows binding to lessons from the current user's formal, non-test, non-archived DailyPlans.
- Standalone notes remain allowed with `lessonId = null`.
- This module does not own Preview write protection; action-level writable request guards remain the write boundary.

## Verification

- Phase E Notes Title Input Mobile Touch Targets: `npm test -- tests/unit/notes-template.test.ts` RED/GREEN 后 6 项通过，覆盖 `notesInputClassName` 和新建笔记标题输入框移动触控高度。
- Phase E Notes Title Input Mobile Touch Targets 回归：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 22 项通过。
- Phase E Notes Title Input Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Notes Title Input|notesInputClassName|min-h-11|标题|Notes Title Input Mobile Touch Targets|新建笔记" ...` 确认 Notes 源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入标题输入框移动触控要求。
- Phase E Notes CTA Mobile Touch Targets: `npm test -- tests/unit/notes-template.test.ts` RED/GREEN 后 5 项通过，覆盖 `notesCtaClassName`、关联课程 action 单列布局和保存 action 单列布局。
- Phase E Notes CTA Mobile Touch Targets 回归：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 21 项通过。
- Phase E Notes CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Notes CTA|notesCtaClassName|去今日学习|看课程档案|保存笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:items-center" ...` 确认 Notes 源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入移动端 CTA 要求。
- Phase 10 Notes Plan Status Label Localization: `npm test -- tests/unit/notes-template.test.ts` 4 项通过。
- Phase 10 Notes Plan Status Label Localization 回归：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 20 项通过。
- Phase 10 Notes Plan Status Label Localization 覆盖扫描：`rg -n "课程状态：completed|计划：\\{selectedPlan\\?\\.status|计划：\\{formatNotePlanStatusLabel|课程状态：已完成|formatNotePlanStatusLabel" src/app/notes/page.tsx src/server/notes/template.ts tests/unit/notes-template.test.ts` 确认旧 raw status 直出模板不存在。
