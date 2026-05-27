"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/server/auth/user";
import { submitCodeForReview } from "@/server/coding/submit";

function isMissingTableError(err: unknown) {
  const rec =
    typeof err === "object" && err !== null
      ? (err as Record<string, unknown>)
      : null;
  const code = rec && typeof rec.code === "string" ? rec.code : null;
  const message = rec && typeof rec.message === "string" ? rec.message : "";
  // Prisma known request error for missing table/collection can surface as P2021.
  if (code === "P2021") return true;
  // Postgres "relation does not exist" can also bubble up in some environments.
  if (
    message.toLowerCase().includes("does not exist") &&
    (message.includes("CodeSubmission") || message.includes("CodeFeedback"))
  ) {
    return true;
  }
  return false;
}

export async function saveCodeSubmissionAction(formData: FormData) {
  const userId = await requireUserId();

  const lessonId = String(formData.get("lessonId") ?? "").trim();
  const localDate = String(formData.get("localDate") ?? "").trim();
  const languageRaw = String(formData.get("language") ?? "python").trim();
  const language = languageRaw || "python";
  const code = String(formData.get("code") ?? "");

  if (!lessonId) throw new Error("Missing lessonId");
  if (!localDate) throw new Error("Missing localDate");
  if (!code.trim()) throw new Error("Missing code");

  try {
    await submitCodeForReview({
      userId,
      lessonId,
      localDate,
      language,
      code,
    });
  } catch (e) {
    if (isMissingTableError(e)) {
      throw new Error(
        "代码提交反馈表未迁移。请先执行相关手动迁移。",
      );
    }
    throw e;
  }

  revalidatePath("/today");
  revalidatePath("/library");
  revalidatePath("/progress");
}
