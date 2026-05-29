import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_SESSION_COOKIE,
  PREVIEW_SESSION_TOKEN,
  isPreviewTokenValid,
} from "@/server/auth/preview";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!isPreviewTokenValid(token)) {
    return NextResponse.json({ ok: false, error: "Invalid preview token" }, { status: 404 });
  }

  const nextRaw = request.nextUrl.searchParams.get("next") ?? "/";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.search = "";

  const response = NextResponse.redirect(redirectTo);
  response.cookies.set(PREVIEW_SESSION_COOKIE, PREVIEW_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
