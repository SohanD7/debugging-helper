/** @type {import('next').NextConfig} */

const nextConfig = {
 experimental: {
  optimizePackageImports: ["framer-motion"],
 },
 async rewrites() {
  return [
   {
    source: "/api/:path*",
    destination: "http://localhost:3001/api/:path*", // Proxy to backend
   },
  ];
 },
};

module.exports = nextConfig;