import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  generateVoiceNoteFlashcards,
  saveVoiceNote,
  saveVoiceNoteAsNote,
  sendVoiceNoteToCoach,
} from "@/server/voice/submit";

async function createVoiceFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `voice-submit-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `voice-submit-domain-${suffix}`,
      name: "Voice Submit Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `voice-submit-topic-${suffix}`,
      title: "Voice Submit Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Voice Lesson",
      summary: "Voice summary",
      contentMarkdown: "Voice content",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({ data: { userId, timeZone: "Asia/Shanghai" } });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-24T00:00:00.000Z"),
      localDate: "2026-05-24",
      status: "completed",
      isTest: false,
    },
  });
  return { userId, lesson };
}

test("saveVoiceNote stores manual transcript without persisting audio bytes", async () => {
  const { userId, lesson } = await createVoiceFixture();

  const result = await saveVoiceNote({
    userId,
    mode: "today_lesson",
    transcript: "我用语音总结了 attention 的核心。",
    editedTranscript: "",
    lessonId: lesson.id,
    audioName: "browser-recording.webm",
  });

  const row = await prisma.voiceNote.findUniqueOrThrow({ where: { id: result.voiceNoteId } });
  assert.equal(row.userId, userId);
  assert.equal(row.lessonId, lesson.id);
  assert.equal(row.transcript, "我用语音总结了 attention 的核心。");
  assert.equal(row.editedTranscript, null);
  assert.equal(row.audioUrl, "local-only:browser-recording.webm");
});

test("saveVoiceNote can use server-side transcription result when transcript is empty", async () => {
  const { userId, lesson } = await createVoiceFixture();

  const result = await saveVoiceNote({
    userId,
    mode: "free_thought",
    transcript: "",
    editedTranscript: "",
    lessonId: lesson.id,
    audioFile: new File(["audio"], "thought.webm", { type: "audio/webm" }),
    transcribe: async () => ({
      status: "success",
      provider: "openai",
      transcript: "这是服务端转写结果。",
      audioName: "thought.webm",
      model: "gpt-4o-mini-transcribe",
    }),
  });

  const row = await prisma.voiceNote.findUniqueOrThrow({ where: { id: result.voiceNoteId } });
  assert.equal(row.transcript, "这是服务端转写结果。");
  assert.equal(row.audioUrl, "transient-upload:thought.webm");
});

test("saveVoiceNote rejects explicit lesson ids outside the current user's visible plans", async () => {
  const { userId } = await createVoiceFixture();
  const other = await createVoiceFixture();

  await assert.rejects(
    () => saveVoiceNote({
      userId,
      mode: "today_lesson",
      transcript: "我不应该能把语音绑定到别人的课程。",
      lessonId: other.lesson.id,
    }),
    /Lesson not available/,
  );

  const leaked = await prisma.voiceNote.findFirst({
    where: { userId, lessonId: other.lesson.id },
  });
  assert.equal(leaked, null);
});

test("saveVoiceNoteAsNote creates and updates one linked note for the owning user", async () => {
  const { userId, lesson } = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId,
    mode: "today_lesson",
    transcript: "第一版语音总结。",
    editedTranscript: "整理后的语音总结。",
    lessonId: lesson.id,
  });

  const first = await saveVoiceNoteAsNote({
    userId,
    voiceNoteId: result.voiceNoteId,
  });
  const second = await saveVoiceNoteAsNote({
    userId,
    voiceNoteId: result.voiceNoteId,
  });

  assert.equal(first.noteId, second.noteId);

  const [voice, noteCount, note] = await Promise.all([
    prisma.voiceNote.findUniqueOrThrow({ where: { id: result.voiceNoteId } }),
    prisma.note.count({ where: { userId, lessonId: lesson.id } }),
    prisma.note.findUniqueOrThrow({ where: { id: first.noteId } }),
  ]);

  assert.equal(voice.noteId, first.noteId);
  assert.equal(noteCount, 1);
  assert.equal(note.userId, userId);
  assert.equal(note.lessonId, lesson.id);
  assert.match(note.title, /语音笔记/);
  assert.match(note.content, /整理后的语音总结/);
});

test("saveVoiceNoteAsNote rejects voice notes outside the current user", async () => {
  const { userId } = await createVoiceFixture();
  const other = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId: other.userId,
    mode: "free_thought",
    transcript: "其他用户的语音。",
    lessonId: other.lesson.id,
  });

  await assert.rejects(
    () => saveVoiceNoteAsNote({ userId, voiceNoteId: result.voiceNoteId }),
    /VoiceNote not found/,
  );
});

test("sendVoiceNoteToCoach creates one linked ThoughtReview from the transcript", async () => {
  const { userId, lesson } = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId,
    mode: "code_debug",
    transcript: "我的 softmax 代码直接 return scores。",
    lessonId: lesson.id,
  });

  const first = await sendVoiceNoteToCoach({
    userId,
    voiceNoteId: result.voiceNoteId,
  });
  const second = await sendVoiceNoteToCoach({
    userId,
    voiceNoteId: result.voiceNoteId,
  });

  assert.equal(first.reviewId, second.reviewId);
  assert.equal(first.mode, "code_reasoning");

  const [voice, reviewCount, review] = await Promise.all([
    prisma.voiceNote.findUniqueOrThrow({ where: { id: result.voiceNoteId } }),
    prisma.thoughtReview.count({ where: { userId, lessonId: lesson.id } }),
    prisma.thoughtReview.findUniqueOrThrow({ where: { id: first.reviewId } }),
  ]);

  assert.equal(voice.thoughtReviewId, first.reviewId);
  assert.equal(reviewCount, 1);
  assert.equal(review.lessonId, lesson.id);
  assert.equal(review.mode, "code_reasoning");
  assert.match(review.rawText, /softmax/);
  assert.match(JSON.stringify(review.reviewJson), /voice-note/);
});

test("sendVoiceNoteToCoach rejects voice notes outside the current user", async () => {
  const { userId } = await createVoiceFixture();
  const other = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId: other.userId,
    mode: "free_thought",
    transcript: "其他用户的语音。",
    lessonId: other.lesson.id,
  });

  await assert.rejects(
    () => sendVoiceNoteToCoach({ userId, voiceNoteId: result.voiceNoteId }),
    /VoiceNote not found/,
  );
});

test("generateVoiceNoteFlashcards creates stable cards for the linked ThoughtReview", async () => {
  const { userId, lesson } = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId,
    mode: "concept_explain",
    transcript: "我理解 Transformer 的注意力是按相关性加权聚合上下文。",
    lessonId: lesson.id,
  });
  const review = await sendVoiceNoteToCoach({
    userId,
    voiceNoteId: result.voiceNoteId,
  });

  const first = await generateVoiceNoteFlashcards({
    userId,
    voiceNoteId: result.voiceNoteId,
  });
  const second = await generateVoiceNoteFlashcards({
    userId,
    voiceNoteId: result.voiceNoteId,
  });

  assert.equal(first.voiceNoteId, result.voiceNoteId);
  assert.equal(first.reviewId, review.reviewId);
  assert.equal(first.createdOrUpdatedCount, second.createdOrUpdatedCount);
  assert.ok(first.cards.length >= 1);

  const cards = await prisma.flashcard.findMany({
    where: { id: { startsWith: `thought:${review.reviewId}:` }, userId },
  });
  assert.equal(cards.length, first.cards.length);
  assert.ok(cards.every((card) => JSON.stringify(card.tags).includes("voice-note")));
  assert.ok(cards.every((card) => JSON.stringify(card.tags).includes("thought-review")));
});

test("generateVoiceNoteFlashcards rejects voice notes without a ThoughtReview", async () => {
  const { userId, lesson } = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId,
    mode: "free_thought",
    transcript: "这条语音还没有发送到 Coach。",
    lessonId: lesson.id,
  });

  await assert.rejects(
    () => generateVoiceNoteFlashcards({ userId, voiceNoteId: result.voiceNoteId }),
    /VoiceNote has no ThoughtReview/,
  );
});

test("generateVoiceNoteFlashcards rejects voice notes outside the current user", async () => {
  const { userId } = await createVoiceFixture();
  const other = await createVoiceFixture();
  const result = await saveVoiceNote({
    userId: other.userId,
    mode: "free_thought",
    transcript: "其他用户的语音卡片。",
    lessonId: other.lesson.id,
  });
  await sendVoiceNoteToCoach({
    userId: other.userId,
    voiceNoteId: result.voiceNoteId,
  });

  await assert.rejects(
    () => generateVoiceNoteFlashcards({ userId, voiceNoteId: result.voiceNoteId }),
    /VoiceNote not found/,
  );
});
