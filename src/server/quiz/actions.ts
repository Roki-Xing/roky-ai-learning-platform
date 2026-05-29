"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import { assertWritableRequest } from "@/server/auth/preview";
import { submitQuizAttempt } from "@/server/quiz/submit";

export async function submitQuizAttemptAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const questionId = String(formData.get("questionId") ?? "").trim();
  if (!questionId) throw new Error("Missing questionId");

  await submitQuizAttempt({
    userId,
    questionId,
    rawAnswerValues: formData.getAll("userAnswer"),
  });

  revalidatePath("/today");
  revalidatePath("/progress");
  revalidatePath("/map");
}
