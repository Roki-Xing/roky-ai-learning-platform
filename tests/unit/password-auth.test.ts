import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test?schema=public";
process.env.CRON_SECRET ??= "test-cron-secret";

async function loadPasswordAuth() {
  return import("@/server/auth/password");
}

test("shared password login stays disabled without configured password", async () => {
  const {
    isPasswordLoginEnabled,
    verifyLoginPassword,
    createPasswordSessionToken,
    isPasswordSessionTokenValid,
  } = await loadPasswordAuth();

  assert.equal(isPasswordLoginEnabled({}), false);
  assert.equal(verifyLoginPassword("anything", {}), false);
  assert.equal(createPasswordSessionToken({}), null);
  assert.equal(isPasswordSessionTokenValid("anything", {}), false);
});

test("shared password login validates secret and signed session token", async () => {
  const {
    isPasswordLoginEnabled,
    verifyLoginPassword,
    createPasswordSessionToken,
    isPasswordSessionTokenValid,
  } = await loadPasswordAuth();

  assert.equal(isPasswordLoginEnabled({ loginPassword: "RokyLearn2026!" }), true);
  assert.equal(
    verifyLoginPassword("RokyLearn2026!", { loginPassword: "RokyLearn2026!" }),
    true,
  );
  assert.equal(
    verifyLoginPassword("wrong-password", { loginPassword: "RokyLearn2026!" }),
    false,
  );

  const token = createPasswordSessionToken({ loginPassword: "RokyLearn2026!" });
  assert.ok(token);
  assert.equal(
    isPasswordSessionTokenValid(token, { loginPassword: "RokyLearn2026!" }),
    true,
  );
  assert.equal(
    isPasswordSessionTokenValid("wrong-token", { loginPassword: "RokyLearn2026!" }),
    false,
  );
});
