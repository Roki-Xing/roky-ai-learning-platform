import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_SESSION_COOKIE,
  PREVIEW_SESSION_TOKEN,
  isPreviewTokenValid,
  previewRedirectLocation,
} from "@/server/auth/preview";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!isPreviewTokenValid(token)) {
    return NextResponse.json({ ok: false, error: "Invalid preview token" }, { status: 404 });
  }

  const response = new NextResponse(null, {
    status: 307,
    headers: {
      Location: previewRedirectLocation(request.nextUrl.searchParams.get("next")),
    },
  });
  response.cookies.set(PREVIEW_SESSION_COOKIE, PREVIEW_SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
