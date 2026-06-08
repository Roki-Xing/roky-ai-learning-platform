import test from "node:test";
import assert from "node:assert/strict";
import manifest from "@/app/manifest";

test("pwa manifest exposes mobile daily-learning shortcuts", () => {
  const data = manifest();
  const shortcuts = data.shortcuts ?? [];

  assert.deepEqual(
    shortcuts.map((shortcut) => ({
      name: shortcut.name,
      url: shortcut.url,
    })),
    [
      { name: "今日学习", url: "/today" },
      { name: "复习中心", url: "/review" },
      { name: "语音反思", url: "/voice" },
      { name: "每周复盘", url: "/weekly" },
    ],
  );
  assert.ok(shortcuts.every((shortcut) => shortcut.description));
  assert.match(shortcuts[0]?.description ?? "", /专注模式/);
  assert.doesNotMatch(shortcuts[0]?.description ?? "", /Focus Mode/);
});
