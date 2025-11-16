/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Use Node.js runtime for Cloudflare Pages compatibility
  experimental: {
    // Supports streaming and server components with Node.js runtime
  },
};

module.exports = nextConfig;
