# Settings

## Owner

- UI: `/settings`
- Server action: `src/app/settings/actions.ts`
- Profile service: `src/server/profile/settings.ts`

## Behavior

1. `/settings` 保存学习偏好到当前用户的 `UserProfile`。
2. 保存成功后，`updateSettingsAction()` 重定向到 `/settings?saved=1`。
3. `/settings` 使用 Next.js 16 Promise `searchParams` 读取 `saved`。
4. 仅当 `saved=1` 时显示“设置已保存”提示。
5. Provider 状态只显示是否配置、model 和 base URL，不展示 API key。
6. 系统卡展示 `APP_VERSION`、`GIT_COMMIT_SHA`、`BUILD_TIME` 和 `NODE_ENV`，用于 Preview/管理员验收时确认当前构建；真实 `NODE_ENV` 值保持原样展示，缺失或空白时显示 `未标记环境`。
7. `保存设置` 复用 `settingsPrimaryCtaClassName = "min-h-11 w-full sm:w-auto"`，手机端为全宽 44px 触控按钮，桌面端保持自适应宽度。
8. 保存区手机端使用 `grid gap-2`，桌面端恢复 `sm:flex sm:items-center sm:gap-2`，避免按钮和 `userId` 文本在窄屏互相挤压。
9. 显示名称、目标、每日时长、时区和知识卡去重天数 5 个文本/数字输入框复用 `settingsInputClassName = "min-h-11"`，手机端满足 44px 触控高度。
10. 目标输入框通过 `formatSettingsGoalInputValue()` 将空目标或默认 `ai_general` 显示为 `系统化学习 AI 和工程实践`，避免学习者看到内部默认 slug；已有自定义目标保持原样。
11. 水平、难度和语言使用原生 `<select>` 与 `settingsChoiceSelectClassName` 展示中文选项，例如 `入门`、`标准`、`中文`，同时继续提交既有 raw value（如 `beginner`、`standard`、`zh`）；历史自定义值显示为 `当前自定义：...`。

## Safety Boundary

- API key 只通过服务端环境变量读取。
- 不使用 `NEXT_PUBLIC_` 暴露 provider key。
- 保存动作按当前 `userId` scope 写入。
- 本模块不管理真实 secret 写入，生产 secret 仍由服务器环境管理。
- 目标默认文案和 choice select 只调整读侧输入展示，不改变 `updateSettingsAction()`、`UserProfile` 字段、Prisma 默认值、Daily Plan prompt 或 Preview 写保护边界。

## Verification

- `npm test -- tests/unit/settings-profile.test.ts`
- 发布前门禁：`npm run lint && npm test && npm run build`
- Phase E Settings Save CTA Mobile Touch Targets：`npm test -- tests/unit/settings-profile.test.ts` RED/GREEN 后 4 项通过，覆盖 `settingsPrimaryCtaClassName`、保存区手机端单列布局和 `保存设置` CTA 移动端触控目标。
- Phase E Settings Save CTA Mobile Touch Targets 回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 37 项通过。
- Phase E Settings Save CTA Mobile Touch Targets 收尾：`rg` 覆盖扫描、`git diff --check`、`npm run lint`、`npm run build` 均通过；Aegis helper 仍失败于历史 Markdown-only 结构债，不属于产品 UI 验证失败。
- Phase E Settings Input Mobile Touch Targets：`npm test -- tests/unit/settings-profile.test.ts` RED/GREEN 后 5 项通过，覆盖 `settingsInputClassName` 和 8 个单行输入框移动端触控目标。
- Phase E Settings Input Mobile Touch Targets 回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts` 39 项通过。
- Phase E Settings Input Mobile Touch Targets 收尾：`rg` 覆盖扫描、`git diff --check`、`npm run lint`、`npm test`、`npm run build` 均通过；全量单测 348 项通过，Next 构建生成 28 个静态页面。
- Phase E Settings Runtime Env Fallback Localization：`npm test -- tests/unit/settings-profile.test.ts` RED/GREEN 后 6 项通过，覆盖 `formatSettingsRuntimeEnvLabel()`、`未标记环境` 和旧 `process.env.NODE_ENV ?? "unknown"` 反向断言。
- Phase E Settings Runtime Env Fallback Localization 回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/learning-ui-components.test.ts tests/unit/shared-ui-a11y.test.ts` 43 项通过。
- Phase E Settings Runtime Env Fallback Localization 收尾：`rg` 覆盖扫描、`git diff --check`、`npm run lint`、`npm test`、`npm run build` 均通过；全量单测 398 项通过，Next 构建生成 28 个页面。
- Phase E Settings Goal Default Copy Localization：`npm test -- tests/unit/settings-profile.test.ts` RED/GREEN 后 7 项通过，覆盖 `defaultSettingsGoalText`、`formatSettingsGoalInputValue()` 和旧 `ai_general` 输入展示反向断言。
- Phase E Settings Goal Default Copy Localization 回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/learning-ui-components.test.ts` 46 项通过。
- Phase E Settings Profile Choice Display Localization：`npm test -- tests/unit/settings-profile.test.ts` RED/GREEN 后 8 项通过，覆盖 `settingsChoiceSelectClassName`、水平/难度/语言中文选项标签、raw 提交值和旧 raw placeholder/defaultValue 反向断言。
- Phase E Settings Profile Choice Display Localization 回归：`npm test -- tests/unit/settings-profile.test.ts tests/unit/auth-policy.test.ts tests/unit/daily-generation-prompt.test.ts tests/unit/learning-ui-components.test.ts` 47 项通过。
- Phase E Settings Profile Choice Display Localization 收尾：旧 `beginner / intermediate / advanced`、`easy / standard / hard`、`zh / en` placeholder/defaultValue 窄扫无匹配；`git diff --check`、`npm run lint`、`npm test`、`npm run build` 均通过；全量单测 426 项通过，Next 构建生成 28 个页面。
