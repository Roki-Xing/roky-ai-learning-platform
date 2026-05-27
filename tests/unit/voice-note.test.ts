import test from "node:test";
import assert from "node:assert/strict";
import {
  buildVoiceCoachText,
  buildVoiceNoteTitle,
  normalizeVoiceMode,
} from "@/server/voice/voice-note";

test("normalizeVoiceMode accepts documented modes and falls back safely", () => {
  assert.equal(normalizeVoiceMode("today_lesson"), "today_lesson");
  assert.equal(normalizeVoiceMode("code_debug"), "code_debug");
  assert.equal(normalizeVoiceMode("unknown"), "free_thought");
  assert.equal(normalizeVoiceMode(""), "free_thought");
});

test("buildVoiceNoteTitle creates a compact transcript title", () => {
  const title = buildVoiceNoteTitle({
    mode: "paper_reading",
    transcript: "今天我读了 Transformer 论文，主要困惑是 self-attention 的 Q/K/V 为什么要拆开。",
  });

  assert.match(title, /^语音笔记 · paper_reading · /);
  assert.ok(title.length <= 80);
});

test("buildVoiceCoachText preserves transcript and mode context", () => {
  const text = buildVoiceCoachText({
    mode: "code_debug",
    transcript: "我的 softmax 代码直接 return scores。",
  });

  assert.match(text, /Voice Note/);
  assert.match(text, /code_debug/);
  assert.match(text, /softmax/);
});
