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

function audioFileFromForm(formData: FormData) {
  const value = formData.get("audioFile");
  return value instanceof File && value.size > 0 ? value : null;
}

export async function saveVoiceNoteAction(formData: FormData) {
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

export async function sendVoiceNoteToCoachAction(formData: FormData) {
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
  const userId = await requireUserId();
  const voiceNoteId = String(formData.get("voiceNoteId") ?? "").trim();
  if (!voiceNoteId) throw new Error("Missing voiceNoteId");

  const result = await generateVoiceNoteFlashcards({ userId, voiceNoteId });

  revalidatePath("/voice");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/voice?voiceNoteId=${encodeURIComponent(result.voiceNoteId)}`);
}
