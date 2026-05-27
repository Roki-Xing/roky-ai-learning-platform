export const DEMO_USER_ID = "demo-user";
export const DEMO_SESSION_COOKIE = "ral_demo";
export const DEMO_SESSION_TOKEN = "1";

export type DemoUser = {
  id: string;
};

export type DemoPolicyEnv = {
  nodeEnv?: string;
  allowDemoUser?: string | boolean | null;
};

function isTruthy(value: string | boolean | null | undefined) {
  if (value === true) return true;
  if (value === false || value == null) return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export function isDemoUserAllowed(input: DemoPolicyEnv = {}) {
  const nodeEnv = input.nodeEnv ?? process.env.NODE_ENV;
  const allowDemoUser = input.allowDemoUser ?? process.env.ALLOW_DEMO_USER;
  return nodeEnv !== "production" || isTruthy(allowDemoUser);
}

export function isDemoSessionTokenValid(
  token: string | null | undefined,
  input: DemoPolicyEnv = {},
) {
  return token === DEMO_SESSION_TOKEN && isDemoUserAllowed(input);
}

export function getDemoUser(): DemoUser {
  return { id: DEMO_USER_ID };
}
