import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Railway automatically sets PORT, but we can also use it explicitly
  output: 'standalone', // Optimized for Railway deployment
};

export default nextConfig;
