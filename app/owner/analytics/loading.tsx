/**
 * Skeleton for /owner/analytics. Heavy aggregations plus chart bundles
 * — show stat cards + a chart-shaped placeholder so the layout is stable
 * the moment the real page renders.
 */
export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2">
          <Bar w="w-28" />
          <Bar w="w-48" h="h-6" />
        </div>

        {/* KPI cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <Bar w="w-12" />
              <Bar w="w-16" h="h-8" />
              <Bar w="w-20" />
            </Card>
          ))}
        </div>

        {/* Chart blocks */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <Bar w="w-32" />
              <div className="h-44 w-full animate-pulse rounded-xl bg-slate-100" />
            </Card>
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
      {children}
    </div>
  );
}
