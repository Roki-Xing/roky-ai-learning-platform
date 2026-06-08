import crypto from "node:crypto";
import { env } from "@/lib/env";

export const PASSWORD_SESSION_COOKIE = "ral_password";

const PASSWORD_SESSION_PAYLOAD = "shared-password-access";

type PasswordAuthEnv = {
  loginPassword?: string | null;
};

function configuredLoginPassword(input: PasswordAuthEnv = {}) {
  const password = input.loginPassword ?? env.LOGIN_PASSWORD ?? null;
  const trimmed = password?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function signSessionToken(secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(PASSWORD_SESSION_PAYLOAD)
    .digest("base64url");
}

export function isPasswordLoginEnabled(input: PasswordAuthEnv = {}) {
  return Boolean(configuredLoginPassword(input));
}

export function verifyLoginPassword(
  inputPassword: string | null | undefined,
  input: PasswordAuthEnv = {},
) {
  const password = configuredLoginPassword(input);
  if (!password || !inputPassword) return false;
  return safeEqual(inputPassword, password);
}

export function createPasswordSessionToken(input: PasswordAuthEnv = {}) {
  const password = configuredLoginPassword(input);
  if (!password) return null;
  return signSessionToken(password);
}

export function isPasswordSessionTokenValid(
  token: string | null | undefined,
  input: PasswordAuthEnv = {},
) {
  const expected = createPasswordSessionToken(input);
  if (!expected || !token) return false;
  return safeEqual(token, expected);
}
