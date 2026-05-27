"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/server/auth/user";
import { prisma } from "@/server/db";
import { asJson, buildGlossaryFlashcard } from "@/server/knowledge/base";

function toStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export async function generateGlossaryFlashcardAction(formData: FormData) {
  const userId = await requireUserId();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("Missing glossary slug");

  const term = await prisma.glossaryTerm.findUnique({ where: { slug } });
  if (!term) throw new Error("Glossary term not found");

  const relatedTerms = toStrings(term.relatedTerms);
  const card = buildGlossaryFlashcard({
    userId,
    slug: term.slug,
    front: `${term.abbreviation ?? term.fullName} 是什么？`,
    back: [
      term.oneLine,
      term.explanation,
      term.whyImportant ? `重要性：${term.whyImportant}` : null,
    ]
      .filter((x): x is string => Boolean(x))
      .join("\n\n"),
    tags: [term.category, term.difficulty, ...relatedTerms.slice(0, 3)],
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
        type: card.type,
        tags: asJson(card.tags),
        dueAt: card.dueAt,
      },
    ],
    skipDuplicates: true,
  });

  revalidatePath("/glossary");
  revalidatePath("/review");
  revalidatePath("/progress");
  redirect(`/glossary?term=${encodeURIComponent(term.slug)}`);
}
