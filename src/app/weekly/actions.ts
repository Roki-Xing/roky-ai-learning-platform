"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertWritableRequest } from "@/server/auth/preview";
import { requireUserId } from "@/server/auth/user";
import { createScopedNote } from "@/server/notes/create-note";

export async function saveWeeklyReflectionAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();

  const windowLabel = String(formData.get("windowLabel") ?? "").trim();
  const titleInput = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const title = titleInput || `每周复盘：${windowLabel || "本周"}`;

  const note = await createScopedNote({
    userId,
    lessonId: null,
    title,
    content,
  });

  revalidatePath("/weekly");
  revalidatePath("/notes");
  redirect(`/notes?noteId=${encodeURIComponent(note.id)}`);
}
