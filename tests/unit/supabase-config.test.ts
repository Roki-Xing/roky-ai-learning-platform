import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test?schema=public";
process.env.CRON_SECRET ??= "test-cron-secret";

async function loadConfig() {
  return import("@/lib/supabase/config");
}

test("Supabase auth requires both a real project URL and a real public key", async () => {
  const { isSupabaseAuthConfigured } = await loadConfig();
  assert.equal(isSupabaseAuthConfigured({}), false);
  assert.equal(
    isSupabaseAuthConfigured({
      supabaseUrl: "https://YOUR_PROJECT.supabase.co",
      supabasePublicKey: "live-key",
    }),
    false,
  );
  assert.equal(
    isSupabaseAuthConfigured({
      supabaseUrl: "https://demo.supabase.co",
      supabasePublicKey: "YOUR_ANON_KEY",
    }),
    false,
  );
  assert.equal(
    isSupabaseAuthConfigured({
      supabaseUrl: "https://demo.supabase.co",
      supabasePublicKey: "live-key",
    }),
    true,
  );
});

test("Supabase auth also accepts anon key fallback names", async () => {
  const { isSupabaseAuthConfigured } = await loadConfig();
  assert.equal(
    isSupabaseAuthConfigured({
      supabaseUrl: "https://demo.supabase.co",
      supabaseAnonKey: "live-anon-key",
    }),
    true,
  );
});
