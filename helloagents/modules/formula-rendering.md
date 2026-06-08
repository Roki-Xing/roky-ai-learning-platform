# Formula Rendering

## 状态

已接入 `LearningMarkdown`、课程 callout、代码块复制和每日课程 AI 生成提示。

## 当前行为

- `LearningMarkdown` 现在支持 GitHub 风格 Markdown + LaTeX 公式
- 行内公式使用 `$...$`
- 块级公式使用 `$$...$$`
- blockquote 前缀 `核心直觉`、`常见误区`、`重点/要点/关键点`、`例子卡/例子/示例`、`代码/伪代码/代码草图`、`图示/概念图/视觉化`、`互动实验/小实验/动手试试`、`自测卡/自测` 会渲染成课程提示块
- fenced code block 会显示 `复制代码` 入口
- 仍保持 `skipHtml`，不允许原始 HTML 直接注入

## 代码位置

- 渲染组件：`src/components/learning/learning-markdown.tsx`
- 代码块组件：`src/components/learning/learning-code-block.tsx`
- 全局样式：`src/app/globals.css`
- KaTeX 样式引入：`src/app/layout.tsx`
- 生成提示：`src/server/ai/generate-daily-plan.ts`

## 设计目的

解决课程正文里矩阵、概率、softmax、loss 函数等公式只能以纯文本显示的问题，让 `/today`、知识点正文和后续 AI 生成内容都能直接以可读公式呈现。

## 生成约束

- 课程正文与 `guidedSteps` 中一旦需要公式，统一使用 markdown math syntax
- 行内公式：`$a^T b$`
- 块级公式：

```tex
$$
\operatorname{softmax}(x_i)=\frac{e^{x_i}}{\sum_j e^{x_j}}
$$
```

- 禁止使用 HTML 公式片段，避免前端渲染协议分裂
- 课程正文应优先生成以下 blockquote 协议：

```markdown
> 核心直觉：...
> 常见误区：...
> 重点：...
> 例子卡：...
> 代码/伪代码：...
> 图示：...
> 互动实验：...
> 自测卡：...
```

## 验收

- `LearningMarkdown` SSR 输出中可见 `katex` 和 `katex-display`
- 表格、代码块和 `skipHtml` 行为保持不变
- 代码块可见 `复制代码`
- 课程 blockquote 可见 typed callout，包括 `data-learning-callout="key_point"`、`data-learning-callout="example"`、`data-learning-callout="code_sketch"`、`data-learning-callout="diagram"`、`data-learning-callout="experiment"` 和 `data-learning-callout="self_check"`
- `buildDailyPlanMessages()` 明确要求模型用 `$...$ / $$...$$` 生成公式，并生成课程 blockquote

## 验证

- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts`
- `npm test -- tests/unit/learning-ui-components.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/admin-prompt-studio.test.ts tests/unit/daily-generation-quality.test.ts tests/unit/today-activity-labels.test.ts tests/unit/today-code-exercise.test.ts`
- `npm run lint`
- `npm run build`
