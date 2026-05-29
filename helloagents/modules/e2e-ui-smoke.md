# E2E / UI Smoke

## 当前状态

项目已接入 Playwright 浏览器级 smoke tests，作为长期 UI 回归保险。测试不进入生产构建门禁，但可在发版前手动执行。

## 命令

```bash
npm run e2e
```

默认行为：

- 未设置 `E2E_BASE_URL` 时，会启动本地 `npm run dev -- --hostname 127.0.0.1 --port 3000`。
- 设置 `E2E_BASE_URL` 时，会直接测试外部站点。
- 设置 `E2E_PREVIEW_TOKEN` 时，会通过 `/preview?token=...` 进入只读 Preview Mode。
- 未设置 `E2E_PREVIEW_TOKEN` 时，会走本地 Demo 登录入口。

## 覆盖范围

- 登录页或 Preview 入口能进入学习应用。
- 首页能显示 `Roky Learn` 与 `现在最值得做`。
- `/today` 能显示专注学习模式和今日概览。
- `/coach` 能显示思路评审工作台。
- `/voice` 能显示语音学习捕获和说出理解入口。
- `/review` 主动回忆流程会先隐藏答案，点击显示后才出现评分按钮。

## 约束

- 不在测试代码或配置中写入 Preview token、API key、Admin secret。
- 生产 smoke 应只使用 Preview Mode，避免触发写操作。
- `test-results/` 和 `playwright-report/` 是运行产物，保持 git ignored。
