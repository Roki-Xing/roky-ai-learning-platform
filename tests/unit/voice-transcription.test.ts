import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_VOICE_AUDIO_BYTES,
  buildVoiceTranscriptionPrompt,
  normalizeVoiceTranscript,
  transcribeVoiceAudio,
  validateVoiceAudioFile,
} from "@/server/voice/transcription";

function audioFile(args: { name: string; type: string; size?: number; text?: string }) {
  const content = args.text ?? "audio";
  const repeat = Math.max(1, Math.ceil((args.size ?? content.length) / content.length));
  const body = content.repeat(repeat).slice(0, args.size ?? content.length);
  return new File([body], args.name, { type: args.type });
}

test("validateVoiceAudioFile accepts supported audio under the upload limit", () => {
  const file = audioFile({ name: "thinking.webm", type: "audio/webm" });

  const result = validateVoiceAudioFile(file);

  assert.equal(result.ok, true);
  assert.equal(result.safeName, "thinking.webm");
});

test("validateVoiceAudioFile rejects oversized or unsupported files", () => {
  const tooLarge = audioFile({
    name: "large.webm",
    type: "audio/webm",
    size: MAX_VOICE_AUDIO_BYTES + 1,
  });
  const unsupported = audioFile({ name: "note.txt", type: "text/plain" });

  assert.equal(validateVoiceAudioFile(tooLarge).ok, false);
  assert.match(validateVoiceAudioFile(tooLarge).reason, /too large/i);
  assert.equal(validateVoiceAudioFile(unsupported).ok, false);
  assert.match(validateVoiceAudioFile(unsupported).reason, /unsupported/i);
});

test("transcribeVoiceAudio reports manual fallback when no provider key is configured", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const result = await transcribeVoiceAudio({
      file: audioFile({ name: "manual.webm", type: "audio/webm" }),
      mode: "today_lesson",
    });

    assert.equal(result.status, "manual_required");
    assert.equal(result.provider, "manual");
    assert.equal(result.transcript, "");
    assert.match(result.reason ?? "", /OPENAI_API_KEY/);
  } finally {
    if (previous) process.env.OPENAI_API_KEY = previous;
  }
});

test("voice transcription prompt preserves AI acronyms and benchmark names", () => {
  const prompt = buildVoiceTranscriptionPrompt("today_lesson");

  assert.match(prompt, /Preserve these AI acronyms and technical terms\./);
  for (const term of [
    "CoT",
    "SWE-bench",
    "RLHF",
    "DPO",
    "SFT",
    "LoRA",
    "QLoRA",
    "MoE",
    "RAG",
    "MMLU",
    "GPQA",
    "HumanEval",
    "ReAct",
    "ToT",
    "MCP",
    "BM25",
    "Reranker",
    "Embedding",
    "Vector Database",
  ]) {
    assert.match(prompt, new RegExp(term.replace("-", "\\-")));
  }
});

test("normalizeVoiceTranscript repairs common AI acronym transcription mistakes", () => {
  const normalized = normalizeVoiceTranscript(
    "today we compare cot, chain of thought, swe bench, swebench, rag, lora, human eval, react and m c p with gpqa, mmlu, bm25, reranker, embedding and vector database",
  );

  assert.match(normalized, /CoT/);
  assert.match(normalized, /Chain-of-Thought/);
  assert.match(normalized, /SWE-bench/);
  assert.match(normalized, /SWE-bench, SWE-bench/);
  assert.match(normalized, /RAG/);
  assert.match(normalized, /LoRA/);
  assert.match(normalized, /HumanEval/);
  assert.match(normalized, /ReAct/);
  assert.match(normalized, /MCP/);
  assert.match(normalized, /GPQA/);
  assert.match(normalized, /MMLU/);
  assert.match(normalized, /BM25/);
  assert.match(normalized, /Reranker/);
  assert.match(normalized, /Embedding/);
  assert.match(normalized, /Vector Database/);
});
