/** @type {import('next').NextConfig} */

const nextConfig = {
 experimental: {
  optimizePackageImports: ["framer-motion"],
 },
 async rewrites() {
  return [
   {
    source: "/api/:path*",
    destination: "https://debugging-helper-backend.onrender.com/api/:path*", // Proxy to Render backend
   },
  ];
 },
};

module.exports = nextConfig;
