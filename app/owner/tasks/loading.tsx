/**
 * Skeleton for /owner/tasks. The real page runs an auth check plus a
 * filtered tasks query with joins (property, cleaner, client) — the
 * blank-screen wait used to feel like 600-1200ms on cold nav.
 */
export default function TasksLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        {/* Header */}
        <div className="space-y-2">
          <Bar w="w-32" />
          <Bar w="w-56" h="h-6" />
        </div>

        {/* Filter chips row */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Bar key={i} w="w-20" h="h-8" />
          ))}
        </div>

        {/* Task rows */}
        <ul className="mt-5 space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3"
            >
              <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
              </div>
              <Bar w="w-14" h="h-6" />
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
