import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:5000";
    
    // Automatically upgrade to HTTPS for production domains to prevent Mixed Content issues
    if (backendUrl.includes('onrender.com') || backendUrl.includes('vercel.app')) {
      backendUrl = backendUrl.replace('http://', 'https://');
    }

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
