import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.198"],
};

export default function nextConfigFunc() {
  return nextConfig;
}