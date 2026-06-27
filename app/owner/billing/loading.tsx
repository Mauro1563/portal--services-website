/**
 * Skeleton for /owner/billing. Stat header + invoice/transaction list.
 */
export default function BillingLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2">
          <Bar w="w-28" />
          <Bar w="w-44" h="h-6" />
        </div>

        {/* KPI strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <Bar w="w-12" />
              <Bar w="w-20" h="h-7" />
            </Card>
          ))}
        </div>

        {/* Invoice rows */}
        <ul className="mt-5 space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3"
            >
              <span className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
              </div>
              <Bar w="w-16" h="h-6" />
            </li>
          ))}
        </ul>
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
    <div className="space-y-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      {children}
    </div>
  );
}
