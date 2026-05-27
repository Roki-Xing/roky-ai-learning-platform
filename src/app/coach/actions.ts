"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import {
  createThoughtReview,
  generateFlashcardsForThoughtReview,
} from "@/server/coach/submit";

export async function submitThoughtReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const rawText = String(formData.get("rawText") ?? "").trim();
  const mode = String(formData.get("mode") ?? "free_thought").trim();
  const includeTodayLesson = formData.get("includeTodayLesson") === "on";
  const lessonIdRaw = String(formData.get("lessonId") ?? "").trim();
  const lessonId = lessonIdRaw || null;

  const review = await createThoughtReview({
    userId,
    mode,
    rawText,
    includeTodayLesson,
    lessonId,
  });

  revalidatePath("/coach");
  revalidatePath("/progress");
  if (review.lessonId) revalidatePath("/library");
  redirect(`/coach?reviewId=${encodeURIComponent(review.reviewId)}`);
}

export async function generateCardsFromThoughtReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const reviewId = String(formData.get("reviewId") ?? "").trim();
  if (!reviewId) throw new Error("Missing reviewId");

  const result = await generateFlashcardsForThoughtReview({ userId, reviewId });

  revalidatePath("/coach");
  revalidatePath("/review");
  revalidatePath("/library");
  revalidatePath("/progress");
  redirect(`/coach?reviewId=${encodeURIComponent(result.reviewId)}`);
}
