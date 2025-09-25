import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable experimental features that might cause issues
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*']
  },
};

export default nextConfig;
