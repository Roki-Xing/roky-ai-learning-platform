import { requireUser } from "@/server/auth/require-user";

export async function requireUserId() {
  const user = await requireUser();
  return user.id;
}

