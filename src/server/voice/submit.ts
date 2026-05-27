import { prisma } from "@/server/db";
import { Prisma } from "@prisma/client";
import {
  createThoughtReview,
  generateFlashcardsForThoughtReview,
} from "@/server/coach/submit";
import {
  buildVoiceCoachText,
  normalizeVoiceMode,
  voiceModeToCoachMode,
} from "@/server/voice/voice-note";
import {
  buildVoiceNoteMarkdown,
  buildVoiceNoteTitle,
} from "@/server/voice/voice-note";
import {
  transcribeVoiceAudio,
  type VoiceTranscriptionResult,
} from "@/server/voice/transcription";

type TranscribeFn = (args: {
  file: File | null | undefined;
  mode: string;
}) => Promise<VoiceTranscriptionResult>;

function cleanTranscript(value: string | null | undefined) {
  const text = (value ?? "").trim();
  if (text.length > 20_000) throw new Error("Transcript is too long");
  return text;
}

function safeName(name: string) {
  return name.trim().split(/[\\/]/).pop()?.slice(0, 180) ?? "";
}

async function getActiveLessonId(userId: string, lessonIdRaw: string | null | undefined) {
  const explicit = (lessonIdRaw ?? "").trim();
  if (explicit) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: explicit,
        dailyPlans: { some: { userId, isTest: false, archivedAt: null } },
      },
      select: { id: true },
    });
    if (!lesson) throw new Error("Lesson not available for voice note");
    return lesson.id;
  }

  const recentPlan = await prisma.dailyPlan.findFirst({
    where: { userId, isTest: false, archivedAt: null },
    orderBy: [{ localDate: "desc" }],
    select: { lessonId: true },
  });
  return recentPlan?.lessonId ?? null;
}

/**
 * Saves a VoiceNote from manual transcript or transient server-side transcription.
 *
 * Args:
 *   args: User, mode, transcript fields, optional lesson, and optional audio file.
 *
 * Returns:
 *   Persisted VoiceNote id and transcription status.
 */
export async function saveVoiceNote(args: {
  userId: string;
  mode: string;
  transcript?: string | null;
  editedTranscript?: string | null;
  lessonId?: string | null;
  audioName?: string | null;
  audioFile?: File | null;
  transcribe?: TranscribeFn;
}) {
  const mode = normalizeVoiceMode(args.mode);
  const manualTranscript = cleanTranscript(args.transcript);
  const editedTranscript = cleanTranscript(args.editedTranscript);
  const transcribe = args.transcribe ?? transcribeVoiceAudio;

  let transcript = manualTranscript;
  let audioUrl = args.audioName?.trim()
    ? `local-only:${safeName(args.audioName)}`
    : null;
  let transcription: VoiceTranscriptionResult | null = null;

  if (!transcript && args.audioFile && args.audioFile.size > 0) {
    transcription = await transcribe({ file: args.audioFile, mode });
    if (transcription.status === "success") {
      transcript = transcription.transcript;
      audioUrl = `transient-upload:${transcription.audioName}`;
    } else if (transcription.audioName) {
      audioUrl = `transient-upload:${transcription.audioName}`;
    }
  }

  const effectiveTranscript = editedTranscript || transcript;
  if (!effectiveTranscript) {
    throw new Error(transcription?.reason ?? "Missing transcript");
  }

  const lessonId = await getActiveLessonId(args.userId, args.lessonId);
  const note = await prisma.voiceNote.create({
    data: {
      userId: args.userId,
      lessonId,
      mode,
      audioUrl,
      transcript: transcript || effectiveTranscript,
      editedTranscript: editedTranscript || null,
    },
    select: { id: true },
  });

  return {
    voiceNoteId: note.id,
    transcriptionStatus: transcription?.status ?? "manual",
    provider: transcription?.provider ?? "manual",
  };
}

/**
 * Persists a VoiceNote transcript as a regular Note.
 *
 * Args:
 *   args: Current user id and owned VoiceNote id.
 *
 * Returns:
 *   The stable Note id linked from the VoiceNote.
 */
export async function saveVoiceNoteAsNote(args: {
  userId: string;
  voiceNoteId: string;
}) {
  const voice = await prisma.voiceNote.findFirst({
    where: { id: args.voiceNoteId, userId: args.userId },
    select: {
      id: true,
      lessonId: true,
      mode: true,
      transcript: true,
      editedTranscript: true,
      thoughtReviewId: true,
      noteId: true,
    },
  });
  if (!voice) throw new Error("VoiceNote not found");

  const transcript = voice.editedTranscript || voice.transcript;
  const content = buildVoiceNoteMarkdown({
    mode: voice.mode,
    transcript,
    thoughtReviewId: voice.thoughtReviewId,
  });
  const title = buildVoiceNoteTitle({ mode: voice.mode, transcript });

  const existingNote = voice.noteId
    ? await prisma.note.findFirst({
        where: { id: voice.noteId, userId: args.userId },
        select: { id: true },
      })
    : null;

  const note = existingNote
    ? await prisma.note.update({
        where: { id: existingNote.id },
        data: { title, content, lessonId: voice.lessonId },
        select: { id: true },
      })
    : await prisma.note.create({
        data: {
          userId: args.userId,
          lessonId: voice.lessonId,
          title,
          content,
          tags: ["voice-note"] as Prisma.InputJsonValue,
        },
        select: { id: true },
      });

  await prisma.voiceNote.update({
    where: { id: voice.id },
    data: { noteId: note.id },
  });

  return {
    voiceNoteId: voice.id,
    noteId: note.id,
  };
}

/**
 * Sends a VoiceNote transcript to Coach and links the resulting ThoughtReview.
 *
 * Args:
 *   args: Current user id and owned VoiceNote id.
 *
 * Returns:
 *   The stable ThoughtReview id linked from the VoiceNote.
 */
export async function sendVoiceNoteToCoach(args: {
  userId: string;
  voiceNoteId: string;
}) {
  const voice = await prisma.voiceNote.findFirst({
    where: { id: args.voiceNoteId, userId: args.userId },
    select: {
      id: true,
      lessonId: true,
      mode: true,
      transcript: true,
      editedTranscript: true,
      thoughtReviewId: true,
    },
  });
  if (!voice) throw new Error("VoiceNote not found");
  if (voice.thoughtReviewId) {
    const existing = await prisma.thoughtReview.findFirst({
      where: { id: voice.thoughtReviewId, userId: args.userId },
      select: { id: true, mode: true },
    });
    if (existing) {
      return {
        voiceNoteId: voice.id,
        reviewId: existing.id,
        mode: existing.mode,
      };
    }
  }

  const transcript = (voice.editedTranscript || voice.transcript).trim();
  const coachMode = voiceModeToCoachMode(voice.mode);
  const review = await createThoughtReview({
    userId: args.userId,
    mode: coachMode,
    rawText: transcript,
    includeTodayLesson: Boolean(voice.lessonId),
    lessonId: voice.lessonId,
    reviewJsonExtra: {
      source: "voice-note",
      voiceNoteId: voice.id,
      voicePrompt: buildVoiceCoachText({ mode: voice.mode, transcript }),
    },
  });

  await prisma.voiceNote.update({
    where: { id: voice.id },
    data: { thoughtReviewId: review.reviewId },
  });

  return {
    voiceNoteId: voice.id,
    reviewId: review.reviewId,
    mode: review.mode,
  };
}

/**
 * Generates review flashcards from a VoiceNote-linked ThoughtReview.
 *
 * Args:
 *   args: Current user id and owned VoiceNote id.
 *
 * Returns:
 *   Stable flashcards created or updated from the linked ThoughtReview.
 */
export async function generateVoiceNoteFlashcards(args: {
  userId: string;
  voiceNoteId: string;
}) {
  const voice = await prisma.voiceNote.findFirst({
    where: { id: args.voiceNoteId, userId: args.userId },
    select: { id: true, thoughtReviewId: true },
  });
  if (!voice) throw new Error("VoiceNote not found");
  if (!voice.thoughtReviewId) throw new Error("VoiceNote has no ThoughtReview");

  const result = await generateFlashcardsForThoughtReview({
    userId: args.userId,
    reviewId: voice.thoughtReviewId,
    extraTags: ["voice-note"],
  });

  return {
    voiceNoteId: voice.id,
    reviewId: voice.thoughtReviewId,
    cards: result.cards,
    createdOrUpdatedCount: result.createdOrUpdatedCount,
  };
}
