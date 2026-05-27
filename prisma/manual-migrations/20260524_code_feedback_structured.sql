ALTER TABLE "CodeSubmission"
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS "aiFeedback" TEXT,
  ADD COLUMN IF NOT EXISTS "feedbackJson" JSONB;

ALTER TABLE "CodeFeedback"
  ADD COLUMN IF NOT EXISTS "overall" TEXT,
  ADD COLUMN IF NOT EXISTS "hints" JSONB,
  ADD COLUMN IF NOT EXISTS "suggestedTests" JSONB,
  ADD COLUMN IF NOT EXISTS "flashcards" JSONB,
  ADD COLUMN IF NOT EXISTS "feedbackJson" JSONB;

ALTER TABLE "Misconception"
  ALTER COLUMN "questionId" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "codeSubmissionId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Misconception_sourceKey_key"
  ON "Misconception"("sourceKey");
CREATE INDEX IF NOT EXISTS "Misconception_codeSubmissionId_idx"
  ON "Misconception"("codeSubmissionId");
CREATE INDEX IF NOT EXISTS "Misconception_source_idx"
  ON "Misconception"("source");

