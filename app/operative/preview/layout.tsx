import { DemoTopBar } from '@/components/preview/DemoTopBar';

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
