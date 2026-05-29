import test from "node:test";
import assert from "node:assert/strict";
import {
  buildVoiceCoachText,
  buildVoiceNoteTitle,
  normalizeVoiceMode,
} from "@/server/voice/voice-note";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VoiceWorkspaceForm } from "@/app/voice/ui/voice-workspace-form";

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

test("voice workspace form can default to today's lesson mode from completion handoff", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceWorkspaceForm, {
      modes: [
        ["free_thought", "自由想法"],
        ["today_lesson", "今日课程"],
      ],
      recentPlan: {
        lessonId: "lesson-1",
        localDate: "2026-05-29",
        title: "Transformer 架构入门",
      },
      defaultMode: "today_lesson",
      defaultLessonId: "lesson-1",
    }),
  );

  assert.match(markup, /关联：2026-05-29 \/ Transformer 架构入门/);
  assert.match(markup, /<option value="today_lesson" selected="">今日课程<\/option>/);
  assert.match(markup, /type="hidden" name="lessonId" value="lesson-1"/);
});
