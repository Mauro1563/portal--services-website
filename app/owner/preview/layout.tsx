import { DemoTopBar } from '@/components/preview/DemoTopBar';

export default function OwnerPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoTopBar portal="owner" />
      {children}
    </>
  );
}
