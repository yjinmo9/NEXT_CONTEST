import type { Metadata, NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
});

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
  ],
  images: {
    domains: ['fionhhnbcfygydxzuoqw.supabase.co', 'img.yna.co.kr'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // ← 기본 1mb → 4mb로 확장
    },
  },
};

export default nextConfig;
module.exports = withPWA(nextConfig);
