import { prisma } from "@/server/db";
import {
  asJson,
  DEFAULT_GLOSSARY_TERMS,
  DEFAULT_KNOWLEDGE_ENTITIES,
} from "@/server/knowledge/base";
import { DEFAULT_DOMAINS, type SeedTopic } from "@/server/seed/default-topics";

async function upsertTopicTree(args: {
  domainId: string;
  parentId: string | null;
  topic: SeedTopic;
}) {
  const { domainId, parentId, topic } = args;

  const slug = parentId ? `${parentId}.${topic.slug}` : topic.slug;

  const row = await prisma.topic.upsert({
    where: { slug },
    update: {
      title: topic.title,
      summary: topic.summary ?? null,
      depthLevel: topic.depthLevel ?? 0,
      prerequisites: topic.prerequisites ? topic.prerequisites : undefined,
      domainId,
      parentId,
    },
    create: {
      slug,
      title: topic.title,
      summary: topic.summary ?? null,
      depthLevel: topic.depthLevel ?? 0,
      prerequisites: topic.prerequisites ?? undefined,
      domainId,
      parentId,
    },
  });

  const children = topic.children ?? [];
  for (const child of children) {
    await upsertTopicTree({ domainId, parentId: row.id, topic: child });
  }
}

export async function seedDefaultDomainsAndTopics() {
  for (const d of DEFAULT_DOMAINS) {
    const domain = await prisma.domain.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        description: d.description ?? null,
        weight: d.weight ?? 10,
      },
      create: {
        slug: d.slug,
        name: d.name,
        description: d.description ?? null,
        weight: d.weight ?? 10,
      },
    });

    for (const t of d.topics) {
      await upsertTopicTree({ domainId: domain.id, parentId: null, topic: t });
    }
  }
}

export async function seedDefaultKnowledgeBase() {
  for (const term of DEFAULT_GLOSSARY_TERMS) {
    await prisma.glossaryTerm.upsert({
      where: { slug: term.slug },
      update: {
        abbreviation: term.abbreviation ?? null,
        fullName: term.fullName,
        chineseName: term.chineseName ?? null,
        category: term.category,
        oneLine: term.oneLine,
        explanation: term.explanation,
        whyImportant: term.whyImportant,
        relatedTerms: asJson(term.relatedTerms),
        commonMistakes: asJson(term.commonMistakes),
        examples: asJson(term.examples),
        sourceRefs: asJson(term.sourceRefs),
        difficulty: term.difficulty,
      },
      create: {
        slug: term.slug,
        abbreviation: term.abbreviation ?? null,
        fullName: term.fullName,
        chineseName: term.chineseName ?? null,
        category: term.category,
        oneLine: term.oneLine,
        explanation: term.explanation,
        whyImportant: term.whyImportant,
        relatedTerms: asJson(term.relatedTerms),
        commonMistakes: asJson(term.commonMistakes),
        examples: asJson(term.examples),
        sourceRefs: asJson(term.sourceRefs),
        difficulty: term.difficulty,
      },
    });
  }

  for (const entity of DEFAULT_KNOWLEDGE_ENTITIES) {
    await prisma.knowledgeEntity.upsert({
      where: { slug: entity.slug },
      update: {
        type: entity.type,
        name: entity.name,
        aliases: asJson(entity.aliases),
        oneLine: entity.oneLine,
        whyImportant: entity.whyImportant,
        representativeWorks: asJson(entity.representativeWorks),
        relatedTerms: asJson(entity.relatedTerms),
        timeline: asJson(entity.timeline),
        sourceRefs: asJson(entity.sourceRefs),
        lastVerifiedAt: new Date(entity.lastVerifiedAt),
        confidence: entity.confidence,
        selfCheckQuestion: entity.selfCheckQuestion,
      },
      create: {
        type: entity.type,
        name: entity.name,
        slug: entity.slug,
        aliases: asJson(entity.aliases),
        oneLine: entity.oneLine,
        whyImportant: entity.whyImportant,
        representativeWorks: asJson(entity.representativeWorks),
        relatedTerms: asJson(entity.relatedTerms),
        timeline: asJson(entity.timeline),
        sourceRefs: asJson(entity.sourceRefs),
        lastVerifiedAt: new Date(entity.lastVerifiedAt),
        confidence: entity.confidence,
        selfCheckQuestion: entity.selfCheckQuestion,
      },
    });
  }
}
