"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import {
  generateVoiceNoteFlashcards,
  saveVoiceNote,
  saveVoiceNoteAsNote,
  sendVoiceNoteToCoach,
} from "@/server/voice/submit";
import { transcribeVoiceAudio } from "@/server/voice/transcription";
import { assertWritableRequest } from "@/server/auth/preview";

function audioFileFromForm(formData: FormData) {
  const value = formData.get("audioFile");
  return value instanceof File && value.size > 0 ? value : null;
}

export async function saveVoiceNoteAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const result = await saveVoiceNote({
    userId,
    mode: String(formData.get("mode") ?? ""),
    transcript: String(formData.get("transcript") ?? ""),
    editedTranscript: String(formData.get("editedTranscript") ?? ""),
    lessonId: String(formData.get("lessonId") ?? ""),
    audioName: String(formData.get("audioName") ?? ""),
    audioFile: audioFileFromForm(formData),
  });

  revalidatePath("/voice");
  revalidatePath("/progress");
  redirect(`/voice?voiceNoteId=${encodeURIComponent(result.voiceNoteId)}`);
}

export async function transcribeAudioAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  void userId;

  const mode = String(formData.get("mode") ?? "");
  const audioFile = audioFileFromForm(formData);
  const result = await transcribeVoiceAudio({ file: audioFile, mode });

  return {
    ok: result.status === "success",
    status: result.status,
    provider: result.provider,
    transcript: result.status === "success" ? result.transcript : "",
    audioName: result.audioName,
    reason: result.status === "manual_required" ? result.reason : null,
    model: result.status === "success" ? result.model : null,
  };
}

export async function sendVoiceNoteToCoachAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const voiceNoteId = String(formData.get("voiceNoteId") ?? "").trim();
  if (!voiceNoteId) throw new Error("Missing voiceNoteId");

  await sendVoiceNoteToCoach({ userId, voiceNoteId });

  revalidatePath("/voice");
  revalidatePath("/coach");
  revalidatePath("/progress");
  revalidatePath("/library");
  redirect(`/voice?voiceNoteId=${encodeURIComponent(voiceNoteId)}`);
}

export async function saveVoiceNoteAsNoteAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const voiceNoteId = String(formData.get("voiceNoteId") ?? "").trim();
  if (!voiceNoteId) throw new Error("Missing voiceNoteId");

  await saveVoiceNoteAsNote({ userId, voiceNoteId });

  revalidatePath("/voice");
  revalidatePath("/notes");
  revalidatePath("/library");
  revalidatePath("/progress");
  redirect(`/voice?voiceNoteId=${encodeURIComponent(voiceNoteId)}`);
}

export async function generateVoiceNoteFlashcardsAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const voiceNoteId = String(formData.get("voiceNoteId") ?? "").trim();
  if (!voiceNoteId) throw new Error("Missing voiceNoteId");

  const result = await generateVoiceNoteFlashcards({ userId, voiceNoteId });

  revalidatePath("/voice");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/voice?voiceNoteId=${encodeURIComponent(result.voiceNoteId)}`);
}
