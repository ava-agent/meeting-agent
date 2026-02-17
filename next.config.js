/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Note: typescript.ignoreBuildErrors is removed to enforce type safety
  // Run 'npm run type-check' to verify all types are correct before production build
}

module.exports = nextConfig
