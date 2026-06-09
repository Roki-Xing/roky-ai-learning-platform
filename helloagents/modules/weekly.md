# Weekly Review

## Owner

- UI: `/weekly`
- Server data builder: `src/server/learning/weekly.ts`

## Behavior

1. `/weekly` is a weekly recap page built from real learning data.
2. The page header badge displays `每周复盘`, not English `Weekly`.
3. The page shows:
   - `本周学习总结`
   - `本周称号`
   - 周记保存到 Notes
   - `7 天总览`
   - 本周学了什么
   - 最强领域
   - 最弱领域
   - 本周最值得修复的 3 个误区
   - 代码练习情况
   - 复习保持情况
   - `AI 周总结`
   - 下周建议
4. The weekly window is the latest seven local dates ending at the learner’s current `todayLocalDate`.
5. The page reuses the shared mission system and shows `当前任务` at the top.
6. The next-week recommendation is built with `buildWeeklyRemediationPlan()` so it stays aligned with `/progress`.
7. `weeklyOverview` covers:
   - 学习天数
   - 完成课程
   - 复习卡片
   - 小测验正确率
   - 代码提交
   - 语音笔记
   - Coach 次数
   - 项目里程碑
   - 新增误区 / 已解决误区
   - 术语/Radar 覆盖
8. `aiSummary` is a deterministic fallback summary. It does not call AI in the page request, but it still exposes:
   - 本周最重要收获
   - 主要薄弱点
   - 下周建议
   - 推荐下一阶段
9. `weeklyRitualSummary` 是 deterministic weekly ritual summary，覆盖：
   - 本周一句话总结：学习天数、完成课程、复习卡片、修复误区
   - 本周称号：`复习守住者`、`主线推进者`、`误区修复者`、`节奏保持者` 或 `学习节奏重启者`
   - 称号原因
   - 周记模板：`我这周最大的收获是...` / `我下周想重点学...`
10. `/weekly` 的 `周记` 表单调用 `saveWeeklyReflectionAction()`，创建无课程绑定的 standalone Note，写入后跳转到 `/notes?noteId=<id>`。
11. `saveWeeklyReflectionAction()` 必须继续调用 `assertWritableRequest()`、`requireUserId()` 和 `createScopedNote()`；Preview Mode 下不能绕过写保护。
12. `保存到笔记` CTA 复用 `weeklyReflectionButtonClassName`，手机端保持至少 44px 触控高度和全宽布局。
13. `weeklyReportMarkdown` 是可复制周报，覆盖：
   - Markdown 标题为 `# Roky Learn 每周复盘`，不显示英文 `# Roky Learn Weekly Report`
   - 本周学习总结
   - 本周称号
   - 7 天总览
   - 本周课程
   - 领域与错题
   - 本周最值得修复的 3 个误区
   - 代码与复习
   - AI 周总结
   - 下周建议
   - 周记草稿
14. `/weekly` 的 `导出 Weekly Markdown` 是只读文本区；它不写数据库、不生成文件、不调用 AI。
15. 页面和导出的 Markdown 会把 raw learning source 本地化，例如 `quiz` 显示为 `小测验`，`voice` 显示为 `语音笔记`。
16. 最弱领域细项使用中文业务标签：`掌握分`、`薄弱分`、`测验正确率`。
17. 下周建议步骤徽章使用中文 `第 n 步`，不显示英文 `Step n`。
18. 下周建议步骤链接复用 `weeklyNextStepLinkClassName`，手机端保持至少 44px 触控高度。
19. 代码练习高频问题使用 `weeklyCodeIssueTypeLabel()` 显示中文业务标签，例如 `edge_case` 显示为 `边界条件`，未知历史值兜底为 `一般问题`，空值显示 `暂无`；页面和导出的 Markdown 都不能直出 raw `topIssueType`。
20. 7 天总览和导出的 Weekly Markdown 使用 `语音笔记`，不显示 `Voice Note`。
21. `mistakeRepairQueue` 从本周 Misconception 中选出最多 3 条待修复误区，过滤 `resolved` / `ignored`，并为每条生成 `/mistakes?focus=<id>`。
22. `/weekly` 页面用 `weeklyMistakeRepairLinkClassName` 渲染误区修复入口，手机端保持至少 44px 触控高度。

## Data Sources

- `DailyPlan` for completed lessons and weekly lesson list
- `ReviewLog` for weekly retention
- `QuizAttempt` for domain strength / weakness signals
- `Flashcard` for current due debt
- `ReviewLog` over standalone glossary/radar flashcards for knowledge coverage
- `CodeSubmission` and `CodeFeedback` for weekly coding practice
- `Misconception` for the weekly top mistake and top 3 mistake repair queue
- `VoiceNote` for weekly voice learning activity
- `ThoughtReview` for Coach review count
- `ProjectMilestone` for completed project milestones

## Verification

- `npm test -- tests/unit/weekly-review.test.ts`
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/notes-create.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`
- Reduce Chaos Weekly Ritual Summary and Reflection Note：`npm test -- tests/unit/weekly-review.test.ts` RED/GREEN 后 9 项通过，覆盖 `weeklyRitualSummary`、`本周学习总结`、`本周称号`、Weekly Markdown ritual 小节、周记表单、`saveWeeklyReflectionAction()`、Preview 写保护和手机端 `保存到笔记` CTA。
- Reduce Chaos Weekly Ritual Summary and Reflection Note related regression：`npm test -- tests/unit/weekly-review.test.ts tests/unit/notes-create.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过，覆盖 Weekly、Notes standalone note、Preview 写保护、Auth 和共享学习 UI。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts`
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts`
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-completion-next-actions.test.ts`
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`
- Phase E Weekly Header Badge Localization：`npm test -- tests/unit/weekly-review.test.ts` RED/GREEN 后 4 项通过，覆盖 `badge="每周复盘"`，并防止 `badge="Weekly"` 回退。
- Phase E Weekly Header Badge Localization related regression：`npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 48 项通过，覆盖 Weekly、Path、Mistakes 和 Auth/Preview 边界。
- Phase E Weekly Header Badge Localization coverage scan：`rg -n 'Weekly Header Badge|badge="每周复盘"|badge="Weekly"|0\\.249\\.0|每周复盘页头' ...` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均已接入；`src/app/weekly/page.tsx` 中 `badge="Weekly"` 无匹配。
- Phase E Weekly Header Badge Localization final gates：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 360 项通过，Next 构建生成 28 个页面且路由表包含 `/weekly`。
- Phase E Current Mission Heading Localization：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/today-activity-labels.test.ts` 51 项通过；覆盖 `/weekly` 顶部任务卡显式 title 使用 `当前任务`，不再传入 `Current Mission / 当前任务`。
- Phase E Weekly Code Issue Type Label Localization：`npm test -- tests/unit/weekly-review.test.ts` RED 首次失败于 Weekly Markdown 仍输出 `高频问题：edge_case` 且页面仍直用 raw `topIssueType`；GREEN 后 5 项通过，覆盖 `weeklyCodeIssueTypeLabel()`、页面接线和 Markdown 导出中文化。
- Phase E Weekly Code Issue Type Label Localization related regression：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-code-exercise.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts` 70 项通过，覆盖 Weekly、Progress 趋势、Today/Projects 代码反馈标签和共享学习 UI。
- Phase E Weekly Code Issue Type Label Localization final gates：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 387 项通过，Next 构建生成 28 个页面且路由表包含 `/weekly`。
- Phase E Weekly Markdown Title Localization：`npm test -- tests/unit/weekly-review.test.ts` RED 首次失败于 `weeklyReportMarkdown` 仍输出 `# Roky Learn Weekly Report`；GREEN 后 5 项通过，覆盖有数据和空数据周报标题中文化。
- Phase E Weekly Markdown Title Localization related regression：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 56 项通过，覆盖 Weekly、Progress、共享学习 UI 和首页标签。
- Phase E Weekly Markdown Title Localization final gates：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面且路由表包含 `/weekly`。
- Reduce Chaos Weekly Mistake Repair Queue：`npm test -- tests/unit/weekly-review.test.ts` RED/GREEN 后 7 项通过，覆盖 `mistakeRepairQueue`、`/mistakes?focus=<id>`、过滤已解决误区、Markdown Top 3 列表、页面 Top 3 修复入口和手机端 `min-h-11` 触控目标。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是 Weekly 产品 UI 验证失败。
- `npm run lint`
- `git diff --check`
- `npm run build`
- Browser check:
  - `/weekly` heading visible
  - top mission card title visible as `当前任务`, not `Current Mission / 当前任务`
  - `7 天总览` visible
  - `小测验正确率` visible and `quiz 正确率` absent
  - `本周学了什么` visible
  - `最强` and `待补强` badges visible when corresponding domain data exists
  - `本周最值得修复的 3 个误区` visible
  - 每条误区修复入口链接到 `/mistakes?focus=<id>`，并满足 `min-h-11`
  - `AI 周总结` visible
  - 下周建议步骤徽章显示 `第 n 步`
  - 下周建议步骤链接满足 `min-h-11`
  - `导出 Weekly Markdown` visible
  - `导出 Weekly Markdown` 内容包含 `本周最值得修复的 3 个误区`
  - `导出 Weekly Markdown` 内容标题显示 `# Roky Learn 每周复盘`，不显示 `# Roky Learn Weekly Report`
  - `语音笔记` visible，`Voice Note` absent
  - `术语/Radar 覆盖` visible
  - `推荐下一阶段` visible
  - `下周建议` visible
