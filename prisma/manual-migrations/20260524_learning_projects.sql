CREATE TABLE IF NOT EXISTS "LearningProject" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "templateSlug" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'planned',
  "summary" TEXT,
  "relatedTopics" JSONB,
  "relatedLessons" JSONB,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningProject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectMilestone" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "task" TEXT NOT NULL,
  "codePrompt" TEXT NOT NULL,
  "reflectionPrompt" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'planned',
  "relatedTopics" JSONB,
  "lessonId" TEXT,
  "noteId" TEXT,
  "code" TEXT,
  "note" TEXT,
  "reflection" TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LearningProject_userId_templateSlug_key" ON "LearningProject"("userId", "templateSlug");
CREATE INDEX IF NOT EXISTS "LearningProject_userId_idx" ON "LearningProject"("userId");
CREATE INDEX IF NOT EXISTS "LearningProject_type_idx" ON "LearningProject"("type");
CREATE INDEX IF NOT EXISTS "LearningProject_status_idx" ON "LearningProject"("status");
CREATE INDEX IF NOT EXISTS "LearningProject_updatedAt_idx" ON "LearningProject"("updatedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectMilestone_projectId_position_key" ON "ProjectMilestone"("projectId", "position");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_projectId_idx" ON "ProjectMilestone"("projectId");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_userId_idx" ON "ProjectMilestone"("userId");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_status_idx" ON "ProjectMilestone"("status");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_lessonId_idx" ON "ProjectMilestone"("lessonId");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_noteId_idx" ON "ProjectMilestone"("noteId");
CREATE INDEX IF NOT EXISTS "ProjectMilestone_updatedAt_idx" ON "ProjectMilestone"("updatedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LearningProject_userId_fkey'
  ) THEN
    ALTER TABLE "LearningProject"
      ADD CONSTRAINT "LearningProject_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProjectMilestone_projectId_fkey'
  ) THEN
    ALTER TABLE "ProjectMilestone"
      ADD CONSTRAINT "ProjectMilestone_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "LearningProject"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
