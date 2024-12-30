/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
 
  // Add any additional configuration you need here
// Optional: Only if you want to disable SSR entirely
  // You can add other settings here as well, such as:
  // distDir: 'build',
  // images: { domains: ['example.com'] },
};

export default nextConfig;
