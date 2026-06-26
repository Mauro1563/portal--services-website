const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Trim the lucide-react import path so we ship only the icons we
  // actually use instead of the whole barrel. Easy ~80–120kb win on
  // most route bundles in this app.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: 'hq.portalservices.digital' }],
          destination: '/welcome',
        },
      ],
    };
  },
};

module.exports = withNextIntl(nextConfig);
