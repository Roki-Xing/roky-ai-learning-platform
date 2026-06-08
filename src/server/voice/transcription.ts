import { normalizeVoiceMode } from "@/server/voice/voice-note";
import { cleanupVoiceTranscript } from "@/server/voice/cleanup";
import { buildVoiceVocabularyPrompt } from "@/server/voice/vocabulary";

export const MAX_VOICE_AUDIO_BYTES = 20 * 1024 * 1024;

const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/x-m4a",
]);

function safeAudioName(name: string) {
  const base = name.trim().split(/[\\/]/).pop() || "voice-note.webm";
  return base.replace(/[^\w.\-()+\u4e00-\u9fff ]/g, "_").slice(0, 180);
}

export function validateVoiceAudioFile(file: File | null | undefined) {
  if (!file || file.size <= 0) {
    return { ok: false as const, reason: "missing audio file", safeName: null };
  }
  if (file.size > MAX_VOICE_AUDIO_BYTES) {
    return {
      ok: false as const,
      reason: `audio file is too large; max ${MAX_VOICE_AUDIO_BYTES} bytes`,
      safeName: safeAudioName(file.name),
    };
  }
  if (!SUPPORTED_AUDIO_TYPES.has(file.type)) {
    return {
      ok: false as const,
      reason: `unsupported audio type: ${file.type || "unknown"}`,
      safeName: safeAudioName(file.name),
    };
  }
  return { ok: true as const, reason: null, safeName: safeAudioName(file.name) };
}

export type VoiceTranscriptionResult =
  | {
      status: "success";
      provider: "openai";
      transcript: string;
      audioName: string;
      model: string;
      reason?: null;
    }
  | {
      status: "manual_required";
      provider: "manual";
      transcript: "";
      audioName: string | null;
      model?: null;
      reason: string;
    };

type OpenAITranscriptionResponse = {
  text?: string;
};

export function buildVoiceTranscriptionPrompt(mode: string) {
  return [
    `Roky Learn voice note mode=${normalizeVoiceMode(mode)}. Transcribe faithfully.`,
    buildVoiceVocabularyPrompt(),
  ].join(" ");
}

export function normalizeVoiceTranscript(transcript: string) {
  return cleanupVoiceTranscript(transcript);
}

/**
 * Transcribes an uploaded voice-note audio file using a server-side provider.
 *
 * Args:
 *   args: Audio File and voice-note mode.
 *
 * Returns:
 *   A successful transcript, or an explicit manual-required fallback.
 */
export async function transcribeVoiceAudio(args: {
  file: File | null | undefined;
  mode: string;
}): Promise<VoiceTranscriptionResult> {
  const validation = validateVoiceAudioFile(args.file);
  if (!validation.ok) {
    return {
      status: "manual_required",
      provider: "manual",
      transcript: "",
      audioName: validation.safeName,
      model: null,
      reason: validation.reason,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || process.env.NODE_ENV === "test") {
    return {
      status: "manual_required",
      provider: "manual",
      transcript: "",
      audioName: validation.safeName,
      model: null,
      reason: "OPENAI_API_KEY is not configured; manual transcript is required.",
    };
  }

  const model = process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe";
  const form = new FormData();
  form.set("model", model);
  form.set("file", args.file!, validation.safeName);
  form.set(
    "prompt",
    buildVoiceTranscriptionPrompt(args.mode),
  );

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  const text = await res.text();
  if (!res.ok) {
    return {
      status: "manual_required",
      provider: "manual",
      transcript: "",
      audioName: validation.safeName,
      model: null,
      reason: `transcription failed (${res.status}): ${text.slice(0, 240)}`,
    };
  }

  const data = JSON.parse(text) as OpenAITranscriptionResponse;
  const transcript = normalizeVoiceTranscript(data.text ?? "");
  if (!transcript) {
    return {
      status: "manual_required",
      provider: "manual",
      transcript: "",
      audioName: validation.safeName,
      model: null,
      reason: "transcription returned empty text; manual transcript is required.",
    };
  }

  return {
    status: "success",
    provider: "openai",
    transcript,
    audioName: validation.safeName,
    model,
    reason: null,
  };
}
