/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,   // временно отключаем проверку TS
  },
  eslint: {
    ignoreDuringBuilds: true,  // отключаем проверку ESLint
  },
};

module.exports = nextConfig;