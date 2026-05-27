import { getCurrentUser } from "@/server/auth/current-user";

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
