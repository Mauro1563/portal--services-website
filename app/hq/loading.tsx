/**
 * Skeleton for /hq. Streamed by Next.js while the HQ dashboard's many
 * parallel admin-client queries (leads, owners, cleaners, properties,
 * tasks, photos, check-ins) resolve. Roughly mirrors the final layout
 * so the page doesn't visually "jump".
 */
export default function HQLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      <main className="px-6 py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <Bar w="w-32" />
          <Bar w="w-60" h="h-7" />
        </div>

        {/* KPI grid — 6 cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Bar w="w-10" />
              <Bar w="w-16" h="h-8" />
              <Bar w="w-12" />
            </Card>
          ))}
        </div>

        {/* Pending leads + funnel */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card>
            <Bar w="w-44" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mt-3 flex items-center gap-3">
                <span className="h-10 w-10 shrink-0 rounded-full bg-slate-200/70" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Bar w="w-3/4" />
                  <Bar w="w-1/2" />
                </div>
                <Bar w="w-20" h="h-8" />
              </div>
            ))}
          </Card>
          <Card>
            <Bar w="w-28" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mt-2 flex items-center justify-between">
                <Bar w="w-20" />
                <Bar w="w-8" />
              </div>
            ))}
          </Card>
        </div>

        {/* Cleaners + check-ins + photos */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Bar w="w-28" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Bar key={j} w="w-full" />
              ))}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function Bar({ w, h = 'h-3' }: { w: string; h?: string }) {
  return (
    <div className={`${h} ${w} animate-pulse rounded-md bg-slate-200/70`} />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2.5 rounded-2xl bg-paper p-5 ring-1 ring-line">
      {children}
    </div>
  );
}
