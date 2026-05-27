# Sprint 16 Evidence

## 本地验证

- RED：`npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts` 初次失败于缺少 `@/server/coach/submit`。
- RED：同一轮测试显示 `buildCoachContext()` 缺少 `recentCodeFeedback`、`recentKnowledge`、`standaloneReviewCards`。
- `npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts`：9 项通过。
- `npm test`：65 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。

## 文档结构提示

- `python3 .../aegis-workspace.py check --root .../ai-learning-platform` 失败于历史 `docs/aegis/work/*` markdown 未索引。
- 该失败属于既有文档索引结构问题；本次 Sprint 16 仍按既有目录格式补齐 `10-intent.md`、`20-checkpoint.md`、`90-evidence.md`。

## 生产验证

- 备份：`/home/ubuntu/deploy-backups/ai-learning-platform-before-sprint16-20260524-073404.tar.gz`。
- 同步目标：`118.89.119.107:/home/ubuntu/ai-learning-platform`。
- `npm ci`：完成；`npm audit` 仍报 2 个 moderate 依赖告警，未阻塞本次上线。
- `npx prisma generate`：通过。
- `npm test -- tests/unit/coach-context.test.ts tests/unit/coach-submit.test.ts tests/unit/thought-review.test.ts tests/unit/voice-note.test.ts`：9 项通过。
- `npm run build`：通过。
- `sudo systemctl is-active ai-learning-platform.service`：`active`。
- `curl -fsS http://127.0.0.1:3102/api/health`：返回 `{"ok":true,"service":"ai-learning-platform",...}`。
- Host-header `/coach`：`提交思路`、`Coach 反馈`、`生成复习卡片`、`最近评审` 均 PASS。
- Host-header `/voice`：`发送到 Coach`、`生成 Flashcards`、`查看 Coach` 均 PASS。
- Host-header `/library`：`Coach 思路评审`、`代码提交与反馈` 均 PASS。
- Host-header `/progress`：`最近思路评审`、`思路评审` 均 PASS。
- 生产只读计数：`ThoughtReview=4`、`ThoughtReviewCards=3`、`VoiceNotesLinkedToCoach=1`。
