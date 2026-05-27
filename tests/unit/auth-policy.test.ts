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

test("public auth and health routes stay public", () => {
  for (const path of ["/login", "/auth/confirm", "/api/health", "/favicon.ico"]) {
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
