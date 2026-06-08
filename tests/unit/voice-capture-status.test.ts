import test from "node:test";
import assert from "node:assert/strict";
import { buildVoiceCaptureStatusPanel, formatVoiceRecordingSeconds } from "@/app/voice/ui/voice-capture-status";

test("formatVoiceRecordingSeconds keeps a stable mm:ss timer", () => {
  assert.equal(formatVoiceRecordingSeconds(0), "00:00");
  assert.equal(formatVoiceRecordingSeconds(7), "00:07");
  assert.equal(formatVoiceRecordingSeconds(75), "01:15");
});

test("voice capture status starts with a speak-your-understanding prompt", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "idle",
    seconds: 0,
    hasTranscript: false,
    lastResultStatus: null,
  });

  assert.equal(panel.title, "准备说出理解");
  assert.equal(panel.timerLabel, "00:00");
  assert.equal(panel.tone, "neutral");
  assert.match(panel.description, /把脑子里的想法说出来/);
});

test("voice capture status shows recording timer and focus guidance", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "recording",
    seconds: 65,
    hasTranscript: false,
    lastResultStatus: null,
  });

  assert.equal(panel.title, "正在录音");
  assert.equal(panel.timerLabel, "01:05");
  assert.equal(panel.tone, "warning");
  assert.match(panel.description, /只讲一个概念/);
});

test("voice capture status tells user to inspect localized transcript text after successful transcription", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "file-selected",
    seconds: 21,
    hasTranscript: true,
    lastResultStatus: "success",
  });

  assert.equal(panel.title, "转写已填入转写文本");
  assert.equal(panel.tone, "success");
  assert.match(panel.description, /检查错字/);
  assert.doesNotMatch(panel.title, /Transcript/);
  assert.doesNotMatch(panel.description, /Transcript/);
});

test("voice capture status treats a stopped recording as an automatic transcription handoff", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "recorded",
    seconds: 34,
    hasTranscript: false,
    lastResultStatus: null,
  });

  assert.equal(panel.title, "录音已完成，准备转写");
  assert.equal(panel.tone, "info");
  assert.match(panel.description, /停止后会自动转写/);
  assert.match(panel.description, /填入转写文本/);
  assert.doesNotMatch(panel.description, /Transcript/);
});

test("voice capture status keeps learner-facing transcript copy localized", () => {
  const panels = [
    buildVoiceCaptureStatusPanel({
      status: "file-too-large",
      seconds: 0,
      hasTranscript: false,
      lastResultStatus: null,
    }),
    buildVoiceCaptureStatusPanel({
      status: "transcribing",
      seconds: 0,
      hasTranscript: false,
      lastResultStatus: null,
    }),
    buildVoiceCaptureStatusPanel({
      status: "file-selected",
      seconds: 0,
      hasTranscript: false,
      lastResultStatus: null,
    }),
    buildVoiceCaptureStatusPanel({
      status: "file-selected",
      seconds: 0,
      hasTranscript: false,
      lastResultStatus: "manual_required",
    }),
  ];

  const visibleCopy = panels.map((panel) => `${panel.title} ${panel.description}`).join("\n");
  assert.doesNotMatch(visibleCopy, /Transcript/);
  assert.match(visibleCopy, /转写文本/);
});

test("voice capture status uses the same manual transcription label as result badges", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "file-selected",
    seconds: 0,
    hasTranscript: false,
    lastResultStatus: "manual_required",
  });

  assert.equal(panel.badgeLabel, "需手动整理");
  assert.doesNotMatch(panel.badgeLabel, /manual_required|需手动$/);
});
