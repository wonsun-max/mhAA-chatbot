import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://*.google.com https://apis.google.com https://*.instagram.com https://www.instagram.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://*.openai.com https://*.supabase.co https://*.vercel-storage.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.google.com https://stats.g.doubleclick.net; frame-src https://www.youtube-nocookie.com https://www.youtube.com https://accounts.google.com https://www.instagram.com https://*.instagram.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
