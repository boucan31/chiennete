import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Railway automatically sets PORT, but we can also use it explicitly
  // Retiré: output: 'standalone' - cause des problèmes avec Railway (next start ne fonctionne pas avec standalone)
  
  // Allow images from Shopify
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  
  // Headers pour permettre l'iframe dans Shopify
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Ne pas mettre X-Frame-Options si on veut permettre l'embedding
          // Utiliser uniquement Content-Security-Policy
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *; frame-src *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
