/**
 * Skeleton for /owner. Streamed by Next.js while the dashboard's parallel
 * Supabase queries (tasks today, upcoming, ratings, properties, cleaners…)
 * are still resolving. Designed to roughly mirror the final layout so the
 * page doesn't visually "jump" when the data lands.
 */
export default function OwnerLoading() {
  return (
    <div className="min-h-screen bg-surface-1">
      <main className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-7">
        {/* Greeting / heading */}
        <div className="space-y-2">
          <Bar w="w-40" />
          <Bar w="w-72" h="h-7" />
        </div>

        {/* KPI grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <Bar w="w-12" />
              <Bar w="w-16" h="h-8" />
              <Bar w="w-20" />
            </Card>
          ))}
        </div>

        {/* "Hoy" + "Próximas" sections */}
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i}>
              <Bar w="w-32" />
              {[0, 1, 2].map((j) => (
                <div key={j} className="mt-3 flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-slate-200/70" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Bar w="w-3/4" />
                    <Bar w="w-1/2" />
                  </div>
                </div>
              ))}
            </Card>
          ))}
        </div>

        {/* Bottom rows */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <Bar w="w-24" />
              <Bar w="w-full" />
              <Bar w="w-2/3" />
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
    <div className="space-y-2.5 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
      {children}
    </div>
  );
}
