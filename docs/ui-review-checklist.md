# UI Review Checklist

## 登录页 `/login`

- 页面标题和品牌文案正常显示：`Roky Learn`
- 登录卡片可见
- 当服务器未配置 Supabase：
  - 不显示邮箱输入框
  - 明确提示当前服务器未启用邮箱 Magic Link
  - 如果开放 Demo，应能直接看到“进入 Demo 模式”
  - `进入 Demo 模式` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 当服务器已配置 Supabase：
  - 显示邮箱输入框和“发送登录链接”按钮
  - 邮箱输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
  - 输入合法邮箱后可以触发 Magic Link 流程
- 当服务器配置访问密码时，访问密码输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 当服务器配置访问密码时，`用访问密码进入` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- `发送登录链接` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`

## 首页 `/`

- 未登录时应重定向到 `/login?next=%2F`
- Preview 或 Demo 登录后应看到首页主内容
- 首页 `当前任务` / 当前行动提示应可见，不应显示旧标题 `Current Mission / 当前任务`
- 首页 `当前任务` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 首页 `当前任务` 若推荐处理未解决误区，应显示 `N 个未解决误区`，不应显示英文 `open misconception`
- 首页首屏 `首页主任务` 只应包含 `当前任务`、今日进度条和一个主 CTA，不应并排展示 `今日能量`、`常用入口` 或多个工具快捷 CTA。
- 首页次级动作应默认折叠在 `今天还可以`，包含写笔记、说出理解、推进项目和查看路径等入口；每条 `打开` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 首页 section header action，例如 `今日学习` 顶部 CTA，在手机端应是全宽大触控目标，且共享 section action wrapper 不应把手机端 action 固定为 `shrink-0`
- 首页 `今日任务` 应可见
- 首页 `今日任务` 中的任务卡 CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11`、`w-full sm:w-auto`，且任务卡手机端不应用横向 `flex` 挤压按钮
- 首页 `今日任务` Daily Quest 每条任务的 XP badge 和 CTA 在手机端应纵向排列，CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 首页和 `/progress` 的徽章架顶部解锁计数应显示 `已解锁 N 个`，不应显示英文 `N earned`
- 首页和 `/progress` 的语音徽章应显示 `首次语音笔记`，不应显示 `首次 Voice Note`
- 首页和 `/progress` 的 XP 等级卡应显示中文等级文案，例如 `第 3 级 算法思考者`、`距离 LLM 实践者还差 ... XP`，不应显示 `Lv.`、`Algorithm Thinker` 或 `LLM Practitioner`
- 首页应显示 `周目标`、`连续学习保护` 和 `轻量学习模式`
- 首页和 `/progress` 的 `轻量学习模式` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 首页当前项目卡应显示 `当前项目进度`、项目标题、`进度`、`今日里程碑` 和 `继续项目`；`选择项目` / `继续项目` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 如果今日课程带 `Lesson.connections.glossary/breadth`，Daily Quest 应显示 `今日术语挑战`、`今日人物挑战` 或 `今日 Benchmark 挑战` 之一，并链接到 `/glossary` 或 `/radar`
- 当今日学习、到期复习、误区补弱、代码反馈、今日笔记、语音复盘和项目任务都没有更高优先级动作时，首页 `当前任务` 应推荐 `今天轻量探索：认识 SWE-bench` 并链接到 `/radar?entity=swe-bench`
- 首页今日学习状态应显示中文业务标签，例如 `已完成`、`待完成`、`未生成`，不应直接显示 raw `planned` / `completed`
- 首页补弱焦点应显示中文来源和状态，例如 `小测验`、`代码反馈`、`部分正确`，不应直接显示 raw `quiz`、`partially_correct`
- 首页应显示 `学习会话`，并包含 `当前会话`、`下一会话` 和 `本周会话`
- 首页 `学习会话` 当前会话 CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 首页 `学习会话` 应显示当前会话产出，例如 `产出：review logs / weak signals`，并显示 `下一步：...`
- 首页 `学习会话` 不应出现说明型功能文案 `用户看到的是会话` 或 `不是分散页面`

## 共享学习组件

- 全局 `AppShell` 页头 action 区在手机端应使用单列全宽布局，至少包含 `grid w-full gap-2`，桌面端可恢复 `sm:flex sm:w-auto sm:shrink-0 sm:items-center`，避免 Today、Review、Voice、Projects、Mistakes 等页面页头 CTA 被横向挤压。
- 全局 `AppShell` 页头在手机端应允许换行和增高，至少包含 `min-h-14 flex-wrap py-2`，桌面端可恢复 `sm:h-14 sm:flex-nowrap sm:py-0`。
- Phase E AppShell Header Actions Mobile Layout / `0.326.0` 要求共享页头 action wrapper 不再使用旧 `flex shrink-0 items-center gap-2` 模板。
- AppShell 页头 action 布局只调整展示层，不应改变页面业务 action、Preview Mode、auth、路由、数据库或生产配置。
- `LearningEmptyState` 带 actions 时，空态 CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`，并使用手机端单列 `grid` 避免多个小按钮挤在一行

## 今日学习 `/today`

- 能进入专注模式
- 不应出现旧版“播放器 + 完整页面并排重复”的明显割裂感
- 今日任务、完成后下一步、相关 CTA 文案可见
- 今日完成态应出现 `今日学习完成` 与 `完成反馈`，反馈应轻量不遮挡后续 CTA
- 共享成就反馈徽章应使用中文文案：`完成反馈`、`复习总结`、`项目进度`、`掌握证据`，不应显示 `Session summary`、`Project progress`、`Mastery signal`
- 今日完成态应出现 `今日完成 Hub`，并展示 `生成卡片`、`小测验`、`代码提交`
- 今日完成态应出现 `推荐语音反思`，包含 `60 秒`提示，并链接到 `/voice?lessonId=...&mode=daily_understanding`
- 今日完成后如出现项目实践区，应显示 `下一步：把今天的知识用到项目里` 和 `推荐项目任务`
- 今日完成后 `推荐语音反思`、项目实践和下一步 action CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 从 Review 进入 `/today?mode=remediation&source=review&focus=...` 时，应显示 `Review 补弱短课`、`补弱短课已带入` 和 `生成补弱小课`
- 补弱短课 Banner 中的 `先回到主课`、`生成补弱小课`、`继续复习` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 专注模式徽章应显示 `专注模式`，进度可访问名称应显示 `专注模式进度`，不应显示 `Focus Mode` 或 `Focus Mode 进度`
- 页头 action `生成今日内容` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- `生成今日内容` CTA 只调整触控目标，不应改变 `generateTodayAction`、DailyPlan 生成或 Preview 写保护逻辑
- 今日目标卡和 FocusPlayer 顶部 action 中的 `完整视图`、`复习入口`、`查看完整课程内容`、`完成沉淀` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 右侧 `今日复习入口` 卡片中的可点击 `/review` CTA 和未完成 disabled CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 专注模式右侧 `完整视图` actions 区在手机端应使用单列 `grid gap-2`，桌面端可恢复 `sm:flex sm:flex-wrap`，避免多个跳转入口在窄屏横向挤压
- 完整视图中的今日 hero `继续步骤`、`去做小测验`、`完成并生成卡片` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 专注模式和完整视图里的 `标记完成并生成卡片` / `已完成` 提交按钮在手机端应使用单列布局，且按钮至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 共享 `LearningFocusPanel` 的 `上一步`、`下一步`、`进入当前阶段` 控制按钮在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 专注模式每个阶段顶部应出现 `你现在要做什么`、`为什么做这个`、`完成标准`
- 专注模式每个阶段顶部步骤标签应显示 `第 n 步`，不应显示英文 `Step n`
- 引导步骤类型应显示中文业务标签，例如 `背景唤醒`、`核心直觉`，不应直接显示 raw `activation`
- 今日计划状态、完成提示和今日概览应显示中文业务标签，例如 `已完成`、`待完成`，不应直接显示 raw `planned` / `completed`
- 今日计划来源应显示中文业务标签，例如 `AI 生成`、`模板兜底`、`系统生成`，不应直接显示 raw `deepseek` / `template`
- 今日概览和专注模式概览应显示 `内容版本` / `未标记`，不应显示裸 `schema` 或 `-` fallback
- 今日广度小卡类型应显示中文业务标签，例如 `人物`、`Benchmark`、`开源项目`，不应直接显示 raw `person` / `open_source_project`
- 今日广度小卡可信度应显示中文业务标签，例如 `可信度：高`、`可信度：中`、`可信度：低`，不应直接显示 raw `high` / `medium` / `low`
- 今日术语分类 badge 应显示中文业务标签，例如 `Agent`、`检索增强`、`微调`，不应直接显示 raw `agent`、`retrieval`、`fine-tuning`
- 今日术语 `查看术语库` 和今日广度小卡 `查看 Radar` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- `查看完整课程内容` 折叠入口应带 `aria-expanded` 和 `aria-controls`，展开后内容区域应带 `role="region"` 并关联按钮
- `查看完整课程内容` 的说明应显示 `专注模式下方保留完整课程页面，按需展开。`
- 专注模式底部阶段切换按钮应在 `aria-label` 中同时包含阶段名和状态，例如 `完成`、`进行中`、`待办`
- 小测验阶段应区分未提交、部分提交和全部提交；术语/Radar 阶段应区分无任务、待生成、部分匹配和完成
- 小测验题型应显示中文业务标签，例如 `单选题`、`多选题`、`判断题`，不应直接显示 raw `single_choice`、`true_false`
- 小测验每题 `提交答案` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 小测验单选、多选、判断题的每个答案选项 label 在手机端都应满足 44px 触控高度，至少包含 `min-h-11`
- 引导步骤中的 `显示提示`、`显示参考答案` 控制按钮在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 引导步骤底部 `上一步`、`下一步`、`保存进度` 控制按钮在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 手机端滚动专注模式时，顶部进度应保持 sticky，底部上/下一步控制应保持 sticky 且按钮触控面积足够大
- 交互级 E2E 应通过专注模式阶段切换按钮进入 `小测验`、`代码练习`、`反思与完成`，不应默认依赖下方完整视图已经展开
- 主课正文中的 `核心直觉`、`常见误区`、`重点/要点`、`例子卡/示例`、`代码/伪代码/代码草图`、`图示/概念图`、`互动实验`、`自测卡` 应显示成课程提示块；`重点`、`例子卡`、`代码/伪代码`、`图示`、`互动实验` 和 `自测卡` 不应退化成普通引用块
- 代码块应显示 `复制代码` 入口，且不造成移动端横向溢出；`复制代码` CTA 在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 代码练习区的保存状态、反馈来源和反馈结论应显示中文业务标签，例如 `反馈已生成`、`系统生成`、`部分正确`
- 代码反馈问题应显示中文严重度和类型，例如 `高优先级 / 逻辑问题`，不应直接显示 raw `feedback_ready`、`fallback`、`partially_correct` 或 `[high/logic]`
- 代码练习区的可见语言字段应显示 `代码语言：Python`、`代码语言：TypeScript` 等友好文案，不应显示旧字段式 `language：python`；隐藏提交 input 可继续保留 raw `python` 等值
- 手机端代码练习应提供 `代码思路模式`、`先说清思路`、`伪代码草稿` 和 `语音解释入口`，允许先保存思路/伪代码或跳转 `/voice?lessonId=...&mode=code_debug` 口述解释；`语音解释入口` 和 `保存提交` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Preview 下写操作应被拒绝

## 复习 `/review`

- 队列、显示答案、评分入口可见
- 页头 `开始复习` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 手机端当前卡片应居中显示，不能贴边或造成横向溢出
- 手机端 `显示答案` 和 4 个评分按钮应是大触控目标，评分按钮纵向排列，桌面端可横向四列
- 手机端当前卡片的 `显示答案` 和评分表单应位于 `复习移动操作` sticky 操作区，至少包含 `sticky bottom-16 z-20`、`bg-background/95` 和 `backdrop-blur`，并在桌面端恢复 `sm:static` / `sm:border-0`
- 评分按钮的可访问名称应包含记忆间隔，例如 `忘了 +1d`、`很熟 +14d`，E2E 不应继续断言旧键盘序号文案 `4 很熟`
- 手机端不应显示依赖键盘的快捷键提示；桌面端可显示 `电脑快捷键：Space 显示答案；1-4 评分`
- 当前卡片类型应显示中文业务标签，例如 `概念卡`、`代码反馈卡`、`项目卡`、`错题卡`，不应直接显示 raw `code_bug`、`quiz_error`
- 复习统计卡应显示 `累计复习记录`，不应把数据库模型名 `ReviewLog` 直接展示给学习者
- 完成一轮复习后，应看到本轮评分汇总：`忘了 / 模糊 / 记得 / 很熟`
- 如果本轮出现弱项，应看到 `主要薄弱` 和 `建议`，并能直接跳到带预填上下文的 `Coach`
- 如果本轮出现 `forgot` 或 `hard`，应看到 `补弱动作`，包含 `让 Coach 解释这些卡片`、`生成补弱小课`、`查看错题中心`
- 清空复习队列后应出现 `复习清空` 和 `复习总结`，并保留本轮评分汇总和下一步建议
- 完成总结底部 `让 Coach 拆解薄弱点` / `回到今日学习` 等 CTA 在手机端应使用单列布局，并且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 没有卡片时空态文案合理
- Preview 下评分或写操作应被拒绝

## Coach `/coach`

- 输入区、上下文区、反馈结果区可见
- `输入内容` 旁的必填 badge 应显示 `必填`，不应显示英文 `required`
- `评审模式` 主下拉只应提供 5 个学习者意图：`我想解释一个概念`、`我想检查一段代码思路`、`我想复述一个错题`、`我想问一本书里的内容`、`我想问某个术语/人物/Benchmark`；不应继续把 `今日课程`、`算法设计`、`行业广度`、`自由想法` 作为主输入类型展示
- 从 Today 进入 Coach 的完成后行动应链接到 `/coach?lessonId=...&mode=concept_question`；旧 `today_lesson` URL 可兼容进入，但不应继续由 Today 主链路传播
- `评审模式` 选择框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- `关联最近课程` checkbox label 在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 支持从课程或语音上下文进入
- 导师反馈顶部来源 badge 应显示 `AI 生成` 或 `模板兜底`，不应直接显示 raw `deepseek` / `template`
- 学习上下文里的代码反馈结论应显示中文业务标签，例如 `部分正确`、`需要重写`、`需要更多信息`，不应直接显示 raw `partially_correct`、`incorrect` 或 `cannot_judge`
- 顶部工作区徽章应显示 `Coach 工作区`，不应显示 `Tutor Workspace`
- 上下文面板徽章应显示 `上下文指南针`，不应显示 `Context Compass`
- 可能问题卡片应显示中文问题类型和优先级，例如 `概念问题`、`高优先级`，不应直接显示 raw `conceptual`、`high`
- 从语音笔记进入的 review 应显示 `来自语音笔记` 来源面板、转写预览、`查看语音笔记` 和 `保存为 Note` / `查看 Note`，不应显示 `来自 Voice Note` 或 `查看 Voice Note`
- 语音笔记来源模式应显示中文业务标签，例如 `代码思路`、`错题复述`、`读书疑问`，不应直接显示 raw `code_debug`、`mistake_retell` 或 `book_question`
- 语音笔记来源的 Coach review 仍应能通过 `生成卡片` 进入 `/review?source=voice-note` focused review；普通 Coach review 继续进入 `/review?source=thought-review`
- 语音笔记来源的 Coach review 在卡片已生成后，静态 `复习这 N 张 Coach 卡片` 链接也应进入 `/review?source=voice-note`，不应回退到普通 `thought-review` 队列
- `提交给 Coach`、`查看课程`、`生成卡片`、`复习这 N 张 Coach 卡片`、右侧 `今日学习` / `复习中心` / `查看关联课程`、最近评审入口在手机端应是全宽大触控目标，至少包含 `min-h-11`；按钮类 CTA 还应包含 `w-full sm:w-auto`
- 补弱队列里的 `误区` 和 `代码反馈` 跳转卡片在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- Preview 下提交/生成卡片应被拒绝

## Voice `/voice`

- 录音或 transcript 输入区可见
- 页头标题应显示 `说出你的理解`，副标题应显示 `不用整理，先说出来。Roky 会帮你转写、整理、检查和生成卡片。`，不应退回旧标题 `语音学习捕获`
- 页头 badge 应显示 `语音捕获`，不应显示英文 `Voice`
- 手机端录音主操作应显示 `一键录音` 和 `停止并转写`，按钮为大触控目标
- 手机端录音主操作应位于 `语音录音移动操作` sticky 操作区，至少包含 `sticky bottom-16 z-20`、`bg-background/95`、`backdrop-blur`，桌面端恢复 `sm:static` 和 `sm:border-0`
- 录音状态面板的计时器标签应显示 `录音计时`，不应显示纯英文 `recording`
- 停止录音后应自动进入转写流程，并提示 `停止后自动转写并填入转写文本`，不应显示英文 `Transcript`
- 上传音频仍应保留手动 `自动转写到转写文本` 入口，不应显示英文 `Transcript`
- 上传音频 input 在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 手动 `自动转写到转写文本` action 行在手机端应使用单列 `grid gap-2`，按钮至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 转写结果状态 badge 应显示 `转写成功` 或 `需手动整理`，不应直接显示 raw `success` / `manual_required`
- 录音/上传状态面板在需要手动转写时应显示 `需手动整理`，与转写结果 badge 保持一致，不应显示缩写式 `需手动`
- 转写结果详情应显示 `转写方式：自动转写/手动整理` 和 `提示：...`，不应直接显示 `provider:`、`model:` 或 `reason:`
- 模式选择框应使用中文业务可访问名称 `语音笔记模式`，不应暴露 `Voice Note 模式`
- 模式选择框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- Transcript 文本区应使用中文业务可访问名称 `语音转写文本`，不应只暴露英文 `Transcript`
- Voice 选中笔记状态区应显示 `已连接 Coach`、`已保存笔记`、`转写文本`，不应显示 `Coach linked`、`Note saved` 或独立标题 `Transcript`
- Voice 页面应显示 `当前语音笔记`、`最近语音笔记`、`还没有语音笔记` 和 `暂无历史语音笔记。`，不应显示 `当前 Voice Note`、`最近 Voice Notes`、`还没有 Voice Note` 或 `暂无历史 Voice Note`
- Voice 当前笔记和最近语音笔记的 mode 应通过中文展示 helper 输出；未知/历史 mode 应兜底显示 `语音反思`，不应直接显示 raw mode 值
- Voice 输入表单的转写区域可见标题应显示 `转写文本`，与 `语音转写文本` 可访问名称一致
- Voice 页面级 `打开 Coach` 和右侧学习链路 `去复习` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Voice 输入表单中的 `开始 60 秒反思`、`清空` 和 `保存并进入分析` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 转写 prompt 应保护 `CoT`、`SWE-bench`、`BM25`、`Reranker`、`Embedding`、`Vector Database` 等 AI 术语
- Transcript cleanup 应能把 `chain of thought`、`swe bench/swebench`、`rag`、`lora`、`mmlu`、`gpqa` 归一化为稳定写法
- `60 秒反思模板` 应显示 `今日理解`、`代码思路`、`错题复述`、`术语解释`、`项目复盘`、`读书疑问`、`论文阅读`、`行业观察`
- 每个反思模板都应显示同一组提示：`我今天学的是...`、`我理解为...`、`我卡住的是...`、`我想让 Coach 检查...`
- 从 `/books` 进入 Voice 时，`mode=book_question` 应被保留为 `读书疑问`，转写文本 placeholder 应显示 `我正在读第 X 页，我不理解的是...`
- 每个反思模板入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 语音学习流水线的 `当前最优动作`、`送 Coach 检查`、`整理成笔记`、`生成复习卡片`、`去复习` CTA 在手机端应为全宽大按钮，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 语音学习流水线步骤标题应显示 `Coach 检查`、`整理笔记`、`复习卡片`，不应单独显示 `Coach`、`Note`、`Cards`
- 语音学习流水线和当前语音笔记状态中的卡片数量应显示 `N 张卡片`，不应显示 `N cards`
- 语音流程步骤卡应暴露中文步骤和状态文本，例如 `第 2 步，进行中`；不要在非交互状态图标上添加 `aria-label`
- 最近语音笔记列表每条回看入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- `送 Coach 检查` 后应自动跳转到 `/coach?reviewId=...&source=voice-note&voiceNoteId=...`
- 如果已有 transcript，能看到整理后的学习流水线
- Preview 下保存、送 Coach、生成卡片应被拒绝

## PWA / 移动安装

- 移动端底部导航应包含 `今日`、`复习`、`Coach`、`路径`、`更多`，把学习主线优先于单个工具入口。
- `更多` Sheet 应包含 `/voice`、`/map`、`/library`、`/notes`、`/glossary`、`/radar`、`/projects`、`/books`、`/progress`、`/settings` 等核心学习入口
- `更多` Sheet 的每个入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- `/manifest.webmanifest` 应包含 `name`、`short_name`、`start_url=/today`、`display=standalone`、`theme_color`
- 未登录访问 `/manifest.webmanifest` 应返回 manifest JSON，不应被重定向到 `/login`
- Manifest shortcuts 应包含 `今日学习`、`复习中心`、`语音反思`、`每周复盘`
- Shortcuts 应分别指向 `/today`、`/review`、`/voice`、`/weekly`
- `今日学习` shortcut 描述应显示 `打开今日专注模式，继续当前学习阶段。`，不应显示 `Focus Mode`
- 当前不要求 service worker 离线能力；不要把离线能力写成已完成

## Knowledge Map `/map`

- 领域概览、弱点信号、下一步建议可见
- 卡片和统计信息不应出现空白布局错位
- 领域列表每条领域入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- Radar 类型分布应显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目`，不应直接显示 `open_source_project` 等 raw type
- 相关课程状态和来源应显示 `已完成` / `待完成`、`AI 生成` / `模板兜底` 等中文标签，不应直接显示 `planned`、`deepseek` 或 `template`
- 领域详情 `相关课程` 每条课程入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 相关卡片类型应显示 `概念卡`、`代码反馈卡`、`错题卡`、`术语卡` 等中文标签，不应直接显示 `code_bug` 或 `quiz_error`
- 相关错题状态应显示 `未解决`、`已解决`、`已忽略`，不应直接显示 `open` 或 `resolved`
- 掌握度指标应显示 `掌握分`，不应显示英文 `score` 或 `masteryScore`
- 领域详情复习日志应显示 `复习记录：N`，掌握分说明应写 `复习记录 * 2`，不应直接显示数据库模型名 `ReviewLog`
- 顶部强弱领域摘要卡的 `查看领域` 和 disabled `暂无信号` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 摘要卡 CTA 只调整触控目标，不应改变 `buildKnowledgeMapInsights()` 的摘要排序、弱点理由或知识地图统计口径
- 领域详情底部 `生成下一节` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- `生成下一节` CTA 只调整触控目标，不应改变 Knowledge Map 统计、下一步建议或 `/today` 生成逻辑
- 领域详情底部 `下一步建议` 的 `优先补` 领域链接在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- `优先补` 链接只调整触控目标，不应改变 `buildKnowledgeMapInsights()` 的 next focus 排序、原因文案或领域路由参数

## AI Radar `/radar`

- 页面应显示 `AI Industry Path` 和 `Benchmark Path` 两条 curated learning paths，不应因页面截断而漏掉未来新增 Radar path
- 学习路径模块徽章应显示 `路径模式`，不应显示 `Path Mode`
- 学习路径指标应显示 `已看`、`已生成卡片`、`已复习`、`掌握`、`下一项`
- 学习路径节点状态只能显示 `未看`、`已查看`、`已生成卡片`、`已复习`、`掌握`
- 学习路径卡片的 `下一项` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 实体详情应显示 `关系卡片链`
- 关系卡片链应包含四组：`相关实体`、`相关术语`、`相关论文`、`相关 Benchmark`
- 每个有数据的关系项应以可点击卡片显示，跳到 `/radar?entity=...` 或 `/glossary?term=...`
- 关系卡片链每个可点击关系项在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 空关系组应显示稳定空态，不应整组消失
- 类型筛选、实体列表和实体详情类型应显示 `人物`、`公司`、`实验室`、`论文`、`Benchmark`、`工具`、`开源项目`，不应直接显示 `open_source_project`
- 关系卡片链 badge 应区分实体类型和术语分类，实体显示 `人物`、`开源项目` 等，术语显示 `Agent`、`检索增强`、`Benchmark` 等；不应直接显示 raw `open_source_project`、`agent`、`retrieval`
- 类型筛选入口在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`，不应回退到小尺寸 `Badge asChild` 链接模板
- Phase E Radar Type Filter Mobile Touch Targets / `0.328.0` 要求 `/radar` 类型筛选统一接入 `radarTypeFilterLinkClassName`
- Radar 类型筛选只调整触控目标，不应改变搜索/type 参数、实体查询或生成复习卡片 action
- 实体列表每条可点击结果在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 实体详情来源外链在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- 实体详情可信度应显示 `可信度：高`、`可信度：中`、`可信度：低` 或 `可信度：待确认`，不应显示英文 `confidence`
- 实体详情核验状态应显示 `已核验` / `待核验` 和 `核验日期 YYYY-MM-DD`，不应显示 raw `verified` 或 `needs_verification`
- 顶部 `去复习`、筛选区 `搜索`、关系卡片链 `去复习`、详情底部 `生成复习卡片` / `复制详情入口` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 筛选区搜索输入 `搜索 OpenAI / SWE-bench / Cursor` 在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 关系卡片链 header 和生成复习卡片 action 区在手机端应使用单列 `grid gap-2`，避免复习、制卡和复制入口在窄屏挤压

## 术语库 `/glossary`

- 页面应显示 `Agent Path`、`RAG Path`、`LLM Training Path` 三条 curated learning paths，不应只显示前两条
- 学习路径模块徽章应显示 `路径模式`，不应显示 `Path Mode`
- 学习路径指标应显示 `已看`、`已生成卡片`、`已复习`、`掌握`、`下一项`
- 学习路径节点状态只能显示 `未看`、`已查看`、`已生成卡片`、`已复习`、`掌握`
- 学习路径卡片的 `下一项` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 分类筛选、术语结果列表和术语详情 badge 应显示本地化术语分类，例如 `提示工程`、`Agent`、`检索增强`、`微调`、`模型架构`；不应直接显示 raw `prompting`、`agent`、`retrieval`、`fine-tuning`、`architecture`
- 术语详情难度 badge 应显示 `入门`、`进阶`、`高阶` 或 `难度未标记`，不应直接显示 raw `beginner`、`intermediate`、`advanced`
- 术语列表每条可点击结果在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 分类筛选入口在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`，不应回退到小尺寸 `Badge asChild` 链接模板
- Phase E Glossary Category Filter Mobile Touch Targets / `0.327.0` 要求 `/glossary` 分类筛选统一接入 `glossaryCategoryFilterLinkClassName`
- Glossary 分类筛选只调整触控目标，不应改变搜索/category 参数、术语查询或生成复习卡片 action
- 相关术语链每个可点击术语入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 术语详情来源外链在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- 顶部 `去复习`、检索区 `搜索`、相关术语链 `去复习`、详情底部 `生成复习卡片` / `复制详情入口` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 检索区搜索输入 `搜索 CoT / RAG / SWE-bench` 在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 相关术语链 header 和生成复习卡片 action 区在手机端应使用单列 `grid gap-2`，避免复习、制卡和复制入口在窄屏挤压
- `Agent Path` 应按 `CoT -> ReAct -> Reflexion -> Agent -> SWE-bench`
- `RAG Path` 应按 `Embedding -> Vector Database -> Retriever -> Reranker -> RAG Evaluation`
- `LLM Training Path` 应按 `SFT -> RLHF -> DPO -> Alignment`

## 课程库 `/library`

- 课程列表和详情中的计划状态应显示 `已完成` / `待完成`，不应直接显示 `completed` 或 `planned`
- 课程列表和详情中的计划来源应显示 `AI 生成` / `模板兜底` / `后台重建` 等中文标签，不应直接显示 `deepseek`、`template` 或 `unknown`
- 课程列表和详情中的内容版本应显示 `内容版本：...` / `内容版本：未标记`，不应显示裸 `schema ...` 或 `-` fallback
- 活跃筛选摘要应显示 `来源：...`、`内容版本：...`、`状态：...`、`日期：...`，不应直接显示 `source: ...`、`schema: ...`、`status: ...` 或 `date: ...`
- 课程列表和详情中的测试/归档计划 badge 应显示 `测试计划` / `已归档`，不应直接显示 `test` 或 `archived`
- 课程列表每条课程入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 课程详情中的缺省领域和主题应显示 `未标记领域` / `未标记主题`，不应直接显示 raw `unknown`
- 课程详情广度卡类型应显示 `人物`、`Benchmark`、`开源项目` 等中文标签，不应直接显示 `open_source_project`
- 课程详情测验题型应显示 `单选题`、`多选题`、`判断题`，不应直接显示 `single_choice`、`multi_choice` 或 `true_false`
- 课程详情复习卡片元信息应显示 `到期：YYYY-MM-DD / 复习次数：N`，不应直接显示 `due:` 或 `reviews:`
- 课程详情 Coach 思路评审应显示中文模式标签，例如 `代码思路`、`概念疑问`，不应直接显示 raw `code_reasoning` / `concept_question`
- 代码提交与反馈摘要应显示 `反馈已生成`、`已提交`、`已保存` 和 `部分正确` 等中文标签，不应直接显示 `feedback_ready` 或 `partially_correct`
- 代码提交与反馈摘要的结构化反馈来源应显示 `反馈来源：AI 生成`、`反馈来源：模板兜底` 或 `反馈来源：系统生成`，不应直接显示 `反馈：deepseek`、`反馈：template` 或 `反馈：fallback`
- 课程详情 `课程下一步` action 和 `关联笔记` 的 `写笔记` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 筛选表单应把可见字段名显示为 `来源`、`内容版本`、`状态`、`日期`，不应直接显示裸 `source`、`schemaVersion`、`status`、`localDate`；底层 input `name` 可继续保留 raw query 参数名，避免破坏维护者筛选语义
- 筛选表单 placeholder 应显示中文业务含义并保留可输入 raw 值，例如 `AI 生成 deepseek`、`模板兜底 template`、`待完成 planned`，不应只显示 `deepseek / fallback / admin` 或 `planned / completed`
- 筛选表单中的 `source`、`schemaVersion`、`status`、`localDate` 输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 筛选区的 `切换测试计划`、`切换归档计划`、`清空筛选` 和 `应用筛选` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`

## Coach `/coach`

- 页头 badge 应显示 `思路评审`，不应显示英文 `Coach`。
- 导师反馈顶部和最近评审列表应显示中文模式标签，例如 `今日课程`、`代码思路`、`概念疑问`，不应直接显示 raw `today_lesson`、`code_reasoning` 或 `concept_question`
- 卡片沉淀区的建议卡片类型应显示 `概念卡`、`代码反馈卡`、`错题卡` 等中文标签，不应直接显示 raw `concept`、`code_bug` 或 `quiz_error`
- 学习上下文和补弱队列里的代码反馈结论应复用中文展示 helper，不应把 raw `overall` 作为学习者可见副标题
- Coach 工作区、上下文指南针、问题类型/优先级和 Voice 来源模式应继续映射为中文业务标签，不应直接显示 `Tutor Workspace`、`Context Compass`、`conceptual`、`high` 或 `code_debug`
- 页面级 `提交给 Coach`、反馈区 `查看课程`、生成卡片、复习 Coach 卡片、Quick Links 和最近评审入口在手机端应保持大触控目标

## 笔记 `/notes`

- 新建笔记的关联课程摘要中，计划状态应显示 `已完成`、`待完成` 或 `未关联计划`，不应直接显示 raw `completed` / `planned`
- 新建笔记的 `去今日学习`、`看课程档案` 和 `保存笔记` CTA 在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 新建笔记的 `标题` 输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 预填 Markdown 模板中的 `课程状态` 应使用同一组中文业务标签，不应把 raw DailyPlan status 写进学习者笔记
- 选中语音笔记沉淀来的当前笔记时，列表 badge 应显示 `来自语音笔记的当前笔记`，不应显示 `来自 Voice 的当前笔记`
- 未关联课程时模板仍应显示 `今日总结`、`暂无关联课程` 和 `课程状态：未关联计划`
- Preview 下保存笔记写操作应被拒绝

## 学习路径 `/path`

- 能看到 `我现在处于哪个阶段`、`下一个阶段是什么`、`为什么我今天学这个`、`完成这个阶段的标准是什么`
- 页头 badge 应显示 `学习路径`，不应显示英文 `Path`
- 顶部 `当前任务` 可见，不应显示旧标题 `Current Mission / 当前任务`
- 至少一条路线卡片可见，并带有真实进度数字
- 路线卡片阶段徽章应显示 `第 n 阶段`，不应显示英文 `Stage n`
- “下一个阶段是什么？”卡片的状态徽章应显示 `下一阶段`，不应显示英文 `Next Stage`
- 每个阶段应显示 `测验正确率`
- 每个阶段的项目完成信号应显示 `项目里程碑`，不应显示英文 `milestone`
- 每个阶段应显示 `解锁条件`，说明还差哪些标准
- 每个阶段应显示 `下一步主题`
- 路线图每张阶段卡的行动 CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`

## 错题修复中心 `/mistakes`

- 页面标题应保持学习感文案：`错题误区`，避免只显示数据库名 `Misconception`
- 页头 badge 应显示 `错题修复`，不应显示英文 `Mistakes`
- 筛选区应包含状态、来源、类型和关键词搜索
- 来源筛选应包含 `小测验`、`代码反馈`、`Coach`、`项目实践`
- 类型筛选应包含 `全部类型`、`概念`、`代码`、`算法`、`术语`、`事实`
- 每条误区应显示来源、类型、出现次数、关联课程/主题和关联卡片数
- Current Mission / Next Best Action 推荐未解决误区时，有具体误区 id 应跳到 `/mistakes?focus=<id>`，缺少 id 时才回退到 `/mistakes`，不应直接跳 `/coach`
- 带 `focus` 参数进入 `/mistakes` 时，应在清单前显示 `当前先修这一条`，先展示最该修的误区和主修复动作
- `当前先修这一条` 的手机端主修复动作应位于 `aria-label="错题修复移动操作"` 的 sticky 操作区，至少包含 `sticky bottom-16 z-20`、`bg-background/95`、`backdrop-blur`，并在桌面端恢复 `sm:static` / `sm:border-0`
- 关键词搜索输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 状态、来源、类型三组筛选 chips 在手机端应是单列全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 页面级 `打开 Coach`、修复策略卡 `去复习`、筛选表单 `搜索错题` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 每条开放误区应能看到 `让 Coach 解释`、`生成复习卡`、`标记已解决`
- 每条误区的 `让 Coach 解释`、`生成复习卡`、`标记已解决`、`回到课程` 修复动作在手机端应使用单列布局，且每个 CTA 至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Preview 下 `生成复习卡` 和 `标记已解决` 写操作应被拒绝

## 学习进度 `/progress`

- 顶部 `当前任务` 可见，不应显示旧标题 `Current Mission / 当前任务`
- 能看到 `周目标`、`连续学习保护` 和 `轻量学习模式`
- `轻量学习模式` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 学习日历不能只靠颜色表达状态；每个日期格应有中文 `aria-label`，覆盖 `已完成学习`、`已安排学习`、`暂无学习记录`
- `本周补弱计划` 的步骤徽章应显示 `第 n 步`，不应显示英文 `Step n`
- 代码反馈问题趋势的严重度和高频类型应显示中文业务标签，例如 `高优先级 2`、`高频 逻辑问题`，不应显示 `high 2` 或 raw issue type
- 错题趋势的开放状态应显示中文业务标签，例如 `未解决 1`，不应显示 `open 1`
- 最近完成、开放错题、最近代码反馈、最近思路评审和最近项目实践列表入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- `薄弱领域` 列表每个领域入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 最近代码反馈应显示中文反馈结论，例如 `部分正确`，不应直接显示 raw `partially_correct` 等 `overall`
- 最近代码反馈 provider 应显示中文来源标签，例如 `AI 生成`、`模板兜底`，不应直接显示 raw `deepseek` / `template`
- 最近思路评审应显示中文模式标签，例如 `代码思路`、`概念疑问`，不应直接显示 raw `code_reasoning` / `concept_question`
- 最近项目实践应显示中文任务状态，例如 `进行中`、`已完成`，不应直接显示 raw `active` / `completed`
- `薄弱主题` 卡片应显示 `领域：... / 接触次数：N`；领域缺失时应显示 `未标记领域`，不应显示裸 `-` 或英文 `exposure N`
- 概览卡片应显示学习者文案：连续天数说明使用 `以完成学习日为准（用户时区日期）`，复习日志计数显示 `复习记录：N`，不应直出 `DailyPlan.completed` 或 `ReviewLog`
- 能看到 `内容质量` 和 `生成稳定性`
- `内容质量` 卡片来源应显示中文业务标签，例如 `AI 生成`、`模板兜底`、`系统兜底`、`未标记来源`，不应直接显示 raw `deepseek`、`template`、`fallback` 或 `unknown`
- `内容质量` 卡片代码练习质量应显示中文业务标签，例如 `完整练习`、`基础练习`、`暂无练习`、`待评估`，不应直接显示 raw `strong`、`basic` 或 `missing`
- `生成稳定性` 中应出现 `最近质量`
- `生成稳定性` 卡片应显示中文业务标签，例如 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本`、`未标记`，不应直接显示 `DeepSeek / fallback`、`success/error`、`repair`、`schema ...` 或 raw `unknown`
- `生成稳定性` 模型分布应显示学习者友好的 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro`、`AI 模型：未标记` 等标签，不应直接显示 raw `deepseek-v4-flash`、`deepseek-v4-pro` 或 `AI 模型：unknown`
- 如果最近生成 job 带告警，`内容质量` 卡片应显示至少一条 `警告：...`

## Admin `/admin`

- 页头 badge 应显示 `开发运维`，不应显示英文 `DEV`
- 环境卡 Admin 认证状态应显示 `Admin 认证：已登录` 或 `Admin 认证：需要登录`，不应显示 `Admin Auth: ok` 或 `Admin Auth: required`
- 未登录 shell 卡片标题应显示 `管理员登录`，不应显示英文 `Admin Login`
- 数据概览和最近卡片列表应显示 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：` 和 `复习次数：`，不应显示 `Flashcard`、`Due Flashcard`、`最近 Flashcard`、`due:` 或 `reviews:`
- 数据概览标题和实体标签应显示 `数据概览（当前用户）`、`用户档案`、`每日计划`、`复习记录`、`笔记`，不应显示 `数据概览（当前 user）`、`UserProfile`、`DailyPlan`、`ReviewLog` 或 `Note`
- 数据概览元信息应显示 `暂无正式计划状态`、`来源 / Schema 版本`、`Schema 版本：未标记` 和 `全局课程总数`，不应显示空状态 `none`、`schema unknown` 或 `全局 Lesson 总数`
- 今日闭环中的 `今日计划` 状态应走中文计划状态 helper，显示 `待完成`、`已完成` 或 `未生成`，不应直接显示 raw `planned`、`completed` 或 `none`
- 今日闭环操作区应显示中文维护者文案：`确保用户档案`、`初始化领域/主题`、`今日反思（可选）`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务`、`指定日期闭环检查（生成 → 完成 → 验证）`，不应显示 `ensure profile`、`seed domains/topics`、`reflection（可选）`、`loop check` 或 `daily cron`
- 今日闭环操作区的 11 个 action CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Phase E Admin Today Loop CTA Mobile Touch Targets / `0.320.0` 要求今日闭环 11 个 action CTA 统一接入 `adminTodayLoopCtaClassName`
- 今日闭环 action CTA 只调整触控目标，不应改变 `ensureProfileAction`、`seedAction`、`generateTodayPlanAction`、`completeTodayPlanAction`、`loopCheckAction`、`runDailyCronAction`、`regenerateTodayAction`、归档 action 或指定日期 action 的行为边界
- 能看到 `内容质量摘要`、`卡片质量审查`、`来源核验队列`
- 来源核验队列每条审核项标题链接在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- 来源核验队列链接只调整触控目标，不应改变审核原因、条目 href 或 `summarizeKnowledgeVerificationQueue()` 队列逻辑
- 能看到 `重复主题检测`，并显示 `扫描计划`、`重复主题`、`受影响计划`
- 如果最近计划有重复主题，应显示重复主题名称、重复次数、日期范围和关联计划；该面板必须只读，不应出现自动归档或重建 action
- 能看到 `Prompt Studio`
- Prompt Studio 中应出现 `Prompt 版本`、`Schema 版本`、`最新生成 schema`、`漂移数量`、`手动修复测试`、`最近失败样例`、`最近兜底 / 修复样例`
- Prompt Studio 顶部状态、schema 分布和样例元信息应显示 `Schema 版本：...` / `Schema 版本：未标记`，不应显示 `schema 2.3`、`schema 2.2` 或 `schema -`
- Prompt Studio 状态和原因应显示中文维护者标签，例如 `成功`、`失败`、`错误`、`可测试`、`等待样例`、`每日计划`、`Cron 计划`、`兜底生成`、`JSON 修复`、`原始输出`、`质量警告`，不应直接显示 raw `success`、`failed`、`error`、`ready`、`fallback`、`repair`、`rawPrimary` 或 `quality-warning`
- 指定日期重建入口应显示 `重新生成某日期计划（测试）`
- 指定日期重建入口的 `YYYY-MM-DD` 输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 指定日期重建入口的 `重新生成某日期计划（测试）` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Prompt Studio 重建输入和 CTA 只调整触控目标，不应改变 `regeneratePlanForLocalDateAction`、手动修复测试状态或模型调用边界
- 未登录 shell、环境卡登录和环境卡退出控件在手机端应满足 44px 触控目标：`ADMIN_SECRET` 输入框至少包含 `min-h-11`，登录/退出按钮至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Admin 认证控件只调整触控目标，不应改变 `adminLoginAction`、`adminLogoutAction`、cookie、route protection 或 admin secret policy
- 今日闭环反思输入和指定日期输入在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 计划治理区应显示 `正式计划状态`、`来源 / Schema 版本`、`正式`、`测试`、`已归档`、`正式计划`、`测试计划`、`设为正式`、`激活历史` 和 `暂无激活记录`
- 最近每日计划列表里的 `查看课程` 和 `审计链路` 链接在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- 最近每日计划链接只调整触控目标，不应改变计划治理 action、课程路由、审计链路 href 或筛选逻辑
- 最近每日计划顶部 `正式 / 测试 / 已归档 / 全部` 筛选按钮在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 最近每日计划筛选按钮只调整触控目标，不应改变 `normalizeAdminPlanFilter()`、`buildAdminPlanFilterWhere()`、`planFilterHref()` 或计划治理 action
- 最近每日计划列表里的 `设为正式` 和 `归档` 维护按钮在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Phase E Admin Recent Plan Governance CTA Mobile Touch Targets / `0.322.0` 要求最近每日计划治理按钮统一接入 `adminRecentPlanGovernanceCtaClassName`
- 最近每日计划治理按钮只调整触控目标，不应改变 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询或筛选逻辑
- 最近每日计划卡片 action row 在手机端应占满一行并允许换行，避免 `查看课程`、`审计链路`、`设为正式` 和 `归档` 横向挤压；桌面端可恢复右对齐
- Phase E Admin Recent Plan Action Row Mobile Layout / `0.324.0` 要求最近每日计划 action row 统一接入 `adminRecentPlanActionRowClassName`
- 最近每日计划 action row 只调整展示层布局，不应改变 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由或审计链路 href
- 计划审计异常列表里的 `审计链路` 按钮在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 计划审计异常链接只调整触控目标，不应改变 `buildAdminPlanAuditExceptions()`、`planAuditHref()` 或计划治理 action
- 单条计划审计链路卡片的 `关闭审计` 按钮在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- `关闭审计` 按钮只调整触控目标，不应改变 `planFilterHref()`、审计链路读取或计划治理 action
- 单条计划审计链路卡片里的 `查看课程` 链接在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`
- Phase E Admin Plan Audit Lesson Link Mobile Touch Targets / `0.323.0` 要求单条计划审计链路课程链接统一接入 `adminPlanAuditLessonLinkClassName`
- 单条计划审计链路课程链接只调整触控目标，不应改变 `buildAdminPlanAuditChain()`、课程路由或计划治理 action
- 单条计划审计链路、审计异常队列、最近 DailyPlan 和 AiGenerationJob 的 Planner input 应显示 `Schema 版本：...` / `Schema 版本：未标记`，不应显示 `schema 2.3`、`schema -` 或裸 `schema ...` 模板
- 单条计划审计链路和最近生成任务区域的标题应显示 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`、`最近每日计划（10）`、`最近生成任务（10）`、`选题输入`，不应显示 `DailyPlan`、`Lesson`、`Generation`、`Consistency checks`、`CurriculumDecisionLog`、`Planner input summary`、`最近 DailyPlan（10）`、`最近 AiGenerationJob（10）` 或 `Planner input`
- 单条计划审计链路、审计异常队列和最近选题决策不应把 `test`、`official`、`archived` 作为可见状态标签直接显示给维护者
- 最近生成任务失败重试按钮在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- Phase E Admin Failed Job Retry CTA Mobile Touch Targets / `0.321.0` 要求 `重试此用户定时任务` 按钮统一接入 `adminFailedJobRetryCtaClassName`
- 失败生成任务重试按钮只调整触控目标，不应改变 `retryFailedDailyCronJobAction`、生成任务查询、状态文案或 Preview 写保护边界
- 审计空态、状态 badge 和详情展开应显示 `暂无关联生成任务`、`通过`、`警告`、`失败`、`暂无匹配的选题决策记录`、`暂无选题输入摘要`、`正常`、`N 项失败`、`最近选题决策（10）`、`选题信号快照`、`查看生成输出 JSON`、`最近每日定时任务（10）`、`查看定时任务输出 JSON`、`暂无定时任务记录`，不应显示 `无 linked job`、`matching decision log`、`planner input summary`、`fail`、`warn`、`ok`、`Planner signal snapshot`、`最近 Daily Cron（10）`、`查看 cron output JSON` 或 `{j.status}` 这类 raw 状态/文案
- 计划治理区的 DailyPlan 状态和来源应显示中文业务标签，例如 `待完成`、`已完成`、`AI 生成`、`模板兜底`、`后台重建`，不应直接显示 raw `planned`、`completed`、`deepseek`、`template` 或 `unknown`
- 批量归档按钮应显示 `归档所有测试计划`、`归档未来待完成计划`，不应显示 `test 计划` 或 `planned 计划`

## 每周复盘 `/weekly`

- 页头 badge 应显示 `每周复盘`，不应显示英文 `Weekly`
- 能看到 `本周学了什么`、`最强领域`、`最弱领域`、`下周建议`
- 顶部 `当前任务` 可见，不应显示旧标题 `Current Mission / 当前任务`
- 能看到 `7 天总览`
- `7 天总览` 应包含学习天数、完成课程、复习卡片、小测验正确率、代码提交；不应显示 `quiz 正确率`
- `7 天总览` 应包含 `语音笔记`、`Coach 次数`、`项目里程碑`，不应显示 `Voice Note`
- `7 天总览` 应包含新增误区、已解决误区、`术语/Radar 覆盖`
- 最强领域徽章应显示 `最强`，不应显示 `Strongest`
- 最弱领域徽章应显示 `待补强`，不应显示 `Weakest`
- 最弱领域细项应显示 `掌握分`、`薄弱分`、`测验正确率`，不应显示 `mastery`、`weakness`、`quiz`
- 错题来源应显示中文业务来源，例如 `小测验`，不应直接显示 raw `quiz`
- 代码练习情况和导出的 Weekly Markdown 里 `高频问题` 应显示中文业务标签，例如 `边界条件`、`逻辑问题`、`一般问题` 或 `暂无`，不应直接显示 raw `edge_case`、`bounds` 等内部值
- 能看到 `AI 周总结`
- `AI 周总结` 应包含 `本周最重要收获`、`主要薄弱点`、`下周建议`、`推荐下一阶段`
- `下周建议` 的步骤徽章应显示 `第 n 步`，不应显示英文 `Step n`
- `下周建议` 的每个步骤入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 能看到 `导出 Weekly Markdown`
- `导出 Weekly Markdown` 应为只读文本区，内容包含 `# Roky Learn 每周复盘`、`7 天总览`、`AI 周总结` 和 `下周建议`，不应显示英文标题 `# Roky Learn Weekly Report`
- `导出 Weekly Markdown` 只读文本区应使用中文业务可访问名称 `导出 Weekly Markdown 周报`，不应暴露英文 `weekly report markdown`
- 代码练习和复习保持卡片不应为空白错位

## Projects `/projects`

- 当前项目、里程碑、任务说明可见
- 页头 badge 应显示 `项目实践`，不应显示英文 `Mission`
- 页面级 `看进度`、项目复盘 `复习项目卡片`、`生成项目总结` 和 `打开作品集` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 项目类型筛选入口在手机端应满足 44px 触控高度，至少包含 `inline-flex` 和 `min-h-11`，不应回退到小尺寸 `Badge asChild` 链接模板
- Mission Hero 徽章应显示 `项目任务模式`，不应显示 `Mission Mode`
- Mission Hero 顶部任务卡应显示 `今日项目任务`，并用固定字段呈现 `项目：...`、`任务：...`、`完成标准：...`、`预计：20 分钟`
- 当前项目任务 brief 应显示 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口`
- `AI 评审入口` 应指向现有 `保存并评审代码` 动作，不应暗示服务端会执行用户代码
- 今日项目任务表单中的 `完成里程碑`、`保存草稿` 和 `保存并评审代码` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 今日项目任务表单中的 `lessonId`、`noteId` 和 `代码语言` 三个单行输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 当前任务状态徽章应显示中文状态，例如 `进行中`；全部完成时应显示 `全部完成`，不应显示 raw `active` 或 `all done`
- 没有 active project 时应有清晰 starter/空态
- 项目模板列表中的 `开始项目` 和 `打开项目` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 项目模板列表中的时长和里程碑数量应显示 `约 N 小时`、`N 个里程碑`，不应显示英文缩写 `Nh` 或 `N steps`
- 项目模板列表中的难度 badge 应显示中文业务标签 `入门`、`进阶`、`高阶`，不应把 `beginner`、`intermediate` 或 `advanced` 作为学习者可见文案直出
- `我的项目` 列表中每个项目入口在手机端应满足 44px 触控高度，至少包含 `min-h-11`
- 当前里程碑代码反馈应显示中文业务标签，例如 `部分正确`、`已评审`、`高优先级 / 逻辑问题` 和 `代码反馈`，不应直接显示 raw `partially_correct`、`reviewed`、`high / logic` 或英文 `feedback` 前缀
- 当前里程碑有代码反馈 issue 时，应优先显示 `你现在只需要修这个问题：...` 的单点修复目标，不应把多条反馈压成同等优先级动作
- 项目和里程碑状态应显示中文业务标签，例如 `进行中`、`已完成`、`待开始`，不应把 raw `active`、`completed` 或 `planned` 作为学习者可见文案直出
- 里程碑完成态应出现 `里程碑完成` 和 `项目进度`，并显示里程碑进度指标
- 项目完成态应显示 `你完成了一个项目！`、`练到了：` 和 `生成：`，并列出代码卡与概念卡数量
- 里程碑路线保存状态应显示 `已保存代码`、`已保存反思`、`AI 已评审`，不应显示 `code saved`、`reflection saved`、`AI reviewed`
- 项目复习队列中的 `复习代码反馈` 和 `复习项目卡片` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`
- 已完成项目应在 `项目作品集` 中显示 `导出 Portfolio Markdown`，内容包含项目总结、学习证据、相关知识和代表代码片段
- `项目作品集` 数量徽章应显示 `已完成 N 个项目`，不应显示 `N completed`
- `项目作品集` 相关知识 badge 应显示中文业务标签，例如 `倒排索引`、`文件读写`、`向量检索`，不应把 raw topic slug 如 `inverted-index`、`file-io` 作为学习者可见文案直出
- `导出 Portfolio Markdown` 中的 `相关知识` 行应显示中文业务标签，例如 `倒排索引, 文件读写`，不应把 raw topic slug 如 `inverted-index, file-io` 写入可复制成果
- `导出 Portfolio Markdown` 只读文本区应使用中文业务可访问名称 `导出 {项目名} Portfolio Markdown`，不应暴露英文 `portfolio markdown`
- `项目作品集` 区域应提供 `打开作品集`，进入 `/projects/portfolio`
- `项目作品集` 中每个 `复习项目卡片` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`，卡片 header 手机端应使用单列 `grid` 避免标题和按钮互相挤压
- `/projects/portfolio` 页头 `回到项目实践` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`，页头 action 区手机端应使用单列 `grid`
- Projects 的 Books 联动应保留 `从《xxx》第 2 章生成一个小项目` 的预留文案；全局导航已提供 `/books`，但 `/projects` 页面本身不应新增直接 `/books` 链接
- Preview 下创建或提交项目动作应被拒绝

## Books Companion `/books`

- 页面标题应为 `同读书籍`，不应显示 `PDF 管理`
- `/books` 应显示 `最近阅读`、`我的书架`、`继续阅读` 和 disabled `上传 PDF`
- 上传区域应明确当前版本不会把本地 PDF 上传到服务器
- `/books/ai-engineering` 应显示 `PDF Viewer`、`当前页文本提取`、`文本选择` 和 `AI 伴读`
- AI 伴读应提供 `解释选区`、`总结当前页`、`保存为 Note`、`生成 Flashcards` 和 `送 Coach`
- 移动端阅读应提供底部 Sheet 入口 `打开 AI 伴读`
- 移动端阅读页的 `打开 AI 伴读` 应位于 `AI 伴读移动操作` sticky 操作区，至少包含 `sticky bottom-16 z-20`、`bg-background/95`、`backdrop-blur` 和 `min-h-11 w-full`，桌面端继续使用右侧伴读面板
- Books 应接入 `Coach`、`Note`、`Flashcard`、`Mistake`、`Weekly`、`Project`、`Glossary`、`Radar`、`Current Mission` 和 `Path`
- Current Mission 有活跃读书任务时应推荐 `今天继续读《AI Engineering》第 12-14 页`，并把今日闭环扩展为 5 步

## Project Portfolio `/projects/portfolio`

- 页面标题应为 `项目作品集`
- 顶部状态徽章应显示 `项目作品集`，不应只显示英文 `Portfolio`
- 已完成项目数量应显示 `已完成 N 个项目`，不应显示 `N completed`
- 应显示 `可导出的学习 portfolio`
- 应显示 `导出 Portfolio Markdown`
- `导出 Portfolio Markdown` 只读文本区应使用中文业务可访问名称 `导出 {项目名} Portfolio Markdown`
- 应显示 `回到项目实践`
- 该页面只读，不应出现创建项目、提交里程碑或生成项目总结的写操作

## 设置 `/settings`

- 系统卡应显示 `APP_VERSION`、`GIT_COMMIT_SHA`、`BUILD_TIME` 和 `NODE_ENV`，用于 Preview/管理员验收当前构建。
- 系统卡 `NODE_ENV` 应保留真实环境值；缺失或空白时应显示 `未标记环境`，不应显示裸 `unknown`。
- Provider 状态不应展示 API key、Admin Secret、DATABASE_URL 或其他服务端密钥。
- 目标输入框默认文案应显示中文学习目标，例如 `系统化学习 AI 和工程实践`，不应把内部默认 slug `ai_general` 直接展示给学习者。
- 显示名称、目标、每日时长、时区和知识卡去重天数 5 个文本/数字输入框在手机端应满足 44px 触控高度，至少包含 `min-h-11`。
- 水平、难度和语言应显示中文业务选项，例如 `入门`、`标准`、`中文`，不应把 `beginner / intermediate / advanced`、`easy / standard / hard` 或 `zh / en` 作为 placeholder/default value 直接展示给学习者。
- 水平、难度和语言选项应继续提交既有 profile raw value，例如 `beginner`、`standard`、`zh`，不应把中文展示文案写成新的保存契约。
- 历史自定义 profile choice 值应有 `当前自定义：...` 展示，不应在打开设置页后被 select 默认选项覆盖。
- `保存设置` CTA 在手机端应是全宽大触控目标，至少包含 `min-h-11` 和 `w-full sm:w-auto`。
- 保存区在手机端应使用单列布局，避免 `保存设置` 和 `userId` 文本互相挤压；桌面端可以恢复横向布局。
- Preview 下保存设置动作应被拒绝。

## 统一验收规则

- 所有受保护页面在未登录时都应跳到 `/login?next=...`
- Demo 模式和 Preview 模式都要能进入核心页面
- Preview 必须带明显只读预期，不能把写操作伪装成成功
- 共享学习进度条应暴露 `role="progressbar"`、百分比 `aria-valuenow` 和可读 `aria-label`，不能只靠宽度变化表达进度
- 学习动机卡内的进度条应使用具体中文可访问名称，例如 `今日任务进度`、`XP 等级进度`、`周目标进度`、`徽章进度：首次提交代码`、`徽章进度：首次语音笔记`，避免多个读侧进度都朗读成泛化的 `学习进度`
- Today、Review、Path、Weekly、Map、Projects 和 Knowledge Path 等页面的所有 `LearningProgressBar` 调用点都应传具体业务 `label`，例如 `今日学习进度`、`复习队列进度`、`阶段进度：...`、`复习留存率`、`领域掌握进度：...`、`项目进度：...`
- 共享学习步骤卡应提供屏幕阅读器可读的中文步骤/状态文本，不能只靠图标、颜色或英文 `title="step n"` 表达进度
- 今日流程时间线应提供屏幕阅读器可读的中文步骤/状态文本，例如 `第 2 步，进行中`，不能只靠图标、颜色或数字表达状态
- 知识路径指标卡应直接暴露可见中文 label/value，不应在非交互 `div` 上额外添加 `aria-label`
- 全局样式应尊重 `prefers-reduced-motion: reduce`，把动画、过渡和平滑滚动降到最小，避免移动端和敏感用户被动承受动态效果
- 共享 Dialog、Sheet、Breadcrumb 等 UI 基础组件的屏幕阅读器文本应使用中文，例如 `关闭`、`面包屑导航`、`更多层级`，避免中文产品朗读时混入英文占位词
- 如果线上入口打不开，先确认访问的是 `https://learn.roky.chat`，不是 `https://roky.chat/`
- 本地 Phase 10 验收应运行 `npm run e2e:a11y` 和 `npm run e2e:mobile-matrix`
- Hydration 验收应运行 `npm run e2e:hydration`，确保核心页面没有 React/Next hydration mismatch console errors
- Preview 写保护验收应在服务端配置 `PREVIEW_TOKEN` 且测试环境设置匹配的 `E2E_PREVIEW_TOKEN` 后运行 `npm run e2e:preview-readonly`
- 浏览器级 smoke 应断言已本地化 UI：首页 `当前任务`、Projects `项目任务模式`、Coach `上下文指南针`，不应继续断言 `Current Mission / 当前任务`、`Mission Mode` 或 `Context Compass`
- a11y smoke 不允许 serious/critical axe violations；移动矩阵至少覆盖 375/390/430/768/1024/1440 宽度
