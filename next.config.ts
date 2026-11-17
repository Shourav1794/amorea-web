import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.197",
    "192.168.1.198",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default function nextConfigFunc() {
  return nextConfig;
}