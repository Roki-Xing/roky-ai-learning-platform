const PROTECTED_PREFIXES = [
  "/",
  "/today",
  "/review",
  "/map",
  "/library",
  "/notes",
  "/progress",
  "/settings",
  "/projects",
  "/coach",
  "/voice",
  "/glossary",
  "/radar",
  "/api",
];

const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/error",
  "/auth/confirm",
  "/api/health",
  "/api/cron/daily",
  "/favicon.ico",
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
