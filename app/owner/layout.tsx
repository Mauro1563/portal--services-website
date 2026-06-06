/**
 * Owner-portal layout: switches the document to the light theme.
 *
 * The inline script runs synchronously before paint, so users never see a
 * flash of dark theme on owner pages. We don't touch <html> from a server
 * component (Next would warn about prop hydration mismatches), so we let the
 * script flip it.
 */
import '../hqx.css';
import '../hqx-perf.css';

const setLightThemeScript = `try {
  document.documentElement.setAttribute('data-theme','light');
} catch (_) {}`;

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: setLightThemeScript }} />
      {children}
    </>
  );
}
