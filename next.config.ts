import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Voice notes can upload audio for server-side transcription.
    // Next.js Server Actions default to 1MB; we cap audio files at 20MB in app code.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
