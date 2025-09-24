import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Only ignore specific files that might cause issues with nodemon
      config.watchOptions = {
        ignored: ['node_modules/**', '.next/**', 'dev.log', 'server.log'],
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Ensure static files are served correctly
  output: 'standalone',
};

export default nextConfig;
