# Voice Note MVP

## 状态

已上线并完成生产闭环验收。

## 用户流程

1. 打开 `/voice`，页头 badge 显示 `语音捕获`，不显示英文 `Voice`。
2. 手机端可直接点击“一键录音”，录音区显示计时。
3. 点击“停止并转写”后，浏览器录音会自动进入转写流程；成功时自动填入转写文本。
4. 上传音频仍可临时发送到服务端转写；无转写密钥时使用手动转写文本。
5. 转写 prompt 会显式保护 AI 术语缩写和技术词，例如 `CoT`、`SWE-bench`、`RLHF`、`DPO`、`SFT`、`LoRA`、`QLoRA`、`MoE`、`RAG`、`MMLU`、`GPQA`、`HumanEval`、`ReAct`、`ToT`、`MCP`、`BM25`、`Reranker`、`Embedding`、`Vector Database`。
6. 转写结果会对常见误识别做后处理，例如 `cot -> CoT`、`chain of thought -> Chain-of-Thought`、`swe bench / swebench -> SWE-bench`、`rag -> RAG`、`lora -> LoRA`、`mmlu -> MMLU`、`gpqa -> GPQA`。
7. 可以点击“开始 60 秒反思”，把四句模板直接插入转写文本：
   - 我今天学了什么？
   - 我哪里还不懂？
   - 我能举什么例子？
   - 我希望 Coach 检查什么？
8. 在转写文本区粘贴、编辑或补充转写文本。
9. 保存语音笔记；学习者可见文案不显示 `Voice Note` / `Voice Notes`。
10. 在“语音学习流水线”中继续执行：
   - 送 Coach 检查，生成结构化 ThoughtReview，并自动跳转到对应 `/coach?reviewId=...`。
   - 整理成笔记，保存为 Note。
   - 生成复习卡片。
   - 进入 `/review` 复习。
11. Coach review 会显示 `来自语音笔记`、中文 mode、转写预览、`查看语音笔记` 和 `保存为 Note` / `查看 Note`，不直接显示 `来自 Voice Note` 或 `查看 Voice Note`。
12. 语音学习流水线 CTA 在手机端为全宽大按钮，减少当前最优动作、送 Coach、存 Note、生成卡片和复习的触控摩擦。
13. 语音流程步骤卡通过屏幕阅读器文本暴露 `第 n 步，完成/进行中/待办`，不依赖图标、颜色或英文 `title` 表达步骤状态。
14. Voice 表单核心控件使用中文业务可访问名称：模式选择框读作 `语音笔记模式`，transcript 文本区读作 `语音转写文本`；模式选择框在手机端使用 `min-h-11`，满足 44px 触控高度。
15. 录音状态面板的计时器标签显示 `录音计时`，不显示纯英文 `recording`。
16. 语音学习流水线步骤标题显示 `Coach 检查`、`整理笔记`、`复习卡片`，不单独显示 `Coach`、`Note`、`Cards`。
17. 语音学习流水线和当前语音笔记状态中的卡片数量显示为 `N 张卡片`，不显示 `N cards`。
18. 当前 Voice Note 状态区显示 `已连接 Coach`、`已保存笔记` 和 `转写文本`，不显示 `Coach linked`、`Note saved` 或独立标题 `Transcript`。
19. 当前语音笔记和最近语音笔记的 mode 展示通过中文 helper 输出，未知/历史 mode 兜底为 `语音反思`，不直接显示 raw mode 值。
20. Voice 输入表单的转写区域可见标题显示 `转写文本`，与 `语音转写文本` 可访问名称保持一致。
21. 页面级 `打开 Coach` 和右侧学习链路 `去复习` CTA 在手机端使用全宽大触控按钮，减少从语音记录进入 Coach 或复习队列的摩擦。
22. 上传音频 input 在手机端满足 44px 触控高度，手动 `自动转写到转写文本` action 行在手机端使用单列布局，避免上传后补转写入口和说明文字横向挤压。
23. 转写结果状态 badge 显示 `转写成功` 或 `需手动整理`，不直接显示 raw `success` / `manual_required`。
24. 录音/上传状态面板在 `manual_required` 时也显示 `需手动整理`，与转写结果 badge 保持一致，不再显示缩写式 `需手动`。
25. 转写结果详情显示 `转写方式：自动转写/手动整理` 和 `提示：...`，不直接显示 `provider:`、`model:` 或 `reason:` 技术标签。
26. 6 个反思模板入口在手机端使用显式 `min-h-11`，避免“今日理解 / 代码思路 / 术语解释 / 论文阅读 / 行业观察 / 项目复盘”退回小触控卡片。
27. `/voice`、Voice 捕获状态、Voice 表单、语音学习流水线、Coach 来源面板、Weekly 7 天总览、Weekly Markdown、Notes 当前笔记 badge 和学习徽章统一使用 `语音笔记`，不向学习者显示 `Voice Note` / `Voice Notes` / `来自 Voice 的当前笔记`。
28. 最近语音笔记列表每条回看入口复用 `voiceRecentNoteLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors"`，手机端满足 44px 触控高度。

## 首页推荐

首页 `Next Best Action` 已纳入 `todayVoiceNoteCount`：

- 今日学习未完成：优先 `/today`。
- 今日有到期卡片：优先 `/review`。
- 有 open misconception：优先 `/coach`。
- 今日还没有笔记：优先 `/notes`。
- 今日已经学习并写过笔记，但还没有语音笔记：优先 `/voice`，提示“说出今天的理解”。
- 学习、复习、笔记和语音表达都完成后，再推荐项目实践或知识地图。

## 数据模型

- `VoiceNote`
  - `userId`
  - `lessonId`
  - `mode`
  - `audioUrl`
  - `transcript`
  - `editedTranscript`
  - `thoughtReviewId`
  - `noteId`

## 重要约束

- MVP 不长期保存音频文件；服务端只保存 transcript 和本地/临时音频名称引用。
- 音频上传限制为 20MB。
- 仅允许常见音频 MIME 类型。
- `OPENAI_API_KEY` 和 `OPENAI_TRANSCRIBE_MODEL` 只在服务端读取。
- 无转写 key、测试环境、转写失败或返回空文本时，必须显式要求手动 transcript。
- AI 学习缩写的保留和纠错在服务端完成，前端不直接持有术语词表逻辑。
- 不在前端暴露 API Key。
- 不执行用户提交的代码或音频内容。
- 显式传入 `lessonId` 时，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝。
- 未显式传入 `lessonId` 时，可回退到当前用户最近正式课程。
- 从 Voice Note 进入 Coach 时，`reviewJson` 可包含持久化元数据；读取时必须通过 `parseStoredThoughtReview()` 过滤到 schema 字段后再校验。

## 服务层

- `src/server/voice/transcription.ts`
  - `validateVoiceAudioFile()`
  - `buildVoiceTranscriptionPrompt()`
  - `normalizeVoiceTranscript()`
  - `transcribeVoiceAudio()`
  - `MAX_VOICE_AUDIO_BYTES`
- `src/server/voice/vocabulary.ts`
  - 维护 AI 学习缩写和技术词表，并生成转写 prompt 保护语。
- `src/server/voice/cleanup.ts`
  - 维护 transcript 后处理规则，将常见 AI 术语误识别归一化为稳定写法。
- `src/server/voice/reflection-template.ts`
  - 提供 `今日理解`、`代码思路`、`术语解释`、`论文阅读`、`行业观察`、`项目复盘` 六个反思模板入口。
  - 六个模板均显示同一组 60 秒提示：`我今天学了什么？`、`我哪里还不懂？`、`我能举什么例子？`、`我希望 Coach 检查什么？`。
- `src/server/voice/submit.ts`
  - `saveVoiceNote()`
  - 支持 manual transcript 与 server-side transcription 两种路径。
  - `saveVoiceNoteAsNote()`
  - 按 `userId + voiceNoteId` 将 VoiceNote 沉淀为 Note，重复调用更新同一条 linked Note。
  - `sendVoiceNoteToCoach()`
  - 按 `userId + voiceNoteId` 将 VoiceNote 发送到 Coach，重复调用复用同一条 linked ThoughtReview，并在 `reviewJson` 写入 `source: "voice-note"` 和 `voiceNoteId`。
  - `generateVoiceNoteFlashcards()`
  - 按 `userId + voiceNoteId` 将 linked ThoughtReview 生成稳定 Flashcards，重复调用不重复创建。
- `src/server/voice/handoff.ts`
  - `buildVoiceCoachReviewHref()` 生成 Voice Note → Coach review 的稳定跳转地址。
- `src/app/coach/ui/coach-workspace.tsx`
  - `CoachVoiceSourcePanel` 在 Coach review 中展示语音笔记来源、转写预览、回看语音笔记和保存/查看 Note 入口。
- `src/app/coach/page.tsx`
  - 读取 Voice-linked review 后按当前用户和 `thoughtReviewId` 反查 VoiceNote，避免跨用户或错 review 读取来源。
- `src/app/voice/ui/voice-learning-pipeline.tsx`
  - 展示语音笔记 → Coach → Note → Flashcards → Review 的阶段状态和 CTA。
  - 组件不直接 import server actions；由 `/voice` page 注入 action，保持 UI 单测不加载服务端 env。
  - 手机端 CTA 使用全宽大触控按钮，桌面端保持横向操作组。
  - `当前最优动作` 可点击 CTA 在手机端使用单列布局和 `min-h-11 w-full sm:w-auto`，避免复习入口在窄屏退回小按钮。
  - 步骤标题使用中文业务文案：`Coach 检查`、`整理笔记`、`复习卡片`。
  - 卡片数量状态使用中文业务文案：`N 张卡片`。
- `src/app/voice/ui/voice-workspace-form.tsx`
  - 展示 60 秒反思模板，并支持一键插入转写文本。
  - 模式选择框和 transcript 文本区使用中文业务 `aria-label`，避免辅助技术朗读 `Voice Note 模式` 或纯英文 `Transcript`。
  - 模式选择框使用 `voiceModeSelectClassName = "min-h-11 rounded-md border bg-background px-3 text-sm outline-none"`，避免手机端 select 退回小触控目标。
  - 反思模板按钮使用 `voiceReflectionTemplateButtonClassName = "min-h-11 rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50"`，避免 6 个模板入口退回 44px 以下的小触控卡片。
  - 转写区域可见标题使用 `转写文本`，避免中文界面中出现独立英文标题 `Transcript`。
- `src/app/voice/ui/voice-capture.tsx`
  - 浏览器录音停止后自动调用转写流程，成功后填入转写文本。
  - 卸载时停止录音不会触发自动转写。
  - 录音计时器使用中文可见标签 `录音计时`。
  - 上传音频 input 使用 `min-h-11`，手动 `自动转写到转写文本` action 行使用手机端 `grid gap-2` 和桌面端 `sm:flex sm:flex-wrap sm:items-center`。
  - 转写结果状态通过 `formatVoiceTranscriptionResultStatusLabel()` 展示为 `转写成功` 或 `需手动整理`。
  - 转写结果详情通过 `formatVoiceTranscriptionProviderLabel()` 和 `formatVoiceTranscriptionResultNote()` 展示为学习者可理解的 `转写方式` 与 `提示`。
- `src/app/voice/ui/voice-capture-status.ts`
  - 录音/上传状态面板在 `manual_required` 时使用 `需手动整理`，与转写结果 badge 的状态文案保持一致。
- `src/app/voice/page.tsx`
  - 页面级 `打开 Coach` 与学习链路 `去复习` 复用 `voicePageCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端全宽且满足 44px 触控高度。
  - 最近语音笔记列表每条回看入口复用 `voiceRecentNoteLinkClassName`，保持 `min-h-11` 触控高度，避免回看历史语音记录时退回小链接。
  - 选中态、空态、最近列表和语音笔记价值说明使用中文业务文案，防止 `当前 Voice Note`、`最近 Voice Notes`、`Voice Note 的价值` 等旧文案回退。

## 本地验收

- Phase E Voice Recent Note Link Mobile Touch Targets：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，15 项通过；覆盖最近语音笔记列表入口复用 `voiceRecentNoteLinkClassName`，并防止退回旧 `rounded-md border px-3 py-2 text-sm transition-colors` 小触控模板。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/review-filter.test.ts tests/unit/learning-ui-components.test.ts`：75 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff、Review queue 和共享学习 UI。
  - 覆盖扫描确认 `src/app/voice/page.tsx`、`tests/unit/voice-note.test.ts`、UI checklist、Voice 模块文档、CHANGELOG 和 Aegis 记录均接入本切片；窄扫确认 `/voice` 生产源码不再使用旧 inline 小触控 class。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地收尾门禁通过；全量单测 403 项通过，Next 生成 28 个页面且路由表包含 `/voice`。
  - Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且当前和多个既有 work markdown 未索引；该结果不是 Voice 产品 UI 验证失败。
- Phase E Voice Manual Required Status Badge Localization：
  - `npm test -- tests/unit/voice-capture-status.test.ts`：RED 后 GREEN，7 项通过；覆盖 Voice 捕获状态面板在 `manual_required` 时显示 `需手动整理`，并防止退回缩写式 `需手动` 或 raw `manual_required`。
  - `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：66 项通过，覆盖 Voice 捕获状态、Voice 页面、转写自动填入、转写服务、Coach handoff 和共享学习组件。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 374 项通过，Next 构建生成 28 个页面且路由表包含 `/voice`。
  - Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是 Voice 产品 UI 验证失败。
- Phase E Voice E2E Transcript Label Alignment：
  - `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：RED 首次两个用例都因 `getByLabel("Transcript")` 超时失败；改为 `getByLabel("语音转写文本")` 后 GREEN，2 项通过。
  - 覆盖手动转写保存、语音学习流水线、送 Coach、生成卡片并进入 focused review，且 E2E 不再依赖旧英文 `Transcript` 可访问名称。
- Phase E Voice E2E Focused Review Source Isolation：
  - `npm test -- tests/unit/coach-submit.test.ts`：RED 后 GREEN，5 项通过；覆盖 Voice-linked ThoughtReview 通过通用 Coach `生成卡片` 路径时自动保留 `voice-note` 队列归属。
  - `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：RED 首次第 2 项失败于 Coach 生成卡片后仍进入 `/review?source=thought-review`；GREEN 后 2 项通过，进入 `/review?source=voice-note` 并显示 `语音笔记复习`。
  - `npx playwright test tests/e2e/today-interactions.spec.ts tests/e2e/review-interactions.spec.ts tests/e2e/coach-interactions.spec.ts tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：7 项通过；覆盖 Voice 与 Coach/Review 并发交互时的 focused review 队列隔离。
- Phase E Coach Generated Review Link Source Isolation：
  - `npm test -- tests/unit/coach-workspace.test.ts`：RED 后 GREEN，15 项通过；覆盖 Voice-linked Coach review 已生成卡片后的静态复习链接继续进入 `/review?source=voice-note`。
  - `npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome"`：2 项通过，确认 Voice → Coach → Review 真实浏览器路径未回退。
- Phase E Voice Header Badge Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，13 项通过；覆盖 `/voice` 页头 badge 显示 `语音捕获`，并防止 `badge="Voice"` 回退。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：58 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
  - `rg -n 'Voice Header Badge|badge="语音捕获"|badge="Voice"|0\\.250\\.0|语音捕获页头' ...`：覆盖扫描确认 `/voice` 源码、测试、UI checklist、CHANGELOG、Voice 模块文档和 Aegis 记录均接入；`src/app/voice/page.tsx` 中 `badge="Voice"` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`：本地门禁通过；全量单测 361 项通过，Next 构建生成 28 个页面且路由表包含 `/voice`。
  - Aegis helper：`bundle` / `check` 仍失败于历史 Markdown-only 结构债，缺 `task-intent-draft.json` 且多个 work markdown 未索引；该结果不是 Voice 产品 UI 验证失败。
- Phase E Voice Transcription Result Detail Label Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，12 项通过；覆盖 Voice 捕获结果详情隐藏 `provider:`、`model:`、`reason:` 技术标签，改为 `转写方式` 和 `提示`。
- Phase E Voice Transcription Result Status Label Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，11 项通过；覆盖 Voice 捕获结果 badge 通过中文 helper 展示 `转写成功` / `需手动整理`，不再直接渲染 raw `success` / `manual_required`。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：56 项通过，覆盖 Voice 页面、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
- Phase E Voice Mode Fallback Label Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，10 项通过；覆盖当前 Voice Note 和最近 Voice Notes 的未知/历史 mode 兜底为 `语音反思`，不再直接渲染 raw mode。
- Phase 6.3 Voice Reflection Templates：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，7 项通过；覆盖六个模板入口都显示 guidance 指定的同一组 60 秒四句提示。
- Phase 6.1/6.2 Voice Vocabulary Cleanup：
  - `npm test -- tests/unit/voice-transcription.test.ts`：RED 后 GREEN，5 项通过；覆盖完整术语 prompt 和 `cot`、`chain of thought`、`swe bench/swebench`、`rag`、`lora`、`mmlu`、`gpqa`、`BM25`、`Reranker`、`Embedding`、`Vector Database` cleanup。
- Phase 6.4 Voice Coach Handoff：
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/coach-workspace.test.ts`：RED 后 GREEN，14 项通过。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/coach-workspace.test.ts tests/unit/coach-submit.test.ts tests/unit/learning-ui-components.test.ts`：47 项通过。
  - `E2E_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/voice-interactions.spec.ts --project="Desktop Chrome" -g "voice flow sends transcript to coach"`：RED 后 GREEN，覆盖 Voice Note 保存、送 Coach 后进入 `/coach?reviewId=...`、Coach 来源面板、Coach 生成卡片后进入 `/review?source=thought-review`。
  - `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/coach` 和 `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice`：均返回 HTTP 200。
  - `npm run build`、a11y 28 项、mobile matrix 84 项通过。
- Phase 3.4 Mobile Voice：
  - `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts`：RED 后 GREEN，11 项通过。
  - `npm test -- tests/unit/learning-ui-components.test.ts`：RED 后 GREEN，15 项通过。
  - `npm test -- tests/unit/voice-capture-status.test.ts tests/unit/voice-note.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/voice-pipeline-next-action.test.ts tests/unit/learning-ui-components.test.ts`：38 项通过。
  - `curl -H "Cookie: ral_demo=1" http://127.0.0.1:3000/voice`：HTTP 200，页面包含 `一键录音`、`停止并转写`、`停止后自动转写并填入转写文本` 和手机端流水线大按钮 class。
  - `npm run lint`、`npm test` 266 项、`npm run build`、a11y 28 项、mobile matrix 84 项通过。
- Phase E Voice Pipeline Current Action CTA Mobile Touch Targets：
  - `npm test -- tests/unit/learning-ui-components.test.ts`：RED 后 GREEN，23 项通过；覆盖 `当前最优动作` 区从手机端横向布局改为 `grid gap-3`，以及 `复习这 3 张语音卡片` 复用 `min-h-11 w-full sm:w-auto`。
  - `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：43 项通过。
- Phase E Voice Page CTA Mobile Touch Targets：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，9 项通过；覆盖 `/voice` 页面级 `打开 Coach` 和右侧学习链路 `去复习` 复用 `voicePageCtaClassName = "min-h-11 w-full sm:w-auto"`。
- Phase E Voice Capture Manual Transcribe Mobile Touch Targets：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，9 项通过；覆盖上传音频 input 的 `min-h-11` 和手动 `自动转写到转写文本` action 行手机端单列布局。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：52 项通过，覆盖 Voice 表单、录音状态、转写服务、Coach handoff 和共享学习 UI 回归。
- Phase E Voice Mode Select Mobile Touch Target：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，13 项通过；覆盖 `语音笔记模式` select 接入 `min-h-11`，并防止旧 `h-9` 小触控目标回退。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcript-autofill.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/learning-ui-components.test.ts`：67 项通过，覆盖 Voice 表单、录音状态、转写自动填入、转写服务、Coach handoff 和共享学习 UI 回归。
- Phase 10 Voice Form A11y Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，7 项通过；覆盖 `语音笔记模式` 和 `语音转写文本` 可访问名称。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：45 项通过。
  - `git diff --check`、`npm run lint`、`npm run build`：通过，生产构建生成 28 个静态页面。
- Phase 10 Voice Recording Timer Label Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，7 项通过；覆盖 `recording` 反向断言和 `录音计时` 可见标签。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：45 项通过。
  - `git diff --check`、`npm run lint`、`npm run build`：通过，生产构建生成 28 个静态页面。
- Phase 10 Voice Pipeline Step Title Localization：
  - `npm test -- tests/unit/learning-ui-components.test.ts`：RED 后 GREEN，19 项通过；覆盖 `Coach`、`Note`、`Cards` 反向断言和中文步骤标题。
  - `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：38 项通过。
  - `git diff --check`、`npm run lint`、`npm run build`：通过，生产构建生成 28 个静态页面。
- Phase 10 Voice Card Count Localization：
  - `npm test -- tests/unit/learning-ui-components.test.ts`：RED 后 GREEN，19 项通过；覆盖 `3 cards` 反向断言和 `3 张卡片` 完成态状态。
  - `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/coach-workspace.test.ts`：38 项通过。
- Phase 10 Voice Visible Label Localization：
  - `npm test -- tests/unit/voice-note.test.ts`：RED 后 GREEN，8 项通过；覆盖当前 Voice Note 状态区的 `已连接 Coach`、`已保存笔记`、`转写文本`，以及 Voice 输入表单转写区域标题 `转写文本`。
  - `npm test -- tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts tests/unit/voice-transcription.test.ts tests/unit/coach-workspace.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/learning-ui-components.test.ts`：47 项通过。
  - `rg -n "Coach linked|Note saved|>Transcript<|text-sm font-medium\\\">Transcript|已连接 Coach|已保存笔记|转写文本" src/app/voice tests/unit/voice-note.test.ts`：确认生产代码的独立可见标签使用中文文案，旧英文仅保留在测试反向断言中。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-note.test.ts tests/unit/voice-capture-status.test.ts`：13 项通过。
- `buildVoiceTranscriptionPrompt()` 覆盖 AI 缩写保护规则。
- `normalizeVoiceTranscript()` 覆盖常见 AI 术语误识别清洗。
- `VoiceWorkspaceForm` 覆盖 60 秒反思按钮和四句模板文案。
- `npm test -- tests/unit/voice-transcription.test.ts tests/unit/voice-submit.test.ts tests/unit/voice-note.test.ts`：10 项通过。
- `saveVoiceNoteAsNote()` 覆盖 VoiceNote → Note 创建、重复保存不重复创建、跨用户拒绝。
- `sendVoiceNoteToCoach()` 覆盖 VoiceNote → ThoughtReview 创建、重复发送不重复创建、跨用户拒绝。
- `generateVoiceNoteFlashcards()` 覆盖 VoiceNote → Flashcards 创建、重复生成不重复创建、没有 ThoughtReview 拒绝、跨用户拒绝。
- Sprint 57 后，`saveVoiceNote()` 覆盖显式跨用户 lesson 拒绝。
- `npm test`：106 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验收

- 2026-06-02：
  - 真实承载机 `118.25.15.72` 上相关语音测试 13 项通过，生产构建通过。
  - `https://learn.roky.chat/voice` 在密码登录后可见“开始 60 秒反思”按钮。
  - Playwright：点击“开始 60 秒反思”后，Transcript 成功插入四句模板。
- Sprint 33：
  - 主生产机 `118.89.119.107` 仍不可观测，SSH banner exchange timeout，真实 HTTPS health 超时。
  - 备用机 `118.25.15.72` 已部署 `/home/ubuntu/ai-learning-platform`。
  - 备用机使用 `node:22-bookworm` 容器运行应用，监听 `127.0.0.1:3102`。
  - 备用机远端目标测试 12 项通过，生产构建通过。
  - 备用机 Nginx 已添加 `learn.roky.chat` HTTP server block，Host-header health 返回 `ok`。
  - 真实域名仍需 DNS A 记录切到 `118.25.15.72` 后补 HTTPS。
- Sprint 17：
  - 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
  - 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint17-20260524-074933.tar.gz`。
  - 生产：`npm ci`、`npx prisma generate`、Voice 目标测试、`npm run build` 均通过。
  - 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
  - 线上：`/voice` 可见 `临时发送到服务端转写`、`如果服务端没有转写密钥`、`保存 Voice Note`、`发送到 Coach`、`生成 Flashcards`。
  - 生产当前未配置 `OPENAI_API_KEY`，自动转写会安全回退到手动 transcript。
- `/voice?voiceNoteId=cmpip5mt60001wg0znw0ti34v` 曾显示 `Coach linked`、`Note saved`、`已生成卡片：1`；本地 Phase 10 已将可见状态文案改为 `已连接 Coach`、`已保存笔记`、`N 张卡片`，生产需等下次部署后复验。
- `/coach?reviewId=cmpipaoov0003wg0z44txgyvo` 显示语音评审和已生成卡片。
- `/notes` 显示语音笔记 Markdown，包含 `thoughtReviewId`。
- `/review` 显示到期队列，包含 Voice Note 生成后的复习卡片。
