# Changelog

## [0.360.0] - 2026-06-10

### Changed

- **[Reduce Chaos Path Stage Reading Materials]** 按指导文件第 8.3 和第 14.2 继续优化 `/path`，把 Books 从独立入口收束进长期学习路径。
  - 新增 `src/server/learning/path-reading.ts`，按学习阶段生成 Books 推荐阅读材料。
  - `LearningPathStage` 新增 `readingMaterials`，LLM/RAG、AI 工程、项目应用、广度等阶段可显示对应书籍、页码范围、推荐理由和 `/books/:id` 链接。
  - `/path` 路线图阶段卡新增 `阶段阅读` 区块，展示书名、页码、推荐理由和 `去同读` CTA。
  - `去同读` CTA 复用 `pathReadingLinkClassName`，手机端保持至少 44px 触控高度和全宽布局。
  - 保留现有阶段进度、解锁条件、下一步主题、Current Mission 排序、Books 静态数据、上传禁用态、OCR/AI provider 边界、数据库 schema、Preview 写保护和生产配置。

### Verified

- RED：`npm test -- tests/unit/learning-path.test.ts` 首次失败于 `readingMaterials` 为 `undefined`，`/path` 缺少 `阶段阅读` 和 `pathReadingLinkClassName`。
- GREEN：`npm test -- tests/unit/learning-path.test.ts` 4 项通过，覆盖 Path 阶段阅读材料数据合约、`阶段阅读` 页面接线、页码/推荐理由渲染和移动端 `去同读` 触控目标。
- 相关回归：`npm test -- tests/unit/learning-path.test.ts tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts` 33 项通过，覆盖 Path、Books、Current Mission、Next Best Action、移动导航和共享可访问性边界。
- 本地完整门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 471 项通过，Next 生产构建生成 31 个静态页面。

### Not Covered

- 生产部署、生产 smoke、完整 Playwright 移动端截图矩阵和写入型生产 smoke 尚未执行；本切片不包含数据库迁移、真实 PDF 上传、OCR 或 AI provider 调用。生产部署证据会在上线后追加。

## [0.359.0] - 2026-06-10

### Changed

- **[Reduce Chaos Weekly Ritual Summary and Reflection Note]** 按指导文件第 9.1、9.2 和 9.4 继续优化 `/weekly`，让周复盘先给出可感知的学习总结、称号和可保存周记。
  - `WeeklyReviewData` 新增 `weeklyRitualSummary`，稳定生成本周一句话总结、`本周称号`、称号原因和周记模板。
  - `/weekly` 在当前任务后新增 `本周学习总结`，展示学习天数、完成课程、复习卡片、修复误区和本周称号。
  - 导出的 Weekly Markdown 新增 `本周学习总结`、`本周称号` 和 `周记草稿`。
  - 新增 `saveWeeklyReflectionAction()`，将周记保存为无课程绑定的 standalone Note，并跳转到 `/notes?noteId=<id>`。
  - `saveWeeklyReflectionAction()` 继续调用 `assertWritableRequest()`、`requireUserId()` 和 `createScopedNote()`；`auth-policy` 通用扫描已纳入 `src/app/weekly/actions.ts`。
  - `保存到笔记` CTA 复用 `weeklyReflectionButtonClassName`，手机端保持至少 44px 触控高度和全宽布局。
  - 保留 Weekly 统计口径、`mistakeRepairQueue`、`topMistake` 兼容字段、数据库 schema、Preview 写保护、生产 env/provider 密钥和其他学习模块行为边界。

### Verified

- RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `weeklyRitualSummary` 缺失、页面缺 `saveWeeklyReflectionAction` 和 `src/app/weekly/actions.ts` 不存在。
- GREEN：`npm test -- tests/unit/weekly-review.test.ts` 9 项通过，覆盖 `weeklyRitualSummary`、`本周学习总结`、`本周称号`、Weekly Markdown ritual 小节、周记表单、`saveWeeklyReflectionAction()`、Preview 写保护和手机端 `保存到笔记` CTA。
- 相关回归：`npm test -- tests/unit/weekly-review.test.ts tests/unit/notes-create.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过，覆盖 Weekly、Notes standalone note、Preview 写保护、Auth 和共享学习 UI。
- 本地完整门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 471 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `6c938bf feat: add weekly ritual reflection` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.359.0-20260610-071814.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内非 DB 门禁通过，覆盖 Weekly、Notes Template、Notes Page UI、Auth Policy 和共享学习 UI 共 53 项；`npm run audit:routes`、`npm run audit:learning`、`npm run lint`、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/weekly` 后可见 `本周学习总结`、`本周称号`、`周记`、`保存到笔记`、周记提示语和 `导出 Weekly Markdown`，导出 Markdown 包含 `## 本周学习总结` 与 `## 周记草稿`。

### Not Covered

- 未执行真实生产写入型周记 smoke，避免污染生产 Notes；未执行完整 Playwright 移动端截图矩阵。远端 `notes-create.test.ts` 依赖本地测试库 `localhost:65432`，生产容器没有该测试 DB，因此未作为远端门禁；该写入链路已由本地相关回归覆盖。`npm audit` 仍报告既有 3 个 moderate 告警，未纳入本轮范围。

## [0.358.0] - 2026-06-10

### Changed

- **[Reduce Chaos Weekly Mistake Repair Queue]** 按指导文件第 7.4 继续优化 `/weekly`，把周复盘里的错题信号收束成可执行的修复队列。
  - `WeeklyMistakeHighlight` 增加 `id`、`href` 和 `status`，`WeeklyReviewData` 新增 `mistakeRepairQueue`。
  - `getWeeklyReviewData()` 查询 Misconception `id`，并将本周误区转成最多 3 条待修复队列；`resolved` / `ignored` 不进入修复队列。
  - `/weekly` 将旧的单条 `错题最多的概念` 卡片替换为 `本周最值得修复的 3 个误区`，每条直接链接 `/mistakes?focus=<id>`。
  - 导出的 Weekly Markdown 新增 `本周最值得修复的 3 个误区` 小节，列出中文来源和出现次数。
  - 修复入口复用 `weeklyMistakeRepairLinkClassName`，手机端保持至少 44px 触控高度。
  - 保留 `topMistake` 兼容字段、Weekly 统计口径、`buildWeeklyRemediationPlan()`、数据库 schema、Preview 写保护、生产 env/provider 密钥和其他学习模块行为边界。

### Verified

- RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 7 项通过，覆盖 Top 3 误区修复队列、`/mistakes?focus=<id>` href、已解决误区过滤、Markdown Top 3 小节、页面 Top 3 入口和手机端 `min-h-11` 触控目标。
- 相关回归：`npm test -- tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 92 项通过，覆盖 Weekly、Mistakes、Current Mission、Next Best Action、Progress 和共享学习 UI。
- 本地完整门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 469 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `8da6a52 feat: add weekly mistake repair queue` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.358.0-20260610-065140.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Weekly/Mistakes/Current Mission 相关回归 92 项、`npm run audit:routes`、`npm run audit:learning`、`npm run lint`、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/weekly` 后可见 `每周复盘`、`本周最值得修复的 3 个误区` 和 `导出 Weekly Markdown`，导出文本区包含 Top 3 误区修复小节；远端源码确认已部署 `mistakeRepairQueue`、`weeklyMistakeRepairLinkClassName` 和 `/mistakes?focus=<id>`。

### Not Covered

- 当前生产用户没有可修复误区样本，线上 `/weekly` 显示空态 `这周还没有需要优先修复的误区。`，因此未能用真实生产数据实测 `/mistakes?focus=<id>` 链接渲染；该行为由本地/远端单测和远端源码核验覆盖。未执行完整 Playwright 移动端截图矩阵或写入型错题修复 smoke；`npm audit` 仍报告既有 3 个 moderate 告警，未纳入本轮范围。

## [0.357.0] - 2026-06-10

### Changed

- **[Reduce Chaos Mistakes Focus Repair]** 按指导文件第 7.3 和第 16 节继续优化 `/mistakes`，让 Current Mission 的未解决误区任务进入具体修复对象。
  - Next Best Action / Current Mission 如果拿到未解决误区 id，会跳到 `/mistakes?focus=<id>`；缺少 id 时回退 `/mistakes`，不再直接跳 `/coach`。
  - Learning Sessions 的 `mistake_repair` 当前会话同步使用误区 id 作为 focus 参数，避免用 summary 当路由焦点。
  - `/mistakes` 新增 `当前先修这一条` 聚焦修复区，优先展示 focus 误区，并复用现有 Coach 解释、生成复习卡、标记已解决动作。
  - 手机端聚焦修复动作进入 `aria-label="错题修复移动操作"` 的 sticky 操作区，使用 `sticky bottom-16 z-20`、`bg-background/95`、`backdrop-blur`，桌面端恢复 `sm:static` / `sm:border-0`。
  - 保留 `generateMistakeReviewCardAction`、`markMistakeResolvedAction`、Preview 写保护、数据库 schema、生产 env/provider 密钥和其他学习模块行为边界。

### Verified

- RED/GREEN：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/mistakes-view.test.ts` 34 项通过，覆盖 `/mistakes?focus=<id>`、fallback `/mistakes`、Learning Session 误区修复 href、`当前先修这一条` 和移动端 sticky 操作区。
- 相关回归：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 77 项通过，覆盖 Current Mission、Mistakes、Auth/Preview、Review 补弱、Today 补弱和共享学习 UI。
- 本地完整门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 467 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `645a293 feat: focus mistake repair mission` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.357.0-20260610-062421.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Mistakes/Current Mission 相关回归 77 项、`npm run audit:routes`、`npm run audit:learning`、`npm run lint`、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/mistakes` 后可见 `错题误区`，页面可访问；远端源码确认已部署 `当前先修这一条`、`错题修复移动操作`、`/mistakes?focus=<id>` 和 sticky class。

### Not Covered

- 当前生产 demo 用户没有开放误区样本（`open` count = 0），所以未能在线上真实数据中实测 `当前先修这一条` sticky 区渲染；该行为由本地/远端单测和远端源码核验覆盖。未执行完整 Playwright 移动端截图矩阵或写入型错题修复 smoke；`npm audit` 仍报告既有 3 个 moderate 告警，未纳入本轮范围。

## [0.356.0] - 2026-06-10

### Changed

- **[Reduce Chaos Voice Mobile Sticky Capture]** 按指导文件第 10 节和第 16 节继续优化 `/voice` 移动端录音体验，让“说出你的理解”成为手机端低摩擦主操作。
  - 将 `一键录音` / `停止并转写` 录音主操作包入 `aria-label="语音录音移动操作"` 的 sticky 操作区。
  - 移动端使用 `sticky bottom-16 z-20`、`bg-background/95` 和 `backdrop-blur`，固定在底部导航上方；桌面端恢复 `sm:static`、`sm:border-0`、透明背景和无 blur。
  - 保留原有浏览器录音、停止后自动转写、上传音频、保存语音笔记、Voice → Coach handoff、Preview 写保护、数据库和 provider 密钥边界，不新增迁移或后端配置。

### Verified

- RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice 捕获区缺少 `aria-label="语音录音移动操作"` 和 sticky 底部操作区。
- GREEN：`npm test -- tests/unit/voice-note.test.ts` 19 项通过，覆盖 `一键录音`、`停止并转写`、`bg-background/95`、`backdrop-blur`、`sm:static` 和 `sm:border-0`。
- 相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 76 项通过，覆盖 Voice 页面、录音状态、转写服务、Voice → Coach handoff 和共享学习 UI。
- 本地最终门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 465 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `df9f291 feat: improve voice mobile capture` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.356.0-20260610-022350.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Voice 定向回归 76 项、`npm run audit:routes`、`npm run audit:learning`、`npm run lint`、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/voice` 后可见 `说出你的理解`，检测到 `语音录音移动操作` sticky 区，且 `一键录音`、`停止并转写`、`录音计时` 可见，class 包含 `sticky bottom-16 z-20`、`bg-background/95`、`backdrop-blur`。

### Not Covered

- 未执行完整 Playwright 移动端截图矩阵或真实录音/上传写入型生产 smoke；`npm audit` 仍报告既有 3 个 moderate 告警，未纳入本轮范围。

## [0.355.0] - 2026-06-10

### Changed

- **[Reduce Chaos Books Mobile Sticky Companion]** 按指导文件第 14.6 和第 16 节继续优化 `/books/ai-engineering` 移动端阅读体验，让 AI 伴读成为底部可达的主要行动。
  - 将 `打开 AI 伴读` 从阅读侧栏移动到 `aria-label="AI 伴读移动操作"` 的 sticky 操作区。
  - 移动端和平板宽度使用 `sticky bottom-16 z-20`、`bg-background/95` 和 `backdrop-blur`，固定在底部导航上方；桌面端继续使用右侧 `AI 伴读` 面板。
  - 保留原有 Books 静态数据、Note/Flashcards/Coach 链接、禁用上传边界、鉴权、Current Mission 接线和 MVP 非 OCR 边界，不新增数据库迁移、真实上传或 AI 调用。

### Verified

- RED：`npm test -- tests/unit/books-companion.test.ts` 首次失败于阅读页缺少 `aria-label="AI 伴读移动操作"` 和 sticky 底部操作区。
- GREEN：`npm test -- tests/unit/books-companion.test.ts` 3 项通过，覆盖 Books seed、阅读页学习者文案和移动端 sticky 伴读入口。
- 相关回归：`npm test -- tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/auth-policy.test.ts` 38 项通过，覆盖 Books、Current Mission、Next Best Action、移动导航和鉴权/Preview 边界。
- 本地最终门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 464 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `8d13f7a feat: improve books mobile companion` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.355.0-20260610-015857.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Books/Current Mission/Auth 定向测试 38 项、`npm run audit:routes`、`npm run audit:learning`、`npm run lint`、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/books/ai-engineering` 后可见 `PDF Viewer`，检测到 `AI 伴读移动操作` sticky 区，且 `打开 AI 伴读` Sheet 可见 `解释选区`、`保存为 Note`、`送 Coach`。

### Not Covered

- 未执行完整 Playwright 移动端截图矩阵或生产写入型 smoke；`npm audit` 仍报告既有 3 个 moderate 告警，未纳入本轮范围。

## [0.354.0] - 2026-06-10

### Changed

- **[Reduce Chaos Review Mobile Sticky Actions]** 按指导文件第 16 节移动端专项优化 `/review` 的主动回忆操作区，让手机端更接近“快速完成一个学习动作”。
  - `ReviewCardStage` 的 `显示答案` 和评分表单统一进入 `aria-label="复习移动操作"` 的 sticky 操作容器。
  - 移动端操作区固定在底部导航上方，使用 `sticky bottom-16 z-20`、半透明背景和 blur；桌面端恢复普通静态布局。
  - 保留原有 `rateFlashcardAction`、隐藏答案流程、键盘快捷键和评分间隔，不改复习排程或服务端写入逻辑。

### Verified

- RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Review 活动卡片缺少 `aria-label="复习移动操作"` 和 `sticky bottom-16`。
- GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-empty-state.test.ts tests/unit/review-rating.test.ts` 31 项通过，覆盖 sticky 操作区、Review 空态和评分幂等。
- 本地最终门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 463 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `62d9394 feat: improve review mobile sticky actions` 已推送到 `origin/main`。
- 生产部署：已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.354.0-20260610-014015.tar.gz`，rsync 同步到 `118.25.15.72:/home/ubuntu/ai-learning-platform`，并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm run prisma:generate`、非 DB Review 定向测试 30 项、`npm run build` 通过，随后 `npm prune --omit=dev`；DB 型 `review-rating.test.ts` 在生产容器内因本地测试库 `localhost:65432` 不存在未作为远端门禁，已由本地全量测试覆盖。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；390px 移动视口密码登录 `/review` 后页面可见，并检测到 DOM 中存在 `aria-label="复习移动操作"`；远端源码确认包含 `sticky bottom-16 z-20` 和 `bg-background/95`。

### Not Covered

- 未执行完整移动端截图矩阵或生产写入型评分 smoke；`npm audit` 仍报告既有 3 个 moderate 依赖告警，未纳入本轮范围。

## [0.353.0] - 2026-06-10

### Changed

- **[Reduce Chaos Learning Sessions]** 按指导文件第 15 节在首页新增 `学习会话` 读侧切片，把分散页面入口继续收束为当前会话、下一会话和本周会话。
  - `src/server/learning/current-mission.ts` 新增 `LearningSession` 类型与 `buildLearningSessions()`，统一输出 `type / title / goal / status / startedAt / completedAt / outputs / nextRecommendedSession`。
  - 会话类型覆盖 `daily_lesson / review_session / coach_session / voice_reflection / mistake_repair / project_milestone / book_reading / weekly_review / glossary_explore / radar_explore`。
  - 首页接入 `LearningSessionStrip`，在 `CurrentMissionCard` 后展示 `当前会话`、`下一会话` 和 `本周会话`，主 CTA 只给当前会话。
  - 会话从现有 Current Mission 输入派生，不新增 Prisma schema、不新增数据库 migration、不新增持久化 session 表。
  - active book session 继续进入会话流，读书任务会显示为 `book_reading`，并保留 `/books/:id` 主线链接。

### Verified

- RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于会话条仍显示说明型文案 `用户看到的是会话，不是分散页面。`
- GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts` 43 项通过，覆盖会话类型、统一字段、首页接线、组件渲染、移动端 CTA 和说明型文案防回退。
- 本地最终门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 462 项通过，Next 生产构建生成 31 个静态页面。
- GitHub：代码提交 `91e5424 feat: add Roky Learn learning sessions` 已推送到 `origin/main`。
- 生产部署：`learn.roky.chat` 当前 HTTPS 网关为 `198.10.0.92`，实际应用机为 `118.25.15.72`；已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.353.0-20260610-012425.tar.gz`，rsync 同步后重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Learning Session 定向测试 43 项、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200/ok；密码登录后访问首页可见 `Roky Learn`、`学习会话`、`当前会话`、`下一会话`、`本周会话`。

### Not Covered

- 本切片未新增数据库持久化 session、真实 session 开始/完成时间写入、完整 Playwright 矩阵、真实移动端截图或生产写入型 smoke；`npm audit` 仍报告既有 3 个 moderate 依赖告警，未纳入本轮范围。

## [0.352.0] - 2026-06-10

### Changed

- **[Reduce Chaos Books Companion MVP]** 按指导文件第 14 节新增 `/books` 同读书籍伴学阅读，并接入学习主线。
  - 新增 `/books` 书架页，包含 `最近阅读`、`我的书架`、`继续阅读` 和 disabled `上传 PDF`；MVP 明确不会把本地 PDF 上传到服务器。
  - 新增 `/books/[id]` 阅读页，包含 `PDF Viewer`、`当前页文本提取`、`文本选择`、桌面侧栏 `AI 伴读` 和移动端底部 Sheet `打开 AI 伴读`。
  - 新增 `src/server/books/base.ts` 静态 Books 数据源，保持 MVP 边界：不新增 Prisma migration、不做真实 PDF 上传持久化、不做 OCR。
  - Books 产出接入 `Coach / Note / Flashcard / Mistake / Weekly / Project / Glossary / Radar / Current Mission / Path`，避免变成新的资料孤岛。
  - Current Mission 新增 active book session，主线可推荐 `今天继续读《AI Engineering》第 12-14 页`，并把今日闭环从 4 步扩展到 5 步。
  - 桌面导航和移动端 More Sheet 加入 `/books`，鉴权策略、路由审计和学习系统审计同步纳入 `/books` 与 `/books/[id]`。
  - `docs/ui-review-checklist.md` 新增 Books Companion 验收清单，并更新旧的 `/books` 未来预留文案。

### Verified

- 本地定向回归：`npm test -- tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/auth-policy.test.ts` 35 项通过。
- 本地门禁：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build` 通过；全量单测 458 项通过，Next 生产构建生成 31 个静态页面。
- 路由审计：Pages 21，Navigation entries 16，缺失核心页、无导航页面、无页面导航入口均为 none；路由包含 `/books` 和 `/books/[id]`。
- 生产部署：`learn.roky.chat` 当前 HTTPS 网关为 `198.10.0.92`，实际反代到应用机 `118.25.15.72`；已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.352.0-20260610-005347.tar.gz`，rsync 同步并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、Books 定向测试 35 项、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200；密码登录后访问 `https://learn.roky.chat/books` 可见 `同读书籍`、`AI Engineering`、`继续阅读`，访问 `https://learn.roky.chat/books/ai-engineering` 可见 `PDF Viewer`、`AI 伴读`、`解释选区`、`保存为 Note`。

### Not Covered

- 未执行真实移动端截图、完整 Playwright 矩阵或真实写入型生产 smoke。

## [0.351.0] - 2026-06-09

### Changed

- **[Reduce Chaos Glossary Radar Paths]** 按指导文件第 13 节将 `/glossary` 和 `/radar` 从知识库列表继续收束为探索路径。
  - `src/server/knowledge/paths.ts` 将 Agent Path 调整为 `CoT -> ReAct -> Reflexion -> Agent -> SWE-bench`，LLM Training Path 调整为 `SFT -> RLHF -> DPO -> Alignment`，Benchmark Path 调整为 `HumanEval -> SWE-bench -> SWE-agent -> tau-bench`。
  - 学习路径节点状态改为 `未看 / 已查看 / 已生成卡片 / 已复习 / 掌握`；`weak` 只保留为内部排序/风险信号，不再作为节点状态文案。
  - `KnowledgePathExplorer` 指标改为 `已看 / 已生成卡片 / 已复习 / 掌握`，保留 `下一项` CTA。
  - 补齐 `retriever`、`rag-evaluation`、`alignment`、`Meta AI`、`Mistral`、`DeepSeek`、`SWE-agent`、`tau-bench` 默认 seed，确保 curated paths 不生成空链接。
  - Current Mission 兜底探索改为 `今天轻量探索：认识 SWE-bench`，并链接到 `/radar?entity=swe-bench`。
  - `PasswordLoginForm` 将访问密码输入框关联到可访问 label，生产 smoke 可通过 `getByLabel("访问密码")` 完成登录。
  - `dotenv` 明确写入生产依赖，避免 `scripts/next-start-with-env.mjs` 依赖间接安装包启动。

### Verified

- 本地 RED：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` 首次失败于旧路径、缺 seed、旧节点指标和泛化 `/radar` 兜底。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` 63 项通过。
- 本地最终门禁：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 454 项通过，Next 生产构建生成 28 个页面。
- 本地登录/路径回归：`npm test -- tests/unit/login-page-ui.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` 65 项通过。
- 本地浏览器 smoke：`npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 2 项通过。
- 生产部署：`learn.roky.chat` 当前 HTTPS 网关为 `198.10.0.92`，实际反代到应用机 `118.25.15.72`；已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.351.0-20260609-231940.tar.gz`，rsync 同步并重启 `ai-learning-platform` 容器。
- 远端门禁：容器内 `npm ci --include=dev`、`npm run prisma:generate`、关键单测 65 项、`npm run build` 通过，随后 `npm prune --omit=dev`。
- 生产验收：`https://learn.roky.chat/api/health` 返回 200；密码登录后访问 `https://learn.roky.chat/radar?entity=swe-bench`，页面可见 `AI Radar`、`路径化学习`、`SWE-bench` 和 `掌握`。

### Not Covered

- 未执行真实移动端截图、完整 Playwright 矩阵或真实写入型生产 smoke。

## [0.350.0] - 2026-06-09

### Changed

- **[Reduce Chaos Projects Mission Mode]** 按指导文件第 12 节将 `/projects` 进一步收束成 Mission Mode。
  - `ProjectMissionHero` 顶部任务卡固定展示 `今日项目任务`、`项目：...`、`任务：...`、`完成标准：给出 3 个测试样例`、`预计：20 分钟`，让 Projects 首屏从模板列表转向今日小步。
  - `src/app/projects/page.tsx` 将当前里程碑、完成标准和 20 分钟任务时长传入 Mission Hero，并在模板区加入 `从《xxx》第 2 章生成一个小项目` 的 Books 预留文案；本切片不新增 `/books` 路由或链接。
  - 新增 `ProjectFeedbackNextFix`，当前里程碑已有代码反馈时优先展示 `你现在只需要修这个问题：...` 的单点修复目标。
  - 新增 `ProjectCompletionRitual`，项目完成态显示 `你完成了一个项目！`、`练到了：` 和 `生成：`，并展示代码卡与概念卡数量。
  - `docs/ui-review-checklist.md` 与 `helloagents/modules/project-practice.md` 同步记录 Mission Mode、Books 预留边界和本地验收要求。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 Mission Hero 缺少 `今日项目任务` 字段结构、缺少 `ProjectFeedbackNextFix` / `ProjectCompletionRitual` 导出、页面缺少 Books 预留文案。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 27 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 77 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地审计：`npm run audit:routes` 和 `npm run audit:learning` 通过；路由表仍为 19 个页面，缺失核心页、无导航页面、无页面导航入口均为 none。
- 本地门禁：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 452 项通过，Next 生产构建生成 28 个页面。

### Not Covered

- 未执行 Playwright E2E、真实移动端截图、生产部署或真实生产登录 smoke。

## [0.349.0] - 2026-06-09

### Changed

- **[Reduce Chaos Coach Input Intent Upgrade]** 将 `/coach` 主输入类型从旧功能分类收束为指导文件第 11 节的 5 个学习者意图。
  - `src/app/coach/page.tsx` 的 `评审模式` 主下拉改为 `我想解释一个概念 / 我想检查一段代码思路 / 我想复述一个错题 / 我想问一本书里的内容 / 我想问某个术语/人物/Benchmark`。
  - `src/server/coach/submit.ts` 接收 `mistake_retell` 和 `book_question`，并将旧入口安全映射到新主类型：`today_lesson/free_thought -> concept_question`、`code_debug/algorithm_design -> code_reasoning`、`glossary_question/industry_radar/paper_reading -> glossary_term`。
  - `src/server/voice/voice-note.ts` 的 Voice → Coach handoff 保留 `mistake_retell` 和 `book_question` 为同名 Coach mode，不再压成 `concept_question`。
  - `src/server/learning/today-completion-actions.ts` 将 Today 完成后 `让 Coach 检查` 链接改为 `/coach?lessonId=...&mode=concept_question`，避免主链路继续传播旧 Coach `today_lesson` mode。
  - `src/app/_lib/home-labels.ts` 更新共享 Coach mode 展示标签，让最近评审、课程库和进度页显示 `错题复述`、`书籍疑问`、`术语/人物/Benchmark` 等学习者文案。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/home-page-labels.test.ts` 首次失败于后端不接受 `mistake_retell`、页面仍展示旧 Coach 模式、共享标签仍输出旧 `概念疑问`。
- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice `mistake_retell` / `book_question` 仍映射为 `concept_question`。
- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于 Today 完成后 Coach 链接仍使用 `mode=today_lesson`。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/home-page-labels.test.ts tests/unit/voice-note.test.ts` 56 项通过，覆盖 Today → Coach 链接、Coach 页面模式、Coach submit、共享标签和 Voice handoff。
- 本地 GREEN：`npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 2 项通过，覆盖核心页面 smoke、Coach 新默认 mode 和 Voice 新标题。
- 本地 GREEN：`npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"` 2 项通过，覆盖 Today 完成后进入 Voice 和 Coach 的真实浏览器路径。

### Not Covered

- 未执行真实移动端截图、生产部署或真实生产登录 smoke。

## [0.348.0] - 2026-06-09

### Changed

- **[Reduce Chaos Voice Learning Upgrade]** 将 `/voice` 从“上传/捕获音频”继续收束为学习主线里的“说出你的理解”。
  - `src/app/voice/page.tsx` 页头改为 `说出你的理解`，副标题改为 `不用整理，先说出来。Roky 会帮你转写、整理、检查和生成卡片。`。
  - `src/server/voice/reflection-template.ts` 将反思模板扩展为 `今日理解 / 代码思路 / 错题复述 / 术语解释 / 项目复盘 / 读书疑问 / 论文阅读 / 行业观察`，并统一使用 `我今天学的是... / 我理解为... / 我卡住的是... / 我想让 Coach 检查...`。
  - `src/app/voice/page.tsx` 与 `src/server/voice/voice-note.ts` 接入 `mistake_retell`、`project_retrospective` 和 `book_question`，并将新模式映射到既有 Coach 模式，避免送 Coach 时回退成自由想法。
  - `src/app/voice/ui/voice-workspace-form.tsx` 为普通模式提供四句学习表达 placeholder，为 `mode=book_question` 预留 `我正在读第 X 页，我不理解的是...`；该切片只预留 Books 入口，不新增 `/books` 页面。
  - `src/app/coach/ui/coach-workspace.tsx` 同步 Voice 来源模式展示，让从 Voice 进入 Coach 的来源面板显示 `代码思路`、`错题复述`、`项目复盘` 或 `读书疑问`，不再显示旧 `代码调试` 或新模式兜底 `语音反思`。
  - `tests/unit/voice-note.test.ts` 扩展源码和渲染回归，覆盖页头文案、8 个模板、Books 预留 placeholder、Voice 模式 normalize 和 Voice → Coach 模式映射。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于模板缺少 `mistake_retell` / `book_question`、Books placeholder 未切换、页面模式未暴露新学习标签；随后新增页头断言再次失败于旧标题 `语音学习捕获`。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts` 18 项通过。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 17 项通过，覆盖 Voice-linked Coach 来源面板的新模式中文展示。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-submit.test.ts tests/unit/learning-ui-components.test.ts` 65 项通过，覆盖 Voice 页面、转写术语、录音状态、Voice 服务链路和共享学习 UI。

### Not Covered

- 未执行 Playwright E2E、真实移动端截图、生产部署或真实生产登录 smoke。

## [0.347.0] - 2026-06-09

### Changed

- **[Reduce Chaos Homepage Command Center]** 将首页首屏从 dashboard/快捷入口混排收束为 Daily Command Center。
  - `src/app/page.tsx` 新增 `首页主任务` section，首屏只保留 `CurrentMissionCard`、`LearningMomentumStrip` 和补弱焦点，让 Current Mission 成为唯一主路径。
  - 删除首屏右侧 `今日能量` 快捷卡，以及下方重复的 `今日三件事` / `常用入口` 区块，避免首页同时给出多组“也可以做”。
  - 新增默认折叠的 `今天还可以` 次级动作区，保留写笔记、说出理解、推进项目和查看当前路径入口；每条 CTA 继续满足移动端 `min-h-11 w-full sm:w-auto` 触控目标。
  - `tests/unit/home-page-labels.test.ts` 新增首页首屏和折叠次级动作源码级回归，防止首页退回多入口 dashboard。
  - 该切片只改首页读侧结构、测试和文档，不改 Current Mission 优先级、Daily Quest、项目查询、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED：`npm test -- tests/unit/home-page-labels.test.ts` 首次失败于旧首页仍存在 `今日能量`、`今日三件事`、`常用入口`、`QUICK_ACTIONS` 和多个首屏快捷 CTA。
- 本地 GREEN：`npm test -- tests/unit/home-page-labels.test.ts` 4 项通过，覆盖首页标签、主任务首屏和 `今天还可以` 折叠区。
- 本地相关回归：`npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts` 48 项通过，覆盖首页、Current Mission、学习动机和共享学习 UI。
- 本地审计：`npm run audit:routes` 与 `npm run audit:learning` 通过。
- 本地门禁：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 441 项通过，Next 生产构建生成 28 个静态页面。

### Not Covered

- 未执行 Playwright E2E、真实移动端截图、生产部署或真实生产登录 smoke。

## [0.346.0] - 2026-06-09

### Changed

- **[Reduce Chaos Navigation Mainline]** 收束全局导航信息架构，让入口更贴近“每天先做什么”的学习主线。
  - `src/lib/routes.ts` 将桌面侧边栏分组调整为 `学习主线 / 补弱与表达 / 知识与探索 / 系统`，把 `/path` 提升到主线分组，把 Voice 显示为 `说出理解`，把 Projects 显示为 `项目任务`。
  - `src/components/mobile/mobile-bottom-nav.tsx` 将移动底部第四主入口从 `/voice` 调整为 `/path` 的 `路径`，同时把 `/voice` 保留在 More Sheet 中，避免表达工具挤占学习主线入口。
  - `tests/unit/shared-ui-a11y.test.ts` 新增导航分组和移动底栏源码级回归，防止主入口退回工具堆叠。
  - 该切片只改读侧导航和验收文档，不新增页面、不改路由存在性、学习数据、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于旧分组 `今日 / 能力 / 知识库` 和移动底栏 `/voice` `语音` 主入口。
- 本地 GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 5 项通过，覆盖共享 UI a11y、导航分组、移动底栏和 AppShell 页头。
- 本地相关回归：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/pwa-manifest.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 33 项通过。
- 本地审计：`npm run audit:routes` 通过，19 个页面、15 个导航入口，缺失核心页 / 无导航页面 / 无页面导航入口均为 none；`npm run audit:learning` 通过。
- 本地门禁：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 439 项通过，Next 生产构建生成 28 个静态页面。

### Not Covered

- 未执行生产部署、真实生产登录 smoke、Playwright E2E 或真实移动端截图验证。

## [0.345.0] - 2026-06-08

### Added

- **[Sprint Learning Desire Homepage Momentum Strip]** 首页新增学习状态条，把既有 XP、Daily Quest、streak 和周目标信号收口成“当前阶段 / 下一步解锁 / 本周目标 / 今日闭环 / 连续学习”。
  - `src/server/learning/momentum.ts` 新增 `buildLearningMomentum()`，只读计算学习阶段称号、下一步解锁进度、今日闭环进度和短鼓励语，不新增数据库字段或持久化。
  - `src/components/learning/learning-momentum-strip.tsx` 新增紧凑状态条，使用中文学习者文案和 `LearningProgressBar` 的可访问进度语义。
  - `src/app/page.tsx` 在首页 Current Mission 下方接入 `LearningMomentumStrip`，让首屏直接回答“我现在处于什么阶段、下一步解锁什么、今天还差哪一步”。
  - `tests/unit/learning-motivation.test.ts` 新增服务层与组件渲染回归，覆盖中文阶段标签、下一步解锁进度、今日闭环、周目标、鼓励语和英文等级名防回退。
  - 该切片只改读侧首页学习欲望体验，不改 XP 阈值、Daily Quest 口径、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于缺少 `@/server/learning/momentum`；GREEN 后 12 项通过。
- 本地相关回归：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/current-mission.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 46 项通过，覆盖首页动机组件、Current Mission、共享学习 UI 和首页展示标签。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产登录后首页视觉 smoke。

## [0.344.0] - 2026-06-08

### Fixed

- **[Phase E Library Flashcard Metadata Label Localization]** 本地化 `/library` 课程详情中复习卡片的元信息文案，避免课程档案继续显示英文式 `due:` / `reviews:`。
  - `src/app/library/page.tsx` 将复习卡片元信息从 `due: ... / reviews: ...` 改为 `到期：... / 复习次数：...`。
  - `tests/unit/library-page-labels.test.ts` 扩展源码级回归，要求复习卡片元信息使用中文学习者文案，并阻止旧 `due:` / `reviews:` 模板回退。
  - 该切片只改 `/library` 读侧展示和源码级 UI 测试，不改 `Flashcard.dueAt`、`Flashcard.reviewCount` 数据契约、复习排程、课程查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 复习卡片仍显示 `due:` / `reviews:`；GREEN 后 9 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 62 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Library Flashcard Metadata|0\\.344\\.0|到期：\\{c\\.dueAt\\.toISOString\\(\\)\\.slice\\(0, 10\\)\\}|复习次数：|due: \\{c\\.dueAt|reviews:" ...` 确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；生产源码只保留新的 `到期` / `复习次数` 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 434 项通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.343.0] - 2026-06-08

### Fixed

- **[Phase E Library Code Feedback Provider Label Localization]** 本地化 `/library` 课程详情中结构化代码反馈的来源文案，避免课程档案继续显示 raw `deepseek`、`template`、`fallback` provider。
  - `src/app/library/page.tsx` 将代码反馈摘要从 `反馈：{feedback.provider}` 改为 `反馈来源：{formatTodayPlanSourceLabel(feedback.provider)}`，与 Today、Coach、Progress 的反馈来源文案保持一致。
  - `tests/unit/library-page-labels.test.ts` 扩展源码级回归，要求 Library 代码反馈 provider 走 display helper，并阻止旧 `反馈：{feedback.provider}` 模板回退。
  - 该切片只改 `/library` 读侧展示和源码级 UI 测试，不改 `CodeFeedback.provider` 数据契约、反馈生成、课程查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 仍缺少 `反馈来源：{formatTodayPlanSourceLabel(feedback.provider)}`；GREEN 后 8 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 61 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Library Code Feedback Provider|0\\.343\\.0|反馈来源：\\{formatTodayPlanSourceLabel\\(feedback\\.provider\\)\\}|反馈：\\{feedback\\.provider\\}|CodeFeedback\\.provider|raw provider" ...` 确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；生产源码只保留新的 `反馈来源` 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 433 项通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.342.0] - 2026-06-08

### Fixed

- **[Phase E Glossary Difficulty Label Localization]** 本地化 `/glossary` 术语详情中的难度 badge，避免学习者继续看到 raw `beginner`、`intermediate`、`advanced`。
  - `src/app/_lib/home-labels.ts` 新增 `formatGlossaryDifficultyLabel()`，将 `beginner`、`intermediate`、`advanced` 显示为 `入门`、`进阶`、`高阶`，未知历史值显示 `难度未标记`。
  - `src/app/glossary/page.tsx` 的术语详情难度 badge 改为展示本地化难度标签，同时保留 `GlossaryTerm.difficulty`、排序、seed、卡片 tag 和生成复习卡片 action 契约不变。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，要求术语详情使用难度 display helper，并阻止旧 `<Badge>{selectedTerm.difficulty}</Badge>` 模板回退。
  - 该切片只改 `/glossary` 读侧难度展示和源码级 UI 测试，不改术语数据、卡片生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `formatGlossaryDifficultyLabel` 不存在；GREEN 后 21 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/today-activity-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 68 项通过，覆盖 Knowledge Base/Radar、Today 知识卡、Knowledge Map、首页标签和共享学习 UI。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 433 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.341.0] - 2026-06-08

### Fixed

- **[Phase E Glossary Category Label Localization]** 本地化学习者可见的术语分类标签，避免 `/glossary`、Today 术语卡和 `/radar` 关系卡片链继续显示 raw `agent`、`retrieval`、`fine-tuning` 等分类字段。
  - `src/app/_lib/home-labels.ts` 新增 `formatGlossaryCategoryLabel()`，覆盖 `prompting`、`agent`、`reasoning`、`retrieval`、`alignment`、`training`、`fine-tuning`、`architecture`、`benchmark` 等术语分类。
  - `src/app/glossary/page.tsx` 将分类筛选、术语结果列表 badge 和术语详情 badge 改为本地化分类标签，同时保留 `category` query、排序、筛选和数据库字段契约不变。
  - `src/app/today/page.tsx` 将两个今日术语分类 badge 改为本地化标签，不改变 `Lesson.connections.glossary` 或今日知识卡跳转逻辑。
  - `src/app/radar/page.tsx` 将关系卡片链 badge 收口到 `formatRadarRelationBadgeLabel()`，实体关系继续复用实体类型中文标签，术语关系使用术语分类中文标签。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，要求三处学习者可见分类走 display helper，并阻止旧 raw category badge/template 回退。
  - 该切片只改读侧展示和源码级 UI 测试，不改 Glossary/Radar 查询参数、种子数据、卡片 tag、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `formatGlossaryCategoryLabel` 不存在；GREEN 后 20 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/today-activity-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 67 项通过，覆盖 Knowledge Base/Radar、Today 知识卡、Knowledge Map、首页标签和共享学习 UI。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 432 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary`、`/radar` 和 `/today`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.340.0] - 2026-06-08

### Fixed

- **[Phase E Library Filter Field Label Localization]** 本地化 `/library` 筛选表单的可见字段名，避免课程档案筛选区继续显示裸 `source`、`schemaVersion`、`status`、`localDate`。
  - `src/app/library/page.tsx` 将筛选字段可见 label 改为 `来源`、`内容版本`、`状态`、`日期`。
  - `name="source"`、`name="schemaVersion"`、`name="status"`、`name="localDate"` 和现有 URL query 筛选契约保持不变，placeholder 仍保留可输入 raw 值说明。
  - `tests/unit/library-page-labels.test.ts` 新增源码级回归，要求中文可见 label 与 raw input name 同时存在，并阻止旧 raw label 回退。
  - 该切片只改 `/library` 读侧筛选表单可见文案和源码级 UI 测试，不改筛选解析、查询条件、课程列表、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 筛选字段仍显示 `source`；GREEN 后 8 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 61 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n 'Library Filter Field Label|0\\.340\\.0|来源</span>|内容版本</span>|状态</span>|日期</span>|name="source"|name="schemaVersion"|name="status"|name="localDate"|raw input name|裸 source' ...` 确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认 `/library` 生产源码不再显示旧 `<span>source/schemaVersion/status/localDate</span>` 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 431 项通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.339.0] - 2026-06-08

### Fixed

- **[Phase E Today Code Language Label Localization]** 本地化 `/today` 代码练习区的可见语言标签，避免学习者继续看到内部字段式 `language：python`。
  - `src/app/today/ui/code-exercise.tsx` 新增 `codeLanguageLabel()`，将可见语言显示为 `代码语言：Python`、`代码语言：TypeScript` 或 `代码语言：JavaScript`。
  - 隐藏提交字段仍保留 `name="language"` 和 raw `python` / `typescript` 等值，不改变 `CodeSubmission.language` 提交契约、代码保存 action 或数据库字段。
  - `tests/unit/today-code-exercise.test.ts` 扩展代码练习静态渲染回归，要求可见文案显示 `代码语言：Python`，阻止旧 `language：` 回退，并确认隐藏 input 仍提交 raw `python`。
  - 该切片只改 `/today` 代码练习读侧语言标签和源码级 UI 测试，不改提交保存、代码反馈生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-code-exercise.test.ts` 首次失败于 `/today` 代码练习仍显示 `language：python`；GREEN 后 2 项通过。
- 本地相关回归：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/today-activity-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Today 代码练习、Today 活动标签、Progress、Library 标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Today Code Language|0\\.339\\.0|codeLanguageLabel|visibleLanguageLabel|代码语言|language：|name=\"language\" value=\"python\"" ...` 确认源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认生产源码不再显示旧 `language：` 可见模板，旧文案只保留在测试反向断言和文档说明中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.338.0] - 2026-06-08

### Fixed

- **[Phase E Today Code Feedback Provider Label Localization]** 本地化 `/today` 代码反馈头部 provider 标签，避免学习者在代码练习反馈里继续看到 raw `fallback`。
  - `src/app/today/ui/code-exercise.tsx` 的代码反馈头部现在复用 `formatTodayPlanSourceLabel(feedback.provider)`，将 fallback provider 显示为 `系统生成`，并沿用已有 `AI 生成`、`模板兜底` 等来源标签。
  - `tests/unit/today-code-exercise.test.ts` 扩展代码练习静态渲染回归，要求 provider 为 `fallback` 时显示 `系统生成`，并阻止 raw `fallback` 回退。
  - 该切片只改 `/today` 代码练习读侧 provider 文案和源码级 UI 测试，不改 `CodeFeedback.provider` 数据契约、代码反馈生成逻辑、提交保存、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地目标测试：`npm test -- tests/unit/today-code-exercise.test.ts` 2 项通过，覆盖代码练习反馈标签和手机端思路/语音入口。
- 本地相关回归：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/today-activity-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Today 代码练习、Today 活动标签、Progress、Library 标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Today Code Feedback Provider|0\\.338\\.0|formatTodayPlanSourceLabel\\(feedback\\.provider\\)|\\{feedback\\.provider\\}|fallback / 部分正确|系统生成" ...` 确认源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认生产代码不再通过 `{feedback.provider}` 直出 provider。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.337.0] - 2026-06-08

### Fixed

- **[Phase E Weekly Markdown Title Localization]** 本地化 `/weekly` 可复制周报的 Markdown 标题，避免学习者复制学习档案时继续看到英文 `# Roky Learn Weekly Report`。
  - `src/server/learning/weekly.ts` 的 `buildWeeklyReportMarkdown()` 现在输出 `# Roky Learn 每周复盘`，保留 7 天总览、本周课程、领域与错题、代码与复习、AI 周总结和下周建议结构不变。
  - `tests/unit/weekly-review.test.ts` 扩展周报导出回归，覆盖有数据和空数据两条路径，要求中文标题并阻止英文标题回退。
  - 该切片只改 `/weekly` 服务层导出 Markdown 文案和源码级测试，不改 `weeklyReportMarkdown` 字段、周报数据聚合、页面查询、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `weeklyReportMarkdown` 仍输出 `# Roky Learn Weekly Report`；GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 56 项通过，覆盖 Weekly、Progress、共享学习 UI 和首页标签。
- 本地覆盖扫描：`rg -n "Weekly Markdown Title|0\\.337\\.0|Roky Learn 每周复盘|Roky Learn Weekly Report|weeklyReportMarkdown" ...` 确认源码、测试、UI checklist、Weekly 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；生产生成器只输出中文标题，旧英文标题仅保留在测试反向断言和历史证据说明中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/weekly`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.336.0] - 2026-06-08

### Fixed

- **[Phase E Projects Portfolio Markdown Related Topic Label Localization]** 本地化项目作品集导出 Markdown 中的相关知识行，避免可复制成果继续写出 `inverted-index`、`file-io` 等 raw topic slug。
  - `src/server/projects/base.ts` 新增服务层 `PROJECT_TOPIC_LABELS` 和 `formatProjectTopicLabel()`，让 `buildProjectPortfolioMarkdown()` 输出 `相关知识：倒排索引, 文件读写` 等中文业务标签。
  - `buildProjectPortfolioItems()` 继续保留 `relatedTopics` 原始数组和项目数据契约，仅改变 `portfolioMarkdown` 的学习者可见文本。
  - `tests/unit/projects.test.ts` 扩展服务层回归，要求 raw `relatedTopics` 保持不变，但 `portfolioMarkdown` 不再输出 raw `inverted-index, file-io`。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/projects.test.ts` 首次失败于 `portfolioMarkdown` 仍输出 `- 相关知识：inverted-index, file-io`；GREEN 后 16 项通过。
- 本地相关回归：`npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 73 项通过，覆盖项目服务、Projects UI、Today 完成后项目推荐和共享学习 UI。
- 本地窄扫：`rg -n "relatedTopics\\.join\\(\\\", \\\"\\)|- 相关知识：inverted-index, file-io|\\$\\{args\\.relatedTopics\\.join" src/server/projects/base.ts tests/unit/projects.test.ts` 只命中测试反向断言，服务层不再通过 `relatedTopics.join(", ")` 直出 raw slug。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.335.0] - 2026-06-08

### Fixed

- **[Phase E Projects Portfolio Related Topic Label Localization]** 本地化 `/projects` 项目作品集中的相关知识 badge，避免学习者继续看到 `inverted-index`、`file-io` 等 raw topic slug。
  - `src/app/projects/ui/project-mission-workspace.tsx` 新增 `projectTopicLabels` 和 `formatProjectRelatedTopicLabel()`，将常见项目 topic slug 映射为中文业务标签，例如 `倒排索引`、`文件读写`、`向量检索`、`工具调用`。
  - `ProjectPortfolioPanel` 的相关知识 badge 改为渲染 formatter 结果，保留 `relatedTopics` 原始数据、项目查询、作品集 Markdown 生成和 review 路由契约不变。
  - `tests/unit/project-mission-workspace.test.ts` 扩展作品集静态渲染回归，要求 `inverted-index` / `file-io` 显示为 `倒排索引` / `文件读写`，并禁止 raw slug badge 回退。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于作品集 badge 仍显示 raw `inverted-index` / `file-io`；GREEN 后 23 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 73 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地覆盖扫描：`rg -n "Project Portfolio Related Topic|Portfolio Related Topic|projectTopicLabels|formatProjectRelatedTopicLabel|倒排索引|文件读写|0\\.335\\.0|related topic|相关知识标签" ...` 确认源码和测试已接入作品集相关知识标签中文化切片。
- 本地窄扫：`rg -n ">inverted-index<|>file-io<|\\{topic\\}" src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts` 只命中测试反向断言和 `Badge key={topic}`，生产渲染不再使用 `{topic}` 直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.334.0] - 2026-06-08

### Fixed

- **[Phase E Projects Planned Status Label Localization]** 本地化 `/projects` 项目和里程碑的 `planned` 状态展示，避免“我的项目”、当前任务 brief 或里程碑路线继续把 raw `planned` 直出给学习者。
  - `src/app/projects/ui/project-mission-workspace.tsx` 的 `missionStatusText()` 新增 `planned -> 待开始`，保留 `active/in_progress -> 进行中`、`completed -> 已完成` 和原有状态存储契约。
  - `tests/unit/project-mission-workspace.test.ts` 新增静态渲染回归，覆盖 planned 项目列表、planned 当前任务 brief 和 planned 里程碑路线，要求页面显示 `待开始` 且不显示 raw `planned`。
  - 该切片只改 `/projects` 读侧状态文案和源码级 UI 测试，不改项目状态保存值、项目/里程碑 action、项目查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 planned 项目和里程碑状态仍直显 raw `planned`；GREEN 后 23 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 73 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Projects Planned Status|Projects Planned Status Label|0\\.334\\.0|planned.*待开始|待开始|project workspace localizes planned|missionStatusText\\(status\\)|raw planned" ...` 确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n ">planned<|/ planned|\\{missionStatusText\\([^)]*\\)\\}|status === \\\"planned\\\"" src/app/projects/ui/project-mission-workspace.tsx src/app/projects/page.tsx` 只命中 `missionStatusText()` helper 和正常调用，未发现 `>planned<` 或 `/ planned` 可见直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 430 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.333.0] - 2026-06-08

### Fixed

- **[Phase E Projects List Panel Mobile Touch Targets]** 补齐 `/projects` 左侧“我的项目”列表里每个项目入口的移动端触控高度，避免继续项目入口在手机端过小。
  - `src/app/projects/ui/project-mission-workspace.tsx` 新增 `projectListPanelLinkClassName = "min-h-11 rounded-lg border px-3 py-2 text-sm transition-colors"`，并让 `ProjectListPanel` 的项目链接统一复用该 class。
  - `tests/unit/project-mission-workspace.test.ts` 新增回归，要求项目列表链接渲染 `min-h-11`，并禁止旧 `"rounded-lg border px-3 py-2 text-sm transition-colors"` 小触控模板回退。
  - 该切片只改 `/projects` 读侧列表链接 class 和源码级 UI 测试，不改项目查询、项目筛选、`projectId` 路由参数、server actions、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于项目列表链接缺少 `min-h-11` 且源码缺少 `projectListPanelLinkClassName`；GREEN 后 22 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 72 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 429 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.332.0] - 2026-06-08

### Fixed

- **[Phase E Projects Template Difficulty Label Localization]** 本地化 `/projects` 项目模板难度 badge，避免学习者在项目模板列表继续看到裸 `beginner / intermediate / advanced`。
  - `src/app/projects/ui/project-mission-workspace.tsx` 新增 `formatProjectTemplateDifficultyLabel()`，将 `beginner`、`intermediate`、`advanced` 分别显示为 `入门`、`进阶`、`高阶`，并为未知历史值显示 `当前难度：...`。
  - `src/app/projects/page.tsx` 在构造 `ProjectTemplateView` 时先映射模板难度展示值，保留 `DEFAULT_PROJECT_TEMPLATES`、项目创建保存契约和数据库字段不变。
  - `tests/unit/project-mission-workspace.test.ts` 新增回归，要求 page 使用难度标签 helper、禁止 `difficulty: template.difficulty` 直传，并确认组件收到 raw enum 时也不会直出英文枚举。
  - 该切片只改 `/projects` 项目模板读侧展示和源码级 UI 测试，不改 `DEFAULT_PROJECT_TEMPLATES` 类型、server actions、项目创建保存契约、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 page 缺少 `formatProjectTemplateDifficultyLabel(template.difficulty)` 且组件直显 `beginner/advanced`；GREEN 后 21 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 71 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地窄扫：`rg -n "difficulty:\\s*template\\.difficulty|>\\s*\\{template\\.difficulty\\}\\s*<|formatProjectTemplateDifficultyLabel|beginner|intermediate|advanced" src/app/projects/page.tsx src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts` 只命中 helper 映射、page helper 调用和测试反向断言，确认生产源码不再直传或直显项目模板难度 raw enum。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 428 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.331.0] - 2026-06-08

### Fixed

- **[Phase E Settings Profile Choice Display Localization]** 本地化 `/settings` 水平、难度和语言三个学习偏好选项展示，避免学习者继续看到裸 `beginner / intermediate / advanced`、`easy / standard / hard` 或 `zh / en` 提示。
  - `src/app/settings/page.tsx` 新增 `settingsChoiceSelectClassName`、`settingsLevelOptions`、`settingsDifficultyOptions`、`settingsLanguageOptions`、`settingsChoiceValue()` 和 `settingsChoiceOptions()`，将水平、难度和语言改为中文选项的原生 `<select>`。
  - 选项继续提交既有 raw value（如 `beginner`、`standard`、`zh`），并为历史自定义值显示 `当前自定义：...`，避免保存时丢失用户已有 profile 值。
  - `tests/unit/settings-profile.test.ts` 新增源码级回归，要求三个 choice 字段使用中文标签、移动友好 select class、既有提交值，并禁止旧 raw placeholder/defaultValue 模板回退。
  - 该切片只改 `/settings` 学习偏好读侧展示和源码级 UI 测试，不改 `updateSettingsAction()`、`UserProfile` 字段、Prisma 默认值、Daily Plan prompt、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/settings-profile.test.ts` 首次失败于缺少 choice select helper；GREEN 后 8 项通过，覆盖中文选项标签、raw 提交值、旧 raw placeholder/defaultValue 反向断言和既有 Settings 保存测试。
- 本地相关回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过，覆盖 Settings 表单、Auth/Preview 写保护、Daily Plan prompt 和共享学习 UI。
- 本地窄扫：`rg -n "placeholder=\\\"beginner / intermediate / advanced\\\"|placeholder=\\\"easy / standard / hard\\\"|placeholder=\\\"zh / en\\\"|defaultValue=\\{profile\\.level \\?\\? \\\"beginner\\\"\\}|defaultValue=\\{profile\\.difficulty \\?\\? \\\"standard\\\"\\}|defaultValue=\\{profile\\.language \\?\\? \\\"zh\\\"\\}" src/app/settings/page.tsx` 无匹配，确认 `/settings` 生产组件不再直出旧 choice 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 426 项通过，Next 构建生成 28 个页面，路由表包含 `/settings`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.330.0] - 2026-06-08

### Fixed

- **[Phase E Settings Goal Default Copy Localization]** 本地化 `/settings` 学习目标输入框默认文案，避免新用户或默认档案继续看到内部 slug `ai_general`。
  - `src/app/settings/page.tsx` 新增 `defaultSettingsGoalText = "系统化学习 AI 和工程实践"` 和 `formatSettingsGoalInputValue()`，将空目标或默认 `ai_general` 显示为中文学习目标，已有自定义目标保持原样。
  - `tests/unit/settings-profile.test.ts` 新增源码级回归，要求目标输入框 placeholder 和 defaultValue 使用中文学习目标 helper，并禁止旧 `placeholder="例如：ai_general"` 与 `profile.goal ?? "ai_general"` 回退。
  - 该切片只改 `/settings` 目标输入读侧默认文案和源码级 UI 测试，不改 `updateSettingsAction()`、`UserProfile.goal` 字段、Prisma 默认值、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/settings-profile.test.ts` 首次失败于缺少 `defaultSettingsGoalText` 和 `formatSettingsGoalInputValue()`；GREEN 后 7 项通过，覆盖目标输入中文默认文案和旧 raw `ai_general` 展示反向断言。
- 本地相关回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/learning-ui-components.test.ts` 46 项通过，覆盖 Settings 表单、Auth/Preview 写保护、Daily Plan prompt 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Settings Goal Default Copy|defaultSettingsGoalText|formatSettingsGoalInputValue|系统化学习 AI 和工程实践|0\\.330\\.0|ai_general" ...` 确认源码、测试、UI checklist、Settings 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "placeholder=\\\"例如：ai_general\\\"|defaultValue=\\{profile\\.goal \\?\\? \\\"ai_general\\\"\\}" src/app/settings/page.tsx` 无匹配，确认 `/settings` 生产组件不再直出旧目标输入默认模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 425 项通过，Next 构建生成 28 个页面，路由表包含 `/settings`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.329.0] - 2026-06-08

### Fixed

- **[Phase E Progress Generation Model Label Localization]** 本地化 `/progress` 生成稳定性卡的模型分布标签，避免学习者直接看到 `deepseek-v4-flash`、`deepseek-v4-pro` 或 raw `unknown` 模型值。
  - `src/app/progress/analytics-panels.tsx` 新增 `generationModelLabel()`，将 `deepseek-v4-flash`、`deepseek-v4-pro` 和 `unknown` 分别显示为 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro` 和 `AI 模型：未标记`；未知模型统一显示为 `AI 模型：其他`。
  - `tests/unit/progress-analytics.test.ts` 扩展生成稳定性卡静态渲染回归，要求模型分布显示学习者友好的中文标签，并禁止 raw model id 回退。
  - 该切片只改 `/progress` 生成稳定性卡读侧展示和测试，不改 `GenerationHealthMetrics`、`summarizeGenerationHealth()`、`AiGenerationJob` 聚合口径、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于生成稳定性卡缺少 `AI 模型：DeepSeek Flash`，GREEN 后 24 项通过，覆盖 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro`、`AI 模型：未标记`，并阻止 raw `deepseek-v4-flash`、`deepseek-v4-pro` 和 `AI 模型：unknown` 回归。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 62 项通过，覆盖 Progress、每日生成质量、首页标签、Library 标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Progress Generation Model Label|generationModelLabel|AI 模型：DeepSeek Flash|AI 模型：DeepSeek Pro|AI 模型：未标记|0\\.329\\.0|deepseek-v4-flash|AI 模型：unknown" ...` 确认源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "\\{row\\.model\\}: \\{row\\.count\\}|AI 模型：unknown|deepseek-v4-flash:|deepseek-v4-pro:" src/app/progress/analytics-panels.tsx` 无匹配，确认 `/progress` 生产组件不再直出旧 raw model 分布模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 424 项通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.328.0] - 2026-06-08

### Fixed

- **[Phase E Radar Type Filter Mobile Touch Targets]** 补齐 `/radar` 类型筛选入口的移动端触控高度，避免实体类型筛选 chips 继续使用小尺寸 `Badge asChild` 链接。
  - `src/app/radar/page.tsx` 新增 `radarTypeFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，并让 `全部` 和每个实体类型筛选直接渲染移动友好的 `Link`，保留 active/inactive 类型筛选状态。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，要求 Radar 类型筛选入口包含 `min-h-11`，并禁止旧 `<Badge asChild>` 小触控模板回退。
  - 该切片只改 `/radar` 类型筛选展示层和源码级 UI 测试，不改搜索/type 参数、实体查询、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/radar` 缺少 `radarTypeFilterLinkClassName` 且类型筛选仍使用旧 `<Badge asChild>` 小触控模板；GREEN 后 19 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 66 项通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Radar Type Filter|radarTypeFilterLinkClassName|0\\.328\\.0|类型筛选入口|Badge asChild" ...` 确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "<Badge asChild variant=\\{selectedType \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedType === group\\.type|inline-flex h-5 w-fit" src/app/radar/page.tsx tests/unit/knowledge-base.test.ts` 无匹配，确认 Radar 类型筛选不再使用旧小尺寸 Badge 链接模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 424 项通过，Next 构建生成 28 个页面，路由表包含 `/radar`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.327.0] - 2026-06-08

### Fixed

- **[Phase E Glossary Category Filter Mobile Touch Targets]** 补齐 `/glossary` 分类筛选入口的移动端触控高度，避免分类筛选 chips 继续使用小尺寸 `Badge asChild` 链接。
  - `src/app/glossary/page.tsx` 新增 `glossaryCategoryFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，并让 `全部` 和每个分类筛选直接渲染移动友好的 `Link`，保留 active/inactive 分类状态。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，要求 Glossary 分类筛选入口包含 `min-h-11`，并禁止旧 `<Badge asChild>` 小触控模板回退。
  - 该切片只改 `/glossary` 分类筛选展示层和源码级 UI 测试，不改搜索/category 参数、术语查询、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/glossary` 缺少 `glossaryCategoryFilterLinkClassName` 且分类筛选仍使用旧 `<Badge asChild>` 小触控模板；GREEN 后 18 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts` 51 项通过，覆盖 Knowledge Base/Radar、共享学习 UI、首页标签和 Today 知识卡入口。
- 本地覆盖扫描：`rg -n "Phase E Glossary Category Filter|glossaryCategoryFilterLinkClassName|0\\.327\\.0|分类筛选入口|Badge asChild" ...` 确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "<Badge asChild variant=\\{selectedCategory \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedCategory === c\\.category|inline-flex h-5 w-fit" src/app/glossary/page.tsx tests/unit/knowledge-base.test.ts` 无匹配，确认 Glossary 分类筛选不再使用旧小尺寸 Badge 链接模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 423 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.326.0] - 2026-06-08

### Fixed

- **[Phase E AppShell Header Actions Mobile Layout]** 收口全局 `AppShell` 页头 action 区的移动端布局，避免 Today、Review、Voice、Projects、Mistakes 等页面的页头 CTA 在窄屏被旧 `flex shrink-0` 容器横向挤压。
  - `src/components/app-shell.tsx` 将页头从固定 `h-14` 调整为移动端 `min-h-14 flex-wrap py-2`，桌面端保留 `sm:h-14 sm:flex-nowrap sm:py-0`。
  - `src/components/app-shell.tsx` 将 action wrapper 从 `flex shrink-0 items-center gap-2` 调整为 `grid w-full gap-2 sm:flex sm:w-auto sm:shrink-0 sm:items-center`，让手机端页头 action 默认独占一行，桌面端恢复紧凑横向布局。
  - `tests/unit/shared-ui-a11y.test.ts` 新增源码级回归，要求全局页头 action 区支持移动端全宽换行，并禁止旧固定高度和旧 `flex shrink-0` 模板回退。
  - 该切片只改共享 `AppShell` 页头展示层和源码级 UI 测试，不改页面业务 action、Preview Mode、auth、路由、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于 `AppShell` 仍使用固定 `h-14` header 和旧 `flex shrink-0 items-center gap-2` action 容器；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/mistakes-view.test.ts tests/unit/voice-note.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts` 90 项通过，覆盖共享 UI a11y、学习组件、Projects、Mistakes、Voice、首页、Library 和 Today 标签/触控目标。
- 本地覆盖扫描：`rg -n "Phase E AppShell Header Actions|0\\.326\\.0|AppShell Header Actions Mobile Layout|grid w-full gap-2 sm:flex sm:w-auto sm:shrink-0 sm:items-center|flex shrink-0 items-center gap-2" ...` 确认源码、测试、UI checklist、E2E/UI Smoke 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\"flex h-14 items-center justify-between gap-3 border-b bg-background px-4\"|className=\"flex shrink-0 items-center gap-2\"" src/components/app-shell.tsx` 无匹配，确认生产 `AppShell` 不再使用旧固定 header 或旧横向挤压 action wrapper 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 422 项通过，Next 构建生成 28 个页面，路由表包含 Today、Review、Voice、Projects、Mistakes、Weekly、Path 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.325.0] - 2026-06-08

### Fixed

- **[Phase E Projects Type Filter Mobile Touch Targets]** 补齐 `/projects` 项目类型筛选入口的移动端触控高度，避免类型筛选 chips 继续使用小尺寸 Badge 链接。
  - `src/app/projects/ui/project-mission-workspace.tsx` 新增 `projectTypeFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，并让 `ProjectTypeFilter` 直接渲染移动友好的 `Link`，保留 active/inactive 筛选状态。
  - `tests/unit/project-mission-workspace.test.ts` 新增静态渲染回归，要求项目类型筛选入口包含 `min-h-11`，并禁止旧 `<Badge asChild>` 小触控模板回退。
  - 该切片只改 `/projects` 类型筛选展示层和源码级 UI 测试，不改项目查询、`projectTypeHref()`、模板启动 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectTypeFilter` 仍渲染 `h-5` Badge 链接且缺少 `min-h-11`；GREEN 后 19 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 69 项通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Projects Type Filter|projectTypeFilterLinkClassName|0\\.325\\.0|项目类型筛选入口|Badge asChild" ...` 确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "<Badge key=\\{item\\.href\\} asChild|data-slot=\\\"badge\\\" data-variant|inline-flex h-5 w-fit" src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts` 无匹配，确认 Projects 类型筛选不再使用旧小尺寸 Badge 链接模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 421 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.324.0] - 2026-06-08

### Fixed

- **[Phase E Admin Recent Plan Action Row Mobile Layout]** 收口 `/admin` 最近每日计划卡片 action row 的移动端布局，避免 `查看课程`、`审计链路`、`设为正式` 和 `归档` 在窄屏横向挤压。
  - `src/app/admin/page.tsx` 新增 `adminRecentPlanActionRowClassName = "flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end"`，并让最近每日计划 action row 复用该 class；卡片首行外层同步允许 `flex-wrap`。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求最近每日计划 action row 接入 `adminRecentPlanActionRowClassName`，并禁止旧 `flex shrink-0 flex-wrap justify-end gap-2` 横向挤压模板回退。
  - 该切片只改 `/admin` 最近每日计划卡片 action row 展示层和源码级 UI 测试，不改 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminRecentPlanActionRowClassName` 且仍存在旧 `flex shrink-0 flex-wrap justify-end gap-2` 模板；GREEN 后 22 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 52 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Recent Plan Action Row|adminRecentPlanActionRowClassName|0\\.324\\.0|flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end|flex shrink-0 flex-wrap justify-end gap-2" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\\\"flex shrink-0 flex-wrap justify-end gap-2\\\"" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧横向挤压 action row 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 420 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.323.0] - 2026-06-08

### Fixed

- **[Phase E Admin Plan Audit Lesson Link Mobile Touch Targets]** 补齐 `/admin` 单条计划审计链路卡片里 `查看课程` 链接的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminPlanAuditLessonLinkClassName = "mt-1 inline-flex min-h-11 items-center text-primary underline underline-offset-2"`，并让单条计划审计链路里的课程链接复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求单条计划审计链路 `查看课程` 链接接入 `adminPlanAuditLessonLinkClassName`，并禁止旧内联小触控模板回退。
  - 该切片只改 `/admin` 单条计划审计链路课程链接展示层和源码级 UI 测试，不改 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminPlanAuditLessonLinkClassName`；GREEN 后 21 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 51 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Plan Audit Lesson Link|adminPlanAuditLessonLinkClassName|0\\.323\\.0|查看课程|Admin Plan Audit Lesson Link" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`sed -n '954,982p' src/app/admin/page.tsx | rg -n "查看课程|adminPlanAuditLessonLinkClassName|min-h-11|className=\"mt-1 inline-flex text-primary underline underline-offset-2\""` 确认单条计划审计链路 `查看课程` 链接接入 `adminPlanAuditLessonLinkClassName`，未发现旧内联小触控模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 419 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.322.0] - 2026-06-08

### Fixed

- **[Phase E Admin Recent Plan Governance CTA Mobile Touch Targets]** 补齐 `/admin` 最近每日计划列表里 `设为正式` 和 `归档` 维护按钮的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminRecentPlanGovernanceCtaClassName = "min-h-11 w-full sm:w-auto"`，并让最近每日计划里的 `设为正式` 与 `归档` 按钮复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求最近每日计划治理按钮接入 `adminRecentPlanGovernanceCtaClassName`，并禁止旧无 class 的 `size="sm"` 治理按钮模板回退。
  - 该切片只改 `/admin` 最近每日计划治理按钮展示层和源码级 UI 测试，不改 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminRecentPlanGovernanceCtaClassName`；修正测试截取窗口后 GREEN，20 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 50 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Recent Plan Governance CTA|adminRecentPlanGovernanceCtaClassName|0\\.322\\.0|设为正式|归档|Admin Recent Plan Governance" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`sed -n '1172,1232p' src/app/admin/page.tsx | rg -n "设为正式|归档|adminRecentPlanGovernanceCtaClassName|min-h-11 w-full sm:w-auto|<Button type=\"submit\" size=\"sm\" variant=\"secondary\" disabled=\\{!authed\\}>"` 确认最近每日计划 `设为正式` / `归档` 按钮接入 `adminRecentPlanGovernanceCtaClassName`，未发现旧无 class 小触控模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 418 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.321.0] - 2026-06-08

### Fixed

- **[Phase E Admin Failed Job Retry CTA Mobile Touch Targets]** 补齐 `/admin` 最近生成任务失败重试按钮的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminFailedJobRetryCtaClassName = "min-h-11 w-full sm:w-auto"`，并让失败生成任务里的 `重试此用户定时任务` 按钮复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求最近生成任务失败重试按钮接入 `adminFailedJobRetryCtaClassName`，并禁止旧无 class 的 `size="sm"` 重试按钮模板回退。
  - 该切片只改 `/admin` 最近生成任务失败重试按钮展示层和源码级 UI 测试，不改 `retryFailedDailyCronJobAction`、生成任务查询、状态文案、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminFailedJobRetryCtaClassName`；修正测试截取窗口后 GREEN，19 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 49 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Failed Job Retry CTA|adminFailedJobRetryCtaClassName|0\\.321\\.0|重试此用户定时任务|Admin Failed Job Retry" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`sed -n '1418,1438p' src/app/admin/page.tsx | rg -n "<Button type=\"submit\" size=\"sm\" variant=\"secondary\" disabled=\\{!authed\\}>|adminFailedJobRetryCtaClassName|min-h-11 w-full sm:w-auto"` 确认失败生成任务重试按钮接入 `adminFailedJobRetryCtaClassName`，未发现旧无 class 小触控模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 417 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.320.0] - 2026-06-08

### Fixed

- **[Phase E Admin Today Loop CTA Mobile Touch Targets]** 补齐 `/admin` 今日闭环操作区 11 个 action CTA 的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminTodayLoopCtaClassName = "min-h-11 w-full sm:w-auto"`，并让 `确保用户档案`、`初始化领域/主题`、`生成今日计划`、`完成今日计划并生成卡片`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`重建今日计划`、`归档所有测试计划`、`归档未来待完成计划`、`生成指定日期计划（localDate）` 和 `指定日期闭环检查（生成 → 完成 → 验证）` 复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求今日闭环卡片内 11 个 CTA 接入 `adminTodayLoopCtaClassName`，并禁止旧无 class 的 `size="sm"` 今日闭环按钮模板回退。
  - 该切片只改 `/admin` 今日闭环 action 展示层和源码级 UI 测试，不改 `ensureProfileAction`、`seedAction`、`generateTodayPlanAction`、`completeTodayPlanAction`、`loopCheckAction`、`runDailyCronAction`、`regenerateTodayAction`、归档 action、指定日期 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminTodayLoopCtaClassName`；GREEN 后 18 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 48 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Today Loop CTA|adminTodayLoopCtaClassName|0\\.320\\.0|确保用户档案|指定日期闭环检查|Admin Today Loop CTA" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`sed -n '580,700p' src/app/admin/page.tsx | rg -n "<Button type=\"submit\" size=\"sm\"...|adminTodayLoopCtaClassName|min-h-11 w-full sm:w-auto"` 确认今日闭环 11 个 action CTA 均接入 `adminTodayLoopCtaClassName`，未发现旧无 class 小触控模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 416 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.319.0] - 2026-06-08

### Fixed

- **[Phase E Admin Auth Controls Mobile Touch Targets]** 补齐 `/admin` 登录/退出认证控件的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminAuthInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"` 和 `adminAuthCtaClassName = "min-h-11 w-full sm:w-auto"`，并让未登录 shell 与环境卡中的 `ADMIN_SECRET` 输入、登录按钮和退出按钮复用对应 class。
  - `src/app/admin/page.tsx` 新增 `adminFormInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"`，收口同页今日闭环反思输入和指定日期输入，避免 `/admin` 继续保留裸小触控输入模板。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求认证输入和 CTA 接入共享 class，并禁止旧裸输入、裸登录按钮、环境卡裸登录按钮和裸退出按钮模板回退。
  - 该切片只改 `/admin` 展示层 class 和源码级 UI 测试，不改 `adminLoginAction`、`adminLogoutAction`、cookie、route protection、admin secret policy、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminAuthInputClassName` / `adminAuthCtaClassName`；GREEN 后 17 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 47 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Auth Controls|adminAuthInputClassName|adminAuthCtaClassName|adminFormInputClassName|0\\.319\\.0|ADMIN_SECRET|退出 admin" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\\\"w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none\\\"|<Button type=\\\"submit\\\" size=\\\"sm\\\">\\s*登录\\s*</Button>|<Button type=\\\"submit\\\" size=\\\"sm\\\">登录（写入 httpOnly cookie）</Button>|<Button type=\\\"submit\\\" size=\\\"sm\\\" variant=\\\"secondary\\\">退出 admin</Button>" src/app/admin/page.tsx src/app/admin/ui/prompt-studio-card.tsx` 无匹配，确认旧裸小触控输入和裸认证按钮模板不再存在于当前 Admin 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 415 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.318.0] - 2026-06-08

### Fixed

- **[Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets]** 补齐 `/admin` Prompt Studio 指定日期重建输入框的移动端触控高度。
  - `src/app/admin/ui/prompt-studio-card.tsx` 新增 `promptStudioInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"`，并让 `name="localDate"` 的 `YYYY-MM-DD` 输入框复用该 class。
  - `tests/unit/admin-prompt-studio.test.ts` 新增源码级回归，要求 Prompt Studio 重建日期输入接入 `promptStudioInputClassName`，并禁止旧裸输入 class 回退。
  - 该切片只改 Prompt Studio 表单输入展示层和源码级 UI 测试，不改 `regeneratePlanForLocalDateAction`、手动修复状态聚合、模型调用、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 首次失败于 `PromptStudioCard` 缺少 `promptStudioInputClassName`；GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 47 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Prompt Studio Regenerate Date Input|promptStudioInputClassName|0\\.318\\.0|YYYY-MM-DD|重新生成某日期计划" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\\\"w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none\\\"" src/app/admin/ui/prompt-studio-card.tsx` 无匹配，确认 Prompt Studio 不再使用旧裸日期输入小触控模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 415 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.317.0] - 2026-06-08

### Fixed

- **[Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets]** 补齐 `/admin` Prompt Studio 中 `重新生成某日期计划（测试）` CTA 的移动端触控高度。
  - `src/app/admin/ui/prompt-studio-card.tsx` 新增 `promptStudioCtaClassName = "min-h-11 w-full sm:w-auto"`，并让指定日期重建按钮复用该 class。
  - `tests/unit/admin-prompt-studio.test.ts` 新增源码级回归，要求 Prompt Studio 重建 CTA 接入 `promptStudioCtaClassName`，并禁止旧无 class 的 `size="sm"` 模板回退。
  - 该切片只改 Prompt Studio 表单按钮展示层和源码级 UI 测试，不改 `regeneratePlanForLocalDateAction`、手动修复状态聚合、模型调用、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 首次失败于 `PromptStudioCard` 缺少 `promptStudioCtaClassName`；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 45 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "promptStudioCtaClassName|min-h-11 w-full sm:w-auto|重新生成某日期计划|Prompt Studio Regenerate" src/app/admin/ui/prompt-studio-card.tsx tests/unit/admin-prompt-studio.test.ts` 确认源码和测试接入本切片。
- 本地窄扫：`rg -n -U "<Button type=\\\"submit\\\" size=\\\"sm\\\" variant=\\\"secondary\\\" disabled=\\{!authed\\}>\\n\\s*重新生成某日期计划（测试）" src/app/admin/ui/prompt-studio-card.tsx` 无匹配，确认 Prompt Studio 不再使用旧无 class 的重建小触控按钮模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 413 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.316.0] - 2026-06-08

### Fixed

- **[Phase E Admin Plan Audit Close CTA Mobile Touch Targets]** 补齐 `/admin` 单条计划审计链路卡片中 `关闭审计` 按钮的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminPlanAuditCloseCtaClassName = "min-h-11 px-3"`，并让 `关闭审计` 按钮复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求单条计划审计链路 header 中的 `关闭审计` 按钮接入 `adminPlanAuditCloseCtaClassName`，并禁止旧无 class 的 `size="xs"` 模板回退。
  - 该切片只改 `/admin` 单条计划审计链路展示层和源码级 UI 测试，不改 `planFilterHref()`、审计链路读取、计划治理 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminPlanAuditCloseCtaClassName`；GREEN 后 16 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 44 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "adminPlanAuditCloseCtaClassName|min-h-11 px-3|关闭审计|Admin Plan Audit Close" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts` 确认源码和测试接入本切片。
- 本地窄扫：`rg -n -U "<Button asChild size=\\\"xs\\\" variant=\\\"secondary\\\">\\n\\s*<a href=\\{planFilterHref\\(planFilter\\)\\}>关闭审计</a>" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧无 class 的关闭审计小触控按钮模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 412 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.315.0] - 2026-06-08

### Fixed

- **[Phase E Admin Audit Exception Link Mobile Touch Targets]** 补齐 `/admin` 计划审计异常列表中 `审计链路` 按钮的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminAuditExceptionLinkClassName = "min-h-11 px-3 shrink-0"`，并让计划审计异常条目的 `审计链路` 按钮复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求审计异常 `审计链路` 按钮接入 `adminAuditExceptionLinkClassName`，并禁止旧 `className="shrink-0"` 小触控模板回退。
  - 该切片只改 `/admin` 计划审计异常列表展示层和源码级 UI 测试，不改 `buildAdminPlanAuditExceptions()`、`planAuditHref()`、计划治理 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminAuditExceptionLinkClassName`；GREEN 后 15 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 43 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "adminAuditExceptionLinkClassName|min-h-11 px-3 shrink-0|audit exception|审计异常|Admin Audit Exception Link" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts` 确认源码和测试接入本切片。
- 本地窄扫：`rg -n "<Button asChild size=\\\"xs\\\" variant=\\\"secondary\\\" className=\\\"shrink-0\\\">" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧审计异常小触控按钮模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 411 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.314.0] - 2026-06-08

### Fixed

- **[Phase E Admin Recent Plan Filter CTA Mobile Touch Targets]** 补齐 `/admin` 最近每日计划筛选按钮的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminPlanFilterCtaClassName = "min-h-11 px-3"`，并让最近计划筛选区 `正式 / 测试 / 已归档 / 全部` 四个 `size="xs"` 按钮复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求最近计划筛选按钮接入 `adminPlanFilterCtaClassName`，并禁止旧无 class 的 `size="xs"` 筛选按钮模板回退。
  - 该切片只改 `/admin` 最近每日计划筛选按钮展示层和源码级 UI 测试，不改 `normalizeAdminPlanFilter()`、`buildAdminPlanFilterWhere()`、`planFilterHref()`、计划治理 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminPlanFilterCtaClassName`；GREEN 后 14 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 42 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "adminPlanFilterCtaClassName|min-h-11 px-3|recent plan filter|最近每日计划（10）|Admin Recent Plan Filter" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts` 确认源码和测试接入本切片。
- 本地窄扫：`rg -n "<Button key=\\{filter\\} asChild size=\\\"xs\\\" variant=\\{planFilter === filter \\? \\\"default\\\" : \\\"secondary\\\"\\}>" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧无 class 的最近计划筛选按钮模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 410 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.313.0] - 2026-06-08

### Fixed

- **[Phase E Admin Recent Plan Link Mobile Touch Targets]** 补齐 `/admin` 最近每日计划列表里的 `查看课程` 和 `审计链路` 链接移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminRecentPlanLinkClassName = "inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2"`，并让最近计划列表两个维护链接复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求最近计划链接包含 `inline-flex min-h-11`，并禁止旧 `text-xs` 纯内联下划线小触控 class 回退。
  - 该切片只改 `/admin` 最近每日计划列表展示层和源码级 UI 测试，不改计划治理 action、`planAuditHref()`、课程路由、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminRecentPlanLinkClassName`，且最近计划链接仍使用旧小触控 inline class；GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 41 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Recent Plan Link|adminRecentPlanLinkClassName|最近每日计划|0\\.313\\.0|inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\"text-xs text-primary underline underline-offset-2\"" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧最近计划小触控 inline class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 409 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.312.0] - 2026-06-08

### Fixed

- **[Phase E Admin Knowledge Verification Link Mobile Touch Targets]** 补齐 `/admin` 来源核验队列条目标题链接的移动端触控高度。
  - `src/app/admin/page.tsx` 新增 `adminKnowledgeVerificationLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2"`，并让来源核验队列标题链接复用该 class。
  - `tests/unit/admin-page-labels.test.ts` 新增源码级回归，要求 `/admin` 来源核验队列链接包含 `inline-flex min-h-11`，并禁止旧纯内联下划线小触控 class 回退。
  - 该切片只改 `/admin` 来源核验队列展示层和源码级 UI 测试，不改 `summarizeKnowledgeVerificationQueue()`、审核原因、href、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `adminKnowledgeVerificationLinkClassName`，且来源核验队列链接仍使用旧小触控 inline class；GREEN 后 12 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 40 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n "Phase E Admin Knowledge Verification Link|adminKnowledgeVerificationLinkClassName|来源核验队列|0\\.312\\.0|inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2" ...` 确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\"font-medium text-primary underline underline-offset-2\"" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再使用旧来源核验队列小触控 inline class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 408 项通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.311.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Map Next Focus Link Mobile Touch Targets]** 补齐 `/map` 领域详情底部 `下一步建议` 里的 `优先补` 领域链接移动端触控高度。
  - `src/app/map/page.tsx` 新增 `mapNextFocusLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2"`，并让 `mapInsights.nextFocus` 链接复用该 class。
  - `tests/unit/map-analytics.test.ts` 新增源码级回归，要求 next focus 链接包含 `inline-flex min-h-11`，并禁止旧纯内联下划线小触控 class 回退。
  - 该切片只改 `/map` 领域详情底部 next focus 链接展示层和源码级 UI 测试，不改 `buildKnowledgeMapInsights()`、next focus 排序/理由、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于 `/map` 缺少 `mapNextFocusLinkClassName`，且 next focus 链接仍使用旧小触控 inline class；GREEN 后 14 项通过。
- 本地相关回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 88 项通过，覆盖 Knowledge Map、首页标签、Today、Glossary/Radar、共享学习 UI 和 Progress。
- 本地覆盖扫描：`rg -n "Phase E Knowledge Map Next Focus Link|mapNextFocusLinkClassName|优先补|0\\.311\\.0|inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2" ...` 确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\"font-medium text-primary underline underline-offset-2\"" src/app/map/page.tsx` 无匹配，确认 `/map` 生产源码不再使用旧 next focus 小触控 inline class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 407 项通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.310.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Source External Link Mobile Touch Targets]** 补齐 `/glossary` 与 `/radar` 详情页来源外链的移动端触控高度。
  - `src/app/glossary/page.tsx` 新增 `glossarySourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"`，并让术语详情来源外链复用该 class。
  - `src/app/radar/page.tsx` 新增 `radarSourceLinkClassName = "inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"`，并让实体详情来源外链复用该 class。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，要求 Glossary/Radar 来源外链包含 `inline-flex min-h-11`，并禁止旧纯文本下划线小触控 class 回退。
  - 该切片只改 `/glossary` 和 `/radar` 来源外链展示层与源码级 UI 测试，不改 `sourceRefs` 数据、来源核验规则、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/glossary` 缺少 `glossarySourceLinkClassName`，GREEN 后 17 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 63 项通过，覆盖 Glossary/Radar、Knowledge Map、Today、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Knowledge Source External Link|glossarySourceLinkClassName|radarSourceLinkClassName|来源外链|0\\.310\\.0|inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline" ...` 确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis checkpoint 均接入本切片。
- 本地窄扫：`rg -n "className=\"text-primary underline-offset-4 hover:underline\"" src/app/glossary/page.tsx src/app/radar/page.tsx` 无匹配，确认 `/glossary` 与 `/radar` 生产源码不再使用旧来源外链小触控 class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 406 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.309.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Map Domain Link Mobile Touch Targets]** 补齐 `/map` 领域列表每条领域入口的移动端触控高度。
  - `src/app/map/page.tsx` 新增 `mapDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并让领域列表 Link 复用该 class。
  - `tests/unit/map-analytics.test.ts` 新增源码级回归，要求领域列表链接包含 `min-h-11`，并禁止旧小触控 inline class 回退。
  - 该切片只改 `/map` 领域列表链接展示层和源码级 UI 测试，不改 `buildVisibleKnowledgeMapTopics()` 首屏窗口、当前领域保留逻辑、领域排序、统计口径、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于 `/map` 缺少 `mapDomainLinkClassName`，GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 86 项通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 回归。
- 本地覆盖扫描：`rg -n "Phase E Knowledge Map Domain Link|mapDomainLinkClassName|领域列表每条领域入口|0\\.309\\.0|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors" ...` 确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "\"rounded-md border px-3 py-2 text-sm transition-colors\",\\s*active \\?" src/app/map/page.tsx` 无匹配，确认 `/map` 生产源码不再使用旧领域列表小触控 inline class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 405 项通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.308.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Map ReviewLog Copy Localization]** 本地化 `/map` 领域详情里的复习日志可见文案，避免学习者界面直出数据库模型名。
  - `src/app/map/page.tsx` 将领域详情统计从 `ReviewLog：{stat.reviewLogCount}` 改为 `复习记录：{stat.reviewLogCount}`。
  - `src/app/map/page.tsx` 将掌握分说明从 `ReviewLog * 2` 改为 `复习记录 * 2`，保持 `calculateKnowledgeMapMasteryScore()` 计算口径不变。
  - `tests/unit/map-analytics.test.ts` 新增源码级回归，要求 `/map` 使用学习者文案，并禁止 `ReviewLog：{stat.reviewLogCount}` 和公式说明里的 `ReviewLog * 2` 回退。
  - 该切片只改 `/map` 领域详情读侧文案和源码级 UI 测试，不改 `reviewLogCount` 聚合、掌握分公式函数、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于 `/map` 领域详情仍显示 `ReviewLog：{stat.reviewLogCount}`，GREEN 后 12 项通过。
- 本地相关回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts` 85 项通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 复习记录文案。
- 本地覆盖扫描：`rg -n "Phase E Knowledge Map ReviewLog|复习记录：\\{stat\\.reviewLogCount\\}|ReviewLog：\\{stat\\.reviewLogCount\\}|掌握分 = 完成课程 \\* 10 \\+ 复习记录 \\* 2|掌握分 = 完成课程 \\* 10 \\+ ReviewLog \\* 2|0\\.308\\.0" ...` 确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "ReviewLog：\\{stat\\.reviewLogCount\\}|掌握分 = 完成课程 \\* 10 \\+ ReviewLog \\* 2" src/app/map/page.tsx` 无匹配，确认 `/map` 生产源码不再直出旧 `ReviewLog` 可见模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 404 项通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.307.0] - 2026-06-08

### Fixed

- **[Phase E Voice Recent Note Link Mobile Touch Targets]** 补齐 `/voice` 最近语音笔记列表回看入口的移动端触控高度。
  - `src/app/voice/page.tsx` 新增 `voiceRecentNoteLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并让最近语音笔记列表每条链接复用该 class。
  - `tests/unit/voice-note.test.ts` 新增源码级回归，要求最近语音笔记链接包含 `min-h-11`，并禁止旧小触控 inline class 回退。
  - 该切片只改 `/voice` 最近列表链接展示层和源码级 UI 测试，不改 `VoiceNote` 查询、Voice 保存/转写、Coach handoff、Note/Flashcard 动作、Review queue、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `/voice` 缺少 `voiceRecentNoteLinkClassName`，GREEN 后 15 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 75 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff、Review queue 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Voice Recent Note|voiceRecentNoteLinkClassName|最近语音笔记|0\\.307\\.0|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors" ...` 确认源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "className=\\{\\[\\s*\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\"|className=\\{cn\\(\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\"" src/app/voice/page.tsx` 无匹配，确认 `/voice` 生产源码不再使用旧 inline 小触控 class。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 403 项通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.306.0] - 2026-06-08

### Fixed

- **[Phase E Progress Summary Internal Model Copy Localization]** 本地化 `/progress` 概览卡片的内部模型名文案，减少学习者界面后台感。
  - `src/app/progress/page.tsx` 将连续天数说明从 `以 DailyPlan.completed 为准（用户时区日期）` 改为 `以完成学习日为准（用户时区日期）`。
  - `src/app/progress/page.tsx` 将复习日志计数从 `ReviewLog：{reviewLogsCount}` 改为 `复习记录：{reviewLogsCount}`。
  - `tests/unit/progress-analytics.test.ts` 新增源码级回归，要求 `/progress` 概览卡使用学习者文案，并禁止 `DailyPlan.completed` 和 `ReviewLog：{reviewLogsCount}` 回退。
  - 该切片只改 `/progress` 概览卡读侧文案和源码级 UI 测试，不改 `DailyPlan.completed` 统计口径、`ReviewLog` 计数、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 仍显示 `以 DailyPlan.completed 为准` 和 `ReviewLog：{reviewLogsCount}`，GREEN 后 24 项通过。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts` 69 项通过，覆盖 Progress、首页标签、共享学习 UI、Review summary、Knowledge Map 和 Weekly 回归。
- 本地覆盖扫描：`rg -n "以完成学习日为准|复习记录：\\{reviewLogsCount\\}|以 DailyPlan\\.completed 为准|ReviewLog：\\{reviewLogsCount\\}|Phase E Progress Summary Internal|0\\.306\\.0" ...` 确认 `/progress` 生产源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 402 项通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.305.0] - 2026-06-08

### Fixed

- **[Phase E Review Total Record Copy Localization]** 本地化 `/review` 复习统计卡累计记录文案，避免学习者界面显示数据库模型名。
  - `src/app/review/page.tsx` 将统计卡标签从 `累计 ReviewLog` 改为 `累计复习记录`。
  - `tests/unit/learning-ui-components.test.ts` 新增源码级回归，要求 `/review` 使用学习者文案，并禁止 `累计 ReviewLog` 回退。
  - 该切片只改 `/review` 读侧文案和源码级 UI 测试，不改 `ReviewLog` 写入、复习队列过滤、评分调度、统计口径、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `/review` 仍显示 `累计 ReviewLog`，GREEN 后 25 项通过。
- 本地相关回归：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-schedule.test.ts tests/unit/review-filter.test.ts` 36 项通过，覆盖 Review UI、完成 summary、复习调度和队列过滤。
- 本地覆盖扫描：`rg -n "累计复习记录|累计 ReviewLog|Phase E Review Total Record|0\\.305\\.0" ...` 确认 `/review` 生产源码、测试、UI checklist、Review 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 401 项通过，Next 构建生成 28 个页面，路由表包含 `/review`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.304.0] - 2026-06-08

### Fixed

- **[Phase E Progress Weak Topic Copy Localization]** 本地化 `/progress` 薄弱主题卡片的领域兜底和接触次数文案，减少学习者可见 raw label。
  - `src/app/progress/page.tsx` 新增 `formatProgressWeakTopicDomainLabel()`，领域缺失时显示 `未标记领域`。
  - 薄弱主题卡片现在显示 `领域：... / 接触次数：N`，不再显示裸 `-` 或英文 `exposure N`。
  - `tests/unit/progress-analytics.test.ts` 新增源码级回归，防止 `topic?.domain.name ?? "-"` 和 `exposure {s.exposureCount}` 回退。
  - 该切片只改 `/progress` 薄弱主题读侧文案和源码级测试，不改 `UserTopicState.exposureCount`、`weakTopicStates` 排序、Topic 查询、统计口径、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于缺少 `formatProgressWeakTopicDomainLabel()` 且仍显示旧 `exposure` 模板，GREEN 后 23 项通过。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts` 83 项通过，覆盖 Progress、首页标签、Projects、共享学习 UI、Knowledge Map 和 Weekly 回归。
- 本地覆盖扫描：`rg -n "formatProgressWeakTopicDomainLabel|接触次数：\\{s\\.exposureCount\\}|exposure \\{s\\.exposureCount\\}|topic\\?\\.domain\\.name \\?\\? \\\"-\\\"|Phase E Progress Weak Topic|薄弱主题" ...` 确认 `/progress` 生产源码接入新 helper 和 `接触次数` 文案，旧 `exposure` / `-` 模板不再存在于生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 400 项通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.303.0] - 2026-06-08

### Fixed

- **[Phase E Voice Note Visible Copy Localization]** 本地化学习者可见的 Voice Note/Voice 文案，统一显示为 `语音笔记`。
  - `/voice` 当前笔记、空态、价值说明、最近列表、录音状态、表单步骤、语音学习流水线和当前最优动作文案不再显示 `Voice Note` / `Voice Notes` 或裸 `transcript`。
  - `/coach` Voice 来源面板显示 `来自语音笔记`、`查看语音笔记`，但内部 `source=voice-note` focused review 队列契约保持不变。
  - `/weekly` 7 天总览、Weekly Markdown 和 `weeklyMistakeSourceLabel("voice")` 显示 `语音笔记`；学习徽章显示 `首次语音笔记`；`/notes` 选中语音笔记沉淀来的当前笔记显示 `来自语音笔记的当前笔记`。
  - `tests/e2e/voice-interactions.spec.ts` 同步更新真实浏览器 locator，仍验证 Voice → Coach → `/review?source=voice-note` 路径。
  - 该切片只改读侧文案、测试和文档，不改 `VoiceNote` 数据模型、`voice-note` tags/source、Coach handoff URL、Review filter、Voice 保存/转写/制卡逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts` 首次失败于旧 `Voice Note` / `Voice Notes` / `首次 Voice Note` 可见文案；GREEN 后 73 项通过。
- 本地 Notes RED/GREEN：`npm test -- tests/unit/notes-page-ui.test.ts` 首次失败于旧 `来自 Voice 的当前笔记`；GREEN 合并复跑 `npm test -- tests/unit/notes-page-ui.test.ts tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts` 74 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/review-filter.test.ts tests/unit/review-session-summary.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts` 121 项通过，覆盖 Voice、Weekly、Coach、Notes、学习动机、Review queue/source 和 Progress/Home 回归。
- 本地覆盖扫描：`rg -n "Voice Note|Voice Notes|当前 Voice|最近 Voice|保存 Voice|查看 Voice|来自 Voice|首次 Voice|Voice Note：" src/app src/server/learning src/server/voice/pipeline-next-action.ts tests/e2e/voice-interactions.spec.ts ...` 确认生产 UI 源码和 E2E locator 不再保留旧可见文案；`Voice Note` 只保留在测试反向断言和服务端内部 Coach prompt 回归中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 399 项通过，Next 构建生成 28 个页面，路由表包含 `/voice`、`/coach`、`/weekly` 和 `/notes`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.302.0] - 2026-06-08

### Fixed

- **[Phase E Settings Runtime Env Fallback Localization]** 优化 `/settings` 系统卡 `NODE_ENV` 缺省展示，避免维护界面显示裸 `unknown`。
  - `src/app/settings/page.tsx` 新增 `formatSettingsRuntimeEnvLabel()`，真实 `NODE_ENV` 值保持原样展示；缺失或空白时显示 `未标记环境`。
  - `tests/unit/settings-profile.test.ts` 新增源码级回归，要求系统卡通过 helper 渲染运行环境，并防止旧 `process.env.NODE_ENV ?? "unknown"` 回退。
  - 该切片只改 `/settings` 系统卡展示兜底和源码级 UI 测试，不改 `getBuildInfo()`、环境变量读取、Provider/secret 边界、`updateSettingsAction()`、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/settings-profile.test.ts` 首次失败于缺少 `formatSettingsRuntimeEnvLabel()` 且仍显示旧 `unknown` fallback，GREEN 后 6 项通过。
- 本地相关回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts tests/unit/shared-ui-a11y.test.ts` 43 项通过，覆盖 Settings 表单/系统卡、Auth/Preview 写保护、共享学习 UI 和共享 a11y 文案。
- 本地覆盖扫描：`rg -n "Phase E Settings Runtime Env|formatSettingsRuntimeEnvLabel|未标记环境|process\\.env\\.NODE_ENV \\?\\? \\\"unknown\\\"|0\\.302\\.0" ...` 确认源码、测试、UI checklist、Settings 模块文档、CHANGELOG 和 Aegis 记录接入本切片，旧 `unknown` fallback 只保留在测试反向断言/历史记录中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 398 项通过，Next 构建生成 28 个页面，路由表包含 `/settings`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.301.0] - 2026-06-08

### Fixed

- **[Phase E Library Filter Placeholder Label Hints]** 优化 `/library` 治理筛选表单 placeholder，减少学习者可见 raw label 泄露。
  - `src/app/library/page.tsx` 将 `source` placeholder 从裸 `deepseek / fallback / admin` 改为 `AI 生成 deepseek / 模板兜底 template / 后台重建 admin`，将 `status` placeholder 从裸 `planned / completed` 改为 `待完成 planned / 已完成 completed`。
  - `tests/unit/library-page-labels.test.ts` 新增源码级回归，要求筛选 placeholder 同时解释中文业务含义和可输入 raw 值，并防止旧裸 raw placeholder 回退。
  - 该切片只改 `/library` 筛选表单展示提示和源码级 UI 测试，不改 `source` / `status` 查询参数、`normalizeLibraryPlanFilters()`、`buildLibraryPlanWhere()`、课程可见性、Notes 权限、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于旧裸 raw placeholder，GREEN 后 7 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 59 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Library Filter Placeholder|AI 生成 deepseek|模板兜底 template|待完成 planned|0\\.301\\.0|筛选表单 placeholder|library filter placeholders" ...` 确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "placeholder=\\\"deepseek / fallback / admin\\\"|placeholder=\\\"planned / completed\\\"" src/app/library/page.tsx` 无匹配，确认旧裸 raw placeholder 不再存在于 `/library` 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 397 项通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.300.0] - 2026-06-08

### Fixed

- **[Phase E Coach Include Lesson Checkbox Mobile Touch Target]** 补齐 `/coach` 表单 `关联最近课程` checkbox label 的移动端触控高度。
  - `src/app/coach/page.tsx` 新增 `coachIncludeLessonLabelClassName = "flex min-h-11 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"`，并让 `关联最近课程` label 复用该 class。
  - `tests/unit/coach-workspace.test.ts` 新增源码级回归，要求 `关联最近课程` checkbox label 包含 `min-h-11`，并防止旧 inline 小触控模板回退。
  - 该切片只改 `/coach` 表单 checkbox label 展示层和源码级 UI 测试，不改 `includeTodayLesson` 提交字段、课程关联校验、Coach 上下文构建、Voice handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 `关联最近课程` checkbox label 缺少 `coachIncludeLessonLabelClassName`，GREEN 后 16 项通过。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 65 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Coach Include Lesson Checkbox|coachIncludeLessonLabelClassName|关联最近课程|0\\.300\\.0|flex min-h-11 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm" ...` 确认源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "<label className=\\\"flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm\\\"" src/app/coach/page.tsx` 无匹配，确认旧小触控 inline 模板不再存在于 `/coach` 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 396 项通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.299.0] - 2026-06-08

### Fixed

- **[Phase E Today Quiz Option Mobile Touch Targets]** 补齐 `/today` 小测验答案选项的移动端触控高度。
  - `src/app/today/ui/today-quiz.tsx` 新增 `todayQuizOptionLabelClassName = "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40"`，并让单选、多选、判断题的每个选项 label 复用该 class。
  - `tests/unit/today-activity-labels.test.ts` 新增源码/渲染回归，要求小测验 6 个示例选项均包含 `min-h-11`，并防止旧 inline 小触控模板回退。
  - 该切片只改 `/today` 小测验选项展示层和源码级 UI 测试，不改 `submitQuizAttemptAction`、判题逻辑、错题卡生成、DailyPlan 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于小测验答案选项缺少 `todayQuizOptionLabelClassName`，GREEN 后 6 项通过。
- 本地相关回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 45 项通过，覆盖 Today 标签、阶段状态、完成后下一步、共享学习 UI 和每日内容生成提示。
- 本地覆盖扫描：`rg -n "Phase E Today Quiz Option|todayQuizOptionLabelClassName|小测验答案选项|0\\.299\\.0|flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40" ...` 确认源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "className=\\\"flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40\\\"" src/app/today/ui/today-quiz.tsx` 无匹配，确认旧小触控 inline 模板不再存在于 `/today` 小测验生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 395 项通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.298.0] - 2026-06-08

### Fixed

- **[Phase E Coach Remediation Queue Link Mobile Touch Targets]** 补齐 `/coach` 补弱队列里 `误区` 和 `代码反馈` 跳转卡片的移动端触控高度。
  - `src/app/coach/ui/coach-workspace.tsx` 新增 `coachRemediationQueueLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/60"`，并让补弱队列两个 Link 复用该 class。
  - `tests/unit/coach-workspace.test.ts` 扩展补弱队列回归，要求 `/coach` 和 `/review?source=code-feedback` 两个跳转卡片都包含 `min-h-11`，并防止旧 inline 小触控模板回退。
  - 该切片只改 `/coach` 补弱队列展示层和源码级 UI 测试，不改 `CoachRemediationQueue` 输入来源、排序、href、Review source filter、misconception 沉淀、Coach 生成逻辑、Voice handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于补弱队列 `误区` / `代码反馈` 跳转卡片缺少 `min-h-11`，GREEN 后 15 项通过。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Coach Remediation Queue|coachRemediationQueueLinkClassName|补弱队列|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/60|0\\.298\\.0" ...` 确认源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "className=\\{cn\\(\\\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/60\\\"" src/app/coach/ui/coach-workspace.tsx` 无匹配，确认旧补弱队列小触控 inline 模板不再存在于 `/coach` 工作区生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 394 项通过，Next 构建生成 28 个页面，路由表包含 `/coach`、`/review` 和 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.297.0] - 2026-06-08

### Fixed

- **[Phase E Progress Weak Domain Link Mobile Touch Targets]** 补齐 `/progress` `薄弱领域` 列表每个领域入口的移动端触控高度。
  - `src/app/progress/analytics-panels.tsx` 新增 `progressWeakDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"`，并将薄弱领域 Link 接入该 class。
  - `tests/unit/progress-analytics.test.ts` 新增源码级回归，要求 `薄弱领域` 列表入口使用专用大触控 class，并防止旧小触控模板回退。
  - 该切片只改 `/progress` 薄弱领域展示层和源码级 UI 测试，不改 `buildProgressWeakDomainSummary()`、统计口径、Prisma 查询、`/map` 路由参数、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 缺少 `progressWeakDomainLinkClassName`，GREEN 后 22 项通过。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 70 项通过，覆盖 Progress analytics、Knowledge Map、首页标签、Today、Library 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Progress Weak Domain|progressWeakDomainLinkClassName|薄弱领域|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.297\\.0" ...` 确认源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "className=\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/50\"" src/app/progress/analytics-panels.tsx` 无匹配，确认旧薄弱领域小触控模板不再存在于 `/progress` 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 394 项通过，Next 构建生成 28 个页面，路由表包含 `/progress` 和 `/map`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.296.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Map Related Lesson Link Mobile Touch Targets]** 补齐 `/map` 领域详情 `相关课程` 每条课程入口的移动端触控高度。
  - `src/app/map/page.tsx` 新增 `mapRelatedLessonLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"`，并将领域详情 `相关课程` Link 接入该 class。
  - `tests/unit/map-analytics.test.ts` 新增源码级回归，要求 `相关课程` Link 使用专用大触控 class，并防止旧小触控模板回退。
  - 该切片只改 `/map` 领域详情相关课程展示层和源码级 UI 测试，不改 `aggregateKnowledgeMapStats()`、`buildKnowledgeMapInsights()`、领域统计、DailyPlan 查询、状态/来源标签、课程库路由参数、`/today` 生成逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于 `/map` 缺少 `mapRelatedLessonLinkClassName`，GREEN 后 11 项通过。
- 本地相关回归：`npm test -- tests/unit/map-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts` 64 项通过，覆盖 Knowledge Map、Library、Today、首页标签、共享学习 UI 和 Glossary/Radar 知识路径。
- 本地覆盖扫描：`rg -n "Phase E Knowledge Map Related Lesson|mapRelatedLessonLinkClassName|相关课程|领域详情.*相关课程|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.296\\.0" ...` 确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "className=\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/50\"" src/app/map/page.tsx` 无匹配，确认旧相关课程小触控模板不再存在于 `/map` 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 393 项通过，Next 构建生成 28 个页面，路由表包含 `/map` 和 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.295.0] - 2026-06-08

### Fixed

- **[Phase E Library Lesson List Link Mobile Touch Targets]** 补齐 `/library` 课程列表每条课程入口的移动端触控高度。
  - `src/app/library/page.tsx` 新增 `libraryPlanLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并将课程列表 Link 接入该 class。
  - `tests/unit/library-page-labels.test.ts` 新增源码级回归，要求课程列表 Link 使用专用大触控 class，并防止旧小触控模板回退。
  - 该切片只改 `/library` 课程列表展示层和源码级 UI 测试，不改课程筛选、详情权限、DailyPlan 查询、Notes、Today 完成链路、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 缺少 `libraryPlanLinkClassName`，GREEN 后 6 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 58 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Library Lesson List Link|libraryPlanLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|课程列表每条课程入口|0\\.295\\.0" ...` 确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "\"rounded-md border px-3 py-2 text-sm transition-colors\",\\s*active \\?" src/app/library/page.tsx` 无匹配，确认旧课程列表小触控模板不再存在于 `/library` 生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 392 项通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.294.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Relation Link Mobile Touch Targets]** 补齐 `/glossary` 相关术语链和 `/radar` 关系卡片链内部跳转入口的移动端触控高度。
  - `src/app/glossary/page.tsx` 新增 `glossaryRelatedTermLinkClassName`，让相关术语链的可点击术语入口显式接入 `inline-flex min-h-11`，手机端默认单列显示。
  - `src/app/radar/page.tsx` 新增 `radarRelationLinkClassName`，让关系卡片链每个可点击关系项显式接入 `min-h-11`。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，覆盖 Glossary/Radar 详情关系跳转入口的触控目标，并防止旧小 Badge 链接和旧关系卡片 class 回退。
  - 该切片只改 Glossary/Radar 详情页内部关系跳转展示层和源码级 UI 测试，不改关系计算、查询条件、路由参数、复习卡片生成 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/glossary` 缺少 `glossaryRelatedTermLinkClassName`，GREEN 后 16 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 57 项通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Knowledge Relation Link|glossaryRelatedTermLinkClassName|radarRelationLinkClassName|关系卡片链每个|相关术语链每个|0\\.294\\.0|关系跳转入口|相关术语链可点击|关系卡片链可点击" ...` 确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地窄扫：`rg -n "<Badge key=\\{t\\.slug\\} asChild variant=\\\"outline\\\">|className=\\\"rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted/50\\\"|<div className=\\\"mt-3 flex flex-wrap gap-2\\\">\\s*\\{relatedChain\\.length" src/app/glossary/page.tsx src/app/radar/page.tsx` 无匹配，确认旧小关系跳转模板不再存在于生产源码。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 391 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.293.0] - 2026-06-08

### Fixed

- **[Phase E Knowledge Result Link Mobile Touch Targets]** 补齐 `/glossary` 术语结果列表和 `/radar` 实体结果列表入口的移动端触控高度。
  - `src/app/glossary/page.tsx` 新增 `glossaryResultLinkClassName`，让左侧术语搜索结果 Link 显式接入 `min-h-11`。
  - `src/app/radar/page.tsx` 新增 `radarResultLinkClassName`，让左侧实体搜索结果 Link 显式接入 `min-h-11`。
  - `tests/unit/knowledge-base.test.ts` 新增源码级回归，覆盖两个结果列表 class 接线，并防止旧 `rounded-md border px-3 py-2...` 小触控模板回退。
  - 该切片只改 Glossary/Radar 结果列表展示层和源码级 UI 测试，不改查询条件、路由参数、知识路径、关系卡片、复习卡片生成 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/glossary` 缺少 `glossaryResultLinkClassName`，GREEN 后 15 项通过。
- 本地相关回归：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "Knowledge Result Link|glossaryResultLinkClassName|radarResultLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|术语列表每条|实体列表每条|0\\.293\\.0" ...` 确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录接入本切片。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 390 项通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.292.0] - 2026-06-08

### Fixed

- **[Phase E Voice Reflection Template Button Touch Targets]** 补齐 Voice 6 个反思模板入口的移动端触控高度回归。
  - `src/app/voice/ui/voice-workspace-form.tsx` 新增 `voiceReflectionTemplateButtonClassName`，让 `今日理解`、`代码思路`、`术语解释`、`论文阅读`、`行业观察`、`项目复盘` 模板按钮显式接入 `min-h-11`。
  - `tests/unit/voice-note.test.ts` 扩展 Voice 表单渲染回归，限定在 `60 秒反思模板` 区块内断言 6 个模板按钮包含 `min-h-11`，并反向防止旧小触控 class 回退。
  - 该切片只改 Voice 表单模板按钮展示层和源码级 UI 测试，不改模板内容、插入 transcript 逻辑、语音模式、保存流程、Voice/Coach handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于反思模板按钮缺少 `min-h-11`，GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 67 项通过，覆盖 Voice 表单、录音状态、转写、Coach handoff 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Voice Reflection Template Button|voiceReflectionTemplateButtonClassName|min-h-11 rounded-md border bg-background px-3 py-2 text-left|60 秒反思模板|0\\.292\\.0|每个反思模板入口|反思模板入口移动端|今日理解|项目复盘" ...` 确认源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录接入本切片；旧小触控模板按钮 class 已无生产源码匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 389 项通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.291.0] - 2026-06-07

### Fixed

- **[Phase E Mobile Bottom Nav More Sheet Link Touch Targets]** 补齐移动端底部导航 More Sheet 学习入口的触控高度回归。
  - `src/components/mobile/mobile-bottom-nav.tsx` 中 `MORE_ROUTE_ORDER` 生成的 More Sheet 路由链接新增 `min-h-11`，让移动端更多学习入口满足 44px 触控目标。
  - `tests/unit/shared-ui-a11y.test.ts` 新增移动底部导航源代码级回归，覆盖底部主入口、More Sheet 标题、More Sheet 路由清单、中文 `aria-label` 和旧小触控 link class 反向断言。
  - 该切片只改移动导航展示层和共享 UI a11y 测试，不改 `APP_ROUTE_GROUPS`、路由顺序、Sheet 行为、PWA manifest、认证、写操作、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于 More Sheet 路由链接缺少 `min-h-11`，GREEN 后 3 项通过。
- 本地相关回归：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/pwa-manifest.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 30 项通过，覆盖共享 UI a11y、PWA shortcuts、首页标签和共享学习组件。
- 本地覆盖扫描：`rg -n "Mobile Bottom Nav More Sheet|mobile bottom nav keeps More sheet|MORE_ROUTE_ORDER|更多学习入口|min-h-11 rounded-md border px-3 py-3|移动端底部导航|Bottom Nav" ...` 确认源码、测试、指导文件和 Aegis 记录接入本切片；旧小触控 More Sheet link class 已无生产源码匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 389 项通过，Next 构建生成 28 个页面，路由表包含 `/`、`/today`、`/review`、`/voice` 和 `/manifest.webmanifest`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.290.0] - 2026-06-07

### Fixed

- **[Phase E Coach Mode Select Mobile Touch Target]** 补齐 Coach 表单 `评审模式` 选择框的手机端触控高度。
  - `CoachModeRail` 新增 `coachModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"`，让 mode select 满足 44px 触控目标。
  - `tests/unit/coach-workspace.test.ts` 扩展 mode rail 渲染回归，要求 `aria-label="评审模式"` 的 select 接入 `min-h-11`，并防止旧 `h-10` class 回退。
  - 该切片只改 Coach 表单展示层和源码级 UI 测试，不改 mode 选项、Coach 提交、AI 评审、生成卡片、Review/Voice 队列、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 `评审模式` select 仍使用旧 `h-10` class，GREEN 后 15 项通过。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- 本地覆盖扫描：`rg -n "coachModeSelectClassName|min-h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring|h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring|评审模式|Phase E Coach Mode Select|0\\.290\\.0" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入本切片；旧 `h-10` select class 只保留在测试反向断言中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 388 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.289.0] - 2026-06-07

### Fixed

- **[Phase E Voice Mode Select Mobile Touch Target]** 补齐 Voice 输入表单模式选择框的手机端触控高度。
  - `/voice` 表单新增 `voiceModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none"`，让 `语音笔记模式` select 满足 44px 触控目标。
  - `tests/unit/voice-note.test.ts` 扩展 Voice handoff 表单渲染回归，要求 `aria-label="语音笔记模式"` 的 select 接入 `min-h-11`，并防止旧 `h-9` class 回退。
  - 该切片只改 Voice 表单展示层和源码级 UI 测试，不改 mode 选项、表单提交、Voice Note 保存、Coach handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于模式选择框仍使用旧 `h-9` class，GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 67 项通过，覆盖 Voice 表单、录音状态、转写自动填入、转写服务、Coach handoff 和共享学习 UI。
- 本地覆盖扫描：`rg -n "voiceModeSelectClassName|min-h-11 rounded-md border bg-background px-3 text-sm outline-none|h-9 rounded-md border bg-background px-3 text-sm outline-none|语音笔记模式|Phase E Voice Mode Select|0\\.289\\.0" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入本切片；旧 `h-9` select class 只保留在测试反向断言中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 388 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.288.0] - 2026-06-07

### Fixed

- **[Phase E Mistakes Filter Chip Mobile Touch Targets]** 补齐 `/mistakes` 状态、来源、类型筛选 chips 的移动端触控目标。
  - `/mistakes` 新增 `mistakeFilterCtaClassName = "min-h-11 w-full sm:w-auto"` 和 `mistakeFilterRowClassName = "grid gap-2 sm:flex sm:flex-wrap"`。
  - `状态`、`来源`、`类型` 三组筛选 chips 在手机端改为单列全宽大触控目标，桌面端保持横向 wrap。
  - `tests/unit/mistakes-view.test.ts` 新增筛选 chips 移动端触控目标回归，要求三组 `statusOptions` / `sourceOptions` / `kindOptions` 都接入同一套 class。
  - 该切片只改 `/mistakes` 筛选区展示和源码级 UI 测试，不改筛选 query 参数、误区查询条件、写操作、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/mistakes-view.test.ts` 首次失败于缺少 `mistakeFilterCtaClassName`，GREEN 后 12 项通过。
- 本地相关回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过，覆盖 Mistakes 筛选、Preview 写保护、Review 补弱、Today 补弱和共享学习 UI。
- 本地覆盖扫描：`rg -n "mistakeFilterCtaClassName|mistakeFilterRowClassName|statusOptions\\.map|sourceOptions\\.map|kindOptions\\.map|Phase E Mistakes Filter Chip|筛选 chips|flex flex-wrap gap-2" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "<div className=\"flex flex-wrap gap-2\">\\s*\\{(statusOptions|sourceOptions|kindOptions)\\.map" src/app/mistakes/page.tsx` 无匹配，确认 `/mistakes` 筛选区不再使用旧移动端横向 chips 行。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 388 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.287.0] - 2026-06-07

### Fixed

- **[Phase E Library Active Filter Summary Localization]** 本地化 `/library` 活跃筛选摘要 badge。
  - `/library` 筛选摘要把 `source: deepseek`、`status: completed`、`schema: ...`、`date: ...` 改为 `来源：AI 生成`、`状态：已完成`、`内容版本：...`、`日期：...`。
  - `source` 和 `status` 复用现有 `formatTodayPlanSourceLabel()` / `formatHomeDailyPlanStatusLabel()`，让课程列表、详情和活跃筛选摘要保持同一套中文业务标签。
  - `tests/unit/library-page-labels.test.ts` 新增活跃筛选摘要接线和旧 raw badge 模板反向断言。
  - 该切片只改 `/library` 读侧展示、测试和文档记录，不改筛选 query 参数、`buildLibraryPlanHref()`、plan filter 服务、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 覆盖活跃筛选摘要接线，GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 57 项通过，覆盖 Library 可见标签、筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- 本地覆盖扫描：`rg -n "来源：\\{formatTodayPlanSourceLabel\\(filters\\.source\\)\\}|内容版本：\\{filters\\.schemaVersion\\}|状态：\\{formatHomeDailyPlanStatusLabel\\(filters\\.status\\)\\}|日期：\\{filters\\.localDate\\}|source: \\{filters\\.source\\}|status: \\{filters\\.status\\}|schema: \\{filters\\.schemaVersion\\}|date: \\{filters\\.localDate\\}|Library Active Filter" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地窄扫：`rg -n "<Badge variant=\"outline\">source: \\{filters\\.source\\}|<Badge variant=\"outline\">status: \\{filters\\.status\\}|<Badge variant=\"outline\">schema: \\{filters\\.schemaVersion\\}|<Badge variant=\"outline\">date: \\{filters\\.localDate\\}" src/app/library/page.tsx` 无匹配，确认生产源码不再直出旧 raw 活跃筛选模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 387 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.286.0] - 2026-06-07

### Fixed

- **[Phase E Weekly Code Issue Type Label Localization]** 本地化 `/weekly` 代码练习高频问题类型。
  - `src/server/learning/weekly.ts` 新增 `weeklyCodeIssueTypeLabel()`，把 `logic`、`edge_case`、`complexity` 等代码反馈 issue type 显示为中文业务标签，未知历史值兜底为 `一般问题`，空值显示 `暂无`。
  - `/weekly` 页面 `代码练习情况` 和导出的 `Weekly Markdown` 同步使用该 helper，不再把 `edge_case`、`bounds` 等内部值直出给学习者。
  - `tests/unit/weekly-review.test.ts` 新增 helper 映射、页面源码接线和 Markdown 导出反向断言。
  - 该切片不改 CodeFeedback schema、AI 代码反馈生成、周报聚合口径、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `Weekly Markdown` 仍输出 `高频问题：edge_case`，页面仍直用 `weekly.codePractice.topIssueType ?? "暂无"`，且缺少 `weeklyCodeIssueTypeLabel()`。
- 本地 GREEN：同一命令复跑 5 项通过，覆盖 `edge_case -> 边界条件`、未知历史值 `bounds -> 一般问题`、空值 `暂无`、页面接线和 Markdown 导出中文化。
- 本地相关回归：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-code-exercise.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts` 70 项通过，覆盖 Weekly、Progress 趋势、Today/Projects 代码反馈标签和共享学习 UI。
- 本地覆盖扫描：`rg -n "weeklyCodeIssueTypeLabel|高频问题：|edge_case|边界条件|Weekly Code Issue|Code Issue Type|topIssueType \\?\\? \"暂无\"|weekly\\.codePractice\\.topIssueType" ...` 确认源码、测试和 Aegis 记录接入；窄扫 `src/app/weekly/page.tsx` / `src/server/learning/weekly.ts` 未发现旧 raw 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 387 项通过，Next 构建生成 28 个静态页面，路由表包含 `/weekly`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.285.0] - 2026-06-07

### Fixed

- **[Phase E Coach Generated Review Link Source Isolation]** 修复 Voice-linked Coach review 已生成卡片后的静态复习链接归属。
  - `CoachFlashcardPanel` 新增 `reviewSource` 输入，默认普通 Coach review 仍链接 `/review?source=thought-review`，Voice Note 来源链接 `/review?source=voice-note`。
  - `/coach` 页面根据当前 `ThoughtReview.reviewJson.source` / `voiceNoteId` 判断是否为 Voice-linked review，并把队列来源传给卡片沉淀面板。
  - `tests/unit/coach-workspace.test.ts` 新增 Voice-linked 已生成卡片状态回归，防止用户刷新或回到 Coach 页面后点击静态“复习这 N 张 Coach 卡片”又落回普通 `thought-review` 队列。
  - 该切片不改生成卡片服务、Review 过滤契约、Voice Note 持久化、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于传入 `reviewSource="voice-note"` 后，静态复习链接仍输出 `href="/review?source=thought-review"`。
- 本地 GREEN：同一命令复跑 15 项通过，覆盖普通 Coach generated-card link 仍走 `thought-review`，Voice-linked generated-card link 走 `voice-note`。
- 本地 E2E：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 2 项通过，确认 Voice → Coach → Review 真实浏览器路径未回退。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts` 64 项通过，覆盖 Coach 面板、Coach submit 服务、Voice handoff、Review source filter 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Coach Generated Review Link|reviewSource=|reviewSource|source=voice-note|source=thought-review|静态复习链接|Generated Review Link" ...` 确认源码、单测、E2E、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 386 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`、`/coach` 和 `/review`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.284.0] - 2026-06-07

### Fixed

- **[Phase E Voice E2E Focused Review Source Isolation]** 修复 Voice Note 进入 Coach 生成卡片后的 focused review 队列归属。
  - `generateFlashcardsForThoughtReview()` 会从持久化 `ThoughtReview.reviewJson.source` 识别 `voice-note` 来源，并在通用 Coach 生成路径中自动保留 `voice-note` tag。
  - `generateCardsFromThoughtReviewAction()` 生成卡片后按服务层返回的 `reviewSource` 重定向，Voice Note 来源进入 `/review?source=voice-note`，普通 Coach 来源继续进入 `/review?source=thought-review`。
  - `tests/unit/coach-submit.test.ts` 新增 Voice-linked ThoughtReview 通过通用 Coach 生成路径也进入语音复习队列的回归覆盖。
  - 该切片不新增数据库迁移，不改 Preview 写保护、Voice Note 持久化、ThoughtReview schema、Review 过滤契约、生产配置或密钥。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-submit.test.ts` 首次失败于 `generated.reviewSource` 为 `undefined`，证明通用 Coach 生成路径没有暴露 Voice-linked review 的队列归属。
- 本地 GREEN：同一命令复跑 5 项通过，覆盖 Voice-linked ThoughtReview 自动带 `voice-note` 和 `thought-review` tags，且返回 `reviewSource="voice-note"`。
- 本地 RED：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 首次第 2 项失败，点击 Coach `生成卡片` 后实际导航到 `/review?source=thought-review`，无法进入语音聚焦复习队列。
- 本地 GREEN：同一命令复跑 2 项通过，覆盖手动转写保存、送 Coach、来源面板、生成卡片并进入 `/review?source=voice-note`。
- 本地并发 E2E：`npx playwright test tests/e2e/today-interactions.spec.ts tests/e2e/review-interactions.spec.ts tests/e2e/coach-interactions.spec.ts tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 7 项通过，覆盖 Today、Review、Coach 和 Voice 交互级路径并发运行时不会再被 `thought-review` 队列抢占。
- 本地相关回归：`npm test -- tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-filter.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 80 项通过，覆盖 Coach 生成服务、Voice 页面/服务、Review 过滤/总结和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Voice E2E Focused|thoughtReviewQueueSource|reviewSource|source=voice-note|语音笔记复习|voice-note queue|Focused Review Source" ...` 确认源码、单测、E2E、CHANGELOG、模块文档、UI checklist 和 Aegis 记录均接入本切片。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 385 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`、`/coach` 和 `/review`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.283.0] - 2026-06-07

### Fixed

- **[Phase E Today E2E Focus Stage Navigation]** 对齐 Today 交互级 E2E 和当前专注学习模式首屏体验。
  - `tests/e2e/today-interactions.spec.ts` 新增 `openFocusStage()`，在操作小测验、代码练习、反思完成卡前先通过真实阶段切换按钮进入 `小测验`、`代码练习`、`反思与完成`。
  - 完成态用例在回到 `/today` 后再次切入 `反思与完成`，同时兼容本地 Demo 今日计划已完成和未完成两种状态。
  - 该切片只调整 E2E 用户路径和验收文档，不改 Today 页面源码、完成 action、Quiz 提交、CodeSubmission、Voice/Coach handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"` 首次 2 项失败，分别因为测试直接等待折叠完整视图里的 `today-quiz` 和 `标记完成并生成卡片`，而当前 `/today` 首屏停留在 `专注学习模式` 第 2 步。
- 本地 GREEN：同一命令复跑 2 项通过，覆盖按真实专注阶段切到 `小测验` 提交答案、切到 `代码练习` 保存草稿、切到 `反思与完成` 完成学习，并把 lesson context 带入 `/voice?lessonId=...&mode=today_lesson` 和 `/coach?lessonId=...&mode=today_lesson`。
- 本地相关回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 69 项通过，覆盖 Today 标签、代码练习、完成后行动、阶段状态、Voice handoff、Coach 工作区和共享学习 UI。
- 本地覆盖扫描：`rg -n "openFocusStage|切换到小测验|切换到代码练习|切换到反思与完成|today-interactions|Phase E Today E2E|标记完成并生成卡片|learning-completion-card" tests/e2e/today-interactions.spec.ts src/app/today src/components/learning helloagents/CHANGELOG.md helloagents/modules/e2e-ui-smoke.md helloagents/modules/today-focus-mode.md docs/ui-review-checklist.md docs/aegis/work/2026-06-03-roky-learning-desire` 确认 E2E、Today 源码和文档都围绕真实阶段切换与完成卡路径。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 384 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today`、`/voice` 和 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.282.0] - 2026-06-07

### Fixed

- **[Phase E Review E2E Rating Label Alignment]** 对齐 Review 交互级 E2E 和已本地化的评分按钮可访问名称。
  - `tests/e2e/review-interactions.spec.ts` 评分按钮 locator 从旧 `/4 很熟/` 改为真实可访问名称 `/很熟 \+14d/`。
  - 该切片只调整 E2E locator 和验收文档，不改 Review 页面源码、评分 action、复习调度、ReviewLog 写入、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npx playwright test tests/e2e/review-interactions.spec.ts --project="Desktop Chrome"` 首次因等待 `getByRole('button', { name: /4 很熟/ })` 超时失败，证明 Review E2E 仍在断言旧评分按钮名称。
- 本地 GREEN：同一命令复跑 1 项通过，覆盖本地 Demo 下创建专用到期卡、进入 `/review?source=thought-review`、显示答案、用 `很熟 +14d` 评分并推进队列。
- 本地相关回归：`npm test -- tests/unit/review-empty-state.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts tests/unit/learning-ui-components.test.ts` 32 项通过，覆盖 Review 空态、session summary、评分幂等、1/3/7/14 天排期和共享学习 UI。
- 本地覆盖扫描：`rg -n "4 很熟|1 忘了|很熟 \\\\+14d|忘了 \\\\+1d|很熟 \\+14d|忘了 \\+1d" tests/e2e src/app/review helloagents/CHANGELOG.md helloagents/modules/e2e-ui-smoke.md helloagents/modules/review.md docs/ui-review-checklist.md docs/aegis/work/2026-06-03-roky-learning-desire` 只命中当前中文可访问名称记录或历史证据，不再发现旧 E2E `4 很熟` 断言。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 384 项通过，Next 构建生成 28 个静态页面，路由表包含 `/review`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.281.0] - 2026-06-07

### Fixed

- **[Phase E Voice E2E Transcript Label Alignment]** 对齐 Voice 交互级 E2E 和已本地化的转写文本可访问名称。
  - `tests/e2e/voice-interactions.spec.ts` 两处输入定位从旧英文 `getByLabel("Transcript")` 改为中文 `getByLabel("语音转写文本")`。
  - 该切片只调整 E2E locator 和验收文档，不改 Voice 页面源码、Voice Note 持久化、Coach handoff、卡片生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"` 首次两个用例都因等待 `getByLabel('Transcript')` 超时失败，证明 Voice E2E 仍在断言旧英文 label。
- 本地 GREEN：同一命令复跑 2 项通过，覆盖本地 Demo 下手动转写保存、语音学习流水线、送 Coach、生成卡片并进入 focused review。
- 本地覆盖扫描：`rg -n "getByLabel\\(\"Transcript\"\\)|aria-label=\"Transcript\"|>Transcript<|Transcript" tests/e2e src/app/voice src/components --glob '!src/app/admin/**'` 不再发现旧 E2E locator 或学习者可见 `Transcript` 标签；剩余命中为内部类型/变量名。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 66 项通过，覆盖 Voice 表单、录音状态、转写自动填入、转写服务、Coach handoff 和共享学习 UI。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 384 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`、`/coach` 和 `/review`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.280.0] - 2026-06-07

### Fixed

- **[Phase E E2E Smoke Localized Label Alignment]** 对齐浏览器级 smoke 测试和已本地化的生产 UI 文案。
  - `tests/e2e/smoke.spec.ts` 首页断言从旧混合标题 `Current Mission / 当前任务` 改为中文 `当前任务`。
  - `/projects` smoke 断言从 `Mission Mode` 改为 `项目任务模式`。
  - `/coach` smoke 断言从 `Context Compass` 改为 `上下文指南针`。
  - 该切片只调整 E2E 断言和验收文档，不改产品源码、路由、鉴权、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED：`npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 首次失败于 `getByText('Current Mission / 当前任务')` 找不到元素，证明 smoke 仍在断言旧 UI。
- 本地 GREEN：同一命令复跑 2 项通过，覆盖本地 Demo 登录后首页、Today、Path、Weekly、Projects、Glossary、Radar、Coach、Voice、Mistakes、Notes、Library 和 Review reveal smoke。
- 本地覆盖扫描：`rg -n "Current Mission / 当前任务|Mission Mode|Context Compass" tests/e2e src/app src/components src/server --glob '!src/app/admin/**'` 无匹配，确认学习者可见源码和 E2E 不再保留这三个旧断言。
- 本地相关回归：`npm test -- tests/unit/current-mission.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/coach-workspace.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 63 项通过，覆盖 Current Mission、Projects、Coach、首页标签和共享学习 UI。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 384 项通过，Next 构建生成 28 个静态页面，路由表包含 `/`、`/projects` 和 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.279.0] - 2026-06-07

### Fixed

- **[Phase E Current Mission Misconception Fallback Localization]** 本地化 Current Mission 未解决误区无 focus 时的兜底原因文案。
  - `buildNextBestAction()` 在有未解决误区但没有具体 `openMisconceptionFocus.summary` 时，从 `你还有 N 个 open misconception...` 改为 `你还有 N 个未解决误区...`。
  - 扩展 `tests/unit/next-best-action.test.ts` 和 `tests/unit/current-mission.test.ts`，要求 Next Best Action 与 Current Mission 包装层都禁止把 `open misconception` 作为学习者可见 reason 直出。
  - 该切片只调整 Current Mission/Next Best Action 读侧文案和源码级测试，不改任务优先级、Coach 路由、Prisma 查询、误区状态数据契约、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` 首次失败于 `next-best-action` 仍输出 `你还有 2 个 open misconception...`，GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts tests/unit/today-code-exercise.test.ts tests/unit/coach-workspace.test.ts` 41 项通过，覆盖 Current Mission、Next Best Action、首页标签、学习动机、Today 代码入口和 Coach 回归。
- 本地覆盖扫描：`rg -n "open misconception" src/app src/components src/server/learning --glob '!src/app/admin/**'` 无匹配，确认学习者页面和 learning server 当前不再直出该英文兜底。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 384 项通过，Next 构建生成 28 个静态页面，路由表包含 `/`、`/coach` 和 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.278.0] - 2026-06-07

### Fixed

- **[Phase E Progress Recent Code Feedback Provider Label Localization]** 本地化 `/progress` 最近代码反馈里的 provider 可见标签。
  - 最近代码反馈 badge 从 raw `deepseek` / `template` 类 provider 改为复用 `formatTodayPlanSourceLabel(f.provider)`，显示 `AI 生成` / `模板兜底` / `系统生成` 等学习者可读来源。
  - 扩展 `tests/unit/progress-analytics.test.ts`，要求最近代码反馈同时本地化 provider 和 overall，防止 `{f.provider}` 重新作为学习者可见状态直出。
  - 该切片只调整 `/progress` 读侧展示文案和源码级 UI 测试，不改 `CodeFeedback.provider` 数据契约、AI 反馈生成、Prisma 查询、统计聚合、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于缺少 `formatTodayPlanSourceLabel(f.provider)`，GREEN 后 21 项通过。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/coach-workspace.test.ts tests/unit/map-analytics.test.ts` 57 项通过，覆盖 Progress、首页标签 helper、Today、Library、Coach 和 Knowledge Map 相关来源/状态标签回归。
- 本地覆盖扫描：`rg` 窄扫确认 `/progress` 生产源码只剩 `formatTodayPlanSourceLabel(f.provider)` 接线，没有旧 `<Badge>{f.provider}` 直出模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 383 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.277.0] - 2026-06-07

### Fixed

- **[Phase E Library Content Version Label Localization]** 本地化 `/library` 课程列表和课程详情里的 schema 版本可见标签。
  - 课程列表和详情元信息从 `schema 2.3`、`schema -` 类模板改为 `内容版本：2.3`、`内容版本：未标记`。
  - 新增 `formatLibraryPlanSchemaVersionLabel()`，让课程档案继续保留 `schemaVersion` 治理筛选参数，同时避免学习者在课程档案里看到裸 `schema` 或短横线 fallback。
  - 该切片只调整 `/library` 读侧展示文案和源码级 UI 测试，不改 DailyPlan schemaVersion 数据契约、Library 筛选参数语义、Prisma 查询、生成逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于缺少 `formatLibraryPlanSchemaVersionLabel()` 且 `/library` 仍显示旧 `schema ...` 模板，GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 58 项通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 383 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- 本地覆盖扫描：`rg` 窄扫确认 `/library` 生产源码不再直出旧 `schema {p.schemaVersion ?? "-"}` 或 `schema ${planForLesson.schemaVersion ?? "-"}` 展示模板。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.276.0] - 2026-06-07

### Fixed

- **[Phase E Admin Audit Empty/Detail Copy Localization]** 本地化 `/admin` 审计空态、状态 badge、详情展开和定时任务文案。
  - 单条计划审计链路从 `无 linked job`、`暂无 matching decision log`、`暂无 planner input summary` 改为 `暂无关联生成任务`、`暂无匹配的选题决策记录`、`暂无选题输入摘要`。
  - 审计检查、异常队列和生成任务状态新增 `adminAuditCheckStatusLabel()`、`adminAuditSeverityLabel()`、`adminJobStatusLabel()`，显示 `通过`、`警告`、`失败`、`成功`、`正常`、`N 项失败`，不再把 `pass`、`warn`、`fail`、`ok` 或 `{j.status}` 作为维护者可见状态直出。
  - 最近选题和定时任务卡片从 `最近 CurriculumDecision（10）`、`Planner signal snapshot`、`查看 reason / scoreBreakdown / inputSnapshot`、`查看 output JSON`、`最近 Daily Cron（10）`、`查看 cron output JSON` 改为 `最近选题决策（10）`、`选题信号快照`、`查看决策原因、分数明细和输入快照`、`查看生成输出 JSON`、`最近每日定时任务（10）`、`查看定时任务输出 JSON`。
  - 该切片只调整 `/admin` 读侧展示文案和源码级 UI 测试，不改 Prisma 查询、Admin action、cron 重试行为、计划治理语义、Prompt Studio、生成/repair/fallback 逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于缺少 Admin 审计空态/详情中文 helper；补充最近生成任务 `{j.status}` 断言后再次 RED，GREEN 后 11 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 39 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 383 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- 本地覆盖扫描：`rg` 窄扫确认 `/admin` 生产源码不再直出本切片覆盖的旧审计空态、状态、详情展开和 Cron 文案；旧词只保留在测试反向断言和历史记录文本中。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.275.0] - 2026-06-07

### Fixed

- **[Phase E Admin Audit Heading Localization]** 本地化 `/admin` 审计与生成任务区域的维护者可见标题。
  - 单条计划审计链路中的 `DailyPlan`、`Lesson`、`Generation`、`Consistency checks`、`CurriculumDecisionLog`、`Planner input summary` 改为 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`。
  - 最近列表标题和 job planner input 标题从 `最近 DailyPlan（10）`、`最近 AiGenerationJob（10）`、`Planner input` 改为 `最近每日计划（10）`、`最近生成任务（10）`、`选题输入`。
  - 该切片只调整 `/admin` 读侧标题和源码级 UI 测试，不改 Prisma 查询、Admin action、计划治理语义、Prompt Studio、生成/repair/fallback 逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 仍显示 `Generation` 等旧英文标题，GREEN 后 10 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 38 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 382 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.274.0] - 2026-06-07

### Fixed

- **[Phase E Admin Page Schema Label Localization]** 本地化 `/admin` 页面层的 schema 版本可见标签。
  - 单条计划审计链路、planner summary、审计异常队列、最近 DailyPlan 和最近 AiGenerationJob planner input 从 `schema 2.3`、`schema -` 类模板改为 `Schema 版本：2.3`、`Schema 版本：未标记`。
  - 新增 `adminSchemaVersionLabel()`，让 `/admin` 页面层统一处理 schemaVersion 缺省显示，避免维护者在 Prompt Studio 之外的 Admin 审计区继续看到 raw `schema ...` 标签。
  - 该切片只调整 `/admin` 页面层读侧展示文案和源码级 UI 测试，不改 DailyPlan schemaVersion 数据契约、计划治理语义、Prompt Studio 组件、生成/repair/fallback 逻辑、Admin action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于缺少 `adminSchemaVersionLabel()`，GREEN 后 9 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 37 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.273.0] - 2026-06-07

### Fixed

- **[Phase E Admin Prompt Studio Schema Version Label Localization]** 本地化 `/admin` Prompt Studio 内部的 schema 版本可见标签。
  - Prompt Studio 顶部状态 badge、schema 分布 badge、最近失败样例和最近兜底 / 修复样例从 `schema 2.3`、`schema 2.2`、`schema -` 类模板改为 `Schema 版本：2.3`、`Schema 版本：2.2`、`Schema 版本：未标记`。
  - 新增 `formatPromptStudioSchemaVersionLabel()`，让 Prompt Studio 组件统一处理 schemaVersion 缺省显示，避免维护者在同一 Admin 卡片里看到大小写混合的 raw `schema ...` 标签。
  - 该切片只调整 `/admin` Prompt Studio 读侧展示文案和源码级 UI 测试，不改 Prompt/Schema 版本语义、生成/repair/fallback 逻辑、计划重建 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 首次失败于 Prompt Studio 仍显示旧 `schema 2.3` / `schema 2.2` / `schema -` 模板，GREEN 后 3 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/admin-page-labels.test.ts tests/unit/daily-generation-quality.test.ts` 19 项通过，覆盖 Prompt Studio、内容审查、Admin 标签和每日生成质量队列。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.272.0] - 2026-06-07

### Fixed

- **[Phase E Today Schema Label Localization]** 本地化 `/today` 专注模式和今日概览里的 schema 可见标签。
  - `/today` Focus overview 从 `schema` 改为 `内容版本`，schemaVersion 缺省值从 `-` 改为 `未标记`。
  - `/today` 右侧 `今日概览` 同步显示 `内容版本` / `未标记`，避免学习者在今日学习页看到裸 `schema` 或难理解的短横线 fallback。
  - 该切片只调整 `/today` 读侧展示文案和源码级 UI 测试，不改 DailyPlan schemaVersion 数据契约、生成逻辑、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `/today` 仍显示旧 `schema` 标签和 `-` fallback，GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts` 42 项通过，覆盖 Today 标签、共享学习 UI、阶段状态、完成后下一步和首页标签 helper。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.271.0] - 2026-06-07

### Fixed

- **[Phase E Admin Data Overview Metadata Label Localization]** 本地化 `/admin` 数据概览里的元信息标签。
  - `/admin` 数据概览空正式计划状态从 `none` 改为 `暂无正式计划状态`。
  - 来源和 schema 分组标题从 `来源 / schema` 改为 `来源 / Schema 版本`，schema 行从 `schema unknown` 类 raw 模板改为 `Schema 版本：未标记`。
  - 全局课程计数从 `全局 Lesson 总数` 改为 `全局课程总数`，减少中文 Admin 页面里的混合英文可见标签。
  - 该切片只调整 `/admin` 读侧展示文案和源码级 UI 测试，不改 Prisma 查询、Admin action、数据模型、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 数据概览仍显示旧元信息标签，GREEN 后 9 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 37 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.270.0] - 2026-06-07

### Fixed

- **[Phase E Admin Today Loop Action Copy Localization]** 本地化 `/admin` 今日闭环操作区的维护者可见文案。
  - `/admin` 页头副标题和今日闭环操作按钮从 `seed`、`loop check`、`daily cron` 等混合英文改为 `执行初始化与一键闭环检查`、`确保用户档案`、`初始化领域/主题`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`指定日期闭环检查（生成 → 完成 → 验证）`。
  - 今日完成表单输入提示从 `reflection（可选）` 改为 `今日反思（可选）`。
  - 该切片只调整 `/admin` 今日闭环读侧文案和源码级 UI 测试，不改 Admin action、表单字段名、生成/完成/重建/cron 行为、Prisma 查询、数据模型、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 今日闭环仍显示旧英文操作文案，GREEN 后 8 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 36 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 380 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.269.0] - 2026-06-07

### Fixed

- **[Phase E Admin Today Loop Plan Status Localization]** 本地化 `/admin` 今日闭环里的今日计划状态。
  - `/admin` 今日闭环从 raw `plan ? plan.status : "none"` 改为复用 `formatHomeDailyPlanStatusLabel(plan?.status)`，让 `planned` / `completed` / 空计划状态显示为中文维护者文案。
  - 该切片只调整 `/admin` 今日闭环读侧展示文案和源码级 UI 测试，不改今日计划生成、完成、重建 action、Prisma 查询、数据模型、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 今日闭环仍可能显示 raw 计划状态，GREEN 后 7 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 35 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 379 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.268.0] - 2026-06-07

### Fixed

- **[Phase E Admin Data Overview Entity Label Localization]** 本地化 `/admin` 数据概览里的实体标签。
  - `/admin` 数据概览标题从 `数据概览（当前 user）` 改为 `数据概览（当前用户）`。
  - 数据概览中的 `UserProfile`、`DailyPlan`、`ReviewLog`、`Note` 改为 `用户档案`、`每日计划`、`复习记录`、`笔记`，避免中文 Admin 页面混入数据库模型名。
  - 该切片只调整 `/admin` 读侧展示文案和源码级 UI 测试，不改 Prisma 查询、Admin action、数据模型、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `数据概览（当前用户）`、`用户档案`、`每日计划`、`复习记录` 和 `笔记`，GREEN 后 6 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 34 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n '数据概览（当前用户）|用户档案|每日计划|复习记录|笔记|UserProfile:|DailyPlan:|ReviewLog:|Note:|0\\.268\\.0|Admin Data Overview' ...` 确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入数据概览实体标签中文化；旧实体名只保留在测试反向断言和历史证据文本中。
- 本地窄扫描：`rg -n '数据概览（当前 user）|>UserProfile:|>DailyPlan:|>ReviewLog:|>Note:' src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再直出旧数据概览实体文案。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 378 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.267.0] - 2026-06-07

### Fixed

- **[Phase E Admin Flashcard Label Localization]** 本地化 `/admin` 复习卡片统计和最近卡片元信息。
  - `/admin` 数据概览从 `Flashcard` / `Due Flashcard` 改为 `复习卡片` / `到期复习卡片`。
  - 最近卡片列表从 `最近 Flashcard（10）` 和 `due: ... / reviews: ...` 改为 `最近复习卡片（10）` 和 `到期：... / 复习次数：...`。
  - 该切片只调整 `/admin` 读侧展示文案和源码级 UI 测试，不改 Flashcard 数据模型、复习队列、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：...` 和 `复习次数：...`，GREEN 后 5 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 33 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n '复习卡片|到期复习卡片|最近复习卡片|Flashcard:|Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount|0\\.267\\.0|Admin Flashcard' ...` 确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入复习卡片文案中文化；旧 Flashcard/due/reviews 文案只保留在测试反向断言和历史证据文本中。
- 本地窄扫描：`rg -n '>Flashcard:|>Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount' src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再直出旧英文卡片文案。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 377 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.266.0] - 2026-06-07

### Fixed

- **[Phase E Admin Login Shell Title Localization]** 本地化 `/admin` 未登录 shell 卡片标题。
  - `/admin` 保护开启且未认证时，登录卡标题从 `Admin Login` 改为 `管理员登录`，让维护者进入 Admin 登录 shell 时不再看到孤立英文标题。
  - 该切片只调整 `/admin` 未登录读侧标题和源码级 UI 测试，不改 Admin 登录/退出 action、httpOnly cookie、`ADMIN_SECRET` 校验、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 未登录 shell 缺少 `管理员登录` 且仍存在 `Admin Login`；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 32 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n '管理员登录|Admin Login|0\\.266\\.0|Admin Login Shell' ...` 确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入未登录标题中文化；旧 `Admin Login` 只保留在测试反向断言和历史证据文本中。
- 本地窄扫描：`rg -n "Admin Login" src/app/admin/page.tsx` 无匹配，确认 `/admin` 生产源码不再直出旧英文标题。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 376 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.265.0] - 2026-06-07

### Fixed

- **[Phase E Admin Auth Status Label Localization]** 本地化 `/admin` 环境卡里的 Admin 认证状态。
  - `/admin` 环境卡从 `Admin Auth: ok/required` 改为 `Admin 认证：已登录/需要登录`，让维护者可见状态和页面内其他中文治理标签保持一致。
  - 该切片只调整 `/admin` 环境卡读侧状态文案和源码级 UI 测试，不改 Admin 登录/退出 action、httpOnly cookie、`ADMIN_SECRET` 校验、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 缺少 `Admin 认证` 且仍存在 `Admin Auth: ok/required`；GREEN 后 3 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 31 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n 'Admin 认证|已登录|需要登录|Admin Auth|authed \\? "ok" : "required"|0\\.265\\.0|Admin Auth Status' ...` 确认 `/admin` 生产源码显示 `Admin 认证：已登录/需要登录`；旧 `Admin Auth` 只保留在测试反向断言里。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 375 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.264.0] - 2026-06-07

### Fixed

- **[Phase E Admin Prompt Studio Status Reason Label Localization]** 本地化 `/admin` Prompt Studio 的状态、原因和手动修复标签。
  - `PromptStudioCard` 新增中文展示 helper，把 job 状态 `success` / `failed` / `error` 显示为 `成功` / `失败` / `错误`，把 job 类型、fallback/repair 原因和手动修复 readiness 显示为 `每日计划`、`Cron 计划`、`兜底生成`、`JSON 修复`、`原始输出`、`质量警告`、`可测试`、`等待样例`。
  - Prompt Studio 标题从 `手动 repair 测试`、`最近 fallback / repair 样例` 改为 `手动修复测试`、`最近兜底 / 修复样例`，并对旧 note 中的 `rawPrimary`、`repair prompt`、`fallback`、`repair` 做展示层中文清洗。
  - `buildAdminPromptStudioSummary()` 的手动修复说明改为中文维护者文案，避免 raw `ready`、`fallback`、`repair`、`rawPrimary` 或 `quality-warning` 作为可见标签直出。
  - 该切片只调整 `/admin` Prompt Studio 读侧展示文案、手动修复说明和源码级 UI 测试，不改模型调用、Prompt/Schema 契约、计划重建 action 行为、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 首次失败于 Prompt Studio 仍直出 raw note/status/reason；GREEN 后 3 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/admin-page-labels.test.ts tests/unit/daily-generation-quality.test.ts` 12 项通过，覆盖 Prompt Studio、内容审查、Admin 标签和每日生成质量队列。
- 本地覆盖扫描：`rg -n 'Prompt Studio|手动修复测试|最近兜底 / 修复样例|formatPromptStudioJobStatusLabel|formatPromptStudioFallbackReasonLabel|formatManualRepairNote|>success<|>failed<|>ready<|>fallback<|>repair<|>rawPrimary<|>quality-warning<|最近 fallback / repair 样例|手动 repair 测试|repair prompt' ...` 确认生产组件已走中文 helper；剩余 raw 搜索词只在测试反向断言、旧 raw fixture 或展示层清洗函数中保留。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 374 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.263.0] - 2026-06-07

### Fixed

- **[Phase E Voice Manual Required Status Badge Localization]** 统一 `/voice` 录音/上传状态面板的手动转写 badge 文案。
  - `VoiceCaptureStatusPanel` 在 `manual_required` 状态下从 `需手动` 改为 `需手动整理`，与转写结果 badge 的 `转写成功` / `需手动整理` 文案保持一致，避免同一手动转写状态出现两套学习者可见标签。
  - 该切片只调整 `/voice` 捕获状态面板读侧文案和源码级 UI 测试，不改转写服务、上传限制、Voice Note 保存、Coach handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-capture-status.test.ts` 首次失败于 `需手动` 不等于 `需手动整理`；GREEN 后 7 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 66 项通过，覆盖 Voice 捕获状态、Voice 页面、转写自动填入、转写服务、Coach handoff 和共享学习组件。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 374 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.262.0] - 2026-06-07

### Fixed

- **[Phase E Library Plan Governance Label Localization]** 本地化 `/library` 课程库里的测试/归档计划治理标签。
  - `/library` 计划筛选状态、筛选 CTA、课程列表 badge 和课程详情 badge 从 raw `test` / `archived` 改为 `测试计划` / `已归档`，CTA 改为 `切换测试计划` / `切换归档计划`，避免学习者在课程库看到英文治理状态。
  - 该切片只调整 `/library` 读侧展示文案和源码级 UI 测试，不改治理筛选参数名、DailyPlan 数据契约、Prisma 查询、Notes/Today 链路、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 仍缺少 `显示测试计划` / `切换测试计划` / `测试计划` / `已归档`；GREEN 后 5 项通过，覆盖课程库测试/归档计划标签本地化。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts` 28 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- 本地窄扫描：`rg -n '切换 test|切换 archived|显示 test|隐藏 test|显示 archived|隐藏 archived|>test<|>archived<|<Badge variant="outline">test</Badge>|<Badge variant="outline">archived</Badge>' src/app/library/page.tsx` 无匹配，确认 `/library` 生产源码不再直出旧 raw 测试/归档计划文案。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 373 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.261.0] - 2026-06-07

### Fixed

- **[Phase E Library Lesson Domain Topic Unknown Label Localization]** 本地化 `/library` 课程详情里的领域/主题缺省 badge。
  - `/library` 课程详情新增 `formatLibraryPlanDomainLabel()` 和 `formatLibraryPlanTopicLabel()`，把缺失或空白的 `selectedDomain` / `selectedTopic` 显示为 `未标记领域` / `未标记主题`，避免学习者在课程档案里看到 raw `unknown`。
  - 该切片只调整 `/library` 课程详情读侧展示文案和源码级 UI 测试，不改治理筛选参数、DailyPlan 数据契约、Prisma 查询、Notes/Today 链路、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次 4 项中 1 项失败，失败点为 `/library` 缺少 `formatLibraryPlanDomainLabel()` / `formatLibraryPlanTopicLabel()`，且课程详情仍使用 `planForLesson.selectedDomain ?? "unknown"` / `planForLesson.selectedTopic ?? "unknown"`；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts` 27 项通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- 本地覆盖扫描：`rg -n 'Library Lesson Domain|formatLibraryPlanDomainLabel|formatLibraryPlanTopicLabel|未标记领域|未标记主题|selectedDomain \\?\\? "unknown"|selectedTopic \\?\\? "unknown"|0\\.261\\.0|课程领域|课程主题|raw domain|raw topic' ...` 确认 `/library` 源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入领域/主题缺省中文化要求。
- 本地窄扫描：`rg -n 'planForLesson\\.selectedDomain \\?\\? "unknown"|planForLesson\\.selectedTopic \\?\\? "unknown"|>unknown<|\\{planForLesson\\.selectedDomain\\}|\\{planForLesson\\.selectedTopic\\}' src/app/library/page.tsx` 无匹配，确认 `/library` 生产源码不再直出旧 raw unknown 领域/主题模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 372 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.260.0] - 2026-06-07

### Fixed

- **[Phase E Coach Code Feedback Overall Label Localization]** 本地化 `/coach` 学习上下文中的代码反馈结论。
  - `/coach` 右侧学习上下文和补弱队列里的代码反馈副标题改为复用 `formatHomeCodeFeedbackOverallLabel()`，把 `partially_correct`、`incorrect`、`cannot_judge` 等显示为 `部分正确`、`需要重写`、`需要更多信息`，避免学习者在 Coach 上下文里看到 raw `overall`。
  - 该切片只调整 `/coach` 读侧展示文案和源码级 UI 测试，不改 `buildCoachContext()`、代码反馈数据契约、Projects/Today 代码评审、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次 14 项中 1 项失败，失败点为 `/coach` 仍缺少 `formatHomeCodeFeedbackOverallLabel(f.overall)` 且仍拼接 raw `f.overall`；GREEN 后 14 项通过，覆盖代码反馈上下文结论走中文 label helper，并阻止旧 raw `overall` 回归。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 53 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress code/thought-review 标签和 Library code/thought-review 标签。
- 本地覆盖扫描：`rg -n 'Coach Code Feedback Overall|formatHomeCodeFeedbackOverallLabel\\(f\\.overall\\)|\\[f\\.localDate, f\\.overall\\]\\.filter\\(Boolean\\)\\.join\\(" / "\\)|0\\.260\\.0|代码反馈结论|raw overall|partially_correct|incorrect|cannot_judge' ...` 确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入代码反馈结论中文化要求。
- 本地窄扫描：`rg -n '\\[f\\.localDate, f\\.overall\\]\\.filter\\(Boolean\\)\\.join\\(" / "\\)|\\$\\{f\\.overall\\}|>partially_correct<|>incorrect<|>cannot_judge<' src/app/coach/page.tsx` 无匹配，确认 `/coach` 生产源码不再直出旧 raw code feedback overall 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 371 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.259.0] - 2026-06-07

### Fixed

- **[Phase E Coach Review Provider Badge Localization]** 本地化 `/coach` 导师反馈顶部生成来源 badge。
  - `/coach` 导师反馈顶部 provider badge 改为复用 `formatTodayPlanSourceLabel()`，把 `deepseek` / `template` 显示为 `AI 生成` / `模板兜底`，避免学习者在思路评审结果区看到 raw provider。
  - 该切片只调整 `/coach` 读侧展示文案和源码级 UI 测试，不改 ThoughtReview provider 数据契约、`generateThoughtReview()`、`createThoughtReview()`、Coach prompt/context、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次 13 项中 1 项失败，失败点为 `/coach` 仍直出 `{review.provider ?? "template"}`；GREEN 后 13 项通过，覆盖 provider badge 走 `formatTodayPlanSourceLabel(review.provider ?? "template")`，并阻止 raw provider 回归。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 52 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- 本地覆盖扫描：`rg -n 'Coach Review Provider|formatTodayPlanSourceLabel\\(review\\.provider \\?\\? "template"\\)|\\{review\\.provider \\?\\? "template"\\}|0\\.259\\.0|导师反馈.*provider|provider badge|AI 生成|模板兜底|raw provider|deepseek / template|raw `deepseek`' ...` 确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis evidence 均接入 provider badge 中文化要求。
- 本地窄扫描：`rg -n '\\{review\\.provider \\?\\? "template"\\}|>deepseek<|>template<' src/app/coach/page.tsx` 无匹配，确认 `/coach` 生产源码不再直出旧 raw provider badge。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 370 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.258.0] - 2026-06-07

### Fixed

- **[Phase E Coach Required Badge Localization]** 本地化 `/coach` 输入内容必填 badge。
  - `/coach` 左侧 `我的理解` 表单的 `输入内容` 状态徽章从 `required` 改为 `必填`，避免学习者在中文思路评审页面看到英文表单状态。
  - 该切片只调整 `/coach` 读侧展示文案和源码级 UI 测试，不改 textarea 的原生 `required` 校验、不改 `submitThoughtReviewAction`、Coach prompt/context、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次 12 项中 1 项失败，失败点为 `/coach` 仍渲染 `<LearningStatusBadge tone="info">required</LearningStatusBadge>`；GREEN 后 12 项通过，覆盖 `输入内容` badge 显示 `必填`，并阻止旧英文 `required` 回归。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 51 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- 本地覆盖扫描：`rg -n 'Coach Required Badge|<LearningStatusBadge tone="info">必填</LearningStatusBadge>|<LearningStatusBadge tone="info">required</LearningStatusBadge>|0\\.258\\.0|输入内容必填|输入内容.*必填|`必填`|`required`' ...` 确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis evidence 均接入输入内容必填 badge 中文化要求。
- 本地窄扫描：`rg -n '<LearningStatusBadge tone="info">required</LearningStatusBadge>|>required<|required</LearningStatusBadge>' src/app/coach/page.tsx` 无匹配，确认 `/coach` 生产源码不再直出旧英文必填 badge。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 369 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.257.0] - 2026-06-07

### Fixed

- **[Phase E Progress Generation Stability Copy Localization]** 本地化 `/progress` 生成稳定性卡的学习者可见技术文案。
  - `/progress` 生成稳定性卡把 `DeepSeek / fallback`、`fallback ...`、`生成 job`、`success/error，repair ...`、`schema ...` 和 `unknown` 分别改为 `AI 生成 / 兜底生成`、`兜底率 ...`、`生成任务`、`成功/失败，修复率 ...`、`Schema 版本 ...` 和 `未标记`，避免学习者在进度页看到混合英文技术标签。
  - 该切片只调整 `/progress` 读侧展示文案和源码级 UI 测试，不改 `GenerationHealthMetrics`、`summarizeGenerationHealth()`、质量评分、生成任务统计、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于生成稳定性卡仍渲染 `DeepSeek / fallback`，GREEN 后 21 项通过，覆盖 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本` 和 `未标记`，并阻止旧英文技术文案回归。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts` 27 项通过，覆盖 Progress analytics、首页标签 helper 和每日生成质量队列。
- 本地覆盖扫描：`rg -n 'Progress Generation Stability|schemaVersionLabel|AI 生成 / 兜底生成|兜底率|生成任务|成功/失败，修复率|Schema 版本|未标记|0\\.257\\.0|生成稳定性卡|DeepSeek / fallback|success/error|repair|raw `unknown`' ...` 确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入生成稳定性中文化要求。
- 本地窄扫描：`rg -n 'DeepSeek / fallback|fallback \\$\\{|fallback 50%|生成 job|success/error|repair \\$\\{|schema \\{row\\.schemaVersion\\}:|schema 2\\.3|Schema 版本 unknown|覆盖 \\$\\{props\\.generationHealth\\.qualityScoreCoverage\\} 个 job' src/app/progress/analytics-panels.tsx` 无匹配，确认生产组件不再直出旧生成稳定性英文技术模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 368 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.256.0] - 2026-06-07

### Fixed

- **[Phase E Progress Content Quality Coding Exercise Label Localization]** 本地化 `/progress` 内容质量卡代码练习质量文案。
  - `/progress` 内容质量卡新增 `contentQualityCodingExerciseLabel()`，把 `strong`、`basic`、`missing` 和历史未知值分别显示为 `完整练习`、`基础练习`、`暂无练习`、`待评估`，避免学习者看到 raw coding quality enum。
  - 该切片只调整 `/progress` 读侧文案和源码级 UI 测试，不改 `ContentQualityMetrics`、`calculateContentQuality()`、`calculateQualityScore()`、生成稳定性统计、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于内容质量卡仍渲染 `代码练习：strong`；GREEN 后 20 项通过，覆盖 `strong`、`basic`、`missing` 和历史未知值的学习者可见中文文案，并阻止 raw coding quality 回归。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts` 26 项通过，覆盖 Progress analytics、首页来源标签 helper 和每日生成质量队列。
- 本地覆盖扫描：`rg -n 'Progress Content Quality Coding|contentQualityCodingExerciseLabel|代码练习：完整练习|代码练习：基础练习|代码练习：暂无练习|代码练习：待评估|0\\.256\\.0|代码练习质量|raw coding quality' ...` 确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入代码练习质量中文化要求。
- 本地窄扫描：`rg -n '代码练习：\\{latestQuality\\.metrics\\.codingExerciseQuality\\}|代码练习：strong|代码练习：basic|代码练习：missing' src/app/progress/analytics-panels.tsx` 无匹配，确认生产组件不再直出旧 raw coding quality 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 367 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.255.0] - 2026-06-06

### Fixed

- **[Phase E Progress Content Quality Source Label Localization]** 本地化 `/progress` 内容质量卡来源文案。
  - `/progress` 内容质量卡新增 `contentQualitySourceLabel()`，把 `deepseek`、`template`、`fallback`、空来源分别显示为 `AI 生成`、`模板兜底`、`系统兜底`、`未标记来源`，避免学习者看到 raw source 或 `unknown`。
  - 该切片只调整 `/progress` 读侧文案和源码级 UI 测试，不改 `ContentQualityMetrics`、质量评分、生成稳定性统计、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于内容质量卡仍渲染 `来源：deepseek`；GREEN 后 19 项通过，覆盖 `deepseek`、`template`、`fallback`、`null`、`undefined` 的学习者可见中文来源文案，并阻止 `unknown` 和 raw source 回归。
- 本地相关回归：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts` 25 项通过，覆盖 Progress analytics、首页来源标签 helper 和每日生成质量队列。
- 本地覆盖扫描：`rg -n 'Progress Content Quality Source|contentQualitySourceLabel|来源：AI 生成|来源：模板兜底|来源：系统兜底|来源：未标记来源|0\\.255\\.0|内容质量卡来源|raw ...' ...` 确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入内容质量来源中文化要求。
- 本地窄扫描：`rg -n '来源：\\{latestQuality\\.metrics\\.source|source \\?\\? "unknown"|来源：deepseek|来源：template|来源：fallback|来源：unknown' src/app/progress/analytics-panels.tsx` 无匹配，确认生产组件不再直出旧 raw source 模板。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 366 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.254.0] - 2026-06-06

### Fixed

- **[Phase E Current Mission Heading Localization]** 本地化共享 `CurrentMissionCard` 的学习者可见标题。
  - `CurrentMissionCard` 默认 badge 从 `Current Mission / 当前任务` 改为 `当前任务`，并同步 `/today`、`/weekly`、`/path` 的显式 title 接线，避免主流程页面顶部任务卡混入英文标题。
  - 该切片只调整读侧标题文案和源码级 UI 测试，不改 `buildCurrentMission()` / `buildNextBestAction()` 优先级、CTA、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/current-mission.test.ts` 首次失败于共享组件默认标题仍渲染 `Current Mission / 当前任务`，且 `/today`、`/weekly`、`/path` 仍显式传入旧标题；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/today-activity-labels.test.ts` 51 项通过，覆盖 Current Mission、Next Best Action、首页标签、共享学习 UI、Weekly、Path 和 Today 活动标签。
- 本地覆盖扫描：`rg -n 'Current Mission / 当前任务|title="当前任务"|0\\.254\\.0|当前任务标题|Phase E Current Mission Heading' ...` 确认源码、测试、UI checklist、Current Mission/Weekly/Path 模块文档、CHANGELOG 和 Aegis 记录均接入标题中文化要求；`src/app/today/page.tsx`、`src/app/weekly/page.tsx`、`src/app/path/page.tsx` 只保留 `title="当前任务"`。
- 本地窄扫描：`rg -n 'Current Mission / 当前任务' src/app src/components` 和 `rg -n 'title="Current Mission / 当前任务"' ...` 均无匹配，确认生产源码不再直出旧混合标题。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 365 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today`、`/weekly` 和 `/path`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.253.0] - 2026-06-06

### Fixed

- **[Phase E Admin Header Badge Localization]** 本地化 `/admin` 管理页头 badge。
  - `/admin` 登录态和已认证态的 `PageHeader` badge 从英文 `DEV` 改为中文 `开发运维`，让管理/调试页头和页面标题、内容质量、Prompt Studio、计划治理保持一致的维护者可见语言。
  - 该切片只调整 `/admin` 读侧页头文案和源码级 UI 测试，不改 Admin 登录、计划治理 action、审计链路、Prompt Studio、内容审查、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 两处页头仍为 `badge="DEV"`；GREEN 后 2 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts` 30 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- 本地覆盖扫描：`rg -n 'Admin Header Badge|badge="开发运维"|badge="DEV"|0\\.253\\.0|开发运维页头' ...` 确认 `/admin` 源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/admin/page.tsx` 中 `badge="DEV"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 364 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.252.0] - 2026-06-06

### Fixed

- **[Phase E Coach Header Badge Localization]** 本地化 `/coach` 思路评审页头 badge。
  - `/coach` 的 `PageHeader` badge 从英文 `Coach` 改为中文 `思路评审`，让思路评审页头和页面标题、Coach 工作区、导师反馈、最近评审保持一致的学习者可见语言。
  - 该切片只调整 `/coach` 读侧页头文案和源码级 UI 测试，不改 ThoughtReview 创建、Coach prompt、上下文构造、卡片生成、Voice handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 `/coach` 页头仍为 `badge="Coach"`；GREEN 后 11 项通过。
- 本地相关回归：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 47 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- 本地覆盖扫描：`rg -n 'Coach Header Badge|badge="思路评审"|badge="Coach"|0\\.252\\.0|思路评审页头' ...` 确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/coach/page.tsx` 中 `badge="Coach"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 363 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.251.0] - 2026-06-06

### Fixed

- **[Phase E Projects Header Badge Localization]** 本地化 `/projects` 项目实践页头 badge。
  - `/projects` 的 `PageHeader` badge 从英文 `Mission` 改为中文 `项目实践`，让项目实践页头和页面标题、Mission Hero、今日项目任务、项目作品集保持一致的学习者可见语言。
  - 该切片只调整 `/projects` 读侧页头文案和源码级 UI 测试，不改项目模板、项目创建、里程碑保存、代码评审、项目总结、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `/projects` 页头仍为 `badge="Mission"`；GREEN 后 18 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 43 项通过，覆盖 Projects UI、项目服务规则和 Today 完成后项目推荐。
- 本地覆盖扫描：`rg -n 'Projects Header Badge|badge="项目实践"|badge="Mission"|0\\.251\\.0|项目实践页头' ...` 确认 `/projects` 源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/projects/page.tsx` 中 `badge="Mission"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 362 项通过，Next 构建生成 28 个静态页面，路由表包含 `/projects`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.250.0] - 2026-06-06

### Fixed

- **[Phase E Voice Header Badge Localization]** 本地化 `/voice` 语音学习页头 badge。
  - `/voice` 的 `PageHeader` badge 从英文 `Voice` 改为中文 `语音捕获`，让语音学习捕获页头和页面标题、转写文本、语音流水线保持一致的学习者可见语言。
  - 该切片只调整 `/voice` 读侧页头文案和源码级 UI 测试，不改 Voice Note 数据模型、录音/转写、Coach handoff、Note/Flashcard 生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `/voice` 页头仍为 `badge="Voice"`；GREEN 后 13 项通过。
- 本地相关回归：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 58 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- 本地覆盖扫描：`rg -n 'Voice Header Badge|badge="语音捕获"|badge="Voice"|0\\.250\\.0|语音捕获页头' ...` 确认 `/voice` 源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/voice/page.tsx` 中 `badge="Voice"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 361 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.249.0] - 2026-06-06

### Fixed

- **[Phase E Weekly Header Badge Localization]** 本地化 `/weekly` 每周复盘页头 badge。
  - `/weekly` 的 `PageHeader` badge 从英文 `Weekly` 改为中文 `每周复盘`，让周报页头和页面标题、7 天总览、AI 周总结、下周建议保持一致的学习者可见语言。
  - 该切片只调整 `/weekly` 读侧页头文案和源码级 UI 测试，不改 `getWeeklyReviewData()`、`buildWeeklyReviewSnapshot()`、`buildWeeklyRemediationPlan()`、Weekly Markdown 导出、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `/weekly` 页头仍为 `badge="Weekly"`；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 48 项通过，覆盖 Weekly、Path、Mistakes 和 Auth/Preview 路由边界。
- 本地覆盖扫描：`rg -n 'Weekly Header Badge|badge="每周复盘"|badge="Weekly"|0\\.249\\.0|每周复盘页头' ...` 确认 `/weekly` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/weekly/page.tsx` 中 `badge="Weekly"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 360 项通过，Next 构建生成 28 个静态页面，路由表包含 `/weekly`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.248.0] - 2026-06-06

### Fixed

- **[Phase E Mistakes Header Badge Localization]** 本地化 `/mistakes` 错题修复中心页头 badge。
  - `/mistakes` 的 `PageHeader` badge 从英文 `Mistakes` 改为中文 `错题修复`，让错题中心页头和页面标题、修复策略、误区清单保持一致的学习者可见语言。
  - 该切片只调整 `/mistakes` 读侧页头文案和源码级 UI 测试，不改误区筛选、`generateMistakeReviewCardAction()`、`markMistakeResolvedAction()`、Coach 预填、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/mistakes-view.test.ts` 首次失败于 `/mistakes` 页头仍为 `badge="Mistakes"`；GREEN 后 11 项通过。
- 本地相关回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 51 项通过，覆盖 Mistakes、Auth/Preview、Review remediation、Today remediation 和共享学习 UI。
- 本地覆盖扫描：`rg -n 'Mistakes Header Badge|badge="错题修复"|badge="Mistakes"|0\\.248\\.0|错题修复页头|Mistakes Header Badge Localization' ...` 确认 `/mistakes` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/mistakes/page.tsx` 中 `badge="Mistakes"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 360 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.247.0] - 2026-06-06

### Fixed

- **[Phase E Path Header Badge Localization]** 本地化 `/path` 学习路径页头 badge。
  - `/path` 的 `PageHeader` badge 从英文 `Path` 改为中文 `学习路径`，让学习路径页头和页面标题、路线图、阶段标签保持一致的学习者可见语言。
  - 该切片只调整 `/path` 读侧页头文案和源码级 UI 测试，不改 `buildLearningPathSnapshot()`、阶段状态、Current Mission、路线图 CTA、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-path.test.ts` 首次失败于 `/path` 页头仍为 `badge="Path"`；GREEN 后 4 项通过。
- 本地相关回归：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过，覆盖 Path、Weekly、Mistakes、Auth/Preview 和共享学习 UI。
- 本地覆盖扫描：`rg -n 'Path Header Badge|badge="学习路径"|badge="Path"|0\\.247\\.0|学习路径页头' ...` 确认 `/path` 源码和测试已接入页头 badge 中文化要求；`src/app/path/page.tsx` 中 `badge="Path"` 无匹配。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 359 项通过，Next 构建生成 28 个静态页面，路由表包含 `/path`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.246.0] - 2026-06-06

### Fixed

- **[Phase E Admin DailyPlan Status Source Localization]** 本地化 `/admin` 计划治理区的 DailyPlan 状态和来源标签。
  - Admin 正式计划状态汇总、来源汇总、重复主题检测、单条计划审计链路、审计异常队列和最近 DailyPlan 列表统一复用 `formatHomeDailyPlanStatusLabel()` / `formatTodayPlanSourceLabel()`，把 `planned` / `completed` / `deepseek` / `template` 等 raw 值改为 `待完成`、`已完成`、`AI 生成`、`模板兜底` 等中文业务文案。
  - Admin 批量归档按钮从 `归档所有 test 计划` / `归档未来 planned 计划` 改为 `归档所有测试计划` / `归档未来待完成计划`。
  - 该切片只调整 Admin 读侧展示文案和源码级 UI 测试，不改 DailyPlan 状态/来源数据契约、计划过滤 query 值、计划归档 action、审计服务、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 尚未接入 DailyPlan 状态/来源中文 helper；GREEN 后 1 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts` 19 项通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio 和内容审查队列。
- 本地覆盖扫描：`rg -n "Admin DailyPlan Status Source|formatHomeDailyPlanStatusLabel|formatTodayPlanSourceLabel|归档所有测试计划|归档未来待完成计划|待完成|已完成|AI 生成|模板兜底|后台重建|0\\.246\\.0" ...` 确认 `/admin` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入 DailyPlan 状态/来源中文化要求。
- 本地窄扫描：`rg -n "test 计划|planned 计划|unknown domain|<span>\\{g\\.status\\}</span>|<span>\\{g\\.source \\?\\? \\\"unknown\\\"\\}</span>|\\{planAudit\\.chain\\.plan\\.status\\}|\\{planAudit\\.chain\\.plan\\.source \\?\\? \\\"unknown\\\"\\}|\\{item\\.status\\}|\\{item\\.source \\?\\? \\\"unknown\\\"\\}|\\{p\\.status\\}|\\{p\\.source \\?\\? \\\"unknown\\\"\\}" src/app/admin/page.tsx` 无匹配，确认旧 raw 状态/来源直出模板已从 `/admin` 生产源码移除。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 359 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.245.0] - 2026-06-06

### Fixed

- **[Phase E Admin Plan Governance Label Localization]** 本地化 `/admin` 计划治理区的维护者可见状态标签。
  - Admin 计划过滤、正式/测试/归档状态、单条计划审计链路、审计异常队列、最近 CurriculumDecision 和激活历史统一使用中文业务标签，例如 `正式`、`测试`、`已归档`、`正式计划`、`测试计划`、`成功`、`失败`。
  - 该切片只调整 Admin 读侧展示文案和源码级 UI 测试，不改计划过滤 query 值、`AdminPlanFilter` 技术枚举、计划激活/归档 action、审计服务、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-page-labels.test.ts` 首次失败于 `/admin` 仍显示 `test` / `official` / `archived` 等可见标签；GREEN 后 1 项通过。
- 本地相关回归：`npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts` 16 项通过，覆盖 Admin 计划治理、审计链路、审计异常、planner 可见性和 Prompt Studio。
- 本地覆盖扫描：`rg -n "Admin Plan Governance Label|adminPlanFilterLabel|adminPlanKindLabel|adminPlanActivationLabel|正式计划状态|来源 / schema|设为正式|激活历史|暂无激活记录|>test<|>official<|>archived<|0\\.245\\.0" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入计划治理标签中文化要求；旧英文状态直出模板已从 `/admin` 生产源码移除。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 359 项通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.244.0] - 2026-06-06

### Fixed

- **[Phase E Project Template Metadata Localization]** 本地化 `/projects` 项目模板列表的元信息。
  - `ProjectTemplateList` 将 `2h` / `3 steps` 一类学习者可见英文缩写改为 `约 2 小时` / `3 个里程碑`。
  - 该切片只调整项目模板卡读侧展示文案和源码级 UI 测试，不改项目模板数据、项目创建 action、里程碑持久化、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectTemplateList` 仍显示 `2h` 和 `3 steps`；GREEN 后 17 项通过。
- 本地相关回归：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 42 项通过，覆盖 Projects UI、项目服务规则和 Today 完成后项目推荐。
- 本地覆盖扫描：`rg -n "Project Template Metadata|ProjectTemplateList|约 \\{template\\.estimatedHours\\} 小时|\\{template\\.milestoneCount\\} 个里程碑|\\{template\\.estimatedHours\\}h|\\{template\\.milestoneCount\\} steps|2h|3 steps|0\\.244\\.0" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入模板元信息中文化要求；旧英文缩写仅保留在测试反向断言和历史证据文本中。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 358 项通过，Next 构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.243.0] - 2026-06-06

### Fixed

- **[Phase E XP Level Label Localization]** 本地化首页和 `/progress` 的 XP 等级卡可见等级文案。
  - `XpLevelCard` 新增展示层等级映射，把 `Lv.3 Algorithm Thinker` / `LLM Practitioner` 等英文等级文案改为 `第 3 级 算法思考者` / `LLM 实践者`。
  - 该切片只调整 XP 等级卡读侧展示文案和源码级 UI 测试，不改 XP 计算、等级阈值、`LearningLevel.label` 数据契约、Daily Quest、徽章、周目标、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 `XpLevelCard` 仍显示 `Lv.3 Algorithm Thinker` 和 `LLM Practitioner`；GREEN 后 10 项通过。
- 本地相关回归：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 54 项通过，覆盖学习动机卡、首页标签、Progress analytics 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Lv\\.|Algorithm Thinker|LLM Practitioner|AI Explorer|Code Builder|AI Systems Learner" src/app src/components -g "*.tsx"` 确认生产 UI 中英文等级名只保留在 `XpLevelCard` 内部映射键，不再直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 358 项通过，Next 构建生成 28 个静态页面，路由表包含 `/` 和 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.242.0] - 2026-06-06

### Fixed

- **[Phase E Badge Shelf Earned Label Localization]** 本地化首页和 `/progress` 徽章架顶部解锁计数。
  - `BadgeShelf` 顶部状态 badge 从 `{earned} earned` 改为 `已解锁 N 个`，避免学习者在学习动机卡里看到英文状态词。
  - 该切片只调整共享学习动机组件的读侧展示文案和源码级 UI 测试，不改徽章计算、XP、Daily Quest、周目标、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 `BadgeShelf` 仍显示英文 `1 earned`，GREEN 后 9 项通过。
- 本地相关回归：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 53 项通过，覆盖学习动机卡、首页标签、Progress analytics 和共享学习 UI。
- 本地覆盖扫描：`rg -n "Phase E Badge Shelf|BadgeShelf|已解锁 \\{earned\\} 个|\\{earned\\} earned|0\\.242\\.0" ...` 确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入徽章解锁计数中文化要求；窄扫描确认生产组件没有 `{earned} earned` 直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 357 项通过，Next 构建生成 28 个静态页面，路由表包含 `/` 和 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.241.0] - 2026-06-06

### Fixed

- **[Phase E Voice Transcription Result Detail Label Localization]** 本地化 `/voice` 录音/上传区的转写结果详情。
  - `VoiceCapture` 新增 `formatVoiceTranscriptionProviderLabel()` 和 `formatVoiceTranscriptionResultNote()`，把 `provider:` / `model:` / `reason:` 技术标签改为 `转写方式：自动转写/手动整理` 和 `提示：...`。
  - 该切片只调整 `/voice` 录音/上传组件的读侧展示文案和源码级 UI 测试，不改转写 provider、server action、`TranscribeResult.provider/model/reason` 数据契约、保存流程、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `VoiceCapture` 缺少 `formatVoiceTranscriptionProviderLabel(lastResult.provider)` / `formatVoiceTranscriptionResultNote(lastResult)`，且仍显示 `provider:` / `model:` / `reason:`；GREEN 后 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 57 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n 'Phase E Voice Transcription Result Detail|formatVoiceTranscriptionProviderLabel\\(lastResult\\.provider\\)|...|0\\.241\\.0' ...` 确认 `/voice` 捕获组件、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入转写结果详情本地化要求；窄扫描确认生产组件没有 `provider:` / `model:` / `reason:` 直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 357 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.240.0] - 2026-06-06

### Fixed

- **[Phase E Voice Transcription Result Status Label Localization]** 本地化 `/voice` 录音/上传区的转写结果状态 badge。
  - `VoiceCapture` 新增 `formatVoiceTranscriptionResultStatusLabel()`，把 `success` / `manual_required` 展示为 `转写成功` / `需手动整理`，避免学习者在 Voice 捕获结果区看到 raw 后端状态。
  - 该切片只调整 `/voice` 录音/上传组件的读侧展示文案和源码级 UI 测试，不改转写 provider、server action、`VoiceTranscriptionResult.status` 数据契约、保存流程、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `VoiceCapture` 缺少 `formatVoiceTranscriptionResultStatusLabel(lastResult.status)` 且仍直接渲染 `{lastResult.status}`；GREEN 后 11 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n 'Phase E Voice Transcription Result|formatVoiceTranscriptionResultStatusLabel\\(lastResult\\.status\\)|...|0\\.240\\.0' ...` 确认 `/voice` 捕获组件、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入转写结果状态本地化要求；窄扫描确认生产组件没有 `{lastResult.status}`、`>manual_required<` 或 `>success<` 直出。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 356 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.239.0] - 2026-06-06

### Fixed

- **[Phase E Voice Mode Fallback Label Localization]** 本地化 `/voice` 当前笔记和最近 Voice Notes 的未知 mode fallback。
  - `/voice/page.tsx` 新增 `voiceModeLabel()`，已知 mode 继续显示 `自由想法`、`今日课程`、`代码调试` 等中文业务标签，未知/历史 mode 统一兜底为 `语音反思`。
  - 该切片只调整 `/voice` 读侧展示文案和源码级 UI 测试，不改 `VoiceNote.mode` 数据契约、mode normalize、转写 provider、Coach handoff、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `/voice` 没有 `voiceModeLabel()`，并且仍使用 `MODE_LABELS.get(selected.mode) ?? selected.mode` / `MODE_LABELS.get(n.mode) ?? n.mode` 直出 unknown mode；GREEN 后 10 项通过。
- 本地覆盖扫描：`rg -n 'Phase E Voice Mode Fallback|voiceModeLabel\\(mode: string\\)|...|0\\.239\\.0|unknown mode|raw mode' ...` 确认 `/voice` 源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入 unknown mode fallback 本地化要求；旧 raw mode fallback 模板没有出现在 `/voice` 生产源码里。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 355 项通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.238.0] - 2026-06-06

### Fixed

- **[Phase E Coach Suggested Flashcard Type Label Localization]** 本地化 `/coach` 建议卡片中的卡片类型标签。
  - `CoachFlashcardPanel` 复用 `formatFlashcardTypeLabel(card.type)`，把 `concept`、`code_bug`、`quiz_error` 等 raw flashcard type 显示为 `概念卡`、`代码反馈卡`、`错题卡` 等中文业务标签。
  - 该切片只调整 `/coach` 卡片沉淀区读侧展示文案和测试，不改 Flashcard type 数据契约、卡片生成、Review 队列、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 Coach 建议卡片仍显示 raw `concept`；GREEN 后 10 项通过。
- 本地覆盖扫描：`rg -n 'Phase E Coach Suggested Flashcard|formatFlashcardTypeLabel\\(card\\.type\\)|...|0\\.238\\.0|概念卡|代码反馈卡|错题卡|concept|code_bug|quiz_error' ...` 确认 `/coach` 源码、helper、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入建议卡片 type 标签本地化要求；旧 raw card type 模板没有出现在 `/coach` 建议卡片生产源码里。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 55 项通过，覆盖 Coach 工作区、共享学习 UI、Progress 和 Library 标签回归。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 354 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.237.0] - 2026-06-06

### Fixed

- **[Phase E Coach Thought Review Mode Label Localization]** 本地化 `/coach` 导师反馈和最近评审中的 Coach mode 标签。
  - `/coach/page.tsx` 复用 `formatCoachModeLabel()`，把 selected review 和最近评审列表里的 `today_lesson`、`code_reasoning`、`concept_question` 等 raw mode 显示为 `今日课程`、`代码思路`、`概念疑问` 等中文业务标签。
  - 该切片只调整 `/coach` 读侧展示文案和测试，不改 `ThoughtReview.mode`、Coach 提交流程、Voice-to-Coach mode 映射、上下文构造、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 `/coach` 缺少 `formatCoachModeLabel()` 接线且仍直接渲染 `{selected.mode}` / `{r.mode}`；GREEN 后 10 项通过。
- 本地覆盖扫描：`rg -n 'Phase E Coach Thought Review|formatCoachModeLabel\\(selected\\.mode\\)|formatCoachModeLabel\\(r\\.mode\\)|...\|0\\.237\\.0|代码思路|概念疑问|today_lesson|code_reasoning|concept_question' ...` 确认 `/coach` 源码、helper、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入 Coach mode 标签本地化要求；旧 raw badge 模板没有出现在 `/coach` 生产源码里。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts` 42 项通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress 和 Library 相关回归。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 354 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.236.0] - 2026-06-06

### Fixed

- **[Phase E Library Thought Review Mode Label Localization]** 本地化 `/library` 课程详情中的 Coach 思路评审模式标签。
  - `/library/page.tsx` 在 `Coach 思路评审` 区块复用 `formatCoachModeLabel(r.mode)`，把 `code_reasoning`、`concept_question` 等 raw mode 显示为 `代码思路`、`概念疑问` 等中文业务标签。
  - 该切片只调整 `/library` 读侧展示文案和测试，不改 `ThoughtReview.mode`、Coach 提交流程、Voice-to-Coach mode 映射、课程详情查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 缺少 `formatCoachModeLabel(r.mode)` 接线且仍直接渲染 `{r.mode}`；GREEN 后 3 项通过。
- 本地覆盖扫描：`rg -n 'Phase E Library Thought Review|formatCoachModeLabel\\(r\\.mode\\)|formatCoachModeLabel|<Badge variant="outline">\\{r\\.mode\\}</Badge>|0\\.236\\.0|代码思路|概念疑问|code_reasoning|concept_question' ...` 确认 `/library` 源码、helper、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入课程详情 Coach mode 标签本地化要求；旧 raw badge 模板没有出现在 `/library` 生产源码里。
- 本地门禁：`npm run build` 通过；Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，当前和多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.235.0] - 2026-06-06

### Fixed

- **[Phase E Progress Thought Review Mode Label Localization]** 本地化 `/progress` 最近思路评审列表中的学习者可见模式标签。
  - 新增 `formatCoachModeLabel()` 展示 helper，把 `today_lesson`、`concept_question`、`code_reasoning`、`algorithm_design`、`glossary_term`、`industry_radar`、`free_thought` 等 Coach mode 显示为中文业务标签。
  - `/progress/page.tsx` 在“最近思路评审”中使用 `formatCoachModeLabel(r.mode)`，不再直接显示 raw `r.mode`。
  - 该切片只调整 `/progress` 读侧展示文案和测试，不改 `ThoughtReview.mode`、Coach 提交流程、Voice-to-Coach mode 映射、Prisma 查询、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 缺少 `formatCoachModeLabel(r.mode)` 接线且仍直接渲染 `{r.mode}`；GREEN 后 18 项通过。
- 本地覆盖扫描：`rg -n 'Phase E Progress Thought Review|formatCoachModeLabel\\(r\\.mode\\)|formatCoachModeLabel|...\|0\\.235\\.0|代码思路|概念疑问|code_reasoning|concept_question' ...` 确认 `/progress` 源码、helper、测试、UI checklist、Learning Analytics 文档、CHANGELOG 和 Aegis 记录均接入最近思路评审 mode 标签本地化要求；旧 raw badge 模板没有出现在 `/progress` 生产源码里。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 353 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.234.0] - 2026-06-06

### Fixed

- **[Phase E Progress Recent Signal Label Localization]** 本地化 `/progress` 最近学习信号列表中的学习者可见状态标签。
  - `/progress/page.tsx` 在“最近代码反馈”中复用 `formatHomeCodeFeedbackOverallLabel()`，把 raw `partially_correct` 等 feedback overall 改为 `部分正确`、`需要重写`、`需要更多信息` 等中文业务标签。
  - `/progress/page.tsx` 在“最近项目实践”中复用 `missionStatusText()`，把 raw `active` / `completed` 等项目状态改为 `进行中` / `已完成`。
  - 该切片只调整 `/progress` 读侧展示文案和测试，不改统计聚合、Prisma 查询、项目状态数据契约、代码反馈 schema、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 缺少 `formatHomeCodeFeedbackOverallLabel(f.overall)` 和 `missionStatusText(project.status)` 接线；GREEN 后 18 项通过。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-code-exercise.test.ts tests/unit/projects.test.ts` 55 项通过，覆盖 Progress、共享标签 helper、Projects 状态文案、Today code exercise 和项目服务规则回归。
- 本地覆盖扫描：`rg -n 'Phase E Progress Recent Signal|formatHomeCodeFeedbackOverallLabel\\(f\\.overall\\)|missionStatusText\\(project\\.status\\)|...\|0\\.234\\.0|部分正确|进行中' ...` 确认 `/progress` 源码、测试、UI checklist、Learning Analytics 文档、CHANGELOG 和 Aegis 记录均接入最近学习信号标签本地化要求；旧 raw 渲染模板没有出现在 `/progress` 生产源码里。
- 本地门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 353 项通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债：当前 work 缺 `task-intent-draft.json`，多个既有 work markdown 未索引；该结果不是产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.233.0] - 2026-06-06

### Fixed

- **[Phase E Projects Code Feedback Label Localization]** 本地化 `/projects` 当前里程碑代码反馈的学习者可见标签。
  - `/projects/page.tsx` 复用展示层 helper，把当前里程碑反馈 badge 从 raw `partially_correct` / `reviewed` 改为 `部分正确` / `已评审`，把 issue 行从 raw `high / logic` 改为 `高优先级 / 逻辑问题`。
  - 同步将 linked feedback id 前缀从英文 `feedback` 改为 `代码反馈`，不改 `CodeFeedback.overall`、issue schema、`ProjectMilestone.codeSubmissionId`、评审服务、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `/projects` 缺少代码反馈中文 helper 接线，仍直接渲染 raw `overall`、`severity/type` 和英文 `feedback` 前缀；GREEN 后 17 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/progress-analytics.test.ts` 54 项通过，覆盖 Projects UI、项目服务规则、共享标签 helper、Today code exercise 和 Progress code trend 回归。
- 本地覆盖扫描：`rg -n 'Phase E Projects Code Feedback|formatHomeCodeFeedbackOverallLabel\\(activeMilestoneFeedback\\.feedback\\.overall\\)|formatCodeFeedbackIssueSeverityLabel\\(issue\\.severity\\)|formatCodeFeedbackIssueTypeLabel\\(issue\\.type\\)|代码反馈 \\{activeMilestone\\.codeSubmissionId\\.slice\\(0, 8\\)\\}|\\{activeMilestoneFeedback\\.feedback\\.overall \\?\\? "reviewed"\\}|\\{issue\\.severity\\} / \\{issue\\.type\\}:|feedback \\{activeMilestone\\.codeSubmissionId\\.slice\\(0, 8\\)\\}|0\\.233\\.0|高优先级 / 逻辑问题' ...` 确认 `/projects` 源码、helper、测试、UI checklist、Project Practice 文档、CHANGELOG 和 Aegis 记录均接入项目代码反馈标签本地化要求；旧 raw 渲染模板仅保留在测试/证据反向断言文本中。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 352 项通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.232.0] - 2026-06-06

### Fixed

- **[Phase E Today Breadth Confidence Label Localization]** 本地化 `/today` 今日广度小卡的可信度标签。
  - `/today/page.tsx` 复用 `formatRadarConfidenceLabel()`，把广度小卡 badge 从 raw `high` / `medium` / `low` 改为 `可信度：高` / `可信度：中` / `可信度：低`。
  - 该切片只调整 Today 页面学习者可见文案和源码级 UI 测试，不改 `KnowledgeEntity.confidence` 数据契约、Radar 页面、查询条件、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `/today` 缺少 `breadthConfidenceLabel` 且仍直接渲染 `{breadthDetail.confidence}`；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过，覆盖 Today、Radar/Glossary、Knowledge Map、首页标签和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n 'Phase E Today Breadth Confidence|breadthConfidenceLabel|formatRadarConfidenceLabel\\(breadthDetail\\?\\.confidence\\)|可信度：高|\\{breadthDetail\\.confidence\\}|raw `high`|0\\.232\\.0' ...` 确认 `/today` 源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入可信度本地化要求；`{breadthDetail.confidence}` 只保留在测试/证据里的反向断言文本。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 351 项通过，Next 构建生成 28 个页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.231.0] - 2026-06-06

### Fixed

- **[Phase E Path Project Milestone Label Localization]** 本地化 `/path` 路线图当前信号中的项目里程碑指标。
  - `/path/page.tsx` 将 `milestone：{completed}/{total}` 改为 `项目里程碑：{completed}/{total}`。
  - 该切片只调整学习路径页面可见文案和单元测试，不改 `buildLearningPathSnapshot()`、项目统计、阶段状态、CTA、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-path.test.ts` 首次失败于 `/path` 缺少 `项目里程碑：` 且仍显示 `milestone：`；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts` 48 项通过，覆盖 Path、Weekly、Projects 和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n "Phase E Path Project Milestone|项目里程碑|milestone：|Path Project Milestone|0\\.231\\.0|Verified|Resume State Hint|Drift Check|Confidence" ...` 确认 `/path` 源码、测试、UI checklist、Path 模块文档、CHANGELOG 和 Aegis 记录均接入 `项目里程碑` 文案；旧 `milestone：` 仅保留在测试反向断言和历史记录文本中。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 351 项通过，Next 构建生成 28 个页面，路由表包含 `/path`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.230.0] - 2026-06-06

### Fixed

- **[Phase E Voice Transcript Copy Localization]** 本地化 Voice 录音和上传转写流程中的学习者可见 `Transcript` 文案。
  - `voice-capture-status.ts` 将状态面板标题、说明和手动粘贴提示统一改为 `转写文本`。
  - `voice-capture.tsx` 将录音后提示和手动按钮文案改为 `停止后自动转写并填入转写文本`、`自动转写到转写文本`。
  - `voice-transcript-autofill.ts` 将自动填入 notice 改为中文业务文案，不再向学习者显示英文 `Transcript`。
  - 该切片只调整 Voice 捕获/自动填入的可见文案和单元测试，不改转写 provider、API 字段名、保存逻辑、Coach handoff、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts` 首次失败于 Voice 状态面板、录音提示、手动转写按钮和 autofill notice 仍显示 `Transcript`；GREEN 后 18 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 通过，覆盖 Voice 捕获状态、Voice Note 表单、自动填入、转写服务、Coach handoff 和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n "Phase E Voice Transcript Copy|转写文本|自动转写到转写文本|停止后自动转写并填入转写文本|Transcript" ...` 确认 Voice 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入转写文案本地化要求；当前 Voice 捕获源码中 `Transcript` 仅保留为内部类型/变量名。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 351 项通过，Next 构建生成 28 个页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.229.0] - 2026-06-06

### Fixed

- **[Phase E Notes Title Input Mobile Touch Targets]** 优化 `/notes` 新建笔记标题输入框的移动端触控目标。
  - `/notes/page.tsx` 新增 `notesInputClassName = "min-h-11"`，接入新建笔记 `标题` 输入框。
  - 该切片只调整 Notes 标题输入尺寸、源码级 UI 测试和文档记录，不改 `createNoteAction()`、`createScopedNote()`、笔记模板、课程归属校验、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/notes-template.test.ts` 首次失败于 `/notes` 缺少 `notesInputClassName`，且标题输入框未接入移动端大触控 class；GREEN 后 6 项通过。
- 本地 GREEN：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 22 项通过，覆盖 Notes 模板、Notes 列表/Voice handoff、Notes 创建权限、Library 下一步和 Today 完成后笔记入口回归。
- 本地覆盖扫描：`rg -n "notesInputClassName|min-h-11|Phase E Notes Title Input|新建笔记|标题" ...` 确认 Notes 源码、测试、UI checklist、CHANGELOG、Notes 模块文档和 Aegis 记录均接入标题输入框移动触控要求。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 350 项通过，Next 构建生成 28 个页面，路由表包含 `/notes`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.228.0] - 2026-06-06

### Fixed

- **[Phase E Projects Milestone Input Mobile Touch Targets]** 优化 `/projects` 今日项目任务表单单行输入框的移动端触控目标。
  - `/projects/page.tsx` 新增 `projectMilestoneInputClassName = "min-h-11"`，接入 `lessonId`、`noteId` 和 `代码语言` 三个单行输入框。
  - 该切片只调整 Projects 里程碑表单输入尺寸、源码级 UI 测试和文档记录，不改项目 server actions、代码评审链路、项目完成逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `/projects` 缺少 `projectMilestoneInputClassName`，且三个里程碑表单输入未接入移动端大触控 class；GREEN 后 16 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 41 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地覆盖扫描：`rg -n "Phase E Projects Milestone Input|projectMilestoneInputClassName|min-h-11|lessonId|noteId|代码语言|Projects Milestone Input Mobile Touch Targets|单行输入框" ...` 确认 `/projects` 源码、测试、UI checklist、CHANGELOG、Project Practice 模块文档和 Aegis 记录均接入里程碑输入框移动触控要求。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 349 项通过，Next 构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.227.0] - 2026-06-06

### Fixed

- **[Phase E Settings Input Mobile Touch Targets]** 优化 `/settings` 学习偏好表单单行输入框的移动端触控目标。
  - `/settings` 新增 `settingsInputClassName = "min-h-11"`，接入显示名称、目标、水平、每日时长、难度、语言、时区和知识卡去重天数 8 个单行输入框。
  - 该切片只调整 Settings 表单单行输入尺寸、源码级 UI 测试和文档记录，不改 `updateSettingsAction()`、`updateUserProfileSettings()`、偏好解析、Preview 写保护、Provider 状态、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/settings-profile.test.ts` 首次失败于 `/settings` 缺少 `settingsInputClassName`，且 8 个单行输入框未接入移动端大触控 class；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 39 项通过，覆盖 Settings 表单输入/保存、Auth/Preview 写保护和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n "Phase E Settings Input|settingsInputClassName|min-h-11|displayName|knowledgeAvoidDays|显示名称|知识卡去重天数|Settings Input Mobile Touch Targets|单行输入框" ...` 确认 `/settings` 源码、测试、UI checklist、CHANGELOG、Settings 模块文档和 Aegis 记录均接入单行输入框移动触控要求。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 348 项通过，Next 构建生成 28 个静态页面，路由表包含 `/settings`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.226.0] - 2026-06-06

### Fixed

- **[Phase E Login Input Mobile Touch Targets]** 优化 `/login` 访问密码和邮箱 Magic Link 输入框的移动端触控目标。
  - 访问密码输入框新增 `passwordLoginInputClassName = "min-h-11"`，让 `输入共享访问密码` 输入框满足 44px 触控高度。
  - 邮箱输入框新增 `emailLoginInputClassName = "min-h-11"`，让 `you@example.com` 输入框满足 44px 触控高度。
  - 该切片只调整登录表单输入尺寸、源码级 UI 测试和文档记录，不改访问密码校验、Magic Link 发送、Demo 入口、Cookie、Auth/Preview 路由策略、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/login-page-ui.test.ts` 首次失败于 `/login` 访问密码和邮箱输入框缺少专用 `min-h-11` class；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/login-page-ui.test.ts tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 38 项通过，覆盖登录页输入/CTA、访问密码服务、Auth/Preview 路由策略和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n "Phase E Login Input|passwordLoginInputClassName|emailLoginInputClassName|min-h-11|输入共享访问密码|you@example.com|登录页访问密码输入框|Login Input Mobile Touch Targets" ...` 确认 `/login` 源码、测试、UI checklist、CHANGELOG、Auth/Demo 模块文档和 Aegis 记录均接入登录输入框移动触控要求。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 347 项通过，Next 构建生成 28 个静态页面，路由表包含 `/login`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.225.0] - 2026-06-06

### Fixed

- **[Phase E Mistakes Search Input Mobile Touch Targets]** 优化 `/mistakes` 筛选区关键词搜索输入框的移动端触控目标。
  - `/mistakes` 新增 `mistakeSearchInputClassName = "min-h-11"`，让 `搜索 RAG / 二分 / SWE-bench / 术语混淆` 输入框满足 44px 触控高度。
  - 该切片只调整错题修复中心搜索输入尺寸、源码级 UI 测试和文档记录，不改状态/来源/类型筛选、误区查询条件、修复动作、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/mistakes-view.test.ts` 首次失败于 `/mistakes` 缺少搜索输入专用 `min-h-11` class；GREEN 后 10 项通过。
- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 50 项通过，覆盖 Mistakes 视图、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI 回归。
- 本地覆盖扫描：`rg -n "Phase E Mistakes Search Input|mistakeSearchInputClassName|min-h-11|搜索 RAG / 二分 / SWE-bench / 术语混淆|搜索错题" ...` 确认 `/mistakes` 源码和测试接入搜索输入移动触控要求。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 346 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.224.0] - 2026-06-06

### Fixed

- **[Phase E Knowledge Search Input Mobile Touch Targets]** 优化 `/glossary` 和 `/radar` 检索输入框的移动端触控目标。
  - `/glossary` 新增 `glossarySearchInputClassName = "min-h-11"`，让 `搜索 CoT / RAG / SWE-bench` 输入框满足 44px 触控高度。
  - `/radar` 新增 `radarSearchInputClassName = "min-h-11"`，让 `搜索 OpenAI / SWE-bench / Cursor` 输入框满足 44px 触控高度。
  - 该切片只调整知识库检索输入尺寸、源码级 UI 测试和文档记录，不改术语/Radar 查询条件、学习路径、关系卡片链、复习卡片生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于 `/glossary` 和 `/radar` 缺少搜索输入专用 `min-h-11` class；GREEN 后 14 项通过。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过，覆盖 Glossary/Radar 知识库、Knowledge Map、Today 知识卡、首页标签和共享学习 UI 回归。
- 本地收尾门禁：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面，路由表包含 `/glossary` 和 `/radar`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.223.0] - 2026-06-06

### Fixed

- **[Phase E Voice Capture Manual Transcribe Mobile Touch Targets]** 优化 `/voice` 录音/上传区的手动转写入口。
  - 上传音频 input 增加 `min-h-11`，手机端满足 44px 触控高度。
  - `自动转写到 Transcript` 行从手机端横向 `flex flex-wrap` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - 该切片只调整 `VoiceCapture` 上传 input 和手动转写行布局、源码级 UI 测试和文档记录，不改录音状态机、`transcribeAudioAction`、转写 Provider、Voice Note 保存、Coach handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于上传音频 input 仍为 `h-8` 且手动转写行仍为手机端横向 `flex flex-wrap`；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过，覆盖 Voice 表单、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.222.0] - 2026-06-06

### Fixed

- **[Phase E Today Reflection Submit CTA Mobile Touch Targets]** 优化 `/today` 两处反思完成表单的移动端提交入口。
  - `标记完成并生成卡片` / `已完成` 按钮现在复用 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端满足 44px 触控高度。
  - 两处提交行从手机端横向 `flex flex-wrap` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - 该切片只调整完成表单提交区布局、源码级 UI 测试和文档记录，不改 `completeTodayAction`、反思内容、复习卡生成、Today 阶段状态、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于两处反思提交行仍为 `flex flex-wrap`，且提交按钮缺少 `todayFocusCtaClassName`；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-remediation-intent.test.ts` 44 项通过，覆盖 Today 入口 CTA、共享学习 UI、阶段状态、完成后行动和补弱入口回归。
- 本地 GREEN：`rg -n "Phase E Today Reflection Submit|标记完成并生成卡片|todayFocusCtaClassName|grid gap-2 sm:flex sm:flex-wrap sm:items-center|flex flex-wrap items-center gap-2" ...` 确认 `/today` 源码和测试接入反思提交移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.221.0] - 2026-06-06

### Fixed

- **[Phase E Library Filter Input Mobile Touch Targets]** 优化 `/library` 课程列表治理筛选输入的移动端触控目标。
  - `source`、`schemaVersion`、`status`、`localDate` 四个筛选输入改为复用 `libraryFilterInputClassName = "min-h-11 rounded-md border bg-background px-3 text-sm"`，手机端满足 44px 触控高度。
  - 该切片只调整筛选输入尺寸、源码级 UI 测试和文档记录，不改 `normalizeLibraryPlanFilters()`、`buildLibraryPlanWhere()`、`buildLibraryPlanHref()`、课程可见性校验、Notes 创建权限、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 缺少 `libraryFilterInputClassName`，且四个治理筛选输入仍为 `h-8`；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 23 项通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口回归。
- 本地 GREEN：`rg -n "Phase E Library Filter Input|libraryFilterInputClassName|min-h-11 rounded-md border bg-background px-3 text-sm|h-8 rounded-md border bg-background px-2 text-sm|source|schemaVersion|localDate" ...` 确认 `/library` 源码和测试接入筛选输入移动触控要求，旧 `h-8` 输入样式已移除。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.220.0] - 2026-06-06

### Fixed

- **[Phase E FocusPlayer Full View Actions Mobile Layout]** 优化 `/today` 专注模式右侧 `完整视图` actions 区的移动端布局。
  - `完整视图` actions row 从手机端横向 `flex flex-wrap` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
  - 该切片只调整 `LearningFocusPlayer` 内 `props.actions` 的响应式容器和源码级 UI 测试，不改 Today 阶段状态、按钮目标、DailyPlan 生成、复习卡生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningFocusPlayer` 的 `完整视图` actions row 仍为手机端横向 `flex flex-wrap`；GREEN 后 24 项通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.219.0] - 2026-06-06

### Fixed

- **[Phase E Today Remediation Banner CTA Mobile Touch Targets]** 优化 `/today?mode=remediation&source=review&focus=...` 补弱短课 Banner 的移动端 action 布局。
  - `先回到主课`、`生成补弱小课` 和 `继续复习` 继续使用 `min-h-11 w-full sm:w-auto`，手机端满足 44px 触控高度。
  - action row 从手机端横向 `flex flex-wrap` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - 该切片只调整 `TodayRemediationBanner` 的 CTA 布局、测试和文档记录，不改 `buildTodayRemediationIntent()`、Review handoff、Today 生成、复习卡生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-remediation-intent.test.ts` 首次失败于补弱 Banner action row 仍为手机端横向 `flex flex-wrap`；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-remediation-intent.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 39 项通过，覆盖补弱 Banner、Review Session Summary、Today completion actions 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Today Remediation Banner|TodayRemediationBanner|先回到主课|生成补弱小课|继续复习|mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入补弱 Banner 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today` 和 `/review`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.218.0] - 2026-06-06

### Fixed

- **[Phase E Library Filter CTA Mobile Touch Targets]** 优化 `/library` 课程列表筛选入口的移动端触控目标。
  - `切换 test`、`切换 archived`、`清空筛选` 和 `应用筛选` 现在复用 `libraryCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
  - 筛选 action row 从手机端横向 `flex flex-wrap` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - 该切片只调整 `/library` 筛选 CTA 布局、按钮样式、测试和文档记录，不改 `normalizeLibraryPlanFilters()`、`buildLibraryPlanWhere()`、`buildLibraryPlanHref()`、课程可见性校验、Notes 创建权限、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于 `/library` 筛选 action row 仍为手机端横向 `flex`，且筛选按钮未接入 `libraryCtaClassName`；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 23 项通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口回归。
- 本地 GREEN：`rg -n "Phase E Library Filter CTA|libraryCtaClassName|切换 test|切换 archived|清空筛选|应用筛选|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认 `/library` 源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入筛选 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 344 项通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.217.0] - 2026-06-06

### Fixed

- **[Phase E Today Header Generate CTA Mobile Touch Targets]** 优化 `/today` 页头 `生成今日内容` 入口的移动端触控目标。
  - 页头 action 现在复用 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
  - 该切片只调整 Today 页头生成入口 CTA 样式、源码级 UI 测试和文档记录，不改 `generateTodayAction`、DailyPlan 生成、AI provider、复习卡生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于页头 `生成今日内容` 缺少 `todayFocusCtaClassName`；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/knowledge-base.test.ts` 54 项通过，覆盖 Today 页头生成入口、共享学习 UI、阶段状态、完成后行动和 Glossary/Radar 知识库回归。
- 本地 GREEN：`rg -n "Phase E Today Header Generate|todayFocusCtaClassName|生成今日内容|min-h-11 w-full sm:w-auto|Today Header Generate CTA Mobile Touch Targets" ...` 确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入页头生成入口移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 343 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today` 和 `/map`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.216.0] - 2026-06-06

### Fixed

- **[Phase E Knowledge Map Next Lesson CTA Mobile Touch Targets]** 优化 `/map` 领域详情底部 `生成下一节` 入口的移动端触控目标。
  - 新增 `mapPageCtaClassName = "min-h-11 w-full sm:w-auto"`，让 `生成下一节` 在手机端全宽并满足 44px 触控高度。
  - 该切片只调整 Knowledge Map 页面级下一课 CTA 样式、源码级 UI 测试和文档记录，不改 `aggregateKnowledgeMapStats()`、`buildKnowledgeMapInsights()`、领域/主题统计口径、`/today` 生成逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于 `/map` 缺少 `mapPageCtaClassName`，且 `生成下一节` 未接入移动端大触控 class；GREEN 后 10 项通过。
- 本地 GREEN：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过，覆盖 Knowledge Map、首页标签、Today、Glossary/Radar 知识库和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Knowledge Map Next Lesson|mapPageCtaClassName|生成下一节|min-h-11 w-full sm:w-auto|Knowledge Map Next Lesson CTA Mobile Touch Targets" ...` 确认 `/map` 源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入下一课 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 343 项通过，Next 构建生成 28 个静态页面，路由表包含 `/map` 和 `/today`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.215.0] - 2026-06-06

### Fixed

- **[Phase E Today Knowledge Card CTA Mobile Touch Targets]** 优化 `/today` 今日术语和今日广度小卡入口的移动端触控目标。
  - `查看术语库` 和 `查看 Radar` 现在复用 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
  - 两个知识卡 action row 从手机端横向 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
  - 该切片只调整 Today 知识卡入口 CTA 样式、源码级 UI 测试和文档记录，不改知识卡生成、链接目标、DailyPlan、复习卡生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `查看术语库` / `查看 Radar` 未接入 `todayFocusCtaClassName`；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/knowledge-base.test.ts` 54 项通过，覆盖 Today 知识卡入口、共享学习 UI、阶段状态、完成后行动和 Glossary/Radar 知识库回归。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.214.0] - 2026-06-06

### Fixed

- **[Phase E Review Page Header CTA Mobile Touch Targets]** 优化 `/review` 页头 `开始复习` 入口的移动端触控目标。
  - 新增 `reviewPageCtaClassName = "min-h-11 w-full sm:w-auto"`，让页头 `开始复习` 在手机端全宽并满足 44px 触控高度。
  - 该切片只调整 `/review` 页头 CTA 样式、源码级 UI 测试和文档记录，不改复习队列、评分规则、ReviewLog 写入、空态 next actions、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `/review/page.tsx` 缺少 `reviewPageCtaClassName` 且 `开始复习` 未接入移动端大触控 class；GREEN 后 24 项通过。
- 本地 GREEN：`npm test -- tests/unit/review-empty-state.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts` 8 项通过，覆盖 Review 空态、完成总结、评分幂等和排期规则回归。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.213.0] - 2026-06-06

### Fixed

- **[Phase E Coach CTA Mobile Touch Targets]** 优化 `/coach` 主要操作入口的移动端触控目标。
  - 新增 `coachPageCtaClassName = "min-h-11 w-full sm:w-auto"`，让 `提交给 Coach` 和 `查看课程` 在手机端全宽并满足 44px 触控高度。
  - 新增 `coachWorkspaceCtaClassName`，让 `生成卡片`、`复习这 N 张 Coach 卡片`、`今日学习`、`复习中心` 和 `查看关联课程` 复用同一移动端大触控样式。
  - 新增 `coachReviewHistoryLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"`，让最近评审列表入口满足 44px 触控高度。
  - 该切片只调整 Coach 页面/组件 CTA 样式、源码级 UI 测试和文档记录，不改 ThoughtReview 创建、Coach prompt、卡片生成 action、Voice handoff、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 Coach 卡片沉淀、Quick Links 和页面级 CTA 未接入移动端大触控 class；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 43 项通过，覆盖 Coach 页面 UI、Voice handoff、Review summary 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Coach CTA|coachPageCtaClassName|coachWorkspaceCtaClassName|coachReviewHistoryLinkClassName|提交给 Coach|查看课程|生成卡片|复习这 .* Coach 卡片|今日学习|复习中心|查看关联课程|min-h-11 w-full sm:w-auto|Coach CTA Mobile Touch Targets" ...` 确认 Coach 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入 Coach CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过，全量单测 340 项通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.212.0] - 2026-06-06

### Fixed

- **[Phase E Login CTA Mobile Touch Targets]** 优化 `/login` 密码登录、邮箱 Magic Link 和 Demo 入口的移动端触控目标。
  - 新增 `loginCtaClassName = "min-h-11 w-full sm:w-auto"`，让 `进入 Demo 模式` 在手机端全宽并满足 44px 触控高度。
  - 新增 `passwordLoginCtaClassName` 和 `emailLoginCtaClassName`，让 `用访问密码进入`、`发送登录链接` 在手机端同样满足全宽大触控目标。
  - 该切片只调整登录页 CTA 样式、源码级 UI 测试和文档记录，不改 Supabase Magic Link、访问密码验证、Demo/Preview 策略、cookie、server action、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/login-page-ui.test.ts` 首次失败于缺少 `loginCtaClassName`，且登录页三类 CTA 未接入移动端大触控 class；GREEN 后 1 项通过。
- 本地 GREEN：`npm test -- tests/unit/login-page-ui.test.ts tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 36 项通过，覆盖登录页 UI、访问密码服务、Auth/Preview 路由策略和共享学习 UI 回归。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.211.0] - 2026-06-06

### Fixed

- **[Phase E Settings Save CTA Mobile Touch Targets]** 优化 `/settings` 保存学习偏好的移动端触控目标。
  - 新增 `settingsPrimaryCtaClassName = "min-h-11 w-full sm:w-auto"`，让 `保存设置` 在手机端全宽并满足 44px 触控高度。
  - 保存区从手机端横向 `flex` 调整为 `grid gap-2`，桌面端保留 `sm:flex sm:items-center sm:gap-2`，避免全宽按钮和 `userId` 文本在窄屏互相挤压。
  - 该切片只调整 `/settings` 保存按钮布局、测试和文档记录，不改 `updateSettingsAction()`、`updateUserProfileSettings()`、Provider 状态、系统版本信息、数据库、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/settings-profile.test.ts` 首次失败于缺少 `settingsPrimaryCtaClassName`，且 `保存设置` 未接入移动端大触控 class；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过，覆盖 Settings 保存、Preview 写保护边界和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Settings Save|settingsPrimaryCtaClassName|min-h-11 w-full sm:w-auto|保存设置|grid gap-2 sm:flex sm:items-center sm:gap-2" ...` 确认 `/settings` 源码、测试、UI checklist、CHANGELOG、Settings 模块文档和 Aegis 记录均接入保存 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/settings`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.210.0] - 2026-06-06

### Fixed

- **[Phase E Weekly Next Step Link Mobile Touch Targets]** 优化 `/weekly` 下周建议步骤入口的移动端触控目标。
  - 新增 `weeklyNextStepLinkClassName = "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors hover:bg-muted/40"`，让 `weekly.nextWeekPlan.steps` 生成的步骤链接在手机端满足 44px 触控高度。
  - 该切片只调整 `/weekly` 下周建议步骤链接样式、测试和文档记录，不改 `getWeeklyReviewData()`、`buildWeeklyReviewSnapshot()`、`buildWeeklyRemediationPlan()`、Weekly Markdown 导出、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于缺少 `weeklyNextStepLinkClassName`，且下周建议步骤链接未接入移动端大触控 class；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 46 项通过，覆盖 Weekly、Progress analytics、共享学习 UI 和首页标签回归。
- 本地 GREEN：`rg -n "Phase E Weekly Next Step|weeklyNextStepLinkClassName|min-h-11 rounded-md border px-3 py-3|下周建议|第 \\{index \\+ 1\\} 步" ...` 确认 `/weekly` 源码、测试、UI checklist、CHANGELOG、Weekly 模块文档和 Aegis 记录均接入下周建议步骤入口移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/weekly`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.209.0] - 2026-06-06

### Fixed

- **[Phase E Progress Recent Signal Link Mobile Touch Targets]** 优化 `/progress` 最近学习信号列表入口的移动端触控目标。
  - 新增 `progressRecentSignalLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"`，让最近完成、开放错题、最近代码反馈、最近思路评审和最近项目实践 5 组列表入口满足 44px 触控高度。
  - 该切片只调整 `/progress` 最近信号列表链接样式、测试和文档记录，不改学习统计聚合、趋势公式、Prisma 查询、路由、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于缺少 `progressRecentSignalLinkClassName`，且 5 个最近学习信号链接未接入移动端大触控 class；GREEN 后 17 项通过。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 45 项通过，覆盖 Progress analytics、Weekly、共享学习 UI 和首页标签回归。
- 本地 GREEN：`rg -n "Phase E Progress Recent Signal|progressRecentSignalLinkClassName|min-h-11 rounded-md border px-3 py-2|最近完成|开放错题|最近代码反馈|最近思路评审|最近项目实践" ...` 确认 `/progress` 源码、测试、UI checklist、CHANGELOG、Learning Analytics 模块文档和 Aegis 记录均接入最近学习信号链接移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/progress`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.208.0] - 2026-06-06

### Fixed

- **[Phase E Path Stage CTA Mobile Touch Targets]** 优化 `/path` 路线图每张阶段卡行动 CTA 的移动端触控目标。
  - 新增 `pathStageCtaClassName`，让阶段卡 `stage.ctaLabel` 链接在手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 阶段卡 header 从手机端横向 `flex flex-wrap` 调整为单列 `grid gap-3`，桌面端保留 `sm:flex sm:items-start sm:justify-between`。
  - 该切片只调整 `/path` 路线卡片 CTA 布局、链接样式、测试和文档记录，不改 `getLearningPathData()`、阶段判定、进度计算、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-path.test.ts` 首次失败于缺少 `pathStageCtaClassName`，且路线图阶段卡 CTA 未接入移动端大触控 class；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 49 项通过，覆盖 Path 阶段卡 CTA、Weekly、Mistakes、Auth/Preview 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Path Stage CTA|pathStageCtaClassName|stage\\.ctaLabel|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-start sm:justify-between|Path Stage CTA Mobile Touch Targets|路线图每张阶段卡|阶段卡行动" ...` 确认 `/path` 源码、测试、UI checklist、CHANGELOG、Path 模块文档和 Aegis 记录均接入阶段卡 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/path`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.207.0] - 2026-06-06

### Fixed

- **[Phase E Mistakes Page CTA Mobile Touch Targets]** 优化 `/mistakes` 页面级 `打开 Coach`、修复策略卡 `去复习` 和筛选表单 `搜索错题` CTA 的移动端触控目标。
  - 新增 `mistakePageCtaClassName = "min-h-11 w-full sm:w-auto"`，让三个页面级 CTA 在手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整 `/mistakes` 页面级导航/筛选 CTA 样式、测试和文档记录，不改筛选语义、`generateMistakeReviewCardAction`、`markMistakeResolvedAction`、Coach 预填、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/mistakes-view.test.ts` 首次失败于缺少 `mistakePageCtaClassName`，且 `打开 Coach` / `去复习` / `搜索错题` 页面级 CTA 未接入移动端大触控 class；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过，覆盖 `/mistakes` 页面级 CTA、修复动作、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Mistakes Page CTA|mistakePageCtaClassName|打开 Coach|去复习|搜索错题|min-h-11 w-full sm:w-auto|Mistakes Page CTA Mobile Touch Targets" ...` 确认 `/mistakes` 源码、测试、UI checklist、CHANGELOG、Mistakes 模块文档和 Aegis 记录均接入页面级 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.206.0] - 2026-06-06

### Fixed

- **[Phase E Voice Page CTA Mobile Touch Targets]** 优化 `/voice` 页面级 `打开 Coach` 和右侧学习链路 `去复习` CTA 的移动端触控目标。
  - 新增 `voicePageCtaClassName = "min-h-11 w-full sm:w-auto"`，让两个页面级 CTA 在手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整 `/voice` 页面级导航 CTA 样式、测试和文档记录，不改 Voice Learning Pipeline 状态机、Voice Note 保存/转写/Coach/Note/Flashcard action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于缺少 `voicePageCtaClassName`，且 `打开 Coach` / `去复习` 页面级 CTA 未接入移动端大触控 class；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 49 项通过，覆盖 Voice 页面、录音状态、转写、Coach handoff 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Voice Page CTA|voicePageCtaClassName|打开 Coach|去复习|min-h-11 w-full sm:w-auto|Voice Page CTA Mobile Touch Targets" ...` 确认 `/voice` 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入页面级 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.205.0] - 2026-06-06

### Fixed

- **[Phase E Voice Pipeline Current Action CTA Mobile Touch Targets]** 优化 `/voice` 语音学习流水线 `当前最优动作` CTA 的移动端触控目标。
  - `当前最优动作` 区从手机端横向 `flex flex-wrap` 改为单列 `grid gap-3`，桌面端保留 `sm:flex sm:items-center sm:justify-between`。
  - 当下一步是可点击链接，例如 `复习这 N 张语音卡片` 时，按钮复用 `mobileCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
  - 该切片只调整 `VoiceLearningPipeline` 当前最优动作 CTA 布局、按钮样式、测试和文档记录，不改 Voice Note action、Coach/Note/Flashcard 服务、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `当前最优动作` 区仍是横向 `flex flex-wrap`，且 `复习这 3 张语音卡片` 仍是 `h-7` 小按钮；GREEN 后 23 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts` 43 项通过，覆盖 Voice pipeline、Voice Note、录音状态和 Coach handoff 回归。
- 本地 GREEN：`rg -n "Phase E Voice Pipeline Current Action|当前最优动作|mobileCtaClassName|复习这 3 张语音卡片|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between" ...` 确认 Voice pipeline 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入当前最优动作 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.204.0] - 2026-06-06

### Fixed

- **[Phase E Glossary CTA Mobile Touch Targets]** 优化 `/glossary` 搜索、复习、制卡和复制入口 CTA 的移动端触控目标。
  - 顶部 `去复习`、检索区 `搜索`、相关术语链 `去复习`、详情底部 `生成复习卡片` 和 `复制详情入口` 现在复用 `glossaryCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - 相关术语链 header 和生成复习卡片 action 区从手机端横向布局改为单列 `grid gap-2`，桌面端保留 `sm:flex`，避免复习、制卡和复制入口在窄屏挤压。
  - 该切片只调整 `/glossary` 学习者 CTA 布局、按钮样式、测试和文档记录，不改术语查询、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于缺少 `glossaryCtaClassName`、搜索 CTA、复习 CTA 和底部制卡/复制 CTA 的移动端大触控 class；GREEN 后 14 项通过。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过，覆盖 Glossary/Radar 知识库、Knowledge Map、Today、首页和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Glossary CTA|glossaryCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...` 确认 Glossary 源码、测试、UI checklist、CHANGELOG、Knowledge Base 模块文档和 Aegis 记录均接入 Glossary CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/glossary`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.203.0] - 2026-06-06

### Fixed

- **[Phase E Knowledge Map Summary CTA Mobile Touch Targets]** 优化 `/map` 顶部强弱领域摘要卡 CTA 的移动端触控目标。
  - `查看领域` 和 disabled `暂无信号` 现在复用 `mapSummaryCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整 `/map` 摘要卡 CTA 样式、测试和文档记录，不改 `buildKnowledgeMapInsights()`、masteryScore 公式、地图聚合查询、路由、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于缺少 `mapSummaryCtaClassName`，`查看领域` 和 disabled `暂无信号` 摘要 CTA 缺少移动端大触控 class；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 51 项通过，覆盖 Knowledge Map、首页、Today、知识库路径和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Knowledge Map Summary CTA|mapSummaryCtaClassName|查看领域|暂无信号|min-h-11 w-full sm:w-auto" ...` 确认 `/map` 源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入摘要 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/map`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.202.0] - 2026-06-06

### Fixed

- **[Phase E Radar CTA Mobile Touch Targets]** 优化 `/radar` 搜索、复习、制卡和复制入口 CTA 的移动端触控目标。
  - 顶部 `去复习`、筛选区 `搜索`、关系卡片链 `去复习`、详情底部 `生成复习卡片` 和 `复制详情入口` 现在复用 `radarCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - 关系卡片链 header 和生成复习卡片 action 区从手机端横向布局改为单列 `grid gap-2`，桌面端保留 `sm:flex`，避免复习、制卡和复制入口在窄屏挤压。
  - 该切片只调整 `/radar` 学习者 CTA 布局、按钮样式、测试和文档记录，不改 Radar 数据、关系卡片服务、生成复习卡片 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于缺少 `radarCtaClassName`、搜索 CTA、复习 CTA 和底部制卡/复制 CTA 的移动端大触控 class；GREEN 后 13 项通过。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 50 项通过，覆盖 Radar/Glossary 知识库、Knowledge Map、Today、首页和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Radar CTA|radarCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...` 确认 Radar 源码、测试、UI checklist、CHANGELOG、Radar 模块文档和 Aegis 记录均接入 Radar CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/radar`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.201.0] - 2026-06-06

### Fixed

- **[Phase E Library Lesson CTA Mobile Touch Targets]** 优化 `/library` 课程详情学习者 CTA 的移动端触控目标。
  - `课程下一步` action panel 和 `关联笔记` 的 `写笔记` 入口现在复用 `libraryCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - 课程下一步 action 区和关联笔记 header 从手机端横向布局改为单列 `grid gap-2`，桌面端保留 `sm:flex`，避免课程复盘和笔记沉淀入口在窄屏挤压。
  - 该切片只调整 `/library` 课程详情 CTA 布局、按钮样式、测试和文档记录，不改筛选表单、`buildLibraryLessonNextActions`、课程可见性校验、Notes 创建权限、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于缺少 `libraryCtaClassName`、课程下一步 action 单列布局和 `写笔记` 移动端大触控 class；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts` 22 项通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口回归。
- 本地 GREEN：`rg -n "Phase E Library Lesson CTA|libraryCtaClassName|课程下一步|写笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认 Library 源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入课程详情 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.200.0] - 2026-06-06

### Fixed

- **[Phase E Notes CTA Mobile Touch Targets]** 优化 `/notes` 新建笔记主流程 CTA 的移动端触控目标。
  - `去今日学习`、`看课程档案` 和 `保存笔记` 现在复用 `notesCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - 关联课程 action 区和保存 action 区从手机端横向布局改为单列 `grid gap-2`，桌面端保留 `sm:flex`，避免笔记沉淀入口在窄屏挤压。
  - 该切片只调整 `/notes` CTA 布局、按钮样式、测试和文档记录，不改 `createNoteAction`、`createScopedNote`、课程可见性校验、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/notes-template.test.ts` 首次失败于缺少 `notesCtaClassName`、关联课程 action 单列布局和保存 action 单列布局；GREEN 后 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 21 项通过，覆盖 Notes 模板、Notes 列表、Notes 创建权限、Library 下一步和 Today 完成后笔记入口回归。
- 本地 GREEN：`rg -n "Phase E Notes CTA|notesCtaClassName|去今日学习|看课程档案|保存笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:items-center" ...` 确认 Notes 源码、测试、UI checklist、CHANGELOG、Notes 模块文档和 Aegis 记录均接入 Notes CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/notes`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.199.0] - 2026-06-06

### Fixed

- **[Phase E Mistakes Repair Action CTA Mobile Touch Targets]** 优化 `/mistakes` 误区修复动作的移动端触控目标。
  - `让 Coach 解释`、`生成复习卡`、`标记已解决`、`回到课程` 现在复用 `mistakeRepairActionCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - 误区修复动作组从手机端横向 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`，避免多个修复动作在窄屏挤压。
  - 该切片只调整 `/mistakes` 修复动作 CTA 布局、按钮样式、测试和文档记录，不改 `generateMistakeReviewCardAction`、`markMistakeResolvedAction`、Coach 预填、筛选逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/mistakes-view.test.ts` 首次失败于缺少 `mistakeRepairActionCtaClassName` 和修复动作移动端单列布局；GREEN 后 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 46 项通过，覆盖 `/mistakes` 修复动作、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Phase E Mistakes Repair Action|mistakeRepairActionCtaClassName|让 Coach 解释|生成复习卡|标记已解决|回到课程|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...` 确认 `/mistakes` 源码、测试、UI checklist、CHANGELOG、Mistakes 模块文档和 Aegis 记录均接入修复动作 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.198.0] - 2026-06-06

### Fixed

- **[Phase E Today Review Summary CTA Mobile Touch Targets]** 优化 `/today` 右侧“今日复习入口”的 `reviewSummary.ctaLabel` CTA 移动端触控目标。
  - 可点击的 `/review` 入口和未完成时的 disabled 状态现在都复用 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`。
  - `今日复习入口` 的行动按钮在手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 `/today` 右侧复习摘要 CTA 样式、测试和文档记录，不改复习摘要服务、复习队列路由、生成今日内容 action、完成今日学习 action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `reviewSummary.ctaLabel` 附近缺少 `className={todayFocusCtaClassName}`；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts` 38 项通过，覆盖 Today 复习摘要 CTA、专注入口 CTA、共享学习 UI、阶段状态和完成后行动回归。
- 本地 GREEN：`rg -n "Today Review Summary CTA|reviewSummary\\.ctaLabel|todayFocusCtaClassName|今日复习入口|min-h-11 w-full sm:w-auto" ...` 确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入复习摘要 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.197.0] - 2026-06-06

### Fixed

- **[Phase E Today Focus Entry CTA Mobile Touch Targets]** 优化 `/today` 专注模式入口和完整视图 hero CTA 的移动端触控目标。
  - `/today/page.tsx` 新增局部 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`，用于今日目标卡、FocusPlayer 顶部 action 和完整视图 hero 中的核心入口 CTA。
  - `完整视图`、`复习入口`、`查看完整课程内容`、`完成沉淀`、`继续步骤`、`去做小测验`、`完成并生成卡片` 现在手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 今日目标卡和完整视图 hero 的 `LearningCTAGroup` 从手机端横向 `flex` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`，避免多个小入口在窄屏挤压。
  - 该切片只调整 `/today` 入口 CTA 样式、测试和文档记录，不改生成今日内容 action、完成今日学习 action、FocusPlayer 状态逻辑、折叠区行为、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于缺少 `todayFocusCtaClassName` 和 `/today` 核心入口 CTA 移动端大触控 class；GREEN 后 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts` 38 项通过，覆盖 Today 入口 CTA、共享学习 UI、阶段状态和完成后行动回归。
- 本地 GREEN：`rg -n "Today Focus Entry CTA|todayFocusCtaClassName|完整视图|复习入口|查看完整课程内容|完成沉淀|继续步骤|去做小测验|完成并生成卡片|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入 Today 入口 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建路由表包含 `/today`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.196.0] - 2026-06-06

### Fixed

- **[Phase E Review Completion CTA Mobile Touch Targets]** 优化 `/review` 完成总结底部 CTA 的移动端触控目标。
  - `ReviewTrainer` 完成态底部 action row 使用手机端单列 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
  - `让 Coach 拆解薄弱点` 和 `回到今日学习` 等主/次 CTA 使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 测试断言改为对齐 `buildReviewSessionSummary()` 的实际次级 CTA 文案 `回到今日学习`，避免把不存在的 `继续复习计划` 当成产品要求。
  - 该切片只调整 Review 完成态 CTA 样式、测试和文档记录，不改复习评分 action、复习调度、完成总结服务规则、Coach/Today/Mistakes 跳转目标、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 接手时首次失败于测试断言使用不存在的 `继续复习计划` 文案；修正为实际 UI 文案 `回到今日学习` 后 23 项通过，并覆盖两个完成态 CTA 附近的 `min-h-11 w-full sm:w-auto`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts` 26 项通过，覆盖 Review 完成态 UI、总结服务和评分幂等回归。
- 本地 GREEN：`rg -n "Review Completion CTA|让 Coach 拆解薄弱点|回到今日学习|继续复习计划|mt-4 grid gap-2 sm:flex sm:flex-wrap|min-h-11 w-full sm:w-auto" ...` 确认源码、测试、UI checklist、CHANGELOG、Review 模块文档和 Aegis 记录均接入 Review 完成态 CTA 移动触控要求；`继续复习计划` 只作为历史 RED 证据出现，不是当前 UI 文案。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建路由表包含 `/review`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.195.0] - 2026-06-06

### Fixed

- **[Phase E Voice Workspace Form CTA Mobile Touch Targets]** 优化 Voice 输入表单 `开始 60 秒反思`、`清空` 和 `保存并进入分析` CTA 的移动端触控目标。
  - `VoiceWorkspaceForm` 新增局部 `voiceFormCtaClassName = "min-h-11 w-full sm:w-auto"`，三个表单 CTA 手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 反思模板 header 和转写文本 header 从手机端横向 `flex` 改为 `grid gap-2`，桌面端保留 `sm:flex`，避免标题和按钮在窄屏互相挤压。
  - 该切片只调整 Voice 表单 CTA 样式、测试和文档记录，不改 Voice Note 保存 action、录音/转写逻辑、Coach handoff、Note/Flashcard 生成、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `开始 60 秒反思` 仍是 `h-7` 小按钮且缺少 `min-h-11 w-full sm:w-auto`；GREEN 后 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 48 项通过，覆盖 Voice 表单、录音状态、转写、Coach handoff 和共享学习 UI。
- 本地 GREEN：`rg -n "Voice Workspace Form CTA|voiceFormCtaClassName|开始 60 秒反思|清空|保存并进入分析|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex" ...` 确认 Voice 表单、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Voice 表单 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建路由表包含 `/voice`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.194.0] - 2026-06-06

### Fixed

- **[Phase E Projects Milestone Form CTA Mobile Touch Targets]** 优化 `/projects` 今日项目任务表单 `完成里程碑`、`保存草稿` 和 `保存并评审代码` CTA 的移动端触控目标。
  - `/projects/page.tsx` 中里程碑 action 组现在使用手机端单列 `grid`，桌面端保留横向 `sm:flex sm:flex-wrap sm:items-center`。
  - 三个表单 CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Projects 里程碑表单 CTA 样式、测试和文档记录，不改 `completeMilestoneAction`、`saveMilestoneDraftAction`、`reviewMilestoneCodeAction`、项目状态计算、项目路由、review focused queue、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `/projects/page.tsx` 里程碑表单 CTA 缺少 `min-h-11 w-full sm:w-auto`；GREEN 后 15 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 40 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "Projects Milestone Form CTA|完成里程碑|保存草稿|保存并评审代码|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认页面、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入里程碑表单 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过，Next 构建路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis 结构检查：`bundle` 仍失败于缺少历史 `task-intent-draft.json`，`check` 仍失败于多个既有 `docs/aegis/work/.../*.md` 未索引；归类为方法包结构债，不是本轮产品 UI 验证失败。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.193.0] - 2026-06-06

### Fixed

- **[Phase E Projects Page CTA Mobile Touch Targets]** 优化 `/projects` 页面级 `看进度`、项目复盘 `复习项目卡片`、`生成项目总结` 和 `打开作品集` CTA 的移动端触控目标。
  - `/projects/page.tsx` 中四个页面级 CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Projects 页面级 CTA 样式、测试和文档记录，不改 AppShell、项目完成 action、作品集路由、review focused queue、项目提交/评审逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `/projects/page.tsx` 页面级 CTA 缺少 `min-h-11 w-full sm:w-auto`；GREEN 后 14 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 39 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "Projects Page CTA|看进度|生成项目总结|打开作品集|复习项目卡片|min-h-11 w-full sm:w-auto" ...` 确认页面、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Projects 页面级 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.192.0] - 2026-06-06

### Fixed

- **[Phase E Project Review Queue CTA Mobile Touch Targets]** 优化 Projects 复习队列 `复习代码反馈` 和 `复习项目卡片` CTA 的移动端触控目标。
  - `ProjectReviewQueuePanel` 中代码反馈队列和项目复盘队列的复习入口现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整项目复习队列读侧 CTA 样式、测试和文档记录，不改 review focused queue 路由、到期卡片计数、项目复习卡生成、项目提交/评审逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectReviewQueuePanel` 的 `复习代码反馈` / `复习项目卡片` 缺少 `min-h-11 w-full sm:w-auto`，命中数为 0；GREEN 后 13 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 38 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "ProjectReviewQueuePanel|Phase E Project Review Queue|复习代码反馈|复习项目卡片|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入项目复习队列 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.191.0] - 2026-06-06

### Fixed

- **[Phase E Project Template CTA Mobile Touch Targets]** 优化 Projects 项目模板列表 `开始项目` 和 `打开项目` CTA 的移动端触控目标。
  - `ProjectTemplateList` 中已有项目的 `打开项目` 和新模板的 `开始项目` 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整项目模板列表读侧/入口 CTA 样式、测试和文档记录，不改 `startProjectAction`、项目模板数据、项目创建权限、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectTemplateList` 的 `开始项目` / `打开项目` 缺少 `min-h-11 w-full sm:w-auto`，命中数为 0；GREEN 后 13 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 38 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "ProjectTemplateList|Phase E Project Template|开始项目|打开项目|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入项目模板 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.190.0] - 2026-06-06

### Fixed

- **[Phase E Project Portfolio CTA Mobile Touch Targets]** 优化 Projects 作品集 `复习项目卡片` 和 `/projects/portfolio` 页头 `回到项目实践` CTA 的移动端触控目标。
  - `ProjectPortfolioPanel` 每个作品集卡片 header 从手机端横向 `flex flex-wrap` 改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-start sm:justify-between`。
  - `ProjectPortfolioPanel` 的 `复习项目卡片` 和 `ProjectPortfolioPageContent` 的 `回到项目实践` 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - `/projects/portfolio` 页头 action 区从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - 该切片只调整项目作品集读侧 CTA 布局、按钮样式、测试和文档记录，不改项目作品集数据生成、项目复习卡路由、项目提交/评审逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectPortfolioPanel` 作品集卡片 header 仍是手机端横向 `flex`，`复习项目卡片` 仍继承 `h-7` 小触控，`ProjectPortfolioPageContent` 页头 action 区仍是手机端横向 `flex`，且 `回到项目实践` 仍继承 `h-7` 小触控；GREEN 后 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 37 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "ProjectPortfolioPanel|ProjectPortfolioPageContent|Phase E Project Portfolio|复习项目卡片|回到项目实践|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-start sm:justify-between|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入作品集 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.189.0] - 2026-06-06

### Fixed

- **[Phase E Project Daily Rhythm CTA Mobile Touch Targets]** 优化首页/项目流当前项目卡 `选择项目` 和 `继续项目` CTA 的移动端触控目标。
  - `ProjectDailyRhythmCard` active header 从手机端横向 `flex flex-wrap` 改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-center sm:justify-between`。
  - 空态 `选择项目` 和 active `继续项目` 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整项目当前节奏卡读侧 CTA 布局、按钮样式、测试和文档记录，不改项目状态计算、项目路由、项目提交/评审逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectDailyRhythmCard` active header 仍是手机端横向 `flex`，且 `选择项目` / `继续项目` 仍继承 `h-7` 小触控；GREEN 后 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 37 项通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐回归。
- 本地 GREEN：`rg -n "ProjectDailyRhythmCard|Phase E Project Daily Rhythm|选择项目|继续项目|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入当前项目卡 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.188.0] - 2026-06-06

### Fixed

- **[Phase E Today Code Exercise CTA Mobile Touch Targets]** 优化 `/today` 代码练习区 `语音解释入口` 和 `保存提交` CTA 的移动端触控目标。
  - `代码思路模式` header 从手机端横向 `flex flex-wrap` 改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-center sm:justify-between`。
  - 保存 action 行从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - `语音解释入口` 和 `保存提交` 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Today 代码练习读侧 CTA 布局、按钮样式、测试和文档记录，不改保存 server action、Voice 链接目标、代码反馈生成逻辑、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-code-exercise.test.ts` 首次失败于 `CodeExercise` 的 `语音解释入口` / `保存提交` 仍继承 `h-7` 小触控，且 action 容器仍是手机端横向 `flex`；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts` 28 项通过，覆盖 Today 代码练习、Today 活动标签和共享学习 UI 回归。
- 本地 GREEN：`rg -n "CodeExercise|Phase E Today Code Exercise|语音解释入口|保存提交|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入代码练习 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.187.0] - 2026-06-06

### Fixed

- **[Phase E Learning Code Copy CTA Mobile Touch Targets]** 优化主课正文代码块 `复制代码` CTA 的移动端触控目标。
  - `LearningCodeBlock` 的 `复制代码` / `已复制` 按钮现在使用 `min-h-11 gap-1.5 px-3 text-xs`，保留紧凑视觉但满足 44px 触控高度。
  - 该切片只调整课程代码块复制入口的读侧按钮样式、测试和文档记录，不改 Markdown 解析、clipboard 复制逻辑、daily prompt、server action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningCodeBlock` 的 `复制代码` 按钮仍是 `h-7 gap-1.5 px-2 text-xs` 小触控；GREEN 后 23 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/today-code-exercise.test.ts` 29 项通过，覆盖共享学习 UI、daily prompt 课程块协议和 Today code exercise 回归。
- 本地 GREEN：`rg -n "LearningCodeBlock|Phase E Learning Code|复制代码|min-h-11|data-copy-code" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入代码块复制 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.186.0] - 2026-06-06

### Fixed

- **[Phase E Guided Steps Disclosure Controls Mobile Touch Targets]** 优化 `/today` 引导步骤内 `显示提示` 和 `显示参考答案` 控制按钮的移动端触控目标。
  - `显示提示`、`显示参考答案` 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Today 引导步骤读侧展开控制按钮样式、测试和文档记录，不改提示/参考答案展开状态逻辑、guided progress 保存逻辑、server action、Preview 写保护、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `GuidedSteps` 只有底部 3 个控制按钮命中移动端大触控，`显示提示` / `显示参考答案` 仍缺少 `min-h-11 w-full sm:w-auto`；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/guided-progress.test.ts tests/unit/today-stage-status.test.ts` 8 项通过，覆盖 Today 引导步骤展示、guided progress 服务和 Today 阶段状态回归。
- 本地 GREEN：`rg -n "GuidedSteps|Phase E Guided Steps Disclosure|显示提示|显示参考答案|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入引导步骤展开控制按钮移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.185.0] - 2026-06-06

### Fixed

- **[Phase E Guided Steps Controls Mobile Touch Targets]** 优化 `/today` 引导步骤底部控制按钮的移动端触控目标。
  - 底部保存表单从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - `上一步`、`下一步`、`保存进度` 三个控制按钮现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Today 引导步骤读侧控制按钮样式、测试和文档记录，不改 guided progress 保存逻辑、server action、Preview 写保护、active step 状态、答案序列化、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `GuidedSteps` 底部表单仍是 `flex flex-wrap`，且 `上一步`、`下一步`、`保存进度` 仍是小触控；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/guided-progress.test.ts tests/unit/today-stage-status.test.ts` 8 项通过，覆盖 Today 引导步骤展示、guided progress 服务和 Today 阶段状态回归。
- 本地 GREEN：`rg -n "GuidedSteps|Phase E Guided Steps|grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto|保存进度" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入引导步骤控制按钮移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.184.0] - 2026-06-06

### Fixed

- **[Phase E Today Quiz Submit CTA Mobile Touch Targets]** 优化 `/today` 小测验每题 `提交答案` CTA 的移动端触控目标。
  - 每题提交 action 行从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - `提交答案` CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Today 小测验读侧提交按钮样式、测试和文档记录，不改 quiz 提交逻辑、server action、Preview 写保护、题型解析、数据库、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于小测验提交 action 行仍是 `flex flex-wrap`，且 `提交答案` CTA 仍继承 `h-7` 小触控；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts` 14 项通过，覆盖 Today 小测验展示标签、阶段状态和完成后行动回归。
- 本地 GREEN：`rg -n "TodayQuiz|Phase E Today Quiz|grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto|提交答案" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入小测验提交 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.183.0] - 2026-06-06

### Fixed

- **[Phase E Learning Focus Panel Controls Mobile Touch Targets]** 优化共享 `LearningFocusPanel` 的移动端控制按钮触控目标。
  - 控制区从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`。
  - `上一步`、`下一步`、`进入当前阶段` 三个控制按钮现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整共享专注模式入口读侧控制按钮样式、测试和文档记录，不改阶段选择状态逻辑、Today 专注播放器、路由、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningFocusPanel` 控制区仍是 `flex flex-wrap`，且三个控制按钮仍继承 `h-7` 小触控；GREEN 后 23 项通过。
- 本地 GREEN：`rg -n "LearningFocusPanel|Phase E Learning Focus Panel|mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入共享专注模式入口控制按钮移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.182.0] - 2026-06-06

### Fixed

- **[Phase E Knowledge Path Next CTA Mobile Touch Targets]** 优化 `KnowledgePathExplorer` 中 Glossary / Radar 学习路径 `下一项` CTA 的移动端触控目标。
  - 路径卡 header 从手机端横向挤压布局改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-start sm:justify-between`。
  - `下一项` CTA 现在使用 `min-h-11 w-full sm:w-auto sm:shrink-0`，手机端全宽且满足 44px 触控高度，桌面端保持自适应按钮。
  - 该切片只调整 Glossary/Radar 学习路径读侧 CTA 布局、按钮样式、测试和文档记录，不改 curated path 定义、路径进度计算、路由、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于路径卡 header 仍是手机端横向 `flex flex-wrap`，且 `下一项` CTA 仍是 `h-7` 小触控；GREEN 后 23 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts` 38 项通过，覆盖共享学习 UI、Glossary/Radar 知识路径和 `/path` 学习路径回归。
- 本地 GREEN：`rg -n "KnowledgePathExplorer|Phase E Knowledge Path|grid gap-3 sm:flex sm:items-start sm:justify-between|min-h-11 w-full sm:w-auto sm:shrink-0" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入学习路径 `下一项` CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.181.0] - 2026-06-06

### Fixed

- **[Phase E Habit Goal Lightweight CTA Mobile Touch Targets]** 优化 `LearningHabitGoalCard` 中 `轻量学习模式` CTA 的移动端触控目标。
  - `轻量学习模式` CTA 现在使用 `mt-3 min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整周目标卡读侧 CTA 样式、测试和文档记录，不改周目标/连续学习保护/轻量任务计算规则、路由、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 `轻量学习模式` CTA 仍是 `h-7 mt-3` 小触控；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/current-mission.test.ts` 30 项通过，覆盖周目标卡、首页标签、Progress analytics 和 Current Mission 回归。
- 本地 GREEN：`rg -n "LearningHabitGoalCard|Phase E Habit Goal|轻量学习模式|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入轻量学习 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.180.0] - 2026-06-06

### Fixed

- **[Phase E Daily Quest CTA Mobile Touch Targets]** 优化首页 `今日任务` / `DailyQuestCard` 每条任务 CTA 的移动端触控目标。
  - 每条 Daily Quest 的奖励 XP 和 CTA action 区从手机端横向 `flex` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:items-center sm:justify-end`。
  - Daily Quest CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持右侧自适应按钮。
  - 该切片只调整学习动机卡读侧 action 布局、按钮样式、测试和文档记录，不改 Daily Quest 计算规则、奖励数值、路由、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 Daily Quest action 区仍是横向 `flex shrink-0 items-center gap-2` 且按钮仍是 `h-7` 小触控；GREEN 后 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/today-completion-next-actions.test.ts` 23 项通过，覆盖 Daily Quest、首页标签、Current Mission 和 Today completion 回归。
- 本地 GREEN：`rg -n "DailyQuestCard|Phase E Daily Quest|grid gap-2 sm:flex sm:items-center sm:justify-end|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Daily Quest 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.179.0] - 2026-06-06

### Fixed

- **[Phase E Learning Empty State CTA Mobile Touch Targets]** 优化共享 `LearningEmptyState` 空态 action 的移动端触控目标。
  - 空态 action 容器从手机端 `flex flex-wrap` 改为 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`。
  - 每个空态 action CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整共享学习空态读侧 CTA 布局、按钮样式、测试和文档记录；影响 Voice、Coach、Review、Mistakes 等空态入口，但不改各页面空态触发条件、路由、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningEmptyState` action 容器仍是 `flex flex-wrap gap-2` 且按钮仍是 `h-7` 小触控；GREEN 后 23 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-session-summary.test.ts tests/unit/mistakes-view.test.ts` 47 项通过，覆盖共享空态、Voice、Coach、Review summary 和 Mistakes view 回归。
- 本地 GREEN：`rg -n "LearningEmptyState|Phase E Learning Empty State|grid gap-2 sm:flex sm:flex-wrap|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入共享空态移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.178.0] - 2026-06-06

### Fixed

- **[Phase E Learning Completion CTA Mobile Touch Targets]** 优化 Today 完成后 `LearningCompletionCard` 内语音反思、项目实践和下一步 action CTA 的移动端触控目标。
  - 新增共享 `completionCtaClassName = "min-h-11 w-full sm:w-auto sm:shrink-0"`，用于完成后的 `recommendedVoiceReflection`、`projectPractice` 和 `completion.actions` CTA。
  - 完成后 action 行从手机端横向 `flex flex-wrap` 改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-center sm:justify-between`，避免说明文字和 `进入` CTA 在窄屏互相挤压。
  - 该切片只调整 Today 完成后读侧 CTA 布局、按钮样式、测试和文档记录，不改完成动作优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于完成后 CTA 缺少 3 个 `min-h-11 w-full sm:w-auto sm:shrink-0` 命中；GREEN 后 22 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-code-exercise.test.ts` 45 项通过，覆盖完成后 CTA、Today completion actions、Projects workspace 和 Today code exercise 回归。
- 本地 GREEN：`rg -n "completionCtaClassName|LearningCompletionCard|Phase E Learning Completion|完成后.*CTA|min-h-11 w-full sm:w-auto sm:shrink-0" ...` 确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入完成后移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.177.0] - 2026-06-06

### Fixed

- **[Phase E Learning Mission Card CTA Mobile Touch Targets]** 优化首页任务卡 CTA 的移动端触控目标。
  - `LearningMissionCard` 根布局从手机端横向 `flex` 改为 `grid gap-3`，桌面端保留 `sm:flex sm:items-start sm:justify-between`，避免任务描述和 CTA 在窄屏互相挤压。
  - `LearningMissionCard` action CTA 现在使用 `min-h-11 w-full sm:w-auto sm:shrink-0`，手机端全宽且满足 44px 触控高度，桌面端保持右侧自适应按钮。
  - 该切片只调整首页读侧任务卡布局、按钮样式、测试和文档记录，不改任务优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningMissionCard` 仍是手机端横向 `flex` 且 action CTA 仍是 `class="shrink-0"`；GREEN 后 22 项通过。
- 本地 GREEN：`rg -n "LearningMissionCard|grid gap-3 rounded-lg border p-3 text-sm sm:flex sm:items-start sm:justify-between|min-h-11 w-full sm:w-auto sm:shrink-0|Phase E Learning Mission Card" ...` 确认组件、测试、UI checklist 和 Aegis 记录均接入任务卡移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.176.0] - 2026-06-06

### Fixed

- **[Phase E Home Section Action CTA Mobile Touch Targets]** 优化首页 section header action 的移动端触控目标。
  - `LearningSectionCard` 的 action wrapper 从手机端固定 `shrink-0` 改为 `w-full sm:w-auto sm:shrink-0`，让所有使用 `action` 的卡片在手机端可以提供全宽 CTA。
  - 首页 `今日学习` 和 `今日三件事` 顶部 CTA 现在共享 `homeSectionActionCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整共享读侧卡片 header action 布局、首页按钮样式和测试，不改任务优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 首次失败于 `LearningSectionCard` action wrapper 仍是 `shrink-0`，且首页缺少 `homeSectionActionCtaClassName`；GREEN 后 24 项通过。
- 本地 GREEN：`rg -n "homeSectionActionCtaClassName|w-full sm:w-auto sm:shrink-0|LearningSectionCard|今日学习|今日三件事|继续今日学习|继续学习" ...` 确认共享组件、首页和测试均接入 section action 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.175.0] - 2026-06-06

### Fixed

- **[Phase E Home Common Entry CTA Mobile Touch Targets]** 优化首页 `常用入口` 列表中每个 `打开` CTA 的移动端触控目标。
  - `打开` CTA 现在共享 `homeCommonEntryCtaClassName = "min-h-11 w-full sm:w-auto shrink-0"`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 常用入口行容器从手机端左右挤压的 `flex` 改为 `grid`，桌面端再恢复 `sm:flex sm:items-start sm:justify-between`。
  - UI/UX 本地规则核对：移动端触控目标至少 44x44px，邻近触控目标需有足够间距；当前实现保留卡片 `gap-3`。
  - 该切片只调整首页读侧入口按钮样式和测试，不改路由集合、任务优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/home-page-labels.test.ts` 首次失败于首页缺少 `homeCommonEntryCtaClassName` 和常用入口 CTA className；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts` 13 项通过，覆盖首页标签、Current Mission 和学习动机回归。
- 本地 GREEN：`rg -n "homeCommonEntryCtaClassName|homeQuickCtaClassName|min-h-11 w-full sm:w-auto|常用入口|打开|今日能量" ...` 确认首页源码、测试、UI checklist 和 Aegis 记录均接入常用入口 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.174.0] - 2026-06-06

### Fixed

- **[Phase E Home Quick CTA Mobile Touch Targets]** 优化首页 `今日能量` 三个快捷 CTA 的移动端触控目标。
  - `开始今日/回到今日`、`复习`、`说出理解` 现在共享 `homeQuickCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 快捷 CTA 容器从手机端 `flex-wrap` 改为 `grid`，避免三个小按钮挤在一行；桌面端仍使用 `sm:flex sm:flex-wrap`。
  - 该切片只调整首页读侧按钮样式和测试，不改任务优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/home-page-labels.test.ts` 首次失败于首页缺少 `homeQuickCtaClassName` 和快捷 CTA className；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts` 13 项通过，覆盖首页标签、Current Mission 和学习动机回归。
- 本地 GREEN：`rg -n "homeQuickCtaClassName|min-h-11 w-full sm:w-auto|开始今日|回到今日|说出理解|今日能量" ...` 确认首页源码、测试、UI checklist 和 Aegis 记录均接入快捷 CTA 移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.173.0] - 2026-06-06

### Fixed

- **[Phase E Current Mission Mobile CTA]** 优化 `CurrentMissionCard` 的移动端主 CTA 触控目标。
  - Current Mission CTA 现在使用 `min-h-11 w-full sm:w-auto`，手机端全宽且满足 44px 触控高度，桌面端保持自适应宽度。
  - 该切片只调整共享 Current Mission 读侧组件样式和测试，不改任务优先级、数据库、server action、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/current-mission.test.ts` 首次失败于 CTA 缺少 `min-h-11` / `w-full sm:w-auto`；GREEN 后 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts` 21 项通过，覆盖 Current Mission、Next Best Action、首页标签和学习动机回归。
- 本地 GREEN：`rg -n "min-h-11 w-full sm:w-auto|Current Mission.*CTA|CurrentMissionCard|Phase E|w-full sm:w-auto" ...` 确认组件、测试、模块文档、UI checklist 和 Aegis 记录均接入移动触控要求。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`、`/progress`、`/projects`、`/today`、`/weekly` 等 Current Mission 接入页面。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.172.0] - 2026-06-06

### Changed

- **[Phase C Current Mission Breadth Fallback]** 将 Current Mission 的最低优先级兜底从“开始一个小项目”改为 `Glossary / Radar` 轻量广度探索。
  - `buildNextBestAction()` 在今日学习、到期复习、误区补弱、代码反馈、今日笔记、语音复盘和 active project 都没有更高优先级动作时，推荐 `做一个轻量广度探索`。
  - 兜底 CTA 指向 `/radar`，按钮为 `探索 Radar`，符合 guidance 中“都完成后推荐 Glossary/Radar 轻量广度探索”的优先级。
  - 该切片只调整读侧任务推荐文案和链接，不新增 schema 字段，不改数据库，不触碰生产配置、Preview 写保护、server actions 或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` 首次失败于兜底仍返回 `/projects`；GREEN 后 11 项通过。
- 本地 GREEN：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts tests/unit/knowledge-base.test.ts` 33 项通过，覆盖 Next Best Action、Current Mission、首页标签、学习动机和 Glossary/Radar 知识库回归。
- 本地 GREEN：`rg -n "开始一个小项目|开始项目实践|轻量广度探索|做一个轻量广度探索|探索 Radar|/radar|Glossary / Radar" ...` 确认当前规则、测试和文档接入 `/radar` 轻量广度探索兜底。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/` 和 `/radar`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.171.0] - 2026-06-06

### Added

- **[Phase 4.4 Code/Pseudocode Course Callout]** 在课程正文协议中补齐 `代码/伪代码` 课程块。
  - `LearningMarkdown` 现在会把 `> 代码/伪代码：...`、`> 伪代码：...`、`> 代码草图：...` 渲染成 `code_sketch` typed callout，帮助主课把最小算法形状从普通引用块中抬出来。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.10-code-sketch-course-blocks`，并明确 `> 代码/伪代码` 会渲染为 `data-learning-callout="code_sketch"`。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `data-learning-callout="code_sketch"` prompt 协议和 `LearningMarkdown` 将 `> 代码/伪代码` 渲染为普通引用块；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "代码/伪代码|代码草图|data-learning-callout=\"code_sketch\"|daily-plan-v2\\.10|daily-plan-v2\\.9-example-card-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.10 `代码/伪代码` 协议；`daily-plan-v2.9-example-card-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.170.0] - 2026-06-06

### Added

- **[Phase 4.4 Example Card Course Callout]** 在课程正文协议中补齐 `例子卡` 课程块。
  - `LearningMarkdown` 现在会把 `> 例子卡：...` 渲染成 `example` typed callout，帮助主课把类比和具体例子从普通正文中抬出来。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.9-example-card-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 例子卡` 课程块。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 例子卡` prompt 协议和 `data-learning-callout="example"`；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "例子卡|data-learning-callout=\"example\"|daily-plan-v2\\.9|daily-plan-v2\\.8-self-check-card-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.9 `例子卡` 协议；`daily-plan-v2.8-self-check-card-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.169.0] - 2026-06-06

### Added

- **[Phase 4.4 Self-Check Card Course Callout]** 在课程正文协议中补齐 `自测卡` 课程块。
  - `LearningMarkdown` 现在会把 `> 自测卡：...` 渲染成 `self_check` typed callout，帮助主课把检索练习从普通问题升级成可见自测卡。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.8-self-check-card-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 自测卡` 课程块。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 自测卡` prompt 协议和 `data-learning-callout="self_check"`；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "自测卡|data-learning-callout=\"self_check\"|daily-plan-v2\\.8|daily-plan-v2\\.7-key-point-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.8 `自测卡` 协议；`daily-plan-v2.7-key-point-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.168.0] - 2026-06-06

### Added

- **[Phase 4.4 Key Point Course Callout]** 在课程正文协议中补齐 `重点` 提示框。
  - `LearningMarkdown` 现在会把 `> 重点：...`、`> 要点：...`、`> 关键点：...` 渲染成独立 typed callout，帮助主课把最需要记住的一句话从正文中抬出来。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.7-key-point-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 重点` 课程块。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 重点` prompt 协议和 `data-learning-callout="key_point"`；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "重点|要点|关键点|data-learning-callout=\"key_point\"|daily-plan-v2\\.7|daily-plan-v2\\.6-visual-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.7 `重点` 协议；`daily-plan-v2.6-visual-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.167.0] - 2026-06-06

### Added

- **[Phase 4.4 Visual Course Callout]** 在课程正文协议中补齐 `图示` 课程块。
  - `LearningMarkdown` 现在会把 `> 图示：...`、`> 概念图：...`、`> 视觉化：...` 渲染成独立 typed callout，帮助主课把抽象概念转成可画的心智图。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.6-visual-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 图示` 课程块。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 图示` prompt 协议和 `data-learning-callout="diagram"`；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "图示|概念图|视觉化|data-learning-callout=\"diagram\"|daily-plan-v2\\.6|daily-plan-v2\\.5-interactive-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.6 `图示` 协议；`daily-plan-v2.5-interactive-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.166.0] - 2026-06-06

### Added

- **[Phase 4.4 Interactive Course Callout]** 在课程正文协议中补齐 `互动实验` 课程块。
  - `LearningMarkdown` 现在会把 `> 互动实验：...`、`> 小实验：...`、`> 动手试试：...` 渲染成独立 typed callout，帮助主课从“读内容”推进到“做一个小探索”。
  - `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.5-interactive-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 互动实验` 课程块。
  - 该切片只增强主课渲染和 daily prompt 协议，不新增 schema 字段，不改数据库，不触碰 AI provider 密钥、生产配置、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 首次失败于缺少 `> 互动实验` prompt 协议和 `data-learning-callout="experiment"`；GREEN 后 25 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts` 37 项通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习回归。
- 本地 GREEN：`rg -n "互动实验|小实验|动手试试|data-learning-callout=\"experiment\"|daily-plan-v2\\.5|daily-plan-v2\\.4-course-blocks" ...` 确认当前 renderer、prompt、测试和文档均接入 v2.5 `互动实验` 协议；`daily-plan-v2.4-course-blocks` 仅保留在旧版本历史记录中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.165.0] - 2026-06-06

### Added

- **[Phase 10 Today Code Thinking Mobile Path]** 在 `/today` 代码练习区补齐手机端思路/伪代码/语音解释入口。
  - 代码练习提交框上方新增 `代码思路模式`，提示学习者手机端可以先写思路或伪代码，回到电脑后再补完整实现。
  - 新增 `语音解释入口` 链接到 `/voice?lessonId=<id>&mode=code_debug`，复用现有 Voice `代码调试` 模式，不新增未接线 mode。
  - 该切片只增强 Today 代码练习展示层，不新增字段，不新增数据库迁移，不执行用户代码，不改 `saveCodeSubmissionAction`、Preview 写保护、生产配置或密钥。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/today-code-exercise.test.ts` 新增手机端思路/语音入口断言，RED 首次失败于缺少 `代码思路模式`；GREEN 后 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/voice-note.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 40 项通过，覆盖 Today 代码练习、Voice 模式、Today 完成后动作和共享学习 UI 回归。
- 本地 GREEN：`rg -n "代码思路模式|先说清思路|伪代码草稿|语音解释入口|code_walkthrough|mode=code_debug" src/app/today/ui/code-exercise.tsx tests/unit/today-code-exercise.test.ts docs/ui-review-checklist.md helloagents/modules/today-focus-mode.md helloagents/modules/e2e-ui-smoke.md docs/aegis/work/2026-06-03-roky-learning-desire` 确认新入口和文档接线可见，未引入未接线的 `code_walkthrough` mode。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today` 和 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.164.0] - 2026-06-06

### Added

- **[Phase 9 Admin Duplicate Topic Review Queue]** 在 `/admin` 补齐创作者视角的重复主题检测队列。
  - 新增 `summarizeDuplicateDailyPlanTopics()`，按当前用户最近 DailyPlan 的 `selectedTopic` 或课程标题归一化分组，统计重复主题、受影响计划数、日期范围和关联计划。
  - `/admin` 新增只读 `重复主题检测` 卡片，显示 `扫描计划`、`重复主题`、`受影响计划` 和最多 4 组重复主题详情。
  - 该切片只增强 Admin 内容维护视图，不新增数据库迁移，不改生成策略，不改 DailyPlan 写入，不触碰生产、密钥、Preview 写保护或 server actions。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/admin-content-review.test.ts` 首次失败于 `summarizeDuplicateDailyPlanTopics is not a function`；GREEN 后 3 项通过，覆盖重复主题队列、卡片质量队列和来源核验队列。
- 本地 GREEN：`npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/auth-policy.test.ts` 20 项通过，覆盖 Admin 内容审查、生成质量、Prompt Studio 和 Preview/Auth 边界回归。
- 本地 GREEN：`rg -n "summarizeDuplicateDailyPlanTopics|重复主题检测|重复主题|受影响计划|repeatedPlanCount|duplicateTopic" src/server/admin/content-review.ts src/app/admin/page.tsx tests/unit/admin-content-review.test.ts docs/ui-review-checklist.md helloagents/modules/generation-quality.md helloagents/modules/e2e-ui-smoke.md docs/aegis/work/2026-06-03-roky-learning-desire` 确认重复主题检测服务、Admin 页面和测试接线可见。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/admin`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.163.0] - 2026-06-06

### Fixed

- **[Phase 10 Progress Trend Label Localization]** 本地化 `/progress` 代码反馈趋势和错题趋势中的趋势徽章。
  - 代码反馈趋势现在显示 `高优先级 N`、`中优先级 N`、`低优先级 N` 和 `高频 逻辑问题` 等中文业务标签，不再直接显示 `high N` 或 raw issue type。
  - 错题趋势现在显示 `未解决 N`，不再把 `open N` 作为学习者可见状态。
  - 该切片只增强 `/progress` 读侧趋势展示和测试断言，不改 analytics 聚合公式、数据库、写 action、Preview 写保护或生产配置。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/progress-analytics.test.ts` 新增趋势徽章中文化断言，GREEN 后 16 项通过，覆盖代码反馈趋势和错题趋势徽章。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 42 项通过，覆盖 Progress 趋势、Weekly、共享学习 UI 和首页标签回归。
- 本地 GREEN：`rg -n "high \\{row\\.highIssueCount\\}|open \\{row\\.active\\}|高优先级 \\{row\\.highIssueCount\\}|未解决 \\{row\\.active\\}|codeFeedbackSeverityLabel|codeFeedbackIssueTypeLabel|高优先级 2|未解决 1|>high 2<|>open 1<" src/app/progress/analytics-panels.tsx tests/unit/progress-analytics.test.ts` 确认旧 raw trend badge 模板不存在，raw 值只保留在 helper 分支、测试输入或反向断言中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/progress`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.162.0] - 2026-06-06

### Fixed

- **[Phase 10 Notes Plan Status Label Localization]** 本地化 `/notes` 新建笔记摘要和预填 Markdown 模板中的课程计划状态。
  - 笔记模板现在输出 `课程状态：已完成`、`课程状态：待完成` 或 `课程状态：未关联计划`，不再把 `completed` 等 raw DailyPlan status 写进学习者笔记。
  - Notes 页面“关联课程”摘要现在显示 `计划：已完成` / `计划：待完成` / `计划：未关联计划`，不再直接插入 `selectedPlan.status`。
  - 该切片只增强 Notes 读侧展示和模板文案，不改 `createNoteAction`、`createScopedNote()`、笔记权限、课程选择、数据库、Preview 写保护或生产配置。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/notes-template.test.ts` 首次失败于笔记模板仍显示 `课程状态：completed`，GREEN 后 4 项通过，覆盖模板状态标签、无关联计划 fallback 和 Notes 页面摘要接线。
- 本地 GREEN：`npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts` 20 项通过，覆盖 Notes 模板、Notes 列表、Notes 创建权限、Library 下一步和 Today 完成后笔记入口回归。
- 本地 GREEN：`rg -n "课程状态：completed|计划：\\{selectedPlan\\?\\.status|计划：\\{formatNotePlanStatusLabel|课程状态：已完成|formatNotePlanStatusLabel" src/app/notes/page.tsx src/server/notes/template.ts tests/unit/notes-template.test.ts` 确认旧 raw status 直出模板不存在，Notes 页面和模板均通过 `formatNotePlanStatusLabel()` 输出中文标签。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.161.0] - 2026-06-06

### Fixed

- **[Phase 10 Library Visible Label Localization]** 本地化 `/library` 课程档案中的学习者可见状态、来源和类型标签。
  - 课程列表和课程详情的 DailyPlan 状态/来源现在显示 `已完成`、`待完成`、`AI 生成`、`模板兜底` 等中文业务标签，不再直接显示 `completed`、`planned`、`deepseek` 或 `unknown`。
  - 课程详情的广度卡类型和测验题型现在显示 `人物`、`开源项目`、`单选题`、`判断题` 等中文标签，不再直接显示 raw `open_source_project`、`single_choice` 等值。
  - 代码提交与反馈摘要现在显示 `反馈已生成`、`部分正确` 等中文标签，不再直接显示 `feedback_ready` 或 `partially_correct`。
  - 该切片只增强 `/library` 学习者可见详情/列表文案和共享 label helper；保留筛选表单的维护者参数语义，不改查询、归档策略、笔记权限、代码反馈数据、数据库或生产配置。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/library-page-labels.test.ts` 首次失败于缺少 `formatQuizQuestionTypeLabel` helper，GREEN 后 1 项通过，覆盖 `/library` 学习者可见状态、来源、广度类型、测验题型、代码提交状态和反馈结论接线。
- 本地 GREEN：`npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过，覆盖 Library 页面标签、课程下一步、筛选、详情权限、Today、首页、Map、Radar/Glossary 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "\\{p\\.source \\?\\? \\\"unknown\\\"\\}|\\{p\\.status\\}|\\$\\{planForLesson\\.status\\}|\\$\\{planForLesson\\.source \\?\\? \\\"unknown\\\"\\}|类型：\\{breadth\\.kind\\}|类型：\\{q\\.type\\}|\\{submission\\.status\\}|\\$\\{feedback\\.overall\\}|formatTodayPlanSourceLabel\\(p\\.source\\)|formatHomeDailyPlanStatusLabel\\(p\\.status\\)|formatHomeDailyPlanStatusLabel\\(planForLesson\\.status\\)|formatTodayPlanSourceLabel\\(planForLesson\\.source\\)|formatKnowledgeEntityTypeLabel\\(breadth\\.kind\\)|formatQuizQuestionTypeLabel\\(q\\.type\\)|formatCodeSubmissionStatusLabel\\(submission\\.status\\)|formatHomeCodeFeedbackOverallLabel\\(feedback\\.overall\\)|反馈已生成|单选题|已完成|AI 生成|开源项目" src/app/library/page.tsx src/app/_lib/home-labels.ts tests/unit/library-page-labels.test.ts` 确认旧 `/library` 学习者可见 raw label 直出模板不存在；raw 值只保留在 helper 映射、筛选表单参数、测试输入或反向断言中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/library`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.160.0] - 2026-06-06

### Fixed

- **[Phase 10 Radar Visible Label Localization]** 本地化 `/radar` 实体类型、可信度和核验状态标签。
  - Radar 筛选类型、实体列表和详情类型现在显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目` 等中文业务标签，不再直接显示 `open_source_project` 等 raw type。
  - 实体详情可信度现在显示 `可信度：高`、`可信度：中`、`可信度：低` 或 `可信度：待确认`，不再显示 `confidence high` 等英文拼接。
  - 实体核验状态现在显示 `已核验` / `待核验` 和 `核验日期 YYYY-MM-DD`，来源缺失提示显示 `待核验：该实体暂无可核验来源。`。
  - 该切片只增强 `/radar` 展示层文案和共享 label helper，不改知识库数据、来源核验规则、生成卡片 action、数据库、Preview 写保护或生产配置。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于缺少 `formatRadarConfidenceLabel` helper，GREEN 后 12 项通过，覆盖知识库基础规则、学习路径、关系卡片链和 `/radar` 可见标签 helper 接线。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 46 项通过，覆盖 Radar/Glossary 知识库、Knowledge Map、Today、首页和共享学习 UI 回归。
- 本地 GREEN：`rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{entity\\.type\\}|\\{selectedEntity\\.type\\}|confidence \\{selectedEntity\\.confidence\\}|\\{verificationBadge\\}|verified \\{selectedEntity\\.lastVerifiedAt|needs_verification：|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatKnowledgeEntityTypeLabel\\(entity\\.type\\)|formatKnowledgeEntityTypeLabel\\(selectedEntity\\.type\\)|formatRadarConfidenceLabel\\(selectedEntity\\.confidence\\)|formatRadarVerificationLabel\\(verificationBadge\\)|可信度：高|已核验|待核验|核验日期|开源项目" src/app/radar/page.tsx src/app/_lib/home-labels.ts tests/unit/knowledge-base.test.ts` 确认旧 `/radar` raw label 直出模板不存在；raw 值只保留在 helper 映射、测试输入或反向断言中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/radar`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.159.0] - 2026-06-06

### Fixed

- **[Phase 10 Knowledge Map Label Localization]** 本地化 `/map` 学习者可见状态、来源、类型和掌握分标签。
  - Radar 类型分布现在显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目` 等中文业务标签，不再直接显示 `open_source_project` 等 raw type。
  - 领域详情的相关课程现在显示 `已完成`、`待完成` 与 `AI 生成`、`模板兜底` 等中文状态/来源标签，不再直接显示 `planned` / `deepseek` / `template`。
  - 相关卡片现在显示 `概念卡`、`代码反馈卡`、`错题卡`、`术语卡` 等中文类型标签；相关错题现在显示 `未解决`、`已解决`、`已忽略`。
  - `/map` 掌握度文案统一为 `掌握分`，不再显示英文 `score` 或 `masteryScore`。
  - 该切片只增强 `/map` 展示层文案和共享 label helper，不改 masteryScore 公式、地图聚合查询、数据库、Preview 写保护或生产配置。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/map-analytics.test.ts` 首次失败于缺少 `formatFlashcardTypeLabel`，GREEN 后 8 项通过，覆盖 Knowledge Map 公式、聚合、摘要、进度条标签和 `/map` 可见标签 helper 接线。
- 本地 GREEN：`npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过，覆盖 `/map`、首页、Today、知识库路径和共享学习 UI 回归。
- 本地 GREEN：`rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{plan\\.localDate\\} / \\{plan\\.status\\} / \\{plan\\.source \\?\\? \\\"unknown\\\"\\}|\\{card\\.type\\}|\\{item\\.status\\} x\\{item\\.occurrenceCount\\}|score \\{stat\\.masteryScore\\}|masteryScore =|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatHomeDailyPlanStatusLabel\\(plan\\.status\\)|formatTodayPlanSourceLabel\\(plan\\.source\\)|formatFlashcardTypeLabel\\(card\\.type\\)|formatMapMisconceptionStatusLabel\\(item\\.status\\)|掌握分|代码反馈卡|错题卡|开源项目|未解决|已解决" src/app/map/page.tsx src/app/_lib/home-labels.ts tests/unit/map-analytics.test.ts` 确认旧 `/map` raw label 直出模板不存在；raw 值只保留在 helper 映射、测试输入或反向断言中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/map`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.158.0] - 2026-06-06

### Fixed

- **[Phase 10 Today Plan Label Localization]** 本地化 `/today` 今日计划状态、来源和广度小卡类型标签。
  - `/today` 专注模式概览、状态 badge、完成提示和右侧今日概览现在显示 `已完成`、`待完成` 等中文业务标签，不再直接显示 `planned` / `completed` 等 DailyPlan raw status。
  - 今日计划来源现在显示 `AI 生成`、`模板兜底`、`测试计划`、`后台重建` 或 `系统生成`，不再直接显示 `deepseek` / `template` 等 raw source。
  - 今日广度小卡类型现在显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目` 等业务标签，不再直接显示 `person` / `open_source_project` 等 raw type。
  - 该切片只增强 `/today` 展示层文案和共享 label helper，不改 DailyPlan 数据、课程生成、完成 action、数据库、Preview 写保护或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于缺少 `formatTodayPlanSourceLabel` / `formatKnowledgeEntityTypeLabel` helper；实现过程中同测试继续捕捉到专注模式完成区仍显示 `当前状态：{plan.status}`。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 3 项通过，覆盖小测验/引导步骤类型标签和 `/today` 今日计划状态、来源、广度类型 display helper 接线。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/knowledge-base.test.ts` 46 项通过，覆盖 Today 活动标签、学习 UI、完成行动、首页 label helper 和知识库类型回归。
- 本地 GREEN：`rg -n "value: plan\\.status|当前状态：\\{plan\\.status\\}|value: plan\\.source \\?\\? plan\\.lesson\\.createdBy|\\{plan\\.source \\?\\? plan\\.lesson\\.createdBy\\}|类型：\\{breadthDetail\\?\\.type \\?\\? breadth\\.kind\\}|类型：\\{breadthDetail\\?\\.type \\?\\? breadth\\?\\.kind\\}|planned|completed|deepseek|template|person|benchmark|open_source_project|formatTodayPlanSourceLabel|formatKnowledgeEntityTypeLabel|todayPlanStatusLabel|todayPlanSourceLabel|breadthTypeLabel" src/app/today/page.tsx src/app/_lib/home-labels.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts` 确认旧 `/today` 可见 raw label 直出模板不存在；raw 值只保留在查询条件、状态判断、helper 映射或测试输入中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.157.0] - 2026-06-06

### Fixed

- **[Phase 10 Home Status Label Localization]** 本地化首页今日计划状态和补弱焦点 meta 标签。
  - 首页今日学习 badge 现在显示 `已完成`、`待完成`、`未生成`，不再直接显示 `planned` / `completed` 等 DailyPlan raw status。
  - 首页补弱焦点中的代码反馈状态现在显示 `部分正确`、`需要重写`、`需要更多信息` 等中文业务标签，不再直接显示 `partially_correct` 等 raw overall。
  - 首页误区来源现在显示 `小测验`、`代码反馈`、`Coach`、`项目实践`，不再直接显示 `quiz` / `code` / `project` 等 raw source。
  - 该切片只增强首页展示层文案，不改查询条件、Current Mission 输入、Next Best Action 优先级、Daily Quest、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/home-page-labels.test.ts` 首次失败于缺少首页展示 helper，证明当前首页没有可测试的本地化标签 owner。
- 本地 GREEN：`npm test -- tests/unit/home-page-labels.test.ts` 2 项通过，覆盖首页状态/补弱标签 helper 和首页源码不再使用旧 raw enum 直出模板。
- 本地 GREEN：`npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts tests/unit/next-best-action.test.ts tests/unit/today-code-exercise.test.ts` 22 项通过，覆盖首页标签、Current Mission、学习动机、Next Best Action 和 Today 代码反馈回归。
- 本地 GREEN：`rg -n "todayPlan\\?\\.status \\?\\?|状态：\\$\\{codeFeedbackFocus\\.overall\\}|来源：\\$\\{openMisconceptionFocus\\.source\\}|partially_correct|incorrect|cannot_judge|planned|completed|formatHomeDailyPlanStatusLabel|buildHomeCodeFeedbackMeta|buildHomeMistakeMeta" src/app/page.tsx src/app/_lib/home-labels.ts tests/unit/home-page-labels.test.ts` 确认旧首页 raw enum 直出模板不存在；raw 值只保留在查询条件、helper 映射或测试输入中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含首页 `/`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.156.0] - 2026-06-06

### Fixed

- **[Phase 10 Review Card Type Label Localization]** 本地化 `/review` 当前卡片类型标签。
  - Review 顶部卡片类型 badge 现在显示 `概念卡`、`代码反馈卡`、`项目卡`、`错题卡`、`术语卡` 等中文业务标签。
  - `code_bug`、`quiz_error` 等 raw card type 不再作为学习者可见标签输出；未知类型统一降级为 `复习卡`。
  - 该切片只增强 `/review` 展示层文案，不改 flashcard `type` 数据、复习调度、评分 action、session summary、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Review 当前卡片 badge 仍显示 `code_bug`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 21 项通过，覆盖 Review 当前卡片类型中文化和 raw `code_bug` 反向断言。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-empty-state.test.ts tests/unit/review-rating.test.ts` 27 项通过，覆盖 Review UI、session summary、空态和评分回归。
- 本地 GREEN：`rg -n "card\\?\\.type|>\\{card\\.type\\}|\\{card\\.type\\}|code_bug|quiz_error|misconception|\\bconcept\\b" src/app/review src/components tests/unit/learning-ui-components.test.ts` 确认 Review 学习者 UI 不再直出 `{card.type}`；raw type 只保留在测试输入、反向断言或展示层映射表中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/review`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.155.0] - 2026-06-06

### Fixed

- **[Phase 10 Today Activity Type Label Localization]** 本地化 `/today` 小测验题型和引导步骤类型标签。
  - 小测验题型现在显示 `单选题`、`多选题`、`判断题`，不再直接显示 `single_choice`、`multi_choice`、`true_false`。
  - 引导步骤类型现在显示 `背景唤醒`、`核心直觉`、`概念理解` 等中文业务标签，不再直接显示 `activation` 等 raw type。
  - 该切片只增强 `/today` 活动类型展示层文案，不改 quiz 提交、guided progress 保存、daily plan schema、生成 prompt、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/today-activity-labels.test.ts` 首次失败于 `TodayQuiz` 仍显示 `single_choice` / `true_false`，`GuidedSteps` 仍显示 `activation`。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts` 2 项通过，覆盖小测验题型和引导步骤类型中文化。
- 本地 GREEN：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts` 33 项通过，覆盖 Today 活动标签、学习 UI、阶段状态和完成行动回归。
- 本地 GREEN：`rg -n "类型：\\{q\\.type\\}|类型：\\{current\\.type\\}|single_choice|true_false|activation|单选题|判断题|背景唤醒" src/app/today tests/unit/today-activity-labels.test.ts docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire` 确认 raw type 只保留在测试输入、反向断言、类型定义或展示层映射分支中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.154.0] - 2026-06-06

### Fixed

- **[Phase 10 Today Code Feedback Label Localization]** 本地化 `/today` 代码练习区的提交状态、整体反馈结论和问题标签。
  - 上次保存状态现在显示 `反馈已生成` 等中文业务标签，不再直接显示 `feedback_ready`。
  - 代码反馈整体结论现在显示 `部分正确` 等中文标签，不再直接显示 `partially_correct`。
  - 代码反馈问题列表现在显示 `高优先级 / 逻辑问题` 等中文标签，不再直接显示 `[high/logic]`。
  - 该切片只增强 `/today` 代码练习展示层文案，不改 `CodeSubmission` / `CodeFeedback` 数据枚举、保存 action、AI 反馈生成、卡片生成、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/today-code-exercise.test.ts` 首次因测试静态导入触发 env 校验失败；改为动态导入并注入测试 env 后，RED 失败于 `feedback_ready`、`partially_correct` 和 `[high/logic]` 仍作为静态 markup 可见。
- 本地 GREEN：`npm test -- tests/unit/today-code-exercise.test.ts` 1 项通过，覆盖提交状态、整体反馈结论、问题严重度/类型中文化和 raw enum 反向断言。
- 本地 GREEN：`npm test -- tests/unit/today-code-exercise.test.ts tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts tests/unit/today-completion-next-actions.test.ts` 13 项通过，覆盖 Today 代码练习、代码反馈 fallback、提交持久化和 Today completion 回归。
- 本地 GREEN：`rg -n "feedback_ready|partially_correct|\\[high/logic\\]|\\[\\$\\{x\\.severity\\}/\\$\\{x\\.type\\}\\]|反馈已生成|部分正确|高优先级|逻辑问题" src/app/today tests/unit/today-code-exercise.test.ts docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire` 确认旧 raw enum 只保留在测试输入、反向断言或展示层映射分支中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.153.0] - 2026-06-06

### Fixed

- **[Phase 10 Coach Visible Label Localization]** 本地化 `/coach` 学习者可见工作区、上下文、问题和 Voice 来源标签。
  - Coach 顶部徽章现在显示 `Coach 工作区`，不再显示 `Tutor Workspace`。
  - 上下文面板徽章现在显示 `上下文指南针`，不再显示 `Context Compass`。
  - `possibleIssues` 的 `type` / `severity` 只在展示层映射为 `概念问题`、`高优先级` 等中文标签，不再把 `conceptual`、`high` 等 raw enum 直接展示给学习者。
  - Voice Note 来源面板把 `code_debug` 等模式显示为 `代码调试` 等中文业务标签。
  - 该切片只增强 `/coach` 读侧文案，不改 ThoughtReview schema、Voice mode、Coach mode、写 action、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts` 首次失败于 `Tutor Workspace`、`Context Compass`、`conceptual` / `high` 和 `code_debug` 仍作为静态 markup 可见。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 7 项通过，覆盖 Coach 工作区、问题标签、上下文指南针、Voice 来源面板和既有卡片/补弱队列。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过，覆盖 Coach、Voice、Review summary 和共享学习 UI 回归。
- 本地 GREEN：`rg -n "Tutor Workspace|Context Compass|conceptual|high|code_debug|Coach 工作区|上下文指南针|概念问题|高优先级|代码调试" src/app/coach tests/unit/coach-workspace.test.ts docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire` 确认旧英文工作区标签只剩测试反向断言，raw enum 只剩数据输入、映射分支或内部语义文档。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/coach` 和 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.152.0] - 2026-06-06

### Fixed

- **[Phase 9.2 Prompt Studio Creator Label Localization]** 本地化 `/admin` Prompt Studio 的创作者可见标签，并解耦组件测试依赖。
  - Prompt Studio 卡片现在显示 `Prompt 版本`、`Schema 版本`、`最新生成 schema`、`漂移数量`、`样例` 和 `重新生成某日期计划（测试）`。
  - 不再显示旧标签 `Prompt version:`、`Schema version:`、`最新 job schema:`、`drift:`、`sample:` 或 `（test）`。
  - `PromptStudioCard` 不再直接导入 `/admin/actions.ts`；页面层注入原有 `regeneratePlanForLocalDateAction`，保持 server action 行为不变，同时避免静态渲染单测加载 DB/env 依赖。
  - 该切片只增强 `/admin` 读侧文案和测试边界，不改 Prompt/Schema 版本语义、生成/repair/fallback 逻辑、写 action、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-prompt-studio.test.ts` 在无临时 env 时失败于组件直连 `/admin/actions.ts` 导致 `DATABASE_URL` / `CRON_SECRET` env 校验；使用临时 env 后测试失败于仍显示 `Prompt version:` 等旧英文标签。
- 本地 GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 3 项通过，覆盖 Prompt Studio 汇总规则、等待 repair 状态和创作者可见标签中文化。
- 本地 GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/auth-policy.test.ts` 19 项通过，覆盖 Prompt Studio、Admin 内容质量队列、每日生成质量和 Preview/Auth 边界。
- 本地 GREEN：`rg -n "Prompt version:|Schema version:|最新 job schema:|drift:|sample:|（test）|Prompt 版本|Schema 版本|最新生成 schema|漂移数量|重新生成某日期计划（测试）" src/app/admin tests/unit/admin-prompt-studio.test.ts docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire` 确认当前源码和验收文档使用新文案，旧标签仅保留在测试反向断言或历史证据中。
- 本地 RED/GREEN：`npm run build` 首次失败于 `/admin/page.tsx` 漏导入 `regeneratePlanForLocalDateAction`；补齐导入后复跑通过，Next 生产构建生成 28 个静态页面，路由表包含 `/admin`。
- 本地 GREEN：`git diff --check` 和 `npm run lint` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.151.0] - 2026-06-06

### Fixed

- **[Phase 10 Mode Badge Localization]** 本地化学习者可见模式徽章和 PWA 今日学习入口描述。
  - `LearningFocusPanel` 现在显示 `专注模式`，进度可访问名称显示 `专注模式进度`，不再显示 `Focus Mode` 或 `Focus Mode 进度`。
  - `KnowledgePathExplorer` 现在显示 `路径模式`，不再显示 `Path Mode`。
  - `/today` 完整课程折叠说明和 PWA `今日学习` shortcut 描述同步使用 `专注模式`。
  - 该切片只增强读侧文案和可访问名称，不改 FocusPlayer 阶段状态、知识路径计算、PWA shortcut 路由、写 action、数据模型或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `LearningFocusPanel` 仍显示 `Focus Mode` / `Focus Mode 进度`，`KnowledgePathExplorer` 仍显示 `Path Mode`，18 项通过、2 项失败。
- 本地 RED：同命令补充失败于 `/today` 完整课程折叠说明仍包含 `Focus Mode 下方...`，19 项通过、1 项失败。
- 本地 GREEN：同命令 20 项通过。
- 本地 RED：`npm test -- tests/unit/pwa-manifest.test.ts` 首次失败于 PWA `今日学习` shortcut 描述仍显示 `打开今日 Focus Mode...`。
- 本地 GREEN：同命令 1 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/pwa-manifest.test.ts tests/unit/auth-policy.test.ts` 54 项通过。
- 本地 GREEN：`rg -n "Focus Mode|Path Mode|专注模式|路径模式|专注模式进度" src/app src/components tests/unit docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire` 确认生产代码使用 `专注模式` / `路径模式`；旧英文只保留在测试反向断言、历史文档或显式“不应显示”验收文本中。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/path` 和 `/manifest.webmanifest`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.150.0] - 2026-06-06

### Fixed

- **[Phase 10 Celebration Badge Localization]** 本地化共享成就反馈徽章文案。
  - `LearningCelebrationCue` 的复习清空、项目里程碑、误区解决徽章现在显示 `复习总结`、`项目进度`、`掌握证据`。
  - 不再在学习者可见成就反馈里显示 `Session summary`、`Project progress`、`Mastery signal`。
  - 保留成就反馈标题、描述、metric、样式、动效边界和调用方完成逻辑；不改 Today、Review、Projects、Mistakes 的数据模型或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于成就反馈仍显示 `Session summary`、`Project progress`、`Mastery signal`，19 项通过、1 项失败。
- 本地 GREEN：同命令 20 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts` 41 项通过。
- 本地 GREEN：`rg -n "Session summary|Project progress|Mastery signal|复习总结|项目进度|掌握证据|LearningCelebrationCue" src/components/learning src/app/projects tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 确认生产代码使用中文成就反馈徽章，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/review`、`/projects` 和 `/mistakes`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.149.0] - 2026-06-05

### Fixed

- **[Phase 10 Progress Remediation Step Label Localization]** 本地化 `/progress` 本周补弱计划步骤徽章。
  - 本周补弱计划步骤现在显示 `第 1 步`、`第 2 步` 等，不再显示 `Step 1`、`Step 2`。
  - 保留补弱计划标题、摘要、步骤链接、tone、弱领域计算和 `buildWeeklyRemediationPlan()` 输出模型。
  - 该切片只增强读侧步骤徽章文案，不改学习分析计算、补弱推荐算法、写 action、数据库或生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于 `/progress` 本周补弱计划仍显示 `Step 1` / `Step 2`，14 项通过、1 项失败。
- 本地 GREEN：同命令 15 项通过。
- 本地 GREEN：`npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts` 38 项通过。
- 本地 GREEN：`rg -n "Step \\{index \\+ 1\\}|>Step [0-9]<|第 \\{index \\+ 1\\} 步|第 [0-9] 步|weeklyRemediationPlan\\.steps|本周补弱计划" src/app/progress tests/unit/progress-analytics.test.ts` 确认生产代码使用 `第 {index + 1} 步`，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/progress`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.148.0] - 2026-06-05

### Fixed

- **[Phase 10 Projects Status Label Localization]** 本地化 Projects 学习者可见状态文案。
  - `/projects` Mission Hero 徽章现在显示 `项目任务模式`，不再显示 `Mission Mode`。
  - 里程碑路线的保存状态现在显示 `已保存代码`、`已保存反思`、`AI 已评审`，不再显示 `code saved`、`reflection saved`、`AI reviewed`。
  - `/projects` 当前任务状态徽章复用中文状态文本；全部完成 fallback 显示 `全部完成`，不再渲染 raw `active` 或 `all done`。
  - 项目作品集数量徽章现在显示 `已完成 N 个项目`，`/projects/portfolio` 顶部徽章显示 `项目作品集`。
  - 该切片只增强读侧状态文案，不改项目模板、里程碑顺序、代码评审链路、Portfolio Markdown 内容、写 action 或数据库。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 Projects 仍显示 `Mission Mode`、`code saved`、`reflection saved`、`AI reviewed`、`1 completed`，以及 `/projects` 页面源码仍使用 raw `activeMilestone.status` / `all done`。
- 本地 GREEN：同命令 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 37 项通过。
- 本地 GREEN：`rg -n "code saved|reflection saved|AI reviewed|all done|\\{items\\.length\\} completed|\\{completedCount\\} completed|[0-9]+ completed|Mission Mode|>Portfolio<|已保存代码|已保存反思|AI 已评审|全部完成|已完成 .* 个项目|项目任务模式" src/app/projects tests/unit/project-mission-workspace.test.ts` 确认生产代码使用中文状态文案，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或浏览器 E2E。

## [0.147.0] - 2026-06-05

### Fixed

- **[Phase 10 Path Stage Label Localization]** 本地化 `/path` 学习路径阶段徽章。
  - 路线卡片阶段徽章现在显示 `第 1 阶段`、`第 2 阶段` 等，不再显示 `Stage 1`、`Stage 2`。
  - 顶部“下一个阶段是什么？”卡片现在显示 `下一阶段`，不再显示 `Next Stage`。
  - 该切片只增强读侧阶段标签，不改学习路径计算、阶段顺序、Current Mission、解锁条件、下一步主题或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-path.test.ts` 首次失败于 `/path` 仍显示 `Next Stage`，随后扩展覆盖 `Stage {index + 1}`。
- 本地 GREEN：同命令 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 43 项通过。
- 本地 GREEN：`rg -n "Next Stage|Stage \\{index \\+ 1\\}|第 \\{index \\+ 1\\} 阶段|>下一阶段<|学习路径|阶段进度" src/app/path/page.tsx tests/unit/learning-path.test.ts` 确认生产代码使用中文阶段标签，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/path`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.146.0] - 2026-06-05

### Fixed

- **[Phase 10 Voice Visible Label Localization]** 本地化 Voice 选中笔记和转写表单的可见状态标签。
  - `/voice` 当前 Voice Note 状态区现在显示 `已连接 Coach`、`已保存笔记` 和 `转写文本`，不再显示 `Coach linked`、`Note saved` 或独立标题 `Transcript`。
  - Voice 输入表单的转写区域标题同步显示 `转写文本`，与既有 `aria-label="语音转写文本"` 保持一致。
  - 该切片只增强读侧可见文案，不改 Voice 保存、Coach、Note、卡片生成、转写 Provider 或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于当前 Voice Note 状态区仍显示 `Coach linked`、`Note saved`、`Transcript`。
- 本地 RED：同命令二次失败于 Voice 输入表单仍显示独立标题 `Transcript`。
- 本地 GREEN：同命令 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过。
- 本地 GREEN：`rg -n "Coach linked|Note saved|>Transcript<|text-sm font-medium\\\">Transcript|已连接 Coach|已保存笔记|转写文本" src/app/voice tests/unit/voice-note.test.ts` 确认生产代码的独立可见标签使用中文文案，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、转写 Provider 调用或真实生产 Preview token smoke。

## [0.145.0] - 2026-06-05

### Fixed

- **[Phase 10 Weekly Next-Step Label Localization]** 本地化 Weekly 下周建议步骤徽章。
  - `/weekly` 下周建议卡片现在显示 `第 1 步`、`第 2 步`、`第 3 步`，不再显示 `Step 1`、`Step 2`、`Step 3`。
  - 保留下周建议标题、摘要、步骤链接、步骤顺序和 `buildWeeklyRemediationPlan()` 生成逻辑。
  - 该切片只增强读侧步骤徽章文案，不改 Weekly 统计计算、推荐生成或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 `/weekly` 下周建议仍显示 `Step {index + 1}`。
- 本地 GREEN：同命令 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过。
- 本地 GREEN：`rg -n "Step \\{|Step [0-9]|第 \\{index \\+ 1\\} 步|第 [0-9] 步|nextWeekPlan\\.steps" src/app/weekly src/server/learning/weekly.ts tests/unit/weekly-review.test.ts` 确认生产页面使用 `第 {index + 1} 步`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.144.0] - 2026-06-05

### Fixed

- **[Phase 10 Today Focus Step Label Localization]** 本地化 Today Focus Mode 阶段标签。
  - `/today` Focus Mode 七个阶段顶部现在显示 `第 1 步` 到 `第 7 步`，不再显示 `Step 1` 到 `Step 7`。
  - 保留阶段标题、状态、上一步/下一步、阶段切换按钮、完整视图折叠区和完成后行动逻辑。
  - 该切片只增强读侧阶段标签，不改 Today 学习状态、完成动作、Quiz/Knowledge 状态规则或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 `/today` 阶段定义仍使用 `eyebrow: "Step n"`。
- 本地 GREEN：同命令 20 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts` 31 项通过。
- 本地 GREEN：`rg -n "eyebrow: \"Step [0-9]\"|>Step [0-9]<|Step [0-9]|eyebrow: \"第 [0-9] 步\"|第 7 步" src/app/today src/components/learning tests/unit/learning-ui-components.test.ts` 确认生产代码使用 `第 n 步`，旧英文 Step 仅保留在测试反向断言中。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.143.0] - 2026-06-05

### Fixed

- **[Phase 10 Weekly Metrics Localization]** 本地化 Weekly 复盘指标和来源文案。
  - `/weekly` 7 天总览现在显示 `小测验正确率`，不再显示 `quiz 正确率`。
  - 最强/最弱领域徽章现在显示 `最强`、`待补强`，不再显示 `Strongest`、`Weakest`。
  - 最弱领域细项现在显示 `掌握分`、`薄弱分`、`测验正确率`，不再显示 `mastery`、`weakness`、`quiz`。
  - Weekly Markdown 导出现在显示 `小测验正确率`，并把 raw `quiz` 错题来源映射为 `小测验`。
  - 该切片只增强读侧复盘文案，不改 Weekly 统计计算、学习数据来源、导出结构或写接口。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于 Weekly 页面和 Markdown 仍显示 `quiz 正确率`、`Quiz 正确率`、`Strongest`、`Weakest`、`mastery`、`weakness`、`quiz`。
- 本地 GREEN：同命令 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts` 36 项通过。
- 本地 GREEN：`rg -n "quiz 正确率|Quiz 正确率|Strongest|Weakest|mastery：|weakness：|quiz：|（quiz|weeklyMistakeSourceLabel|小测验正确率|掌握分|薄弱分|待补强" src/app/weekly src/server/learning/weekly.ts tests/unit/weekly-review.test.ts` 确认生产代码使用中文文案，旧英文指标仅保留在测试反向断言中。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.142.0] - 2026-06-05

### Fixed

- **[Phase 10 Voice Card Count Localization]** 本地化 Voice 卡片数量状态文案。
  - `/voice` 学习流水线完成态现在显示 `N 张卡片`，不再显示 `N cards`。
  - `/voice` 当前 Voice Note 状态徽章同步显示 `N 张卡片`。
  - 该切片只增强读侧状态文案，不改 Voice 保存、Coach、Note、卡片生成或复习跳转流程。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Voice 学习流水线仍显示 `3 cards`。
- 本地 GREEN：同命令 19 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts` 38 项通过。
- 本地 GREEN：`rg -n "\{linkedCards\} cards|\$\{props\.linkedCards\} cards|[0-9]+ cards| cards<|>cards<|cards</|cards\}" src/app/voice tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts` 确认生产代码中旧 `cards` 可见文案已清理，旧英文仅保留在测试反向断言中。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.141.0] - 2026-06-05

### Fixed

- **[Phase 10 Voice Pipeline Step Title Localization]** 本地化 Voice 学习流水线步骤标题。
  - `/voice` 的流水线步骤现在显示 `Coach 检查`、`整理笔记`、`复习卡片`，不再把步骤标题单独显示为 `Coach`、`Note`、`Cards`。
  - 保留现有 CTA 文案和流程，例如 `送 Coach 检查`、`整理成笔记`、`生成复习卡片`、`复习这 N 张语音卡片`。
  - 该切片只增强读侧步骤标题，不改 Voice 保存、Coach、Note、卡片生成或复习跳转流程。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Voice 学习流水线仍显示 `Coach`、`Note`、`Cards` 步骤标题。
- 本地 GREEN：同命令 19 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts` 38 项通过。
- 本地 GREEN：`rg -n '>Coach<|>Note<|>Cards<|title="Coach"|title="Note"|title="Cards"|Coach 检查|整理笔记|复习卡片' src/app/voice tests/unit/learning-ui-components.test.ts` 确认生产代码中旧步骤标题已清理，旧英文仅保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.140.0] - 2026-06-05

### Fixed

- **[Phase 10 Voice Recording Timer Label Localization]** 本地化 Voice 录音计时器的可见标签。
  - `/voice` 录音状态面板右侧计时器现在显示 `录音计时`，不再显示纯英文 `recording`。
  - 移除该标签上的 uppercase 样式，避免中文文本套用英文大写排版意图。
  - 该切片只增强读侧计时器文案，不改录音状态机、不改转写流程、不新增写 action。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice 录音计时器仍显示 `recording`。
- 本地 GREEN：同命令 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过。
- 本地 GREEN：`rg -n '>recording<|recording</|uppercase tracking-wide text-muted-foreground|录音计时' src/app/voice tests/unit/voice-note.test.ts` 确认生产代码使用 `录音计时`，旧可见英文只保留在测试反向断言中。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.139.0] - 2026-06-05

### Fixed

- **[Phase 10 Voice Form A11y Localization]** 本地化 Voice 表单核心控件的可访问名称。
  - `/voice` 模式选择框现在读作 `语音笔记模式`，不再暴露混合英文 `Voice Note 模式`。
  - `/voice` transcript 文本区现在读作 `语音转写文本`，不再暴露纯英文 `Transcript`。
  - 该切片只增强读侧表单控件语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 Voice 表单仍使用 `aria-label="Voice Note 模式"` 和 `aria-label="Transcript"`。
- 本地 GREEN：同命令 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 45 项通过，覆盖 Voice 表单、录音状态、转写、Coach handoff、共享 UI a11y 和学习 UI 回归。
- 本地 GREEN：`rg -n 'aria-label="Voice Note 模式"|aria-label="Transcript"|aria-label="[A-Za-z]' src/app src/components` 确认生产代码中旧 Voice 表单标签已清理，仅剩 `XP 等级` 产品术语标签。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.138.0] - 2026-06-05

### Fixed

- **[Phase 10 Markdown Export A11y Localization]** 本地化 Markdown 导出文本区的可访问名称。
  - `/weekly` 的只读周报文本区现在读作 `导出 Weekly Markdown 周报`，不再暴露英文 `weekly report markdown`。
  - `/projects` 和 `/projects/portfolio` 中每个项目的 Portfolio Markdown 文本区现在读作 `导出 {项目名} Portfolio Markdown`，不再暴露英文 `portfolio markdown` 后缀。
  - 该切片只增强读侧导出文本区语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts` 首次失败于 Weekly 和 Portfolio Markdown 导出文本区仍使用英文 `aria-label`。
- 本地 GREEN：同命令 14 项通过。
- 本地 GREEN：`rg -n "weekly report markdown|portfolio markdown|aria-label=\"[A-Za-z]" src/app src/components tests/unit` 确认生产代码中旧英文导出标签已清理，剩余命中仅为测试反向断言或产品术语标签。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts` 35 项通过。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/weekly` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.137.0] - 2026-06-05

### Fixed

- **[Phase 10 Remaining Progress Labels A11y]** 补齐剩余学习进度条的具体可访问名称。
  - Today Focus、旧 Focus Panel、Review 队列、Learning Path 阶段、Weekly 复习留存、Knowledge Map 领域、Knowledge Path、Today 完成后项目任务和 Projects 进度条均传入具体中文 `label`。
  - 全仓 `LearningProgressBar` 调用点已确认不再依赖默认 `学习进度` 兜底。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts` 首次失败于剩余进度条仍缺少具体 `aria-label`。
- 本地 GREEN：同命令 43 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts` 51 项通过。
- 本地 GREEN：`rg -n -C 3 "<LearningProgressBar" src/app src/components` 确认所有调用点均有具体 `label`。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/map`、`/path`、`/weekly`、`/projects/portfolio` 和 `/manifest.webmanifest`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.136.0] - 2026-06-05

### Fixed

- **[Phase 10 Motivation Progress Labels A11y]** 补齐学习动机卡进度条的具体可访问名称。
  - `DailyQuestCard` 的进度条现在读作 `今日任务进度`。
  - `XpLevelCard` 的进度条现在读作 `XP 等级进度`。
  - `LearningHabitGoalCard` 的进度条现在读作 `周目标进度`。
  - `BadgeShelf` 每个徽章进度条现在读作 `徽章进度：{徽章标题}`。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于学习动机卡仍输出默认 `aria-label="学习进度"`。
- 本地 GREEN：同命令 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts` 27 项通过，覆盖学习动机卡和学习 UI 回归。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/projects/portfolio` 和 `/manifest.webmanifest`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.135.0] - 2026-06-05

### Fixed

- **[Phase 10 LearningTimeline A11y]** 补齐今日流程时间线的步骤和状态语义。
  - `LearningTimeline` 现在为每个状态图标提供 `sr-only` 中文文本，例如 `第 2 步，进行中`。
  - 保留现有图标、颜色、数字序号和可视布局，不在非交互图标容器上添加 `aria-label`。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于时间线缺少 `第 1 步，完成` 等屏幕阅读器文本。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts` 33 项通过。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/glossary`、`/radar` 和 `/path`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.134.0] - 2026-06-05

### Fixed

- **[Phase 10 Knowledge Path Metric A11y]** 清理知识路径指标卡的非交互 `aria-label`。
  - `KnowledgePathExplorer` 的 `已看`、`已生成卡片`、`已复习`、`未掌握` 指标继续显示中文 label/value。
  - 移除普通 `div` 上重复的 `aria-label`，避免非交互卡片混用额外可访问名称。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于知识路径指标卡仍输出 `aria-label="已看 2/2"`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts` 32 项通过。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/glossary`、`/radar`、`/path` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.133.0] - 2026-06-05

### Fixed

- **[Phase 10 Shared UI A11y Localization]** 本地化共享 UI 基础组件的屏幕阅读器文案。
  - Dialog 和 Sheet 关闭按钮现在读作 `关闭`，不再暴露英文 `Close`。
  - Breadcrumb 导航现在读作 `面包屑导航`，省略节点读作 `更多层级`。
  - `BreadcrumbEllipsis` 不再在容器上使用 `aria-hidden`，避免把 `sr-only` 说明文本一并从辅助技术中隐藏。
  - 该切片只增强共享 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/shared-ui-a11y.test.ts` 首次失败于 Dialog/Sheet 仍输出英文 `Close`，Breadcrumb 仍输出 `aria-label="breadcrumb"`。
- 本地 GREEN：同命令 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/reduced-motion-css.test.ts tests/unit/learning-ui-components.test.ts` 21 项通过，覆盖共享 UI、reduced-motion 和学习 UI 回归。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/voice`、`/progress` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.132.0] - 2026-06-05

### Fixed

- **[Phase 10 Reduced Motion A11y]** 补齐全局减少动态偏好支持。
  - `globals.css` 现在在 `prefers-reduced-motion: reduce` 下把动画时长、动画循环、transition 和平滑滚动降到最小。
  - 新增源码级单测固定该 CSS 契约，避免后续引入动画库或组件过渡时漏掉系统减少动态偏好。
  - 该切片只增强全局 CSS 可访问性，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/reduced-motion-css.test.ts` 首次失败于全局样式缺少 `prefers-reduced-motion: reduce`。
- 本地 GREEN：同命令 1 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts` 30 项通过，覆盖学习 UI 与 Voice 回归。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/voice`、`/progress` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.131.0] - 2026-06-05

### Fixed

- **[Phase 10 LearningStepCard A11y]** 补齐共享步骤卡的步骤和状态语义。
  - `LearningStepCard` 现在为状态图标提供 `sr-only` 中文文本，例如 `第 2 步，进行中`。
  - 移除旧的英文 `title="step n"`，避免 Voice 步骤进度只靠图标、颜色或英文 title 表达。
  - 保持历史 a11y 边界：不在非交互状态图标上添加 `aria-label`。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于步骤卡缺少 `sr-only` 中文步骤/状态文本，且仍输出 `title="step 2"`。
- 本地 GREEN：同命令 18 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts` 12 项通过，覆盖 Voice 工作台和录音状态回归。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/voice`、`/today`、`/progress` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.130.0] - 2026-06-05

### Fixed

- **[Phase 10 Shared ProgressBar A11y]** 补齐共享学习进度条的可访问性语义。
  - `LearningProgressBar` 现在暴露 `role="progressbar"`、`aria-valuemin/max/now` 和 `aria-valuetext`。
  - 支持可选 `label`，默认使用 `学习进度`，让 Today、Review、Path、Projects、Weekly、Progress 等页面的进度不只靠视觉宽度表达。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于共享进度条缺少 `progressbar` 语义。
- 本地 GREEN：同命令 17 项通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.129.0] - 2026-06-05

### Fixed

- **[Phase 10 FocusPlayer Stage A11y]** 补齐 Today Focus Mode 阶段切换按钮的状态语义。
  - `LearningFocusPlayer` 底部阶段切换按钮现在在 `aria-label` 中同时包含阶段名和 `完成`、`进行中`、`待办` 状态。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于阶段切换按钮缺少状态语义。
- 本地 GREEN：同命令 16 项通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.128.0] - 2026-06-05

### Fixed

- **[Phase 10 Progress Calendar A11y]** 补齐 `/progress` 学习日历的非颜色状态语义。
  - 学习日历日期格现在通过中文 `aria-label` 暴露 `已完成学习`、`已安排学习`、`暂无学习记录`。
  - 图例文案从 raw enum 调整为中文状态，避免只靠绿色/蓝色/灰色理解进度。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/progress-analytics.test.ts` 首次失败于学习日历缺少中文状态 `aria-label`。
- 本地 GREEN：同命令 14 项通过，覆盖 completed/planned/none 三种状态。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.127.0] - 2026-06-05

### Fixed

- **[Phase 10 Today Full View A11y]** 补齐 Today 完整视图折叠区的可访问性语义。
  - `CollapsibleContentSection` 的按钮现在暴露 `aria-expanded` 和 `aria-controls`。
  - 展开后的完整视图内容区域现在使用 `role="region"`，并通过 `aria-labelledby` 关联折叠按钮。
  - 该切片只增强读侧 UI 语义，不新增写 action、不触碰 Preview token、生产配置或服务器。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于折叠区缺少 `aria-expanded` 和内容区域关联。
- 本地 GREEN：同命令 16 项通过，覆盖默认折叠、默认展开和 ARIA 关联。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.126.0] - 2026-06-05

### Added

- **[Phase 3.5 PWA Shortcuts]** 补齐安装后快速入口。
  - `manifest.webmanifest` 现在提供 `今日学习`、`复习中心`、`语音反思` 和 `每周复盘` 四个 shortcuts。
  - 这些 shortcuts 对应 guidance 的手机端核心闭环：看今日任务、复习卡片、语音记录理解、查看周复盘。
  - 该切片只修改 PWA manifest 元数据，不新增 service worker、不新增写 action、不触碰生产配置。

### Verified

- 本地 RED：`npm test -- tests/unit/pwa-manifest.test.ts` 首次失败于 manifest 缺少 `shortcuts`。
- 本地 GREEN：同命令 1 项通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/weekly` 返回 HTTP 200，页面包含 `导出 Weekly Markdown`、`# Roky Learn Weekly Report`、`7 天总览`、`AI 周总结` 和 `下周建议`。
- 本地 RED：`npm test -- tests/unit/auth-policy.test.ts` 首次失败于 `/manifest.webmanifest` 被 auth policy 识别为受保护路径。
- 本地 GREEN：`npm test -- tests/unit/auth-policy.test.ts tests/unit/pwa-manifest.test.ts` 11 项通过。
- 本地 GREEN：未登录 `curl http://127.0.0.1:3000/manifest.webmanifest` 返回 HTTP 200、`application/manifest+json`，包含四个 shortcuts。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 路由表显示 `/manifest.webmanifest` 为静态资源。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实生产 Preview token smoke 或 service worker 离线能力。

## [0.125.0] - 2026-06-05

### Added

- **[Phase 5.4 Weekly Markdown Export]** 补齐每周复盘的可复制周报。
  - `buildWeeklyReviewSnapshot()` 现在生成 `weeklyReportMarkdown`，覆盖 7 天总览、本周课程、领域与错题、代码与复习、AI 周总结和下周建议。
  - `/weekly` 新增 `导出 Weekly Markdown` 只读文本区，方便复制到笔记、学习档案或阶段性总结。
  - 该切片只使用已有 weekly snapshot 数据，不新增数据库字段、不新增写 action、不调用 AI。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于缺少 `weeklyReportMarkdown` 和 `导出 Weekly Markdown` 页面展示。
- 本地 GREEN：同命令 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-completion-next-actions.test.ts` 25 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 路由表保持 `/weekly`、`/today`、`/voice` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.124.0] - 2026-06-05

### Added

- **[Phase 4.5 Voice Reflection Recommendation]** 补齐 Today 完成态的推荐语音反思。
  - `buildTodayCompletionNextActions()` 现在为已完成课程生成 `recommendedVoiceReflection`。
  - `LearningCompletionCard` 在 `今日完成 Hub` 后显示 `推荐语音反思`、`60 秒`提示和语音入口。
  - 语音推荐入口使用 `/voice?lessonId=...&mode=daily_understanding`，复用现有 Voice 60 秒反思模板，不新增数据库字段或写 action。

### Verified

- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于缺少 `recommendedVoiceReflection` 和 `推荐语音反思` UI。
- 本地 GREEN：同命令 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 35 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 路由表保持 `/today`、`/voice` 和 `/projects/portfolio`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.123.0] - 2026-06-05

### Added

- **[Phase 8.4 Portfolio Route]** 补齐 `/projects/portfolio` 独立项目作品集页面。
  - 新增 `src/app/projects/portfolio/page.tsx`，只读展示已完成项目的学习 portfolio。
  - 新增 `ProjectPortfolioPageContent`，复用 `ProjectPortfolioPanel` 和 `Portfolio Markdown` 导出契约。
  - `/projects` 的项目作品集 section 新增 `打开作品集` 入口；`/projects/portfolio` 提供 `回到项目实践`。
  - `audit:routes` 将 `/projects/portfolio` 识别为 intentional subpage，避免把该子页误报为缺主导航。
  - Visual、hydration、a11y 和 mobile matrix 页面清单纳入 `/projects/portfolio`。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于缺少 `ProjectPortfolioPageContent`。
- 本地 GREEN：同命令 11 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts` 27 项通过。
- 本地 GREEN：`npm run audit:routes && npm run audit:learning` 通过，route audit 显示 `Pages: 19` 且 `Pages without navigation: none`。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，Next 路由表包含 `/projects/portfolio`，静态页面生成数为 28。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/projects/portfolio` 返回 HTTP 200，页面包含 `项目作品集`、`可导出的学习 portfolio` 和 `回到项目实践`。
- 本地 GREEN：focused Playwright `projects-portfolio` hydration、visual、a11y 和 mobile matrix 验证通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.122.0] - 2026-06-05

### Added

- **[Phase 2.5 Habit Goal]** 补齐学习欲望层的周目标、连续学习保护和轻量学习模式。
  - 新增 `src/server/learning/habit-goal.ts`，用现有 completed localDate、streak 和今日任务状态计算本周目标进度。
  - 新增 `LearningHabitGoalCard`，展示 `周目标`、`连续学习保护` 和 `轻量学习模式`。
  - 首页和 `/progress` 均接入习惯目标卡；轻量模式默认落到 60 秒 Voice 反思，不新增数据库字段或写 action。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于缺少 `@/server/learning/habit-goal`。
- 本地 GREEN：同命令 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts tests/unit/progress-analytics.test.ts tests/unit/current-mission.test.ts` 24 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.121.0] - 2026-06-05

### Added

- **[Phase 8.4 Portfolio Export]** 补齐项目作品集的可导出学习档案。
  - `buildProjectPortfolioItems()` 现在为已完成项目生成 `portfolioMarkdown`，包含项目标题、项目总结、学习证据、相关知识和代表代码片段。
  - `ProjectPortfolioPanel` 在每个完成项目卡片中展示 `导出 Portfolio Markdown` 只读文本区，方便复制到笔记、简历或阶段性学习档案。
  - 该切片只增强读侧展示，不新增数据库字段、不新增写 action、不执行用户代码。

### Verified

- 本地 RED：`npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts` 首次失败于缺少 `portfolioMarkdown` 和 `导出 Portfolio Markdown` UI。
- 本地 GREEN：同命令 26 项通过。
- 本地 GREEN：`npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts` 35 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.120.0] - 2026-06-05

### Fixed

- **[E2E Smoke Contract Sync]** 对齐 focused smoke 测试与当前 Learning Desire UI。
  - `/weekly` 的 `下周建议` 现在在 smoke 中使用 `.first()`，匹配页面同时展示概览标签和 AI 周总结卡片标题的真实结构。
  - `/glossary` smoke 断言从旧文案 `已看过` 同步为 guidance 对齐后的 `已看`。
  - `/review` reveal 后评分按钮断言同步为真实可访问名称 `忘了 +1d` 和 `很熟 +14d`。

### Verified

- 本地 RED：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"` 首次失败于 stale smoke 断言。
- 本地 GREEN：同步测试契约后同命令 2 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.119.0] - 2026-06-05

### Added

- **[Phase 8.1 Home Project Rhythm]** 对齐首页当前项目任务卡。
  - `ProjectDailyRhythmCard` 在首页项目卡中显式展示 `今日项目任务 / 今日里程碑`。
  - Active project 场景继续显示项目标题、进度、里程碑进度、当前 milestone 任务、项目卡片到期、代码反馈到期和 `继续项目`。
  - 无 active project 场景继续保留 starter 空态和 `选择项目` 入口。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于首页项目卡缺少 `今日里程碑`。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 10 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-motivation.test.ts` 42 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 构建路由表包含首页 `/` 和 `/projects` 动态页面。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.118.0] - 2026-06-05

### Added

- **[Phase 8.3 Projects Mission Mode Detail]** 补齐 `/projects` 当前里程碑任务说明。
  - `ProjectMissionBrief` 现在显式展示 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口`。
  - `AI 评审入口` 文案直接指向现有 `保存并评审代码` action，不新增代码执行路径、不新增数据库结构。
  - 当前任务 brief 继续展示 milestone 标题、任务、codePrompt 和状态 badge，只增强 guidance 要求的可见任务边界。

### Verified

- 本地 RED：`npm test -- tests/unit/project-mission-workspace.test.ts` 首次失败于 `ProjectMissionBrief` 缺少 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口` 和 `保存并评审代码`。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 10 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts` 35 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 构建路由表包含 `/projects` 动态页面。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.117.0] - 2026-06-05

### Added

- **[Phase 7.1 Curated Knowledge Paths]** 补齐 Glossary/Radar 学习路径卡的 guidance 对齐。
  - `src/server/knowledge/paths.ts` 已固定五条 curated paths：`Agent Path`、`RAG Path`、`LLM Training Path`、`AI Industry Path`、`Benchmark Path`。
  - `/glossary` 现在展示全部 glossary paths，不再因 `.slice(0, 2)` 漏掉 `LLM Training Path`。
  - `/radar` 现在展示全部 radar paths，后续新增 Radar curated path 时不会被页面截断。
  - `KnowledgePathExplorer` 的指标文案对齐 guidance：`已看`、`已生成卡片`、`已复习`、`未掌握`、`下一项`。

### Verified

- 本地 RED：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 首次失败于 `/glossary` 仍截断 paths、指标文案仍为 `已看过` / `已制卡`。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 26 项通过。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/learning-path.test.ts` 29 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build` 通过；Next 构建路由表包含 `/glossary` 和 `/radar` 动态页面。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.116.0] - 2026-06-04

### Added

- **[Phase 6.3 Voice Reflection Templates]** 收口 Voice 反思模板的 SSOT 对齐。
  - `src/server/voice/reflection-template.ts` 继续提供 `今日理解`、`代码思路`、`术语解释`、`论文阅读`、`行业观察`、`项目复盘` 六个模板入口。
  - 六个模板现在全部显示 guidance 指定的同一组 `请用 60 秒说明` 四句提示：`我今天学了什么？`、`我哪里还不懂？`、`我能举什么例子？`、`我希望 Coach 检查什么？`。
  - `VoiceWorkspaceForm` 保持页面结构不变，仍可一键插入任一模板到 Transcript，但不会因模板类型不同而偏离统一反思协议。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts` 首次失败于 `代码思路` 等模板仍显示定制问题，未显示 guidance 的统一四句提示。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts` 33 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实转写 API 调用或真实生产 Preview token smoke。

## [0.115.0] - 2026-06-04

### Added

- **[Phase 6.1/6.2 Voice Vocabulary Cleanup]** 补齐 Voice 转写术语词表和 transcript cleanup。
  - `src/server/voice/vocabulary.ts` 的转写 prompt 改为固定要求 `Preserve these AI acronyms and technical terms.`，并补齐 `BM25`、`Reranker`、`Embedding`、`Vector Database`。
  - 新增 `src/server/voice/cleanup.ts`，集中拥有转写后处理规则，规范 `cot`、`chain of thought`、`swe bench/swebench`、`rag`、`lora`、`mmlu`、`gpqa` 等常见误识别。
  - `normalizeVoiceTranscript()` 改为调用 cleanup owner，保持转写入口只负责组合校验、provider 调用和归一化。
  - 单测固定完整 Voice 术语表和 cleanup 输出，避免 Voice Note 把 AI 术语转写成不稳定的小写或错误拼写。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-transcription.test.ts` 首次失败于缺少固定 prompt 句式、缺少新术语和 `chain of thought -> Chain-of-Thought` cleanup。
- 本地 GREEN：`npm test -- tests/unit/voice-transcription.test.ts` 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts` 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts` 33 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更、真实转写 API 调用或真实生产 Preview token smoke。

## [0.114.0] - 2026-06-04

### Added

- **[Phase 5.4 Weekly Review Overview]** 补齐 `/weekly` 每周复盘的 7 天总览和 AI 周总结 fallback。
  - `src/server/learning/weekly.ts` 新增 `weeklyOverview`，汇总学习天数、完成课程、复习卡片、quiz 正确率、代码提交、Voice Note、Coach 次数、项目里程碑、新增误区、已解决误区、术语/Radar 覆盖。
  - 新增 `aiSummary` fallback，不调用 AI 也能输出 `本周最重要收获`、`主要薄弱点`、`下周建议` 和 `推荐下一阶段`。
  - `/weekly` 页面新增 `7 天总览` 和 `AI 周总结` 两块，把周报从散点卡片升级为可读的学习档案。
  - 周报新增真实数据查询：`VoiceNote`、`ThoughtReview`、完成的 `ProjectMilestone`、新增/已解决 `Misconception`、术语/Radar 复习记录。

### Verified

- 本地 RED：`npm test -- tests/unit/weekly-review.test.ts` 首次失败于缺少 `weeklyOverview.studyDays`、空数据 `weeklyOverview` 和页面 `7 天总览` 标签。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts` 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 23 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/weekly` 返回 HTTP 200，SSR HTML 包含 `7 天总览`、`AI 周总结`、`Voice Note`、`Coach 次数`、`项目里程碑`、`术语/Radar 覆盖` 和 `推荐下一阶段`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.113.0] - 2026-06-04

### Added

- **[Phase 5.3 Learning Path Unlock Signals]** 补齐 `/path` 学习路径的学习效果信号。
  - `src/server/learning/path.ts` 的 stage metrics 新增 `quizAttempts`、`correctQuizAnswers` 和 `quizAccuracy`，从正式课程的 `QuizAttempt` 聚合到对应学习阶段。
  - 每个 stage 新增 `unlockCondition`，用未完成 criteria 生成可见解锁差距，例如还差主课、复习卡、代码练习或误区收口。
  - 每个 stage 新增 `nextTopic`，优先消费今日课程标题，否则根据第一个未完成 criteria 给出下一步主题。
  - `/path` 页面在当前阶段摘要和路线卡片中展示 `测验正确率`、`解锁条件`、`下一步主题`，让路径感从“路线图”变成可执行的下一步。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-path.test.ts` 首次失败于缺少 `quizAccuracy`、`unlockCondition`、`nextTopic`。
- 本地 RED：`npm test -- tests/unit/learning-path.test.ts` 页面展示检查首次失败于 `/path` 源码缺少 `测验正确率`。
- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts` 3 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 22 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/path` 返回 HTTP 200，SSR HTML 包含 `测验正确率`、`解锁条件`、`下一步主题` 和 `学习路径`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.112.0] - 2026-06-04

### Added

- **[Phase 5.2 Mistakes Repair Center]** 补齐 `/mistakes` 错题修复中心的筛选和修复动作闭环。
  - `src/server/mistakes/view.ts` 新增 `MistakeKindFilter`、`parseMistakeKindFilter()` 和 `mistakeMatchesKindFilter()`，支持按 `概念 / 代码 / 算法 / 术语 / 事实` 收窄误区。
  - `/mistakes` 来源筛选新增 `项目实践`，页面新增 `全部类型` 类型筛选，并保留状态、来源和关键词搜索。
  - `buildReviewCardForMistake()` 为误区生成稳定 `mistake-card:{id}` 复习卡，动作入口为 `生成复习卡`。
  - `src/app/mistakes/actions.ts` 新增 `generateMistakeReviewCardAction()` 和 `markMistakeResolvedAction()`，并通过 `assertWritableRequest()` 继续保护 Preview 只读边界。
  - 每条误区记录新增 `标记已解决` 修复动作，解决后会刷新 `/mistakes`、`/progress`、`/map`、`/path` 和 `/weekly` 的学习效果读侧。

### Verified

- 本地 RED：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 首次失败于缺少类型筛选、项目来源、复习卡生成和 Preview action 守卫覆盖。
- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts` 17 项通过。
- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/mistakes?kind=term&source=project&status=all"` 返回 HTTP 200，SSR HTML 包含 `错题误区`、`筛选视图`、`类型`、`项目实践`、`全部类型` 和 `术语`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.111.0] - 2026-06-04

### Added

- **[Phase 5.1 Review Remediation Actions]** 补齐 Review Session Summary 的可执行补弱动作组。
  - `buildReviewSessionSummary()` 新增 `remediationActions`，当本轮出现 `forgot` 或 `hard` 时稳定输出三类入口：`让 Coach 解释这些卡片`、`生成补弱小课`、`查看错题中心`。
  - `/review` 完成态新增 `补弱动作` 区块，直接展示三类后续动作，同时保留原有主 CTA 和复习统计。
  - `src/server/learning/today-remediation-intent.ts` 与 `TodayRemediationBanner` 让 `/today?mode=remediation&source=review&focus=...` 成为真实读侧落点，页面会显示 `Review 补弱短课` 和 `补弱短课已带入`。
  - `/today` 接入 Next 16 Promise 版 `searchParams`，只在 Review remediation handoff 参数存在时渲染补弱短课提示；不新增数据库、AI 调用、生产部署或写入路径。

### Verified

- 本地 RED：`npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 首次失败于缺少 `remediationActions` 和 `补弱动作` UI。
- 本地 RED：`npm test -- tests/unit/today-remediation-intent.test.ts` 首次失败于缺少 `TodayRemediationBanner`。
- 本地 GREEN：`npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/today-completion-next-actions.test.ts` 29 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/today?mode=remediation&source=review&focus=RAG&lesson=RAG"` 返回 HTTP 200，SSR HTML 包含 `Review 补弱短课`、`补弱短课已带入` 和 `生成补弱小课`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.110.0] - 2026-06-04

### Added

- **[Phase 4.2 Today Stage Status]** 收口 Today 阶段完成状态规则。
  - 新增 `src/server/learning/today-stage-status.ts`，用纯函数判断 quiz 阶段和术语/Radar 阶段的 `todo / active / done`。
  - quiz 阶段现在区分未提交、部分提交和全部提交；无 quiz 时直接视为完成。
  - 术语/Radar 阶段现在根据今日连接和知识卡详情是否匹配判断状态；无连接时视为完成，部分匹配时显示进行中。
  - `/today` 的时间线和 FocusPlayer 复用同一阶段状态，避免左侧时间线与播放器状态分叉。

### Verified

- 本地 RED：`npm test -- tests/unit/today-stage-status.test.ts` 首次失败于缺少 `@/server/learning/today-stage-status`。
- 本地 GREEN：`npm test -- tests/unit/today-stage-status.test.ts` 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 26 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.109.0] - 2026-06-04

### Added

- **[Phase 4.5 Today Completion Hub]** 补齐 Today 完成后的可见学习结果摘要。
  - `buildTodayCompletionNextActions()` 新增 `completionHub`，用已有数据汇总 `生成卡片`、`小测验` 和 `代码提交` 三个指标。
  - `LearningCompletionCard` 在今日完成态展示 `今日完成 Hub`，让用户完成课程后能直接看到卡片数量、quiz 提交/正确情况和代码提交状态。
  - `/today` 把现有 `flashcardCount`、quiz attempt 统计和代码练习提交状态传入完成卡；不新增数据库、路由、AI 调用或生产行为。

### Verified

- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于缺少 `completionHub` 和 `今日完成 Hub`。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 33 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/today` 返回 HTTP 200；当前本地 demo 数据为未完成态，SSR HTML 包含 `完成后下一步`、`生成卡片`、`小测验`，不显示仅完成态出现的 `今日完成 Hub`。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.108.0] - 2026-06-04

### Added

- **[Phase 8.2 Today Project Recommendation]** 强化 Today 完成后的项目实践推荐。
  - `LearningCompletionCard` 的项目实践区新增 `下一步：把今天的知识用到项目里`，让用户完成今日课程后立即看到从学习到项目的下一步。
  - 项目实践区新增 `推荐项目任务` 标题，继续复用已有 active project 里程碑或无项目 starter，不新增数据库、路由或生产行为。
  - Active project 场景仍显示项目名、进度、当前里程碑、具体任务和 `/projects?projectId=...` 链接；无 active project 时仍提示开始小项目并链接 `/projects`。

### Verified

- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于缺少 `下一步：把今天的知识用到项目里` 和 `推荐项目任务`。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 31 项通过。
- 本地 GREEN：`npm run lint`、`git diff --check` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.107.0] - 2026-06-04

### Added

- **[Phase 7.3 Radar Relation Cards]** 将 `/radar` 的简单关系 badge 升级为卡片链。
  - 新增 `src/server/knowledge/radar-relations.ts`，把选中 Radar 实体、相关术语和候选实体整理成四组稳定关系卡：`相关实体`、`相关术语`、`相关论文`、`相关 Benchmark`。
  - `/radar` 详情页新增 `关系卡片链` 区块，用卡片展示关系项标题、摘要、类型 badge 和可点击详情链接。
  - 关系链接复用现有详情页：术语跳 `/glossary?term=...`，Radar 实体、论文和 Benchmark 跳 `/radar?entity=...`。
  - 关系匹配支持当前实体指向候选实体，也支持候选实体通过 `relatedTerms` / `representativeWorks` 指回当前上下文。

### Verified

- 本地 RED：`npm test -- tests/unit/knowledge-base.test.ts` 首次失败于缺少 `@/server/knowledge/radar-relations`。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts` 10 项通过。
- 本地 GREEN：`npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/daily-breadth.test.ts` 30 项通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/radar?entity=shunyu-yao"` 返回 HTTP 200，页面包含 `关系卡片链`、`相关实体`、`相关术语`、`相关论文`、`相关 Benchmark` 和 `SWE-bench`。
- 本地 GREEN：`npm run lint`、`git diff --check` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.106.0] - 2026-06-04

### Added

- **[Phase 7.2 Daily Breadth Quest]** 把今日广度挑战接入首页 Daily Quest。
  - `src/server/learning/daily-quests.ts` 新增 `buildBreadthChallengeFromLessonConnections()`，从 `Lesson.connections.glossary/breadth/knowledgeFocus` 生成 `breadth-challenge` 任务。
  - `buildDailyQuests()` 支持在“推进代码或项目”前插入 `今日术语挑战`、`今日人物挑战` 或 `今日 Benchmark 挑战`，并指向 `/glossary?term=...` 或 `/radar?entity=...`。
  - 首页 `/` 读取今日课程 `connections` 和已生成的 glossary/radar 卡片 ID，把广度挑战并入 `DailyQuestCard`，让首页直接显示今日知识探索任务和完成态。

### Fixed

- **[Daily Breadth Quest Rotation]** 修正同时存在 glossary 与 radar 连接时的挑战优先级。
  - 当 `knowledgeFocus.rotation.focus` 是 `person` 或 `benchmark`，Daily Quest 优先显示对应 Radar 挑战，不再被 glossary 术语抢占。
  - 周一术语日或没有可用 Radar 挑战时仍回退到 `今日术语挑战`。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-motivation.test.ts` 首次失败于 Benchmark/人物轮转被 glossary 抢占，实际返回 `今日术语挑战`。
- 本地 GREEN：`npm test -- tests/unit/learning-motivation.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/daily-breadth.test.ts tests/unit/learning-motivation.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts` 36 项通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/` 返回 HTTP 200，页面包含 `今日任务` 和本地样本下的 `今日术语挑战`。
- 本地 GREEN：`npm run lint`、`git diff --check` 通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.105.0] - 2026-06-04

### Added

- **[Phase 6.4 Voice Coach Handoff]** 打通 Voice Note 发送 Coach 后的直接 review 体验。
  - 新增 `src/server/voice/handoff.ts`，集中生成 `/coach?reviewId=...&source=voice-note&voiceNoteId=...` 跳转地址。
  - `sendVoiceNoteToCoachAction` 使用 `sendVoiceNoteToCoach()` 返回的 `reviewId` 直接跳转到对应 Coach review，不再回到 `/voice` 等用户二次点击。
  - `/coach` 读取 `reviewJson.source === "voice-note"` 和 `voiceNoteId` 后，查回当前用户、当前 review 关联的 VoiceNote，并显示 `来自 Voice Note` 来源面板。
  - `CoachVoiceSourcePanel` 展示 Voice Note mode、transcript preview、`查看 Voice Note` 和 `保存为 Note` / `查看 Note`，并保留下方 Coach 一键生成卡片路径。
  - `tests/e2e/voice-interactions.spec.ts` 的 Voice → Coach → Review 路径更新为新交互：送 Coach 后进入 `/coach?reviewId=...`，再由 Coach 生成卡片进入 focused review。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts` 首次失败于缺少 `@/server/voice/handoff` 和 `CoachVoiceSourcePanel` 导出。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts` 14 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-note.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过。
- 本地 GREEN：`npm test` 268 项、`git diff --check`、`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过，27 static pages，`/coach` 和 `/voice` 动态页面构建通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/coach` 返回 HTTP 200；`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice` 返回 HTTP 200。
- 本地 RED/GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome" -g "voice flow sends transcript to coach"` 先失败于旧的 `/voice` 期望，更新后 1 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 完整复跑 84 项通过；首次运行有一次 `/mistakes` 430px transient `page.goto` timeout，`curl /mistakes`、单项复跑和完整复跑均通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库迁移/密钥变更或真实生产 Preview token smoke。

## [0.104.0] - 2026-06-04

### Added

- **[Phase 3.4 Mobile Voice Capture]** 强化手机端 `/voice` 的语音捕获和后续学习流水线。
  - `VoiceCapture` 的浏览器录音停止后会把录音文件直接交给现有 `transcribeAudioAction`，转写成功后继续通过 `onTranscript` 自动填入 Transcript。
  - 录音卸载清理加上 guard，避免离开页面时误触发自动转写或 setState。
  - 手机端录音主操作改为 `一键录音` / `停止并转写`，按钮使用 lucide 图标和 `min-h-12 w-full sm:w-auto` 大触控目标。
  - `VoiceLearningPipeline` 的 Coach、Note、Cards、Review CTA 改为手机端全宽 `min-h-11` 大按钮，桌面端保持横向操作组。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts` 首次失败于录音停止后仍提示手动转写、录音按钮仍是小按钮。
- 本地 GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts` 11 项通过。
- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 首次失败于 Voice 流水线 CTA 仍为小按钮，最终 15 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/learning-ui-components.test.ts` 38 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm test` 266 项、`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice` 返回 HTTP 200，热请求 `TIME_TOTAL=0.228079`。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。

### Not Covered

- 未执行生产部署、Nginx/DNS/数据库/密钥变更或真实生产 Preview token smoke。

## [0.103.0] - 2026-06-04

### Added

- **[Phase 3.3 Mobile Review Controls]** 强化手机端 `/review` 主动回忆操作区。
  - `src/app/review/ui/review-trainer.tsx` 导出 `ReviewRatingControls`，让评分区可被学习 UI 单测直接覆盖。
  - 当前复习卡片使用 `mx-auto grid w-full max-w-2xl` 居中，避免手机端卡片贴边或宽屏过散。
  - `显示答案` 按钮提升到 `min-h-12` 且手机端全宽，评分按钮改为移动端单列大按钮、桌面端四列。
  - 桌面快捷键提示改为仅在 `sm` 以上显示，手机端不再依赖键盘快捷键文案。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts`，新增移动端 Review 大按钮和评分区测试，最终 15 项通过。
- 本地 GREEN：`npm run lint`、`npm test` 264 项、`npm run build`、`git diff --check` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/review` 返回 HTTP 200。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。

## [0.102.0] - 2026-06-04

### Added

- **[Phase 3.2 Mobile Today Sticky Controls]** 强化手机端 Today FocusPlayer。
  - `src/components/learning/learning-focus-player.tsx` 的阶段顶部进度区在手机端使用 `sticky top-0`，滚动时保留当前阶段和进度。
  - 阶段底部上/下一步控制在手机端使用 `sticky bottom-16`，避免移动端滚到长正文后找不到下一步。
  - 上一步/下一步按钮增加 `min-h-11` 和移动端弹性宽度，提升触控面积。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts`，先失败于缺少 `sticky top-0`、`sticky bottom-16`、`min-h-11`，最终 13 项通过。
- 本地 GREEN：`npm run lint`、`npm test` 262 项、`npm run build`、`git diff --check` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/today` 返回 HTTP 200。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。

## [0.101.0] - 2026-06-04

### Added

- **[Phase 4.3 Today Stage Guidance]** 补齐 `/today` 每个专注阶段的“做什么 / 为什么 / 完成标准”。
  - `src/components/learning/learning-focus-player.tsx` 新增可选 `guidance` 阶段结构。
  - `src/app/today/page.tsx` 给目标、主课、引导、代码、测验、知识卡、反思阶段补齐任务、原因和完成标准。
- **[Phase 4.4 LearningMarkdown Course Blocks]** 让主课正文更像课程。
  - `src/components/learning/learning-markdown.tsx` 支持 `核心直觉`、`常见误区`、`例子/示例`、`自测` blockquote callout。
  - 新增 `src/components/learning/learning-code-block.tsx`，给 fenced code block 加 `复制代码` 入口。
  - `src/server/ai/generate-daily-plan.ts` 将 `DAILY_PLAN_PROMPT_VERSION` 升到 `daily-plan-v2.4-course-blocks`，并要求 `lesson.contentMarkdown` 生成 `> 核心直觉 / > 常见误区 / > 代码/伪代码 / > 自测`。

### Verified

- 本地 RED/GREEN：`npm test -- tests/unit/learning-ui-components.test.ts`，先失败于缺少阶段指导与课程 callout/复制入口，最终 13 项通过。
- 本地 RED/GREEN：`npm test -- tests/unit/daily-generation-prompt.test.ts`，先失败于 prompt 缺少课程块协议，最终 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts` 19 项通过。
- 本地 GREEN：`npm run lint`、`npm test` 262 项、`git diff --check`、`npm run build` 通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。
- 本地 GREEN：`npm run audit:learning` 和 `npm run audit:routes` 通过。

### Notes

- 一次较早的 mobile matrix 运行中 `/voice` 1440px 出现 `page.goto` 60s 超时；`curl /voice`、单用例复跑和完整矩阵复跑均通过，按 transient 记录，没有改产品代码。

## [0.100.0] - 2026-06-03

### Added

- **[Phase 2.4 Celebration Feedback]** 补齐学习完成后的轻量反馈。
  - 新增 `src/components/learning/learning-celebration-cue.tsx`，统一 Today 完成、Review 清空、Projects 里程碑和误区解决的克制反馈样式。
  - `src/components/learning/learning-completion-card.tsx` 在今日完成态显示 `今日学习完成` 与 `完成反馈`。
  - `src/app/review/ui/review-trainer.tsx` 在复习清空后显示 `复习清空` 和本轮留存指标。
  - `src/app/projects/ui/project-mission-workspace.tsx` 在项目里程碑完成态显示 `里程碑完成` 和里程碑进度。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 首次因缺少 `LearningCelebrationCue` 失败。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 12 项通过。
- 本地 GREEN：`npm test -- tests/unit/project-mission-workspace.test.ts` 9 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 28 项通过。
- 本地 GREEN：`git diff --check`、`npm run lint`、`npm run build`、`npm test` 260 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。

### Not Covered

- `npm run e2e:a11y` 聚合命令当前会同时跑 WebKit 项目；本机缺少 WebKit runtime，失败归因于环境，不作为产品回归。

## [0.99.0] - 2026-06-03

### Added

- **[Phase 9.2 Prompt Studio]** 补齐 `/admin` 的生成提示词和修复样例后台。
  - 新增 `src/server/admin/prompt-studio.ts`，用纯函数聚合 prompt/schema 版本、schema drift、最近失败样例、fallback/repair 样例和 manual repair readiness。
  - 新增 `src/app/admin/ui/prompt-studio-card.tsx`，在 `/admin` 展示 `Prompt Studio`、`Prompt version`、`Schema version`、`手动 repair 测试`、`最近失败样例` 和 fallback/repair 样例。
  - `src/server/ai/generate-daily-plan.ts` 新增 `DAILY_PLAN_PROMPT_VERSION`，新 `daily_plan` job input 会记录 prompt version。
  - 新增 `regeneratePlanForLocalDateAction`，只归档并重建指定 localDate 的 test 计划，用于后台安全试跑“重新生成某日期”。
  - 新增 `tests/unit/admin-prompt-studio.test.ts`，以 RED/GREEN 固化 Prompt Studio 汇总规则。

### Verified

- 本地 RED：`npm test -- tests/unit/admin-prompt-studio.test.ts` 首次因缺少 `@/server/admin/prompt-studio` 失败。
- 本地 GREEN：`npm test -- tests/unit/admin-prompt-studio.test.ts` 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/daily-generation-prompt.test.ts tests/unit/daily-generation-quality.test.ts` 7 项通过。
- 本地 GREEN：`git diff --check` 通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test` 257 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/admin` 返回 HTTP 200，热请求约 0.67s，并包含 `Prompt Studio`、`Prompt version`、`Schema version`、`手动 repair 测试`、`最近失败样例`、`重新生成某日期`。

## [0.98.0] - 2026-06-03

### Added

- **[Phase 10 Hydration Guard]** 补齐 React/Next hydration mismatch 的浏览器级回归守卫。
  - 新增 `tests/e2e/hydration.spec.ts`，复用 visual page 列表覆盖 16 个核心页面。
  - 监听 browser console 和 pageerror，仅拦截 hydration mismatch 相关错误，避免普通 console noise 造成误报。
  - 新增 `npm run e2e:hydration`。

### Verified

- 诊断：当前 `/login?next=/today` 的 SSR HTML 和 Playwright DOM hidden inputs 都没有 `caret-color` style，Playwright console 未复现早前 hydration warning。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:hydration` 16 项通过。

## [0.97.0] - 2026-06-03

### Added

- **[Phase 10 Preview Readonly E2E]** 补齐 `E2E_PREVIEW_TOKEN` 驱动的 Preview 写保护浏览器测试。
  - 新增 `tests/e2e/preview-readonly.spec.ts`，通过 `/preview?token=...` 进入只读 Preview Mode。
  - 覆盖 Settings 保存、Today quiz 提交、Today code 保存的拒绝响应。
  - 覆盖 Preview Mode 下 `/admin` 隐藏，避免管理面板在只读预览中暴露。
  - 新增 `npm run e2e:preview-readonly`。

### Verified

- 本地 RED：仅设置 `E2E_PREVIEW_TOKEN`、服务端未设置匹配 `PREVIEW_TOKEN` 时，测试在 Preview banner 断言失败，证明不会绕过 `/preview`。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 E2E_PREVIEW_TOKEN=<redacted-temp-token> npm run e2e:preview-readonly` 4 项通过。

### Not Covered

- 未使用真实生产 Preview token。
- 未执行生产部署、Nginx/DNS/数据库/密钥变更或生产 smoke。

## [0.96.0] - 2026-06-03

### Added

- **[Phase 10 A11y / Mobile Matrix]** 补齐自动化可访问性和移动宽度验收。
  - 新增 `tests/e2e/a11y.spec.ts`，用 `axe-core` 扫描 14 个核心页面，阻断 serious/critical WCAG 2A/2AA/2.1A/2.1AA violations。
  - 新增 `tests/e2e/mobile-matrix.spec.ts`，覆盖 375/390/430/768/1024/1440 宽度矩阵，检查主 heading 可见和无横向溢出。
  - 新增 `npm run e2e:a11y` 与 `npm run e2e:mobile-matrix`。

### Fixed

- **[A11y Contrast / Labels]** 修复 a11y RED 暴露的问题。
  - 调深 light mode `--muted-foreground`，让 12px/14px 次级文本在 muted 和浅色提示背景上满足对比度。
  - 将 disabled button opacity 从 50% 调整到 70%，避免 disabled secondary button 标签对比度不足。
  - 为 Coach/Voice 原生 mode select、Voice 音频上传 input、Settings 数字输入补可访问名称。
  - 移除学习步骤状态图标容器上的非交互 `aria-label`，改用普通 `title`。

### Verified

- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 28 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix` 84 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test` 255 项通过。
- 本地 GREEN：`E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/visual.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"` 32 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run audit:routes` 和 `npm run audit:learning` 通过。

## [0.95.0] - 2026-06-03

### Added

- **[Admin Content Review Queues]** 补齐创作者维护内容质量的 Admin 面板。
  - 新增 `src/server/admin/content-review.ts`，用纯函数聚合卡片质量审查和 Glossary/Radar 来源核验队列。
  - `/admin` 新增“卡片质量审查”，覆盖过长卡片、答案过短、重复 front、缺少 tags、从未复习。
  - `/admin` 新增“来源核验队列”，覆盖 Glossary 缺来源、Radar 缺来源、Radar 验证过期、Radar 低置信度。
  - 新增 `tests/unit/admin-content-review.test.ts`，以 RED/GREEN 固化队列排序和计数规则。
- **[Knowledge Base Sync]** `helloagents/modules/generation-quality.md` 同步记录 Admin 内容质量队列 owner、行为和验收方式。

### Verified

- 本地 GREEN：`npm test -- tests/unit/admin-content-review.test.ts` 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts` 6 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test` 255 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/admin` 返回 HTTP 200，热请求约 0.64s，并包含“卡片质量审查”和“来源核验队列”。

## [0.94.0] - 2026-06-02

### Added

- **[Generation Quality Snapshot]** 把每日课程生成质量写回 `AiGenerationJob.output`。
  - 新增 `src/server/ai/daily-generation-quality.ts`，统一生成 `qualityScore`、`qualityChecks`、`qualityWarnings` 和 `qualityMetrics`。
  - 质量检查项覆盖《学习平台开发.md》要求的 8 个信号：代码练习、quiz options、术语卡、广度卡、`commonBugs`、正文过短、重复近期主题、JSON repair/fallback。
  - `src/server/ai/generate-daily-plan.ts` 现在会在 primary success、repair success 和 template fallback 三种分支里统一写入质量快照。
- **[Progress Quality Surface]** `/progress` 现在能读持久化生成质量。
  - `src/app/progress/page.tsx` 优先读取 `AiGenerationJob.output` 内的质量快照；历史旧数据才回退到运行时计算。
  - `src/server/analytics/progress.ts` 的生成稳定性新增最近平均质量、低质量 job 数和质量覆盖数。
  - `src/app/progress/analytics-panels.tsx` 的“内容质量”卡片会显示最近质量告警，“生成稳定性”卡片新增 `最近质量` 指标。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/generation-quality.md`，并补充 `docs/ui-review-checklist.md` 的 `/progress` 验收点。

### Verified

- 本地 GREEN：`npm test -- tests/unit/daily-generation-quality.test.ts tests/unit/progress-analytics.test.ts` 16 项通过。
- 本地 GREEN：`npm test -- tests/unit/daily-generation-quality.test.ts tests/unit/progress-analytics.test.ts tests/unit/daily-generation-prompt.test.ts` 19 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.93.0] - 2026-06-02

### Added

- **[Weekly Review Page]** 新增 `/weekly` 每周复盘页。
  - `src/server/learning/weekly.ts` 新增最近 7 天的学习周报聚合逻辑，输出本周课程、领域强弱、错题高发点、代码练习、复习保持和下周补弱建议。
  - `src/app/weekly/page.tsx` 新增页面，基于真实学习数据展示 weekly recap，而不是静态模板。
  - `src/lib/routes.ts` 新增导航入口，`src/server/auth/policy.ts` 把 `/weekly` 纳入受保护路由。
  - `tests/unit/weekly-review.test.ts` 新增周报聚合逻辑测试，`tests/e2e/smoke.spec.ts` 新增 `/weekly` 页面 smoke。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/weekly.md`，并补充 `docs/ui-review-checklist.md` 的 `/weekly` 验收项。

### Verified

- 本地 GREEN：`npm test -- tests/unit/weekly-review.test.ts tests/unit/auth-policy.test.ts` 9 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.92.0] - 2026-06-02

### Added

- **[Learning Path Page]** 新增 `/path` 学习路径页。
  - `src/server/learning/path.ts` 新增七段式学习路线聚合逻辑，基于 `DailyPlan`、`Flashcard`、`CodeSubmission`、`Misconception`、`LearningProject` 和广度知识卡复习记录生成真实阶段进度。
  - `src/app/path/page.tsx` 新增页面，直接回答“当前阶段 / 下一阶段 / 为什么今天学这个 / 当前阶段完成标准”。
  - `src/lib/routes.ts` 新增导航入口，`src/server/auth/policy.ts` 把 `/path` 纳入受保护路由。
  - `tests/unit/learning-path.test.ts` 新增阶段判定和回退逻辑测试，`tests/e2e/smoke.spec.ts` 新增 `/path` 页面 smoke。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/path.md`，并补充 `docs/ui-review-checklist.md` 的 `/path` 验收项。

### Verified

- 本地 GREEN：`npm test -- tests/unit/learning-path.test.ts tests/unit/auth-policy.test.ts` 9 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.91.0] - 2026-06-02

### Added

- **[Review Session Remediation]** 补齐 `/review` 复习完成后的修复建议闭环。
  - `src/server/review/session-summary.ts` 新增基于本轮已评分卡片的薄弱点聚合，使用 `Flashcard.tags`、关联课程和主题生成 `主要薄弱`、`建议` 和补弱短课提示。
  - `src/app/review/page.tsx` 在复习页补齐当前卡片的 `tags / lesson / topic` 上下文，供完成态总结使用。
  - `src/app/review/ui/review-trainer.tsx` 的完成态改为显示 `忘了 / 模糊 / 记得 / 很熟` 汇总、`主要薄弱` 区块，以及直达 `Coach` 的补弱入口。
  - 当本轮存在薄弱点时，主 CTA 会带着预填 `draft` 跳到 `/coach`，减少用户手写上下文的摩擦。
- **[Knowledge Base Sync]** `helloagents/modules/review.md` 和 `docs/ui-review-checklist.md` 已同步新的复习完成态验收标准。

### Verified

- 本地 GREEN：`npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 35 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.90.0] - 2026-06-02

### Added

- **[Mistakes Page]** 新增 `/mistakes` 误区工作台。
  - `src/app/mistakes/page.tsx` 新增独立页面，展示误区总览、状态/来源筛选、搜索、关联课程和关联卡片数。
  - `src/server/mistakes/view.ts` 新增误区状态解析、来源标签、类型推断和 Coach 预填文案生成。
  - `src/app/coach/page.tsx` 支持 `draft` 预填；从 `/mistakes` 点击“让 Coach 解释”时会把误区上下文直接带入输入框。
  - `src/lib/routes.ts` 新增导航入口，`src/server/auth/policy.ts` 把 `/mistakes` 纳入受保护路由。
- **[Smoke Coverage]** `tests/e2e/smoke.spec.ts` 新增 `/mistakes` 验收点，确保标题、筛选区和误区清单存在。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/mistakes.md`，记录页面目标、过滤规则和生产验收方式。

### Verified

- 本地 GREEN：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts` 20 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 生产 GREEN：`118.25.15.72` 上相关测试通过，`npm run build` 通过。
- 生产 GREEN：密码登录后可访问 `https://learn.roky.chat/mistakes`，并能看到 `错题误区`、`筛选视图`、`误区清单`。

## [0.89.0] - 2026-06-02

### Added

- **[Voice Vocabulary Cleanup]** 补齐 AI 学习场景下的语音转写术语保护。
  - `src/server/voice/vocabulary.ts` 新增 AI 缩写词表与清洗规则，覆盖 `CoT`、`SWE-bench`、`RLHF`、`LoRA`、`RAG`、`MMLU`、`GPQA`、`HumanEval`、`ReAct`、`ToT`、`MCP` 等常见术语。
  - `src/server/voice/transcription.ts` 新增 `buildVoiceTranscriptionPrompt()` 与 `normalizeVoiceTranscript()`，让转写请求显式保留这些术语，并在返回文本后修正常见误识别。
  - `tests/unit/voice-transcription.test.ts` 新增 prompt 和后处理断言，防止后续退回成通用转写。
- **[Voice Reflection Template]** 给 `/voice` 增加一键反思模板。
  - `src/server/voice/reflection-template.ts` 新增 60 秒反思模板。
  - `src/app/voice/ui/voice-workspace-form.tsx` 新增“开始 60 秒反思”按钮，点击后把四句模板填入 Transcript 并聚焦编辑区。
  - `tests/unit/voice-note.test.ts` 新增模板文案断言，确保入口和问题提示稳定存在。
- **[Knowledge Base Sync]** `helloagents/modules/voice-note.md` 同步记录术语纠错、反思模板和生产验收结果。

### Verified

- 本地 GREEN：`npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts` 13 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 生产 GREEN：`118.25.15.72` 上相关语音测试通过，`npm run build` 通过。
- 生产 GREEN：Playwright 实测密码登录后进入 `https://learn.roky.chat/voice`，可见“开始 60 秒反思”，点击后 Transcript 成功填入模板。

## [0.88.0] - 2026-06-02

### Added

- **[Shared Password Login]** 新增生产可用的访问密码登录链路。
  - `src/server/auth/password.ts` 新增共享密码会话签名与校验，使用 `ral_password` httpOnly cookie 表示已登录状态。
  - `src/app/login/actions.ts` 新增 `startPasswordSessionAction()`，正确密码会建立可写会话，并清掉 Preview / Demo 残留 cookie。
  - `src/app/login/ui/password-login-form.tsx` 和 `src/app/login/page.tsx` 新增“访问密码”入口；生产未配置 Supabase 时不再要求邮箱。
  - `src/server/auth/current-user.ts` 与 `src/lib/supabase/proxy.ts` 新增 `ral_password` 识别，允许密码会话直接访问受保护页面。
- **[Deploy Reality Sync]** 修正文档中的真实部署方式和登录验收标准。
  - `docs/deploy-checklist.md` 补充 `LOGIN_PASSWORD`、Docker 容器重建要求，以及密码登录验收步骤。
  - `helloagents/modules/auth-demo-mode.md` 同步更新为“访问密码优先、Demo 显式开启、Preview 只读”的当前生产策略。
  - `tests/unit/password-auth.test.ts` 新增共享密码校验测试，防止 cookie/secret 逻辑回退。

### Verified

- 本地 GREEN：`npm test -- tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/supabase-config.test.ts` 11 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 生产 GREEN：`118.25.15.72` 上相关登录单测通过，`npm run build` 通过，容器已按更新后的 env 重建。
- 生产 GREEN：`https://learn.roky.chat/login?next=/today` 只显示访问密码入口，不再显示 Demo 入口。
- 生产 GREEN：Playwright 实测输入访问密码后进入 `https://learn.roky.chat/today`，且页面无 `Preview Mode` 只读提示。

## [0.87.0] - 2026-06-02

### Added

- **[Formula Rendering]** 打通学习正文里的数学公式渲染链路。
  - `src/components/learning/learning-markdown.tsx` 新增 `remark-math` + `rehype-katex`，让 `$...$` 和 `$$...$$` 直接渲染为 KaTeX。
  - `src/app/layout.tsx` 引入 `katex/dist/katex.min.css`，`src/app/globals.css` 补充学习正文内公式的显示样式和横向滚动保护。
  - `tests/unit/learning-ui-components.test.ts` 新增 inline / block math SSR 断言，同时保持表格、代码块和 `skipHtml` 行为不回退。
- **[Daily Plan Math Prompt]** 约束 AI 生成课程正文时统一使用 markdown 公式语法。
  - `src/server/ai/generate-daily-plan.ts` 的示例和 requirements 明确要求使用 `$...$ / $$...$$`，并禁止 HTML 公式。
  - `tests/unit/daily-generation-prompt.test.ts` 新增 prompt 断言，防止后续把公式输出协议改回自由文本或 HTML。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/formula-rendering.md`，记录公式渲染范围、生成约束和验收方式。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于缺少 `class="katex"` / `class="katex-display"`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 13 项通过。

## [0.86.0] - 2026-06-02

### Added

- **[Current Mission]** 把首页 `Next Best Action` 提升为跨页面共享的“当前任务”能力。
  - 新增 `src/server/learning/current-mission.ts`，统一封装 `buildCurrentMission()`、信号摘要和用户态查询逻辑。
  - 新增 `src/components/learning/current-mission-card.tsx`，统一渲染 `Current Mission / 当前任务` 卡片和信号摘要。
  - `src/components/app-shell.tsx` 新增 `missionBanner` 槽位，支持在页面顶部挂统一任务带。
  - 首页改用 `CurrentMissionCard` 渲染“现在最值得做”。
  - `/progress` 与 `/projects` 通过 `AppShell` 顶部任务带显示当前任务。
  - `/today` 在右侧栏顶部显示当前任务，减少“我现在该做什么”只能回首页看的割裂感。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/current-mission.md`，记录优先级、接入页面和验收方式。
- **[Today Full View Collapse]** 收口 `/today` 的双模式割裂感。
  - 新增 `src/components/learning/collapsible-content-section.tsx`，支持默认折叠、点击展开和 hash 命中后自动展开。
  - `/today` 的完整课程三栏视图改为默认折叠，仅在用户点击“查看完整课程内容”时展开。
  - Focus Mode 保持为默认主体验，完整正文不再在初始 SSR 里整块展开。
- **[Knowledge Base Sync]** 新增 `helloagents/modules/today-focus-mode.md`，记录 `/today` 焦点模式与折叠完整视图行为。

### Verified

- 本地 GREEN：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/learning-ui-components.test.ts` 21 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.85.0] - 2026-06-02

### Added

- **[Login Availability Guardrail]** 收口未配置 Supabase 时的生产登录入口。
  - `src/lib/supabase/config.ts` 新增 `isSupabaseAuthConfigured()`，统一判断当前服务器是否真的启用了可用的 Supabase URL 和 public key。
  - `src/app/login/page.tsx` 在未配置 Supabase 时不再展示邮箱表单，而是明确提示“当前服务器未启用邮箱 Magic Link”，并继续保留 Demo 入口。
  - 新增 `tests/unit/supabase-config.test.ts`，覆盖占位值、缺失值和 anon key fallback。
- **[Deploy and UI Review Checklists]** 新增部署和页面验收清单。
  - 新增 `docs/deploy-checklist.md`，固化部署顺序、登录验收、Preview 验收和最短可用路径。
  - 新增 `docs/ui-review-checklist.md`，固化 `/login`、`/today`、`/review`、`/coach`、`/voice`、`/map`、`/projects` 的验收项。
  - `README.md` 和 `helloagents/modules/auth-demo-mode.md` 同步更新直接使用路径与登录边界说明。

### Verified

- 本地 GREEN：`npm test -- tests/unit/supabase-config.test.ts` 2 项通过。
- 本地 GREEN：`npm test -- tests/unit/supabase-config.test.ts tests/unit/auth-policy.test.ts` 9 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.84.0] - 2026-05-30

### Added

- **[Today Voice Coach Continuation Handoff]** 收口 `/today` 完成后到 Voice / Coach 的自然接续入口。
  - `buildTodayCompletionNextActions()` 不再在已有语音记录或 Coach 评审后隐藏入口，而是保留“继续语音复盘 / 继续 Coach 检查”，让每日学习完成后可以反复补充理解和追问。
  - `LearningCompletionCard` 新增稳定 `data-testid`，并为行动链接补充语义化 `aria-label`，方便 E2E 按真实入口验证完成态接续。
  - `tests/e2e/today-interactions.spec.ts` 新增完成态导航覆盖：从 `/today` 进入 `/voice?lessonId=...&mode=today_lesson` 和 `/coach?lessonId=...&mode=today_lesson`，确认今日课程上下文被带入 Voice/Coach。
- **[Daily Generation Timeout Fallback]** 修复生产 `/today` 首次生成遇到慢模型时可能 504 的可用性问题。
  - `generateDailyPlanTemplate()` 调 DeepSeek 时使用页面请求友好的短超时，默认 20 秒，可通过 `DEEPSEEK_DAILY_TIMEOUT_MS` 在 5-60 秒内调整。
  - DeepSeek 超时、解析失败或结构校验失败仍记录到 `AiGenerationJob.error`，并立即回退本地 template，保证 `/today` 不因 `deepseek-v4-pro` 慢响应而不可访问。
  - `tests/unit/daily-generation-prompt.test.ts` 新增超时边界测试，覆盖默认值、下限、上限和非法配置回退。
- **[Coach Review Direct Handoff E2E]** 补齐 Coach 思路评审到主动回忆的直达链路。
  - `generateCardsFromThoughtReviewAction()` 生成 Coach 卡片后直接跳转 `/review?source=thought-review`，让“输入理解 → Coach 检查 → 生成卡片 → 主动回忆”成为连续流程。
  - `tests/e2e/coach-interactions.spec.ts` 新增完整交互：提交 Coach 思路、生成复习卡、进入思路评审聚焦复习队列并看到本次卡片。
  - Coach E2E 增加专用 `ThoughtReview`/`Flashcard`/`ReviewLog`/`Misconception` 清理逻辑，避免交互测试污染 demo 数据。
- **[Voice Coach Review Handoff E2E]** 补齐 Sprint B/E 的语音理解到 Coach 再到复习队列组合链路。
  - `buildReviewableFlashcardWhere()` 对 `voice-note` 聚焦队列不再强制 `lessonId = null`，确保绑定最近课程的语音 Coach 卡也能在 `/review?source=voice-note` 出现。
  - `tests/e2e/voice-interactions.spec.ts` 新增完整交互：保存 Voice transcript、送 Coach 检查、生成语音复习卡、打开语音聚焦复习队列。
  - `tests/unit/review-filter.test.ts` 新增 `voice-note` 过滤断言，防止后续把语音卡片重新限制为无课程绑定。
- **[Voice Interaction E2E]** 补齐 Sprint E Voice transcript 保存回归。
  - 新增 `tests/e2e/voice-interactions.spec.ts`，本地 Demo 模式下覆盖 `/voice` 手动 transcript、整理版输入、保存后 `voiceNoteId` 跳转和学习流水线展示。
  - `/voice` 保存表单新增稳定 `data-testid`，Transcript 与整理版输入框补充可访问 `aria-label`，方便 Playwright 按真实控件语义定位。
  - 测试结束后清理专用 VoiceNote 及可能关联的 Note、ThoughtReview、Flashcard、ReviewLog，避免污染 demo 数据。
  - 交互测试在生产 Preview 模式下显式跳过写操作，保持只读线上验收边界。
- **[Review Interaction E2E]** 补齐 Sprint E 复习评分后的队列推进回归。
  - 新增 `tests/e2e/review-interactions.spec.ts`，本地 Demo 模式下创建专用到期卡，覆盖 `/review?source=thought-review` 显示答案、评分和卡片离开当前队列。
  - 测试数据使用唯一 marker 和独立到期卡，避免依赖现有 demo 数据是否刚好有复习卡。
  - 交互测试在生产 Preview 模式下显式跳过写操作，保持只读线上验收边界。
- **[Coach Interaction E2E]** 补齐 Sprint E Coach 思路提交交互回归。
  - 新增 `tests/e2e/coach-interactions.spec.ts`，本地 Demo 模式下覆盖 `/coach` 思路输入、提交、`reviewId` 跳转和结构化反馈展示。
  - `/coach` 表单和反馈结果区新增稳定 `data-testid`，输入框补充可访问 `aria-label`，让 Playwright 按真实控件语义完成提交链路。
  - 交互测试在生产 Preview 模式下显式跳过写操作，避免线上只读 smoke 触发数据修改。
- **[Today Interaction E2E]** 补齐 Sprint E 今日学习主流程交互回归。
  - 新增 `tests/e2e/today-interactions.spec.ts`，本地 Demo 模式下覆盖 `/today` 测验提交和代码草稿保存。
  - `/today` 测验和代码练习区域新增稳定 `data-testid`，代码输入框补充可访问 `aria-label`，方便 Playwright 按真实控件语义定位。
  - 交互测试在生产 Preview 模式下显式跳过写操作，保持只读预览边界。
- **[Visual QA Library Coverage]** 补齐 Sprint E 课程库截图回归覆盖。
  - 把 visual smoke 页面清单抽到 `tests/e2e/visual-pages.ts`，避免 Node 单测直接 import Playwright spec。
  - `tests/e2e/visual.spec.ts` 新增 `/library` 桌面和移动端截图 smoke，确保课程库也进入 UI 回归基线。
- **[Home Project Starter Next Action]** 补强首页 `Next Best Action` 的项目实践接续。
  - `buildNextBestAction()` 在今日学习、复习、误区、代码反馈、笔记和语音沉淀都清空且没有 active project 时，推荐“开始一个小项目”。
  - 首页下一步 CTA 直接进入 `/projects`，让学习闭环完成后优先落到项目实践，而不是退回知识地图浏览。
- **[Today Project Starter Handoff]** 补强 `/today` 完成后没有 active project 的项目实践接续。
  - `buildTodayCompletionNextActions()` 在复习、笔记、语音和 Coach 都完成但没有未完成项目时，新增“项目实践 / 开始一个小项目”starter 摘要。
  - `LearningCompletionCard` 复用“今日项目任务”面板展示 starter 空态，并把 CTA 文案切换为“选择项目”。
  - 完成后行动列表现在先推荐“开始项目实践”，再保留“查看学习进度”，避免学习闭环在课程沉淀后停在数据页。
- **[Today Project Practice Handoff]** 强化 `/today` 完成后的项目实践接续。
  - `buildTodayCompletionNextActions()` 新增 `projectPractice` 摘要，把 active project 的进度、当前里程碑和任务说明作为完成后独立聚焦区输出。
  - `LearningCompletionCard` 在行动列表前新增“今日项目任务”面板，显示项目标题、当前里程碑、任务说明、进度条和“继续项目”入口。
  - `/today` 传入 active project 的里程碑任务和进度百分比，让今日学习完成后直接接到项目实践，而不是只出现普通项目链接。
- **[Lint Gate Stability]** 补齐 ESLint 对生成目录的忽略规则，避免 `test-results/`、`playwright-report/` 或 `coverage/` 不存在时让 `npm run lint` 抛 `ENOENT`。
- **[Preview Redirect Stability]** 修复 `/preview` 在容器反代环境中跳转到 `localhost:3102` 的问题。
  - 新增 `previewRedirectLocation()`，只允许站内相对路径作为 Preview 跳转目标，并拒绝外部 URL。
  - `/preview` 改用相对 `Location` 响应，避免依赖 `request.nextUrl` 的内网 origin。

### Verified

- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 7 项通过，覆盖完成态继续 Voice/Coach 与语义化入口。
- 本地 GREEN：`npm run e2e -- tests/e2e/today-interactions.spec.ts` 2 项通过，完成 `/today` quiz/code 交互和完成态 Voice/Coach 接续导航。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/voice-note.test.ts tests/unit/coach-context.test.ts` 12 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run build` 通过。
- 生产 WARN：部署 `43cb2f0` 后线上 smoke 发现 `/today` 返回 `504 Gateway Time-out`，定位为首次访问触发 DeepSeek Pro 生成可能超过 nginx/页面等待窗口。
- 本地 GREEN：`npm test -- tests/unit/daily-generation-prompt.test.ts` 2 项通过，覆盖每日生成 AI 超时边界。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 生产 GREEN：`265c2c6` 已部署到 `learn.roky.chat`，容器内 `npm run build` 通过，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`/preview?next=/today` 登录后页面包含“今日学习 / 完成后下一步 / 专注学习模式”，且不再出现 `504 Gateway`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat E2E_PREVIEW_TOKEN=*** npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm run e2e -- tests/e2e/coach-interactions.spec.ts` 失败于点击“生成卡片”后仍回到 `/coach?reviewId=...`，没有进入 `/review?source=thought-review`。
- 本地 GREEN：`npm run e2e -- tests/e2e/coach-interactions.spec.ts` 2 项通过，完成 Coach 思路 → 生成卡片 → `/review?source=thought-review`。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/review-filter.test.ts` 17 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 217 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 生产 GREEN：`e0ad2a2` 已部署到 `learn.roky.chat`，容器内 `npm run build` 通过，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat E2E_PREVIEW_TOKEN=*** npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm run e2e -- tests/e2e/voice-interactions.spec.ts` 失败于断言使用了页面不存在的“语音卡片”文本，而实际聚焦复习页显示“语音笔记复习”。
- 本地 GREEN：`npm test -- tests/unit/review-filter.test.ts` 7 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/voice-interactions.spec.ts` 2 项通过，完成 Voice transcript → Coach → 生成卡片 → `/review?source=voice-note`。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 217 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 生产 GREEN：`e9fbff1` 已部署到 `learn.roky.chat`，容器内 `npm run build` 通过，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat E2E_PREVIEW_TOKEN=*** npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 GREEN：`npm run e2e -- tests/e2e/voice-interactions.spec.ts` 1 项通过，完成 Voice transcript 保存和流水线展示。
- 生产 GREEN：`b92b789` 已部署到 `learn.roky.chat`，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm run e2e -- tests/e2e/review-interactions.spec.ts` 失败于测试进程直接动态导入项目 TS 模块准备数据。
- 本地 GREEN：`npm run e2e -- tests/e2e/review-interactions.spec.ts` 1 项通过，完成显示答案、评分和复习队列推进。
- 生产 GREEN：`5bce6f2` 已部署到 `learn.roky.chat`，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm run e2e -- tests/e2e/coach-interactions.spec.ts` 失败于 `/coach` 缺少稳定 `coach-thought-form` 测试区域。
- 本地 GREEN：`npm run e2e -- tests/e2e/coach-interactions.spec.ts` 1 项通过，完成 Coach 思路提交和结构化反馈展示。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts` 10 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 216 项通过。
- 生产 GREEN：`5d1407c` 已部署到 `learn.roky.chat`，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm run e2e -- tests/e2e/today-interactions.spec.ts` 失败于 `/today` 缺少稳定 `today-quiz` 测试区域。
- 本地 GREEN：`npm run e2e -- tests/e2e/today-interactions.spec.ts` 1 项通过，完成 quiz 提交和 code submission 保存。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/quiz-submit.test.ts tests/unit/code-submit.test.ts` 12 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 216 项通过。
- 生产 GREEN：`992f78e` 已部署到 `learn.roky.chat`，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于 visual smoke 页面清单缺少 `library`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 9 项通过。
- 本地 GREEN：`npm run e2e:visual` 16 项通过，覆盖 homepage/today/review/library/coach/voice/map/projects 的桌面和移动端截图 smoke。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 RED：`npm test -- tests/unit/next-best-action.test.ts` 失败于无 active project 时首页下一步仍返回 `/map`。
- 本地 GREEN：`npm test -- tests/unit/next-best-action.test.ts` 8 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 215 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 生产 GREEN：`97cbb3e` 已部署到 `learn.roky.chat`，`/api/health` 返回 `ok: true`。
- 生产 GREEN：`E2E_BASE_URL=https://learn.roky.chat npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过，且已清理 `test-results/`。
- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 失败于无 active project 时缺少“项目实践 / 开始一个小项目”。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 22 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 214 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 失败于缺少 `projectPractice` 和“今日项目任务”聚焦区。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 5 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 20 项通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 211 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：删除 `test-results/` 后 `npm run lint` 通过。
- 本地 RED：`npm test -- tests/unit/auth-policy.test.ts` 失败于缺少 `previewRedirectLocation()`。
- 本地 GREEN：`npm test -- tests/unit/auth-policy.test.ts` 7 项通过。
- 本地 GREEN：`npm test -- tests/unit/auth-policy.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts` 27 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 212 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。

## [0.83.0] - 2026-05-30

### Added

- **[Voice Note Handoff]** 强化 `/voice` 整理成笔记后的接续。
  - `VoiceLearningPipeline` 的“查看笔记”入口改为 `/notes?noteId=...`，直接指向由当前 Voice Note 生成的笔记。
  - `/notes` 新增 `NotesListPanel`，支持根据 `noteId` 高亮当前笔记，并标注“来自 Voice 的当前笔记”。
  - `/notes` 列表项现在可点击回到自身 deep link，便于从 Voice、后续项目实践或外部入口定位具体笔记。

### Verified

- 本地 RED：`npm test -- tests/unit/learning-ui-components.test.ts` 失败于 Voice Pipeline 缺少 `/notes?noteId=...` 和“查看这条笔记”。
- 本地 RED：`npm test -- tests/unit/notes-page-ui.test.ts` 失败于缺少 `NotesListPanel`。
- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/notes-page-ui.test.ts` 1 项通过。

## [0.82.0] - 2026-05-30

### Added

- **[Coach Review Handoff]** 强化 `/coach` 生成卡片后的复习接续。
  - `CoachFlashcardPanel` 在已生成 Coach 卡片后显示“Coach 卡片已进入复习队列”完成态提示。
  - 新增“复习这 N 张 Coach 卡片”入口，直接进入 `/review?source=thought-review` 聚焦队列。
  - `buildReviewableFlashcardWhere()` 对 `thought-review` 队列不再强制 `lessonId = null`，确保绑定课程的 Coach 卡片也能被聚焦复习。

### Verified

- 本地 RED：`npm test -- tests/unit/coach-workspace.test.ts` 失败于缺少 Coach 卡片复习队列入口。
- 本地 RED：`npm test -- tests/unit/review-filter.test.ts` 失败于 `thought-review` 队列仍强制 `lessonId = null`。
- 本地 GREEN：`npm test -- tests/unit/coach-workspace.test.ts` 6 项通过。
- 本地 GREEN：`npm test -- tests/unit/review-filter.test.ts` 6 项通过。

## [0.81.0] - 2026-05-30

### Added

- **[Review Completion Action Plan]** 强化 `/review` 复习完成后的下一步反馈。
  - `buildReviewSessionSummary()` 新增 `actionPlan`，按补弱、稳定、混合三种复习结果给出 3 步后续行动。
  - `ReviewTrainer` 完成态新增“复习后行动计划”，把“先复述忘记的卡片 / 交给 Coach 找缺口 / 回到今日学习补上下文”等建议直接显示在总结卡片里。
  - 保持原有 Space 显示答案、1-4 评分、留存率和 CTA 行为不变，只增强复习结束后的行动引导。

### Verified

- 本地 RED：`npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 失败于缺少 `actionPlan` 和“复习后行动计划”UI。
- 本地 GREEN：`npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 10 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 207 项通过。

## [0.80.0] - 2026-05-30

### Added

- **[Voice Transcript Autofocus]** 打磨 `/voice` 的“自动转写 → 检查 Transcript → 保存”接续。
  - 新增 `resolveVoiceTranscriptAutofill()`，统一处理转写文本回填、手写 transcript 保护、空转写 fallback 和聚焦提示。
  - `VoiceWorkspaceForm` 在转写成功后自动聚焦 Transcript，并显示“转写已填入，请检查 Transcript 后保存”等检查提示。
  - `/voice` 默认提示补充“转写后会自动聚焦到这里”，让用户知道下一步要检查术语、变量名和漏掉的关键句。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-note.test.ts` 失败于缺少 `@/app/voice/ui/voice-transcript-autofill`。
- 本地 GREEN：`npm test -- tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-note.test.ts` 7 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 207 项通过。

## [0.79.0] - 2026-05-30

### Added

- **[Voice Capture Status Panel]** 强化 `/voice` 的“说出理解”录音体验。
  - 新增 `buildVoiceCaptureStatusPanel()` 和 `formatVoiceRecordingSeconds()`，把录音、转写、文件选择和手动 fallback 状态转成稳定 UI 文案。
  - `VoiceCapture` 顶部新增录音状态面板，显示“准备说出理解 / 正在录音 / 转写已填入 Transcript”等提示和固定 `mm:ss` 计时器。
  - Playwright smoke 增加 `/voice` 的“准备说出理解”和“把脑子里的想法说出来”断言，避免页面退回技术上传表单。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts` 失败于缺少 `@/app/voice/ui/voice-capture-status`。
- 本地 GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts` 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/learning-ui-components.test.ts` 16 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm test` 204 项通过。

## [0.78.0] - 2026-05-30

### Added

- **[Voice Pipeline Next Action]** 强化 `/voice` 保存后的接续体验。
  - 新增 `buildVoicePipelineNextAction()`，按 Voice Note 是否已保存、是否完成 Coach、是否生成卡片、是否整理笔记，计算当前最优动作。
  - `VoiceLearningPipeline` 新增“当前最优动作”聚焦面板，在流水线步骤和 CTA 之间明确提示下一步该做 Coach、生成卡片、补笔记或进入复习。
  - 已生成语音卡片时，聚焦面板直接指向 `/review?source=voice-note`，让语音卡片进入主动回忆队列。

### Verified

- 本地 RED：`npm test -- tests/unit/voice-pipeline-next-action.test.ts tests/unit/learning-ui-components.test.ts` 失败于缺少 `@/server/voice/pipeline-next-action` 和 UI “当前最优动作”文案。
- 本地 GREEN：`npm test -- tests/unit/voice-pipeline-next-action.test.ts tests/unit/learning-ui-components.test.ts` 12 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm test` 200 项通过。

## [0.77.0] - 2026-05-29

### Added

- **[Today Voice/Coach Context Handoff]** 强化 `/today` 完成后的 Voice 与 Coach 接续。
  - “说出今天的理解”链接改为 `/voice?lessonId=...&mode=today_lesson`，让 Voice Note 默认使用今日课程模式和课程关联。
  - “让 Coach 检查”链接改为 `/coach?lessonId=...&mode=today_lesson`，让 Coach 默认绑定今日课程上下文。
  - `/voice` 读取 `mode` 与 `lessonId` query，表单默认选中今日课程并提交隐藏 lessonId。
  - `/coach` 读取 `mode` 与 `lessonId` query，Context Compass 与提交表单使用同一课程上下文。
  - `VoiceWorkspaceForm` 改为由页面传入 server action，避免客户端组件测试加载服务端 env。

### Verified

- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts` 失败于 Voice/Coach 链接缺少上下文、Coach 默认模式不可控、Voice 表单测试加载 server env。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts` 13 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。

## [0.76.0] - 2026-05-29

### Added

- **[Today Completion Next Actions]** 将 `/today` 完成后的三个普通按钮升级为“完成后下一步”接续面板。
  - 新增 `buildTodayCompletionNextActions()`，按今日状态、到期卡片、笔记、Voice Note、Coach 评审、代码提交和进行中项目生成后续行动。
  - 新增 `LearningCompletionCard`，统一展示完成状态、摘要和可点击行动项。
  - `/today` 专注模式和完整视图都接入同一完成后面板；未完成时引导回到反思，完成后推荐复习、写笔记、语音复述、Coach 检查和项目实践。
  - Playwright smoke 增加 `/today` 的“完成后下一步”断言，避免页面退回普通完成按钮集合。

### Verified

- 本地 RED：`npm test -- tests/unit/today-completion-next-actions.test.ts` 失败于缺少 `LearningCompletionCard` 模块。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 4 项通过。
- 本地 GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 12 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 信息性检查：`npx tsc --noEmit` 暴露测试目录既有严格类型问题，和本次新增模块无关；项目生产构建 TypeScript 已通过。

## [0.75.0] - 2026-05-29

### Added

- **[Home Learning Mission Cards]** 将首页“今日三件事”从普通列表升级为每日任务卡。
  - 新增 `LearningMissionCard`，统一展示任务标题、说明、状态徽标和下一步 CTA。
  - 首页“完成今日学习 / 清空到期复习 / 写下自己的理解”改用任务卡，状态分别绑定今日完成、到期卡片和今日笔记数量。
  - 任务卡沿用学习语义色：完成为 emerald，待办/到期为 amber，笔记沉淀为 indigo。
  - 首页补齐 Preview Mode 只读提示，避免从首页进入生产 Preview 时看不到保存/提交被拒绝的边界。

### Verified

- 本地 GREEN：`npm test -- tests/unit/learning-ui-components.test.ts` 8 项通过。
- 本地 GREEN：`npm test -- tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 14 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.74.0] - 2026-05-29

### Added

- **[Library Lesson Next Actions]** 将 `/library` 课程详情从历史查看页升级为可行动的课程档案。
  - 新增 `buildLibraryLessonNextActions()`，把课程完成状态、到期卡片、笔记、Coach 评审、代码提交和卡片数量转成最多 3 个下一步行动。
  - 课程未完成时优先回到 `/today`，避免在课程库里只看档案不完成闭环。
  - 课程完成后优先推荐 `/review`、`/notes?lessonId=...`、`/coach`、`/today` 或 `/progress`，让复习、沉淀、思路检查和代码记录直接接续。
  - `/library` 课程详情顶部新增“课程下一步”面板，显示摘要、行动按钮和每个行动的简短说明。
  - Playwright smoke 增加 `/library` 的“课程下一步”断言，避免课程档案入口退回纯详情展示。

### Verified

- 本地 RED：`npm test -- tests/unit/library-next-actions.test.ts` 失败于缺少 `@/server/library/next-actions`。
- 本地 GREEN：`npm test -- tests/unit/library-next-actions.test.ts` 3 项通过。
- 本地 GREEN：`npm test` 190 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。

## [0.73.0] - 2026-05-29

### Added

- **[Notes Learning Reflection Template]** 将 `/notes` 从空白 Markdown 输入升级为课程沉淀模板。
  - 新增 `buildLessonNoteTemplate()`，根据关联课程、本地日期、课程状态、目标、术语、测验数和代码提交数生成可编辑 Markdown。
  - `/notes` 新建笔记默认预填“我能用自己的话解释 / 目标 / 核心术语 / 模糊点 / 代码与测验反馈 / 明日复习”结构。
  - 关联课程区显示计划、测验、代码提交和已有笔记状态，并提供回到今日学习和课程档案的入口。
  - Playwright smoke 增加 `/notes` 模板预填断言，避免学习沉淀入口退回空白输入框。

### Verified

- 本地 RED：`npm test -- tests/unit/notes-template.test.ts` 失败于缺少 `@/server/notes/template`。
- 本地 GREEN：`npm test -- tests/unit/notes-template.test.ts` 2 项通过。
- 本地 GREEN：`npm run e2e -- tests/e2e/smoke.spec.ts` 2 项通过。
- 本地 GREEN：`npm test` 187 项通过。
- 本地 GREEN：`npm run lint` 通过。
- 本地 GREEN：`npm run build` 通过。
- 本地 GREEN：`npm run e2e` 16 项通过。

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
