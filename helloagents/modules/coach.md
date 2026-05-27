# Thought Review Coach

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/coach`。
2. 选择模式：
   - `today_lesson`
   - `concept_question`
   - `code_reasoning`
   - `algorithm_design`
   - `glossary_term`
   - `industry_radar`
   - `free_thought`
3. 输入自己的理解、困惑、代码思路或行业问题。
4. 服务端构造学习上下文并生成结构化 ThoughtReview。
5. 页面展示：
   - 整理后的观点
   - main claim
   - 正确部分
   - 可能问题
   - 缺失概念
   - Socratic questions
   - 下一步建议
   - 可生成的复习卡片
6. 用户可把评审卡片写入 Flashcard，进入 `/review`。
7. `/library` 按课程展示关联 Coach 评审，`/progress` 展示最近思路评审。
8. 如果关联课程的评审出现 high severity `possibleIssues`，服务端会自动沉淀为 `Misconception(source="coach")`，供 `/progress`、`/map` 和后续生成上下文使用。

## 数据模型

- `ThoughtReview`
  - `userId`
  - `lessonId`
  - `mode`
  - `rawText`
  - `normalizedText`
  - `mainClaim`
  - `reviewJson`
  - `generatedCards`
- `Flashcard`
  - ID 使用 `thought:{reviewId}:{index}`
  - tags 包含 `coach`、`thought-review` 和相关术语
- `Misconception`
  - source 使用 `coach`
  - sourceKey 使用 `coach:{reviewId}:{issueIndex}`
  - 仅在 ThoughtReview 关联课程时创建
  - 记录 lesson/topic/localDate，并保持 `status="open"`

## 服务层

- `src/server/coach/context.ts`
  - 汇总 `UserProfile`
  - 当前/最近课程
  - due flashcards
  - recent quiz attempts
  - recent code submissions
  - recent code feedback
  - open misconceptions
  - lesson glossary/breadth
  - standalone glossary review cards
- `src/server/coach/submit.ts`
  - `normalizeCoachMode()`
  - `createThoughtReview()`
  - `generateFlashcardsForThoughtReview()`
  - high severity `possibleIssues` 自动沉淀为 Coach source misconception，并更新 `UserTopicState`

## 重要约束

- Server Action 必须通过 `requireUserId()` 获取当前用户。
- Coach 只评审文本，不执行用户代码。
- DeepSeek key 只在服务端读取；测试环境或无 key 时使用模板 fallback。
- 课程关联必须通过当前用户正式 DailyPlan 校验。
- 显式传入 `lessonId` 时，必须属于当前用户正式、未归档、非测试 DailyPlan；不可见 lesson 直接拒绝。
- 生成卡片使用 stable id + upsert，重复点击不会重复创建卡片。
- 误区沉淀使用 stable sourceKey + upsert，重复处理同一 review issue 不会重复创建 misconception。
- 无 `lessonId` 的自由想法不创建 misconception，因为当前 `Misconception.lessonId` 为必填字段。
- `/voice` 入口复用同一 Coach 服务层，避免行为分叉。

## 本地验收

- `npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts`：9 项通过。
- Sprint 58 后，`tests/unit/coach-submit.test.ts` 覆盖显式跨用户 lesson 拒绝。
- `npm test`：65 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

### Sprint 22 增量验收

- `npm test -- tests/unit/coach-submit.test.ts`：3 项通过。
- `npm test -- tests/unit/coach-submit.test.ts tests/unit/coach-context.test.ts tests/unit/progress-analytics.test.ts tests/unit/map-analytics.test.ts`：13 项通过。
- `npm test`：82 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。
- 生产：目标测试、build、service health、`/coach`、`/progress`、`/map` Host-header 验收通过。

## 生产验收

- 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint16-20260524-073404.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、Coach 目标测试、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 线上：`/coach` 可见 `提交思路`、`Coach 反馈`、`生成复习卡片`、`最近评审`。
- 线上：`/voice` 可见 `发送到 Coach`、`生成 Flashcards`、`查看 Coach`。
- 线上：`/library` 可见 `Coach 思路评审`。
- 线上：`/progress` 可见 `最近思路评审`。
- 生产只读计数：`ThoughtReview=4`、`ThoughtReviewCards=3`、`VoiceNotesLinkedToCoach=1`。
