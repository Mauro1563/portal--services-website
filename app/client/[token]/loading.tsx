/**
 * Skeleton for /client/[token]. Streamed by Next while the clients
 * lookup, owner context, and 5 page queries resolve. Without this the
 * portal showed a blank screen for the full 600-1500ms of parallel work.
 */
export default function ClientLoading() {
  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-5">
        {/* Greeting */}
        <div className="space-y-2">
          <Bar w="w-24" />
          <Bar w="w-56" h="h-7" />
          <Bar w="w-72" />
        </div>

        {/* Primary CTA */}
        <div className="mt-5 h-20 w-full animate-pulse rounded-2xl bg-slate-200/70" />

        {/* Quick stats row */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-100"
            >
              <span className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-12" />
                <Bar w="w-8" h="h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Service catalog row */}
        <div className="mt-6 space-y-3">
          <Bar w="w-32" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        </div>

        {/* Featured cleaners */}
        <div className="mt-6 space-y-3">
          <Bar w="w-32" />
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 w-36 shrink-0 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        </div>

        {/* Next visit card */}
        <Card className="mt-6">
          <Bar w="w-32" />
          <Bar w="w-40" h="h-5" />
          <Bar w="w-2/3" />
        </Card>
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
      className={`space-y-2.5 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}
