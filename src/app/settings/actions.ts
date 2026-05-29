"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUserId } from "@/server/auth/user";
import {
  settingsSavedRedirectPath,
  updateUserProfileSettings,
} from "@/server/profile/settings";
import { assertWritableRequest } from "@/server/auth/preview";

export async function updateSettingsAction(formData: FormData) {
  await assertWritableRequest();
  const userId = await requireUserId();

  const displayNameRaw = String(formData.get("displayName") ?? "").trim();
  const displayName = displayNameRaw ? displayNameRaw : null;

  const goal = String(formData.get("goal") ?? "ai_general").trim() || "ai_general";
  const level = String(formData.get("level") ?? "beginner").trim() || "beginner";
  const language = String(formData.get("language") ?? "zh").trim() || "zh";
  const difficulty = String(formData.get("difficulty") ?? "standard").trim() || "standard";
  const timeZone = String(formData.get("timeZone") ?? "Asia/Shanghai").trim() || "Asia/Shanghai";

  const dailyMinutesRaw = String(formData.get("dailyMinutes") ?? "").trim();
  const dailyMinutesParsed = Number.parseInt(dailyMinutesRaw, 10);
  const dailyMinutes = Number.isFinite(dailyMinutesParsed) ? Math.max(5, Math.min(240, dailyMinutesParsed)) : 30;

  const preferredAreasRaw = String(formData.get("preferredAreas") ?? "");
  const preferredTermSlugsRaw = String(formData.get("preferredTermSlugs") ?? "");
  const preferredEntitySlugsRaw = String(formData.get("preferredEntitySlugs") ?? "");
  const knowledgeAvoidDaysRaw = String(formData.get("knowledgeAvoidDays") ?? "").trim();
  const knowledgeAvoidDaysParsed = Number.parseInt(knowledgeAvoidDaysRaw, 10);

  await updateUserProfileSettings({
    userId,
    displayName,
    goal,
    level,
    language,
    difficulty,
    dailyMinutes,
    timeZone,
    preferredAreasText: preferredAreasRaw,
    preferredTermSlugsText: preferredTermSlugsRaw,
    preferredEntitySlugsText: preferredEntitySlugsRaw,
    knowledgeAvoidDays: Number.isFinite(knowledgeAvoidDaysParsed)
      ? knowledgeAvoidDaysParsed
      : 7,
  });

  revalidatePath("/settings");
  revalidatePath("/today");
  redirect(settingsSavedRedirectPath());
}
