CREATE TABLE IF NOT EXISTS "VoiceNote" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT,
  "mode" TEXT NOT NULL,
  "audioUrl" TEXT,
  "transcript" TEXT NOT NULL,
  "editedTranscript" TEXT,
  "thoughtReviewId" TEXT,
  "noteId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "VoiceNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "VoiceNote_userId_idx" ON "VoiceNote"("userId");
CREATE INDEX IF NOT EXISTS "VoiceNote_lessonId_idx" ON "VoiceNote"("lessonId");
CREATE INDEX IF NOT EXISTS "VoiceNote_mode_idx" ON "VoiceNote"("mode");
CREATE INDEX IF NOT EXISTS "VoiceNote_thoughtReviewId_idx" ON "VoiceNote"("thoughtReviewId");
CREATE INDEX IF NOT EXISTS "VoiceNote_noteId_idx" ON "VoiceNote"("noteId");
CREATE INDEX IF NOT EXISTS "VoiceNote_createdAt_idx" ON "VoiceNote"("createdAt");
