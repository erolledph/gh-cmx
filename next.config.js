/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow unoptimized images for broader compatibility
  images: {
    unoptimized: true,
  },
  // Disable static optimization errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
