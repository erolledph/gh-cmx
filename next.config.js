/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
<<<<<<< HEAD
  // Use Node.js runtime for Cloudflare Pages compatibility
  experimental: {
    // Supports streaming and server components with Node.js runtime
=======
  typescript: {
    ignoreBuildErrors: true,
>>>>>>> 42e84fb510b195b84c78169287928f02de69cf65
  },
};

module.exports = nextConfig;
