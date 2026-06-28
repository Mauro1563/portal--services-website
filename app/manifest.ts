import type { MetadataRoute } from 'next';

/**
 * Web App Manifest — enables the "Add to home screen" install prompt
 * on Chrome / Edge / Android. The operative portal's PWAInstall banner
 * relies on this being served at /manifest.webmanifest.
 *
 * Icons reuse the existing brand asset. If we later split icons by
 * portal (cleaner / owner / HQ) we can dynamically generate per-route
 * manifests with a route handler.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zapli',
    short_name: 'Zapli',
    description:
      'Plataforma para empresas de limpieza de hogar y gestión de Airbnb.',
    start_url: '/operative',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
