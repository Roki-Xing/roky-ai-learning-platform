import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  DEMO_SESSION_COOKIE,
  getDemoUser,
  isDemoSessionTokenValid,
} from "@/server/auth/demo";

export async function getCurrentUser() {
  const supabase = await createClient();
  if (supabase) {
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();
    if (!claimsError && claimsData?.claims?.sub) {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) return data.user;
    }
  }

  const cookieStore = await cookies();
  const demoToken = cookieStore.get(DEMO_SESSION_COOKIE)?.value ?? null;
  if (isDemoSessionTokenValid(demoToken)) return getDemoUser();

  return null;
}
