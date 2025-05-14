import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'https://192.168.219.101:3000', // 요청을 보낼 수 있는 origin 명시
    'https://192.168.219.106:3000',
    'https://192.168.0.43:3000',
    'https://10.121.185.76:3000',
    'https://172.30.1.91:3000'
  ],
  images: {
    domains: ['fionhhnbcfygydxzuoqw.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // ← 기본 1mb → 4mb로 확장
    },
  },
};

export default nextConfig;
