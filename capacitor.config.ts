import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor wraps the live web app into a native iOS shell.
 * `server.url` makes the app load https://portalservices.digital directly,
 * so every deploy on Vercel reaches the app instantly without rebuilding
 * a binary. The native shell still adds Camera + GPS + status-bar + splash
 * which is what Apple looks for to approve a webview-based app.
 */
const config: CapacitorConfig = {
  appId: 'com.portalservices.digital',
  appName: 'Portal Services',
  webDir: 'public',
  server: {
    url: 'https://portalservices.digital',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#0b1d3a',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: false,
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#0b1d3a',
      iosSpinnerStyle: 'small',
      spinnerColor: '#22d3ee',
      showSpinner: false,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0b1d3a',
      overlaysWebView: false,
    },
    Camera: {
      // Permissions strings are duplicated in Info.plist for the Apple review
      // but kept here as a single source of truth for the config.
    },
    Geolocation: {},
  },
};

export default config;
