import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Keep only non-conflicting redirects. Do NOT redirect /blog or /blog/
      // — that caused a 308 loop (Blog button appeared broken).
      { source: "/pricing", destination: "/#pricing", permanent: false },
    ];
  },
};

export default nextConfig;
