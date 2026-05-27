CREATE TABLE IF NOT EXISTS "Misconception" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "topicId" TEXT,
  "localDate" TEXT,
  "source" TEXT NOT NULL DEFAULT 'quiz',
  "summary" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "expectedAnswer" JSONB,
  "userAnswer" JSONB,
  "explanation" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
  "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Misconception_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Misconception_userId_questionId_key"
  ON "Misconception"("userId", "questionId");
CREATE INDEX IF NOT EXISTS "Misconception_userId_idx" ON "Misconception"("userId");
CREATE INDEX IF NOT EXISTS "Misconception_questionId_idx" ON "Misconception"("questionId");
CREATE INDEX IF NOT EXISTS "Misconception_lessonId_idx" ON "Misconception"("lessonId");
CREATE INDEX IF NOT EXISTS "Misconception_topicId_idx" ON "Misconception"("topicId");
CREATE INDEX IF NOT EXISTS "Misconception_status_idx" ON "Misconception"("status");
CREATE INDEX IF NOT EXISTS "Misconception_lastAttemptAt_idx" ON "Misconception"("lastAttemptAt");

CREATE TABLE IF NOT EXISTS "CodeFeedback" (
  "id" TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "localDate" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'template',
  "status" TEXT NOT NULL DEFAULT 'success',
  "summary" TEXT NOT NULL,
  "strengths" JSONB,
  "issues" JSONB,
  "suggestions" JSONB,
  "nextSteps" JSONB,
  "raw" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CodeFeedback_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CodeFeedback_submissionId_key"
  ON "CodeFeedback"("submissionId");
CREATE INDEX IF NOT EXISTS "CodeFeedback_userId_idx" ON "CodeFeedback"("userId");
CREATE INDEX IF NOT EXISTS "CodeFeedback_lessonId_idx" ON "CodeFeedback"("lessonId");
CREATE INDEX IF NOT EXISTS "CodeFeedback_localDate_idx" ON "CodeFeedback"("localDate");
CREATE INDEX IF NOT EXISTS "CodeFeedback_provider_idx" ON "CodeFeedback"("provider");
CREATE INDEX IF NOT EXISTS "CodeFeedback_status_idx" ON "CodeFeedback"("status");
CREATE INDEX IF NOT EXISTS "CodeFeedback_updatedAt_idx" ON "CodeFeedback"("updatedAt");
