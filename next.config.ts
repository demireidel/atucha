import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  experimental: { reactCompiler: false },
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false }
};
export default nextConfig;
