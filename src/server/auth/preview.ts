import { cookies } from "next/headers";

export const PREVIEW_SESSION_COOKIE = "ral_preview";
export const PREVIEW_SESSION_TOKEN = "1";

type PreviewPolicyEnv = {
  previewToken?: string | null;
};

function expectedPreviewToken(input: PreviewPolicyEnv = {}) {
  return input.previewToken ?? process.env.PREVIEW_TOKEN ?? null;
}

export function isPreviewTokenValid(
  token: string | null | undefined,
  input: PreviewPolicyEnv = {},
) {
  const expected = expectedPreviewToken(input);
  return Boolean(expected && token && token === expected);
}

export function isPreviewSessionTokenValid(token: string | null | undefined) {
  return token === PREVIEW_SESSION_TOKEN && Boolean(process.env.PREVIEW_TOKEN);
}

export function previewRedirectLocation(nextRaw: string | null | undefined) {
  const next = nextRaw ?? "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function isPreviewMode() {
  const cookieStore = await cookies();
  return isPreviewSessionTokenValid(cookieStore.get(PREVIEW_SESSION_COOKIE)?.value ?? null);
}

export function assertPreviewWritableAllowed(previewMode: boolean) {
  if (previewMode) {
    throw new Error("Preview Mode is read-only");
  }
}

export async function assertWritableRequest() {
  assertPreviewWritableAllowed(await isPreviewMode());
}
