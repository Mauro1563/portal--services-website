import { DemoTopBar } from '@/components/preview/DemoTopBar';

export const metadata = {
  title: 'Demo · Cleaner',
  robots: { index: false, follow: false },
};

export default function OperativePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoTopBar portal="cleaner" />
      {children}
    </>
  );
}
