# Code Feedback

## 状态

已上线并完成生产验收。

## 用户流程

1. 打开 `/today` 的代码练习。
2. 在代码输入框中提交实现。
3. 服务端只保存和审查文本，不执行代码。
4. 系统生成结构化代码反馈：
   - `overall`
   - `strengths`
   - `issues`
   - `hints`
   - `suggestedTests`
   - `flashcards`
   - `nextSteps`
5. 严重实现问题会沉淀为 code-source `Misconception`。
6. 反馈里的卡片会写入 `Flashcard(type="code_bug")`，进入复习系统。
7. `/library` 可查看课程关联的代码提交与反馈摘要。
8. `/progress` 可查看最近代码反馈。

## 数据模型

- `CodeSubmission`
  - `userId`
  - `lessonId`
  - `localDate`
  - `language`
  - `code`
  - `status`
  - `aiFeedback`
  - `feedbackJson`
- `CodeFeedback`
  - `submissionId`
  - `userId`
  - `lessonId`
  - `localDate`
  - `provider`
  - `status`
  - `overall`
  - `summary`
  - `strengths`
  - `issues`
  - `hints`
  - `suggestedTests`
  - `flashcards`
  - `nextSteps`
  - `feedbackJson`
- `Misconception`
  - `source = "code"`
  - `sourceKey = code:{userId}:{submissionId}`
  - `codeSubmissionId`

## 重要约束

- 不在服务端执行用户代码。
- DeepSeek 只做文本审查；无 key 或测试环境使用模板 fallback。
- 代码反馈 owner 是 `CodeFeedback`，`CodeSubmission.aiFeedback/feedbackJson/status` 只保存摘要和当前状态。
- 复习卡 ID 使用 `code-feedback:{submissionId}:{index}`，重复保存同一提交会 upsert 同一组卡。
- Server Action 仍通过 `requireUserId()` 获取当前用户，并验证 lesson 属于当前用户正式 DailyPlan。

## 本地验收

- `npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts`：3 项通过。
- `npm test`：62 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 生产验收

- 已同步到 `118.89.119.107:/home/ubuntu/ai-learning-platform`。
- 生产备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint15-20260524-071231.tar.gz`。
- 生产：`npm ci`、`npx prisma generate`、`npm run db:migrate:manual:code-feedback-structured`、`npm test -- tests/unit/code-feedback.test.ts tests/unit/code-submit.test.ts`、`npm run build` 均通过。
- 生产：`ai-learning-platform.service` 为 `active`，内网 `/api/health` 返回 `ok`。
- 线上：`/today` 可见 `仅保存，不执行`、`保存提交`、`代码反馈`、`overall`。
- 线上：`/library` 可见 `代码提交与反馈`。
- 线上：`/progress` 可见 `最近代码反馈` 与 `代码提交率`。
- 生产数据库结构检查确认新增结构化反馈字段存在。
- 生产数据计数：`CodeFeedback=2`、`CodeFeedbackWithOverall=1`、`CodeMisconception=1`、`CodeBugCards=1`。
