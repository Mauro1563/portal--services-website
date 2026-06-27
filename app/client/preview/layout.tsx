import { DemoTopBar } from '@/components/preview/DemoTopBar';

export default function ClientPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoTopBar portal="client" />
      {children}
    </>
  );
}
