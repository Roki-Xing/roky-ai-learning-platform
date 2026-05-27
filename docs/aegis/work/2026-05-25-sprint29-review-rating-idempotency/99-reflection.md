# Sprint 29 Reflection

## What Changed

- 新增 `rateFlashcard()`：
  - 只更新当前 `userId` 下仍然 `dueAt <= now` 的卡片。
  - 评分成功后写入一条 `ReviewLog`。
  - 如果重复点击导致卡片已经被第一次评分推迟到未来，则返回 `applied=false` 和 `reason="not_due"`。
- `rateFlashcardAction()` 复用服务函数，保留 `/review` 和 `/progress` revalidation。

## Verification Notes

- 目标测试覆盖重复评分不会重复写 `ReviewLog`，也不会重复增加 `reviewCount/correctCount`。
- 相关回归覆盖 review filter 和 1/3/7/14 天排期。
- 完整 lint/test/build 已通过。
- 没有新增 migration。

## Follow-Up

- 生产恢复后补 `/review` Host-header 验收，确认页面评分后卡片移出队列，重复提交不会造成重复日志。
- 若主生产机短期不能恢复，第二台可作为候选备用机；需要先配置完整 `.env.production`、部署 app、配置反代与证书，再切换 `learn.roky.chat` DNS。
- 后续可考虑在 UI 层为评分按钮增加 pending/disabled 状态，进一步减少重复提交入口；服务层幂等已经覆盖核心数据安全边界。
