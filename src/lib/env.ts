import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Avoid treating empty strings as real values, so defaults can apply.
  // Also helps when an env var is present but blank in a .env file.
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    // Optional: protect /admin debug tools in production.
    // If set, /admin requires a matching `ral_admin` httpOnly cookie.
    ADMIN_SECRET: z.string().min(1).optional(),
    // Optional: DeepSeek (OpenAI-compatible) for Sprint 2 structured generation.
    // Keep this server-side only. Never expose to client bundles.
    DEEPSEEK_API_KEY: z.string().min(1).optional(),
    DEEPSEEK_BASE_URL: z.string().url().optional(),
    DEEPSEEK_MODEL: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_TRANSCRIBE_MODEL: z.string().min(1).optional(),
    ALLOW_DEMO_USER: z.string().optional(),
    LOGIN_PASSWORD: z.string().min(4).optional(),
    PREVIEW_TOKEN: z.string().min(16).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
});
