# Learning Path

## Owner

- UI: `/path`
- Server data builder: `src/server/learning/path.ts`

## Behavior

1. `/path` answers four route-level questions for the learner:
   - 我现在处于哪个阶段？
   - 下一个阶段是什么？
   - 为什么我今天学这个？
   - 完成这个阶段的标准是什么？
2. The page header badge uses the Chinese learner-facing label `学习路径`, not raw English `Path`.
3. The page reuses the existing mission system and shows `当前任务` at the top.
4. The roadmap is fixed to seven learner-facing stages:
   - Python 表达能力
   - 数据结构基础
   - 算法模式入门
   - LLM / RAG / Agent
   - AI 工程实践
   - 项目综合应用
   - 论文 / Benchmark / 行业广度
5. Stage progress is built from real data:
   - `DailyPlan` completed/planned lesson counts
   - official-lesson `Flashcard.reviewCount` and due counts
   - official-lesson `QuizAttempt` count, correct count, and quiz accuracy
   - `CodeSubmission` counts
   - open `Misconception` counts
   - `LearningProject` / `ProjectMilestone` progress
   - reviewed glossary/radar cards for the breadth stage
6. When today already has a selected domain, that domain’s stage becomes the current focus stage.
7. When today has no explicit stage signal, the page falls back to the first unfinished stage in the roadmap.
8. Each stage exposes:
   - `测验正确率`
   - `项目里程碑`
   - `解锁条件`
   - `下一步主题`
9. Route card stage badges use Chinese learner-facing labels such as `第 1 阶段`; the next-stage summary badge uses `下一阶段`.
10. `nextTopic` prefers today’s generated lesson when it belongs to the current stage; otherwise it points at the first unmet stage criterion.
11. Stage-card action CTAs use `pathStageCtaClassName` with `min-h-11 w-full sm:w-auto`, so each route step is a full-width 44px touch target on mobile and an adaptive-width link on desktop.

## Verification

- `npm test -- tests/unit/learning-path.test.ts`
- `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts`
- `npm run lint`
- `git diff --check`
- `npm run build`
- Browser check:
  - `/path` heading visible
  - page header badge visible as `学习路径`, not `Path`
  - top mission card title visible as `当前任务`, not `Current Mission / 当前任务`
  - current stage visible
  - next stage visible
  - route card badges visible as `第 n 阶段`, not `Stage n`
  - next-stage badge visible as `下一阶段`, not `Next Stage`
  - `测验正确率` visible
  - `项目里程碑` visible when project progress exists, not `milestone`
  - `解锁条件` visible
  - `下一步主题` visible
  - route card list visible

## Local Evidence

- Phase E Path Header Badge Localization:
  - `npm test -- tests/unit/learning-path.test.ts`: RED 后 GREEN，4 项通过；RED 首次确认 `/path` 页头仍为 `badge="Path"`，GREEN 后覆盖 `badge="学习路径"` 并反向断言旧英文 badge 不再出现。
  - `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`: 52 项通过；覆盖 Path、Weekly、Mistakes、Auth/Preview 和共享学习 UI 回归。
  - `rg -n 'Path Header Badge|badge="学习路径"|badge="Path"|0\\.247\\.0|学习路径页头' ...`: 覆盖扫描确认 Path 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入页头 badge 中文化要求；`src/app/path/page.tsx` 中 `badge="Path"` 无匹配。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`: 通过；全量单测 359 项通过，Next 构建生成 28 个静态页面并包含 `/path`。
  - `aegis-workspace.py bundle/check`: 仍为已知结构债；`bundle` 缺 `task-intent-draft.json`，`check` 报历史 `docs/aegis/work/.../*.md` 未索引，不属于产品 UI 验证失败。
- Phase E Current Mission Heading Localization:
  - `npm test -- tests/unit/current-mission.test.ts`: RED 后 GREEN，4 项通过；覆盖共享 Current Mission 默认标题和 `/today`、`/weekly`、`/path` 显式 title 接线都使用 `当前任务`。
  - `npm test -- tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/home-page-labels.test.ts tests/unit/learning-ui-components.test.ts tests/unit/weekly-review.test.ts tests/unit/learning-path.test.ts tests/unit/today-activity-labels.test.ts`: 51 项通过；覆盖 Path、Weekly、Today 和共享学习 UI 回归。
- Phase 10 Path Stage Label Localization:
  - `npm test -- tests/unit/learning-path.test.ts`: RED 后 GREEN，3 项通过；覆盖 `第 {index + 1} 阶段` 和 `下一阶段`，并反向断言 `Stage {index + 1}` / `Next Stage` 不再作为可见标签出现。
  - `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`: 43 项通过。
  - `rg -n "Next Stage|Stage \\{index \\+ 1\\}|第 \\{index \\+ 1\\} 阶段|>下一阶段<|学习路径|阶段进度" src/app/path/page.tsx tests/unit/learning-path.test.ts`: 确认生产代码使用中文阶段标签，旧英文仅保留在测试反向断言中。
  - `git diff --check`、`npm run lint`、`npm run build`: 通过；Next 生产构建生成 28 个静态页面并包含 `/path`。
- Phase E Path Stage CTA Mobile Touch Targets:
  - `npm test -- tests/unit/learning-path.test.ts`: RED 后 GREEN，4 项通过；覆盖路线图阶段卡 CTA 复用 `pathStageCtaClassName` 和 `min-h-11 w-full sm:w-auto`。
  - `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/mistakes-view.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts`: 49 项通过；覆盖 Path、Weekly、Mistakes、Auth/Preview 和共享学习 UI 回归。
  - `git diff --check`、`npm run lint`、`npm run build`: 通过；Next 生产构建生成 28 个静态页面并包含 `/path`。
- Phase E Path Project Milestone Label Localization:
  - `npm test -- tests/unit/learning-path.test.ts`: RED 后 GREEN，4 项通过；覆盖路线图当前信号中的 `项目里程碑：`，并反向断言 `milestone：` 不再作为可见标签出现。
  - `npm test -- tests/unit/learning-path.test.ts tests/unit/weekly-review.test.ts tests/unit/project-mission-workspace.test.ts tests/unit/learning-ui-components.test.ts`: 48 项通过；覆盖 Path、Weekly、Projects 和共享学习 UI 回归。
  - `rg -n "Phase E Path Project Milestone|项目里程碑|milestone：|Path Project Milestone|0\\.231\\.0|Verified|Resume State Hint|Drift Check|Confidence" ...`: 覆盖扫描确认 Path 源码、测试、UI checklist、模块文档、CHANGELOG 和 Aegis 记录均接入项目里程碑本地化要求；旧 `milestone：` 只保留在测试反向断言和历史记录文本中。
  - `git diff --check`、`npm run lint`、`npm test`、`npm run build`: 通过；全量单测 351 项通过，Next 生产构建生成 28 个页面并包含 `/path`。
