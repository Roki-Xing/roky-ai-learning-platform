# Current Mission

## 状态

已接入首页、`/progress`、`/projects`、`/today`、`/weekly`、`/path` 和 `/books`。

## 目标

把首页原本的 `Next Best Action` 提升成跨页面共享的“当前任务”能力，让用户在任意主流程页面都能知道：

- 现在最该做什么
- 为什么先做这件事
- 点哪里继续
- 完成后去哪里

## 任务优先级

`buildCurrentMission()` 当前沿用原有 `buildNextBestAction()` 的优先级：

1. 今日学习未完成 → `/today`
2. 有到期卡片 → `/review`
3. 有未解决误区 → `/mistakes?focus=<id>`，缺少 id 时回退 `/mistakes`
4. 有待处理代码反馈 → `/projects` 或 `/review`
5. 今日没有笔记 → `/notes`
6. 今日没有语音复盘 → `/voice`
7. 有 active project → `/projects`
8. 有 active book session → `/books/:id`
9. 其他情况 → `/radar` 轻量广度探索

## 代码位置

- 服务：`src/server/learning/current-mission.ts`
- 组件：`src/components/learning/current-mission-card.tsx`
- 容器接线：`src/components/app-shell.tsx`

## 页面接入

- 首页：替换原“现在最值得做”块，直接显示 `当前任务`
- 首页 Current Mission 卡片现在显示轻量元信息：`推荐/重要/轻量`、预计分钟数和陪练/Coach/项目等 companion 标签。
- 首页 Current Mission 卡片接入 `buildCurrentMissionProgress()`，显示 `今日闭环 X/5`、可访问进度条和 `学习 / 复习 / 表达 / 修复 / 实践` 五步状态。
- `CurrentMissionProgress` 保留 `completed/total` 兼容字段，并新增 `steps`；每一步包含中文 label、`done/current/todo` 状态和短文案，例如 `已完成`、`3 张到期`、`待表达`、`已清空`、`进行中`。
- 五步状态只读派生自现有 DailyPlan、到期卡片、笔记/语音、误区/代码反馈、项目/同读任务；不新增数据库表、migration 或真实完成写入。
- 首页 Current Mission 卡片新增 `afterComplete` 轻量链接，说明完成当前动作后应该去哪里，例如 `完成后去复习`、`完成后去语音反思`、`读完后生成笔记/卡片`。
- 首页 Current Mission 卡片新增 `companionCopy` 短伴随提示，首页固定传入 `今天不用做很多事，先完成当前任务就够了。`，用于降低打开首页后的选择压力；不新增入口、不改变 Current Mission 排序或数据合约。
- 首页首屏现在是 `首页主任务` 区，只保留 `CurrentMissionCard`，避免与 `学习会话`、`学习状态`、`补弱焦点`、`今日能量`、`今日三件事`、`常用入口` 等模块竞争。
- 首页 Current Mission 下方新增 `LearningSessionStrip`，把当前推荐动作、完成后的下一动作和本周会话进度展示为 `当前会话`、`下一会话`、`本周会话`。
- `buildLearningSessions()` 输出指导文件第 15 节的统一字段：`type`、`title`、`goal`、`status`、`startedAt`、`completedAt`、`outputs`、`nextRecommendedSession`，并补充 UI 所需的 `href` 与 `ctaLabel`。
- Learning Session 当前是读侧派生，不新增数据库表、migration 或真实开始/完成时间；`startedAt`、`completedAt` 暂为 `null`。
- 首页次级动作默认折叠到 `今天还可以`，保留写笔记、说出理解、推进项目和查看当前路径入口；这些入口仍使用 `min-h-11 w-full sm:w-auto` 触控目标。
- 首页 `LearningSessionStrip` 下方显示 `LearningMomentumStrip`，将 XP、Daily Quest、streak 和周目标转换为：
  - 当前阶段称号
  - 下一步解锁阶段与进度
  - 本周目标
  - 今日闭环
  - 连续学习
  - 一句下一步鼓励语
- 首页今日学习状态和补弱焦点 meta 通过 `src/app/_lib/home-labels.ts` 做展示层本地化：
  - DailyPlan status 显示 `已完成`、`待完成`、`未生成`，不直出 `planned` / `completed`。
  - 代码反馈 overall 显示 `部分正确`、`需要重写`、`需要更多信息` 等中文业务标签。
  - 误区来源显示 `小测验`、`代码反馈`、`Coach`、`项目实践`，不直出 raw `quiz` / `code` / `project`。
- `/progress`：通过 `AppShell` 顶部任务带显示
- `/projects`：通过 `AppShell` 顶部任务带显示
- `/today`：在右侧栏顶部显示，和“今日复习入口 / 今日概览”并列
- `/weekly`：在周复盘顶部显示，标题为 `当前任务`
- `/path`：在学习路径顶部显示，标题为 `当前任务`
- `/books`：在书架和阅读详情页顶部显示，活跃阅读任务可回到当前任务。
- CTA 按钮在移动端使用 `min-h-11 w-full`，桌面端使用 `sm:w-auto`，确保首页和各主流程页的当前任务入口满足 44px 触控目标。
- 共享组件默认标题使用中文 `当前任务`，不再把 `Current Mission / 当前任务` 作为学习者可见标题；`/today`、`/weekly`、`/path` 的显式 title 接线同样使用 `当前任务`。
- 未解决误区无具体 focus summary 时，原因文案显示 `N 个未解决误区`，不再把内部英文 `open misconception` 暴露给学习者；有 focus summary 时继续显示具体误区并保留中文数量说明。

## 兜底探索

- 当今日学习、复习、误区、代码反馈、笔记、语音复盘和项目任务都没有更高优先级动作时，`buildNextBestAction()` 推荐 `今天轻量探索：认识 SWE-bench`。
- 当今日学习、复习、误区、代码反馈、笔记、语音复盘和项目任务都完成，且存在 active book session 时，`buildNextBestAction()` 推荐 `今天继续读《AI Engineering》第 12-14 页`，指向 `/books/ai-engineering`。
- 当没有 active book session 时，`buildNextBestAction()` 推荐 `今天轻量探索：认识 SWE-bench`。
- 该兜底指向 `/radar?entity=swe-bench`，把轻量探索固定到 SWE-bench，连接 Agent、真实工程任务和后续项目练习。

## 习惯目标

- `src/server/learning/habit-goal.ts` 负责把现有 completed localDate、streak 和今日任务状态转换为读侧习惯目标。
- 首页和 `/progress` 均显示 `LearningHabitGoalCard`。
- 卡片展示：
  - `周目标`：默认自然周 5 天目标，按周一到今天统计完成天数。
  - `连续学习保护`：今天已有有效学习记录时标记已保护，否则提示用轻量动作守住 streak。
  - `轻量学习模式`：默认引导到 `/voice?mode=daily_understanding`，用 60 秒语音或一句笔记保住节奏。
- 该能力不新增表、不写入数据库，只从现有 DailyPlan、Daily Quest 和 streak 信号计算。

## 学习动机卡

- 首页和 `/progress` 共用 `BadgeShelf` 展示徽章进度。
- 徽章架顶部解锁计数使用中文业务文案 `已解锁 N 个`，不显示英文 `N earned`。
- 语音徽章标题使用 `首次语音笔记`，不显示 `首次 Voice Note`。
- 该展示规则只影响读侧 UI，不改变 `buildLearningBadges()` 的徽章计算口径。
- 首页和 `/progress` 共用 `XpLevelCard` 展示 XP 等级。
- XP 等级卡使用中文等级展示文案，例如 `第 3 级 算法思考者` 和 `距离 LLM 实践者还差 ... XP`；英文等级名仅作为内部映射键保留，不直接展示给学习者。
- 该展示规则只影响读侧 UI，不改变 `getLearningLevel()` 的等级阈值或返回契约。

## 信号摘要

`buildCurrentMissionSignals()` 当前会优先展示：

- 到期卡片
- 误区数量
- 代码反馈数量
- active project 标题
- active book session 标题和进度

如果当前没有这些高优先信号，但今天已有 lesson，则回退显示：

- 今日笔记数
- 语音复盘数

## 验收

- `npm test -- tests/unit/home-page-labels.test.ts`
- `npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/learning-ui-components.test.ts`
- Phase E Current Mission Heading Localization：`npm test -- tests/unit/current-mission.test.ts` RED/GREEN 后 4 项通过，覆盖默认标题 `当前任务`，并防止 `Current Mission` 回退到学习者可见 badge。
- Phase E Current Mission Heading Localization related regression：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/today-activity-labels.test.ts` 51 项通过。
- Phase E Current Mission Misconception Fallback Localization：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts` RED/GREEN 后 13 项通过；覆盖无 focus 未解决误区兜底显示 `N 个未解决误区`，并防止 `open misconception` 回退到学习者可见 reason。
- Phase E Current Mission Misconception Fallback Localization related regression：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts tests/unit/today-code-exercise.test.ts tests/unit/coach-workspace.test.ts` 41 项通过。
- Sprint Learning Desire Homepage Momentum Strip：`npm test -- tests/unit/learning-motivation.test.ts` RED 首次失败于缺少 `@/server/learning/momentum`，GREEN 后 12 项通过；相关回归 `npm test -- tests/unit/learning-motivation.test.ts tests/unit/current-mission.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts` 46 项通过。
- 0.364.0 Reduce Chaos Current Mission Companion Copy：`npm test -- tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts` RED 首次失败于 `CurrentMissionCard` 和首页首屏缺少 `今天不用做很多事，先完成当前任务就够了。`；GREEN 后 20 项通过。相关回归 `npm test -- tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/next-best-action.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过。
- Reduce Chaos Homepage Command Center：`npm test -- tests/unit/home-page-labels.test.ts` RED 首次失败于首页仍存在 `今日能量`、`今日三件事`、`常用入口` 和旧 `QUICK_ACTIONS`；GREEN 后 4 项通过，覆盖首页首屏只保留 Current Mission/进度，次级动作折叠到 `今天还可以`。
- Reduce Chaos Book Companion MVP：`npm test -- tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/auth-policy.test.ts` 覆盖 Books seed、`/books` 和 `/books/[id]` 页面契约、Current Mission active reading、导航和鉴权保护。
- Reduce Chaos Learning Sessions：`npm test -- tests/unit/learning-ui-components.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts` 43 项通过，覆盖 10 种 session 类型、统一字段、首页接线、组件渲染、移动端 CTA 和说明型文案防回退。
- Reduce Chaos Current Mission Handoff：`npm test -- tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts` RED 首次失败于 `afterComplete` 缺失、任务卡未渲染完成后路径、首页主任务区仍混入 `LearningSessionStrip` 和 `LearningMomentumStrip`；GREEN 后 20 项通过。
- Reduce Chaos Current Mission Handoff related regression：`npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 56 项通过。
- `npm run lint`
- `npm run build`

## 说明

- 当前实现先复用既有 `Next Best Action` 判定逻辑，避免首页和其他页面出现不同步的优先级。
- 之后如果要继续按《学习平台开发.md》推进，可直接在 `current-mission.ts` 中扩展统一优先级，而不是回到各页面分别写判断。
