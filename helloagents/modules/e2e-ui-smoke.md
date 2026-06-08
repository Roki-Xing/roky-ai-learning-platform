# E2E / UI Smoke

## 当前状态

项目已接入 Playwright 浏览器级 smoke tests，作为长期 UI 回归保险。测试不进入生产构建门禁，但可在发版前手动执行。

## 命令

```bash
npm run e2e
npm run e2e:visual
npm run e2e:a11y
npm run e2e:hydration
npm run e2e:mobile-matrix
npm run e2e:preview-readonly
```

默认行为：

- 未设置 `E2E_BASE_URL` 时，会启动本地 `npm run dev -- --hostname 127.0.0.1 --port 3000`。
- 设置 `E2E_BASE_URL` 时，会直接测试外部站点。
- 设置 `E2E_PREVIEW_TOKEN` 时，会通过 `/preview?token=...` 进入只读 Preview Mode。
- 未设置 `E2E_PREVIEW_TOKEN` 时，会走本地 Demo 登录入口。

## 覆盖范围

- 登录页或 Preview 入口能进入学习应用。
- 首页能显示 `Roky Learn`、中文 `当前任务` 与 `当前项目进度`，不再断言旧混合标题 `Current Mission / 当前任务`。
- `/today` 能显示专注学习模式和今日概览。
- `tests/e2e/today-interactions.spec.ts` 通过真实 FocusPlayer 阶段切换按钮进入 `小测验`、`代码练习`、`反思与完成`，不直接假设折叠完整视图已展开。
- `/projects` 能显示中文 `项目任务模式` 和 `今日项目任务`，不再断言旧英文 `Mission Mode`。
- `/coach` 能显示思路评审工作台和中文 `上下文指南针`，不再断言旧英文 `Context Compass`。
- `/voice` 能显示语音学习捕获和说出理解入口。
- `/review` 主动回忆流程会先隐藏答案，点击显示后才出现评分按钮。
- `tests/e2e/review-interactions.spec.ts` 按 Review 评分按钮的真实可访问名称定位：`很熟 +14d`，不再断言旧键盘序号文案 `4 很熟`。
- `tests/e2e/visual.spec.ts` 覆盖 login、home、today、review、coach、voice、map、glossary、radar、projects、path、weekly、mistakes、progress、settings、library 的桌面/移动截图 smoke。
- `tests/e2e/a11y.spec.ts` 使用 `axe-core` 扫描 14 个核心页面，阻断 serious/critical WCAG 2A/2AA/2.1A/2.1AA violations。
- `tests/e2e/hydration.spec.ts` 监听 browser console 和 pageerror，阻断 React/Next hydration mismatch 类错误。
- `tests/e2e/mobile-matrix.spec.ts` 覆盖 375/390/430/768/1024/1440 宽度矩阵，要求页面主 heading 可见且无横向溢出。
- `tests/e2e/preview-readonly.spec.ts` 使用 `E2E_PREVIEW_TOKEN` 进入 Preview Mode，验证 Settings 保存、Today quiz 提交、Today code 保存会被拒绝，并确认 `/admin` 在 Preview 下隐藏。
- `tests/unit/pwa-manifest.test.ts` 覆盖 PWA 安装 shortcuts，要求 `今日学习`、`复习中心`、`语音反思`、`每周复盘` 指向核心移动闭环页面。
- `tests/unit/auth-policy.test.ts` 覆盖 `/manifest.webmanifest` 是公开 PWA 元数据，不应被 auth redirect 拦截。
- `tests/unit/learning-ui-components.test.ts` 覆盖共享 `LearningProgressBar` 的 `role="progressbar"`、百分比值和可访问名称，避免 Today、Review、Path、Projects、Weekly、Progress 的进度只靠视觉宽度表达。
- `tests/unit/learning-motivation.test.ts` 覆盖 Daily Quest、XP、周目标和 Badge Shelf 的具体进度条可访问名称，避免同屏多个学习动机进度都退回默认 `学习进度`；同文件也覆盖 Badge Shelf 顶部解锁计数中文化，避免显示 `N earned`。
- `tests/unit/learning-motivation.test.ts` 覆盖 XP 等级卡中文化，避免显示 `Lv.`、`Algorithm Thinker` 或 `LLM Practitioner`。
- `tests/unit/learning-ui-components.test.ts`、`tests/unit/project-mission-workspace.test.ts`、`tests/unit/learning-path.test.ts`、`tests/unit/weekly-review.test.ts` 和 `tests/unit/map-analytics.test.ts` 覆盖剩余学习页面进度条具体名称，包括 Focus、Review、Path、Weekly、Map、Projects、Completion 和 Knowledge Path。
- `tests/unit/learning-ui-components.test.ts` 覆盖共享 `LearningStepCard` 的屏幕阅读器步骤/状态文本，避免 Voice 步骤进度只靠图标、颜色或英文 `title` 表达。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningTimeline` 的屏幕阅读器步骤/状态文本，避免 Today 完整流程时间线只靠图标、颜色或数字表达。
- `tests/unit/learning-ui-components.test.ts` 覆盖 Today Focus Mode 阶段顶部 `eyebrow` 使用 `第 n 步`，避免首屏学习播放器显示英文 `Step n`。
- `tests/unit/progress-analytics.test.ts` 覆盖 `/progress` 本周补弱计划步骤徽章中文化，避免补弱步骤显示英文 `Step n`。
- `tests/unit/learning-ui-components.test.ts` 覆盖共享 `LearningCelebrationCue` 成就反馈徽章中文化，避免 Today、Review、Projects 和 Mistakes 的完成反馈显示 `Session summary`、`Project progress` 或 `Mastery signal`。
- `tests/unit/learning-ui-components.test.ts` 覆盖学习者可见模式徽章中文化，避免 `LearningFocusPanel` 显示 `Focus Mode` / `Focus Mode 进度`，避免 `KnowledgePathExplorer` 显示 `Path Mode`。
- `tests/unit/pwa-manifest.test.ts` 覆盖 PWA `今日学习` shortcut 描述中文化，避免安装入口继续显示 `Focus Mode`。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `KnowledgePathExplorer` 指标卡不在非交互 `div` 上额外添加 `aria-label`，保留可见中文 label/value 作为主语义。
- `tests/unit/reduced-motion-css.test.ts` 覆盖全局 `prefers-reduced-motion: reduce` CSS 降级，避免动画、transition 和平滑滚动不尊重系统减少动态偏好。
- `tests/unit/shared-ui-a11y.test.ts` 覆盖 Dialog、Sheet、Breadcrumb 的中文屏幕阅读器文案，避免共享 UI 基础组件朗读英文 `Close`、`More` 或 `breadcrumb`。
- `tests/unit/shared-ui-a11y.test.ts` 覆盖移动端底部导航 More Sheet，要求底部主入口保留 `今日`、`复习`、`Coach`、`语音`、`更多`，More Sheet 保留核心学习入口并让每个链接带 `min-h-11` 触控高度。
- `tests/unit/shared-ui-a11y.test.ts` 覆盖全局 `AppShell` 页头 action 区，要求手机端使用全宽单列布局并允许 header 换行，避免 Today、Review、Voice、Projects、Mistakes 等页面页头 CTA 被旧 `flex shrink-0` 容器横向挤压。
- `tests/unit/weekly-review.test.ts` 和 `tests/unit/project-mission-workspace.test.ts` 覆盖 Weekly / Portfolio Markdown 导出文本区的中文业务 `aria-label`，避免只读导出控件朗读英文 `weekly report markdown` 或 `portfolio markdown`。
- `tests/unit/weekly-review.test.ts` 覆盖 Weekly 复盘指标和错题来源中文化，避免页面或 Markdown 导出显示 `quiz 正确率`、`Strongest`、`Weakest`、`mastery`、`weakness` 或 raw `quiz` 来源。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `互动实验` typed callout，避免主课小探索提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 互动实验` 课程块，避免生成协议和 renderer 脱节。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `图示` typed callout，避免主课概念图提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 图示` 课程块，避免生成协议和 renderer 脱节。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `重点` typed callout，避免主课重点提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 重点` 课程块，避免生成协议和 renderer 脱节。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `自测卡` typed callout，避免主课检索练习提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 自测卡` 课程块，避免生成协议和 renderer 脱节。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `例子卡` typed callout，避免主课例子提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 例子卡` 课程块，避免生成协议和 renderer 脱节。
- `tests/unit/learning-ui-components.test.ts` 覆盖 `LearningMarkdown` 的 `代码/伪代码` typed callout，避免主课算法草图提示退化成普通引用块。
- `tests/unit/daily-generation-prompt.test.ts` 覆盖 daily prompt 要求 `lesson.contentMarkdown` 输出 `> 代码/伪代码` 课程块并声明 `data-learning-callout="code_sketch"`，避免生成协议和 renderer 脱节。
- `tests/unit/weekly-review.test.ts` 覆盖 Weekly 下周建议步骤徽章中文化，避免推荐步骤显示英文 `Step n`。
- `tests/unit/learning-path.test.ts` 覆盖 `/path` 路线卡和下一阶段徽章中文化，避免学习路径显示英文 `Stage n` 或 `Next Stage`。
- `tests/unit/project-mission-workspace.test.ts` 覆盖 Projects 状态文案中文化，避免 Mission Hero、里程碑保存状态、当前任务完成 fallback 和作品集数量徽章显示 `Mission Mode`、`code saved`、`reflection saved`、`AI reviewed`、`all done` 或 `N completed`。
- `tests/unit/voice-note.test.ts` 覆盖 Voice 表单核心控件的中文业务 `aria-label`，避免模式选择框和 transcript 文本区朗读 `Voice Note 模式` 或纯英文 `Transcript`。
- `tests/unit/voice-note.test.ts` 覆盖 Voice 选中笔记状态区和转写区域可见标题中文化，避免显示 `Coach linked`、`Note saved` 或独立标题 `Transcript`。
- `tests/unit/voice-note.test.ts` 覆盖 Voice 录音计时器的中文可见标签，避免状态面板显示纯英文 `recording`。
- `tests/unit/learning-ui-components.test.ts` 覆盖 Voice 学习流水线步骤标题中文化，避免步骤卡单独显示 `Coach`、`Note`、`Cards`。
- `tests/unit/learning-ui-components.test.ts` 覆盖 Voice 学习流水线卡片数量状态中文化，避免完成态显示 `N cards`。
- `tests/unit/library-page-labels.test.ts` 覆盖 `/library` 课程列表和课程详情标签中文化，避免学习者可见档案继续显示 raw `completed`、`planned`、`deepseek`、`open_source_project`、`single_choice`、`feedback_ready` 或 `partially_correct`。
- `tests/unit/notes-template.test.ts` 覆盖 `/notes` 关联课程摘要和预填 Markdown 模板的计划状态中文化，避免学习者笔记继续写入 raw `completed` / `planned`。
- `tests/unit/progress-analytics.test.ts` 覆盖 `/progress` 代码反馈问题趋势和错题趋势徽章中文化，避免趋势图继续显示 `high N`、`open N` 或 raw issue type。
- `tests/unit/today-code-exercise.test.ts` 覆盖 `/today` 代码练习手机端思路/伪代码/语音解释入口，要求 `代码思路模式`、`先说清思路`、`伪代码草稿`、`语音解释入口` 可见，并链接到现有 `/voice?lessonId=...&mode=code_debug`。
- `tests/unit/admin-content-review.test.ts` 覆盖 `/admin` 内容维护队列中的重复主题检测、卡片质量审查和来源核验队列。

## 最近验收

- 2026-06-08 本地 RED/GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于 `AppShell` 仍使用固定 `h-14` header 和旧 `flex shrink-0 items-center gap-2` action 容器；补齐移动端 `min-h-14 flex-wrap py-2` header 和 `grid w-full gap-2` action wrapper 后 4 项通过。
- 2026-06-08 本地相关回归：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/mistakes-view.test.ts tests/unit/voice-note.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts` 90 项通过，覆盖共享 UI a11y、学习组件、Projects、Mistakes、Voice、首页、Library 和 Today 标签/触控目标。
- 2026-06-08 本地最终门禁：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 422 项通过，Next 构建生成 28 个页面。Aegis helper 仍失败于既有 Markdown-only 结构债，不属于产品 UI 验证失败。
- 2026-06-07 本地 RED/GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于 More Sheet 路由链接缺少 `min-h-11`；补齐移动底部导航 More Sheet link 触控高度后 3 项通过。
- 2026-06-07 本地相关回归：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/pwa-manifest.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 30 项通过，覆盖共享 UI a11y、PWA shortcuts、首页标签和共享学习组件。
- 2026-06-07 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 Voice-linked generated-card 静态复习链接仍指向 `/review?source=thought-review`；补齐 `CoachFlashcardPanel.reviewSource` 和 `/coach` 页面接线后 15 项通过。
- 2026-06-07 本地 GREEN：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 2 项通过，确认 Voice → Coach → Review 真实浏览器路径未因静态链接接线回退。
- 2026-06-07 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Coach generated-card link、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- 2026-06-07 本地 RED/GREEN：`npm test -- tests/unit/coach-submit.test.ts` 首次失败于 Voice-linked ThoughtReview 通过通用 Coach 生成路径时没有 `reviewSource`；补齐 `reviewJson.source === "voice-note"` 队列归属识别后 5 项通过。
- 2026-06-07 本地 RED/GREEN：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 首次第 2 项失败于点击 Coach `生成卡片` 后仍进入 `/review?source=thought-review`；修复后 2 项通过，Voice Note 来源进入 `/review?source=voice-note` 并显示 `语音笔记复习`。
- 2026-06-07 本地并发 E2E：`npx playwright test tests/e2e/today-interactions.spec.ts tests/e2e/review-interactions.spec.ts tests/e2e/coach-interactions.spec.ts tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 7 项通过，覆盖 Today、Review、Coach、Voice 交互级路径并发运行时的 focused review 队列隔离。
- 2026-06-07 本地 RED/GREEN：`npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"` 首次 2 项失败于直接等待折叠完整视图里的 `today-quiz` 和 `标记完成并生成卡片`；补齐 `openFocusStage()` 后按真实专注阶段进入 `小测验`、`代码练习`、`反思与完成`，2 项通过。
- 2026-06-07 本地相关回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 69 项通过，覆盖 Today/Voice/Coach 核心闭环与共享学习 UI。
- 2026-06-07 本地 RED/GREEN：`npx playwright test tests/e2e/review-interactions.spec.ts --project="Desktop Chrome"` 首次因旧 `/4 很熟/` 按钮 locator 超时失败；改为真实可访问名称 `/很熟 \+14d/` 后 1 项通过。
- 2026-06-07 本地相关回归：`npm test -- tests/unit/review-empty-state.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts tests/unit/learning-ui-components.test.ts` 32 项通过，覆盖 Review 空态、session summary、评分幂等、1/3/7/14 天排期和共享学习 UI。
- 2026-06-07 本地 RED/GREEN：`npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 首次失败于首页 smoke 仍断言旧 `Current Mission / 当前任务`；同步首页 `当前任务`、Projects `项目任务模式` 和 Coach `上下文指南针` 断言后 2 项通过。
- 2026-06-07 本地覆盖扫描：`rg -n "Current Mission / 当前任务|Mission Mode|Context Compass" tests/e2e src/app src/components src/server --glob '!src/app/admin/**'` 无匹配，确认学习者可见源码和 E2E 不再保留三个旧英文/混合断言。
- 2026-06-07 本地 RED/GREEN：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 首次两个 Voice interaction 用例都因旧 `getByLabel("Transcript")` 超时失败；改为中文 `getByLabel("语音转写文本")` 后 2 项通过。
- 2026-06-07 本地覆盖扫描：`rg -n "getByLabel\\(\"Transcript\"\\)|aria-label=\"Transcript\"|>Transcript<|Transcript" tests/e2e src/app/voice src/components --glob '!src/app/admin/**'` 确认 E2E 不再保留旧英文 locator，生产 Voice UI 剩余 `Transcript` 命中仅为内部类型/变量名。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 互动实验` prompt 协议和 `data-learning-callout="experiment"`；补齐 renderer 与 prompt v2.5 后 25 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 XP 等级卡仍显示 `Lv.3 Algorithm Thinker` 和 `LLM Practitioner`；补齐 `第 3 级 算法思考者` 和 `LLM 实践者` 后 10 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 Badge Shelf 顶部仍显示英文 `1 earned`；补齐 `已解锁 N 个` 后 9 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 图示` prompt 协议和 `data-learning-callout="diagram"`；补齐 renderer 与 prompt v2.6 后 25 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 重点` prompt 协议和 `data-learning-callout="key_point"`；补齐 renderer 与 prompt v2.7 后 25 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 自测卡` prompt 协议和 `data-learning-callout="self_check"`；补齐 renderer 与 prompt v2.8 后 25 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 例子卡` prompt 协议和 `data-learning-callout="example"`；补齐 renderer 与 prompt v2.9 后 25 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `data-learning-callout="code_sketch"` prompt 协议和 `> 代码/伪代码` 退化成普通引用块；补齐 renderer 与 prompt v2.10 后 25 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/today-code-exercise.test.ts` 新增手机端思路/语音入口断言，首次失败于缺少 `代码思路模式`；补齐 `代码思路模式`、`先说清思路`、`伪代码草稿` 和 `/voice?lessonId=...&mode=code_debug` 链接后 2 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/voice-note.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 40 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/admin-content-review.test.ts` 首次失败于 `summarizeDuplicateDailyPlanTopics is not a function`；补齐重复主题检测服务和 `/admin` 只读卡片后 3 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/auth-policy.test.ts` 20 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 新增趋势徽章中文化断言，补齐 `高优先级`、`未解决` 和高频 issue type 映射后 16 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 42 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/notes-template.test.ts` 首次失败于笔记模板仍显示 `课程状态：completed`；补齐 `formatNotePlanStatusLabel()` 并接入 Notes 页面后 4 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 20 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningFocusPanel` 仍显示 `Focus Mode` / `Focus Mode 进度`、`KnowledgePathExplorer` 仍显示 `Path Mode`，补充 RED 失败于 `/today` 完整课程折叠说明仍显示 `Focus Mode 下方...`；补齐 `专注模式`、`专注模式进度`、`路径模式` 和 `专注模式下方...` 后 20 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/pwa-manifest.test.ts` 首次失败于 `今日学习` shortcut 仍显示 `打开今日 Focus Mode...`；补齐 `打开今日专注模式...` 后 1 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/pwa-manifest.test.ts tests/unit/auth-policy.test.ts` 54 项通过。
- 2026-06-06 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于成就反馈仍显示 `Session summary`、`Project progress`、`Mastery signal`；补齐 `复习总结`、`项目进度`、`掌握证据` 后 20 项通过。
- 2026-06-06 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts` 41 项通过。
- 2026-06-06 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面并包含 `/today`、`/review`、`/projects`、`/mistakes`。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 本周补弱计划仍显示 `Step 1` / `Step 2`；补齐 `第 {index + 1} 步` 后 15 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts` 38 项通过。
- 2026-06-05 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面并包含 `/progress`。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 Projects 仍显示 `Mission Mode`、`code saved`、`reflection saved`、`AI reviewed`、`1 completed`，以及 `/projects` 页面源码仍使用 raw `activeMilestone.status` / `all done`；补齐中文状态文案后 12 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 37 项通过。
- 2026-06-05 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面并包含 `/projects` 和 `/projects/portfolio`。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-path.test.ts` 首次失败于 `/path` 仍显示 `Next Stage`，扩展覆盖 `Stage {index + 1}` 后补齐 `下一阶段` 和 `第 {index + 1} 阶段`，3 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 43 项通过。
- 2026-06-05 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 生产构建生成 28 个静态页面并包含 `/path`。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于当前 Voice Note 状态区仍显示 `Coach linked`、`Note saved`、`Transcript`，二次失败于 Voice 输入表单仍显示独立标题 `Transcript`；补齐 `已连接 Coach`、`已保存笔记`、`转写文本` 后 8 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `/weekly` 下周建议仍显示 `Step {index + 1}`；补齐 `第 {index + 1} 步` 后 3 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `/today` 阶段定义仍使用 `eyebrow: "Step n"`；补齐 `第 1 步` 到 `第 7 步` 后 20 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts` 31 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 Weekly 页面和 Markdown 仍显示 `quiz 正确率`、`Quiz 正确率`、`Strongest`、`Weakest`、`mastery`、`weakness`、`quiz`；补齐中文指标和来源映射后 3 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 36 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Voice 学习流水线完成态仍显示 `3 cards`；补齐 `3 张卡片` 后 19 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts` 38 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Voice 学习流水线仍显示 `Coach`、`Note`、`Cards`；补齐 `Coach 检查`、`整理笔记`、`复习卡片` 后 19 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts` 38 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice 录音计时器仍显示纯英文 `recording`；补齐 `录音计时` 后 7 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice 表单仍使用 `aria-label="Voice Note 模式"` 和 `aria-label="Transcript"`；补齐 `语音笔记模式` 和 `语音转写文本` 后 7 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts` 首次失败于 Weekly / Portfolio Markdown 导出文本区仍使用英文 `aria-label`；补齐 `导出 Weekly Markdown 周报` 和 `导出 {项目名} Portfolio Markdown` 后 14 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 35 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于共享进度条缺少 `progressbar` 语义；补齐后 17 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于学习动机卡仍使用默认 `aria-label="学习进度"`；补齐 `今日任务进度`、`XP 等级进度`、`周目标进度`、`徽章进度：...` 后 8 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts` 首次失败于剩余学习进度条缺少具体名称；补齐后 43 项通过。
- 2026-06-05 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts` 51 项通过。
- 2026-06-05 本地 GREEN：`rg -n -C 3 "<LearningProgressBar" src/app src/components` 确认所有共享进度条调用点均传入具体 `label`。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于共享步骤卡缺少 `sr-only` 中文步骤/状态文本且仍输出 `title="step 2"`；补齐后 18 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于时间线缺少 `第 n 步，完成/进行中/待办` 文本；补齐后目标断言通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于知识路径指标卡仍输出非交互 `aria-label`；移除后目标断言通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/reduced-motion-css.test.ts` 首次失败于全局样式缺少 `prefers-reduced-motion: reduce`；补齐后 1 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于共享 Dialog/Sheet/Breadcrumb 仍使用英文无障碍文本；补齐后 2 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/pwa-manifest.test.ts` 首次失败于 manifest 缺少 shortcuts；补齐后 1 项通过。
- 2026-06-05 本地 RED/GREEN：`npm test -- tests/unit/auth-policy.test.ts tests/unit/pwa-manifest.test.ts` 首次暴露 `/manifest.webmanifest` 被误判为受保护路径；修复后 11 项通过。
- 2026-06-05 本地 GREEN：未登录 `curl http://127.0.0.1:3000/manifest.webmanifest` 返回 HTTP 200 和 `application/manifest+json`，包含四个 shortcuts。
- 2026-06-03 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 2026-06-03 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:hydration` 16 项通过。
- 2026-06-03 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。
- 2026-06-03 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/visual.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 32 项通过。
- 2026-06-03 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 E2E_PREVIEW_TOKEN=<redacted-temp-token> npm run e2e:preview-readonly` 4 项通过。
- 2026-06-05 本地 RED/GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 首次暴露 smoke 断言陈旧；同步 `/weekly` 重复文案 locator、`/glossary` 的 `已看` 指标文案、`/review` 评分按钮可访问名称后 2 项通过。

## 约束

- 不在测试代码或配置中写入 Preview token、API key、Admin secret。
- 生产 smoke 应只使用 Preview Mode，避免触发写操作。
- 本地 Preview 写保护 E2E 需要服务端同时配置 `PREVIEW_TOKEN`，且该值应与 `E2E_PREVIEW_TOKEN` 匹配；命令输出和文档中只记录占位符或 redacted 值。
- `test-results/` 和 `playwright-report/` 是运行产物，保持 git ignored。
