"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import { createScopedNote } from "@/server/notes/create-note";

export async function createNoteAction(formData: FormData) {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const lessonIdRaw = String(formData.get("lessonId") ?? "").trim();
  const lessonId = lessonIdRaw ? lessonIdRaw : null;

  await createScopedNote({ userId, lessonId, title, content });

  revalidatePath("/notes");
  revalidatePath("/library");
  revalidatePath("/progress");
}
