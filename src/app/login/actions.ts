"use server";

import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_TOKEN,
  isDemoUserAllowed,
} from "@/server/auth/demo";
import {
  PASSWORD_SESSION_COOKIE,
  createPasswordSessionToken,
  isPasswordLoginEnabled,
  verifyLoginPassword,
} from "@/server/auth/password";
import { PREVIEW_SESSION_COOKIE } from "@/server/auth/preview";

function safeNextLocation(nextRaw: unknown) {
  const next = String(nextRaw ?? "/today");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/today";
}

export async function signInWithEmailLink(args: {
  email: string;
  next?: string;
}) {
  const supabase = await createClient();
  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase 未配置。请配置 Supabase，或在允许 demo 模式时使用 Demo 入口。",
    };
  }
  const origin = env.NEXT_PUBLIC_SITE_URL ?? null;

  const redirectTo = origin
    ? `${origin}/auth/confirm?next=${encodeURIComponent(args.next ?? "/today")}`
    : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email: args.email,
    options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const };
}

export async function startPasswordSessionAction(
  _prevState: { message: string | null },
  formData: FormData,
): Promise<{ message: string | null }> {
  if (!isPasswordLoginEnabled()) {
    return { message: "当前服务器还没配置访问密码。" };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyLoginPassword(password)) {
    return { message: "访问密码不正确，请重试。" };
  }

  const sessionToken = createPasswordSessionToken();
  if (!sessionToken) {
    return { message: "当前服务器还没配置访问密码。" };
  }

  const safeNext = safeNextLocation(formData.get("next"));
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_SESSION_COOKIE);
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.set(PASSWORD_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect(safeNext);
}

export async function startDemoSessionAction(formData: FormData) {
  if (!isDemoUserAllowed()) {
    throw new Error("Demo mode is not enabled");
  }

  const safeNext = safeNextLocation(formData.get("next"));
  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_SESSION_COOKIE);
  cookieStore.delete(PASSWORD_SESSION_COOKIE);
  cookieStore.set(DEMO_SESSION_COOKIE, DEMO_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(safeNext);
}
