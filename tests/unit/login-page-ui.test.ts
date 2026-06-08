import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("login page CTAs keep mobile-friendly touch targets", () => {
  const pageSource = readFileSync("src/app/login/page.tsx", "utf8");
  const passwordFormSource = readFileSync("src/app/login/ui/password-login-form.tsx", "utf8");
  const emailFormSource = readFileSync("src/app/login/ui/login-form.tsx", "utf8");

  assert.match(pageSource, /const loginCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(passwordFormSource, /const passwordLoginCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(emailFormSource, /const emailLoginCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const demoButtonIndex = pageSource.indexOf("进入 Demo 模式");
  assert.notEqual(demoButtonIndex, -1);
  const demoButtonBlock = pageSource.slice(Math.max(0, demoButtonIndex - 180), demoButtonIndex + 80);
  assert.match(demoButtonBlock, /className=\{loginCtaClassName\}/);

  const passwordButtonIndex = passwordFormSource.indexOf("用访问密码进入");
  assert.notEqual(passwordButtonIndex, -1);
  const passwordButtonBlock = passwordFormSource.slice(
    Math.max(0, passwordButtonIndex - 180),
    passwordButtonIndex + 80,
  );
  assert.match(passwordButtonBlock, /className=\{passwordLoginCtaClassName\}/);

  const emailButtonIndex = emailFormSource.lastIndexOf("发送登录链接");
  assert.notEqual(emailButtonIndex, -1);
  const emailButtonBlock = emailFormSource.slice(
    Math.max(0, emailButtonIndex - 180),
    emailButtonIndex + 80,
  );
  assert.match(emailButtonBlock, /className=\{emailLoginCtaClassName\}/);
});

test("login form inputs keep mobile-friendly touch targets", () => {
  const passwordFormSource = readFileSync("src/app/login/ui/password-login-form.tsx", "utf8");
  const emailFormSource = readFileSync("src/app/login/ui/login-form.tsx", "utf8");

  assert.match(passwordFormSource, /const passwordLoginInputClassName = "min-h-11";/);
  assert.match(emailFormSource, /const emailLoginInputClassName = "min-h-11";/);

  const passwordInputIndex = passwordFormSource.indexOf('name="password"');
  assert.notEqual(passwordInputIndex, -1);
  const passwordInputBlock = passwordFormSource.slice(
    passwordInputIndex - 120,
    passwordInputIndex + 220,
  );
  assert.match(passwordInputBlock, /className=\{passwordLoginInputClassName\}/);

  const emailInputIndex = emailFormSource.indexOf('type="email"');
  assert.notEqual(emailInputIndex, -1);
  const emailInputBlock = emailFormSource.slice(
    emailInputIndex - 120,
    emailInputIndex + 240,
  );
  assert.match(emailInputBlock, /className=\{emailLoginInputClassName\}/);
});
