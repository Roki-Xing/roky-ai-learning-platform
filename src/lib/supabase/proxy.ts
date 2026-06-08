import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/config";
import { DEMO_SESSION_COOKIE, isDemoSessionTokenValid } from "@/server/auth/demo";
import {
  PASSWORD_SESSION_COOKIE,
  isPasswordSessionTokenValid,
} from "@/server/auth/password";
import {
  PREVIEW_SESSION_COOKIE,
  isPreviewSessionTokenValid,
} from "@/server/auth/preview";
import { shouldRedirectToLogin } from "@/server/auth/policy";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const demoSessionActive = isDemoSessionTokenValid(
    request.cookies.get(DEMO_SESSION_COOKIE)?.value ?? null,
  );
  const passwordSessionActive = isPasswordSessionTokenValid(
    request.cookies.get(PASSWORD_SESSION_COOKIE)?.value ?? null,
  );
  const previewSessionActive = isPreviewSessionTokenValid(
    request.cookies.get(PREVIEW_SESSION_COOKIE)?.value ?? null,
  );
  const localSessionActive =
    demoSessionActive || passwordSessionActive || previewSessionActive;

  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();
  if (!url || !key) {
    if (shouldRedirectToLogin({ pathname, userId: null, demoSessionActive: localSessionActive })) {
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = "/login";
      redirectTo.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectTo);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );

          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getClaims().
  // IMPORTANT: removing getClaims() can cause users to be randomly logged out
  // when using SSR with Supabase.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub ?? null;

  if (shouldRedirectToLogin({ pathname, userId, demoSessionActive: localSessionActive })) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectTo);
  }

  return supabaseResponse;
}
