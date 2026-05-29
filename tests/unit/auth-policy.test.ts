import test from "node:test";
import assert from "node:assert/strict";
import {
  isProtectedPath,
  shouldRedirectToLogin,
} from "@/server/auth/policy";
import {
  isDemoSessionTokenValid,
  isDemoUserAllowed,
} from "@/server/auth/demo";
import {
  previewRedirectLocation,
  isPreviewSessionTokenValid,
  isPreviewTokenValid,
} from "@/server/auth/preview";

test("learning data routes are protected by auth policy", () => {
  for (const path of [
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
    "/api/me",
  ]) {
    assert.equal(isProtectedPath(path), true, `${path} should be protected`);
  }
});

test("public auth, preview, admin login shell, and health routes stay public", () => {
  for (const path of ["/login", "/preview", "/admin", "/auth/confirm", "/api/health", "/favicon.ico"]) {
    assert.equal(isProtectedPath(path), false, `${path} should be public`);
  }
});

test("demo user requires explicit opt-in in production", () => {
  assert.equal(isDemoUserAllowed({ nodeEnv: "development" }), true);
  assert.equal(isDemoUserAllowed({ nodeEnv: "test" }), true);
  assert.equal(isDemoUserAllowed({ nodeEnv: "production" }), false);
  assert.equal(
    isDemoUserAllowed({ nodeEnv: "production", allowDemoUser: "true" }),
    true,
  );
});

test("demo session token is only valid when demo mode is allowed", () => {
  assert.equal(
    isDemoSessionTokenValid("1", { nodeEnv: "production" }),
    false,
  );
  assert.equal(
    isDemoSessionTokenValid("1", {
      nodeEnv: "production",
      allowDemoUser: "true",
    }),
    true,
  );
  assert.equal(
    isDemoSessionTokenValid("bad", {
      nodeEnv: "production",
      allowDemoUser: "true",
    }),
    false,
  );
});

test("preview token and session token require configured preview secret", () => {
  const previous = process.env.PREVIEW_TOKEN;
  delete process.env.PREVIEW_TOKEN;

  try {
    assert.equal(isPreviewTokenValid("secret"), false);
    assert.equal(isPreviewSessionTokenValid("1"), false);
  } finally {
    if (previous) process.env.PREVIEW_TOKEN = previous;
  }

  assert.equal(isPreviewTokenValid("right", { previewToken: "right" }), true);
  assert.equal(isPreviewTokenValid("wrong", { previewToken: "right" }), false);

  process.env.PREVIEW_TOKEN = "a-preview-token-value";
  try {
    assert.equal(isPreviewSessionTokenValid("1"), true);
    assert.equal(isPreviewSessionTokenValid("bad"), false);
  } finally {
    if (previous) process.env.PREVIEW_TOKEN = previous;
    else delete process.env.PREVIEW_TOKEN;
  }
});

test("preview redirect uses only relative same-site locations", () => {
  assert.equal(previewRedirectLocation("/today"), "/today");
  assert.equal(
    previewRedirectLocation("/review?source=thought-review"),
    "/review?source=thought-review",
  );
  assert.equal(previewRedirectLocation("//evil.test/today"), "/");
  assert.equal(previewRedirectLocation("https://evil.test/today"), "/");
  assert.equal(previewRedirectLocation("today"), "/");
});

test("protected routes redirect without real user or active demo session", () => {
  assert.equal(
    shouldRedirectToLogin({
      pathname: "/projects",
      userId: null,
      demoSessionActive: false,
    }),
    true,
  );
  assert.equal(
    shouldRedirectToLogin({
      pathname: "/projects",
      userId: "user-1",
      demoSessionActive: false,
    }),
    false,
  );
  assert.equal(
    shouldRedirectToLogin({
      pathname: "/projects",
      userId: null,
      demoSessionActive: true,
    }),
    false,
  );
  assert.equal(
    shouldRedirectToLogin({
      pathname: "/login",
      userId: null,
      demoSessionActive: false,
    }),
    false,
  );
});
