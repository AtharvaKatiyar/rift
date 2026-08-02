import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_BASE_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND}/api/v1/:path*`,
      },
      {
        source: "/u/:path*",
        destination: `${BACKEND}/u/:path*`,
      },
    ];
  },
};

export default nextConfig;
