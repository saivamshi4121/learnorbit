import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://127.0.0.1:65000/uploads/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:65000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
