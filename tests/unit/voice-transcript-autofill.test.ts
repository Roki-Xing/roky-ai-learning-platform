import test from "node:test";
import assert from "node:assert/strict";
import { resolveVoiceTranscriptAutofill } from "@/app/voice/ui/voice-transcript-autofill";

test("voice transcript autofill accepts transcribed text and asks to focus transcript", () => {
  const result = resolveVoiceTranscriptAutofill({
    currentTranscript: "",
    incomingTranscript: "我刚才解释了 attention 的 Q/K/V。",
  });

  assert.equal(result.nextTranscript, "我刚才解释了 attention 的 Q/K/V。");
  assert.equal(result.shouldFocusTranscript, true);
  assert.equal(result.notice, "转写已填入，请检查 Transcript 后保存。");
});

test("voice transcript autofill preserves manually typed transcript", () => {
  const result = resolveVoiceTranscriptAutofill({
    currentTranscript: "我已经手动写了一版。",
    incomingTranscript: "服务端转写文本。",
  });

  assert.equal(result.nextTranscript, "我已经手动写了一版。");
  assert.equal(result.shouldFocusTranscript, true);
  assert.match(result.notice, /已保留你手动输入/);
});

test("voice transcript autofill ignores blank transcription", () => {
  const result = resolveVoiceTranscriptAutofill({
    currentTranscript: "",
    incomingTranscript: "   ",
  });

  assert.equal(result.nextTranscript, "");
  assert.equal(result.shouldFocusTranscript, false);
  assert.match(result.notice, /没有可用转写/);
});
