import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Production-grade Capacitor config tuned for an "app-store premium" feel.
 * The shell loads portalservices.digital live so every Vercel deploy reaches
 * users instantly; the native bits below cover what the web can't do alone.
 */
const config: CapacitorConfig = {
  appId: 'com.portalservices.digital',
  appName: 'Portal Services',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    url: 'https://portalservices.digital',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    // Edge-to-edge layout — the web app handles safe-area insets via CSS env().
    contentInset: 'always',
    backgroundColor: '#0b1d3a',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: false,
    scrollEnabled: true,
    // Disable the bounce overscroll so the webview feels like a fixed app
    // instead of a webpage. Pages with their own scroll containers handle
    // momentum scrolling natively.
    handleApplicationNotifications: true,
    // Show a translucent webview while React Server Components stream so we
    // don't flash a white square between routes.
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      // Keep the splash up just long enough for the first paint of the
      // homepage. Hide via JS once the bridge initializes.
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#0b1d3a',
      iosSpinnerStyle: 'small',
      spinnerColor: '#22d3ee',
      showSpinner: true,
      splashImmersive: true,
      splashFullScreen: true,
    },
    StatusBar: {
      // Solid navy bar matching the header — no light-text-on-light issues.
      style: 'LIGHT',
      backgroundColor: '#0b1d3a',
      overlaysWebView: false,
    },
    Keyboard: {
      // Native-style keyboard: the webview resizes (instead of scrolling under)
      // and inputs stay visible. iOS shows the standard accessory bar.
      resize: 'native',
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
    Haptics: {},
    Camera: {},
    Geolocation: {},
    Share: {},
  },
};

export default config;
