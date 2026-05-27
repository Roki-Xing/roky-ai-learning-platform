import crypto from "node:crypto";
import { env } from "@/lib/env";

const ADMIN_COOKIE_NAME = "ral_admin";
const ADMIN_PAYLOAD = "admin";

function isProd() {
  return process.env.NODE_ENV === "production";
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function signToken(secret: string) {
  // Keep it simple: this is a capability token for admin debug tools, not user auth.
  return crypto.createHmac("sha256", secret).update(ADMIN_PAYLOAD).digest("base64url");
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function isAdminProtectionEnabled() {
  // In production, /admin must never be open-by-default.
  return isProd() ? true : Boolean(env.ADMIN_SECRET);
}

export function getExpectedAdminToken() {
  if (!env.ADMIN_SECRET) return null;
  return signToken(env.ADMIN_SECRET);
}

export function verifyAdminToken(token: string | null | undefined) {
  if (!env.ADMIN_SECRET) return false; // not configured => deny
  if (!token) return false;
  const expected = signToken(env.ADMIN_SECRET);
  return safeEqual(token, expected);
}

export function verifyAdminSecretOrToken(input: string | null | undefined) {
  if (!env.ADMIN_SECRET) return false;
  if (!input) return false;
  // Accept either the raw secret or the already-derived token, so you can login from a browser
  // without needing a CLI helper.
  if (safeEqual(input, env.ADMIN_SECRET)) return true;
  const expected = signToken(env.ADMIN_SECRET);
  return safeEqual(input, expected);
}
