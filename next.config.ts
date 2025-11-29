import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  devIndicators: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  }
};
export default nextConfig;
