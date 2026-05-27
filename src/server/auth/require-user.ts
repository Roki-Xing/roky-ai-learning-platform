import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/current-user";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

