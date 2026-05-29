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

test("voice capture status tells user to inspect transcript after successful transcription", () => {
  const panel = buildVoiceCaptureStatusPanel({
    status: "file-selected",
    seconds: 21,
    hasTranscript: true,
    lastResultStatus: "success",
  });

  assert.equal(panel.title, "转写已填入 Transcript");
  assert.equal(panel.tone, "success");
  assert.match(panel.description, /检查错字/);
});
