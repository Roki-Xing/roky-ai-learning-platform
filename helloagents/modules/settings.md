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

## Safety Boundary

- API key 只通过服务端环境变量读取。
- 不使用 `NEXT_PUBLIC_` 暴露 provider key。
- 保存动作按当前 `userId` scope 写入。
- 本模块不管理真实 secret 写入，生产 secret 仍由服务器环境管理。

## Verification

- `npm test -- tests/unit/settings-profile.test.ts`
- 发布前门禁：`npm run lint && npm test && npm run build`
