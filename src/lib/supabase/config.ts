import { env } from "@/lib/env";

type SupabaseConfigInput = {
  supabaseUrl?: string | null;
  supabaseAnonKey?: string | null;
  supabasePublishableKey?: string | null;
  supabasePublicKey?: string | null;
};

export function getSupabaseUrl(input: SupabaseConfigInput = {}) {
  const url = input.supabaseUrl ?? env.NEXT_PUBLIC_SUPABASE_URL;
  // Treat placeholder values as "not configured" to avoid auth redirects
  // in local/dev environments that haven't set up Supabase yet.
  if (!url || url.includes("YOUR_PROJECT")) return undefined;
  return url;
}

export function getSupabasePublicKey(input: SupabaseConfigInput = {}) {
  // Supabase docs historically used `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  // Newer docs / transitions may use "publishable" keys.
  // We accept either to reduce setup friction.
  const key =
    input.supabasePublicKey ??
    input.supabasePublishableKey ??
    input.supabaseAnonKey ??
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Same placeholder guard as getSupabaseUrl().
  if (!key || key.includes("YOUR_ANON_KEY") || key.includes("YOUR_PUBLISHABLE")) {
    return undefined;
  }
  return key;
}

export function isSupabaseAuthConfigured(input: SupabaseConfigInput = {}) {
  return Boolean(getSupabaseUrl(input) && getSupabasePublicKey(input));
}
