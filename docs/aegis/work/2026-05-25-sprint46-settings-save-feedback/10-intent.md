# Sprint 46 Settings Save Feedback - Intent

## TaskIntentDraft

- Requested outcome: 继续目标文档 Phase 0，把“/settings 保存后有成功提示”补成可验证的真实行为。
- Goal: 保存学习偏好后，用户返回 `/settings?saved=1` 并看到明确成功提示，避免保存动作无反馈。
- Success evidence:
  - 新增 `buildSettingsSavedNotice()` 和 `settingsSavedRedirectPath()` 服务层口径。
  - `updateSettingsAction()` 保存后重定向到 `/settings?saved=1`。
  - `/settings` 使用 Next.js 16 Promise `searchParams`，只在 `saved=1` 时显示成功提示。
  - 不暴露任何 provider key。
  - 本地 RED 后 GREEN。
  - 本地 `npm run lint`、`npm test`、`npm run build` 通过。
  - 备用机同步后完成远端目标测试、构建、容器启动和 HTTP health 验收。
- Stop condition: 本地和备用机证据满足，或真实公网 HTTPS 仍因 DNS 未切换不可验收。
- Non-goals:
  - 不新增 UserProfile 字段。
  - 不改 DeepSeek provider 配置。
  - 不改 settings 表单字段含义。
  - 不新增数据库 migration。

## BaselineReadSetHint

- `/mnt/c/Users/Xing/Desktop/roky_learn_codex_goal_guidance.md`
- `src/app/settings/page.tsx`
- `src/app/settings/actions.ts`
- `src/server/profile/settings.ts`
- `tests/unit/settings-profile.test.ts`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`

## ImpactStatementDraft

- Compatibility boundary: 只补保存后用户反馈；UserProfile 持久化、生成上下文和 provider 状态保持原行为。
- Affected layers:
  - `src/server/profile/settings.ts`
  - `src/app/settings/actions.ts`
  - `src/app/settings/page.tsx`
  - `tests/unit/settings-profile.test.ts`
  - docs/helloagents
- Invariants:
  - `DEEPSEEK_API_KEY` 仍只在服务端环境变量读取，不在页面展示。
  - settings 保存仍按当前 `userId` scope。
  - `searchParams` 按 Next.js 16 Promise 形式读取。

These records are Method Pack drafts / hints, not authoritative runtime decisions.
