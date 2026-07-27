import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/produtos',
        destination: '/produtos/index.html',
      },
      {
        source: '/produtos/:id',
        destination: '/produtos/index.html',
      },
    ];
  },
};

export default nextConfig;
