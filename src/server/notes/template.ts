type LessonNoteTemplateInput = {
  lessonTitle: string | null;
  localDate: string;
  planStatus: string | null;
  objectives: string[];
  keyTerms: string[];
  quizCount: number;
  codeSubmissionCount: number;
  hasExistingNote: boolean;
};

function bulletList(items: string[], fallback: string) {
  if (!items.length) return `- ${fallback}`;
  return items.slice(0, 5).map((item) => `- ${item}`).join("\n");
}

/**
 * Builds the editable Markdown scaffold used by the notes page.
 *
 * Args:
 *   input: Lesson context and current learning signals for the selected note.
 *
 * Returns:
 *   A Markdown note template ready to edit in the notes textarea.
 */
export function buildLessonNoteTemplate(input: LessonNoteTemplateInput) {
  const title = input.lessonTitle ? `${input.lessonTitle} - 学习笔记` : "今日总结";
  const lessonLine = input.lessonTitle ?? "暂无关联课程";
  const statusLine = input.planStatus ?? "未关联计划";

  return [
    `# ${title}`,
    "",
    `- 日期：${input.localDate}`,
    `- 关联课程：${lessonLine}`,
    `- 课程状态：${statusLine}`,
    `- 已有笔记：${input.hasExistingNote ? "是" : "否"}`,
    `- 测验：${input.quizCount} 题`,
    `- 代码提交：${input.codeSubmissionCount} 次`,
    "",
    "## 今天我能用自己的话解释",
    "- ",
    "",
    "## 本课目标",
    bulletList(input.objectives, "写下今天最重要的学习目标。"),
    "",
    "## 核心术语",
    bulletList(input.keyTerms, "记录今天最容易忘的术语或概念。"),
    "",
    "## 我还模糊的地方",
    "- ",
    "",
    "## 代码 / 测验反馈",
    "- ",
    "",
    "## 今天最值得保留的一句话",
    "- ",
    "",
    "## 明天需要复习",
    "- ",
  ].join("\n");
}
