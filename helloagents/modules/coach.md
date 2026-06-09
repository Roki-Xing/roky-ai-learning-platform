# Thought Review Coach

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/coach`，页头 badge 显示 `思路评审`，不显示英文 `Coach`。
2. 选择模式：
   - `我想解释一个概念` (`concept_question`)
   - `我想检查一段代码思路` (`code_reasoning`)
   - `我想复述一个错题` (`mistake_retell`)
   - `我想问一本书里的内容` (`book_question`)
   - `我想问某个术语/人物/Benchmark` (`glossary_term`)
   - 模式选择框在手机端使用 `min-h-11`，满足 44px 触控高度。
3. 输入自己的理解、困惑、代码思路或行业问题；`输入内容` 旁的必填 badge 显示 `必填`。
4. 服务端构造学习上下文并生成结构化 ThoughtReview。
5. 页面展示：
   - 整理后的观点
   - main claim
   - 正确部分
   - 可能问题
   - 缺失概念
   - Socratic questions
   - 下一步建议
   - 可生成的复习卡片
6. 用户可把评审卡片写入 Flashcard，进入 `/review`。
7. `/library` 按课程展示关联 Coach 评审，`/progress` 展示最近思路评审。
8. 如果关联课程的评审出现 high severity `possibleIssues`，服务端会自动沉淀为 `Misconception(source="coach")`，供 `/progress`、`/map` 和后续生成上下文使用。

## 数据模型

- `ThoughtReview`
  - `userId`
  - `lessonId`
  - `mode`
  - `rawText`
  - `normalizedText`
  - `mainClaim`
  - `reviewJson`
  - `generatedCards`
- `Flashcard`
  - ID 使用 `thought:{reviewId}:{index}`
  - tags 包含 `coach`、`thought-review` 和相关术语
- `Misconception`
  - source 使用 `coach`
  - sourceKey 使用 `coach:{reviewId}:{issueIndex}`
  - 仅在 ThoughtReview 关联课程时创建
  - 记录 lesson/topic/localDate，并保持 `status="open"`

## 服务层

- `src/server/coach/context.ts`
  - 汇总 `UserProfile`
  - 当前/最近课程
  - due flashcards
  - recent quiz attempts
  - recent code submissions
  - recent code feedback
  - open misconceptions
  - lesson glossary/breadth
  - standalone glossary review cards
- `src/server/coach/submit.ts`
  - `normalizeCoachMode()`
  - 接收 `concept_question`、`code_reasoning`、`mistake_retell`、`book_question`、`glossary_term` 五个主输入类型。
  - 兼容旧入口：`today_lesson/free_thought -> concept_question`、`code_debug/algorithm_design -> code_reasoning`、`glossary_question/industry_radar/paper_reading -> glossary_term`。
  - `createThoughtReview()`
  - `generateFlashcardsForThoughtReview()`
  - high severity `possibleIssues` 自动沉淀为 Coach source misconception，并更新 `UserTopicState`

## 重要约束

- Server Action 必须通过 `requireUserId()` 获取当前用户。
- Coach 只评审文本，不执行用户代码。
- DeepSeek key 只在服务端读取；测试环境或无 key 时使用模板 fallback。
- 课程关联必须通过当前用户正式 DailyPlan 校验。
- 显式传入 `lessonId` 时，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝。
- 生成卡片使用 stable id + upsert，重复点击不会重复创建卡片。
- 语音笔记来源的 ThoughtReview 使用通用 Coach 生成卡片路径时，必须保留 `voice-note` 队列归属并跳转 `/review?source=voice-note`；普通 Coach 来源继续跳转 `/review?source=thought-review`。已生成卡片后的静态复习链接也必须遵循同一队列来源。
- 误区沉淀使用 stable sourceKey + upsert，重复处理同一 review issue 不会重复创建 misconception。
- 无 `lessonId` 的自由想法不创建 misconception，因为当前 `Misconception.lessonId` 为必填字段。
- `/voice` 入口复用同一 Coach 服务层，避免行为分叉。
- Today 完成后 `让 Coach 检查` 主链路必须使用 `/coach?lessonId=...&mode=concept_question`，不要继续传播旧 `mode=today_lesson`；页面和服务端仍兼容旧 URL，便于历史入口安全进入。
- Voice 送入 Coach 时，`mistake_retell` 和 `book_question` 必须保留为同名 Coach mode，不再压成 `concept_question`，避免来源面板和实际评审 mode 不一致。
- 从语音笔记进入的 Coach 来源面板必须显示 `来自语音笔记` 和 `查看语音笔记`，不显示 `来自 Voice Note` 或 `查看 Voice Note`；内部 `source=voice-note` 队列契约保持不变。
- `/coach` 页头 badge 使用 `思路评审`，避免在中文学习页面顶部孤立显示英文 `Coach`。
- `/coach` 输入内容必填状态使用 `必填`，避免在中文表单里孤立显示英文 `required`；textarea 原生 `required` 校验保持不变。
- `/coach` 导师反馈顶部 provider badge 必须显示中文来源标签，如 `AI 生成` / `模板兜底`；`deepseek` / `template` 只保留在 ThoughtReview provider 数据契约和服务端生成结果中。
- `/coach` 学习上下文和补弱队列中的代码反馈结论必须显示中文业务标签，如 `部分正确`、`需要重写`、`需要更多信息`；`partially_correct`、`incorrect`、`cannot_judge` 等 raw overall 只保留在代码反馈数据契约中。
- 展示层必须把 Coach 工作区、上下文指南针、问题类型/优先级、Voice 来源模式、导师反馈顶部 mode、最近评审 mode 和建议卡片 type 映射为中文业务标签；`conceptual`、`high`、`code_debug`、`code_reasoning`、`concept_question`、`concept` 等 raw enum 只保留在数据契约、服务端逻辑和测试输入中，不直接作为学习者可见文案。
- `/coach` 主要 CTA 在手机端保持全宽大触控目标，包括 `提交给 Coach`、`查看课程`、`生成卡片`、`复习这 N 张 Coach 卡片`、Quick Links 和最近评审入口。
- `/coach` 表单 `评审模式` 选择框必须使用 `coachModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"`，避免手机端 mode select 退回小触控目标。
- `/coach` 表单 `关联最近课程` checkbox label 必须使用 `coachIncludeLessonLabelClassName = "flex min-h-11 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"`，只调整触控目标，不改变 `includeTodayLesson` 提交字段或课程关联校验。
- `/coach` 补弱队列里的 `误区` 和 `代码反馈` 跳转卡片必须复用 `coachRemediationQueueLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/60"`，只调整触控目标，不改变 `CoachRemediationQueue` 的输入来源、排序、href、Review source filter、misconception 沉淀或 Coach 生成逻辑。

## 本地验收

- Phase E Coach Include Lesson Checkbox Mobile Touch Target：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于 `关联最近课程` checkbox label 缺少 `coachIncludeLessonLabelClassName`；GREEN 后 16 项通过。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：65 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- Phase E Coach Remediation Queue Link Mobile Touch Targets：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于补弱队列 `误区` / `代码反馈` 跳转卡片缺少 `min-h-11`；GREEN 后 15 项通过。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：64 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- Phase E Coach Mode Select Mobile Touch Target：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，15 项通过；覆盖 `评审模式` select 接入 `min-h-11`，并防止旧 `h-10` 小触控目标回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：64 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- Phase E Coach Generated Review Link Source Isolation：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，15 项通过；覆盖 `CoachFlashcardPanel` 默认链接 `/review?source=thought-review`，Voice-linked review 传入 `reviewSource="voice-note"` 后链接 `/review?source=voice-note`。
  - `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：2 项通过，确认 Voice → Coach → Review 真实浏览器路径未回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：64 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- Phase E Voice E2E Focused Review Source Isolation：
  - `npm test -- tests/unit/coach-submit.test.ts`：RED 后 GREEN，5 项通过；覆盖 Voice-linked ThoughtReview 通过通用 Coach `generateFlashcardsForThoughtReview()` 时返回 `reviewSource="voice-note"`，并让生成卡片同时带 `voice-note` 与 `thought-review` tags。
  - `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：RED 后 GREEN，2 项通过；覆盖 Voice Note 送 Coach 后点击 `生成卡片` 进入 `/review?source=voice-note`。
  - `npx playwright test tests/e2e/today-interactions.spec.ts tests/e2e/review-interactions.spec.ts tests/e2e/coach-interactions.spec.ts tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：7 项通过；覆盖普通 Coach 仍进入 `thought-review` focused review，Voice Coach 进入 `voice-note` focused review。
- Phase E Coach Code Feedback Overall Label Localization：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，14 项通过；覆盖 `/coach` 学习上下文代码反馈副标题复用 `formatHomeCodeFeedbackOverallLabel(f.overall)`，并防止 `[f.localDate, f.overall].filter(Boolean).join(" / ")` 回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：53 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress code/thought-review 标签和 Library code/thought-review 标签。
  - `rg -n 'Coach Code Feedback Overall|formatHomeCodeFeedbackOverallLabel\\(f\\.overall\\)|\\[f\\.localDate, f\\.overall\\]\\.filter\\(Boolean\\)\\.join\\(" / "\\)|0\\.260\\.0|代码反馈结论|raw overall|partially_correct|incorrect|cannot_judge' ...`：覆盖扫描通过，确认 `/coach` 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入代码反馈结论中文化要求；`src/app/coach/page.tsx` 中旧 raw overall 副标题模板无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 371 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
- Phase E Coach Review Provider Badge Localization：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，13 项通过；覆盖 `/coach` 导师反馈顶部 provider badge 复用 `formatTodayPlanSourceLabel(review.provider ?? "template")`，并防止 `{review.provider ?? "template"}` 回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：52 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
  - `rg -n 'Coach Review Provider|formatTodayPlanSourceLabel\\(review\\.provider \\?\\? "template"\\)|\\{review\\.provider \\?\\? "template"\\}|0\\.259\\.0|导师反馈.*provider|provider badge|AI 生成|模板兜底|raw provider|deepseek / template|raw `deepseek`' ...`：覆盖扫描通过，确认 `/coach` 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis evidence 均接入 provider badge 中文化要求；`src/app/coach/page.tsx` 中旧 raw provider badge 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 370 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
- Phase E Coach Required Badge Localization：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，12 项通过；覆盖 `/coach` 输入内容 badge 显示 `必填`，并防止 `<LearningStatusBadge tone="info">required</LearningStatusBadge>` 回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：51 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
  - `rg -n 'Coach Required Badge|<LearningStatusBadge tone="info">必填</LearningStatusBadge>|<LearningStatusBadge tone="info">required</LearningStatusBadge>|0\\.258\\.0|输入内容必填|输入内容.*必填|`必填`|`required`' ...`：覆盖扫描通过，确认 `/coach` 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis evidence 均接入输入内容必填 badge 中文化要求；`src/app/coach/page.tsx` 中旧英文 `required` badge 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 369 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
- Phase E Coach Header Badge Localization：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，11 项通过；覆盖 `/coach` 页头 badge 显示 `思路评审`，并防止 `badge="Coach"` 回退。
  - `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：47 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
  - `rg -n 'Coach Header Badge|badge="思路评审"|badge="Coach"|0\\.252\\.0|思路评审页头' ...`：覆盖扫描通过，确认 `/coach` 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入页头 badge 中文化要求；`src/app/coach/page.tsx` 中 `badge="Coach"` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 363 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
  - Aegis helper `bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是产品 UI 验证失败。
- Phase E Coach Thought Review Mode Label Localization 后，`npm test -- tests/unit/coach-workspace.test.ts` RED/GREEN 后 10 项通过，覆盖 `/coach` selected review 和最近评审 mode badge 均复用 `formatCoachModeLabel()`。
- Phase E Coach Suggested Flashcard Type Label Localization 后，`npm test -- tests/unit/coach-workspace.test.ts` RED/GREEN 后 10 项通过，覆盖 Coach 建议卡片 type badge 复用 `formatFlashcardTypeLabel()`。
- Phase E Coach CTA Mobile Touch Targets 后，`npm test -- tests/unit/coach-workspace.test.ts` 9 项通过；`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 43 项通过。
- Phase E Coach CTA Mobile Touch Targets 收尾门禁后，`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 340 项通过，Next 构建路由表包含 `/coach`。
- Phase 10 Coach Visible Label Localization 后，`npm test -- tests/unit/coach-workspace.test.ts` 7 项通过；`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过。
- `npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts`：9 项通过。
- Sprint 58 后，`tests/unit/coach-submit.test.ts` 覆盖显式跨用户 lesson 拒绝。
- `npm test`：65 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

### Sprint 22 增量验收

- `npm test -- tests/unit/coach-submit.test.ts`：3 项通过。
- `npm test -- tests/unit/coach-submit.test.ts tests/unit/coach-context.test.ts tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts`：13 项通过。
- `npm test`：82 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。
- 生产：目标测试、build、service health、`/coach`、`/progress`、`/map` Host-header 验收通过。

## 生产验收

- 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint16-20260524-073404.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、Coach 目标测试、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 线上：`/coach` 可见 `提交思路`、`Coach 反馈`、`生成复习卡片`、`最近评审`。
- 线上：`/voice` 可见 `发送到 Coach`、`生成 Flashcards`、`查看 Coach`。
- 线上：`/library` 可见 `Coach 思路评审`。
- 线上：`/progress` 可见 `最近思路评审`。
- 生产只读计数：`ThoughtReview=4`、`ThoughtReviewCards=3`、`VoiceNotesLinkedToCoach=1`。
