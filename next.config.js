/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    domains: ['localhost', 'i.ibb.co'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure proper resolution of modules
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js'];
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Explicitly tell Next.js we're using src directory
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
