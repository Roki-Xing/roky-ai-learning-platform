# Reflection

## Lessons

- Auth proxy matcher must keep Next dev internals out of auth redirects. If `_next/webpack-hmr` is redirected during local development, hydration and interactive client behavior can fail even when the page HTML loads.
- Next `config.matcher` must remain statically analyzable. Do not move matcher patterns into imported constants; Next can reject non-literal matcher config during build.
- Radix Sheet/Dialog content needs accessible title/description ownership. If the visual design does not need visible text, keep `SheetTitle` / `SheetDescription` available for assistive tech instead of omitting them.
- Visual E2E should use Playwright project device configuration rather than nesting an extra desktop/mobile viewport loop inside each test. Otherwise test counts inflate and screenshots become harder to map to device projects.
- Next dev HTML can become dominated by React Flight chunks when a server page renders huge repeated lists. For `/map`, the right fix was to window the first-screen domain/topic lists, not to keep increasing Playwright timeouts.
- Server pages should prefer count queries and minimal `select` for dashboard summaries. Fetching row arrays only to display counts increases DB and render pressure without improving the learner-facing UI.
- Admin content-quality panels should keep rule ownership in pure services. `src/server/admin/content-review.ts` can be tested without DB fixtures, while `/admin` only scopes rows and renders the queue.
- Axe a11y smoke is useful only if it is allowed to fail on real issues. The first run exposed contrast, missing accessible names, and a prohibited `aria-label`; fixing those made the check a meaningful Phase 10 gate instead of a superficial script.
- Disabled button opacity can create contrast failures even when the underlying foreground/background tokens pass. Keep disabled labels readable enough for inspection while still visually indicating disabled state.
- For token contrast, inspect browser computed styles before guessing. The failed elements all shared a `text-muted-foreground` computed value that was too light on shallow `muted` and pastel surfaces.
- Preview write-protection E2E should assert the guard contract, not a post-error UX that the app does not currently promise. Settings, quiz, and code actions reject with failed POST responses; after that, tests should not assume the page remains in the same hydrated state.
- Next dev keeps one active dev server per project directory. To test local Preview token behavior, restart the existing local dev server with a temporary `PREVIEW_TOKEN` rather than trying to launch a second server on another port.
- When a hydration warning cannot be reproduced from SSR HTML and Playwright DOM, do not change form markup blindly. Add a focused console guard so the warning becomes measurable if it returns.
- Prompt Studio should aggregate existing generation evidence instead of adding another model-calling path. For Phase 9.2, the safer owner is `src/server/admin/prompt-studio.ts`: it reads recent jobs/plans, exposes prompt/schema drift, failure and fallback examples, and leaves actual repair calls inside the existing generation pipeline.
- Arbitrary-date regeneration should avoid mutating active official plans by default. The new Admin entry only archives/rebuilds test plans for the selected localDate; official regeneration still uses the existing explicit today action.
- Completion feedback should stay small and task-specific. For Phase 2.4, the useful pattern was a shared `LearningCelebrationCue` with restrained copy and metrics, then direct insertion into Today, Review, and Projects completion states rather than a global animation system.
- Today stage guidance belongs in the FocusPlayer stage model, not scattered inside each stage body. A single optional `guidance` object keeps “做什么 / 为什么 / 完成标准” consistent while letting `/today` provide domain-specific copy.
- Markdown course blocks need producer and renderer updates together. `LearningMarkdown` now recognizes typed blockquotes, and `buildDailyPlanMessages()` tells the model to generate the same `> 核心直觉 / > 常见误区 / > 代码/伪代码 / > 自测` protocol.
- Mobile Today polish can live in the FocusPlayer owner when it is purely about stage controls. Sticky progress and sticky next controls should not be reimplemented in `/today/page.tsx`.
- Mobile Review should not present desktop keyboard shortcuts as the primary affordance. Keep touch targets large and visible on phones, then show Space/1-4 hints only where a keyboard is plausible.
- Review rating controls are a useful export boundary for tests. Exporting `ReviewRatingControls` lets the mobile touch layout be covered without constructing a full due-card session.
- Mobile Voice should send the recorded `File` directly into the existing transcription flow after `MediaRecorder.onstop`; relying on a programmatically populated file input keeps the browser-upload path coupled to the recording path and leaves an unnecessary second tap.
- Recording cleanup needs an unmount guard before creating object URLs, setting state, or calling server actions. Stopping a recorder during page navigation should release tracks, not start an automatic transcription.
- Voice learning CTA groups should be mobile `grid` first and desktop `flex` second. After a transcript is saved, `送 Coach 检查` is the primary learning action on phones and needs the same large touch target as recording.
- Voice → Coach handoff should return the user directly to the generated review. A small `buildVoiceCoachReviewHref()` helper keeps the redirect contract explicit and avoids leaving users on `/voice` with a second “查看 Coach” click.
- Coach should verify Voice Note source ownership by both current user and selected `thoughtReviewId`. The UI source panel is only shown when the selected review and VoiceNote actually match, instead of trusting query params alone.
- E2E interaction tests must move with the product path. The old Voice E2E still expected `/voice` after sending to Coach; updating it caught and then proved the intended `/coach?reviewId=...&source=voice-note` path.
- Long Playwright matrices can surface transient navigation timeouts after many sequential pages. Treat them as failures first, but isolate with curl, single-test rerun, and full rerun before making product code changes.
- Daily Quest 广度挑战不能只看 `connections.glossary` 是否存在。`Lesson.connections` 可能同时带今日术语和今日 Radar 广度项；当 `knowledgeFocus.rotation.focus` 是 `person` 或 `benchmark`，首页任务必须优先显示对应 Radar 挑战。
- 对 Next/tsx 别名模块做一次性数据探针时，不要把不稳定的 `tsx -e` 动态 import 输出当成关键证据。关键证据应来自稳定单测、页面 smoke 或项目已有脚本。
- Radar 关系卡片链应该按稳定组显示，即使某组暂时没有数据也保留空态。否则用户会把数据缺口误解成产品缺少“相关论文”或“相关 Benchmark”能力。
- Radar 关系匹配不能只依赖当前实体单向列出的 `relatedTerms` / `representativeWorks`；候选实体反向指向当前上下文也应进入卡片链，尤其是人物、论文和 Benchmark 的关系。
- Today 完成后的 Projects 推荐可以先做文案和层级强化，不需要新增新的推荐引擎。Phase 8.2 的目标是让用户明确看到“完成课程后把知识用到项目里”，已有 `projectPractice` 已经能承载 active project 和 starter 两条路径。
- Completion Hub 应优先复用 `/today` 已经查询的学习结果信号。生成卡片数、quiz attempt 和代码提交状态足够覆盖 Phase 4.5 的“完成后看到结果”，无需新增持久化或二次查询 owner。
- Today 阶段状态不要散落在页面 JSX 里。quiz 和术语/Radar 都有“无任务、未开始、部分完成、完成”的产品语义，抽成纯函数后既能被测试，也能让时间线和 FocusPlayer 共享同一判断。
- Review 的补弱 CTA 不能只停留在文案层。`remediationActions` 作为 summary 数据契约可以同时服务 `/review` 完成态、Coach handoff、Today remediation landing 和 `/mistakes`，比在 UI 里硬编码按钮更容易验证。
- 如果一个按钮叫 `生成补弱小课`，目标页必须真实消费 query 并显示可见落点。Phase 5.1 通过 `today-remediation-intent.ts` 和 `TodayRemediationBanner` 避免了静默跳转到 `/today` 的假功能。
- Next 16 的 page `searchParams` 是 Promise；修改页面签名前必须读本地 Next 文档并用 `npm run build` 验证，不能沿用旧版同步 props 记忆。
- `/mistakes` 的学习感来自“修复动作”，不是列表本身。Phase 5.2 把开放误区连接到 Coach、Review card 和 resolved 状态，才让错题真正回流到学习闭环。
- 误区类型筛选可以先由 `src/server/mistakes/view.ts` 的启发式规则拥有，避免为了 UI 导航新增 schema/migration；但要用测试固定 `概念 / 代码 / 算法 / 术语 / 事实` 的推断边界。
- 新增任何错题写入动作都必须纳入 Preview 写保护扫描。`generateMistakeReviewCardAction()` 和 `markMistakeResolvedAction()` 都属于写路径，单测应直接检查 `assertWritableRequest()` 存在。
- `/path` 的路径感要落到可执行差距。Phase 5.3 把 `unlockCondition` 和 `nextTopic` 放在 `buildLearningPathSnapshot()`，比在页面里拼文案更容易让 Path、Weekly、Progress 以后共享。
- Quiz 正确率要按阶段聚合，而不是只显示全局学习进度。`QuizAttempt` 通过正式课程 lessonId 映射回 stage domain，才能解释“这一阶段是否达标”。
- 页面展示型验收可以先用源文件测试固定关键标签，再用 SSR smoke 验证真实 HTML。这样能避免服务层字段已存在但页面没有露出的假完成。
- `/weekly` 的 AI 周总结可以先做确定性 fallback。Phase 5.4 没有引入模型调用，却让周报稳定输出本周收获、薄弱点、下周建议和推荐阶段，适合作为后续真 AI 摘要的契约。
- 周报总览应该覆盖学习行为而不只是课程行为。Voice Note、Coach、项目里程碑、误区解决和术语/Radar 复习共同决定学习档案是否完整。
- 周报查询优先用 count/minimal select。`VoiceNote`、`ThoughtReview`、`ProjectMilestone`、`Misconception` 这些指标只需要数量，不应该为了展示总览拉完整行。
- Voice 术语词表和 transcript cleanup 应分开拥有。`vocabulary.ts` 负责告诉转写模型要保留哪些术语，`cleanup.ts` 负责 deterministic 后处理；这样补词表不会把 provider prompt 和本地清洗规则混成一个隐式 owner。
- `chain of thought` 不应被压成 `CoT`。用户口头说完整短语时，保留 `Chain-of-Thought` 更适合回看 transcript；`cot` 才归一为 `CoT`。
- Voice 反思模板的入口标签可以区分学习场景，但 prompt 协议应跟 guidance 保持单一。Phase 6.3 统一六个模板的四句提示，避免 `代码思路`、`论文阅读` 等入口各自发展成另一套隐式反思标准。
- Curated path 数据源和页面展示不能各自暗含数量上限。Phase 7.1 保留 `src/server/knowledge/paths.ts` 作为五条路径 SSOT，同时移除 `/glossary`、`/radar` 的页面级 `.slice(0, 2)`，避免新增路径后静默漏展示。
- 学习路径指标文案应跟 guidance 用词一致。内部状态仍可用 `viewed`、`hasCard`、`reviewed`，但用户可见卡片应显示 `已看`、`已生成卡片`、`已复习`、`未掌握`、`下一项`。
- Projects Mission Mode 的价值在于减少“现在该交什么”的猜测。Phase 8.3 把 `当前任务`、`输入/输出`、`需要提交什么`、`AI 评审入口` 放进 `ProjectMissionBrief`，比只展示 codePrompt 更接近可执行任务卡。
- `AI 评审入口` 不能暗示服务端执行用户代码。文案应明确落到现有 `保存并评审代码` 链路，继续只保存文本并复用代码反馈系统。
- 首页项目卡要同时说清“项目”和“今天推进哪一个里程碑”。Phase 8.1 把 `今日里程碑` 放到 `ProjectDailyRhythmCard`，避免首页只有进度数字但缺少当日任务语义。

## Process Notes

- Keep this work isolated to Roky Learn. Do not mix Shike/拾刻/cloud-device/release-evidence context into future resumes.
- Treat production deployment as a separate operation requiring explicit confirmation, because it touches live containers and host configuration.
- The Phase 8/9/10 plus Phase 2.4/3.2/3.3/3.4/4.2/4.3/4.4/4.5/5.1/5.2/5.3/5.4/6.1/6.2/6.3/6.4/7.1/7.2/7.3/8.1/8.2/8.3 local slices now have coverage for homepage project rhythm, projects portfolio, Projects Mission Mode task details, Today stage status accuracy, Today Completion Hub, Review remediation actions, Today remediation landing, Mistakes repair center, Learning Path unlock signals, Weekly Review overview, Voice vocabulary cleanup, Voice reflection templates, Glossary/Radar curated paths, Today post-completion project recommendation, admin generation quality summary, Admin Prompt Studio, Admin card/source review queues, Celebration feedback, mobile Today sticky controls, mobile Review large-button controls, mobile Voice capture-to-transcript controls, Voice-to-Coach handoff, Daily Quest breadth challenge, Radar relation-card chains, Today stage guidance, LearningMarkdown course blocks, Preview write-guard helpers, Preview write-protection E2E, hydration console guard, visual coverage, a11y, mobile matrix, and `/map` payload repair.
- For the next slice, continue the guidance from Phase 6 or inspect Review/Coach/Path/Weekly cross-links for remaining fake entrances. Production Preview token smoke and production deployment remain explicit separate tasks.
