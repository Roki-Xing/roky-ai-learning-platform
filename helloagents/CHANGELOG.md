# Changelog

## [0.72.0] - 2026-05-29

### Added

- **[Progress Weekly Remediation Plan]** 将 `/progress` 顶部看板从数据展示升级为本周可执行补弱计划。
  - 新增 `buildWeeklyRemediationPlan()`，把薄弱领域、到期卡片、开放误区和代码反馈转成最多 3 个行动步骤。
  - `/progress` 顶部新增“本周补弱计划”卡片，展示当前 focus domain 与 Step 1/2/3。
  - 行动入口直接连接 `/review`、`/coach`、`/review?source=code-feedback`、`/today` 或 `/map?domain=...`，减少从数据到行动的跳转成本。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于缺少 `buildWeeklyRemediationPlan` 导出。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 13 项通过。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts && npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 185 项通过。
- 本地 GREEN：`npm run e2e` 16 项通过。

## [0.71.0] - 2026-05-29

### Added

- **[Coach Remediation Queue]** 将 `/coach` 右侧上下文里的活跃误区和代码反馈整理成可执行补弱队列。
  - 新增 `CoachRemediationQueue`，优先展示当前最需要澄清的误区和最新代码反馈。
  - 队列中的误区回到 `/coach`，鼓励用户用自己的话重讲一遍。
  - 队列中的代码反馈进入 `/review?source=code-feedback`，直接复习实现错误卡。
  - `/coach` 学习上下文区域现在先显示 Context Compass，再显示补弱队列和详细上下文列表。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts` 失败于缺少 `CoachRemediationQueue` 导出。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 5 项通过。

## [0.70.0] - 2026-05-29

### Added

- **[Voice Review Handoff]** 强化 Voice Note 生成卡片后的复习接续。
  - `VoiceLearningPipeline` 在已生成卡片后显示“语音卡片已进入复习队列”提示。
  - 生成卡片后的主复习 CTA 改为“复习这 N 张语音卡片”。
  - CTA 直接进入 `/review?source=voice-note`，避免用户在全量复习队列里找 Voice/Coach 卡片。
  - 服务端测试补充 Voice 生成卡片同时带有 `voice-note` 与 `thought-review` 标签，保证队列过滤契约稳定。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于缺少 Voice 卡片完成态复习接续文案和 `source=voice-note` 链接。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-submit.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 22 项通过。

## [0.69.0] - 2026-05-29

### Added

- **[Home Remediation Focus]** 首页 `Next Best Action` 接入具体补弱焦点。
  - `buildNextBestAction()` 增加 `openMisconceptionFocus` 与 `codeFeedbackFocus` 输入。
  - 未解决误区优先推荐 Coach，并在标题和原因里点出当前最需要澄清的 summary。
  - 没有误区但有代码反馈时，推荐回看最新需要关注的代码反馈 summary。
  - 首页读取最近 open misconception 与最新需关注 code feedback，并在“现在最值得做”下方展示“补弱焦点”面板。

### Verified

- 本地 RED：`npm test -- tests/unit/next-best-action.test.ts` 失败于标题/原因未包含具体误区或代码反馈 summary。
- 本地 GREEN：`npm test -- tests/unit/next-best-action.test.ts` 7 项通过。

## [0.68.0] - 2026-05-29

### Added

- **[Coach Context Compass]** 强化 `/coach` 右侧学习上下文可视化。
  - 新增 `CoachContextCompass`，集中显示本地日期、关联课程、上下文信号总数和最强信号。
  - 将到期卡片、最近错题、代码反馈、活跃误区做成可点击信号块，分别回到 `/review`、`/progress`、`/projects`、`/coach`。
  - `/coach` 右侧栏用 Context Compass 替代重复的本地日期/关联课程小块，保留下方详细上下文列表。
  - Playwright smoke 增加 `/coach` 的 `Context Compass` 页面级断言。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts` 失败于缺少 `CoachContextCompass` 导出。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 4 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。

## [0.67.0] - 2026-05-29

### Added

- **[Review Completion Feedback]** 强化 `/review` 本轮复习完成后的反馈。
  - 新增 `buildReviewSessionSummary()`，根据 forgot/hard/good/easy 计算本轮复习数、稳定记住数、补弱数和留存率。
  - 忘了/模糊占优时，完成卡片推荐进入 Coach 补弱；留存稳定时，推荐查看进度。
  - `ReviewTrainer` 完成态从简单 queue empty 升级为留存率徽标、三项统计和下一步 CTA。

### Verified

- 本地 RED：`npm test -- tests/unit/review-session-summary.test.ts` 失败于缺少 `@/server/review/session-summary`。
- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于完成态仍渲染空状态，缺少会话统计注入。
- 本地 GREEN：`npm test -- tests/unit/review-session-summary.test.ts` 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 6 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test` 179 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e` 16 项通过。

## [0.66.0] - 2026-05-29

### Added

- **[E2E / Visual QA]** 新增 Playwright 视觉截图 smoke 回归。
  - 新增 `npm run e2e:visual`，单独运行视觉截图检查。
  - 新增 `tests/e2e/helpers.ts`，复用本地 Demo 登录与生产 Preview 入口逻辑。
  - 新增 `tests/e2e/visual.spec.ts`，覆盖首页、今日学习、复习中心、思路评审、语音学习捕获、知识地图、项目实践 7 个页面。
  - 每个页面覆盖 desktop `1440x1100` 与 mobile `390x900` 两个视口，并输出到被忽略的 `test-results/visual-smoke/`。
  - `tests/e2e/smoke.spec.ts` 改为复用共享登录 helper，避免登录逻辑分叉。

### Fixed

- **[Visual QA Stability]** 修复视觉回归初版暴露的稳定性问题。
  - RED：初次运行 `npm run e2e:visual` 因没有测试文件失败。
  - RED：移动端 marker 断言匹配到隐藏导航链接，改为使用可访问 heading locator。
  - RED：`/map` fullPage 截图超时，改为稳定 viewport 截图并禁用动画。

### Verified

- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test` 176 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e` 16 项通过。
- 本地 GREEN：`npm run e2e:visual` 14 项通过。

## [0.65.0] - 2026-05-29

### Added

- **[Knowledge Path Explorer]** 将 Glossary/Radar 从资料库进一步升级成路径化学习体验。
  - `buildKnowledgePathProgress()` 增加 `viewed / hasCard / reviewed / weak` 节点状态、路径计数和下一项状态。
  - 新增 `KnowledgePathExplorer`，统一展示“已看过 / 已制卡 / 已复习 / 未掌握 / 下一项”。
  - `/glossary` 读取历史 DailyPlan 的 glossary 连接，推断术语路径已看过状态，并用到期未复习卡片标记未掌握。
  - `/radar` 读取历史 DailyPlan 的 radar 连接，推断广度路径已看过状态，并复用同一 Path Mode UI。
  - Playwright smoke 扩展 `/glossary` 和 `/radar` 路径化学习断言。

### Verified

- 本地 RED：`npm test -- tests/unit/knowledge-base.test.ts` 失败于缺少 `viewedCount / weakCount / nextStatusLabel`。
- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于缺少 `KnowledgePathExplorer`。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 14 项通过。
- 本地 GREEN：`npm run e2e` 2 项通过。

## [0.64.0] - 2026-05-29

### Added

- **[Project Daily Rhythm]** 将项目实践更明确地接入每日使用路径。
  - 首页新增 `ProjectDailyRhythmCard`，固定展示当前项目进度、今日项目任务、里程碑进度、项目卡片到期和代码反馈到期。
  - 没有进行中项目时，首页给出“选择项目”入口，避免项目实践只藏在独立页面。
  - `/projects` Mission Hero 空态保留“今日项目任务”槽位，让项目工作台结构在有无项目时保持一致。
  - Playwright smoke 扩展首页项目节奏入口和 `/projects` Mission Mode 断言。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 失败于缺少 `ProjectDailyRhythmCard`。
- 本地 RED：`npm run e2e` 失败于 `/projects` 空态缺少“今日项目任务”稳定槽位。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 6 项通过。
- 本地 GREEN：`npm run e2e` 2 项通过。

## [0.63.0] - 2026-05-29

### Added

- **[Voice / Coach Flow]** 强化 Voice Note 到 Coach、Note、Flashcards、Review 的学习流水线。
  - 新增 `VoiceLearningPipeline`，在 `/voice` 中集中展示“已保存 → Coach → Note → Cards”的阶段状态。
  - Pipeline CTA 明确为“送 Coach 检查 / 整理成笔记 / 生成复习卡片 / 去复习”，替代分散按钮。
  - 首页 `Next Best Action` 增加 `todayVoiceNoteCount` 信号：今日学习和笔记已完成但还没语音表达时，优先推荐去 `/voice` 说出理解。
  - 首页 Next Best Action 指标增加“语音表达”计数。
  - Playwright smoke 扩展 `/voice` 流水线断言。

### Verified

- 本地 RED：`npm test -- tests/unit/next-best-action.test.ts` 失败于仍跳转 `/projects`，未推荐 `/voice`。
- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于缺少 `VoiceLearningPipeline`。
- 本地 GREEN：`npm test -- tests/unit/next-best-action.test.ts` 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 4 项通过。
- 本地：`npm run e2e` 2 项通过。

## [0.62.0] - 2026-05-29

### Added

- **[E2E / UI Smoke]** 接入 Playwright 浏览器级 smoke tests。
  - 新增 `npm run e2e` 脚本。
  - 新增 `playwright.config.ts`，默认启动本地 Next dev server，也支持 `E2E_BASE_URL` 指向外部环境。
  - 新增 `tests/e2e/smoke.spec.ts`，覆盖登录/Preview 入口、首页、`/today` Focus player、`/review` 主动回忆 reveal、`/coach`、`/voice`。
  - 新增 `helloagents/modules/e2e-ui-smoke.md` 记录运行方式和安全约束。
  - `.gitignore` 忽略 Playwright 运行产物。

### Fixed

- **[AppShell]** 修复移动端 Sheet 菜单触发器的嵌套 button 结构，消除浏览器 E2E 暴露的 hydration mismatch 风险。

### Verified

- 本地：`npm run lint` 通过。
- 本地：`npm test` 170 项通过。
- 本地：`npm run build` 通过。
- 本地：`npm run e2e` 2 项通过。

## [0.61.0] - 2026-05-29

### Added

- **[Today Focus Player]** 将 `/today` 从轻量 Focus 面板升级为真正的专注学习播放器。
  - 新增 `LearningFocusPlayer`，一次只展示一个学习阶段，支持上一步、下一步、阶段圆点和右侧阶段列表切换。
  - 播放器右侧保留今日概览，展示状态、日期、复习卡片、到期卡片、内容来源和 schema。
  - `/today` 顶部接入完整学习阶段：今日目标、主课通读、引导步骤、代码练习、小测验、术语与广度、反思与完成。
  - 下方继续保留完整视图和原有 Timeline，避免丢失快速跳转、编辑和调试能力。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于缺少 `@/components/learning/learning-focus-player`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 170 项通过。
- 本地：`npm run build` 通过。
- 生产验收见本次提交后的部署记录。

## [0.60.0] - 2026-05-29

### Added

- **[Learning Experience Polish]** 完成登录、首页、今日学习、课程正文、Voice 和知识路径体验打磨。
  - 新增 read-only Preview Mode：`/preview?token=...` 设置 `ral_preview` cookie，并用 `demo-user` 展示真实数据。
  - Preview 下所有生成、保存、提交、复习评分、Coach、Voice、Settings、知识卡片和 Admin actions 均拒绝写入；`/admin` 在 Preview 下直接 404。
  - 登录页从单卡片改为产品入口，展示每日学习闭环、Coach、Voice、项目实践和长期积累能力。
  - 首页新增“现在最值得做” Next Best Action，基于今日状态、到期卡片、open misconception、代码反馈、项目里程碑和今日笔记给出 CTA。
  - 新增 `LearningMarkdown`，用 `react-markdown + remark-gfm` 安全渲染主课 Markdown，不启用 raw HTML。
  - `/today` 新增轻量 Focus Mode，并在完成后推荐当前 active project milestone。
  - Voice 录音区新增计时器，继续保留手动 transcript fallback。
  - Glossary/Radar 学习路径增加已制卡、已复习和 learn next 状态。

### Verified

- 本地：`npm run lint` 已通过。
- 本地定向：`npm test -- tests/unit/auth-policy.test.ts tests/unit/next-best-action.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 16 项通过。
- 全量 `npm test`、`npm run build` 和生产验收见本次提交后的部署记录。

## [0.59.0] - 2026-05-28

### Added

- **[Project Mission Workspace]** 完成 `/projects` Mission Mode 学习工作台改造。
  - `/projects` 顶部新增 Mission Hero，集中展示当前项目、进度、剩余里程碑、项目卡片到期数和代码反馈到期数。
  - 左侧改为项目类型筛选、项目模板和当前项目列表，保留 `startProjectAction` 与现有项目打开流程。
  - 主工作区聚焦“今日项目任务”，保留保存草稿、保存并评审代码、完成里程碑和生成项目总结的 server action 流程。
  - 复习队列和项目复盘从散落区域收敛到右侧上下文面板，项目完成卡片与代码反馈卡片入口继续进入 `/review` focused queue。
  - 里程碑列表改为路线式展示，突出 code saved、reflection saved、AI reviewed 与 feedback summary。
  - 新增 `src/app/projects/ui/project-mission-workspace.tsx` 作为 `/projects` 专用 UI 组件层。
  - 新增 `tests/unit/project-mission-workspace.test.ts`，覆盖 Mission Hero、完成条件、项目列表/复习队列和里程碑路线静态渲染。

### Verified

- 本地：`npm run lint` 通过。
- 本地：`npm test` 160 项通过。
- 本地：`npm run build` 通过。
- GitHub：`Roki-Xing/roky-ai-learning-platform` 确认为 `PRIVATE`，默认分支为 `main`。
- 生产：`118.25.15.72:/home/ubuntu/ai-learning-platform` 已 fast-forward 到 `a0c4659`。
- 生产：Docker 容器 `ai-learning-platform` 内 `npm run build` 通过。
- 生产：容器重启后 `https://learn.roky.chat/api/health` 返回 `ok`。
- 生产：带 `Cookie: ral_demo=1` 抓取 `https://learn.roky.chat/projects` 可见 `Mission Mode`、`今日只做这一小步`、`复习队列`、`项目复盘`、`里程碑路线`。

## [0.58.0] - 2026-05-25

### Added

- **[Coach Lesson Scope]** 完成 Sprint 58 `/coach` 显式 lesson 归属校验。
  - `buildCoachContext()` 对显式传入的 `lessonId` 执行当前用户正式、未归档、非测试 DailyPlan 归属校验。
  - 不可见 lesson 直接拒绝，避免表单篡改后静默回退或错误关联。
  - 未显式传入 `lessonId` 时仍按 `includeTodayLesson` 使用当前用户今日课程。
  - 扩展 `tests/unit/coach-submit.test.ts`，覆盖显式跨用户 lesson 拒绝。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-submit.test.ts` 失败于显式跨用户 lesson 未拒绝。
- 本地 GREEN：`npm test -- tests/unit/coach-submit.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 149 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机验证待补。

## [0.57.0] - 2026-05-25

### Added

- **[Voice Lesson Scope]** 完成 Sprint 57 `/voice` 显式 lesson 归属校验。
  - `saveVoiceNote()` 对显式传入的 `lessonId` 执行当前用户正式、未归档、非测试 DailyPlan 归属校验。
  - 不可见 lesson 直接拒绝，避免表单篡改后静默降级或错误关联。
  - 未显式传入 `lessonId` 时仍回退到当前用户最近正式课程。
  - 扩展 `tests/unit/voice-submit.test.ts`，覆盖显式跨用户 lesson 拒绝。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-submit.test.ts` 失败于显式跨用户 lesson 未拒绝。
- 本地 GREEN：`npm test -- tests/unit/voice-submit.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 148 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机备份路径为 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint57-20260525-080755.tar.gz`。
- 生产：备用机远端目标测试 10 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/voice` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fvoice`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.56.0] - 2026-05-25

### Added

- **[Notes Lesson Scope]** 完成 Sprint 56 `/notes` 笔记 lesson 归属校验。
  - 新增 `src/server/notes/create-note.ts`，用 `createScopedNote()` 统一 Note 创建。
  - `createScopedNote()` 只允许把笔记绑定到当前用户正式、未归档、非测试 DailyPlan 关联的 Lesson。
  - standalone note 继续允许 `lessonId = null`。
  - `/notes` 页面选择 lesson 时复用可见 lesson 解析逻辑，避免 query string 指向不可见课程。
  - 扩展 `tests/unit/notes-create.test.ts`，覆盖 owned lesson、cross-user lesson 和 standalone note。

### Verified

- 本地 RED：`npm test -- tests/unit/notes-create.test.ts` 失败于缺少 `@/server/notes/create-note`。
- 本地 GREEN：`npm test -- tests/unit/notes-create.test.ts` 3 项通过。
- 本地相邻回归：`npm test -- tests/unit/notes-create.test.ts tests/unit/library-lesson-detail.test.ts` 5 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 147 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机备份路径为 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint56-20260525-080002.tar.gz`。
- 生产：备用机远端目标测试 5 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/notes` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fnotes`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.55.0] - 2026-05-25

### Added

- **[Progress Code Feedback Issue Trend]** 完成 Sprint 55 `/progress` 代码反馈问题趋势。
  - `src/server/analytics/progress.ts` 新增 `summarizeCodeFeedbackIssueTrend()`。
  - `/progress` 顶部新增“代码反馈问题趋势”面板，展示每日反馈次数、问题数、高/中/低严重度和高频问题类型。
  - `/progress` 从当前用户 `CodeFeedback` 读取 `localDate` 与 `issues`。
  - 聚合逻辑复用 `normalizeCodeFeedbackIssues()`，兼容 string 和 object 两种历史 issues 形态。
  - 扩展 `tests/unit/progress-analytics.test.ts`，覆盖 severity 和 top issue type 按 localDate 聚合。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于缺少 `summarizeCodeFeedbackIssueTrend`。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 12 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 144 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机备份路径为 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint55-20260525-074657.tar.gz`。
- 生产：备用机远端目标测试 12 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/progress` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fprogress`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.54.0] - 2026-05-25

### Added

- **[Progress Quiz Accuracy Trend]** 完成 Sprint 54 `/progress` 测验正确率趋势。
  - `src/server/analytics/progress.ts` 新增 `summarizeQuizAccuracyTrend()`。
  - `/progress` 顶部新增“测验正确率趋势”面板，展示每日答题数、正确数和正确率。
  - `/progress` 从当前用户 official lesson 下的 `QuizAttempt` 读取趋势数据。
  - `QuizAttempt.createdAt` 按用户 `timeZone` 转换为 localDate 后聚合。
  - 扩展 `tests/unit/progress-analytics.test.ts`，覆盖 attempts/correct/accuracy 按 localDate 聚合。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于缺少 `summarizeQuizAccuracyTrend`。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 11 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 143 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 11 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/progress` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fprogress`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.53.0] - 2026-05-25

### Added

- **[Progress Misconception Trend]** 完成 Sprint 53 `/progress` 错题趋势。
  - `src/server/analytics/progress.ts` 新增 `summarizeMisconceptionTrend()`。
  - `/progress` 顶部新增“错题趋势”面板，展示新增错题、开放错题、已解决、忽略和解决率。
  - `/progress` 从当前用户 `Misconception` 读取趋势数据。
  - 旧记录缺少 `localDate` 时，按用户 `timeZone` 从 `lastAttemptAt` 补齐趋势日期。
  - 扩展 `tests/unit/progress-analytics.test.ts`，覆盖 active/resolved/ignored 按 localDate 聚合。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于缺少 `summarizeMisconceptionTrend`。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 142 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 10 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/progress` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fprogress`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.52.0] - 2026-05-25

### Added

- **[Progress Learning State]** 完成 Sprint 52 `/progress` 学习状态补强。
  - `src/server/analytics/progress.ts` 新增 `buildProgressWeakDomainSummary()`。
  - `src/server/analytics/progress.ts` 新增 `summarizeReviewRetentionTrend()`。
  - `/progress` 顶部新增“薄弱领域”面板，按领域展示活跃错题、复习欠账、代码练习缺口和测验正确率。
  - `/progress` 顶部新增“复习留存趋势”面板，按用户时区 localDate 展示 good/easy 留存率。
  - 薄弱领域聚合只使用当前用户 official DailyPlan 关联的 Lesson 信号，避免把独立知识卡片混入领域弱项。
  - 扩展 `tests/unit/progress-analytics.test.ts`，覆盖弱领域排序和复习留存趋势聚合。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于缺少 `buildProgressWeakDomainSummary` 和 `summarizeReviewRetentionTrend`。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 9 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 141 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 9 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/progress` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fprogress`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.51.0] - 2026-05-25

### Added

- **[Map Insights]** 完成 Sprint 51 `/map` 强弱领域摘要。
  - `src/server/map/analytics.ts` 新增 `buildKnowledgeMapInsights()`。
  - helper 从真实 `domainStats` 生成 `weakDomains`、`reviewDebtDomains`、`codeLightDomains` 和 `nextFocus`。
  - `/map` 顶部新增摘要卡：
    - 偏弱领域
    - 复习欠账
    - 代码练习少
    - 下一步补哪里
  - 摘要卡直接链接到对应领域详情。
  - 新增 `helloagents/modules/knowledge-map.md`，记录知识地图指标和 Sprint 51 摘要层。
  - 扩展 `tests/unit/map-analytics.test.ts`，覆盖弱点、复习欠账、代码练习缺口和 next focus 排序。

### Verified

- 本地 RED：`npm test -- tests/unit/map-analytics.test.ts` 失败于 `buildKnowledgeMapInsights is not a function`。
- 本地 GREEN：`npm test -- tests/unit/map-analytics.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 139 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 4 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/map` 返回 `307 Temporary Redirect` 到 `/login?next=%2Fmap`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.50.0] - 2026-05-25

### Added

- **[Admin Audit Exceptions]** 完成 Sprint 50 `/admin` 计划审计异常自动发现。
  - 新增 `src/server/admin/plan-audit-exceptions.ts` 和 `buildAdminPlanAuditExceptions()`。
  - 异常扫描按当前 `userId` 和 admin plan filter 读取最近计划，不跨用户聚合。
  - 异常覆盖缺 `generationJobId`、缺 linked `AiGenerationJob`、缺 `CurriculumDecisionLog`、topic/domain/schema mismatch。
  - 聚合层做根因去重，避免缺 decision/job 时重复报派生异常。
  - `/admin` 新增“计划审计异常”卡片，展示 scanned、异常计划数、fail/warn 和单条审计链路入口。
  - 新增 `tests/unit/admin-plan-audit-exceptions.test.ts`，覆盖异常分类、只读性和跨用户隔离。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts` 失败于缺少 `@/server/admin/plan-audit-exceptions`。
- 本地 GREEN：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts` 2 项通过。
- 本地相关目标测试：`npm test -- tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-plan-audit-chain.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 138 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 4 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/admin` 返回 `307 Temporary Redirect` 到 `/login`，符合 admin 登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.49.0] - 2026-05-25

### Added

- **[Admin Plan Audit Chain]** 完成 Sprint 49 `/admin` 单条计划审计链路。
  - 新增 `src/server/admin/plan-audit.ts` 和 `buildAdminPlanAuditChain()`。
  - 审计 helper 按 `userId + planId` 读取计划，拒绝跨用户 planId。
  - 审计链路关联 DailyPlan、Lesson topic/domain、CurriculumDecisionLog、AiGenerationJob 和 planner input summary。
  - 审计链路返回 decision log、generation job、topic、domain、schemaVersion 的一致性检查。
  - `/admin` 最近 DailyPlan 行新增“审计链路”入口。
  - `/admin?auditPlanId=...` 展示单条计划审计链路，原始 JSON 仍默认折叠。
  - 新增 `tests/unit/admin-plan-audit-chain.test.ts`，覆盖完整证据链和跨用户拒绝。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-plan-audit-chain.test.ts` 失败于缺少 `@/server/admin/plan-audit`。
- 本地 GREEN：`npm test -- tests/unit/admin-plan-audit-chain.test.ts` 2 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 136 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 2 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/admin?auditPlanId=missing` 返回 `307 Temporary Redirect` 到 `/login`，符合 admin 登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.48.0] - 2026-05-25

### Added

- **[Admin Planner Input Visibility]** 完成 Sprint 48 `/admin` 生成任务 planner 输入可见性。
  - 新增 `src/server/admin/planner-visibility.ts` 和 `buildAdminPlannerJobSummary()`。
  - `/admin` 最近 `AiGenerationJob` 查询读取 `input`，用于展示生成时实际消费的 planner decision。
  - `/admin` 最近 `AiGenerationJob` 卡片新增 `Planner input` 摘要。
  - 摘要展示 localDate、schemaVersion、难度、预计分钟、领域、主题、主理由、活跃信号和 signal snapshot。
  - 没有 `curriculum` input 的 job 不显示 planner 摘要，避免误导。
  - 新增 `tests/unit/admin-planner-visibility.test.ts`，覆盖有/无 curriculum input 两类路径。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-planner-visibility.test.ts` 失败于缺少 `@/server/admin/planner-visibility`。
- 本地 GREEN：`npm test -- tests/unit/admin-planner-visibility.test.ts` 2 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 134 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 2 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/admin` 返回 `307 Temporary Redirect` 到 `/login`，符合 admin 登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.47.0] - 2026-05-25

### Added

- **[Review Empty State CTA]** 完成 Sprint 47 `/review` 空队列下一步引导。
  - 新增 `src/server/review/empty-state.ts` 和 `buildReviewEmptyState()`。
  - `/review` 没有到期卡片时显示明确标题、说明和 CTA。
  - 默认队列空状态引导到 `/today`、`/library`、`/progress`。
  - project focused queue 空状态保留项目入口。
  - code-feedback focused queue 空状态保留项目和全部复习入口。
  - 新增 `tests/unit/review-empty-state.test.ts`，覆盖三类空状态。

### Verified

- 本地 RED：`npm test -- tests/unit/review-empty-state.test.ts` 失败于缺少 `@/server/review/empty-state`。
- 本地 GREEN：`npm test -- tests/unit/review-empty-state.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 132 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 3 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/review` 返回 `307 Temporary Redirect` 到 `/login?next=%2Freview`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.46.0] - 2026-05-25

### Added

- **[Settings Save Feedback]** 完成 Sprint 46 `/settings` 保存成功提示。
  - `src/server/profile/settings.ts` 新增 `settingsSavedRedirectPath()`。
  - `src/server/profile/settings.ts` 新增 `buildSettingsSavedNotice()`。
  - `updateSettingsAction()` 保存 UserProfile 后重定向到 `/settings?saved=1`。
  - `/settings` 按 Next.js 16 Promise `searchParams` 读取 `saved` 状态。
  - `/settings` 只在 `saved=1` 时显示“设置已保存”成功提示。
  - 扩展 `tests/unit/settings-profile.test.ts`，覆盖保存提示和 redirect path 口径。

### Verified

- 本地 RED：`npm test -- tests/unit/settings-profile.test.ts` 失败于缺少 `buildSettingsSavedNotice()`。
- 本地 GREEN：`npm test -- tests/unit/settings-profile.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 129 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 3 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/settings?saved=1` 返回 `307 Temporary Redirect` 到 `/login?saved=1&next=%2Fsettings`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.45.0] - 2026-05-25

### Added

- **[Today Review Summary]** 完成 Sprint 45 今日页复习入口去占位。
  - 新增 `src/server/review/today-summary.ts` 和 `buildTodayReviewSummary()`。
  - `/today` 右侧移除 `PlaceholderCard` 的“复习区”。
  - `/today` 右侧新增“今日复习入口”，展示本课卡片、本课到期和全部到期卡片数。
  - 未完成今日学习时 CTA 显示“完成后生成卡片”并禁用。
  - 已完成今日学习时 CTA 指向 `/review`。
  - 新增 `tests/unit/today-review-summary.test.ts`，覆盖 completed、planned 和全局 due count 口径。

### Verified

- 本地 RED：`npm test -- tests/unit/today-review-summary.test.ts` 失败于缺少 `@/server/review/today-summary`。
- 本地 GREEN：`npm test -- tests/unit/today-review-summary.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 128 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 3 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/today` 返回 `307 Temporary Redirect` 到 `/login?next=%2Ftoday`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.44.0] - 2026-05-25

### Added

- **[Review Schedule Summary]** 完成 Sprint 44 复习中心规则说明去占位。
  - `src/server/review/schedule.ts` 新增 `buildReviewScheduleSummary()`。
  - `/review` 右侧新增“队列范围”，展示当前队列、范围和到期卡片数。
  - `/review` 右侧新增“复习规则”，展示 `forgot/hard/good/easy` 对应 +1/+3/+7/+14 天。
  - 移除 `/review` 右侧“后续可切换 FSRS 与自定义参数”占位卡。
  - 扩展 `tests/unit/review-schedule.test.ts`，覆盖当前 MVP schedule 和 focused queue scope 文案。

### Verified

- 本地 RED：`npm test -- tests/unit/review-schedule.test.ts` 失败于缺少 `buildReviewScheduleSummary()`。
- 本地 GREEN：`npm test -- tests/unit/review-schedule.test.ts` 2 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 125 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 2 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/review` 返回 `307 Temporary Redirect` 到 `/login?next=%2Freview`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.43.0] - 2026-05-25

### Added

- **[Radar Verification Badge]** 完成 Sprint 43 AI Radar 可信度治理标记。
  - `src/server/knowledge/base.ts` 新增 `knowledgeEntityVerificationBadge()` 和 `knowledgeEntityVerificationTags()`。
  - `/radar` 实体详情显示 `verified` 或 `needs_verification`。
  - `/radar` 来源为空时显示 `needs_verification：该实体暂无可核验来源。`
  - Radar 复习卡片生成时写入验证状态 tag 和 `confidence:<level>` tag。
  - 扩展 `tests/unit/knowledge-base.test.ts`，覆盖无来源实体和卡片 tag 口径。

### Verified

- 本地 RED：`npm test -- tests/unit/knowledge-base.test.ts` 失败于缺少 `knowledgeEntityVerificationBadge()` 和 `knowledgeEntityVerificationTags()`。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 124 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 7 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：本地强制解析 `/radar?entity=swe-bench` 返回 `307 Temporary Redirect` 到 `/login?entity=swe-bench&next=%2Fradar`，符合登录保护边界。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.42.0] - 2026-05-25

### Added

- **[Progress Generation Health]** 完成 Sprint 42 `/progress` 生成稳定性指标。
  - `src/server/analytics/progress.ts` 新增 `summarizeGenerationHealth()`。
  - `/progress` 新增“生成稳定性”面板，展示 DeepSeek/fallback、fallback rate、daily_plan job success/error、repair rate、schemaVersion 分布和 model 分布。
  - `/progress` 读取当前用户正式 active DailyPlan 和 `daily_plan` AiGenerationJob，不跨用户聚合。
  - DeepSeek repair 成功时在 `AiGenerationJob.output.meta` 写入 `repaired` 和 `repairReason`。
  - 扩展 `tests/unit/progress-analytics.test.ts`，覆盖生成健康指标口径。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 失败于 `summarizeGenerationHealth is not a function`。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 122 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 7 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.41.0] - 2026-05-25

### Added

- **[Daily Loop Verifier]** 完成 Sprint 41 每日学习闭环一键验收。
  - 新增 `src/server/verification/daily-loop.ts`。
  - `runDailyLoopVerification()` 复用真实服务函数，串起今日计划、引导进度、测验提交、代码反馈、完成学习、复习评分和进度核心计数。
  - 新增 `tests/unit/daily-usability-loop.test.ts`，覆盖 `/today -> 学习 -> 提交测验 -> 提交代码 -> 完成 -> /review -> /progress` 的服务层数据闭环。
  - 新增 `scripts/verify-daily-loop.ts`。
  - `package.json` 新增 `npm run verify:daily-loop`。
  - verifier 默认使用唯一 `loop-verifier-*` userId，不污染 `demo-user`。
  - verifier 不执行用户提交代码，只保存文本并生成 AI/模板反馈。

### Verified

- 本地 RED：`npm test -- tests/unit/daily-usability-loop.test.ts` 失败于缺少 `@/server/verification/daily-loop`。
- 本地 GREEN：`npm test -- tests/unit/daily-usability-loop.test.ts` 1 项通过。
- 本地一键 verifier：`npm run verify:daily-loop` 通过，输出 `ok: true`，并验证 completed plan、QuizAttempt、CodeSubmission、CodeFeedback、due cards、ReviewLog 和 progress signals。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 121 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端 verifier、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 1 项通过。
- 生产：备用机 `npm run verify:daily-loop` 通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`，需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.40.0] - 2026-05-25

### Added

- **[Cron Retry]** 完成 Sprint 40 失败 daily cron 定向重试。
  - `src/server/cron/daily.ts` 新增 `retryFailedDailyCronJob()`。
  - retry 只接受当前用户自己的 `type="cron_daily_plan"` 且 `status="failed"` 的 `AiGenerationJob`。
  - retry 读取失败 job input 里的 `now`，复用原 localDate 语义。
  - retry 复用 `runDailyCronForUsers({ userIds: [userId] })`，继续使用既有幂等生成逻辑。
  - `src/app/admin/actions.ts` 新增 `retryFailedDailyCronJobAction()`。
  - `/admin` 最近 Daily Cron 失败记录新增“重试此用户 cron”按钮。
  - 扩展 `tests/unit/cron-daily.test.ts`，覆盖失败 job retry、成功 job 不可 retry、跨用户 job 不可 retry。

### Verified

- 本地 RED：`npm test -- tests/unit/cron-daily.test.ts` 失败于 `retryFailedDailyCronJob is not a function`。
- 本地 GREEN：`npm test -- tests/unit/cron-daily.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 120 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 7 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`，真实 `https://learn.roky.chat/api/health` 当前返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.39.0] - 2026-05-25

### Added

- **[Project Code Feedback Review Entry]** 完成 Sprint 39 项目代码反馈卡片复习入口。
  - `src/server/projects/code-feedback-summary.ts` 新增 `getProjectCodeFeedbackSubmissionIds()`、`buildProjectCodeFeedbackFlashcardWhere()` 和 `getProjectCodeFeedbackCardSummary()`。
  - 项目代码反馈卡片摘要按 `userId + projectId` scope 读取 `ProjectMilestone.codeSubmissionId`。
  - 摘要只统计当前项目 linked submission 的 `code-feedback:<submissionId>:` stable id 卡片。
  - `src/server/review/filter.ts` 新增 `REVIEW_SOURCES`，把 `code-feedback` 建模为可聚焦 review source。
  - `code-feedback` 不纳入 `STANDALONE_REVIEW_SOURCE_TAGS`，避免破坏默认 official lesson review 逻辑。
  - `src/server/review/queue.ts` 支持 `source=code-feedback&projectId=<id>` 的项目 linked submission focused queue。
  - `/review` 页面在 code feedback 模式展示“代码反馈复习”，统计区复用同一套 linked submission 条件。
  - `/projects` 项目详情新增代码反馈卡片总数、到期数和“去复习代码反馈卡片”入口。
  - 扩展 `tests/unit/projects.test.ts` 和 `tests/unit/review-filter.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 失败于缺少 `getProjectCodeFeedbackCardSummary()`、`code-feedback` source 未归一化、focused queue 返回 0。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 20 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 118 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 20 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`，真实 `https://learn.roky.chat/api/health` 当前返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.38.0] - 2026-05-25

### Added

- **[Project Code Feedback Summary]** 完成 Sprint 38 项目里程碑代码反馈摘要展示。
  - 新增 `src/server/projects/code-feedback-summary.ts`。
  - `getProjectMilestoneFeedbackSummaries()` 按 `userId + projectId` scope 读取当前项目 linked `CodeFeedback`。
  - 反馈摘要复用 `toCodeFeedbackView()`，包含 `overall`、summary、issues、hints 等结构化视图。
  - `/projects` 当前任务在 linked feedback 存在时展示代码反馈摘要和前两个 issues。
  - `/projects` 里程碑列表展示 linked feedback 的 `overall` 和 summary。
  - 扩展 `tests/unit/projects.test.ts`，覆盖当前用户反馈可见和其他用户反馈不泄露。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts` 失败于缺少 `@/server/projects/code-feedback-summary`。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts` 13 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 116 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 13 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`，真实 `https://learn.roky.chat/api/health` 当前返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.37.0] - 2026-05-25

### Added

- **[Project Code Feedback]** 完成 Sprint 37 Project milestone → CodeSubmission / AI feedback 链路。
  - `ProjectMilestone` 新增 `codeSubmissionId` 字段和索引。
  - 新增 `prisma/manual-migrations/20260525_project_milestone_code_submission.sql`。
  - `package.json` 新增 `db:migrate:manual:project-milestone-code-submission`。
  - 新增 `src/server/projects/code-submission.ts`。
  - `reviewProjectMilestoneCode()` 按 `userId + projectId + milestoneId` scope 读取 milestone。
  - 缺少 milestone、`lessonId` 或 code 时明确拒绝。
  - 项目 milestone 代码评审复用 `submitCodeForReview()`，生成并关联 `CodeSubmission`、`CodeFeedback`、Misconception 和 code feedback flashcards。
  - `/projects` 当前任务新增“保存并评审代码”按钮。
  - `/projects` 当前任务和 milestone 列表展示 linked feedback id。
  - 项目代码评审日期使用用户时区 localDate。
  - 扩展 `tests/unit/projects.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts` 失败于缺少 `@/server/projects/code-submission`。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/code-submit.test.ts` 13 项通过。
- 本地迁移：`npm run db:migrate:manual:project-milestone-code-submission` 通过。
- 本地 Prisma Client：`npm run prisma:generate` 通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 115 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、容器内 Prisma Client 生成、新增手动迁移、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 13 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 DNS 仍指向 `118.89.119.107`；主机在部署尝试中 SSH/HTTP/HTTPS 超时，未完成 migration/build/restart。
- 生产：真实 `https://learn.roky.chat/api/health` 当前返回 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.36.0] - 2026-05-25

### Added

- **[Project Review Filter]** 完成 Sprint 36 项目专属复习队列。
  - `src/server/review/filter.ts` 新增 `ReviewSource` 和 `normalizeReviewSource()`。
  - `buildReviewableFlashcardWhere()` 支持 standalone source focused query。
  - `source=project&projectId=<id>` 时只匹配当前用户 `project:<projectId>:` stable id 卡片。
  - `src/server/review/queue.ts` 的 `getDueFlashcards()` 支持 source/projectId。
  - `/review` 页面读取 Promise `searchParams` 并传入 focused queue。
  - `/review?source=project&projectId=<id>` 显示“项目卡片复习”。
  - `getProjectReviewCardSummary()` 的入口 URL 改为项目专属 review URL。
  - 扩展 `tests/unit/projects.test.ts` 和 `tests/unit/review-filter.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 失败 4 项，覆盖旧入口、旧队列和缺失 normalize 函数。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 15 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 113 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 15 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 `learn.roky.chat` 仍解析到 `118.89.119.107`，HTTPS 当前 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.35.0] - 2026-05-25

### Added

- **[Project Review Entry]** 完成 Sprint 35 Project Practice 完成态复习入口。
  - 新增 `src/server/projects/review-cards.ts`。
  - `getProjectReviewCardSummary()` 按 `userId + projectId` 统计项目复习卡片。
  - 摘要只统计当前用户 `project:<projectId>:` stable id 卡片。
  - 摘要返回项目卡片总数、当前到期数和 `/review` href。
  - `/projects` 完成项目 summary 区显示项目卡片数量和当前到期数。
  - `/projects` 完成项目 summary 区新增“去复习项目卡片”入口。
  - 扩展 `tests/unit/projects.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts` 初次失败于缺少 `@/server/projects/review-cards`。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts` 9 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 110 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 9 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 `learn.roky.chat` 仍解析到 `118.89.119.107`，HTTPS 当前 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.34.0] - 2026-05-25

### Added

- **[Project Completion Flashcards]** 完成 Sprint 34 Project Practice → Flashcards 服务层沉淀。
  - `src/server/projects/base.ts` 新增 `buildProjectCompletionFlashcards()`。
  - 项目完成后生成 stable standalone project review cards。
  - Project card 使用 `lessonId=null`、`type="project"`、tags 包含 `project` 和项目类型。
  - `src/server/projects/submit.ts` 新增 `completeLearningProject()`。
  - `completeLearningProject()` 按 `userId + projectId` scope 读取项目。
  - 未完成所有 milestones 的项目会被拒绝。
  - 跨用户 project id 会被拒绝。
  - 重复完成同一项目不重复创建卡片，并保留已有卡片 `dueAt` / `reviewCount`。
  - `/projects` milestone 完成路径和手动完成路径复用同一服务函数。
  - `/review` standalone source tags 新增 `project`。
  - 扩展 `tests/unit/projects.test.ts` 和 `tests/unit/review-filter.test.ts`。

### Verified

- 本地：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts` 11 项通过。
- 本地：`npm test -- tests/unit/projects.test.ts tests/unit/review-filter.test.ts tests/unit/progress-analytics.test.ts` 17 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 109 项通过。
- 本地：`npm run build` 通过。
- 生产：备用机 `118.25.15.72` 已完成代码备份、rsync 同步、远端目标测试、远端构建、应用容器重启和 health 验收。
- 生产：备用机远端目标测试 17 项通过。
- 生产：备用机 `npm run build` 通过。
- 生产：备用机 `http://127.0.0.1:3102/api/health` 和 Host-header `learn.roky.chat` health 返回 `ok`。
- 生产：本地强制解析 `learn.roky.chat:80:118.25.15.72` 返回 `HTTP/1.1 200 OK` 和 health JSON。
- 生产：真实 `learn.roky.chat` 仍解析到 `118.89.119.107`，HTTPS 当前 `SSL connection timeout`；需要 DNS A 记录切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.33.0] - 2026-05-25

### Added

- **[Voice Flashcards Service]** 完成 Sprint 33 Voice Note → Flashcards 服务层沉淀。
  - `src/server/voice/submit.ts` 新增 `generateVoiceNoteFlashcards()`。
  - `generateVoiceNoteFlashcards()` 按 `userId + voiceNoteId` 读取 VoiceNote。
  - 没有 linked ThoughtReview 的 VoiceNote 会被拒绝。
  - 生成卡片时自动添加 `voice-note` 标签。
  - 重复生成复用 stable ThoughtReview flashcard id/upsert，不重复创建。
  - 跨用户 VoiceNote id 会被拒绝。
  - `generateVoiceNoteFlashcardsAction()` 改为复用服务函数。
  - 扩展 `tests/unit/voice-submit.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `generateVoiceNoteFlashcards is not a function`。
- 本地：`npm test -- tests/unit/voice-submit.test.ts` 9 项通过。
- 本地：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/review-filter.test.ts` 24 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 106 项通过。
- 本地：`npm run build` 通过。
- 生产：主生产机 `118.89.119.107` 仍 SSH/HTTPS 超时。
- 生产：备用机 `118.25.15.72` 已完成代码同步、迁移、seed、远端目标测试、构建、应用容器启动和 HTTP Host-header health 验收。
- 生产：真实 `learn.roky.chat` 仍需 DNS A 记录从 `118.89.119.107` 切到 `118.25.15.72` 后补公网/HTTPS 验收。

## [0.32.0] - 2026-05-25

### Added

- **[Voice Coach Service]** 完成 Sprint 32 Voice Note → Coach 服务层沉淀。
  - `src/server/voice/submit.ts` 新增 `sendVoiceNoteToCoach()`。
  - `sendVoiceNoteToCoach()` 按 `userId + voiceNoteId` 读取 VoiceNote。
  - 首次发送会创建 ThoughtReview 并写回 `VoiceNote.thoughtReviewId`。
  - 重复发送会返回同一条 linked ThoughtReview，不重复创建。
  - 跨用户 VoiceNote id 会被拒绝。
  - `sendVoiceNoteToCoachAction()` 改为复用服务函数。
  - 扩展 `tests/unit/voice-submit.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `sendVoiceNoteToCoach is not a function`。
- 本地：`npm test -- tests/unit/voice-submit.test.ts` 6 项通过。
- 本地：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts` 18 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 103 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.31.0] - 2026-05-25

### Added

- **[Voice Note Service]** 完成 Sprint 31 Voice Note → Note 服务层沉淀。
  - `src/server/voice/submit.ts` 新增 `saveVoiceNoteAsNote()`。
  - `saveVoiceNoteAsNote()` 按 `userId + voiceNoteId` 读取 VoiceNote。
  - 首次保存会创建 Note 并写回 `VoiceNote.noteId`。
  - 重复保存会更新同一条 linked Note，不重复创建。
  - 跨用户 VoiceNote id 会被拒绝。
  - `saveVoiceNoteAsNoteAction()` 改为复用服务函数。
  - 扩展 `tests/unit/voice-submit.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-submit.test.ts` 初次失败于 `saveVoiceNoteAsNote is not a function`。
- 本地：`npm test -- tests/unit/voice-submit.test.ts` 4 项通过。
- 本地：`npm test -- tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 101 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.30.0] - 2026-05-25

### Added

- **[Library Notes Detail]** 完成 Sprint 30 课程库详情关联笔记展示。
  - 新增 `src/server/library/lesson-detail.ts`。
  - `getLessonDetailNotes()` 按 `userId + lessonId` 读取课程笔记。
  - `resolveVisibleLibraryLessonId()` 限定 `/library` 详情只能打开当前筛选结果里可见的课程。
  - `/library` 课程详情新增“关联笔记”区域，展示笔记摘要和“写笔记”入口。
  - 新增 `tests/unit/library-lesson-detail.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/library-lesson-detail.test.ts` 初次失败于缺少 `@/server/library/lesson-detail`。
- 本地 RED：`npm test -- tests/unit/library-lesson-detail.test.ts` 第二次失败于 `resolveVisibleLibraryLessonId is not a function`。
- 本地：`npm test -- tests/unit/library-lesson-detail.test.ts` 2 项通过。
- 本地：`npm test -- tests/unit/library-lesson-detail.test.ts tests/unit/library-plan-filter.test.ts` 5 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 99 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.29.0] - 2026-05-25

### Added

- **[Review Rating Idempotency]** 完成 Sprint 29 复习评分幂等保护。
  - `src/server/review/actions.ts` 新增 `rateFlashcard()` 服务函数。
  - `rateFlashcard()` 只允许仍然 `dueAt <= now` 的当前用户卡片被评分。
  - 重复评分已经移出 due 队列的卡片会返回 `not_due`，不重复写 `ReviewLog`。
  - 重复评分不会重复增加 `reviewCount` 或 `correctCount`。
  - `rateFlashcardAction()` 改为复用服务函数，并继续刷新 `/review` 和 `/progress`。
  - 新增 `tests/unit/review-rating.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/review-rating.test.ts` 初次失败于 `rateFlashcard is not a function`。
- 本地：`npm test -- tests/unit/review-rating.test.ts` 1 项通过。
- 本地：`npm test -- tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts tests/unit/review-filter.test.ts` 5 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 97 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.28.0] - 2026-05-25

### Added

- **[Admin Single Plan Archive]** 完成 Sprint 28 管理端单计划归档治理动作。
  - `src/server/admin/plan-governance.ts` 新增 `markPlanArchived()`。
  - `markPlanArchived()` 只按当前 `userId + planId` 归档，不删除历史数据。
  - 单计划归档写入 `AiGenerationJob(type="admin_plan_archive")`。
  - `/admin` 最近 DailyPlan 列表新增“归档”按钮，已归档计划禁用。
  - 扩展 `tests/unit/admin-plan-governance.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于 `markPlanArchived is not a function`。
- 本地：`npm test -- tests/unit/admin-plan-governance.test.ts` 6 项通过。
- 本地：`npm test -- tests/unit/admin-plan-governance.test.ts tests/unit/library-plan-filter.test.ts tests/unit/daily-plan-idempotency.test.ts` 13 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 96 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.27.0] - 2026-05-25

### Added

- **[Library Governance Filters]** 完成 Sprint 27 课程库数据治理筛选。
  - 新增 `src/server/library/plan-filter.ts`，集中处理 `/library` 查询参数、DailyPlan where 和链接参数保留。
  - `/library` 默认继续隐藏 test 和 archived plan。
  - `/library` 新增 `source`、`schemaVersion`、`status`、`localDate` 筛选。
  - `/library` 课程链接会保留当前筛选上下文。
  - 新增 `tests/unit/library-plan-filter.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/library-plan-filter.test.ts` 初次失败于缺少 `@/server/library/plan-filter`。
- 本地：`npm test -- tests/unit/library-plan-filter.test.ts` 3 项通过。
- 本地：`npm test -- tests/unit/library-plan-filter.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/daily-plan-idempotency.test.ts` 11 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 94 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.26.0] - 2026-05-25

### Added

- **[Today Signal Snapshot]** 完成 Sprint 26 今日页 Planner 信号快照摘要。
  - `src/server/curriculum/signal-snapshot.ts` 新增 `buildTodayCurriculumSignalInsight()`。
  - `/today` 的“为什么今天学这个”现在读取 `CurriculumDecisionLog.inputSnapshot`。
  - `/today` 展示 `Planner 信号快照`，包含最近学习和活跃补弱信号。
  - 普通学习页只显示摘要，不暴露原始 planner JSON。
  - 扩展 `tests/unit/curriculum-signal-snapshot.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 初次失败于 `buildTodayCurriculumSignalInsight is not a function`。
- 本地：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 3 项通过。
- 本地：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts tests/unit/curriculum-explanation.test.ts tests/unit/daily-plan-idempotency.test.ts` 10 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 91 项通过。
- 本地：`npm run build` 通过。
- 生产：远端门禁待 `118.89.119.107` 恢复 SSH/HTTP 后补。

## [0.25.0] - 2026-05-25

### Added

- **[Admin Signal Snapshot]** 完成 Sprint 25 管理端 Planner 信号快照摘要。
  - 新增 `src/server/curriculum/signal-snapshot.ts`，从 `CurriculumDecisionLog.inputSnapshot` 提取 `signalSnapshot`。
  - 新增管理端摘要项：活跃误区、错题压力、到期复习、困难复习、地图薄弱、代码练习、完成覆盖。
  - `/admin` 最近 CurriculumDecision 卡片现在展示 `Planner signal snapshot`。
  - `/admin` 的折叠区继续保留 `reason`、`scoreBreakdown` 和 `inputSnapshot` 原始 JSON。
  - 新增 `tests/unit/curriculum-signal-snapshot.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 初次失败于缺少 `@/server/curriculum/signal-snapshot`。
- 本地：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts` 2 项通过。
- 本地：`npm test -- tests/unit/curriculum-signal-snapshot.test.ts tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts` 8 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 90 项通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint25-20260525-001247.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：远端门禁暂未完成；`118.89.119.107` TCP 22/80/443 可连接，但 SSH 卡在 banner exchange，HTTP/HTTPS 不返回内容，从 `118.25.15.72` 旁路复核结果一致。

## [0.24.0] - 2026-05-24

### Added

- **[Planner Signal Snapshot]** 完成 Sprint 24 Planner 信号快照。
  - `CurriculumDecision` 新增 `signalSnapshot`，保存最近学习、完成数、到期卡、hard review、错题、活跃误区、知识地图弱点和近 7 天代码提交数。
  - `scoreTopicCandidates()` 为每个候选决策返回完整 signal snapshot。
  - `selectNextTopic()` fallback decision 返回同结构空 snapshot。
  - `CurriculumDecisionLog.inputSnapshot.decision` 会自然持久化 signal snapshot。
  - `buildDailyPlanMessages()` 现在显式把 `Planner signal snapshot` 写入 DeepSeek prompt。
  - `generate-daily-plan.ts` 移除 prompt helper 的顶层 env/db/deepseek 运行时耦合，真实调用路径按需动态导入。

### Verified

- 本地 RED：`npm test -- tests/unit/daily-generation-prompt.test.ts` 初次失败于导入 prompt helper 触发 `DATABASE_URL` / `CRON_SECRET` env 校验。
- 本地：`npm test -- tests/unit/daily-generation-prompt.test.ts` 1 项通过。
- 本地：`npm test -- tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/daily-generation-prompt.test.ts` 7 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 88 项通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint24-20260524-235753.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/daily-generation-prompt.test.ts tests/unit/curriculum-select-next-topic.test.ts tests/unit/daily-plan-idempotency.test.ts` 7 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/today`、`/admin`、`/progress`、`/map` 关键内容均可见。

## [0.23.0] - 2026-05-24

### Added

- **[Planner Misconception Signal]** 完成 Sprint 23 Planner 活跃误区选题信号。
  - `scoreTopicCandidates()` 新增 `activeMisconceptionCountByDomain` 输入，并输出 `misconceptionScore`。
  - `selectNextTopic()` 现在读取当前用户 open/active `Misconception`，通过 `topicId` 或 `lessonId` 映射到 domain。
  - `combinedWeaknessScore` 现在会合并复习/测验、知识地图和活跃误区三类弱点信号。
  - `explainCurriculumDecision()` 新增“活跃误区”信号，`/today` 可以解释错题、代码反馈或 Coach 误区为什么影响今天选题。
  - 新增 `tests/unit/curriculum-select-next-topic.test.ts`，并扩展 curriculum scoring/explanation 测试。

### Verified

- 本地 RED：`npm test -- tests/unit/curriculum-scoring.test.ts` 初次失败于 active misconception 不影响排序。
- 本地 RED：`npm test -- tests/unit/curriculum-select-next-topic.test.ts` 初次失败，`selectNextTopic()` 未从 DB 读取 open Misconception。
- 本地 RED：`npm test -- tests/unit/curriculum-explanation.test.ts` 初次失败于缺少 `misconception` active signal。
- 本地：`npm test -- tests/unit/curriculum-explanation.test.ts tests/unit/curriculum-scoring.test.ts tests/unit/curriculum-select-next-topic.test.ts` 8 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 85 项通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint23-20260524-233627.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/curriculum-explanation.test.ts tests/unit/curriculum-scoring.test.ts tests/unit/curriculum-select-next-topic.test.ts` 8 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/today`、`/progress`、`/map` 关键内容均可见。

## [0.22.0] - 2026-05-24

### Added

- **[Coach Misconceptions]** 完成 Sprint 22 Coach 高危误区沉淀。
  - `createThoughtReview()` 现在会把关联课程 ThoughtReview 中 high severity `possibleIssues` 自动写入 `Misconception(source="coach")`。
  - Coach 误区使用 `coach:{reviewId}:{issueIndex}` 作为 stable sourceKey，通过 upsert 防止重复创建。
  - Coach 误区记录会携带 `lessonId`、`topicId`、`localDate`、`prompt`、`userAnswer` 和解释。
  - `UserTopicState` 会随 Coach 高危误区增加 exposure 与 weakness，进入后续 `/progress`、`/map` 和生成上下文信号。
  - 新增 `tests/unit/coach-submit.test.ts` 覆盖 Coach high severity issue 自动沉淀。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-submit.test.ts` 初次失败于 `assert.ok(misconception)`。
- 本地：`npm test -- tests/unit/coach-submit.test.ts` 3 项通过。
- 本地：`npm test -- tests/unit/coach-submit.test.ts tests/unit/coach-context.test.ts tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts` 13 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 82 项通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint22-20260524-231729.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/coach-submit.test.ts` 3 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/coach`、`/progress`、`/map` 关键内容均可见。

## [0.21.0] - 2026-05-24

### Added

- **[Admin Plan Filters]** 完成 Sprint 21 管理端计划过滤与激活历史。
  - `markPlanActive()` 现在会写入 `AiGenerationJob(type="admin_plan_activation")` 作为审计事件。
  - 新增 `normalizeAdminPlanFilter()` 和 `buildAdminPlanFilterWhere()`，集中管理 `active/test/archived/all` 过滤规则。
  - `/admin` 最近 DailyPlan 列表新增 `active/test/archived/all` 切换。
  - `/admin` 计划卡片展示 `Activation history`。
  - 新增 `tests/unit/admin-plan-governance.test.ts` 覆盖激活审计与过滤规则。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于缺少 `admin_plan_activation` 审计事件。
- 本地：`npm test -- tests/unit/admin-plan-governance.test.ts` 4 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 81 项通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint21-20260524-090357.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/admin-plan-governance.test.ts` 4 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/admin` 未授权只显示 `Admin Login`；授权访问 `/admin?planFilter=active|test|archived|all` 均可见 `最近 DailyPlan`、`当前过滤：`、当前 filter 和 `Activation history` 或空列表状态。

## [0.20.0] - 2026-05-24

### Added

- **[Admin Plan Governance]** 完成 Sprint 20 管理端计划激活。
  - 新增 `src/server/admin/plan-governance.ts`，提供 `markPlanActive()` 服务层。
  - 新增 `markPlanActiveAction()`，保持 `requireAdmin()` 鉴权后才允许操作。
  - `/admin` 最近 DailyPlan 列表新增“设为 active”按钮。
  - 选中计划会变为 `isTest=false`、`archivedAt=null`、`source=admin`，并更新 `selectionReason`。
  - 同一 user/localDate 的旧正式 active plan 会被归档，保持同日只有一个正式 active plan。
  - 新增 `tests/unit/admin-plan-governance.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于缺少 `@/server/admin/plan-governance`。
- 本地：`npm test -- tests/unit/admin-plan-governance.test.ts` 2 项通过。
- 本地：`npm test -- tests/unit/admin-plan-governance.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/cron-daily.test.ts` 10 项通过。
- 本地：`npm test` 79 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint20-20260524-084009.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/admin-plan-governance.test.ts` 2 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/admin` 未授权只显示 `Admin Login`，授权后可见 `最近 DailyPlan`、`设为 active`、`归档所有 test 计划`、`归档未来 planned 计划`。

## [0.19.0] - 2026-05-24

### Added

- **[Knowledge Preferences]** 完成 Sprint 19 每日知识偏好与短期去重。
  - `UserProfile` 新增 `preferredTermSlugs`、`preferredEntitySlugs`、`knowledgeAvoidDays`。
  - 新增幂等迁移 `prisma/manual-migrations/20260524_knowledge_preferences.sql`。
  - 新增 `src/server/profile/settings.ts`，集中保存设置并规范化知识偏好 slug。
  - `/settings` 增加每日术语偏好、每日 Radar 偏好、知识卡去重天数。
  - `selectDailyKnowledgeFocus()` 会读取最近 DailyPlan 的 `Lesson.connections.glossary/breadth.sourceSlug`，避开最近 N 天已使用知识项。
  - `getOrCreateTodayPlan()` 将用户知识偏好和去重天数传入每日知识选择。
  - 新增 `tests/unit/settings-profile.test.ts`，并扩展 `tests/unit/daily-breadth.test.ts` 覆盖最近知识去重。

### Verified

- 本地 RED：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts` 初次失败于未避开最近使用 slug、缺少 `@/server/profile/settings`。
- 本地：`npm run db:migrate:manual:knowledge-preferences` 通过。
- 本地：`npx prisma generate` 通过。
- 本地：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts` 7 项通过。
- 本地：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/knowledge-base.test.ts` 15 项通过。
- 本地：`npm test` 77 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint19-20260524-082430.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npm run db:migrate:manual:knowledge-preferences` 通过。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/settings-profile.test.ts` 7 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Prisma 只读确认 `preferredTermSlugs`、`preferredEntitySlugs`、`knowledgeAvoidDays` 字段可读。
- 生产：Host-header 验证 `/settings` 可见 `每日术语偏好`、`每日 Radar 偏好`、`知识卡去重天数`。
- 生产：Host-header 验证 `/today` 仍可见 `今日术语`、`今日广度`、`查看术语库`、`查看 Radar`。

## [0.18.0] - 2026-05-24

### Added

- **[Daily Breadth Rotation]** 完成 Sprint 18 每日广度轮转。
  - 新增 `src/server/knowledge/daily-breadth.ts`，按本地日期星期轮转选择 term、person、company/lab、benchmark、paper、tool/open_source_project、review。
  - `getOrCreateTodayPlan()` 现在会选择真实 `GlossaryTerm` 和 `KnowledgeEntity`，并覆盖今日术语卡与今日广度小卡。
  - `Lesson.connections` 增加 `knowledgeFocus.rotation`、`knowledgeFocus.links`，并在 glossary/breadth 卡中保存 `sourceSlug`、`sourceUrl`、`externalSourceUrl`。
  - 修复术语 concept fallback 被误判成 Radar 链接的边界，避免没有实体时生成错误 `/radar?entity=...`。
  - 新增 `tests/unit/daily-breadth.test.ts`，覆盖轮转规则、真实知识记录选择、卡片覆盖和 DailyPlan 写入。

### Verified

- 本地 RED：`npm test -- tests/unit/daily-breadth.test.ts` 初次失败于缺少 `@/server/knowledge/daily-breadth`。
- 本地测试库补齐既有手工迁移：`npm run db:migrate:manual:glossary-radar` 通过。
- 本地：`npm test -- tests/unit/daily-breadth.test.ts` 4 项通过。
- 本地：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/daily-plan-idempotency.test.ts tests/unit/knowledge-base.test.ts` 12 项通过。
- 本地：`npm test` 74 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint18-20260524-080809.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm run db:migrate:manual:glossary-radar` 通过。
- 生产：`npm test -- tests/unit/daily-breadth.test.ts` 4 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/today` 可见 `今日术语`、`今日广度`、`查看术语库`、`查看 Radar` 和 `SWE-bench`。
- 生产：Host-header 验证 `/glossary` 和 `/radar` 可见 `术语库`、`AI Radar` 和 `SWE-bench`。

## [0.17.0] - 2026-05-24

### Added

- **[Voice Note]** 完成 Sprint 17 服务端音频上传与转写路径。
  - 新增 `src/server/voice/transcription.ts`，支持音频文件校验、20MB 上传限制、文件类型白名单和 OpenAI transcription 适配。
  - 新增 `src/server/voice/submit.ts`，集中处理 VoiceNote 保存、手动 transcript、服务端转写结果和 lesson 归属校验。
  - `/voice` 保存 action 改为复用服务层，Server Action 继续只负责 `requireUserId()`、读取 FormData、revalidate 和 redirect。
  - `VoiceCapture` 的文件输入现在以 `audioFile` 提交到服务端用于临时转写；仍不长期保存音频文件。
  - 新增可选服务端环境变量 `OPENAI_API_KEY`、`OPENAI_TRANSCRIBE_MODEL`；密钥不进入前端。
  - 无转写 key、测试环境、转写失败或空文本时，显式回退为手动 transcript，不假装自动转写成功。
  - 新增 `tests/unit/voice-transcription.test.ts` 和 `tests/unit/voice-submit.test.ts`。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts` 初次失败于缺少 `@/server/voice/transcription` 和 `@/server/voice/submit`。
- 本地：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts` 8 项通过。
- 本地：`npm test` 70 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint17-20260524-074933.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts` 8 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/voice` 可见 `临时发送到服务端转写`、`如果服务端没有转写密钥`、`保存 Voice Note`、`发送到 Coach`、`生成 Flashcards`。
- 生产：`OPENAI_API_KEY=false`，当前自动转写 provider 未配置，按设计走手动 transcript fallback。

## [0.16.0] - 2026-05-24

### Added

- **[Thought Review Coach]** 完成 Sprint 16 Coach 集成稳定化。
  - 新增 `src/server/coach/submit.ts`，把 ThoughtReview 创建、AI/fallback 生成、卡片生成和幂等 upsert 从页面 action 中抽到可测试服务层。
  - `buildCoachContext()` 增加代码反馈、开放错题、课程 glossary/breadth 和独立知识复习卡摘要，让 Coach 评审更贴近用户最近学习状态。
  - `/coach` Server Action 改为复用服务层，保留 `requireUserId()` 鉴权、页面 revalidate 和 redirect。
  - `/voice` 发送到 Coach 与生成卡片也复用同一服务层，避免语音入口和文本入口行为分叉。
  - ThoughtReview 生成的 Flashcard 使用稳定 `thought:{reviewId}:{index}` ID，并通过 upsert 防止重复生成。
  - 新增 `tests/unit/coach-context.test.ts` 和 `tests/unit/coach-submit.test.ts`，覆盖上下文摘要、评审保存、卡片幂等。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts` 初次失败于缺少 `@/server/coach/submit`，且 Coach context 缺少 `recentCodeFeedback`、`recentKnowledge`、`standaloneReviewCards`。
- 本地：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts` 9 项通过。
- 本地：`npm test` 65 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint16-20260524-073404.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts` 9 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：Host-header 验证 `/coach` 可见 `提交思路`、`Coach 反馈`、`生成复习卡片`、`最近评审`。
- 生产：Host-header 验证 `/voice` 可见 `发送到 Coach`、`生成 Flashcards`、`查看 Coach`。
- 生产：Host-header 验证 `/library` 可见 `Coach 思路评审` 与 `代码提交与反馈`。
- 生产：Host-header 验证 `/progress` 可见 `最近思路评审` 与 `思路评审`。
- 生产：只读计数显示 `ThoughtReview=4`、`ThoughtReviewCards=3`、`VoiceNotesLinkedToCoach=1`。

## [0.15.0] - 2026-05-24

### Added

- **[Code Feedback]** 增加 Sprint 15 结构化代码反馈与代码错因沉淀。
  - 新增 `src/server/ai/code-feedback.ts` 结构化 `CodeReviewSchema`，包含 `overall`、`issues`、`hints`、`suggestedTests`、`flashcards` 和 `nextSteps`。
  - 新增 `src/server/coding/submit.ts`，集中保存 `CodeSubmission`、生成代码反馈、写入 `CodeFeedback`、沉淀 code-source `Misconception` 并生成 `code_bug` Flashcard。
  - 新增 `src/server/coding/view.ts`，统一兼容旧字符串 issues 与新对象 issues 的页面视图解析。
  - `CodeSubmission` 增加 `status`、`aiFeedback`、`feedbackJson` 摘要字段；`CodeFeedback` 增加结构化反馈字段。
  - `Misconception` 支持 `sourceKey` 和 `codeSubmissionId`，代码严重问题可进入进度、地图和后续 planner 弱点信号。
  - `/today` 展示结构化代码反馈、提示、建议测试和已生成复习卡。
  - `/library` 显示每课代码提交与反馈摘要。
  - `/progress` 最近代码反馈支持展示 `overall` 与结构化 issue message。

### Verified

- 本地 RED：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 初次失败于缺少 `@/server/coding/submit`。
- 本地 RED：旧 `src/server/ai/code-feedback.ts` 顶层导入 `env`，导致仅测试 fallback 也要求 `DATABASE_URL`/`CRON_SECRET`。
- 本地 RED：结构化字段实现后，目标测试失败于本地数据库缺少 `CodeSubmission.status`。
- 本地迁移：`npm run db:migrate:manual:code-feedback-structured` 通过。
- 本地：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 3 项通过。
- 本地：`npm test` 62 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint15-20260524-071231.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm run db:migrate:manual:code-feedback-structured` 通过。
- 生产：`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts` 3 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/today` 可见 `仅保存，不执行`、`保存提交`、`代码反馈`、`overall`。
- 生产：通过 Host-header 验证 `/library` 可见 `代码提交与反馈`。
- 生产：通过 Host-header 验证 `/progress` 可见 `最近代码反馈` 与 `代码提交率`。
- 生产：Prisma 只读结构检查确认新增结构化反馈字段存在，并显示 `CodeFeedbackWithOverall=1`、`CodeMisconception=1`、`CodeBugCards=1`。

## [0.14.0] - 2026-05-24

### Added

- **[Quiz Feedback]** 增加 Sprint 14 错题复习卡沉淀。
  - 新增 `src/server/quiz/error-card.ts`，为答错 quiz 构造稳定 ID 的 `quiz_error` Flashcard。
  - 新增 `src/server/quiz/submit.ts`，把 quiz 判分、QuizAttempt、Misconception、错题卡和 UserTopicState 写入集中到可测试服务层。
  - `submitQuizAttemptAction` 保持 Server Action 鉴权和页面 revalidate，答案解析改为服务端按数据库中的 `QuizQuestion.type` 处理，不信任前端隐藏字段。
  - 答错同一道题会 upsert 同一张 `quiz-error:{userId}:{questionId}` 卡片，不重复创建。
  - 答对后会把 open Misconception 标记为 resolved，错题卡历史保留在复习系统中。
  - true/false 题未选择时不再被当作 `false` 正确答案。

### Verified

- 本地 RED：`npm test -- tests/unit/quiz-error-card.test.ts` 初次失败于缺少 `@/server/quiz/error-card`。
- 本地：`npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts` 5 项通过。
- 本地：`npm test` 59 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint14-20260524-064506.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/quiz-error-card.test.ts tests/unit/quiz-submit.test.ts` 5 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/today` 可见 `今日小测验`、`required`、`提交答案`。
- 生产：通过 Host-header 验证 `/review` 可见 `显示答案`。
- 生产：通过 Host-header 验证 `/progress` 可见 `学习效果` 与 `测验`。

## [0.13.0] - 2026-05-24

### Added

- **[Curriculum Planner]** 增加 Sprint 13 选题解释体验。
  - 新增 `src/server/curriculum/explain-decision.ts`，将 `CurriculumDecisionLog.scoreBreakdown` 转成用户可读解释。
  - `/today` 右侧新增“为什么今天学这个”，展示 selectedDomain、selectedTopic、主理由、活跃信号和最近重复惩罚提示。
  - `/admin` 的最近 `CurriculumDecisionLog` 改为摘要优先，展示主要规划信号；原始 `reason` 和 `scoreBreakdown` 继续折叠查看。
  - 新增 `tests/unit/curriculum-explanation.test.ts`，覆盖高优先级信号和 fallback/penalty 情况。

### Verified

- 本地 RED：`npm test -- tests/unit/curriculum-explanation.test.ts` 初次失败于缺少 `explain-decision` 服务。
- 本地：`npm test -- tests/unit/curriculum-explanation.test.ts` 2 项通过。
- 本地：`npm test` 54 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint13-20260524-062249.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci` 完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- 生产：`npx prisma generate` 通过。
- 生产：`npm test -- tests/unit/curriculum-explanation.test.ts` 2 项通过。
- 生产：`npm run build` 通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/today` 可见“为什么今天学这个”。
- 生产：通过临时 admin cookie 的 Host-header 验证 `/admin` 返回 200，并可见“最近 CurriculumDecision”、“查看 reason / scoreBreakdown”和“今天选择”。

## [0.12.0] - 2026-05-24

### Added

- **[Curriculum Planner]** 增加 Sprint 12 知识地图弱点补弱信号。
  - `CurriculumScoringInput` 新增 `mapWeaknessByDomain`。
  - `scoreTopicCandidates()` 将 map weakness 纳入评分，并在 `scoreBreakdown` 暴露 `mapWeaknessScore` 与 `combinedWeaknessScore`。
  - `selectNextTopic()` 从正式学习数据构造领域级 map weakness：覆盖不足、到期卡片、hard/forgot 复习、错题共同形成 0-1 补弱信号。
  - 保留最近 7 天 topic 去重优先级，map weakness 不会让刚学过的同一 topic 立即重复。

### Verified

- 本地：`npm test -- tests/unit/curriculum-scoring.test.ts` 3 项通过。
- 本地：`npm test` 52 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint12-20260524-060502.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm test -- tests/unit/curriculum-scoring.test.ts`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。

## [0.11.0] - 2026-05-24

### Added

- **[Knowledge Map]** 增加 Sprint 11 真实知识地图指标。
  - 新增 `src/server/map/analytics.ts`，集中计算领域和主题的知识地图统计。
  - 新增 `tests/unit/map-analytics.test.ts`，覆盖 masteryScore 公式、0-100 截断和多信号聚合。
  - `/map` 的 masteryScore 改为长期文档公式：
    - 完成课程 * 10
    - ReviewLog * 2
    - 正确测验 * 3
    - 代码提交 * 3
    - 到期卡片 * -1
    - 活跃错题 * -5
  - `/map` 领域列表和主题列表增加测验正确率、代码提交、活跃错题、到期卡片等真实指标。
  - `/map` 领域详情增加 ReviewLog、测验、代码提交、错题、相关卡片、相关错题和相关笔记。
  - `/map` badge 更新为 `Sprint 11`。

### Verified

- 本地：`npm test -- tests/unit/map-analytics.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 50 项通过。
- 本地：`npm run build` 通过，路由表包含 `/map`。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint11-20260524-055051.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：通过 Host-header 验证 `/map` 可见 `Sprint 11`、`ReviewLog`、`正确率`、`代码提交`、`相关错题`、`相关卡片`。
- 生产：通过 Host-header 验证 `/map` 不再包含旧公式 `完成课程 * 10 + 已复习卡 * 2 - 到期卡`。

## [0.10.0] - 2026-05-24

### Added

- **[Guided Progress]** 增加 Sprint 10 引导式学习进度持久化。
  - 新增 `DailyPlan.guidedProgress` JSON 字段，用于保存 `/today` 当前步骤、每步回答和同步时间。
  - 新增 `src/server/lesson/guided-progress.ts`，集中处理进度规范化、读取恢复和 owner scoped save。
  - 新增 `/today` 的 `saveGuidedProgressAction`，Server Action 内校验当前用户并写入目标 DailyPlan。
  - `/today` 的 `GuidedSteps` 支持刷新后恢复 active step 和 answers，并提供“保存进度”按钮。
  - 清理 `/today` 的“刷新会丢失”旧文案，并将页面 badge 更新为 `Sprint 10`。
  - 新增 `20260524_guided_progress.sql` 手动迁移与 `db:migrate:manual:guided-progress` 脚本。

### Verified

- 本地：`npm test -- tests/unit/guided-progress.test.ts` 3 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 47 项通过。
- 本地：`npm run build` 通过，路由表包含 `/today`。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint10-20260524-052356.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:guided-progress`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：只读 DB 检查确认 `DailyPlan.guidedProgress` 字段存在。
- 生产：通过 Host-header 验证 `/today` 可见 `Sprint 10`、`保存进度`、`已同步`，且不再包含“刷新会丢失”旧文案。
- 说明：当前 Codex 运行环境直接访问 `https://learn.roky.chat` 超时；生产机本机 Nginx/Next Host-header 路径已验证通过。

## [0.9.0] - 2026-05-24

### Added

- **[Learning Analytics]** 增加 Sprint 9 质量评估与学习效果分析。
  - 新增 `src/server/analytics/progress.ts`，集中计算学习分析指标。
  - 新增 `tests/unit/progress-analytics.test.ts`，覆盖内容质量、学习效果、学习日历、代码趋势和知识覆盖。
  - 新增 `/progress` Sprint 9 面板：学习日历、内容质量、学习效果、代码练习趋势、知识覆盖。
  - 内容质量指标包括 contentLength、guidedStepCount、quizCount、codingExerciseQuality、flashcardCount、schemaVersion、source、fallbackUsed。
  - 学习效果指标包括 quizAccuracy、reviewRetention、codeSubmissionRate、misconceptionResolutionRate、streak、domainCoverage、topicDiversity。

### Verified

- 本地：`npm test -- tests/unit/progress-analytics.test.ts` 6 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过，路由表包含 `/progress`。
- 本地：`npm test` 44 项通过。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint9-20260524-050521.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：`/progress` 返回 200，并可见 `Sprint 9`、`学习日历`、`内容质量`、`学习效果`、`代码练习趋势`、`知识覆盖`。

## [0.8.0] - 2026-05-24

### Added

- **[Cron]** 增加 Sprint 8 Daily Cron 基线。
  - 新增 `/api/cron/daily`，由 `CRON_SECRET` 保护。
  - 支持 `Authorization: Bearer <secret>` 和 `?secret=...` 两种临时 MVP 调用方式。
  - 新增 `runDailyCronForUsers()` 服务层，按 `UserProfile.timeZone` 计算 `localDate`。
  - 复用 `getOrCreateTodayPlan()`，同一用户同一 localDate 不重复生成 DailyPlan。
  - 每个用户的 cron 结果写入 `AiGenerationJob(type="cron_daily_plan")`。
  - `/admin` 增加“运行 daily cron”按钮，并展示最近 Daily Cron 记录。

### Verified

- 本地：`npm test -- tests/unit/cron-daily.test.ts` 5 项通过。
- 本地：`npm test -- tests/unit/cron-daily.test.ts tests/unit/auth-policy.test.ts` 10 项通过。
- 本地：`npm test` 38 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过，路由表包含 `/api/cron/daily`。
- 生产：备份已创建 `/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint8-20260524-044552.tar.gz`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：补齐 `CRON_SECRET`，并验证 `CRON_SECRET`、`ADMIN_SECRET`、`DEEPSEEK_API_KEY`、`ALLOW_DEMO_USER` 均已注入。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：无 secret 调用 `/api/cron/daily` 返回 401。
- 生产：带 secret 连续调用 `/api/cron/daily` 均成功，并复用相同 `planId`。
- 生产：只读 DB 检查确认 `2026-05-24` 每个用户 active official DailyPlan 计数均为 1。
- 生产：`/admin` 可见“运行 daily cron”和 Daily Cron 记录区。

## [0.7.0] - 2026-05-24

### Added

- **[Auth]** 上线 Sprint 7 鉴权与多用户基线。
  - 新增 `src/server/auth/policy.ts`，统一学习数据路由保护策略。
  - 保护 `/`、`/today`、`/review`、`/map`、`/library`、`/notes`、`/progress`、`/settings`、`/projects`、`/coach`、`/voice`、`/glossary`、`/radar` 和非 health API。
  - 将 `demo-user` 从隐式 fallback 改成显式 Demo Session。
  - 新增 `ALLOW_DEMO_USER` 服务端环境变量：生产环境只有显式开启才允许 Demo 模式。
  - 登录页增加“进入 Demo 模式”按钮；Demo 模式写入 httpOnly `ral_demo` cookie。
  - 保留 Supabase Magic Link 登录路径。

### Verified

- 本地：`npm test` 33 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`ALLOW_DEMO_USER=true` 已显式写入 systemd 环境文件。
- 生产：`npm ci`、`npx prisma generate`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：未登录访问 `/today` 和 `/api/me` 均 307 跳转到 `/login?next=...`。
- 生产：登录页显示“进入 Demo 模式”；Playwright 点击后成功进入 `/today`。

## [0.6.0] - 2026-05-24

### Added

- **[Project Practice]** 上线 Sprint 6 项目实践与算法代码长期训练 MVP。
  - 新增 `/projects` 项目实践页面。
  - 支持 Python 基础、数据结构、算法、AI 工程、RAG、Agent、数据分析、论文复现 8 类项目模板。
  - 支持从模板开始用户项目，并自动生成 milestones。
  - 支持保存 milestone 草稿，填写代码产物、笔记、反思并完成 milestone。
  - 支持所有 milestones 完成后生成项目总结。
  - 新增 `LearningProject` 与 `ProjectMilestone` Prisma 模型。
  - 新增 `20260524_learning_projects.sql` 手动迁移与 `db:migrate:manual:learning-projects` 脚本。
  - `/progress` 增加项目实践统计和最近项目列表。

### Verified

- 本地：`npm test` 28 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过，路由表包含 `/projects`。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:learning-projects`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`，内网 `/api/health` 返回 `ok`。
- 生产：`/projects` 显示 Sprint 6 项目模板与“开始项目”。
- 生产：Playwright 创建 `单词频率统计器`，完成 3 个 milestone 后页面显示 `100% / completed`。
- 生产：数据库确认 `LearningProject=1`、`ProjectMilestone=3`，最新项目 `summary=true`、`codeSaved=3`、`reflectionSaved=3`。

## [0.5.0] - 2026-05-24

### Added

- **[Knowledge Base]** 上线 Sprint 5 术语库与 AI Radar。
  - 新增 `/glossary` 术语库页面，支持搜索、分类筛选、详情查看、来源引用和生成复习卡片。
  - 新增 `/radar` AI Radar 页面，支持人物、公司、实验室、论文、Benchmark、工具、开源项目和概念实体详情。
  - 新增 `GlossaryTerm` 与 `KnowledgeEntity` Prisma 模型。
  - 新增 `20260524_glossary_radar.sql` 手动迁移。
  - 新增默认术语与 Radar seed 数据，并接入 `prisma db seed`。
  - `/today` 的今日术语和广度小卡可跳转到 `/glossary` / `/radar` 详情。
  - `/map` 增加术语库覆盖、Radar 覆盖、类型分布和复习队列统计。
  - `/review` 队列和统计纳入独立知识卡片、Voice Note 卡片和 Thought Review 卡片。

### Verified

- 本地：`npm test` 23 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:glossary-radar`、`npm run db:seed`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 重启后为 `active`，内网 `http://127.0.0.1:3102/api/health` 返回 `ok`。
- 生产：`/glossary?term=rag` 显示 RAG 详情和“生成复习卡片”。
- 生产：`/radar?entity=swe-bench` 显示 SWE-bench 详情和“生成复习卡片”。
- 生产：数据库计数确认 `GlossaryTerm=23`、`KnowledgeEntity=11`。
- 生产：`/admin` 未授权访问只显示 Admin Login，不暴露调试数据；systemd 运行环境已注入 `ADMIN_SECRET` 和 `DEEPSEEK_API_KEY`。

## [0.4.1] - 2026-05-24

### Fixed

- **[Voice Note]** 修复从 Voice Note 生成 Flashcards 时的生产 `ZodError`。
  - 根因：`ThoughtReview.reviewJson` 为 Voice Note 保存了 `source` 和 `voiceNoteId` 元数据，而 `parseStoredThoughtReview()` 使用 strict schema 解析时没有过滤这些持久化元数据。
  - 修复：`parseStoredThoughtReview()` 只保留 `ThoughtReviewSchema` 拥有的字段，再交给 Zod 校验。
  - 回归测试：新增 `parseStoredThoughtReview ignores persistence metadata`。

### Verified

- 本地：`npm test` 15 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm run build` 通过。
- 生产：同步修复到 `118.89.119.107` 后，生产 `npm test` 15 项通过，`npm run lint` 通过，`npm run build` 通过。
- 生产：`ai-learning-platform.service` 重启后，服务器内网 `http://127.0.0.1:3102/api/health` 返回 `ok`。
- 生产：同一条 Voice Note 成功生成 1 张 `thought:<reviewId>:0` Flashcard，`/voice` 显示“已生成卡片：1”。

## [0.4.0] - 2026-05-24

### Added

- **[Voice Note]** 上线 Sprint 4 Voice Note MVP。
  - 新增 `/voice` 页面。
  - 支持浏览器录音/本地音频预览。
  - 支持手动粘贴或编辑 transcript。
  - 支持保存 `VoiceNote`。
  - 支持发送到 Coach 生成 `ThoughtReview`。
  - 支持保存为 Markdown `Note`。
  - 支持从 Voice Note 关联的 ThoughtReview 生成 Flashcards。

### Verified

- 生产 Voice Note 样例已保存，生成 `VoiceNote=1`。
- 发送到 Coach 后，`VoiceNote.thoughtReviewId` 已写入，`/coach?reviewId=...` 可见语音评审。
- 保存为 Note 后，`VoiceNote.noteId` 已写入，`/notes` 可见语音笔记 Markdown。
- 生成 Flashcards 后，生产库总 Flashcards 从 7 增至 8，`/review` 到期队列为 6 张。
