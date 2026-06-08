# Library

## Owner

- UI: `/library`
- Plan filters: `src/server/library/plan-filter.ts`
- Lesson detail helpers: `src/server/library/lesson-detail.ts`
- Lesson next actions: `src/server/library/next-actions.ts`

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
5. Course detail starts with a "课程下一步" action panel:
   - unfinished lessons route back to `/today`
   - completed lessons prioritize due cards, missing notes, missing Coach review, missing code submission, or overall progress
   - actions are intentionally capped to 3 so the archive remains decision-oriented
   - action CTAs use `libraryCtaClassName = "min-h-11 w-full sm:w-auto"` and stack into one mobile column
6. Learner-visible archive labels use Chinese business labels:
   - DailyPlan status/source: `已完成` / `待完成`, `AI 生成` / `模板兜底` / `后台重建`
   - DailyPlan schemaVersion: `内容版本：...` / `内容版本：未标记`
   - plan governance badges: `测试计划` / `已归档`
   - missing DailyPlan domain/topic: `未标记领域` / `未标记主题`
   - breadth type: `人物` / `Benchmark` / `开源项目`
   - quiz type: `单选题` / `多选题` / `判断题`
   - flashcard metadata: `到期：YYYY-MM-DD` / `复习次数：N`
   - Coach thought review mode: `今日课程` / `概念疑问` / `代码思路` / `算法设计` / `术语理解` / `行业广度` / `自由想法`
   - code submission and feedback: `反馈已生成`, `已提交`, `已保存`, `部分正确`, `反馈来源：AI 生成` / `反馈来源：模板兜底` / `反馈来源：系统生成`
7. Governance filter controls keep raw input names such as `source`, `schemaVersion`, `status`, and `localDate` so creator/admin filtering remains precise, but visible field labels show learner-facing Chinese copy: `来源`、`内容版本`、`状态`、`日期`.
8. Governance filter inputs use `libraryFilterInputClassName = "min-h-11 rounded-md border bg-background px-3 text-sm"` so the four filter inputs meet 44px mobile touch height while preserving raw query parameter names.
9. Governance filter placeholders explain raw values with Chinese business meaning, for example `AI 生成 deepseek / 模板兜底 template / 后台重建 admin` and `待完成 planned / 已完成 completed`.
10. The `关联笔记` header keeps `写笔记` as a full-width 44px mobile CTA while preserving a compact desktop layout.
11. Filter action CTAs use the same `libraryCtaClassName` and stack into one mobile column:
   - `切换测试计划`
   - `切换归档计划`
   - `清空筛选`
   - `应用筛选`
12. Active filter summary badges use learner-facing Chinese labels:
   - `来源：AI 生成` / `来源：模板兜底` / `来源：后台重建`
   - `内容版本：...`
   - `状态：已完成` / `状态：待完成`
   - `日期：YYYY-MM-DD`
13. Course list lesson links use `libraryPlanLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"` so each archive entry keeps a 44px mobile touch target.

## Security Boundary

- Lesson detail only opens a lesson from the currently visible plan list.
- If `lessonId` is not visible under the current user and filters, the detail panel falls back to the first visible plan.
- Lesson notes are loaded through `getLessonDetailNotes()` with `userId + lessonId` scope.
- Note creation uses `createScopedNote()` and only allows binding to lessons from the current user's formal, non-test, non-archived DailyPlans.
- Standalone notes remain allowed with `lessonId = null`.

## Verification

- Phase E Library Flashcard Metadata Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED 首次失败于 `/library` 复习卡片仍显示 `due:` / `reviews:`；GREEN 后 9 项通过，覆盖 `到期：... / 复习次数：...` 并阻止旧英文式元信息回退。
- Phase E Library Flashcard Metadata Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 62 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- Phase E Library Flashcard Metadata Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 434 项通过，Next 生产构建生成 28 个页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Code Feedback Provider Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED 首次失败于 `/library` 仍缺少 `反馈来源：{formatTodayPlanSourceLabel(feedback.provider)}`；GREEN 后 8 项通过，覆盖结构化代码反馈来源文案本地化并阻止旧 `反馈：{feedback.provider}` 模板回退。
- Phase E Library Code Feedback Provider Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 61 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- Phase E Library Code Feedback Provider Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 433 项通过，Next 生产构建生成 28 个页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Filter Field Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED 首次失败于 `/library` 筛选字段仍显示 raw `source`；GREEN 后 8 项通过，覆盖 `来源`、`内容版本`、`状态`、`日期` 可见 label，并确认 raw input name 不变。
- Phase E Library Filter Field Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 61 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- Phase E Library Filter Field Label Localization 覆盖扫描：`rg -n 'Library Filter Field Label|0\\.340\\.0|来源</span>|内容版本</span>|状态</span>|日期</span>|name="source"|name="schemaVersion"|name="status"|name="localDate"|raw input name|裸 source' ...` 确认源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入；窄扫 `/library` 生产源码确认旧 raw 字段名模板无匹配。
- Phase E Library Filter Field Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 431 项通过，Next 生产构建生成 28 个页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Filter Placeholder Label Hints: `npm test -- tests/unit/library-page-labels.test.ts` RED 首次失败于 `/library` 筛选表单仍只显示旧 `deepseek / fallback / admin` 和 `planned / completed` raw placeholder；GREEN 后 7 项通过。
- Phase E Library Filter Placeholder Label Hints 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 59 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- Phase E Library Filter Placeholder Label Hints 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 397 项通过，Next 生产构建生成 28 个页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Lesson List Link Mobile Touch Targets: `npm test -- tests/unit/library-page-labels.test.ts` RED 首次失败于 `/library` 缺少 `libraryPlanLinkClassName`，课程列表 Link 仍使用旧 `rounded-md border px-3 py-2 text-sm transition-colors` 小触控模板；GREEN 后 6 项通过。
- Phase E Library Lesson List Link Mobile Touch Targets 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 58 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- Phase E Library Lesson List Link Mobile Touch Targets 覆盖扫描：`rg -n "Library Lesson List Link|libraryPlanLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|课程列表每条课程入口|0\\.295\\.0" ...` 确认源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入本切片；旧课程列表小触控模板已无 `/library` 生产源码匹配。
- Phase E Library Lesson List Link Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 392 项通过，Next 生产构建生成 28 个页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Active Filter Summary Localization: `npm test -- tests/unit/library-page-labels.test.ts` GREEN 后 5 项通过，覆盖 `/library` 活跃筛选摘要复用 `formatTodayPlanSourceLabel(filters.source)` 和 `formatHomeDailyPlanStatusLabel(filters.status)`，显示 `来源：...`、`内容版本：...`、`状态：...`、`日期：...`，并阻止旧 `source: {filters.source}` / `status: {filters.status}` / `schema: {filters.schemaVersion}` / `date: {filters.localDate}` badge 模板回归。
- Phase E Library Active Filter Summary Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 57 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- Phase E Library Active Filter Summary Localization 覆盖扫描：`rg -n "来源：\\{formatTodayPlanSourceLabel\\(filters\\.source\\)\\}|内容版本：\\{filters\\.schemaVersion\\}|状态：\\{formatHomeDailyPlanStatusLabel\\(filters\\.status\\)\\}|日期：\\{filters\\.localDate\\}|source: \\{filters\\.source\\}|status: \\{filters\\.status\\}|schema: \\{filters\\.schemaVersion\\}|date: \\{filters\\.localDate\\}|Library Active Filter" ...` 确认 `/library` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入；窄扫 `src/app/library/page.tsx` 未发现旧 raw 活跃筛选 badge。
- Phase E Library Active Filter Summary Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 387 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Content Version Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 5 项通过，覆盖 `/library` 课程列表和详情元信息复用 `formatLibraryPlanSchemaVersionLabel()`，显示 `内容版本：...` / `内容版本：未标记`，并阻止旧 `schema ...` / `-` 可见标签回归。
- Phase E Library Content Version Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 58 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- Phase E Library Content Version Label Localization 覆盖扫描：`rg -n "schema \\{p\\.schemaVersion|schema \\$\\{planForLesson\\.schemaVersion|schema \\{.*schemaVersion|schema \\$\\{.*schemaVersion|内容版本：" src/app/library/page.tsx tests/unit/library-page-labels.test.ts` 确认 `/library` 生产源码不再直出旧 `schema ...` 模板，只保留新的 `内容版本` helper。
- Phase E Library Content Version Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 383 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Plan Governance Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 5 项通过，覆盖 `/library` 筛选状态、筛选 CTA、课程列表 badge 和课程详情 badge 显示 `测试计划` / `已归档`，并阻止旧 `test` / `archived` 可见标签回归。
- Phase E Library Plan Governance Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts` 28 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- Phase E Library Plan Governance Label Localization 覆盖扫描：`rg -n '切换 test|切换 archived|显示 test|隐藏 test|显示 archived|隐藏 archived|>test<|>archived<|<Badge variant="outline">test</Badge>|<Badge variant="outline">archived</Badge>' src/app/library/page.tsx` 无匹配，确认 Library 生产源码不再直出旧 raw 测试/归档计划文案。
- Phase E Library Plan Governance Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 373 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Lesson Domain Topic Unknown Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 4 项通过，覆盖课程详情缺失领域/主题显示 `未标记领域` / `未标记主题`，并阻止 `selectedDomain ?? "unknown"` / `selectedTopic ?? "unknown"` 回归。
- Phase E Library Lesson Domain Topic Unknown Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts` 27 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- Phase E Library Lesson Domain Topic Unknown Label Localization 覆盖扫描：`rg -n 'Library Lesson Domain|formatLibraryPlanDomainLabel|formatLibraryPlanTopicLabel|未标记领域|未标记主题|selectedDomain \\?\\? "unknown"|selectedTopic \\?\\? "unknown"|0\\.261\\.0|课程领域|课程主题|raw domain|raw topic' ...` 确认 Library 源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入领域/主题缺省中文化要求。
- Phase E Library Lesson Domain Topic Unknown Label Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 372 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Lesson CTA Mobile Touch Targets: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 2 项通过，覆盖课程下一步 action panel、`libraryCtaClassName` 和 `写笔记` CTA 移动端布局。
- Phase E Library Lesson CTA Mobile Touch Targets 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 22 项通过。
- Phase E Library Lesson CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Library Lesson CTA|libraryCtaClassName|课程下一步|写笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认 Library 源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入移动端 CTA 要求。
- Phase E Library Filter CTA Mobile Touch Targets: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 3 项通过，覆盖筛选区 `切换 test`、`切换 archived`、`清空筛选` 和 `应用筛选` 移动端布局。
- Phase E Library Filter CTA Mobile Touch Targets 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 23 项通过。
- Phase E Library Filter CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Library Filter CTA|libraryCtaClassName|切换 test|切换 archived|清空筛选|应用筛选|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认 Library 源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入筛选 CTA 移动触控要求。
- Phase E Library Filter CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 344 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Library Filter Input Mobile Touch Targets: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 3 项通过，覆盖 `libraryFilterInputClassName`、四个治理筛选输入的 44px 触控高度，以及旧 `h-8` 输入样式移除。
- Phase E Library Filter Input Mobile Touch Targets 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 23 项通过。
- Phase E Library Filter Input Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Library Filter Input|libraryFilterInputClassName|min-h-11 rounded-md border bg-background px-3 text-sm|h-8 rounded-md border bg-background px-2 text-sm|source|schemaVersion|localDate" ...` 确认 Library 源码和测试均接入筛选输入触控要求，旧 `h-8` 输入样式已移除。
- Phase E Library Filter Input Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。
- `npm test -- tests/unit/library-lesson-detail.test.ts`
- `npm test -- tests/unit/library-next-actions.test.ts`
- `npm test -- tests/unit/library-lesson-detail.test.ts tests/unit/library-plan-filter.test.ts`
- `npm test -- tests/unit/notes-create.test.ts tests/unit/library-lesson-detail.test.ts`
- Phase 10 Library Visible Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` 1 项通过。
- Phase 10 Library Visible Label Localization 回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过。
- Phase 10 Library Visible Label Localization 覆盖扫描：`rg -n "\\{p\\.source \\?\\? \\\"unknown\\\"\\}|\\{p\\.status\\}|\\$\\{planForLesson\\.status\\}|\\$\\{planForLesson\\.source \\?\\? \\\"unknown\\\"\\}|类型：\\{breadth\\.kind\\}|类型：\\{q\\.type\\}|\\{submission\\.status\\}|\\$\\{feedback\\.overall\\}|formatTodayPlanSourceLabel\\(p\\.source\\)|formatHomeDailyPlanStatusLabel\\(p\\.status\\)|formatHomeDailyPlanStatusLabel\\(planForLesson\\.status\\)|formatTodayPlanSourceLabel\\(planForLesson\\.source\\)|formatKnowledgeEntityTypeLabel\\(breadth\\.kind\\)|formatQuizQuestionTypeLabel\\(q\\.type\\)|formatCodeSubmissionStatusLabel\\(submission\\.status\\)|formatHomeCodeFeedbackOverallLabel\\(feedback\\.overall\\)|反馈已生成|单选题|已完成|AI 生成|开源项目" src/app/library/page.tsx src/app/_lib/home-labels.ts tests/unit/library-page-labels.test.ts` 确认旧 raw label 直出模板不存在。
- Phase 10 Library Visible Label Localization 收尾：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/library`。
- Phase E Library Thought Review Mode Label Localization: `npm test -- tests/unit/library-page-labels.test.ts` RED/GREEN 后 3 项通过，覆盖 `Coach 思路评审` 区块复用 `formatCoachModeLabel(r.mode)`，不直接显示 raw `r.mode`。
