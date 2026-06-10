export type AppRoute = {
  href: string;
  label: string;
};

export type AppRouteGroup = {
  label: string;
  routes: AppRoute[];
};

export const APP_ROUTE_GROUPS: AppRouteGroup[] = [
  {
    label: "今日",
    routes: [
      { href: "/", label: "首页" },
      { href: "/today", label: "今日任务" },
      { href: "/review", label: "复习中心" },
      { href: "/path", label: "当前路径" },
      { href: "/weekly", label: "每周复盘" },
    ],
  },
  {
    label: "学习动作",
    routes: [
      { href: "/coach", label: "思路评审" },
      { href: "/voice", label: "说出理解" },
      { href: "/mistakes", label: "错题误区" },
      { href: "/projects", label: "项目任务" },
      { href: "/books", label: "同读书籍" },
    ],
  },
  {
    label: "知识资产",
    routes: [
      { href: "/map", label: "知识地图" },
      { href: "/library", label: "课程库" },
      { href: "/notes", label: "我的笔记" },
      { href: "/glossary", label: "术语路径" },
      { href: "/radar", label: "AI Radar" },
      { href: "/progress", label: "学习进度" },
    ],
  },
  {
    label: "系统",
    routes: [{ href: "/settings", label: "设置" }],
  },
];

// Backward compatible: some pages still use a flat route list.
export const APP_ROUTES: AppRoute[] = APP_ROUTE_GROUPS.flatMap((g) => g.routes);
