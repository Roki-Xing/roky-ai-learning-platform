"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import {
  asJson,
  buildEntityFlashcard,
  knowledgeEntityVerificationTags,
} from "@/server/knowledge/base";

function toStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function cardTypeForEntity(type: string) {
  if (type === "person") return "person";
  if (type === "benchmark") return "benchmark";
  return "concept";
}

export async function generateRadarFlashcardAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("Missing radar slug");

  const entity = await prisma.knowledgeEntity.findUnique({ where: { slug } });
  if (!entity) throw new Error("Radar entity not found");

  const relatedTerms = toStrings(entity.relatedTerms);
  const representativeWorks = toStrings(entity.representativeWorks);
  const card = buildEntityFlashcard({
    userId,
    slug: entity.slug,
    front: `${entity.name} 为什么值得关注？`,
    back: [
      entity.oneLine,
      entity.whyImportant ? `重要性：${entity.whyImportant}` : null,
      representativeWorks.length ? `代表内容：${representativeWorks.join(" / ")}` : null,
      entity.selfCheckQuestion ? `自测：${entity.selfCheckQuestion}` : null,
    ]
      .filter((x): x is string => Boolean(x))
      .join("\n\n"),
    tags: [
      entity.type,
      ...knowledgeEntityVerificationTags({
        sourceRefs: entity.sourceRefs,
        lastVerifiedAt: entity.lastVerifiedAt,
        confidence: entity.confidence,
      }),
      ...relatedTerms.slice(0, 3),
    ],
  });

  await prisma.userProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  await prisma.flashcard.createMany({
    data: [
      {
        id: card.id,
        userId: card.userId,
        lessonId: card.lessonId,
        front: card.front,
        back: card.back,
        type: cardTypeForEntity(entity.type),
        tags: asJson(card.tags),
        dueAt: card.dueAt,
      },
    ],
    skipDuplicates: true,
  });

  revalidatePath("/radar");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/radar?entity=${encodeURIComponent(entity.slug)}`);
}
