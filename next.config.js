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
        // Alan's Cleaner — standalone single-file SPA served from
        // /public/alan.html. Rewrite lets the pretty URL /alan (and
        // /alan/anything) resolve without exposing the .html suffix.
        // If we later split it into its own Vercel project on a
        // subdomain, drop this rewrite and delete public/alan.html.
        { source: '/alan', destination: '/alan.html' },
        { source: '/alan/:path*', destination: '/alan.html' },
        // Enterprise architecture briefing — standalone single-file
        // page served from /public/briefing.html. Reachable at both
        // /demo (the primary sales-share URL) and /briefing (alias).
        // Same pattern as /alan above; rewrite keeps the .html
        // suffix off the URL.
        { source: '/demo', destination: '/briefing.html' },
        { source: '/briefing', destination: '/briefing.html' },
      ],
    };
  },
};

module.exports = withNextIntl(nextConfig);
