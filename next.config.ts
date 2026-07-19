import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pricing", destination: "/#pricing", permanent: false },
      { source: "/Blog", destination: "/blog", permanent: true },
      { source: "/blog/", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
