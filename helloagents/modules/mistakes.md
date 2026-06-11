# Mistakes

## 状态

已上线 `/mistakes` 页面，并完成生产入口验收。本轮 `0.357.0 Reduce Chaos Mistakes Focus Repair` 在本地补齐 Current Mission 聚焦错题修复和移动端 sticky 主操作，待完成生产部署。

## 目标

把分散在 Quiz、Code Feedback、Coach 里的误区记录收口成单独页面，让用户能回答这几个问题：

- 我最近最容易错在哪类问题？
- 这些误区来自小测验、代码还是 Coach？
- 哪些问题还没解决，应该先交给 Coach 解释？
- 它关联到哪节课、哪类卡片？

## 当前行为

- `/mistakes` 默认先展示未解决误区。
- Current Mission / Next Best Action 如果推荐未解决误区，有具体误区 id 时进入 `/mistakes?focus=<id>`，缺少 id 时回退 `/mistakes`，不再直接跳 `/coach`。
- `/mistakes?focus=<id>` 会在清单前展示 `当前先修这一条`，优先呈现当前最该修的误区。
- 页头 badge 显示中文 `错题修复`，不显示英文 `Mistakes`。
- 支持按状态筛选：`未解决 / 已解决 / 全部`。
- 支持按来源筛选：`小测验 / 代码反馈 / Coach / 项目实践`。
- 支持按类型筛选：`全部类型 / 概念 / 代码 / 算法 / 术语 / 事实`。
- 状态、来源、类型筛选 chips 在手机端复用 `mistakeFilterCtaClassName = "min-h-11 w-full sm:w-auto"`，并由 `mistakeFilterRowClassName = "grid gap-2 sm:flex sm:flex-wrap"` 保持手机端单列、桌面端横向 wrap。
- 支持关键词搜索 `summary / prompt / explanation`。
- 关键词搜索输入框复用 `mistakeSearchInputClassName = "min-h-11"`，让 `搜索 RAG / 二分 / SWE-bench / 术语混淆` 在手机端满足 44px 触控高度。
- 每条误区会显示：
  - 来源
  - 类型（概念误区 / 代码错误 / 算法边界错误 / 术语混淆 / 事实性错误）
  - 出现次数
  - 关联课程与主题
  - 关联卡片数
- 每条误区和聚焦误区都会显示 `修复流程`，用五步读侧状态机表达 `发现误区 / 让 Coach 解释 / 生成复习卡 / 完成一次复习 / 标记已解决`。
- `buildMistakeRepairWorkflow()` 根据 `Misconception.status`、`mistake-card:{id}` 卡片数和 `reviewCount` 推导 `已完成 / 当前 / 待办`，不新增数据库字段或迁移。
- “让 Coach 解释”会把这条误区的上下文预填到 `/coach` 输入框。
- “做一道同类题”会把误区带到 `/today?mode=remediation&source=mistake...`，显示 `Mistake 同类题短练习` 和 `生成同类题短练习`，让错题修复不只停留在解释和制卡。
- “生成复习卡”会把误区转成稳定 `mistake-card:{id}` 复习卡，并刷新 `/review`。
- “标记已解决”会把开放误区更新为 `resolved`，并刷新 `/mistakes`、`/progress`、`/map`、`/path` 和 `/weekly`。
- 页面级 `打开 Coach`、修复策略卡 `去复习`、筛选表单 `搜索错题` CTA 在手机端复用 `mistakePageCtaClassName = "min-h-11 w-full sm:w-auto"`，桌面端保持自适应宽度。
- 聚焦误区的 `让 Coach 解释`、`做一道同类题`、`生成复习卡`、`标记已解决` 位于 `aria-label="错题修复移动操作"` 的 sticky 操作区；手机端固定在底部导航上方，使用 `sticky bottom-16 z-20`、`bg-background/95` 和 `backdrop-blur`，桌面端恢复 `sm:static` / `sm:border-0`。
- 每条误区的 `让 Coach 解释`、`做一道同类题`、`生成复习卡`、`标记已解决`、`回到课程` 修复动作在手机端使用单列 `grid gap-2`，CTA 复用 `mistakeRepairActionCtaClassName = "min-h-11 w-full sm:w-auto"`，桌面端保持 `sm:flex sm:flex-wrap`。
- 误区解决完成态复用 `LearningCelebrationCue` 时，成就徽章显示中文 `掌握证据`，不显示英文 `Mastery signal`。

## 代码位置

- 页面：`src/app/mistakes/page.tsx`
- 视图逻辑：`src/server/mistakes/view.ts`
- 写入动作：`src/app/mistakes/actions.ts`
- Coach 预填接线：`src/app/coach/page.tsx`
- 导航入口：`src/lib/routes.ts`

## 设计说明

- 误区类型目前基于 `source + summary/prompt/explanation` 做启发式分类，优先用于 UI 导航，而不是强 schema 字段。
- 当前没有额外迁移；直接复用既有 `Misconception`、`Lesson`、`Topic`、`Flashcard` 数据。
- 新增写动作必须先调用 `assertWritableRequest()`，保持 Preview Mode 只读。
- 如果当前用户没有误区记录，页面显示空状态，但仍保留回到学习和打开 Coach 的入口。

## 验收

- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts`
- Reduce Chaos Mistakes Repair Workflow Progress：`npm test -- tests/unit/mistakes-view.test.ts` RED 失败于缺少 `buildMistakeRepairWorkflow()` 和页面 `修复流程` 接线，GREEN 后 14 项通过。
- Reduce Chaos Mistakes Repair Workflow Progress 相关回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 69 项通过。
- Reduce Chaos Mistake Similar Practice Action：`npm test -- tests/unit/mistakes-view.test.ts` RED 失败于缺少 `buildMistakeSimilarPracticeHref()`、`做一道同类题` 和页面接线，GREEN 后 15 项通过。
- Reduce Chaos Mistake Similar Practice Action 相关回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts` 72 项通过。
- Reduce Chaos Mistakes Focus Repair RED/GREEN：`npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/mistakes-view.test.ts` 34 项通过，覆盖 `/mistakes?focus=<id>`、Learning Session 误区修复 href、`当前先修这一条` 和 `错题修复移动操作` sticky 操作区。
- Phase E Mistakes Header Badge Localization：`npm test -- tests/unit/mistakes-view.test.ts` RED/GREEN 后 11 项通过，覆盖 `badge="错题修复"`，并防止 `badge="Mistakes"` 回退。
- Phase E Mistakes Header Badge Localization 回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 51 项通过。
- Phase E Mistakes Header Badge Localization 覆盖扫描：`rg -n 'Mistakes Header Badge|badge="错题修复"|badge="Mistakes"|0\\.248\\.0|错题修复页头|Mistakes Header Badge Localization' ...` 确认 Mistakes 源码和测试接入页头 badge 中文化要求，且生产页面没有 `badge="Mistakes"`。
- Phase E Mistakes Header Badge Localization 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 360 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Phase E Mistakes Search Input Mobile Touch Targets：`npm test -- tests/unit/mistakes-view.test.ts` RED/GREEN 后 10 项通过，覆盖 `mistakeSearchInputClassName` 和筛选区关键词搜索输入框 44px 触控高度。
- Phase E Mistakes Search Input Mobile Touch Targets 回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 50 项通过。
- Phase E Mistakes Search Input Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Mistakes Search Input|mistakeSearchInputClassName|min-h-11|搜索 RAG / 二分 / SWE-bench / 术语混淆|搜索错题" ...` 确认 Mistakes 源码和测试接入搜索输入触控要求。
- Phase E Mistakes Search Input Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 346 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- Phase E Mistakes Filter Chip Mobile Touch Targets：`npm test -- tests/unit/mistakes-view.test.ts` RED/GREEN 后 12 项通过，覆盖 `状态`、`来源`、`类型` 三组筛选 chips 接入 `mistakeFilterCtaClassName` 和 `mistakeFilterRowClassName`。
- Phase E Mistakes Filter Chip Mobile Touch Targets 回归：`npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts` 52 项通过。
- Phase E Mistakes Filter Chip Mobile Touch Targets 覆盖扫描：`rg -n "mistakeFilterCtaClassName|mistakeFilterRowClassName|statusOptions\\.map|sourceOptions\\.map|kindOptions\\.map|Phase E Mistakes Filter Chip|筛选 chips|flex flex-wrap gap-2" ...` 确认 Mistakes 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入筛选 chips 触控要求；窄扫 `src/app/mistakes/page.tsx` 未发现旧筛选区横向 chips 行。
- Phase E Mistakes Filter Chip Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 388 项通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- `npm run lint`
- `git diff --check`
- `npm run build`
- 本地 demo smoke：`/mistakes?kind=term&source=project&status=all` 应返回 HTTP 200，并显示 `类型`、`项目实践`、`全部类型`、`术语`。
- 生产密码登录后访问 `https://learn.roky.chat/mistakes`
- 页面能看到：
  - `错题误区`
  - `筛选视图`
  - `误区清单`

## 生产验证

- 真实承载机：`118.25.15.72`
- 公网：密码登录后 `/mistakes` 页面可访问，筛选区可见。
- 当前生产账号下没有现成误区样本，因此“让 Coach 解释”的真实点击链路主要由单测保证。
