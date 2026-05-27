CREATE TABLE IF NOT EXISTS "GlossaryTerm" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "abbreviation" TEXT,
  "fullName" TEXT NOT NULL,
  "chineseName" TEXT,
  "category" TEXT NOT NULL,
  "oneLine" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "whyImportant" TEXT,
  "relatedTerms" JSONB,
  "commonMistakes" JSONB,
  "examples" JSONB,
  "sourceRefs" JSONB,
  "difficulty" TEXT NOT NULL DEFAULT 'beginner',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GlossaryTerm_slug_key" ON "GlossaryTerm"("slug");
CREATE INDEX IF NOT EXISTS "GlossaryTerm_category_idx" ON "GlossaryTerm"("category");
CREATE INDEX IF NOT EXISTS "GlossaryTerm_difficulty_idx" ON "GlossaryTerm"("difficulty");
CREATE INDEX IF NOT EXISTS "GlossaryTerm_updatedAt_idx" ON "GlossaryTerm"("updatedAt");

CREATE TABLE IF NOT EXISTS "KnowledgeEntity" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "aliases" JSONB,
  "oneLine" TEXT NOT NULL,
  "whyImportant" TEXT,
  "representativeWorks" JSONB,
  "relatedTerms" JSONB,
  "timeline" JSONB,
  "sourceRefs" JSONB,
  "lastVerifiedAt" TIMESTAMP(3),
  "confidence" TEXT NOT NULL DEFAULT 'medium',
  "selfCheckQuestion" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KnowledgeEntity_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "KnowledgeEntity_slug_key" ON "KnowledgeEntity"("slug");
CREATE INDEX IF NOT EXISTS "KnowledgeEntity_type_idx" ON "KnowledgeEntity"("type");
CREATE INDEX IF NOT EXISTS "KnowledgeEntity_confidence_idx" ON "KnowledgeEntity"("confidence");
CREATE INDEX IF NOT EXISTS "KnowledgeEntity_lastVerifiedAt_idx" ON "KnowledgeEntity"("lastVerifiedAt");
CREATE INDEX IF NOT EXISTS "KnowledgeEntity_updatedAt_idx" ON "KnowledgeEntity"("updatedAt");
