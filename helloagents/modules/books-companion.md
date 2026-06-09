# Book Companion

## 状态

已完成 MVP，本阶段为读侧静态伴学和主线接入，不做真实 PDF 上传持久化、OCR Provider Adapter 或服务端文档解析。

## 用户流程

1. 打开 `/books`，页头显示 `同读书籍`，不是 `PDF 管理`。
2. 查看最近阅读，默认活跃书籍为 `AI Engineering`，当前阅读第 `12-14` 页，进度 `36%`。
3. 点击 `继续阅读` 进入 `/books/ai-engineering`。
4. 阅读页显示 `PDF Viewer`、当前页文本提取、文本选择和 `AI 伴读` 面板。
5. AI 伴读提供 `解释选区`、`总结当前页`、`保存为 Note`、`生成 Flashcards`、`送 Coach`。
6. 移动端阅读页将 AI 伴读放入底部 Sheet，入口按钮满足 44px 触控高度。
7. `/books` 进入全局导航的 `补弱与表达` 分组，并出现在移动端 `更多` Sheet。
8. active book session 接入 Current Mission；主课、复习、误区、代码反馈、笔记、语音复盘和项目任务都清空后，当前任务推荐继续读书。

## 数据与边界

- 静态种子位于 `src/server/books/base.ts`。
- `getBookShelf()` 返回当前书架。
- `getBookById()` 返回单本书详情。
- `getActiveBookSession()` 返回当前活跃阅读任务。
- 本阶段不新增 Prisma schema、不新增数据库迁移、不上传 PDF 到服务器。
- `上传 PDF` 区域为禁用态，明确提示当前上线版本不会上传本地 PDF。
- 不在前端或文档中暴露 API key、服务端密钥或生产 `.env`。

## 学习资产连接

每本书都显式连接：

- Book selection → Coach
- Book answer → Note
- Book concept → Flashcard
- Book confusion → Mistake
- Book chapter → Weekly
- Book exercise → Project
- Book term → Glossary
- Book author/paper → Radar
- Book progress → Current Mission
- Book stage → Path

## 代码位置

- 数据：`src/server/books/base.ts`
- 书架页：`src/app/books/page.tsx`
- 阅读页：`src/app/books/[id]/page.tsx`
- 任务引擎：`src/server/learning/next-best-action.ts`
- Current Mission 接线：`src/server/learning/current-mission.ts`
- 导航：`src/lib/routes.ts`、`src/components/mobile/mobile-bottom-nav.tsx`
- 鉴权：`src/server/auth/policy.ts`
- 审计：`scripts/audit-routes.ts`、`scripts/audit-learning-system.ts`

## 验收

- RED：`npm test tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/shared-ui-a11y.test.ts` 首次失败于缺少 Books seed、`/books` 页面、Current Mission active reading 和导航入口。
- GREEN：`npm test tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/shared-ui-a11y.test.ts` 16 项通过。
- 相关回归：`npm test tests/unit/books-companion.test.ts tests/unit/current-mission.test.ts tests/unit/next-best-action.test.ts tests/unit/shared-ui-a11y.test.ts tests/unit/auth-policy.test.ts`。
- 项目门禁：`npm run lint`、`npm test`、`npm run build`、`npm run audit:routes`、`npm run audit:learning`。
- 2026-06-10 本地最终门禁通过：`git diff --check`、`npm run lint`、`npm run audit:routes`、`npm run audit:learning`、全量 `npm test` 458 项、`npm run build`。
- 2026-06-10 生产上线：`learn.roky.chat` 当前 HTTPS 网关为 `198.10.0.92`，实际应用机为 `118.25.15.72`；已备份 `/home/ubuntu/ai-learning-platform` 到 `/home/ubuntu/deploy-backups/ai-learning-platform-before-0.352.0-20260610-005347.tar.gz`，rsync 同步后容器内定向测试 35 项和 `npm run build` 通过，随后重启 `ai-learning-platform` 容器。
- 2026-06-10 生产 smoke：`https://learn.roky.chat/api/health` 返回 200；密码登录后访问 `/books` 可见 `同读书籍`、`AI Engineering`、`继续阅读`，访问 `/books/ai-engineering` 可见 `PDF Viewer`、`AI 伴读`、`解释选区`、`保存为 Note`。
