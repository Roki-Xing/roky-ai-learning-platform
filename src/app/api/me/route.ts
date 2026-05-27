import { createClient } from "@/lib/supabase/server";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return Response.json({ error: "Supabase not configured" }, { status: 501 });
  }
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;
  if (error || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getOrCreateUserProfile({ userId });

  return Response.json({
    userId,
    profile,
  });
}
