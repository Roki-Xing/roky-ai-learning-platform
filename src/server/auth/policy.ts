const PROTECTED_PREFIXES = [
  "/",
  "/today",
  "/review",
  "/path",
  "/weekly",
  "/map",
  "/library",
  "/notes",
  "/progress",
  "/settings",
  "/projects",
  "/mistakes",
  "/coach",
  "/voice",
  "/glossary",
  "/radar",
  "/api",
];

const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/error",
  "/preview",
  "/auth/confirm",
  "/api/health",
  "/api/cron/daily",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/admin",
];

export function isProtectedPath(pathname: string) {
  if (PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p))) {
    return false;
  }
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export function shouldRedirectToLogin(args: {
  pathname: string;
  userId: string | null;
  demoSessionActive: boolean;
}) {
  if (!isProtectedPath(args.pathname)) return false;
  return !args.userId && !args.demoSessionActive;
}
