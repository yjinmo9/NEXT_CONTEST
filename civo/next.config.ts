import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'https://192.168.219.101:3000', // 요청을 보낼 수 있는 origin 명시
    'https://192.168.219.106:3000',
  ],
};

export default nextConfig;
