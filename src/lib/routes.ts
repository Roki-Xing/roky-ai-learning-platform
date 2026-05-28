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
      { href: "/today", label: "今日学习" },
      { href: "/review", label: "复习中心" },
      { href: "/progress", label: "学习进度" },
    ],
  },
  {
    label: "能力",
    routes: [
      { href: "/coach", label: "思路评审" },
      { href: "/voice", label: "语音笔记" },
      { href: "/projects", label: "项目实践" },
    ],
  },
  {
    label: "知识库",
    routes: [
      { href: "/map", label: "知识地图" },
      { href: "/library", label: "课程库" },
      { href: "/notes", label: "我的笔记" },
      { href: "/glossary", label: "术语库" },
      { href: "/radar", label: "AI Radar" },
    ],
  },
  {
    label: "系统",
    routes: [{ href: "/settings", label: "设置" }],
  },
];

// Backward compatible: some pages still use a flat route list.
export const APP_ROUTES: AppRoute[] = APP_ROUTE_GROUPS.flatMap((g) => g.routes);
