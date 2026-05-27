import type { ReviewSource } from "@/server/review/filter";

export function buildReviewEmptyState(args: {
  source?: ReviewSource | null;
  projectId?: string | null;
}) {
  if (args.source === "project") {
    return {
      title: "当前项目暂无到期卡片",
      description: "可以回到项目继续推进里程碑，或查看全部复习队列。",
      actions: [
        {
          label: "回到项目",
          href: args.projectId
            ? `/projects?projectId=${encodeURIComponent(args.projectId)}`
            : "/projects",
        },
        { label: "查看项目", href: "/projects" },
        { label: "全部复习", href: "/review" },
      ],
    };
  }

  if (args.source === "code-feedback") {
    return {
      title: "当前代码反馈暂无到期卡片",
      description: "可以回到项目继续提交代码，或查看全部复习队列。",
      actions: [
        {
          label: "回到项目",
          href: args.projectId
            ? `/projects?projectId=${encodeURIComponent(args.projectId)}`
            : "/projects",
        },
        { label: "全部复习", href: "/review" },
        { label: "查看进度", href: "/progress" },
      ],
    };
  }

  return {
    title: "暂无到期卡片",
    description: "当前复习队列已清空，可以继续今日学习或回到课程库补充笔记。",
    actions: [
      { label: "去今日学习", href: "/today" },
      { label: "查看课程库", href: "/library" },
      { label: "查看进度", href: "/progress" },
    ],
  };
}
