/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  // API routes require server-side rendering
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig