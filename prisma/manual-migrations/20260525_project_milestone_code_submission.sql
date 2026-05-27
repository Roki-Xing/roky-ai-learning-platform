ALTER TABLE "ProjectMilestone"
  ADD COLUMN IF NOT EXISTS "codeSubmissionId" TEXT;

CREATE INDEX IF NOT EXISTS "ProjectMilestone_codeSubmissionId_idx"
  ON "ProjectMilestone"("codeSubmissionId");
