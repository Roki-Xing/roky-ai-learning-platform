# Preview Review

## 入口

- 生产：`https://learn.roky.chat/preview?token=...&next=/today`
- 本地：`http://localhost:3000/preview?token=...&next=/today`
- `token` 来自服务端 `PREVIEW_TOKEN`，禁止写入文档、提交记录或聊天输出。
- `next` 可以换成 `/`、`/review`、`/coach`、`/voice`、`/map`、`/projects`、`/path`、`/weekly`、`/mistakes`、`/progress`、`/settings`。

## 只读规则

Preview Mode 使用 demo-user 数据，但必须拒绝所有写操作：

- 生成今日内容。
- 提交 quiz、保存代码、完成今日学习。
- 保存 Note、Voice Note、Coach 评审或生成卡片。
- 创建/提交项目、完成里程碑。
- Settings 保存、Admin 操作。

页面顶部应显示 Preview Mode 提示，明确说明保存、生成、提交和管理操作都会被拒绝。

## 页面验收

- `/`：能看到 Current Mission、今日任务、XP、徽章、今日学习和项目入口。
- `/today`：能看到专注模式，完整视图默认折叠；Preview 下写按钮失败而不是伪成功。
- `/review`：能看到复习队列或空态；评分写操作必须被拒绝。
- `/coach`：能看到输入区和上下文；提交必须被拒绝。
- `/voice`：能看到录音/上传、transcript、60 秒反思模板；保存必须被拒绝。
- `/map`：能看到领域概览和弱点信号。
- `/glossary`、`/radar`：能看到路径化学习卡片、实体详情和制卡入口；制卡必须被拒绝。
- `/projects`：能看到当前项目任务或模板；创建、保存、评审和完成动作必须被拒绝。
- `/path`：能看到当前阶段、下一阶段和解锁条件。
- `/weekly`：能看到最近 7 天复盘、薄弱点和下周建议。
- `/mistakes`：能看到错题修复中心和筛选；标记 resolved 必须被拒绝。
- `/progress`：能看到学习动力、内容质量、趋势和知识覆盖。
- `/settings`：能看到版本信息；保存必须被拒绝。

## 退出 Preview

- 清除 Preview cookie 或重新登录真实用户。
- 切换回生产数据前，不要在 Preview token URL 中继续操作写入路径。

## 生产 smoke / visual

1. 确认 `/api/health` 返回 200。
2. 使用 Preview URL 进入 `/today`。
3. 运行只读 smoke：
   - `npm run e2e -- tests/e2e/smoke.spec.ts`
4. 运行 Preview 写保护：
   - `npm run e2e:preview-readonly`
5. 运行视觉回归：
   - `npm run e2e:visual`
6. 失败时先区分登录/Preview token 问题、页面渲染问题和写保护问题。

## 自动化覆盖

- `tests/e2e/preview-readonly.spec.ts` 只在设置 `E2E_PREVIEW_TOKEN` 时运行。
- 本地验证时，服务端 `PREVIEW_TOKEN` 必须与 `E2E_PREVIEW_TOKEN` 匹配。
- 当前自动化覆盖 `/settings` 保存、`/today` quiz、`/today` code 和 Preview 下 `/admin` 隐藏。
- 真实生产 token 不得写入测试文件、文档、提交信息或聊天输出。
