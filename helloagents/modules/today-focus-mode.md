# Today Focus Mode

## 状态

已上线专注模式 + 完整视图折叠区。

## 当前行为

- `/today` 首屏默认展示 `LearningFocusPlayer`
- `LearningFocusPanel` 徽章显示 `专注模式`，进度可访问名称显示 `专注模式进度`，不显示 `Focus Mode` / `Focus Mode 进度`
- 每个 FocusPlayer 阶段可显示“你现在要做什么 / 为什么做这个 / 完成标准”
- 每个 FocusPlayer 阶段顶部步骤标签显示 `第 n 步`，不显示英文 `Step n`
- quiz 阶段状态由 `src/server/learning/today-stage-status.ts` 统一判断：无题=完成、未提交=待办、部分提交=进行中、全部提交=完成
- 术语/Radar 阶段状态由同一服务统一判断：无今日连接=完成、未匹配知识卡=待办、部分匹配=进行中、全部匹配=完成
- 手机端 FocusPlayer 顶部进度 sticky，底部上/下一步控制 sticky
- 上一步/下一步按钮使用至少 `min-h-11` 的触控尺寸
- `/today` 核心入口 CTA 使用局部 `todayFocusCtaClassName = "min-h-11 w-full sm:w-auto"`：
  - 页头 action：`生成今日内容`
  - 今日目标卡：`完整视图`、`复习入口`
  - FocusPlayer 顶部 action：`查看完整课程内容`、`完成沉淀`
  - 完整视图 hero：`继续步骤`、`去做小测验`、`完成并生成卡片`
  - 右侧 `今日复习入口`：可点击 `/review` CTA 和未完成 disabled CTA
  - 今日知识卡：`查看术语库`、`查看 Radar`
- 这些入口 CTA 在手机端使用单列 `grid gap-2` 布局，桌面端保留 `sm:flex sm:flex-wrap sm:items-center`
- `LearningFocusPlayer` 右侧 `完整视图` actions 区在手机端使用 `grid gap-2`，桌面端保留 `sm:flex sm:flex-wrap`，避免窄屏横向挤压跳转入口
- 底部阶段切换按钮的 `aria-label` 包含阶段名和完成状态，辅助技术可读出 `完成`、`进行中`、`待办`
- Today 交互级 E2E 按真实阶段切换进入 `小测验`、`代码练习`、`反思与完成`，避免测试依赖折叠完整视图默认展开
- 完整课程页面不再默认整块铺开
- 完整课程折叠说明显示 `专注模式下方保留完整课程页面，按需展开。`
- 用户点击“查看完整课程内容”后，才展开传统三栏完整视图
- 完整视图折叠入口提供 `aria-expanded` / `aria-controls`，展开内容使用 `role="region"` 并关联按钮
- 今日学习完成后，完成卡显示 `今日完成 Hub`，汇总生成卡片、小测验和代码提交状态
- 今日学习完成反馈使用共享 `LearningCelebrationCue`，成就徽章显示中文 `完成反馈`，同组件的其他完成语境也保持 `复习总结`、`项目进度`、`掌握证据`。
- 今日学习完成后，完成卡显示轻量 `课程反馈` 区，展示难度、帮助度和后续偏好三组信号：`太简单 / 刚好 / 太难`、`有帮助 / 一般 / 没帮助`、`想深入 / 跳过类似主题`；未完成态不显示该区。
- 今日学习完成后，完成卡显示 `推荐语音反思`，引导用户用 60 秒说明“我今天学了什么 / 哪里还不懂 / 能举什么例子 / 希望 Coach 检查什么”
- `推荐语音反思` 入口使用 `/voice?lessonId=<id>&mode=daily_understanding`，复用现有 Voice 反思模板
- 今日学习完成后，如存在 active book session，完成卡显示 `关联阅读`，用 `《AI Engineering》第 12-14 页可以补充今天的主题。` 把今日主题接到 `/books/ai-engineering` 的 `去同读`。
- 今日学习完成后，如果已有 active project 或已完成笔记/语音/Coach 沉淀，完成卡会显示 `下一步：把今天的知识用到项目里`
- 项目实践推荐区显示 `推荐项目任务`，并复用当前项目里程碑；无 active project 时引导进入 `/projects` 选择小项目
- 当从 Review Session Summary 点击 `生成补弱小课` 进入 `/today?mode=remediation&source=review&focus=...`，页面顶部显示 `Review 补弱短课` 和 `补弱短课已带入`
- 补弱短课 Banner 的 `先回到主课`、`生成补弱小课`、`继续复习` CTA 使用手机端单列 `grid gap-2`，按钮保持 `min-h-11 w-full sm:w-auto`
- 今日计划状态、完成提示和今日概览通过展示层 label helper 显示 `已完成`、`待完成` 等中文业务标签；`planned` / `completed` raw status 只保留在状态判断、服务端逻辑和测试输入中
- 今日计划来源通过展示层 label helper 显示 `AI 生成`、`模板兜底`、`测试计划`、`后台重建` 或 `系统生成`；`deepseek` / `template` 等 raw source 不作为学习者可见标签
- 今日内容版本在专注模式 overview 和右侧 `今日概览` 中显示为 `内容版本`，缺省 schemaVersion 显示 `未标记`；`schema` 和 `-` fallback 不作为学习者可见标签
- 今日广度小卡类型通过展示层 label helper 显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目`；`person` / `open_source_project` 等 raw type 只保留在查询条件、数据契约和测试输入中
- 今日广度小卡可信度通过展示层 label helper 显示 `可信度：高`、`可信度：中`、`可信度：低` 或 `可信度：待确认`；`high` / `medium` / `low` raw confidence 只保留在 `KnowledgeEntity` 数据契约、查询结果和测试输入中
- 代码练习区把提交状态、反馈来源、整体反馈结论、问题标签和可见语言标签映射为学习者友好文案，例如 `反馈已生成`、`系统生成`、`部分正确`、`高优先级 / 逻辑问题`、`代码语言：Python`；`feedback_ready`、`fallback`、`partially_correct`、`high`、`logic` 和隐藏 input 的 raw `python` 等值只保留在数据契约、服务端逻辑、提交契约和测试输入中
- 代码练习区新增手机端 `代码思路模式`，学习者可先写 `先说清思路`、`伪代码草稿` 或后续 Python/TypeScript 实现；`语音解释入口` 链接到 `/voice?lessonId=<id>&mode=code_debug`
- 小测验题型和引导步骤类型映射为中文业务标签，例如 `单选题`、`判断题`、`背景唤醒`；`single_choice`、`true_false`、`activation` 等 raw type 只保留在数据契约、提交分支和测试输入中

## 代码位置

- 页面：`src/app/today/page.tsx`
- 展示层 label helper：`src/app/_lib/home-labels.ts`
- 代码练习区：`src/app/today/ui/code-exercise.tsx`
- 小测验：`src/app/today/ui/today-quiz.tsx`
- 引导步骤：`src/app/today/ui/guided-steps.tsx`
- 折叠容器：`src/components/learning/collapsible-content-section.tsx`
- Focus Player：`src/components/learning/learning-focus-player.tsx`
- Review 补弱落点：`src/components/learning/today-remediation-banner.tsx`
- 完成后下一步：`src/components/learning/learning-completion-card.tsx`
- 完成后行动规则：`src/server/learning/today-completion-actions.ts`
- Review 补弱参数解析：`src/server/learning/today-remediation-intent.ts`
- 阶段配置：`src/app/today/page.tsx`

## 设计目的

解决“播放器 + 完整页面并列”的双模式割裂感，让 `/today` 更像真正的学习播放器，而不是默认展示两套页面。

## 验收

- `LearningFocusPlayer` 仍作为主体验显示
- 学习者可见模式徽章应显示 `专注模式`，不应显示 `Focus Mode`
- 进度条可访问名称应显示 `专注模式进度`，不应显示 `Focus Mode 进度`
- “查看完整课程内容” 默认只显示折叠头
- 折叠说明应显示 `专注模式下方保留完整课程页面，按需展开。`
- 完整课程正文默认不出现在初始 SSR 输出里
- 折叠按钮应暴露展开状态并通过 `aria-controls` 关联展开区域
- 展开后的完整视图区应使用 `role="region"` 和 `aria-labelledby`
- 阶段顶部应稳定显示任务、原因和完成标准，尤其代码阶段要说明提交标准
- 阶段顶部步骤标签应使用 `第 n 步`，不能显示 `Step n`
- 阶段切换按钮应读出阶段状态，而不是只读阶段标题
- E2E 在操作小测验、代码练习和完成卡前，应通过 `切换到小测验`、`切换到代码练习`、`切换到反思与完成` 这类阶段按钮进入对应专注阶段
- 阶段状态应准确区分 quiz 部分完成、术语/Radar 部分匹配和无任务完成态
- 手机端滚动长课程正文时，仍能看到阶段进度和下一步控制
- 核心入口 CTA 应满足手机端全宽 44px 触控目标，覆盖 `完整视图`、`复习入口`、`查看完整课程内容`、`完成沉淀`、`继续步骤`、`去做小测验`、`完成并生成卡片`，以及右侧 `今日复习入口` 的可点击和 disabled 状态 CTA
- `LearningFocusPlayer` 右侧 `完整视图` actions 区应在手机端使用单列 `grid gap-2`，不应继续使用手机端横向 `flex flex-wrap`
- 反思完成表单中的 `标记完成并生成卡片` / `已完成` 提交按钮应复用 `todayFocusCtaClassName`，并在手机端使用单列 `grid gap-2` 提交行。
- 页头 action `生成今日内容` 应满足手机端全宽 44px 触控目标，且只调整按钮样式，不改变 `generateTodayAction` 或 DailyPlan 生成逻辑
- 今日术语和今日广度小卡入口 CTA 应满足手机端全宽 44px 触控目标，覆盖 `查看术语库` 和 `查看 Radar`
- 点击折叠头或锚点后可以展开完整视图
- 完成今日学习后，完成卡应显示 `今日完成 Hub`、`生成卡片`、`小测验` 和 `代码提交`
- 完成反馈徽章应显示中文成就文案，不应混入 `Session summary`、`Project progress` 或 `Mastery signal`
- 完成今日学习后，完成卡应显示 `课程反馈`，包含难度、帮助度和后续偏好三组反馈信号；未完成态不应出现课程反馈提示
- 完成今日学习后，完成卡应显示 `推荐语音反思`、`60 秒`提示，并链接到 `/voice?lessonId=...&mode=daily_understanding`
- 完成今日学习后，如存在 active book session，完成卡应显示 `关联阅读`、书名、页码范围和 `/books/:id` 的 `去同读` 入口
- 完成今日学习后，项目实践区应明确显示 `下一步：把今天的知识用到项目里` 和 `推荐项目任务`
- 今日计划状态和完成提示不应直出 raw `planned` / `completed`；应显示 `已完成`、`待完成`
- 今日计划来源不应直出 raw `deepseek` / `template`；应显示 `AI 生成`、`模板兜底`、`系统生成`
- 今日内容版本不应直出裸 `schema` 或 `-` fallback；专注模式概览和右侧 `今日概览` 都应显示 `内容版本` / `未标记`
- 今日广度小卡类型不应直出 raw `person` / `open_source_project`；应显示 `人物`、`开源项目` 等业务标签
- 今日广度小卡可信度不应直出 raw `high` / `medium` / `low`；应显示 `可信度：高`、`可信度：中`、`可信度：低` 或 `可信度：待确认`
- 今日术语分类 badge 不应直出 raw `agent`、`retrieval`、`fine-tuning` 等分类字段；应显示 `Agent`、`检索增强`、`微调` 等业务标签
- 代码练习区不应直出 raw `feedback_ready`、`fallback`、`partially_correct` 或 `[high/logic]`；应显示 `反馈已生成`、`系统生成`、`部分正确`、`高优先级 / 逻辑问题`
- 代码练习区可见语言标签应显示 `代码语言：Python`、`代码语言：TypeScript` 等友好文案，不应显示旧字段式 `language：python`；隐藏提交 input 可继续保留 raw `python` 作为 `CodeSubmission.language` 契约
- 代码练习区在手机端应提供 `代码思路模式`、`先说清思路`、`伪代码草稿` 和 `语音解释入口`；语音入口应复用 `/voice?lessonId=...&mode=code_debug`，不使用未接线 mode
- 小测验和引导步骤不应直出 raw `single_choice`、`true_false` 或 `activation`；应显示 `单选题`、`判断题`、`背景唤醒`
- 小测验答案选项 label 应复用 `todayQuizOptionLabelClassName`，保证单选、多选和判断题每个选项都有 `min-h-11` 触控高度
- 从 `/review` 的 `生成补弱小课` 进入 `/today?mode=remediation&source=review&focus=...` 后，应显示 `Review 补弱短课`、补弱焦点和 `生成补弱小课` 行动入口
- 补弱短课 Banner 的 `先回到主课`、`生成补弱小课`、`继续复习` CTA 应使用手机端单列布局，并满足全宽 44px 触控目标

## 验证

- Phase E Today E2E Focus Stage Navigation 本地：`npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"` RED 首次失败于直接等待折叠完整视图里的 `today-quiz` 和 `标记完成并生成卡片`；GREEN 后 2 项通过，覆盖专注阶段切换、小测验提交、代码草稿保存、完成态 Voice/Coach handoff。
- Phase E Today E2E Focus Stage Navigation 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts` 69 项通过。
- Phase E FocusPlayer Full View Actions Mobile Layout 本地：`npm test -- tests/unit/learning-ui-components.test.ts` RED 首次失败于 `完整视图` actions row 仍是手机端横向 `flex flex-wrap`；GREEN 后 24 项通过。
- Phase E Today Remediation Banner CTA Mobile Touch Targets 本地：`npm test -- tests/unit/today-remediation-intent.test.ts` RED 首次失败于补弱 Banner action row 仍是手机端横向 `flex flex-wrap`；GREEN 后 4 项通过。
- Phase E Today Remediation Banner CTA Mobile Touch Targets 回归：`npm test -- tests/unit/today-remediation-intent.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts` 39 项通过。
- Phase E Today Remediation Banner CTA Mobile Touch Targets 覆盖扫描：`rg -n "Phase E Today Remediation Banner|TodayRemediationBanner|先回到主课|生成补弱小课|继续复习|mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto" ...` 确认组件、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入补弱 Banner 移动触控要求。
- Phase E Today Quiz Option Mobile Touch Targets 本地：`npm test -- tests/unit/today-activity-labels.test.ts` RED 首次失败于小测验答案选项缺少 `todayQuizOptionLabelClassName`；GREEN 后 6 项通过，覆盖单选、多选、判断题选项 label 均包含 `min-h-11`。
- Phase E Today Quiz Option Mobile Touch Targets 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts` 45 项通过。
- Phase E Today Remediation Banner CTA Mobile Touch Targets 收尾：`git diff --check`、`npm run lint`、`npm test`、`npm run build` 通过；全量单测 345 项通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today` 和 `/review`。
- `npm test -- tests/unit/today-activity-labels.test.ts`
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/knowledge-base.test.ts`
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts`
- Phase E Today Header Generate CTA Mobile Touch Targets 本地：`npm test -- tests/unit/today-activity-labels.test.ts` RED 首次失败于页头 `生成今日内容` 缺少 `todayFocusCtaClassName`；GREEN 后 5 项通过。
- Phase E Today Header Generate CTA Mobile Touch Targets 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/knowledge-base.test.ts` 54 项通过。
- Phase E Today Header Generate CTA Mobile Touch Targets 收尾：覆盖扫描、`git diff --check`、`npm run lint`、全量 `npm test` 和 `npm run build` 通过；全量单测 343 项通过，Next 构建生成 28 个静态页面。
- Phase E Today Reflection Submit CTA Mobile Touch Targets 本地：`npm test -- tests/unit/today-activity-labels.test.ts` RED 首次失败于两处反思提交行仍为 `flex flex-wrap`，且提交按钮缺少 `todayFocusCtaClassName`；GREEN 后 5 项通过。
- Phase E Today Reflection Submit CTA Mobile Touch Targets 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-remediation-intent.test.ts` 44 项通过。
- Phase E Today Reflection Submit CTA Mobile Touch Targets 收尾：覆盖扫描、`git diff --check`、`npm run lint`、全量 `npm test` 和 `npm run build` 通过；全量单测 345 项通过，Next 构建生成 28 个静态页面。
- Phase E Today Breadth Confidence Label Localization 本地：`npm test -- tests/unit/today-activity-labels.test.ts` RED 首次失败于 `/today` 缺少 `breadthConfidenceLabel` 且仍直接渲染 `{breadthDetail.confidence}`；GREEN 后 5 项通过。
- Phase E Today Breadth Confidence Label Localization 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts` 55 项通过。
- Phase E Today Breadth Confidence Label Localization 覆盖扫描：`rg -n 'Phase E Today Breadth Confidence|breadthConfidenceLabel|formatRadarConfidenceLabel\\(breadthDetail\\?\\.confidence\\)|可信度：高|\\{breadthDetail\\.confidence\\}|raw `high`|0\\.232\\.0' ...` 确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入 Today 广度卡可信度本地化要求。
- Phase E Today Breadth Confidence Label Localization 收尾：`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 通过；全量单测 351 项通过，Next 构建生成 28 个页面并包含 `/today`。
- Phase E Today Schema Label Localization 本地：`npm test -- tests/unit/today-activity-labels.test.ts` RED 首次失败于 `/today` 仍显示旧 `schema` 标签和 `-` fallback；GREEN 后 5 项通过。
- Phase E Today Schema Label Localization 回归：`npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts` 42 项通过。
- Phase E Today Schema Label Localization 收尾：`git diff --check`、`npm run lint`、全量 `npm test` 和 `npm run build` 通过；全量单测 381 项通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/today-code-exercise.test.ts`
- `npm test -- tests/unit/today-code-exercise.test.ts tests/unit/voice-note.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`
- `npm test -- tests/unit/today-code-exercise.test.ts tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts tests/unit/today-completion-next-actions.test.ts`
- `npm test -- tests/unit/learning-ui-components.test.ts`
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts`
- `npm test -- tests/unit/today-stage-status.test.ts`
- `npm test -- tests/unit/today-completion-next-actions.test.ts`
- Reduce Chaos Today Course Feedback Prompt 本地 RED/GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于完成态缺少 `课程反馈`、三组反馈选项和 Curriculum Planner 信号文案；GREEN 后 11 项通过。
- Reduce Chaos Today Course Feedback Prompt 相关回归：`npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-activity-labels.test.ts tests/unit/daily-generation-prompt.test.ts` 48 项通过，覆盖 Today 完成态、共享学习 UI、Today 标签和每日生成 prompt。
- Reduce Chaos Today Related Reading Handoff 本地 RED/GREEN：`npm test -- tests/unit/today-completion-next-actions.test.ts` 首次失败于完成卡缺少 `关联阅读`；GREEN 后 12 项通过，覆盖 active book session、`AI Engineering`、`第 12-14 页`、`去同读`、`/books/ai-engineering` 和手机端 CTA 触控 class。
- `npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`
- `npm test -- tests/unit/today-remediation-intent.test.ts`
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`
- `npm run lint`
- `npm run build`
