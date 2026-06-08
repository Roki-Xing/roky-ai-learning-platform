import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  // Avoid any redirect loops by allowing the confirm endpoint.
  if (request.nextUrl.pathname.startsWith("/auth/confirm")) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (dev runtime websocket)
     * - favicon.ico (favicon file)
     * - manifest.webmanifest (PWA install metadata, public)
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
