/**
 * Skeleton for /operative. Streamed by Next while the cleaner row, tasks
 * query and unread-chat count resolve in parallel. Mirrors the agenda
 * layout (header, earnings strip, hero card, timeline) so the screen
 * doesn't visually jump when data arrives.
 */
export default function OperativeLoading() {
  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-5">
        {/* Agenda header */}
        <div className="space-y-2">
          <Bar w="w-24" />
          <Bar w="w-56" h="h-7" />
          <Bar w="w-32" />
        </div>

        {/* Earnings strip */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <Card key={i}>
              <Bar w="w-12" />
              <Bar w="w-20" h="h-6" />
            </Card>
          ))}
        </div>

        {/* Hero "next stop" */}
        <Card className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <Bar w="w-24" />
            <Bar w="w-10" h="h-4" />
          </div>
          <Bar w="w-3/4" h="h-5" />
          <Bar w="w-2/3" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Bar w="w-full" h="h-10" />
            <Bar w="w-full" h="h-10" />
          </div>
          <Bar w="w-full" h="h-12" />
        </Card>

        {/* Agenda timeline */}
        <div className="mt-6 space-y-3">
          <Bar w="w-32" />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-surface-2 bg-surface-0 px-3 py-3"
            >
              <span className="h-9 w-12 shrink-0 animate-pulse rounded-lg bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Bar({ w, h = 'h-3' }: { w: string; h?: string }) {
  return (
    <div className={`${h} ${w} animate-pulse rounded-md bg-slate-200/70`} />
  );
}

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`space-y-2.5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
