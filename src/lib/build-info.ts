import packageJson from "@/../package.json";

export type BuildInfo = {
  appVersion: string;
  gitCommitSha: string;
  buildTime: string;
};

export function getBuildInfo(): BuildInfo {
  return {
    appVersion: process.env.APP_VERSION ?? packageJson.version ?? "0.1.0",
    gitCommitSha:
      process.env.GIT_COMMIT_SHA ??
      process.env.VERCEL_GIT_COMMIT_SHA ??
      "local",
    buildTime: process.env.BUILD_TIME ?? "local",
  };
}
