# Todo Checkpoint

## Current Slice: Reduce Chaos Weekly Ritual Summary and Reflection Note

- [√] 读取 `roky_learn_reduce_chaos_and_book_companion_guidance.md`，确认当前切片对应第 9.1、9.2 和 9.4：`/weekly` 首屏学习总结、本周称号和可保存周记。
- [√] RED：新增 Weekly Review 测试，先失败于 `weeklyRitualSummary` 缺失、页面缺 `saveWeeklyReflectionAction`、`src/app/weekly/actions.ts` 不存在。
- [√] GREEN：`WeeklyReviewData` 新增 `weeklyRitualSummary`，稳定生成本周一句话总结、称号、称号原因和周记模板。
- [√] GREEN：`/weekly` 在 `当前任务` 后新增 `本周学习总结`，展示 `本周称号` 和周记表单。
- [√] GREEN：新增 `saveWeeklyReflectionAction()`，通过 `assertWritableRequest()`、`requireUserId()` 和 `createScopedNote()` 创建 standalone Note，写入后跳转 `/notes?noteId=<id>`。
- [√] 将 `src/app/weekly/actions.ts` 纳入 `auth-policy` Preview 写保护通用扫描。
- [√] 同步 `docs/ui-review-checklist.md`、`helloagents/modules/weekly.md` 和 `helloagents/CHANGELOG.md` 初始记录。
- [√] 运行本地完整门禁。
- [√] 提交并推送 GitHub：`6c938bf feat: add weekly ritual reflection`。
- [√] 部署到 `118.25.15.72` 的 `ai-learning-platform` 容器，并完成 `learn.roky.chat` 生产 smoke。
- [√] 补生产部署证据并清理临时 SSH key。

## Current Resume State Hint

从 `ai-learning-platform` 根目录继续。当前切片是 `0.359.0 Reduce Chaos Weekly Ritual Summary and Reflection Note`：只改 `/weekly` 读侧数据合约、页面首屏总结/称号、周记保存到 Notes 的 standalone action、源码级测试和文档记录；不要改数据库 schema/migration、Notes 列表行为、生产 env/provider 密钥、Preview 写保护语义或其他页面主流程。已完成 RED/GREEN、相关回归、完整本地门禁、GitHub push、生产部署、远端非 DB 门禁、生产 health 和 390px `/weekly` smoke。生产 smoke 未提交真实周记，避免污染生产 Notes。

## Current Drift Check

- Scope：仍服务 Roky Learn reduce-chaos 主线，把 `/weekly` 从“统计页”收束成周末可理解、可命名、可沉淀的复盘仪式。
- Compatibility：不新增迁移，不触碰生产 env、provider 密钥、数据库 schema、Notes 列表行为或其他学习模块；新增写入口继续走现有 Preview 写保护和 `createScopedNote()`。
- New fallback/owner：未新增外部 owner、adapter 或兼容层；Weekly ritual summary 归 `src/server/learning/weekly.ts`，周记写入复用 Notes owner。
- Retirement：旧的 `/weekly` 首屏从任务卡直接进入本周窗口/指标的弱仪式感布局已退役；原有 7 天总览、Top 3 误区修复队列、AI 周总结和 Markdown 导出继续保留。
- Decision：complete; RED/GREEN、相关回归、完整本地门禁、GitHub push、生产部署、远端非 DB 门禁、生产 health、390px `/weekly` smoke 和临时 SSH key 清理均已完成。真实生产写入型周记 smoke、完整移动截图矩阵和既有 `npm audit` moderate 告警保持未覆盖边界。

## Current Slice: Reduce Chaos Weekly Mistake Repair Queue

- [√] 读取 `roky_learn_reduce_chaos_and_book_companion_guidance.md`，确认当前切片对应第 7.4 节 Weekly 联动：显示 `本周最值得修复的 3 个误区`，并延续第 7.3 节 `/mistakes?focus=<id>`。
- [√] RED：新增 Weekly Review 测试，先失败于 `WeeklyReviewData` 缺少 `mistakeRepairQueue`、Markdown 缺少 Top 3 修复小节、页面仍显示旧的 `错题最多的概念` 单条卡片。
- [√] GREEN：`WeeklyMistakeHighlight` 增加 `id/href/status`，`getWeeklyReviewData()` 查询误区 id 并生成最多 3 条 `/mistakes?focus=<id>` 修复队列。
- [√] GREEN：`/weekly` 改为 `本周最值得修复的 3 个误区`，每条展示来源、次数、关联课程并链接到具体误区。
- [√] 同步 `docs/ui-review-checklist.md`、`helloagents/modules/weekly.md` 和 `helloagents/CHANGELOG.md` 初始记录。
- [√] 运行相关回归与本地完整门禁。
- [√] 提交并推送 GitHub：`8da6a52 feat: add weekly mistake repair queue`。
- [√] 部署到 `118.25.15.72` 的 `ai-learning-platform` 容器，并完成 `learn.roky.chat` 生产 smoke。
- [√] 补生产证据；临时 SSH key 待最终提交后清理。

## Current Resume State Hint

从 `ai-learning-platform` 根目录继续。当前切片是 `0.358.0 Reduce Chaos Weekly Mistake Repair Queue`：只改 `/weekly` 读侧数据合约、Markdown 导出和页面展示，让本周误区形成最多 3 条 `/mistakes?focus=<id>` 修复入口；不要改 Misconception schema/migration、错题写入 action、Preview 写保护、生产 env/provider 密钥或其他页面主流程。已完成 RED/GREEN、相关回归、完整本地门禁、GitHub push、生产部署、远端门禁、生产 health 和 390px `/weekly` smoke；生产用户当前没有可修复误区样本，线上只覆盖空态和 Markdown Top 3 小节。

## Current Drift Check

- Scope：仍服务 Roky Learn reduce-chaos 主线，把 Weekly 的错题信号从“报告里看一眼”收束成可点击的 Top 3 修复任务。
- Compatibility：保留 `topMistake` 兼容字段，不新增迁移，不触碰错题写入 action、Preview 写保护、生产 env 或 provider 密钥。
- New fallback/owner：没有新增外部 owner、adapter 或兼容层；无可修复误区时显示空态，`resolved` / `ignored` 不进入队列。
- Retirement：旧的页面单条 `错题最多的概念` 展示已退役；Markdown 仍保留 `错题最多` 摘要并新增 Top 3 修复小节。
- Decision：complete; 定向 RED/GREEN、相关回归、完整本地门禁、GitHub push、生产部署、远端门禁、生产 health、390px `/weekly` smoke 和远端源码核验均已完成。生产用户当前没有可修复误区样本，真实数据 `/mistakes?focus=<id>` 链接渲染保持未覆盖边界。

## Previous Slice: Reduce Chaos Mistakes Focus Repair

- [√] 读取 `roky_learn_reduce_chaos_and_book_companion_guidance.md`，确认当前切片对应第 7.3 节 `/mistakes?focus=<id>` 和第 16 节移动端关键 CTA sticky。
- [√] RED：新增/调整 Next Best Action、Current Mission 和 Mistakes View 测试，先失败于未解决误区仍跳 `/coach`、Learning Session 用 summary 当 focus、`/mistakes` 缺聚焦修复 sticky 主操作。
- [√] GREEN：Next Best Action / Current Mission / Learning Session 使用误区 id 跳 `/mistakes?focus=<id>`，缺 id 回退 `/mistakes`。
- [√] GREEN：`/mistakes` 新增 `当前先修这一条` 和 `aria-label="错题修复移动操作"` sticky 主修复区。
- [√] 同步 `docs/ui-review-checklist.md`、`helloagents/modules/mistakes.md` 和 `helloagents/CHANGELOG.md` 初始记录。
- [√] 运行相关回归与本地完整门禁。
- [√] 提交并推送 GitHub：`645a293 feat: focus mistake repair mission`。
- [√] 部署到 `118.25.15.72` 的 `ai-learning-platform` 容器，并完成 `learn.roky.chat` 生产 smoke。
- [√] 补生产证据并清理临时 SSH key。

## Current Resume State Hint

从 `ai-learning-platform` 根目录继续。当前切片是 `0.357.0 Reduce Chaos Mistakes Focus Repair`：只改 Current Mission / Next Best Action 到 `/mistakes?focus=<id>` 的读侧路由，以及 `/mistakes` 聚焦修复展示层和移动 sticky 主操作；不要改 `generateMistakeReviewCardAction`、`markMistakeResolvedAction`、Preview 写保护、数据库 schema/migration、生产 env/provider 密钥或 Voice/Books/Review 等无关模块逻辑。已完成定向 RED/GREEN、相关回归、完整本地门禁、GitHub push、生产部署、远端门禁和 390px `/mistakes` 页面 smoke；生产 demo 用户当前 0 条开放误区，未能用真实样本实测 focus sticky 区。

## Current Drift Check

- Scope：仍服务 Roky Learn reduce-chaos 主线，把 Current Mission 的未解决误区从泛化 Coach 跳转收束为具体错题修复流程。
- Compatibility：不新增迁移，不触碰生产 env、provider 密钥、Preview 写保护或错题写入 action；只改变读侧路由、页面展示和源码级测试/文档记录。
- New fallback/owner：没有新增外部 owner、adapter 或兼容层；缺少误区 id 时保留 `/mistakes` fallback。
- Retirement：旧的 `/coach` 直接跳转和 summary-as-focus 行为已退役；列表级修复动作继续保留。
- Decision：complete; 定向测试、相关回归、完整本地门禁、GitHub push、生产部署、远端门禁、生产 health、390px `/mistakes` 页面 smoke、远端源码核验和临时 SSH key 清理均已完成。生产 demo 用户当前 0 条开放误区，focus sticky 区真实数据 smoke 保持未覆盖边界。

## Previous Slice: Reduce Chaos Voice Mobile Sticky Capture

- [√] 读取 `roky_learn_reduce_chaos_and_book_companion_guidance.md`，确认当前切片对应第 10 节 `/voice` 学习化和第 16 节移动端专项优化。
- [√] RED：新增 Voice 移动端 sticky 录音操作测试，先失败于缺少 `aria-label="语音录音移动操作"`。
- [√] GREEN：`VoiceCapture` 录音主操作进入 sticky 移动操作区，桌面端恢复静态布局。
- [√] 同步 `docs/ui-review-checklist.md`、`helloagents/modules/voice-note.md` 和 `helloagents/CHANGELOG.md` 初始记录。
- [√] 运行相关回归与本地完整门禁。
- [√] 提交并推送 GitHub：`df9f291 feat: improve voice mobile capture`。
- [√] 部署到 `118.25.15.72` 的 `ai-learning-platform` 容器，并完成 `learn.roky.chat` 移动端 smoke。
- [√] 补生产证据并清理临时 SSH key。

## Current Resume State Hint

从 `ai-learning-platform` 根目录继续。当前切片是 `0.356.0 Reduce Chaos Voice Mobile Sticky Capture`：只改 `/voice` 读侧展示层，让 `一键录音` / `停止并转写` 在手机端固定到底部导航上方；不要改浏览器录音、自动转写、上传音频、保存语音笔记、Voice → Coach handoff、Preview 写保护、数据库、生产 env、provider 密钥或迁移。已完成定向 RED/GREEN、相关回归、本地完整门禁、GitHub push、生产部署、远端门禁和 390px 生产 smoke。

## Current Drift Check

- Scope：仍服务 Roky Learn reduce-chaos 主线，把 `/voice` 从“功能很多”收束为手机端低摩擦的“说出你的理解”行动。
- Compatibility：不新增迁移，不触碰录音、转写、上传、保存、Coach handoff、Preview 写保护、数据库、密钥或后端配置。
- New fallback/owner：未新增外部 owner、adapter 或 fallback；移动 sticky 归 `VoiceCapture` 展示层负责。
- Retirement：旧的移动端普通文档流录音操作已退役；桌面端通过 `sm:static` 回到原布局。
- Decision：complete; 本地 RED/GREEN、相关回归、完整门禁、GitHub push、生产部署、远端门禁、生产 health 和 390px `/voice` smoke 均已完成。

## Current Todo

- [√] 读取指导文档与项目规则。
- [√] 确认 `/path`、`/weekly`、`/mistakes` 已存在。
- [√] 新增同步审查脚本。
- [√] 新增 Daily Quest / XP / Badge 服务、组件和接入。
- [√] Phase 2.5：新增周目标、连续学习保护和轻量学习模式，首页与 `/progress` 均显示习惯目标卡。
- [√] Phase 7.1：Glossary/Radar 学习路径卡展示全部 curated paths，并对齐 `已看`、`已生成卡片`、`已复习`、`未掌握`、`下一项` 指标文案。
- [√] Phase 7.2：今日广度挑战接入首页 Daily Quest，并按 `knowledgeFocus.rotation.focus` 区分术语、人物和 Benchmark。
- [√] Phase 7.3：Radar 详情页新增 `相关实体`、`相关术语`、`相关论文`、`相关 Benchmark` 四组关系卡片链。
- [√] Phase 8.1：首页当前项目卡显式展示 `今日里程碑`，保留 `当前项目进度`、进度和 `继续项目`。
- [√] Phase 8.2：Today 完成后新增 `下一步：把今天的知识用到项目里` 和 `推荐项目任务` 项目实践推荐文案。
- [√] Phase 8.3：Projects Mission Mode 当前任务 brief 显式展示 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口`。
- [√] Phase 8.4：已完成项目作品集新增可复制 `Portfolio Markdown`，包含项目总结、学习证据、相关知识和代表代码片段。
- [√] Phase 8.4：补齐 `/projects/portfolio` 独立只读作品集页，并接入 route audit 与 E2E 页面清单。
- [√] Phase 4.2：Today quiz 和术语/Radar 阶段状态统一为可测试规则，支持部分完成/部分匹配。
- [√] Phase 4.5：Today 完成后新增 `今日完成 Hub`，汇总生成卡片、小测验和代码提交状态。
- [√] Phase 4.5：Today 完成后新增 `推荐语音反思`，链接到 60 秒 Voice daily understanding 模式。
- [√] Phase 5.1：Review Session Summary 新增补弱动作组，并将 `生成补弱小课` 落到 `/today?mode=remediation&source=review&focus=...` 可见提示。
- [√] Phase 5.2：`/mistakes` 错题修复中心新增项目实践来源、类型筛选、生成复习卡和标记已解决动作，并保持 Preview 写保护。
- [√] Phase 5.3：`/path` 学习路径新增测验正确率、解锁条件和下一步主题展示。
- [√] Phase 5.4：`/weekly` 每周复盘新增 7 天总览和 AI 周总结 fallback。
- [√] Phase 5.4：`/weekly` 新增只读 `导出 Weekly Markdown` 周报，覆盖 7 天总览、AI 周总结和下周建议。
- [√] Phase E：`/weekly` 导出 Weekly Markdown 标题本地化为 `# Roky Learn 每周复盘`，不再输出英文 `# Roky Learn Weekly Report`。
- [√] 新增 PWA manifest 和移动 metadata。
- [√] Phase 3.5：PWA manifest 新增安装后 shortcuts，覆盖今日学习、复习、语音反思和每周复盘。
- [√] 补齐移动底部导航 More Sheet 可访问性。
- [√] Phase 3.2：手机端 Today 顶部进度 sticky、底部上/下一步 sticky、大按钮触控面积。
- [√] Phase 3.3：手机端 Review 当前卡片居中、大触控按钮、桌面快捷键提示边界。
- [√] Phase 3.4：手机端 Voice 一键录音、停止后自动转写、Transcript 自动填入路径和语音流水线大触控 CTA。
- [√] Phase 6.1/6.2：Voice 术语词表补齐 BM25/Reranker/Embedding/Vector Database，并新增 transcript cleanup owner。
- [√] Phase 6.3：Voice 六个反思模板入口统一显示 guidance 指定的 60 秒四句提示。
- [√] Phase 6.4：Voice Note 送 Coach 后自动跳转 Coach review，并在 Coach 页面显示 Voice Note 来源、转写预览、保存为 Note 和生成卡片路径。
- [√] 修复本地 dev HMR 被 auth proxy 拦截导致 hydration/交互失败的问题。
- [√] Phase 8：Projects portfolio/任务流深化，本地接入项目作品集和项目复习卡摘要。
- [√] Phase 9：内容质量后台/Admin panel 深化，本地接入每日生成内容质量摘要。
- [√] Phase 9：补齐 Admin 卡片质量审查与 Glossary/Radar 来源核验队列。
- [√] Phase 9.2：补齐 Admin Prompt Studio，展示 prompt/schema 版本、失败样例、fallback/repair 样例、手动 repair readiness 和指定日期 test 计划重建入口。
- [√] Phase 9.2：本地化 Prompt Studio 创作者可见标签，覆盖 `Prompt 版本`、`Schema 版本`、`最新生成 schema`、`漂移数量` 和 `重新生成某日期计划（测试）`，并让组件静态渲染测试不再加载 DB/env 依赖。
- [√] Phase 9：补齐 Admin 重复主题检测队列，扫描当前用户最近 DailyPlan，显示重复主题、日期范围和关联计划。
- [√] Phase E：本地化 Admin 计划治理可见标签，覆盖 `正式计划状态`、`正式计划`、`测试计划`、`已归档`、`设为正式`、`激活历史`，不再把 `test`、`official`、`archived` 作为可见状态标签直出。
- [√] Phase E：本地化 Admin DailyPlan 状态/来源标签，覆盖 `待完成`、`已完成`、`AI 生成`、`模板兜底`、`后台重建`，不再把 `planned`、`completed`、`deepseek`、`template`、`unknown` 作为计划治理可见标签直出。
- [√] Phase E：本地化 Admin Prompt Studio schema 版本标签，覆盖 `Schema 版本：2.3`、`Schema 版本：2.2`、`Schema 版本：未标记`，不再把 `schema 2.3`、`schema 2.2`、`schema -` 作为维护者可见标签直出。
- [√] Phase E：本地化 Admin Prompt Studio 状态、原因和手动修复标签，覆盖 `成功`、`失败`、`错误`、`可测试`、`等待样例`、`最近兜底 / 修复样例`、`JSON 修复`、`原始输出`、`质量警告`，不再把 `success`、`failed`、`ready`、`fallback`、`repair`、`rawPrimary`、`quality-warning` 作为维护者可见标签直出。
- [√] Phase E：本地化 `/admin` 页面层 schema 版本标签，单条计划审计链路、planner summary、审计异常队列、最近 DailyPlan 和最近 AiGenerationJob planner input 显示 `Schema 版本：...` / `Schema 版本：未标记`，不再显示 `schema ...` 或 `schema -`。
- [√] Phase E：本地化 `/admin` 审计与生成任务区域标题，显示 `每日计划`、`课程`、`生成任务`、`一致性检查`、`选题决策记录`、`选题输入摘要`、`最近每日计划（10）`、`最近生成任务（10）`、`选题输入`，不再显示旧英文标题。
- [√] Phase E：本地化 `/admin` 审计空态、状态 badge、详情展开和定时任务文案，显示 `暂无关联生成任务`、`通过`、`警告`、`失败`、`暂无匹配的选题决策记录`、`暂无选题输入摘要`、`正常`、`N 项失败`、`最近选题决策（10）`、`选题信号快照`、`查看生成输出 JSON`、`最近每日定时任务（10）`、`查看定时任务输出 JSON`，不再显示旧 raw 审计文案。
- [√] Phase E：本地化 Admin 环境卡认证状态，显示 `Admin 认证：已登录` / `Admin 认证：需要登录`，不再显示 `Admin Auth: ok/required`。
- [√] Phase E：本地化 `/admin` 未登录 shell 卡片标题，显示 `管理员登录`，不再显示 `Admin Login`。
- [√] Phase E：本地化 `/admin` 复习卡片统计和最近卡片元信息，显示 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：` 和 `复习次数：`，不再显示 `Flashcard`、`Due Flashcard`、`最近 Flashcard`、`due:` 或 `reviews:`。
- [√] Phase E：本地化 `/admin` 数据概览实体标签，显示 `数据概览（当前用户）`、`用户档案`、`每日计划`、`复习记录`、`笔记`，不再显示 `数据概览（当前 user）`、`UserProfile`、`DailyPlan`、`ReviewLog` 或 `Note`。
- [√] Phase E：本地化 `/admin` 今日闭环今日计划状态，复用 `formatHomeDailyPlanStatusLabel(plan?.status)`，不再显示 raw `planned`、`completed` 或 `none` 状态。
- [√] Phase E：本地化 `/admin` 今日闭环操作文案，显示 `确保用户档案`、`初始化领域/主题`、`今日反思（可选）`、`一键闭环检查（生成 → 完成 → 验证）`、`运行每日定时任务` 和 `指定日期闭环检查（生成 → 完成 → 验证）`，不再显示 `ensure profile`、`seed domains/topics`、`reflection（可选）`、`loop check` 或 `daily cron`。
- [√] Phase E：本地化 `/admin` 数据概览元信息标签，显示 `暂无正式计划状态`、`来源 / Schema 版本`、`Schema 版本：未标记` 和 `全局课程总数`，不再显示旧空状态 `none`、`schema unknown` 或 `全局 Lesson 总数`。
- [√] Phase E：本地化 `/today` 内容版本标签，专注模式概览和右侧 `今日概览` 显示 `内容版本` / `未标记`，不再显示裸 `schema` 或 `-` fallback。
- [√] Phase E：本地化 `/path` 页头 badge，显示 `学习路径`，不再显示英文 `Path`。
- [√] Phase E：本地化 `/mistakes` 页头 badge，显示 `错题修复`，不再显示英文 `Mistakes`。
- [√] Phase E：本地化 `/weekly` 页头 badge，显示 `每周复盘`，不再显示英文 `Weekly`。
- [√] Phase E：本地化 `/voice` 页头 badge，显示 `语音捕获`，不再显示英文 `Voice`。
- [√] Phase E：本地化 `/projects` 页头 badge，显示 `项目实践`，不再显示英文 `Mission`。
- [√] Phase E：本地化 `/coach` 页头 badge，显示 `思路评审`，不再显示英文 `Coach`。
- [√] Phase E：本地化 `/admin` 两处页头 badge，显示 `开发运维`，不再显示英文 `DEV`。
- [√] Phase 2.4：补齐 Celebration 微动效，Today 完成、Review 清空、Projects 里程碑完成态都有轻量反馈。
- [√] Phase 4.3：补齐 Today FocusPlayer 每阶段“做什么 / 为什么 / 完成标准”。
- [√] Phase 4.4：补齐 `LearningMarkdown` 课程 callout、代码块复制入口和 daily prompt 课程块协议。
- [√] Phase 10：Preview 写保护本地守卫、Playwright visual 覆盖和 `/map` 载荷修复。
- [√] Phase 10：补齐自动化 axe a11y smoke 和 375/390/430/768/1024/1440 移动宽度矩阵。
- [√] Phase 10：补齐 `E2E_PREVIEW_TOKEN` 驱动的 Preview 写保护 E2E，本地临时 token 覆盖 Settings、Today quiz、Today code、Admin hidden。
- [√] Phase 10：补齐 hydration console guard，覆盖 16 个核心页面，阻断 React/Next hydration mismatch console errors。
- [√] Phase 10：补齐 Today 完整视图折叠区 ARIA 语义，覆盖 `aria-expanded`、`aria-controls`、`role="region"` 和 `aria-labelledby`。
- [√] Phase 10：补齐 `/progress` 学习日历非颜色状态语义，覆盖 completed/planned/none 三种中文 `aria-label`。
- [√] Phase 10：补齐 Today FocusPlayer 阶段切换按钮状态语义，覆盖阶段名和 `完成/进行中/待办`。
- [√] Phase 10：补齐共享 `LearningProgressBar` 的 `progressbar` 语义，覆盖百分比值和可访问名称。
- [√] Phase 10：补齐学习动机卡进度条具体可访问名称，覆盖 Daily Quest、XP、周目标和徽章进度。
- [√] Phase 10：补齐剩余学习进度条具体可访问名称，覆盖 Today Focus、Review、Path、Weekly、Map、Projects、Completion 和 Knowledge Path。
- [√] Phase 10：补齐共享 `LearningStepCard` 的屏幕阅读器步骤/状态文本，覆盖 Voice 步骤流。
- [√] Phase 10：补齐 `LearningTimeline` 的屏幕阅读器步骤/状态文本，覆盖 Today 完整流程时间线。
- [√] Phase 10：清理 `KnowledgePathExplorer` 指标卡非交互 `aria-label`，保留可见中文 label/value。
- [√] Phase 10：补齐全局 `prefers-reduced-motion: reduce` 动效降级，覆盖动画、transition 和平滑滚动。
- [√] Phase 10：本地化共享 Dialog/Sheet/Breadcrumb 的屏幕阅读器文案，覆盖 `关闭`、`面包屑导航`、`更多层级`。
- [√] Phase 10：本地化 Markdown 导出文本区可访问名称，覆盖 Weekly 周报和 Projects Portfolio Markdown。
- [√] Phase 10：本地化 Voice 表单核心控件可访问名称，覆盖语音笔记模式和语音转写文本。
- [√] Phase 10：本地化 Voice 录音计时器可见标签，覆盖 `录音计时`。
- [√] Phase 10：本地化 Voice 学习流水线步骤标题，覆盖 `Coach 检查`、`整理笔记`、`复习卡片`。
- [√] Phase 10：本地化 Voice 卡片数量状态，覆盖 `N 张卡片`，不再显示 `N cards`。
- [√] Phase 10：本地化 Weekly 复盘指标和错题来源，覆盖 `小测验正确率`、`最强`、`待补强`、`掌握分`、`薄弱分` 和 raw `quiz` -> `小测验`。
- [√] Phase 10：本地化 Today Focus Mode 阶段标签，覆盖 `第 1 步` 到 `第 7 步`，不再显示 `Step n`。
- [√] Phase 10：本地化 Weekly 下周建议步骤徽章，覆盖 `第 n 步`，不再显示 `Step n`。
- [√] Phase 10：本地化 Voice 当前笔记和转写区可见标签，覆盖 `已连接 Coach`、`已保存笔记`、`转写文本`，不再显示 `Coach linked`、`Note saved` 或独立标题 `Transcript`。
- [√] Phase 10：本地化 Path 学习路径阶段标签，覆盖 `第 n 阶段` 和 `下一阶段`，不再显示 `Stage n` 或 `Next Stage`。
- [√] Phase 10：本地化 Projects 状态文案，覆盖 `项目任务模式`、`已保存代码`、`已保存反思`、`AI 已评审`、`全部完成` 和 `已完成 N 个项目`，不再显示 `Mission Mode`、`code saved`、`reflection saved`、`AI reviewed`、`all done` 或 `N completed`。
- [√] Phase 10：本地化 `/progress` 本周补弱计划步骤徽章，覆盖 `第 n 步`，不再显示 `Step n`。
- [√] Phase 10：本地化共享成就反馈徽章，覆盖 `复习总结`、`项目进度`、`掌握证据`，不再显示 `Session summary`、`Project progress` 或 `Mastery signal`。
- [√] Phase 10：本地化学习者可见模式徽章和 PWA 今日学习入口，覆盖 `专注模式`、`专注模式进度`、`路径模式` 和 `打开今日专注模式...`，不再在生产 UI 中显示 `Focus Mode` 或 `Path Mode`。
- [√] Phase 10：本地化 Coach 可见标签，覆盖 `Coach 工作区`、`上下文指南针`、`概念问题`、`高优先级` 和 Voice 来源 `代码调试`，不再把 `Tutor Workspace`、`Context Compass`、`conceptual`、`high`、`code_debug` 直接展示给学习者。
- [√] Phase 10：本地化 Today 代码练习反馈标签，覆盖 `反馈已生成`、`部分正确`、`高优先级 / 逻辑问题`，不再把 `feedback_ready`、`partially_correct` 或 `[high/logic]` 直接展示给学习者。
- [√] Phase 10：本地化 Today 活动类型标签，覆盖小测验 `单选题` / `判断题` 和引导步骤 `背景唤醒`，不再把 `single_choice`、`true_false`、`activation` 直接展示给学习者。
- [√] Phase 10：本地化 Review 当前卡片类型标签，覆盖 `概念卡`、`代码反馈卡`、`项目卡`、`错题卡`、`术语卡`，不再把 `code_bug`、`quiz_error` 等 raw card type 直接展示给学习者。
- [√] Phase 10：本地化首页状态和补弱焦点标签，覆盖 `已完成`、`待完成`、`未生成`、`部分正确`、`小测验`，不再把 `planned`、`partially_correct`、`quiz` 等 raw enum/source 直接展示给学习者。
- [√] Phase 10：本地化 Today 今日计划状态、计划来源和广度小卡类型，覆盖 `已完成`、`待完成`、`AI 生成`、`模板兜底`、`人物`、`开源项目`，不再把 `planned`、`deepseek`、`person`、`open_source_project` 等 raw 值直接展示给学习者。
- [√] Phase 10：本地化 Knowledge Map 可见标签，覆盖 Radar 类型、相关课程状态/来源、相关卡片类型、相关错题状态和 `掌握分`，不再把 `open_source_project`、`planned`、`deepseek`、`code_bug`、`open`、`score` 或 `masteryScore` 直接展示给学习者。
- [√] Phase 10：本地化 Radar 可见标签，覆盖实体类型、可信度、核验状态和核验日期，不再把 `open_source_project`、`confidence high`、`verified` 或 `needs_verification` 直接展示给学习者。
- [√] Phase 10：本地化 Library 课程档案可见标签，覆盖课程状态/来源、广度类型、测验题型、代码提交状态和代码反馈结论，不再把 `completed`、`deepseek`、`open_source_project`、`single_choice`、`feedback_ready` 或 `partially_correct` 直接展示给学习者。
- [√] Phase 10：本地化 Notes 笔记模板计划状态，覆盖新建笔记摘要和预填 Markdown，不再把 `completed` / `planned` 写入学习者笔记。
- [√] Phase 10：本地化 `/progress` 趋势徽章，覆盖代码反馈严重度、高频问题类型和错题开放状态，不再显示 `high N`、`open N` 或 raw issue type。
- [√] Phase E：本地化 Badge Shelf 顶部解锁计数，首页和 `/progress` 不再显示英文 `N earned`。
- [√] Phase E：本地化 XP 等级卡可见文案，首页和 `/progress` 不再显示 `Lv.` 或英文等级名。
- [√] Phase 10：补齐 Today 代码练习手机端思路/伪代码/语音解释入口，复用 `/voice?lessonId=...&mode=code_debug`，不新增未接线 mode。
- [√] Phase C：Current Mission 最低优先级兜底改为 `/radar` 轻量广度探索，符合“都完成后推荐 Glossary/Radar”的 guidance。
- [√] Phase E：Current Mission CTA 移动端触控目标补齐 `min-h-11 w-full sm:w-auto`。
- [√] Phase E：Current Mission 顶部任务卡标题本地化为 `当前任务`，`/today`、`/weekly`、`/path` 不再显示 `Current Mission / 当前任务`。
- [√] Phase E：`/progress` 内容质量卡来源本地化，覆盖 `AI 生成`、`模板兜底`、`系统兜底`、`未标记来源`，不再显示 raw `deepseek/template/fallback/unknown`。
- [√] Phase E：`/progress` 内容质量卡代码练习质量本地化，覆盖 `完整练习`、`基础练习`、`暂无练习`、`待评估`，不再显示 raw `strong/basic/missing`。
- [√] Phase E：`/progress` 生成稳定性卡本地化，覆盖 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本`、`未标记`，不再显示 `DeepSeek / fallback`、`success/error`、`repair`、`schema ...` 或 raw `unknown`。
- [√] Phase E：`/progress` 生成稳定性模型分布标签本地化，覆盖 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro`、`AI 模型：未标记`，不再显示 raw `deepseek-v4-flash`、`deepseek-v4-pro` 或 `AI 模型：unknown`。
- [√] Phase E：`/coach` 输入内容必填 badge 本地化为 `必填`，不再显示英文 `required`。
- [√] Phase E：`/coach` 导师反馈 provider badge 本地化为 `AI 生成` / `模板兜底`，不再显示 raw `deepseek/template`。
- [√] Phase E：`/coach` 学习上下文代码反馈结论本地化为 `部分正确`、`需要重写`、`需要更多信息`，不再显示 raw `partially_correct/incorrect/cannot_judge` overall。
- [√] Phase E：`/coach` 表单 `评审模式` 选择框移动端触控高度补齐，接入 `min-h-11`，不再使用旧 `h-10` 小触控目标。
- [√] Phase E：移动端底部导航 More Sheet 路由入口触控高度补齐，核心学习入口链接接入 `min-h-11`。
- [√] Phase E：首页 `今日能量` 三个快捷 CTA 移动端触控目标补齐 `min-h-11 w-full sm:w-auto`。
- [√] Phase E：首页 `常用入口` 每条 `打开` CTA 移动端触控目标补齐 `min-h-11 w-full sm:w-auto`。
- [√] Phase E：共享 `LearningSectionCard` action wrapper 和首页 section header CTA 移动端触控目标补齐。
- [√] Phase E：首页任务卡 `LearningMissionCard` action CTA 移动端触控目标补齐。
- [√] Phase E：Today 完成后 `LearningCompletionCard` CTA 移动端触控目标补齐。
- [√] Phase E：共享 `LearningEmptyState` 空态 action CTA 移动端触控目标补齐。
- [√] Phase E：首页 `DailyQuestCard` 每条任务 CTA 移动端触控目标补齐。
- [√] Phase E：`LearningHabitGoalCard` 轻量学习 CTA 移动端触控目标补齐。
- [√] Phase E：`KnowledgePathExplorer` 学习路径 `下一项` CTA 移动端触控目标补齐。
- [√] Phase E：`LearningFocusPanel` 共享专注模式入口控制按钮移动端触控目标补齐。
- [√] Phase E：E2E smoke 断言对齐本地化 UI，首页断言 `当前任务`，Projects 断言 `项目任务模式`，Coach 断言 `上下文指南针`，不再断言旧 `Current Mission / 当前任务`、`Mission Mode` 或 `Context Compass`。
- [√] Phase E：`TodayQuiz` 每题 `提交答案` CTA 移动端触控目标补齐。
- [√] Phase E：`GuidedSteps` 底部 `上一步`、`下一步`、`保存进度` 控制按钮移动端触控目标补齐。
- [√] Phase E：`GuidedSteps` 内 `显示提示`、`显示参考答案` 展开控制按钮移动端触控目标补齐。
- [√] Phase E：`LearningCodeBlock` 的 `复制代码` CTA 移动端触控目标补齐。
- [√] Phase E：`CodeExercise` 的 `语音解释入口` 和 `保存提交` CTA 移动端触控目标补齐。
- [√] Phase E：`VoiceWorkspaceForm` 的 `开始 60 秒反思`、`清空`、`保存并进入分析` CTA 移动端触控目标补齐。
- [√] Phase E：`ProjectDailyRhythmCard` 的 `选择项目` 和 `继续项目` CTA 移动端触控目标补齐。
- [√] Phase E：`ProjectPortfolioPanel` / `ProjectPortfolioPageContent` 的 `复习项目卡片` 和 `回到项目实践` CTA 移动端触控目标补齐。
- [√] Phase E：`ProjectTemplateList` 的 `开始项目` 和 `打开项目` CTA 移动端触控目标补齐。
- [√] Phase E：`ProjectTemplateList` 项目模板元信息中文化，覆盖 `约 N 小时` 和 `N 个里程碑`。
- [√] Phase E：`ProjectReviewQueuePanel` 的 `复习代码反馈` 和 `复习项目卡片` CTA 移动端触控目标补齐。
- [√] Phase E：`/projects/page.tsx` 页面级 `看进度`、项目复盘 `复习项目卡片`、`生成项目总结` 和 `打开作品集` CTA 移动端触控目标补齐。
- [√] Phase E：`/projects/page.tsx` 今日项目任务表单 `完成里程碑`、`保存草稿`、`保存并评审代码` CTA 移动端触控目标补齐。
- [√] Phase E：`/projects` 当前里程碑代码反馈标签本地化，覆盖 `部分正确`、`已评审`、`高优先级 / 逻辑问题` 和 `代码反馈`。
- [√] Phase E：`ProjectTypeFilter` 项目类型筛选入口移动端触控目标补齐，筛选 chips 不再使用小尺寸 `Badge asChild` 链接模板。
- [√] Phase E：`/radar` 类型筛选入口移动端触控目标补齐，筛选 chips 不再使用小尺寸 `Badge asChild` 链接模板。
- [√] Phase E：`ReviewTrainer` 完成总结底部 `让 Coach 拆解薄弱点` / `回到今日学习` CTA 移动端触控目标补齐。
- [√] Phase E：`/today` 专注模式入口和完整视图 hero `完整视图`、`复习入口`、`查看完整课程内容`、`完成沉淀`、`继续步骤`、`去做小测验`、`完成并生成卡片` CTA 移动端触控目标补齐。
- [√] Phase E：`/notes` 新建笔记 `去今日学习`、`看课程档案`、`保存笔记` CTA 移动端触控目标补齐。
- [√] Phase E：`/notes` 新建笔记 `标题` 输入框移动端触控高度补齐。
- [√] Phase E：`/library` 课程详情 `课程下一步` 和 `写笔记` CTA 移动端触控目标补齐。
- [√] Phase E：`/library` 筛选区 `切换 test`、`切换 archived`、`清空筛选` 和 `应用筛选` CTA 移动端触控目标补齐。
- [√] Phase E：`/library` 筛选表单 `source`、`schemaVersion`、`status`、`localDate` 输入框移动端触控高度补齐。
- [√] Phase E：`/library` 筛选表单 placeholder 增加中文业务含义，同时保留可输入 raw 值。
- [√] Phase E：`/library` 筛选表单可见字段名显示 `来源`、`内容版本`、`状态`、`日期`，不再显示裸 `source`、`schemaVersion`、`status`、`localDate`。
- [√] Phase E：`/library` 测试/归档计划标签本地化为 `测试计划` / `已归档`，筛选 CTA 本地化为 `切换测试计划` / `切换归档计划`，不再显示 raw `test` / `archived`。
- [√] Phase E：`/radar` 顶部复习、筛选搜索、关系卡片链复习、生成复习卡片和复制详情入口 CTA 移动端触控目标补齐。
- [√] Phase E：`/map` 顶部强弱领域摘要卡 `查看领域` 和 disabled `暂无信号` CTA 移动端触控目标补齐。
- [√] Phase E：`/glossary` 顶部复习、检索搜索、相关术语链复习、生成复习卡片和复制详情入口 CTA 移动端触控目标补齐。
- [√] Phase E：`/glossary` 和 `/radar` 检索输入框移动端触控高度补齐。
- [√] Phase E：Voice 学习流水线 `当前最优动作` CTA 移动端触控目标补齐。
- [√] Phase E：`/voice` 页面级 `打开 Coach` 和右侧学习链路 `去复习` CTA 移动端触控目标补齐。
- [√] Phase E：`/map` 领域详情底部 `生成下一节` CTA 移动端触控目标补齐。
- [√] Phase E：`/map` 领域详情 `相关课程` 每条课程入口移动端触控目标补齐。
- [√] Phase E：`/mistakes` 页面级 `打开 Coach`、修复策略卡 `去复习` 和筛选表单 `搜索错题` CTA 移动端触控目标补齐。
- [√] Phase E：`/path` 路线图阶段卡行动 CTA 移动端触控目标补齐。
- [√] Phase E：`/path` 路线图当前信号项目完成指标本地化为 `项目里程碑`，不再显示英文 `milestone`。
- [√] Phase E：`/progress` 最近完成、开放错题、最近代码反馈、最近思路评审和最近项目实践列表入口移动端触控目标补齐。
- [√] Phase E：`/weekly` 下周建议步骤入口移动端触控目标补齐。
- [√] Phase E：`/settings` 保存学习偏好 CTA 移动端触控目标补齐。
- [√] Phase E：`/settings` 学习偏好单行输入框移动端触控高度补齐。
- [√] Phase E：`/settings` 系统卡 `NODE_ENV` 缺省值本地化为 `未标记环境`，不再显示裸 `unknown` fallback。
- [√] Phase E：`/settings` 目标输入默认文案本地化为 `系统化学习 AI 和工程实践`，不再把内部默认 slug `ai_general` 直接展示给学习者。
- [√] Phase E：`/login` 访问密码、邮箱 Magic Link 和 Demo 入口 CTA 移动端触控目标补齐。
- [√] Phase E：`/login` 访问密码和邮箱输入框移动端触控高度补齐。
- [√] Phase E：`/projects` 今日项目任务表单 `lessonId`、`noteId` 和 `代码语言` 单行输入框移动端触控高度补齐。
- [√] Phase E：`/coach` 提交、查看课程、生成卡片、复习 Coach 卡片、Quick Links 和最近评审入口移动端触控目标补齐。
- [√] Phase E：`/review` 页头 `开始复习` CTA 移动端触控目标补齐。
- [√] Phase E：`/review` 复习统计累计记录文案本地化为 `累计复习记录`，不再显示数据库模型名 `ReviewLog`。
- [√] Phase E：`/today` 页头 `生成今日内容` CTA 移动端触控目标补齐。
- [√] Phase E：`/today` 今日术语 `查看术语库` 和今日广度小卡 `查看 Radar` CTA 移动端触控目标补齐。
- [√] Phase E：`/today` 今日广度小卡可信度标签本地化为 `可信度：高/中/低`，不再显示 raw `high/medium/low`。
- [√] Phase E：Voice 录音状态、自动转写入口和 autofill notice 的学习者可见 `Transcript` 文案本地化为 `转写文本`。
- [√] Phase E：Voice interaction E2E 转写输入 locator 对齐中文可访问名称 `语音转写文本`，不再用旧英文 `getByLabel("Transcript")`。
- [√] Phase E：Voice 手动转写状态面板 badge 统一显示 `需手动整理`，不再显示缩写式 `需手动`。
- [√] Phase E：Voice 模式选择框移动端触控高度补齐，`语音笔记模式` select 接入 `min-h-11`，不再使用旧 `h-9` 小触控目标。
- [√] Phase E：Voice 6 个反思模板入口移动端触控高度补齐，模板按钮接入 `min-h-11`，不再使用旧小触控卡片 class。
- [√] Phase E：`/voice` 最近语音笔记列表每条回看入口移动端触控高度补齐，列表链接接入 `min-h-11`。
- [√] Phase E：`/map` 领域详情复习日志可见文案本地化为 `复习记录`，不再显示数据库模型名 `ReviewLog`。
- [√] Phase E：`/map` 领域列表每条领域入口移动端触控高度补齐，领域列表 Link 接入 `min-h-11`。
- [√] Phase E：`/map` 领域详情底部 `下一步建议` 的 `优先补` 领域链接移动端触控高度补齐，next focus Link 接入 `inline-flex min-h-11`。
- [√] Phase E：`/glossary` 和 `/radar` 详情来源外链移动端触控高度补齐，来源外链接入 `inline-flex min-h-11`。
- [√] Phase E：`/admin` 来源核验队列每条审核项标题链接移动端触控高度补齐，来源核验 Link 接入 `inline-flex min-h-11`。
- [√] Phase E：`/admin` 最近每日计划 `查看课程` / `审计链路` 链接移动端触控高度补齐，最近计划维护链接接入 `inline-flex min-h-11`。
- [√] Phase E：`TodayRemediationBanner` 的 `先回到主课`、`生成补弱小课`、`继续复习` CTA 移动端单列触控目标补齐。
- [√] Phase E：`LearningFocusPlayer` 右侧 `完整视图` actions 区移动端单列布局补齐。
- [√] Phase E：`/today` 反思完成表单 `标记完成并生成卡片` / `已完成` 提交按钮移动端触控目标补齐。
- [√] Phase E：`/voice` 上传音频 input 和手动 `自动转写到 Transcript` action 行移动端触控目标补齐。
- [√] Phase E：`/mistakes` 搜索输入框移动端触控高度补齐。
- [√] Phase E：`/mistakes` 状态、来源、类型筛选 chips 移动端触控目标补齐，手机端单列全宽，桌面端保持横向 wrap。
- [√] Phase E：`/library` 课程详情缺省领域/主题本地化为 `未标记领域` / `未标记主题`，不再显示 raw `unknown`。
- [√] Phase E：`/library` 课程列表和详情内容版本本地化为 `内容版本：...` / `内容版本：未标记`，不再显示裸 `schema ...` 或 `-` fallback。
- [√] Phase E：`/library` 活跃筛选摘要本地化为 `来源：...`、`内容版本：...`、`状态：...`、`日期：...`，不再显示 raw `source:`、`schema:`、`status:` 或 `date:`。
- [√] Phase E：`/progress` 概览卡片内部模型名本地化为 `以完成学习日为准（用户时区日期）` 和 `复习记录：N`，不再显示 `DailyPlan.completed` 或 `ReviewLog`。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `互动实验` 课程块协议，让主课可以生成小探索任务。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `图示` 课程块协议，让主课可以生成可画的心智图提示。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `重点` 课程块协议，让主课可以把关键记忆点从正文中抬出来。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `自测卡` 课程块协议，让主课检索练习变成可见自测卡。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `例子卡` 课程块协议，让主课类比和具体例子变成可见课程卡。
- [√] Phase 4.4：补齐 `LearningMarkdown` 和 daily prompt 的 `代码/伪代码` 课程块协议，让主课算法草图变成可见课程卡。
- [√] Phase E：`/progress` 最近代码反馈 provider 本地化为 `AI 生成` / `模板兜底` 等中文来源，不再显示 raw `deepseek` / `template`。
- [√] Phase E：Current Mission 未解决误区无 focus 兜底文案本地化为 `N 个未解决误区`，不再显示英文 `open misconception`。
- [√] Phase E：`/admin` 最近生成任务失败重试按钮移动端触控目标补齐。
- [√] Phase E：`/settings` 水平、难度和语言选项显示中文业务标签，同时保留既有 profile raw value 提交契约。
- [√] Phase E：`/projects` 项目模板难度 badge 显示 `入门`、`进阶`、`高阶`，不再把 `beginner`、`intermediate`、`advanced` 作为学习者可见文案直出。
- [√] Phase E：`/projects` 我的项目列表每个项目入口接入 `min-h-11`，补齐移动端触控目标。
- [√] Phase E：`/projects` 项目和里程碑 `planned` 状态显示 `待开始`，不再把 raw `planned` 作为学习者可见文案直出。
- [√] Phase E：`/projects` 项目作品集相关知识 badge 显示 `倒排索引`、`文件读写` 等中文业务标签，不再把 raw `inverted-index`、`file-io` 作为学习者可见文案直出。
- [√] Phase E：`/projects` 项目作品集导出 Markdown 的 `相关知识` 行显示 `倒排索引, 文件读写` 等中文业务标签，不再把 raw `inverted-index, file-io` 写入可复制成果。
- [√] Phase E：`/today` 代码反馈 provider 显示 `系统生成` 等中文来源标签，不再把 raw `fallback` 作为学习者可见文案直出。
- [√] Phase E：`/today` 代码练习语言标签显示 `代码语言：Python`，不再显示字段式 `language：python`，隐藏 input 仍保留 raw `python` 提交契约。
- [√] Phase E：术语分类标签显示 `Agent`、`检索增强`、`微调` 等业务文案，不再在 `/glossary`、Today 术语卡或 `/radar` 关系卡片链里直出 raw `agent`、`retrieval`、`fine-tuning`。
- [√] Phase E：`/glossary` 术语详情难度 badge 显示 `入门`、`进阶`、`高阶` 或 `难度未标记`，不再把 raw `beginner`、`intermediate`、`advanced` 作为学习者可见文案直出。
- [√] Phase E：`/library` 课程详情结构化代码反馈来源显示 `反馈来源：AI 生成` / `模板兜底` / `系统生成`，不再把 raw provider 作为学习者可见文案直出。
- [√] Phase E：`/library` 课程详情复习卡片元信息显示 `到期：... / 复习次数：...`，不再把 `due:` / `reviews:` 作为学习者可见文案直出。
- [√] 运行目标测试、lint、全量单测、审查脚本、visual、build。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前按用户要求已快速收尾到 `0.344.0`：Library Flashcard Metadata Label Localization 已完成 RED/GREEN、相关回归、覆盖扫描、`git diff --check`、lint、全量单测和 build；Aegis helper 已执行并失败于已知 Markdown-only 结构债。不要继续扩新切片。本轮只改 `/library` 读侧复习卡片元信息文案、源码级 UI 测试和文档记录，不触碰 `Flashcard.dueAt`、`Flashcard.reviewCount`、复习排程、课程查询、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/library` 课程详情复习卡片里的英文式元信息对学习者的干扰；用户已要求尽快收尾，因此不再扩新切片。
- Compatibility：不新增迁移，不触碰生产，不改变 `Flashcard.dueAt`、`Flashcard.reviewCount` 数据契约、复习排程、课程查询、Preview Mode 只读边界或数据库；只改变读侧 flashcard metadata 展示、源码级测试和文档记录。
- New fallback/owner：未新增外部 owner、adapter 或服务 fallback；复习卡片 owner 不变，页面展示仍归 `src/app/library/page.tsx`。
- Retirement：旧的可见 `due: {c.dueAt...} / reviews: {c.reviewCount}` 模板已退役；英文旧文案只保留在测试反向断言和历史证据说明中。
- Decision：complete-local; Phase E Library Flashcard Metadata Label Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描、最终本地门禁和 build；Aegis helper 失败仍归类为既有结构债。

## Active Slice

本地 Learning Desire + Learning Effect guidance 快速收尾切片：Library Flashcard Metadata Label Localization。`src/app/library/page.tsx` 将课程详情复习卡片元信息从 `due: ... / reviews: ...` 改为 `到期：... / 复习次数：...`。本切片只改 `/library` 读侧展示、源码级 UI 测试和文档记录，不触碰复习数据契约、复习排程、课程查询、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

## Evidence Refs

- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Flashcard Metadata Label Localization RED 首次失败于 `/library` 复习卡片仍显示 `due:` / `reviews:`；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 62 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- `rg -n "Library Flashcard Metadata|0\\.344\\.0|到期：\\{c\\.dueAt\\.toISOString\\(\\)\\.slice\\(0, 10\\)\\}|复习次数：|due: \\{c\\.dueAt|reviews:" ...`：覆盖扫描确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；生产源码只保留新的 `到期` / `复习次数` 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Flashcard Metadata Label Localization 本地收尾门禁通过；全量单测 434 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper `bundle` / `check` 仍失败于已知 Markdown-only 结构债，缺 `task-intent-draft.json` 且当前和历史 work markdown 未索引；该结果不是产品 UI 验证失败。

## Previous Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前按用户要求已快速收尾到 `0.343.0`：Library Code Feedback Provider Label Localization 已完成 RED/GREEN、相关回归、覆盖扫描、`git diff --check`、lint、全量单测和 build；Aegis helper 已执行并失败于已知 Markdown-only 结构债。不要继续扩新切片。本轮只改 `/library` 读侧结构化代码反馈来源文案、源码级 UI 测试和文档记录，不触碰 `CodeFeedback.provider`、反馈生成、课程查询、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Previous Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/library` 课程详情代码反馈里的 raw provider 对学习者的干扰；用户已要求尽快收尾，因此不再扩新切片。
- Compatibility：不新增迁移，不触碰生产，不改变 `CodeFeedback.provider` 数据契约、反馈生成、课程查询、Preview Mode 只读边界或数据库；只改变读侧 provider 展示、源码级测试和文档记录。
- New fallback/owner：未新增外部 owner、adapter 或服务 fallback；来源标签继续复用 `src/app/_lib/home-labels.ts` 的 `formatTodayPlanSourceLabel()`，Library 页面 owner 不变。
- Retirement：旧的可见 `反馈：{feedback.provider}` 模板已退役；raw provider 只保留在数据契约、测试输入、helper 映射和历史证据说明中。
- Decision：complete-local; Phase E Library Code Feedback Provider Label Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描、最终本地门禁和 build；Aegis helper 失败仍归类为既有结构债。

## Previous Active Slice

本地 Learning Desire + Learning Effect guidance 快速收尾切片：Library Code Feedback Provider Label Localization。`src/app/library/page.tsx` 将结构化代码反馈来源从 `反馈：{feedback.provider}` 改为 `反馈来源：{formatTodayPlanSourceLabel(feedback.provider)}`。本切片只改 `/library` 读侧展示、源码级 UI 测试和文档记录，不触碰 `CodeFeedback.provider`、反馈生成、课程查询、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

## Previous Evidence Refs

- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Code Feedback Provider Label Localization RED 首次失败于 `/library` 缺少 `反馈来源：{formatTodayPlanSourceLabel(feedback.provider)}`；GREEN 后 8 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 61 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- `rg -n "Library Code Feedback Provider|0\\.343\\.0|反馈来源：\\{formatTodayPlanSourceLabel\\(feedback\\.provider\\)\\}|反馈：\\{feedback\\.provider\\}|CodeFeedback\\.provider|raw provider" ...`：覆盖扫描确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；生产源码只保留新的 `反馈来源` 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Code Feedback Provider Label Localization 本地收尾门禁通过；全量单测 433 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- Aegis helper `bundle` / `check` 仍失败于已知 Markdown-only 结构债，缺 `task-intent-draft.json` 且当前和历史 work markdown 未索引；该结果不是产品 UI 验证失败。

## Previous Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.340.0` Library Filter Field Label Localization 已完成 RED/GREEN、相关回归、覆盖扫描、`git diff --check`、lint、全量单测和 build；Aegis helper 已执行并失败于已知 Markdown-only 结构债。本轮只改 `/library` 筛选表单读侧字段名、Library 可见标签测试和文档记录，不触碰筛选解析、query 参数契约、课程列表、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找 guidance 中可本地关闭的小优化点，尤其学习者可见 raw label、移动端触控和学习入口弱证据点。

## Previous Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/library` 课程档案筛选区裸参数名对学习者的干扰。
- Compatibility：不新增迁移，不触碰生产，不改变 `normalizeLibraryPlanFilters()`、`buildLibraryPlanWhere()`、URL query 参数契约、课程列表、Preview Mode 只读边界或数据库；只改变读侧筛选字段 label、Library 可见标签测试和文档记录。
- New fallback/owner：未新增外部 owner、adapter 或服务 fallback；Library 筛选 owner 不变，仍归 `src/app/library/page.tsx` 和 `src/server/library/plan-filter.ts`。
- Retirement：旧的可见 raw `source` / `schemaVersion` / `status` / `localDate` 字段名模板已退役；raw 参数名只保留在 input `name`、query 契约、placeholder 说明和测试断言中。
- Decision：continue; Phase E Library Filter Field Label Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描、最终本地门禁和 build；Aegis helper 已执行并失败于已知结构债。下一步继续寻找 guidance 中可本地关闭的小优化点。

## Active Slice

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Library Filter Field Label Localization。`src/app/library/page.tsx` 的筛选表单可见字段名从 raw 参数名改为 `来源`、`内容版本`、`状态`、`日期`，同时 input `name` 继续保留 `source`、`schemaVersion`、`status`、`localDate`。本切片只改 `/library` 筛选表单读侧字段名、Library 可见标签测试和文档记录，不触碰筛选解析、query 参数契约、课程列表、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

## Evidence Refs

- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Filter Field Label Localization RED 首次失败于 `/library` 筛选字段仍显示 raw `source`；GREEN 后 8 tests 通过，覆盖中文字段名并确认 raw input name 不变。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Library Filter Field Label Localization 相关回归 61 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- `rg -n 'Library Filter Field Label|0\\.340\\.0|来源</span>|内容版本</span>|状态</span>|日期</span>|name="source"|name="schemaVersion"|name="status"|name="localDate"|raw input name|裸 source' ...`：覆盖扫描确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认 `/library` 生产源码不再显示旧 raw 字段名模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Filter Field Label Localization 本地收尾门禁通过；全量单测 431 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `rg -n "Today Code Feedback Provider|0\\.338\\.0|formatTodayPlanSourceLabel\\(feedback\\.provider\\)|\\{feedback\\.provider\\}|fallback / 部分正确|系统生成" ...`：覆盖扫描确认源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认生产源码不再通过 `{feedback.provider}` 或 `fallback / 部分正确` 直出旧 provider 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Today Code Feedback Provider Label Localization 本地收尾门禁通过；全量单测 430 tests 通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/projects.test.ts`：Phase E Projects Portfolio Markdown Related Topic Label Localization RED 首次因 `portfolioMarkdown` 仍输出 raw `- 相关知识：inverted-index, file-io` 失败；GREEN 后 16 tests 通过，且 `relatedTopics` 原始数组仍保持 raw slug。
- `npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Projects Portfolio Markdown Related Topic Label Localization 相关回归 73 tests 通过，覆盖项目服务、Projects UI、Today 完成后项目推荐和共享学习 UI。
- `rg -n "relatedTopics\\.join\\(\\\", \\\"\\)|- 相关知识：inverted-index, file-io|\\$\\{args\\.relatedTopics\\.join" src/server/projects/base.ts tests/unit/projects.test.ts`：窄扫只命中测试反向断言，服务层不再通过 `relatedTopics.join(", ")` 直出 raw slug。

## Phase E Today Code Feedback Provider Label Localization

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Today Code Feedback Provider Label Localization。`src/app/today/ui/code-exercise.tsx` 的代码反馈头部从直出 `feedback.provider` 改为复用 `formatTodayPlanSourceLabel(feedback.provider)`，让 fallback provider 显示为 `系统生成`。本切片只改 `/today` 代码练习读侧 provider 文案、源码级 UI 测试和文档记录，不触碰 `CodeFeedback.provider` 数据契约、代码反馈生成逻辑、提交保存、Preview 写保护、数据库、生产/SSH/部署/密钥。

- `npm test -- tests/unit/today-code-exercise.test.ts`：Phase E Today Code Feedback Provider Label Localization 目标测试 2 tests 通过，覆盖 provider 为 `fallback` 时显示 `系统生成`，并阻止 raw `fallback`、`feedback_ready`、`partially_correct` 和 `[high/logic]` 回退。
- `npm test -- tests/unit/today-code-exercise.test.ts tests/unit/today-activity-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 64 tests 通过，覆盖 Today 代码练习、Today 活动标签、Progress、Library 标签和共享学习 UI。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.338.0` Today Code Feedback Provider Label Localization 已完成目标测试、相关回归、覆盖扫描、`git diff --check`、lint、全量单测和 build；Aegis helper 已执行并失败于已知 Markdown-only 结构债。本切片只改 `/today` 代码练习读侧 provider 文案、源码级 UI 测试和文档，不触碰 `CodeFeedback.provider` 数据契约、代码反馈生成逻辑、提交保存、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/today` 代码反馈头部 raw provider 泄露，让反馈来源和其他学习者可见来源标签一致。
- Compatibility：不新增迁移，不触碰生产，不改变 `CodeFeedback.provider` 数据契约、代码反馈生成逻辑、提交保存、Preview Mode 只读边界或数据库；只改变读侧 provider 展示、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Today 代码练习展示 owner 不变，页面组件仍归 `src/app/today/ui/code-exercise.tsx`。
- Retirement：旧的 `{feedback.provider}` 可见直出模板已退役；raw `fallback` 只保留在测试输入、反向断言和历史证据说明中。
- Decision：continue; Phase E Today Code Feedback Provider Label Localization 已完成产品级目标测试、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Portfolio Markdown Related Topic Label Localization 本地收尾门禁通过；全量单测 430 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Portfolio Related Topic Label Localization RED 首次因作品集相关知识 badge 仍直显 raw `inverted-index` / `file-io` 失败；GREEN 后 23 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Projects Portfolio Related Topic Label Localization 相关回归 73 tests 通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `rg -n "Project Portfolio Related Topic|Portfolio Related Topic|projectTopicLabels|formatProjectRelatedTopicLabel|倒排索引|文件读写|0\\.335\\.0|related topic|相关知识标签" ...`：覆盖扫描确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n ">inverted-index<|>file-io<|\\{topic\\}" src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts`：窄扫只命中测试反向断言和 `Badge key={topic}`，生产渲染不再使用 `{topic}` 直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Portfolio Related Topic Label Localization 本地收尾门禁通过；全量单测 430 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Planned Status Label Localization RED 首次因 planned 项目和里程碑状态仍直显 raw `planned` 失败；GREEN 后 23 tests 通过，覆盖 planned 项目列表、当前任务 brief、里程碑路线和旧 raw 状态反向断言。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Projects Planned Status Label Localization 相关回归 73 tests 通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `rg -n "Phase E Projects Planned Status|Projects Planned Status Label|0\\.334\\.0|planned.*待开始|待开始|project workspace localizes planned|missionStatusText\\(status\\)|raw planned" ...`：覆盖扫描确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；本次重跑未触发 shell 反引号误执行。
- `rg -n ">planned<|/ planned|\\{missionStatusText\\([^)]*\\)\\}|status === \\\"planned\\\"" src/app/projects/ui/project-mission-workspace.tsx src/app/projects/page.tsx`：窄扫只命中 `missionStatusText()` helper 和正常调用，未发现 `>planned<` 或 `/ planned` 可见直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Planned Status Label Localization 本地收尾门禁通过；全量单测 430 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/settings-profile.test.ts`：Phase E Settings Goal Default Copy Localization RED 首次因 `/settings` 缺少 `defaultSettingsGoalText` 和 `formatSettingsGoalInputValue()`，且目标输入仍显示 `placeholder="例如：ai_general"` / `profile.goal ?? "ai_general"` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Settings Goal Default Copy Localization 相关回归 46 tests 通过，覆盖 Settings 表单、Auth/Preview 写保护、Daily Plan prompt 和共享学习 UI。
- `rg -n "Settings Goal Default Copy|defaultSettingsGoalText|formatSettingsGoalInputValue|系统化学习 AI 和工程实践|0\\.330\\.0|ai_general" ...`：覆盖扫描确认源码、测试、UI checklist、Settings 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "placeholder=\\\"例如：ai_general\\\"|defaultValue=\\{profile\\.goal \\?\\? \\\"ai_general\\\"\\}" src/app/settings/page.tsx`：无匹配，确认 `/settings` 生产组件不再直出旧目标输入默认模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Settings Goal Default Copy Localization 本地收尾门禁通过；全量单测 425 tests 通过，Next 构建生成 28 个页面，路由表包含 `/settings`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Generation Model Label Localization RED 首次因生成稳定性卡缺少 `AI 模型：DeepSeek Flash` 失败；GREEN 后 24 tests 通过，覆盖 `AI 模型：DeepSeek Flash`、`AI 模型：DeepSeek Pro`、`AI 模型：未标记`，并阻止 raw `deepseek-v4-flash`、`deepseek-v4-pro` 和 `AI 模型：unknown` 回归。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Progress Generation Model Label Localization 相关回归 62 tests 通过，覆盖 Progress、每日生成质量、首页标签、Library 标签和共享学习 UI。
- `rg -n "Progress Generation Model Label|generationModelLabel|AI 模型：DeepSeek Flash|AI 模型：DeepSeek Pro|AI 模型：未标记|0\\.329\\.0|deepseek-v4-flash|AI 模型：unknown" ...`：覆盖扫描确认源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "\\{row\\.model\\}: \\{row\\.count\\}|AI 模型：unknown|deepseek-v4-flash:|deepseek-v4-pro:" src/app/progress/analytics-panels.tsx`：无匹配，确认 `/progress` 生产组件不再直出旧 raw model 分布模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Generation Model Label Localization 本地收尾门禁通过；全量单测 424 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Type Filter Mobile Touch Targets RED 首次因 `ProjectTypeFilter` 仍渲染 `h-5` Badge 链接且缺少 `min-h-11` 失败；GREEN 后 19 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Projects Type Filter Mobile Touch Targets 相关回归 69 tests 通过，覆盖 Projects UI、项目服务规则、Today 完成后项目推荐和共享学习 UI。
- `rg -n "Phase E Projects Type Filter|projectTypeFilterLinkClassName|0\\.325\\.0|项目类型筛选入口|Badge asChild" ...`：覆盖扫描确认源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "<Badge key=\\{item\\.href\\} asChild|data-slot=\\\"badge\\\" data-variant|inline-flex h-5 w-fit" src/app/projects/ui/project-mission-workspace.tsx tests/unit/project-mission-workspace.test.ts`：无匹配，确认 Projects 类型筛选不再使用旧小尺寸 Badge 链接模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Type Filter Mobile Touch Targets 本地收尾门禁通过；全量单测 421 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Recent Plan Link Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminRecentPlanLinkClassName` 且最近计划链接仍使用旧小触控 inline class 失败；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Recent Plan Link Mobile Touch Targets 相关回归 41 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "Phase E Admin Recent Plan Link|adminRecentPlanLinkClassName|最近每日计划|0\\.313\\.0|inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Generation Quality 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\"text-xs text-primary underline underline-offset-2\"" src/app/admin/page.tsx`：无匹配，确认旧最近计划小触控 inline class 不再存在于 `/admin` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Recent Plan Link Mobile Touch Targets 本地收尾门禁通过；全量单测 409 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个当前和既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Knowledge Verification Link Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminKnowledgeVerificationLinkClassName` 且来源核验队列标题链接仍使用旧小触控 inline class 失败；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Knowledge Verification Link Mobile Touch Targets 相关回归 40 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "Phase E Admin Knowledge Verification Link|adminKnowledgeVerificationLinkClassName|来源核验队列|0\\.312\\.0|inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2" ...`：Phase E Admin Knowledge Verification Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "className=\"font-medium text-primary underline underline-offset-2\"" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再使用旧来源核验队列小触控 inline class。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Knowledge Verification Link Mobile Touch Targets 本地收尾门禁通过；全量单测 408 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map Next Focus Link Mobile Touch Targets RED 首次因 `/map` 缺少 `mapNextFocusLinkClassName` 且 `优先补` 领域链接仍使用旧小触控 inline class 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts`：Phase E Knowledge Map Next Focus Link Mobile Touch Targets 相关回归 88 tests 通过，覆盖 Knowledge Map、首页标签、Today、Glossary/Radar、共享学习 UI 和 Progress。
- `rg -n "Phase E Knowledge Map Next Focus Link|mapNextFocusLinkClassName|优先补|0\\.311\\.0|inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2" ...`：Phase E Knowledge Map Next Focus Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "className=\"font-medium text-primary underline underline-offset-2\"" src/app/map/page.tsx`：无匹配，确认 `/map` 生产源码不再使用旧 next focus 小触控 inline class。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Knowledge Map Next Focus Link Mobile Touch Targets 本地收尾门禁通过；全量单测 407 tests 通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Knowledge Source External Link Mobile Touch Targets RED 首次因 `/glossary` 缺少 `glossarySourceLinkClassName` 且来源外链仍使用旧纯文本下划线小触控 class 失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Knowledge Source External Link Mobile Touch Targets 相关回归 63 tests 通过，覆盖 Glossary/Radar、Knowledge Map、Today、首页标签和共享学习 UI。
- `rg -n "Phase E Knowledge Source External Link|glossarySourceLinkClassName|radarSourceLinkClassName|来源外链|0\\.310\\.0|inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline" ...`：Phase E Knowledge Source External Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis checkpoint 均接入本切片。
- `rg -n "className=\"text-primary underline-offset-4 hover:underline\"" src/app/glossary/page.tsx src/app/radar/page.tsx`：无匹配，确认 `/glossary` 与 `/radar` 生产源码不再使用旧来源外链小触控 class。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Knowledge Source External Link Mobile Touch Targets 本地收尾门禁通过；全量单测 406 tests 通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map Domain Link Mobile Touch Targets RED 首次因 `/map` 缺少 `mapDomainLinkClassName` 且领域列表 Link 仍使用旧小触控 inline class 失败；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts`：Phase E Knowledge Map Domain Link Mobile Touch Targets 相关回归 86 tests 通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 回归。
- `rg -n "Phase E Knowledge Map Domain Link|mapDomainLinkClassName|领域列表每条领域入口|0\\.309\\.0|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors" ...`：Phase E Knowledge Map Domain Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "\"rounded-md border px-3 py-2 text-sm transition-colors\",\\s*active \\?" src/app/map/page.tsx`：无匹配，确认 `/map` 生产源码不再使用旧领域列表小触控 inline class。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Knowledge Map Domain Link Mobile Touch Targets 本地收尾门禁通过；全量单测 405 tests 通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map ReviewLog Copy Localization RED 首次因 `/map` 领域详情仍显示 `ReviewLog：{stat.reviewLogCount}` 失败；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts`：Phase E Knowledge Map ReviewLog Copy Localization 相关回归 85 tests 通过，覆盖 Knowledge Map 标签、首页/Today 标签、Glossary/Radar、共享学习 UI 和 Progress 复习记录文案。
- `rg -n "Phase E Knowledge Map ReviewLog|复习记录：\\{stat\\.reviewLogCount\\}|ReviewLog：\\{stat\\.reviewLogCount\\}|掌握分 = 完成课程 \\* 10 \\+ 复习记录 \\* 2|掌握分 = 完成课程 \\* 10 \\+ ReviewLog \\* 2|0\\.308\\.0" ...`：Phase E Knowledge Map ReviewLog Copy Localization 覆盖扫描确认源码、测试、UI checklist、Knowledge Map 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "ReviewLog：\\{stat\\.reviewLogCount\\}|掌握分 = 完成课程 \\* 10 \\+ ReviewLog \\* 2" src/app/map/page.tsx`：无匹配，确认 `/map` 生产源码不再直出旧 `ReviewLog` 可见模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Knowledge Map ReviewLog Copy Localization 本地收尾门禁通过；全量单测 404 tests 通过，Next 构建生成 28 个页面，路由表包含 `/map`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Recent Note Link Mobile Touch Targets RED 首次因 `/voice` 缺少 `voiceRecentNoteLinkClassName` 且最近语音笔记链接仍使用旧小触控 inline class 失败；GREEN 后 15 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Recent Note Link Mobile Touch Targets 相关回归 75 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff、Review queue 和共享学习 UI。
- `rg -n "Phase E Voice Recent Note|voiceRecentNoteLinkClassName|最近语音笔记|0\\.307\\.0|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors" ...`：Phase E Voice Recent Note Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "className=\\{\\[\\s*\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\"|className=\\{cn\\(\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\"" src/app/voice/page.tsx`：无匹配，确认 `/voice` 生产源码不再使用旧 inline 小触控 class。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Recent Note Link Mobile Touch Targets 本地收尾门禁通过；全量单测 403 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Summary Internal Model Copy Localization RED 首次因 `/progress` 仍显示旧 `以 DailyPlan.completed 为准` 和 `ReviewLog：{reviewLogsCount}` 失败；GREEN 后 24 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts`：Phase E Progress Summary Internal Model Copy Localization 相关回归 69 tests 通过，覆盖 Progress、首页标签、共享学习 UI、Review summary、Knowledge Map 和 Weekly。
- `rg -n "以完成学习日为准|复习记录：\\{reviewLogsCount\\}|以 DailyPlan\\.completed 为准|ReviewLog：\\{reviewLogsCount\\}|Phase E Progress Summary Internal|0\\.306\\.0" ...`：覆盖扫描确认 `/progress` 生产源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Summary Internal Model Copy Localization 本地收尾门禁通过；全量单测 402 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Review Total Record Copy Localization RED 首次因 `/review` 仍显示旧 `累计 ReviewLog` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-schedule.test.ts tests/unit/review-filter.test.ts`：Phase E Review Total Record Copy Localization 相关回归 36 tests 通过，覆盖 Review UI、完成 summary、复习调度和队列过滤。
- `rg -n "累计复习记录|累计 ReviewLog|Phase E Review Total Record|0\\.305\\.0" ...`：覆盖扫描确认 `/review` 生产源码、测试、UI checklist、Review 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Review Total Record Copy Localization 本地收尾门禁通过；全量单测 401 tests 通过，Next 构建生成 28 个页面，路由表包含 `/review`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map Related Lesson Link Mobile Touch Targets RED 首次因 `/map` 缺少 `mapRelatedLessonLinkClassName`，且领域详情 `相关课程` Link 仍使用旧 `rounded-md border px-3 py-2 transition-colors hover:bg-muted/50` 小触控模板失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts`：Phase E Knowledge Map Related Lesson Link Mobile Touch Targets 相关回归 64 tests 通过，覆盖 Knowledge Map、Library、Today、首页标签、共享学习 UI 和 Glossary/Radar 知识路径。
- `rg -n "Phase E Knowledge Map Related Lesson|mapRelatedLessonLinkClassName|相关课程|领域详情.*相关课程|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.296\\.0" ...`：Phase E Knowledge Map Related Lesson Link Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/50\"" src/app/map/page.tsx`：无匹配，确认 `/map` 生产源码不再直出旧相关课程小触控模板。
- `npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts`：Phase E Current Mission Misconception Fallback Localization RED 首次因 `next-best-action` 仍输出 `你还有 2 个 open misconception...` 失败；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts tests/unit/today-code-exercise.test.ts tests/unit/coach-workspace.test.ts`：Phase E Current Mission Misconception Fallback Localization 相关回归 41 tests 通过，覆盖 Current Mission、Next Best Action、首页标签、学习动机、Today 代码入口和 Coach 回归。
- `rg -n "open misconception" src/app src/components src/server/learning --glob '!src/app/admin/**'`：无匹配，确认学习者页面和 learning server 当前不再直出该英文兜底。
- `rg -n "open misconception|未解决误区|Current Mission Misconception|0\\.279\\.0|让 Coach 处理未解决误区" ...`：Phase E Current Mission Misconception Fallback Localization 覆盖扫描确认源码、测试、UI checklist、Current Mission 模块文档、CHANGELOG 和 Aegis 记录均接入未解决误区兜底中文化要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Current Mission Misconception Fallback Localization 本地收尾门禁通过；全量单测 384 tests 通过，Next 构建生成 28 个页面，路由表包含 `/`、`/coach` 和 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Recent Code Feedback Provider Label Localization RED 首次因缺少 `formatTodayPlanSourceLabel(f.provider)` 失败；GREEN 后 21 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/coach-workspace.test.ts tests/unit/map-analytics.test.ts`：Phase E Progress Recent Code Feedback Provider Label Localization 相关回归 57 tests 通过，覆盖 Progress、首页标签 helper、Today、Library、Coach 和 Knowledge Map 相关来源/状态标签回归。
- `rg -n "formatTodayPlanSourceLabel\\(f\\.provider\\)|\\{f\\.provider\\}|Progress Recent Code Feedback Provider|最近代码反馈 provider|0\\.278\\.0|AI 生成|模板兜底" ...`：Phase E Progress Recent Code Feedback Provider Label Localization 覆盖扫描确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入 provider 中文化要求。
- `rg -n "<Badge variant=\"outline\">\\s*\\{f\\.provider\\}|\\{f\\.provider\\}\\s*\\{f\\.overall|\\{f\\.provider\\}" src/app/progress/page.tsx`：无匹配，确认 `/progress` 生产源码不再直出旧 `{f.provider}` badge 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Recent Code Feedback Provider Label Localization 本地收尾门禁通过；全量单测 383 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Audit Empty/Detail Copy Localization RED 首次因缺少 Admin 审计空态/详情中文 helper 失败；补充最近生成任务 `{j.status}` 断言后再次 RED，GREEN 后 11 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Audit Empty/Detail Copy Localization 相关回归 39 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Audit Empty/Detail Copy Localization 本地收尾门禁通过；全量单测 383 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Content Version Label Localization RED 首次因缺少 `formatLibraryPlanSchemaVersionLabel()` 且 `/library` 仍显示旧 `schema ...` 模板失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Library Content Version Label Localization 相关回归 58 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- `rg -n "schema \\{p\\.schemaVersion|schema \\$\\{planForLesson\\.schemaVersion|schema \\{.*schemaVersion|schema \\$\\{.*schemaVersion|内容版本：" src/app/library/page.tsx tests/unit/library-page-labels.test.ts`：Phase E Library Content Version Label Localization 窄扫确认 `/library` 生产源码不再直出旧 `schema ...` 展示模板，只保留新的 `内容版本` helper。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Content Version Label Localization 本地收尾门禁通过；全量单测 383 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Active Filter Summary Localization GREEN 后 5 tests 通过，覆盖 `/library` 活跃筛选摘要接入 `来源：{formatTodayPlanSourceLabel(filters.source)}`、`内容版本：{filters.schemaVersion}`、`状态：{formatHomeDailyPlanStatusLabel(filters.status)}`、`日期：{filters.localDate}`，并阻止旧 raw badge 模板回归。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Library Active Filter Summary Localization 相关回归 57 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes 和 Today 完成后沉淀链路。
- `rg -n "来源：\\{formatTodayPlanSourceLabel\\(filters\\.source\\)\\}|内容版本：\\{filters\\.schemaVersion\\}|状态：\\{formatHomeDailyPlanStatusLabel\\(filters\\.status\\)\\}|日期：\\{filters\\.localDate\\}|source: \\{filters\\.source\\}|status: \\{filters\\.status\\}|schema: \\{filters\\.schemaVersion\\}|date: \\{filters\\.localDate\\}|Library Active Filter" ...`：Phase E Library Active Filter Summary Localization 覆盖扫描确认源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入活跃筛选摘要中文化要求。
- `rg -n "<Badge variant=\"outline\">source: \\{filters\\.source\\}|<Badge variant=\"outline\">status: \\{filters\\.status\\}|<Badge variant=\"outline\">schema: \\{filters\\.schemaVersion\\}|<Badge variant=\"outline\">date: \\{filters\\.localDate\\}" src/app/library/page.tsx`：无匹配，确认 `/library` 生产源码不再直出旧 raw 活跃筛选 badge。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Active Filter Summary Localization 本地收尾门禁通过；全量单测 387 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/mistakes-view.test.ts`：Phase E Mistakes Filter Chip Mobile Touch Targets RED 首次因缺少 `mistakeFilterCtaClassName` 失败；GREEN 后 12 tests 通过，覆盖三组筛选 chips 移动端单列全宽触控目标。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Mistakes Filter Chip Mobile Touch Targets 相关回归 52 tests 通过，覆盖 Mistakes 筛选、Preview 写保护、Review 补弱、Today 补弱和共享学习 UI。
- `rg -n "mistakeFilterCtaClassName|mistakeFilterRowClassName|statusOptions\\.map|sourceOptions\\.map|kindOptions\\.map|Phase E Mistakes Filter Chip|筛选 chips|flex flex-wrap gap-2" ...`：Phase E Mistakes Filter Chip Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、Mistakes 模块文档、CHANGELOG 和 Aegis 记录均接入筛选 chips 触控要求。
- `rg -n "<div className=\"flex flex-wrap gap-2\">\\s*\\{(statusOptions|sourceOptions|kindOptions)\\.map" src/app/mistakes/page.tsx`：无匹配，确认 `/mistakes` 生产源码筛选区不再使用旧移动端横向 chips 行。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Mistakes Filter Chip Mobile Touch Targets 本地收尾门禁通过；全量单测 388 tests 通过，Next 构建生成 28 个页面，路由表包含 `/mistakes`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Audit Heading Localization RED 首次因 `/admin` 仍显示 `Generation` 等旧英文标题失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Audit Heading Localization 相关回归 38 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Audit Heading Localization 本地收尾门禁通过；全量单测 382 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `rg -n ">DailyPlan<|>Lesson<|>Generation<|>Consistency checks<|>CurriculumDecisionLog<|>Planner input summary|最近 DailyPlan（10）|最近 AiGenerationJob（10）|>Planner input<" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再直出本切片旧英文标题。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Page Schema Label Localization RED 首次因缺少 `adminSchemaVersionLabel()` 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Page Schema Label Localization 相关回归 37 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Page Schema Label Localization 本地收尾门禁通过；全量单测 381 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `npm test -- tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Prompt Studio Schema Version Label Localization RED 首次因 Prompt Studio 仍显示旧 `schema 2.3`、`schema 2.2`、`schema -` 模板失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/admin-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：Phase E Admin Prompt Studio Schema Version Label Localization 相关回归 19 tests 通过，覆盖 Prompt Studio、内容审查、Admin 标签和每日生成质量队列。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Prompt Studio Schema Version Label Localization 本地收尾门禁通过；全量单测 381 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `rg -n "Prompt Studio|Schema 版本：|schema 2\\.3|schema 2\\.2|schema -|formatPromptStudioSchemaVersionLabel|0\\.273\\.0|Prompt Studio Schema" ...`：覆盖扫描确认 Prompt Studio 源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入 schema 版本标签中文化；旧 `schema ...` 模板只保留在测试反向断言和历史证据文本中。
- `rg -n "schema 2\\.3|schema 2\\.2|schema -|schema \\{summary\\.currentSchemaVersion\\}|schema \\{item\\.schemaVersion" src/app/admin/ui/prompt-studio-card.tsx`：无匹配，确认 Prompt Studio 生产组件不再直出旧 schema 版本模板。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Schema Label Localization RED 首次因 `/today` 仍显示旧 `schema` 标签和 `-` fallback 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts`：Phase E Today Schema Label Localization 相关回归 42 tests 通过，覆盖 Today 标签、共享学习 UI、阶段状态、完成后下一步和首页标签 helper。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Today Schema Label Localization 本地收尾门禁通过；全量单测 381 tests 通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- `rg -n "内容版本|未标记|schema|plan\\.schemaVersion \\?\\? \"-\"|0\\.272\\.0|Today Schema" ...`：覆盖扫描确认 `/today` 源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入内容版本中文化；旧 `schema`/`-` 模板只保留在测试反向断言和历史证据文本中。
- `rg -n "\\{ label: \"schema\"|<span className=\"text-muted-foreground\">schema</span>|plan\\.schemaVersion \\?\\? \"-\"" src/app/today/page.tsx`：无匹配，确认 `/today` 生产源码不再直出旧 schema 标签或 `-` fallback。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Data Overview Metadata Label Localization RED 首次因 `/admin` 数据概览仍显示旧元信息标签失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Data Overview Metadata Label Localization 相关回归 37 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Data Overview Metadata Label Localization 本地收尾门禁通过；全量单测 381 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Data Overview Entity Label Localization RED 首次因 `/admin` 缺少 `数据概览（当前用户）`、`用户档案`、`每日计划`、`复习记录` 和 `笔记` 失败；GREEN 后 6 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Data Overview Entity Label Localization 相关回归 34 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "数据概览（当前用户）|用户档案|每日计划|复习记录|笔记|UserProfile:|DailyPlan:|ReviewLog:|Note:|0\\.268\\.0|Admin Data Overview" ...`：覆盖扫描确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入数据概览实体标签中文化；旧实体名只保留在测试反向断言和历史证据文本中。
- `rg -n "数据概览（当前 user）|>UserProfile:|>DailyPlan:|>ReviewLog:|>Note:" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再直出旧数据概览实体文案。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Data Overview Entity Label Localization 本地收尾门禁通过；全量单测 378 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Today Loop Plan Status Localization RED 首次因 `/admin` 今日闭环仍可能显示 raw `plan ? plan.status : "none"` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Today Loop Plan Status Localization 相关回归 35 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Today Loop Plan Status Localization 本地收尾门禁通过；全量单测 379 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Today Loop Action Copy Localization RED 首次因 `/admin` 今日闭环仍显示旧英文/混合操作文案失败；GREEN 后 8 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Today Loop Action Copy Localization 相关回归 36 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Today Loop Action Copy Localization 本地收尾门禁通过；全量单测 380 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Flashcard Label Localization RED 首次因 `/admin` 缺少 `复习卡片`、`到期复习卡片`、`最近复习卡片（10）`、`到期：` 和 `复习次数：` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Flashcard Label Localization 相关回归 33 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "复习卡片|到期复习卡片|最近复习卡片|Flashcard:|Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount|0\\.267\\.0|Admin Flashcard" ...`：覆盖扫描确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入复习卡片文案中文化；旧 Flashcard/due/reviews 文案只保留在测试反向断言和历史证据文本中。
- `rg -n ">Flashcard:|>Due Flashcard:|最近 Flashcard|due: \\{c\\.dueAt|reviews: \\{c\\.reviewCount" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再直出旧英文卡片文案。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Flashcard Label Localization 本地收尾门禁通过；全量单测 377 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Login Shell Title Localization RED 首次因 `/admin` 未登录 shell 缺少 `管理员登录` 且仍存在 `Admin Login` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Login Shell Title Localization 相关回归 32 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "管理员登录|Admin Login|0\\.266\\.0|Admin Login Shell" ...`：覆盖扫描确认 `/admin` 生产源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入未登录标题中文化；旧 `Admin Login` 只保留在测试反向断言和历史证据文本中。
- `rg -n "Admin Login" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再直出旧英文标题。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Login Shell Title Localization 本地收尾门禁通过；全量单测 376 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Auth Status Label Localization RED 首次因 `/admin` 缺少 `Admin 认证` 且仍存在 `Admin Auth: ok/required` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Auth Status Label Localization 相关回归 31 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "Admin 认证|已登录|需要登录|Admin Auth|authed \\? \"ok\" : \"required\"|0\\.265\\.0|Admin Auth Status" ...`：覆盖扫描确认 `/admin` 生产源码显示 `Admin 认证：已登录/需要登录`；旧 `Admin Auth` 只保留在测试反向断言里。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Auth Status Label Localization 本地收尾门禁通过；全量单测 375 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Prompt Studio Status Reason Label Localization RED 首次因 Prompt Studio 仍直出 raw note/status/reason 失败；GREEN 后 3 tests 通过，覆盖 `成功`、`失败`、`错误`、`可测试`、`等待样例`、`最近兜底 / 修复样例` 和旧 raw note 清洗。
- `npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/admin-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：Phase E Admin Prompt Studio Status Reason Label Localization 相关回归 12 tests 通过，覆盖 Prompt Studio、内容审查、Admin 标签和每日生成质量队列。
- `rg -n 'Prompt Studio|手动修复测试|最近兜底 / 修复样例|formatPromptStudioJobStatusLabel|formatPromptStudioFallbackReasonLabel|formatManualRepairNote|>success<|>failed<|>ready<|>fallback<|>repair<|>rawPrimary<|>quality-warning<|最近 fallback / repair 样例|手动 repair 测试|repair prompt' src/app/admin/ui/prompt-studio-card.tsx src/server/admin/prompt-studio.ts tests/unit/admin-prompt-studio.test.ts`：覆盖扫描确认生产组件已走中文 helper；剩余 raw 搜索词只在测试反向断言、旧 raw fixture 或展示层清洗函数里保留。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Prompt Studio Status Reason Label Localization 本地收尾门禁通过；全量单测 374 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Generation Stability Copy Localization RED 首次因生成稳定性卡仍渲染 `DeepSeek / fallback` 失败；GREEN 后 21 tests 通过，覆盖 `AI 生成 / 兜底生成`、`兜底率`、`生成任务`、`成功/失败，修复率`、`Schema 版本`、`未标记`，并阻止旧英文技术标签回归。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：Phase E Progress Generation Stability Copy Localization 相关回归 27 tests 通过，覆盖 Progress analytics、首页标签 helper 和每日生成质量队列。
- `rg -n 'Progress Generation Stability|schemaVersionLabel|AI 生成 / 兜底生成|兜底率|生成任务|成功/失败，修复率|Schema 版本|未标记|0\\.257\\.0|生成稳定性卡|DeepSeek / fallback|success/error|repair|raw `unknown`' ...`：Phase E Progress Generation Stability Copy Localization 覆盖扫描确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入生成稳定性中文化要求。
- `rg -n 'DeepSeek / fallback|fallback \\$\\{|fallback 50%|生成 job|success/error|repair \\$\\{|schema \\{row\\.schemaVersion\\}:|schema 2\\.3|Schema 版本 unknown|覆盖 \\$\\{props\\.generationHealth\\.qualityScoreCoverage\\} 个 job' src/app/progress/analytics-panels.tsx`：无匹配，确认 `/progress` 生产组件不再直出旧生成稳定性英文技术模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Generation Stability Copy Localization 本地收尾门禁通过；全量单测 368 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Code Feedback Overall Label Localization RED 首次因 `/coach` 缺少 `formatHomeCodeFeedbackOverallLabel(f.overall)` 且仍拼接 raw `f.overall` 失败；GREEN 后 14 tests 通过，覆盖 code feedback context subtitle 复用中文 label helper，并阻止 raw overall 回归。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Code Feedback Overall Label Localization 相关回归 53 tests 通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress code/thought-review 标签和 Library code/thought-review 标签。
- `rg -n 'Coach Code Feedback Overall|formatHomeCodeFeedbackOverallLabel\\(f\\.overall\\)|\\[f\\.localDate, f\\.overall\\]\\.filter\\(Boolean\\)\\.join\\(" / "\\)|0\\.260\\.0|代码反馈结论|raw overall|partially_correct|incorrect|cannot_judge' ...`：Phase E Coach Code Feedback Overall Label Localization 覆盖扫描确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入代码反馈结论中文化要求。
- `rg -n '\\[f\\.localDate, f\\.overall\\]\\.filter\\(Boolean\\)\\.join\\(" / "\\)|\\$\\{f\\.overall\\}|>partially_correct<|>incorrect<|>cannot_judge<' src/app/coach/page.tsx`：无匹配，确认 `/coach` 生产源码不再直出旧 raw code feedback overall 模板。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Lesson Domain Topic Unknown Label Localization RED 首次因 `/library` 缺少 `formatLibraryPlanDomainLabel()` / `formatLibraryPlanTopicLabel()`，且课程详情仍使用 `planForLesson.selectedDomain ?? "unknown"` / `planForLesson.selectedTopic ?? "unknown"` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Library Lesson Domain Topic Unknown Label Localization 相关回归 27 tests 通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- `rg -n 'Library Lesson Domain|formatLibraryPlanDomainLabel|formatLibraryPlanTopicLabel|未标记领域|未标记主题|selectedDomain \\?\\? "unknown"|selectedTopic \\?\\? "unknown"|0\\.261\\.0|课程领域|课程主题|raw domain|raw topic' ...`：Phase E Library Lesson Domain Topic Unknown Label Localization 覆盖扫描确认 `/library` 源码、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入领域/主题缺省中文化要求。
- `rg -n 'planForLesson\\.selectedDomain \\?\\? "unknown"|planForLesson\\.selectedTopic \\?\\? "unknown"|>unknown<|\\{planForLesson\\.selectedDomain\\}|\\{planForLesson\\.selectedTopic\\}' src/app/library/page.tsx`：无匹配，确认 `/library` 生产源码不再直出旧 raw unknown 领域/主题模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Lesson Domain Topic Unknown Label Localization 本地收尾门禁通过；全量单测 372 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Plan Governance Label Localization RED 首次因 `/library` 仍缺少 `显示测试计划` / `切换测试计划` / `测试计划` / `已归档` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Library Plan Governance Label Localization 相关回归 28 tests 通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes 模板和 Today 完成后沉淀链路。
- `rg -n '切换 test|切换 archived|显示 test|隐藏 test|显示 archived|隐藏 archived|>test<|>archived<|<Badge variant="outline">test</Badge>|<Badge variant="outline">archived</Badge>' src/app/library/page.tsx`：无匹配，确认 `/library` 生产源码不再直出旧 raw 测试/归档计划文案。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Plan Governance Label Localization 本地收尾门禁通过；全量单测 373 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `npm test -- tests/unit/voice-capture-status.test.ts`：Phase E Voice Manual Required Status Badge Localization RED 首次因 Voice 捕获状态面板仍返回 `需手动` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Manual Required Status Badge Localization 相关回归 66 tests 通过，覆盖 Voice 捕获状态、Voice 页面、转写自动填入、转写服务、Coach handoff 和共享学习组件。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Manual Required Status Badge Localization 本地收尾门禁通过；全量单测 374 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Required Badge Localization RED 首次因 `/coach` 仍渲染 `<LearningStatusBadge tone="info">required</LearningStatusBadge>` 失败；GREEN 后 12 tests 通过，覆盖 `输入内容` badge 显示 `必填`，并阻止旧英文 `required` 回归。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Required Badge Localization 相关回归 51 tests 通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- `rg -n 'Coach Required Badge|<LearningStatusBadge tone="info">必填</LearningStatusBadge>|<LearningStatusBadge tone="info">required</LearningStatusBadge>|0\\.258\\.0|输入内容必填|输入内容.*必填|`必填`|`required`' ...`：Phase E Coach Required Badge Localization 覆盖扫描确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis evidence 均接入输入内容必填 badge 中文化要求。
- `rg -n '<LearningStatusBadge tone="info">required</LearningStatusBadge>|>required<|required</LearningStatusBadge>' src/app/coach/page.tsx`：无匹配，确认 `/coach` 生产源码不再直出旧英文必填 badge。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach Required Badge Localization 本地收尾门禁通过；全量单测 369 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Review Provider Badge Localization RED 首次因 `/coach` 仍直出 `{review.provider ?? "template"}` 失败；GREEN 后 13 tests 通过，覆盖 provider badge 复用 `formatTodayPlanSourceLabel(review.provider ?? "template")`，并阻止 raw provider 回归。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Review Provider Badge Localization 相关回归 52 tests 通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- `rg -n 'Coach Review Provider|formatTodayPlanSourceLabel\\(review\\.provider \\?\\? "template"\\)|\\{review\\.provider \\?\\? "template"\\}|0\\.259\\.0|导师反馈.*provider|provider badge|AI 生成|模板兜底|raw provider|deepseek / template|raw `deepseek`' ...`：Phase E Coach Review Provider Badge Localization 覆盖扫描确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis evidence 均接入 provider badge 中文化要求。
- `rg -n '\\{review\\.provider \\?\\? "template"\\}|>deepseek<|>template<' src/app/coach/page.tsx`：无匹配，确认 `/coach` 生产源码不再直出旧 raw provider badge。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach Review Provider Badge Localization 本地收尾门禁通过；全量单测 370 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Content Quality Coding Exercise Label Localization RED 首次因内容质量卡仍渲染 `代码练习：strong` 失败；GREEN 后 20 tests 通过，覆盖 `完整练习`、`基础练习`、`暂无练习`、`待评估`，并阻止 `strong/basic/missing` 作为学习者可见代码练习质量回归。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：Phase E Progress Content Quality Coding Exercise Label Localization 相关回归 26 tests 通过，覆盖 Progress analytics、首页来源标签 helper 和每日生成质量队列。
- `rg -n 'Progress Content Quality Coding|contentQualityCodingExerciseLabel|代码练习：完整练习|代码练习：基础练习|代码练习：暂无练习|代码练习：待评估|0\\.256\\.0|代码练习质量|raw coding quality' ...`：Phase E Progress Content Quality Coding Exercise Label Localization 覆盖扫描确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入代码练习质量中文化要求。
- `rg -n '代码练习：\\{latestQuality\\.metrics\\.codingExerciseQuality\\}|代码练习：strong|代码练习：basic|代码练习：missing' src/app/progress/analytics-panels.tsx`：无匹配，确认 `/progress` 生产组件不再直出旧 raw coding quality 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Content Quality Coding Exercise Label Localization 本地收尾门禁通过；全量单测 367 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Content Quality Source Label Localization RED 首次因内容质量卡仍渲染 `来源：deepseek` 失败；GREEN 后 19 tests 通过，覆盖 `AI 生成`、`模板兜底`、`系统兜底`、`未标记来源`，并阻止 `deepseek/template/fallback/unknown` 作为学习者可见来源回归。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/daily-generation-quality.test.ts`：Phase E Progress Content Quality Source Label Localization 相关回归 25 tests 通过，覆盖 Progress analytics、首页来源标签 helper 和每日生成质量队列。
- `rg -n 'Progress Content Quality Source|contentQualitySourceLabel|来源：AI 生成|来源：模板兜底|来源：系统兜底|来源：未标记来源|0\\.255\\.0|内容质量卡来源|raw ...' ...`：Phase E Progress Content Quality Source Label Localization 覆盖扫描确认 `/progress` 源码、测试、UI checklist、Learning Analytics 模块文档、CHANGELOG 和 Aegis 记录均接入内容质量来源中文化要求。
- `rg -n '来源：\\{latestQuality\\.metrics\\.source|source \\?\\? "unknown"|来源：deepseek|来源：template|来源：fallback|来源：unknown' src/app/progress/analytics-panels.tsx`：无匹配，确认 `/progress` 生产组件不再直出旧 raw source 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Content Quality Source Label Localization 本地收尾门禁通过；全量单测 366 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-path.test.ts`：Phase E Path Header Badge Localization RED 首次因 `/path` 页头仍为 `badge="Path"` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Path Header Badge Localization 相关回归 52 tests 通过，覆盖 Path、Weekly、Mistakes、Auth/Preview 和共享学习 UI。
- `rg -n 'Path Header Badge|badge="学习路径"|badge="Path"|0\\.247\\.0|学习路径页头' ...`：Phase E Path Header Badge Localization 覆盖扫描确认 `/path` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/path/page.tsx` 中 `badge="Path"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Path Header Badge Localization 收尾门禁通过；全量单测 359 tests 通过，Next 构建生成 28 个页面，路由表包含 `/path`。
- `npm test -- tests/unit/mistakes-view.test.ts`：Phase E Mistakes Header Badge Localization RED 首次因 `/mistakes` 页头仍为 `badge="Mistakes"` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Mistakes Header Badge Localization 相关回归 51 tests 通过，覆盖 Mistakes、Auth/Preview、Review remediation、Today remediation 和共享学习 UI。
- `rg -n 'Mistakes Header Badge|badge="错题修复"|badge="Mistakes"|0\\.248\\.0|错题修复页头|Mistakes Header Badge Localization' ...`：Phase E Mistakes Header Badge Localization 覆盖扫描确认 `/mistakes` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/mistakes/page.tsx` 中 `badge="Mistakes"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Mistakes Header Badge Localization 收尾门禁通过；全量单测 360 tests 通过，Next 构建生成 28 个页面，路由表包含 `/mistakes`。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase E Weekly Header Badge Localization RED 首次因 `/weekly` 页头仍为 `badge="Weekly"` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`：Phase E Weekly Header Badge Localization 相关回归 48 tests 通过，覆盖 Weekly、Path、Mistakes 和 Auth/Preview 路由边界。
- `rg -n 'Weekly Header Badge|badge="每周复盘"|badge="Weekly"|0\\.249\\.0|每周复盘页头' ...`：Phase E Weekly Header Badge Localization 覆盖扫描确认 `/weekly` 源码、测试、UI checklist、Weekly 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/weekly/page.tsx` 中 `badge="Weekly"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Weekly Header Badge Localization 本地收尾门禁通过；全量单测 360 tests 通过，Next 构建生成 28 个页面，路由表包含 `/weekly`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Header Badge Localization RED 首次因 `/voice` 页头仍为 `badge="Voice"` 失败；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Header Badge Localization 相关回归 58 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `rg -n 'Voice Header Badge|badge="语音捕获"|badge="Voice"|0\\.250\\.0|语音捕获页头' ...`：Phase E Voice Header Badge Localization 覆盖扫描确认 `/voice` 源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/voice/page.tsx` 中 `badge="Voice"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Header Badge Localization 本地收尾门禁通过；全量单测 361 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Header Badge Localization RED 首次因 `/projects` 页头仍为 `badge="Mission"` 失败；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Projects Header Badge Localization 相关回归 43 tests 通过，覆盖 Projects UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n 'Projects Header Badge|badge="项目实践"|badge="Mission"|0\\.251\\.0|项目实践页头' ...`：Phase E Projects Header Badge Localization 覆盖扫描确认 `/projects` 源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/projects/page.tsx` 中 `badge="Mission"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Header Badge Localization 本地收尾门禁通过；全量单测 362 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/projects`。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Header Badge Localization RED 首次因 `/coach` 页头仍为 `badge="Coach"` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Header Badge Localization 相关回归 47 tests 通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress thought-review 标签和 Library thought-review 标签。
- `rg -n 'Coach Header Badge|badge="思路评审"|badge="Coach"|0\\.252\\.0|思路评审页头' ...`：Phase E Coach Header Badge Localization 覆盖扫描确认 `/coach` 源码、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/coach/page.tsx` 中 `badge="Coach"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach Header Badge Localization 本地收尾门禁通过；全量单测 363 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/coach`。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Header Badge Localization RED 首次因 `/admin` 两处页头仍为 `badge="DEV"` 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Header Badge Localization 相关回归 30 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n 'Admin Header Badge|badge="开发运维"|badge="DEV"|0\\.253\\.0|开发运维页头' ...`：Phase E Admin Header Badge Localization 覆盖扫描确认 `/admin` 源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/admin/page.tsx` 中 `badge="DEV"` 无匹配。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Header Badge Localization 本地收尾门禁通过；全量单测 364 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/admin`。
- `npm test -- tests/unit/current-mission.test.ts`：Phase E Current Mission Heading Localization RED 首次因共享默认标题仍渲染 `Current Mission / 当前任务`，且 `/today`、`/weekly`、`/path` 仍显式传入旧标题失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/today-activity-labels.test.ts`：Phase E Current Mission Heading Localization 相关回归 51 tests 通过，覆盖 Current Mission、Next Best Action、首页标签、共享学习 UI、Weekly、Path 和 Today 活动标签。
- `rg -n 'Current Mission / 当前任务|title="当前任务"|0\\.254\\.0|当前任务标题|Phase E Current Mission Heading' ...`：Phase E Current Mission Heading Localization 覆盖扫描确认源码、测试、UI checklist、Current Mission/Weekly/Path 模块文档、CHANGELOG 和 Aegis 记录均接入标题中文化要求。
- `rg -n 'Current Mission / 当前任务' src/app src/components`、`rg -n 'title="Current Mission / 当前任务"' src/app/today/page.tsx src/app/weekly/page.tsx src/app/path/page.tsx src/components/learning/current-mission-card.tsx`：均无匹配，确认生产源码不再直出旧混合标题。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Current Mission Heading Localization 本地收尾门禁通过；全量单测 365 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/today`、`/weekly` 和 `/path`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin DailyPlan Status Source Localization RED 首次因 `/admin` 未接入 `formatHomeDailyPlanStatusLabel` / `formatTodayPlanSourceLabel`，且仍可能直出 `planned`、`completed`、`deepseek`、`template`、`unknown`；GREEN 后 1 test 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts`：Phase E Admin DailyPlan Status Source Localization 相关回归 19 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio 和内容审查队列。
- `rg -n "Admin DailyPlan Status Source|formatHomeDailyPlanStatusLabel|formatTodayPlanSourceLabel|归档所有测试计划|归档未来待完成计划|待完成|已完成|AI 生成|模板兜底|后台重建|0\\.246\\.0" ...`：Phase E Admin DailyPlan Status Source Localization 覆盖扫描确认 `/admin` 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入 DailyPlan 状态/来源中文化要求。
- `rg -n "test 计划|planned 计划|unknown domain|<span>\\{g\\.status\\}</span>|<span>\\{g\\.source \\?\\? \\\"unknown\\\"\\}</span>|\\{planAudit\\.chain\\.plan\\.status\\}|\\{planAudit\\.chain\\.plan\\.source \\?\\? \\\"unknown\\\"\\}|\\{item\\.status\\}|\\{item\\.source \\?\\? \\\"unknown\\\"\\}|\\{p\\.status\\}|\\{p\\.source \\?\\? \\\"unknown\\\"\\}" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再直出旧 raw DailyPlan 状态/来源模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin DailyPlan Status Source Localization 收尾门禁通过；全量单测 359 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Plan Governance Label Localization RED 首次因 `/admin` 仍显示可见 `test`、`official`、`archived` 标签失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Plan Governance Label Localization 相关回归 16 tests 通过，覆盖 Admin 计划治理、审计链路、审计异常、planner 可见性和 Prompt Studio。
- `rg -n "Admin Plan Governance Label|adminPlanFilterLabel|adminPlanKindLabel|adminPlanActivationLabel|正式计划状态|来源 / schema|设为正式|激活历史|暂无激活记录|>test<|>official<|>archived<|0\\.245\\.0" ...`：Phase E Admin Plan Governance Label Localization 覆盖扫描确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入计划治理标签中文化要求。
- `rg -n ">test<|>official<|>archived<|\\? \\"test\\" : \\"official\\"| / archived|Badge variant=\\"outline\\">test|Badge variant=\\"outline\\">archived" src/app/admin/page.tsx`：无匹配，确认 `/admin` 生产源码不再以可见 JSX 直出 `test`、`official`、`archived` 计划治理状态。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Plan Governance Label Localization 收尾门禁通过；全量单测 359 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Transcription Result Detail Label Localization RED 首次因 `VoiceCapture` 缺少 `formatVoiceTranscriptionProviderLabel(lastResult.provider)` / `formatVoiceTranscriptionResultNote(lastResult)`，且仍显示 `provider:` / `model:` / `reason:`；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Transcription Result Detail Label Localization 相关回归 57 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `npm run lint`、`npm test`、`npm run build`：Phase E Voice Transcription Result Detail Label Localization 本地门禁通过；全量单测 357 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `rg -n "Phase E Voice Transcription Result Detail|formatVoiceTranscriptionProviderLabel\\(lastResult\\.provider\\)|formatVoiceTranscriptionResultNote\\(lastResult\\)|..." ...`：Phase E Voice Transcription Result Detail Label Localization 覆盖扫描确认 `/voice` 捕获组件、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入转写结果详情本地化要求。
- `rg -n "provider: \\{lastResult\\.provider\\}|reason: \\{lastResult\\.reason\\}|model: \\$\\{lastResult\\.model\\}|>provider:|>reason:|>model:" src/app/voice/ui/voice-capture.tsx`：无匹配，确认生产 UI 不再直接显示 provider/model/reason 技术标签。
- `git diff --check`：通过，确认文档补丁后无 whitespace 问题。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Transcription Result Status Label Localization RED 首次因 `VoiceCapture` 缺少 `formatVoiceTranscriptionResultStatusLabel(lastResult.status)` 且仍直接渲染 `{lastResult.status}` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Transcription Result Status Label Localization 相关回归 56 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `npm run lint`、`npm test`、`npm run build`：Phase E Voice Transcription Result Status Label Localization 本地门禁通过；全量单测 356 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `rg -n "Phase E Voice Transcription Result|formatVoiceTranscriptionResultStatusLabel\\(lastResult\\.status\\)|formatVoiceTranscriptionResultStatusLabel|转写成功|需手动整理|\\{lastResult\\.status\\}|manual_required|0\\.240\\.0" ...`：Phase E Voice Transcription Result Status Label Localization 覆盖扫描确认 `/voice` 捕获组件、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入转写结果状态本地化要求；生产组件中 `manual_required` 仅保留在类型/数据赋值，badge 显示已走 helper。
- `rg -n "\\{lastResult\\.status\\}|>manual_required<|>success<" src/app/voice/ui/voice-capture.tsx`：无匹配，确认生产 UI 不再直接显示 raw 转写状态。
- `git diff --check`：通过，确认文档补丁后无 whitespace 问题。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Voice Pipeline Current Action CTA RED 首次因 `当前最优动作` 区仍是横向 `flex flex-wrap`，且 `复习这 3 张语音卡片` 仍是 `h-7` 小按钮失败；GREEN 后 23 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Review Page Header CTA Mobile Touch Targets RED 首次因 `/review/page.tsx` 缺少 `reviewPageCtaClassName` 且页头 `开始复习` 未接入 `min-h-11 w-full sm:w-auto` 失败；GREEN 后 24 tests 通过。
- `npm test -- tests/unit/review-empty-state.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts`：Phase E Review Page Header CTA 相关回归 8 tests 通过，覆盖 Review 空态、完成总结、评分幂等和排期规则。
- `rg -n "Phase E Review Page Header|reviewPageCtaClassName|开始复习|min-h-11 w-full sm:w-auto|Review Page Header CTA Mobile Touch Targets" ...`：Phase E Review Page Header CTA 覆盖扫描确认 `/review` 源码、测试、UI checklist、CHANGELOG、Review 模块文档和 Aegis 记录均接入页头 `开始复习` 移动触控要求。
- `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build`：Phase E Review Page Header CTA 收尾门禁通过；全量单测 341 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/review`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Knowledge Card CTA RED 首次因 `查看术语库` / `查看 Radar` 未接入 `todayFocusCtaClassName` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/knowledge-base.test.ts`：Phase E Today Knowledge Card CTA 相关回归 54 tests 通过，覆盖 Today 知识卡入口、共享学习 UI、阶段状态、完成后行动和 Glossary/Radar 知识库。
- `rg -n "Phase E Today Knowledge Card|todayFocusCtaClassName|查看术语库|查看 Radar|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...`：Phase E Today Knowledge Card CTA 覆盖扫描确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入知识卡 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build`：Phase E Today Knowledge Card CTA 收尾门禁通过；全量单测 342 tests 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/glossary` 和 `/radar`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Header Generate CTA RED 首次因页头 `生成今日内容` 缺少 `todayFocusCtaClassName` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/knowledge-base.test.ts`：Phase E Today Header Generate CTA 相关回归 54 tests 通过，覆盖 Today 页头生成入口、共享学习 UI、阶段状态、完成后行动和 Glossary/Radar 知识库。
- `rg -n "Phase E Today Header Generate|todayFocusCtaClassName|生成今日内容|min-h-11 w-full sm:w-auto|Today Header Generate CTA Mobile Touch Targets" ...`：Phase E Today Header Generate CTA 覆盖扫描确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入页头生成入口移动触控要求。
- `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build`：Phase E Today Header Generate CTA 收尾门禁通过；全量单测 343 tests 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/today` 和 `/map`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map Next Lesson CTA RED 首次因 `/map` 缺少 `mapPageCtaClassName`，且底部 `生成下一节` 未接入移动端大触控 class 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Knowledge Map Next Lesson CTA 相关回归 55 tests 通过，覆盖 Knowledge Map、首页标签、Today、知识库路径和共享学习 UI。
- `rg -n "Phase E Knowledge Map Next Lesson|mapPageCtaClassName|生成下一节|min-h-11 w-full sm:w-auto|Knowledge Map Next Lesson CTA Mobile Touch Targets" ...`：Phase E Knowledge Map Next Lesson CTA 覆盖扫描确认 `/map` 源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入下一课 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、全量 `npm test`、`npm run build`：Phase E Knowledge Map Next Lesson CTA 收尾门禁通过；全量单测 343 tests 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/map` 和 `/today`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：Phase E Voice Pipeline Current Action CTA 相关回归 43 tests 通过，覆盖 Voice pipeline、Voice Note、录音状态和 Coach handoff。
- `rg -n "Phase E Voice Pipeline Current Action|当前最优动作|mobileCtaClassName|复习这 3 张语音卡片|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between" ...`：Phase E Voice Pipeline Current Action CTA 覆盖扫描确认 Voice pipeline 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入当前最优动作 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Voice Pipeline Current Action CTA 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Page CTA Mobile Touch Targets RED 首次因 `/voice/page.tsx` 缺少 `voicePageCtaClassName`，且 header `打开 Coach` 和右侧学习链路 `去复习` 未接入移动端大触控 class 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Page CTA Mobile Touch Targets 相关回归 49 tests 通过，覆盖 Voice 页面、录音状态、转写、Coach handoff 和共享学习 UI。
- `rg -n "Phase E Voice Page CTA|voicePageCtaClassName|打开 Coach|去复习|min-h-11 w-full sm:w-auto|Voice Page CTA Mobile Touch Targets" ...`：Phase E Voice Page CTA Mobile Touch Targets 覆盖扫描确认 `/voice` 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入页面级 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Voice Page CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/mistakes-view.test.ts`：Phase E Mistakes Page CTA Mobile Touch Targets RED 首次因 `/mistakes/page.tsx` 缺少 `mistakePageCtaClassName`，且 `打开 Coach`、`去复习`、`搜索错题` 未接入移动端大触控 class 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Mistakes Page CTA Mobile Touch Targets 相关回归 47 tests 通过，覆盖 `/mistakes` 页面级 CTA、修复动作、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI。
- `rg -n "Phase E Mistakes Page CTA|mistakePageCtaClassName|打开 Coach|去复习|搜索错题|min-h-11 w-full sm:w-auto|Mistakes Page CTA Mobile Touch Targets" ...`：Phase E Mistakes Page CTA Mobile Touch Targets 覆盖扫描确认 `/mistakes` 源码、测试、UI checklist、CHANGELOG、Mistakes 模块文档和 Aegis 记录均接入页面级 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Mistakes Page CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/mistakes`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-path.test.ts`：Phase E Path Stage CTA Mobile Touch Targets RED 首次因 `/path/page.tsx` 缺少 `pathStageCtaClassName`，且路线图阶段卡 CTA 未接入移动端大触控 class 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Path Stage CTA Mobile Touch Targets 相关回归 49 tests 通过，覆盖 Path 阶段卡 CTA、Weekly、Mistakes、Auth/Preview 和共享学习 UI。
- `rg -n "Phase E Path Stage CTA|pathStageCtaClassName|stage\\.ctaLabel|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-start sm:justify-between|Path Stage CTA Mobile Touch Targets|路线图每张阶段卡|阶段卡行动" ...`：Phase E Path Stage CTA Mobile Touch Targets 覆盖扫描确认 `/path` 源码、测试、UI checklist、CHANGELOG、Path 模块文档和 Aegis 记录均接入阶段卡 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Path Stage CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/path`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Recent Signal Link Mobile Touch Targets RED 首次因 `/progress` 缺少 `progressRecentSignalLinkClassName`，且最近完成、开放错题、最近代码反馈、最近思路评审、最近项目实践 5 个链接未接入移动端大触控 class 失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts`：Phase E Progress Recent Signal Link Mobile Touch Targets 相关回归 45 tests 通过，覆盖 Progress analytics、Weekly、共享学习 UI 和首页标签。
- `rg -n "Phase E Progress Recent Signal|progressRecentSignalLinkClassName|min-h-11 rounded-md border px-3 py-2|最近完成|开放错题|最近代码反馈|最近思路评审|最近项目实践" ...`：Phase E Progress Recent Signal Link Mobile Touch Targets 覆盖扫描确认 `/progress` 源码、测试、UI checklist、CHANGELOG、Learning Analytics 模块文档和 Aegis 记录均接入最近信号链接移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Progress Recent Signal Link Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/progress`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase E Weekly Next Step Link Mobile Touch Targets RED 首次因 `/weekly` 缺少 `weeklyNextStepLinkClassName`，且下周建议步骤链接未接入移动端大触控 class 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts`：Phase E Weekly Next Step Link Mobile Touch Targets 相关回归 46 tests 通过，覆盖 Weekly、Progress analytics、共享学习 UI 和首页标签。
- `rg -n "Phase E Weekly Next Step|weeklyNextStepLinkClassName|min-h-11 rounded-md border px-3 py-3|下周建议|第 \\{index \\+ 1\\} 步" ...`：Phase E Weekly Next Step Link Mobile Touch Targets 覆盖扫描确认 `/weekly` 源码、测试、UI checklist、CHANGELOG、Weekly 模块文档和 Aegis 记录均接入下周建议步骤入口移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Weekly Next Step Link Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/weekly`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/settings-profile.test.ts`：Phase E Settings Save CTA Mobile Touch Targets RED 首次因 `/settings` 缺少 `settingsPrimaryCtaClassName`，且 `保存设置` 未接入移动端大触控 class 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Settings Save CTA Mobile Touch Targets 相关回归 37 tests 通过，覆盖 Settings 保存、Preview 写保护边界和共享学习 UI。
- `rg -n "Phase E Settings Save|settingsPrimaryCtaClassName|min-h-11 w-full sm:w-auto|保存设置|grid gap-2 sm:flex sm:items-center sm:gap-2" ...`：Phase E Settings Save CTA Mobile Touch Targets 覆盖扫描确认 `/settings` 源码、测试、UI checklist、CHANGELOG、Settings 模块文档和 Aegis 记录均接入保存 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Settings Save CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/settings`。
- `npm test -- tests/unit/login-page-ui.test.ts`：Phase E Login CTA Mobile Touch Targets RED 首次因 `/login` 缺少 `loginCtaClassName`，且 `用访问密码进入`、`发送登录链接`、`进入 Demo 模式` 未接入移动端大触控 class 失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/login-page-ui.test.ts tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Login CTA Mobile Touch Targets 相关回归 36 tests 通过，覆盖登录页 UI、访问密码服务、Auth/Preview 路由策略和共享学习 UI。
- `rg -n "Phase E Login CTA|loginCtaClassName|passwordLoginCtaClassName|emailLoginCtaClassName|用访问密码进入|发送登录链接|进入 Demo 模式|min-h-11 w-full sm:w-auto|Login CTA Mobile Touch Targets" ...`：Phase E Login CTA Mobile Touch Targets 覆盖扫描确认登录页源码、测试、UI checklist、CHANGELOG、Auth/Demo 模块文档和 Aegis 记录均接入登录 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Login CTA Mobile Touch Targets 收尾门禁通过；全量单测 338 tests 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/login`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach CTA Mobile Touch Targets RED 首次因 Coach 卡片沉淀、Quick Links 和页面级 CTA 未接入移动端大触控 class 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Coach CTA Mobile Touch Targets 相关回归 43 tests 通过，覆盖 Coach 页面 UI、Voice handoff、Review summary 和共享学习 UI。
- `rg -n "Phase E Coach CTA|coachPageCtaClassName|coachWorkspaceCtaClassName|coachReviewHistoryLinkClassName|提交给 Coach|查看课程|生成卡片|复习这 .* Coach 卡片|今日学习|复习中心|查看关联课程|min-h-11 w-full sm:w-auto|Coach CTA Mobile Touch Targets" ...`：Phase E Coach CTA Mobile Touch Targets 覆盖扫描确认 Coach 源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入 Coach CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach CTA Mobile Touch Targets 收尾门禁通过；全量单测 340 tests 通过，Next 生产构建生成 28 个静态页面，路由表包含 `/coach`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报多个既有 work record markdown 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Glossary CTA Mobile Touch Targets RED 首次因 `/glossary/page.tsx` 缺少 `glossaryCtaClassName`、搜索 CTA、复习 CTA 和底部制卡/复制 CTA 的移动端大触控 class 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Glossary CTA Mobile Touch Targets 相关回归 52 tests 通过，覆盖 Glossary/Radar 知识库、Knowledge Map、Today、首页和共享学习 UI。
- `rg -n "Phase E Glossary CTA|glossaryCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...`：Phase E Glossary CTA Mobile Touch Targets 覆盖扫描确认 `/glossary` 源码、测试、UI checklist、CHANGELOG、Knowledge Base 模块文档和 Aegis 记录均接入 Glossary CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Glossary CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/glossary`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase E Knowledge Map Summary CTA Mobile Touch Targets RED 首次因 `/map/page.tsx` 缺少 `mapSummaryCtaClassName`，`查看领域` 和 disabled `暂无信号` 摘要 CTA 缺少移动端大触控 class 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Knowledge Map Summary CTA Mobile Touch Targets 相关回归 51 tests 通过，覆盖 Knowledge Map、首页、Today、知识库路径和共享学习 UI。
- `rg -n "Phase E Knowledge Map Summary CTA|mapSummaryCtaClassName|查看领域|暂无信号|min-h-11 w-full sm:w-auto" ...`：Phase E Knowledge Map Summary CTA Mobile Touch Targets 覆盖扫描确认 `/map` 源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入摘要 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Knowledge Map Summary CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/map`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Radar CTA Mobile Touch Targets RED 首次因 `/radar/page.tsx` 缺少 `radarCtaClassName`、搜索 CTA、复习 CTA 和底部制卡/复制 CTA 的移动端大触控 class 失败；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Radar CTA Mobile Touch Targets 相关回归 50 tests 通过，覆盖 Radar/Glossary 知识库、Knowledge Map、Today、首页和共享学习 UI。
- `rg -n "Phase E Radar CTA|radarCtaClassName|去复习|搜索|生成复习卡片|复制详情入口|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...`：Phase E Radar CTA Mobile Touch Targets 覆盖扫描确认 `/radar` 源码、测试、UI checklist、CHANGELOG、Radar 模块文档和 Aegis 记录均接入 Radar CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Radar CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/radar`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Page CTA Mobile Touch Targets RED 首次因 `/projects/page.tsx` 页面级 `看进度`、项目复盘 `复习项目卡片`、`生成项目总结` 和 `打开作品集` CTA 仍缺少 `min-h-11 w-full sm:w-auto` 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Projects Page CTA Mobile Touch Targets 相关回归 39 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "Projects Page CTA|看进度|生成项目总结|打开作品集|复习项目卡片|min-h-11 w-full sm:w-auto" ...`：Phase E Projects Page CTA Mobile Touch Targets 覆盖扫描确认页面、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Projects 页面级 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Projects Page CTA Mobile Touch Targets 收尾门禁通过。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Milestone Form CTA Mobile Touch Targets RED 首次因 `/projects/page.tsx` 里程碑表单 `完成里程碑`、`保存草稿`、`保存并评审代码` CTA 缺少 `min-h-11 w-full sm:w-auto` 失败；GREEN 后 15 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Projects Milestone Form CTA Mobile Touch Targets 相关回归 40 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "Projects Milestone Form CTA|完成里程碑|保存草稿|保存并评审代码|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Projects Milestone Form CTA Mobile Touch Targets 覆盖扫描确认页面、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入里程碑表单 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Projects Milestone Form CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Workspace Form CTA Mobile Touch Targets RED 首次因 `开始 60 秒反思` 仍是 `h-7` 小按钮且缺少 `min-h-11 w-full sm:w-auto` 失败；GREEN 后 8 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Workspace Form CTA Mobile Touch Targets 相关回归 48 tests 通过，覆盖 Voice 表单、录音状态、转写、Coach handoff 和共享学习 UI。
- `rg -n "Voice Workspace Form CTA|voiceFormCtaClassName|开始 60 秒反思|清空|保存并进入分析|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex" ...`：Phase E Voice Workspace Form CTA Mobile Touch Targets 覆盖扫描确认 Voice 表单、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Voice 表单 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Voice Workspace Form CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Review Completion CTA Mobile Touch Targets 接手时 RED 复现于测试断言使用不存在的 `继续复习计划` 文案；修正为实际 UI 文案 `回到今日学习` 后 23 tests 通过，并覆盖完成总结底部 CTA 的 `min-h-11 w-full sm:w-auto`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts`：Phase E Review Completion CTA Mobile Touch Targets 相关回归 26 tests 通过，覆盖 Review 完成态 UI、总结服务和评分幂等。
- `rg -n "Review Completion CTA|让 Coach 拆解薄弱点|回到今日学习|继续复习计划|mt-4 grid gap-2 sm:flex sm:flex-wrap|min-h-11 w-full sm:w-auto" ...`：Phase E Review Completion CTA Mobile Touch Targets 覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Review 模块文档和 Aegis 记录均接入 Review 完成态 CTA 移动触控要求；`继续复习计划` 只作为历史 RED 证据出现，不是当前 UI 文案。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Review Completion CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/review`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Focus Entry CTA Mobile Touch Targets RED 首次因 `/today` 缺少 `todayFocusCtaClassName` 和核心入口 CTA 移动端大触控 class 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Today Focus Entry CTA Mobile Touch Targets 相关回归 38 tests 通过，覆盖 Today 入口 CTA、共享学习 UI、阶段状态和完成后行动。
- `rg -n "Today Focus Entry CTA|todayFocusCtaClassName|完整视图|复习入口|查看完整课程内容|完成沉淀|继续步骤|去做小测验|完成并生成卡片|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Today Focus Entry CTA Mobile Touch Targets 覆盖扫描确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入 Today 入口 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Today Focus Entry CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Project Review Queue CTA Mobile Touch Targets RED 首次因 `ProjectReviewQueuePanel` 的 `复习代码反馈` / `复习项目卡片` 仍继承 `h-7` 小触控失败，`min-h-11 w-full sm:w-auto` 命中数为 0；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Project Review Queue CTA Mobile Touch Targets 相关回归 38 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "ProjectReviewQueuePanel|Phase E Project Review Queue|复习代码反馈|复习项目卡片|min-h-11 w-full sm:w-auto" ...`：Phase E Project Review Queue CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入项目复习队列 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Project Review Queue CTA Mobile Touch Targets 收尾门禁通过。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Project Template CTA Mobile Touch Targets RED 首次因 `ProjectTemplateList` 的 `开始项目` / `打开项目` 仍继承 `h-7` 小触控失败，`min-h-11 w-full sm:w-auto` 命中数为 0；GREEN 后 13 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Project Template CTA Mobile Touch Targets 相关回归 38 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "ProjectTemplateList|Phase E Project Template|开始项目|打开项目|min-h-11 w-full sm:w-auto" ...`：Phase E Project Template CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入项目模板 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Project Template CTA Mobile Touch Targets 收尾门禁通过。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Project Portfolio CTA Mobile Touch Targets RED 首次因 `ProjectPortfolioPanel` 卡片 header 仍是手机端横向 `flex`，`复习项目卡片` 仍继承 `h-7` 小触控，`ProjectPortfolioPageContent` 页头 action 区仍是手机端横向 `flex`，且 `回到项目实践` 仍继承 `h-7` 小触控失败；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Project Portfolio CTA Mobile Touch Targets 相关回归 37 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "ProjectPortfolioPanel|ProjectPortfolioPageContent|Phase E Project Portfolio|复习项目卡片|回到项目实践|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-start sm:justify-between|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Project Portfolio CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入作品集 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Project Portfolio CTA Mobile Touch Targets 收尾门禁通过。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债，分别为缺 `task-intent-draft.json` 和多个既有 work record 未索引；归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Project Daily Rhythm CTA Mobile Touch Targets RED 首次因 `ProjectDailyRhythmCard` active header 仍是手机端横向 `flex`，且 `选择项目` / `继续项目` 仍继承 `h-7` 小触控失败；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Project Daily Rhythm CTA Mobile Touch Targets 相关回归 37 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "ProjectDailyRhythmCard|Phase E Project Daily Rhythm|选择项目|继续项目|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between" ...`：Phase E Project Daily Rhythm CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入当前项目卡 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Project Daily Rhythm CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/today-code-exercise.test.ts`：Phase E Today Code Exercise CTA Mobile Touch Targets RED 首次因 `CodeExercise` 的 `语音解释入口` / `保存提交` 仍继承 `h-7` 小触控，且 action 容器仍是手机端横向 `flex` 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/today-code-exercise.test.ts tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Today Code Exercise CTA Mobile Touch Targets 相关回归 28 tests 通过，覆盖 Today 代码练习、Today 活动标签和共享学习 UI。
- `rg -n "CodeExercise|Phase E Today Code Exercise|语音解释入口|保存提交|min-h-11 w-full sm:w-auto|grid gap-3 sm:flex sm:items-center sm:justify-between|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Today Code Exercise CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入代码练习 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Today Code Exercise CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Learning Code Copy CTA Mobile Touch Targets RED 首次因 `LearningCodeBlock` 的 `复制代码` 按钮仍是 `h-7 gap-1.5 px-2 text-xs` 小触控失败；GREEN 后 23 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/today-code-exercise.test.ts`：Phase E Learning Code Copy CTA Mobile Touch Targets 相关回归 29 tests 通过，覆盖共享学习 UI、daily prompt 课程块协议和 Today code exercise。
- `rg -n "LearningCodeBlock|Phase E Learning Code|复制代码|min-h-11|data-copy-code" ...`：Phase E Learning Code Copy CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入代码块复制 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Learning Code Copy CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Guided Steps Disclosure Controls Mobile Touch Targets RED 首次因 `GuidedSteps` 只有底部 3 个控制按钮命中移动端大触控，`显示提示` / `显示参考答案` 仍缺少 `min-h-11 w-full sm:w-auto` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/guided-progress.test.ts tests/unit/today-stage-status.test.ts`：Phase E Guided Steps Disclosure Controls Mobile Touch Targets 相关回归 8 tests 通过，覆盖 Today 引导步骤展示、guided progress 服务和 Today 阶段状态。
- `rg -n "GuidedSteps|Phase E Guided Steps Disclosure|显示提示|显示参考答案|min-h-11 w-full sm:w-auto" ...`：Phase E Guided Steps Disclosure Controls Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入引导步骤展开控制按钮移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Guided Steps Disclosure Controls Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Guided Steps Controls Mobile Touch Targets RED 首次因 `GuidedSteps` 底部表单仍是 `flex flex-wrap` 且 `上一步`、`下一步`、`保存进度` 仍是小触控失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/guided-progress.test.ts tests/unit/today-stage-status.test.ts`：Phase E Guided Steps Controls Mobile Touch Targets 相关回归 8 tests 通过，覆盖 Today 引导步骤展示、guided progress 服务和 Today 阶段状态。
- `rg -n "GuidedSteps|Phase E Guided Steps|grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto|保存进度" ...`：Phase E Guided Steps Controls Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入引导步骤控制按钮移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Guided Steps Controls Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Quiz Submit CTA Mobile Touch Targets RED 首次因小测验提交 action 行仍是 `flex flex-wrap` 且 `提交答案` CTA 仍继承 `h-7` 小触控失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Today Quiz Submit CTA Mobile Touch Targets 相关回归 14 tests 通过，覆盖 Today 小测验展示标签、阶段状态和完成后行动。
- `rg -n "TodayQuiz|Phase E Today Quiz|grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto|提交答案" ...`：Phase E Today Quiz Submit CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入小测验提交 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Today Quiz Submit CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Learning Focus Panel Controls Mobile Touch Targets RED 首次因 `LearningFocusPanel` 控制区仍是 `flex flex-wrap` 且三个控制按钮仍继承 `h-7` 小触控失败；GREEN 后 23 tests 通过。
- `rg -n "LearningFocusPanel|Phase E Learning Focus Panel|mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto" ...`：Phase E Learning Focus Panel Controls Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入共享专注模式入口控制按钮移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Learning Focus Panel Controls Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Knowledge Path Next CTA Mobile Touch Targets RED 首次因路径卡 header 仍是手机端横向 `flex flex-wrap` 且 `下一项` CTA 仍是 `h-7` 小触控失败；GREEN 后 23 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts`：Phase E Knowledge Path Next CTA Mobile Touch Targets 相关回归 38 tests 通过，覆盖共享学习 UI、Glossary/Radar 知识路径和 `/path` 学习路径。
- `rg -n "KnowledgePathExplorer|Phase E Knowledge Path|grid gap-3 sm:flex sm:items-start sm:justify-between|min-h-11 w-full sm:w-auto sm:shrink-0" ...`：Phase E Knowledge Path Next CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入学习路径 `下一项` CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Knowledge Path Next CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase E Habit Goal Lightweight CTA Mobile Touch Targets RED 首次因 `轻量学习模式` CTA 仍是 `h-7 mt-3` 小触控失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/current-mission.test.ts`：Phase E Habit Goal Lightweight CTA Mobile Touch Targets 相关回归 30 tests 通过，覆盖周目标卡、首页标签、Progress analytics 和 Current Mission。
- `rg -n "LearningHabitGoalCard|Phase E Habit Goal|轻量学习模式|min-h-11 w-full sm:w-auto" ...`：Phase E Habit Goal Lightweight CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入轻量学习 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Habit Goal Lightweight CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase E Daily Quest CTA Mobile Touch Targets RED 首次因 Daily Quest action 区仍是横向 `flex shrink-0 items-center gap-2` 且按钮仍是 `h-7` 小触控失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Daily Quest CTA Mobile Touch Targets 相关回归 23 tests 通过，覆盖 Daily Quest、首页标签、Current Mission 和 Today completion。
- `rg -n "DailyQuestCard|Phase E Daily Quest|grid gap-2 sm:flex sm:items-center sm:justify-end|min-h-11 w-full sm:w-auto" ...`：Phase E Daily Quest CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入 Daily Quest 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Daily Quest CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Learning Empty State CTA Mobile Touch Targets RED 首次因 `LearningEmptyState` action 容器仍是 `flex flex-wrap gap-2` 且按钮仍是 `h-7` 小触控失败；GREEN 后 23 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-session-summary.test.ts tests/unit/mistakes-view.test.ts`：Phase E Learning Empty State CTA Mobile Touch Targets 相关回归 47 tests 通过，覆盖共享空态、Voice、Coach、Review summary 和 Mistakes view。
- `rg -n "LearningEmptyState|Phase E Learning Empty State|grid gap-2 sm:flex sm:flex-wrap|min-h-11 w-full sm:w-auto" ...`：Phase E Learning Empty State CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入共享空态移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Learning Empty State CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Learning Completion CTA Mobile Touch Targets RED 首次因完成后 CTA 缺少 3 个 `min-h-11 w-full sm:w-auto sm:shrink-0` 命中失败；GREEN 后 22 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-code-exercise.test.ts`：Phase E Learning Completion CTA Mobile Touch Targets 相关回归 45 tests 通过，覆盖完成后 CTA、Today completion actions、Projects workspace 和 Today code exercise。
- `rg -n "completionCtaClassName|LearningCompletionCard|Phase E Learning Completion|完成后.*CTA|min-h-11 w-full sm:w-auto sm:shrink-0" ...`：Phase E Learning Completion CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist、CHANGELOG 和 Aegis 记录均接入完成后移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Learning Completion CTA Mobile Touch Targets 收尾门禁通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E Learning Mission Card CTA Mobile Touch Targets RED 首次因 `LearningMissionCard` 仍是手机端横向 `flex` 且 action CTA 仍是 `class="shrink-0"` 失败；GREEN 后 22 tests 通过。
- `rg -n "LearningMissionCard|grid gap-3 rounded-lg border p-3 text-sm sm:flex sm:items-start sm:justify-between|min-h-11 w-full sm:w-auto sm:shrink-0|Phase E Learning Mission Card" ...`：Phase E Learning Mission Card CTA Mobile Touch Targets 覆盖扫描确认组件、测试、UI checklist 和 Aegis 记录均接入任务卡移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Learning Mission Card CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`：结构检查失败，缺少历史 JSON sidecar `task-intent-draft.json`；这是 Aegis 记录结构债务，不是产品运行失败。
- `python3 .../aegis-workspace.py check --root ...`：结构检查失败，报大量既有 `docs/aegis/work/.../*.md` 未索引；与前序记录中的 Markdown-only 历史债务一致，不影响本地产品门禁结论。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts`：Phase E Home Section Action CTA Mobile Touch Targets RED 首次因 `LearningSectionCard` action wrapper 仍是 `shrink-0`，且首页缺少 `homeSectionActionCtaClassName` 失败；GREEN 后 24 tests 通过。
- `rg -n "homeSectionActionCtaClassName|w-full sm:w-auto sm:shrink-0|LearningSectionCard|今日学习|今日三件事|继续今日学习|继续学习" ...`：Phase E Home Section Action CTA Mobile Touch Targets 覆盖扫描确认共享组件、首页和测试均接入 section action 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Home Section Action CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。
- `npm test -- tests/unit/home-page-labels.test.ts`：Phase E Home Common Entry CTA Mobile Touch Targets RED 首次因首页缺少 `homeCommonEntryCtaClassName` 和常用入口 CTA className 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts`：Phase E Home Common Entry CTA Mobile Touch Targets 相关回归 13 tests 通过，覆盖首页标签、Current Mission 和学习动机。
- `rg -n "homeCommonEntryCtaClassName|homeQuickCtaClassName|min-h-11 w-full sm:w-auto|常用入口|打开|今日能量" ...`：Phase E Home Common Entry CTA Mobile Touch Targets 覆盖扫描确认首页源码、测试、UI checklist 和 Aegis 记录均接入常用入口 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Home Common Entry CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。
- `npm test -- tests/unit/home-page-labels.test.ts`：Phase E Home Quick CTA Mobile Touch Targets RED 首次因首页缺少 `homeQuickCtaClassName` 和快捷 CTA className 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts`：Phase E Home Quick CTA Mobile Touch Targets 相关回归 13 tests 通过，覆盖首页标签、Current Mission 和学习动机。
- `rg -n "homeQuickCtaClassName|min-h-11 w-full sm:w-auto|开始今日|回到今日|说出理解|今日能量" ...`：Phase E Home Quick CTA Mobile Touch Targets 覆盖扫描确认首页源码、测试、UI checklist 和 Aegis 记录均接入快捷 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Home Quick CTA Mobile Touch Targets 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`。
- `npm test -- tests/unit/current-mission.test.ts`：Phase E Current Mission Mobile CTA RED 首次因 CTA 缺少 `min-h-11` / `w-full sm:w-auto` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts`：Phase E Current Mission Mobile CTA 相关回归 21 tests 通过，覆盖 Current Mission、Next Best Action、首页标签和学习动机。
- `rg -n "min-h-11 w-full sm:w-auto|Current Mission.*CTA|CurrentMissionCard|Phase E|w-full sm:w-auto" ...`：Phase E Current Mission Mobile CTA 覆盖扫描确认组件、测试、模块文档、UI checklist 和 Aegis 记录均接入移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Current Mission Mobile CTA 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/`、`/progress`、`/projects`、`/today`、`/weekly` 等 Current Mission 接入页面。
- `npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts`：Phase C Current Mission Breadth Fallback RED 首次因兜底仍返回 `/projects` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/next-best-action.test.ts tests/unit/current-mission.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-motivation.test.ts tests/unit/knowledge-base.test.ts`：Phase C Current Mission Breadth Fallback 相关回归 33 tests 通过，覆盖 Next Best Action、Current Mission、首页标签、学习动机和 Glossary/Radar 知识库。
- `rg -n "开始一个小项目|开始项目实践|轻量广度探索|做一个轻量广度探索|探索 Radar|/radar|Glossary / Radar" ...`：Phase C Current Mission Breadth Fallback 覆盖扫描确认当前规则、测试和文档接入 `/radar` 轻量广度探索兜底。
- `git diff --check`、`npm run lint`、`npm run build`：Phase C Current Mission Breadth Fallback 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/` 和 `/radar`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Code/Pseudocode Course Callout RED 首次因 prompt 缺少 `data-learning-callout="code_sketch"` 且 `LearningMarkdown` 将 `> 代码/伪代码` 渲染为普通引用块失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Code/Pseudocode Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "代码/伪代码|代码草图|data-learning-callout=\"code_sketch\"|daily-plan-v2\\.10|daily-plan-v2\\.9-example-card-course-blocks" ...`：Phase 4.4 Code/Pseudocode Course Callout 覆盖扫描确认当前 renderer、prompt、测试和文档接入 v2.10 `代码/伪代码` 协议；旧 v2.9 命中只保留在历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Code/Pseudocode Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/admin-content-review.test.ts`：Phase 9 Admin Duplicate Topic Review Queue RED 首次因 `summarizeDuplicateDailyPlanTopics is not a function` 失败；GREEN 后 3 tests 通过，覆盖重复主题队列、卡片质量队列和来源核验队列。
- `npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/auth-policy.test.ts`：Phase 9 Admin Duplicate Topic Review Queue 相关回归 20 tests 通过，覆盖 Admin 内容审查、生成质量、Prompt Studio 和 Preview/Auth 边界。
- `rg -n "summarizeDuplicateDailyPlanTopics|重复主题检测|重复主题|受影响计划|repeatedPlanCount|duplicateTopic" src/server/admin/content-review.ts src/app/admin/page.tsx tests/unit/admin-content-review.test.ts docs/ui-review-checklist.md helloagents/modules/generation-quality.md helloagents/modules/e2e-ui-smoke.md docs/aegis/work/2026-06-03-roky-learning-desire`：Phase 9 Admin Duplicate Topic Review Queue 覆盖扫描确认重复主题检测服务、Admin 页面、测试和文档接线可见。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 9 Admin Duplicate Topic Review Queue 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/admin`。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase 10 Progress Trend Label Localization 新增趋势徽章中文化断言，GREEN 后 16 tests 通过，覆盖代码反馈趋势和错题趋势徽章。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts`：Phase 10 Progress Trend Label Localization 相关回归 42 tests 通过，覆盖 Progress 趋势、Weekly、共享学习 UI 和首页标签回归。
- `rg -n "high \\{row\\.highIssueCount\\}|open \\{row\\.active\\}|高优先级 \\{row\\.highIssueCount\\}|未解决 \\{row\\.active\\}|codeFeedbackSeverityLabel|codeFeedbackIssueTypeLabel|高优先级 2|未解决 1|>high 2<|>open 1<" src/app/progress/analytics-panels.tsx tests/unit/progress-analytics.test.ts`：Phase 10 Progress Trend Label Localization 覆盖扫描确认旧 raw trend badge 直出模板不存在；raw 值只保留在 helper 分支、测试输入或反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Progress Trend Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/progress`。
- `npm test -- tests/unit/today-code-exercise.test.ts`：Phase 10 Today Code Thinking Mobile Path 新增手机端思路/语音入口断言，RED 首次因缺少 `代码思路模式` 失败；GREEN 后 2 tests 通过，覆盖 `先说清思路`、`伪代码草稿`、`语音解释入口` 和 `/voice?lessonId=...&mode=code_debug` 链接。
- `npm test -- tests/unit/today-code-exercise.test.ts tests/unit/voice-note.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Today Code Thinking Mobile Path 相关回归 40 tests 通过，覆盖 Today 代码练习、Voice 模式、Today 完成后动作和共享学习 UI。
- `rg -n "代码思路模式|先说清思路|伪代码草稿|语音解释入口|code_walkthrough|mode=code_debug" src/app/today/ui/code-exercise.tsx tests/unit/today-code-exercise.test.ts docs/ui-review-checklist.md helloagents/modules/today-focus-mode.md helloagents/modules/e2e-ui-smoke.md docs/aegis/work/2026-06-03-roky-learning-desire`：Phase 10 Today Code Thinking Mobile Path 覆盖扫描确认新入口、测试和文档接线可见，未引入未接线的 `code_walkthrough` mode。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Today Code Thinking Mobile Path 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today` 和 `/voice`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Interactive Course Callout RED 首次因 prompt 缺少 `> 互动实验` 且 `LearningMarkdown` 未生成 `data-learning-callout="experiment"` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Interactive Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "互动实验|小实验|动手试试|data-learning-callout=\"experiment\"|daily-plan-v2\\.5|daily-plan-v2\\.4-course-blocks" ...`：Phase 4.4 Interactive Course Callout 覆盖扫描通过，当前 renderer、prompt、测试和文档均接入 v2.5 `互动实验` 协议；`daily-plan-v2.4-course-blocks` 仅保留在旧版本历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Interactive Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Visual Course Callout RED 首次因 prompt 缺少 `> 图示` 且 `LearningMarkdown` 未生成 `data-learning-callout="diagram"` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Visual Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "图示|概念图|视觉化|data-learning-callout=\"diagram\"|daily-plan-v2\\.6|daily-plan-v2\\.5-interactive-course-blocks" ...`：Phase 4.4 Visual Course Callout 覆盖扫描通过，当前 renderer、prompt、测试和文档均接入 v2.6 `图示` 协议；`daily-plan-v2.5-interactive-course-blocks` 仅保留在旧版本历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Visual Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Key Point Course Callout RED 首次因 prompt 缺少 `> 重点` 且 `LearningMarkdown` 未生成 `data-learning-callout="key_point"` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Key Point Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "重点|要点|关键点|data-learning-callout=\"key_point\"|daily-plan-v2\\.7|daily-plan-v2\\.6-visual-course-blocks" ...`：Phase 4.4 Key Point Course Callout 覆盖扫描通过，当前 renderer、prompt、测试和文档均接入 v2.7 `重点` 协议；`daily-plan-v2.6-visual-course-blocks` 仅保留在旧版本历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Key Point Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Self-Check Card Course Callout RED 首次因 prompt 缺少 `> 自测卡` 且 `LearningMarkdown` 未生成 `data-learning-callout="self_check"` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Self-Check Card Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "自测卡|data-learning-callout=\"self_check\"|daily-plan-v2\\.8|daily-plan-v2\\.7-key-point-course-blocks" ...`：Phase 4.4 Self-Check Card Course Callout 覆盖扫描通过，当前 renderer、prompt、测试和文档均接入 v2.8 `自测卡` 协议；`daily-plan-v2.7-key-point-course-blocks` 仅保留在旧版本历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Self-Check Card Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 Example Card Course Callout RED 首次因 prompt 缺少 `> 例子卡` 且 `LearningMarkdown` 未生成 `data-learning-callout="example"` 失败；GREEN 后 25 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`：Phase 4.4 Example Card Course Callout 相关回归 37 tests 通过，覆盖学习 UI、daily prompt、Prompt Studio、生成质量、Today 活动和代码练习。
- `rg -n "例子卡|data-learning-callout=\"example\"|daily-plan-v2\\.9|daily-plan-v2\\.8-self-check-card-course-blocks" ...`：Phase 4.4 Example Card Course Callout 覆盖扫描通过，当前 renderer、prompt、测试和文档均接入 v2.9 `例子卡` 协议；`daily-plan-v2.8-self-check-card-course-blocks` 仅保留在旧版本历史记录中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.4 Example Card Course Callout 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/notes-template.test.ts`：Phase 10 Notes Plan Status Label Localization RED 首次因笔记模板仍显示 `课程状态：completed` 失败；GREEN 后 4 tests 通过，覆盖模板状态标签、无关联计划 fallback 和 Notes 页面摘要接线。
- `npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 10 Notes Plan Status Label Localization 相关回归 20 tests 通过，覆盖 Notes 模板、Notes 列表、Notes 创建权限、Library 下一步和 Today 完成后笔记入口。
- `rg -n "课程状态：completed|计划：\\{selectedPlan\\?\\.status|计划：\\{formatNotePlanStatusLabel|课程状态：已完成|formatNotePlanStatusLabel" src/app/notes/page.tsx src/server/notes/template.ts tests/unit/notes-template.test.ts`：Phase 10 Notes Plan Status Label Localization 覆盖扫描确认旧 raw status 直出模板不存在；raw 值只保留在 helper 测试输入/反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Notes Plan Status Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/notes`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase 10 Library Visible Label Localization RED 首次因缺少 `formatQuizQuestionTypeLabel` helper 失败；GREEN 后 1 test 通过，覆盖 `/library` 学习者可见状态、来源、广度类型、测验题型、代码提交状态和代码反馈结论 helper 接线。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/map-analytics.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Library Visible Label Localization 合并回归 55 tests 通过，覆盖 Library 页面标签、课程下一步、筛选、详情权限、Today、首页、Map、Radar/Glossary 和共享学习 UI。
- `rg -n "\\{p\\.source \\?\\? \\\"unknown\\\"\\}|\\{p\\.status\\}|\\$\\{planForLesson\\.status\\}|\\$\\{planForLesson\\.source \\?\\? \\\"unknown\\\"\\}|类型：\\{breadth\\.kind\\}|类型：\\{q\\.type\\}|\\{submission\\.status\\}|\\$\\{feedback\\.overall\\}|formatTodayPlanSourceLabel\\(p\\.source\\)|formatHomeDailyPlanStatusLabel\\(p\\.status\\)|formatHomeDailyPlanStatusLabel\\(planForLesson\\.status\\)|formatTodayPlanSourceLabel\\(planForLesson\\.source\\)|formatKnowledgeEntityTypeLabel\\(breadth\\.kind\\)|formatQuizQuestionTypeLabel\\(q\\.type\\)|formatCodeSubmissionStatusLabel\\(submission\\.status\\)|formatHomeCodeFeedbackOverallLabel\\(feedback\\.overall\\)|反馈已生成|单选题|已完成|AI 生成|开源项目" src/app/library/page.tsx src/app/_lib/home-labels.ts tests/unit/library-page-labels.test.ts`：Phase 10 Library Visible Label Localization 覆盖扫描确认 `/library` 学习者可见旧 raw label 直出模板不存在；raw 值只保留在 helper 映射、治理筛选控件、测试输入或反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Library Visible Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/library`。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase 10 Radar Visible Label Localization RED 首次因缺少 `formatRadarConfidenceLabel` helper 失败；GREEN 后 12 tests 通过，覆盖知识库基础规则、学习路径、Radar 关系卡片链和 `/radar` 可见标签 helper 接线。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Radar Visible Label Localization 合并回归 46 tests 通过，覆盖 Radar/Glossary 知识库、Knowledge Map、Today、首页和共享学习 UI。
- `rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{entity\\.type\\}|\\{selectedEntity\\.type\\}|confidence \\{selectedEntity\\.confidence\\}|\\{verificationBadge\\}|verified \\{selectedEntity\\.lastVerifiedAt|needs_verification：|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatKnowledgeEntityTypeLabel\\(entity\\.type\\)|formatKnowledgeEntityTypeLabel\\(selectedEntity\\.type\\)|formatRadarConfidenceLabel\\(selectedEntity\\.confidence\\)|formatRadarVerificationLabel\\(verificationBadge\\)|可信度：高|已核验|待核验|核验日期|开源项目" src/app/radar/page.tsx src/app/_lib/home-labels.ts tests/unit/knowledge-base.test.ts`：Phase 10 Radar Visible Label Localization 覆盖扫描确认 `/radar` 旧 raw label 直出模板不存在；raw 值只保留在 helper 映射、测试输入或反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Radar Visible Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/radar`。
- `npm test -- tests/unit/map-analytics.test.ts`：Phase 10 Knowledge Map Label Localization RED 首次因缺少 `formatFlashcardTypeLabel` helper 失败；GREEN 后 8 tests 通过，覆盖 Knowledge Map 公式、聚合、摘要、进度条标签和 `/map` 可见标签 helper 接线。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Knowledge Map Label Localization 合并回归 45 tests 通过，覆盖 `/map`、首页、Today、知识库路径和共享学习 UI。
- `rg -n "\\{group\\.type\\} \\{group\\._count\\._all\\}|\\{plan\\.localDate\\} / \\{plan\\.status\\} / \\{plan\\.source \\?\\? \\\"unknown\\\"\\}|\\{card\\.type\\}|\\{item\\.status\\} x\\{item\\.occurrenceCount\\}|score \\{stat\\.masteryScore\\}|masteryScore =|formatKnowledgeEntityTypeLabel\\(group\\.type\\)|formatHomeDailyPlanStatusLabel\\(plan\\.status\\)|formatTodayPlanSourceLabel\\(plan\\.source\\)|formatFlashcardTypeLabel\\(card\\.type\\)|formatMapMisconceptionStatusLabel\\(item\\.status\\)|掌握分|代码反馈卡|错题卡|开源项目|未解决|已解决" src/app/map/page.tsx src/app/_lib/home-labels.ts tests/unit/map-analytics.test.ts`：Phase 10 Knowledge Map Label Localization 覆盖扫描确认 `/map` 旧 raw label 直出模板不存在；raw 值只保留在 helper 映射、测试输入或反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Knowledge Map Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/map`。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase 10 Today Plan Label Localization RED 首次因缺少 `formatTodayPlanSourceLabel` / `formatKnowledgeEntityTypeLabel` helper 失败；实现过程中继续捕捉到专注模式完成区仍显示 `当前状态：{plan.status}`；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/knowledge-base.test.ts`：Phase 10 Today Plan Label Localization 合并回归 46 tests 通过，覆盖 Today 活动标签、学习 UI、完成行动、首页 label helper 和知识库类型回归。
- `rg -n "value: plan\\.status|当前状态：\\{plan\\.status\\}|value: plan\\.source \\?\\? plan\\.lesson\\.createdBy|\\{plan\\.source \\?\\? plan\\.lesson\\.createdBy\\}|类型：\\{breadthDetail\\?\\.type \\?\\? breadth\\.kind\\}|类型：\\{breadthDetail\\?\\.type \\?\\? breadth\\?\\.kind\\}|planned|completed|deepseek|template|person|benchmark|open_source_project|formatTodayPlanSourceLabel|formatKnowledgeEntityTypeLabel|todayPlanStatusLabel|todayPlanSourceLabel|breadthTypeLabel" src/app/today/page.tsx src/app/_lib/home-labels.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts`：Phase 10 Today Plan Label Localization 覆盖扫描确认 `/today` 旧 raw label 直出模板不存在；raw 值只保留在查询条件、状态判断、helper 映射或测试输入中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Today Plan Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/home-page-labels.test.ts`：Phase 10 Home Status Label Localization RED 首次因缺少首页展示 helper 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/home-page-labels.test.ts tests/unit/current-mission.test.ts tests/unit/learning-motivation.test.ts tests/unit/next-best-action.test.ts tests/unit/today-code-exercise.test.ts`：Phase 10 Home Status Label Localization 合并回归 22 tests 通过。
- `rg -n "todayPlan\\?\\.status \\?\\?|状态：\\$\\{codeFeedbackFocus\\.overall\\}|来源：\\$\\{openMisconceptionFocus\\.source\\}|partially_correct|incorrect|cannot_judge|planned|completed|formatHomeDailyPlanStatusLabel|buildHomeCodeFeedbackMeta|buildHomeMistakeMeta" src/app/page.tsx src/app/_lib/home-labels.ts tests/unit/home-page-labels.test.ts`：Phase 10 Home Status Label Localization 覆盖扫描确认首页旧 raw enum 直出模板不存在；raw 值只保留在查询条件、helper 映射或测试输入中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Home Status Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含首页 `/`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Review Card Type Label Localization RED 首次因 Review 当前卡片 badge 仍显示 `code_bug` 失败；GREEN 后 21 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-empty-state.test.ts tests/unit/review-rating.test.ts`：Phase 10 Review Card Type Label Localization 合并回归 27 tests 通过。
- `rg -n "card\\?\\.type|>\\{card\\.type\\}|\\{card\\.type\\}|code_bug|quiz_error|misconception|\\bconcept\\b" src/app/review src/components tests/unit/learning-ui-components.test.ts`：Phase 10 Review Card Type Label Localization 覆盖扫描确认 Review 学习者 UI 不再直出 `{card.type}`；raw type 只保留在测试输入、反向断言或展示层映射表中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Review Card Type Label Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/review`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Mode Badge Localization RED 首次因 `LearningFocusPanel` 仍显示 `Focus Mode` / `Focus Mode 进度` 且 `KnowledgePathExplorer` 仍显示 `Path Mode` 失败，18 tests 通过、2 tests 失败；补充 RED 因 `/today` 完整课程折叠说明仍包含 `Focus Mode 下方...` 失败，19 tests 通过、1 test 失败；GREEN 后 20 tests 通过。
- `npm test -- tests/unit/admin-prompt-studio.test.ts`：Phase 9.2 Prompt Studio Creator Label Localization RED 首次在无临时 env 时失败于组件直连 `/admin/actions.ts` 导致 `DATABASE_URL` / `CRON_SECRET` env 校验；使用临时 env 后失败于仍显示 `Prompt version:` 等旧英文标签；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/auth-policy.test.ts`：Phase 9.2 Prompt Studio Creator Label Localization 合并回归 19 tests 通过。
- `rg -n "Prompt version:|Schema version:|最新 job schema:|drift:|sample:|（test）|Prompt 版本|Schema 版本|最新生成 schema|漂移数量|重新生成某日期计划（测试）" src/app/admin tests/unit/admin-prompt-studio.test.ts docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire`：Phase 9.2 覆盖扫描确认当前源码和验收文档使用新文案，旧标签仅保留在测试反向断言或历史证据中。
- `npm run build`：Phase 9.2 Prompt Studio Creator Label Localization 首次收尾失败于 `/admin/page.tsx` 漏导入 `regeneratePlanForLocalDateAction`；补齐导入后复跑通过，Next 生产构建生成 28 static pages，路由表包含 `/admin`。
- `git diff --check`、`npm run lint`：Phase 9.2 Prompt Studio Creator Label Localization 收尾通过。
- `npm test -- tests/unit/pwa-manifest.test.ts`：Phase 10 Mode Badge Localization RED 首次因 PWA `今日学习` shortcut 仍显示 `打开今日 Focus Mode...` 失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/pwa-manifest.test.ts tests/unit/auth-policy.test.ts`：Phase 10 Mode Badge Localization 合并回归 54 tests 通过。
- `rg -n "Focus Mode|Path Mode|专注模式|路径模式|专注模式进度" src/app src/components tests/unit docs/ui-review-checklist.md helloagents/modules docs/aegis/work/2026-06-03-roky-learning-desire`：Phase 10 Mode Badge Localization 覆盖扫描确认生产代码使用 `专注模式` / `路径模式`，旧英文仅保留在测试反向断言、历史文档或显式“不应显示”验收文本中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Mode Badge Localization 收尾门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/path` 和 `/manifest.webmanifest`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Celebration Badge Localization RED 首次因共享成就反馈仍显示 `Session summary`、`Project progress`、`Mastery signal` 失败，19 tests 通过、1 test 失败；GREEN 后 20 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 10 Celebration Badge Localization 合并回归 41 tests 通过。
- `rg -n "Session summary|Project progress|Mastery signal|复习总结|项目进度|掌握证据|LearningCelebrationCue" src/components/learning src/app/projects tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 10 Celebration Badge Localization 覆盖扫描确认生产代码使用中文成就反馈徽章，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Celebration Badge Localization 代码门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/review`、`/projects` 和 `/mistakes`。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase 10 Progress Remediation Step Label Localization RED 首次因 `/progress` 本周补弱计划仍显示 `Step 1` / `Step 2` 失败，14 tests 通过、1 test 失败；GREEN 后 15 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Progress Remediation Step Label Localization 合并回归 38 tests 通过。
- `rg -n "Step \\{index \\+ 1\\}|>Step [0-9]<|第 \\{index \\+ 1\\} 步|第 [0-9] 步|weeklyRemediationPlan\\.steps|本周补弱计划" src/app/progress tests/unit/progress-analytics.test.ts`：Phase 10 Progress Remediation Step Label Localization 覆盖扫描确认生产代码使用中文步骤徽章，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Progress Remediation Step Label Localization 代码门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/progress`。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase 10 Projects Status Label Localization RED 首次因 Projects 仍显示 `Mission Mode`、`code saved`、`reflection saved`、`AI reviewed`、`1 completed`，以及 `/projects` 页面源码仍使用 raw `activeMilestone.status` / `all done` 失败；GREEN 后 12 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 10 Projects Status Label Localization 合并回归 37 tests 通过。
- `rg -n "code saved|reflection saved|AI reviewed|all done|\\{items\\.length\\} completed|\\{completedCount\\} completed|[0-9]+ completed|Mission Mode|>Portfolio<|已保存代码|已保存反思|AI 已评审|全部完成|已完成 .* 个项目|项目任务模式" src/app/projects tests/unit/project-mission-workspace.test.ts`：Phase 10 Projects Status Label Localization 覆盖扫描确认生产代码使用中文状态文案，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Projects Status Label Localization 代码门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `npm test -- tests/unit/learning-path.test.ts`：Phase 10 Path Stage Label Localization RED 首次因 `/path` 仍显示 `Next Stage` 失败，扩展覆盖 `Stage {index + 1}`；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Path Stage Label Localization 合并回归 43 tests 通过。
- `rg -n "Next Stage|Stage \\{index \\+ 1\\}|第 \\{index \\+ 1\\} 阶段|>下一阶段<|学习路径|阶段进度" src/app/path/page.tsx tests/unit/learning-path.test.ts`：Phase 10 Path Stage Label Localization 覆盖扫描确认生产代码使用中文阶段标签，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Path Stage Label Localization 代码门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/path`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase 10 Voice Visible Label Localization RED 首次因当前 Voice Note 状态区仍显示 `Coach linked`、`Note saved`、`Transcript` 失败；二次 RED 因 Voice 输入表单仍显示独立标题 `Transcript` 失败；GREEN 后 8 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Visible Label Localization 合并回归 47 tests 通过。
- `rg -n "Coach linked|Note saved|>Transcript<|text-sm font-medium\\\">Transcript|已连接 Coach|已保存笔记|转写文本" src/app/voice tests/unit/voice-note.test.ts`：Phase 10 Voice Visible Label Localization 覆盖扫描确认生产代码的独立可见标签使用中文文案，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Voice Visible Label Localization 代码门禁通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase 10 Weekly Next-Step Label Localization RED 首次因 `/weekly` 下周建议仍显示 `Step {index + 1}` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Weekly Next-Step Label Localization 合并回归 37 tests 通过。
- `rg -n "Step \{|Step [0-9]|第 \{index \+ 1\} 步|第 [0-9] 步|nextWeekPlan\.steps" src/app/weekly src/server/learning/weekly.ts tests/unit/weekly-review.test.ts`：Phase 10 Weekly Next-Step Label Localization 覆盖扫描确认生产页面使用 `第 {index + 1} 步`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Today Focus Step Label Localization RED 首次因 `/today` 阶段定义仍使用 `eyebrow: "Step n"` 失败；GREEN 后 20 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts`：Phase 10 Today Focus Step Label Localization 合并回归 31 tests 通过。
- `rg -n "eyebrow: \"Step [0-9]\"|>Step [0-9]<|Step [0-9]|eyebrow: \"第 [0-9] 步\"|第 7 步" src/app/today src/components/learning tests/unit/learning-ui-components.test.ts`：Phase 10 Today Focus Step Label Localization 覆盖扫描确认生产代码使用 `第 n 步`，旧英文 Step 仅保留在测试反向断言中。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase 10 Weekly Metrics Localization RED 首次因 Weekly 页面和 Markdown 仍显示 `quiz 正确率`、`Quiz 正确率`、`Strongest`、`Weakest`、`mastery`、`weakness`、`quiz` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Weekly Metrics Localization 合并回归 36 tests 通过。
- `rg -n "quiz 正确率|Quiz 正确率|Strongest|Weakest|mastery：|weakness：|quiz：|（quiz|weeklyMistakeSourceLabel|小测验正确率|掌握分|薄弱分|待补强" src/app/weekly src/server/learning/weekly.ts tests/unit/weekly-review.test.ts`：Phase 10 Weekly Metrics Localization 覆盖扫描确认生产代码使用中文文案，旧英文指标仅保留在测试反向断言中。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Card Count Localization RED 首次因 Voice 学习流水线仍显示 `3 cards` 失败；GREEN 后 19 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：Phase 10 Voice Card Count Localization 合并回归 38 tests 通过。
- `rg -n "\{linkedCards\} cards|\$\{props\.linkedCards\} cards|[0-9]+ cards| cards<|>cards<|cards</|cards\}" src/app/voice tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts`：Phase 10 Voice Card Count Localization 覆盖扫描确认生产代码中旧 `cards` 可见文案已清理，旧英文仅保留在测试反向断言中。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Pipeline Step Title Localization RED 首次因 Voice 学习流水线仍显示 `Coach`、`Note`、`Cards` 失败；GREEN 后 19 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：Phase 10 Voice Pipeline Step Title Localization 合并回归 38 tests 通过。
- `rg -n '>Coach<|>Note<|>Cards<|title="Coach"|title="Note"|title="Cards"|Coach 检查|整理笔记|复习卡片' src/app/voice tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Pipeline Step Title Localization 覆盖扫描确认生产代码中旧步骤标题已清理，旧英文仅保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Voice Pipeline Step Title Localization 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase 10 Voice Recording Timer Label Localization RED 首次因 Voice 录音计时器仍显示 `recording` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Recording Timer Label Localization 合并回归 45 tests 通过。
- `rg -n '>recording<|recording</|uppercase tracking-wide text-muted-foreground|录音计时' src/app/voice tests/unit/voice-note.test.ts`：Phase 10 Voice Recording Timer Label Localization 覆盖扫描确认生产代码中旧可见英文已清理，`recording` 仅保留在测试反向断言。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Voice Recording Timer Label Localization 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase 10 Voice Form A11y Localization RED 首次因 Voice 表单仍使用 `aria-label="Voice Note 模式"` 和 `aria-label="Transcript"` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Voice Form A11y Localization 合并回归 45 tests 通过。
- `rg -n 'aria-label="Voice Note 模式"|aria-label="Transcript"|aria-label="[A-Za-z]' src/app src/components`：Phase 10 Voice Form A11y Localization 覆盖扫描确认生产代码中旧 Voice 表单标签已清理，仅剩 `XP 等级` 产品术语标签。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Voice Form A11y Localization 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 10 Markdown Export A11y Localization RED 首次因 Weekly 和 Portfolio Markdown 导出文本区仍使用英文 `aria-label` 失败；GREEN 后 14 tests 通过。
- `rg -n "weekly report markdown|portfolio markdown|aria-label=\"[A-Za-z]" src/app src/components tests/unit`：Phase 10 Markdown Export A11y Localization 覆盖扫描确认生产代码中旧英文导出标签已清理，剩余命中仅为测试反向断言或产品术语标签。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Markdown Export A11y Localization 合并回归 35 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Markdown Export A11y Localization 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/weekly` 和 `/projects/portfolio`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 LearningTimeline A11y RED 首次因时间线缺少 `第 n 步，完成/进行中/待办` 文本失败；GREEN 后目标断言通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts`：Phase 10 LearningTimeline A11y 后学习 UI、知识库和学习路径回归 33 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 LearningTimeline A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/glossary`、`/radar`、`/path`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Knowledge Path Metric A11y RED 首次因知识路径指标卡仍输出非交互 `aria-label` 失败；GREEN 后目标断言通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-path.test.ts`：Phase 10 Knowledge Path Metric A11y 后学习 UI、知识库和学习路径回归 32 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Knowledge Path Metric A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/glossary`、`/radar`、`/path`、`/projects/portfolio`。
- `npm test -- tests/unit/shared-ui-a11y.test.ts`：Phase 10 Shared UI A11y Localization RED 首次因 Dialog/Sheet/Breadcrumb 仍使用英文无障碍文本失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/reduced-motion-css.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Shared UI A11y Localization 后共享 UI、reduced-motion 和学习 UI 回归 21 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Shared UI A11y Localization 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/voice`、`/progress`、`/projects/portfolio`。
- `npm test -- tests/unit/reduced-motion-css.test.ts`：Phase 10 Reduced Motion A11y RED 首次因全局样式缺少 `prefers-reduced-motion: reduce` 失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts`：Phase 10 Reduced Motion A11y 后学习 UI 与 Voice 回归 30 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Reduced Motion A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/voice`、`/progress`、`/projects/portfolio`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 LearningStepCard A11y RED 首次因共享步骤卡缺少 `sr-only` 中文步骤/状态文本且仍输出 `title="step 2"` 失败；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts`：Phase 10 LearningStepCard A11y 后 Voice 工作台和录音状态回归 12 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts`：Phase 10 LearningStepCard A11y 格式修正后合并复跑 30 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 LearningStepCard A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/voice`、`/today`、`/progress`、`/projects/portfolio`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Shared ProgressBar A11y RED 首次因共享进度条缺少 `progressbar` 语义失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase 10 Motivation Progress Labels A11y RED 首次因学习动机卡仍输出默认 `aria-label="学习进度"` 失败；GREEN 后 8 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts`：Phase 10 Motivation Progress Labels A11y 后学习动机卡和学习 UI 回归 27 tests 通过。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Motivation Progress Labels A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/projects/portfolio` 和 `/manifest.webmanifest`。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts`：Phase 10 Remaining Progress Labels A11y RED 首次因剩余进度条仍缺少具体 `aria-label` 失败；GREEN 后 43 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/map-analytics.test.ts`：Phase 10 Remaining Progress Labels A11y 合并回归 51 tests 通过。
- `rg -n -C 3 "<LearningProgressBar" src/app src/components`：Phase 10 Remaining Progress Labels A11y 覆盖扫描确认所有共享进度条调用点都有具体 `label`。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 10 Remaining Progress Labels A11y 收尾通过；Next 生产构建生成 28 个静态页面，路由表包含 `/map`、`/path`、`/weekly`、`/projects/portfolio` 和 `/manifest.webmanifest`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 FocusPlayer Stage A11y RED 首次因阶段切换按钮缺少状态语义失败；GREEN 后 16 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase 10 Progress Calendar A11y RED 首次因学习日历缺少中文状态 `aria-label` 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 10 Today Full View A11y RED 首次因折叠区缺少 `aria-expanded` 和内容区域关联失败；GREEN 后 16 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts`：Phase 10 a11y 细化合并回归通过，30 tests。
- `git diff --check`、`npm run lint`：Phase 10 a11y 细化收尾通过。
- `npm run build`：Phase 10 a11y 细化 resume 后 fresh rerun 通过；Next 生产构建生成 28 个静态页面，路由表包含 `/today`、`/progress`、`/projects/portfolio`、`/manifest.webmanifest`。
- `git diff --check`：Weekly Markdown Export 文档补丁后复跑通过。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/weekly`：Weekly Markdown Export runtime smoke 返回 HTTP 200，`TIME_TOTAL=2.517384`，`SIZE=107592`，页面包含 `导出 Weekly Markdown`、`# Roky Learn Weekly Report`、`7 天总览`、`AI 周总结` 和 `下周建议`。
- `npm test -- tests/unit/pwa-manifest.test.ts`：Phase 3.5 PWA Shortcuts RED 首次因 manifest 缺少 `shortcuts` 失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/auth-policy.test.ts`：Phase 3.5 public manifest RED 首次因 `/manifest.webmanifest` 被识别为 protected path 失败；GREEN 后纳入 public path。
- `npm test -- tests/unit/auth-policy.test.ts tests/unit/pwa-manifest.test.ts`：Phase 3.5 后 11 tests 通过，覆盖 PWA shortcuts 和 manifest public auth boundary。
- `curl http://127.0.0.1:3000/manifest.webmanifest`：未登录 runtime smoke 返回 HTTP 200、`CONTENT_TYPE=application/manifest+json`，JSON 包含 `start_url=/today`、`display=standalone` 和四个 shortcuts。
- `git diff --check`、`npm run lint`：Phase 3.5 后通过。
- `npm run build`：Phase 3.5 后通过，Next 路由表显示 `/manifest.webmanifest` 为静态资源，静态页面生成数为 28。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase 8.1 RED 首次因首页项目卡缺少 `今日里程碑` 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-motivation.test.ts`：Phase 8.1/8.3 后 42 tests 通过，覆盖首页项目节奏、Projects Mission Mode、项目服务、Today 项目推荐和 Daily Quest 回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 8.1/8.3 后通过，生产构建路由表包含首页 `/` 和 `/projects` 动态页面。
- `npm test`：guidance 覆盖审计后全量 286 tests 通过。
- `npm run audit:routes && npm run audit:learning`：通过；核心页面、导航和学习系统必需文件无缺口，manual migrations 均已在文档中覆盖。
- `git diff --check`：guidance 覆盖审计后通过。
- `git diff --check`、`npm run lint`、`npm run build`：最终续跑验证通过；Next 生产构建 27 个静态页面，路由表包含 `/`、`/projects`、`/path`、`/weekly`、`/mistakes`、`/voice`、`/coach`、`/glossary`、`/radar`、`/map`、`/admin`。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/`：最终运行时 smoke 返回 HTTP 200，`TIME_TOTAL=3.968748`，`SIZE=198825`。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/projects`：最终运行时 smoke 返回 HTTP 200，`TIME_TOTAL=3.950802`，`SIZE=135757`。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/smoke.spec.ts --project="Desktop Chrome"`：首次复跑暴露 smoke 断言陈旧；同步 Weekly 重复文案 locator、Glossary `已看` 文案和 Review 评分按钮可访问名称后通过，2 tests。
- `git diff --check`、`npm run lint`：smoke 测试同步后通过。
- `npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 8.4 RED 首次因缺少 `portfolioMarkdown` 和 `导出 Portfolio Markdown` UI 失败；GREEN 后 26 tests 通过。
- `npm test -- tests/unit/projects.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 8.4 后 35 tests 通过，覆盖 Projects portfolio、Mission workspace 和 Today 项目推荐回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 8.4 后通过；Next 生产构建 27 个静态页面，路由表包含 `/projects`。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase 8.4 Portfolio Route RED 首次因缺少 `ProjectPortfolioPageContent` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts`：Phase 8.4 Portfolio Route 后 27 tests 通过，覆盖 dedicated portfolio 页面内容、portfolio panel 和项目服务回归。
- `npm run audit:routes && npm run audit:learning`：Phase 8.4 Portfolio Route 后通过；route audit 显示 `Pages: 19`、`/projects/portfolio` 存在且 `Pages without navigation: none`。
- `git diff --check`、`npm run lint`：Phase 8.4 Portfolio Route 后通过。
- `npm run build`：Phase 8.4 Portfolio Route 后通过；Next 路由表包含 `/projects/portfolio`，静态页面生成数为 28。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/projects/portfolio`：Phase 8.4 Portfolio Route runtime smoke 返回 HTTP 200，`TIME_TOTAL=4.405039`，`SIZE=58522`，页面包含 `项目作品集`、`可导出的学习 portfolio`、`回到项目实践`。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/hydration.spec.ts --project="Desktop Chrome" -g "projects-portfolio"`：通过 1 test，覆盖新页面无 hydration mismatch console errors。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/visual.spec.ts --project="Desktop Chrome" -g "projects-portfolio"`：通过 1 test，覆盖新页面截图非空。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome" -g "projects-portfolio"`：通过 2 tests，覆盖 Desktop/Mobile axe serious/critical violations。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/mobile-matrix.spec.ts --project="Desktop Chrome" -g "projects-portfolio"`：通过 6 tests，覆盖 375/390/430/768/1024/1440 宽度。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase 2.5 RED 首次因缺少 `@/server/learning/habit-goal` 失败；GREEN 后 8 tests 通过，覆盖周目标、连续学习保护和轻量学习模式。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/progress-analytics.test.ts tests/unit/current-mission.test.ts`：Phase 2.5 后 24 tests 通过，覆盖学习动机、Progress analytics 和 Current Mission 回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 2.5 后通过；Next 生产构建 27 个静态页面，路由表包含首页 `/` 和 `/progress` 动态页面。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase 8.3 RED 首次因 `ProjectMissionBrief` 缺少 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口` 和 `保存并评审代码` 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 8.3 后 35 tests 通过，覆盖 Projects Mission Mode、项目服务和 Today 项目推荐回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 8.3 后通过，生产构建路由表包含 `/projects` 动态页面。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase 7.1 RED 首次因 `/glossary` 仍包含 `.slice(0, 2)` 且指标文案仍为 `已看过` / `已制卡` 失败；GREEN 后 26 tests 通过，覆盖 curated paths 顺序、页面不截断和 `KnowledgePathExplorer` 指标文案。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/learning-path.test.ts`：Phase 7.1 后 29 tests 通过，覆盖 curated path、学习 UI 和 `/path` 回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 7.1 后通过，生产构建路由表包含 `/glossary` 和 `/radar` 动态页面。
- `npm test -- tests/unit/voice-note.test.ts`：Phase 6.3 RED 首次因 `代码思路` 等模板仍显示定制问题失败；GREEN 后 7 tests 通过，覆盖六个模板入口都显示统一四句提示。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts`：Phase 6.3 后通过，33 tests，覆盖 Voice template、transcription、save、pipeline、Coach 来源面板回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 6.3 后通过，生产构建路由表包含 `/voice` 和 `/coach` 动态页面。
- `npm test -- tests/unit/voice-transcription.test.ts`：Phase 6.1/6.2 RED 首次因缺少固定 prompt 句式、新增术语和 `chain of thought -> Chain-of-Thought` cleanup 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts`：Phase 6.1/6.2 后通过，12 tests，覆盖 Voice transcription、Voice Note mode/title/handoff、录音控件和反思模板回归。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts`：Phase 6.1/6.2 后通过，33 tests，覆盖 Voice 保存、转写 fallback、Note/Coach/Flashcards 服务、Voice pipeline 和 Coach 来源面板回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 6.1/6.2 后通过，生产构建路由表包含 `/voice` 和 `/coach` 动态页面。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase 5.4 RED 首次因缺少 `weeklyOverview.studyDays`、空数据 `weeklyOverview` 和页面 `7 天总览` 标签失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`：Phase 5.4 后通过，23 tests，覆盖 Weekly、Path、Mistakes 和 auth/Preview policy 回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 5.4 后通过，生产构建路由表包含 `/weekly` 动态页面。
- `curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/weekly"`：Phase 5.4 后 HTTP 200，`TIME_TOTAL=1.952114`，`SIZE=100783`；SSR HTML 中 `7 天总览`、`AI 周总结`、`Voice Note`、`Coach 次数`、`项目里程碑`、`术语/Radar 覆盖`、`推荐下一阶段` 均可见。
- `npm test -- tests/unit/weekly-review.test.ts`：Phase 5.4 Weekly Markdown Export RED 首次因缺少 `weeklyReportMarkdown` 和 `导出 Weekly Markdown` 页面展示失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 5.4 Weekly Markdown Export 后 25 tests 通过，覆盖 Weekly、Progress analytics 和 Today completion 回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 5.4 Weekly Markdown Export 后通过；Next 路由表保持 `/weekly`、`/today`、`/voice` 和 `/projects/portfolio`。
- `npm test -- tests/unit/learning-path.test.ts`：Phase 5.3 RED 首次因缺少 `quizAccuracy`、`unlockCondition`、`nextTopic` 失败；页面展示 RED 首次因 `/path` 源码缺少 `测验正确率` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`：Phase 5.3 后通过，22 tests，覆盖 Path、Weekly、Mistakes 和 auth/Preview policy 回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 5.3 后通过，生产构建路由表包含 `/path` 动态页面。
- `curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/path"`：Phase 5.3 后 HTTP 200，`TIME_TOTAL=3.227744`，`SIZE=200925`；SSR HTML 中 `测验正确率`、`解锁条件`、`下一步主题` 各出现 16 次，`学习路径` 出现 7 次。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`：Phase 5.2 RED 首次因缺少类型筛选、项目来源、复习卡生成和 Preview action 守卫覆盖失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase 5.2 后通过，37 tests，覆盖 `/mistakes` 修复中心、Preview 写保护、Review 补弱和 Today remediation 回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 5.2 后通过。
- `curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/mistakes?kind=term&source=project&status=all"`：Phase 5.2 后 HTTP 200，页面包含 `错题误区`、`筛选视图`、`类型`、`项目实践`、`全部类型`、`术语`。
- `npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts`：Phase 5.1 RED 首次因缺少 `remediationActions` 和 `补弱动作` UI 失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/today-remediation-intent.test.ts`：Phase 5.1 RED 首次因缺少 `TodayRemediationBanner` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase 5.1 后通过，29 tests，覆盖 Review 补弱动作、Today remediation landing 和 Today 完成卡回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 5.1 后通过。
- `curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/today?mode=remediation&source=review&focus=RAG&lesson=RAG"`：Phase 5.1 后 HTTP 200，`TIME_TOTAL=4.762276`，`SIZE=177453`，页面包含 `Review 补弱短课`、`补弱短课已带入`、`生成补弱小课` 和 `RAG`。
- `npm test -- tests/unit/today-stage-status.test.ts`：Phase 4.2 RED 首次因缺少 `@/server/learning/today-stage-status` 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase 4.2 后通过，26 tests，覆盖阶段状态、Completion Hub 和学习 UI 回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 4.2 后通过。
- `npm test -- tests/unit/today-completion-next-actions.test.ts`：Phase 4.5 RED 首次因缺少 `completionHub` 和 `今日完成 Hub` 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 4.5 后通过，33 tests，覆盖 Completion Hub、Today 完成后项目推荐、学习 UI 和项目工作台回归。
- `npm run lint`、`git diff --check`、`npm run build`：Phase 4.5 后通过。
- `npm test -- tests/unit/today-completion-next-actions.test.ts`：Phase 4.5 Voice Reflection Recommendation RED 首次因缺少 `recommendedVoiceReflection` 和 `推荐语音反思` UI 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 4.5 Voice Reflection Recommendation 后 35 tests 通过，覆盖 Today completion、学习 UI 和 Projects 回归。
- `git diff --check`、`npm run lint`、`npm run build`：Phase 4.5 Voice Reflection Recommendation 后通过；Next 路由表保持 `/today`、`/voice` 和 `/projects/portfolio`。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/today`：Phase 4.5 后 HTTP 200，`TIME_TOTAL=5.110418`，`SIZE=163970`；当前本地 demo 数据为 `等待完成`，页面包含 `完成后下一步`、`生成卡片`、`小测验`，不显示仅完成态出现的 `今日完成 Hub`。
- `npm test -- tests/unit/today-completion-next-actions.test.ts`：Phase 8.2 RED 首次因完成卡缺少 `下一步：把今天的知识用到项目里` 和 `推荐项目任务` 失败；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`：Phase 8.2 后通过，31 tests，覆盖 Today 完成后项目推荐、学习 UI 和项目工作台回归。
- `npm run lint`、`git diff --check`：Phase 8.2 后通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts`：Phase 6.4 RED 首次因缺少 `@/server/voice/handoff` 和 `CoachVoiceSourcePanel` 导出失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase 7.2 RED 首次因 glossary 抢占 Benchmark/人物轮转失败，实际返回 `今日术语挑战`；GREEN 后 7 tests 通过。
- `npm test -- tests/unit/daily-breadth.test.ts tests/unit/learning-motivation.test.ts tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts`：Phase 7.2 后通过，36 tests，覆盖 daily breadth 轮转、Daily Quest、知识路径和学习 UI。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/`：Phase 7.2 后 HTTP 200，`TIME_TOTAL=3.849487`，`SIZE=207352`，页面包含 `今日任务` 和本地样本下的 `今日术语挑战`。
- `npm run lint`、`git diff --check`：Phase 7.2 后通过。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase 7.3 RED 首次因缺少 `@/server/knowledge/radar-relations` 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/daily-breadth.test.ts`：Phase 7.3 后通过，30 tests，覆盖关系卡片分组、学习 UI 和 daily breadth 回归。
- `curl -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/radar?entity=shunyu-yao"`：Phase 7.3 后 HTTP 200，`TIME_TOTAL=3.703587`，`SIZE=673641`，页面包含 `关系卡片链`、`相关实体`、`相关术语`、`相关论文`、`相关 Benchmark` 和 `SWE-bench`。
- `npm run lint`、`git diff --check`：Phase 7.3 后通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/learning-ui-components.test.ts`：Phase 6.4 后通过，47 tests。
- `npm test`：Phase 6.4 后通过，268 tests。
- `git diff --check`、`npm run lint`：Phase 6.4 后通过。
- `npm run build`：Phase 6.4 后通过，27 static pages，`/coach` 和 `/voice` 动态页面构建通过。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/coach`：Phase 6.4 后 HTTP 200，`TIME_TOTAL=4.792984`，`SIZE=170070`。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice`：Phase 6.4 后 HTTP 200，`TIME_TOTAL=3.721715`，`SIZE=126872`。
- 只读 Prisma 查询：本地 demo-user 当时没有现成 Voice-linked `ThoughtReview`，因此未直接打开持久样本 `/coach?reviewId=...`；改用 E2E 创建临时 Voice Note 并在 finally 清理。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome" -g "voice flow sends transcript to coach"`：Phase 6.4 E2E RED 首次因旧测试仍寻找 `/voice` 上的 `已送 Coach` 失败；更新后通过 1 test，覆盖 Voice → Coach review 来源面板 → Coach cards → `/review?source=thought-review`。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：Phase 6.4 后通过，28 tests，包含 `/coach` 和 `/voice` Desktop/Mobile axe smoke。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：Phase 6.4 首次运行 83/84 通过，`/mistakes` 430px 出现 transient `page.goto` 60s timeout；`curl /mistakes` 0.148938s、单项复跑 704ms 通过，完整矩阵复跑 84 tests 通过，包含 `/coach` 和 `/voice` 375/390/430/768/1024/1440 宽度。
- `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts`：Phase 3.4 RED 首次因录音停止后仍提示手动转写、录音按钮仍是小触控文案失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 3.4 RED 首次因 Voice 流水线 CTA 仍为小按钮失败；GREEN 后 15 tests 通过。
- `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/learning-ui-components.test.ts`：Phase 3.4 后通过，38 tests。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice`：Phase 3.4 后 HTTP 200，`TIME_TOTAL=0.228079`，`SIZE=126872`，页面包含 `一键录音`、`停止并转写`、`停止后自动转写并填入 Transcript`、`grid gap-2 sm:flex sm:flex-wrap` 和 `min-h-11 w-full sm:w-auto`。
- `git diff --check`：Phase 3.4 后通过。
- `npm run lint`：Phase 3.4 后通过。
- `npm test`：Phase 3.4 后通过，266 tests。
- `npm run build`：Phase 3.4 后通过，27 static pages，`/voice` 动态页面构建通过。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：Phase 3.4 后通过，28 tests，包含 `/voice` Desktop/Mobile axe smoke。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：Phase 3.4 后通过，84 tests，包含 `/voice` 375/390/430/768/1024/1440 宽度。
- `npm test -- tests/unit/map-analytics.test.ts`：通过，6 tests；新增首屏领域/主题窗口化 helper 的 RED/GREEN 覆盖。
- `npm test -- tests/unit/admin-content-review.test.ts`：通过，2 tests；新增卡片质量与知识来源核验队列规则覆盖。
- `npm test -- tests/unit/admin-content-review.test.ts tests/unit/daily-generation-quality.test.ts`：通过，6 tests；覆盖 Admin 内容质量相关服务。
- `npm test -- tests/unit/admin-prompt-studio.test.ts`：RED 后 GREEN，通过 2 tests；覆盖 prompt/schema 汇总、失败样例、fallback/repair 样例和 manual repair readiness。
- `npm test -- tests/unit/daily-generation-prompt.test.ts tests/unit/daily-generation-quality.test.ts`：通过，7 tests；覆盖新增 prompt version 追踪未破坏 daily generation prompt/quality。
- `npm test -- tests/unit/learning-ui-components.test.ts`：RED 后 GREEN，通过 12 tests；覆盖 `LearningCelebrationCue` 和 Today 完成态反馈。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：通过，9 tests；覆盖 Projects 里程碑完成态反馈。
- `npm test -- tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts`：通过，28 tests；覆盖 Today 完成后下一步、学习 UI 组件和项目工作台回归。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 4.3 RED 首次因缺少阶段指导文案失败，GREEN 后 12 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 4.4 RED 首次因缺少 `data-learning-callout` 和 `data-copy-code` 失败，GREEN 后 13 tests 通过。
- `npm test -- tests/unit/daily-generation-prompt.test.ts`：Phase 4.4 RED 首次因 prompt 缺少 `> 核心直觉` 等课程块协议失败，GREEN 后 4 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts`：通过，19 tests；覆盖 Markdown、FocusPlayer、daily prompt 和 Prompt Studio 版本链路。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 3.2 RED 首次因缺少 `sticky top-0`、`sticky bottom-16` 和 `min-h-11` 失败，GREEN 后 13 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase 3.3 RED 首次因 Review 活动卡片未居中、显示答案/评分按钮触控面积不足和手机端快捷键提示边界缺失失败，GREEN 后 15 tests 通过。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/review`：Phase 3.3 后 HTTP 200，`TIME_TOTAL=0.788528`，页面本地可达。
- `npm run lint`：Phase 3.3 后通过。
- `npm test`：Phase 3.3 后通过，264 tests。
- `npm run build`：Phase 3.3 后通过，27 static pages，`/manifest.webmanifest`、`/icon.svg` 正常产出。
- `git diff --check`：Phase 3.3 后通过。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：Phase 3.3 后通过，28 tests。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：Phase 3.3 后通过，84 tests，覆盖 375/390/430/768/1024/1440。
- `curl -sS -D - -o /tmp/roky-admin-prompt-studio.html -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/admin" -w ...`：HTTP 200，热请求 `TIME_TOTAL=0.676341`，页面包含 `Prompt Studio`、`Prompt version`、`Schema version`、`手动 repair 测试`、`最近失败样例`、`重新生成某日期`。
- `curl -sS -D - -o /tmp/roky-map.html -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/map" -w ...`：HTTP 200，`SIZE=216442`，`TIME_TOTAL=1.791929`；修复前同探针约 `SIZE=25527457`，`TIME_TOTAL=58.320752`。
- `curl -sS -D - -o /tmp/roky-admin.html -H "Cookie: ral_demo=1" "http://127.0.0.1:3000/admin" -w ...`：HTTP 200，热请求 `TIME_TOTAL=0.643575`，页面包含 `卡片质量审查` 和 `来源核验队列`。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：通过，28 tests；覆盖 14 个核心页面的 axe WCAG 2A/2AA/2.1A/2.1AA serious/critical violations。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：通过，84 tests；覆盖 14 个核心页面在 375/390/430/768/1024/1440 宽度下无横向溢出且主 heading 可见。
- `E2E_BASE_URL=http://127.0.0.1:3000 E2E_PREVIEW_TOKEN=<redacted-temp-token> npm run e2e:preview-readonly`：通过，4 tests；覆盖 Preview 下 Settings、Today quiz、Today code 写操作拒绝和 `/admin` 隐藏。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:hydration`：通过，16 tests；覆盖 visual page 列表中所有页面的 hydration mismatch console guard。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/visual.spec.ts --project="Desktop Chrome" --project="Mobile Chrome" -g "map renders stable screenshot"`：通过，2 tests。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/visual.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：通过，32 tests。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：通过，262 tests。
- `npm run audit:routes`：通过，Pages 18，Navigation entries 15，Missing core pages none。
- `npm run audit:learning`：通过，Required files missing none，Manual migrations missing from docs none。
- `npm run build`：通过，27 static pages，`/manifest.webmanifest`、`/icon.svg` 正常产出。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/today`：HTTP 200，`SIZE=163730`，页面本地可达。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：通过，28 tests。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：复跑通过，84 tests；一次早先运行中 `/voice` 1440px 出现 `page.goto` 60s transient timeout，单用例随后 617ms 通过，完整矩阵复跑全部通过。
- `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/today`：Phase 3.2 后 HTTP 200，`SIZE=163960`，页面本地可达。
- `E2E_BASE_URL=http://127.0.0.1:3000 npm run e2e:mobile-matrix`：Phase 3.2 后通过，84 tests，覆盖 375/390/430/768/1024/1440。
- `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/a11y.spec.ts --project="Desktop Chrome" --project="Mobile Chrome"`：Phase 3.2 后通过，28 tests。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Review Summary CTA RED 首次因 `reviewSummary.ctaLabel` 附近缺少 `className={todayFocusCtaClassName}` 失败；GREEN 后 4 tests 通过，覆盖右侧 `今日复习入口` 可点击和 disabled CTA 复用移动端大触控 class。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Today Review Summary CTA 后 38 tests 通过，覆盖 Today 复习摘要 CTA、专注入口 CTA、共享学习 UI、阶段状态和完成后行动回归。
- `rg -n "Today Review Summary CTA|reviewSummary\\.ctaLabel|todayFocusCtaClassName|今日复习入口|min-h-11 w-full sm:w-auto" ...`：Phase E Today Review Summary CTA 覆盖扫描确认 `/today` 源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入复习摘要 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Today Review Summary CTA 后通过；Next 构建生成 28 个静态页面，路由表包含 `/today`。
- `aegis-workspace.py bundle/check`：仍为已知结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报历史 `docs/aegis/work/.../*.md` 未索引，不属于产品 UI 验证失败。
- `npm test -- tests/unit/mistakes-view.test.ts`：Phase E Mistakes Repair Action CTA RED 首次因 `/mistakes/page.tsx` 缺少 `mistakeRepairActionCtaClassName` 和修复动作移动端单列布局失败；GREEN 后 8 tests 通过，覆盖 `让 Coach 解释`、`生成复习卡`、`标记已解决`、`回到课程` 四个修复动作复用移动端大触控 class。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Mistakes Repair Action CTA 后 46 tests 通过，覆盖 `/mistakes` 修复动作、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI 回归。
- `rg -n "Phase E Mistakes Repair Action|mistakeRepairActionCtaClassName|让 Coach 解释|生成复习卡|标记已解决|回到课程|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap" ...`：Phase E Mistakes Repair Action CTA 覆盖扫描确认 `/mistakes` 源码、测试、UI checklist、CHANGELOG、Mistakes 模块文档和 Aegis 记录均接入修复动作 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Mistakes Repair Action CTA 后通过；Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- `aegis-workspace.py bundle/check`：仍为已知结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报历史 `docs/aegis/work/.../*.md` 未索引，不属于产品 UI 验证失败。
- `npm test -- tests/unit/notes-template.test.ts`：Phase E Notes CTA Mobile Touch Targets RED 首次因 `/notes/page.tsx` 缺少 `notesCtaClassName`、关联课程 action 单列布局和保存 action 单列布局失败；GREEN 后 5 tests 通过，覆盖 `去今日学习`、`看课程档案`、`保存笔记` 三个 CTA 复用移动端大触控 class。
- `npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Notes CTA Mobile Touch Targets 后 21 tests 通过，覆盖 Notes 模板、Notes 列表、Notes 创建权限、Library 下一步和 Today 完成后笔记入口回归。
- `rg -n "Phase E Notes CTA|notesCtaClassName|去今日学习|看课程档案|保存笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:items-center" ...`：Phase E Notes CTA Mobile Touch Targets 覆盖扫描确认 Notes 源码、测试、UI checklist、CHANGELOG、Notes 模块文档和 Aegis 记录均接入 Notes CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Notes CTA Mobile Touch Targets 后通过；Next 构建生成 28 个静态页面，路由表包含 `/notes`。
- `aegis-workspace.py bundle/check`：仍为已知结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报历史 `docs/aegis/work/.../*.md` 未索引，不属于产品 UI 验证失败。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Lesson CTA Mobile Touch Targets RED 首次因 `/library/page.tsx` 缺少 `libraryCtaClassName`、课程下一步 action 单列布局和 `写笔记` 移动端大触控 class 失败；GREEN 后 2 tests 通过，覆盖课程下一步 action panel 和关联笔记入口。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Library Lesson CTA Mobile Touch Targets 后 22 tests 通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口回归。
- `rg -n "Phase E Library Lesson CTA|libraryCtaClassName|课程下一步|写笔记|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Library Lesson CTA Mobile Touch Targets 覆盖扫描确认 Library 源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入课程详情 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm run build`：Phase E Library Lesson CTA Mobile Touch Targets 后通过；Next 构建生成 28 个静态页面，路由表包含 `/library`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Filter CTA Mobile Touch Targets RED 首次因 `/library` 筛选 action row 仍为手机端横向 `flex`，且 `切换 test`、`切换 archived`、`清空筛选`、`应用筛选` 未接入 `libraryCtaClassName` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Library Filter CTA Mobile Touch Targets 相关回归 23 tests 通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口。
- `rg -n "Phase E Library Filter CTA|libraryCtaClassName|切换 test|切换 archived|清空筛选|应用筛选|min-h-11 w-full sm:w-auto|grid gap-2 sm:flex sm:flex-wrap sm:items-center" ...`：Phase E Library Filter CTA 覆盖扫描确认 Library 源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入筛选 CTA 移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Filter CTA Mobile Touch Targets 收尾门禁通过；全量单测 344 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- `aegis-workspace.py bundle/check`：仍为已知结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报历史 `docs/aegis/work/.../*.md` 未索引，不属于产品 UI 验证失败。
- `npm test -- tests/unit/today-remediation-intent.test.ts`：Phase E Today Remediation Banner CTA Mobile Touch Targets RED 首次因 `TodayRemediationBanner` action row 仍为手机端横向 `flex flex-wrap` 失败；GREEN 后 4 tests 通过，覆盖 `先回到主课`、`生成补弱小课`、`继续复习` 三个 CTA 复用移动端大触控 class。
- `npm test -- tests/unit/today-remediation-intent.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Today Remediation Banner CTA Mobile Touch Targets 相关回归 39 tests 通过，覆盖补弱 Banner、Review Session Summary、Today completion actions 和共享学习 UI。
- `rg -n "Phase E Today Remediation Banner|TodayRemediationBanner|先回到主课|生成补弱小课|继续复习|mt-4 grid gap-2 sm:flex sm:flex-wrap sm:items-center|min-h-11 w-full sm:w-auto" ...`：Phase E Today Remediation Banner CTA 覆盖扫描确认组件、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入补弱 Banner 移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Today Remediation Banner CTA Mobile Touch Targets 收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/today` 和 `/review`。
- `npm test -- tests/unit/learning-ui-components.test.ts`：Phase E FocusPlayer Full View Actions Mobile Layout RED 首次因 `LearningFocusPlayer` 右侧 `完整视图` actions row 仍为手机端横向 `flex flex-wrap` 失败；GREEN 后 24 tests 通过。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E FocusPlayer Full View Actions Mobile Layout 相关回归 40 tests 通过，覆盖 FocusPlayer、Today 入口、阶段状态和完成后行动。
- `rg -n "Phase E FocusPlayer Full View|LearningFocusPlayer|完整视图|mt-3 grid gap-2 sm:flex sm:flex-wrap|mt-3 flex flex-wrap gap-2" ...`：Phase E FocusPlayer Full View Actions Mobile Layout 覆盖扫描确认组件、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入完整视图 actions 移动端单列布局要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E FocusPlayer Full View Actions Mobile Layout 本地收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Filter Input Mobile Touch Targets RED 首次因 `/library` 缺少 `libraryFilterInputClassName`，且四个治理筛选输入仍为 `h-8` 失败；GREEN 后 3 tests 通过。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Library Filter Input Mobile Touch Targets 相关回归 23 tests 通过，覆盖 Library 可见标签、课程下一步、筛选、课程详情、Notes 创建权限和 Today 完成后笔记入口。
- `rg -n "Phase E Library Filter Input|libraryFilterInputClassName|min-h-11 rounded-md border bg-background px-3 text-sm|h-8 rounded-md border bg-background px-2 text-sm|source|schemaVersion|localDate" ...`：Phase E Library Filter Input 覆盖扫描确认 `/library` 源码和测试均接入筛选输入触控要求，旧 `h-8` 输入样式已移除。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Library Filter Input Mobile Touch Targets 本地收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/library`。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Reflection Submit CTA Mobile Touch Targets RED 首次因两处反思提交行仍为 `flex flex-wrap`，且提交按钮缺少 `todayFocusCtaClassName` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-remediation-intent.test.ts`：Phase E Today Reflection Submit CTA Mobile Touch Targets 相关回归 44 tests 通过，覆盖 Today 入口 CTA、共享学习 UI、阶段状态、完成后行动和补弱入口。
- `rg -n "Phase E Today Reflection Submit|标记完成并生成卡片|todayFocusCtaClassName|grid gap-2 sm:flex sm:flex-wrap sm:items-center|flex flex-wrap items-center gap-2" ...`：Phase E Today Reflection Submit CTA 覆盖扫描确认 `/today` 源码和测试均接入反思提交移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Today Reflection Submit CTA Mobile Touch Targets 本地收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/today`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Capture Manual Transcribe Mobile Touch Targets RED 首次因上传音频 input 仍为 `h-8`，且手动转写行仍为手机端横向 `flex flex-wrap` 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Capture Manual Transcribe Mobile Touch Targets 相关回归 52 tests 通过，覆盖 Voice 表单、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `rg -n "Phase E Voice Capture Manual Transcribe|voice-audio-file|自动转写到 Transcript|min-h-11|grid gap-2 sm:flex sm:flex-wrap sm:items-center|Voice Capture Manual" ...`：Phase E Voice Capture Manual Transcribe 覆盖扫描确认 Voice 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入上传/手动转写移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Capture Manual Transcribe Mobile Touch Targets 本地收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/voice`。
- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Knowledge Search Input Mobile Touch Targets RED 首次因 `/glossary` 和 `/radar` 缺少搜索输入专用 `min-h-11` class 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Knowledge Search Input Mobile Touch Targets 相关回归 55 tests 通过，覆盖 Glossary/Radar 知识库、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Knowledge Search Input Mobile Touch Targets 续跑收尾门禁通过；全量单测 345 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/glossary` 和 `/radar`。
- `npm test -- tests/unit/mistakes-view.test.ts`：Phase E Mistakes Search Input Mobile Touch Targets RED 首次因 `/mistakes` 缺少搜索输入专用 `min-h-11` class 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/review-session-summary.test.ts tests/unit/today-remediation-intent.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Mistakes Search Input Mobile Touch Targets 相关回归 50 tests 通过，覆盖 Mistakes 视图、Preview 写保护、Review 补弱、Today remediation 和共享学习 UI。
- `rg -n "Phase E Mistakes Search Input|mistakeSearchInputClassName|min-h-11|搜索 RAG / 二分 / SWE-bench / 术语混淆|搜索错题" ...`：Phase E Mistakes Search Input 覆盖扫描确认 `/mistakes` 源码、测试、UI checklist、CHANGELOG、Mistakes 模块文档和 Aegis 记录均接入搜索输入移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Mistakes Search Input Mobile Touch Targets 收尾门禁通过；全量单测 346 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/mistakes`。
- `npm test -- tests/unit/login-page-ui.test.ts`：Phase E Login Input Mobile Touch Targets RED 首次因 `/login` 访问密码和邮箱输入框缺少专用 `min-h-11` class 失败；GREEN 后 2 tests 通过。
- `npm test -- tests/unit/login-page-ui.test.ts tests/unit/password-auth.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Login Input Mobile Touch Targets 相关回归 38 tests 通过，覆盖登录页输入/CTA、访问密码服务、Auth/Preview 路由策略和共享学习 UI。
- `rg -n "Phase E Login Input|passwordLoginInputClassName|emailLoginInputClassName|min-h-11|输入共享访问密码|you@example.com|登录页访问密码输入框|Login Input Mobile Touch Targets" ...`：Phase E Login Input Mobile Touch Targets 覆盖扫描确认 `/login` 源码、测试、UI checklist、CHANGELOG、Auth/Demo 模块文档和 Aegis 记录均接入登录输入框移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Login Input Mobile Touch Targets 收尾门禁通过；全量单测 347 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/login`。
- `npm test -- tests/unit/settings-profile.test.ts`：Phase E Settings Input Mobile Touch Targets RED 首次因 `/settings` 缺少 `settingsInputClassName`，且 8 个单行输入框未接入移动端大触控 class 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Settings Input Mobile Touch Targets 相关回归 39 tests 通过，覆盖 Settings 表单输入/保存、Auth/Preview 写保护和共享学习 UI。
- `rg -n "Phase E Settings Input|settingsInputClassName|min-h-11|displayName|knowledgeAvoidDays|显示名称|知识卡去重天数|Settings Input Mobile Touch Targets|单行输入框" ...`：Phase E Settings Input Mobile Touch Targets 覆盖扫描确认 `/settings` 源码、测试、UI checklist、CHANGELOG、Settings 模块文档和 Aegis 记录均接入单行输入框移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Settings Input Mobile Touch Targets 收尾门禁通过；全量单测 348 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/settings`。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Milestone Input Mobile Touch Targets RED 首次因 `/projects` 缺少 `projectMilestoneInputClassName`，且三个里程碑表单输入未接入移动端大触控 class 失败；GREEN 后 16 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Projects Milestone Input Mobile Touch Targets 相关回归 41 tests 通过，覆盖项目 UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "Phase E Projects Milestone Input|projectMilestoneInputClassName|min-h-11|lessonId|noteId|代码语言|Projects Milestone Input Mobile Touch Targets|单行输入框" ...`：Phase E Projects Milestone Input Mobile Touch Targets 覆盖扫描确认 `/projects` 源码、测试、UI checklist、CHANGELOG、Project Practice 模块文档和 Aegis 记录均接入里程碑输入框移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Milestone Input Mobile Touch Targets 收尾门禁通过；全量单测 349 tests 通过，Next 构建生成 28 个静态页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `npm test -- tests/unit/notes-template.test.ts`：Phase E Notes Title Input Mobile Touch Targets RED 首次因 `/notes` 缺少 `notesInputClassName`，且标题输入框未接入移动端大触控 class 失败；GREEN 后 6 tests 通过。
- `npm test -- tests/unit/notes-template.test.ts tests/unit/notes-page-ui.test.ts tests/unit/notes-create.test.ts tests/unit/library-next-actions.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Notes Title Input Mobile Touch Targets 相关回归 22 tests 通过，覆盖 Notes 模板、Notes 列表/Voice handoff、Notes 创建权限、Library 下一步和 Today 完成后笔记入口。
- `rg -n "notesInputClassName|min-h-11|Phase E Notes Title Input|新建笔记|标题" ...`：Phase E Notes Title Input 覆盖扫描确认 Notes 源码、测试、UI checklist、CHANGELOG、Notes 模块文档和 Aegis 记录均接入标题输入框移动触控要求。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Notes Title Input Mobile Touch Targets 本地收尾门禁通过；全量单测 350 tests 通过，Next 构建生成 28 个页面，路由表包含 `/notes`。
- `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts`：Phase E Voice Transcript Copy Localization RED 首次因 Voice 状态面板、录音提示、手动转写按钮和 autofill notice 仍显示 `Transcript` 失败；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Transcript Copy Localization 相关回归通过，覆盖 Voice 捕获状态、Voice Note 表单、自动填入、转写服务、Coach handoff 和共享学习 UI。
- `rg -n "Phase E Voice Transcript Copy|转写文本|自动转写到转写文本|停止后自动转写并填入转写文本|Transcript" ...`：Phase E Voice Transcript Copy Localization 覆盖扫描确认 Voice 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入转写文案本地化要求；当前 Voice 捕获源码中 `Transcript` 仅保留为内部类型/变量名。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Transcript Copy Localization 本地收尾门禁通过；全量单测 351 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `npm test -- tests/unit/learning-path.test.ts`：Phase E Path Project Milestone Label Localization RED 首次因 `/path` 缺少 `项目里程碑：` 且仍显示 `milestone：` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Path Project Milestone Label Localization 相关回归 48 tests 通过，覆盖 Path、Weekly、Projects 和共享学习 UI。
- `rg -n "Phase E Path Project Milestone|项目里程碑|milestone：|Path Project Milestone|0\\.231\\.0|Verified|Resume State Hint|Drift Check|Confidence" ...`：Phase E Path Project Milestone Label Localization 覆盖扫描确认 `/path` 源码、测试、UI checklist、Path 模块文档、CHANGELOG 和 Aegis 记录均接入项目里程碑本地化要求；旧 `milestone：` 只保留在测试反向断言和历史记录文本中。
- `npm run build`：Phase E Path Project Milestone Label Localization 收尾构建门禁通过；Next 构建生成 28 个页面，路由表包含 `/path`。
- `npm test -- tests/unit/today-activity-labels.test.ts`：Phase E Today Breadth Confidence Label Localization RED 首次因 `/today` 缺少 `breadthConfidenceLabel` 且仍直接渲染 `{breadthDetail.confidence}` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Today Breadth Confidence Label Localization 相关回归 55 tests 通过，覆盖 Today、Radar/Glossary、Knowledge Map、首页标签和共享学习 UI。
- `rg -n 'Phase E Today Breadth Confidence|breadthConfidenceLabel|formatRadarConfidenceLabel\\(breadthDetail\\?\\.confidence\\)|可信度：高|\\{breadthDetail\\.confidence\\}|raw `high`|0\\.232\\.0' ...`：Phase E Today Breadth Confidence Label Localization 覆盖扫描确认 `/today` 源码、测试、UI checklist、Today 模块文档、CHANGELOG 和 Aegis 记录均接入可信度本地化要求。
- `git diff --check`、`npm run lint`、`npm test`：Phase E Today Breadth Confidence Label Localization 本地门禁通过；全量单测 351 tests 通过。
- `npm run build`：Phase E Today Breadth Confidence Label Localization 最终构建门禁通过；Next 构建生成 28 个页面，路由表包含 `/today`。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Projects Code Feedback Label Localization RED 首次因 `/projects` 缺少代码反馈中文 helper 接线，仍直接渲染 raw `overall`、`severity/type` 和英文 `feedback` 前缀失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/progress-analytics.test.ts`：Phase E Projects Code Feedback Label Localization 相关回归 54 tests 通过，覆盖 Projects UI、项目服务规则、共享标签 helper、Today code exercise 和 Progress code trend。
- `rg -n 'Phase E Projects Code Feedback|formatHomeCodeFeedbackOverallLabel\\(activeMilestoneFeedback\\.feedback\\.overall\\)|formatCodeFeedbackIssueSeverityLabel\\(issue\\.severity\\)|formatCodeFeedbackIssueTypeLabel\\(issue\\.type\\)|代码反馈 \\{activeMilestone\\.codeSubmissionId\\.slice\\(0, 8\\)\\}|\\{activeMilestoneFeedback\\.feedback\\.overall \\?\\? "reviewed"\\}|\\{issue\\.severity\\} / \\{issue\\.type\\}:|feedback \\{activeMilestone\\.codeSubmissionId\\.slice\\(0, 8\\)\\}|0\\.233\\.0|高优先级 / 逻辑问题' ...`：Phase E Projects Code Feedback Label Localization 覆盖扫描确认 `/projects` 源码、helper、测试、UI checklist、Project Practice 文档、CHANGELOG 和 Aegis 记录均接入项目代码反馈标签本地化要求；旧 raw 渲染模板仅保留在测试/证据反向断言文本中。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Projects Code Feedback Label Localization 本地收尾门禁通过；全量单测 352 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Recent Signal Label Localization RED 首次因 `/progress` 缺少 `formatHomeCodeFeedbackOverallLabel(f.overall)` 和 `missionStatusText(project.status)` 接线，最近代码反馈和最近项目实践仍可能显示 raw 状态；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/today-code-exercise.test.ts tests/unit/projects.test.ts`：Phase E Progress Recent Signal Label Localization 相关回归 55 tests 通过，覆盖 Progress analytics、共享标签 helper、Projects 状态文案、Today code exercise 和项目服务规则。
- `rg -n 'Phase E Progress Recent Signal|formatHomeCodeFeedbackOverallLabel\\(f\\.overall\\)|missionStatusText\\(project\\.status\\)|`\\s*/ \\$\\{f\\.overall\\}`|\\{PROJECT_TYPE_LABELS\\[normalizeProjectType\\(project\\.type\\)\\]\\} / \\{project\\.status\\}|0\\.234\\.0|部分正确|进行中' ...`：Phase E Progress Recent Signal Label Localization 覆盖扫描确认 `/progress` 源码、测试、UI checklist、Learning Analytics 文档、CHANGELOG 和 Aegis 记录均接入最近学习信号标签本地化要求；旧 raw 渲染模板没有出现在 `/progress` 生产源码里。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Recent Signal Label Localization 本地收尾门禁通过；全量单测 353 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `npm test -- tests/unit/progress-analytics.test.ts`：Phase E Progress Thought Review Mode Label Localization RED 首次因 `/progress` 缺少 `formatCoachModeLabel(r.mode)` 接线，且最近思路评审仍直接渲染 `{r.mode}`；GREEN 后 18 tests 通过。
- `rg -n 'Phase E Progress Thought Review|formatCoachModeLabel\\(r\\.mode\\)|formatCoachModeLabel|<Badge variant="outline">\\{r\\.mode\\}</Badge>|0\\.235\\.0|代码思路|概念疑问' ...`：Phase E Progress Thought Review Mode Label Localization 覆盖扫描确认 `/progress` 源码、helper、测试、UI checklist、Learning Analytics 文档、CHANGELOG 和 Aegis 记录均接入最近思路评审 mode 标签本地化要求；旧 raw badge 模板没有出现在 `/progress` 生产源码里。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Progress Thought Review Mode Label Localization 本地收尾门禁通过；全量单测 353 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `npm test -- tests/unit/library-page-labels.test.ts`：Phase E Library Thought Review Mode Label Localization RED 首次因 `/library` 缺少 `formatCoachModeLabel(r.mode)` 接线，且课程详情 Coach 思路评审仍直接渲染 `{r.mode}`；GREEN 后 3 tests 通过。
- `rg -n 'Phase E Library Thought Review|formatCoachModeLabel\\(r\\.mode\\)|formatCoachModeLabel|<Badge variant="outline">\\{r\\.mode\\}</Badge>|0\\.236\\.0|代码思路|概念疑问|code_reasoning|concept_question' ...`：Phase E Library Thought Review Mode Label Localization 覆盖扫描通过，确认 `/library` 源码、helper、测试、UI checklist、Library 模块文档、CHANGELOG 和 Aegis 记录均接入课程详情 Coach mode 标签本地化要求；旧 raw badge 模板没有出现在 `/library` 生产源码里。
- `npm run build`：Phase E Library Thought Review Mode Label Localization 最终构建门禁通过；Next 构建生成 28 个页面，路由表包含 `/library`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个历史 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `git diff --check`、`npm run lint`、`npm test`：Phase E Library Thought Review Mode Label Localization 续跑最终门禁通过；全量单测 353 tests 通过。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Thought Review Mode Label Localization RED 首次因 `/coach` 缺少 `formatCoachModeLabel()` 接线，且导师反馈顶部和最近评审仍直接渲染 `{selected.mode}` / `{r.mode}`；GREEN 后 10 tests 通过。
- `rg -n 'Phase E Coach Thought Review|formatCoachModeLabel\\(selected\\.mode\\)|formatCoachModeLabel\\(r\\.mode\\)|formatCoachModeLabel|<LearningStatusBadge tone="neutral">\\{selected\\.mode\\}</LearningStatusBadge>|<LearningStatusBadge tone="neutral">\\{r\\.mode\\}</LearningStatusBadge>|0\\.237\\.0|代码思路|概念疑问|today_lesson|code_reasoning|concept_question' ...`：Phase E Coach Thought Review Mode Label Localization 覆盖扫描通过，确认 `/coach` 源码、helper、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入 Coach mode 标签本地化要求；旧 raw badge 模板没有出现在 `/coach` 生产源码里。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/voice-note.test.ts tests/unit/review-session-summary.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Thought Review Mode Label Localization 相关回归 42 tests 通过，覆盖 Coach 页面、Voice handoff、Review summary、Progress 和 Library。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach Thought Review Mode Label Localization 本地收尾门禁通过；全量单测 354 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个历史 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/coach-workspace.test.ts`：Phase E Coach Suggested Flashcard Type Label Localization RED 首次因 Coach 建议卡片仍直接显示 raw `concept` 失败；GREEN 后 10 tests 通过。
- `rg -n 'Phase E Coach Suggested Flashcard|formatFlashcardTypeLabel\\(card\\.type\\)|formatFlashcardTypeLabel|<Badge variant="outline">\\{card\\.type\\}</Badge>|0\\.238\\.0|概念卡|代码反馈卡|错题卡|concept|code_bug|quiz_error' ...`：Phase E Coach Suggested Flashcard Type Label Localization 覆盖扫描通过，确认 `/coach` 源码、helper、测试、UI checklist、Coach 模块文档、CHANGELOG 和 Aegis 记录均接入建议卡片 type 标签本地化要求；旧 raw card type 模板没有出现在 `/coach` 建议卡片生产源码里。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts tests/unit/progress-analytics.test.ts tests/unit/library-page-labels.test.ts`：Phase E Coach Suggested Flashcard Type Label Localization 相关回归 55 tests 通过，覆盖 Coach 工作区、共享学习 UI、Progress 和 Library 标签回归。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Coach Suggested Flashcard Type Label Localization 本地收尾门禁通过；全量单测 354 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个历史 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Mode Fallback Label Localization RED 首次因 `/voice` 没有 `voiceModeLabel()`，且当前笔记和最近 Voice Notes 仍使用 `MODE_LABELS.get(selected.mode) ?? selected.mode` / `MODE_LABELS.get(n.mode) ?? n.mode` 直出 unknown mode；GREEN 后 10 tests 通过。
- `rg -n 'Phase E Voice Mode Fallback|voiceModeLabel\\(mode: string\\)|voiceModeLabel\\(selected\\.mode\\)|voiceModeLabel\\(n\\.mode\\)|MODE_LABELS\\.get\\(selected\\.mode\\) \\?\\? selected\\.mode|MODE_LABELS\\.get\\(n\\.mode\\) \\?\\? n\\.mode|语音反思|0\\.239\\.0|unknown mode|raw mode' ...`：Phase E Voice Mode Fallback Label Localization 覆盖扫描通过，确认 `/voice` 源码、测试、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入 unknown mode fallback 本地化要求；旧 raw mode fallback 模板没有出现在 `/voice` 生产源码里。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Mode Fallback Label Localization 相关回归 55 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Voice Mode Fallback Label Localization 本地收尾门禁通过；全量单测 355 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `npm test -- tests/unit/voice-note.test.ts`：Phase E Voice Transcription Result Status Label Localization RED 首次因 `VoiceCapture` 缺少 `formatVoiceTranscriptionResultStatusLabel(lastResult.status)` 且仍直接渲染 `{lastResult.status}` 失败；GREEN 后 11 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Voice Transcription Result Status Label Localization 相关回归 56 tests 通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI。
- `npm run lint`、`npm test`、`npm run build`：Phase E Voice Transcription Result Status Label Localization 本地门禁通过；全量单测 356 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `rg -n "Phase E Voice Transcription Result|formatVoiceTranscriptionResultStatusLabel\\(lastResult\\.status\\)|formatVoiceTranscriptionResultStatusLabel|转写成功|需手动整理|\\{lastResult\\.status\\}|manual_required|0\\.240\\.0" ...`：Phase E Voice Transcription Result Status Label Localization 覆盖扫描通过，确认源码、测试、文档和 Aegis 记录均接入当前切片；窄扫描确认生产 UI 没有 `{lastResult.status}`、`>manual_required<` 或 `>success<` 直出。
- `git diff --check`：Phase E Voice Transcription Result Status Label Localization 文档补丁后 diff check 通过。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个历史 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase E Badge Shelf Earned Label Localization RED 首次因 `BadgeShelf` 仍显示英文 `1 earned` 失败；GREEN 后 9 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts`：Phase E Badge Shelf Earned Label Localization 相关回归 53 tests 通过，覆盖学习动机卡、首页标签、Progress analytics 和共享学习 UI。
- `rg -n "Phase E Badge Shelf|BadgeShelf|已解锁 \\{earned\\} 个|\\{earned\\} earned|0\\.242\\.0" ...`：Phase E Badge Shelf Earned Label Localization 覆盖扫描确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入徽章解锁计数中文化要求；窄扫描确认生产组件没有 `{earned} earned` 直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Badge Shelf Earned Label Localization 收尾门禁通过；全量单测 357 tests 通过，Next 构建生成 28 个页面，路由表包含 `/` 和 `/progress`。
- `python3 .../aegis-workspace.py bundle --root ... --work 2026-06-03-roky-learning-desire`、`python3 .../aegis-workspace.py check --root ...`：仍失败于历史 Aegis Markdown-only 结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报当前和多个历史 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/learning-motivation.test.ts`：Phase E XP Level Label Localization RED 首次因 `XpLevelCard` 仍显示 `Lv.3 Algorithm Thinker` 和 `LLM Practitioner` 失败；GREEN 后 10 tests 通过。
- `npm test -- tests/unit/learning-motivation.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts tests/unit/learning-ui-components.test.ts`：Phase E XP Level Label Localization 相关回归 54 tests 通过，覆盖学习动机卡、首页标签、Progress analytics 和共享学习 UI。
- `rg -n "Lv\\.|Algorithm Thinker|LLM Practitioner|AI Explorer|Code Builder|AI Systems Learner" src/app src/components -g "*.tsx"`：Phase E XP Level Label Localization 窄扫描确认生产 UI 中英文等级名只保留在 `XpLevelCard` 内部映射键，不再直出。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E XP Level Label Localization 收尾门禁通过；全量单测 358 tests 通过，Next 构建生成 28 个页面，路由表包含 `/` 和 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/project-mission-workspace.test.ts`：Phase E Project Template Metadata Localization RED 首次因 `ProjectTemplateList` 仍显示 `2h` 和 `3 steps` 失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/project-mission-workspace.test.ts tests/unit/projects.test.ts tests/unit/today-completion-next-actions.test.ts`：Phase E Project Template Metadata Localization 相关回归 42 tests 通过，覆盖 Projects UI、项目服务规则和 Today 完成后项目推荐。
- `rg -n "Project Template Metadata|ProjectTemplateList|约 \\{template\\.estimatedHours\\} 小时|\\{template\\.milestoneCount\\} 个里程碑|\\{template\\.estimatedHours\\}h|\\{template\\.milestoneCount\\} steps|2h|3 steps|0\\.244\\.0" ...`：Phase E Project Template Metadata Localization 覆盖扫描确认源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入模板元信息中文化要求；旧英文缩写仅保留在测试反向断言和历史证据文本中。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Project Template Metadata Localization 收尾门禁通过；全量单测 358 tests 通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Plan Governance Label Localization RED 首次因 `/admin` 仍显示可见 `test`、`official`、`archived` 标签失败；GREEN 后 1 test 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Plan Governance Label Localization 相关回归 16 tests 通过，覆盖 Admin 计划治理、审计链路、审计异常、planner 可见性和 Prompt Studio。

## Blocked On

无本地实现阻塞。生产部署、容器重启、Nginx、DNS、数据库、密钥、真实生产 Preview token smoke 仍未执行，需单独确认边界后再做。

## Phase E Weekly Code Issue Type Label Localization

- `npm test -- tests/unit/weekly-review.test.ts`：RED 首次失败于 Weekly Markdown 仍输出 `高频问题：edge_case`，页面仍直用 `weekly.codePractice.topIssueType ?? "暂无"`，且缺少 `weeklyCodeIssueTypeLabel()`。
- `src/server/learning/weekly.ts`：新增 `weeklyCodeIssueTypeLabel()`，把 `logic`、`edge_case`、`complexity` 等 issue type 本地化，未知历史值兜底 `一般问题`，空值显示 `暂无`。
- `src/app/weekly/page.tsx`：`代码练习情况` 的 `高频问题` 改用 `weeklyCodeIssueTypeLabel(weekly.codePractice.topIssueType)`，不再直出 raw `topIssueType`。
- `src/server/learning/weekly.ts`：导出的 `Weekly Markdown` 同步使用同一 helper，避免复制到学习档案时带出 raw `edge_case` / `bounds`。
- `npm test -- tests/unit/weekly-review.test.ts`：GREEN 后 5 tests 通过，覆盖 helper 映射、页面接线和 Markdown 导出中文化。
- `npm test -- tests/unit/weekly-review.test.ts tests/unit/progress-analytics.test.ts tests/unit/today-code-exercise.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 70 tests 通过，覆盖 Weekly、Progress 趋势、Today/Projects 代码反馈标签和共享学习 UI。
- `rg -n "weeklyCodeIssueTypeLabel|高频问题：|edge_case|边界条件|Weekly Code Issue|Code Issue Type|topIssueType \\?\\? \"暂无\"|weekly\\.codePractice\\.topIssueType" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、模块文档和 Aegis 记录均接入。
- `rg -n "高频问题：\\{weekly\\.codePractice\\.topIssueType|topIssueType \\?\\? \"暂无\"|高频问题：edge_case|高频问题：bounds" src/app/weekly/page.tsx src/server/learning/weekly.ts`：无匹配，确认 `/weekly` 生产路径不再直出旧 raw 模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 387 tests 通过，Next 构建生成 28 个页面，路由表包含 `/weekly`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Coach Generated Review Link Source Isolation

- `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于 Voice-linked generated-card 面板即使传入 `reviewSource="voice-note"`，静态复习链接仍输出 `/review?source=thought-review`。
- `src/app/coach/ui/coach-workspace.tsx`：`CoachFlashcardPanel` 新增 `reviewSource?: "thought-review" | "voice-note"`，默认普通 Coach 保持 `/review?source=thought-review`，Voice-linked review 使用 `/review?source=voice-note`。
- `src/app/coach/page.tsx`：按 `voiceSourceId` 将 `reviewSource` 传给卡片沉淀面板，确保刷新或返回 Coach 页面后的静态复习入口不回退普通队列。
- `npm test -- tests/unit/coach-workspace.test.ts`：GREEN 后 15 tests 通过，覆盖普通 Coach 和 Voice-linked generated-card link。
- `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：2 tests 通过，确认 Voice → Coach → Review 真实浏览器路径未回退。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 64 tests 通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- `rg -n "Phase E Coach Generated Review Link|reviewSource=|reviewSource|source=voice-note|source=thought-review|静态复习链接|Generated Review Link" ...`：覆盖扫描确认源码、单测、E2E、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 386 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`、`/coach` 和 `/review`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Voice E2E Focused Review Source Isolation

- `npm test -- tests/unit/coach-submit.test.ts`：RED 首次失败于 `generated.reviewSource` 为 `undefined`；`generateFlashcardsForThoughtReview()` 未从 Voice-linked `ThoughtReview.reviewJson.source` 暴露 focused review 队列归属。
- `src/server/coach/submit.ts`：新增 `thoughtReviewQueueSource()`，通用 Coach 生成卡片路径识别 `reviewJson.source === "voice-note"` 时返回 `reviewSource="voice-note"`，并自动补 `voice-note` tag；普通 Coach review 保持 `thought-review`。
- `src/app/coach/actions.ts`：`generateCardsFromThoughtReviewAction()` 生成卡片后按服务层 `reviewSource` 重定向，Voice Note 来源进入 `/review?source=voice-note`，普通 Coach 来源进入 `/review?source=thought-review`。
- `npm test -- tests/unit/coach-submit.test.ts`：GREEN 后 5 tests 通过，覆盖 Voice-linked review 通过通用 Coach 生成路径也保留 `voice-note` 和 `thought-review` tags。
- `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：RED 首次第 2 项失败于点击 Coach `生成卡片` 后仍进入 `/review?source=thought-review`；GREEN 后 2 tests 通过，覆盖 Voice Note → Coach → 生成卡片 → `/review?source=voice-note`。
- `npx playwright test tests/e2e/today-interactions.spec.ts tests/e2e/review-interactions.spec.ts tests/e2e/coach-interactions.spec.ts tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：7 tests 通过，覆盖并发 Today、Review、Coach、Voice 交互时普通 Coach 和 Voice Coach focused review 队列隔离。
- `npm test -- tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-filter.test.ts tests/unit/review-session-summary.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 80 tests 通过，覆盖 Coach submit、Voice、Review 过滤/总结和共享学习 UI。
- `rg -n "Phase E Voice E2E Focused|thoughtReviewQueueSource|reviewSource|source=voice-note|语音笔记复习|voice-note queue|Focused Review Source" ...`：覆盖扫描确认源码、单测、E2E、CHANGELOG、模块文档、UI checklist 和 Aegis 记录均接入。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 385 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`、`/coach` 和 `/review`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Today E2E Focus Stage Navigation

- `npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"`：RED 首次 2 tests 失败，分别因直接等待折叠完整视图里的 `today-quiz` 和 `标记完成并生成卡片`；当前 `/today` 首屏停留在 `专注学习模式` 第 2 步，完整视图未默认展开。
- `tests/e2e/today-interactions.spec.ts`：新增 `openFocusStage()`，通过真实阶段切换按钮进入 `小测验`、`代码练习`、`反思与完成`；回到 `/today` 后再次切入 `反思与完成`，兼容本地 Demo 今日计划已完成/未完成状态。
- `npx playwright test tests/e2e/today-interactions.spec.ts --project="Desktop Chrome"`：GREEN 后 2 tests 通过，覆盖小测验提交、代码草稿保存、完成态 Voice handoff 和 Coach handoff。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/today-stage-status.test.ts tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 69 tests 通过，覆盖 Today 标签、代码练习、完成后行动、阶段状态、Voice handoff、Coach 工作区和共享学习 UI。
- `rg -n "openFocusStage|切换到小测验|切换到代码练习|切换到反思与完成|today-interactions|Phase E Today E2E|标记完成并生成卡片|learning-completion-card" tests/e2e/today-interactions.spec.ts src/app/today src/components/learning helloagents/CHANGELOG.md helloagents/modules/e2e-ui-smoke.md helloagents/modules/today-focus-mode.md docs/ui-review-checklist.md docs/aegis/work/2026-06-03-roky-learning-desire`：覆盖扫描确认 E2E、Today 源码和文档都围绕真实阶段切换与完成卡路径。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 384 tests 通过，Next 构建生成 28 个页面，路由表包含 `/today`、`/voice` 和 `/coach`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Review E2E Rating Label Alignment

- `npx playwright test tests/e2e/review-interactions.spec.ts --project="Desktop Chrome"`：RED 首次因等待旧 `getByRole('button', { name: /4 很熟/ })` 超时失败，确认 Review interaction E2E 仍断言旧评分按钮名称。
- `tests/e2e/review-interactions.spec.ts`：评分按钮 locator 改为真实可访问名称 `/很熟 \+14d/`，不改 Review 页面源码、评分 action、复习调度、ReviewLog 写入或 Preview 写保护。
- `npx playwright test tests/e2e/review-interactions.spec.ts --project="Desktop Chrome"`：GREEN 后 1 test 通过，覆盖本地 Demo 下创建专用到期卡、进入 `/review?source=thought-review`、显示答案、评分和队列推进。
- `npm test -- tests/unit/review-empty-state.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-rating.test.ts tests/unit/review-schedule.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 32 tests 通过，覆盖 Review 空态、session summary、评分幂等、1/3/7/14 天排期和共享学习 UI。
- `rg -n "4 很熟|1 忘了|很熟 \\\\+14d|忘了 \\\\+1d|很熟 \\+14d|忘了 \\+1d" tests/e2e src/app/review helloagents/CHANGELOG.md helloagents/modules/e2e-ui-smoke.md helloagents/modules/review.md docs/ui-review-checklist.md docs/aegis/work/2026-06-03-roky-learning-desire`：当前只命中中文可访问名称记录和历史证据，不再发现旧 E2E `4 很熟` locator。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 384 tests 通过，Next 构建生成 28 个页面，路由表包含 `/review`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Voice Mode Select Mobile Touch Target

- `npm test -- tests/unit/voice-note.test.ts`：RED 首次失败于 `语音笔记模式` select 仍使用旧 `h-9 rounded-md border bg-background px-3 text-sm outline-none` class；GREEN 后 13 tests 通过。
- `src/app/voice/ui/voice-workspace-form.tsx`：新增 `voiceModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none"`，并将 mode select 接入该 class。
- `tests/unit/voice-note.test.ts`：Voice handoff 表单渲染用例新增正向断言 `aria-label="语音笔记模式"` 的 select 含 `min-h-11`，并反向断言旧 `h-9` class 不再出现。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 67 tests 通过，覆盖 Voice 表单、录音状态、转写自动填入、转写服务、Coach handoff 和共享学习 UI。
- `rg -n "voiceModeSelectClassName|min-h-11 rounded-md border bg-background px-3 text-sm outline-none|h-9 rounded-md border bg-background px-3 text-sm outline-none|语音笔记模式|Phase E Voice Mode Select|0\\.289\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入本切片；旧 `h-9` select class 只保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 388 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Coach Mode Select Mobile Touch Target

- `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于 `评审模式` select 仍使用旧 `h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring` class；GREEN 后 15 tests 通过。
- `src/app/coach/ui/coach-workspace.tsx`：新增 `coachModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"`，并将 mode select 接入该 class。
- `tests/unit/coach-workspace.test.ts`：mode rail 渲染用例新增正向断言 `aria-label="评审模式"` 的 select 含 `min-h-11`，并反向断言旧 `h-10` class 不再出现。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 64 tests 通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- `rg -n "coachModeSelectClassName|min-h-11 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring|h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring|评审模式|Phase E Coach Mode Select|0\\.290\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入本切片；旧 `h-10` select class 只保留在测试反向断言中。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 388 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Mobile Bottom Nav More Sheet Link Touch Targets

- `npm test -- tests/unit/shared-ui-a11y.test.ts`：RED 首次失败于 More Sheet route link 缺少 `min-h-11`，确认移动底部导航更多入口没有显式 44px 触控高度。
- `src/components/mobile/mobile-bottom-nav.tsx`：More Sheet 内 `MORE_ROUTE_ORDER.map()` 生成的 `<Link>` class 加入 `min-h-11`，保留路由顺序、中文 title/description、active 状态和 hover 样式。
- `tests/unit/shared-ui-a11y.test.ts`：新增移动底部导航源代码级断言，覆盖主入口 `今日` / `复习` / `Coach` / `语音`、More Sheet 核心学习入口、`更多学习入口` title/nav label，以及旧小触控 class 反向断言。
- `npm test -- tests/unit/shared-ui-a11y.test.ts`：GREEN 后 3 tests 通过。
- `npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/pwa-manifest.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 30 tests 通过，覆盖共享 UI a11y、PWA shortcuts、首页标签和共享学习组件。
- `rg -n "Mobile Bottom Nav More Sheet|mobile bottom nav keeps More sheet|More sheet learning routes|MORE_ROUTE_ORDER|更多学习入口|min-h-11 rounded-md border px-3 py-3|移动端底部导航|Bottom Nav" ...`：覆盖扫描确认源码、测试、指导文件和 Aegis 记录接入本切片。
- `rg -n "className=\\{cn\\(\\s*\\\"rounded-md border px-3 py-3 text-sm transition-colors\\\"" src/components/mobile/mobile-bottom-nav.tsx`：无匹配，确认旧 More Sheet route link 小触控 class 不再存在。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 389 tests 通过，Next 构建生成 28 个页面，路由表包含 `/`、`/today`、`/review`、`/voice` 和 `/manifest.webmanifest`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Voice Reflection Template Button Touch Targets

- `npm test -- tests/unit/voice-note.test.ts`：RED 首次失败于 `60 秒反思模板` 区块内模板按钮缺少 `min-h-11`，确认 6 个 Voice 反思模板入口没有显式 44px 触控高度。
- `src/app/voice/ui/voice-workspace-form.tsx`：新增 `voiceReflectionTemplateButtonClassName`，6 个反思模板按钮 class 加入 `min-h-11`，保留模板文案、点击插入 transcript、focus 行为和 hover 样式。
- `tests/unit/voice-note.test.ts`：Voice 表单渲染用例新增模板区块断言，覆盖 `今日理解`、`代码思路`、`术语解释`、`论文阅读`、`行业观察`、`项目复盘` 均包含 `min-h-11`，并反向断言旧小触控按钮 class 不再出现。
- `npm test -- tests/unit/voice-note.test.ts`：GREEN 后 13 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 67 tests 通过，覆盖 Voice 表单、录音状态、转写、Coach handoff 和共享学习 UI。
- `rg -n "Voice Reflection Template Button|voiceReflectionTemplateButtonClassName|min-h-11 rounded-md border bg-background px-3 py-2 text-left|60 秒反思模板|0\\.292\\.0|每个反思模板入口|反思模板入口移动端|今日理解|项目复盘" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\"rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50\"|class=\"rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50\"" src/app/voice/ui/voice-workspace-form.tsx`：无匹配，确认旧模板按钮小触控 class 不再存在。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 389 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Knowledge Result Link Mobile Touch Targets

- `npm test -- tests/unit/knowledge-base.test.ts`：RED 首次失败于 `/glossary` 缺少 `glossaryResultLinkClassName`，确认术语结果列表仍使用旧 `rounded-md border px-3 py-2 text-sm transition-colors` 小触控模板。
- `src/app/glossary/page.tsx`：新增 `glossaryResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并将术语结果列表 Link 接入该 class。
- `src/app/radar/page.tsx`：新增 `radarResultLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并将实体结果列表 Link 接入该 class。
- `tests/unit/knowledge-base.test.ts`：新增源码级回归，覆盖 Glossary/Radar 结果列表入口均接入 `min-h-11`，并反向断言旧 inline 小触控 class 不再出现。
- `npm test -- tests/unit/knowledge-base.test.ts`：GREEN 后 15 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 56 tests 通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- `rg -n "Knowledge Result Link|glossaryResultLinkClassName|radarResultLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|术语列表每条|实体列表每条|0\\.293\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Knowledge Base/Radar 模块文档和 Aegis 记录均接入本切片。
- `rg -n "^\\s*\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\",|className=\\{\\[\\s*\\\"rounded-md border px-3 py-2 text-sm transition-colors\\\"" src/app/glossary/page.tsx src/app/radar/page.tsx`：无匹配，确认旧 inline 小触控结果链接 class 不再存在于 `/glossary` 或 `/radar` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 390 tests 通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Knowledge Relation Link Mobile Touch Targets

- `npm test -- tests/unit/knowledge-base.test.ts`：RED 首次失败于 `/glossary` 缺少 `glossaryRelatedTermLinkClassName`，确认相关术语链仍使用小 Badge 链接，Radar 关系卡片链接也缺少专用 `min-h-11` class 回归保护。
- `src/app/glossary/page.tsx`：新增 `glossaryRelatedTermLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"`，并将相关术语链从手机端横向 Badge 链接改为手机端单列大触控 Link。
- `src/app/radar/page.tsx`：新增 `radarRelationLinkClassName = "min-h-11 rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted/50"`，并将关系卡片链的每个可点击关系项接入该 class。
- `tests/unit/knowledge-base.test.ts`：新增源码级回归，覆盖 Glossary 相关术语链和 Radar 关系卡片链可点击关系项均接入 `min-h-11`，并反向断言旧小 Badge 链接和旧 inline 关系卡片 class 不再出现。
- `npm test -- tests/unit/knowledge-base.test.ts`：GREEN 后 16 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 57 tests 通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- `rg -n "Knowledge Relation Link|glossaryRelatedTermLinkClassName|radarRelationLinkClassName|关系卡片链每个|相关术语链每个|0\\.294\\.0|关系跳转入口|相关术语链可点击|关系卡片链可点击" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Knowledge Base/Radar 模块文档和 Aegis 记录均接入本切片。
- `rg -n "<Badge key=\\{t\\.slug\\} asChild variant=\\\"outline\\\">|className=\\\"rounded-md border bg-card p-2 text-sm transition-colors hover:bg-muted/50\\\"|<div className=\\\"mt-3 flex flex-wrap gap-2\\\">\\s*\\{relatedChain\\.length" src/app/glossary/page.tsx src/app/radar/page.tsx`：无匹配，确认旧小关系跳转模板不再存在于生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 391 tests 通过，Next 构建生成 28 个页面，路由表包含 `/glossary` 和 `/radar`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Library Lesson List Link Mobile Touch Targets

- `npm test -- tests/unit/library-page-labels.test.ts`：RED 首次失败于 `/library` 缺少 `libraryPlanLinkClassName`，确认课程列表 Link 仍使用旧 `rounded-md border px-3 py-2 text-sm transition-colors` 小触控模板；GREEN 后 6 tests 通过。
- `src/app/library/page.tsx`：新增 `libraryPlanLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，并将课程列表 Link 接入该 class。
- `tests/unit/library-page-labels.test.ts`：新增源码级回归，覆盖课程列表 Link 专用移动触控 class，并反向断言旧小触控模板不再出现。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 58 tests 通过，覆盖 Library 可见标签、课程下一步、治理筛选、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- `rg -n "Library Lesson List Link|libraryPlanLinkClassName|min-h-11 rounded-md border px-3 py-2 text-sm transition-colors|课程列表每条课程入口|0\\.295\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入本切片。
- `rg -n "\"rounded-md border px-3 py-2 text-sm transition-colors\",\\s*active \\?" src/app/library/page.tsx`：无匹配，确认旧课程列表小触控模板不再存在于 `/library` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 392 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Knowledge Map Related Lesson Link Mobile Touch Targets

- `npm test -- tests/unit/map-analytics.test.ts`：RED 首次失败于 `/map` 缺少 `mapRelatedLessonLinkClassName`，确认领域详情 `相关课程` Link 仍使用旧 `rounded-md border px-3 py-2 transition-colors hover:bg-muted/50` 小触控模板；GREEN 后 11 tests 通过。
- `src/app/map/page.tsx`：新增 `mapRelatedLessonLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"`，并将领域详情 `相关课程` Link 接入该 class。
- `tests/unit/map-analytics.test.ts`：新增源码级回归，覆盖 `相关课程` Link 专用移动触控 class，并反向断言旧小触控模板不再出现。
- `npm test -- tests/unit/map-analytics.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/knowledge-base.test.ts`：相关回归 64 tests 通过，覆盖 Knowledge Map、Library、Today、首页标签、共享学习 UI 和 Glossary/Radar 知识路径。
- `rg -n "Phase E Knowledge Map Related Lesson|mapRelatedLessonLinkClassName|相关课程|领域详情.*相关课程|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.296\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Knowledge Map 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/50\"" src/app/map/page.tsx`：无匹配，确认旧相关课程小触控模板不再存在于 `/map` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 393 tests 通过，Next 构建生成 28 个页面，路由表包含 `/map` 和 `/library`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Progress Weak Domain Link Mobile Touch Targets

- `npm test -- tests/unit/progress-analytics.test.ts`：RED 首次失败于 `/progress` 缺少 `progressWeakDomainLinkClassName`，确认 `薄弱领域` 列表 Link 仍使用旧 `rounded-md border px-3 py-2 transition-colors hover:bg-muted/50` 小触控模板；GREEN 后 22 tests 通过。
- `src/app/progress/analytics-panels.tsx`：新增 `progressWeakDomainLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"`，并将 `薄弱领域` 列表 Link 接入该 class。
- `tests/unit/progress-analytics.test.ts`：新增源码级回归，覆盖 `薄弱领域` Link 专用移动触控 class，并反向断言旧小触控模板不再出现。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 70 tests 通过，覆盖 Progress analytics、Knowledge Map、首页标签、Today、Library 和共享学习 UI。
- `rg -n "Phase E Progress Weak Domain|progressWeakDomainLinkClassName|薄弱领域|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50|0\\.297\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Learning Analytics 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/50\"" src/app/progress/analytics-panels.tsx`：无匹配，确认旧薄弱领域小触控模板不再存在于 `/progress` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 394 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress` 和 `/map`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Coach Remediation Queue Link Mobile Touch Targets

- `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于 `/coach` 补弱队列 `误区` / `代码反馈` 跳转卡片缺少 `min-h-11`，确认两个 Link 仍使用旧 `rounded-md border px-3 py-2 transition-colors hover:bg-muted/60` 小触控模板；GREEN 后 15 tests 通过。
- `src/app/coach/ui/coach-workspace.tsx`：新增 `coachRemediationQueueLinkClassName = "min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/60"`，并将补弱队列两个 Link 接入该 class。
- `tests/unit/coach-workspace.test.ts`：扩展补弱队列源码/渲染回归，覆盖 `/coach` 和 `/review?source=code-feedback` 两个跳转卡片均包含 `min-h-11`，并反向断言旧 inline 小触控模板不再出现。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 64 tests 通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- `rg -n "Phase E Coach Remediation Queue|coachRemediationQueueLinkClassName|补弱队列|min-h-11 rounded-md border px-3 py-2 transition-colors hover:bg-muted/60|0\\.298\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\\{cn\\(\\\"rounded-md border px-3 py-2 transition-colors hover:bg-muted/60\\\"" src/app/coach/ui/coach-workspace.tsx`：无匹配，确认旧补弱队列小触控 inline 模板不再存在于 `/coach` 工作区生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 394 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`、`/review` 和 `/voice`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Today Quiz Option Mobile Touch Targets

- `npm test -- tests/unit/today-activity-labels.test.ts`：RED 首次失败于小测验答案选项缺少 `todayQuizOptionLabelClassName`，确认单选、多选、判断题 label 仍使用旧 `flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40` 小触控模板；GREEN 后 6 tests 通过。
- `src/app/today/ui/today-quiz.tsx`：新增 `todayQuizOptionLabelClassName = "flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40"`，并将单选、多选、判断题每个答案选项 label 接入该 class。
- `tests/unit/today-activity-labels.test.ts`：新增源码/渲染回归，覆盖单选、多选、判断题共 6 个示例选项均包含 `min-h-11`，并反向断言旧小触控 inline 模板不再出现。
- `npm test -- tests/unit/today-activity-labels.test.ts tests/unit/today-stage-status.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`：相关回归 45 tests 通过，覆盖 Today 标签、阶段状态、完成后下一步、共享学习 UI 和每日内容生成提示。
- `rg -n "Phase E Today Quiz Option|todayQuizOptionLabelClassName|小测验答案选项|0\\.299\\.0|flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Today 模块文档和 Aegis 记录均接入本切片。
- `rg -n "className=\\\"flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted/40\\\"" src/app/today/ui/today-quiz.tsx`：无匹配，确认旧小触控 inline 模板不再存在于 `/today` 小测验生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 395 tests 通过，Next 构建生成 28 个页面，路由表包含 `/today`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Phase E Coach Include Lesson Checkbox Mobile Touch Target

- `npm test -- tests/unit/coach-workspace.test.ts`：RED 首次失败于 `/coach` 表单 `关联最近课程` checkbox label 缺少 `coachIncludeLessonLabelClassName`，确认该可点击 label 仍使用旧 `flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm` 小触控模板；GREEN 后 16 tests 通过。
- `src/app/coach/page.tsx`：新增 `coachIncludeLessonLabelClassName = "flex min-h-11 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"`，并将 `关联最近课程` checkbox label 接入该 class。
- `tests/unit/coach-workspace.test.ts`：新增源码级回归，覆盖 `关联最近课程` checkbox label 包含 `min-h-11`，并反向断言旧小触控 inline 模板不再出现。
- `npm test -- tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/voice-note.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 65 tests 通过，覆盖 Coach 面板、Coach submit、Voice handoff、Review source filter 和共享学习 UI。
- `rg -n "Phase E Coach Include Lesson Checkbox|coachIncludeLessonLabelClassName|关联最近课程|0\\.300\\.0|flex min-h-11 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Coach 模块文档和 Aegis 记录均接入本切片。
- `rg -n "<label className=\\\"flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm\\\"" src/app/coach/page.tsx`：无匹配，确认旧小触控 inline 模板不再存在于 `/coach` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 396 tests 通过，Next 构建生成 28 个页面，路由表包含 `/coach`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Coach Include Lesson Checkbox Mobile Touch Target 已完成 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/coach` 表单 `关联最近课程` checkbox label class、源码级 UI 测试和文档，不触碰 `includeTodayLesson` 提交字段、课程关联校验、Coach 上下文构建、Voice handoff、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先扫描下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片保证 `/coach` 表单 `关联最近课程` checkbox label 在手机端有明确 44px 触控高度。
- Compatibility：不新增迁移，不触碰生产，不改变 `includeTodayLesson` 提交字段、课程关联校验、Coach 上下文构建、Voice handoff、Preview Mode 只读边界或数据库；只改变 `/coach` 表单 checkbox label class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或 fallback；Coach 页面表单仍归 `src/app/coach/page.tsx`。
- Retirement：旧的 `flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm` 小触控 inline 模板已被 `coachIncludeLessonLabelClassName` 替代；旧模板只保留在测试反向断言中。
- Decision：continue; Phase E Coach Include Lesson Checkbox Mobile Touch Target 已完成产品级 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Library Filter Placeholder Label Hints

- `npm test -- tests/unit/library-page-labels.test.ts`：RED 首次失败于 `/library` 筛选表单 `source` 和 `status` placeholder 仍只显示旧裸 raw 值 `deepseek / fallback / admin` 与 `planned / completed`；GREEN 后 7 tests 通过。
- `src/app/library/page.tsx`：将 `source` placeholder 改为 `AI 生成 deepseek / 模板兜底 template / 后台重建 admin`，将 `status` placeholder 改为 `待完成 planned / 已完成 completed`。
- `tests/unit/library-page-labels.test.ts`：新增源码级回归，覆盖治理筛选 placeholder 同时显示中文业务含义和可输入 raw 值，并反向断言旧裸 raw placeholder 不再出现。
- `npm test -- tests/unit/library-page-labels.test.ts tests/unit/library-plan-filter.test.ts tests/unit/library-next-actions.test.ts tests/unit/library-lesson-detail.test.ts tests/unit/notes-template.test.ts tests/unit/notes-create.test.ts tests/unit/today-completion-next-actions.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 59 tests 通过，覆盖 Library 可见标签、治理筛选、课程下一步、详情权限、Notes、Today 完成后沉淀链路、首页标签和共享学习 UI。
- `rg -n "Phase E Library Filter Placeholder|AI 生成 deepseek|模板兜底 template|待完成 planned|0\\.301\\.0|筛选表单 placeholder|library filter placeholders" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Library 模块文档和 Aegis 记录均接入本切片。
- `rg -n "placeholder=\\\"deepseek / fallback / admin\\\"|placeholder=\\\"planned / completed\\\"" src/app/library/page.tsx`：无匹配，确认旧裸 raw placeholder 不再存在于 `/library` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 397 tests 通过，Next 构建生成 28 个页面，路由表包含 `/library`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Library Filter Placeholder Label Hints 已完成 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/library` 筛选表单 placeholder、源码级 UI 测试和文档，不触碰 `source` / `status` 查询参数、`normalizeLibraryPlanFilters()`、`buildLibraryPlanWhere()`、课程可见性、Notes 权限、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先扫描下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片让 `/library` 治理筛选 placeholder 不再只暴露裸 raw label，同时保留维护者可输入的 raw 值。
- Compatibility：不新增迁移，不触碰生产，不改变 `source` / `status` 查询参数、筛选解析、DailyPlan 查询、课程可见性、Notes 权限、Preview Mode 只读边界或数据库；只改变 `/library` 筛选表单 placeholder、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或 fallback；Library 页面筛选 UI 仍归 `src/app/library/page.tsx`，筛选契约仍归 `src/server/library/plan-filter.ts`。
- Retirement：旧的裸 `deepseek / fallback / admin` 和 `planned / completed` placeholder 已被中文业务含义 + raw 值说明替代；旧模板只保留在测试反向断言中。
- Decision：continue; Phase E Library Filter Placeholder Label Hints 已完成产品级 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Settings Runtime Env Fallback Localization

- `npm test -- tests/unit/settings-profile.test.ts`：RED 首次失败于 `/settings` 缺少 `formatSettingsRuntimeEnvLabel()`，且系统卡仍使用旧 `process.env.NODE_ENV ?? "unknown"` fallback；GREEN 后 6 tests 通过。
- `src/app/settings/page.tsx`：新增 `formatSettingsRuntimeEnvLabel(value)`，真实 `NODE_ENV` 值保持原样展示，缺失或空白时显示 `未标记环境`；系统卡 `NODE_ENV` 行改为调用该 helper。
- `tests/unit/settings-profile.test.ts`：新增源码级回归，覆盖 `formatSettingsRuntimeEnvLabel()`、`未标记环境` 和旧 `process.env.NODE_ENV ?? "unknown"` 反向断言。
- `npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts tests/unit/shared-ui-a11y.test.ts`：相关回归 43 tests 通过，覆盖 Settings 表单/系统卡、Auth/Preview 写保护、共享学习 UI 和共享 a11y 文案。
- `rg -n "Phase E Settings Runtime Env|formatSettingsRuntimeEnvLabel|未标记环境|process\\.env\\.NODE_ENV \\?\\? \\\"unknown\\\"|0\\.302\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、CHANGELOG、Settings 模块文档和 Aegis 记录均接入本切片。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 398 tests 通过，Next 构建生成 28 个页面，路由表包含 `/settings`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Settings Runtime Env Fallback Localization 已完成 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/settings` 系统卡 `NODE_ENV` 缺省展示、源码级 UI 测试和文档，不触碰环境变量读取、`getBuildInfo()`、Provider/secret 边界、`updateSettingsAction()`、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先扫描下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片让 `/settings` 系统卡缺省运行环境不再显示裸 `unknown`，同时保留真实 `NODE_ENV` 值。
- Compatibility：不新增迁移，不触碰生产，不改变环境变量读取、build info 生成、Provider 状态、Settings 保存 action、Preview Mode 只读边界或数据库；只改变 `/settings` 系统卡展示 fallback、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Settings 页面系统卡仍归 `src/app/settings/page.tsx`。
- Retirement：旧的 `process.env.NODE_ENV ?? "unknown"` fallback 已被 `formatSettingsRuntimeEnvLabel(process.env.NODE_ENV)` 替代；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Settings Runtime Env Fallback Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Voice Note Visible Copy Localization

- `npm test -- tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts`：RED 首次失败于旧 `Voice Note` / `Voice Notes` / `首次 Voice Note` 学习者可见文案；GREEN 后 73 tests 通过。
- `src/app/voice/page.tsx`：当前笔记、空态、价值说明、最近列表和学习链路文案统一显示 `语音笔记`，不再显示 `当前 Voice Note`、`Voice Note 的价值`、`还没有 Voice Note`、`最近 Voice Notes` 或 `暂无历史 Voice Note`。
- `src/app/voice/ui/voice-capture-status.ts`、`src/app/voice/ui/voice-workspace-form.tsx`、`src/app/voice/ui/voice-learning-pipeline.tsx`、`src/server/voice/pipeline-next-action.ts`：Voice 捕获状态、表单步骤、语音学习流水线和当前最优动作统一显示 `语音笔记` / `转写文本`，不再显示 `保存 Voice Note`、`这次 Voice Note 生成了` 或裸 `transcript`。
- `src/app/coach/ui/coach-workspace.tsx`：Voice 来源面板显示 `来自语音笔记` 和 `查看语音笔记`；`source=voice-note` focused review 队列契约保持不变。
- `src/app/weekly/page.tsx`、`src/server/learning/weekly.ts`：7 天总览、Weekly Markdown 和 `weeklyMistakeSourceLabel("voice")` 显示 `语音笔记`。
- `src/server/learning/badges.ts`：语音徽章标题显示 `首次语音笔记`。
- `tests/e2e/voice-interactions.spec.ts`：真实浏览器 locator 同步为 `当前语音笔记`、`来自语音笔记`、`查看语音笔记`，仍验证 `/review?source=voice-note`。
- `npm test -- tests/unit/notes-page-ui.test.ts`：RED 首次失败于 Notes 列表 badge 仍显示 `来自 Voice 的当前笔记`；`src/app/notes/ui/notes-list-panel.tsx` 改为 `来自语音笔记的当前笔记` 后，合并复跑 `npm test -- tests/unit/notes-page-ui.test.ts tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts` 74 tests 通过。
- `npm test -- tests/unit/voice-note.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/learning-ui-components.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/review-filter.test.ts tests/unit/review-session-summary.test.ts tests/unit/home-page-labels.test.ts tests/unit/progress-analytics.test.ts`：相关回归 121 tests 通过，覆盖 Voice、Weekly、Coach、Notes、学习动机、Review queue/source 和 Progress/Home 回归。
- `rg -n "Voice Note|Voice Notes|当前 Voice|最近 Voice|保存 Voice|查看 Voice|来自 Voice|首次 Voice|Voice Note：" src/app src/server/learning src/server/voice/pipeline-next-action.ts tests/e2e/voice-interactions.spec.ts tests/unit/notes-page-ui.test.ts tests/unit/weekly-review.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-motivation.test.ts tests/unit/voice-note.test.ts`：覆盖扫描确认生产 UI 源码和 E2E locator 不再保留旧可见文案；旧词只保留在测试反向断言和服务端内部 Coach prompt 回归中。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 399 tests 通过，Next 构建生成 28 个页面，路由表包含 `/voice`、`/coach`、`/weekly` 和 `/notes`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Voice Note Visible Copy Localization 已完成 RED/GREEN、Notes RED/GREEN、相关回归、覆盖扫描和本地收尾门禁；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改学习者可见语音笔记相关文案、测试和文档，不触碰 `VoiceNote` 数据模型、`voice-note` tags/source、Coach handoff URL、Review filter、Voice 保存/转写/制卡逻辑、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先扫描下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 Voice/Weekly/Coach/Notes/Badge 中学习者可见英文产品词，提升中文学习界面一致性。
- Compatibility：不新增迁移，不触碰生产，不改变 `VoiceNote` 数据模型、`voice-note` source/tag、Coach handoff、Review filter、Voice 保存/转写/制卡服务、Preview Mode 只读边界或数据库；只改变读侧文案、测试、E2E locator 和文档记录。
- New fallback/owner：未新增 owner、adapter 或 fallback；Voice UI、Coach 来源面板、Weekly 数据 builder、Notes 列表和学习徽章仍由原模块负责。
- Retirement：旧的 `当前 Voice Note`、`最近 Voice Notes`、`保存 Voice Note`、`来自 Voice Note`、`查看 Voice Note`、`Voice Note：`、`首次 Voice Note` 和 `来自 Voice 的当前笔记` 可见文案已退役；旧词只保留在测试反向断言、历史文档和服务端内部 Coach prompt 回归中。
- Decision：continue; Phase E Voice Note Visible Copy Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Progress Weak Topic Copy Localization

- `npm test -- tests/unit/progress-analytics.test.ts`：RED 首次失败于 `/progress` 缺少 `formatProgressWeakTopicDomainLabel()`，且薄弱主题卡片仍显示旧 `{topic?.domain.name ?? "-"} / exposure {s.exposureCount}`；GREEN 后 23 tests 通过。
- `src/app/progress/page.tsx`：新增 `formatProgressWeakTopicDomainLabel(domainName)`，领域缺失时显示 `未标记领域`；薄弱主题卡片改为 `领域：... / 接触次数：N`。
- `tests/unit/progress-analytics.test.ts`：新增源码级回归，覆盖 helper、`未标记领域`、`接触次数`，并反向断言旧 `exposure` 和 `topic?.domain.name ?? "-"` 模板不再出现。
- `npm test -- tests/unit/progress-analytics.test.ts tests/unit/home-page-labels.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts tests/unit/map-analytics.test.ts tests/unit/weekly-review.test.ts`：相关回归 83 tests 通过，覆盖 Progress、首页标签、Projects、共享学习 UI、Knowledge Map 和 Weekly。
- `rg -n "formatProgressWeakTopicDomainLabel|接触次数：\\{s\\.exposureCount\\}|exposure \\{s\\.exposureCount\\}|topic\\?\\.domain\\.name \\?\\? \\\"-\\\"|Phase E Progress Weak Topic|薄弱主题" ...`：覆盖扫描确认 `/progress` 生产源码接入新 helper 和 `接触次数` 文案，旧 `exposure` / `-` 模板不再存在于生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 400 tests 通过，Next 构建生成 28 个页面，路由表包含 `/progress`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Progress Weak Topic Copy Localization 已完成 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/progress` 薄弱主题读侧文案、源码级 UI 测试和文档，不触碰 `UserTopicState.exposureCount`、`weakTopicStates` 排序、Topic 查询、Progress 统计、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/progress` 薄弱主题卡片中学习者可见英文/raw 文案。
- Compatibility：不新增迁移，不触碰生产，不改变 `UserTopicState.exposureCount`、`weakTopicStates` 排序、Topic 查询、Progress 统计、Preview Mode 只读边界或数据库；只改变读侧文案、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Progress 页面薄弱主题展示仍归 `src/app/progress/page.tsx`。
- Retirement：旧的 `topic?.domain.name ?? "-"` 和 `exposure {s.exposureCount}` 可见模板已退役；旧词只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Progress Weak Topic Copy Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描和本地收尾门禁。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Review Total Record Copy Localization

- `npm test -- tests/unit/learning-ui-components.test.ts`：RED 首次失败于 `/review` 复习统计卡仍显示旧 `累计 ReviewLog`；GREEN 后 25 tests 通过。
- `src/app/review/page.tsx`：复习统计卡累计记录标签改为 `累计复习记录`，避免学习者界面直出数据库模型名。
- `tests/unit/learning-ui-components.test.ts`：新增源码级回归，覆盖 `累计复习记录`，并反向断言 `累计 ReviewLog` 不再出现。
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/review-session-summary.test.ts tests/unit/review-schedule.test.ts tests/unit/review-filter.test.ts`：相关回归 36 tests 通过，覆盖 Review UI、完成 summary、复习调度和队列过滤。
- `rg -n "累计复习记录|累计 ReviewLog|Phase E Review Total Record|0\\.305\\.0" ...`：覆盖扫描确认源码、测试、UI checklist、Review 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Review Total Record Copy Localization 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/review` 读侧文案、源码级 UI 测试和文档，不触碰 `ReviewLog` 写入、`rateFlashcard()`、复习队列过滤、调度、统计口径、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/review` 复习统计卡中学习者可见数据库模型名。
- Compatibility：不新增迁移，不触碰生产，不改变 `ReviewLog` 写入、复习队列过滤、评分调度、统计口径、Preview Mode 只读边界或数据库；只改变读侧文案、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Review 页面统计展示仍归 `src/app/review/page.tsx`。
- Retirement：旧的 `累计 ReviewLog` 可见模板已退役；旧词只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Review Total Record Copy Localization 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Recent Plan Filter CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Recent Plan Filter CTA Mobile Touch Targets。`src/app/admin/page.tsx` 将最近每日计划顶部 `正式 / 测试 / 已归档 / 全部` 筛选按钮从旧无 class 的 `size="xs"` 模板收口到 `adminPlanFilterCtaClassName = "min-h-11 px-3"`，避免手机端筛选最近计划时触控目标过小。本切片只改 `/admin` 最近每日计划筛选按钮展示层、源码级 UI 测试和文档记录，不触碰 `normalizeAdminPlanFilter()`、`buildAdminPlanFilterWhere()`、`planFilterHref()`、计划治理 action、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Recent Plan Filter CTA Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminPlanFilterCtaClassName` 失败；GREEN 后 14 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Recent Plan Filter CTA Mobile Touch Targets 相关回归 42 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "adminPlanFilterCtaClassName|min-h-11 px-3|recent plan filter|最近每日计划（10）|Admin Recent Plan Filter" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts`：覆盖扫描确认源码和测试均接入本切片。
- `rg -n "<Button key=\\{filter\\} asChild size=\\\"xs\\\" variant=\\{planFilter === filter \\? \\\"default\\\" : \\\"secondary\\\"\\}>" src/app/admin/page.tsx`：无匹配，确认旧无 class 的最近计划筛选按钮模板不再存在于 `/admin` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Recent Plan Filter CTA Mobile Touch Targets 本地收尾门禁通过；全量单测 410 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个当前和既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Recent Plan Filter CTA Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/admin` 最近每日计划筛选按钮展示层、源码级 UI 测试和文档，不触碰 `normalizeAdminPlanFilter()`、`buildAdminPlanFilterWhere()`、`planFilterHref()`、计划治理 action、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 最近每日计划筛选入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `normalizeAdminPlanFilter()`、`buildAdminPlanFilterWhere()`、`planFilterHref()`、计划治理 action、Preview Mode 只读边界或数据库；只改变读侧 plan filter CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 最近计划筛选展示仍归 `src/app/admin/page.tsx`，筛选解析和计划治理数据 owner 不变。
- Retirement：旧的无 class 最近计划 `size="xs"` 筛选按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Recent Plan Filter CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Audit Exception Link Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Audit Exception Link Mobile Touch Targets。`src/app/admin/page.tsx` 将计划审计异常列表中的 `审计链路` 按钮从旧 `className="shrink-0"` 小触控模板收口到 `adminAuditExceptionLinkClassName = "min-h-11 px-3 shrink-0"`，避免手机端查看异常计划审计链路时点击区域过小。本切片只改 `/admin` 计划审计异常列表展示层、源码级 UI 测试和文档记录，不触碰 `buildAdminPlanAuditExceptions()`、`planAuditHref()`、计划治理 action、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Audit Exception Link Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminAuditExceptionLinkClassName` 失败；GREEN 后 15 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Audit Exception Link Mobile Touch Targets 相关回归 43 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "adminAuditExceptionLinkClassName|min-h-11 px-3 shrink-0|audit exception|审计异常|Admin Audit Exception Link" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts`：覆盖扫描确认源码和测试均接入本切片。
- `rg -n "<Button asChild size=\\\"xs\\\" variant=\\\"secondary\\\" className=\\\"shrink-0\\\">" src/app/admin/page.tsx`：无匹配，确认旧审计异常小触控按钮模板不再存在于 `/admin` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Audit Exception Link Mobile Touch Targets 本地收尾门禁通过；全量单测 411 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个当前和既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Audit Exception Link Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/admin` 计划审计异常列表 `审计链路` 按钮展示层、源码级 UI 测试和文档，不触碰 `buildAdminPlanAuditExceptions()`、`planAuditHref()`、计划治理 action、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 计划审计异常链路在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `buildAdminPlanAuditExceptions()`、`planAuditHref()`、计划治理 action、Preview Mode 只读边界或数据库；只改变读侧 audit exception link class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 计划审计异常展示仍归 `src/app/admin/page.tsx`，异常构建和计划治理数据 owner 不变。
- Retirement：旧的 `className="shrink-0"` 审计异常 `size="xs"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Audit Exception Link Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Plan Audit Close CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Plan Audit Close CTA Mobile Touch Targets。`src/app/admin/page.tsx` 将单条计划审计链路卡片中的 `关闭审计` 按钮从旧无 class 的 `size="xs"` 模板收口到 `adminPlanAuditCloseCtaClassName = "min-h-11 px-3"`，避免手机端关闭审计视图时点击区域过小。本切片只改 `/admin` 单条计划审计链路 header 展示层、源码级 UI 测试和文档记录，不触碰 `planFilterHref()`、`buildAdminPlanAuditChain()`、计划治理 action、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Plan Audit Close CTA Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminPlanAuditCloseCtaClassName` 失败；GREEN 后 16 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Plan Audit Close CTA Mobile Touch Targets 相关回归 44 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "adminPlanAuditCloseCtaClassName|min-h-11 px-3|关闭审计|Admin Plan Audit Close" src/app/admin/page.tsx tests/unit/admin-page-labels.test.ts`：覆盖扫描确认源码和测试均接入本切片。
- `rg -n -U "<Button asChild size=\\\"xs\\\" variant=\\\"secondary\\\">\\n\\s*<a href=\\{planFilterHref\\(planFilter\\)\\}>关闭审计</a>" src/app/admin/page.tsx`：无匹配，确认旧无 class 的关闭审计小触控按钮模板不再存在于 `/admin` 生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Plan Audit Close CTA Mobile Touch Targets 本地收尾门禁通过；全量单测 412 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个当前和既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Plan Audit Close CTA Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 `/admin` 单条计划审计链路 `关闭审计` 按钮展示层、源码级 UI 测试和文档，不触碰 `planFilterHref()`、`buildAdminPlanAuditChain()`、计划治理 action、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 单条计划审计链路关闭入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `planFilterHref()`、`buildAdminPlanAuditChain()`、计划治理 action、Preview Mode 只读边界或数据库；只改变读侧 plan audit close CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 单条计划审计链路展示仍归 `src/app/admin/page.tsx`，审计链路构建和计划治理数据 owner 不变。
- Retirement：旧的无 class `关闭审计` `size="xs"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Plan Audit Close CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Prompt Studio Regenerate CTA Mobile Touch Targets。`src/app/admin/ui/prompt-studio-card.tsx` 将 Prompt Studio 指定日期重建入口 `重新生成某日期计划（测试）` 从旧无 class 的 `size="sm"` 模板收口到 `promptStudioCtaClassName = "min-h-11 w-full sm:w-auto"`，避免手机端维护生成质量时点击区域过小。本切片只改 Prompt Studio 表单按钮展示层、源码级 UI 测试和文档记录，不触碰 `regeneratePlanForLocalDateAction`、手动修复状态聚合、Prompt/Schema 统计、模型调用、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets RED 首次因 `PromptStudioCard` 缺少 `promptStudioCtaClassName` 失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets 相关回归 45 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。
- `rg -n "promptStudioCtaClassName|min-h-11 w-full sm:w-auto|重新生成某日期计划|Prompt Studio Regenerate" src/app/admin/ui/prompt-studio-card.tsx tests/unit/admin-prompt-studio.test.ts`：覆盖扫描确认源码和测试均接入本切片。
- `rg -n -U "<Button type=\\\"submit\\\" size=\\\"sm\\\" variant=\\\"secondary\\\" disabled=\\{!authed\\}>\\n\\s*重新生成某日期计划（测试）" src/app/admin/ui/prompt-studio-card.tsx`：无匹配，确认旧无 class 的 Prompt Studio 重建小触控按钮模板不再存在于生产源码。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets 本地收尾门禁通过；全量单测 413 tests 通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于多个当前和既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Next Step

继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build；Aegis helper 仍停在既有 Markdown-only 结构债。本切片只改 Prompt Studio 指定日期重建按钮展示层、源码级 UI 测试和文档，不触碰 `regeneratePlanForLocalDateAction`、手动修复状态聚合、模型调用、Preview 写保护、数据库、生产/SSH/部署/密钥。继续时优先寻找下一处可本地 RED/GREEN 的小触控、raw label 或学习入口弱证据点。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` Prompt Studio 指定日期重建入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `regeneratePlanForLocalDateAction`、手动修复状态聚合、Prompt/Schema 统计、模型调用、Preview Mode 只读边界或数据库；只改变读侧 Prompt Studio CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Prompt Studio 表单展示仍归 `src/app/admin/ui/prompt-studio-card.tsx`，重建 action 仍由页面层注入。
- Retirement：旧的无 class `重新生成某日期计划（测试）` `size="sm"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Prompt Studio Regenerate CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Prompt Studio Regenerate Date Input Mobile Touch Targets。`src/app/admin/ui/prompt-studio-card.tsx` 将 Prompt Studio 指定日期重建表单里的 `YYYY-MM-DD` 输入框收口到 `promptStudioInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"`，避免手机端维护生成质量时日期输入触控目标过小。本切片只改 Prompt Studio 表单输入展示层、源码级 UI 测试和文档记录，不触碰 `regeneratePlanForLocalDateAction`、手动修复状态聚合、Prompt/Schema 统计、模型调用、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-prompt-studio.test.ts`：Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets RED 首次因 `PromptStudioCard` 缺少 `promptStudioInputClassName` 失败；GREEN 后 5 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 47 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` Prompt Studio 指定日期重建输入在移动端的操作摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `regeneratePlanForLocalDateAction`、手动修复状态聚合、Prompt/Schema 统计、模型调用、Preview Mode 只读边界或数据库；只改变读侧 Prompt Studio input class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Prompt Studio 表单展示仍归 `src/app/admin/ui/prompt-studio-card.tsx`，重建 action 仍由页面层注入。
- Retirement：旧的裸 `YYYY-MM-DD` 输入 class 已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Phase E Admin Auth Controls Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Auth Controls Mobile Touch Targets。`src/app/admin/page.tsx` 将未登录 shell 和环境卡中的 `ADMIN_SECRET` 输入、登录按钮、退出按钮收口到 `adminAuthInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"` 与 `adminAuthCtaClassName = "min-h-11 w-full sm:w-auto"`；同页今日闭环反思输入和指定日期输入收口到 `adminFormInputClassName`，避免 `/admin` 继续保留裸小触控输入模板。本切片只改 `/admin` 展示层 class、源码级 UI 测试和文档记录，不触碰 `adminLoginAction`、`adminLogoutAction`、cookie、route protection、admin secret policy、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Auth Controls Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminAuthInputClassName` / `adminAuthCtaClassName` 失败；GREEN 后 17 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 47 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Next Step

继续执行两个切片的覆盖扫描、`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 和 Aegis helper bundle/check。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets 与 Phase E Admin Auth Controls Mobile Touch Targets 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 与 Prompt Studio 展示层 class、源码级 UI 测试和文档，不触碰认证 action、cookie、route protection、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 认证入口和维护表单输入在移动端的点击/输入摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `adminLoginAction`、`adminLogoutAction`、cookie、route protection、admin secret policy、Preview Mode 只读边界或数据库；只改变读侧 auth/form class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 认证 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的裸 auth 输入、裸登录/退出按钮和裸 `/admin` 表单输入模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Auth Controls Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.318.0 / 0.319.0

Phase E Admin Prompt Studio Regenerate Date Input Mobile Touch Targets 与 Phase E Admin Auth Controls Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `promptStudioInputClassName`、`adminAuthInputClassName`、`adminAuthCtaClassName`、`adminFormInputClassName`、`0.318.0`、`0.319.0` 和对应 Phase E 切片名贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 旧模板窄扫确认 `/admin` 与 Prompt Studio 当前生产源码中不再保留裸 `className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"` 输入模板，旧裸登录/退出按钮模板也无匹配。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：415 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.318.0` Prompt Studio 日期输入触控目标和 `0.319.0` Admin 认证控件触控目标已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前两个切片减少 `/admin` Prompt Studio、认证入口和维护表单输入在移动端的点击/输入摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `regeneratePlanForLocalDateAction`、`adminLoginAction`、`adminLogoutAction`、cookie、route protection、admin secret policy、Prompt/Schema 统计、模型调用、Preview Mode 只读边界或数据库；只改变读侧 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Prompt Studio 表单展示仍归 `src/app/admin/ui/prompt-studio-card.tsx`，Admin 页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的裸 Prompt Studio 日期输入、裸 auth 输入、裸登录/退出按钮和裸 `/admin` 表单输入模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; 两个切片均已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Today Loop CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Today Loop CTA Mobile Touch Targets。`src/app/admin/page.tsx` 将 `/admin` 今日闭环操作区 11 个 action CTA 收口到 `adminTodayLoopCtaClassName = "min-h-11 w-full sm:w-auto"`，避免手机端执行初始化、生成、完成、闭环检查、cron、重建、归档和指定日期操作时按钮触控目标过小。本切片只改 `/admin` 今日闭环 action 展示层、源码级 UI 测试和文档记录，不触碰 `ensureProfileAction`、`seedAction`、`generateTodayPlanAction`、`completeTodayPlanAction`、`loopCheckAction`、`runDailyCronAction`、`regenerateTodayAction`、归档 action、指定日期 action、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Today Loop CTA Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminTodayLoopCtaClassName` 失败；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 48 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Next Step

继续执行本切片覆盖扫描、`git diff --check`、`npm run lint`、全量 `npm test`、`npm run build` 和 Aegis helper bundle/check。生产 Preview token 只读 smoke、生产部署/服务器同步仍需用户明确确认边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Today Loop CTA Mobile Touch Targets 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 今日闭环 action 展示层 class、源码级 UI 测试和文档，不触碰 server actions、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 今日闭环维护操作在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `ensureProfileAction`、`seedAction`、`generateTodayPlanAction`、`completeTodayPlanAction`、`loopCheckAction`、`runDailyCronAction`、`regenerateTodayAction`、归档 action、指定日期 action、Preview Mode 只读边界或数据库；只改变读侧 CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 今日闭环 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 今日闭环 `size="sm"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Today Loop CTA Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.320.0

Phase E Admin Today Loop CTA Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `adminTodayLoopCtaClassName`、`0.320.0` 和 `Phase E Admin Today Loop CTA Mobile Touch Targets` 贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `/admin` 今日闭环操作区 11 个 action CTA 均接入 `adminTodayLoopCtaClassName`，当前生产源码中未发现旧无 class 的今日闭环 `size="sm"` 小触控模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：416 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.320.0` Admin Today Loop CTA Mobile Touch Targets 已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 今日闭环维护操作在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `ensureProfileAction`、`seedAction`、`generateTodayPlanAction`、`completeTodayPlanAction`、`loopCheckAction`、`runDailyCronAction`、`regenerateTodayAction`、归档 action、指定日期 action、Preview Mode 只读边界或数据库；只改变读侧 CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 今日闭环 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 今日闭环 `size="sm"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Today Loop CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Failed Job Retry CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Failed Job Retry CTA Mobile Touch Targets。`src/app/admin/page.tsx` 将 `/admin` 最近生成任务失败分支里的 `重试此用户定时任务` 按钮收口到 `adminFailedJobRetryCtaClassName = "min-h-11 w-full sm:w-auto"`，避免手机端维护失败生成任务时按钮触控目标过小。本切片只改 `/admin` 最近生成任务失败重试按钮展示层、源码级 UI 测试和文档记录，不触碰 `retryFailedDailyCronJobAction`、生成任务查询、状态文案、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Failed Job Retry CTA Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminFailedJobRetryCtaClassName` 失败；修正测试截取窗口后 GREEN，19 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 49 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Failed Job Retry CTA Mobile Touch Targets 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 最近生成任务失败重试按钮展示层 class、源码级 UI 测试和文档，不触碰 server actions、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 失败生成任务重试入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `retryFailedDailyCronJobAction`、生成任务查询、状态文案、Preview Mode 只读边界或数据库；只改变读侧 retry CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin retry action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 失败生成任务 `size="sm"` 重试按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Failed Job Retry CTA Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.321.0

Phase E Admin Failed Job Retry CTA Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `adminFailedJobRetryCtaClassName`、`0.321.0` 和 `Phase E Admin Failed Job Retry CTA Mobile Touch Targets` 贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `/admin` 最近生成任务失败重试按钮接入 `adminFailedJobRetryCtaClassName`，当前生产源码中未发现旧无 class 的失败生成任务 `size="sm"` 重试按钮模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：417 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.321.0` Admin Failed Job Retry CTA Mobile Touch Targets 已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 失败生成任务重试入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `retryFailedDailyCronJobAction`、生成任务查询、状态文案、Preview Mode 只读边界或数据库；只改变读侧 retry CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin retry action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 失败生成任务 `size="sm"` 重试按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Failed Job Retry CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Recent Plan Governance CTA Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Recent Plan Governance CTA Mobile Touch Targets。`src/app/admin/page.tsx` 将 `/admin` 最近每日计划列表里的 `设为正式` 和 `归档` 治理按钮收口到 `adminRecentPlanGovernanceCtaClassName = "min-h-11 w-full sm:w-auto"`，避免手机端维护正式/归档计划时按钮触控目标过小。本切片只改 `/admin` 最近每日计划治理按钮展示层、源码级 UI 测试和文档记录，不触碰 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Recent Plan Governance CTA Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminRecentPlanGovernanceCtaClassName` 失败；修正测试截取窗口后 GREEN，20 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 50 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Recent Plan Governance CTA Mobile Touch Targets 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 最近每日计划 `设为正式` / `归档` 治理按钮展示层 class、源码级 UI 测试和文档，不触碰 server actions、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 最近每日计划治理入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview Mode 只读边界或数据库；只改变读侧治理 CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 最近计划治理 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 最近每日计划治理 `size="sm"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Recent Plan Governance CTA Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.322.0

Phase E Admin Recent Plan Governance CTA Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `adminRecentPlanGovernanceCtaClassName`、`0.322.0` 和 `Phase E Admin Recent Plan Governance CTA Mobile Touch Targets` 贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `/admin` 最近每日计划 `设为正式` / `归档` 治理按钮接入 `adminRecentPlanGovernanceCtaClassName`，当前生产源码中未发现旧无 class 的治理 `size="sm"` 小触控模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：418 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.322.0` Admin Recent Plan Governance CTA Mobile Touch Targets 已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 最近每日计划治理入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `markPlanOfficialAction`、`archivePlanAction`、最近计划查询、筛选逻辑、Preview Mode 只读边界或数据库；只改变读侧治理 CTA class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 最近计划治理 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的无 class 最近每日计划治理 `size="sm"` 按钮模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Recent Plan Governance CTA Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Plan Audit Lesson Link Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Plan Audit Lesson Link Mobile Touch Targets。`src/app/admin/page.tsx` 将 `/admin` 单条计划审计链路卡片里的 `查看课程` 链接收口到 `adminPlanAuditLessonLinkClassName = "mt-1 inline-flex min-h-11 items-center text-primary underline underline-offset-2"`，避免手机端从审计链路跳回课程详情时点击区域过小。本切片只改 `/admin` 单条计划审计链路课程链接展示层、源码级 UI 测试和文档记录，不触碰 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Plan Audit Lesson Link Mobile Touch Targets RED 首次因 `/admin` 缺少 `adminPlanAuditLessonLinkClassName` 失败；GREEN 后 21 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 51 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Plan Audit Lesson Link Mobile Touch Targets 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 单条计划审计链路 `查看课程` 链接展示层 class、源码级 UI 测试和文档，不触碰 server actions、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 单条计划审计链路课程入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview Mode 只读边界或数据库；只改变读侧课程链接 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 计划审计链路 owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的内联 `mt-1 inline-flex text-primary underline underline-offset-2` 单条计划审计课程链接模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Plan Audit Lesson Link Mobile Touch Targets 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.323.0

Phase E Admin Plan Audit Lesson Link Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `adminPlanAuditLessonLinkClassName`、`0.323.0` 和 `Phase E Admin Plan Audit Lesson Link Mobile Touch Targets` 贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `/admin` 单条计划审计链路 `查看课程` 链接接入 `adminPlanAuditLessonLinkClassName`，当前生产源码中未发现旧内联小触控模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：419 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.323.0` Admin Plan Audit Lesson Link Mobile Touch Targets 已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 单条计划审计链路课程入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变 `buildAdminPlanAuditChain()`、课程路由、计划治理 action、Preview Mode 只读边界或数据库；只改变读侧课程链接 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 计划审计链路 owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的内联 `mt-1 inline-flex text-primary underline underline-offset-2` 单条计划审计课程链接模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Plan Audit Lesson Link Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Admin Recent Plan Action Row Mobile Layout

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Admin Recent Plan Action Row Mobile Layout。`src/app/admin/page.tsx` 将 `/admin` 最近每日计划卡片里的 action row 收口到 `adminRecentPlanActionRowClassName = "flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end"`，并让卡片首行外层允许 `flex-wrap`，避免手机端维护计划时 `查看课程`、`审计链路`、`设为正式` 和 `归档` 横向挤压。本切片只改 `/admin` 最近每日计划 action row 展示层布局、源码级 UI 测试和文档记录，不触碰 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview 写保护、生产、密钥、Nginx、DNS 或数据库迁移。

- `npm test -- tests/unit/admin-page-labels.test.ts`：Phase E Admin Recent Plan Action Row Mobile Layout RED 首次因 `/admin` 缺少 `adminRecentPlanActionRowClassName` 失败，且最近每日计划 action row 仍使用旧 `flex shrink-0 flex-wrap justify-end gap-2` 横向挤压模板；GREEN 后 22 tests 通过。
- `npm test -- tests/unit/admin-page-labels.test.ts tests/unit/admin-plan-governance.test.ts tests/unit/admin-plan-audit-chain.test.ts tests/unit/admin-plan-audit-exceptions.test.ts tests/unit/admin-planner-visibility.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/admin-content-review.test.ts tests/unit/auth-policy.test.ts`：相关回归 52 tests 通过，覆盖 Admin 标签、计划治理、审计链路、审计异常、planner 可见性、Prompt Studio、内容审查和 Auth/Preview 边界。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Admin Recent Plan Action Row Mobile Layout 已完成 RED/GREEN 和 Admin 相关回归；收尾覆盖扫描、本地门禁、build 与 Aegis helper 仍待执行。本轮只改 `/admin` 最近每日计划 action row 展示层布局、源码级 UI 测试和文档，不触碰 server actions、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 最近每日计划维护操作在移动端的横向挤压和误触风险。
- Compatibility：不新增迁移，不触碰生产，不改变 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview Mode 只读边界或数据库；只改变读侧 action row layout class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 最近计划治理 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的 `flex shrink-0 flex-wrap justify-end gap-2` 最近每日计划 action row 横向挤压模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Recent Plan Action Row Mobile Layout 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.324.0

Phase E Admin Recent Plan Action Row Mobile Layout 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `adminRecentPlanActionRowClassName`、`0.324.0` 和 `Phase E Admin Recent Plan Action Row Mobile Layout` 贯通源码、测试、UI checklist、Generation Quality 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `/admin` 最近每日计划 action row 接入 `adminRecentPlanActionRowClassName`，当前生产源码中未发现旧 `flex shrink-0 flex-wrap justify-end gap-2` 横向挤压模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：420 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/admin`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.324.0` Admin Recent Plan Action Row Mobile Layout 已完成 RED/GREEN、Admin 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的本地增强点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/admin` 最近每日计划维护操作在移动端的横向挤压和误触风险。
- Compatibility：不新增迁移，不触碰生产，不改变 `markPlanActiveAction`、`markPlanArchivedAction`、最近计划查询、筛选逻辑、课程路由、审计链路 href、Preview Mode 只读边界或数据库；只改变读侧 action row layout class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Admin 最近计划治理 action owner 不变，页面展示仍归 `src/app/admin/page.tsx`。
- Retirement：旧的 `flex shrink-0 flex-wrap justify-end gap-2` 最近每日计划 action row 横向挤压模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Admin Recent Plan Action Row Mobile Layout 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Final Local Gates After 0.325.0

Phase E Projects Type Filter Mobile Touch Targets 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `projectTypeFilterLinkClassName`、`0.325.0` 和 `Phase E Projects Type Filter Mobile Touch Targets` 贯通源码、测试、UI checklist、Project Practice 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认 `ProjectTypeFilter` 不再渲染旧 `<Badge asChild>` 小触控链接模板，当前生产源码和测试目标中未发现旧 `h-5` Badge 链接模板。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：421 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 `/projects` 和 `/projects/portfolio`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.325.0` Projects Type Filter Mobile Touch Targets 已完成 RED/GREEN、Projects 相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的学习者侧小优化点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/projects` 项目类型筛选入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变项目查询、`projectTypeHref()`、模板启动 action、Preview Mode 只读边界或数据库；只改变读侧类型筛选链接 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Projects 类型筛选 owner 不变，页面展示仍归 `src/app/projects/ui/project-mission-workspace.tsx`。
- Retirement：旧的 `<Badge asChild>` 类型筛选小触控模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Projects Type Filter Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E AppShell Header Actions Mobile Layout

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：AppShell Header Actions Mobile Layout。`src/components/app-shell.tsx` 将全局页头从固定 `h-14` 调整为移动端可换行的 `min-h-14 flex-wrap py-2`，并将页头 action wrapper 从旧 `flex shrink-0 items-center gap-2` 收口为 `grid w-full gap-2 sm:flex sm:w-auto sm:shrink-0 sm:items-center`，避免 Today、Review、Voice、Projects、Mistakes 等学习者页面的页头 CTA 在手机端横向挤压。本切片只改共享 `AppShell` 页头展示层、源码级 UI 测试和文档记录，不触碰页面业务 action、Preview Mode、auth、路由、数据库、生产/SSH/部署/密钥。

- `npm test -- tests/unit/shared-ui-a11y.test.ts`：Phase E AppShell Header Actions Mobile Layout RED 首次因 `AppShell` 仍使用固定 `h-14` header 和旧 `flex shrink-0 items-center gap-2` action 容器失败；GREEN 后 4 tests 通过。
- `npm test -- tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/mistakes-view.test.ts tests/unit/voice-note.test.ts tests/unit/home-page-labels.test.ts tests/unit/library-page-labels.test.ts tests/unit/today-activity-labels.test.ts`：相关回归 90 tests 通过，覆盖共享 UI a11y、学习组件、Projects、Mistakes、Voice、首页、Library 和 Today 标签/触控目标。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E AppShell Header Actions Mobile Layout 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮只改共享 `AppShell` 页头布局、源码级 UI 测试和文档，不触碰业务 action、Preview 写保护、auth、路由、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少学习者页头 CTA 在移动端的横向挤压和误触风险。
- Compatibility：不新增迁移，不触碰生产，不改变 Today/Review/Voice/Projects/Mistakes 等页面业务 action、Preview Mode、auth、路由或数据库；只改变共享 `AppShell` 页头展示层 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；全局页面壳层 owner 不变，展示仍归 `src/components/app-shell.tsx`。
- Retirement：旧的固定 `h-14` 页头和旧 `flex shrink-0 items-center gap-2` action wrapper 模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E AppShell Header Actions Mobile Layout 已完成产品级 RED/GREEN 和相关回归。下一步执行覆盖扫描、本地门禁、build 和 Aegis helper 结构检查。

## Final Local Gates After 0.326.0

Phase E AppShell Header Actions Mobile Layout 已完成覆盖扫描、本地门禁和 build：

- 覆盖扫描确认 `AppShell Header Actions Mobile Layout`、`0.326.0` 和 `grid w-full gap-2 sm:flex sm:w-auto sm:shrink-0 sm:items-center` 贯通源码、测试、UI checklist、E2E/UI Smoke 模块文档、CHANGELOG 和 Aegis 记录。
- 范围限定旧模板窄扫确认生产 `AppShell` 不再使用旧 `flex h-14 items-center justify-between gap-3 border-b bg-background px-4` header 或旧 `flex shrink-0 items-center gap-2` action wrapper。
- `git diff --check`：通过。
- `npm run lint`：通过。
- `npm test`：422 tests 通过。
- `npm run build`：通过，Next 构建生成 28 个页面，路由表包含 Today、Review、Voice、Projects、Mistakes、Weekly、Path 和 `/projects/portfolio`。
- Aegis helper `bundle` 仍失败于缺 `task-intent-draft.json`；`check` 仍失败于当前和历史 work markdown 未索引。该结果归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 `0.326.0` AppShell Header Actions Mobile Layout 已完成 RED/GREEN、相关回归、覆盖扫描、`git diff --check`、lint、全量单测、build 和 Aegis helper 结构检查；Aegis helper 失败仍是已知结构债。本轮未做生产部署、SSH、Nginx/DNS、数据库或密钥变更。继续时优先寻找 guidance 中仍只有弱证据的学习者侧小优化点，尤其页面/组件里仍保留的小触控输入、移动端横向 action row、英文/raw 状态泄露或没有回归保护的学习入口。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少学习者页头 CTA 在移动端的横向挤压和误触风险。
- Compatibility：不新增迁移，不触碰生产，不改变 Today/Review/Voice/Projects/Mistakes 等页面业务 action、Preview Mode、auth、路由或数据库；只改变共享 `AppShell` 页头展示层 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；全局页面壳层 owner 不变，展示仍归 `src/components/app-shell.tsx`。
- Retirement：旧的固定 `h-14` 页头和旧 `flex shrink-0 items-center gap-2` action wrapper 模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E AppShell Header Actions Mobile Layout 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Glossary Category Filter Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Glossary Category Filter Mobile Touch Targets。`src/app/glossary/page.tsx` 将 `/glossary` 检索与分类卡片里的 `全部` 和分类筛选入口从小尺寸 `<Badge asChild>` 链接收口为 `glossaryCategoryFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，避免手机端按术语分类筛选时触控目标过小。本切片只改 `/glossary` 分类筛选展示层、源码级 UI 测试和文档记录，不触碰搜索/category 参数、术语查询、生成复习卡片 action、Preview 写保护、数据库、生产/SSH/部署/密钥。

- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Glossary Category Filter Mobile Touch Targets RED 首次因 `/glossary` 缺少 `glossaryCategoryFilterLinkClassName` 且分类筛选仍使用旧 `<Badge asChild>` 小触控模板失败；GREEN 后 18 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/learning-ui-components.test.ts tests/unit/home-page-labels.test.ts tests/unit/today-activity-labels.test.ts`：相关回归 51 tests 通过，覆盖 Knowledge Base/Radar、共享学习 UI、首页标签和 Today 知识卡入口。
- `rg -n "Phase E Glossary Category Filter|glossaryCategoryFilterLinkClassName|0\\.327\\.0|分类筛选入口|Badge asChild" ...`：覆盖扫描确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "<Badge asChild variant=\\{selectedCategory \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedCategory === c\\.category|inline-flex h-5 w-fit" src/app/glossary/page.tsx tests/unit/knowledge-base.test.ts`：无匹配，确认 Glossary 分类筛选不再使用旧小尺寸 Badge 链接模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Glossary Category Filter Mobile Touch Targets 本地收尾门禁通过；全量单测 423 tests 通过，Next 构建生成 28 个页面，路由表包含 `/glossary`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Glossary Category Filter Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁、build 和 Aegis helper 结构检查；Aegis helper 失败仍归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。本轮只改 `/glossary` 分类筛选展示层、源码级 UI 测试和文档，不触碰搜索/category 参数、术语查询、生成复习卡片 action、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/glossary` 分类筛选入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变搜索/category 参数、术语查询、生成复习卡片 action、Preview Mode 只读边界或数据库；只改变读侧分类筛选链接 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Glossary 分类筛选 owner 不变，页面展示仍归 `src/app/glossary/page.tsx`。
- Retirement：旧的 `<Badge asChild>` 分类筛选小触控模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Glossary Category Filter Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Phase E Radar Type Filter Mobile Touch Targets

本地 Learning Desire + Learning Effect guidance 继续推进 Phase E：Radar Type Filter Mobile Touch Targets。`src/app/radar/page.tsx` 将 `/radar` 筛选实体卡片里的 `全部` 和实体类型筛选入口从小尺寸 `<Badge asChild>` 链接收口为 `radarTypeFilterLinkClassName = "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"`，避免手机端按实体类型筛选时触控目标过小。本切片只改 `/radar` 类型筛选展示层、源码级 UI 测试和文档记录，不触碰搜索/type 参数、实体查询、生成复习卡片 action、Preview 写保护、数据库、生产/SSH/部署/密钥。

- `npm test -- tests/unit/knowledge-base.test.ts`：Phase E Radar Type Filter Mobile Touch Targets RED 首次因 `/radar` 缺少 `radarTypeFilterLinkClassName` 且类型筛选仍使用旧 `<Badge asChild>` 小触控模板失败；GREEN 后 19 tests 通过。
- `npm test -- tests/unit/knowledge-base.test.ts tests/unit/map-analytics.test.ts tests/unit/today-activity-labels.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts`：相关回归 66 tests 通过，覆盖 Knowledge Base/Radar、Knowledge Map、Today 知识卡、首页标签和共享学习 UI。
- `rg -n "Phase E Radar Type Filter|radarTypeFilterLinkClassName|0\\.328\\.0|类型筛选入口|Badge asChild" ...`：覆盖扫描确认源码、测试、UI checklist、Knowledge Base/Radar 模块文档、CHANGELOG 和 Aegis 记录均接入本切片。
- `rg -n "<Badge asChild variant=\\{selectedType \\? \\\"outline\\\" : \\\"secondary\\\"\\}>|<Badge[\\s\\S]{0,120}asChild[\\s\\S]{0,120}selectedType === group\\.type|inline-flex h-5 w-fit" src/app/radar/page.tsx tests/unit/knowledge-base.test.ts`：无匹配，确认 Radar 类型筛选不再使用旧小尺寸 Badge 链接模板。
- `git diff --check`、`npm run lint`、`npm test`、`npm run build`：Phase E Radar Type Filter Mobile Touch Targets 本地收尾门禁通过；全量单测 424 tests 通过，Next 构建生成 28 个页面，路由表包含 `/radar`。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py bundle --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform --work 2026-06-03-roky-learning-desire`：仍失败于历史 Aegis Markdown-only 结构债，缺 `task-intent-draft.json`。该结果归类为方法包结构债，不是产品 UI 验证失败。
- `python3 /home/xing-12_26/projects/codex-workspace/CodeShua/references/Aegis/scripts/aegis-workspace.py check --root /home/xing-12_26/projects/codex-workspace/ai-learning-platform`：仍失败于当前和多个既有 work markdown 未索引。该结果归类为方法包结构债，不是产品 UI 验证失败。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Phase E Radar Type Filter Mobile Touch Targets 已完成 RED/GREEN、相关回归、覆盖扫描、本地门禁、build 和 Aegis helper 结构检查；Aegis helper 失败仍归类为既有 Markdown-only 结构债，不是产品 UI 验证失败。本轮只改 `/radar` 类型筛选展示层、源码级 UI 测试和文档，不触碰搜索/type 参数、实体查询、生成复习卡片 action、Preview 写保护、数据库、生产/SSH/部署/密钥。

## Drift Check

- Scope：仍服务 Roky Learn learning desire/mobile/learning effect 目标，当前切片减少 `/radar` 类型筛选入口在移动端的点击摩擦。
- Compatibility：不新增迁移，不触碰生产，不改变搜索/type 参数、实体查询、生成复习卡片 action、Preview Mode 只读边界或数据库；只改变读侧类型筛选链接 class、源码级测试和文档记录。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Radar 类型筛选 owner 不变，页面展示仍归 `src/app/radar/page.tsx`。
- Retirement：旧的 `<Badge asChild>` 类型筛选小触控模板已退役；旧模板只保留在测试反向断言和历史记录文本中。
- Decision：continue; Phase E Radar Type Filter Mobile Touch Targets 已完成产品级 RED/GREEN、相关回归、覆盖扫描、本地门禁和 build。Aegis helper 失败仍归类为已知结构债，下一步继续寻找 guidance 中可本地关闭的小优化点。

## Reduce Chaos Books Mobile Sticky Companion

本地 Reduce Chaos guidance 继续推进第 14.6 与第 16 节：Books Mobile Sticky Companion。`src/app/books/[id]/page.tsx` 将 `/books/ai-engineering` 的 `打开 AI 伴读` 从阅读侧栏内的普通按钮移动到 `aria-label="AI 伴读移动操作"` 的 sticky 操作区，移动端和平板宽度固定在底部导航上方，桌面端继续使用右侧 `AI 伴读` 面板。本切片只改 Books 阅读页展示层、源码级 UI 测试和文档记录，不触碰 Books 静态数据、Note/Flashcards/Coach 链接、真实上传、OCR、AI provider 调用、鉴权、Preview 写保护、数据库、生产密钥或迁移。

- `npm test -- tests/unit/books-companion.test.ts`：RED 首次因阅读页缺少 `aria-label="AI 伴读移动操作"` 和 sticky 底部操作区失败；GREEN 后 3 项通过。
- `npm test -- tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/auth-policy.test.ts`：相关回归 38 项通过，覆盖 Books、Current Mission、Next Best Action、移动导航和鉴权/Preview 边界。
- `git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test`、`npm run build`：本地最终门禁通过；全量单测 464 项通过，Next 生产构建生成 31 个静态页面。

## Resume State Hint

从 `ai-learning-platform` 根目录继续。不要从记忆单独恢复；先读本文件、`10-intent.md`、`90-evidence.md`，再检查 `git status`。当前 Reduce Chaos Books Mobile Sticky Companion 已完成 RED/GREEN、相关回归、本地门禁、build、代码提交、GitHub 推送、生产部署、远端门禁和 390px 登录态生产 smoke；仅剩部署证据文档提交/推送与临时 SSH key 清理。本切片只改 `/books/[id]` 阅读页移动端 AI 伴读入口展示层、源码级 UI 测试和文档，不触碰上传/OCR/AI provider/数据库/密钥。

## Drift Check

- Scope：仍服务 Roky Learn reduce chaos、Book Companion 和 mobile 目标，当前切片减少 `/books/ai-engineering` 手机阅读时 AI 伴读入口离主阅读动作过远的问题。
- Compatibility：不新增迁移，不触碰 Books 数据源、Current Mission 排序、Note/Flashcard/Coach 链接、上传禁用态、Preview Mode 只读边界或数据库；只改变读侧 Sheet 触发入口位置和 class。
- New fallback/owner：未新增 owner、adapter 或外部 fallback；Books 伴读 owner 不变，页面展示仍归 `src/app/books/[id]/page.tsx`。
- Retirement：旧的阅读侧栏内 `md:hidden` Sheet 入口已退役，避免平板宽度既没有桌面侧栏也没有 Sheet 入口；Sheet 内容和学习资产入口继续复用原 `BookCompanionPanel`。
- Decision：continue; Reduce Chaos Books Mobile Sticky Companion 已完成产品级 RED/GREEN、本地门禁、build、GitHub 推送、生产部署和生产 smoke。下一步提交并推送部署证据记录，清理临时 SSH key。
