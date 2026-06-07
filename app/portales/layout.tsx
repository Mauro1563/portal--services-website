import '../hqx.css';
import '../hqx-perf.css';

const setLightThemeScript = `try {
  document.documentElement.setAttribute('data-theme','light');
} catch (_) {}`;

export default function PortalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: setLightThemeScript }} />
      {children}
    </>
  );
}
