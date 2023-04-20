const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/app/deck/:id",
        destination: "/app/deck/:id/card",
        permanent: true,
      },
      {
        source: "/app/deck/:id/subdeck",
        destination: "/app/deck/:id/subdeck/link",
        permanent: true,
      },
    ];
  },
};
module.exports = withBundleAnalyzer(nextConfig);
