/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint: { ignoreDuringBuilds: true } - НЕ РАБОТАЕТ, удалите этот блок
};

module.exports = nextConfig;