export type LibraryLessonNextActionTone = "primary" | "secondary" | "warning" | "neutral";

export type LibraryLessonNextAction = {
  label: string;
  href: string;
  description: string;
  tone: LibraryLessonNextActionTone;
};

export type LibraryLessonNextActions = {
  title: string;
  summary: string;
  actions: LibraryLessonNextAction[];
};

export type LibraryLessonNextActionsInput = {
  lessonId: string;
  planStatus: string | null;
  flashcardCount: number;
  dueFlashcardCount: number;
  noteCount: number;
  thoughtReviewCount: number;
  codeSubmissionCount: number;
};

function limited(actions: LibraryLessonNextAction[]) {
  return actions.slice(0, 3);
}

/**
 * Builds concrete follow-up actions for the selected library lesson.
 *
 * Args:
 *   input: Lesson archive counts already scoped to the current user.
 *
 * Returns:
 *   A title, summary, and up to three action links for the lesson detail panel.
 */
export function buildLibraryLessonNextActions(
  input: LibraryLessonNextActionsInput,
): LibraryLessonNextActions {
  if (input.planStatus !== "completed") {
    return {
      title: "课程下一步",
      summary: "先把课程完成，再进入复习、笔记和 Coach 检查。课程库现在只保留这节课的学习档案。",
      actions: [
        {
          label: "回到今日学习",
          href: "/today",
          description: "继续主课、引导步骤、小测验和代码练习。",
          tone: "primary",
        },
      ],
    };
  }

  const actions: LibraryLessonNextAction[] = [];

  if (input.dueFlashcardCount > 0) {
    actions.push({
      label: "复习到期卡片",
      href: "/review",
      description: `${input.dueFlashcardCount} 张卡片已经到期，先做主动回忆。`,
      tone: "warning",
    });
  }

  if (input.noteCount === 0) {
    actions.push({
      label: "写课程笔记",
      href: `/notes?lessonId=${encodeURIComponent(input.lessonId)}`,
      description: "把这节课用自己的话压缩成一段可复用的理解。",
      tone: "primary",
    });
  }

  if (input.thoughtReviewCount === 0) {
    actions.push({
      label: "让 Coach 检查",
      href: "/coach",
      description: "提交你的理解，让 Coach 找出概念混淆和缺口。",
      tone: "secondary",
    });
  }

  if (input.codeSubmissionCount === 0) {
    actions.push({
      label: "补代码练习",
      href: "/today",
      description: "保存一次代码实现，让课程档案包含动手记录。",
      tone: "secondary",
    });
  }

  if (input.flashcardCount === 0) {
    actions.push({
      label: "补复习卡片",
      href: "/today",
      description: "这节课还没有卡片，回到今日学习补齐复习入口。",
      tone: "secondary",
    });
  }

  if (actions.length === 0) {
    return {
      title: "课程下一步",
      summary: "这节课已经有笔记、Coach 和代码记录，当前没有到期卡片。适合回到进度页看整体覆盖和补弱方向。",
      actions: [
        {
          label: "看进度",
          href: "/progress",
          description: "查看连续学习、薄弱领域和下一轮复习压力。",
          tone: "neutral",
        },
      ],
    };
  }

  const summaryParts: string[] = [];
  if (input.dueFlashcardCount > 0) summaryParts.push(`${input.dueFlashcardCount} 张到期卡片`);
  if (input.noteCount === 0) summaryParts.push("还没有课程笔记");
  if (input.thoughtReviewCount === 0) summaryParts.push("还没有 Coach 思路评审");
  if (input.codeSubmissionCount === 0) summaryParts.push("还没有代码提交");
  if (input.flashcardCount === 0) summaryParts.push("还没有复习卡片");

  return {
    title: "课程下一步",
    summary: `这节课已完成，但还可以补齐：${summaryParts.join("、")}。`,
    actions: limited(actions),
  };
}
