"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import { assertWritableRequest } from "@/server/auth/preview";
import { getOrCreateTodayPlan, completeTodayPlan } from "@/server/lesson/daily-plan";
import { saveGuidedProgress } from "@/server/lesson/guided-progress";
import { startOfDayUTC } from "@/server/time/day";

export async function generateTodayAction() {
  await assertWritableRequest();
  const userId = await requireUserId();
  await getOrCreateTodayPlan({ userId });
  revalidatePath("/today");
}

export async function completeTodayAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const reflection = (formData.get("reflection") as string | null) ?? null;
  const dateStr = (formData.get("date") as string | null) ?? null;
  const date = dateStr ? new Date(dateStr) : startOfDayUTC(new Date());
  await completeTodayPlan({ userId, date, reflection });

  revalidatePath("/today");
  revalidatePath("/review");
  revalidatePath("/library");
  revalidatePath("/notes");
  revalidatePath("/progress");
}

export async function saveGuidedProgressAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();
  const planId = String(formData.get("planId") ?? "");
  const activeStep = Number(formData.get("activeStep") ?? 0);
  const stepCount = Number(formData.get("stepCount") ?? 0);
  const answers: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("answer:")) continue;
    const index = key.slice("answer:".length);
    answers[index] = String(value ?? "");
  }

  await saveGuidedProgress({
    userId,
    planId,
    stepCount,
    input: { activeStep, answers },
  });

  revalidatePath("/today");
}
